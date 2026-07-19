import React from 'react';
import { SUBREDDITS } from '../services/redditApi';
import { CheckSquare, Square, Filter } from 'lucide-react';

export default function SubredditFilter({ selectedSubreddits, onToggleSubreddit, onSelectAll }) {
  const isAllSelected = selectedSubreddits.length === SUBREDDITS.length;

  return (
    <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} color="var(--accent-cyan)" />
          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>
            Subreddit Stream Filter ({selectedSubreddits.length}/{SUBREDDITS.length} Active):
          </span>
        </div>

        {/* Subreddit Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', flex: 1, justifyContent: 'flex-start' }}>
          {SUBREDDITS.map(sub => {
            const isSelected = selectedSubreddits.includes(sub.id);
            return (
              <button
                key={sub.id}
                onClick={() => onToggleSubreddit(sub.id)}
                className={`pill-btn ${isSelected ? 'active' : ''}`}
                style={{
                  padding: '5px 12px',
                  fontSize: '0.78rem',
                  borderColor: isSelected ? sub.color : 'var(--border-color)',
                  background: isSelected ? `linear-gradient(135deg, ${sub.color}dd 0%, ${sub.color}aa 100%)` : 'rgba(255, 255, 255, 0.04)'
                }}
              >
                <span>{sub.icon}</span>
                <span>{sub.name}</span>
              </button>
            );
          })}
        </div>

        {/* Toggle All Button */}
        <button
          onClick={onSelectAll}
          className="btn btn-secondary"
          style={{ padding: '6px 12px', fontSize: '0.76rem', borderRadius: 'var(--radius-full)' }}
        >
          {isAllSelected ? <CheckSquare size={14} /> : <Square size={14} />}
          {isAllSelected ? 'Deselect All' : 'Select All Subreddits'}
        </button>

      </div>
    </div>
  );
}
