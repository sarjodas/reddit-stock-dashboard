// Stock Market Data Service, Valuation Engine, Risk Model, Timing Engine, News Stream, Finnhub Live Fetcher & Broker Availability (Scalable Capital, Trading 212, Revolut)
import { computeValueSignal } from './valueSignal';

export const DEFAULT_USD_EUR_RATE = 0.92; // 1 USD = 0.92 EUR
export const DEFAULT_USD_INR_RATE = 84.50; // 1 USD = 84.50 INR

export async function fetchUSDEURRate() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        return {
          eur: parseFloat((data.rates.EUR || DEFAULT_USD_EUR_RATE).toFixed(4)),
          inr: parseFloat((data.rates.INR || DEFAULT_USD_INR_RATE).toFixed(2))
        };
      }
    }
  } catch (err) {
    console.warn('FX rate live fetch fallback used:', err.message);
  }
  return { eur: DEFAULT_USD_EUR_RATE, inr: DEFAULT_USD_INR_RATE };
}

export function formatCurrency(amount, currencyMode = 'DUAL', fxRates = { eur: DEFAULT_USD_EUR_RATE, inr: DEFAULT_USD_INR_RATE }, nativeCurrency = 'USD') {
  if (typeof amount !== 'number' || isNaN(amount)) return '€0.00';
  
  const eurRate = typeof fxRates === 'object' ? (fxRates.eur || DEFAULT_USD_EUR_RATE) : (fxRates || DEFAULT_USD_EUR_RATE);
  const inrRate = typeof fxRates === 'object' ? (fxRates.inr || DEFAULT_USD_INR_RATE) : DEFAULT_USD_INR_RATE;

  let usdAmount, eurAmount, inrAmount;

  if (nativeCurrency === 'EUR') {
    eurAmount = amount;
    usdAmount = amount / (eurRate || 0.92);
    inrAmount = usdAmount * inrRate;
  } else if (nativeCurrency === 'INR') {
    inrAmount = amount;
    usdAmount = amount / (inrRate || 83.5);
    eurAmount = usdAmount * eurRate;
  } else if (nativeCurrency === 'GBP') {
    usdAmount = amount / 0.79;
    eurAmount = usdAmount * eurRate;
    inrAmount = usdAmount * inrRate;
  } else {
    usdAmount = amount;
    eurAmount = usdAmount * eurRate;
    inrAmount = usdAmount * inrRate;
  }

  const eurStr = `€${eurAmount.toFixed(2)}`;
  const usdStr = `$${usdAmount.toFixed(2)}`;
  const inrStr = `₹${inrAmount.toFixed(2)}`;

  if (currencyMode === 'EUR') return eurStr;
  if (currencyMode === 'INR') return inrStr;
  if (currencyMode === 'USD') return usdStr;

  if (nativeCurrency === 'EUR') return `${eurStr} (${usdStr})`;
  if (nativeCurrency === 'INR') return `${inrStr} (${eurStr})`;
  if (nativeCurrency === 'GBP') return `£${amount.toFixed(2)} (${eurStr})`;
  return `${usdStr} (${eurStr})`;
}

// Live Yahoo Finance Quote Fetcher (Open endpoint - no API key required)
export async function fetchLiveYahooQuote(symbol) {
  const yahooSymbolMap = {
    DHER: 'DHER.DE',
    RHM: 'RHM.DE',
    ZAL: 'ZAL.DE',
    HFG: 'HFG.DE',
    SAP: 'SAP.DE',
    ASML: 'ASML.AS',
    RELIANCE: 'RELIANCE.NS',
    TCS: 'TCS.NS',
    TATAMOTORS: 'TATAMOTORS.NS'
  };

  const targetSymbol = yahooSymbolMap[symbol] || symbol;

  try {
    const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${targetSymbol}`);
    if (res.ok) {
      const data = await res.json();
      const meta = data?.chart?.result?.[0]?.meta;
      if (meta && typeof meta.regularMarketPrice === 'number' && meta.regularMarketPrice > 0) {
        const price = meta.regularMarketPrice;
        const prevClose = meta.previousClose || price;
        const changePct = ((price - prevClose) / prevClose) * 100;
        return {
          price: parseFloat(price.toFixed(2)),
          change24h: parseFloat(changePct.toFixed(2)),
          high: meta.regularMarketDayHigh || price,
          low: meta.regularMarketDayLow || price,
          open: prevClose
        };
      }
    }
  } catch (err) {
    console.warn(`Yahoo live fetch fallback for ${symbol}:`, err.message);
  }
  return null;
}

// Live Finnhub Quote Fetcher
export async function fetchFinnhubQuote(symbol, apiKey) {
  if (!apiKey) return null;
  
  const finnhubSymbolMap = {
    DHER: 'DHER.DE',
    RHM: 'RHM.DE',
    ZAL: 'ZAL.DE',
    HFG: 'HFG.DE',
    SAP: 'SAP.DE',
    AIR: 'AIR.PA',
    ASML: 'ASML.AS'
  };

  const querySymbol = finnhubSymbolMap[symbol] || symbol;

  try {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${querySymbol}&token=${apiKey}`);
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
  // --- EUROPEAN STOCKS (Native EUR €) ---
  DHER: {
    symbol: 'DHER',
    name: 'Delivery Hero SE',
    sector: 'Consumer Discretionary / Online Delivery',
    exchange: 'XETRA / Frankfurt (DHER.DE)',
    country: '🇩🇪 Germany / Europe',
    nativeCurrency: 'EUR',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    price: 27.80,
    change24h: 1.85,
    marketCap: '€7.8 Billion',
    peRatio: -14.74,
    pbRatio: 2.8,
    eps: -1.72,
    week52High: 38.50,
    week52Low: 15.20,
    beta: 1.85,
    volatility: 52.0,
    sparkline: [22.5, 23.8, 24.5, 25.2, 26.1, 27.0, 27.80],
    isEmergingGem: true,
    gemReason: 'Leading European & Asian food delivery network with free cash flow inflection',
    catalyst: 'Glovo & Foodpanda market expansion and positive adjusted EBITDA acceleration',
    downsideRisk: 'European tech delivery price competition & quick-commerce debt obligations',
    analystRating: 'Buy',
    analystScore: 4.3,
    targetPrice: 36.50,
    targetLow: 21.90,
    targetHigh: 45.35,
    buyCount: 16,
    holdCount: 5,
    sellCount: 1
  },
  ZAL: {
    symbol: 'ZAL',
    name: 'Zalando SE',
    sector: 'Consumer Discretionary / E-Commerce & Fashion',
    exchange: 'XETRA / Frankfurt (ZAL.DE)',
    country: '🇩🇪 Germany / Europe',
    nativeCurrency: 'EUR',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    price: 28.50,
    change24h: 2.40,
    marketCap: '€7.4 Billion',
    peRatio: 32.4,
    pbRatio: 3.1,
    eps: 0.88,
    week52High: 36.10,
    week52Low: 17.30,
    beta: 1.75,
    volatility: 46.0,
    sparkline: [24, 25, 26, 25.8, 27, 27.8, 28.50],
    isEmergingGem: true,
    gemReason: 'Europe #1 online fashion platform expanding B2B logistics & partner ecosystem margins',
    catalyst: 'B2B logistics ecosystem launch & active customer order recovery across Western Europe',
    downsideRisk: 'European consumer apparel spending discretion',
    analystRating: 'Buy',
    analystScore: 4.4,
    targetPrice: 37.10,
    targetLow: 24.10,
    targetHigh: 45.90,
    buyCount: 18,
    holdCount: 4,
    sellCount: 1
  },
  HFG: {
    symbol: 'HFG',
    name: 'HelloFresh SE',
    sector: 'Consumer Staples / Ready-to-Eat Delivery',
    exchange: 'XETRA / Frankfurt (HFG.DE)',
    country: '🇩🇪 Germany / Europe',
    nativeCurrency: 'EUR',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    price: 11.20,
    change24h: -1.85,
    marketCap: '€1.8 Billion',
    peRatio: 18.5,
    pbRatio: 1.4,
    eps: 0.61,
    week52High: 30.85,
    week52Low: 5.85,
    beta: 2.10,
    volatility: 68.0,
    sparkline: [8.5, 9.2, 10, 10.5, 11, 11.5, 11.20],
    isEmergingGem: true,
    gemReason: 'Deep turn-around value play: Factor ready-to-eat meals rapidly replacing traditional meal kits',
    catalyst: 'Factor ready-to-eat division scaling to $2B+ annual revenue',
    downsideRisk: 'Legacy meal-kit customer acquisition marketing cost inflation',
    analystRating: 'Moderate Buy',
    analystScore: 3.8,
    targetPrice: 16.95,
    targetLow: 8.70,
    targetHigh: 24.10,
    buyCount: 10,
    holdCount: 8,
    sellCount: 3
  },
  ASML: {
    symbol: 'ASML',
    name: 'ASML Holding N.V.',
    sector: 'Technology / Semiconductor Equipment',
    exchange: 'NASDAQ / Euronext (ASML.AS)',
    country: '🇳🇱 Netherlands / Europe',
    nativeCurrency: 'EUR',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    price: 845.20,
    change24h: 2.10,
    marketCap: '€338 Billion',
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
  RHM: {
    symbol: 'RHM',
    name: 'Rheinmetall AG',
    sector: 'Industrials / European Defense & Ammunition',
    exchange: 'XETRA / Frankfurt (RHM.DE)',
    country: '🇩🇪 Germany / Europe',
    nativeCurrency: 'EUR',
    brokers: ['Scalable', 'Trading 212'],
    price: 582.00,
    change24h: 3.85,
    marketCap: '€25.2 Billion',
    peRatio: 38.2,
    pbRatio: 7.4,
    eps: 14.01,
    week52High: 620.65,
    week52Low: 252.15,
    beta: 1.25,
    volatility: 42.0,
    sparkline: [480, 500, 510, 520, 515, 528, 582.00],
    isEmergingGem: true,
    gemReason: 'Europe #1 defense contractor surge driven by NATO 2%+ GDP defense spend mandates',
    catalyst: 'Ammunition & Panther tank backlog expansion & European defense re-armament',
    downsideRisk: 'Defense procurement timing shifts & supply chain material constraints',
    analystRating: 'Strong Buy',
    analystScore: 4.9,
    targetPrice: 695.65,
    targetLow: 565.20,
    targetHigh: 782.60,
    buyCount: 20,
    holdCount: 2,
    sellCount: 0
  },
  NVO: {
    symbol: 'NVO',
    name: 'Novo Nordisk A/S',
    sector: 'Healthcare / Pharmaceuticals',
    exchange: 'NYSE / Euronext Copenhagen',
    country: '🇩🇰 Denmark / Europe',
    nativeCurrency: 'USD',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    price: 118.40,
    change24h: 1.85,
    marketCap: '$525 Billion',
    peRatio: 34.6,
    pbRatio: 28.1,
    eps: 3.43,
    week52High: 147.15,
    week52Low: 88.50,
    beta: 0.65,
    volatility: 24.0,
    sparkline: [104, 106, 110, 112, 115, 117, 118.40],
    isEmergingGem: false,
    catalyst: 'Ozempic & Wegovy GLP-1 weight-loss drug monopoly expansion',
    downsideRisk: 'Compounding pharmacy competition & Medicare price negotiations',
    analystRating: 'Buy',
    analystScore: 4.6,
    targetPrice: 145.00,
    targetLow: 105.00,
    targetHigh: 165.00,
    buyCount: 24,
    holdCount: 5,
    sellCount: 1
  },
  SAP: {
    symbol: 'SAP',
    name: 'SAP SE',
    sector: 'Technology / Enterprise ERP Software',
    exchange: 'NYSE / XETRA (SAP.DE)',
    country: '🇩🇪 Germany / Europe',
    nativeCurrency: 'EUR',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    price: 212.50,
    change24h: 1.25,
    marketCap: '€248 Billion',
    peRatio: 42.2,
    pbRatio: 5.2,
    eps: 4.75,
    week52High: 222.85,
    week52Low: 143.60,
    beta: 1.08,
    volatility: 22.5,
    sparkline: [192, 196, 200, 204, 208, 210, 212.50],
    isEmergingGem: false,
    catalyst: 'Cloud ERP migration & Business AI suite integration',
    downsideRisk: 'Macro corporate IT spending deceleration',
    analystRating: 'Buy',
    analystScore: 4.4,
    targetPrice: 245.00,
    targetLow: 195.00,
    targetHigh: 270.00,
    buyCount: 21,
    holdCount: 6,
    sellCount: 0
  },

  // --- INDIAN MARKET GIANTS ---
  RELIANCE: {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Limited',
    sector: 'Conglomerate / Telecom Jio, Retail & Energy',
    exchange: 'NSE / BSE India (RIGD)',
    country: '🇮🇳 India / Asia',
    nativeCurrency: 'INR',
    brokers: ['Interactive Brokers', 'Trading 212 (GDR)'],
    price: 34.20,
    change24h: 3.15,
    marketCap: '₹20 Lakh Cr ($242B)',
    peRatio: 24.8,
    pbRatio: 2.2,
    eps: 1.38,
    week52High: 38.50,
    week52Low: 26.40,
    beta: 0.92,
    volatility: 22.5,
    sparkline: [30, 31.5, 32, 32.8, 33, 33.6, 34.20],
    isEmergingGem: true,
    gemReason: 'India #1 mega-conglomerate driving Telecom Jio 5G, Retail network expansion & New Energy solar mega-fabs',
    catalyst: 'Jio Telecom & Reliance Retail upcoming IPO value-unlocking spin-offs',
    downsideRisk: 'Oil-to-chemicals (O2C) refining margin cyclicality',
    analystRating: 'Strong Buy',
    analystScore: 4.9,
    targetPrice: 42.00,
    targetLow: 32.00,
    targetHigh: 50.00,
    buyCount: 36,
    holdCount: 3,
    sellCount: 0
  },
  TCS: {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    sector: 'Technology / Global IT Services & Cloud',
    exchange: 'NSE / BSE India (TTNQY)',
    country: '🇮🇳 India / Asia',
    nativeCurrency: 'INR',
    brokers: ['Interactive Brokers', 'Trading 212 (ADR)'],
    price: 52.40,
    change24h: 1.85,
    marketCap: '₹15 Lakh Cr ($188B)',
    peRatio: 31.2,
    pbRatio: 12.4,
    eps: 1.68,
    week52High: 56.80,
    week52Low: 42.10,
    beta: 0.76,
    volatility: 19.5,
    sparkline: [47, 48.5, 49, 50.2, 51, 51.8, 52.40],
    isEmergingGem: false,
    catalyst: 'Industry-best operating margins (25%+) & $10B+ annual TCV deal wins across US & Europe',
    downsideRisk: 'Global BFSI discretionary IT budget allocation slowdown',
    analystRating: 'Buy',
    analystScore: 4.6,
    targetPrice: 62.00,
    targetLow: 50.00,
    targetHigh: 70.00,
    buyCount: 29,
    holdCount: 7,
    sellCount: 1
  },
  TATAMOTORS: {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Limited',
    sector: 'Consumer Discretionary / EV & Jaguar Land Rover',
    exchange: 'NSE / BSE India (TTM)',
    country: '🇮🇳 India / Asia',
    nativeCurrency: 'INR',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    price: 11.80,
    change24h: 4.50,
    marketCap: '₹3.6 Lakh Cr ($44.5B)',
    peRatio: 11.4,
    pbRatio: 2.8,
    eps: 1.03,
    week52High: 14.20,
    week52Low: 7.20,
    beta: 1.65,
    volatility: 38.0,
    sparkline: [9.2, 9.8, 10.2, 10.8, 11.1, 11.5, 11.80],
    isEmergingGem: true,
    gemReason: '70%+ EV market share in India combined with Jaguar Land Rover free cash flow record highs',
    catalyst: 'India EV passenger vehicle market surge & commercial vehicle de-merger unlock',
    downsideRisk: 'UK/Europe Jaguar Land Rover luxury export macro demand',
    analystRating: 'Strong Buy',
    analystScore: 4.8,
    targetPrice: 15.50,
    targetLow: 10.50,
    targetHigh: 18.00,
    buyCount: 24,
    holdCount: 3,
    sellCount: 0
  },

  // --- ASIAN GIANTS ---
  TSM: {
    symbol: 'TSM',
    name: 'Taiwan Semiconductor Manufacturing',
    sector: 'Technology / Foundry Semiconductors',
    exchange: 'NYSE / TAIEX',
    country: '🇹🇼 Taiwan / Asia',
    nativeCurrency: 'USD',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    price: 192.50,
    change24h: 4.15,
    marketCap: '$998 Billion',
    peRatio: 31.8,
    pbRatio: 7.2,
    eps: 6.05,
    week52High: 205.84,
    week52Low: 118.80,
    beta: 1.22,
    volatility: 32.0,
    sparkline: [175, 178, 182, 185, 188, 190, 192.50],
    isEmergingGem: true,
    gemReason: 'Sole manufacturer of 3nm/2nm chips for Apple, NVIDIA, and AMD',
    catalyst: 'Global AI semiconductor manufacturing monopoly & 3nm yield scaling',
    downsideRisk: 'Geopolitical cross-strait tension & fab expansion capex',
    analystRating: 'Strong Buy',
    analystScore: 4.9,
    targetPrice: 225.00,
    targetLow: 175.00,
    targetHigh: 260.00,
    buyCount: 35,
    holdCount: 2,
    sellCount: 0
  },

  // --- US GIANTS ---
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Technology / Semiconductors',
    exchange: 'NASDAQ',
    country: '🇺🇸 USA',
    nativeCurrency: 'USD',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    price: 134.80,
    change24h: 3.82,
    marketCap: '$3.31 Trillion',
    peRatio: 52.4,
    pbRatio: 38.2,
    eps: 2.57,
    week52High: 140.76,
    week52Low: 75.60,
    beta: 1.68,
    volatility: 42.5,
    sparkline: [122, 125, 128, 126, 130, 132, 134.80],
    isEmergingGem: false,
    catalyst: 'Next-gen Blackwell AI GPU dominance & hyperscaler capex growth',
    downsideRisk: 'Export restriction risks & high valuation multiple expansion',
    analystRating: 'Strong Buy',
    analystScore: 4.8,
    targetPrice: 165.00,
    targetLow: 125.00,
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
    nativeCurrency: 'USD',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    price: 242.50,
    change24h: 5.14,
    marketCap: '$775 Billion',
    peRatio: 64.2,
    pbRatio: 12.8,
    eps: 3.77,
    week52High: 271.00,
    week52Low: 138.80,
    beta: 2.15,
    volatility: 54.0,
    sparkline: [215, 220, 230, 228, 235, 238, 242.50],
    isEmergingGem: false,
    catalyst: 'RoboTaxi commercial launch & FSD v13 autonomous miles expansion',
    downsideRisk: 'Automotive margin compression and intense EV competition',
    analystRating: 'Hold',
    analystScore: 3.4,
    targetPrice: 265.00,
    targetLow: 135.00,
    targetHigh: 380.00,
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
    nativeCurrency: 'USD',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    price: 65.40,
    change24h: 6.45,
    marketCap: '$146 Billion',
    peRatio: 112.5,
    pbRatio: 22.4,
    eps: 0.58,
    week52High: 70.20,
    week52Low: 20.48,
    beta: 1.82,
    volatility: 48.2,
    sparkline: [52, 55, 58, 57, 60, 62, 65.40],
    isEmergingGem: true,
    gemReason: 'Unprecedented AIP commercial customer bootcamps & GAAP profitability explosion',
    catalyst: 'U.S. Commercial AIP customer growth surging 100%+ YoY',
    downsideRisk: 'Extremely elevated P/E ratio requires flawless execution',
    analystRating: 'Moderate Buy',
    analystScore: 4.1,
    targetPrice: 75.00,
    targetLow: 45.00,
    targetHigh: 90.00,
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
    nativeCurrency: 'USD',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    price: 138.50,
    change24h: -1.82,
    marketCap: '$224 Billion',
    peRatio: 65.8,
    pbRatio: 4.2,
    eps: 2.10,
    week52High: 227.30,
    week52Low: 110.04,
    beta: 1.74,
    volatility: 46.0,
    sparkline: [145, 142, 140, 139, 138, 137, 138.50],
    isEmergingGem: false,
    catalyst: 'MI300X AI accelerator chip market share gains vs NVIDIA',
    downsideRisk: 'PC market sluggishness & server competition',
    analystRating: 'Strong Buy',
    analystScore: 4.6,
    targetPrice: 175.00,
    targetLow: 130.00,
    targetHigh: 220.00,
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
    nativeCurrency: 'USD',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    price: 228.40,
    change24h: 0.85,
    marketCap: '$3.48 Trillion',
    peRatio: 34.1,
    pbRatio: 51.6,
    eps: 6.69,
    week52High: 237.23,
    week52Low: 164.08,
    beta: 1.05,
    volatility: 22.0,
    sparkline: [218, 220, 222, 221, 224, 226, 228.40],
    isEmergingGem: false,
    catalyst: 'Apple Intelligence iPhone upgrade supercycle',
    downsideRisk: 'China market market share pressure and antitrust litigation',
    analystRating: 'Buy',
    analystScore: 4.3,
    targetPrice: 255.00,
    targetLow: 195.00,
    targetHigh: 300.00,
    buyCount: 29,
    holdCount: 10,
    sellCount: 1
  },
  SPCX: {
    symbol: 'SPCX',
    name: 'Space Exploration Technologies Corp.',
    sector: 'Industrials / Aerospace & Defense',
    exchange: 'NASDAQ',
    country: '🇺🇸 USA',
    nativeCurrency: 'USD',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    price: 185.40,
    change24h: 4.20,
    marketCap: '$210 Billion',
    peRatio: 145.2,
    pbRatio: 18.5,
    eps: 1.28,
    week52High: 210.00,
    week52Low: 125.00,
    beta: 1.85,
    volatility: 55.0,
    sparkline: [140, 155, 162, 170, 180, 178, 185.40],
    isEmergingGem: true,
    gemReason: 'Starship commercialization and Starlink IPO spin-off potential',
    catalyst: 'Starlink revenue growth and successful Starship orbital flights',
    downsideRisk: 'Extreme capital intensity and regulatory launch approvals',
    analystRating: 'Strong Buy',
    analystScore: 4.8,
    targetPrice: 240.00,
    targetLow: 150.00,
    targetHigh: 300.00,
    buyCount: 18,
    holdCount: 2,
    sellCount: 0
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Technology / Cloud & AI Software',
    exchange: 'NASDAQ',
    country: '🇺🇸 USA',
    nativeCurrency: 'USD',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    price: 422.50,
    change24h: 1.25,
    marketCap: '$3.14 Trillion',
    peRatio: 36.2,
    pbRatio: 12.8,
    eps: 11.66,
    week52High: 468.35,
    week52Low: 385.00,
    beta: 0.92,
    volatility: 21.5,
    sparkline: [408, 412, 415, 418, 420, 421, 422.50],
    isEmergingGem: false,
    catalyst: 'Azure OpenAI enterprise adoption and Copilot monetization',
    downsideRisk: 'AI infrastructure capex ROI timeline',
    analystRating: 'Strong Buy',
    analystScore: 4.8,
    targetPrice: 485.00,
    targetLow: 410.00,
    targetHigh: 550.00,
    buyCount: 36,
    holdCount: 3,
    sellCount: 0
  },
  ASTS: {
    symbol: 'ASTS',
    name: 'AST SpaceMobile, Inc.',
    sector: 'Telecommunications / Satellite',
    exchange: 'NASDAQ',
    country: '🇺🇸 USA',
    nativeCurrency: 'USD',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    price: 26.80,
    change24h: 14.30,
    marketCap: '$7.2 Billion',
    peRatio: -18.5,
    pbRatio: 18.2,
    eps: -1.07,
    week52High: 38.60,
    week52Low: 2.15,
    beta: 2.85,
    volatility: 92.4,
    sparkline: [18, 20, 22, 23, 24.5, 25.8, 26.80],
    isEmergingGem: true,
    gemReason: 'First-mover space-based 5G cellular broadband direct to unmodified smartphones',
    catalyst: 'Commercial launch with AT&T, Verizon, and Vodafone',
    downsideRisk: 'Capital dilution & satellite launch delays',
    analystRating: 'Strong Buy',
    analystScore: 4.7,
    targetPrice: 38.50,
    targetLow: 22.00,
    targetHigh: 55.00,
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
    nativeCurrency: 'USD',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    price: 32.40,
    change24h: -4.12,
    marketCap: '$18.9 Billion',
    peRatio: 15.2,
    pbRatio: 4.1,
    eps: 2.13,
    week52High: 122.90,
    week52Low: 18.50,
    beta: 2.45,
    volatility: 85.0,
    sparkline: [42, 38, 35, 34, 33, 32.8, 32.40],
    isEmergingGem: false,
    catalyst: 'Direct liquid cooling AI server rack demand',
    downsideRisk: 'Audit compliance concerns & margin pressure',
    analystRating: 'Hold',
    analystScore: 3.2,
    targetPrice: 45.00,
    targetLow: 22.00,
    targetHigh: 75.00,
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
    nativeCurrency: 'USD',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    price: 21.89,
    change24h: -1.85,
    marketCap: '$9.4 Billion',
    peRatio: 270.0,
    pbRatio: 2.0,
    eps: 0.08,
    week52High: 64.83,
    week52Low: 9.95,
    beta: 3.10,
    volatility: 110.5,
    sparkline: [24, 23.5, 23, 22.8, 22.2, 22.0, 21.89],
    isEmergingGem: false,
    catalyst: '$4B+ cash war chest for potential M&A transition',
    downsideRisk: 'Declining core physical retail sales',
    analystRating: 'Underperform',
    analystScore: 2.1,
    targetPrice: 16.00,
    targetHigh: 22.00,
    buyCount: 0,
    holdCount: 2,
    sellCount: 4
  },
  GOOGL: {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    sector: 'Technology / Internet Content & Information',
    exchange: 'NASDAQ',
    country: '🇺🇸 USA',
    nativeCurrency: 'USD',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    price: 182.40,
    change24h: 0.95,
    marketCap: '$2.25 Trillion',
    peRatio: 24.5,
    pbRatio: 7.2,
    eps: 7.44,
    week52High: 193.31,
    week52Low: 130.00,
    beta: 1.05,
    volatility: 26.0,
    sparkline: [172, 174, 176, 178, 180, 181, 182.40],
    isEmergingGem: false,
    catalyst: 'Gemini integration across Workspace and Search generative experiences',
    downsideRisk: 'Antitrust regulation and AI search competition',
    analystRating: 'Strong Buy',
    analystScore: 4.6,
    targetPrice: 205.00,
    targetLow: 170.00,
    targetHigh: 235.00,
    buyCount: 30,
    holdCount: 5,
    sellCount: 0
  },
  AMZN: {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    sector: 'Consumer Cyclical / Internet Retail',
    exchange: 'NASDAQ',
    country: '🇺🇸 USA',
    nativeCurrency: 'USD',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    price: 208.50,
    change24h: 1.15,
    marketCap: '$2.18 Trillion',
    peRatio: 42.1,
    pbRatio: 8.5,
    eps: 4.95,
    week52High: 215.90,
    week52Low: 151.61,
    beta: 1.15,
    volatility: 28.5,
    sparkline: [198, 200, 202, 204, 206, 207, 208.50],
    isEmergingGem: false,
    catalyst: 'AWS growth re-acceleration and retail margin expansion',
    downsideRisk: 'Consumer spending slowdown',
    analystRating: 'Strong Buy',
    analystScore: 4.7,
    targetPrice: 235.00,
    targetLow: 190.00,
    targetHigh: 260.00,
    buyCount: 34,
    holdCount: 3,
    sellCount: 0
  },
  META: {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    sector: 'Technology / Internet Content & Information',
    exchange: 'NASDAQ',
    country: '🇺🇸 USA',
    nativeCurrency: 'USD',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    price: 585.20,
    change24h: 2.30,
    marketCap: '$1.48 Trillion',
    peRatio: 27.4,
    pbRatio: 8.4,
    eps: 21.35,
    week52High: 602.95,
    week52Low: 350.00,
    beta: 1.20,
    volatility: 35.0,
    sparkline: [550, 560, 568, 572, 578, 582, 585.20],
    isEmergingGem: false,
    catalyst: 'Llama 3 open-source dominance and ad targeting efficiency',
    downsideRisk: 'Reality Labs cash burn',
    analystRating: 'Strong Buy',
    analystScore: 4.7,
    targetPrice: 650.00,
    targetLow: 520.00,
    targetHigh: 720.00,
    buyCount: 31,
    holdCount: 4,
    sellCount: 1
  },
  MC: {
    symbol: 'MC',
    name: 'LVMH Moët Hennessy',
    sector: 'Consumer Cyclical / Luxury Goods',
    exchange: 'Euronext Paris (MC.PA)',
    country: '🇫🇷 France / Europe',
    nativeCurrency: 'EUR',
    brokers: ['Scalable', 'Trading 212', 'Revolut'],
    price: 740.00,
    change24h: 0.50,
    marketCap: '€370 Billion',
    peRatio: 22.5,
    pbRatio: 6.2,
    eps: 32.85,
    week52High: 900.00,
    week52Low: 644.00,
    beta: 1.10,
    volatility: 24.0,
    sparkline: [730, 735, 732, 738, 736, 739, 740.00],
    isEmergingGem: false,
    catalyst: 'Global wealth expansion and luxury pricing power',
    downsideRisk: 'China luxury demand recovery stalling',
    analystRating: 'Buy',
    analystScore: 4.2,
    targetPrice: 850.00,
    targetLow: 700.00,
    targetHigh: 950.00,
    buyCount: 22,
    holdCount: 8,
    sellCount: 2
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
    badgeClass = 'badge-risk-high';
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
  DHER: [
    { id: 'dher1', title: 'Delivery Hero Glovo Revenue Surges Across European & Asian Markets', source: 'Handelsblatt', time: '1 hour ago', impact: 'Positive', impactText: 'Free cash flow breakeven milestones reached on XETRA DHER.DE', url: 'https://finance.yahoo.com' }
  ],
  RELIANCE: [
    { id: 'rel1', title: 'Reliance Jio 5G Subscribers Reach 150M Benchmark Across India', source: 'Economic Times', time: '1 hour ago', impact: 'Positive', impactText: 'ARPU tariff increases accelerating telecom free cash flow', url: 'https://finance.yahoo.com' }
  ]
};

export function fetchStockNews(symbol) {
  return STOCK_NEWS_DATABASE[symbol] || [
    { id: 'gen1', title: `${symbol} Global Market & Earnings Performance Overview`, source: 'Reuters Financial', time: '3 hours ago', impact: 'Neutral', impactText: 'Analyst sentiment remains balanced ahead of earnings call.', url: 'https://finance.yahoo.com' }
  ];
}

export function compileStockAnalytics(posts, finnhubApiKey = null, dynamicCacheUpdates = {}) {
  const tickerMentions = {};
  const processedPostIds = new Set();

  posts.forEach(post => {
    // Prevent duplicate counting of the same post
    if (processedPostIds.has(post.id)) return;
    processedPostIds.add(post.id);

    // Prevent counting the same ticker multiple times in a single post
    const uniqueTickers = [...new Set(post.tickers)];

    uniqueTickers.forEach(symbol => {
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
      if (post.sentiment?.label === 'Bullish') tickerMentions[symbol].bullishCount += 1;
      if (post.sentiment?.label === 'Bearish') tickerMentions[symbol].bearishCount += 1;
      tickerMentions[symbol].subreddits.add(post.subreddit);
      tickerMentions[symbol].posts.push(post);
    });
  });

  const results = [];
  const allSymbols = new Set([...Object.keys(MASTER_STOCKS_DATABASE), ...Object.keys(dynamicCacheUpdates), ...Object.keys(tickerMentions)]);

  allSymbols.forEach(symbol => {
    const baseData = MASTER_STOCKS_DATABASE[symbol] || dynamicCacheUpdates[symbol] || {
      symbol,
      name: `${symbol} Corp.`,
      sector: 'General Equities',
      exchange: 'NASDAQ',
      country: '🌐 International',
      nativeCurrency: 'USD',
      brokers: ['Scalable', 'Trading 212', 'Revolut'],
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

    let seed = 0;
    for (let i = 0; i < symbol.length; i++) {
      seed = (seed << 5) - seed + symbol.charCodeAt(i);
      seed |= 0;
    }
    seed = Math.abs(seed);

    const metrics = tickerMentions[symbol] || {
      mentionCount: (seed % 35) + 12,
      bullishCount: (seed % 20) + 10,
      bearishCount: (seed % 6) + 1,
      subreddits: new Set(['stocks', 'wallstreetbets']),
      posts: []
    };

    const totalMentions = metrics.mentionCount;
    const bullishRatio = Math.round((metrics.bullishCount / Math.max(1, metrics.bullishCount + metrics.bearishCount)) * 100);
    const mentionChange24h = (seed % 140) - 20;

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

    const enriched = {
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
      impliedUpside: upside,
    };
    enriched.valueSignal = computeValueSignal(enriched, postMetrics);
    results.push(enriched);
  });

  return results.sort((a, b) => b.mentionCount - a.mentionCount);
}
