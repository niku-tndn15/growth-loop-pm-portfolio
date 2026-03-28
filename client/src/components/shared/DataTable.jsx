import React from 'react';

export default function DataTable({ columns, data, renderCell }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs font-semibold uppercase tracking-wide text-[#6B7280] bg-[#F9FAFB] border-b border-[#E5E7EB]">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E7EB]">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-[#F9FAFB] transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                  {renderCell ? renderCell(row, col.key) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
