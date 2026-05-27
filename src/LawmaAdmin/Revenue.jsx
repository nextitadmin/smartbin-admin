import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Sidebar from '../components/LawmaAdmin/Sidebar';
import Topbar from '../components/LawmaAdmin/Topbar';
import PaymentTable from '../components/LawmaAdmin/PaymentTable';
// import { useNavigate } from 'react-router-dom';

// --- MOCK DATA ---
// Mock data for the revenue chart. In a real app, you'd fetch this.
const chartData = [
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

// Mock data for the payments table.
const initialPaymentDetails = [
    { s_n: 1, paymentId: '#OD12589048', revenueSource: 'Waste Collection', amount: 20000, date: '2025-05-26', paymentMethod: 'Alat by Wema', status: 'Successful' },
    { s_n: 2, paymentId: '#OD12589049', revenueSource: 'Smart Bin purchase', amount: 20000, date: '2025-05-26', paymentMethod: 'In app wallet', status: 'Successful' },
    { s_n: 3, paymentId: '#OD12589050', revenueSource: 'Waste Collection', amount: 20000, date: '2025-05-26', paymentMethod: 'In app wallet', status: 'Failed' },
    { s_n: 4, paymentId: '#OD12589051', revenueSource: 'Waste Collection', amount: 20000, date: '2025-05-26', paymentMethod: 'Alat by Wema', status: 'Pending' },
    { s_n: 5, paymentId: '#OD12589052', revenueSource: 'Smart Bin purchase', amount: 20000, date: '2025-05-26', paymentMethod: 'Alat by Wema', status: 'Successful' },
    { s_n: 6, paymentId: '#OD12589053', revenueSource: 'Waste Disposal', amount: 15000, date: '2025-05-25', paymentMethod: 'Card', status: 'Successful' },
    { s_n: 7, paymentId: '#OD12589054', revenueSource: 'Smart Bin purchase', amount: 75000, date: '2025-05-24', paymentMethod: 'In app wallet', status: 'Pending' },
    { s_n: 8, paymentId: '#OD12589055', revenueSource: 'Waste Collection', amount: 22000, date: '2025-05-23', paymentMethod: 'Alat by Wema', status: 'Failed' },
];

// --- SVG ICONS (Heroicons) ---
const ChevronDownIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
);


// --- REUSABLE HELPER COMPONENTS ---

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-zinc-800 text-white p-3 rounded-md">
                <p className="text-sm font-bold">{`${new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(payload[0].value)}`}</p>
                <p className="text-xs">{`${label} 2025`}</p>
            </div>
        );
    }
    return null;
};


// --- UI COMPONENTS ---

const Header = () => (
    <header>
        <h1 className="text-2xl font-bold text-zinc-800">Revenue overview</h1>
        <p className="text-zinc-500 mt-1">Track your review here</p>
    </header>
);

const StatCards = () => (
    <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {/* Main Stat Card */}
        <div className="flex-1 bg-green-600 rounded-xl p-6 text-white" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}>
            <p className="text-sm">Total amount generated overtime</p>
            <p className="text-4xl font-bold mt-2">₦ 70,900,000</p>
        </div>
        {/* Sub Stat Cards */}
        <div className="flex-1 bg-white rounded-xl border border-zinc-200 p-6 flex flex-col justify-center gap-4">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-zinc-500 text-sm">Smart Bin Application</p>
                    <p className="text-zinc-800 font-bold text-lg">₦8,000,000</p>
                </div>
                <p className="text-zinc-500 text-sm">10,000 transactions</p>
            </div>
            <div className="border-t border-zinc-200"></div>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-zinc-500 text-sm">Waste Disposal</p>
                    <p className="text-zinc-800 font-bold text-lg">₦8,000,000</p>
                </div>
                <p className="text-zinc-500 text-sm">800 transactions</p>
            </div>
        </div>
    </div>
);

const RevenueChart = () => (
    <div className="mt-6 bg-white rounded-xl border border-zinc-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
                <p className="text-zinc-500 text-sm">Total revenue</p>
                <div className="flex items-end gap-3">
                    <p className="text-3xl font-bold text-zinc-800">₦ 400,000,000.00</p>
                    <span className="text-sm font-semibold text-green-600">+2.6%</span>
                    <span className="text-sm text-zinc-500">vs Last Year</span>
                </div>
            </div>
            <div className="mt-4 sm:mt-0">
                <button className="flex items-center gap-2 text-sm text-zinc-700 bg-white border border-zinc-300 rounded-md px-3 py-1.5">
                    This year
                    <ChevronDownIcon />
                </button>
            </div>
        </div>
        <div className="w-full h-72 mt-6">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(value) => `${value / 1000000}`} tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} label={{ value: 'Millions', angle: -90, position: 'insideLeft', fill: '#71717a', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#fb923c', strokeWidth: 2, strokeDasharray: '3 3' }} />
                    <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} dot={{ r: 4, fill: '#f97316' }} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2, fill: '#f97316' }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
);


// --- MAIN APP COMPONENT ---
export default function Revenue() {
    // const navigate = useNavigate();

    // const handleViewAllPayments = () => {
    //     navigate('/all-payments');
    // };

    return (
        <div className="flex min-h-screen bg-zinc-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="bg-zinc-100 min-h-screen w-full p-4 sm:p-6 lg:p-8">
                    <div className=" mx-auto">
                        <Header />
                        <StatCards />
                        <RevenueChart />
                        <PaymentTable initialPaymentDetails={initialPaymentDetails} />
                    </div>
                </main>
            </div>
        </div>
    );
}
