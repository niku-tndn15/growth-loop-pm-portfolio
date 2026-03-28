import React from 'react';

export default function Header() {
  return (
    <div className="bg-[#111928] text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1A56DB] rounded-lg flex items-center justify-center font-bold text-sm">GL</div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Growth Loop Portfolio</h1>
            <p className="text-xs text-gray-400">B2C Growth Case Study — Nikunj Tandan</p>
          </div>
        </div>
      </div>
    </div>
  );
}
