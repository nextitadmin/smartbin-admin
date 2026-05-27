import React from 'react';

const PSPManagementSkeletonLoader = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
      <table className="w-full min-w-[900px] m-4 table-auto border-collapse">
        <thead className="border-b border-zinc-200">
          <tr>
            <th className="lg:p-6 p-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider w-12">
              <div className="h-4 bg-zinc-200 rounded w-8 animate-pulse"></div>
            </th>
            <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider">
              <div className="h-4 bg-zinc-200 rounded w-24 animate-pulse"></div>
            </th>
            <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">
              <div className="h-4 bg-zinc-200 rounded w-20 animate-pulse"></div>
            </th>
            <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider">
              <div className="h-4 bg-zinc-200 rounded w-16 animate-pulse"></div>
            </th>
            <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider">
              <div className="h-4 bg-zinc-200 rounded w-24 animate-pulse"></div>
            </th>
            <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider min-w-[120px]">
              <div className="h-4 bg-zinc-200 rounded w-20 animate-pulse"></div>
            </th>
            <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider">
              <div className="h-4 bg-zinc-200 rounded w-16 animate-pulse"></div>
            </th>
            <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider">
              <div className="h-4 bg-zinc-200 rounded w-16 animate-pulse"></div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200">
          {[...Array(5)].map((_, index) => (
            <tr key={index} className="hover:bg-zinc-50 transition-colors duration-150">
              <td className="lg:p-6 p-3 text-sm text-zinc-500">
                <div className="h-4 bg-zinc-200 rounded w-6 animate-pulse"></div>
              </td>
              <td className="lg:p-6 p-3 text-sm text-zinc-900">
                <div className="h-4 bg-zinc-200 rounded w-32 animate-pulse"></div>
              </td>
              <td className="lg:p-6 p-3 text-sm text-zinc-700 hidden md:table-cell">
                <div className="h-4 bg-zinc-200 rounded w-40 animate-pulse"></div>
              </td>
              <td className="lg:p-6 p-3 text-sm text-zinc-700">
                <div className="h-4 bg-zinc-200 rounded w-28 animate-pulse"></div>
              </td>
              <td className="lg:p-6 p-3 text-sm text-zinc-700">
                <div className="h-4 bg-zinc-200 rounded w-20 animate-pulse"></div>
              </td>
              <td className="lg:p-6 p-3 text-sm text-zinc-700 min-w-[120px]">
                <div className="h-4 bg-zinc-200 rounded w-24 animate-pulse"></div>
              </td>
              <td className="lg:p-6 p-3 text-sm">
                <div className="h-4 bg-zinc-200 rounded w-16 animate-pulse"></div>
              </td>
              <td className="lg:p-6 p-3">
                <div className="h-4 bg-zinc-200 rounded w-6 animate-pulse"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PSPManagementSkeletonLoader;
