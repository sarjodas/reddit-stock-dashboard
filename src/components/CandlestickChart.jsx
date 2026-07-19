import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, TrendingDown, Clock, Activity } from 'lucide-react';
import { formatCurrency } from '../services/stockApi';

export default function CandlestickChart({ symbol, basePrice, currencyMode, fxRate }) {
  const [timeframe, setTimeframe] = useState('1D'); // '1D', '1W', '1M', '1Y'
  const [chartType, setChartType] = useState('candlestick'); // 'candlestick' or 'line'
  const [hoveredCandle, setHoveredCandle] = useState(null);
  const [livePrice, setLivePrice] = useState(basePrice);
  const [isTickUp, setIsTickUp] = useState(true);
  const [candles, setCandles] = useState([]);

  // Generate realistic OHLC candles based on timeframe & basePrice
  const generateCandleData = (tf, price) => {
    const count = tf === '1D' ? 24 : tf === '1W' ? 30 : tf === '1M' ? 30 : 52;
    const volatilityPct = tf === '1D' ? 0.008 : tf === '1W' ? 0.018 : 0.035;
    
    let currentOpen = price * (1 - (volatilityPct * count * 0.3));
    const result = [];

    for (let i = 0; i < count; i++) {
      const change = (Math.random() - 0.47) * currentOpen * volatilityPct;
      const close = Math.max(1, currentOpen + change);
      const high = Math.max(currentOpen, close) + Math.random() * currentOpen * (volatilityPct * 0.7);
      const low = Math.min(currentOpen, close) - Math.random() * currentOpen * (volatilityPct * 0.7);
      const volume = Math.floor(Math.random() * 500000) + 150000;

      let label = `T-${count - i}`;
      if (tf === '1D') label = `${9 + Math.floor(i * 0.3)}:${(i % 2) * 30 || '00'}`;
      if (tf === '1W') label = `Day ${i + 1}`;
      if (tf === '1M') label = `Day ${i + 1}`;
      if (tf === '1Y') label = `Wk ${i + 1}`;

      result.push({
        id: i,
        label,
        open: parseFloat(currentOpen.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume,
        isBullish: close >= currentOpen
      });

      currentOpen = close;
    }

    // Ensure last candle close matches live price
    if (result.length > 0) {
      result[result.length - 1].close = price;
      result[result.length - 1].high = Math.max(result[result.length - 1].high, price);
      result[result.length - 1].low = Math.min(result[result.length - 1].low, price);
      result[result.length - 1].isBullish = result[result.length - 1].close >= result[result.length - 1].open;
    }

    return result;
  };

  // Initialize candles on symbol/timeframe change
  useEffect(() => {
    setLivePrice(basePrice);
    setCandles(generateCandleData(timeframe, basePrice));
  }, [symbol, timeframe, basePrice]);

  // Real-time live price tick simulation (updates active candle every 2.5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePrice(prev => {
        const delta = (Math.random() - 0.48) * (prev * 0.003);
        const nextPrice = Math.max(1, parseFloat((prev + delta).toFixed(2)));
        setIsTickUp(nextPrice >= prev);

        setCandles(prevCandles => {
          if (prevCandles.length === 0) return prevCandles;
          const updated = [...prevCandles];
          const lastIdx = updated.length - 1;
          const last = { ...updated[lastIdx] };

          last.close = nextPrice;
          last.high = Math.max(last.high, nextPrice);
          last.low = Math.min(last.low, nextPrice);
          last.isBullish = last.close >= last.open;
          updated[lastIdx] = last;
          return updated;
        });

        return nextPrice;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  if (candles.length === 0) return null;

  // Chart dimensions & scaling
  const width = 740;
  const height = 240;
  const volumeHeight = 50;
  const chartPaddingTop = 20;
  const chartPaddingBottom = 60;

  const minPrice = Math.min(...candles.map(c => c.low)) * 0.995;
  const maxPrice = Math.max(...candles.map(c => c.high)) * 1.005;
  const priceRange = maxPrice - minPrice || 1;

  const maxVolume = Math.max(...candles.map(c => c.volume)) || 1;

  const candleWidth = Math.max(4, (width / candles.length) * 0.65);
  const candleGap = width / candles.length;

  const activeCandle = hoveredCandle || candles[candles.length - 1];

  return (
    <div style={{
      background: 'rgba(10, 13, 20, 0.75)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      padding: '16px',
      marginBottom: '20px'
    }}>
      
      {/* Top Header & Timeframe Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
        
        {/* Live Price Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} color="#10b981" /> Real-Time OHLC Candlesticks
              <span className="pulse-dot" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: isTickUp ? '#10b981' : '#ef4444', boxShadow: isTickUp ? '0 0 8px #10b981' : '0 0 8px #ef4444' }}></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: isTickUp ? '#10b981' : '#ef4444', transition: 'color 0.3s' }}>
                {formatCurrency(livePrice, currencyMode, fxRate)}
              </span>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: livePrice >= basePrice ? '#10b981' : '#ef4444' }}>
                {livePrice >= basePrice ? `+${(((livePrice - basePrice) / basePrice) * 100).toFixed(2)}%` : `${(((livePrice - basePrice) / basePrice) * 100).toFixed(2)}%`}
              </span>
            </div>
          </div>

          {/* Active Hover Inspection Bar */}
          {activeCandle && (
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.06)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', display: 'flex', gap: '10px', color: 'var(--text-secondary)' }}>
              <span>O: <strong style={{ color: '#fff' }}>{formatCurrency(activeCandle.open, currencyMode, fxRate)}</strong></span>
              <span>H: <strong style={{ color: '#10b981' }}>{formatCurrency(activeCandle.high, currencyMode, fxRate)}</strong></span>
              <span>L: <strong style={{ color: '#ef4444' }}>{formatCurrency(activeCandle.low, currencyMode, fxRate)}</strong></span>
              <span>C: <strong style={{ color: activeCandle.isBullish ? '#10b981' : '#ef4444' }}>{formatCurrency(activeCandle.close, currencyMode, fxRate)}</strong></span>
            </div>
          )}
        </div>

        {/* Chart Type Selector */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setChartType('candlestick')}
            style={{ padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700, border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: chartType === 'candlestick' ? 'rgba(56, 189, 248, 0.25)' : 'transparent', color: chartType === 'candlestick' ? '#38bdf8' : 'var(--text-muted)' }}
          >
            Candlestick
          </button>
          <button
            onClick={() => setChartType('line')}
            style={{ padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700, border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: chartType === 'line' ? 'rgba(56, 189, 248, 0.25)' : 'transparent', color: chartType === 'line' ? '#38bdf8' : 'var(--text-muted)' }}
          >
            Line
          </button>
        </div>

        {/* Timeframe Selector */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', padding: '3px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          {['1D', '1W', '1M', '1Y'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              style={{
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                background: timeframe === tf ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                color: timeframe === tf ? '#38bdf8' : 'var(--text-muted)'
              }}
            >
              {tf}
            </button>
          ))}
        </div>

      </div>

      {/* SVG Candlestick & Volume Canvas */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
          onMouseLeave={() => setHoveredCandle(null)}
        >
          {/* Horizontal Price Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const p = maxPrice - pct * priceRange;
            const y = chartPaddingTop + pct * (height - chartPaddingBottom - chartPaddingTop);
            return (
              <g key={i}>
                <line x1="0" y1={y} x2={width} y2={y} stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 3" />
                <text x={width - 5} y={y - 4} fill="#64748b" fontSize="9" textAnchor="end" fontFamily="sans-serif">
                  {p.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Render Line Graph */}
          {chartType === 'line' && (
            <polyline
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
              points={candles.map((candle, idx) => {
                const xCenter = idx * candleGap + candleGap / 2;
                const yClose = chartPaddingTop + ((maxPrice - candle.close) / priceRange) * (height - chartPaddingBottom - chartPaddingTop);
                return `${xCenter},${yClose}`;
              }).join(' ')}
            />
          )}

          {/* Render Candlesticks & Volume Histogram */}
          {candles.map((candle, idx) => {
            const xCenter = idx * candleGap + candleGap / 2;
            const xLeft = xCenter - candleWidth / 2;

            // Price Y mapping
            const yHigh = chartPaddingTop + ((maxPrice - candle.high) / priceRange) * (height - chartPaddingBottom - chartPaddingTop);
            const yLow = chartPaddingTop + ((maxPrice - candle.low) / priceRange) * (height - chartPaddingBottom - chartPaddingTop);
            const yOpen = chartPaddingTop + ((maxPrice - candle.open) / priceRange) * (height - chartPaddingBottom - chartPaddingTop);
            const yClose = chartPaddingTop + ((maxPrice - candle.close) / priceRange) * (height - chartPaddingBottom - chartPaddingTop);

            const bodyTop = Math.min(yOpen, yClose);
            const bodyHeight = Math.max(2, Math.abs(yClose - yOpen));

            const color = candle.isBullish ? '#10b981' : '#ef4444';
            const volumeBarHeight = (candle.volume / maxVolume) * volumeHeight;
            const volumeY = height - volumeBarHeight - 15;

            return (
              <g
                key={candle.id}
                onMouseEnter={() => setHoveredCandle(candle)}
                style={{ cursor: 'pointer' }}
              >
                {/* Volume Bar */}
                <rect
                  x={xLeft}
                  y={volumeY}
                  width={candleWidth}
                  height={volumeBarHeight}
                  fill={candle.isBullish ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}
                  rx="1"
                />

                {/* Candlestick Wick & Body (Only if type is candlestick) */}
                {chartType === 'candlestick' && (
                  <>
                    <line
                      x1={xCenter}
                      y1={yHigh}
                      x2={xCenter}
                      y2={yLow}
                      stroke={color}
                      strokeWidth="1.2"
                    />
                    <rect
                      x={xLeft}
                      y={bodyTop}
                      width={candleWidth}
                      height={bodyHeight}
                      fill={color}
                      rx="1"
                      stroke={color}
                      strokeWidth="0.5"
                    />
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

    </div>
  );
}
