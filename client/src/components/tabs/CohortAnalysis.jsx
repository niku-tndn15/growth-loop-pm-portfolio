import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import SectionHeader from '../shared/SectionHeader';
import InsightBox from '../shared/InsightBox';
import DataTable from '../shared/DataTable';
import SkeletonLoader from '../shared/SkeletonLoader';

const API = '/api';

export default function CohortAnalysis() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API}/cohorts`).then(r => r.json()).then(setData).catch(() => {});
  }, []);

  if (!data) return <SkeletonLoader lines={6} />;

  const { cohorts, retention, ltv } = data;

  const retentionData = retention.map(r => ({
    day: `D${r.day}`,
    Referred: r.referred,
    Organic: r.organic,
  }));

  const ltvData = ltv.map(r => ({
    month: `M${r.month}`,
    Referred: r.referred,
    Paid: r.paid,
  }));

  const cohortColumns = [
    { key: 'cohort', label: 'Cohort' },
    { key: 'referred_users', label: 'Referred Users' },
    { key: 'organic_users', label: 'Organic Users' },
    { key: 'd30_ret_ref', label: 'D30 Ret (Ref)' },
    { key: 'd30_ret_org', label: 'D30 Ret (Org)' },
    { key: 'ltv_ref', label: 'LTV Ref' },
    { key: 'ltv_org', label: 'LTV Org' },
    { key: 'delta_ltv', label: 'Delta LTV' },
  ];

  const renderCohortCell = (row, key) => {
    if (key === 'd30_ret_ref' || key === 'd30_ret_org') return `${row[key]}%`;
    if (key === 'ltv_ref' || key === 'ltv_org') return `$${row[key]}`;
    if (key === 'delta_ltv') return <span className="text-[#0E9F6E] font-semibold">+{row[key]}%</span>;
    if (key === 'referred_users' || key === 'organic_users') return row[key].toLocaleString();
    return row[key];
  };

  const RetentionTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-3 shadow-lg text-sm">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}%</p>
        ))}
      </div>
    );
  };

  const LtvTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-3 shadow-lg text-sm">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: ${p.value}</p>
        ))}
      </div>
    );
  };

  return (
    <div>
      <SectionHeader
        title="Cohort Analysis"
        subtitle="Retention and LTV comparison between referred and organically acquired users"
      />

      <InsightBox>
        Cohort data is the strongest evidence for growth loop investment. The 21pp D30 retention advantage
        of referred users isn't just a selection effect — referred users arrive with social context and higher
        intent, leading to deeper product engagement and 74%+ higher lifetime value.
      </InsightBox>

      {/* Retention Curve */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 mb-8">
        <h3 className="text-lg font-semibold mb-1">Retention Curves</h3>
        <p className="text-sm text-[#6B7280] mb-4">Referred vs Organic/Paid — average across all cohorts</p>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={retentionData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
            <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} stroke="#6B7280" fontSize={12} />
            <Tooltip content={<RetentionTooltip />} />
            <Legend />
            <Area type="monotone" dataKey="Referred" stroke="#1A56DB" fill="#1A56DB" fillOpacity={0.15} strokeWidth={2} dot={{ r: 4 }} />
            <Area type="monotone" dataKey="Organic" stroke="#6B7280" fill="#6B7280" fillOpacity={0.05} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex justify-center mt-2">
          <span className="bg-blue-50 text-[#1A56DB] text-xs font-semibold px-3 py-1 rounded">
            +22pp retention advantage at D30
          </span>
        </div>
      </div>

      {/* LTV Curve */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 mb-8">
        <h3 className="text-lg font-semibold mb-1">Cumulative LTV Curves</h3>
        <p className="text-sm text-[#6B7280] mb-4">12-month LTV trajectory — Referred vs Paid Acquired</p>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={ltvData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
            <YAxis tickFormatter={v => `$${v}`} stroke="#6B7280" fontSize={12} />
            <Tooltip content={<LtvTooltip />} />
            <Legend />
            <Area type="monotone" dataKey="Referred" stroke="#0E9F6E" fill="#0E9F6E" fillOpacity={0.15} strokeWidth={2} dot={{ r: 4 }} />
            <Area type="monotone" dataKey="Paid" stroke="#C81E1E" fill="#C81E1E" fillOpacity={0.05} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Cohort Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] mb-8">
        <div className="px-6 py-4 border-b border-[#E5E7EB]">
          <h3 className="text-lg font-semibold">Cohort Comparison Table</h3>
        </div>
        <DataTable columns={cohortColumns} data={cohorts} renderCell={renderCohortCell} />
      </div>

      {/* Insight Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-5">
          <p className="text-sm text-green-900 leading-relaxed">
            <span className="font-semibold block mb-1">Retention Advantage</span>
            Referred users retain at 54% on D30 vs 33% for paid — a 21pp advantage. This means referred
            users are 1.6x more likely to still be active a month after signup.
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
          <p className="text-sm text-blue-900 leading-relaxed">
            <span className="font-semibold block mb-1">LTV Premium</span>
            The LTV gap widens over time. At Month 6, referred users have generated $61 vs $33
            for paid — a 85% LTV premium.
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
          <p className="text-sm text-amber-900 leading-relaxed">
            <span className="font-semibold block mb-1">Compounding Loop</span>
            Referred users have a 31% secondary referral rate — they are 2.4x more likely to refer
            others than organically acquired users, creating compounding loop generations.
          </p>
        </div>
      </div>
    </div>
  );
}
