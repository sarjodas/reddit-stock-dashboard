import React, { useState } from 'react';
import { Flame, Star } from 'lucide-react';
import { formatCurrency } from '../services/stockApi';

const brokerColor = b =>
  b === 'Scalable'     ? { bg: 'rgba(16,185,129,0.15)',  color: '#34d399', border: 'rgba(16,185,129,0.3)' }  :
  b === 'Trading 212'  ? { bg: 'rgba(56,189,248,0.15)',  color: '#38bdf8', border: 'rgba(56,189,248,0.3)' }  :
                         { bg: 'rgba(192,132,252,0.15)', color: '#c084fc', border: 'rgba(192,132,252,0.3)' };

export default function TickerLeaderboard({ stocks, watchlist, onToggleWatchlist, onSelectTicker, currencyMode, fxRate }) {
  const [horizonFilter, setHorizonFilter] = useState('all');
  const [regionFilter,  setRegionFilter]  = useState('all');
  const [hideDeadStocks, setHideDeadStocks] = useState(true);

  let filtered = [...stocks];
  
  // Dead stock filter
  if (hideDeadStocks) {
    filtered = filtered.filter(s => !s.isDeadStock);
  }

  // Region filter
  if (regionFilter === 'europe') {
    filtered = filtered.filter(s => s.country && /Germany|Netherlands|Denmark|France|UK|Switzerland|Sweden|Europe/.test(s.country));
  } else if (regionFilter === 'india') {
    filtered = filtered.filter(s => s.country && s.country.includes('India'));
  } else if (regionFilter === 'us') {
    filtered = filtered.filter(s => s.country && s.country.includes('USA'));
  } else if (regionFilter === 'asia') {
    filtered = filtered.filter(s => s.country && /Taiwan|Japan|China|Korea|Asia/.test(s.country));
  }

  // Horizon / Value filter
  if (horizonFilter === 'short') {
    filtered.sort((a, b) => b.shortTermScore - a.shortTermScore);
  } else if (horizonFilter === 'long') {
    filtered.sort((a, b) => b.longTermScore - a.longTermScore);
  } else if (horizonFilter === 'watchlist') {
    filtered = filtered.filter(s => watchlist.includes(s.symbol));
  } else if (horizonFilter === 'discovery') {
    filtered = filtered.filter(s => s.impliedUpside >= 20 || s.isEmergingGem);
    filtered.sort((a, b) => b.impliedUpside - a.impliedUpside);
  } else if (horizonFilter === 'value') {
    // Graham / Buffett value screen
    filtered = filtered.filter(s => s.valueSignal && s.valueSignal.isValueGem);
    filtered.sort((a, b) => (b.valueSignal?.grahamScore + b.valueSignal?.buffettScore) - (a.valueSignal?.grahamScore + a.valueSignal?.buffettScore));
  }

  const emptyState = filtered.length === 0;

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>

      {/* ── Header & Filters ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={20} color="#f43f5e" /> Stock Leaderboard
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {filtered.length} stocks · Graham/Buffett value signals · Reddit sentiment
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>

          {/* Region */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.45)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            {[['all','🌐 All'],['europe','🇪🇺 EU'],['india','🇮🇳 India'],['us','🇺🇸 US'],['asia','🌏 Asia']].map(([v,l]) => (
              <button key={v} onClick={() => setRegionFilter(v)} className={`pill-btn ${regionFilter === v ? 'active' : ''}`} style={{ padding: '4px 9px', fontSize: '0.72rem' }}>{l}</button>
            ))}
          </div>

          {/* Horizon / Signal */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.45)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button onClick={() => setHorizonFilter('all')}       className={`pill-btn ${horizonFilter === 'all'       ? 'active' : ''}`} style={{ padding: '4px 9px', fontSize: '0.72rem' }}>All</button>
            <button onClick={() => setHorizonFilter('value')}     className={`pill-btn ${horizonFilter === 'value'     ? 'active-value' : ''}`} style={{ padding: '4px 9px', fontSize: '0.72rem' }}>💎 Value Screen</button>
            <button onClick={() => setHorizonFilter('discovery')} className={`pill-btn ${horizonFilter === 'discovery' ? 'active' : ''}`} style={{ padding: '4px 9px', fontSize: '0.72rem' }}>🔍 High Upside</button>
            <button onClick={() => setHorizonFilter('long')}      className={`pill-btn ${horizonFilter === 'long'      ? 'active' : ''}`} style={{ padding: '4px 9px', fontSize: '0.72rem' }}>🏛️ Long-Term</button>
            <button onClick={() => setHorizonFilter('short')}     className={`pill-btn ${horizonFilter === 'short'     ? 'active' : ''}`} style={{ padding: '4px 9px', fontSize: '0.72rem' }}>⚡ Momentum</button>
            <button onClick={() => setHorizonFilter('watchlist')} className={`pill-btn ${horizonFilter === 'watchlist' ? 'active' : ''}`} style={{ padding: '4px 9px', fontSize: '0.72rem' }}>⭐ Watchlist ({watchlist.length})</button>
          </div>

          {/* Dynamic Dead Stock Toggle */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.45)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button 
              onClick={() => setHideDeadStocks(!hideDeadStocks)} 
              className={`pill-btn ${hideDeadStocks ? 'active' : ''}`} 
              style={{ padding: '4px 9px', fontSize: '0.72rem', color: hideDeadStocks ? '#f43f5e' : 'var(--text-muted)' }}
            >
              {hideDeadStocks ? '🚫 Dead Stocks Hidden' : '💀 Show Dead Stocks'}
            </button>
          </div>

        </div>
      </div>

      {/* ── Table ── */}
      {emptyState ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔍</div>
          No stocks match the current filters.
        </div>
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem', minWidth: '900px' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '13px 14px', fontWeight: 700, width: '200px' }}>Ticker & Company</th>
                <th style={{ padding: '13px 14px', fontWeight: 700 }}>Broker Apps</th>
                <th style={{ padding: '13px 14px', fontWeight: 700 }}>Price</th>
                <th style={{ padding: '13px 14px', fontWeight: 700 }}>Value Signal</th>
                <th style={{ padding: '13px 14px', fontWeight: 700 }}>Reddit Sentiment</th>
                <th style={{ padding: '13px 14px', fontWeight: 700 }}>Scores</th>
                <th style={{ padding: '13px 14px', fontWeight: 700 }}>Target</th>
                <th style={{ padding: '13px 14px', fontWeight: 700, textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(stock => {
                const vs       = stock.valueSignal || {};
                const isWatch  = watchlist.includes(stock.symbol);
                const isPos    = stock.change24h >= 0;
                const rowClass = `leaderboard-row${vs.isValueGem ? ' value-row' : ''}`;
                const mentionSign = stock.mentionChange24h >= 0 ? '+' : '';

                return (
                  <tr
                    key={stock.symbol}
                    className={rowClass}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'var(--transition-fast)' }}
                    onClick={() => onSelectTicker(stock)}
                  >

                    {/* Ticker & Company */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={e => { e.stopPropagation(); onToggleWatchlist(stock.symbol); }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: isWatch ? '#f59e0b' : 'var(--text-muted)', padding: '2px', flexShrink: 0 }}
                        >
                          <Star size={15} fill={isWatch ? '#f59e0b' : 'none'} />
                        </button>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff', whiteSpace: 'nowrap' }}>${stock.symbol}</span>
                            <span className="badge badge-exchange" style={{ fontSize: '0.6rem', padding: '1px 5px' }}>{stock.exchange?.split('/')[0]?.trim()}</span>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                            {stock.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Broker Apps */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                        {(stock.brokers || []).map((b, i) => {
                          const c = brokerColor(b);
                          return (
                            <span key={i} className="badge" style={{ fontSize: '0.6rem', padding: '1px 5px', background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
                              {b === 'Scalable' ? '⚡' : b === 'Trading 212' ? '🌐' : '💳'} {b}
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    {/* Price */}
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>
                        {formatCurrency(stock.price, currencyMode, fxRate, stock.nativeCurrency)}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: isPos ? '#34d399' : '#fb7185', fontWeight: 600 }}>
                        {isPos ? '+' : ''}{stock.change24h}%
                      </div>
                    </td>

                    {/* Value Signal */}
                    <td style={{ padding: '12px 14px' }}>
                      {vs.valueBadge ? (
                        <span className={`badge ${vs.valueBadge.badgeClass}`} style={{ fontSize: '0.66rem', display: 'flex', whiteSpace: 'normal', lineHeight: 1.3 }}>
                          {vs.valueBadge.label}
                        </span>
                      ) : (
                        <span className="badge badge-neutral" style={{ fontSize: '0.66rem' }}>Unrated</span>
                      )}
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>P/E: {stock.peRatio > 0 ? `${stock.peRatio}x` : 'N/A'} · P/B: {stock.pbRatio}x</span>
                        {stock.technicals?.rsi && (
                          <span className="badge badge-neutral" style={{ padding: '1px 4px', fontSize: '0.6rem' }}>
                            RSI {Math.round(stock.technicals.rsi)}
                            {stock.technicals.rsi > 70 ? ' 🔴' : stock.technicals.rsi < 30 ? ' 🟢' : ''}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Reddit Sentiment */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: vs.sentimentColor || '#fbbf24' }}>
                          {vs.sentimentEmoji} {vs.sentimentLabel || `${stock.bullishRatio}% Bull`}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {stock.mentionCount} posts · {mentionSign}{stock.mentionChange24h}% · {vs.buzzTier || 'Steady'}
                      </div>
                    </td>

                    {/* Horizon Scores */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span className="badge badge-short-term" style={{ fontSize: '0.66rem', padding: '2px 6px' }}>⚡ {stock.shortTermScore}/99</span>
                        <span className="badge badge-long-term"  style={{ fontSize: '0.66rem', padding: '2px 6px' }}>🏛️ {stock.longTermScore}/99</span>
                      </div>
                    </td>

                    {/* Target */}
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: (stock.impliedUpside || 0) >= 0 ? '#34d399' : '#fb7185' }}>
                        {formatCurrency(stock.targetPrice, currencyMode, fxRate, stock.nativeCurrency)}
                      </div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: (stock.impliedUpside || 0) >= 0 ? '#34d399' : '#fb7185' }}>
                        {(stock.impliedUpside || 0) >= 0 ? '+' : ''}{stock.impliedUpside}% implied
                      </div>
                    </td>

                    {/* Action */}
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <button
                        onClick={e => { e.stopPropagation(); onSelectTicker(stock); }}
                        className="btn btn-secondary"
                        style={{ padding: '5px 10px', fontSize: '0.72rem', whiteSpace: 'nowrap' }}
                      >
                        Deep Dive
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
