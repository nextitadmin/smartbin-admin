import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-x-auto animate-pulse">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-transparent w-12">
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-transparent">
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-transparent">
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-transparent">
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-transparent">
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-transparent">
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, index) => (
            <tr key={index} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
              <td className="px-4 py-3 text-sm text-zinc-700 whitespace-nowrap">
                <div className="h-4 bg-zinc-200 rounded w-6"></div>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-900 whitespace-nowrap">
                <div className="h-4 bg-zinc-200 rounded w-32"></div>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-700 whitespace-nowrap">
                <div className="h-4 bg-zinc-200 rounded w-40"></div>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-700 whitespace-nowrap">
                <div className="h-4 bg-zinc-200 rounded w-28"></div>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-700 whitespace-nowrap">
                <div className="h-4 bg-zinc-200 rounded w-24"></div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="h-4 bg-zinc-200 rounded w-8"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkeletonLoader;