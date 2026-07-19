import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, TrendingUp, Compass, ArrowUpRight, ArrowDownRight, Layers, Coins, Lock, Zap, HelpCircle, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../services/stockApi';

export const ETF_DATABASE = [
  {
    id: 'VWCE',
    symbol: 'VWCE / VWRA',
    name: 'Vanguard FTSE All-World UCITS ETF',
    isin: 'IE00BK5BQT80',
    type: 'ETF',
    category: 'Global Core Equity',
    exchange: 'XETRA / Euronext',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    priceEur: 124.80,
    change24h: 0.65,
    ter: '0.22%',
    aum: '€14.2 Billion',
    signal: 'Core Accumulate / Optimal',
    signalType: 'optimal',
    riskScore: 18,
    riskTier: 'Low Risk',
    badgeClass: 'badge-risk-low',
    impliedReturn1Y: '+12.4%',
    reasoning: 'Unbeatable global diversification across 3,600+ large & mid-cap stocks in 45 countries. Ideal for hands-off wealth compounding.',
    keyHoldings: ['Apple', 'Microsoft', 'NVIDIA', 'Amazon', 'Alphabet', 'TSMC', 'Novo Nordisk']
  },
  {
    id: 'IWDA',
    symbol: 'IWDA / SWDA',
    name: 'iShares Core MSCI World UCITS ETF',
    isin: 'IE00B4L5Y983',
    type: 'ETF',
    category: 'Developed Markets Core',
    exchange: 'Euronext Amsterdam / London',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    priceEur: 94.20,
    change24h: 0.55,
    ter: '0.20%',
    aum: '€68.5 Billion',
    signal: 'Core Accumulate / Optimal',
    signalType: 'optimal',
    riskScore: 15,
    riskTier: 'Low Risk',
    badgeClass: 'badge-risk-low',
    impliedReturn1Y: '+13.8%',
    reasoning: 'Massive €68B+ liquidity pool covering 23 developed markets. Low 0.20% expense ratio makes it a premier core holding.',
    keyHoldings: ['NVIDIA', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Broadcom', 'Eli Lilly']
  },
  {
    id: 'DFNS',
    symbol: 'DFNS',
    name: 'HanETF Future of Defence UCITS ETF',
    isin: 'IE000OJ5T5F4',
    type: 'ETF',
    category: 'European & NATO Defense',
    exchange: 'XETRA / London',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    priceEur: 18.60,
    change24h: 3.20,
    ter: '0.49%',
    aum: '€1.4 Billion',
    signal: 'Strong Buy Dip / High Conviction',
    signalType: 'buy',
    riskScore: 48,
    riskTier: 'Moderate Risk',
    badgeClass: 'badge-risk-mod',
    impliedReturn1Y: '+28.5%',
    reasoning: 'Direct pure-play exposure to European NATO re-armament (Rheinmetall, BAE Systems, Saab, Thales). Multi-year order backlog tailwind.',
    keyHoldings: ['Rheinmetall', 'Saab AB', 'BAE Systems', 'Thales', 'Leonardo', 'Palantir']
  },
  {
    id: 'EGLN',
    symbol: 'EGLN / SGLN',
    name: 'iShares Physical Gold ETC',
    isin: 'IE00B579F325',
    type: 'ETC',
    category: 'Precious Metals / Safe Haven',
    exchange: 'London / Euronext',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    priceEur: 42.10,
    change24h: 0.85,
    ter: '0.12%',
    aum: '€16.8 Billion',
    signal: 'Safe Haven / Optimal Hedge',
    signalType: 'optimal',
    riskScore: 20,
    riskTier: 'Low Risk',
    badgeClass: 'badge-risk-low',
    impliedReturn1Y: '+14.2%',
    reasoning: '100% backed by physical gold allocated in London vaults. Essential hedge against central bank interest rate cuts & inflation.',
    keyHoldings: ['Physical Gold Bars (Allocated)']
  },
  {
    id: 'COPA',
    symbol: 'COPA',
    name: 'WisdomTree Physical Copper ETC',
    isin: 'JE00B15KX377',
    type: 'ETC',
    category: 'Industrial Metals / EV Transition',
    exchange: 'XETRA / London',
    brokers: ['Scalable', 'Trading 212'],
    priceEur: 32.50,
    change24h: 2.10,
    ter: '0.49%',
    aum: '€780 Million',
    signal: 'Accumulate / Energy Transition',
    signalType: 'buy',
    riskScore: 42,
    riskTier: 'Moderate Risk',
    badgeClass: 'badge-risk-mod',
    impliedReturn1Y: '+22.0%',
    reasoning: 'Copper structural supply deficit driven by global AI data center grid upgrades & EV manufacturing demand.',
    keyHoldings: ['Physical Copper / LME Warrants']
  },
  {
    id: 'SMH',
    symbol: 'SMH / SMGB',
    name: 'VanEck Semiconductor UCITS ETF',
    isin: 'IE00BMC38736',
    type: 'ETF',
    category: 'Semiconductor Tech Megatrend',
    exchange: 'XETRA / London',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    priceEur: 41.80,
    change24h: 2.90,
    ter: '0.35%',
    aum: '€2.8 Billion',
    signal: 'Wise to Wait / Extended',
    signalType: 'wait',
    riskScore: 62,
    riskTier: 'Elevated Volatility',
    badgeClass: 'badge-risk-mod',
    impliedReturn1Y: '+18.4%',
    reasoning: 'Strong long-term AI fundamentals (NVIDIA, ASML, TSMC), but short-term valuations are trading near upper resistance. Wait for a 3-5% dip.',
    keyHoldings: ['NVIDIA', 'TSMC', 'ASML', 'Broadcom', 'AMD', 'Applied Materials']
  },
  {
    id: 'ARKK',
    symbol: 'ARKK',
    name: 'ARK Innovation ETF',
    isin: 'US4642875565',
    type: 'ETF',
    category: 'Speculative Growth / Cathie Wood',
    exchange: 'NYSE Arca',
    brokers: ['Trading 212', 'Revolut'],
    priceEur: 42.40,
    change24h: -2.15,
    ter: '0.75%',
    aum: '$6.2 Billion',
    signal: 'Caution / High Volatility Drag',
    signalType: 'avoid',
    riskScore: 78,
    riskTier: 'High Risk',
    badgeClass: 'badge-risk-high',
    impliedReturn1Y: '-5.0% to +12%',
    reasoning: 'Concentrated speculative tech holdings with elevated 0.75% TER fee drag. High drawdown risk during interest rate volatility.',
    keyHoldings: ['Tesla', 'Roku', 'Coinbase', 'Roblox', 'Block', 'UiPath']
  },
  {
    id: 'SQQQ',
    symbol: 'SQQQ',
    name: 'ProShares UltraPro Short QQQ (3x Inverse)',
    isin: 'US74347B3878',
    type: 'Leveraged ETF',
    category: '3x Bearish Inverse Leverage',
    exchange: 'NASDAQ',
    brokers: ['Trading 212'],
    priceEur: 8.20,
    change24h: -6.40,
    ter: '0.95%',
    aum: '$2.1 Billion',
    signal: '⛔ AVOID / Extreme Compounding Decay',
    signalType: 'avoid',
    riskScore: 95,
    riskTier: 'Extreme / Dangerous Decay',
    badgeClass: 'badge-risk-high',
    impliedReturn1Y: '-65.0% Decay',
    reasoning: 'DO NOT HOLD LONG-TERM. Daily 3x inverse rebalancing causes severe volatility decay loss over any period longer than 1-2 days.',
    keyHoldings: ['NASDAQ-100 Swaps (3x Daily Inverse)']
  }
];

export default function EtfRadar({ currencyMode, fxRate }) {
  const [filterType, setFilterType] = useState('all');
  const [brokerFilter, setBrokerFilter] = useState('all'); // 'all', 'Scalable', 'Trading 212', 'Revolut'

  const filteredEtfs = ETF_DATABASE.filter(etf => {
    if (filterType === 'optimal' && etf.signalType !== 'optimal') return false;
    if (filterType === 'buy' && etf.signalType !== 'buy') return false;
    if (filterType === 'wait' && etf.signalType !== 'wait') return false;
    if (filterType === 'avoid' && etf.signalType !== 'avoid') return false;

    if (brokerFilter !== 'all' && (!etf.brokers || !etf.brokers.includes(brokerFilter))) return false;

    return true;
  });

  return (
    <div style={{ marginBottom: '32px' }}>
      
      {/* Overview Banner */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.85) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <ShieldCheck size={24} color="#10b981" />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ETF & ETC Investment Radar & Broker Compatibility
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '720px' }}>
              Curated selection of premier European UCITS ETFs & Physical ETCs tagged with live trading platform availability for <strong>Scalable Capital</strong>, <strong>Trading 212</strong>, and <strong>Revolut</strong>.
            </p>
          </div>

          {/* Broker & Signal Filter Toolbar */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            
            {/* Broker Platform Filter */}
            <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.45)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0 8px', display: 'flex', alignItems: 'center' }}>
                Broker:
              </span>
              <button
                onClick={() => setBrokerFilter('all')}
                className={`pill-btn ${brokerFilter === 'all' ? 'active' : ''}`}
                style={{ padding: '4px 8px', fontSize: '0.73rem' }}
              >
                All Brokers
              </button>
              <button
                onClick={() => setBrokerFilter('Scalable')}
                className={`pill-btn ${brokerFilter === 'Scalable' ? 'active' : ''}`}
                style={{ padding: '4px 8px', fontSize: '0.73rem' }}
              >
                ⚡ Scalable
              </button>
              <button
                onClick={() => setBrokerFilter('Trading 212')}
                className={`pill-btn ${brokerFilter === 'Trading 212' ? 'active' : ''}`}
                style={{ padding: '4px 8px', fontSize: '0.73rem' }}
              >
                🌐 Trading 212
              </button>
              <button
                onClick={() => setBrokerFilter('Revolut')}
                className={`pill-btn ${brokerFilter === 'Revolut' ? 'active' : ''}`}
                style={{ padding: '4px 8px', fontSize: '0.73rem' }}
              >
                💳 Revolut
              </button>
            </div>

            {/* Signal Filter Buttons */}
            <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.45)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <button
                onClick={() => setFilterType('all')}
                className={`pill-btn ${filterType === 'all' ? 'active' : ''}`}
                style={{ padding: '4px 8px', fontSize: '0.73rem' }}
              >
                All Signals
              </button>
              <button
                onClick={() => setFilterType('optimal')}
                className={`pill-btn ${filterType === 'optimal' ? 'active' : ''}`}
                style={{ padding: '4px 8px', fontSize: '0.73rem' }}
              >
                ⭐ Core Optimal
              </button>
              <button
                onClick={() => setFilterType('buy')}
                className={`pill-btn ${filterType === 'buy' ? 'active' : ''}`}
                style={{ padding: '4px 8px', fontSize: '0.73rem' }}
              >
                🛒 Strong Buy
              </button>
              <button
                onClick={() => setFilterType('avoid')}
                className={`pill-btn ${filterType === 'avoid' ? 'active' : ''}`}
                style={{ padding: '4px 8px', fontSize: '0.73rem' }}
              >
                ⛔ Avoid
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ETF Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {filteredEtfs.map(etf => {
          const isAvoid = etf.signalType === 'avoid';
          const isOptimal = etf.signalType === 'optimal';
          const isBuy = etf.signalType === 'buy';

          return (
            <div
              key={etf.id}
              className="glass-panel"
              style={{
                padding: '20px',
                borderLeft: isAvoid ? '4px solid #f43f5e' : isOptimal ? '4px solid #10b981' : isBuy ? '4px solid #38bdf8' : '4px solid #f59e0b',
                position: 'relative'
              }}
            >
              
              {/* Header Badge & ISIN */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="badge badge-exchange" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                  {etf.type} • {etf.isin}
                </span>

                <span className={`badge ${etf.badgeClass}`} style={{ fontSize: '0.72rem' }}>
                  Risk Factor: {etf.riskScore}/99 ({etf.riskTier})
                </span>
              </div>

              {/* Fund Title & Category */}
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: '4px', lineHeight: 1.3 }}>
                {etf.name}
              </h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>${etf.symbol}</span>
                <span>• {etf.category}</span>
              </div>

              {/* Broker Availability Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>Trading App:</span>
                {etf.brokers && etf.brokers.map((broker, idx) => (
                  <span
                    key={idx}
                    className="badge"
                    style={{
                      fontSize: '0.66rem',
                      padding: '2px 7px',
                      background: broker === 'Scalable' ? 'rgba(16, 185, 129, 0.15)' : broker === 'Trading 212' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(192, 132, 252, 0.15)',
                      color: broker === 'Scalable' ? '#34d399' : broker === 'Trading 212' ? '#38bdf8' : '#c084fc',
                      border: `1px solid ${broker === 'Scalable' ? 'rgba(16, 185, 129, 0.3)' : broker === 'Trading 212' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(192, 132, 252, 0.3)'}`
                    }}
                  >
                    <CheckCircle2 size={10} /> {broker}
                  </span>
                ))}
              </div>

              {/* Price & TER Stats Box */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                padding: '12px',
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '14px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Price</div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#fff', fontFamily: 'var(--font-mono)' }}>
                    €{etf.priceEur.toFixed(2)}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>TER Fee</div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: parseFloat(etf.ter) <= 0.25 ? '#34d399' : '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                    {etf.ter}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>1Y Return</div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: etf.impliedReturn1Y.includes('-') ? '#fb7185' : '#34d399', fontFamily: 'var(--font-mono)' }}>
                    {etf.impliedReturn1Y}
                  </div>
                </div>
              </div>

              {/* Recommendation Signal */}
              <div style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                background: isAvoid ? 'rgba(244, 63, 94, 0.12)' : isOptimal ? 'rgba(16, 185, 129, 0.12)' : isBuy ? 'rgba(56, 189, 248, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                border: `1px solid ${isAvoid ? 'rgba(244, 63, 94, 0.3)' : isOptimal ? 'rgba(16, 185, 129, 0.3)' : isBuy ? 'rgba(56, 189, 248, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                marginBottom: '12px'
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: isAvoid ? '#fb7185' : isOptimal ? '#34d399' : isBuy ? '#38bdf8' : '#fbbf24', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isAvoid ? <AlertTriangle size={15} /> : <ShieldCheck size={15} />}
                  {etf.signal}
                </div>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {etf.reasoning}
                </p>
              </div>

              {/* Top Holdings Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginRight: '4px' }}>Top Allocations:</span>
                {etf.keyHoldings.map((holding, idx) => (
                  <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                    {holding}
                  </span>
                ))}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
