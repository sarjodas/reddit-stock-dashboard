const cache = new Map();

export async function fetchTechnicalIndicators(symbol, apiKey) {
  if (!apiKey || apiKey.trim() === '') return null;
  if (cache.has(symbol)) return cache.get(symbol);

  try {
    const baseUrl = 'https://api.twelvedata.com';
    const params = `symbol=${symbol}&interval=1day&apikey=${apiKey}&outputsize=1`;
    
    // Fetch RSI (14-period default)
    const rsiRes = await fetch(`${baseUrl}/rsi?${params}`);
    const rsiData = await rsiRes.json();
    
    // Fetch MACD (12, 26, 9 default)
    const macdRes = await fetch(`${baseUrl}/macd?${params}`);
    const macdData = await macdRes.json();
    
    // Fetch SMA (50-period)
    const smaRes = await fetch(`${baseUrl}/sma?symbol=${symbol}&interval=1day&time_period=50&apikey=${apiKey}&outputsize=1`);
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

    cache.set(symbol, result);
    return result;
  } catch (err) {
    console.warn(`TwelveData fetch failed for ${symbol}:`, err);
    return null;
  }
}
