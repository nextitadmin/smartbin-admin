import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/apiConfig';
import Sidebar from '../components/SuperAdmin/Sidebar';
import Topbar from '../components/SuperAdmin/Topbar';
import PaymentTable from '../components/SuperAdmin/PaymentTable';
// --- Chart Data Defaults ---
const initialChartData = [
    { name: 'Jan', revenue: 0, smartBinRevenue: 0, wasteDisposalRevenue: 0 },
    { name: 'Feb', revenue: 0, smartBinRevenue: 0, wasteDisposalRevenue: 0 },
    { name: 'Mar', revenue: 0, smartBinRevenue: 0, wasteDisposalRevenue: 0 },
    { name: 'Apr', revenue: 0, smartBinRevenue: 0, wasteDisposalRevenue: 0 },
    { name: 'May', revenue: 0, smartBinRevenue: 0, wasteDisposalRevenue: 0 },
    { name: 'Jun', revenue: 0, smartBinRevenue: 0, wasteDisposalRevenue: 0 },
    { name: 'Jul', revenue: 0, smartBinRevenue: 0, wasteDisposalRevenue: 0 },
    { name: 'Aug', revenue: 0, smartBinRevenue: 0, wasteDisposalRevenue: 0 },
    { name: 'Sep', revenue: 0, smartBinRevenue: 0, wasteDisposalRevenue: 0 },
    { name: 'Oct', revenue: 0, smartBinRevenue: 0, wasteDisposalRevenue: 0 },
    { name: 'Nov', revenue: 0, smartBinRevenue: 0, wasteDisposalRevenue: 0 },
    { name: 'Dec', revenue: 0, smartBinRevenue: 0, wasteDisposalRevenue: 0 },
];

const ChevronDownIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
);

const CustomTooltip = ({ active, payload, label, selectedYear }) => {
    if (active && payload && payload.length) {
        const item = payload[0].payload;
        return (
            <div className="bg-zinc-900 text-white p-3 rounded-lg shadow-xl border border-zinc-800 text-xs">
                <p className="text-zinc-400 font-medium mb-1">{`${label} ${selectedYear}`}</p>
                <p className="text-sm font-bold text-white mb-1">
                    Total: {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(payload[0].value)}
                </p>
                {(item?.smartBinRevenue > 0 || item?.wasteDisposalRevenue > 0) && (
                    <div className="pt-1.5 border-t border-zinc-800 space-y-0.5">
                        <div className="flex justify-between items-center gap-4 text-emerald-400">
                            <span>Smart Bin:</span>
                            <span className="font-semibold">
                                {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(item.smartBinRevenue)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center gap-4 text-orange-400">
                            <span>Waste Disposal:</span>
                            <span className="font-semibold">
                                {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(item.wasteDisposalRevenue)}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        );
    }
    return null;
};

const Header = () => (
    <header>
        <h1 className="text-2xl font-bold text-zinc-800">Revenue overview</h1>
        <p className="text-zinc-500 mt-1">Track your revenue here</p>
    </header>
);

const StatCards = ({ stats }) => (
    <div className="flex flex-col lg:flex-row gap-6 mt-6">
        <div className="flex-1 bg-green-600 rounded-xl p-6 text-white" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}>
            <p className="text-sm text-green-100">Total amount generated overtime</p>
            <p className="text-4xl font-bold mt-2">₦ {(stats?.totalAmountGenerated ?? 0).toLocaleString()}</p>
        </div>
        <div className="flex-1 bg-white rounded-xl border border-zinc-200 p-6 flex flex-col justify-center gap-4">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-zinc-500 text-sm">Smart Bin Suppliers</p>
                    <p className="text-zinc-800 font-bold text-lg">₦{(stats?.smartBin?.amount ?? 0).toLocaleString()}</p>
                </div>
                <p className="text-zinc-500 text-sm bg-zinc-50 border border-zinc-100 px-2.5 py-1 rounded-full">
                    {(stats?.smartBin?.transactions ?? 0).toLocaleString()} transactions
                </p>
            </div>
            <div className="border-t border-zinc-200"></div>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-zinc-500 text-sm">PSP Companies</p>
                    <p className="text-zinc-800 font-bold text-lg">₦{(stats?.wasteDisposal?.amount ?? 0).toLocaleString()}</p>
                </div>
                <p className="text-zinc-500 text-sm bg-zinc-50 border border-zinc-100 px-2.5 py-1 rounded-full">
                    {(stats?.wasteDisposal?.transactions ?? 0).toLocaleString()} transactions
                </p>
            </div>
        </div>
    </div>
);

const formatYAxis = (value) => {
    if (value === 0) return '0';
    if (value >= 1000000) {
        const inM = value / 1000000;
        return `${Number.isInteger(inM) ? inM : inM.toFixed(1)}M`;
    }
    if (value >= 1000) {
        const inK = value / 1000;
        return `${Number.isInteger(inK) ? inK : inK.toFixed(0)}k`;
    }
    return `${value}`;
};

const RevenueChart = ({ chartData, totalRevenue, growthPercentage, comparisonText, selectedYear, onYearChange }) => {
    const currentYear = new Date().getFullYear();
    const baseYears = Array.from({ length: 5 }, (_, i) => currentYear - i);
    const years = Array.from(new Set([selectedYear, ...baseYears])).filter(Boolean).sort((a, b) => b - a);

    return (
        <div className="mt-6 bg-white rounded-xl border border-zinc-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <p className="text-zinc-500 text-sm">Total revenue</p>
                    <div className="flex items-end gap-3 flex-wrap">
                        <p className="text-3xl font-bold text-zinc-800">
                            ₦ {(totalRevenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <span className={`text-sm font-semibold ${growthPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {growthPercentage >= 0 ? `+${growthPercentage}%` : `${growthPercentage}%`}
                        </span>
                        <span className="text-sm text-zinc-500">{comparisonText || "vs Last Year"}</span>
                    </div>
                </div>
                <div className="mt-4 sm:mt-0 relative inline-block">
                    <select
                        value={selectedYear}
                        onChange={(e) => onYearChange(Number(e.target.value))}
                        className="appearance-none pr-8 bg-white border border-zinc-300 rounded-md px-3 py-1.5 text-sm text-zinc-700 focus:outline-none focus:ring-1 focus:ring-green-500 cursor-pointer"
                    >
                        {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
                        <ChevronDownIcon className="w-4 h-4" />
                    </div>
                </div>
            </div>
            <div className="w-full h-72 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tickFormatter={formatYAxis} width={55} tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip selectedYear={selectedYear} />} cursor={{ stroke: '#fb923c', strokeWidth: 2, strokeDasharray: '3 3' }} />
                        <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} dot={{ r: 4, fill: '#f97316' }} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#f97316' }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const normalizePSPRevenueRow = (item, index) => ({
    id: item?._id ?? item?.pspId ?? item?.id ?? index + 1,
    psp_company: item?.psp_company ?? item?.pspCompany ?? item?.companyName ?? item?.name ?? "—",
    lcda: item?.lcda ?? item?.lga ?? item?.lgaName ?? "—",
    household_covered: Number(item?.household_covered ?? item?.householdCovered ?? item?.householdsCovered ?? 0),
    revenue: Number(item?.revenue ?? item?.totalRevenue ?? item?.amount ?? 0),
    outStandingBill: Number(item?.outStandingBill ?? item?.outstandingBill ?? item?.bills ?? 0)
});

export default function Revenue() {
    const [year, setYear] = useState(() => new Date().getFullYear());
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(10);
    const [loading, setLoading] = useState(true);
    
    const [stats, setStats] = useState({
        totalAmountGenerated: 0,
        smartBin: { amount: 0, transactions: 0 },
        wasteDisposal: { amount: 0, transactions: 0 },
        chartTotalRevenue: 0,
        growthPercentage: 0,
        comparisonText: "vs Last Year",
        totalPspRevenue: 0
    });
    const [chartData, setChartData] = useState(initialChartData);
    const [paymentDetails, setPaymentDetails] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const handleYearChange = useCallback((newYear) => {
        setYear(newYear);
        setCurrentPage(1);
    }, []);

    const handlePageChange = useCallback((newPage) => {
        setCurrentPage(newPage);
    }, []);

    useEffect(() => {
        let active = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await api.get('/lawma/superadmins/revenue-analysis', {
                    params: {
                        year,
                        page: currentPage,
                        limit
                    }
                });

                if (!active) return;

                const rawPayload = response?.data;
                const payload = rawPayload?.data ?? rawPayload ?? {};
                
                // Extract stats matching the specific payload shape
                const extractedStats = {
                    totalAmountGenerated: Number(payload.totalAmountGeneratedOvertime ?? 0),
                    smartBin: {
                        amount: Number(payload.smartBinSuppliers?.revenue ?? 0),
                        transactions: Number(payload.smartBinSuppliers?.totalTransactions ?? 0)
                    },
                    wasteDisposal: {
                        amount: Number(payload.pspCompanies?.revenue ?? 0),
                        transactions: Number(payload.pspCompanies?.totalTransactions ?? 0)
                    },
                    chartTotalRevenue: Number(payload.totalRevenue?.amount ?? 0),
                    growthPercentage: Number(payload.totalRevenue?.percentageChange ?? 0),
                    comparisonText: payload.totalRevenue?.comparisonText ?? "vs Last Year",
                    totalPspRevenue: Number(payload.pspRevenue?.totalRevenue ?? 0)
                };
                setStats(extractedStats);

                // Extract monthly chart breakdown (month, total)
                const breakdown = payload.totalRevenue?.monthlyBreakdown;
                if (Array.isArray(breakdown) && breakdown.length > 0) {
                    setChartData(breakdown.map(item => ({
                        name: item.month,
                        revenue: Number(item.total ?? 0),
                        smartBinRevenue: Number(item.smartBinRevenue ?? 0),
                        wasteDisposalRevenue: Number(item.wasteDisposalRevenue ?? 0)
                    })));
                } else {
                    setChartData(initialChartData);
                }

                // Extract PSP companies list & paging metadata
                const pspRevenueObj = payload.pspRevenue ?? {};
                const rawList = Array.isArray(pspRevenueObj.pspRevenue)
                    ? pspRevenueObj.pspRevenue
                    : Array.isArray(pspRevenueObj)
                    ? pspRevenueObj
                    : [];
                const paging = pspRevenueObj.paging ?? {};

                const mapped = rawList.map((item, index) => {
                    const offset = (currentPage - 1) * limit + index + 1;
                    const norm = normalizePSPRevenueRow(item, index);
                    return {
                        ...norm,
                        s_n: offset
                    };
                });

                setPaymentDetails(mapped);
                setTotalPages(Math.max(1, paging.totalPages ?? Math.ceil(rawList.length / limit) ?? 1));

            } catch (error) {
                console.error("Error fetching revenue analysis data:", error);
                if (!active) return;
                
                setStats({
                    totalAmountGenerated: 0,
                    smartBin: { amount: 0, transactions: 0 },
                    wasteDisposal: { amount: 0, transactions: 0 },
                    chartTotalRevenue: 0,
                    growthPercentage: 0,
                    comparisonText: "vs Last Year",
                    totalPspRevenue: 0
                });
                setChartData(initialChartData);
                setPaymentDetails([]);
                setTotalPages(1);
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            active = false;
        };
    }, [year, currentPage, limit]);

    return (
        <div className="flex min-h-screen bg-zinc-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="bg-zinc-100 min-h-screen w-full p-4 sm:p-6 lg:p-8">
                    <div className=" mx-auto">
                        <Header />
                        <StatCards stats={stats} />
                        <RevenueChart 
                            chartData={chartData} 
                            totalRevenue={stats.chartTotalRevenue} 
                            growthPercentage={stats.growthPercentage} 
                            comparisonText={stats.comparisonText}
                            selectedYear={year} 
                            onYearChange={handleYearChange} 
                        />
                        <PaymentTable 
                            initialPaymentDetails={paymentDetails} 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            loading={loading}
                            totalRevenue={stats.totalPspRevenue}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}
