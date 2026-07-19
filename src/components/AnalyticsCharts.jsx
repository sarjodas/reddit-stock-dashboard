import React from 'react';
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { PieChart as PieIcon, Activity, BarChart3, Target } from 'lucide-react';

export default function AnalyticsCharts({ stocks }) {
  // 1. Time-series mention volume (Simulated 24h timeline points)
  const timeSeriesData = [
    { time: '00:00', NVDA: 18, TSLA: 25, PLTR: 10, AMD: 12 },
    { time: '04:00', NVDA: 22, TSLA: 30, PLTR: 14, AMD: 15 },
    { time: '08:00', NVDA: 45, TSLA: 58, PLTR: 28, AMD: 32 },
    { time: '12:00', NVDA: 85, TSLA: 92, PLTR: 48, AMD: 42 },
    { time: '16:00', NVDA: 110, TSLA: 125, PLTR: 62, AMD: 58 },
    { time: '20:00', NVDA: 135, TSLA: 110, PLTR: 75, AMD: 64 },
    { time: '24:00', NVDA: 142, TSLA: 120, PLTR: 88, AMD: 70 }
  ];

  // 2. Sentiment Donut Distribution
  const totalBull = stocks.reduce((acc, s) => acc + (s.bullishRatio * s.mentionCount) / 100, 0);
  const totalBear = stocks.reduce((acc, s) => acc + ((100 - s.bullishRatio) * s.mentionCount) / 100, 0);

  const pieData = [
    { name: 'Bullish Discussions', value: Math.round(totalBull), color: '#10b981' },
    { name: 'Bearish / Neutral', value: Math.round(totalBear), color: '#ef4444' }
  ];

  // 3. Subreddit Mention Breakdown
  const subredditBarData = [
    { name: 'wallstreetbets', mentions: 340 },
    { name: 'stocks', mentions: 280 },
    { name: 'investing', mentions: 190 },
    { name: 'ValueInvesting', mentions: 140 },
    { name: 'options', mentions: 120 },
    { name: 'pennystocks', mentions: 95 }
  ];

  // 4. Risk vs Return Scatter Plot Data
  const scatterData = stocks.map(s => ({
    symbol: s.symbol,
    riskScore: s.riskModel.riskScore,
    convictionScore: s.longTermScore,
    mentions: s.mentionCount
  }));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px', marginBottom: '28px' }}>
      
      {/* 1. Mention Velocity Time-Series */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Activity size={18} color="#06b6d4" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>24h Discussion Velocity Spikes</h3>
        </div>
        <div style={{ height: '240px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ background: '#121824', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="NVDA" stroke="#38bdf8" fill="rgba(56,189,248,0.15)" strokeWidth={2} />
              <Area type="monotone" dataKey="TSLA" stroke="#f59e0b" fill="rgba(245,158,11,0.15)" strokeWidth={2} />
              <Area type="monotone" dataKey="PLTR" stroke="#8b5cf6" fill="rgba(139,92,246,0.15)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Sentiment Donut Chart */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <PieIcon size={18} color="#10b981" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Overall Sentiment Ratio</h3>
        </div>
        <div style={{ height: '240px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#121824', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Subreddit Heatmap Comparison */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <BarChart3 size={18} color="#8b5cf6" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Subreddit Mention Heatmap</h3>
        </div>
        <div style={{ height: '240px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subredditBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ background: '#121824', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="mentions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Risk vs Return Scatter Plot */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Target size={18} color="#f59e0b" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Risk Rating vs Conviction Matrix</h3>
        </div>
        <div style={{ height: '240px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" dataKey="riskScore" name="Risk Score" unit="/100" stroke="#64748b" fontSize={11} domain={[0, 100]} />
              <YAxis type="number" dataKey="convictionScore" name="Conviction Score" unit="/100" stroke="#64748b" fontSize={11} domain={[0, 100]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: '#121824', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }} />
              <Scatter name="Stocks" data={scatterData} fill="#f59e0b" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
