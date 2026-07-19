import React from 'react';
import { MessageSquare, TrendingUp, Flame, Users, ShieldAlert } from 'lucide-react';

export default function MetricsOverview({ stocks, totalPostsCount, selectedSubreddits }) {
  const totalMentions = stocks.reduce((acc, curr) => acc + curr.mentionCount, 0);
  
  const totalBullish = stocks.reduce((acc, curr) => acc + (curr.bullishRatio * curr.mentionCount) / 100, 0);
  const avgBullishRatio = totalMentions > 0 ? Math.round((totalBullish / totalMentions) * 100) : 65;

  const topTicker = stocks.length > 0 ? stocks[0] : { symbol: 'NVDA', mentionCount: 142 };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      
      {/* Total Volume */}
      <div className="glass-panel" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>24h Discussion Volume</span>
          <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
            <MessageSquare size={18} />
          </div>
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
          {totalMentions.toLocaleString()} <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>Mentions</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          Across {totalPostsCount || 180} analyzed Reddit threads
        </p>
      </div>

      {/* Overall Market Sentiment */}
      <div className="glass-panel" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Market Sentiment Index</span>
          <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <TrendingUp size={18} />
          </div>
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: avgBullishRatio >= 50 ? '#10b981' : '#ef4444' }}>
          {avgBullishRatio}% <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Bullish</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          {avgBullishRatio >= 65 ? '🟢 Strong Retail Greed' : avgBullishRatio >= 45 ? '🟡 Neutral / Balanced' : '🔴 Fear & Caution'}
        </p>
      </div>

      {/* Top Buzzing Ticker */}
      <div className="glass-panel" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>#1 Hot Ticker</span>
          <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Flame size={18} />
          </div>
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#f59e0b' }}>
          ${topTicker.symbol}
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          {topTicker.mentionCount} mentions ({topTicker.change24h >= 0 ? `+${topTicker.change24h}%` : `${topTicker.change24h}%`} price)
        </p>
      </div>

      {/* Active Subreddits */}
      <div className="glass-panel" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Monitored Communities</span>
          <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <Users size={18} />
          </div>
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#8b5cf6' }}>
          {selectedSubreddits ? selectedSubreddits.length : 16} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Subreddits</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
          WSB, Stocks, Finanzen, IndianStreetBets & more
        </p>
      </div>

    </div>
  );
}
