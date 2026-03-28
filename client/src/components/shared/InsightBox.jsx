import React from 'react';

export default function InsightBox({ children, variant = 'blue' }) {
  const styles = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    amber: 'bg-amber-50 border-amber-200 text-amber-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    red: 'bg-red-50 border-red-200 text-red-900',
  };

  return (
    <div className={`${styles[variant]} border rounded-lg p-5 my-6`}>
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0 mt-0.5">💡</span>
        <div>
          <span className="font-semibold text-sm uppercase tracking-wide block mb-1">PM Insight</span>
          <p className="text-sm leading-relaxed m-0">{children}</p>
        </div>
      </div>
    </div>
  );
}
