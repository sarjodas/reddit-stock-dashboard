import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MetricsOverview from './components/MetricsOverview';
import SubredditFilter from './components/SubredditFilter';
import EmergingGems from './components/EmergingGems';
import TickerLeaderboard from './components/TickerLeaderboard';
import AnalyticsCharts from './components/AnalyticsCharts';
import StockNewsFeed from './components/StockNewsFeed';
import PostsFeed from './components/PostsFeed';
import EtfRadar from './components/EtfRadar';
import TickerModal from './components/TickerModal';
import SettingsModal from './components/SettingsModal';
import { Flame, BarChart2, Newspaper, MessageSquare, Sparkles, ShieldCheck } from 'lucide-react';

import { fetchSubredditPosts, SUBREDDITS } from './services/redditApi';
import { compileStockAnalytics, fetchUSDEURRate, fetchFinnhubQuote, fetchLiveYahooQuote, DEFAULT_USD_EUR_RATE, DEFAULT_USD_INR_RATE, MASTER_STOCKS_DATABASE } from './services/stockApi';
import { fetchDynamicStockInfo } from './services/dynamicStockFetcher';

export default function App() {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [selectedSubreddits, setSelectedSubreddits] = useState(SUBREDDITS.map(s => s.id));
  const [brokerFilter, setBrokerFilter] = useState('all'); // 'all', 'Scalable', 'Trading 212', 'Revolut'
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // FX Currency State (USD, EUR, INR)
  const [currencyMode, setCurrencyMode] = useState('DUAL');
  const [fxRates, setFxRates] = useState({ eur: DEFAULT_USD_EUR_RATE, inr: DEFAULT_USD_INR_RATE });

  const [selectedTickerModal, setSelectedTickerModal] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('reddit_ticker_watchlist');
    return saved ? JSON.parse(saved) : ['NVDA', 'TSLA', 'PLTR', 'RELIANCE'];
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('reddit_ticker_settings');
    const defaultSettings = {
      apiMode: 'custom',
      redditClientId: '',
      redditClientSecret: '',
      finnhubApiKey: '***REMOVED***',
      refreshInterval: 5
    };
    if (!saved) return defaultSettings;
    const parsed = JSON.parse(saved);
    return { ...defaultSettings, ...parsed, finnhubApiKey: parsed.finnhubApiKey || '***REMOVED***' };
  });

  const handleToggleWatchlist = (symbol) => {
    let updated;
    if (watchlist.includes(symbol)) {
      updated = watchlist.filter(s => s !== symbol);
    } else {
      updated = [...watchlist, symbol];
    }
    setWatchlist(updated);
    localStorage.setItem('reddit_ticker_watchlist', JSON.stringify(updated));
  };

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('reddit_ticker_settings', JSON.stringify(newSettings));
  };

  const handleChangeRefreshInterval = (newInterval) => {
    const updatedSettings = { ...settings, refreshInterval: newInterval };
    setSettings(updatedSettings);
    localStorage.setItem('reddit_ticker_settings', JSON.stringify(updatedSettings));
  };

  const handleToggleSubreddit = (subId) => {
    if (selectedSubreddits.includes(subId)) {
      if (selectedSubreddits.length === 1) return;
      setSelectedSubreddits(selectedSubreddits.filter(s => s !== subId));
    } else {
      setSelectedSubreddits([...selectedSubreddits, subId]);
    }
  };

  const handleSelectAllSubreddits = () => {
    if (selectedSubreddits.length === SUBREDDITS.length) {
      setSelectedSubreddits(['wallstreetbets']);
    } else {
      setSelectedSubreddits(SUBREDDITS.map(s => s.id));
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const rates = await fetchUSDEURRate();
      setFxRates(rates);

      const fetchedPosts = await fetchSubredditPosts(selectedSubreddits);
      setPosts(fetchedPosts);

      // Extract unique tickers from posts to dynamically fetch unknown ones
      const uniqueTickers = new Set();
      fetchedPosts.forEach(p => p.tickers.forEach(t => uniqueTickers.add(t)));
      
      const unknownTickers = [...uniqueTickers].filter(t => !MASTER_STOCKS_DATABASE[t]);
      
      const dynamicCacheUpdates = {};
      if (unknownTickers.length > 0) {
        // Fetch missing tickers dynamically in parallel
        const dynamicPromises = unknownTickers.map(t => fetchDynamicStockInfo(t, settings.finnhubApiKey));
        const dynamicResults = await Promise.all(dynamicPromises);
        unknownTickers.forEach((t, i) => {
          if (dynamicResults[i]) {
            dynamicCacheUpdates[t] = dynamicResults[i];
          }
        });
      }

      const compiled = compileStockAnalytics(fetchedPosts, settings.finnhubApiKey, dynamicCacheUpdates);

      // Apply live regularMarketPrice quotes
      const liveQuotePromises = compiled.map(s => fetchLiveYahooQuote(s.symbol));
      const liveQuotes = await Promise.all(liveQuotePromises);

      liveQuotes.forEach((q, idx) => {
        if (q && compiled[idx]) {
          compiled[idx].price = q.price;
          compiled[idx].change24h = q.change24h;
        }
      });

      setStocks(compiled);
      setLastUpdated(Date.now());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    if (settings.refreshInterval > 0) {
      const interval = setInterval(() => {
        loadData();
      }, settings.refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [selectedSubreddits, settings.refreshInterval, settings.finnhubApiKey]);

  // Robust Multi-Filter (Search Term + Broker App Compatibility)
  const cleanQuery = searchTerm.replace(/[\$\#]/g, '').trim().toLowerCase();

  const filteredStocks = stocks.filter(stock => {
    // 1. Broker App Filter
    if (brokerFilter !== 'all' && (!stock.brokers || !stock.brokers.includes(brokerFilter))) {
      return false;
    }

    // 2. Search Query Filter
    if (!cleanQuery) return true;
    
    const symbolMatch = stock.symbol.toLowerCase().includes(cleanQuery);
    const nameMatch = stock.name.toLowerCase().includes(cleanQuery);
    const sectorMatch = stock.sector.toLowerCase().includes(cleanQuery);
    const exchangeMatch = stock.exchange && stock.exchange.toLowerCase().includes(cleanQuery);
    const countryMatch = stock.country && stock.country.toLowerCase().includes(cleanQuery);
    const catalystMatch = stock.catalyst && stock.catalyst.toLowerCase().includes(cleanQuery);
    const gemReasonMatch = stock.gemReason && stock.gemReason.toLowerCase().includes(cleanQuery);

    return symbolMatch || nameMatch || sectorMatch || exchangeMatch || countryMatch || catalystMatch || gemReasonMatch;
  });

  const matchingTickerSymbols = new Set(filteredStocks.map(s => s.symbol.toLowerCase()));

  const filteredPosts = posts.filter(post => {
    if (!cleanQuery) return true;

    const titleMatch = post.title.toLowerCase().includes(cleanQuery);
    const subMatch = post.subreddit.toLowerCase().includes(cleanQuery);
    const tickerMatch = post.tickers.some(t => {
      const tLower = t.toLowerCase();
      return tLower.includes(cleanQuery) || matchingTickerSymbols.has(tLower);
    });

    return titleMatch || subMatch || tickerMatch;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onRefresh={loadData}
        isLoading={isLoading}
        onOpenSettings={() => setIsSettingsOpen(true)}
        lastUpdated={lastUpdated}
        currencyMode={currencyMode}
        onChangeCurrency={setCurrencyMode}
        refreshInterval={settings.refreshInterval}
        onChangeRefreshInterval={handleChangeRefreshInterval}
      />

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px 20px 60px' }}>
        
        {/* View Navigation Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          padding: '6px',
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          backdropFilter: 'blur(16px)',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('leaderboard')}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'leaderboard' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
                color: activeTab === 'leaderboard' ? '#fff' : 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: activeTab === 'leaderboard' ? '0 4px 12px rgba(2, 132, 199, 0.3)' : 'none',
                transition: 'var(--transition-normal)'
              }}
            >
              <Flame size={16} color={activeTab === 'leaderboard' ? '#fff' : 'var(--text-muted)'} /> 🔥 Tickers & Emerging Gems
            </button>

            <button
              onClick={() => setActiveTab('etfs')}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'etfs' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
                color: activeTab === 'etfs' ? '#fff' : 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: activeTab === 'etfs' ? '0 4px 12px rgba(2, 132, 199, 0.3)' : 'none',
                transition: 'var(--transition-normal)'
              }}
            >
              <ShieldCheck size={16} color={activeTab === 'etfs' ? '#fff' : 'var(--text-muted)'} /> 🛡️ ETFs & ETCs Risk Radar
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'analytics' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
                color: activeTab === 'analytics' ? '#fff' : 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: activeTab === 'analytics' ? '0 4px 12px rgba(2, 132, 199, 0.3)' : 'none',
                transition: 'var(--transition-normal)'
              }}
            >
              <BarChart2 size={16} color={activeTab === 'analytics' ? '#fff' : 'var(--text-muted)'} /> 📊 Visual Analytics & Risk Matrix
            </button>

            <button
              onClick={() => setActiveTab('news')}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'news' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
                color: activeTab === 'news' ? '#fff' : 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: activeTab === 'news' ? '0 4px 12px rgba(2, 132, 199, 0.3)' : 'none',
                transition: 'var(--transition-normal)'
              }}
            >
              <Newspaper size={16} color={activeTab === 'news' ? '#fff' : 'var(--text-muted)'} /> 📰 Impact News & Reddit Discussions
            </button>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', paddingRight: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {brokerFilter !== 'all' && (
              <span className="badge badge-short-term" style={{ fontSize: '0.72rem' }}>
                Broker: {brokerFilter} ({filteredStocks.length})
              </span>
            )}
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
            Finnhub Key: <strong style={{ color: '#10b981' }}>Active 🟢</strong>
          </div>
        </div>

        {/* Tab 1: Leaderboard, Emerging Gems & Metrics */}
        {activeTab === 'leaderboard' && (
          <>
            {/* Subreddit Stream & Global Broker App Filter */}
            <SubredditFilter
              selectedSubreddits={selectedSubreddits}
              onToggleSubreddit={handleToggleSubreddit}
              onSelectAll={handleSelectAllSubreddits}
              brokerFilter={brokerFilter}
              onChangeBroker={setBrokerFilter}
            />

            {/* Top Metrics Overview Banner */}
            <MetricsOverview stocks={filteredStocks} totalPostsCount={posts.length} selectedSubreddits={selectedSubreddits} />

            {/* Emerging Gems Spotlight */}
            <EmergingGems
              stocks={filteredStocks}
              onSelectTicker={(s) => setSelectedTickerModal(s)}
              currencyMode={currencyMode}
              fxRate={fxRates}
            />

            {/* Main Stock Leaderboard */}
            <TickerLeaderboard
              stocks={filteredStocks}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              onSelectTicker={(s) => setSelectedTickerModal(s)}
              currencyMode={currencyMode}
              fxRate={fxRates}
              brokerFilter={brokerFilter}
              onChangeBroker={setBrokerFilter}
            />
          </>
        )}

        {/* Tab 2: Best Performing ETFs & ETCs Risk Radar */}
        {activeTab === 'etfs' && (
          <EtfRadar currencyMode={currencyMode} fxRate={fxRates} />
        )}

        {/* Tab 3: Visual Analytics & Risk Matrix */}
        {activeTab === 'analytics' && (
          <AnalyticsCharts stocks={filteredStocks} />
        )}

        {/* Tab 4: News & Live Reddit Threads */}
        {activeTab === 'news' && (
          <>
            <StockNewsFeed stocks={filteredStocks} />
            <PostsFeed posts={filteredPosts} selectedSubreddits={selectedSubreddits} />
          </>
        )}

      </main>

      {/* Deep-Dive Ticker Detail Modal */}
      {selectedTickerModal && (
        <TickerModal
          stock={selectedTickerModal}
          onClose={() => setSelectedTickerModal(null)}
          currencyMode={currencyMode}
          fxRate={fxRates}
        />
      )}

      {/* API Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

    </div>
  );
}
