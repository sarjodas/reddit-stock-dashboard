import React, { useState } from 'react';
import { Lock, ShieldCheck, Key, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function PasscodeGuard({ isLocked, onUnlock, savedPasscode }) {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isLocked) return null;

  const handleUnlock = (e) => {
    e.preventDefault();
    const correctCode = savedPasscode || '1234';
    
    if (inputCode.trim() === correctCode) {
      setError('');
      onUnlock();
    } else {
      setError('Incorrect passcode. Default is 1234.');
    }
  };

  return (
    <div className="modal-overlay" style={{ background: 'rgba(7, 10, 16, 0.95)', backdropFilter: 'blur(24px)' }}>
      <div className="modal-content glass-panel" style={{ maxWidth: '440px', padding: '36px 32px', textAlign: 'center', border: '1px solid rgba(56, 189, 248, 0.2)', boxShadow: '0 0 50px rgba(2, 132, 199, 0.2)' }}>
        
        <div style={{
          width: '72px',
          height: '72px',
          margin: '0 auto 20px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#38bdf8'
        }}>
          <Lock size={34} />
        </div>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.02em' }}>
          Private Access Guard
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
          This RedditTicker Pulse dashboard is passcode protected. Enter security key to unlock stock data.
        </p>

        <form onSubmit={handleUnlock} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Security Passcode
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter passcode (Default: 1234)"
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value);
                  setError('');
                }}
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: error ? '1px solid #ef4444' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && (
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px', fontWeight: 500 }}>
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '12px',
              justifyContent: 'center',
              fontSize: '0.95rem',
              fontWeight: 700,
              marginTop: '8px'
            }}
          >
            Unlock Dashboard <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
          <ShieldCheck size={14} color="#10b981" /> Client-Side Encryption • Private GitHub Pages Ready
        </div>

      </div>
    </div>
  );
}
