const cache = new Map();
const CACHE_TTL = 120000; // 2 minutes

export async function fetchTechnicalIndicators(symbol, apiKey) {
  if (!apiKey || apiKey.trim() === '') return null;
  const cacheKey = `tech_${symbol}`;
  const cached = cache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }

  try {
    const baseUrl = 'https://api.twelvedata.com';
    const params = `symbol=${symbol}&interval=1day&apikey=${apiKey}&outputsize=1&_=${Date.now()}`;
    
    // Fetch RSI (14-period default)
    const rsiRes = await fetch(`${baseUrl}/rsi?${params}`, { cache: 'no-store' });
    const rsiData = await rsiRes.json();
    
    // Fetch MACD (12, 26, 9 default)
    const macdRes = await fetch(`${baseUrl}/macd?${params}`, { cache: 'no-store' });
    const macdData = await macdRes.json();
    
    // Fetch SMA (50-period)
    const smaRes = await fetch(`${baseUrl}/sma?symbol=${symbol}&interval=1day&time_period=50&apikey=${apiKey}&outputsize=1&_=${Date.now()}`, { cache: 'no-store' });
    const smaData = await smaRes.json();

    const result = {
      rsi: rsiData?.values?.[0]?.rsi ? parseFloat(rsiData.values[0].rsi) : null,
      macd: macdData?.values?.[0] ? {
        macd: parseFloat(macdData.values[0].macd),
        signal: parseFloat(macdData.values[0].macd_signal),
        histogram: parseFloat(macdData.values[0].macd_hist)
      } : null,
      sma50: smaData?.values?.[0]?.sma ? parseFloat(smaData.values[0].sma) : null
    };

    cache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  } catch (err) {
    console.error(`Twelve Data API error for ${symbol}:`, err);
    return null;
  }
}

/**
 * Fetch real historical timeseries for Candlestick charts
 * @param {string} symbol - Ticker symbol
 * @param {string} interval - e.g., '1h', '1day', '1week'
 * @param {string} apiKey - Twelve Data API Key
 * @param {number} outputsize - Number of data points
 */
export async function fetchTimeSeries(symbol, interval, apiKey, outputsize = 30) {
  if (!apiKey || apiKey.trim() === '') return [];
  
  const cacheKey = `timeseries_${symbol}_${interval}_${outputsize}`;
  const cached = cache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }

  try {
    const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${apiKey}&_=${Date.now()}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Timeseries fetch failed: ${res.status}`);
    
    const data = await res.json();
    if (data.status === 'error' || !data.values) {
      console.warn('Twelve Data returned error:', data.message || 'No values');
      return [];
    }

    // Format for Recharts
    const formatted = data.values.map((v, i) => {
      const open = parseFloat(v.open);
      const close = parseFloat(v.close);
      return {
        id: data.values.length - i,
        label: v.datetime, // Depending on interval, you might want to format this
        open: open,
        high: parseFloat(v.high),
        low: parseFloat(v.low),
        close: close,
        volume: parseInt(v.volume, 10),
        isBullish: close >= open
      };
    }).reverse(); // Recharts usually renders left-to-right (oldest to newest)

    cache.set(cacheKey, { data: formatted, timestamp: Date.now() });
    return formatted;
  } catch (err) {
    console.error('Error fetching time series:', err);
    return [];
  }
}
