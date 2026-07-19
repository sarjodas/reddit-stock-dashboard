const dcfCache = new Map();
const earningsCache = new Map(); // 'calendar' -> data

export async function fetchDCFValuation(symbol, apiKey) {
  if (!apiKey || apiKey.trim() === '') return null;
  if (dcfCache.has(symbol)) return dcfCache.get(symbol);

  try {
    const res = await fetch(`https://financialmodelingprep.com/api/v3/discounted-cash-flow/${symbol}?apikey=${apiKey}`);
    const data = await res.json();

    if (data && data.length > 0) {
      const result = {
        dcf: data[0].dcf,
        currentPrice: data[0].Stock Price,
        date: data[0].date
      };
      dcfCache.set(symbol, result);
      return result;
    }
    return null;
  } catch (err) {
    console.warn(`FMP DCF fetch failed for ${symbol}:`, err);
    return null;
  }
}

export async function fetchEarningsCalendar(apiKey) {
  if (!apiKey || apiKey.trim() === '') return null;
  if (earningsCache.has('calendar')) return earningsCache.get('calendar');

  try {
    const now = new Date();
    const nextMonth = new Date(now.getTime() + 30 * 24 * 3600 * 1000);
    const fromDate = now.toISOString().slice(0, 10);
    const toDate = nextMonth.toISOString().slice(0, 10);

    const res = await fetch(`https://financialmodelingprep.com/api/v3/earning_calendar?from=${fromDate}&to=${toDate}&apikey=${apiKey}`);
    const data = await res.json();
    
    // Convert array to a map of symbol -> earnings data for easy lookup
    const calendarMap = {};
    if (Array.isArray(data)) {
      data.forEach(item => {
        calendarMap[item.symbol] = {
          date: item.date,
          epsEstimated: item.epsEstimated,
          revenueEstimated: item.revenueEstimated,
          time: item.time // "am" or "pm"
        };
      });
    }

    earningsCache.set('calendar', calendarMap);
    return calendarMap;
  } catch (err) {
    console.warn('FMP Earnings Calendar fetch failed:', err);
    return null;
  }
}
