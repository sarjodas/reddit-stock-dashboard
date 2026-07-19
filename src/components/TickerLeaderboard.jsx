import React, { useState } from 'react';
import { Flame, Star, ShieldAlert, TrendingUp, Compass, Globe, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../services/stockApi';

export default function TickerLeaderboard({ stocks, watchlist, onToggleWatchlist, onSelectTicker, currencyMode, fxRate }) {
  const [horizonFilter, setHorizonFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [brokerFilter, setBrokerFilter] = useState('all');

  let filteredStocks = [...stocks];

  // Broker Platform Filter Logic
  if (brokerFilter !== 'all') {
    filteredStocks = filteredStocks.filter(s => s.brokers && s.brokers.includes(brokerFilter));
  }

  // Region Filter Logic
  if (regionFilter === 'europe') {
    filteredStocks = filteredStocks.filter(s => s.country && (s.country.includes('Europe') || s.country.includes('Germany') || s.country.includes('Netherlands') || s.country.includes('Denmark') || s.country.includes('France') || s.country.includes('UK') || s.country.includes('Switzerland') || s.country.includes('Sweden')));
  } else if (regionFilter === 'india') {
    filteredStocks = filteredStocks.filter(s => s.country && s.country.includes('India'));
  } else if (regionFilter === 'us') {
    filteredStocks = filteredStocks.filter(s => s.country && s.country.includes('USA'));
  } else if (regionFilter === 'asia') {
    filteredStocks = filteredStocks.filter(s => s.country && (s.country.includes('Asia') || s.country.includes('Taiwan') || s.country.includes('Japan') || s.country.includes('China') || s.country.includes('India')));
  }

  // Horizon & Discovery Filter Logic
  if (horizonFilter === 'short') {
    filteredStocks.sort((a, b) => b.shortTermScore - a.shortTermScore);
  } else if (horizonFilter === 'long') {
    filteredStocks.sort((a, b) => b.longTermScore - a.longTermScore);
  } else if (horizonFilter === 'watchlist') {
    filteredStocks = filteredStocks.filter(s => watchlist.includes(s.symbol));
  } else if (horizonFilter === 'discovery') {
    filteredStocks = filteredStocks.filter(s => s.impliedUpside >= 25 || s.isEmergingGem);
    filteredStocks.sort((a, b) => b.impliedUpside - a.impliedUpside);
  }

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
      
      {/* Header & Dual Filter Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={20} color="#f43f5e" /> Stock Leaderboard & Broker Platform Availability
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Filter by European trading apps: Scalable Capital, Trading 212, and Revolut
          </p>
        </div>

        {/* Region & Broker Segmented Filters */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Broker Filter Pills */}
          <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.45)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setBrokerFilter('all')}
              className={`pill-btn ${brokerFilter === 'all' ? 'active' : ''}`}
              style={{ padding: '4px 10px', fontSize: '0.74rem' }}
            >
              All Brokers
            </button>
            <button
              onClick={() => setBrokerFilter('Scalable')}
              className={`pill-btn ${brokerFilter === 'Scalable' ? 'active' : ''}`}
              style={{ padding: '4px 10px', fontSize: '0.74rem' }}
            >
              ⚡ Scalable
            </button>
            <button
              onClick={() => setBrokerFilter('Trading 212')}
              className={`pill-btn ${brokerFilter === 'Trading 212' ? 'active' : ''}`}
              style={{ padding: '4px 10px', fontSize: '0.74rem' }}
            >
              🌐 Trading 212
            </button>
            <button
              onClick={() => setBrokerFilter('Revolut')}
              className={`pill-btn ${brokerFilter === 'Revolut' ? 'active' : ''}`}
              style={{ padding: '4px 10px', fontSize: '0.74rem' }}
            >
              💳 Revolut
            </button>
          </div>

          {/* Region Filter Pills */}
          <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.45)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setRegionFilter('all')}
              className={`pill-btn ${regionFilter === 'all' ? 'active' : ''}`}
              style={{ padding: '4px 10px', fontSize: '0.74rem' }}
            >
              🌐 Global
            </button>
            <button
              onClick={() => setRegionFilter('europe')}
              className={`pill-btn ${regionFilter === 'europe' ? 'active' : ''}`}
              style={{ padding: '4px 10px', fontSize: '0.74rem' }}
            >
              🇪🇺 Europe & UK
            </button>
            <button
              onClick={() => setRegionFilter('india')}
              className={`pill-btn ${regionFilter === 'india' ? 'active' : ''}`}
              style={{ padding: '4px 10px', fontSize: '0.74rem' }}
            >
              🇮🇳 India
            </button>
            <button
              onClick={() => setRegionFilter('us')}
              className={`pill-btn ${regionFilter === 'us' ? 'active' : ''}`}
              style={{ padding: '4px 10px', fontSize: '0.74rem' }}
            >
              🇺🇸 USA
            </button>
          </div>

          {/* Horizon Pills */}
          <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.45)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setHorizonFilter('all')}
              className={`pill-btn ${horizonFilter === 'all' ? 'active' : ''}`}
              style={{ padding: '4px 10px', fontSize: '0.74rem' }}
            >
              All Tickers
            </button>
            <button
              onClick={() => setHorizonFilter('discovery')}
              className={`pill-btn ${horizonFilter === 'discovery' ? 'active' : ''}`}
              style={{ padding: '4px 10px', fontSize: '0.74rem' }}
            >
              🔍 Discovery
            </button>
            <button
              onClick={() => setHorizonFilter('watchlist')}
              className={`pill-btn ${horizonFilter === 'watchlist' ? 'active' : ''}`}
              style={{ padding: '4px 10px', fontSize: '0.74rem' }}
            >
              ⭐ Watchlist ({watchlist.length})
            </button>
          </div>

        </div>
      </div>

      {/* Table Container */}
      <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '14px 16px', fontWeight: 700 }}>Ticker & Company</th>
              <th style={{ padding: '14px 16px', fontWeight: 700 }}>Broker Apps</th>
              <th style={{ padding: '14px 16px', fontWeight: 700 }}>Market Price</th>
              <th style={{ padding: '14px 16px', fontWeight: 700 }}>Reddit Hype & Bullish %</th>
              <th style={{ padding: '14px 16px', fontWeight: 700 }}>Horizon Scores</th>
              <th style={{ padding: '14px 16px', fontWeight: 700 }}>Risk & Valuation</th>
              <th style={{ padding: '14px 16px', fontWeight: 700 }}>Wall St. Target</th>
              <th style={{ padding: '14px 16px', fontWeight: 700, textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock) => {
              const isWatch = watchlist.includes(stock.symbol);
              const isPos = stock.change24h >= 0;

              return (
                <tr
                  key={stock.symbol}
                  className="leaderboard-row"
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'var(--transition-fast)',
                    cursor: 'pointer'
                  }}
                  onClick={() => onSelectTicker(stock)}
                >
                  
                  {/* Ticker, Exchange & Country */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWatchlist(stock.symbol);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: isWatch ? '#f59e0b' : 'var(--text-muted)',
                          padding: '2px'
                        }}
                      >
                        <Star size={16} fill={isWatch ? '#f59e0b' : 'none'} />
                      </button>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>${stock.symbol}</span>
                          <span className="badge badge-exchange" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                            {stock.exchange}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>{stock.name}</span>
                          <span style={{ opacity: 0.8 }}>• {stock.country}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Broker Platforms */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {stock.brokers ? stock.brokers.map((broker, idx) => (
                        <span
                          key={idx}
                          className="badge"
                          style={{
                            fontSize: '0.64rem',
                            padding: '1px 6px',
                            background: broker === 'Scalable' ? 'rgba(16, 185, 129, 0.15)' : broker === 'Trading 212' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(192, 132, 252, 0.15)',
                            color: broker === 'Scalable' ? '#34d399' : broker === 'Trading 212' ? '#38bdf8' : '#c084fc',
                            border: `1px solid ${broker === 'Scalable' ? 'rgba(16, 185, 129, 0.3)' : broker === 'Trading 212' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(192, 132, 252, 0.3)'}`
                          }}
                        >
                          {broker}
                        </span>
                      )) : (
                        <span className="badge badge-neutral" style={{ fontSize: '0.64rem' }}>Standard Brokers</span>
                      )}
                    </div>
                  </td>

                  {/* Price & 24h Change */}
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff' }}>
                      {formatCurrency(stock.price, currencyMode, fxRate, stock.nativeCurrency)}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: isPos ? '#34d399' : '#fb7185', fontWeight: 600 }}>
                      {isPos ? '+' : ''}{stock.change24h}%
                    </div>
                  </td>

                  {/* Reddit Mentions & Sentiment */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{stock.mentionCount} posts</span>
                      <span className={`badge ${stock.bullishRatio >= 65 ? 'badge-bullish' : stock.bullishRatio >= 45 ? 'badge-neutral' : 'badge-bearish'}`} style={{ fontSize: '0.7rem' }}>
                        {stock.bullishRatio}% Bull
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      24h Spike: +{stock.mentionChange24h}%
                    </div>
                  </td>

                  {/* Horizon Scores */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span className="badge badge-short-term" style={{ fontSize: '0.7rem' }}>
                        ⚡ Short: {stock.shortTermScore}/99
                      </span>
                      <span className="badge badge-long-term" style={{ fontSize: '0.7rem' }}>
                        💎 Long: {stock.longTermScore}/99
                      </span>
                    </div>
                  </td>

                  {/* Risk Tier & P/E Ratio */}
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`badge ${stock.riskModel.badgeClass}`} style={{ fontSize: '0.72rem' }}>
                      {stock.riskModel.icon} {stock.riskModel.tier} ({stock.riskModel.riskScore})
                    </span>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                      P/E: {stock.peRatio > 0 ? `${stock.peRatio}x` : 'N/A'} • Cap: {stock.marketCap}
                    </div>
                  </td>

                  {/* Wall St Target Price */}
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ fontWeight: 700, color: stock.impliedUpside >= 0 ? '#34d399' : '#fb7185' }}>
                      {formatCurrency(stock.targetPrice, currencyMode, fxRate, stock.nativeCurrency)}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: stock.impliedUpside >= 0 ? '#34d399' : '#fb7185', fontWeight: 600 }}>
                      {stock.impliedUpside >= 0 ? '+' : ''}{stock.impliedUpside}% Implied
                    </div>
                  </td>

                  {/* Action */}
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTicker(stock);
                      }}
                      className="btn btn-secondary"
                      style={{ padding: '5px 10px', fontSize: '0.74rem' }}
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

    </div>
  );
}
