import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Star, Zap, ShieldCheck, BarChart2, ChevronRight, Target, Sparkles, SlidersHorizontal } from 'lucide-react';
import { formatCurrency } from '../services/stockApi';

export default function TickerLeaderboard({ stocks, watchlist, onToggleWatchlist, onSelectTicker, currencyMode, fxRate }) {
  const [horizonFilter, setHorizonFilter] = useState('all');

  let filteredStocks = [...stocks];
  if (horizonFilter === 'discovery') {
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
    const width = 75;
    const height = 22;

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
      
      {/* Sleek Header & Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={20} color="#38bdf8" /> Trending Stock Leaderboard
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Subreddit volume rankings, AI sentiment, Buy/Wait entry signals & Wall St. targets ({currencyMode} Mode)
          </p>
        </div>

        {/* Clean Horizon Tabs */}
        <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.4)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '2px' }}>
          <button
            onClick={() => setHorizonFilter('all')}
            style={{
              padding: '5px 11px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.76rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: horizonFilter === 'all' ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
              color: horizonFilter === 'all' ? '#fff' : 'var(--text-muted)'
            }}
          >
            🔥 All Tickers
          </button>

          <button
            onClick={() => setHorizonFilter('discovery')}
            style={{
              padding: '5px 11px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.76rem',
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
            <Sparkles size={13} color="#f59e0b" /> 🔍 High-Risk Discovery
          </button>

          <button
            onClick={() => setHorizonFilter('buy')}
            style={{
              padding: '5px 11px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.76rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: horizonFilter === 'buy' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
              color: horizonFilter === 'buy' ? '#10b981' : 'var(--text-muted)'
            }}
          >
            🛒 Buy Dip Days
          </button>

          <button
            onClick={() => setHorizonFilter('upside')}
            style={{
              padding: '5px 11px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.76rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: horizonFilter === 'upside' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
              color: horizonFilter === 'upside' ? '#38bdf8' : 'var(--text-muted)'
            }}
          >
            🎯 Highest Upside
          </button>

          <button
            onClick={() => setHorizonFilter('short')}
            style={{
              padding: '5px 11px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.76rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: horizonFilter === 'short' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
              color: horizonFilter === 'short' ? '#06b6d4' : 'var(--text-muted)'
            }}
          >
            ⚡ Swing
          </button>

          <button
            onClick={() => setHorizonFilter('long')}
            style={{
              padding: '5px 11px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.76rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              background: horizonFilter === 'long' ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
              color: horizonFilter === 'long' ? '#8b5cf6' : 'var(--text-muted)'
            }}
          >
            🏛️ Hold
          </button>
        </div>
      </div>

      {/* Clean Table Layout */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '10px 6px' }}>Rank</th>
              <th style={{ padding: '10px 10px' }}>Ticker</th>
              <th style={{ padding: '10px 10px' }}>Price ({currencyMode})</th>
              <th style={{ padding: '10px 10px' }}>Entry Timing Signal</th>
              <th style={{ padding: '10px 10px' }}>Wall St. Target</th>
              <th style={{ padding: '10px 10px' }}>Sentiment & Risk</th>
              <th style={{ padding: '10px 10px' }}>Horizon Scores</th>
              <th style={{ padding: '10px 10px' }}>Trend</th>
              <th style={{ padding: '10px 6px', textAlign: 'right' }}>Action</th>
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
                  <td style={{ padding: '12px 6px', fontWeight: 700, color: idx < 3 ? '#f59e0b' : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    #{idx + 1}
                  </td>

                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => onToggleWatchlist(stock.symbol)}
                        style={{ background: 'none', border: 'none', color: isSaved ? '#f59e0b' : 'var(--text-muted)', cursor: 'pointer' }}
                        title={isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        <Star size={15} fill={isSaved ? '#f59e0b' : 'none'} />
                      </button>
                      <div onClick={() => onSelectTicker(stock)} style={{ cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', fontFamily: 'var(--font-mono)' }}>
                            ${stock.symbol}
                          </span>
                          <span className="badge badge-exchange" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>{stock.exchange}</span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{stock.name}</div>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                      {formatCurrency(stock.price, currencyMode, fxRate)}
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: stock.change24h >= 0 ? '#10b981' : '#ef4444' }}>
                      {stock.change24h >= 0 ? `+${stock.change24h}%` : `${stock.change24h}%`} (24h)
                    </div>
                  </td>

                  {/* Entry Timing Badge */}
                  <td style={{ padding: '12px 10px' }}>
                    <span className={`badge ${timing.badgeClass}`} style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                      {timing.icon} {timing.signal}
                    </span>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Score: {timing.timingScore}/100
                    </div>
                  </td>

                  {/* Wall St Analyst Target & Implied Upside */}
                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ fontWeight: 700, color: stock.impliedUpside >= 0 ? '#38bdf8' : '#ef4444', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                      Target: {formatCurrency(stock.targetPrice, currencyMode, fxRate)}
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: stock.impliedUpside >= 0 ? '#10b981' : '#ef4444' }}>
                      {stock.analystRating} ({stock.impliedUpside >= 0 ? `+${stock.impliedUpside}% Upside` : `${stock.impliedUpside}%`})
                    </div>
                  </td>

                  {/* Sentiment & Risk Combined */}
                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span className={`badge ${stock.bullishRatio >= 55 ? 'badge-bullish' : stock.bullishRatio <= 40 ? 'badge-bearish' : 'badge-neutral'}`} style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                        {stock.bullishRatio >= 55 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {stock.bullishRatio}% Bull ({stock.mentionCount} posts)
                      </span>
                      <span className={`badge ${stock.riskModel.badgeClass}`} style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                        {stock.riskModel.icon} {stock.riskModel.tier} ({stock.riskModel.riskScore})
                      </span>
                    </div>
                  </td>

                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span className="badge badge-short-term" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                        ⚡ Swing: {stock.shortTermScore}/100
                      </span>
                      <span className="badge badge-long-term" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                        🏛️ Hold: {stock.longTermScore}/100
                      </span>
                    </div>
                  </td>

                  <td style={{ padding: '12px 10px' }}>
                    {renderSparkline(stock.sparkline, stock.change24h >= 0)}
                  </td>

                  <td style={{ padding: '12px 6px', textAlign: 'right' }}>
                    <button
                      onClick={() => onSelectTicker(stock)}
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                    >
                      Details <ChevronRight size={13} />
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
