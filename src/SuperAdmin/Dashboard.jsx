import React, { useState, useEffect } from 'react';
import Sidebar from '../components/SuperAdmin/Sidebar';
import Topbar from '../components/SuperAdmin/Topbar';
import api from '../api/apiConfig';
import Dashpage from "./dashpage";

// Dashboard API function
const fetchDashboardData = async (filter) => {
    try {
        const query = filter ? `?filter=${filter}` : '';
        const response = await api.get(`/lawma/superadmins/dashboard${query}`);
        // Return .data if it exists, else response itself, to handle axios vs fetch differences if any,
        // but typically axios returns { data: ... }
        return response.data?.data ?? response.data;
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        throw error;
    }
};

// --- Skeleton Components ---
const StatCardSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-4 bg-zinc-200 rounded w-1/3 mb-2"></div>
        <div className="h-6 bg-zinc-200 rounded w-2/3"></div>
    </div>
);

const ChartSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-4 bg-zinc-200 rounded w-1/4 mb-4"></div>
        <div className="h-64 bg-zinc-200 rounded"></div>
    </div>
);

const UserDistributionSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-4 bg-zinc-200 rounded w-1/3 mb-4"></div>
        <div className="flex items-center">
            <div className="rounded-full bg-zinc-200 w-32 h-32"></div>
            <div className="ml-6 flex-1">
                <div className="h-6 bg-zinc-200 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-zinc-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-zinc-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-zinc-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-zinc-200 rounded w-1/2"></div>
            </div>
        </div>
    </div>
);

const TopCompaniesSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-4 bg-zinc-200 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-zinc-200 rounded w-1/2 mb-6"></div>
        <div className="space-y-3">
            <div className="h-4 bg-zinc-200 rounded"></div>
            <div className="h-4 bg-zinc-200 rounded w-5/6"></div>
            <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
            <div className="h-4 bg-zinc-200 rounded w-4/5"></div>
        </div>
    </div>
);

// --- Dashboard Skeleton Component ---
const DashboardSkeleton = () => (
    <div className="max-w-8xl mx-auto">
        <header className="mb-8">
            <div className="animate-pulse">
                <div className="h-8 bg-zinc-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-zinc-200 rounded w-1/4"></div>
            </div>
        </header>

        <div className="space-y-8">
            {/* Top Stats and Chart Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
                        <StatCardSkeleton />
                        <div className="border-l-2 border-zinc-200 pl-8">
                            <StatCardSkeleton />
                        </div>
                        <div className="border-l-2 border-zinc-200 pl-8">
                            <StatCardSkeleton />
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 animate-pulse">
                        <div className="h-10 bg-zinc-200 rounded w-32"></div>
                    </div>
                </div>
                <div className="mt-8">
                    <ChartSkeleton />
                </div>
            </div>

            {/* Bottom Cards Section */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left Card: User Distribution */}
                <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-6">
                    <UserDistributionSkeleton />
                </div>

                {/* Right Card: PSP Companies */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                    <TopCompaniesSkeleton />
                </div>
            </div>
        </div>
    </div>
);

// --- Main App Component ---
export default function Dashboard() {
    const [apiPayload, setApiPayload] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('mtd');

    // Real API call to fetch dashboard data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetchDashboardData(filter);
                setApiPayload(response);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filter]);

    if (error) {
        return (
            <div className="flex min-h-screen bg-zinc-50">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Topbar />
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                        <div className="max-w-8xl mx-auto">
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Error! </strong>
                                <span className="block sm:inline">Failed to load dashboard data: {error}</span>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-zinc-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto ">
                    {loading || !apiPayload ? (
                        <div className='p-4 sm:p-6 lg:p-8'>
                            <DashboardSkeleton />
                        </div>
                    ) : (
                        <Dashpage
                            backendDashboard={apiPayload}
                            currentFilter={filter}
                            onFilterChange={setFilter}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}
