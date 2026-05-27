import React from 'react';

const PSPCompaniesSkeletonLoader = () => {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="">
              <th className="p-3 text-sm font-semibold text-zinc-600 uppercase">
                <div className="h-4 bg-zinc-200 rounded w-8 animate-pulse"></div>
              </th>
              <th className="p-3 text-sm font-semibold text-zinc-600 w-auto uppercase">
                <div className="h-4 bg-zinc-200 rounded w-16 animate-pulse"></div>
              </th>
              <th className="p-3 text-sm font-semibold text-zinc-600 md:table-cell uppercase">
                <div className="h-4 bg-zinc-200 rounded w-24 animate-pulse"></div>
              </th>
              <th className="p-3 text-sm font-semibold text-zinc-600 hidden md:table-cell uppercase">
                <div className="h-4 bg-zinc-200 rounded w-28 animate-pulse"></div>
              </th>
              <th className="p-3 text-sm font-semibold text-zinc-600 hidden md:table-cell uppercase">
                <div className="h-4 bg-zinc-200 rounded w-16 animate-pulse"></div>
              </th>
              <th className="p-3 text-sm font-semibold text-zinc-600 md:table-cell min-w-[120px] uppercase">
                <div className="h-4 bg-zinc-200 rounded w-20 animate-pulse"></div>
              </th>
              <th className="p-3 text-sm font-semibold text-zinc-600 uppercase">
                <div className="h-4 bg-zinc-200 rounded w-16 animate-pulse"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="border-b border-zinc-200">
                <td className="p-3">
                  <div className="h-4 bg-zinc-200 rounded w-6 animate-pulse"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-zinc-200 rounded w-32 animate-pulse"></div>
                </td>
                <td className="p-3 hidden md:table-cell">
                  <div className="h-4 bg-zinc-200 rounded w-40 animate-pulse"></div>
                </td>
                <td className="p-3 hidden md:table-cell">
                  <div className="h-4 bg-zinc-200 rounded w-28 animate-pulse"></div>
                </td>
                <td className="p-3 hidden md:table-cell">
                  <div className="h-4 bg-zinc-200 rounded w-20 animate-pulse"></div>
                </td>
                <td className="p-3 hidden md:table-cell">
                  <div className="h-4 bg-zinc-200 rounded w-24 animate-pulse"></div>
                </td>
                <td className="p-3">
                  <div className="h-4 bg-zinc-200 rounded w-20 animate-pulse"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PSPCompaniesSkeletonLoader;
