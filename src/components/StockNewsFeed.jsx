import React, { useState } from 'react';
import { Newspaper, ExternalLink, TrendingUp, TrendingDown, Clock, Tag } from 'lucide-react';

export default function StockNewsFeed({ stocks }) {
  const [selectedTicker, setSelectedTicker] = useState('ALL');

  // Collect all news items
  let allNews = [];
  stocks.forEach(stock => {
    if (stock.newsFeed) {
      stock.newsFeed.forEach(item => {
        allNews.push({ ...item, symbol: stock.symbol, companyName: stock.name });
      });
    }
  });

  if (selectedTicker !== 'ALL') {
    allNews = allNews.filter(n => n.symbol === selectedTicker);
  }

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Newspaper size={20} color="#f59e0b" /> Live Market Catalysts & Financial News Stream
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Impact headlines, analyst price target changes & corporate announcements
          </p>
        </div>

        {/* Ticker Selector Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Tag size={14} color="var(--text-muted)" />
          <select
            value={selectedTicker}
            onChange={(e) => setSelectedTicker(e.target.value)}
            style={{
              padding: '6px 12px',
              background: '#1a2234',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            <option value="ALL">All Stock News ({allNews.length})</option>
            {stocks.map(s => (
              <option key={s.symbol} value={s.symbol}>${s.symbol} — {s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* News Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '14px' }}>
        {allNews.map(news => (
          <div
            key={news.id}
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="badge badge-exchange" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontWeight: 800 }}>
                  ${news.symbol}
                </span>
                <span className={`badge ${news.impact === 'Positive' ? 'badge-bullish' : news.impact === 'Negative' ? 'badge-bearish' : 'badge-neutral'}`}>
                  {news.impact === 'Positive' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {news.impact} Impact
                </span>
              </div>

              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '6px', color: '#f8fafc', lineHeight: 1.4 }}>
                {news.title}
              </h4>

              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                {news.impactText}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.04)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{news.source}</span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Clock size={12} /> {news.time}
                </span>
              </div>
              <a
                href={news.url}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}
              >
                Read <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
