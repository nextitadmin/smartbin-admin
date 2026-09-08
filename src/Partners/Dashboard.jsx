import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from "../components/Partners/Sidebar";
import Topbar from "../components/Partners/Topbar";
import { 
    WalletIcon, 
    ShoppingCartIcon, 
    ShopIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '../components/icons';
import api from '../api/apiConfig';

// --- HELPER FUNCTIONS ---

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return dateString;
        return d.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }) + ' ' + d.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    } catch {
        return dateString;
    }
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', { 
        style: 'currency', 
        currency: 'NGN', 
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount || 0).replace('NGN', '₦');
};

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
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-zinc-200 flex-1 min-w-[220px] shadow-sm">
        <div className="flex items-center">
            <div className="bg-green-700 p-2.5 rounded-full text-white">
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
                const valA = a[sortConfig.key] ?? '';
                const valB = b[sortConfig.key] ?? '';
                if (valA < valB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (valA > valB) {
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
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { items, requestSort, sortConfig } = useSortableData(orders);

    const getSortDirection = (name) => {
        if (!sortConfig) return;
        return sortConfig.key === name ? (sortConfig.direction === 'ascending' ? 'asc' : 'desc') : undefined;
    };

    const headers = [
        { key: 'sn', label: 'S/N' },
        { key: 'orderId', label: 'Order ID' },
        { key: 'name', label: 'Customer Name' },
        { key: 'phone', label: 'Phone Number' },
        { key: 'binType', label: 'Bin Type' },
        { key: 'lga', label: 'LGA' },
        { key: 'rawDate', label: 'Order Date' },
        { key: 'status', label: 'Status' }
    ];

    const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedOrders = items.slice(startIndex, startIndex + itemsPerPage);

    const goToPreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-zinc-200 mt-8 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-zinc-800">Pending order list</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">Orders awaiting partner delivery or approval</p>
                </div>
                <Link 
                    to="/order-management" 
                    className="text-sm font-medium text-green-700 hover:text-green-800 underline"
                >
                    See all
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-zinc-500">
                    <thead className="text-xs text-zinc-700 uppercase bg-zinc-50">
                        <tr>
                            {headers.map((header) => (
                                <th 
                                    key={header.key} 
                                    scope="col" 
                                    className="px-6 py-3 cursor-pointer select-none hover:bg-zinc-100 transition" 
                                    onClick={() => header.key !== 'sn' && requestSort(header.key)}
                                >
                                    {header.label}
                                    {header.key !== 'sn' && <SortIcon direction={getSortDirection(header.key)} />}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <tr key={i} className="bg-white border-b border-zinc-200">
                                    <td className="px-6 py-4"><div className="h-4 w-4 bg-zinc-200 rounded animate-pulse"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 w-16 bg-zinc-200 rounded animate-pulse"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 w-36 bg-zinc-200 rounded animate-pulse"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 w-24 bg-zinc-200 rounded animate-pulse"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 w-20 bg-zinc-200 rounded animate-pulse"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 w-16 bg-zinc-200 rounded animate-pulse"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 w-28 bg-zinc-200 rounded animate-pulse"></div></td>
                                    <td className="px-6 py-4"><div className="h-6 w-16 bg-zinc-200 rounded-full animate-pulse"></div></td>
                                </tr>
                            ))
                        ) : paginatedOrders.length === 0 ? (
                            <tr>
                                <td colSpan={headers.length} className="text-center py-10 text-zinc-400">
                                    No pending orders found.
                                </td>
                            </tr>
                        ) : (
                            paginatedOrders.map((order, index) => (
                                <tr key={order.id} className="bg-white border-b border-zinc-100 hover:bg-zinc-50 transition">
                                    <td className="px-6 py-4 text-zinc-700">{startIndex + index + 1}</td>
                                    <td className="px-6 py-4 font-medium text-zinc-900">{order.orderId}</td>
                                    <td className="px-6 py-4 text-zinc-900 font-medium">{order.name}</td>
                                    <td className="px-6 py-4">{order.phone}</td>
                                    <td className="px-6 py-4">
                                        <span className="capitalize">{order.binType}</span>
                                    </td>
                                    <td className="px-6 py-4">{order.lga}</td>
                                    <td className="px-6 py-4 text-zinc-600">{order.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                            order.status.toLowerCase() === 'delivered' || order.status.toLowerCase() === 'approved'
                                                ? 'bg-green-100 text-green-800'
                                                : order.status.toLowerCase() === 'pending'
                                                ? 'bg-amber-100 text-amber-800'
                                                : 'bg-zinc-100 text-zinc-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {!isLoading && items.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-zinc-100 text-sm text-zinc-600">
                    <div className="flex items-center gap-4">
                        <span>
                            Showing <span className="font-semibold text-zinc-900">{startIndex + 1}</span> to{' '}
                            <span className="font-semibold text-zinc-900">
                                {Math.min(startIndex + itemsPerPage, items.length)}
                            </span>{' '}
                            of <span className="font-semibold text-zinc-900">{items.length}</span> orders
                        </span>

                        <div className="flex items-center gap-2">
                            <label htmlFor="itemsPerPage" className="text-zinc-500 text-xs uppercase">
                                Per page:
                            </label>
                            <select
                                id="itemsPerPage"
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="py-1 px-2 text-sm border border-zinc-300 rounded-lg bg-white focus:ring focus:ring-green-700 focus:outline-none"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            className="p-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            title="Previous page"
                        >
                            <ChevronLeftIcon className="h-4 w-4" />
                        </button>
                        <span className="px-2 text-sm text-zinc-700">
                            Page <span className="font-semibold text-zinc-900">{currentPage}</span> of{' '}
                            <span className="font-semibold text-zinc-900">{totalPages}</span>
                        </span>
                        <button
                            onClick={goToNextPage}
                            disabled={currentPage >= totalPages}
                            className="p-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            title="Next page"
                        >
                            <ChevronRightIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Main Dashboard Page Component
export default function Dashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalDelivered: 0,
        amountGenerated: 0
    });
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/lawma/smartbin-partners/dashboard');
                const data = response.data?.data || response.data || {};

                setStats({
                    totalOrders: data.totalSmartbinOrders ?? 0,
                    totalDelivered: data.totalDeliveredSmartbins ?? 0,
                    amountGenerated: data.totalRevenue ?? 0,
                });

                const rawList = Array.isArray(data.pendingList) ? data.pendingList : [];
                const formattedOrders = rawList.map((item, idx) => ({
                    id: item.id || item._id || idx + 1,
                    orderId: item.orderId || `#${(item.id || '').slice(-6).toUpperCase() || 'N/A'}`,
                    name: item.customerName || item.name || 'N/A',
                    phone: item.phoneNumber || item.phone || 'N/A',
                    email: item.email,
                    address: item.address,
                    lga: item.lga || '-',
                    binType: item.binType ? (item.binType === 'smart' ? 'Smart Bin' : 'Non-Smart Bin') : 'Smart Bin',
                    quantity: item.quantity || 1,
                    date: formatDate(item.orderDate || item.datePending),
                    rawDate: item.orderDate || item.datePending,
                    status: (item.status || 'Pending').charAt(0).toUpperCase() + (item.status || 'Pending').slice(1).toLowerCase()
                }));
                setOrders(formattedOrders);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="flex min-h-screen bg-zinc-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />

                <section className="p-6 sm:p-10 lg:p-16">
                    <header>
                        <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>
                        <p className="mt-1 text-zinc-600">Here's a review of your activities</p>
                    </header>

                    <main className="mt-8">
                        <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6">
                            <StatCard
                                icon={<ShopIcon />}
                                title="Total orders"
                                value={stats.totalOrders}
                                isLoading={isLoading}
                            />
                            <StatCard
                                icon={<ShoppingCartIcon />}
                                title="Total delivered"
                                value={stats.totalDelivered}
                                isLoading={isLoading}
                            />
                            <StatCard
                                icon={<WalletIcon />}
                                title="Amount generated"
                                value={formatCurrency(stats.amountGenerated)}
                                isLoading={isLoading}
                            />
                        </div>

                        <PendingOrdersTable orders={orders} isLoading={isLoading} />
                    </main>
                </section>
            </div>
        </div>
    );
}
