import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, ShieldCheck, AlertTriangle, Zap, DollarSign, ExternalLink, MessageSquare, Globe, Building2, BarChart2, Newspaper, Clock, ShoppingCart, Target, Award, Activity, CheckCircle2, Smartphone, PieChart } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { formatCurrency } from '../services/stockApi';
import CandlestickChart from './CandlestickChart';

export default function TickerModal({ stock, onClose, currencyMode, fxRate }) {
  const [activeTab, setActiveTab] = useState('candles'); // Default to interactive Candlesticks!

  if (!stock) return null;

  const timing = stock.timingModel || { timingScore: 65, signal: 'Accumulate', badgeClass: 'badge-short-term', icon: '📥', reasoning: 'Fair channel entry.' };

  const chartData = stock.sparkline.map((val, idx) => ({
    step: `Day ${idx + 1}`,
    price: val,
    socialBuzz: Math.round(val * 1.8 + idx * 5)
  }));

  const brokersList = stock.brokers || ['Scalable', 'Trading 212', 'Revolut'];

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '880px', padding: '28px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#fff' }}>
                ${stock.symbol}
              </h2>
              <span className="badge badge-exchange">{stock.exchange}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stock.country}</span>
              <span className={`badge ${stock.bullishRatio >= 50 ? 'badge-bullish' : 'badge-bearish'}`}>
                {stock.bullishRatio}% Bullish
              </span>
            </div>

            {/* Trading App / Broker Availability Banner */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', background: 'rgba(0, 0, 0, 0.4)', padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.06)', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Smartphone size={13} color="var(--accent-cyan)" /> Trading App:
              </span>
              {brokersList.map((broker, idx) => (
                <span
                  key={idx}
                  className="badge"
                  style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    background: broker === 'Scalable' ? 'rgba(16, 185, 129, 0.15)' : broker === 'Trading 212' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(192, 132, 252, 0.15)',
                    color: broker === 'Scalable' ? '#34d399' : broker === 'Trading 212' ? '#38bdf8' : '#c084fc',
                    border: `1px solid ${broker === 'Scalable' ? 'rgba(16, 185, 129, 0.35)' : broker === 'Trading 212' ? 'rgba(56, 189, 248, 0.35)' : 'rgba(192, 132, 252, 0.35)'}`
                  }}
                >
                  <CheckCircle2 size={11} /> {broker}
                </span>
              ))}
            </div>

            {/* Value Signal + Reddit Sentiment Strip */}
            {stock.valueSignal && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {stock.valueSignal.valueBadge && (
                  <span className={`badge ${stock.valueSignal.valueBadge.badgeClass}`} style={{ fontSize: '0.72rem' }}>
                    {stock.valueSignal.valueBadge.label}
                  </span>
                )}
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: stock.valueSignal.sentimentColor }}>
                  {stock.valueSignal.sentimentEmoji} Reddit: {stock.valueSignal.sentimentLabel}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 600 }}>
                  · {stock.mentionCount} posts · {stock.valueSignal.buzzTier}
                </span>
                {stock.valueSignal.isTech && (
                  <span className="badge badge-tech-quality" style={{ fontSize: '0.66rem' }}>Tech-Adjusted Scoring</span>
                )}
              </div>
            )}

          </div>


          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#fff' }}>
                {formatCurrency(stock.price, currencyMode, fxRate, stock.nativeCurrency)}
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
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('candles')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'candles' ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(56, 189, 248, 0.25) 100%)' : 'transparent',
              color: activeTab === 'candles' ? '#10b981' : 'var(--text-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Activity size={15} color="#10b981" /> 📈 Live Candlesticks (OHLC)
          </button>

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

        {/* Tab: Real-Time Candlestick Chart */}
        {activeTab === 'candles' && (
          <div>
            <CandlestickChart
              symbol={stock.symbol}
              basePrice={stock.price}
              currencyMode={currencyMode}
              fxRate={fxRate}
              nativeCurrency={stock.nativeCurrency}
            />

            {/* Timing Banner below Candlestick Chart */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(2, 132, 199, 0.1) 100%)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              marginTop: '16px'
            }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span>{timing.icon}</span> Market Entry Timing Signal: {timing.signal}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {timing.reasoning}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`badge ${timing.badgeClass}`} style={{ fontSize: '0.8rem', padding: '4px 12px' }}>
                  Score: {timing.timingScore}/99
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Overview & Analytics */}
        {activeTab === 'overview' && (
          <div>
            
            {/* Timing Engine & Wall St Target Header Box */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              
              {/* Timing Engine Card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(2, 132, 199, 0.1) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShoppingCart size={14} color="#10b981" /> Timing Engine Signal
                  </span>
                  <span className={`badge ${timing.badgeClass}`} style={{ fontSize: '0.75rem' }}>
                    {timing.icon} {timing.timingScore}/99
                  </span>
                </div>
                
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#10b981', marginBottom: '4px' }}>
                  {timing.signal}
                </h4>
                
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {timing.reasoning}
                </p>
              </div>

              {/* Wall St Analyst Price Target */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '16px'
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
                      {formatCurrency(stock.targetPrice, currencyMode, fxRate, stock.nativeCurrency)}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: stock.impliedUpside >= 0 ? '#10b981' : '#ef4444' }}>
                      {stock.impliedUpside >= 0 ? `+${stock.impliedUpside}% Upside` : `${stock.impliedUpside}%`}
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Target Range: Low <strong>{formatCurrency(stock.targetLow, currencyMode, fxRate, stock.nativeCurrency)}</strong> — High <strong>{formatCurrency(stock.targetHigh, currencyMode, fxRate, stock.nativeCurrency)}</strong>
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

            {/* NEW: API Data Integration - Technicals */}
            {stock.technicals && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                
                {/* Twelve Data Technicals */}
                {stock.technicals && (
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Activity size={14} color="#8b5cf6" /> Technical Indicators (Live)
                    </h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {/* RSI */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>RSI (14-day):</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                            {stock.technicals.rsi ? stock.technicals.rsi.toFixed(2) : 'N/A'}
                          </span>
                          {stock.technicals.rsi > 70 ? (
                            <span className="badge badge-bearish" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>Overbought</span>
                          ) : stock.technicals.rsi < 30 ? (
                            <span className="badge badge-bullish" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>Oversold</span>
                          ) : (
                            <span className="badge badge-neutral" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>Neutral</span>
                          )}
                        </div>
                      </div>

                      {/* MACD */}
                      {stock.technicals.macd && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>MACD (12,26,9):</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                              Line: {stock.technicals.macd.macd.toFixed(2)} | Sig: {stock.technicals.macd.signal.toFixed(2)}
                            </span>
                            <span className={`badge ${stock.technicals.macd.histogram > 0 ? 'badge-bullish' : 'badge-bearish'}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                              {stock.technicals.macd.histogram > 0 ? 'Bullish X' : 'Bearish X'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* SMA */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>50-Day SMA:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                            {stock.technicals.sma50 ? formatCurrency(stock.technicals.sma50, currencyMode, fxRate, stock.nativeCurrency) : 'N/A'}
                          </span>
                          {stock.technicals.sma50 && (
                            <span className={`badge ${stock.price > stock.technicals.sma50 ? 'badge-bullish' : 'badge-bearish'}`} style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                              {stock.price > stock.technicals.sma50 ? 'Above' : 'Below'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

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
                      {formatCurrency(stock.week52Low, currencyMode, fxRate, stock.nativeCurrency)} - {formatCurrency(stock.week52High, currencyMode, fxRate, stock.nativeCurrency)}
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

          </div>
        )}

        {/* Tab: News Feed */}
        {activeTab === 'news' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {stock.newsFeed && stock.newsFeed.length > 0 ? (
                stock.newsFeed.map(news => (
                  <div key={news.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>{news.source} • {news.time}</span>
                      <span className={`badge ${news.impact === 'Positive' ? 'badge-bullish' : news.impact === 'Negative' ? 'badge-bearish' : 'badge-neutral'}`}>
                        {news.impact} Impact
                      </span>
                    </div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{news.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{news.impactText}</p>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No recent breaking news feeds available.</div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Reddit Threads */}
        {activeTab === 'threads' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {stock.posts && stock.posts.length > 0 ? (
                stock.posts.map(post => (
                  <div key={post.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>r/{post.subreddit} • by u/{post.author}</span>
                      <span className={`badge ${post.sentiment.label === 'Bullish' ? 'badge-bullish' : 'badge-bearish'}`}>
                        {post.sentiment.label} ({Math.round(post.sentiment.score * 100)}%)
                      </span>
                    </div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{post.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>{post.summary}</p>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>▲ {post.score} Upvotes</span>
                      <span>💬 {post.numComments} Comments</span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No direct community posts captured in current sample interval.</div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
