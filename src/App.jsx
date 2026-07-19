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
import PasscodeGuard from './components/PasscodeGuard';

import { fetchSubredditPosts, SUBREDDITS } from './services/redditApi';
import { compileStockAnalytics, fetchUSDEURRate, DEFAULT_USD_EUR_RATE } from './services/stockApi';

export default function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [selectedSubreddits, setSelectedSubreddits] = useState(SUBREDDITS.map(s => s.id));
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // FX Currency State
  const [currencyMode, setCurrencyMode] = useState('DUAL'); // 'DUAL', 'USD', 'EUR'
  const [fxRate, setFxRate] = useState(DEFAULT_USD_EUR_RATE);

  const [selectedTickerModal, setSelectedTickerModal] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('reddit_ticker_watchlist');
    return saved ? JSON.parse(saved) : ['NVDA', 'TSLA', 'PLTR'];
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('reddit_ticker_settings');
    return saved ? JSON.parse(saved) : {
      apiMode: 'public',
      redditClientId: '',
      redditClientSecret: '',
      finnhubApiKey: '',
      passcode: '1234',
      refreshInterval: 60
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
      // Fetch live FX rate
      const rate = await fetchUSDEURRate();
      setFxRate(rate);

      // Fetch Reddit posts & compile stocks
      const fetchedPosts = await fetchSubredditPosts(selectedSubreddits);
      setPosts(fetchedPosts);

      const compiled = compileStockAnalytics(fetchedPosts);
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
  }, [selectedSubreddits, settings.refreshInterval]);

  const filteredStocks = stocks.filter(stock => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return stock.symbol.toLowerCase().includes(q) || stock.name.toLowerCase().includes(q) || stock.sector.toLowerCase().includes(q);
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      
      {/* Passcode Lock Guard */}
      <PasscodeGuard
        isLocked={isLocked}
        onUnlock={() => setIsLocked(false)}
        savedPasscode={settings.passcode}
      />

      {!isLocked && (
        <>
          <Header
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onRefresh={loadData}
            isLoading={isLoading}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onLock={() => setIsLocked(true)}
            lastUpdated={lastUpdated}
            currencyMode={currencyMode}
            onChangeCurrency={setCurrencyMode}
          />

          <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 20px 60px' }}>
            
            {/* Top Metrics Banner */}
            <MetricsOverview stocks={stocks} totalPostsCount={posts.length} />

            {/* Subreddit Filter Buttons */}
            <SubredditFilter
              selectedSubreddits={selectedSubreddits}
              onToggleSubreddit={handleToggleSubreddit}
              onSelectAll={handleSelectAllSubreddits}
            />

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

            {/* Live Financial News Stream */}
            <StockNewsFeed stocks={stocks} />

            {/* Visual Analytics & Charts Suite */}
            <AnalyticsCharts stocks={stocks} />

            {/* Live Reddit Discussion Posts Reader */}
            <PostsFeed posts={posts} selectedSubreddits={selectedSubreddits} />

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

          {/* API & Security Settings Modal */}
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            settings={settings}
            onSaveSettings={handleSaveSettings}
          />
        </>
      )}

    </div>
  );
}
