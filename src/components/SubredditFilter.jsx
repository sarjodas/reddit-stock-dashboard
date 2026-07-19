import React from 'react';
import { SUBREDDITS } from '../services/redditApi';
import { Check, Layers } from 'lucide-react';

export default function SubredditFilter({ selectedSubreddits, onToggleSubreddit, onSelectAll }) {
  const isAllSelected = selectedSubreddits.length === SUBREDDITS.length;

  return (
    <div className="glass-panel" style={{ padding: '16px 20px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color="#38bdf8" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Filter by Subreddit Community</h3>
        </div>
        <button
          onClick={onSelectAll}
          className="btn btn-secondary"
          style={{ fontSize: '0.75rem', padding: '4px 10px' }}
        >
          {isAllSelected ? 'Deselect All' : 'Select All (8 Subreddits)'}
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {SUBREDDITS.map(sub => {
          const isSelected = selectedSubreddits.includes(sub.id);
          return (
            <button
              key={sub.id}
              onClick={() => onToggleSubreddit(sub.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: isSelected ? '1px solid #0284c7' : '1px solid var(--border-color)',
                background: isSelected ? 'rgba(2, 132, 199, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                color: isSelected ? '#38bdf8' : 'var(--text-secondary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'var(--transition-fast)'
              }}
              title={`${sub.name} - ${sub.desc} (${sub.members} members)`}
            >
              {isSelected && <Check size={14} />}
              {sub.name}
              <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{sub.members}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
