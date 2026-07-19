// Stock Market Data Service, Valuation Engine, Risk Model, Timing Engine, News Stream, Finnhub Live Fetcher & FX Converter

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

// Live Finnhub Quote Fetcher
export async function fetchFinnhubQuote(symbol, apiKey) {
  if (!apiKey) return null;
  try {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.c === 'number' && data.c > 0) {
        return {
          price: parseFloat(data.c.toFixed(2)),
          change24h: parseFloat((data.dp || 0).toFixed(2)),
          high: data.h,
          low: data.l,
          open: data.o
        };
      }
    }
  } catch (err) {
    console.warn(`Finnhub quote fetch fallback for ${symbol}:`, err.message);
  }
  return null;
}

export const MASTER_STOCKS_DATABASE = {
  // --- EUROPEAN E-COMMERCE & TECH ---
  ZAL: {
    symbol: 'ZAL',
    name: 'Zalando SE',
    sector: 'Consumer Discretionary / E-Commerce & Fashion',
    exchange: 'XETRA / Frankfurt',
    country: '🇩🇪 Germany / Europe',
    price: 28.50,
    change24h: 3.40,
    marketCap: '$8.2 Billion (€7.5B)',
    peRatio: 32.4,
    pbRatio: 3.1,
    eps: 0.88,
    week52High: 33.20,
    week52Low: 15.95,
    beta: 1.75,
    volatility: 46.0,
    sparkline: [24, 25, 26, 25.8, 27, 27.8, 28.50],
    isEmergingGem: true,
    gemReason: 'Europe #1 online fashion platform expanding B2B logistics & partner ecosystem margins',
    catalyst: 'B2B logistics ecosystem launch & active customer order recovery across Western Europe',
    downsideRisk: 'European consumer apparel spending discretion',
    analystRating: 'Buy',
    analystScore: 4.4,
    targetPrice: 36.00,
    targetLow: 24.00,
    targetHigh: 45.00,
    buyCount: 18,
    holdCount: 4,
    sellCount: 1
  },
  HFG: {
    symbol: 'HFG',
    name: 'HelloFresh SE',
    sector: 'Consumer Staples / Ready-to-Eat Delivery',
    exchange: 'XETRA / Frankfurt',
    country: '🇩🇪 Germany / Europe',
    price: 11.20,
    change24h: -1.85,
    marketCap: '$2.1 Billion (€1.9B)',
    peRatio: 18.5,
    pbRatio: 1.4,
    eps: 0.61,
    week52High: 28.40,
    week52Low: 5.40,
    beta: 2.10,
    volatility: 68.0,
    sparkline: [8.5, 9.2, 10, 10.5, 11, 11.5, 11.20],
    isEmergingGem: true,
    gemReason: 'Deep turn-around value play: Factor ready-to-eat meals rapidly replacing traditional meal kits',
    catalyst: 'Factor ready-to-eat division scaling to $2B+ annual revenue',
    downsideRisk: 'Legacy meal-kit customer acquisition marketing cost inflation',
    analystRating: 'Moderate Buy',
    analystScore: 3.8,
    targetPrice: 16.50,
    targetLow: 8.00,
    targetHigh: 24.00,
    buyCount: 10,
    holdCount: 8,
    sellCount: 3
  },

  // --- MAJOR INDIAN GROWTH & TECH GIANTS ---
  INFY: {
    symbol: 'INFY',
    name: 'Infosys Limited',
    sector: 'Technology / Global IT & Cloud Services',
    exchange: 'NYSE / NSE India',
    country: '🇮🇳 India / Asia',
    price: 21.80,
    change24h: 2.15,
    marketCap: '$90.5 Billion',
    peRatio: 28.4,
    pbRatio: 8.2,
    eps: 0.77,
    week52High: 23.50,
    week52Low: 16.20,
    beta: 0.88,
    volatility: 22.0,
    sparkline: [19, 19.5, 20, 20.8, 21, 21.4, 21.80],
    isEmergingGem: false,
    catalyst: 'Large enterprise digital transformation contracts & Topaz generative AI suite adoption',
    downsideRisk: 'U.S. & European corporate discretionary IT spending cycles',
    analystRating: 'Buy',
    analystScore: 4.5,
    targetPrice: 26.00,
    targetLow: 20.00,
    targetHigh: 30.00,
    buyCount: 28,
    holdCount: 6,
    sellCount: 1
  },
  IBN: {
    symbol: 'IBN',
    name: 'ICICI Bank Limited',
    sector: 'Financials / Retail & Commercial Banking',
    exchange: 'NYSE / NSE India',
    country: '🇮🇳 India / Asia',
    price: 30.40,
    change24h: 1.65,
    marketCap: '$106.8 Billion',
    peRatio: 19.2,
    pbRatio: 3.1,
    eps: 1.58,
    week52High: 32.10,
    week52Low: 22.80,
    beta: 0.85,
    volatility: 20.5,
    sparkline: [27, 28, 28.5, 29, 29.8, 30.1, 30.40],
    isEmergingGem: false,
    catalyst: 'Industry-leading ROE (18%+) & digital banking credit expansion in India',
    downsideRisk: 'Unsecured retail lending credit cost normalization',
    analystRating: 'Strong Buy',
    analystScore: 4.9,
    targetPrice: 36.00,
    targetLow: 28.00,
    targetHigh: 40.00,
    buyCount: 34,
    holdCount: 2,
    sellCount: 0
  },
  WIT: {
    symbol: 'WIT',
    name: 'Wipro Limited',
    sector: 'Technology / IT Consulting & Cloud Systems',
    exchange: 'NYSE / NSE India',
    country: '🇮🇳 India / Asia',
    price: 6.45,
    change24h: 1.20,
    marketCap: '$33.8 Billion',
    peRatio: 23.5,
    pbRatio: 3.4,
    eps: 0.27,
    week52High: 6.95,
    week52Low: 4.50,
    beta: 0.95,
    volatility: 26.0,
    sparkline: [5.6, 5.8, 6.0, 6.1, 6.3, 6.4, 6.45],
    isEmergingGem: false,
    catalyst: 'Capco financial services integration & cloud transformation deals',
    downsideRisk: 'Consulting margin competition',
    analystRating: 'Hold',
    analystScore: 3.5,
    targetPrice: 7.50,
    targetLow: 5.50,
    targetHigh: 9.00,
    buyCount: 11,
    holdCount: 14,
    sellCount: 5
  },
  HDB: {
    symbol: 'HDB',
    name: 'HDFC Bank Limited',
    sector: 'Financials / Banking',
    exchange: 'NYSE / NSE India',
    country: '🇮🇳 India / Asia',
    price: 64.20,
    change24h: 1.45,
    marketCap: '$162 Billion',
    peRatio: 18.5,
    pbRatio: 2.6,
    eps: 3.47,
    week52High: 71.00,
    week52Low: 52.80,
    beta: 0.92,
    volatility: 22.0,
    sparkline: [59, 60.5, 61, 62, 63, 63.8, 64.20],
    isEmergingGem: false,
    catalyst: 'India GDP 7%+ economic growth & credit expansion supercycle',
    downsideRisk: 'Post-merger deposit growth cost stabilization',
    analystRating: 'Buy',
    analystScore: 4.6,
    targetPrice: 78.00,
    targetLow: 62.00,
    targetHigh: 90.00,
    buyCount: 25,
    holdCount: 3,
    sellCount: 0
  },

  // --- EUROPEAN DEFENSE GIANTS ---
  RHM: {
    symbol: 'RHM',
    name: 'Rheinmetall AG',
    sector: 'Industrials / European Defense & Ammunition',
    exchange: 'XETRA / Frankfurt',
    country: '🇩🇪 Germany / Europe',
    price: 535.40,
    change24h: 3.85,
    marketCap: '$25.2 Billion (€23.2B)',
    peRatio: 38.2,
    pbRatio: 7.4,
    eps: 14.01,
    week52High: 571.00,
    week52Low: 232.00,
    beta: 1.25,
    volatility: 42.0,
    sparkline: [480, 500, 510, 520, 515, 528, 535.40],
    isEmergingGem: true,
    gemReason: 'Europe #1 defense contractor surge driven by NATO 2%+ GDP defense spend mandates',
    catalyst: 'Ammunition & Panther tank backlog expansion & European defense re-armament',
    downsideRisk: 'Defense procurement timing shifts & supply chain material constraints',
    analystRating: 'Strong Buy',
    analystScore: 4.9,
    targetPrice: 640.00,
    targetLow: 520.00,
    targetHigh: 720.00,
    buyCount: 20,
    holdCount: 2,
    sellCount: 0
  },
  BAESY: {
    symbol: 'BAESY',
    name: 'BAE Systems plc',
    sector: 'Industrials / Defense & Aerospace',
    exchange: 'OTC / LSE (BA)',
    country: '🇬🇧 UK / Europe',
    price: 68.50,
    change24h: 1.45,
    marketCap: '$52.4 Billion (£41B)',
    peRatio: 19.8,
    pbRatio: 3.6,
    eps: 3.46,
    week52High: 74.20,
    week52Low: 48.90,
    beta: 0.72,
    volatility: 21.5,
    sparkline: [63, 64.5, 65, 66.2, 67, 67.8, 68.50],
    isEmergingGem: false,
    catalyst: 'Global AUKUS submarine program & European combat air system backlog',
    downsideRisk: 'UK government budget allocation changes',
    analystRating: 'Buy',
    analystScore: 4.6,
    targetPrice: 82.00,
    targetLow: 65.00,
    targetHigh: 92.00,
    buyCount: 18,
    holdCount: 3,
    sellCount: 0
  },
  SAAB: {
    symbol: 'SAAB',
    name: 'Saab AB',
    sector: 'Industrials / Aerospace & Defense Systems',
    exchange: 'Nasdaq Stockholm (SAAB-B)',
    country: '🇸🇪 Sweden / Europe',
    price: 228.60,
    change24h: 4.10,
    marketCap: '$14.5 Billion (SEK 152B)',
    peRatio: 34.2,
    pbRatio: 4.8,
    eps: 6.68,
    week52High: 254.00,
    week52Low: 118.00,
    beta: 1.12,
    volatility: 38.0,
    sparkline: [205, 210, 215, 220, 218, 224, 228.60],
    isEmergingGem: true,
    gemReason: 'Sweden NATO accession driving massive order backlog for Gripen fighter jets & NLAW systems',
    catalyst: 'NATO Nordic defense integration & anti-tank missile exports',
    downsideRisk: 'Production capacity scaling constraints',
    analystRating: 'Strong Buy',
    analystScore: 4.7,
    targetPrice: 275.00,
    targetLow: 210.00,
    targetHigh: 310.00,
    buyCount: 15,
    holdCount: 2,
    sellCount: 0
  },

  // --- SWISS PHARMA GIANTS ---
  RHHBY: {
    symbol: 'RHHBY',
    name: 'Roche Holding AG',
    sector: 'Healthcare / Pharmaceuticals & Diagnostics',
    exchange: 'OTC / SIX Swiss Exchange (ROG)',
    country: '🇨🇭 Switzerland / Europe',
    price: 36.80,
    change24h: 1.15,
    marketCap: '$242 Billion (CHF 215B)',
    peRatio: 17.2,
    pbRatio: 6.4,
    eps: 2.14,
    week52High: 41.50,
    week52Low: 29.80,
    beta: 0.52,
    volatility: 19.5,
    sparkline: [33.5, 34, 35, 35.8, 36, 36.4, 36.80],
    isEmergingGem: false,
    catalyst: 'Oncology pipeline & Vabysmo eye disease drug blockbuster acceleration',
    downsideRisk: 'Biosimilar competition for legacy oncology drugs',
    analystRating: 'Buy',
    analystScore: 4.4,
    targetPrice: 44.00,
    targetLow: 35.00,
    targetHigh: 50.00,
    buyCount: 19,
    holdCount: 7,
    sellCount: 0
  },
  NVO: {
    symbol: 'NVO',
    name: 'Novo Nordisk A/S',
    sector: 'Healthcare / Pharmaceuticals',
    exchange: 'NYSE / Euronext Copenhagen',
    country: '🇩🇰 Denmark / Europe',
    price: 132.40,
    change24h: 1.85,
    marketCap: '$592 Billion',
    peRatio: 38.6,
    pbRatio: 32.1,
    eps: 3.43,
    week52High: 147.15,
    week52Low: 88.50,
    beta: 0.65,
    volatility: 24.0,
    sparkline: [124, 126, 128, 127, 130, 131, 132.40],
    isEmergingGem: false,
    catalyst: 'Ozempic & Wegovy GLP-1 weight-loss drug monopoly expansion',
    downsideRisk: 'Compounding pharmacy competition & Medicare price negotiations',
    analystRating: 'Buy',
    analystScore: 4.6,
    targetPrice: 158.00,
    targetLow: 125.00,
    targetHigh: 180.00,
    buyCount: 24,
    holdCount: 5,
    sellCount: 1
  },
  ASML: {
    symbol: 'ASML',
    name: 'ASML Holding N.V.',
    sector: 'Technology / Semiconductor Equipment',
    exchange: 'NASDAQ / Euronext',
    country: '🇳🇱 Netherlands / Europe',
    price: 845.20,
    change24h: 2.10,
    marketCap: '$338 Billion',
    peRatio: 42.5,
    pbRatio: 21.4,
    eps: 19.88,
    week52High: 1056.34,
    week52Low: 564.00,
    beta: 1.45,
    volatility: 36.2,
    sparkline: [790, 810, 805, 825, 830, 840, 845.20],
    isEmergingGem: false,
    catalyst: 'Monopoly on EUV (Extreme Ultraviolet) lithography machines globally',
    downsideRisk: 'China export restriction guidelines & chip cycle inventory digest',
    analystRating: 'Strong Buy',
    analystScore: 4.7,
    targetPrice: 1020.00,
    targetLow: 800.00,
    targetHigh: 1200.00,
    buyCount: 28,
    holdCount: 3,
    sellCount: 0
  },
  LVMUY: {
    symbol: 'LVMUY',
    name: 'LVMH Moët Hennessy Louis Vuitton',
    sector: 'Consumer Discretionary / Luxury Goods',
    exchange: 'OTC / Euronext Paris (MC)',
    country: '🇫🇷 France / Europe',
    price: 138.50,
    change24h: 2.85,
    marketCap: '$345 Billion (€318B)',
    peRatio: 22.4,
    pbRatio: 5.6,
    eps: 6.18,
    week52High: 182.00,
    week52Low: 118.40,
    beta: 0.98,
    volatility: 28.0,
    sparkline: [126, 128, 131, 133, 135, 137, 138.50],
    isEmergingGem: true,
    gemReason: 'World #1 luxury conglomerate with iconic brands (Louis Vuitton, Dior, Tiffany)',
    catalyst: 'China stimulus rebound in high-end luxury spending & European tourism',
    downsideRisk: 'Aspirational consumer slowdown & FX rate headwinds',
    analystRating: 'Strong Buy',
    analystScore: 4.8,
    targetPrice: 175.00,
    targetLow: 130.00,
    targetHigh: 200.00,
    buyCount: 29,
    holdCount: 4,
    sellCount: 0
  },
  SAP: {
    symbol: 'SAP',
    name: 'SAP SE',
    sector: 'Technology / Enterprise ERP Software',
    exchange: 'NYSE / XETRA',
    country: '🇩🇪 Germany / Europe',
    price: 214.80,
    change24h: 1.25,
    marketCap: '$252 Billion',
    peRatio: 45.2,
    pbRatio: 5.8,
    eps: 4.75,
    week52High: 222.50,
    week52Low: 132.10,
    beta: 1.08,
    volatility: 22.5,
    sparkline: [202, 206, 208, 210, 212, 213.5, 214.80],
    isEmergingGem: false,
    catalyst: 'Cloud ERP migration & Business AI suite integration',
    downsideRisk: 'Macro corporate IT spending deceleration',
    analystRating: 'Buy',
    analystScore: 4.4,
    targetPrice: 240.00,
    targetLow: 195.00,
    targetHigh: 270.00,
    buyCount: 21,
    holdCount: 6,
    sellCount: 0
  },
  SIEGY: {
    symbol: 'SIEGY',
    name: 'Siemens AG',
    sector: 'Industrials / Automation & Smart Infrastructure',
    exchange: 'OTC / XETRA (SIE)',
    country: '🇩🇪 Germany / Europe',
    price: 98.40,
    change24h: 1.60,
    marketCap: '$158 Billion',
    peRatio: 17.5,
    pbRatio: 2.4,
    eps: 5.62,
    week52High: 108.00,
    week52Low: 72.50,
    beta: 1.15,
    volatility: 23.5,
    sparkline: [91, 93, 94, 95.5, 96, 97.2, 98.40],
    isEmergingGem: false,
    catalyst: 'Industrial software, grid electrification & factory automation backlog',
    downsideRisk: 'Global industrial manufacturing order slowdown',
    analystRating: 'Buy',
    analystScore: 4.5,
    targetPrice: 118.00,
    targetLow: 90.00,
    targetHigh: 135.00,
    buyCount: 18,
    holdCount: 4,
    sellCount: 0
  },
  AIR: {
    symbol: 'AIR',
    name: 'Airbus SE',
    sector: 'Industrials / Commercial Aviation & Defense',
    exchange: 'Euronext Paris / XETRA',
    country: '🇫🇷 France / Europe',
    price: 142.10,
    change24h: -0.75,
    marketCap: '$122 Billion (€112B)',
    peRatio: 28.2,
    pbRatio: 6.8,
    eps: 5.04,
    week52High: 172.00,
    week52Low: 124.00,
    beta: 1.25,
    volatility: 29.0,
    sparkline: [148, 146, 145, 144, 143, 142.5, 142.10],
    isEmergingGem: false,
    catalyst: 'A320neo order backlog expansion while Boeing faces supply issues',
    downsideRisk: 'Supply chain engine bottlenecks & commercial delivery delays',
    analystRating: 'Buy',
    analystScore: 4.4,
    targetPrice: 165.00,
    targetLow: 135.00,
    targetHigh: 190.00,
    buyCount: 22,
    holdCount: 6,
    sellCount: 1
  },

  // --- ASIAN GIANTS ---
  TSM: {
    symbol: 'TSM',
    name: 'Taiwan Semiconductor Manufacturing',
    sector: 'Technology / Foundry Semiconductors',
    exchange: 'NYSE / TAIEX',
    country: '🇹🇼 Taiwan / Asia',
    price: 186.50,
    change24h: 4.15,
    marketCap: '$967 Billion',
    peRatio: 31.8,
    pbRatio: 7.2,
    eps: 5.86,
    week52High: 193.00,
    week52Low: 84.80,
    beta: 1.22,
    volatility: 32.0,
    sparkline: [168, 172, 175, 178, 182, 184, 186.50],
    isEmergingGem: true,
    gemReason: 'Sole manufacturer of 3nm/2nm chips for Apple, NVIDIA, and AMD',
    catalyst: 'Global AI semiconductor manufacturing monopoly & 3nm yield scaling',
    downsideRisk: 'Geopolitical cross-strait tension & fab expansion capex',
    analystRating: 'Strong Buy',
    analystScore: 4.9,
    targetPrice: 225.00,
    targetLow: 170.00,
    targetHigh: 260.00,
    buyCount: 35,
    holdCount: 2,
    sellCount: 0
  },
  SONY: {
    symbol: 'SONY',
    name: 'Sony Group Corporation',
    sector: 'Consumer Electronics / Entertainment',
    exchange: 'NYSE / Tokyo',
    country: '🇯🇵 Japan / Asia',
    price: 92.30,
    change24h: 2.40,
    marketCap: '$114 Billion',
    peRatio: 18.2,
    pbRatio: 2.2,
    eps: 5.07,
    week52High: 98.50,
    week52Low: 77.20,
    beta: 0.95,
    volatility: 23.0,
    sparkline: [86, 88, 87, 89, 90, 91.5, 92.30],
    isEmergingGem: true,
    gemReason: 'PlayStation 5 Pro ecosystem momentum & music/anime IP monetization',
    catalyst: 'PS5 Pro launch & image sensor supply for flagship smartphones',
    downsideRisk: 'Foreign exchange JPY volatility & gaming hardware margins',
    analystRating: 'Strong Buy',
    analystScore: 4.7,
    targetPrice: 115.00,
    targetLow: 88.00,
    targetHigh: 135.00,
    buyCount: 19,
    holdCount: 2,
    sellCount: 0
  },
  TM: {
    symbol: 'TM',
    name: 'Toyota Motor Corporation',
    sector: 'Consumer Discretionary / Automotive & Hybrids',
    exchange: 'NYSE / Tokyo (7203)',
    country: '🇯🇵 Japan / Asia',
    price: 178.60,
    change24h: 1.80,
    marketCap: '$242 Billion',
    peRatio: 7.8,
    pbRatio: 0.95,
    eps: 22.90,
    week52High: 254.00,
    week52Low: 162.00,
    beta: 0.78,
    volatility: 24.5,
    sparkline: [168, 170, 173, 172, 175, 177, 178.60],
    isEmergingGem: false,
    catalyst: 'Global consumer preference shift toward Hybrid vehicles & deep value P/E of 7.8x',
    downsideRisk: 'Japan Yen exchange rate fluctuations & EV transition capex',
    analystRating: 'Buy',
    analystScore: 4.4,
    targetPrice: 215.00,
    targetLow: 170.00,
    targetHigh: 250.00,
    buyCount: 17,
    holdCount: 4,
    sellCount: 0
  },
  BABA: {
    symbol: 'BABA',
    name: 'Alibaba Group Holding Ltd.',
    sector: 'Consumer Discretionary / E-Commerce & Cloud',
    exchange: 'NYSE / HKEX',
    country: '🇨🇳 China / Asia',
    price: 84.50,
    change24h: 3.65,
    marketCap: '$204 Billion',
    peRatio: 14.8,
    pbRatio: 1.4,
    eps: 5.71,
    week52High: 117.50,
    week52Low: 68.00,
    beta: 0.82,
    volatility: 44.0,
    sparkline: [74, 76, 78, 79, 81, 83, 84.50],
    isEmergingGem: true,
    gemReason: 'Deep value P/E of 14x with massive China fiscal stimulus & cloud AI re-acceleration',
    catalyst: 'China central bank stimulus package & Cloud Intelligence monetization',
    downsideRisk: 'Domestic e-commerce price competition & regulatory shifts',
    analystRating: 'Buy',
    analystScore: 4.3,
    targetPrice: 118.00,
    targetLow: 80.00,
    targetHigh: 150.00,
    buyCount: 26,
    holdCount: 8,
    sellCount: 1
  },
  TCEHY: {
    symbol: 'TCEHY',
    name: 'Tencent Holdings Ltd.',
    sector: 'Communication Services / Gaming & WeChat',
    exchange: 'OTC / HKEX (0700)',
    country: '🇨🇳 China / Asia',
    price: 52.80,
    change24h: 2.70,
    marketCap: '$485 Billion',
    peRatio: 21.6,
    pbRatio: 3.8,
    eps: 2.44,
    week52High: 62.00,
    week52Low: 34.50,
    beta: 0.88,
    volatility: 38.0,
    sparkline: [46, 48, 49, 50.5, 51, 52, 52.80],
    isEmergingGem: true,
    gemReason: 'World #1 video game publisher with WeChat ecosystem monetization',
    catalyst: 'New flagship game approvals & AI cloud advertising efficiency',
    downsideRisk: 'China gaming time regulation & macroeconomic consumer spending',
    analystRating: 'Strong Buy',
    analystScore: 4.8,
    targetPrice: 68.00,
    targetLow: 50.00,
    targetHigh: 82.00,
    buyCount: 32,
    holdCount: 3,
    sellCount: 0
  },

  // --- US GIANTS ---
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
  ZAL: [
    { id: 'zal1', title: 'Zalando Partner Program Revenue Grows as Active Customers Rebound', source: 'Handelsblatt', time: '1 hour ago', impact: 'Positive', impactText: 'European fashion e-commerce margin expansion', url: 'https://finance.yahoo.com' }
  ],
  HFG: [
    { id: 'hfg1', title: 'HelloFresh Factor Ready-To-Eat Division Reaches $2B Revenue Benchmark', source: 'FAZ Germany', time: '2 hours ago', impact: 'Positive', impactText: 'Ready-to-eat meals driving US and European profitability turnaround', url: 'https://finance.yahoo.com' }
  ],
  INFY: [
    { id: 'infy1', title: 'Infosys Signs $1.5B Generative AI Enterprise Cloud Agreement', source: 'Economic Times India', time: '2 hours ago', impact: 'Positive', impactText: 'Topaz AI platform adoption driving multi-year IT services deals', url: 'https://finance.yahoo.com' }
  ]
};

export function fetchStockNews(symbol) {
  return STOCK_NEWS_DATABASE[symbol] || [
    { id: 'gen1', title: `${symbol} Global Market & Earnings Performance Overview`, source: 'Reuters Financial', time: '3 hours ago', impact: 'Neutral', impactText: 'Analyst sentiment remains balanced ahead of earnings call.', url: 'https://finance.yahoo.com' }
  ];
}

export function compileStockAnalytics(posts, finnhubApiKey = null) {
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
      country: '🌐 International',
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
