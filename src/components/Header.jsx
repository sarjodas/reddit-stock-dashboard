import React from 'react';
import { Flame, RefreshCw, Search, Sliders, TrendingUp, Zap } from 'lucide-react';

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
      background: 'rgba(10, 13, 20, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '14px 24px'
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
        
        {/* Brand Logo */}
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
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
          }}>
            <Flame size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                RedditTicker Pulse
              </h1>
              <span className="badge badge-bullish" style={{ fontSize: '0.65rem' }}>
                <TrendingUp size={12} /> Live AI Sentiment
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Subreddit Stock Sentiment & Multi-Currency Analytics
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div style={{ flex: '1', maxWidth: '300px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search ticker (NVDA, TSLA)..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 38px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'var(--transition-fast)'
            }}
          />
        </div>

        {/* Controls: Speed, Currency & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          
          {/* High-Speed Auto-Refresh Rate Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0, 0, 0, 0.4)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0 4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Zap size={12} color="#f59e0b" /> Auto-Refresh:
            </span>
            <button
              onClick={() => onChangeRefreshInterval(5)}
              style={{
                padding: '3px 7px',
                fontSize: '0.72rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                background: refreshInterval === 5 ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
                color: refreshInterval === 5 ? '#f59e0b' : 'var(--text-muted)'
              }}
              title="Refresh every 5 seconds"
            >
              ⚡ 5s
            </button>
            <button
              onClick={() => onChangeRefreshInterval(10)}
              style={{
                padding: '3px 7px',
                fontSize: '0.72rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                background: refreshInterval === 10 ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
                color: refreshInterval === 10 ? '#10b981' : 'var(--text-muted)'
              }}
              title="Refresh every 10 seconds"
            >
              🚀 10s
            </button>
            <button
              onClick={() => onChangeRefreshInterval(30)}
              style={{
                padding: '3px 7px',
                fontSize: '0.72rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                background: refreshInterval === 30 ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                color: refreshInterval === 30 ? '#38bdf8' : 'var(--text-muted)'
              }}
              title="Refresh every 30 seconds"
            >
              30s
            </button>
            <button
              onClick={() => onChangeRefreshInterval(0)}
              style={{
                padding: '3px 7px',
                fontSize: '0.72rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                background: refreshInterval === 0 ? 'rgba(239, 68, 68, 0.25)' : 'transparent',
                color: refreshInterval === 0 ? '#ef4444' : 'var(--text-muted)'
              }}
              title="Turn off auto refresh"
            >
              Off
            </button>
          </div>

          {/* Currency Toggle */}
          <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.4)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => onChangeCurrency('USD')}
              style={{
                padding: '4px 8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                background: currencyMode === 'USD' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                color: currencyMode === 'USD' ? '#38bdf8' : 'var(--text-muted)'
              }}
            >
              USD ($)
            </button>
            <button
              onClick={() => onChangeCurrency('EUR')}
              style={{
                padding: '4px 8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                background: currencyMode === 'EUR' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
                color: currencyMode === 'EUR' ? '#10b981' : 'var(--text-muted)'
              }}
            >
              EUR (€)
            </button>
            <button
              onClick={() => onChangeCurrency('DUAL')}
              style={{
                padding: '4px 8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                background: currencyMode === 'DUAL' ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
                color: currencyMode === 'DUAL' ? '#8b5cf6' : 'var(--text-muted)'
              }}
            >
              Dual ($/€)
            </button>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }}></span>
            {lastUpdated ? `${new Date(lastUpdated).toLocaleTimeString()}` : 'Live'}
          </div>

          <button
            onClick={onRefresh}
            className="btn btn-secondary"
            disabled={isLoading}
            style={{ padding: '8px 12px', fontSize: '0.78rem' }}
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
