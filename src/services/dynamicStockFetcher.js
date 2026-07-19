/**
 * Dynamic Stock Fetcher for Unrestricted Firehose
 * Fetches profile and metrics for unknown tickers from Finnhub API.
 */

// Cache to prevent duplicate calls
const fetchCache = new Map();

export async function fetchDynamicStockInfo(symbol, apiKey) {
  if (!apiKey || apiKey === 'DEMO') {
    return createDummyData(symbol);
  }

  if (fetchCache.has(symbol)) {
    return fetchCache.get(symbol);
  }

  try {
    const [profileRes, metricRes] = await Promise.all([
      fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`),
      fetch(`https://finnhub.io/api/v1/stock/metric?symbol=${symbol}&metric=all&token=${apiKey}`)
    ]);

    if (!profileRes.ok || !metricRes.ok) {
      throw new Error('Finnhub API error');
    }

    const profile = await profileRes.json();
    const metricData = await metricRes.json();
    const metrics = metricData.metric || {};

    if (!profile || !profile.name) {
      throw new Error('Stock not found');
    }

    const dynamicData = {
      symbol,
      name: profile.name,
      sector: profile.finnhubIndustry || 'General Equities',
      exchange: profile.exchange || 'Unknown Exchange',
      country: profile.country ? `🌐 ${profile.country}` : '🌐 International',
      nativeCurrency: profile.currency || 'USD',
      brokers: ['Scalable', 'Trading 212', 'Revolut'], // Assume broad availability for now
      marketCap: profile.marketCapitalization ? `$${(profile.marketCapitalization / 1000).toFixed(2)} Billion` : 'Unknown',
      peRatio: metrics.peBasicExclExtraTTM || -1,
      pbRatio: metrics.pbAnnual || -1,
      eps: metrics.epsBasicExclExtraItemsTTM || -1,
      week52High: metrics['52WeekHigh'] || 100,
      week52Low: metrics['52WeekLow'] || 50,
      beta: metrics.beta || 1.0,
      volatility: 40, // Default volatility
      sparkline: [100, 102, 101, 105, 103, 108, 110], // Mock sparkline
      isEmergingGem: false,
      catalyst: 'Reddit momentum discovery',
      downsideRisk: 'Unknown fundamentals due to dynamic discovery',
      analystRating: 'Hold',
      analystScore: 3.0,
      targetPrice: 0,
      impliedUpside: 0,
      // Default to 100 so price isn't null if quote fails
      price: 100,
      change24h: 0
    };

    fetchCache.set(symbol, dynamicData);
    return dynamicData;

  } catch (err) {
    console.warn(`Dynamic fetch failed for ${symbol}:`, err.message);
    const dummy = createDummyData(symbol);
    fetchCache.set(symbol, dummy);
    return dummy;
  }
}

function createDummyData(symbol) {
  return {
    symbol,
    name: `${symbol} Corp.`,
    sector: 'General Equities',
    exchange: 'NASDAQ',
    country: '🌐 International',
    nativeCurrency: 'USD',
    brokers: ['Trading 212'],
    price: 100, change24h: 0, marketCap: 'Unknown', peRatio: 15, pbRatio: 2, eps: 1.0,
    week52High: 120, week52Low: 80, beta: 1.0, volatility: 30,
    sparkline: [100, 100, 100, 100, 100, 100, 100], isEmergingGem: false,
    catalyst: 'Reddit momentum', downsideRisk: 'Unknown fundamentals',
    analystRating: 'Hold', analystScore: 3.0, targetPrice: 110, impliedUpside: 10
  };
}
