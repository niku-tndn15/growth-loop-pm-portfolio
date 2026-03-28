import React from 'react';

export default function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-[#111928]">{title}</h2>
      {subtitle && <p className="text-[#6B7280] mt-1">{subtitle}</p>}
    </div>
  );
}
