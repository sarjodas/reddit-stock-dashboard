import React from 'react';
import { Flame, RefreshCw, Search, Sliders, Zap } from 'lucide-react';

export default function Header({
  searchTerm,
  onSearchChange,
  onRefresh,
  isLoading,
  onOpenSettings,
  lastUpdated,
  currencyMode,
  onChangeCurrency,
  refreshInterval,
  onChangeRefreshInterval
}) {
  return (
    <header style={{
      background: 'rgba(7, 10, 17, 0.88)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '12px 24px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        
        {/* Brand Logo & Live Pulse Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #0284c7 0%, #10b981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.35)'
          }}>
            <Flame size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                RedditTicker Pulse
              </h1>
              <span className="badge badge-bullish" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                <span className="pulse-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }}></span> Live AI
              </span>
            </div>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Subreddit Stock Sentiment & Real-Time Analytics
            </p>
          </div>
        </div>

        {/* Search Input with Focus Ergonomics */}
        <div style={{ flex: '1', maxWidth: '320px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search symbol (e.g. NVDA, RELIANCE)..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 14px 9px 40px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              outline: 'none',
              transition: 'var(--transition-fast)'
            }}
          />
        </div>

        {/* Unified Control Group (Fitts's Law Target Ergonomics) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          {/* Auto-Refresh Speed Segmented Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'rgba(0, 0, 0, 0.45)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0 6px', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Zap size={12} color="#f59e0b" /> Speed:
            </span>
            <button
              onClick={() => onChangeRefreshInterval(5)}
              className={`pill-btn ${refreshInterval === 5 ? 'active' : ''}`}
              style={{ padding: '3px 8px', fontSize: '0.72rem' }}
              title="Refresh every 5 seconds"
            >
              ⚡ 5s
            </button>
            <button
              onClick={() => onChangeRefreshInterval(10)}
              className={`pill-btn ${refreshInterval === 10 ? 'active' : ''}`}
              style={{ padding: '3px 8px', fontSize: '0.72rem' }}
              title="Refresh every 10 seconds"
            >
              🚀 10s
            </button>
            <button
              onClick={() => onChangeRefreshInterval(30)}
              className={`pill-btn ${refreshInterval === 30 ? 'active' : ''}`}
              style={{ padding: '3px 8px', fontSize: '0.72rem' }}
              title="Refresh every 30 seconds"
            >
              30s
            </button>
            <button
              onClick={() => onChangeRefreshInterval(0)}
              className={`pill-btn ${refreshInterval === 0 ? 'active' : ''}`}
              style={{ padding: '3px 8px', fontSize: '0.72rem' }}
              title="Pause auto refresh"
            >
              Off
            </button>
          </div>

          {/* Currency Switcher Segmented Control (USD / EUR / INR / Dual) */}
          <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.45)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => onChangeCurrency('USD')}
              className={`pill-btn ${currencyMode === 'USD' ? 'active' : ''}`}
              style={{ padding: '3px 8px', fontSize: '0.72rem' }}
            >
              USD ($)
            </button>
            <button
              onClick={() => onChangeCurrency('EUR')}
              className={`pill-btn ${currencyMode === 'EUR' ? 'active' : ''}`}
              style={{ padding: '3px 8px', fontSize: '0.72rem' }}
            >
              EUR (€)
            </button>

            <button
              onClick={() => onChangeCurrency('DUAL')}
              className={`pill-btn ${currencyMode === 'DUAL' ? 'active' : ''}`}
              style={{ padding: '3px 8px', fontSize: '0.72rem' }}
            >
              Dual
            </button>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {lastUpdated ? `${new Date(lastUpdated).toLocaleTimeString()}` : 'Live'}
          </div>

          <button
            onClick={onRefresh}
            className="btn btn-secondary"
            disabled={isLoading}
            style={{ padding: '7px 12px', fontSize: '0.78rem' }}
          >
            <RefreshCw size={14} className={isLoading ? 'spin-anim' : ''} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>

          <button onClick={onOpenSettings} className="btn-icon" title="API Settings">
            <Sliders size={18} />
          </button>
        </div>

      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
}
