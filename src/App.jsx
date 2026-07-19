import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MetricsOverview from './components/MetricsOverview';
import SubredditFilter from './components/SubredditFilter';
import EmergingGems from './components/EmergingGems';
import TickerLeaderboard from './components/TickerLeaderboard';
import AnalyticsCharts from './components/AnalyticsCharts';
import StockNewsFeed from './components/StockNewsFeed';
import PostsFeed from './components/PostsFeed';
import TickerModal from './components/TickerModal';
import SettingsModal from './components/SettingsModal';
import { Flame, BarChart2, Newspaper, MessageSquare, Sparkles } from 'lucide-react';

import { fetchSubredditPosts, SUBREDDITS } from './services/redditApi';
import { compileStockAnalytics, fetchUSDEURRate, fetchFinnhubQuote, DEFAULT_USD_EUR_RATE } from './services/stockApi';

export default function App() {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [selectedSubreddits, setSelectedSubreddits] = useState(SUBREDDITS.map(s => s.id));
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // FX Currency State
  const [currencyMode, setCurrencyMode] = useState('DUAL');
  const [fxRate, setFxRate] = useState(DEFAULT_USD_EUR_RATE);

  const [selectedTickerModal, setSelectedTickerModal] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('reddit_ticker_watchlist');
    return saved ? JSON.parse(saved) : ['NVDA', 'TSLA', 'PLTR'];
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('reddit_ticker_settings');
    const defaultSettings = {
      apiMode: 'custom',
      redditClientId: '',
      redditClientSecret: '',
      finnhubApiKey: '***REMOVED***', // Pre-filled active Finnhub key!
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
      const rate = await fetchUSDEURRate();
      setFxRate(rate);

      const fetchedPosts = await fetchSubredditPosts(selectedSubreddits);
      setPosts(fetchedPosts);

      const compiled = compileStockAnalytics(fetchedPosts, settings.finnhubApiKey);

      // Live Finnhub Quote Updates for Top Tickers if Finnhub Key is provided
      if (settings.finnhubApiKey) {
        const topSymbols = compiled.slice(0, 5).map(s => s.symbol);
        const quotePromises = topSymbols.map(sym => fetchFinnhubQuote(sym, settings.finnhubApiKey));
        const quotes = await Promise.all(quotePromises);

        quotes.forEach((q, idx) => {
          if (q && compiled[idx]) {
            compiled[idx].price = q.price;
            compiled[idx].change24h = q.change24h;
          }
        });
      }

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

  const filteredStocks = stocks.filter(stock => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return stock.symbol.toLowerCase().includes(q) || stock.name.toLowerCase().includes(q) || stock.sector.toLowerCase().includes(q);
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
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
            Finnhub Key: <strong style={{ color: '#10b981' }}>Active 🟢</strong>
          </div>
        </div>

        {/* Tab 1: Leaderboard, Emerging Gems & Metrics */}
        {activeTab === 'leaderboard' && (
          <>
            {/* Subreddit Filter Buttons */}
            <SubredditFilter
              selectedSubreddits={selectedSubreddits}
              onToggleSubreddit={handleToggleSubreddit}
              onSelectAll={handleSelectAllSubreddits}
            />

            {/* Top Metrics Overview Banner */}
            <MetricsOverview stocks={stocks} totalPostsCount={posts.length} />

            {/* Emerging Gems Spotlight */}
            <EmergingGems
              stocks={stocks}
              onSelectTicker={(s) => setSelectedTickerModal(s)}
              currencyMode={currencyMode}
              fxRate={fxRate}
            />

            {/* Main Stock Leaderboard */}
            <TickerLeaderboard
              stocks={filteredStocks}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              onSelectTicker={(s) => setSelectedTickerModal(s)}
              currencyMode={currencyMode}
              fxRate={fxRate}
            />
          </>
        )}

        {/* Tab 2: Visual Analytics & Risk Matrix */}
        {activeTab === 'analytics' && (
          <AnalyticsCharts stocks={stocks} />
        )}

        {/* Tab 3: News & Live Reddit Threads */}
        {activeTab === 'news' && (
          <>
            <StockNewsFeed stocks={stocks} />
            <PostsFeed posts={posts} selectedSubreddits={selectedSubreddits} />
          </>
        )}

      </main>

      {/* Deep-Dive Ticker Detail Modal */}
      {selectedTickerModal && (
        <TickerModal
          stock={selectedTickerModal}
          onClose={() => setSelectedTickerModal(null)}
          currencyMode={currencyMode}
          fxRate={fxRate}
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
