import React from 'react';
import { Rocket, TrendingUp, ShieldAlert, Sparkles, ArrowUpRight, Zap, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../services/stockApi';

export default function EmergingGems({ stocks, onSelectTicker, currencyMode, fxRate }) {
  const gems = stocks.filter(s => s.isEmergingGem || s.longTermScore >= 75 || s.mentionChange24h >= 40).slice(0, 3);

  if (gems.length === 0) return null;

  return (
    <div style={{ marginBottom: '32px' }}>
      
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            padding: '10px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.22) 0%, rgba(139, 92, 246, 0.22) 100%)',
            color: '#f59e0b',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.2)'
          }}>
            <Rocket size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Emerging High-Value Future Stocks <Sparkles size={16} color="#f59e0b" />
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              High-conviction market disrupters backed by surging community velocity & robust fundamentals
            </p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '20px'
      }}>
        {gems.map(stock => (
          <div
            key={stock.symbol}
            className="glass-panel"
            style={{
              padding: '22px',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              cursor: 'pointer',
              transition: 'var(--transition-normal)',
              background: 'linear-gradient(145deg, rgba(13, 20, 36, 0.85) 0%, rgba(20, 29, 48, 0.7) 100%)'
            }}
            onClick={() => onSelectTicker(stock)}
          >
            <div>
              
              {/* Header Badges & Ticker */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                      ${stock.symbol}
                    </span>
                    <span className="badge badge-exchange" style={{ fontSize: '0.66rem', padding: '2px 7px' }}>
                      {stock.exchange}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f1f5f9', marginTop: '3px', lineHeight: 1.3 }}>
                    {stock.name}
                  </h4>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{stock.sector}</p>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span className={`badge ${stock.bullishRatio >= 65 ? 'badge-bullish' : 'badge-neutral'}`} style={{ fontSize: '0.7rem' }}>
                    <TrendingUp size={12} /> {stock.bullishRatio}% Bull
                  </span>
                  <span className={`badge ${stock.riskModel.badgeClass}`} style={{ fontSize: '0.68rem', padding: '2px 7px' }}>
                    {stock.riskModel.icon} {stock.riskModel.tier} ({stock.riskModel.riskScore})
                  </span>
                </div>
              </div>

              {/* Price & Target Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                padding: '10px 14px',
                background: 'rgba(0, 0, 0, 0.45)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '14px',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Market Price</div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff', fontFamily: 'var(--font-mono)' }}>
                    {formatCurrency(stock.price, currencyMode, fxRate, stock.nativeCurrency)}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>24h Change</div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: stock.change24h >= 0 ? '#34d399' : '#fb7185', fontFamily: 'var(--font-mono)' }}>
                    {stock.change24h >= 0 ? `+${stock.change24h}%` : `${stock.change24h}%`}
                  </div>
                </div>
              </div>

              {/* Catalyst & Risk Box */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                fontSize: '0.78rem',
                marginBottom: '16px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#38bdf8', lineHeight: 1.4 }}>
                  <Zap size={14} style={{ minWidth: '14px', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: '#fff' }}>Upside Catalyst:</strong> {stock.catalyst || stock.gemReason}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#fbbf24', lineHeight: 1.4 }}>
                  <ShieldAlert size={14} style={{ minWidth: '14px', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: '#fff' }}>Risk Factor:</strong> {stock.downsideRisk}
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Stats & Deep Dive Action */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-color)',
              fontSize: '0.76rem',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', gap: '10px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                <span>P/E: <strong style={{ color: '#fff' }}>{stock.peRatio > 0 ? `${stock.peRatio}x` : 'N/A'}</strong></span>
                <span>Cap: <strong style={{ color: '#fff' }}>{stock.marketCap}</strong></span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 800 }}>
                Analyze <ArrowUpRight size={14} />
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
