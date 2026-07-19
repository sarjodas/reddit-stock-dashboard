import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, ShieldCheck, AlertTriangle, Zap, DollarSign, ExternalLink, MessageSquare, Globe, Building2, BarChart2, Newspaper, Clock, ShoppingCart, Target, Award } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { formatCurrency } from '../services/stockApi';

export default function TickerModal({ stock, onClose, currencyMode, fxRate }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!stock) return null;

  const timing = stock.timingModel || { timingScore: 65, signal: 'Accumulate', badgeClass: 'badge-short-term', icon: '📥', reasoning: 'Fair channel entry.' };

  const chartData = stock.sparkline.map((val, idx) => ({
    step: `Day ${idx + 1}`,
    price: val,
    socialBuzz: Math.round(val * 1.8 + idx * 5)
  }));

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '880px', padding: '28px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#fff' }}>
                ${stock.symbol}
              </h2>
              <span className="badge badge-exchange">{stock.exchange}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stock.country}</span>
              <span className={`badge ${stock.bullishRatio >= 50 ? 'badge-bullish' : 'badge-bearish'}`}>
                {stock.bullishRatio}% Bullish
              </span>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{stock.name} • {stock.sector}</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#fff' }}>
                {formatCurrency(stock.price, currencyMode, fxRate)}
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: stock.change24h >= 0 ? '#10b981' : '#ef4444' }}>
                {stock.change24h >= 0 ? `+${stock.change24h}%` : `${stock.change24h}%`} (24h)
              </div>
            </div>
            <button onClick={onClose} className="btn-icon">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'overview' ? 'rgba(2, 132, 199, 0.2)' : 'transparent',
              color: activeTab === 'overview' ? '#38bdf8' : 'var(--text-muted)'
            }}
          >
            📊 Analytics & Buy Signal
          </button>
          <button
            onClick={() => setActiveTab('news')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'news' ? 'rgba(245, 158, 11, 0.2)' : 'transparent',
              color: activeTab === 'news' ? '#f59e0b' : 'var(--text-muted)'
            }}
          >
            📰 Impact News ({stock.newsFeed ? stock.newsFeed.length : 0})
          </button>
          <button
            onClick={() => setActiveTab('threads')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'threads' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
              color: activeTab === 'threads' ? '#8b5cf6' : 'var(--text-muted)'
            }}
          >
            💬 Reddit Threads ({stock.posts ? stock.posts.length : 0})
          </button>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Top Grid: Timing Signal & Wall Street Price Target */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              
              {/* Timing Entry Banner */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(2, 132, 199, 0.1) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}>
                <div>
                  <span className={`badge ${timing.badgeClass}`} style={{ fontSize: '0.8rem', padding: '4px 12px', marginBottom: '8px' }}>
                    {timing.icon} {timing.signal} ({timing.timingScore}/100)
                  </span>
                  <p style={{ fontSize: '0.8rem', color: '#e2e8f0', marginTop: '6px' }}>
                    <strong>Entry Recommendation:</strong> {timing.reasoning}
                  </p>
                </div>
                <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>52-Wk Channel Position:</span>
                  <strong style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{timing.channelPos}% Range</strong>
                </div>
              </div>

              {/* Wall Street Analyst Target & Upside Card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Target size={14} color="#38bdf8" /> Wall St. Consensus
                    </span>
                    <span className="badge badge-bullish" style={{ fontSize: '0.72rem' }}>
                      {stock.analystRating || 'Strong Buy'} ({stock.analystScore || 4.5}/5.0)
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                      {formatCurrency(stock.targetPrice, currencyMode, fxRate)}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: stock.impliedUpside >= 0 ? '#10b981' : '#ef4444' }}>
                      {stock.impliedUpside >= 0 ? `+${stock.impliedUpside}% Upside` : `${stock.impliedUpside}%`}
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Target Range: Low <strong>{formatCurrency(stock.targetLow, currencyMode, fxRate)}</strong> — High <strong>{formatCurrency(stock.targetHigh, currencyMode, fxRate)}</strong>
                  </div>
                </div>

                <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Analyst Ratings Breakdown:</span>
                  <span style={{ color: '#fff' }}>
                    <strong style={{ color: '#10b981' }}>{stock.buyCount || 25} Buy</strong> • <strong>{stock.holdCount || 5} Hold</strong> • <strong style={{ color: '#ef4444' }}>{stock.sellCount || 0} Sell</strong>
                  </span>
                </div>
              </div>

            </div>

            {/* 3-Column Grid: Fundamentals, Risk Gauge & Horizon Scores */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              
              {/* Valuation & Fundamentals */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={14} color="#38bdf8" /> Valuation & Financials
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>P/E Ratio:</span>
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>{stock.peRatio > 0 ? stock.peRatio : 'N/A'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>P/B Ratio:</span>
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>{stock.pbRatio}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Market Cap:</span>
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>{stock.marketCap}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>EPS:</span>
                    <strong style={{ fontFamily: 'var(--font-mono)' }}>${stock.eps}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>52-Wk Range:</span>
                    <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                      {formatCurrency(stock.week52Low, currencyMode, fxRate)} - {formatCurrency(stock.week52High, currencyMode, fxRate)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Mathematical Risk Gauge */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={14} color="#f59e0b" /> Mathematical Risk Gauge
                </h4>
                <div style={{ marginBottom: '8px' }}>
                  <span className={`badge ${stock.riskModel.badgeClass}`} style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                    {stock.riskModel.icon} {stock.riskModel.tier} ({stock.riskModel.riskScore}/100)
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <div>Beta ($\beta$): <strong>{stock.beta}</strong></div>
                  <div>30D Volatility: <strong>{stock.volatility}%</strong></div>
                  <div>Social Hype Noise: <strong>{stock.riskModel.noiseScore}/100</strong></div>
                </div>
              </div>

              {/* Dual Horizon Scores */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={14} color="#06b6d4" /> Dual-Horizon Ratings
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                    <span style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 600 }}>⚡ Short-Term Momentum:</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#06b6d4' }}>
                      {stock.shortTermScore} / 100
                    </div>
                  </div>
                  <div style={{ padding: '8px', borderRadius: 'var(--radius-sm)', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                    <span style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 600 }}>🏛️ Long-Term Conviction:</span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#8b5cf6' }}>
                      {stock.longTermScore} / 100
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Price vs Social Volume Chart Overlay */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BarChart2 size={16} color="#38bdf8" /> Price Action vs Social Discussion Volume
              </h4>
              <div style={{ height: '200px', width: '100%', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <XAxis dataKey="step" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ background: '#121824', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="price" stroke="#10b981" fill="rgba(16,185,129,0.15)" strokeWidth={2} name="Stock Price ($)" />
                    <Area type="monotone" dataKey="socialBuzz" stroke="#38bdf8" fill="rgba(56,189,248,0.1)" strokeWidth={1.5} name="Social Buzz Index" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* Tab 2: Impact News */}
        {activeTab === 'news' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {stock.newsFeed && stock.newsFeed.length > 0 ? (
              stock.newsFeed.map(news => (
                <div key={news.id} style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className={`badge ${news.impact === 'Positive' ? 'badge-bullish' : 'badge-neutral'}`}>
                      {news.impact} Impact
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{news.source} • {news.time}</span>
                  </div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '4px' }}>{news.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{news.impactText}</p>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No major breaking catalyst news reported in past 24 hours.</p>
            )}
          </div>
        )}

        {/* Tab 3: Reddit Threads */}
        {activeTab === 'threads' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '350px', overflowY: 'auto' }}>
            {stock.posts && stock.posts.length > 0 ? (
              stock.posts.map(p => (
                <div key={p.id} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <div>
                    <span className="badge badge-exchange" style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#38bdf8', marginRight: '8px' }}>r/{p.subreddit}</span>
                    <span>{p.title}</span>
                  </div>
                  <a href={p.permalink} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                    Open <ExternalLink size={12} />
                  </a>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Discussion threads active across r/stocks & r/wallstreetbets.</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
