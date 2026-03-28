import React from 'react';

export default function SkeletonLoader({ lines = 3, height = 'h-4' }) {
  return (
    <div className="animate-pulse space-y-3 p-6">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`${height} bg-gray-200 rounded w-${i === lines - 1 ? '2/3' : 'full'}`} />
      ))}
    </div>
  );
}
