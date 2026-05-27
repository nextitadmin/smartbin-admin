import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import api from '../api/apiConfig';
import Sidebar from '../components/SuperAdmin/Sidebar';
import Topbar from '../components/SuperAdmin/Topbar';
import SmartbinOverviewSkeletonLoader from '../components/SuperAdmin/SmartbinOverviewSkeletonLoader';

// --- Helper Components ---
import { RequestIcon, DeliveredIcon } from '../components/icons';

// Custom Tooltip for the Bar Chart
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        // Special tooltip text for "Kosofe"
        const specialText = label === 'KSF' ? 'Kosofe' : '';
        return (
            <div className="bg-zinc-800 text-white p-3 rounded-lg shadow-lg">
                <p className="font-semibold">{`${payload[0].value.toLocaleString()} users`}</p>
                {specialText && <p className="text-sm">{specialText}</p>}
            </div>
        );
    }
    return null;
};


// --- Main Component ---
export default function SmartbinOverview() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        smartBinRequests: 0,
        smartBinsDelivered: 0,
        userDistribution: [],
        recentlyDelivered: [],
    });
    const [loading, setLoading] = useState(true);
    const currentYear = new Date().getFullYear();
    const [binType, setBinType] = useState("smart"); // backend expects: "smart" | "non_smart"
    const [year, setYear] = useState(currentYear); // backend expects number

    const userDistribution = Array.isArray(stats?.userDistribution) ? stats.userDistribution : [];
    const maxUsersInChart = userDistribution.length
        ? Math.max(...userDistribution.map((d) => Number(d?.users ?? 0)))
        : 0;
    // Keep the Y-axis tight to data so small values don't render as a flat line.
    const yAxisMax = Math.max(5, Math.ceil(maxUsersInChart * 1.2));

    // --- API LOGIC ---
    useEffect(() => {
        const fetchSmartbinData = async () => {
            try {
                const response = await api.get('/lawma/smartbins/superadmin/overview', {
                    params: { binType, year: Number(year) },
                });
                
                // Transform API response to match component expectations
                // Group records by LGA for user distribution
                const lgaCounts = {};
                if (response.data.records && Array.isArray(response.data.records)) {
                    response.data.records.forEach(record => {
                        const lga = (record.lga || 'Unknown').substring(0, 3).toUpperCase();
                        lgaCounts[lga] = (lgaCounts[lga] || 0) + 1;
                    });
                }
                
                // Convert to array format for the chart
                const userDistribution = Object.entries(lgaCounts).map(([lga, count]) => ({
                    name: lga,
                    users: count
                }));
                
                // Use actual data from API with fallbacks
                const transformedData = {
                    totalUsers: response.data.totalApplications || 0,
                    smartBinRequests: response.data.totalApplications || 0,
                    smartBinsDelivered: response.data.deliveredApplications || 0,
                    userDistribution: userDistribution,
                    recentlyDelivered: response.data.records && Array.isArray(response.data.records) 
                        ? response.data.records.map((record, index) => ({
                            sn: index + 1,
                            date: record.date ? new Date(record.date).toLocaleDateString('en-GB') : 'N/A',
                            binType: record.binType || 'N/A',
                            binId: record.id || 'N/A',
                            address: record.address || 'N/A'
                        }))
                        : []
                };
                
                setStats(transformedData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching smartbin data:', error);
                // Fallback to mock data in case of error
                const mockData = {
                    totalUsers: 5000000,
                    smartBinRequests: 3000,
                    smartBinsDelivered: 400,
                    userDistribution: [
                        { name: 'AGL', users: 10000 },
                        { name: 'KTU', users: 25000 },
                        { name: 'FST', users: 28000 },
                        { name: 'APP', users: 19000 },
                        { name: 'BDG', users: 32000 },
                        { name: 'EPE', users: 15000 },
                        { name: 'EKY', users: 58000 },
                        { name: 'AKD', users: 62000 },
                        { name: 'FKJ', users: 78000 },
                        { name: 'KJA', users: 32000 },
                        { name: 'KRD', users: 14000 },
                        { name: 'KSF', users: 70000 }, // This is the highlighted bar
                        { name: 'AAA', users: 45000 },
                        { name: 'LND', users: 47000 },
                        { name: 'MUS', users: 30000 },
                        { name: 'LSD', users: 52000 },
                        { name: 'SMK', users: 22000 },
                        { name: 'LSR', users: 42000 },
                        { name: 'GGE', users: 53000 },
                    ],
                    recentlyDelivered: [
                        { sn: 1, date: '21-01-25', binType: 'Smart', binId: '#OD12589048', address: '23, Association Dr, Dolphin estate...' },
                        { sn: 2, date: '22-01-25', binType: 'Non smart', binId: '#OD12589048', address: '23, Association Dr, Dolphin estate...' },
                        { sn: 3, date: '24-01-25', binType: 'Smart', binId: '#OD12589048', address: '23, Association Dr, Dolphin estate...' },
                    ]
                };
                setStats(mockData);
                setLoading(false);
            }
        };

        fetchSmartbinData();
    }, [binType, year]);

    if (loading) {
        return <SmartbinOverviewSkeletonLoader />;
    }

    // --- RENDER LOGIC ---
    return (
        <div className="flex min-h-screen bg-zinc-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-8xl mx-auto">
                        {/* Header */}
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold text-zinc-800">Smart Bin Overview</h1>
                            <p className="text-zinc-500 mt-1">Here's a review of smart bins</p>
                        </header>

                        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Chart Section */}
                            <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                                    <div>
                                        <h3 className="text-zinc-500">Total SmartBin Users</h3>
                                        <p className="text-4xl font-bold text-zinc-800">{stats.totalUsers?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</p>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                                        <select
                                            value={binType}
                                            onChange={(e) => setBinType(e.target.value)}
                                            className="bg-zinc-100 border-none rounded-md px-3 py-2 text-sm font-medium text-zinc-700 focus:ring-2 focus:ring-green-500"
                                        >
                                            <option value="smart">Smart Bin</option>
                                            <option value="non_smart">Non-Smart Bin</option>
                                        </select>
                                        <select
                                            value={year}
                                            onChange={(e) => setYear(Number(e.target.value))}
                                            className="bg-zinc-100 border-none rounded-md px-3 py-2 text-sm font-medium text-zinc-700 focus:ring-2 focus:ring-green-500"
                                        >
                                            <option value={currentYear}>This year</option>
                                            <option value={currentYear - 1}>Last year</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Chart */}
                                <div className="w-full h-80">
                                    {userDistribution.length === 0 ? (
                                        <div className="h-full w-full flex items-center justify-center text-sm text-zinc-500">
                                            No chart data for the selected filters
                                        </div>
                                    ) : (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={userDistribution} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                                <YAxis
                                                    tickFormatter={(tick) => (tick >= 1000 ? `${Math.round(tick / 100) / 10}k` : tick)}
                                                    tick={{ fontSize: 12 }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    domain={[0, yAxisMax]}
                                                    allowDecimals={false}
                                                />
                                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(230, 240, 230, 0.5)' }} />
                                                <Bar dataKey="users" radius={[4, 4, 0, 0]}>
                                                    {userDistribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.name === 'KSF' ? '#166534' : '#22c55e'} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                                <p className="text-center text-sm text-zinc-500 mt-2">User Distribution % by LGA</p>
                            </div>

                            {/* Info Cards and Recent Deliveries */}
                            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Left Info Cards */}
                                {/* <div className="md:col-span-1 space-y-6">
                                    <div className="bg-white  p-6 rounded-xl shadow-sm flex flex-col items-start space-y-4">
                                        <div className="bg-green-800  p-3 rounded-full">
                                            <RequestIcon  />
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="text-zinc-500">Smart Bin request</h4>
                                            <p className="text-3xl font-bold text-zinc-800">{stats.smartBinRequests?.toLocaleString() || '0'}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-start space-y-4">
                                        <div className="p-3 rounded-full">
                                            <DeliveredIcon />
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="text-zinc-500">Smart Bin Delivered</h4>
                                            <p className="text-3xl font-bold text-zinc-800">{stats.smartBinsDelivered?.toLocaleString() || '0'}</p>
                                        </div>
                                    </div>
                                </div> */}

                                {/* Right Table */}
                                <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold text-zinc-800">Recently Delivered Bins</h3>
                                        <Link to="/delivered-smart-bins" className="text-sm font-medium text-green-600 hover:text-green-700">View all</Link>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead className="text-zinc-500">
                                                <tr>
                                                    <th className="font-semibold py-2 pr-2">S/N</th>
                                                    <th className="font-semibold py-2 px-2">Date</th>
                                                    <th className="font-semibold py-2 px-2">Bin type</th>
                                                    <th className="font-semibold py-2 px-2">Bin ID</th>
                                                    <th className="font-semibold py-2 pl-2">Address</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-zinc-700">
                                                {stats.recentlyDelivered && stats.recentlyDelivered.length > 0 ? (
                                                    stats.recentlyDelivered.map((item) => (
                                                        <tr key={item.sn} className="border-t border-zinc-100">
                                                            <td className="py-3 pr-2">{item.sn}</td>
                                                            <td className="py-3 px-2 whitespace-nowrap">{item.date}</td>
                                                            <td className="py-3 px-2">
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.binType === 'smart'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                                    }`}>
                                                                    {item.binType}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-2">{item.binId}</td>
                                                            <td className="py-3 pl-2">{item.address}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="py-3 text-center text-zinc-500">
                                                            No recently delivered bins found
                                                        </td>
                                                    </tr>
                                                )}
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
}
