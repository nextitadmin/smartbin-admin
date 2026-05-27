import React, { useState, useEffect } from 'react';
// Note: You'll need to install recharts for this component to work:
// npm install recharts
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/SuperAdmin/Sidebar';
import Topbar from '../components/SuperAdmin/Topbar';
import api from '../api/apiConfig';

// Dashboard API function
const fetchDashboardData = async () => {
  try {
    const response = await api.get("lawma/superadmins/dashboard");
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

// --- Default Data for missing API values ---
// Since the API doesn't provide monthly requests data, we use some example data
const defaultMonthlyRequests = [
    { name: 'JAN', requests: 220000 },
    { name: 'FEB', requests: 150000 },
    { name: 'MAR', requests: 120000 },
    { name: 'APR', requests: 80000 },
    { name: 'MAY', requests: 180000 },
    { name: 'JUN', requests: 130000 },
    { name: 'JUL', requests: 140000 },
    { name: 'AUG', requests: 110000 },
    { name: 'SEP', requests: 130000 },
    { name: 'OCT', requests: 190000 },
    { name: 'NOV', requests: 210000 },
    { name: 'DEC', requests: 120000 },
];

// Default user distribution colors
const userDistributionColors = [
    { name: 'Resident users', color: '#008236' },
    { name: 'Agents', color: '#818CF8' },
    { name: 'Facility Managers', color: '#4F46E5' },
    { name: 'Corporate users', color: '#F59E0B' },
];

// Default top PSP companies
const defaultTopPSPCompanies = [
    { name: 'Eze sons and kids limited', staff: 50 },
    { name: 'Opulent Gsp Properties And Resources', staff: 80 },
    { name: 'Abass cleaning Intl', staff: 200 },
    { name: 'Sonika International Limited', staff: 15 },
];

// --- SVG Icons ---
import { ChevronDownIcon } from '../components/icons';

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

// --- Dashboard View Component ---
const DashboardView = ({ dashboardData }) => {
    const navigate = useNavigate();

    // --- Chart Components ---
    const MonthlyRequestsChart = ({ data }) => {
        // Transform data to have two separate values for side-by-side bars
        const transformedData = data.map(item => ({
            ...item,
            requests1: item.requests * 0.7, // Example split - adjust as needed
            requests2: item.requests * 0.3  // Example split - adjust as needed
        }));

        return (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={transformedData} margin={{ top: 20, right: 0, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}k`} tick={{ fill: '#6B7280' }} />
                    <Tooltip cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }} />
                    <Bar dataKey="requests1" fill="#008236" barSize={8} radius={[10, 10, 0, 0]} />
                    <Bar dataKey="requests2" fill="#e4e4e4" barSize={8} radius={[10, 10, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        );
    };

    // Hook to detect mobile devices and window resize
    const useIsMobile = () => {
        const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

        useEffect(() => {
            const handleResize = () => {
                setIsMobile(window.innerWidth <= 768);
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, []);

        return isMobile;
    };

    // Doughnut chart for user distribution
    const UserDistributionChart = ({ data, totalUsers }) => {
        const COLORS = data.map(entry => entry.color);
        // Custom legend to match the screenshot
        const renderLegend = (props) => {
            const { payload } = props;
            return (
                <div className="text-sm text-zinc-700">
                    <p className="text-xl font-bold mb-4">{totalUsers}</p>
                    {payload.map((entry, index) => {
                        const { value, color } = entry.payload;
                        const item = data[index];
                        return (
                            <div key={`item-${index + value}`} className="flex items-center mb-3">
                                <div className="w-2.5 h-6 mr-3" style={{ backgroundColor: color }}></div>
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-zinc-500">{item.value.toLocaleString()}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }

        // Use the mobile detection hook
        const isMobile = useIsMobile();

        // Determine outer radius based on screen size
        const outerRadius = isMobile ? 75 : 150; // 50% smaller on mobile

        return (
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={outerRadius}
                        fill="#8884d8"
                        paddingAngle={0}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend content={renderLegend} layout="vertical" verticalAlign="middle" align="left" />
                </PieChart>
            </ResponsiveContainer>
        );
    };

    const RADIAN = Math.PI / 180;

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
        const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${((percent ?? 1) * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="max-w-8xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>
                <p className="text-zinc-500 mt-1">Here's a review of your activities</p>
            </header>

            <div className="space-y-8">
                {/* Top Stats and Chart Section */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
                            <div>
                                <p className="text-sm text-zinc-500">Bin Requests</p>
                                <p className="text-2xl font-bold text-zinc-900">{dashboardData.stats.binRequests}</p>
                            </div>
                            <div className="border-l-2 border-zinc-200 pl-8">
                                <p className="text-sm text-zinc-500">Completed requests</p>
                                <p className="text-2xl font-bold text-zinc-900">{dashboardData.stats.completedRequests}</p>
                            </div>
                            <div className="border-l-2 border-zinc-200 pl-8">
                                <p className="text-sm text-zinc-500">Pending requests</p>
                                <p className="text-2xl font-bold text-zinc-900">{dashboardData.stats.pendingRequests}</p>
                            </div>
                        </div>
                        <button className="mt-4 md:mt-0 flex items-center px-4 py-2 border border-zinc-300 rounded-lg text-zinc-700 bg-white hover:bg-zinc-50 transition">
                            This month <ChevronDownIcon />
                        </button>
                    </div>
                    <div className="mt-8">
                        <MonthlyRequestsChart data={dashboardData.monthlyRequests} />
                    </div>
                </div>

                {/* Bottom Cards Section */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left Card: User Distribution */}
                    <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-zinc-800 mb-4">Total registered Users</h2>
                        <UserDistributionChart data={dashboardData.userDistribution.types} totalUsers={dashboardData.userDistribution.total} />
                    </div>

                    {/* Right Card: PSP Companies */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-zinc-800">Registered PSP companies</h2>
                        <p className="text-4xl font-bold text-zinc-900 my-4">{dashboardData.pspCompanies.total}</p>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-zinc-800">Top PSP Companies</h3>
                            <button
                                onClick={() => navigate('/psp-companies')}
                                className="text-sm text-green-600 hover:underline"
                            >
                                View all
                            </button>
                        </div>
                        <div className="space-y-4">
                            {dashboardData.pspCompanies.top.map((company, index) => (
                                <div key={index} className="flex justify-between items-center text-sm">
                                    <p className="text-zinc-700">{company.name}</p>
                                    <p className="text-zinc-500">{company.staff} staff</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

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

// Transform API response to match expected dashboard data structure
const transformApiData = (apiData) => {
  // Calculate total users from the API response
  const totalUsers = apiData.registeredUsers.totalRegisteredUsers;
  const userTypes = [
    { name: 'Resident users', value: apiData.registeredUsers.residentUsers, color: userDistributionColors[0].color },
    { name: 'Agents', value: apiData.registeredUsers.agentsUsers, color: userDistributionColors[1].color },
    { name: 'Facility Managers', value: apiData.registeredUsers.facilityManagers, color: userDistributionColors[2].color },
    { name: 'Corporate users', value: apiData.registeredUsers.corporatesUsers, color: userDistributionColors[3].color },
  ];

  // Calculate stats from API response
  const stats = {
    binRequests: apiData.binRequests.totalBinRequests.toLocaleString(),
    completedRequests: apiData.binRequests.completedBinrequests.toLocaleString(),
    pendingRequests: apiData.binRequests.pendingBinrequests.toLocaleString(),
  };

  return {
    stats,
    monthlyRequests: defaultMonthlyRequests, // Using default since API doesn't provide this data
    userDistribution: {
      total: totalUsers.toLocaleString(),
      types: userTypes,
    },
    pspCompanies: {
      total: apiData.pspCompanies.registeredPSPs,
      top: apiData.pspCompanies.topPSPcompanies.length > 0 
        ? apiData.pspCompanies.topPSPcompanies // Use data from API if available
        : defaultTopPSPCompanies // Fallback to default if API returns empty array
    }
  };
};

// --- Main App Component ---
export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Real API call to fetch dashboard data
    useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true);
            const response = await fetchDashboardData();
            const transformedData = transformApiData(response);
            setDashboardData(transformedData);
          } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };

        fetchData();
    }, []);

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
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {loading || !dashboardData ? (
                        <DashboardSkeleton />
                    ) : (
                        <DashboardView dashboardData={dashboardData} />
                    )}
                </main>
            </div>
        </div>
    );
}
