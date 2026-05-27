import React from 'react';
import Sidebar from './LawmaAdmin/Sidebar';
import Topbar from './LawmaAdmin/Topbar';

const SmartbinManagementSkeleton = () => {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Real Sidebar */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Real Topbar */}
        <Topbar />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-8xl mx-auto">
            {/* Real Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-zinc-800">Smart Bin Management</h1>
              <p className="text-zinc-500 mt-1">Smartbins overview and requests</p>
            </header>
            
            {/* Real Tab Navigation */}
            <div className='inline-flex gap-7 text-lg mb-7 border-b border-b-2 border-zinc-200'>
              <button
                type="button"
                className="relative pb-2 -mb-[1.5px] transition-colors duration-300 ease-out
                  after:content-[''] after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-full after:bg-green-700
                  after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out
                  text-green-700 after:scale-x-100"
              >
                Overview
              </button>
              <button
                type="button"
                className="relative pb-2 -mb-[1.5px] transition-colors duration-300 ease-out
                  after:content-[''] after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-full after:bg-green-700
                  after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out
                  text-zinc-500 hover:text-zinc-700 after:scale-x-0"
              >
                Requests
              </button>
            </div>

            {/* Overview tab content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Info Cards skeleton */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="col-span-1 h-full">
                    <div className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
                      <div className="flex flex-col items-start space-y-2 h-full">
                        <div className="p-1 rounded-full bg-zinc-200 w-12 h-12"></div>
                        <div className="flex flex-col space-y-2 w-full">
                          <div className="h-4 bg-zinc-200 rounded w-32"></div>
                          <div className="h-8 bg-zinc-200 rounded w-24"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart section skeleton */}
              <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm">
                <div className="animate-pulse">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <div>
                      <div className="h-4 bg-zinc-200 rounded w-48 mb-2"></div>
                      <div className="h-10 bg-zinc-200 rounded w-32"></div>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                      <div className="h-10 bg-zinc-200 rounded w-32"></div>
                      <div className="h-10 bg-zinc-200 rounded w-24"></div>
                    </div>
                  </div>

                  {/* Chart skeleton */}
                  <div className="w-full h-80 bg-zinc-100 rounded-lg flex items-center justify-center">
                    <div className="text-zinc-400">Loading chart...</div>
                  </div>
                  
                  <div className="h-4 bg-zinc-200 rounded w-48 mx-auto mt-2"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SmartbinManagementSkeleton;
