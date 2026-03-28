import React, { useState } from 'react';
import Header from './components/Layout/Header';
import TabNav from './components/Layout/TabNav';
import ExecutiveSummary from './components/tabs/ExecutiveSummary';
import FunnelAnalysis from './components/tabs/FunnelAnalysis';
import GrowthLoopDesigner from './components/tabs/GrowthLoopDesigner';
import ReferralMechanics from './components/tabs/ReferralMechanics';
import CohortAnalysis from './components/tabs/CohortAnalysis';
import LTVCACModel from './components/tabs/LTVCACModel';
import RoadmapMetrics from './components/tabs/RoadmapMetrics';

const tabs = [
  ExecutiveSummary,
  FunnelAnalysis,
  GrowthLoopDesigner,
  ReferralMechanics,
  CohortAnalysis,
  LTVCACModel,
  RoadmapMetrics,
];

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const ActiveComponent = tabs[activeTab];

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-inter">
      <Header />
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <ActiveComponent />
      </main>

      {/* Floating Portfolio Context Button */}
      <button
        onClick={() => setShowModal(true)}
        className="no-print fixed bottom-6 right-6 bg-[#1A56DB] text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium z-50"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Portfolio Context
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl max-w-lg w-full p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#111928]">About This Portfolio</h3>
              <button onClick={() => setShowModal(false)} className="text-[#6B7280] hover:text-[#111928]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4 text-sm text-[#6B7280] leading-relaxed">
              <p>
                This is a PM portfolio case study built to demonstrate growth product thinking.
                All data is realistic mock data modeled after industry benchmarks for B2C apps
                in the fintech and consumer space.
              </p>
              <p>
                The project showcases end-to-end product management skills: from identifying the
                strategic opportunity (acquisition funnel leaks), through designing a growth loop
                system, to defining metrics frameworks, A/B test plans, and risk mitigation strategies.
              </p>
              <p>
                Every number, chart, and insight reflects real-world patterns observed across
                growth-stage B2C companies, adapted to create a cohesive narrative.
              </p>
              <div className="pt-4 border-t border-[#E5E7EB]">
                <p className="font-semibold text-[#111928]">Built by Nikunj Tandan</p>
                <p className="text-xs text-[#6B7280] mt-1">React + Tailwind CSS + Recharts + Node.js + SQLite</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
