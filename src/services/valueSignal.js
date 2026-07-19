
// ── Value Intelligence Engine ─────────────────────────────────────────────────
// Sector-aware Graham & Buffett scoring so tech stocks aren't unfairly
// penalised for their structurally higher P/E and P/B multiples.

const TECH_SECTORS = ['Technology', 'Semiconductor', 'Software', 'AI', 'Cloud', 'SaaS', 'Biotech', 'Pharmaceuticals', 'Satellite', 'IT Services'];

function isTechSector(sector = '') {
  return TECH_SECTORS.some(t => sector.toLowerCase().includes(t.toLowerCase()));
}

export function computeValueSignal(stock, postMetrics = {}) {
  const {
    peRatio, pbRatio, beta, longTermScore, shortTermScore,
    eps, analystScore, analystRating, sector, marketCap,
    impliedUpside
  } = stock;

  const bullishRatio   = postMetrics.bullishRatio    || stock.bullishRatio    || 50;
  const mentionChange  = postMetrics.mentionChange24h || stock.mentionChange24h || 0;
  const isTech = isTechSector(sector);

  // ── Graham Score (sector-adjusted) ────────────────────────────────────────
  // Traditional Graham: P/E < 15, P/B < 1.5, positive EPS, beta < 1.2
  // Tech-adjusted:      P/E < 35 (growth premium baked in), P/B < 10, beta < 1.8
  const peThreshold   = isTech ? 35  : 15;
  const pbThreshold   = isTech ? 10  : 1.5;
  const betaThreshold = isTech ? 1.8 : 1.2;

  let grahamScore = 0;
  if (peRatio > 0 && peRatio < peThreshold)             grahamScore += 30;
  else if (peRatio > 0 && peRatio < peThreshold * 1.6)  grahamScore += 14;
  if (pbRatio > 0 && pbRatio < pbThreshold)              grahamScore += 20;
  if ((impliedUpside || 0) >= 20)                        grahamScore += 20;  // Margin of safety
  if ((eps || 0) > 0)                                    grahamScore += 15;  // Profitable
  if ((beta || 1.5) < betaThreshold)                     grahamScore += 15;  // Stability

  const grahamPasses = grahamScore >= 50;

  // ── Buffett Conviction Score ───────────────────────────────────────────────
  // Rewards: durable moat, high analyst consensus, compounding earnings, sustained Reddit conviction
  // Tech bonus: Strong Buy consensus = evidence of durable competitive advantage
  let buffettScore = 0;
  if ((longTermScore || 0) >= 75)                                              buffettScore += 25;
  else if ((longTermScore || 0) >= 65)                                         buffettScore += 12;
  if ((analystScore || 0) >= 4.5)                                              buffettScore += 25;
  else if ((analystScore || 0) >= 4.0)                                         buffettScore += 15;
  if ((impliedUpside || 0) >= 15)                                              buffettScore += 20;
  if (bullishRatio >= 65)                                                      buffettScore += 15;
  if (marketCap && (marketCap.includes('Trillion') ||
      parseFloat(marketCap.replace(/[^0-9.]/g, '')) > 50))                    buffettScore += 15;
  if (isTech && analystRating && analystRating.includes('Strong Buy'))         buffettScore += 10;

  const buffettPasses = buffettScore >= 60;

  // ── Momentum Signal ────────────────────────────────────────────────────────
  const momentumPasses = (shortTermScore || 0) >= 72 && bullishRatio >= 60 && mentionChange >= 30;

  // ── Reddit Sentiment Intelligence ──────────────────────────────────────────
  const sentimentLabel =
    bullishRatio >= 72 ? 'Very Bullish' :
    bullishRatio >= 58 ? 'Bullish' :
    bullishRatio >= 45 ? 'Neutral' :
    bullishRatio >= 32 ? 'Bearish' : 'Very Bearish';

  const sentimentColor =
    bullishRatio >= 72 ? '#34d399' :
    bullishRatio >= 58 ? '#86efac' :
    bullishRatio >= 45 ? '#fbbf24' :
    bullishRatio >= 32 ? '#f97316' : '#fb7185';

  const sentimentEmoji =
    bullishRatio >= 72 ? '🚀' :
    bullishRatio >= 58 ? '📈' :
    bullishRatio >= 45 ? '😐' :
    bullishRatio >= 32 ? '📉' : '🔴';

  const buzzTier =
    mentionChange >= 100 ? 'Viral 🔥🔥' :
    mentionChange >= 50  ? 'Hot 🔥' :
    mentionChange >= 20  ? 'Rising ↑' :
    mentionChange >= 0   ? 'Steady' : 'Cooling ↓';

  // ── Badge selection (best badge wins) ─────────────────────────────────────
  let valueBadge = null;
  if (grahamPasses && buffettPasses) {
    valueBadge = {
      label: isTech ? '💎 Tech Conviction' : '🏆 Graham + Buffett',
      badgeClass: 'badge-conviction',
      tooltip: isTech
        ? `Tech-adjusted Graham (P/E<${peThreshold}, P/B<${pbThreshold}) + Buffett moat quality. Graham: ${grahamScore}/100 · Buffett: ${buffettScore}/100`
        : `Classic Graham value screen + Buffett quality moat confirmed. Graham: ${grahamScore}/100 · Buffett: ${buffettScore}/100`
    };
  } else if (buffettPasses) {
    valueBadge = {
      label: isTech ? '⚡ Tech Quality' : '💎 Buffett Conviction',
      badgeClass: isTech ? 'badge-tech-quality' : 'badge-conviction',
      tooltip: `Strong analyst consensus + sustained Reddit bull sentiment + solid upside. Buffett score: ${buffettScore}/100`
    };
  } else if (grahamPasses) {
    valueBadge = {
      label: isTech ? '📊 Tech Value' : '🟡 Graham Value',
      badgeClass: 'badge-graham',
      tooltip: isTech
        ? `Tech-adjusted value: reasonable P/E for growth rate, positive earnings, margin of safety ≥20%. Graham score: ${grahamScore}/100`
        : `Classic Graham deep value: low P/E, low P/B, positive earnings, margin of safety. Graham score: ${grahamScore}/100`
    };
  } else if (momentumPasses) {
    valueBadge = {
      label: '⚡ Momentum Play',
      badgeClass: 'badge-momentum',
      tooltip: `High short-term Reddit velocity + bullish community momentum. Not a value pick — short-term trade only.`
    };
  } else if (peRatio < 0 || (peRatio > 100 && !isTech)) {
    valueBadge = {
      label: '🎲 Speculative',
      badgeClass: 'badge-speculative',
      tooltip: `Negative earnings or extreme valuation multiple. High execution risk — not for conservative investors.`
    };
  }

  return {
    grahamScore,
    buffettScore,
    valueBadge,
    isTech,
    sentimentLabel,
    sentimentColor,
    sentimentEmoji,
    buzzTier,
    bullishRatio,
    grahamPasses,
    buffettPasses,
    momentumPasses,
    isValueGem: grahamPasses || buffettPasses,
  };
}
