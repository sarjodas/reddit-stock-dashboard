import fallbackData from '../data/fallbackTradestie.json';

const CACHE_KEY = 'reddit_tradestie_cache';

export async function fetchTradestieSentiment() {
  try {
    const getFormattedDate = (dateObj) => {
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const dd = String(dateObj.getDate()).padStart(2, '0');
      const yyyy = dateObj.getFullYear();
      return `${mm}-${dd}-${yyyy}`;
    };

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const urlsToTry = [
      `https://tradestie.com/api/v1/apps/reddit?date=${getFormattedDate(today)}`,
      `https://tradestie.com/api/v1/apps/reddit?date=${getFormattedDate(yesterday)}`,
      `https://tradestie.com/api/v1/apps/reddit`
    ];

    for (const url of urlsToTry) {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      try {
        const res = await fetch(proxyUrl);
        if (res.ok) {
          const data = await res.json();
          if (data.contents) {
            const parsed = JSON.parse(data.contents);
            if (Array.isArray(parsed) && parsed.length > 0) {
              // Cache the successful fetch
              localStorage.setItem(CACHE_KEY, JSON.stringify(parsed));
              return parsed;
            }
          }
        }
      } catch (err) {
        console.warn(`Failed to fetch from ${url}, trying next...`);
      }
    }
    
    console.warn('All live API endpoints failed or returned empty, using fallback data.');
    const localCache = localStorage.getItem(CACHE_KEY);
    return localCache ? JSON.parse(localCache) : fallbackData;
  } catch (err) {
    console.error('Failed to fetch Tradestie sentiment via proxy, using fallback:', err);
    const localCache = localStorage.getItem(CACHE_KEY);
    return localCache ? JSON.parse(localCache) : fallbackData;
  }
}
