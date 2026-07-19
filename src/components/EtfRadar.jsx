import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, TrendingUp, Compass, ArrowUpRight, ArrowDownRight, Layers, Coins, Lock, Zap, HelpCircle, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../services/stockApi';

export const ETF_DATABASE = [
  // ── CORE GLOBAL / OPTIMAL ──────────────────────────────────────────────────
  {
    id: 'VWCE',
    symbol: 'VWCE',
    name: 'Vanguard FTSE All-World UCITS ETF',
    isin: 'IE00BK5BQT80',
    type: 'ETF',
    category: 'Global Core Equity',
    exchange: 'XETRA / Euronext',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    priceEur: 124.80,
    change24h: 0.65,
    ter: '0.22%',
    aum: '€14.2B',
    signal: 'Core Accumulate / Optimal',
    signalType: 'optimal',
    riskScore: 18,
    riskTier: 'Low Risk',
    badgeClass: 'badge-risk-low',
    impliedReturn1Y: '+12.4%',
    reasoning: 'Unbeatable global diversification across 3,600+ large & mid-cap stocks in 45 countries. Accumulating share class reinvests dividends. Ideal for hands-off wealth compounding.',
    keyHoldings: ['Apple', 'Microsoft', 'NVIDIA', 'Amazon', 'Alphabet', 'TSMC', 'Novo Nordisk']
  },
  {
    id: 'IWDA',
    symbol: 'IWDA',
    name: 'iShares Core MSCI World UCITS ETF',
    isin: 'IE00B4L5Y983',
    type: 'ETF',
    category: 'Developed Markets Core',
    exchange: 'Euronext Amsterdam / London',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    priceEur: 94.20,
    change24h: 0.55,
    ter: '0.20%',
    aum: '€68.5B',
    signal: 'Core Accumulate / Optimal',
    signalType: 'optimal',
    riskScore: 15,
    riskTier: 'Low Risk',
    badgeClass: 'badge-risk-low',
    impliedReturn1Y: '+13.8%',
    reasoning: 'Massive €68B+ liquidity pool covering 23 developed markets. Ultra-low 0.20% TER makes it a premier core holding for any European long-term portfolio.',
    keyHoldings: ['NVIDIA', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Broadcom', 'Eli Lilly']
  },
  {
    id: 'CSPX',
    symbol: 'CSPX',
    name: 'iShares Core S&P 500 UCITS ETF',
    isin: 'IE00B5BMR087',
    type: 'ETF',
    category: 'US Large Cap Core',
    exchange: 'London / Euronext',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    priceEur: 568.40,
    change24h: 0.82,
    ter: '0.07%',
    aum: '€80.3B',
    signal: 'Core Accumulate / Optimal',
    signalType: 'optimal',
    riskScore: 16,
    riskTier: 'Low Risk',
    badgeClass: 'badge-risk-low',
    impliedReturn1Y: '+14.5%',
    reasoning: "The gold standard S&P 500 tracker with an incredible 0.07% TER — Europe's largest US equity ETF. Accumulating class, essential for any growth portfolio.",
    keyHoldings: ['Apple', 'Microsoft', 'NVIDIA', 'Amazon', 'Meta', 'Alphabet', 'Berkshire Hathaway']
  },
  // ── EUROPEAN EQUITY ─────────────────────────────────────────────────────────
  {
    id: 'EXSA',
    symbol: 'EXSA',
    name: 'iShares STOXX Europe 600 UCITS ETF',
    isin: 'DE0002635307',
    type: 'ETF',
    category: 'European Core Equity',
    exchange: 'XETRA',
    brokers: ['Scalable', 'Trading 212'],
    priceEur: 48.90,
    change24h: 0.40,
    ter: '0.20%',
    aum: '€6.8B',
    signal: 'Core Accumulate / Optimal',
    signalType: 'optimal',
    riskScore: 19,
    riskTier: 'Low Risk',
    badgeClass: 'badge-risk-low',
    impliedReturn1Y: '+10.2%',
    reasoning: 'Covers 600 companies across 17 European countries. Best single-product exposure to Europe\'s entire equity market — UK, Germany, France, Switzerland & Nordics.',
    keyHoldings: ['Novo Nordisk', 'ASML', 'Nestlé', 'LVMH', 'Roche', 'SAP', 'Siemens']
  },
  {
    id: 'VEUR',
    symbol: 'VEUR',
    name: 'Vanguard FTSE Developed Europe UCITS ETF',
    isin: 'IE00B945VV12',
    type: 'ETF',
    category: 'European Developed Markets',
    exchange: 'XETRA / Euronext',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    priceEur: 36.20,
    change24h: 0.35,
    ter: '0.10%',
    aum: '€2.7B',
    signal: 'Core Accumulate / Optimal',
    signalType: 'optimal',
    riskScore: 17,
    riskTier: 'Low Risk',
    badgeClass: 'badge-risk-low',
    impliedReturn1Y: '+9.8%',
    reasoning: "Vanguard's ultra-low-cost 0.10% TER European equity fund. Excellent complement to a global core holding. Strong dividend yield from European blue chips.",
    keyHoldings: ['ASML', 'Nestlé', 'Novo Nordisk', 'LVMH', 'SAP', 'AstraZeneca', 'Roche']
  },
  {
    id: 'EXW1',
    symbol: 'EXW1',
    name: 'iShares Core DAX UCITS ETF',
    isin: 'DE0005933931',
    type: 'ETF',
    category: 'German DAX Blue Chip',
    exchange: 'XETRA',
    brokers: ['Scalable', 'Trading 212'],
    priceEur: 145.60,
    change24h: 0.50,
    ter: '0.16%',
    aum: '€5.9B',
    signal: 'Accumulate / German Recovery',
    signalType: 'buy',
    riskScore: 26,
    riskTier: 'Low Risk',
    badgeClass: 'badge-risk-low',
    impliedReturn1Y: '+11.4%',
    reasoning: "Germany's 40 largest stocks at 0.16% TER. Rheinmetall's defense surge, SAP's cloud pivot, and Siemens industrials make the DAX an undervalued European bet.",
    keyHoldings: ['SAP', 'Siemens', 'Rheinmetall', 'Allianz', 'BMW', 'Mercedes-Benz', 'BASF']
  },
  // ── EMERGING MARKETS ─────────────────────────────────────────────────────────
  {
    id: 'EIMI',
    symbol: 'EIMI',
    name: 'iShares Core MSCI EM IMI UCITS ETF',
    isin: 'IE00BKM4GZ66',
    type: 'ETF',
    category: 'Emerging Markets Core',
    exchange: 'London / Euronext',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    priceEur: 35.60,
    change24h: 0.95,
    ter: '0.18%',
    aum: '€19.4B',
    signal: 'Accumulate / Emerging Growth',
    signalType: 'buy',
    riskScore: 38,
    riskTier: 'Moderate Risk',
    badgeClass: 'badge-risk-mod',
    impliedReturn1Y: '+16.2%',
    reasoning: 'Broad exposure to 3,000+ EM stocks across India, China, Taiwan, Korea & Brazil. Excellent diversifier from US-heavy portfolios. India weighting growing rapidly.',
    keyHoldings: ['Samsung', 'TSMC', 'Tencent', 'Alibaba', 'Infosys', 'HDFC Bank', 'Reliance']
  },
  // ── SECTOR / THEMATIC ────────────────────────────────────────────────────────
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
    aum: '€1.4B',
    signal: 'Strong Buy / High Conviction',
    signalType: 'buy',
    riskScore: 48,
    riskTier: 'Moderate Risk',
    badgeClass: 'badge-risk-mod',
    impliedReturn1Y: '+28.5%',
    reasoning: 'Direct pure-play exposure to European NATO re-armament (Rheinmetall, BAE Systems, Saab, Thales). Multi-year order backlog tailwind driven by geopolitical shift.',
    keyHoldings: ['Rheinmetall', 'Saab AB', 'BAE Systems', 'Thales', 'Leonardo', 'Palantir']
  },
  {
    id: 'IQQH',
    symbol: 'IQQH',
    name: 'iShares Global Clean Energy UCITS ETF',
    isin: 'IE00B1XNHC34',
    type: 'ETF',
    category: 'Clean Energy / ESG',
    exchange: 'XETRA / London',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    priceEur: 7.40,
    change24h: 1.10,
    ter: '0.65%',
    aum: '€2.1B',
    signal: 'Accumulate / Green Transition',
    signalType: 'buy',
    riskScore: 52,
    riskTier: 'Moderate Risk',
    badgeClass: 'badge-risk-mod',
    impliedReturn1Y: '+14.0%',
    reasoning: 'Exposure to global solar, wind, and hydrogen leaders. IRA and EU Green Deal policy tailwinds support multi-decade structural growth despite near-term rate sensitivity.',
    keyHoldings: ['Vestas Wind', 'Enphase Energy', 'First Solar', 'Plug Power', 'Siemens Energy', 'Orsted']
  },
  {
    id: 'SMH',
    symbol: 'SMH',
    name: 'VanEck Semiconductor UCITS ETF',
    isin: 'IE00BMC38736',
    type: 'ETF',
    category: 'Semiconductor / AI Megatrend',
    exchange: 'XETRA / London',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    priceEur: 41.80,
    change24h: 2.90,
    ter: '0.35%',
    aum: '€2.8B',
    signal: 'Wise to Wait / Near Resistance',
    signalType: 'wait',
    riskScore: 62,
    riskTier: 'Elevated Volatility',
    badgeClass: 'badge-risk-mod',
    impliedReturn1Y: '+18.4%',
    reasoning: 'Strong long-term AI fundamentals (NVIDIA, ASML, TSMC), but short-term valuations near upper resistance. Accumulate on a 3–5% dip for best entry.',
    keyHoldings: ['NVIDIA', 'TSMC', 'ASML', 'Broadcom', 'AMD', 'Applied Materials']
  },
  {
    id: 'IQQQ',
    symbol: 'EQQQ',
    name: 'Invesco EQQQ NASDAQ-100 UCITS ETF',
    isin: 'IE0032077012',
    type: 'ETF',
    category: 'NASDAQ-100 Growth',
    exchange: 'XETRA / London',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    priceEur: 462.20,
    change24h: 1.45,
    ter: '0.30%',
    aum: '€7.8B',
    signal: 'Accumulate / Tech Growth Conviction',
    signalType: 'buy',
    riskScore: 55,
    riskTier: 'Moderate Risk',
    badgeClass: 'badge-risk-mod',
    impliedReturn1Y: '+17.2%',
    reasoning: 'The European NASDAQ-100 tracker. Strong AI and mega-cap tech exposure. High conviction for 3–5 year horizons. Best entry on market dips.',
    keyHoldings: ['NVIDIA', 'Apple', 'Microsoft', 'Amazon', 'Meta', 'Broadcom', 'Tesla']
  },
  {
    id: 'AIAI',
    symbol: 'AIAI',
    name: 'WisdomTree Artificial Intelligence UCITS ETF',
    isin: 'IE00BDVPNG13',
    type: 'ETF',
    category: 'Artificial Intelligence Thematic',
    exchange: 'London / XETRA',
    brokers: ['Scalable', 'Trading 212'],
    priceEur: 26.30,
    change24h: 2.40,
    ter: '0.40%',
    aum: '€380M',
    signal: 'Accumulate / AI Supercycle',
    signalType: 'buy',
    riskScore: 56,
    riskTier: 'Moderate Risk',
    badgeClass: 'badge-risk-mod',
    impliedReturn1Y: '+24.0%',
    reasoning: 'Pure-play AI ETF tracking companies across the full AI value chain — chip designers, cloud platforms, AI software, and robotics. Riding the biggest tech wave of the decade.',
    keyHoldings: ['NVIDIA', 'Microsoft', 'Alphabet', 'Baidu', 'Palantir', 'UiPath', 'C3.ai']
  },
  {
    id: 'RBOT',
    symbol: 'RBOT',
    name: 'iShares Automation & Robotics UCITS ETF',
    isin: 'IE00BYZK4552',
    type: 'ETF',
    category: 'Robotics & Automation',
    exchange: 'XETRA / London',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    priceEur: 12.80,
    change24h: 1.20,
    ter: '0.40%',
    aum: '€3.2B',
    signal: 'Accumulate / Industry 4.0',
    signalType: 'buy',
    riskScore: 50,
    riskTier: 'Moderate Risk',
    badgeClass: 'badge-risk-mod',
    impliedReturn1Y: '+18.5%',
    reasoning: 'Factory automation, surgical robots, autonomous vehicles, and AI-driven logistics are reshaping the global economy. Fanuc, ABB, Keyence are key industrial holdings.',
    keyHoldings: ['Fanuc', 'ABB', 'Keyence', 'Intuitive Surgical', 'Cognex', 'Yaskawa']
  },
  {
    id: 'HEAL',
    symbol: 'HEAL',
    name: 'iShares Healthcare Innovation UCITS ETF',
    isin: 'IE00BYZK4776',
    type: 'ETF',
    category: 'Healthcare / Biotech Innovation',
    exchange: 'XETRA / London',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    priceEur: 14.90,
    change24h: 0.65,
    ter: '0.40%',
    aum: '€1.8B',
    signal: 'Accumulate / Biotech Megatrend',
    signalType: 'buy',
    riskScore: 46,
    riskTier: 'Moderate Risk',
    badgeClass: 'badge-risk-mod',
    impliedReturn1Y: '+15.8%',
    reasoning: 'GLP-1 drug revolution (Ozempic, Wegovy), AI drug discovery, gene editing, and mRNA technology are converging into a once-in-a-generation biotech boom.',
    keyHoldings: ['Novo Nordisk', 'Eli Lilly', 'AstraZeneca', 'BioNTech', 'Regeneron', 'Moderna']
  },
  // ── PRECIOUS METALS / COMMODITIES (ETCs) ─────────────────────────────────────
  {
    id: 'EGLN',
    symbol: 'EGLN',
    name: 'iShares Physical Gold ETC',
    isin: 'IE00B579F325',
    type: 'ETC',
    category: 'Precious Metals / Safe Haven',
    exchange: 'London / Euronext',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    priceEur: 42.10,
    change24h: 0.85,
    ter: '0.12%',
    aum: '€16.8B',
    signal: 'Safe Haven / Optimal Hedge',
    signalType: 'optimal',
    riskScore: 20,
    riskTier: 'Low Risk',
    badgeClass: 'badge-risk-low',
    impliedReturn1Y: '+14.2%',
    reasoning: '100% backed by physical gold allocated in London vaults. Essential 5–10% portfolio hedge against central bank policy uncertainty and persistent inflation.',
    keyHoldings: ['Physical Gold Bars (Allocated, LBMA)']
  },
  {
    id: 'WGLD',
    symbol: 'WGLD',
    name: 'WisdomTree Core Physical Gold ETC',
    isin: 'JE00BN7RZ087',
    type: 'ETC',
    category: 'Precious Metals / Safe Haven',
    exchange: 'XETRA / London',
    brokers: ['Scalable', 'Trading 212'],
    priceEur: 38.80,
    change24h: 0.80,
    ter: '0.15%',
    aum: '€1.2B',
    signal: 'Safe Haven / Optimal Hedge',
    signalType: 'optimal',
    riskScore: 21,
    riskTier: 'Low Risk',
    badgeClass: 'badge-risk-low',
    impliedReturn1Y: '+14.0%',
    reasoning: "WisdomTree's low-cost physical gold ETC. Direct alternative to EGLN with XETRA-listing — ideal for Scalable Capital or comdirect savings plans.",
    keyHoldings: ['Physical Gold (LBMA Vaulted)']
  },
  {
    id: 'WSIL',
    symbol: 'WSIL',
    name: 'WisdomTree Physical Silver ETC',
    isin: 'JE00B1VS3333',
    type: 'ETC',
    category: 'Precious Metals / Industrial',
    exchange: 'XETRA / London',
    brokers: ['Scalable', 'Trading 212'],
    priceEur: 22.60,
    change24h: 1.55,
    ter: '0.49%',
    aum: '€700M',
    signal: 'Accumulate / Undervalued vs Gold',
    signalType: 'buy',
    riskScore: 40,
    riskTier: 'Moderate Risk',
    badgeClass: 'badge-risk-mod',
    impliedReturn1Y: '+20.5%',
    reasoning: "Silver's gold-to-silver ratio is historically wide — silver may outperform in a rate-cut cycle. Dual industrial + monetary demand from solar panels & EVs.",
    keyHoldings: ['Physical Silver (Allocated)']
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
    aum: '€780M',
    signal: 'Accumulate / Energy Transition',
    signalType: 'buy',
    riskScore: 42,
    riskTier: 'Moderate Risk',
    badgeClass: 'badge-risk-mod',
    impliedReturn1Y: '+22.0%',
    reasoning: 'Copper structural supply deficit driven by global AI data centre grid upgrades & EV manufacturing demand. Multi-year structural bull market thesis.',
    keyHoldings: ['Physical Copper / LME Warrants']
  },
  // ── INCOME / DIVIDEND ────────────────────────────────────────────────────────
  {
    id: 'VHYL',
    symbol: 'VHYL',
    name: 'Vanguard FTSE All-World High Dividend UCITS ETF',
    isin: 'IE00B8GKDB10',
    type: 'ETF',
    category: 'Global Dividend / Income',
    exchange: 'XETRA / Euronext',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    priceEur: 58.40,
    change24h: 0.20,
    ter: '0.22%',
    aum: '€3.9B',
    signal: 'Core Accumulate / Optimal',
    signalType: 'optimal',
    riskScore: 22,
    riskTier: 'Low Risk',
    badgeClass: 'badge-risk-low',
    impliedReturn1Y: '+9.5% + 3.2% Yield',
    reasoning: 'High-yield distributing ETF paying quarterly dividends ~3.2%. Ideal for income investors or those nearing retirement. Lower drawdown than pure growth ETFs.',
    keyHoldings: ['JP Morgan', 'Exxon Mobil', 'Nestlé', 'Samsung', 'Shell', 'Roche', 'HSBC']
  },
  {
    id: 'TDIV',
    symbol: 'TDIV',
    name: 'VanEck Morningstar Developed Markets Dividend Leaders ETF',
    isin: 'NL0009690221',
    type: 'ETF',
    category: 'European High Dividend',
    exchange: 'Euronext Amsterdam',
    brokers: ['Scalable', 'Trading 212'],
    priceEur: 38.60,
    change24h: 0.15,
    ter: '0.38%',
    aum: '€1.1B',
    signal: 'Accumulate / Dividend Income',
    signalType: 'buy',
    riskScore: 24,
    riskTier: 'Low Risk',
    badgeClass: 'badge-risk-low',
    impliedReturn1Y: '+8.8% + 4.1% Yield',
    reasoning: 'High-conviction European and US dividend aristocrats with consistent 4%+ yield. Great for income-focused investors seeking capital stability plus return.',
    keyHoldings: ['BASF', 'Allianz', 'ENI', 'TotalEnergies', 'Shell', 'Rio Tinto', 'Fortescue']
  },
  // ── BONDS / FIXED INCOME ──────────────────────────────────────────────────────
  {
    id: 'AGGH',
    symbol: 'AGGH',
    name: 'iShares Core Global Aggregate Bond UCITS ETF',
    isin: 'IE00BDBRDM35',
    type: 'ETF',
    category: 'Global Bonds / Fixed Income',
    exchange: 'London / XETRA',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    priceEur: 4.80,
    change24h: 0.10,
    ter: '0.10%',
    aum: '€6.2B',
    signal: 'Accumulate / Rate Cut Tailwind',
    signalType: 'buy',
    riskScore: 12,
    riskTier: 'Low Risk',
    badgeClass: 'badge-risk-low',
    impliedReturn1Y: '+5.5% + 3.8% Yield',
    reasoning: 'Diversified global bond basket. ECB and Fed rate cuts in 2025–2026 provide price appreciation tailwind. Excellent portfolio stabiliser during equity drawdowns.',
    keyHoldings: ['US Treasuries', 'German Bunds', 'UK Gilts', 'Japanese JGBs', 'IG Corporates']
  },
  // ── AVOID / HIGH RISK ────────────────────────────────────────────────────────
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
    aum: '$6.2B',
    signal: 'Caution / High Volatility Drag',
    signalType: 'avoid',
    riskScore: 78,
    riskTier: 'High Risk',
    badgeClass: 'badge-risk-high',
    impliedReturn1Y: '-5.0% to +12%',
    reasoning: 'Concentrated speculative tech with elevated 0.75% TER fee drag. High drawdown risk during interest rate volatility. Has lost 75%+ from its ATH.',
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
    aum: '$2.1B',
    signal: '⛔ AVOID / Extreme Compounding Decay',
    signalType: 'avoid',
    riskScore: 95,
    riskTier: 'Extreme / Dangerous Decay',
    badgeClass: 'badge-risk-high',
    impliedReturn1Y: '-65.0% Decay',
    reasoning: 'DO NOT HOLD LONG-TERM. Daily 3x inverse rebalancing causes severe volatility decay loss over any period longer than 1–2 days. Only for intraday hedgers.',
    keyHoldings: ['NASDAQ-100 Swaps (3x Daily Inverse)']
  }
];

export default function EtfRadar({ currencyMode, fxRate }) {
  const [filterType, setFilterType] = useState('all');
  const [brokerFilter, setBrokerFilter] = useState('all');

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
                ETF & ETC Investment Radar — {ETF_DATABASE.length} Funds Tracked
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '720px' }}>
              Curated selection of premier European UCITS ETFs & Physical ETCs — Global Core, European Equity, Emerging Markets, Sector Themes, Commodities, Dividends & Bonds — tagged with broker availability for <strong>Scalable Capital</strong>, <strong>Trading 212</strong>, and <strong>Revolut</strong>.
            </p>
          </div>

          {/* Broker & Signal Filter Toolbar */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            
            {/* Broker Platform Filter */}
            <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.45)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0 8px', display: 'flex', alignItems: 'center' }}>
                Broker:
              </span>
              <button onClick={() => setBrokerFilter('all')} className={`pill-btn ${brokerFilter === 'all' ? 'active' : ''}`} style={{ padding: '4px 8px', fontSize: '0.73rem' }}>All Brokers</button>
              <button onClick={() => setBrokerFilter('Scalable')} className={`pill-btn ${brokerFilter === 'Scalable' ? 'active' : ''}`} style={{ padding: '4px 8px', fontSize: '0.73rem' }}>⚡ Scalable</button>
              <button onClick={() => setBrokerFilter('Trading 212')} className={`pill-btn ${brokerFilter === 'Trading 212' ? 'active' : ''}`} style={{ padding: '4px 8px', fontSize: '0.73rem' }}>🌐 Trading 212</button>
              <button onClick={() => setBrokerFilter('Revolut')} className={`pill-btn ${brokerFilter === 'Revolut' ? 'active' : ''}`} style={{ padding: '4px 8px', fontSize: '0.73rem' }}>💳 Revolut</button>
            </div>

            {/* Signal Filter Buttons */}
            <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.45)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <button onClick={() => setFilterType('all')} className={`pill-btn ${filterType === 'all' ? 'active' : ''}`} style={{ padding: '4px 8px', fontSize: '0.73rem' }}>All Signals</button>
              <button onClick={() => setFilterType('optimal')} className={`pill-btn ${filterType === 'optimal' ? 'active' : ''}`} style={{ padding: '4px 8px', fontSize: '0.73rem' }}>⭐ Core Optimal</button>
              <button onClick={() => setFilterType('buy')} className={`pill-btn ${filterType === 'buy' ? 'active' : ''}`} style={{ padding: '4px 8px', fontSize: '0.73rem' }}>🛒 Strong Buy</button>
              <button onClick={() => setFilterType('wait')} className={`pill-btn ${filterType === 'wait' ? 'active' : ''}`} style={{ padding: '4px 8px', fontSize: '0.73rem' }}>⏳ Wait</button>
              <button onClick={() => setFilterType('avoid')} className={`pill-btn ${filterType === 'avoid' ? 'active' : ''}`} style={{ padding: '4px 8px', fontSize: '0.73rem' }}>⛔ Avoid</button>
            </div>

          </div>
        </div>
      </div>

      {/* ETF Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-exchange" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                  {etf.type} • {etf.isin}
                </span>
                <span className={`badge ${etf.badgeClass}`} style={{ fontSize: '0.72rem' }}>
                  Risk: {etf.riskScore}/99
                </span>
              </div>

              {/* Fund Title & Category */}
              <h3 style={{ fontSize: '1.0rem', fontWeight: 800, color: '#fff', marginBottom: '4px', lineHeight: 1.3 }}>
                {etf.name}
              </h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{etf.symbol}</span>
                <span>• {etf.exchange}</span>
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
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
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
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                padding: '12px',
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '14px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Price</div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#fff', fontFamily: 'var(--font-mono)' }}>
                    €{etf.priceEur.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>TER Fee</div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: parseFloat(etf.ter) <= 0.25 ? '#34d399' : '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                    {etf.ter}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>AUM</div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    {etf.aum}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>1Y Return</div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: etf.impliedReturn1Y.includes('-65') ? '#fb7185' : '#34d399', fontFamily: 'var(--font-mono)' }}>
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
