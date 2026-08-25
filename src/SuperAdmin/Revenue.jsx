import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/apiConfig';
import Sidebar from '../components/SuperAdmin/Sidebar';
import Topbar from '../components/SuperAdmin/Topbar';
import PaymentTable from '../components/SuperAdmin/PaymentTable';
import pspRevenueData from '../mock/pspRevenueData';

// --- MOCK DATA FALLBACKS ---
const initialChartData = [
    { name: 'Jan', revenue: 12000000 },
    { name: 'Feb', revenue: 18000000 },
    { name: 'Mar', revenue: 15000000 },
    { name: 'Apr', revenue: 28000000 },
    { name: 'May', revenue: 35000000 },
    { name: 'Jun', revenue: 32000000 },
    { name: 'Jul', revenue: 41000000 },
    { name: 'Aug', revenue: 48000000 },
    { name: 'Sep', revenue: 40000000 },
    { name: 'Oct', revenue: 25000000 },
    { name: 'Nov', revenue: 28000000 },
    { name: 'Dec', revenue: 38000000 },
];

const ChevronDownIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
);

const CustomTooltip = ({ active, payload, label, selectedYear }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-zinc-800 text-white p-3 rounded-md">
                <p className="text-sm font-bold">{`${new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(payload[0].value)}`}</p>
                <p className="text-xs">{`${label} ${selectedYear}`}</p>
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
            <p className="text-sm">Total amount generated overtime</p>
            <p className="text-4xl font-bold mt-2">₦ {(stats?.totalAmountGenerated ?? 803053000).toLocaleString()}</p>
        </div>
        <div className="flex-1 bg-white rounded-xl border border-zinc-200 p-6 flex flex-col justify-center gap-4">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-zinc-500 text-sm">Smart Bin Application</p>
                    <p className="text-zinc-800 font-bold text-lg">₦{(stats?.smartBin?.amount ?? 100000).toLocaleString()}</p>
                </div>
                <p className="text-zinc-500 text-sm">{(stats?.smartBin?.transactions ?? 1).toLocaleString()} transactions</p>
            </div>
            <div className="border-t border-zinc-200"></div>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-zinc-500 text-sm">Waste Disposal</p>
                    <p className="text-zinc-800 font-bold text-lg">₦{(stats?.wasteDisposal?.amount ?? 400000).toLocaleString()}</p>
                </div>
                <p className="text-zinc-500 text-sm">{(stats?.wasteDisposal?.transactions ?? 4).toLocaleString()} transactions</p>
            </div>
        </div>
    </div>
);

const RevenueChart = ({ chartData, totalRevenue, growthPercentage, comparisonText, selectedYear, onYearChange }) => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
        <div className="mt-6 bg-white rounded-xl border border-zinc-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <p className="text-zinc-500 text-sm">Total revenue</p>
                    <div className="flex items-end gap-3">
                        <p className="text-3xl font-bold text-zinc-800">
                            ₦ {(totalRevenue ?? 803053000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tickFormatter={(value) => `${value / 1000000}`} tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} label={{ value: 'Millions', angle: -90, position: 'insideLeft', fill: '#71717a', fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip selectedYear={selectedYear} />} cursor={{ stroke: '#fb923c', strokeWidth: 2, strokeDasharray: '3 3' }} />
                        <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} dot={{ r: 4, fill: '#f97316' }} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#f97316' }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const normalizePSPRevenueRow = (item, index) => ({
    id: item?.pspId ?? item?.id ?? index + 1,
    psp_company: item?.psp_company ?? item?.pspCompany ?? item?.companyName ?? "—",
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
        totalAmountGenerated: 803053000,
        smartBin: { amount: 100000, transactions: 1 },
        wasteDisposal: { amount: 400000, transactions: 4 },
        chartTotalRevenue: 803053000,
        growthPercentage: 0,
        comparisonText: "vs Last Year"
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

                const payload = response?.data ?? {};
                
                // Extract stats matching the specific payload shape
                const extractedStats = {
                    totalAmountGenerated: payload.totalAmountGeneratedOvertime ?? 803053000,
                    smartBin: {
                        amount: payload.smartBinSuppliers?.revenue ?? 100000,
                        transactions: payload.smartBinSuppliers?.totalTransactions ?? 1
                    },
                    wasteDisposal: {
                        amount: payload.pspCompanies?.revenue ?? 400000,
                        transactions: payload.pspCompanies?.totalTransactions ?? 4
                    },
                    chartTotalRevenue: payload.totalRevenue?.amount ?? 803053000,
                    growthPercentage: payload.totalRevenue?.percentageChange ?? 0,
                    comparisonText: payload.totalRevenue?.comparisonText ?? "vs Last Year"
                };
                setStats(extractedStats);

                // Extract monthly chart breakdown (month, total)
                const breakdown = payload.totalRevenue?.monthlyBreakdown;
                if (Array.isArray(breakdown) && breakdown.length > 0) {
                    setChartData(breakdown.map(item => ({
                        name: item.month,
                        revenue: Number(item.total ?? 0)
                    })));
                } else {
                    setChartData(initialChartData);
                }

                // Extract PSP companies list & paging metadata
                const pspRevenueObj = payload.pspRevenue ?? {};
                const rawList = pspRevenueObj.pspRevenue ?? [];
                const paging = pspRevenueObj.paging ?? {};

                const mapped = rawList.map((item, index) => {
                    const offset = (currentPage - 1) * limit + index + 1;
                    const norm = normalizePSPRevenueRow(item, index);
                    return {
                        ...norm,
                        s_n: offset
                    };
                });

                if (mapped.length > 0) {
                    setPaymentDetails(mapped);
                    setTotalPages(paging.totalPages ?? Math.max(1, Math.ceil((paging.totalRecords ?? rawList.length) / limit)));
                } else {
                    // Fallback to mock data sliced for the current page
                    const start = (currentPage - 1) * limit;
                    const end = start + limit;
                    const mockedMapped = pspRevenueData.slice(start, end).map((item, index) => ({
                        ...normalizePSPRevenueRow(item, index),
                        s_n: start + index + 1
                    }));
                    setPaymentDetails(mockedMapped);
                    setTotalPages(Math.max(1, Math.ceil(pspRevenueData.length / limit)));
                }

            } catch (error) {
                console.error("Error fetching revenue analysis data:", error);
                if (!active) return;
                
                // Fallback state on error
                setStats({
                    totalAmountGenerated: 803053000,
                    smartBin: { amount: 100000, transactions: 1 },
                    wasteDisposal: { amount: 400000, transactions: 4 },
                    chartTotalRevenue: 803053000,
                    growthPercentage: 0,
                    comparisonText: "vs Last Year"
                });
                setChartData(initialChartData);
                
                const start = (currentPage - 1) * limit;
                const end = start + limit;
                const mockedMapped = pspRevenueData.slice(start, end).map((item, index) => ({
                    ...normalizePSPRevenueRow(item, index),
                    s_n: start + index + 1
                }));
                setPaymentDetails(mockedMapped);
                setTotalPages(Math.max(1, Math.ceil(pspRevenueData.length / limit)));
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
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}
