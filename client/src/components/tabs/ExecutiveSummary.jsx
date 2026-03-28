import React from 'react';
import SectionHeader from '../shared/SectionHeader';
import KPICard from '../shared/KPICard';
import InsightBox from '../shared/InsightBox';
import DataTable from '../shared/DataTable';

const phases = [
  { phase: 'Discovery', timeline: 'Month 1', objective: 'Validate growth loop hypothesis through user research and data analysis', metric: 'User sharing motivation map completed' },
  { phase: 'Loop Design', timeline: 'Month 1–2', objective: 'Design referral mechanics, reward structure, and trigger timing', metric: 'PRD approved; economics model validated' },
  { phase: 'Pilot', timeline: 'Month 4–5', objective: 'Test loop with 100 internal users; validate fraud controls', metric: 'Share rate >5%; zero critical bugs' },
  { phase: 'Scale', timeline: 'Month 5–9', objective: 'A/B test at 10% traffic, optimize, and roll out to 100%', metric: 'K-factor ≥0.40; LTV:CAC >3.0x' },
];

const columns = [
  { key: 'phase', label: 'Phase' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'objective', label: 'Key Objective' },
  { key: 'metric', label: 'Success Metric' },
];

export default function ExecutiveSummary() {
  return (
    <div>
      <SectionHeader
        title="Executive Summary"
        subtitle="Growth Loop Design for a B2C App — Strategic Overview"
      />

      <InsightBox>
        The core reframe: stop treating referrals as a campaign and start treating them as a compounding system.
        A K-factor of 0.55 means every 100 paid users generate 55 organic users — that compounds across every cohort indefinitely.
      </InsightBox>

      {/* Hero KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard label="Baseline CAC" value="18.40" prefix="$" color="red" />
        <KPICard label="Target CAC with Loop" value="11.20" prefix="$" color="green" />
        <KPICard label="Current K-Factor" value="0.18" color="amber" />
        <KPICard label="Target K-Factor" value="0.55" color="blue" />
      </div>

      {/* Project Overview */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] mb-8">
        <div className="px-6 py-4 border-b border-[#E5E7EB]">
          <h3 className="text-lg font-semibold">Project Overview</h3>
        </div>
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E5E7EB]">
          <div className="p-6">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-[#C81E1E] mb-3">Problem Statement</h4>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Our B2C app spends $18.40 average CAC across paid channels, but loses 62% of acquired users before
              activation. The effective cost per retained user is $57.20. Meanwhile, the highest-quality users —
              those arriving via referral and word-of-mouth — represent only 11% of new users. We have no
              systematic mechanism to amplify organic acquisition, leaving compounding growth on the table.
            </p>
          </div>
          <div className="p-6">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-[#0E9F6E] mb-3">Hypothesis</h4>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              By designing a product-integrated referral growth loop — with carefully timed triggers, two-sided
              incentives, and a re-entry mechanism — we can increase the K-factor from 0.18 to 0.55, reducing
              blended CAC by 39% while acquiring users with 74% higher LTV. This creates a self-reinforcing system
              where each cohort of paid users generates additional organic users at near-zero marginal cost.
            </p>
          </div>
        </div>
      </div>

      {/* Phase Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.08)] mb-8">
        <div className="px-6 py-4 border-b border-[#E5E7EB]">
          <h3 className="text-lg font-semibold">Project Phases</h3>
        </div>
        <DataTable columns={columns} data={phases} />
      </div>

      {/* Download as PDF */}
      <div className="flex justify-end no-print">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A56DB] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download as PDF
        </button>
      </div>
    </div>
  );
}
