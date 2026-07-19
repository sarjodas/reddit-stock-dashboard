import React from 'react';
import { Rocket, TrendingUp, ShieldAlert, Sparkles, ArrowUpRight, Zap, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../services/stockApi';

export default function EmergingGems({ stocks, onSelectTicker, currencyMode, fxRate }) {
  const gems = stocks.filter(s => s.isEmergingGem || s.longTermScore >= 75 || s.mentionChange24h >= 40).slice(0, 3);

  if (gems.length === 0) return null;

  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)', color: '#f59e0b' }}>
            <Rocket size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Emerging High-Value Future Stocks <Sparkles size={16} color="#f59e0b" />
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              High-growth disrupters with surging discussion velocity & solid conviction
            </p>
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '16px'
      }}>
        {gems.map(stock => (
          <div
            key={stock.symbol}
            className="glass-panel"
            style={{
              padding: '20px',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'var(--transition-normal)'
            }}
            onClick={() => onSelectTicker(stock)}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>
                  ${stock.symbol}
                </span>
                <span className="badge badge-exchange">{stock.exchange}</span>
                <span className={`badge ${stock.riskModel.badgeClass}`}>
                  {stock.riskModel.icon} {stock.riskModel.tier} ({stock.riskModel.riskScore})
                </span>
              </div>
              <span className="badge badge-bullish">
                <TrendingUp size={12} /> {stock.bullishRatio}% Bull
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0' }}>{stock.name}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stock.sector}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {formatCurrency(stock.price, currencyMode, fxRate)}
                </span>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: stock.change24h >= 0 ? '#10b981' : '#ef4444' }}>
                  {stock.change24h >= 0 ? `+${stock.change24h}%` : `${stock.change24h}%`}
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.25)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 12px',
              fontSize: '0.78rem',
              marginBottom: '14px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '6px', color: '#38bdf8' }}>
                <Zap size={14} style={{ minWidth: '14px', marginTop: '2px' }} />
                <span><strong>Upside Catalyst:</strong> {stock.catalyst || stock.gemReason}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', color: '#fbbf24' }}>
                <ShieldAlert size={14} style={{ minWidth: '14px', marginTop: '2px' }} />
                <span><strong>Downside Risk Factor:</strong> {stock.downsideRisk}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-color)', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', gap: '12px', color: 'var(--text-secondary)' }}>
                <span><strong>P/E:</strong> {stock.peRatio > 0 ? stock.peRatio : 'N/A'}</span>
                <span><strong>P/B:</strong> {stock.pbRatio}</span>
                <span><strong>Cap:</strong> {stock.marketCap}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 700 }}>
                View Analysis <ArrowUpRight size={14} />
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
