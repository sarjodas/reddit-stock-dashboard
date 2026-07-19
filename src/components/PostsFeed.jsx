import React, { useState } from 'react';
import { MessageSquare, ExternalLink, ThumbsUp, TrendingUp, TrendingDown, Search, Filter } from 'lucide-react';

export default function PostsFeed({ posts, selectedSubreddits }) {
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [postSearch, setPostSearch] = useState('');

  let filteredPosts = posts.filter(post => {
    if (selectedSubreddits.length > 0 && !selectedSubreddits.includes(post.subreddit)) {
      return false;
    }
    if (sentimentFilter !== 'all' && post.sentiment.label.toLowerCase() !== sentimentFilter) {
      return false;
    }
    if (postSearch.trim()) {
      const q = postSearch.toLowerCase();
      const titleMatch = post.title.toLowerCase().includes(q);
      const textMatch = post.selftext.toLowerCase().includes(q);
      const tickerMatch = post.tickers.some(t => t.toLowerCase().includes(q));
      return titleMatch || textMatch || tickerMatch;
    }
    return true;
  });

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
      
      {/* Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={20} color="#38bdf8" /> Live Reddit Discussion Feed
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Real-time threads extracted with ticker tags & lexicon sentiment analysis
          </p>
        </div>

        {/* Sentiment Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative', width: '200px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search posts..."
              value={postSearch}
              onChange={(e) => setPostSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px 6px 30px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                color: '#fff',
                fontSize: '0.78rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.3)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setSentimentFilter('all')}
              style={{
                padding: '4px 10px',
                fontSize: '0.75rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                background: sentimentFilter === 'all' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                color: sentimentFilter === 'all' ? '#fff' : 'var(--text-muted)'
              }}
            >
              All ({posts.length})
            </button>
            <button
              onClick={() => setSentimentFilter('bullish')}
              style={{
                padding: '4px 10px',
                fontSize: '0.75rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                background: sentimentFilter === 'bullish' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
                color: sentimentFilter === 'bullish' ? '#10b981' : 'var(--text-muted)'
              }}
            >
              Bullish
            </button>
            <button
              onClick={() => setSentimentFilter('bearish')}
              style={{
                padding: '4px 10px',
                fontSize: '0.75rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                background: sentimentFilter === 'bearish' ? 'rgba(239, 68, 68, 0.25)' : 'transparent',
                color: sentimentFilter === 'bearish' ? '#ef4444' : 'var(--text-muted)'
              }}
            >
              Bearish
            </button>
          </div>
        </div>
      </div>

      {/* Stream List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredPosts.slice(0, 15).map(post => (
          <div
            key={post.id}
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              transition: 'var(--transition-fast)'
            }}
            className="post-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-exchange" style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#38bdf8' }}>
                  r/{post.subreddit}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  u/{post.author}
                </span>
                {post.tickers.map(sym => (
                  <span key={sym} className="badge badge-exchange" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontWeight: 800 }}>
                    ${sym}
                  </span>
                ))}
              </div>

              <span className={`badge ${post.sentiment.label === 'Bullish' ? 'badge-bullish' : post.sentiment.label === 'Bearish' ? 'badge-bearish' : 'badge-neutral'}`}>
                {post.sentiment.label === 'Bullish' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {post.sentiment.label} ({post.sentiment.score > 0 ? `+${post.sentiment.score}` : post.sentiment.score})
              </span>
            </div>

            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px', color: '#f8fafc', lineHeight: 1.4 }}>
              {post.title}
            </h3>

            {post.selftext && (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {post.selftext}
              </p>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.04)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ThumbsUp size={12} /> {post.score.toLocaleString()} Upvotes
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MessageSquare size={12} /> {post.numComments.toLocaleString()} Comments
                </span>
              </div>

              <a
                href={post.permalink}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
              >
                Reddit Thread <ExternalLink size={12} />
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
