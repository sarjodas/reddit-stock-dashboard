import React from 'react';
import { SUBREDDITS } from '../services/redditApi';
import { CheckSquare, Square, Filter, CheckCircle2 } from 'lucide-react';

export default function SubredditFilter({
  selectedSubreddits,
  onToggleSubreddit,
  onSelectAll,
  brokerFilter,
  onChangeBroker
}) {
  const isAllSelected = selectedSubreddits.length === SUBREDDITS.length;

  return (
    <div className="glass-panel" style={{ padding: '18px 20px', marginBottom: '24px' }}>
      
      {/* Subreddit Stream Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
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
          {isAllSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      {/* Main Tab Broker Platform Filter Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        paddingTop: '12px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} color="#10b981" />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Filter Entire Dashboard by Trading App:
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', background: 'rgba(0, 0, 0, 0.45)', padding: '3px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => onChangeBroker('all')}
            className={`pill-btn ${brokerFilter === 'all' ? 'active' : ''}`}
            style={{ padding: '5px 14px', fontSize: '0.76rem' }}
          >
            🌐 All Brokers
          </button>
          <button
            onClick={() => onChangeBroker('Scalable')}
            className={`pill-btn ${brokerFilter === 'Scalable' ? 'active' : ''}`}
            style={{ padding: '5px 14px', fontSize: '0.76rem' }}
          >
            ⚡ Scalable Capital
          </button>
          <button
            onClick={() => onChangeBroker('Trading 212')}
            className={`pill-btn ${brokerFilter === 'Trading 212' ? 'active' : ''}`}
            style={{ padding: '5px 14px', fontSize: '0.76rem' }}
          >
            🌐 Trading 212
          </button>
          <button
            onClick={() => onChangeBroker('Revolut')}
            className={`pill-btn ${brokerFilter === 'Revolut' ? 'active' : ''}`}
            style={{ padding: '5px 14px', fontSize: '0.76rem' }}
          >
            💳 Revolut
          </button>
          <button
            onClick={() => onChangeBroker('Zerodha')}
            className={`pill-btn ${brokerFilter === 'Zerodha' ? 'active' : ''}`}
            style={{ padding: '5px 14px', fontSize: '0.76rem' }}
          >
            🇮🇳 Zerodha
          </button>
          <button
            onClick={() => onChangeBroker('Interactive Brokers')}
            className={`pill-btn ${brokerFilter === 'Interactive Brokers' ? 'active' : ''}`}
            style={{ padding: '5px 14px', fontSize: '0.76rem' }}
          >
            🏦 IBKR
          </button>
        </div>
      </div>

    </div>
  );
}
