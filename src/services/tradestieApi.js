import fallbackData from '../data/fallbackTradestie.json';

export async function fetchTradestieSentiment() {
  try {
    const url = 'https://tradestie.com/api/v1/apps/reddit';
    // Use allorigins to bypass CORS
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    
    const res = await fetch(proxyUrl);
    if (!res.ok) {
      throw new Error(`Tradestie API error: ${res.status}`);
    }
    const data = await res.json();
    if (data.contents) {
      return JSON.parse(data.contents); // Array of { ticker, sentiment, sentiment_score, no_of_comments }
    }
    console.warn('CORS Proxy returned empty contents, using fallback data.');
    return fallbackData;
  } catch (err) {
    console.error('Failed to fetch Tradestie sentiment via proxy, using fallback:', err);
    return fallbackData;
  }
}
