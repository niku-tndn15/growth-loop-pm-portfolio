import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import SectionHeader from '../shared/SectionHeader';
import InsightBox from '../shared/InsightBox';
import DataTable from '../shared/DataTable';
import SkeletonLoader from '../shared/SkeletonLoader';

const API = '/api';

const defaults = {
  monthly_paid_users: 4125,
  blended_cac: 18.40,
  average_ltv: 52.00,
  current_k: 0.18,
  reward_cost: 22.00,
  target_k: 0.55,
  ltv_uplift: 74,
};

export default function LTVCACModel() {
  const [data, setData] = useState(null);
  const [inputs, setInputs] = useState(defaults);

  useEffect(() => {
    fetch(`${API}/ltvcac`)
      .then(r => r.json())
      .then(d => {
        setData(d);
        setInputs(d.inputs);
      })
      .catch(() => {});
  }, []);

  const updateField = (key, val) => {
    const next = { ...inputs, [key]: parseFloat(val) || 0 };
    setInputs(next);
    fetch(`${API}/ltvcac`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    }).catch(() => {});
  };

  const resetDefaults = () => {
    setInputs(defaults);
    fetch(`${API}/ltvcac`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(defaults),
    }).catch(() => {});
  };

  if (!data) return <SkeletonLoader lines={6} />;

  // Calculations
  const { monthly_paid_users, blended_cac, average_ltv, current_k, reward_cost, target_k, ltv_uplift } = inputs;
  const baselineLtvCac = average_ltv / blended_cac;

  const organicPerPaid = target_k < 1 ? target_k / (1 - target_k) : 10;
  const organicUsers = Math.round(monthly_paid_users * organicPerPaid);
  const totalUsers = monthly_paid_users + organicUsers;
  const referredLtv = average_ltv * (1 + ltv_uplift / 100);
  const blendedLtv = (monthly_paid_users * average_ltv + organicUsers * referredLtv) / totalUsers;
  const blendedCacWithLoop = (monthly_paid_users * blended_cac + organicUsers * reward_cost) / totalUsers;
  const loopLtvCac = blendedLtv / blendedCacWithLoop;

  const costWithout = totalUsers * blended_cac;
  const costWith = monthly_paid_users * blended_cac + organicUsers * reward_cost;
  const revWithout = totalUsers * average_ltv;
  const revWith = monthly_paid_users * average_ltv + organicUsers * referredLtv;
  const netImprovement = (revWith - costWith) - (revWithout - costWithout);

  const scenarioColumns = [
    { key: 'scenario', label: 'Scenario' },
    { key: 'k_factor', label: 'K-Factor' },
    { key: 'blended_ltv', label: 'Blended LTV' },
    { key: 'blended_cac', label: 'Blended CAC' },
    { key: 'ltv_cac', label: 'LTV:CAC' },
    { key: 'monthly_value_add', label: 'Monthly Value Add' },
  ];

  const renderScenarioCell = (row, key) => {
    if (key === 'blended_ltv') return `$${row.blended_ltv}`;
    if (key === 'blended_cac') return `$${row.blended_cac.toFixed(2)}`;
    if (key === 'ltv_cac') {
      const v = row.ltv_cac;
      const color = v > 3 ? 'text-[#0E9F6E] bg-green-50' : v >= 2.5 ? 'text-[#E3A008] bg-amber-50' : 'text-[#C81E1E] bg-red-50';
      return <span className={`${color} px-2 py-0.5 rounded font-semibold text-xs`}>{v}x</span>;
    }
    if (key === 'monthly_value_add') return row.monthly_value_add ? `+$${row.monthly_value_add.toLocaleString()}` : '—';
    return row[key];
  };

  const paybackData = data.payback.map(p => ({
    ...p,
    fill: p.months < 5 ? '#0E9F6E' : p.months < 10 ? '#E3A008' : '#C81E1E',
  }));

  return (
    <div>
      <SectionHeader
        title="LTV:CAC Model"
        subtitle="Interactive unit economics model with scenario analysis"
      />

      <InsightBox>
        The LTV:CAC model is the financial proof point for the growth loop. By blending organic
        (loop-generated) users with paid acquisition, we improve unit economics from 2.8x to 3.3x
        while simultaneously growing total user volume. The key insight: referred users have 74%
        higher LTV, which lifts the entire blended average.
      </InsightBox>

      {/* Interactive Calculator */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Interactive LTV:CAC Calculator</h3>
          <button onClick={resetDefaults} className="text-xs text-[#6B7280] hover:text-[#111928] border border-[#E5E7EB] px-3 py-1.5 rounded transition-colors">
            Reset to defaults
          </button>
        </div>

        {/* Current State Inputs */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-3">Current State (Baseline)</h4>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { key: 'monthly_paid_users', label: 'Monthly paid users', prefix: '' },
              { key: 'blended_cac', label: 'Blended CAC (paid)', prefix: '$' },
              { key: 'average_ltv', label: 'Average LTV', prefix: '$' },
              { key: 'current_k', label: 'Current K-factor', prefix: '' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-[#6B7280] mb-1">{f.label}</label>
                <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden">
                  {f.prefix && <span className="px-3 bg-[#F9FAFB] text-[#6B7280] text-sm border-r border-[#E5E7EB]">{f.prefix}</span>}
                  <input
                    type="number" value={inputs[f.key]}
                    onChange={e => updateField(f.key, e.target.value)}
                    className="flex-1 px-3 py-2 text-sm outline-none" step="any"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* With Loop Inputs */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-3">With Growth Loop</h4>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { key: 'reward_cost', label: 'Reward cost per referral', prefix: '$' },
              { key: 'target_k', label: 'Target K-factor', prefix: '' },
              { key: 'ltv_uplift', label: 'LTV uplift for referred users', suffix: '%' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-[#6B7280] mb-1">{f.label}</label>
                <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden">
                  {f.prefix && <span className="px-3 bg-[#F9FAFB] text-[#6B7280] text-sm border-r border-[#E5E7EB]">{f.prefix}</span>}
                  <input
                    type="number" value={inputs[f.key]}
                    onChange={e => updateField(f.key, e.target.value)}
                    className="flex-1 px-3 py-2 text-sm outline-none" step="any"
                  />
                  {f.suffix && <span className="px-3 bg-[#F9FAFB] text-[#6B7280] text-sm border-l border-[#E5E7EB]">{f.suffix}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Output Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <span className="text-xs text-[#6B7280] block mb-1">Baseline LTV:CAC</span>
            <span className="text-3xl font-bold text-[#E3A008]">{baselineLtvCac.toFixed(2)}x</span>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <span className="text-xs text-[#6B7280] block mb-1">With Loop LTV:CAC</span>
            <span className="text-3xl font-bold text-[#0E9F6E]">{loopLtvCac.toFixed(2)}x</span>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <span className="text-xs text-[#6B7280] block mb-1">Organic Users Generated</span>
            <span className="text-3xl font-bold text-[#1A56DB]">{organicUsers.toLocaleString()}</span>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <span className="text-xs text-[#6B7280] block mb-1">Net Monthly Improvement</span>
            <span className="text-3xl font-bold text-[#0E9F6E]">${Math.round(netImprovement).toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-[#F9FAFB] rounded-lg p-4 text-sm text-[#6B7280] space-y-1">
          <p>Referred user LTV: ${average_ltv} x {(1 + ltv_uplift/100).toFixed(2)} = <span className="font-semibold text-[#111928]">${referredLtv.toFixed(2)}</span></p>
          <p>Blended LTV: ({monthly_paid_users.toLocaleString()} x ${average_ltv} + {organicUsers.toLocaleString()} x ${referredLtv.toFixed(2)}) / {totalUsers.toLocaleString()} = <span className="font-semibold text-[#111928]">${blendedLtv.toFixed(2)}</span></p>
          <p>Blended CAC: ({monthly_paid_users.toLocaleString()} x ${blended_cac} + {organicUsers.toLocaleString()} x ${reward_cost}) / {totalUsers.toLocaleString()} = <span className="font-semibold text-[#111928]">${blendedCacWithLoop.toFixed(2)}</span></p>
        </div>
      </div>

      {/* Scenario Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] mb-8">
        <div className="px-6 py-4 border-b border-[#E5E7EB]">
          <h3 className="text-lg font-semibold">Scenario Comparison</h3>
        </div>
        <DataTable columns={scenarioColumns} data={data.scenarios} renderCell={renderScenarioCell} />
      </div>

      {/* Payback Period Chart */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
        <h3 className="text-lg font-semibold mb-4">Payback Period by Channel</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={paybackData} layout="vertical" margin={{ top: 5, right: 50, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis type="number" tickFormatter={v => `${v}mo`} stroke="#6B7280" fontSize={12} label={{ value: 'Months to Payback', position: 'bottom', offset: -5, fill: '#6B7280', fontSize: 12 }} />
            <YAxis type="category" dataKey="channel" width={140} stroke="#6B7280" fontSize={12} />
            <Tooltip formatter={v => `${v} months`} />
            <Bar dataKey="months" radius={[0, 4, 4, 0]} barSize={28}>
              {paybackData.map((e, i) => <Cell key={i} fill={e.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
