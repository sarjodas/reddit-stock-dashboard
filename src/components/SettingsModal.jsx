import React, { useState } from 'react';
import { X, Sliders, Key, Shield, RefreshCw, CheckCircle2, Lock } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, settings, onSaveSettings }) {
  const [formData, setFormData] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '600px', padding: '28px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>
              <Sliders size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>API & Dashboard Settings</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Configure Reddit OAuth, Stock Market Providers & Security Passcode</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Mode Selector */}
          <div style={{ marginBottom: '20px', background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>
              Data Provider API Mode
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                className={`btn ${formData.apiMode === 'public' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleChange('apiMode', 'public')}
                style={{ justifyContent: 'center', fontSize: '0.85rem' }}
              >
                🌐 Public Mode (Zero Setup)
              </button>
              <button
                type="button"
                className={`btn ${formData.apiMode === 'custom' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleChange('apiMode', 'custom')}
                style={{ justifyContent: 'center', fontSize: '0.85rem' }}
              >
                🔑 Custom OAuth Mode
              </button>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              {formData.apiMode === 'public' 
                ? 'Using open Reddit JSON endpoints + Yahoo Finance quotes. Works instantly out of the box.'
                : 'Using custom Reddit OAuth credentials & dedicated stock API keys for higher rate limits.'}
            </p>
          </div>

          {/* Custom Credentials Section */}
          {formData.apiMode === 'custom' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Reddit Client ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. xYz123456789"
                  value={formData.redditClientId || ''}
                  onChange={(e) => handleChange('redditClientId', e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: '#fff', fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Reddit Client Secret
                </label>
                <input
                  type="password"
                  placeholder="e.g. •••••••••••••••••••••"
                  value={formData.redditClientSecret || ''}
                  onChange={(e) => handleChange('redditClientSecret', e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: '#fff', fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Finnhub / Stock API Key (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. c1234567890finnhub"
                  value={formData.finnhubApiKey || ''}
                  onChange={(e) => handleChange('finnhubApiKey', e.target.value)}
                  style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: '#fff', fontFamily: 'var(--font-mono)' }}
                />
              </div>
            </div>
          )}

          {/* Security & Passcode Section */}
          <div style={{ marginBottom: '20px', padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Lock size={16} color="#38bdf8" />
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Security Lock Passcode</label>
            </div>
            <input
              type="text"
              placeholder="Set passcode (Current: 1234)"
              value={formData.passcode || '1234'}
              onChange={(e) => handleChange('passcode', e.target.value)}
              style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: '#fff', fontFamily: 'var(--font-mono)' }}
            />
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
              This passcode protects your GitHub Pages dashboard access.
            </p>
          </div>

          {/* Auto Refresh Setting */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Auto-Refresh Interval
            </label>
            <select
              value={formData.refreshInterval || 60}
              onChange={(e) => handleChange('refreshInterval', Number(e.target.value))}
              style={{ width: '100%', padding: '10px', background: '#1a2234', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
            >
              <option value={0}>Manual Only (Off)</option>
              <option value={30}>Every 30 Seconds</option>
              <option value={60}>Every 1 Minute</option>
              <option value={300}>Every 5 Minutes</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {savedSuccess ? <><CheckCircle2 size={16} /> Saved!</> : 'Save Settings'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
