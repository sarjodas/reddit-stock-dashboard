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
    return [];
  } catch (err) {
    console.error('Failed to fetch Tradestie sentiment:', err);
    return [];
  }
}
