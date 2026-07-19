import React from 'react';
import { Rocket, TrendingUp, ShieldAlert, Sparkles, ArrowUpRight, Zap, ShieldCheck, MessageSquare } from 'lucide-react';
import { formatCurrency } from '../services/stockApi';

// Helper: Categorize market region for diversity
function getMarketRegion(country = '') {
  const c = country.toLowerCase();
  if (c.includes('usa') || c.includes('us')) return 'US Market';
  if (c.includes('india')) return 'Indian Market';
  if (c.includes('taiwan') || c.includes('asia') || c.includes('china') || c.includes('japan')) return 'Asian / Global';
  if (c.includes('europe') || c.includes('germany') || c.includes('netherlands') || c.includes('denmark') || c.includes('france') || c.includes('uk')) return 'European Market';
  return 'Global Market';
}

// Helper: Calculate multi-factor Highest Potential Score
function calculatePotentialScore(s) {
  const upside = s.impliedUpside || 0;
  const ltScore = s.longTermScore || 50;
  const stScore = s.shortTermScore || 50;
  const analystRatingWeight = (s.analystScore || 3.5) * 10;
  const gemBonus = s.isEmergingGem ? 30 : 0;
  const buffettBonus = s.valueSignal?.buffettPasses ? 15 : 0;
  const grahamBonus = s.valueSignal?.grahamPasses ? 10 : 0;

  return (upside * 0.45) + (ltScore * 0.25) + (stScore * 0.1) + analystRatingWeight + gemBonus + buffettBonus + grahamBonus;
}

export default function EmergingGems({ stocks, onSelectTicker, currencyMode, fxRate }) {
  // 1. Filter candidate gems (marked as emerging gem, high conviction, or high analyst upside)
  const candidates = stocks.filter(s =>
    s.isEmergingGem ||
    (s.impliedUpside || 0) >= 15 ||
    (s.longTermScore || 0) >= 75 ||
    (s.valueSignal && s.valueSignal.buffettPasses)
  );

  // 2. Rank candidate gems by calculated Potential Score
  const ranked = [...candidates].sort((a, b) => calculatePotentialScore(b) - calculatePotentialScore(a));

  // 3. Select top potential stocks ensuring cross-market regional diversity (US, Europe, Asia, India)
  const selectedGems = [];
  const selectedRegions = new Set();

  // First pass: pick highest potential stock per region
  for (const stock of ranked) {
    const region = getMarketRegion(stock.country);
    if (!selectedRegions.has(region)) {
      selectedGems.push(stock);
      selectedRegions.add(region);
      if (selectedGems.length >= 4) break;
    }
  }

  // Second pass: fill remaining slots with highest overall potential if needed
  if (selectedGems.length < 4) {
    for (const stock of ranked) {
      if (!selectedGems.some(s => s.symbol === stock.symbol)) {
        selectedGems.push(stock);
        if (selectedGems.length >= 4) break;
      }
    }
  }

  const gems = selectedGems;

  if (gems.length === 0) return null;

  return (
    <div style={{ marginBottom: '32px' }}>

      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            padding: '10px', borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.22) 0%, rgba(139, 92, 246, 0.22) 100%)',
            color: '#f59e0b', boxShadow: '0 0 20px rgba(245, 158, 11, 0.2)'
          }}>
            <Rocket size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Emerging High-Value Stocks <Sparkles size={16} color="#f59e0b" />
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              High-conviction market disrupters · Graham/Buffett signals · Reddit sentiment overlaid
            </p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '18px' }}>
        {gems.map(stock => {
          const vs = stock.valueSignal || {};
          const isValueGem = vs.isValueGem;
          const cardClass = `glass-panel ${isValueGem ? (vs.buffettPasses ? 'conviction-gem-card' : 'value-gem-card') : ''}`;

          return (
            <div
              key={stock.symbol}
              className={cardClass}
              style={{
                padding: '20px',
                borderLeft: isValueGem
                  ? `4px solid ${vs.buffettPasses ? '#34d399' : '#f59e0b'}`
                  : '4px solid rgba(245, 158, 11, 0.4)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
              onClick={() => onSelectTicker(stock)}
            >

              {/* ── Row 1: Symbol + Name + Badges ── */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '3px' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#fff', flexShrink: 0 }}>
                      ${stock.symbol}
                    </span>
                    <span className="badge badge-exchange" style={{ fontSize: '0.63rem', padding: '1px 6px' }}>
                      {stock.exchange?.split('/')[0]?.trim()}
                    </span>
                    {stock.country && (
                      <span className="badge" style={{ fontSize: '0.63rem', padding: '1px 6px', background: 'rgba(255,255,255,0.08)', color: '#cbd5e1' }}>
                        {stock.country.split('/')[0]?.trim()}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {stock.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{stock.sector}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                  <span className={`badge ${stock.bullishRatio >= 65 ? 'badge-bullish' : 'badge-neutral'}`} style={{ fontSize: '0.68rem' }}>
                    <TrendingUp size={11} /> {stock.bullishRatio}% Bull
                  </span>
                  {vs.valueBadge && (
                    <span className={`badge ${vs.valueBadge.badgeClass}`} style={{ fontSize: '0.66rem', padding: '2px 7px' }}>
                      {vs.valueBadge.label}
                    </span>
                  )}
                </div>
              </div>

              {/* ── Row 2: Price + Change ── */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', background: 'rgba(0,0,0,0.45)',
                borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Market Price</div>
                  <div style={{ fontWeight: 800, fontSize: '1.0rem', color: '#fff', fontFamily: 'var(--font-mono)' }}>
                    {formatCurrency(stock.price, currencyMode, fxRate, stock.nativeCurrency)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>24h Change</div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', fontFamily: 'var(--font-mono)', color: stock.change24h >= 0 ? '#34d399' : '#fb7185' }}>
                    {stock.change24h >= 0 ? `+${stock.change24h}%` : `${stock.change24h}%`}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Target Upside</div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', fontFamily: 'var(--font-mono)', color: (stock.impliedUpside || 0) >= 0 ? '#34d399' : '#fb7185' }}>
                    {(stock.impliedUpside || 0) >= 0 ? `+${stock.impliedUpside}%` : `${stock.impliedUpside}%`}
                  </div>
                </div>
              </div>

              {/* ── Row 3: Reddit Sentiment Bar ── */}
              {vs.sentimentLabel && (
                <div style={{
                  padding: '8px 12px', borderRadius: 'var(--radius-md)',
                  background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MessageSquare size={13} color={vs.sentimentColor} />
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: vs.sentimentColor }}>
                      {vs.sentimentEmoji} Reddit: {vs.sentimentLabel}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Buzz:</span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#fbbf24' }}>{vs.buzzTier}</span>
                  </div>
                </div>
              )}

              {/* ── Row 4: Catalyst & Risk ── */}
              <div style={{
                background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)',
                padding: '10px 12px', border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', flexDirection: 'column', gap: '6px'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', color: '#38bdf8', lineHeight: 1.4 }}>
                  <Zap size={13} style={{ minWidth: 13, marginTop: '2px', flexShrink: 0 }} />
                  <div style={{ fontSize: '0.76rem', overflow: 'hidden' }}>
                    <strong style={{ color: '#fff' }}>Catalyst: </strong>
                    <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {stock.catalyst || stock.gemReason}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', color: '#fbbf24', lineHeight: 1.4 }}>
                  <ShieldAlert size={13} style={{ minWidth: 13, marginTop: '2px', flexShrink: 0 }} />
                  <div style={{ fontSize: '0.76rem', overflow: 'hidden' }}>
                    <strong style={{ color: '#fff' }}>Risk: </strong>
                    <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {stock.downsideRisk}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Row 5: Footer Stats ── */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: '10px', borderTop: '1px solid var(--border-color)',
                fontSize: '0.73rem', flexWrap: 'wrap', gap: '6px'
              }}>
                <div style={{ display: 'flex', gap: '10px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                  <span>P/E: <strong style={{ color: '#fff' }}>{stock.peRatio > 0 ? `${stock.peRatio}x` : 'N/A'}</strong></span>
                  <span>P/B: <strong style={{ color: '#fff' }}>{stock.pbRatio ? `${stock.pbRatio}x` : 'N/A'}</strong></span>
                  <span>Cap: <strong style={{ color: '#fff' }}>{stock.marketCap}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 800 }}>
                  Deep Dive <ArrowUpRight size={13} />
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
