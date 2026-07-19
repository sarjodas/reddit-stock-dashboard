# 🚀 RedditTicker Pulse — Subreddit Stock Discussion & Sentiment Analytics Dashboard

[![Live Dashboard](https://img.shields.io/badge/Live_Dashboard-GitHub_Pages-10b981?style=for-the-badge&logo=github)](https://sarjodas.github.io/reddit-stock-dashboard/)
[![License](https://img.shields.io/badge/License-MIT-38bdf8?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev/)

A modern, real-time web application that analyzes stock discussions across top Reddit communities (`r/wallstreetbets`, `r/stocks`, `r/investing`, `r/ValueInvesting`, `r/options`, `r/pennystocks`, `r/StockMarket`, `r/spacs`). It extracts stock tickers ($NVDA, $TSLA, $PLTR, $AMD, etc.), computes AI lexicon sentiment, evaluates **Dual-Horizon Investment Scores (Short-Term Swing vs. Long-Term Conviction)**, calculates a **Quantitative Risk Rating (1–100)**, generates a **"Buy Today vs. Wait" Daily Entry Timing Signal**, displays **Wall Street Analyst Consensus & Price Targets**, supports **Real-Time USD / EUR FX Currency Conversion**, and offers **Passcode-Protected Private Access**.

---

## 🌐 Live Web Demo

👉 **[https://sarjodas.github.io/reddit-stock-dashboard/](https://sarjodas.github.io/reddit-stock-dashboard/)**  
*(Passcode protected: Enter **`1234`** when prompted to unlock)*

---

## 🔥 Key Features & Intelligence Engines

### 1. 🔒 Passcode-Protected Private Access Guard
- Built-in lock screen guard (`PasscodeGuard.jsx`) requiring a secret passcode (`1234` default) to unlock stock data.
- Keeps your dashboard completely private even when hosted on public URLs.

### 2. 🌐 8 Monitored Subreddits (Multi-Filterable)
- **`r/wallstreetbets`**: Retail momentum, options, meme/breakout plays.
- **`r/stocks`**: Equity research & quarterly earnings.
- **`r/investing`**: Long-term portfolio strategy & macro trends.
- **`r/ValueInvesting`**: DCF valuation, fundamental moat & margin of safety.
- **`r/options`**: Call/put options strategy & implied volatility.
- **`r/pennystocks`**: Small & micro-cap high-volatility plays.
- **`r/StockMarket`**: Daily market chatter & chart technical analysis.
- **`r/spacs`**: Blank-check companies & upcoming IPOs.

### 3. 🧠 Dual-Horizon Scoring Engine (1–100 Scale)
- ⚡ **Short-Term Swing Score**: Evaluates 24h mention velocity, options activity, trading subreddit hype, and volatility.
- 🏛️ **Long-Term Conviction Score**: Evaluates fundamental research discussions (*"DCF"*, *"moat"*, *"balance sheet"*), valuation stability, and value investing focus.

### 4. 🧮 Mathematical Risk Rating Model (1–100 Scale)
Combines 5 weighted quantitative risk factors:
- 30-Day Price Volatility ($\sigma$)
- Market Beta ($\beta$)
- Valuation Stretch (P/E ratio distance)
- Social Hype Noise Ratio ($\frac{\text{WSB/Penny Hype}}{\text{Value/Investing Hype}}$)
- Market Cap Scale Factor
- **Tiers**: 🛡️ **Low Risk (1–30)**, ⚡ **Moderate Risk (31–60)**, ⚠️ **High Risk (61–85)**, ☣️ **Speculative (86–100)**.

### 5. 🛒 "Buy Today vs. Wait" Daily Timing Entry Score
Calculates daily market entry suitability:
- 🛒 **Strong Buy Dip Day** (Score 80–100): Fundamental discount & price pullback near support.
- 📥 **Accumulate / Fair Entry** (Score 55–79): Balanced price, ideal for dollar-cost averaging.
- ⏳ **Wise to Wait / Extended** (Score 35–54): Stock has rallied into upper channel resistance; wait for a 2-5% dip.
- 🔴 **Overbought FOMO / Caution** (Score 1–34): High parabolic hype spike near 52-week highs.

### 6. 🎯 Wall Street Analyst Consensus & Price Targets
- Consensus Rating badge (`Strong Buy`, `Buy`, `Hold`, `Underperform`).
- Average Price Target & Low/High target boundaries.
- **Implied Upside / Downside %** calculation relative to current stock price.
- Analyst count breakdown (Buys, Holds, Sells).

### 7. 💶 Real-Time USD / EUR FX Currency Converter
- Live USD/EUR exchange rate fetching.
- Header Currency Selector: `USD ($)`, `EUR (€)`, or `Dual ($ / €)`.
- All prices, targets, and 52-week channels format dynamically.

### 8. 🌐 Dynamic Global Stock Firehose (Finnhub API)
- Real-time resolution of any ticker via Finnhub API, allowing discovery beyond the curated list.
- Automatically compiles fundamental data and computes sentiment/analytics on the fly.

### 9. 📈 Interactive SVG Candlestick & Line Charting
- Switch seamlessly between Candlestick and Line graph visualizations.
- Interactive crosshairs and hover-based tooltips showing price values in both native currency and EUR.
- Accurately labeled X-axis date tracking.

### 10. 🏦 Graham/Buffett Value Signals
- Identifies undervalued stocks based on Benjamin Graham & Warren Buffett's foundational value investing principles.
- Evaluates metrics like margin of safety and PE ratio against intrinsic value.

### 11. 🔍 "High-Risk, High-Upside Discovery Radar"
- Dedicated leaderboard tab filtering cheap/small-cap stocks featuring **huge implied upside (>30–100%+)** coupled with **elevated risk ratings**.

### 12. 📰 Live Stock Impact News Stream
- Breaking headlines, analyst price target changes, SEC filings, and corporate catalysts with impact ratings (Positive 🟢, Neutral 🟡, Negative 🔴).

### 13. 📊 Recharts Analytics Suite
- 24h Discussion Velocity Area Chart.
- Bull vs. Bear Sentiment Ratio Donut Chart.
- Subreddit Mention Heatmap Bar Chart.
- Risk vs. Return Matrix Scatter Plot.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 8, JavaScript (ES6+)
- **Styling**: Vanilla CSS3, Custom Design System, Glassmorphic Dark Mode UI
- **Icons**: Lucide React
- **Charting**: Recharts
- **Deployment**: GitHub Pages (`gh-pages`), GitHub Actions (`.github/workflows/snapshot.yml`)

---

## 🚀 Quick Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sarjodas/reddit-stock-dashboard.git
   cd reddit-stock-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173/` and enter passcode **`1234`**!

---

## ☁️ Deploying Updates to GitHub Pages

To push code changes and publish updates to GitHub Pages:

```bash
# 1. Commit and push to main branch
git add .
git commit -m "Update dashboard features"
git push origin main

# 2. Deploy to gh-pages branch
npm run deploy
```

---

## 📜 License

MIT License © 2026 Sarjo Das
