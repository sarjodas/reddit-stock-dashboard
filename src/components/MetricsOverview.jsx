import React from 'react';
import { MessageSquare, TrendingUp, Flame, Users, ShieldAlert } from 'lucide-react';

export default function MetricsOverview({ stocks }) {
  const totalMentions = stocks.reduce((acc, curr) => acc + curr.mentionCount, 0);
  const totalBullish  = stocks.reduce((acc, curr) => acc + (curr.bullishRatio * curr.mentionCount) / 100, 0);
  const avgBullishRatio = totalMentions > 0 ? Math.round((totalBullish / totalMentions) * 100) : null;

  const topTicker = stocks.length > 0 ? stocks[0] : null;

  // Value picks: stocks passing Graham or Buffett screen
  const valuePicks = stocks.filter(s => s.valueSignal && s.valueSignal.isValueGem).length;

  const sentimentLabel =
    avgBullishRatio === null  ? '—' :
    avgBullishRatio >= 70     ? '🚀 Strong Retail Greed' :
    avgBullishRatio >= 55     ? '📈 Bullish Lean' :
    avgBullishRatio >= 45     ? '😐 Neutral / Balanced' :
    avgBullishRatio >= 32     ? '📉 Bearish Lean' : '🔴 Fear & Caution';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '14px',
      marginBottom: '24px'
    }}>

      {/* 60-Day Discussion Volume */}
      <div className="glass-panel" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>60-Day Discussion</span>
          <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(56,189,248,0.1)', color: '#38bdf8' }}>
            <MessageSquare size={16} />
          </div>
        </div>
        <div style={{ fontSize: '1.65rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
          {totalMentions > 0 ? totalMentions.toLocaleString() : '—'} <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>Mentions</span>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Top 50 trending on r/wallstreetbets
        </p>
      </div>

      {/* Market Sentiment Index */}
      <div className="glass-panel" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sentiment Index</span>
          <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
            <TrendingUp size={16} />
          </div>
        </div>
        <div style={{ fontSize: '1.65rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: avgBullishRatio === null ? 'var(--text-muted)' : avgBullishRatio >= 50 ? '#10b981' : '#ef4444' }}>
          {avgBullishRatio !== null ? `${avgBullishRatio}%` : '—'} <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Bullish</span>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>{sentimentLabel}</p>
      </div>

      {/* #1 Hot Ticker */}
      <div className="glass-panel" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>#1 Hot Ticker</span>
          <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
            <Flame size={16} />
          </div>
        </div>
        {topTicker ? (
          <>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#f59e0b' }}>${topTicker.symbol}</div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              {topTicker.mentionCount} mentions · {topTicker.change24h >= 0 ? `+${topTicker.change24h}%` : `${topTicker.change24h}%`} price
            </p>
          </>
        ) : (
          <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Loading...</div>
        )}
      </div>

      {/* Value Picks Today */}
      <div className="glass-panel value-gem-card" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Value Picks</span>
          <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
            <ShieldAlert size={16} />
          </div>
        </div>
        <div style={{ fontSize: '1.65rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#fbbf24' }}>
          {valuePicks} <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Stocks</span>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Pass Graham / Buffett screen today
        </p>
      </div>

      {/* Monitored Communities */}
      <div className="glass-panel" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Communities</span>
          <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>
            <Users size={16} />
          </div>
        </div>
        <div style={{ fontSize: '1.65rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#8b5cf6' }}>
          1 <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>Source</span>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Live r/wallstreetbets Tracking
        </p>
      </div>

    </div>
  );
}
