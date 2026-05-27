import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from '../components/PSPsTeamMembers/Sidebar';
import Topbar from '../components/PSPsTeamMembers/Topbar';
import { TrashIcon, GarbageIcon, WalletIcon } from '../components/icons';
import api from '../api/apiConfig';

// --- MOCK DATA & API --- //

const mockStats = {
    wastePickedUp: 200,
    pendingPickups: 24,
    amountGenerated: 1000000,
};

const mockChartData = [
    { name: 'Jan', disposals: 50 },
    { name: 'Feb', disposals: 40 },
    { name: 'Mar', disposals: 60 },
    { name: 'Apr', disposals: 100 },
    { name: 'May', disposals: 110 },
    { name: 'Jun', disposals: 150 },
    { name: 'Jul', disposals: 180 },
    { name: 'Aug', disposals: 160 },
    { name: 'Sep', disposals: 120 },
    { name: 'Oct', disposals: 80 },
    { name: 'Nov', disposals: 100 },
    { name: 'Dec', disposals: 130 },
];

const mockRecentPayments = [
    { id: 1, date: '21-01-25', paymentId: '#389839857784578', amount: 300000, status: 'Successful' },
    { id: 2, date: '22-01-25', paymentId: '#389839857784578', amount: 300000, status: 'Failed' },
    { id: 3, date: '24-01-25', paymentId: '#389839857784578', amount: 300000, status: 'Successful' },
    { id: 4, date: '28-01-25', paymentId: '#389839857784578', amount: 300000, status: 'Successful' },
];

const mockBills = [
    { id: 1, dueDate: '21-01-25', billId: '#389839857784578', amount: 300000, status: 'Pending' },
    { id: 2, dueDate: '22-01-25', billId: '#389839857784578', amount: 300000, status: 'Pending' },
    { id: 3, dueDate: '24-01-25', billId: '#389839857784578', amount: 300000, status: 'Pending' },
    { id: 4, dueDate: '28-01-25', billId: '#389839857784578', amount: 300000, status: 'Pending' },
];

const mockPendingRequests = [
    { id: 1, wasteId: '#OD12589048', customerName: 'Adebolade Aina', phone: '081893083459', address: '12, Awolowo Road, Ikoyi, Lagos', status: 'Pending' },
    { id: 2, wasteId: '#OD12589048', customerName: 'Falomo Jide', phone: '081893083459', address: '45, Ogunlana Drive, Surulere, Lagos', status: 'Pending' },
    { id: 3, wasteId: '#OD12589048', customerName: 'Babatunde Shina', phone: '081893083459', address: '4, Bode Thomas Street, Surulere, Lagos', status: 'Pending' },
    { id: 4, wasteId: '#OD12589048', customerName: 'Fatimo Adetola', phone: '081893083459', address: '8, Akin Adesola Street, Victoria Island, Lagos', status: 'Pending' },
    { id: 5, wasteId: '#OD12589049', customerName: 'Chioma Okoro', phone: '08012345678', address: '10, Allen Avenue, Ikeja, Lagos', status: 'Pending' },
];


// --- SVG ICONS (Heroicons) --- //

const SortIcon = ({ direction }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2">
        {direction === 'ascending' && <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />}
        {direction === 'descending' && <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />}
    </svg>
);

// --- HELPER HOOK for Sorting --- //

const useSortableData = (items, config = null) => {
    const [sortConfig, setSortConfig] = useState(config);

    const sortedItems = useMemo(() => {
        let sortableItems = [...items];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === 'ascending'
        ) {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return { items: sortedItems, requestSort, sortConfig };
};


// --- UI COMPONENTS --- //

const Header = () => (
    <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-800">Dashboard</h1>
        <p className="text-zinc-500 mt-1">Here's a review of your activities</p>
    </div>
);

const StatCard = ({ icon, title, value, isLoading }) => (
    <div className="flex-1 p-6 bg-white border border-zinc-200 rounded-lg min-w-[200px]">
        {isLoading ? (
            <div className="animate-pulse">
                <div className="h-12 w-12 bg-zinc-200 rounded-full mb-4"></div>
                <div className="h-4 bg-zinc-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-zinc-200 rounded w-1/2"></div>
            </div>
        ) : (
            <>
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-700 mb-4">
                    {icon}
                </div>
                <p className="text-zinc-500 text-sm mb-1">{title}</p>
                <p className="text-2xl font-bold text-zinc-800">{value}</p>
            </>
        )}
    </div>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-zinc-800 text-white p-3 rounded-md shadow-lg text-sm">
                <p className="font-bold">{`${payload[0].value} disposals`}</p>
                <p className="text-zinc-300">{`${label} 2025`}</p>
            </div>
        );
    }
    return null;
};

const WasteDisposalChart = ({ data, isLoading }) => (
    <div className="p-6 bg-white border border-zinc-200 rounded-lg">
        <h2 className="text-lg font-semibold text-zinc-800 mb-6">Wastes disposed between 21st Jan & 30th August</h2>
        {isLoading ? (
            <div className="animate-pulse w-full h-[300px] bg-zinc-200 rounded-md"></div>
        ) : (
            <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                        <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={{ stroke: '#a1a1aa' }} tickLine={{ stroke: '#a1a1aa' }} />
                        <YAxis tick={{ fill: '#71717a', fontSize: 12 }} axisLine={{ stroke: '#a1a1aa' }} tickLine={{ stroke: '#a1a1aa' }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3f3f46', strokeWidth: 1, strokeDasharray: '3 3' }} />
                        <Line type="monotone" dataKey="disposals" stroke="#f97316" strokeWidth={2} dot={{ r: 4, fill: '#f97316' }} activeDot={{ r: 8, stroke: '#f97316', fill: 'white', strokeWidth: 2 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        )}
    </div>
);

const StatusBadge = ({ status }) => {
    const baseClasses = "text-xs font-medium px-2.5 py-1 rounded-2xl";
    const statusClasses = {
        Successful: "bg-green-100 text-green-800",
        Failed: "bg-red-100 text-red-800",
        Pending: "bg-red-100 text-red-800",
    };
    return <span className={`${baseClasses} ${statusClasses[status] || 'bg-zinc-100 text-zinc-800'}`}>{status}</span>;
}

const TableStatusBadge = ({ status }) => {
    const baseClasses = "text-xs font-medium me-2 px-2.5 py-0.5 rounded-2xl";
    const statusClasses = {
        Pending: "bg-zinc-200 text-zinc-600",
    };
    return <span className={`${baseClasses} ${statusClasses[status] || 'bg-zinc-100 text-zinc-800'}`}>{status}</span>;
}

const RecentPayments = ({ payments, isLoading }) => (
    <div className="p-6 bg-white border border-zinc-200 rounded-lg">
        <h2 className="text-lg font-semibold text-zinc-800 mb-4">Recent Payments</h2>
        <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left text-zinc-500">
                        <th className="font-normal pb-3 pr-2">Date</th>
                        <th className="font-normal pb-3 pr-2">Payment ID</th>
                        <th className="font-normal pb-3 pr-2">Amount</th>
                        <th className="font-normal pb-3 pr-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? Array.from({ length: 4 }).map((_, i) => (
                        <tr key={i}><td colSpan="4" className="py-2"><div className="animate-pulse h-5 bg-zinc-200 rounded w-full"></div></td></tr>
                    )) : payments.map(payment => (
                        <tr key={payment.id} className="text-zinc-800">
                            <td className="py-2 pr-2">{payment.date}</td>
                            <td className="py-2 pr-2 text-zinc-500">{payment.paymentId}</td>
                            <td className="py-2 pr-2 font-semibold">{new Intl.NumberFormat('en-NG').format(payment.amount)}</td>
                            <td className="py-2 pr-2"><StatusBadge status={payment.status} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const Bills = ({ bills, isLoading }) => (
    <div className="p-6 bg-white border border-zinc-200 rounded-lg">
        <h2 className="text-lg font-semibold text-zinc-800 mb-4">Bills</h2>
        <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left text-zinc-500">
                        <th className="font-normal pb-3 pr-2">Date Due</th>
                        <th className="font-normal pb-3 pr-2">Bill ID</th>
                        <th className="font-normal pb-3 pr-2">Amount</th>
                        <th className="font-normal pb-3 pr-2">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? Array.from({ length: 4 }).map((_, i) => (
                        <tr key={i}><td colSpan="4" className="py-2"><div className="animate-pulse h-5 bg-zinc-200 rounded w-full"></div></td></tr>
                    )) : bills.map(bill => (
                        <tr key={bill.id} className="text-zinc-800">
                            <td className="py-2 pr-2">{bill.dueDate}</td>
                            <td className="py-2 pr-2 text-zinc-500">{bill.billId}</td>
                            <td className="py-2 pr-2 font-semibold">{new Intl.NumberFormat('en-NG').format(bill.amount)}</td>
                            <td className="py-2 pr-2"><StatusBadge status={bill.status} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const PendingRequestsTable = ({ requests, isLoading }) => {
    const { items, requestSort, sortConfig } = useSortableData(requests);

    const getSortDirectionFor = (name) => {
        if (!sortConfig) { return; }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };

    const headers = [
        { key: "id", label: "S/N" }, { key: "wasteId", label: "Waste ID" },
        { key: "customerName", label: "Customer name" }, { key: "phone", label: "Phone number" },
        { key: "address", label: "Address" }, { key: "status", label: "Status" },
    ];

    return (
        <div className="p-6 bg-white border border-zinc-200 rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                <h2 className="text-lg font-semibold text-zinc-800">Pending requests</h2>
                <a href="#" className="text-sm text-green-600 font-semibold underline">See all</a>
            </div>
            <div className="w-full overflow-x-auto">
                <table className="w-full text-sm text-left text-zinc-500">
                    <thead className="text-xs text-zinc-700 uppercase bg-zinc-50">
                        <tr>
                            {headers.map(header => (
                                <th key={header.key} scope="col" className="px-6 py-3">
                                    <button onClick={() => requestSort(header.key)} className="flex items-center">
                                        {header.label}
                                        {getSortDirectionFor(header.key) && <SortIcon direction={getSortDirectionFor(header.key)} />}
                                    </button>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="bg-white border-b border-zinc-200">
                                    <td className="px-6 py-4"><div className="h-4 bg-zinc-200 rounded w-full"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-zinc-200 rounded w-full"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-zinc-200 rounded w-full"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-zinc-200 rounded w-full"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-zinc-200 rounded w-full"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-zinc-200 rounded w-full"></div></td>
                                </tr>
                            ))
                        ) : (
                            items.map(item => (
                                <tr key={item.id} className="bg-white border-b border-zinc-200 last:border-b-0">
                                    <td className="px-6 py-4 font-medium text-zinc-900 whitespace-nowrap">{item.id}</td>
                                    <td className="px-6 py-4">{item.wasteId}</td>
                                    <td className="px-6 py-4">{item.customerName}</td>
                                    <td className="px-6 py-4">{item.phone}</td>
                                    <td className="px-6 py-4">{item.address}</td>
                                    <td className="px-6 py-4"><TableStatusBadge status={item.status} /></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {!isLoading && items.length === 0 && (
                    <div className="text-center py-10 text-zinc-500"> No pending requests found. </div>
                )}
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT --- //

export default function App() {
    const [stats, setStats] = useState({});
    const [chartData, setChartData] = useState([]);
    const [payments, setPayments] = useState([]);
    const [bills, setBills] = useState([]);
    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState({
        stats: true, chart: true, payments: true, bills: true, requests: true
    });

    useEffect(() => {
        let cancelled = false;

        const loadData = async () => {
            try {
                const response = await api.get('/psps'); 
                const payload = response?.data?.data ?? response?.data ?? {};

                // Support a few possible shapes from backend while keeping UI stable.
                const nextStats = payload.stats ?? payload;
                const nextChartData = payload.chartData ?? payload.chart_data ?? payload.disposals ?? [];
                const nextPayments = payload.payments ?? payload.recentPayments ?? payload.recent_payments ?? [];
                const nextBills = payload.bills ?? payload.recentBills ?? payload.recent_bills ?? [];
                const nextRequests = payload.requests ?? payload.pendingRequests ?? payload.pending_requests ?? [];

                if (!cancelled) {
                    setStats({
                        wastePickedUp: nextStats?.wastePickedUp ?? nextStats?.waste_picked_up ?? 0,
                        pendingPickups: nextStats?.pendingPickups ?? nextStats?.pending_pickups ?? 0,
                        amountGenerated: nextStats?.amountGenerated ?? nextStats?.amount_generated ?? 0,
                    });
                    setChartData(Array.isArray(nextChartData) ? nextChartData : []);
                    setPayments(Array.isArray(nextPayments) ? nextPayments : []);
                    setBills(Array.isArray(nextBills) ? nextBills : []);
                    setRequests(Array.isArray(nextRequests) ? nextRequests : []);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
                if (!cancelled) {
                    // Fallback to mock data so the dashboard remains usable if API shape differs.
                    setStats(mockStats);
                    setChartData(mockChartData);
                    setPayments(mockRecentPayments);
                    setBills(mockBills);
                    setRequests(mockPendingRequests);
                }
            } finally {
                if (!cancelled) {
                    setLoading({ stats: false, chart: false, payments: false, bills: false, requests: false });
                }
            }
        };
        loadData();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="flex sans h-screen">
            <Sidebar addkey="1" />
            <div className="flex-1 bg-zinc-100 min-h-screen overflow-y-auto">
                <Topbar />
                <div className="bg-zinc-100 font-sans">
                    <main className="p-4 md:px-4">
                        <div className="p-4 md:p-8 font-sans">
                            <Header />

                            <div className="flex flex-col sm:flex-row flex-wrap gap-6 mb-8">
                                <StatCard
                                    icon={<TrashIcon />}
                                    title="Waste Picked Up"
                                    value={stats.wastePickedUp?.toString() || '0'}
                                    isLoading={loading.stats}
                                />
                                <StatCard
                                    icon={<GarbageIcon />}
                                    title="Pending waste pickups"
                                    value={stats.pendingPickups?.toString() || '0'}
                                    isLoading={loading.stats}
                                />
                                <StatCard
                                    icon={<WalletIcon />}
                                    title="Amount generated"
                                    value={`₦${new Intl.NumberFormat('en-NG').format(stats.amountGenerated || 0)}`}
                                    isLoading={loading.stats}
                                />
                            </div>

                            <div className="flex flex-col gap-8">
                                <WasteDisposalChart data={chartData} isLoading={loading.chart} />
                                <div className="flex flex-col lg:flex-row gap-8">
                                    <div className="w-full lg:w-1/2">
                                        <RecentPayments payments={payments} isLoading={loading.payments} />
                                    </div>
                                    <div className="w-full lg:w-1/2">
                                        <Bills bills={bills} isLoading={loading.bills} />
                                    </div>
                                </div>
                                <PendingRequestsTable requests={requests} isLoading={loading.requests} />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

