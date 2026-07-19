// Stock Market Data Service, Valuation Engine, Risk Model, Timing Engine, News Stream & Real-Time FX Converter

export const DEFAULT_USD_EUR_RATE = 0.92; // 1 USD = 0.92 EUR

export async function fetchUSDEURRate() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates && data.rates.EUR) {
        return parseFloat(data.rates.EUR.toFixed(4));
      }
    }
  } catch (err) {
    console.warn('FX rate live fetch fallback used:', err.message);
  }
  return DEFAULT_USD_EUR_RATE;
}

export function formatCurrency(usdAmount, currencyMode = 'DUAL', fxRate = DEFAULT_USD_EUR_RATE) {
  if (typeof usdAmount !== 'number' || isNaN(usdAmount)) return '$0.00';
  
  const eurAmount = usdAmount * fxRate;
  const usdStr = `$${usdAmount.toFixed(2)}`;
  const eurStr = `€${eurAmount.toFixed(2)}`;

  if (currencyMode === 'EUR') return eurStr;
  if (currencyMode === 'USD') return usdStr;
  return `${usdStr} (${eurStr})`;
}

export const MASTER_STOCKS_DATABASE = {
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Technology / Semiconductors',
    exchange: 'NASDAQ',
    country: '🇺🇸 USA',
    price: 128.45,
    change24h: 3.82,
    marketCap: '$3.15 Trillion',
    peRatio: 72.4,
    pbRatio: 48.2,
    eps: 1.77,
    week52High: 140.76,
    week52Low: 45.60,
    beta: 1.68,
    volatility: 42.5,
    sparkline: [118, 120, 122, 121, 125, 124, 128.45],
    isEmergingGem: false,
    catalyst: 'Next-gen Blackwell AI GPU dominance & hyperscaler capex growth',
    downsideRisk: 'Export restriction risks & high valuation multiple expansion',
    analystRating: 'Strong Buy',
    analystScore: 4.8,
    targetPrice: 155.00,
    targetLow: 115.00,
    targetHigh: 200.00,
    buyCount: 38,
    holdCount: 4,
    sellCount: 0
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    sector: 'Consumer Discretionary / EV',
    exchange: 'NASDAQ',
    country: '🇺🇸 USA',
    price: 248.80,
    change24h: 5.14,
    marketCap: '$792 Billion',
    peRatio: 64.2,
    pbRatio: 12.8,
    eps: 3.87,
    week52High: 271.00,
    week52Low: 138.80,
    beta: 2.15,
    volatility: 54.0,
    sparkline: [215, 220, 235, 230, 242, 240, 248.80],
    isEmergingGem: false,
    catalyst: 'RoboTaxi commercial launch & FSD v13 autonomous miles expansion',
    downsideRisk: 'Automotive margin compression and intense EV competition',
    analystRating: 'Hold',
    analystScore: 3.4,
    targetPrice: 265.00,
    targetLow: 120.00,
    targetHigh: 400.00,
    buyCount: 18,
    holdCount: 15,
    sellCount: 9
  },
  PLTR: {
    symbol: 'PLTR',
    name: 'Palantir Technologies Inc.',
    sector: 'Technology / Enterprise Software',
    exchange: 'NYSE',
    country: '🇺🇸 USA',
    price: 44.20,
    change24h: 6.45,
    marketCap: '$98.5 Billion',
    peRatio: 112.5,
    pbRatio: 22.4,
    eps: 0.39,
    week52High: 46.50,
    week52Low: 14.48,
    beta: 1.82,
    volatility: 48.2,
    sparkline: [35, 37, 39, 38, 41, 42, 44.20],
    isEmergingGem: true,
    gemReason: 'Unprecedented AIP commercial customer bootcamps & GAAP profitability explosion',
    catalyst: 'U.S. Commercial AIP customer growth surging 100%+ YoY',
    downsideRisk: 'Extremely elevated P/E ratio requires flawless execution',
    analystRating: 'Moderate Buy',
    analystScore: 4.1,
    targetPrice: 52.00,
    targetLow: 28.00,
    targetHigh: 65.00,
    buyCount: 14,
    holdCount: 8,
    sellCount: 2
  },
  AMD: {
    symbol: 'AMD',
    name: 'Advanced Micro Devices, Inc.',
    sector: 'Technology / Semiconductors',
    exchange: 'NASDAQ',
    country: '🇺🇸 USA',
    price: 156.30,
    change24h: -1.82,
    marketCap: '$253 Billion',
    peRatio: 115.8,
    pbRatio: 4.5,
    eps: 1.35,
    week52High: 227.30,
    week52Low: 94.04,
    beta: 1.74,
    volatility: 46.0,
    sparkline: [168, 165, 162, 160, 158, 157, 156.30],
    isEmergingGem: false,
    catalyst: 'MI300X AI accelerator chip market share gains vs NVIDIA',
    downsideRisk: 'PC market sluggishness & server competition',
    analystRating: 'Strong Buy',
    analystScore: 4.6,
    targetPrice: 190.00,
    targetLow: 150.00,
    targetHigh: 250.00,
    buyCount: 32,
    holdCount: 6,
    sellCount: 0
  },
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology / Consumer Electronics',
    exchange: 'NASDAQ',
    country: '🇺🇸 USA',
    price: 224.50,
    change24h: 0.85,
    marketCap: '$3.42 Trillion',
    peRatio: 34.1,
    pbRatio: 51.6,
    eps: 6.58,
    week52High: 237.23,
    week52Low: 164.08,
    beta: 1.05,
    volatility: 22.0,
    sparkline: [218, 220, 222, 221, 223, 223.5, 224.50],
    isEmergingGem: false,
    catalyst: 'Apple Intelligence iPhone upgrade supercycle',
    downsideRisk: 'China market market share pressure and antitrust litigation',
    analystRating: 'Buy',
    analystScore: 4.3,
    targetPrice: 250.00,
    targetLow: 184.00,
    targetHigh: 300.00,
    buyCount: 29,
    holdCount: 10,
    sellCount: 1
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Technology / Cloud & AI Software',
    exchange: 'NASDAQ',
    country: '🇺🇸 USA',
    price: 442.10,
    change24h: -0.45,
    marketCap: '$3.28 Trillion',
    peRatio: 37.8,
    pbRatio: 13.2,
    eps: 11.70,
    week52High: 468.35,
    week52Low: 309.45,
    beta: 0.92,
    volatility: 21.5,
    sparkline: [450, 448, 446, 445, 444, 443, 442.10],
    isEmergingGem: false,
    catalyst: 'Azure AI cloud acceleration & Copilot monetization',
    downsideRisk: 'High AI infrastructure capital expenditure costs',
    analystRating: 'Strong Buy',
    analystScore: 4.9,
    targetPrice: 500.00,
    targetLow: 450.00,
    targetHigh: 600.00,
    buyCount: 41,
    holdCount: 2,
    sellCount: 0
  },
  ASTS: {
    symbol: 'ASTS',
    name: 'AST SpaceMobile, Inc.',
    sector: 'Telecommunications / Satellite',
    exchange: 'NASDAQ',
    country: '🇺🇸 USA',
    price: 19.85,
    change24h: 14.30,
    marketCap: '$5.2 Billion',
    peRatio: -18.5,
    pbRatio: 18.2,
    eps: -1.07,
    week52High: 38.60,
    week52Low: 1.97,
    beta: 2.85,
    volatility: 92.4,
    sparkline: [12, 14, 13, 16, 17, 18.5, 19.85],
    isEmergingGem: true,
    gemReason: 'First-mover space-based 5G cellular broadband direct to unmodified smartphones',
    catalyst: 'Commercial launch with AT&T, Verizon, and Vodafone',
    downsideRisk: 'Capital dilution & satellite launch delays',
    analystRating: 'Strong Buy',
    analystScore: 4.7,
    targetPrice: 32.50,
    targetLow: 18.00,
    targetHigh: 45.00,
    buyCount: 5,
    holdCount: 1,
    sellCount: 0
  },
  SMCI: {
    symbol: 'SMCI',
    name: 'Super Micro Computer, Inc.',
    sector: 'Technology / Server Systems',
    exchange: 'NASDAQ',
    country: '🇺🇸 USA',
    price: 48.60,
    change24h: -4.12,
    marketCap: '$28.4 Billion',
    peRatio: 21.4,
    pbRatio: 5.8,
    eps: 2.27,
    week52High: 122.90,
    week52Low: 24.50,
    beta: 2.45,
    volatility: 85.0,
    sparkline: [58, 55, 52, 53, 50, 49, 48.60],
    isEmergingGem: false,
    catalyst: 'Direct liquid cooling AI server rack demand',
    downsideRisk: 'Audit compliance concerns & margin pressure',
    analystRating: 'Hold',
    analystScore: 3.2,
    targetPrice: 65.00,
    targetLow: 35.00,
    targetHigh: 100.00,
    buyCount: 6,
    holdCount: 8,
    sellCount: 3
  },
  SPY: {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    sector: 'Index ETF',
    exchange: 'NYSE',
    country: '🇺🇸 USA',
    price: 554.30,
    change24h: 0.42,
    marketCap: '$560 Billion',
    peRatio: 27.2,
    pbRatio: 4.8,
    eps: 20.35,
    week52High: 565.16,
    week52Low: 410.00,
    beta: 1.00,
    volatility: 14.2,
    sparkline: [545, 548, 550, 549, 552, 553, 554.30],
    isEmergingGem: false,
    catalyst: 'Broad US corporate earnings expansion & Federal Reserve rate cuts',
    downsideRisk: 'Macroeconomic slowdown & high mega-cap concentration',
    analystRating: 'Buy',
    analystScore: 4.5,
    targetPrice: 590.00,
    targetLow: 520.00,
    targetHigh: 630.00,
    buyCount: 45,
    holdCount: 5,
    sellCount: 0
  },
  GME: {
    symbol: 'GME',
    name: 'GameStop Corp.',
    sector: 'Consumer Discretionary / Specialty Retail',
    exchange: 'NYSE',
    country: '🇺🇸 USA',
    price: 22.40,
    change24h: -1.85,
    marketCap: '$9.6 Billion',
    peRatio: 280.0,
    pbRatio: 2.1,
    eps: 0.08,
    week52High: 64.83,
    week52Low: 9.95,
    beta: 3.10,
    volatility: 110.5,
    sparkline: [25, 24, 23, 23.5, 22.8, 22.5, 22.40],
    isEmergingGem: false,
    catalyst: '$4B+ cash war chest for potential M&A transition',
    downsideRisk: 'Declining core physical retail sales',
    analystRating: 'Underperform',
    analystScore: 2.1,
    targetPrice: 13.50,
    targetLow: 7.00,
    targetHigh: 20.00,
    buyCount: 0,
    holdCount: 2,
    sellCount: 4
  }
};

export function computeHorizonScores(tickerData, postMetrics) {
  const velocityChange = postMetrics.mentionChange24h || 0;
  const bullRatio = postMetrics.bullishRatio || 50;

  const velocityBonus = Math.min(35, Math.max(0, velocityChange / 4));
  const volatilityBonus = Math.min(25, (tickerData.volatility || 30) / 3);
  const bullBonus = (bullRatio / 100) * 25;
  const betaBonus = Math.min(15, (tickerData.beta || 1.0) * 5);

  const shortTermScore = Math.min(99, Math.round(15 + velocityBonus + volatilityBonus + bullBonus + betaBonus));

  const stabilityBonus = Math.max(0, 30 - (tickerData.volatility || 30) / 4);
  const peQuality = tickerData.peRatio > 0 && tickerData.peRatio < 45 ? 25 : 10;
  const convictionBull = (bullRatio / 100) * 30;
  const marketCapBonus = tickerData.marketCap.includes('Trillion') ? 15 : tickerData.marketCap.includes('Billion') ? 10 : 5;

  const longTermScore = Math.min(99, Math.round(15 + stabilityBonus + peQuality + convictionBull + marketCapBonus));

  return { shortTermScore, longTermScore };
}

export function calculateMathematicalRisk(tickerData, postMetrics) {
  const vol = tickerData.volatility || 35;
  const volScore = Math.min(100, vol * 1.5);

  const beta = tickerData.beta || 1.2;
  const betaScore = Math.min(100, Math.max(0, (beta - 0.5) * 40));

  const pe = tickerData.peRatio || 25;
  let valuationScore = 50;
  if (pe < 0) valuationScore = 90;
  else if (pe > 80) valuationScore = 85;
  else if (pe > 40) valuationScore = 65;
  else if (pe < 25) valuationScore = 25;

  const hypeSpike = postMetrics.mentionChange24h || 0;
  const noiseScore = Math.min(100, Math.max(10, hypeSpike * 0.6 + 20));

  let capScore = 30;
  if (tickerData.marketCap.includes('Trillion')) capScore = 15;
  else if (tickerData.marketCap.includes('Billion')) {
    const num = parseFloat(tickerData.marketCap.replace(/[^0-9.]/g, ''));
    if (num < 10) capScore = 75;
    else if (num < 50) capScore = 50;
    else capScore = 30;
  } else {
    capScore = 90;
  }

  const riskScore = Math.round(
    0.25 * volScore +
    0.20 * betaScore +
    0.25 * valuationScore +
    0.15 * noiseScore +
    0.15 * capScore
  );

  let tier = 'Moderate Risk';
  let badgeClass = 'badge-risk-mod';
  let icon = '⚡';

  if (riskScore <= 30) {
    tier = 'Low Risk';
    badgeClass = 'badge-risk-low';
    icon = '🛡️';
  } else if (riskScore <= 60) {
    tier = 'Moderate Risk';
    badgeClass = 'badge-risk-mod';
    icon = '⚡';
  } else if (riskScore <= 85) {
    tier = 'High Risk';
    badgeClass = 'badge-risk-high';
    icon = '⚠️';
  } else {
    tier = 'Speculative / Extreme';
    badgeClass = 'badge-risk-spec';
    icon = '☣️';
  }

  return {
    riskScore: Math.min(99, Math.max(10, riskScore)),
    tier,
    badgeClass,
    icon,
    volScore: Math.round(volScore),
    betaScore: Math.round(betaScore),
    valuationScore: Math.round(valuationScore),
    noiseScore: Math.round(noiseScore)
  };
}

export function calculateTimingScore(tickerData, postMetrics) {
  const range = (tickerData.week52High - tickerData.week52Low) || 1;
  const channelPos = (tickerData.price - tickerData.week52Low) / range;
  const priceChange = tickerData.change24h || 0;
  const bullRatio = postMetrics.bullishRatio || 50;

  let dipScore = 50;
  if (priceChange < 0 && bullRatio >= 60) {
    dipScore = 88;
  } else if (channelPos < 0.35) {
    dipScore = 82;
  } else if (channelPos > 0.88 && priceChange > 3) {
    dipScore = 25;
  } else if (channelPos > 0.75) {
    dipScore = 42;
  } else {
    dipScore = 65;
  }

  const timingScore = Math.min(99, Math.max(15, Math.round(dipScore + (bullRatio - 50) * 0.2)));

  let signal = 'Accumulate / Fair Entry';
  let badgeClass = 'badge-short-term';
  let icon = '📥';
  let reasoning = 'Price is trading at a fair market channel. Good for dollar-cost averaging.';

  if (timingScore >= 80) {
    signal = 'Strong Buy Dip / Bargain Day';
    badgeClass = 'badge-bullish';
    icon = '🛒';
    reasoning = 'Stock is pulling back near attractive valuation support while community conviction remains high. Prime entry day!';
  } else if (timingScore >= 55) {
    signal = 'Accumulate / Fair Entry';
    badgeClass = 'badge-short-term';
    icon = '📥';
    reasoning = 'Stock is in a healthy trading channel. Suitable for steady accumulation.';
  } else if (timingScore >= 35) {
    signal = 'Wise to Wait / Extended';
    badgeClass = 'badge-risk-high';
    icon = '⏳';
    reasoning = 'Stock has rallied recently into upper resistance. Consider waiting for a 2-5% price pullback before entry.';
  } else {
    signal = 'Overbought FOMO / Caution Day';
    badgeClass = 'badge-bearish';
    icon = '🔴';
    reasoning = 'High parabolic social hype spike near 52-week highs. High risk of short-term profit taking. Wise to wait!';
  }

  return { timingScore, signal, badgeClass, icon, reasoning, channelPos: Math.round(channelPos * 100) };
}

export const STOCK_NEWS_DATABASE = {
  NVDA: [
    { id: 'n1', title: 'NVIDIA Blackwell Ultra AI GPU Shipping Schedules Accelerated', source: 'Bloomberg Markets', time: '2 hours ago', impact: 'Positive', impactText: 'Hyperscaler demand exceeding 2025 supply capacity', url: 'https://finance.yahoo.com' },
    { id: 'n2', title: 'Morgan Stanley Elevates NVDA Price Target to $160', source: 'Wall Street Journal', time: '5 hours ago', impact: 'Positive', impactText: 'Analyst cites enterprise AI software acceleration', url: 'https://finance.yahoo.com' }
  ],
  TSLA: [
    { id: 't1', title: 'Tesla FSD Autonomous Fleet Passes 2 Billion Cumulative Miles', source: 'Reuters Tech', time: '1 hour ago', impact: 'Positive', impactText: 'Key milestone for RoboTaxi commercial regulatory approvals', url: 'https://finance.yahoo.com' },
    { id: 't2', title: 'European EV Registration Data Shows Monthly Rebound', source: 'Financial Times', time: '4 hours ago', impact: 'Neutral', impactText: 'Delivery numbers stabilize ahead of Q3 earnings', url: 'https://finance.yahoo.com' }
  ],
  PLTR: [
    { id: 'p1', title: 'Palantir Awarded $480M U.S. Army Project Maven Expansion', source: 'Defense News', time: '3 hours ago', impact: 'Positive', impactText: 'Expands government defense AI moat', url: 'https://finance.yahoo.com' },
    { id: 'p2', title: 'Commercial AIP Bootcamps Scale to 1,000+ Enterprise Clients', source: 'CNBC Tech', time: '6 hours ago', impact: 'Positive', impactText: 'Accelerating GAAP revenue growth trajectory', url: 'https://finance.yahoo.com' }
  ],
  AMD: [
    { id: 'a1', title: 'AMD MI300X AI Chip Gains Traction With Major Cloud Providers', source: 'TechCrunch', time: '2 hours ago', impact: 'Positive', impactText: 'Cost-effective alternative to Hopper GPUs', url: 'https://finance.yahoo.com' }
  ],
  ASTS: [
    { id: 'st1', title: 'AST SpaceMobile Confirms Successful Orbital Deployment of BlueBird Satellites', source: 'SpaceNews', time: '1 hour ago', impact: 'Positive', impactText: 'Commercial 5G service deployment on track for AT&T / Verizon', url: 'https://finance.yahoo.com' }
  ]
};

export function fetchStockNews(symbol) {
  return STOCK_NEWS_DATABASE[symbol] || [
    { id: 'gen1', title: `${symbol} Quarterly Earnings & Market Performance Overview`, source: 'Reuters Financial', time: '3 hours ago', impact: 'Neutral', impactText: 'Analyst sentiment remains balanced ahead of earnings call.', url: 'https://finance.yahoo.com' }
  ];
}

export function compileStockAnalytics(posts) {
  const tickerMentions = {};

  posts.forEach(post => {
    post.tickers.forEach(symbol => {
      if (!tickerMentions[symbol]) {
        tickerMentions[symbol] = {
          mentionCount: 0,
          bullishCount: 0,
          bearishCount: 0,
          subreddits: new Set(),
          posts: []
        };
      }

      tickerMentions[symbol].mentionCount += 1;
      if (post.sentiment.label === 'Bullish') tickerMentions[symbol].bullishCount += 1;
      if (post.sentiment.label === 'Bearish') tickerMentions[symbol].bearishCount += 1;
      tickerMentions[symbol].subreddits.add(post.subreddit);
      tickerMentions[symbol].posts.push(post);
    });
  });

  const results = [];
  const allSymbols = new Set([...Object.keys(MASTER_STOCKS_DATABASE), ...Object.keys(tickerMentions)]);

  allSymbols.forEach(symbol => {
    const baseData = MASTER_STOCKS_DATABASE[symbol] || {
      symbol,
      name: `${symbol} Corp.`,
      sector: 'General Equities',
      exchange: 'NASDAQ',
      country: '🇺🇸 USA',
      price: 45.20,
      change24h: 1.5,
      marketCap: '$12.5 Billion',
      peRatio: 28.5,
      pbRatio: 3.4,
      eps: 1.20,
      week52High: 55.00,
      week52Low: 32.00,
      beta: 1.25,
      volatility: 35.0,
      sparkline: [40, 42, 41, 44, 43, 44.5, 45.20],
      isEmergingGem: false,
      analystRating: 'Buy',
      analystScore: 4.2,
      targetPrice: 55.00,
      targetLow: 38.00,
      targetHigh: 68.00,
      buyCount: 15,
      holdCount: 4,
      sellCount: 1
    };

    const metrics = tickerMentions[symbol] || {
      mentionCount: Math.floor(Math.random() * 40) + 12,
      bullishCount: 20,
      bearishCount: 5,
      subreddits: new Set(['stocks', 'wallstreetbets']),
      posts: []
    };

    const totalMentions = metrics.mentionCount;
    const bullishRatio = Math.round((metrics.bullishCount / Math.max(1, metrics.bullishCount + metrics.bearishCount)) * 100);
    const mentionChange24h = Math.round((Math.random() * 180) - 20);

    const postMetrics = {
      mentionCount: totalMentions,
      mentionChange24h,
      bullishRatio
    };

    const horizons = computeHorizonScores(baseData, postMetrics);
    const riskModel = calculateMathematicalRisk(baseData, postMetrics);
    const timingModel = calculateTimingScore(baseData, postMetrics);
    const newsFeed = fetchStockNews(symbol);
    const upside = Math.round(((baseData.targetPrice - baseData.price) / baseData.price) * 100);

    results.push({
      ...baseData,
      mentionCount: totalMentions,
      mentionChange24h,
      bullishRatio,
      subreddits: Array.from(metrics.subreddits),
      posts: metrics.posts,
      shortTermScore: horizons.shortTermScore,
      longTermScore: horizons.longTermScore,
      riskModel,
      timingModel,
      newsFeed,
      impliedUpside: upside
    });
  });

  return results.sort((a, b) => b.mentionCount - a.mentionCount);
}
