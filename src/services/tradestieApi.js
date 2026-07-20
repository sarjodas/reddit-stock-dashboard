export async function fetchTradestieSentiment() {
  try {
    const res = await fetch('https://tradestie.com/api/v1/apps/reddit');
    if (!res.ok) {
      throw new Error(`Tradestie API error: ${res.status}`);
    }
    const data = await res.json();
    return data; // Array of { ticker, sentiment, sentiment_score, no_of_comments }
  } catch (err) {
    console.error('Failed to fetch Tradestie sentiment:', err);
    return [];
  }
}
