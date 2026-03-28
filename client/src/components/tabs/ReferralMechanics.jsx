import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import SectionHeader from '../shared/SectionHeader';
import InsightBox from '../shared/InsightBox';
import DataTable from '../shared/DataTable';
import SkeletonLoader from '../shared/SkeletonLoader';

const API = '/api';

const programDesign = [
  { dimension: 'Reward type', choice: 'In-app credit (not cash)', rationale: 'Increases retention, reduces fraud' },
  { dimension: 'Reward trigger', choice: "After referee's first qualifying action", rationale: 'Filters bots' },
  { dimension: 'Reward cap', choice: 'Max 20 referrals/user/month', rationale: 'Prevents professional referrers' },
  { dimension: 'Referral window', choice: '30-day cookie expiry', rationale: 'Standard attribution window' },
  { dimension: 'Two-sided', choice: 'Yes — both parties rewarded', rationale: '2x conversion vs one-sided' },
  { dimension: 'Fraud check', choice: 'Device fingerprint + email domain', rationale: 'Catches 89% of fraud types' },
];

const fraudRisks = [
  { vector: 'Self-referral (same device)', likelihood: 'High', mitigation: 'Device fingerprinting' },
  { vector: 'Fake account farms', likelihood: 'Medium', mitigation: 'Email domain + activation gate' },
  { vector: 'Incentive abuse (power referrers)', likelihood: 'Medium', mitigation: 'Monthly cap' },
  { vector: 'Collusion (friends gaming system)', likelihood: 'Low', mitigation: 'Velocity limits' },
];

export default function ReferralMechanics() {
  const [econ, setEcon] = useState(null);
  const [inputs, setInputs] = useState({
    avg_ltv_referred: 84,
    referrer_reward: 10,
    referee_reward: 12,
    fraud_rate: 4,
  });

  useEffect(() => {
    fetch(`${API}/referral-econ`)
      .then(r => r.json())
      .then(d => {
        setEcon(d);
        setInputs(d);
      })
      .catch(() => {});
  }, []);

  const updateField = (key, val) => {
    const next = { ...inputs, [key]: parseFloat(val) || 0 };
    setInputs(next);
    fetch(`${API}/referral-econ`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    }).catch(() => {});
  };

  const resetDefaults = () => {
    const defaults = { avg_ltv_referred: 84, referrer_reward: 10, referee_reward: 12, fraud_rate: 4 };
    setInputs(defaults);
    fetch(`${API}/referral-econ`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(defaults),
    }).catch(() => {});
  };

  if (!econ) return <SkeletonLoader lines={6} />;

  const totalRewardCost = inputs.referrer_reward + inputs.referee_reward;
  const fraudCost = inputs.avg_ltv_referred * (inputs.fraud_rate / 100);
  const netValue = inputs.avg_ltv_referred - totalRewardCost - fraudCost;
  const roi = ((netValue / totalRewardCost) * 100);
  const breakeven = totalRewardCost / (1 - inputs.fraud_rate / 100);

  const barData = [
    { name: 'Reward Cost', value: totalRewardCost, fill: '#C81E1E' },
    { name: 'Net Value', value: Math.max(0, netValue), fill: '#0E9F6E' },
  ];

  const designColumns = [
    { key: 'dimension', label: 'Dimension' },
    { key: 'choice', label: 'Design Choice' },
    { key: 'rationale', label: 'Rationale' },
  ];

  const fraudColumns = [
    { key: 'vector', label: 'Attack Vector' },
    { key: 'likelihood', label: 'Likelihood' },
    { key: 'mitigation', label: 'Mitigation' },
  ];

  const renderFraudCell = (row, key) => {
    if (key === 'likelihood') {
      const colors = { High: 'text-[#C81E1E] bg-red-50', Medium: 'text-[#E3A008] bg-amber-50', Low: 'text-[#0E9F6E] bg-green-50' };
      return <span className={`${colors[row.likelihood]} px-2 py-0.5 rounded text-xs font-semibold`}>{row.likelihood}</span>;
    }
    return row[key];
  };

  return (
    <div>
      <SectionHeader
        title="Referral Program Mechanics"
        subtitle="Unit economics, fraud prevention, and program design decisions"
      />

      <InsightBox>
        Referral programs fail when they optimize for volume over quality. The economics model below shows that
        tying rewards to post-activation behavior (not just signup) is critical. A $22 total reward cost
        generating $58+ net value per referral is a 266% ROI — but only if fraud stays under 5%.
      </InsightBox>

      {/* Economics Calculator */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Referral Economics Calculator</h3>
          <button onClick={resetDefaults} className="text-xs text-[#6B7280] hover:text-[#111928] border border-[#E5E7EB] px-3 py-1.5 rounded transition-colors">
            Reset to defaults
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { key: 'avg_ltv_referred', label: 'Avg LTV (referred user)', prefix: '$' },
            { key: 'referrer_reward', label: 'Referrer reward cost', prefix: '$' },
            { key: 'referee_reward', label: 'Referee reward cost', prefix: '$' },
            { key: 'fraud_rate', label: 'Fraud rate estimate', suffix: '%' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">{f.label}</label>
              <div className="flex items-center border border-[#E5E7EB] rounded-lg overflow-hidden">
                {f.prefix && <span className="px-3 bg-[#F9FAFB] text-[#6B7280] text-sm border-r border-[#E5E7EB]">{f.prefix}</span>}
                <input
                  type="number"
                  value={inputs[f.key]}
                  onChange={e => updateField(f.key, e.target.value)}
                  className="flex-1 px-3 py-2 text-sm outline-none"
                  step={f.key === 'fraud_rate' ? 0.5 : 1}
                />
                {f.suffix && <span className="px-3 bg-[#F9FAFB] text-[#6B7280] text-sm border-l border-[#E5E7EB]">{f.suffix}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Outputs */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#F9FAFB] rounded-lg p-4 text-center">
            <span className="text-xs text-[#6B7280] block">Total Reward Cost</span>
            <span className="text-2xl font-bold text-[#111928]">${totalRewardCost.toFixed(2)}</span>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <span className="text-xs text-[#6B7280] block">Net Value / Referral</span>
            <span className="text-2xl font-bold text-[#0E9F6E]">${netValue.toFixed(2)}</span>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <span className="text-xs text-[#6B7280] block">ROI per Referral</span>
            <span className="text-2xl font-bold text-[#1A56DB]">{roi.toFixed(0)}%</span>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <span className="text-xs text-[#6B7280] block">Breakeven LTV Threshold</span>
            <span className="text-2xl font-bold text-[#E3A008]">${breakeven.toFixed(2)}</span>
          </div>
        </div>

        {/* Bar Chart */}
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
            <YAxis tickFormatter={v => `$${v}`} stroke="#6B7280" fontSize={12} />
            <Tooltip formatter={v => `$${v.toFixed(2)}`} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
              {barData.map((e, i) => <Cell key={i} fill={e.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Program Design Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] mb-8">
        <div className="px-6 py-4 border-b border-[#E5E7EB]">
          <h3 className="text-lg font-semibold">Program Design</h3>
        </div>
        <DataTable columns={designColumns} data={programDesign} />
      </div>

      {/* Fraud Prevention */}
      <div className="bg-red-50 border border-red-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-red-200">
          <h3 className="text-lg font-semibold text-[#C81E1E] flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Fraud Risk Framework
          </h3>
        </div>
        <DataTable columns={fraudColumns} data={fraudRisks} renderCell={renderFraudCell} />
      </div>
    </div>
  );
}
