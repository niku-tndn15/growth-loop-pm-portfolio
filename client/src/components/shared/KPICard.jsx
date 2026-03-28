import React from 'react';

const colorMap = {
  red: 'text-[#C81E1E]',
  green: 'text-[#0E9F6E]',
  amber: 'text-[#E3A008]',
  blue: 'text-[#1A56DB]',
};

const bgMap = {
  red: 'bg-red-50',
  green: 'bg-green-50',
  amber: 'bg-amber-50',
  blue: 'bg-blue-50',
};

export default function KPICard({ label, value, color = 'blue', prefix = '', suffix = '' }) {
  return (
    <div className={`bg-white border border-[#E5E7EB] rounded-lg p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex flex-col items-center`}>
      <span className="text-sm font-medium text-[#6B7280] uppercase tracking-wide mb-2">{label}</span>
      <div className={`flex items-baseline gap-1 ${bgMap[color]} px-4 py-2 rounded-lg`}>
        {prefix && <span className={`text-lg font-semibold ${colorMap[color]}`}>{prefix}</span>}
        <span className={`text-3xl font-bold ${colorMap[color]}`}>{value}</span>
        {suffix && <span className={`text-lg font-semibold ${colorMap[color]}`}>{suffix}</span>}
      </div>
    </div>
  );
}
