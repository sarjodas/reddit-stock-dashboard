import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MetricsOverview from './components/MetricsOverview';
import EmergingGems from './components/EmergingGems';
import TickerLeaderboard from './components/TickerLeaderboard';
import AnalyticsCharts from './components/AnalyticsCharts';
import StockNewsFeed from './components/StockNewsFeed';
import EtfRadar from './components/EtfRadar';
import TickerModal from './components/TickerModal';
import SettingsModal from './components/SettingsModal';
import { Flame, BarChart2, Newspaper, ShieldCheck, Globe } from 'lucide-react';

import { compileTradestieAnalytics, fetchUSDEURRate, fetchLiveYahooQuote, fetchLiveStockNews, DEFAULT_USD_EUR_RATE, DEFAULT_USD_INR_RATE, MASTER_STOCKS_DATABASE } from './services/stockApi';
import { fetchDynamicStockInfo } from './services/dynamicStockFetcher';
import { fetchTechnicalIndicators } from './services/twelveDataApi';
import { fetchTradestieSentiment } from './services/tradestieApi';


export default function App() {
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [brokerFilter, setBrokerFilter] = useState('all'); // 'all', 'Scalable', 'Trading 212', 'Revolut'
  const [searchTerm, setSearchTerm] = useState('');
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
    return saved ? JSON.parse(saved) : {
      refreshInterval: 10,
      finnhubApiKey: '', // User must configure this in settings
      twelveDataApiKey: '', // User must configure this in settings
      marketFilter: 'all'
    };
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


  const loadData = async () => {
    setIsLoading(true);
    try {
      const rates = await fetchUSDEURRate();
      setFxRates(rates);

      const fetchedTradestie = await fetchTradestieSentiment();

      // Extract unique tickers from posts to dynamically fetch unknown ones
      const uniqueTickers = new Set(fetchedTradestie.map(t => t.ticker));
      
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

      const compiled = compileTradestieAnalytics(fetchedTradestie, dynamicCacheUpdates);

      // Apply live regularMarketPrice quotes
      const liveQuotePromises = compiled.map(s => fetchLiveYahooQuote(s.symbol));
      const liveQuotes = await Promise.all(liveQuotePromises);

      liveQuotes.forEach((q, idx) => {
        if (q && compiled[idx]) {
          compiled[idx].price = q.price;
          compiled[idx].change24h = q.change24h;
        }
      });

      // Fetch live news from Finnhub for each stock (top 8 to stay within rate limits)
      const topSymbols = compiled.slice(0, 8);
      const newsPromises = topSymbols.map(s => fetchLiveStockNews(s.symbol, settings.finnhubApiKey));
      const newsResults = await Promise.all(newsPromises);
      newsResults.forEach((news, idx) => {
        if (news && compiled[idx]) {
          compiled[idx].newsFeed = news;
        }
      });

      // Fetch technical indicators (Twelve Data)
      if (settings.twelveDataApiKey) {
        const technicalsPromises = topSymbols.map(s => fetchTechnicalIndicators(s.symbol, settings.twelveDataApiKey));
        const technicalsResults = await Promise.all(technicalsPromises);
        technicalsResults.forEach((tech, idx) => {
          if (tech && compiled[idx]) {
            compiled[idx].technicals = tech;
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
  }, [settings.refreshInterval, settings.finnhubApiKey, settings.twelveDataApiKey]);

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

  const redditPoweredStocks = filteredStocks.filter(s => s.country && s.country.includes('USA'));
  const globalStocks = filteredStocks.filter(s => {
    const vs = s.valueSignal || {};
    return vs.grahamPasses || vs.buffettPasses || vs.isTech;
  });

  const matchingTickerSymbols = new Set(filteredStocks.map(s => s.symbol.toLowerCase()));



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
              onClick={() => setActiveTab('global')}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'global' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
                color: activeTab === 'global' ? '#fff' : 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: activeTab === 'global' ? '0 4px 12px rgba(2, 132, 199, 0.3)' : 'none',
                transition: 'var(--transition-normal)'
              }}
            >
              <Globe size={16} color={activeTab === 'global' ? '#fff' : 'var(--text-muted)'} /> 🌍 Global Markets
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
              <Newspaper size={16} color={activeTab === 'news' ? '#fff' : 'var(--text-muted)'} /> 📰 Impact News
            </button>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', paddingRight: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {brokerFilter !== 'all' && (
              <span className="badge badge-short-term" style={{ fontSize: '0.72rem' }}>
                Broker: {brokerFilter} ({filteredStocks.length})
              </span>
            )}
            {settings.finnhubApiKey ? (
              <>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                Finnhub Key: <strong style={{ color: '#10b981' }}>Active 🟢</strong>
              </>
            ) : (
              <>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }}></span>
                Finnhub Key: <strong style={{ color: '#ef4444' }}>Missing 🔴</strong>
              </>
            )}
            {settings.twelveDataApiKey ? (
              <>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', marginLeft: '6px' }}></span>
                Twelve Data Key: <strong style={{ color: '#10b981' }}>Active 🟢</strong>
              </>
            ) : (
              <>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', marginLeft: '6px' }}></span>
                Twelve Data Key: <strong style={{ color: '#ef4444' }}>Missing 🔴</strong>
              </>
            )}
          </div>
        </div>

        {/* Tab 1: Leaderboard, Emerging Gems & Metrics */}
        {activeTab === 'leaderboard' && (
          <>
            {/* Top Metrics Overview Banner */}
            <MetricsOverview stocks={redditPoweredStocks} />

            {/* Emerging Gems Spotlight */}
            <EmergingGems
              stocks={redditPoweredStocks}
              onSelectTicker={(s) => setSelectedTickerModal(s)}
              currencyMode={currencyMode}
              fxRate={fxRates}
            />

            {/* Main Stock Leaderboard */}
            <TickerLeaderboard
              stocks={redditPoweredStocks}
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

        {/* Global Markets Tab */}
        {activeTab === 'global' && (
          <TickerLeaderboard
            stocks={globalStocks}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onSelectTicker={(s) => setSelectedTickerModal(s)}
            currencyMode={currencyMode}
            fxRate={fxRates}
            brokerFilter={brokerFilter}
            onChangeBroker={setBrokerFilter}
            isGlobal={true}
          />
        )}

        {/* Tab 2: Best Performing ETFs & ETCs Risk Radar */}
        {activeTab === 'etfs' && (
          <EtfRadar currencyMode={currencyMode} fxRate={fxRates} />
        )}

        {/* Tab 3: Visual Analytics & Risk Matrix */}
        {activeTab === 'analytics' && (
          <AnalyticsCharts stocks={filteredStocks} />
        )}

        {/* Tab 4: News */}
        {activeTab === 'news' && (
          <>
            <StockNewsFeed stocks={filteredStocks} />
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
          twelveDataApiKey={settings.twelveDataApiKey}
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
