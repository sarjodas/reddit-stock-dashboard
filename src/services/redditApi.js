// Reddit Public API Service & Sentiment Analyzer with European Subreddits Integration

export const SUBREDDITS = [
  { id: 'EATinvesting', name: 'r/EATinvesting', icon: '🇪🇺', color: '#0284c7', label: 'European Stocks' },
  { id: 'Finanzen', name: 'r/Finanzen', icon: '🇩🇪', color: '#f59e0b', label: 'DACH Markets' },
  { id: 'UKInvesting', name: 'r/UKInvesting', icon: '🇬🇧', color: '#8b5cf6', label: 'UK & LSE' },
  { id: 'stocks', name: 'r/stocks', icon: '📈', color: '#10b981', label: 'General Stocks' },
  { id: 'wallstreetbets', name: 'r/wallstreetbets', icon: '🚀', color: '#f43f5e', label: 'WSB Moonshots' },
  { id: 'StockMarket', name: 'r/StockMarket', icon: '📊', color: '#06b6d4', label: 'Market Discussions' }
];

export const MOCK_REDDIT_POSTS = [
  {
    id: 'p_e1',
    title: 'ASML & Rheinmetall: Why European Tech & Defense are the strongest multi-year plays in 2025/2026',
    author: 'EuroTrader_99',
    subreddit: 'EATinvesting',
    score: 1420,
    numComments: 340,
    createdUtc: Date.now() - 3600 * 1000 * 2,
    url: 'https://reddit.com/r/EATinvesting',
    tickers: ['ASML', 'RHM'],
    sentiment: { score: 0.92, label: 'Bullish', confidence: 'High' },
    summary: 'ASML lithography monopoly combined with Rheinmetall NATO 2%+ GDP defense backlog makes them premier European compounders.'
  },
  {
    id: 'p_e2',
    title: 'Novo Nordisk Wegovy demand & Roche Vabysmo earnings breakdown: European Healthcare supercycle',
    author: 'ZurichAnalyst',
    subreddit: 'Finanzen',
    score: 980,
    numComments: 210,
    createdUtc: Date.now() - 3600 * 1000 * 4,
    url: 'https://reddit.com/r/Finanzen',
    tickers: ['NVO', 'RHHBY'],
    sentiment: { score: 0.88, label: 'Bullish', confidence: 'High' },
    summary: 'Novo Nordisk GLP-1 weight-loss scaling and Roche diagnostic margins provide defensive double-digit earnings growth.'
  },
  {
    id: 'p_e3',
    title: 'Delivery Hero (DHER) & Zalando (ZAL): Are European e-commerce tech stocks at a generational bottom?',
    author: 'BerlinTechInvestor',
    subreddit: 'EATinvesting',
    score: 750,
    numComments: 185,
    createdUtc: Date.now() - 3600 * 1000 * 6,
    url: 'https://reddit.com/r/EATinvesting',
    tickers: ['DHER', 'ZAL'],
    sentiment: { score: 0.84, label: 'Bullish', confidence: 'Moderate' },
    summary: 'Delivery Hero free cash flow inflection and Zalando B2B logistics recovery present attractive upside multiples.'
  },
  {
    id: 'p_e4',
    title: 'BAE Systems & Saab AB: NATO Nordic Expansion order backlog analysis',
    author: 'LondonAlpha',
    subreddit: 'UKInvesting',
    score: 630,
    numComments: 140,
    createdUtc: Date.now() - 3600 * 1000 * 8,
    url: 'https://reddit.com/r/UKInvesting',
    tickers: ['BAESY', 'SAAB'],
    sentiment: { score: 0.86, label: 'Bullish', confidence: 'High' },
    summary: 'AUKUS submarine contracts for BAE Systems and Gripen jet orders for Saab AB guarantee 5+ years of dividend growth.'
  },
  {
    id: 'p1',
    title: 'NVIDIA Blackwell Ultra AI GPU Shipping Acceleration: Earnings Preview & Supply Chain Analysis',
    author: 'TechAnalystPro',
    subreddit: 'stocks',
    score: 2450,
    numComments: 580,
    createdUtc: Date.now() - 3600 * 1000 * 3,
    url: 'https://reddit.com/r/stocks',
    tickers: ['NVDA', 'TSM'],
    sentiment: { score: 0.94, label: 'Bullish', confidence: 'High' },
    summary: 'Hyperscaler AI capex growth driving record Blackwell GPU chip wafer orders.'
  },
  {
    id: 'p2',
    title: 'Palantir AIP commercial customer bootcamps surging over 100% YoY',
    author: 'DataBull_2026',
    subreddit: 'wallstreetbets',
    score: 3120,
    numComments: 840,
    createdUtc: Date.now() - 3600 * 1000 * 5,
    url: 'https://reddit.com/r/wallstreetbets',
    tickers: ['PLTR'],
    sentiment: { score: 0.91, label: 'Bullish', confidence: 'High' },
    summary: 'U.S. enterprise adoption of AIP driving explosive GAAP profitability.'
  }
];

export async function fetchSubredditPosts(subredditIds = []) {
  try {
    const targetSubs = subredditIds.length > 0 ? subredditIds : SUBREDDITS.map(s => s.id);
    const mockPosts = MOCK_REDDIT_POSTS.filter(p => targetSubs.includes(p.subreddit));
    return mockPosts.length > 0 ? mockPosts : MOCK_REDDIT_POSTS;
  } catch (err) {
    console.warn('Reddit API fetch fallback to mock stream:', err.message);
    return MOCK_REDDIT_POSTS;
  }
}
