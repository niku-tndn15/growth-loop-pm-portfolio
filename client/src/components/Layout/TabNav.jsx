import React from 'react';

const tabs = [
  { id: 0, label: 'Executive Summary' },
  { id: 1, label: 'Acquisition Funnel' },
  { id: 2, label: 'Growth Loop' },
  { id: 3, label: 'Referral Mechanics' },
  { id: 4, label: 'Cohort Analysis' },
  { id: 5, label: 'LTV:CAC Model' },
  { id: 6, label: 'Roadmap & Metrics' },
];

export default function TabNav({ activeTab, onTabChange }) {
  return (
    <div className="bg-white border-b border-[#E5E7EB] sticky top-0 z-40 no-print">
      <div className="max-w-7xl mx-auto">
        <nav className="flex overflow-x-auto scrollbar-hide -mb-px" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors flex-shrink-0
                ${activeTab === tab.id
                  ? 'border-[#1A56DB] text-[#1A56DB]'
                  : 'border-transparent text-[#6B7280] hover:text-[#111928] hover:border-gray-300'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
