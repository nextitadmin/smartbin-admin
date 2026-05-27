import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const SmartbinOverviewSkeletonLoader = () => {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-8xl mx-auto">
            {/* Header skeleton */}
            <header className="mb-8">
              <div className="h-8 bg-zinc-200 rounded w-1/3 mb-2 animate-pulse"></div>
              <div className="h-4 bg-zinc-200 rounded w-1/4 animate-pulse"></div>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Chart Section skeleton */}
              <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm animate-pulse">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <div>
                    <div className="h-4 bg-zinc-200 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-zinc-200 rounded w-2/5"></div>
                  </div>
                  <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                    <div className="h-8 bg-zinc-200 rounded w-32"></div>
                    <div className="h-8 bg-zinc-200 rounded w-32"></div>
                  </div>
                </div>

                {/* Chart skeleton */}
                <div className="w-full h-80 bg-zinc-100 rounded-lg flex items-center justify-center">
                  <div className="h-4 bg-zinc-200 rounded w-1/3"></div>
                </div>
                <div className="h-4 bg-zinc-200 rounded w-1/4 mt-2 mx-auto"></div>
              </div>

              {/* Info Cards and Recent Deliveries skeleton */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Info Cards skeleton */}
                <div className="md:col-span-1 space-y-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="bg-zinc-200 rounded-full w-12 h-12"></div>
                      <div>
                        <div className="h-4 bg-zinc-200 rounded w-24 mb-2"></div>
                        <div className="h-8 bg-zinc-200 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="bg-zinc-200 rounded-full w-12 h-12"></div>
                      <div>
                        <div className="h-4 bg-zinc-200 rounded w-24 mb-2"></div>
                        <div className="h-8 bg-zinc-200 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Table skeleton */}
                <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm animate-pulse">
                  <div className="flex justify-between items-center mb-4">
                    <div className="h-6 bg-zinc-200 rounded w-1/3"></div>
                    <div className="h-4 bg-zinc-200 rounded w-12"></div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="text-zinc-500">
                        <tr>
                          <th className="font-semibold py-2 pr-2">
                            <div className="h-4 bg-zinc-200 rounded w-8"></div>
                          </th>
                          <th className="font-semibold py-2 px-2">
                            <div className="h-4 bg-zinc-200 rounded w-12"></div>
                          </th>
                          <th className="font-semibold py-2 px-2">
                            <div className="h-4 bg-zinc-200 rounded w-16"></div>
                          </th>
                          <th className="font-semibold py-2 px-2">
                            <div className="h-4 bg-zinc-200 rounded w-16"></div>
                          </th>
                          <th className="font-semibold py-2 pl-2">
                            <div className="h-4 bg-zinc-200 rounded w-20"></div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-zinc-700">
                        {[...Array(3)].map((_, index) => (
                          <tr key={index} className="border-t border-zinc-100">
                            <td className="py-3 pr-2">
                              <div className="h-4 bg-zinc-200 rounded w-4"></div>
                            </td>
                            <td className="py-3 px-2">
                              <div className="h-4 bg-zinc-200 rounded w-16"></div>
                            </td>
                            <td className="py-3 px-2">
                              <div className="h-6 bg-zinc-200 rounded w-20"></div>
                            </td>
                            <td className="py-3 px-2">
                              <div className="h-4 bg-zinc-200 rounded w-24"></div>
                            </td>
                            <td className="py-3 pl-2">
                              <div className="h-4 bg-zinc-200 rounded w-32"></div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SmartbinOverviewSkeletonLoader;