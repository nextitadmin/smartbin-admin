import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const RevenueSkeletonLoader = () => {
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

            <main className="space-y-8">
              {/* Top Section skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Large card skeleton */}
                <div className="lg:col-span-1 bg-zinc-200 rounded-xl shadow-md p-6 relative flex flex-col justify-center animate-pulse">
                  <div className="h-4 bg-zinc-300 rounded w-2/3 mb-4"></div>
                  <div className="h-8 bg-zinc-300 rounded w-1/2"></div>
                </div>

                {/* Revenue sources skeleton */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 flex flex-col justify-center space-y-6 animate-pulse">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="h-4 bg-zinc-200 rounded w-32 mb-2"></div>
                      <div className="h-6 bg-zinc-200 rounded w-24"></div>
                    </div>
                    <div className="h-4 bg-zinc-200 rounded w-20"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="h-4 bg-zinc-200 rounded w-32 mb-2"></div>
                      <div className="h-6 bg-zinc-200 rounded w-24"></div>
                    </div>
                    <div className="h-4 bg-zinc-200 rounded w-20"></div>
                  </div>
                </div>
              </div>

              {/* Chart Section skeleton */}
              <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <div>
                    <div className="h-4 bg-zinc-200 rounded w-24 mb-2"></div>
                    <div className="h-8 bg-zinc-200 rounded w-40 mb-2"></div>
                    <div className="h-4 bg-zinc-200 rounded w-32"></div>
                  </div>
                  <div className="h-10 bg-zinc-200 rounded-lg w-32 mt-4 sm:mt-0"></div>
                </div>
                <div className="mt-4">
                  {/* Chart area skeleton */}
                  <div className="h-64 bg-zinc-100 rounded-lg flex items-center justify-center">
                    <div className="h-4 bg-zinc-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>

              {/* Payment Details Table skeleton */}
              <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-zinc-200 rounded w-1/4 mb-6"></div>

                {/* Table header skeleton */}
                <div className="grid grid-cols-5 gap-4 mb-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="h-4 bg-zinc-200 rounded"></div>
                  ))}
                </div>

                {/* Table rows skeleton */}
                {[...Array(5)].map((_, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-5 gap-4 mb-3">
                    {[...Array(5)].map((_, colIndex) => (
                      <div key={colIndex} className="h-4 bg-zinc-100 rounded"></div>
                    ))}
                  </div>
                ))}
              </div>
            </main>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RevenueSkeletonLoader;