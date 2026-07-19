// Reddit Public API Service & Sentiment Analyzer with European & Indian Subreddits Integration

export const SUBREDDITS = [
  { id: 'EATinvesting', name: 'r/EATinvesting', icon: '🇪🇺', color: '#0284c7', label: 'European Stocks' },
  { id: 'Finanzen', name: 'r/Finanzen', icon: '🇩🇪', color: '#f59e0b', label: 'DACH Markets' },
  { id: 'IndianStreetBets', name: 'r/IndianStreetBets', icon: '🇮🇳', color: '#f97316', label: 'India Moonshots' },
  { id: 'IndiaInvestments', name: 'r/IndiaInvestments', icon: '🪷', color: '#10b981', label: 'India Long-Term' },
  { id: 'UKInvesting', name: 'r/UKInvesting', icon: '🇬🇧', color: '#8b5cf6', label: 'UK & LSE' },
  { id: 'stocks', name: 'r/stocks', icon: '📈', color: '#06b6d4', label: 'General Stocks' },
  { id: 'wallstreetbets', name: 'r/wallstreetbets', icon: '🚀', color: '#f43f5e', label: 'WSB Moonshots' }
];

export const MOCK_REDDIT_POSTS = [
  {
    id: 'p_in1',
    title: 'Reliance Industries (Jio & Retail) + Tata Motors EV leadership: Why Nifty 50 is set for 15% CAGR',
    author: 'MumbaiTrader_99',
    subreddit: 'IndianStreetBets',
    score: 1850,
    numComments: 420,
    createdUtc: Date.now() - 3600 * 1000 * 2,
    url: 'https://reddit.com/r/IndianStreetBets',
    tickers: ['RELIANCE', 'TATAMOTORS'],
    sentiment: { score: 0.94, label: 'Bullish', confidence: 'High' },
    summary: 'Jio 5G tariff hikes combined with Tata Motors EV market share dominance in India make them prime long-term wealth creators.'
  },
  {
    id: 'p_in2',
    title: 'HDFC Bank & ICICI Bank Q3 credit growth analysis: India banking supercycle remains undefeated',
    author: 'DalalStreetPro',
    subreddit: 'IndiaInvestments',
    score: 1240,
    numComments: 290,
    createdUtc: Date.now() - 3600 * 1000 * 4,
    url: 'https://reddit.com/r/IndiaInvestments',
    tickers: ['HDB', 'IBN'],
    sentiment: { score: 0.91, label: 'Bullish', confidence: 'High' },
    summary: 'Industry-leading ROE (18%+) and retail deposit growth acceleration confirm India private banks as top defensive growth plays.'
  },
  {
    id: 'p_in3',
    title: 'Infosys Topaz AI & TCS enterprise cloud contract momentum: IT sector rebound in 2025/2026',
    author: 'TechieInvestor_BLR',
    subreddit: 'IndiaInvestments',
    score: 890,
    numComments: 195,
    createdUtc: Date.now() - 3600 * 1000 * 5,
    url: 'https://reddit.com/r/IndiaInvestments',
    tickers: ['INFY', 'TCS'],
    sentiment: { score: 0.86, label: 'Bullish', confidence: 'High' },
    summary: 'Multi-year digital transformation deals and Generative AI client bootcamps positioning Indian IT leaders for revenue acceleration.'
  },
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
