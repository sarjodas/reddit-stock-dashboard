import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Star, Zap, ShieldCheck, BarChart2, ChevronRight, Target, Sparkles, AlertOctagon } from 'lucide-react';
import { formatCurrency } from '../services/stockApi';

export default function TickerLeaderboard({ stocks, watchlist, onToggleWatchlist, onSelectTicker, currencyMode, fxRate }) {
  const [horizonFilter, setHorizonFilter] = useState('all');

  let filteredStocks = [...stocks];
  if (horizonFilter === 'discovery') {
    // Discovery Plays: High Implied Upside (>25%) + Elevated Risk Rating (>=45) OR High Swing Velocity
    filteredStocks = filteredStocks.filter(s => 
      s.impliedUpside >= 20 || s.riskModel.riskScore >= 45 || s.isEmergingGem
    ).sort((a, b) => (b.impliedUpside * (b.riskModel.riskScore / 50)) - (a.impliedUpside * (a.riskModel.riskScore / 50)));
  } else if (horizonFilter === 'short') {
    filteredStocks.sort((a, b) => b.shortTermScore - a.shortTermScore);
  } else if (horizonFilter === 'long') {
    filteredStocks.sort((a, b) => b.longTermScore - a.longTermScore);
  } else if (horizonFilter === 'buy') {
    filteredStocks = filteredStocks.filter(s => s.timingModel.timingScore >= 70).sort((a, b) => b.timingModel.timingScore - a.timingModel.timingScore);
  } else if (horizonFilter === 'upside') {
    filteredStocks.sort((a, b) => b.impliedUpside - a.impliedUpside);
  } else if (horizonFilter === 'value') {
    filteredStocks = filteredStocks.filter(s => s.peRatio > 0).sort((a, b) => a.peRatio - b.peRatio);
  } else {
    filteredStocks.sort((a, b) => b.mentionCount - a.mentionCount);
  }

  const renderSparkline = (points, isPositive) => {
    if (!points || points.length < 2) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 80;
    const height = 24;

    const coords = points.map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    const strokeColor = isPositive ? '#10b981' : '#ef4444';

    return (
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={coords}
        />
      </svg>
    );
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
      
      {/* Header & Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={20} color="#38bdf8" /> Top Hot Stock Tickers Leaderboard
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Ranked by Reddit mention volume, sentiment, Buy/Wait entry signals & Wall St. targets ({currencyMode} Mode)
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.3)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '4px' }}>
          <button
            onClick={() => setHorizonFilter('all')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: horizonFilter === 'all' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              color: horizonFilter === 'all' ? '#fff' : 'var(--text-muted)'
            }}
          >
            🔥 All Hot Tickers
          </button>

          {/* NEW: High-Risk Discovery Tab */}
          <button
            onClick={() => setHorizonFilter('discovery')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: horizonFilter === 'discovery' ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(245, 158, 11, 0.25) 100%)' : 'transparent',
              color: horizonFilter === 'discovery' ? '#f59e0b' : 'var(--text-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Sparkles size={14} color="#f59e0b" /> 🔍 High-Risk, High-Upside Discovery
          </button>

          <button
            onClick={() => setHorizonFilter('buy')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: horizonFilter === 'buy' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
              color: horizonFilter === 'buy' ? '#10b981' : 'var(--text-muted)'
            }}
          >
            🛒 Best Buy Dip Days
          </button>
          <button
            onClick={() => setHorizonFilter('upside')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: horizonFilter === 'upside' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
              color: horizonFilter === 'upside' ? '#38bdf8' : 'var(--text-muted)'
            }}
          >
            🎯 Highest Target Upside
          </button>
          <button
            onClick={() => setHorizonFilter('short')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: horizonFilter === 'short' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
              color: horizonFilter === 'short' ? '#06b6d4' : 'var(--text-muted)'
            }}
          >
            ⚡ Short-Term Swing
          </button>
          <button
            onClick={() => setHorizonFilter('long')}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: horizonFilter === 'long' ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
              color: horizonFilter === 'long' ? '#8b5cf6' : 'var(--text-muted)'
            }}
          >
            🏛️ Long-Term Conviction
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px 8px' }}>Rank</th>
              <th style={{ padding: '12px 12px' }}>Ticker & Company</th>
              <th style={{ padding: '12px 12px' }}>Entry Timing Signal</th>
              <th style={{ padding: '12px 12px' }}>Wall St. Target & Upside</th>
              <th style={{ padding: '12px 12px' }}>24h Buzz</th>
              <th style={{ padding: '12px 12px' }}>Sentiment</th>
              <th style={{ padding: '12px 12px' }}>Horizon Scores</th>
              <th style={{ padding: '12px 12px' }}>Risk Level</th>
              <th style={{ padding: '12px 12px' }}>Price ({currencyMode})</th>
              <th style={{ padding: '12px 12px' }}>Trend</th>
              <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock, idx) => {
              const isSaved = watchlist.includes(stock.symbol);
              const timing = stock.timingModel || { signal: 'Accumulate', badgeClass: 'badge-short-term', icon: '📥', timingScore: 65 };

              return (
                <tr
                  key={stock.symbol}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    background: horizonFilter === 'discovery' ? 'rgba(245, 158, 11, 0.02)' : 'transparent',
                    transition: 'var(--transition-fast)'
                  }}
                  className="leaderboard-row"
                >
                  <td style={{ padding: '14px 8px', fontWeight: 700, color: idx < 3 ? '#f59e0b' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    #{idx + 1}
                  </td>

                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => onToggleWatchlist(stock.symbol)}
                        style={{ background: 'none', border: 'none', color: isSaved ? '#f59e0b' : 'var(--text-muted)', cursor: 'pointer' }}
                        title={isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        <Star size={16} fill={isSaved ? '#f59e0b' : 'none'} />
                      </button>
                      <div onClick={() => onSelectTicker(stock)} style={{ cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 800, fontSize: '1rem', color: '#fff', fontFamily: 'var(--font-mono)' }}>
                            ${stock.symbol}
                          </span>
                          {horizonFilter === 'discovery' && (
                            <span className="badge badge-risk-high" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                              ⚡ High Upside Discovery
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{stock.name}</div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: '14px 12px' }}>
                    <span className={`badge ${timing.badgeClass}`} style={{ fontSize: '0.75rem' }}>
                      {timing.icon} {timing.signal}
                    </span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Score: {timing.timingScore}/100
                    </div>
                  </td>

                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ fontWeight: 700, color: stock.impliedUpside >= 0 ? '#38bdf8' : '#ef4444', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      Target: {formatCurrency(stock.targetPrice, currencyMode, fxRate)}
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: stock.impliedUpside >= 0 ? '#10b981' : '#ef4444' }}>
                      {stock.analystRating} ({stock.impliedUpside >= 0 ? `+${stock.impliedUpside}% Upside` : `${stock.impliedUpside}%`})
                    </div>
                  </td>

                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{stock.mentionCount} posts</div>
                    <div style={{ fontSize: '0.72rem', color: stock.mentionChange24h >= 0 ? '#10b981' : '#ef4444' }}>
                      {stock.mentionChange24h >= 0 ? `+${stock.mentionChange24h}%` : `${stock.mentionChange24h}%`} (24h)
                    </div>
                  </td>

                  <td style={{ padding: '14px 12px' }}>
                    <span className={`badge ${stock.bullishRatio >= 55 ? 'badge-bullish' : stock.bullishRatio <= 40 ? 'badge-bearish' : 'badge-neutral'}`}>
                      {stock.bullishRatio >= 55 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {stock.bullishRatio}% Bull
                    </span>
                  </td>

                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span className="badge badge-short-term" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                        ⚡ Swing: {stock.shortTermScore}/100
                      </span>
                      <span className="badge badge-long-term" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                        🏛️ Hold: {stock.longTermScore}/100
                      </span>
                    </div>
                  </td>

                  <td style={{ padding: '14px 12px' }}>
                    <span className={`badge ${stock.riskModel.badgeClass}`} style={{ fontSize: '0.7rem' }}>
                      {stock.riskModel.icon} {stock.riskModel.tier} ({stock.riskModel.riskScore})
                    </span>
                  </td>

                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                      {formatCurrency(stock.price, currencyMode, fxRate)}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: stock.change24h >= 0 ? '#10b981' : '#ef4444' }}>
                      {stock.change24h >= 0 ? `+${stock.change24h}%` : `${stock.change24h}%`}
                    </div>
                  </td>

                  <td style={{ padding: '14px 12px' }}>
                    {renderSparkline(stock.sparkline, stock.change24h >= 0)}
                  </td>

                  <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                    <button
                      onClick={() => onSelectTicker(stock)}
                      className="btn btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      Details <ChevronRight size={14} />
                    </button>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
