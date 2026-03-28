import React, { useState, useEffect } from 'react';
import SectionHeader from '../shared/SectionHeader';
import InsightBox from '../shared/InsightBox';
import SkeletonLoader from '../shared/SkeletonLoader';

const API = '/api';

const componentCards = [
  {
    id: 'trigger',
    color: '#1A56DB',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    title: 'The Aha Moment Share',
    label: 'TRIGGER',
    description: 'Triggered at peak emotional engagement — after a user completes their first meaningful action (e.g., sends first transaction, hits a streak milestone, achieves a goal). Not a push notification — an in-product moment.',
    decision: 'Trigger fires at D3 post-activation, only if user completed core action. No trigger for users who haven\'t activated.',
    risk: 'Premature triggering before value realization kills share rate. Test trigger timing rigorously.',
  },
  {
    id: 'action',
    color: '#0E9F6E',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    title: 'Frictionless Share',
    label: 'ACTION',
    description: 'One-tap share with pre-filled message. Deep link carries referrer_id and lands new user on the exact feature page the referrer was using. Survives App Store redirect via Branch.io.',
    decision: 'Pre-fill message with personalized copy based on what the referrer just accomplished. Generic "Join me!" performs 40% worse than specific copy.',
    risk: 'Deep link breakage on iOS 17+ due to privacy changes. Fallback to promo code if deep link fails.',
  },
  {
    id: 'reward',
    color: '#E3A008',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    title: 'Two-Sided Incentive',
    label: 'REWARD',
    description: 'Referrer gets $10 in-app credit after referee completes first qualifying action (not just signup). Referee gets 30-day premium free trial. Reward is tied to product value, not cash.',
    decision: 'Delayed reward (post-activation, not post-signup) filters low-intent users and prevents fraud. In-app credit increases retention vs cash payout.',
    risk: 'Reward value must be recalculated quarterly as LTV changes. If reward > LTV, loop becomes unit-economics negative.',
  },
  {
    id: 'reentry',
    color: '#7C3AED',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    title: 'Referred User Becomes Referrer',
    label: 'RE-ENTRY',
    description: 'Referred user enters same loop at D3. Target: 30% of referred users make at least one referral themselves within 30 days. This is what creates compounding (K > 0 at second generation).',
    decision: 'Referred users get a "You were referred by [Name]" moment on their D3 share prompt — social proof increases share rate by 22% vs cold prompt.',
    risk: 'Loop breaks if re-entry rate drops below 15%. Monitor weekly.',
  },
];

export default function GrowthLoopDesigner() {
  const [kfactor, setKfactor] = useState(null);
  const [invites, setInvites] = useState(4.2);
  const [acceptRate, setAcceptRate] = useState(13);
  const [activeNode, setActiveNode] = useState(null);

  useEffect(() => {
    fetch(`${API}/kfactor`)
      .then(r => r.json())
      .then(d => {
        setKfactor(d);
        setInvites(d.invites_per_user);
        setAcceptRate(d.acceptance_rate);
      })
      .catch(() => {});
  }, []);

  const k = invites * (acceptRate / 100);
  const kColor = k > 0.4 ? '#0E9F6E' : k >= 0.2 ? '#E3A008' : '#C81E1E';
  const kLabel = k > 1.0 ? 'Viral — app grows on its own'
    : k >= 0.4 ? 'Strong organic assist — significant CAC reduction'
    : k >= 0.2 ? 'Meaningful boost — worth the investment'
    : 'Weak signal — revisit trigger and reward design';

  const totalOrganic = k < 1 ? Math.round((k / (1 - k)) * 1000) : 'Infinite';

  const saveKfactor = () => {
    fetch(`${API}/kfactor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invites_per_user: invites, acceptance_rate: acceptRate }),
    }).catch(() => {});
  };

  const resetDefaults = () => {
    setInvites(4.2);
    setAcceptRate(13);
  };

  useEffect(() => {
    const t = setTimeout(saveKfactor, 500);
    return () => clearTimeout(t);
  }, [invites, acceptRate]);

  if (!kfactor) return <SkeletonLoader lines={6} />;

  // Loop node positions for SVG
  const nodes = [
    { id: 'trigger', label: 'NEW USER', x: 200, y: 40, color: '#1A56DB' },
    { id: 'action', label: 'VALUE MOMENT\n/ TRIGGER', x: 380, y: 140, color: '#0E9F6E' },
    { id: 'reward', label: 'REFERRAL\nACTION', x: 300, y: 280, color: '#E3A008' },
    { id: 'reentry', label: 'REWARD +\nRE-ENTRY', x: 100, y: 180, color: '#7C3AED' },
  ];

  return (
    <div>
      <SectionHeader
        title="Growth Loop Designer"
        subtitle="Interactive loop architecture with K-factor calculator"
      />

      <InsightBox>
        A growth loop is not a feature — it's a system. Each component (trigger, action, reward, re-entry)
        must be individually optimized, but the magic is in the connections. The K-factor calculator below
        shows how small improvements in share rate or acceptance rate compound into massive user acquisition gains.
      </InsightBox>

      {/* Loop Diagram */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Growth Loop Architecture</h3>
        <div className="flex justify-center">
          <svg viewBox="0 0 500 340" className="w-full max-w-lg">
            {/* Arrows */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" />
              </marker>
            </defs>
            {/* Arrow: New User → Value Moment */}
            <path d="M 270 60 Q 340 60 360 110" fill="none" stroke="#6B7280" strokeWidth="2" markerEnd="url(#arrowhead)" />
            {/* Arrow: Value Moment → Referral Action */}
            <path d="M 400 190 Q 390 240 350 270" fill="none" stroke="#6B7280" strokeWidth="2" markerEnd="url(#arrowhead)" />
            {/* Arrow: Referral Action → Reward */}
            <path d="M 250 280 Q 190 270 160 230" fill="none" stroke="#6B7280" strokeWidth="2" markerEnd="url(#arrowhead)" />
            {/* Arrow: Reward → New User */}
            <path d="M 120 150 Q 130 90 170 60" fill="none" stroke="#6B7280" strokeWidth="2" markerEnd="url(#arrowhead)" />

            {/* Nodes */}
            {nodes.map((n) => {
              const isActive = activeNode === n.id;
              const lines = n.label.split('\n');
              return (
                <g key={n.id} onClick={() => setActiveNode(activeNode === n.id ? null : n.id)} className="cursor-pointer">
                  <rect
                    x={n.x - 60} y={n.y - 10} width={120} height={lines.length > 1 ? 50 : 36}
                    rx={10} ry={10}
                    fill={isActive ? n.color : 'white'}
                    stroke={n.color} strokeWidth={isActive ? 3 : 2}
                  />
                  {lines.map((line, li) => (
                    <text
                      key={li}
                      x={n.x} y={n.y + 12 + li * 18}
                      textAnchor="middle"
                      fill={isActive ? 'white' : n.color}
                      fontSize="11" fontWeight="600" fontFamily="Inter"
                    >
                      {line}
                    </text>
                  ))}
                </g>
              );
            })}
          </svg>
        </div>
        <p className="text-xs text-center text-[#6B7280] mt-2">Click a node to highlight its detail card below</p>
      </div>

      {/* Component Cards */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {componentCards.map((card) => (
          <div
            key={card.id}
            className={`${card.bgColor} ${card.borderColor} border rounded-lg p-5 transition-all ${
              activeNode === card.id ? 'ring-2 ring-offset-2' : ''
            }`}
            style={activeNode === card.id ? { ringColor: card.color } : {}}
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded text-white"
                style={{ backgroundColor: card.color }}
              >
                {card.label}
              </span>
              <span className="font-semibold text-sm" style={{ color: card.color }}>{card.title}</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">{card.description}</p>
            <div className="text-xs space-y-2">
              <div>
                <span className="font-semibold text-gray-800">Design Decision: </span>
                <span className="text-gray-600">{card.decision}</span>
              </div>
              <div>
                <span className="font-semibold text-[#C81E1E]">Risk: </span>
                <span className="text-gray-600">{card.risk}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* K-Factor Calculator */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">K-Factor Calculator</h3>
          <button
            onClick={resetDefaults}
            className="text-xs text-[#6B7280] hover:text-[#111928] border border-[#E5E7EB] px-3 py-1.5 rounded transition-colors"
          >
            Reset to defaults
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-2">
              Invites sent per active user: <span className="font-bold text-[#111928]">{invites.toFixed(1)}</span>
            </label>
            <input
              type="range" min="0" max="20" step="0.1" value={invites}
              onChange={e => setInvites(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1A56DB]"
            />
            <div className="flex justify-between text-xs text-[#6B7280] mt-1">
              <span>0</span><span>20</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#6B7280] mb-2">
              Invite acceptance rate: <span className="font-bold text-[#111928]">{acceptRate.toFixed(0)}%</span>
            </label>
            <input
              type="range" min="0" max="100" step="1" value={acceptRate}
              onChange={e => setAcceptRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1A56DB]"
            />
            <div className="flex justify-between text-xs text-[#6B7280] mt-1">
              <span>0%</span><span>100%</span>
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="text-center mb-6">
          <span className="text-sm text-[#6B7280]">K-Factor</span>
          <div className="text-5xl font-bold mt-1" style={{ color: kColor }}>
            K = {k.toFixed(2)}
          </div>
          <p className="text-sm mt-2 font-medium" style={{ color: kColor }}>{kLabel}</p>
        </div>

        {/* Compounding explanation */}
        {k > 0 && k < 1 && (
          <div className="bg-[#F9FAFB] rounded-lg p-4 text-sm text-[#6B7280]">
            <p className="font-medium text-[#111928] mb-1">Compounding Effect</p>
            <p>
              At K={k.toFixed(2)}, every 1,000 paid users generate{' '}
              <span className="font-semibold text-[#111928]">{Math.round(k * 1000)}</span> organic users in generation 1,{' '}
              <span className="font-semibold text-[#111928]">{Math.round(k * k * 1000)}</span> in generation 2,{' '}
              <span className="font-semibold text-[#111928]">{Math.round(k * k * k * 1000)}</span> in generation 3...{' '}
              Total organic users per 1,000 paid ={' '}
              <span className="font-bold text-[#1A56DB]">{totalOrganic.toLocaleString()}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
