import React, { useState, useEffect } from 'react';
import SectionHeader from '../shared/SectionHeader';
import InsightBox from '../shared/InsightBox';
import DataTable from '../shared/DataTable';
import SkeletonLoader from '../shared/SkeletonLoader';

const API = '/api';

const abTests = [
  {
    title: 'Experiment 1 — Reward Amount Test',
    hypothesis: '$10 referrer reward vs $15 will show no significant difference in share rate, making $10 the economically optimal choice',
    arms: 'Control ($10) | Treatment ($15) | Treatment B ($7)',
    sampleSize: '12,000 users per arm',
    duration: '21 days',
    primaryMetric: 'Share rate',
    guardrail: 'Reward ROI must stay >150%',
    decision: 'Ship cheapest arm with non-inferior share rate',
  },
  {
    title: 'Experiment 2 — Trigger Timing Test',
    hypothesis: 'Triggering share prompt after first value moment (D3 post-activation) will outperform immediate post-signup prompt',
    arms: 'Control (post-signup) | Treatment (post-activation D3)',
    sampleSize: '8,000 per arm',
    duration: '28 days',
    primaryMetric: 'Referral conversion rate (invite → install)',
    guardrail: 'D7 retention must not decrease in treatment arm',
    decision: '',
  },
];

const riskRegister = [
  { risk: 'Reward economics turn negative at scale', probability: 'Medium', impact: 'High', mitigation: 'Quarterly LTV recalibration + automated kill switch' },
  { risk: 'Fraud rate exceeds 5%', probability: 'Medium', impact: 'Medium', mitigation: 'Device fingerprinting + activation gate' },
  { risk: 'K-factor plateaus at <0.3', probability: 'High', impact: 'High', mitigation: 'Redesign trigger moment; test new reward types' },
  { risk: 'Engineering deprioritizes loop infra', probability: 'Medium', impact: 'High', mitigation: 'Executive sponsor alignment; include in OKRs' },
  { risk: 'App Store policy restricts deep links', probability: 'Low', impact: 'Medium', mitigation: 'Promo code fallback; monitor Apple/Google policy quarterly' },
];

const statusColors = {
  complete: { bg: 'bg-[#0E9F6E]', text: 'Complete' },
  in_progress: { bg: 'bg-[#1A56DB]', text: 'In Progress' },
  upcoming: { bg: 'bg-gray-300', text: 'Upcoming' },
};

export default function RoadmapMetrics() {
  const [roadmap, setRoadmap] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState(null);

  useEffect(() => {
    fetch(`${API}/roadmap`).then(r => r.json()).then(setRoadmap).catch(() => {});
    fetch(`${API}/metrics`).then(r => r.json()).then(setMetrics).catch(() => {});
  }, []);

  if (!roadmap || !metrics) return <SkeletonLoader lines={6} />;

  const totalMonths = 9;
  const monthLabels = Array.from({ length: totalMonths }, (_, i) => `M${i + 1}`);

  const metricsColumns = [
    { key: 'metric', label: 'Metric' },
    { key: 'type', label: 'Type' },
    { key: 'baseline', label: 'Baseline' },
    { key: 'target', label: 'Target' },
    { key: 'owner', label: 'Owner' },
  ];

  const renderMetricCell = (row, key) => {
    if (key === 'type') {
      const colors = {
        'North Star': 'bg-blue-50 text-[#1A56DB]',
        'Input': 'bg-green-50 text-[#0E9F6E]',
        'Output': 'bg-amber-50 text-[#E3A008]',
        'Guardrail': 'bg-red-50 text-[#C81E1E]',
      };
      return <span className={`${colors[row.type] || ''} px-2 py-0.5 rounded text-xs font-semibold`}>{row.type}</span>;
    }
    return row[key];
  };

  const riskColumns = [
    { key: 'risk', label: 'Risk' },
    { key: 'probability', label: 'Probability' },
    { key: 'impact', label: 'Impact' },
    { key: 'mitigation', label: 'Mitigation' },
  ];

  const renderRiskCell = (row, key) => {
    if (key === 'probability' || key === 'impact') {
      const colors = { High: 'text-[#C81E1E] bg-red-50', Medium: 'text-[#E3A008] bg-amber-50', Low: 'text-[#0E9F6E] bg-green-50' };
      return <span className={`${colors[row[key]]} px-2 py-0.5 rounded text-xs font-semibold`}>{row[key]}</span>;
    }
    return row[key];
  };

  return (
    <div>
      <SectionHeader
        title="Roadmap & Metrics"
        subtitle="Execution plan, measurement framework, and risk management"
      />

      <InsightBox>
        A growth loop is a multi-quarter investment. The roadmap below sequences discovery before design,
        pilot before scale — each phase de-risks the next. The metrics framework separates input metrics
        (what we control) from output metrics (what we measure) from guardrails (what we protect).
      </InsightBox>

      {/* Gantt Roadmap */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Project Roadmap</h3>

        {/* Month headers */}
        <div className="grid gap-1" style={{ gridTemplateColumns: `180px repeat(${totalMonths}, 1fr)` }}>
          <div className="text-xs font-semibold text-[#6B7280] py-2">Phase</div>
          {monthLabels.map(m => (
            <div key={m} className="text-xs font-semibold text-[#6B7280] text-center py-2">{m}</div>
          ))}

          {/* Rows */}
          {roadmap.map((phase) => {
            const sc = statusColors[phase.status];
            return (
              <React.Fragment key={phase.id}>
                <div
                  className="text-xs font-medium text-[#111928] py-3 cursor-pointer hover:text-[#1A56DB] transition-colors truncate pr-2"
                  onClick={() => setSelectedPhase(selectedPhase?.id === phase.id ? null : phase)}
                  title="Click for details"
                >
                  {phase.phase}
                </div>
                {monthLabels.map((_, mi) => {
                  const month = mi + 1;
                  const inRange = month >= phase.start_month && month <= phase.end_month;
                  return (
                    <div key={mi} className="py-3 px-0.5">
                      {inRange && (
                        <div
                          className={`${sc.bg} h-6 rounded cursor-pointer hover:opacity-80 transition-opacity`}
                          onClick={() => setSelectedPhase(selectedPhase?.id === phase.id ? null : phase)}
                        />
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-4 text-xs">
          {Object.entries(statusColors).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded ${val.bg}`} />
              <span className="text-[#6B7280]">{val.text}</span>
            </div>
          ))}
          <span className="text-[#6B7280] ml-auto">Click a phase for details</span>
        </div>
      </div>

      {/* Phase Detail Modal/Drawer */}
      {selectedPhase && (
        <div className="bg-white border border-[#1A56DB] rounded-lg shadow-lg p-6 mb-8 animate-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className={`${statusColors[selectedPhase.status].bg} text-white text-xs font-semibold px-2 py-0.5 rounded`}>
                {statusColors[selectedPhase.status].text}
              </span>
              <h4 className="text-lg font-semibold">{selectedPhase.phase}</h4>
              <span className="text-sm text-[#6B7280]">Month {selectedPhase.start_month}–{selectedPhase.end_month}</span>
            </div>
            <button
              onClick={() => setSelectedPhase(null)}
              className="text-[#6B7280] hover:text-[#111928] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-2">Deliverables</h5>
              <p className="text-sm text-[#111928] leading-relaxed">{selectedPhase.deliverables}</p>
            </div>
            <div>
              <h5 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-2">Success Criteria</h5>
              <p className="text-sm text-[#111928] leading-relaxed">{selectedPhase.success_criteria}</p>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Framework */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] mb-8">
        <div className="px-6 py-4 border-b border-[#E5E7EB]">
          <h3 className="text-lg font-semibold">Metrics Framework</h3>
        </div>
        <DataTable columns={metricsColumns} data={metrics} renderCell={renderMetricCell} />
      </div>

      {/* A/B Test Design */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {abTests.map((test, i) => (
          <div key={i} className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5">
            <h4 className="text-sm font-bold text-[#1A56DB] mb-3">{test.title}</h4>
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-semibold text-[#111928]">Hypothesis: </span>
                <span className="text-[#6B7280]">{test.hypothesis}</span>
              </div>
              <div>
                <span className="font-semibold text-[#111928]">Arms: </span>
                <span className="text-[#6B7280]">{test.arms}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-semibold text-[#111928]">Sample: </span>
                  <span className="text-[#6B7280]">{test.sampleSize}</span>
                </div>
                <div>
                  <span className="font-semibold text-[#111928]">Duration: </span>
                  <span className="text-[#6B7280]">{test.duration}</span>
                </div>
              </div>
              <div>
                <span className="font-semibold text-[#111928]">Primary Metric: </span>
                <span className="text-[#6B7280]">{test.primaryMetric}</span>
              </div>
              <div>
                <span className="font-semibold text-[#C81E1E]">Guardrail: </span>
                <span className="text-[#6B7280]">{test.guardrail}</span>
              </div>
              {test.decision && (
                <div>
                  <span className="font-semibold text-[#0E9F6E]">Decision Rule: </span>
                  <span className="text-[#6B7280]">{test.decision}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Risk Register */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div className="px-6 py-4 border-b border-[#E5E7EB]">
          <h3 className="text-lg font-semibold">Risk Register</h3>
        </div>
        <DataTable columns={riskColumns} data={riskRegister} renderCell={renderRiskCell} />
      </div>
    </div>
  );
}
