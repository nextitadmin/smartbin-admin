import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from '../components/TeamMembers/Sidebar';
import Topbar from '../components/TeamMembers/Topbar';
import useTeamOrderStore from '../stores/useTeamOrderStore';
import ActivatedOrderModal from '../components/TeamMembers/ActivatedModal';
import PendingOrderModal from '../components/TeamMembers/PendingModal';
import DeliveredOrderModal from '../components/TeamMembers/DeliveredModal';

// --- HEROICONS SVGs ---
// Using raw SVGs as requested since no icon library is installed.

const DocumentTextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

const BanknotesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125-1.125h-15c-.621 0-1.125-.504-1.125-1.125V8.25m0 0A.75.75 0 0 1 3 7.5h.75M3 7.5v.375c0 .621.504 1.125 1.125 1.125h13.5m-15-3.375V5.625c0-.621.504-1.125 1.125-1.125h1.5c.621 0 1.125.504 1.125 1.125v.375m13.5 0v-.375c0-.621-.504-1.125-1.125-1.125h-1.5c-.621 0-1.125.504-1.125 1.125v.375" />
    </svg>
);

const MagnifyingGlassIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

const ChevronUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);

const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
);


// --- COMPONENTS ---

const StatCard = ({ icon, title, value, bgColor, textColor }) => {
    return (
        <div className={`flex-1 p-6 rounded-lg flex items-center ${bgColor} ${textColor}`}>

            <div>
                {icon && <div className="p-3 bg-white/20 rounded-full mr-4">
                    {icon}
                </div>}
                <p className="text-base">{title}</p>
                <p className="text-3xl font-bold">{value}</p>
            </div>
        </div>
    );
};

const Header = () => (
    <header className="mb-6">
        <h1 className="text-3xl font-bold text-zinc-800">Order Management</h1>
        <p className="text-zinc-500">Here's a review of your orders</p>
    </header>
);

const Tabs = ({ activeTab, setActiveTab }) => {
    const tabs = ['Pending requests', 'Delivered', 'Activated'];
    return (
        <div className="mb-4">
            <div className="border-b border-zinc-200">
                <nav className="-mb-px flex space-x-6 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                                ${activeTab === tab
                                    ? 'border-green-500 text-green-600'
                                    : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'
                                }`
                            }
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
};

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

const OrderTable = ({ orders, onRowClick, isLoading }) => {
    const { items, requestSort, sortConfig } = useSortableData(orders);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const ITEMS_PER_PAGE = 5;

    // Reset page to 1 when table data changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [orders]);

    const filteredItems = useMemo(() => {
        return items.filter(item =>
            Object.values(item).some(val =>
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [items, searchTerm]);

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const lastPageIndex = firstPageIndex + ITEMS_PER_PAGE;
        return filteredItems.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, filteredItems]);

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const getSortIcon = (name) => {
        if (!sortConfig || sortConfig.key !== name) {
            return <div className="w-4 h-4" />;
        }
        return sortConfig.direction === 'ascending' ? <ChevronUpIcon /> : <ChevronDownIcon />;
    };

    const headers = [
        { key: 'id', label: 'Order ID' },
        { key: 'name', label: 'Name' },
        { key: 'phone', label: 'Phone number' },
        { key: 'lga', label: 'LGA' },
        { key: 'orderDate', label: 'Order date' },
        { key: 'status', label: 'Status' },
    ];

    const getStatusChip = (status) => {
        const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
        switch (status) {
            case 'Pending': return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'Delivered': return `${baseClasses} bg-green-100 text-green-800`;
            case 'Scheduled': return `${baseClasses} bg-blue-100 text-blue-800`;
            case 'Activated': return `${baseClasses} bg-purple-100 text-purple-800`;
            case 'Inventory': return `${baseClasses} bg-zinc-200 text-zinc-800`;
            default: return `${baseClasses} bg-zinc-100 text-zinc-800`;
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-zinc-500">Loading orders...</div>;
    }

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-zinc-200">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <div className="relative w-full sm:w-auto sm:flex-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon />
                    </span>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to first page on search
                        }}
                        className="w-full sm:max-w-xs pl-10 pr-4 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 border border-zinc-300 rounded-md text-sm font-medium text-zinc-700 hover:bg-zinc-50">Filter</button>
                    <button className="px-4 py-2 border border-zinc-300 rounded-md text-sm font-medium text-zinc-700 hover:bg-zinc-50">Export</button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200">
                    <thead className="bg-zinc-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">S/N</th>
                            {headers.map(header => (
                                <th
                                    key={header.key}
                                    className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer"
                                    onClick={() => requestSort(header.key)}
                                >
                                    <div className="flex items-center gap-2">
                                        {header.label}
                                        {getSortIcon(header.key)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-zinc-200">
                        {currentTableData.map((order, index) => (
                            <tr
                                key={order.id}
                                onClick={() => onRowClick(order)}
                                className="hover:bg-zinc-50 cursor-pointer transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900">{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">{order.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">{order.phone}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">{order.lga}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">{order.orderDate ? new Date(order.orderDate).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) : '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={getStatusChip(order.status)}>{order.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-4">
                <div className="text-sm text-zinc-500 mb-2 sm:mb-0">
                    Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages || 1}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="p-2 border border-zinc-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100"
                    >
                        <ChevronLeftIcon />
                    </button>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-2 border border-zinc-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100 bg-green-600 text-white hover:bg-green-700"
                    >
                        <ChevronRightIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};


export default function OrderManagement() {
    const [activeTab, setActiveTab] = useState('Pending requests');
    const { orders, fetchOrders, isLoading, fetchOrderDetails } = useTeamOrderStore();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [activeModal, setActiveModal] = useState(null); // 'pending', 'delivered', 'activated'

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const filteredOrders = useMemo(() => {
        const tabStatusMap = {
            'Pending requests': 'Pending',
            'Scheduled': 'Scheduled',
            'Delivered': 'Delivered',
            'Activated': 'Activated',
            'Inventory': 'Inventory',
        };

        const statusToFilter = tabStatusMap[activeTab];

        if (statusToFilter) {
            return orders.filter(order => order.status?.toLowerCase() === statusToFilter.toLowerCase());
        }

        return orders; // Default to all if no specific tab is matched
    }, [activeTab, orders]);

    const handleRowClick = async (order) => {
        try {
            const status = (order.status || '').toLowerCase();
            setSelectedOrder(null); // Clear selected order to trigger loading state

            if (status === 'pending') {
                setActiveModal('pending');
            } else if (status === 'delivered') {
                setActiveModal('delivered');
            } else if (status === 'activated') {
                setActiveModal('activated');
            } else {
                console.log("No specific modal for status:", status);
                return;
            }

            // Ideally fetch full details here or rely on passed order if sufficient.
            // Using the store to fetch details which might be more complete (e.g. history, items)
            const details = await fetchOrderDetails(order.id); // store sets activeOrder
            setSelectedOrder(details);
        } catch (error) {
            console.error("Error fetching order details", error);
        }
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedOrder(null);
    };

    return (
        <div className="flex min-h-screen bg-zinc-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="bg-zinc-100 min-h-screen w-full p-4 sm:p-6 lg:p-8">
                    <div className="nomax-w mx-auto">
                        <Header />

                        {/* Stat Cards */}
                        <div className="flex flex-col sm:flex-row gap-6 mb-8">
                            <StatCard
                                icon={<DocumentTextIcon />}
                                title="Total orders"
                                value="1,024"
                                bgColor="bg-white"
                                textColor="text-zinc-600"
                            />
                            <StatCard
                                icon={<BanknotesIcon />}
                                title="Order value"
                                value="₦1,000,000"
                                bgColor="bg-white"
                                textColor="text-zinc-600"
                            />
                            <StatCard

                                title="On going orders"
                                value="24"
                                bgColor="bg-orange-400"
                                textColor="text-white"
                            />
                            <StatCard

                                title="Completed orders"
                                value="1,000"
                                bgColor="bg-green-500"
                                textColor="text-white"
                            />
                        </div>

                        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

                        <OrderTable
                            orders={filteredOrders}
                            onRowClick={handleRowClick}
                            isLoading={isLoading}
                        />

                        {/* Modals */}
                        <PendingOrderModal
                            isOpen={activeModal === 'pending'}
                            order={selectedOrder}
                            onClose={closeModal}
                            onTransition={closeModal} // Or handle transition to another modal if needed
                        />
                        <DeliveredOrderModal
                            isOpen={activeModal === 'delivered'}
                            order={selectedOrder}
                            onClose={closeModal}
                            onTransition={closeModal}
                        />
                        <ActivatedOrderModal
                            isOpen={activeModal === 'activated'}
                            order={selectedOrder}
                            onClose={closeModal}
                        />

                    </div>
                </main>
            </div>
        </div>
    );
}
