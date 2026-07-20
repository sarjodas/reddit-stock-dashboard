import fallbackData from '../data/fallbackTradestie.json';

const CACHE_KEY = 'reddit_tradestie_cache';

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
      const parsed = JSON.parse(data.contents);
      // Cache the successful fetch to local storage to update the local fallback
      localStorage.setItem(CACHE_KEY, JSON.stringify(parsed));
      return parsed; // Array of { ticker, sentiment, sentiment_score, no_of_comments }
    }
    console.warn('CORS Proxy returned empty contents, using fallback data.');
    const localCache = localStorage.getItem(CACHE_KEY);
    return localCache ? JSON.parse(localCache) : fallbackData;
  } catch (err) {
    console.error('Failed to fetch Tradestie sentiment via proxy, using fallback:', err);
    const localCache = localStorage.getItem(CACHE_KEY);
    return localCache ? JSON.parse(localCache) : fallbackData;
  }
}
