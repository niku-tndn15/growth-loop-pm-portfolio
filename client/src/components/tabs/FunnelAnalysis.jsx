import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import SectionHeader from '../shared/SectionHeader';
import InsightBox from '../shared/InsightBox';
import DataTable from '../shared/DataTable';
import SkeletonLoader from '../shared/SkeletonLoader';

const API = '/api';

export default function FunnelAnalysis() {
  const [funnel, setFunnel] = useState(null);
  const [channels, setChannels] = useState(null);

  useEffect(() => {
    fetch(`${API}/funnel`).then(r => r.json()).then(setFunnel).catch(() => {});
    fetch(`${API}/channels`).then(r => r.json()).then(setChannels).catch(() => {});
  }, []);

  if (!funnel || !channels) return <SkeletonLoader lines={6} />;

  // Find biggest drop-off stage
  let maxDrop = 0, maxDropIdx = 0;
  funnel.forEach((s, i) => {
    if (i > 0) {
      const drop = funnel[i - 1].value - s.value;
      if (drop > maxDrop) { maxDrop = drop; maxDropIdx = i; }
    }
  });

  const funnelData = funnel.map((s, i) => ({
    ...s,
    fill: i === maxDropIdx ? '#C81E1E' : '#1A56DB',
    convLabel: s.rate ? `${s.rate}%` : '',
  }));

  const channelColumns = [
    { key: 'channel', label: 'Channel' },
    { key: 'monthly_users', label: 'Monthly Users' },
    { key: 'cac', label: 'CAC' },
    { key: 'd30_retention', label: 'D30 Retention' },
    { key: 'ltv_cac', label: 'LTV:CAC' },
  ];

  const renderChannelCell = (row, key) => {
    if (key === 'cac') return `$${row.cac.toFixed(2)}`;
    if (key === 'd30_retention') return `${row.d30_retention}%`;
    if (key === 'ltv_cac') {
      const v = row.ltv_cac;
      const color = v > 3 ? 'text-[#0E9F6E] bg-green-50' : v >= 2 ? 'text-[#E3A008] bg-amber-50' : 'text-[#C81E1E] bg-red-50';
      return <span className={`${color} px-2 py-0.5 rounded font-semibold text-xs`}>{v}x</span>;
    }
    if (key === 'monthly_users') return row.monthly_users.toLocaleString();
    return row[key];
  };

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-3 shadow-lg text-sm">
        <p className="font-semibold">{d.stage}</p>
        <p className="text-[#6B7280]">{d.value.toLocaleString()} users</p>
        {d.rate && <p className="text-[#1A56DB]">{d.rate}% conversion</p>}
      </div>
    );
  };

  return (
    <div>
      <SectionHeader
        title="Acquisition Funnel Analysis"
        subtitle="Understanding where users drop off and which channels deliver the highest quality"
      />

      <InsightBox>
        The funnel reveals a critical insight: our biggest leak is between Signups and Activated (42% conversion).
        Fixing activation is a prerequisite for any growth loop — you can't refer users who haven't experienced value.
        Channel-level data shows referral users retain at 2x the rate of paid, making the economic case for loop investment.
      </InsightBox>

      {/* Funnel Chart */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Acquisition Funnel</h3>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 80, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} stroke="#6B7280" fontSize={12} />
            <YAxis type="category" dataKey="stage" width={100} stroke="#6B7280" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
              {funnelData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
              <LabelList
                dataKey="convLabel"
                position="right"
                style={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-2 mt-2 text-xs text-[#C81E1E]">
          <span className="w-3 h-3 rounded bg-[#C81E1E] inline-block" />
          Biggest drop-off stage highlighted in red
        </div>
      </div>

      {/* Channel Breakdown */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] mb-8">
        <div className="px-6 py-4 border-b border-[#E5E7EB]">
          <h3 className="text-lg font-semibold">Channel Breakdown</h3>
        </div>
        <DataTable columns={channelColumns} data={channels} renderCell={renderChannelCell} />
      </div>

      {/* Leaky Bucket Insight */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">🪣</span>
          <div>
            <span className="font-semibold text-sm text-amber-900 block mb-1">The Leaky Bucket</span>
            <p className="text-sm text-amber-800 leading-relaxed">
              We spend $18.40 avg CAC but lose 62% of users before activation. Effective CAC per retained user = $57.20.
              Referral and organic channels outperform paid by 3x on LTV:CAC — this is the strategic case for investing
              in the growth loop.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
