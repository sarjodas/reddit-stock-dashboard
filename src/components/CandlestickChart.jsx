import React, { useState, useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';
import { formatCurrency } from '../services/stockApi';
import { fetchTimeSeries } from '../services/twelveDataApi';

export default function CandlestickChart({ symbol, basePrice, currencyMode, fxRate, nativeCurrency = 'USD', twelveDataApiKey }) {
  const [timeframe, setTimeframe] = useState('1D'); // '1D', '1W', '1M', '1Y'
  const [chartType, setChartType] = useState('candlestick'); // 'candlestick' or 'line'
  const [hoveredCandle, setHoveredCandle] = useState(null);
  const [livePrice, setLivePrice] = useState(basePrice);
  const [isTickUp, setIsTickUp] = useState(true);
  const [candles, setCandles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const svgRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      if (!twelveDataApiKey) {
        setErrorMsg('Please configure Twelve Data API key in Settings to view historical charts.');
        setCandles([]);
        return;
      }
      setIsLoading(true);
      setErrorMsg(null);
      
      let interval = '1h';
      let outputsize = 30;
      
      if (timeframe === '1D') {
        interval = '5min';
        outputsize = 78;
      } else if (timeframe === '1W') {
        interval = '1h';
        outputsize = 40;
      } else if (timeframe === '1M') {
        interval = '1day';
        outputsize = 22;
      } else if (timeframe === '1Y') {
        interval = '1week';
        outputsize = 52;
      }
      
      const data = await fetchTimeSeries(symbol, interval, twelveDataApiKey, outputsize);
      if (data && data.length > 0) {
        setCandles(data);
      } else {
        setErrorMsg('Failed to fetch historical data or API rate limit reached.');
        setCandles([]);
      }
      setIsLoading(false);
    }
    
    loadData();
    setLivePrice(basePrice);
  }, [symbol, timeframe, basePrice, twelveDataApiKey]);



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

  // Mouse move handler over entire SVG canvas
  const handleMouseMove = (e) => {
    if (!svgRef.current || candles.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const scaleX = width / rect.width;
    const canvasX = mouseX * scaleX;

    const idx = Math.min(candles.length - 1, Math.max(0, Math.floor(canvasX / candleGap)));
    setHoveredCandle(candles[idx]);
  };

  // Hover point coordinates
  const hoverIdx = hoveredCandle ? candles.findIndex(c => c.id === hoveredCandle.id) : -1;
  const hoverX = hoverIdx >= 0 ? hoverIdx * candleGap + candleGap / 2 : 0;
  const hoverY = hoveredCandle
    ? chartPaddingTop + ((maxPrice - hoveredCandle.close) / priceRange) * (height - chartPaddingBottom - chartPaddingTop)
    : 0;

  // FX conversion for hover display
  const eurRate = typeof fxRate === 'object' ? (fxRate.eur || 0.92) : (fxRate || 0.92);
  const activePriceEUR = nativeCurrency === 'EUR'
    ? activeCandle.close
    : activeCandle.close * eurRate;

  return (
    <div style={{
      background: 'rgba(10, 13, 20, 0.75)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      padding: '16px',
      marginBottom: '20px'
    }}>
      {isLoading && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(11, 17, 32, 0.7)', zIndex: 10, borderRadius: 'var(--radius-md)' }}>
          <div className="spinner" style={{ width: '30px', height: '30px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
      )}
      {errorMsg && !isLoading && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(11, 17, 32, 0.9)', zIndex: 10, padding: '20px', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{errorMsg}</span>
        </div>
      )}
      
      {/* Top Header & Timeframe Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>

        
        {/* Live Price Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} color="#10b981" /> {chartType === 'candlestick' ? 'Real-Time OHLC Candlesticks' : 'Real-Time Price Line'}
              <span className="pulse-dot" style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: isTickUp ? '#10b981' : '#ef4444', boxShadow: isTickUp ? '0 0 8px #10b981' : '0 0 8px #ef4444' }}></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: isTickUp ? '#10b981' : '#ef4444', transition: 'color 0.3s' }}>
                {formatCurrency(livePrice, currencyMode, fxRate, nativeCurrency)}
              </span>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: livePrice >= basePrice ? '#10b981' : '#ef4444' }}>
                {livePrice >= basePrice ? `+${(((livePrice - basePrice) / basePrice) * 100).toFixed(2)}%` : `${(((livePrice - basePrice) / basePrice) * 100).toFixed(2)}%`}
              </span>
            </div>
          </div>

          {/* Active Hover Inspection Bar (Shows Native Currency AND EUR) */}
          {activeCandle && (
            <div style={{
              background: hoveredCandle ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.04)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${hoveredCandle ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255,255,255,0.06)'}`,
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              color: 'var(--text-secondary)',
              alignItems: 'center'
            }}>
              <span style={{ color: '#38bdf8', fontWeight: 800 }}>📅 {activeCandle.label}:</span>
              <span>Stock: <strong style={{ color: '#fff' }}>{formatCurrency(activeCandle.close, currencyMode, fxRate, nativeCurrency)}</strong></span>
              <span>EUR: <strong style={{ color: '#34d399' }}>€{activePriceEUR.toFixed(2)}</strong></span>
              <span>O: <strong style={{ color: 'var(--text-muted)' }}>{activeCandle.open}</strong></span>
              <span>H: <strong style={{ color: '#10b981' }}>{activeCandle.high}</strong></span>
              <span>L: <strong style={{ color: '#ef4444' }}>{activeCandle.low}</strong></span>
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
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', display: 'block', cursor: 'crosshair' }}
          onMouseMove={handleMouseMove}
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

          {/* Render Candlesticks, Volume & Transparent Hitboxes */}
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
            const volumeY = height - volumeBarHeight - 25;

            return (
              <g key={candle.id}>
                {/* Transparent Mouse Hitbox for seamless cursor hover on line/candlestick */}
                <rect
                  x={idx * candleGap}
                  y={0}
                  width={candleGap}
                  height={height}
                  fill="transparent"
                />

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

          {/* Interactive Hover Crosshairs & Point Marker */}
          {hoveredCandle && hoverIdx >= 0 && (
            <g>
              {/* Vertical Crosshair Line */}
              <line
                x1={hoverX}
                y1={0}
                x2={hoverX}
                y2={height - 25}
                stroke="#38bdf8"
                strokeDasharray="3 3"
                strokeWidth="1.2"
                opacity="0.75"
              />
              {/* Horizontal Price Crosshair Line */}
              <line
                x1={0}
                y1={hoverY}
                x2={width}
                y2={hoverY}
                stroke="#38bdf8"
                strokeDasharray="3 3"
                strokeWidth="1"
                opacity="0.5"
              />
              {/* Glowing Point Marker Circle */}
              <circle
                cx={hoverX}
                cy={hoverY}
                r="5"
                fill="#38bdf8"
                stroke="#0f172a"
                strokeWidth="2"
                style={{ filter: 'drop-shadow(0 0 6px #38bdf8)' }}
              />
            </g>
          )}

          {/* X-Axis Date / Time Axis Labels */}
          {candles.map((candle, idx) => {
            const step = Math.max(1, Math.floor(candles.length / 5));
            const isLast = idx === candles.length - 1;
            const isStep = idx % step === 0;
            const isTooCloseToEnd = !isLast && (candles.length - 1 - idx) < (step * 0.7);

            if ((!isStep || isTooCloseToEnd) && !isLast) return null;

            const xCenter = idx * candleGap + candleGap / 2;
            const isHovered = hoveredCandle && hoveredCandle.id === candle.id;

            return (
              <g key={`x-label-${idx}`}>
                <line
                  x1={xCenter}
                  y1={height - 22}
                  x2={xCenter}
                  y2={height - 18}
                  stroke={isHovered ? '#38bdf8' : 'rgba(255, 255, 255, 0.2)'}
                />
                <text
                  x={xCenter}
                  y={height - 4}
                  fill={isHovered ? '#38bdf8' : '#94a3b8'}
                  fontSize="9.5"
                  fontWeight={isHovered ? '800' : '600'}
                  textAnchor={idx === 0 ? 'start' : idx === candles.length - 1 ? 'end' : 'middle'}
                  fontFamily="var(--font-mono)"
                >
                  {candle.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

    </div>
  );
}
