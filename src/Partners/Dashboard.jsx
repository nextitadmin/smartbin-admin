import React, { useState, useEffect, useMemo } from 'react';

import Sidebar from "../components/Partners/Sidebar";
import Topbar from "../components/Partners/Topbar";
import { WalletIcon } from '../components/icons';
import { ShoppingCartIcon } from '../components/icons';
import { ShopIcon } from '../components/icons';


// --- MOCK API ---
// This simulates fetching data from an API.
const mockApi = {
    getDashboardStats: () => new Promise(resolve => {
        setTimeout(() => {
            resolve({
                totalOrders: 200,
                totalDelivered: 24,
                amountGenerated: 1000000,
            });
        }, 500);
    }),
    getPendingOrders: () => new Promise(resolve => {
        setTimeout(() => {
            resolve([
                { id: 1, orderId: '#0900A', name: 'Olabankole Kolawole', phone: '08129058371', lga: 'Ibeju Lekki', date: 'Today 9:21AM', status: 'Pending' },
                { id: 2, orderId: '#0900B', name: 'Olabankole Kolawole', phone: '08129058371', lga: 'Ikorodu', date: '09/08/2023 2:33PM', status: 'Pending' },
                { id: 3, orderId: '#0900C', name: 'Olabankole Kolawole', phone: '08129058371', lga: 'Ikorodu', date: '09/08/2023 2:33PM', status: 'Pending' },
                { id: 4, orderId: '#0900D', name: 'Olabankole Kolawole', phone: '08129058371', lga: 'Surulere', date: '09/08/2023 2:33PM', status: 'Pending' },
                { id: 5, orderId: '#0900E', name: 'Olabankole Kolawole', phone: '08129058371', lga: 'Ajegunle', date: '09/08/2023 2:33PM', status: 'Pending' },
                { id: 6, orderId: '#0900F', name: 'Another Person', phone: '08012345678', lga: 'Ikeja', date: '10/08/2023 11:00AM', status: 'Pending' },
            ]);
        }, 800);
    }),
};

// --- SVG ICONS ---
// Using raw SVG for icons as requested.

const BoxIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
);

// const ShoppingCartIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.823-6.441C21.056 10.343 20.61 10 20.06 10H5.88a1.125 1.125 0 01-1.087-.835L3.383 6.165A1.125 1.125 0 002.296 5.335H1.5" />
//     </svg>
// );

const CurrencyNairaIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-6h6m-9-3h12a3 3 0 013 3v0a3 3 0 01-3 3h-2.25M9 18h-2.25a3 3 0 01-3-3v0a3 3 0 013-3H9" />
    </svg>
);

const SortIcon = ({ direction }) => {
    if (direction === 'asc') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
        );
    }
    if (direction === 'desc') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
        );
    }
    return null;
};

// --- COMPONENTS ---

// StatCard Component for the top section
const StatCard = ({ icon, title, value, isLoading }) => (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-zinc-200 flex-1 min-w-[200px]">
        <div className="flex items-center">
            <div className="bg-green-700 p-2 rounded-full">
                {icon}
            </div>
        </div>
        <p className="text-sm text-zinc-600 mt-4">{title}</p>
        {isLoading ? (
            <div className="h-8 w-3/4 bg-zinc-200 animate-pulse rounded mt-1"></div>
        ) : (
            <p className="text-2xl sm:text-3xl font-bold text-zinc-800 mt-1">{value}</p>
        )}
    </div>
);

// Custom hook for sorting table data
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
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return { items: sortedItems, requestSort, sortConfig };
};


// PendingOrdersTable Component
const PendingOrdersTable = ({ orders, isLoading }) => {
    const { items, requestSort, sortConfig } = useSortableData(orders);

    const getSortDirection = (name) => {
        if (!sortConfig) return;
        return sortConfig.key === name ? (sortConfig.direction === 'ascending' ? 'asc' : 'desc') : undefined;
    };

    const headers = [
        { key: 'id', label: 'S/N' },
        { key: 'orderId', label: 'Order ID' },
        { key: 'name', label: 'Name' },
        { key: 'phone', label: 'Phone number' },
        { key: 'lga', label: 'LGA' },
        { key: 'date', label: 'Order date' },
        { key: 'status', label: 'Status' }
    ];

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-zinc-200 mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-zinc-800">Pending order list</h2>
                <a href="#" className="text-sm font-medium text-green-600 hover:text-green-700 underline">See all</a>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-zinc-500">
                    <thead className="text-xs text-zinc-700 uppercase bg-zinc-50">
                        <tr>
                            {headers.map((header) => (
                                <th key={header.key} scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort(header.key)}>
                                    {header.label}
                                    <SortIcon direction={getSortDirection(header.key)} />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="bg-white border-b border-zinc-200">
                                    <td className="px-6 py-4"><div className="h-4 bg-zinc-200 rounded animate-pulse"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-zinc-200 rounded animate-pulse"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-zinc-200 rounded animate-pulse"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-zinc-200 rounded animate-pulse"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-zinc-200 rounded animate-pulse"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-zinc-200 rounded animate-pulse"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 w-20 bg-zinc-200 rounded-full animate-pulse"></div></td>
                                </tr>
                            ))
                        ) : (
                            items.map((order, index) => (
                                <tr key={order.id} className="bg-white border-b border-zinc-200 hover:bg-zinc-50">
                                    <td className="px-6 py-4">{index + 1}</td>
                                    <td className="px-6 py-4 font-medium text-zinc-900">{order.orderId}</td>
                                    <td className="px-6 py-4">{order.name}</td>
                                    <td className="px-6 py-4">{order.phone}</td>
                                    <td className="px-6 py-4">{order.lga}</td>
                                    <td className="px-6 py-4">{order.date}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">{order.status}</span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// Main App Component (Dashboard Page)
export default function App() {
    const [stats, setStats] = useState({});
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [statsData, ordersData] = await Promise.all([
                    mockApi.getDashboardStats(),
                    mockApi.getPendingOrders()
                ]);
                setStats(statsData);
                setOrders(ordersData);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount).replace('NGN', '₦');
    };

    return (
        <>
            <div className="flex min-h-screen bg-zinc-100">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Topbar />

                    <section className='p-16'>
                        <header>
                            <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>
                            <p className="mt-1 text-zinc-600">Here's a review of your activities</p>
                        </header>

                        <main className="mt-8">
                            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6">
                                <StatCard
                                    icon={<ShopIcon />}
                                    title="Total orders"
                                    value={stats.totalOrders || 0}
                                    isLoading={isLoading}
                                />
                                <StatCard
                                    icon={<ShoppingCartIcon />}
                                    title="Total delivered"
                                    value={stats.totalDelivered || 0}
                                    isLoading={isLoading}
                                />
                                <StatCard
                                    icon={<WalletIcon />}
                                    title="Amount generated"
                                    value={formatCurrency(stats.amountGenerated || 0)}
                                    isLoading={isLoading}
                                />
                            </div>

                            <PendingOrdersTable orders={orders} isLoading={isLoading} />
                        </main>
                    </section>

                </div>
            </div>

        </>
    );
}

