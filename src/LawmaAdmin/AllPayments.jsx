import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/LawmaAdmin/Sidebar';
import Topbar from '../components/LawmaAdmin/Topbar';
import Papa from 'papaparse';

// --- Mock Data for Payments ---
const mockPaymentData = [
    { id: 1, paymentId: '#OD12589048', revenueSource: 'Waste Collection', amount: 20000, date: '2025-05-26', paymentMethod: 'Alat by Wema', status: 'Successful' },
    { id: 2, paymentId: '#OD12589049', revenueSource: 'Smart Bin purchase', amount: 20000, date: '2025-05-26', paymentMethod: 'In app wallet', status: 'Successful' },
    { id: 3, paymentId: '#OD12589050', revenueSource: 'Waste Collection', amount: 20000, date: '2025-05-26', paymentMethod: 'In app wallet', status: 'Failed' },
    { id: 4, paymentId: '#OD12589051', revenueSource: 'Waste Collection', amount: 20000, date: '2025-05-26', paymentMethod: 'Alat by Wema', status: 'Pending' },
    { id: 5, paymentId: '#OD12589052', revenueSource: 'Smart Bin purchase', amount: 20000, date: '2025-05-26', paymentMethod: 'Alat by Wema', status: 'Successful' },
    { id: 6, paymentId: '#OD12589053', revenueSource: 'Waste Disposal', amount: 15000, date: '2025-05-25', paymentMethod: 'Card', status: 'Successful' },
    { id: 7, paymentId: '#OD12589054', revenueSource: 'Smart Bin purchase', amount: 75000, date: '2025-05-24', paymentMethod: 'In app wallet', status: 'Pending' },
    { id: 8, paymentId: '#OD12589055', revenueSource: 'Waste Collection', amount: 22000, date: '2025-05-23', paymentMethod: 'Alat by Wema', status: 'Failed' },
    { id: 9, paymentId: '#OD12589056', revenueSource: 'Waste Collection', amount: 18000, date: '2025-05-22', paymentMethod: 'Card', status: 'Successful' },
    { id: 10, paymentId: '#OD12589057', revenueSource: 'Smart Bin purchase', amount: 50000, date: '2025-05-21', paymentMethod: 'Alat by Wema', status: 'Successful' },
];

// --- Status Badge Component ---
const StatusBadge = ({ status }) => {
    const baseClasses = "px-2.5 py-1 text-xs font-medium rounded-full";
    const statusClasses = {
        Successful: "bg-green-100 text-green-800",
        Pending: "bg-yellow-100 text-yellow-800",
        Failed: "bg-red-100 text-red-800",
    };
    return <span className={`${baseClasses} ${statusClasses[status] || 'bg-zinc-100 text-zinc-800'}`}>{status}</span>;
};

// --- SVG Icons ---
import {
    FilterIcon,
    SearchIcon,
    ExportIcon,
    SortIcon,
    ArrowLeftIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '../components/icons';

// --- TABLE SKELETON COMPONENT ---
const TableSkeletonLoader = () => (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-x-auto my-8">
        <div className="animate-pulse">
            <div className="space-y-4 p-4">
                {[...Array(5)].map((_, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between py-3 border-b border-zinc-100"
                    >
                        <div className="flex space-x-4">
                            <div className="h-4 bg-zinc-200 rounded w-32"></div>
                            <div className="h-4 bg-zinc-200 rounded w-24"></div>
                            <div className="h-4 bg-zinc-200 rounded w-40"></div>
                            <div className="h-4 bg-zinc-200 rounded w-20"></div>
                            <div className="h-4 bg-zinc-200 rounded w-24"></div>
                        </div>
                        <div className="h-4 bg-zinc-200 rounded w-16"></div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);




// --- Filter Modal Component ---
const FilterModal = ({ isOpen, onClose, filters, onFilterChange, onApply, onClear, paymentIds, revenueSources, paymentMethods, statuses, dates }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-zinc-800">Filter Payments</h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-800 text-2xl">&times;</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Payment ID</label>
                        <select
                            name="paymentId"
                            value={filters.paymentId}
                            onChange={onFilterChange}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Payment IDs</option>
                            {paymentIds.map((id, index) => (
                                <option key={index} value={id}>{id}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Revenue Source</label>
                        <select
                            name="revenueSource"
                            value={filters.revenueSource}
                            onChange={onFilterChange}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Revenue Sources</option>
                            {revenueSources.map((source, index) => (
                                <option key={index} value={source}>{source}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Payment Method</label>
                        <select
                            name="paymentMethod"
                            value={filters.paymentMethod}
                            onChange={onFilterChange}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Payment Methods</option>
                            {paymentMethods.map((method, index) => (
                                <option key={index} value={method}>{method}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Status</label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={onFilterChange}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Statuses</option>
                            {statuses.map((status, index) => (
                                <option key={index} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Date</label>
                        <select
                            name="date"
                            value={filters.date}
                            onChange={onFilterChange}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Dates</option>
                            {dates.map((date, index) => (
                                <option key={index} value={date}>{new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-')}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClear}
                        className="px-4 py-2 border border-zinc-300 text-zinc-700 rounded-md hover:bg-zinc-100 transition"
                    >
                        Clear
                    </button>
                    <button
                        onClick={() => {
                            onApply();
                            onClose();
                        }}
                        className="px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-700 transition"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---
export default function AllPayments() {
    const navigate = useNavigate();
    const [allPayments, setAllPayments] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        paymentId: '',
        revenueSource: '',
        paymentMethod: '',
        status: '',
        date: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalFilteredData, setTotalFilteredData] = useState([]);
    const itemsPerPage = 10;

    // Pagination helper functions
    const getPaginatedData = (data) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    };

    const getTotalPages = (totalItems) => {
        return Math.ceil(totalItems / itemsPerPage);
    };

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters, searchTerm]);

    // Get unique values for dropdowns
    const getUniqueValues = (key) => {
        return [...new Set(allPayments.map(item => item[key]))];
    };

    const paymentIds = getUniqueValues('paymentId');
    const revenueSources = getUniqueValues('revenueSource');
    const paymentMethods = getUniqueValues('paymentMethod');
    const statuses = getUniqueValues('status');
    const dates = getUniqueValues('date');

    // Mock API call to fetch data
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setAllPayments(mockPaymentData);
            setLoading(false);
        }, 1500); // Simulate network delay

        return () => clearTimeout(timer);
    }, []);

    // Apply search when search term changes
    useEffect(() => {
        // Apply filters first
        let filteredData = allPayments.filter(payment => {
            return Object.keys(filters).every(key => {
                if (!filters[key]) return true;
                return payment[key] === filters[key];
            });
        });

        // Apply search
        filteredData = applySearch(filteredData);

        // Apply current sort if exists
        let sortedData;
        if (sortConfig.key) {
            sortedData = [...filteredData].sort((a, b) => {
                const key = sortConfig.key;
                if (a[key] < b[key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[key] > b[key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        } else {
            sortedData = filteredData;
        }

        // Store total filtered data for pagination
        setTotalFilteredData(sortedData);
        
        // Apply pagination
        const paginatedData = getPaginatedData(sortedData);
        setPayments(paginatedData);
    }, [searchTerm, allPayments, filters, sortConfig.key, sortConfig.direction, currentPage]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        // Apply filters and search first, then sort
        let filteredData = allPayments.filter(payment => {
            return Object.keys(filters).every(key => {
                if (!filters[key]) return true;
                return payment[key] === filters[key];
            });
        });

        // Apply search
        filteredData = applySearch(filteredData);

        const sortedData = [...filteredData].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        // Store total filtered data for pagination
        setTotalFilteredData(sortedData);
        
        // Apply pagination
        const paginatedData = getPaginatedData(sortedData);
        setPayments(paginatedData);
    };

    const openFilter = () => {
        setIsFilterOpen(true);
    };

    const closeFilter = () => {
        setIsFilterOpen(false);
    };

    // Update filter state when user selects options
    // This will trigger the useEffect hook to reapply filters
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const applySearch = (data) => {
        if (!searchTerm) return data;

        const term = searchTerm.toLowerCase();
        return data.filter(payment =>
            payment.id.toString().includes(term) ||
            payment.paymentId.toLowerCase().includes(term) ||
            payment.revenueSource.toLowerCase().includes(term) ||
            payment.amount.toString().includes(term) ||
            payment.date.includes(term) ||
            payment.paymentMethod.toLowerCase().includes(term) ||
            payment.status.toLowerCase().includes(term)
        );
    };

    const applyFilters = () => {
        let filteredData = allPayments.filter(payment => {
            return Object.keys(filters).every(key => {
                if (!filters[key]) return true;
                return payment[key] === filters[key];
            });
        });

        // Apply search
        filteredData = applySearch(filteredData);

        // Apply current sort if exists
        let sortedData;
        if (sortConfig.key) {
            sortedData = [...filteredData].sort((a, b) => {
                const key = sortConfig.key;
                if (a[key] < b[key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[key] > b[key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        } else {
            sortedData = filteredData;
        }

        // Store total filtered data for pagination
        setTotalFilteredData(sortedData);
        
        // Apply pagination
        const paginatedData = getPaginatedData(sortedData);
        setPayments(paginatedData);
    };

    const clearFilters = () => {
        setFilters({
            paymentId: '',
            revenueSource: '',
            paymentMethod: '',
            status: '',
            date: ''
        });
        setSearchTerm('');
    };

    // Pagination handlers
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        const totalPages = getTotalPages(totalFilteredData.length);
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleExport = () => {
        // Prepare data for export (use total filtered data, not just current page)
        const exportData = totalFilteredData.map((payment) => ({
            'S/N': payment.id,
            'Payment ID': payment.paymentId,
            'Revenue Source': payment.revenueSource,
            'Amount (₦)': payment.amount,
            'Date': new Date(payment.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-'),
            'Payment Method': payment.paymentMethod,
            'Status': payment.status
        }));

        // Use PapaParse to convert to CSV
        const csv = Papa.unparse(exportData);

        // Create blob and download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'all_payments.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex min-h-screen bg-zinc-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-8xl mx-auto">
                        <header className="mb-6 flex items-center gap-2 ml-3">
                            <button 
                                onClick={() => navigate('/revenue')}
                                className="text-zinc-600 hover:text-green-800 transition-colors"
                            >
                                <ArrowLeftIcon className="h-5 w-5" />
                            </button>
                            <h1 className="text-lg font-semibold text-zinc-800">Payment details</h1>
                        </header>

                        <div className="p-4">
                            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <button
                                        onClick={openFilter}
                                        className="flex items-center px-4 py-2 border bg-white border-zinc-300 rounded-lg text-zinc-700 hover:text-green-700 transition group"
                                    >
                                        <span ><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className=' text-zinc-600 group-hover:text-green-700 transition-colors'>
                                              <path d="M3.33398 4.99984C3.33398 4.5396 3.70708 4.1665 4.16732 4.1665H15.834C16.2942 4.1665 16.6673 4.5396 16.6673 4.99984C16.6673 5.46007 16.2942 5.83317 15.834 5.83317H4.16732C3.70708 5.83317 3.33398 5.46007 3.33398 4.99984Z" fill="currentColor" />
                                              <path d="M5.00065 9.99984C5.00065 9.5396 5.37375 9.1665 5.83398 9.1665H14.1673C14.6276 9.1665 15.0007 9.5396 15.0007 9.99984C15.0007 10.4601 14.6276 10.8332 14.1673 10.8332H5.83398C5.37375 10.8332 5.00065 10.4601 5.00065 9.99984Z" fill="currentColor" />
                                              <path d="M7.50065 14.1665C7.04041 14.1665 6.66732 14.5396 6.66732 14.9998C6.66732 15.4601 7.04041 15.8332 7.50065 15.8332H12.5007C12.9609 15.8332 13.334 15.4601 13.334 14.9998C13.334 14.5396 12.9609 14.1665 12.5007 14.1665H7.50065Z" fill="currentColor" />
                                            </svg>
                                            </span>
                                        Filter
                                    </button>
                                    <div className="relative w-full sm:w-64">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <SearchIcon />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search here..."
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            className="w-full pl-10 pr-4 py-2 bg-white focus:ring-green-800 border border-zinc-300 rounded-lg focus:border-green-500"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleExport}
                                    className="flex items-center justify-center px-4 py-2 border bg-white border-zinc-300 rounded-lg text-zinc-700 hover:bg-zinc-100 hover:text-green-700 transition w-full sm:w-auto"
                                >
                                    Export
                                    <ExportIcon />
                                </button>
                            </div>

                            {/* Show skeleton loader for table or actual content */}
                            {loading ? (
                                <TableSkeletonLoader />
                            ) : (
                                <>
                                    {/* TABLE COMPONENT SECTION */}
                                    <div className="bg-white border border-zinc-200 rounded-xl overflow-x-auto my-8">
                                        <table className="w-full table-auto border-collapse">
                                            <thead>
                                                <tr>
                                                    <th
                                                        className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer"
                                                        onClick={() => handleSort('id')}
                                                    >
                                                        <div className="flex items-center">S/N</div>
                                                    </th>
                                                    <th
                                                        className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer"
                                                        onClick={() => handleSort('paymentId')}
                                                    >
                                                        <div className="flex items-center">Payment ID</div>
                                                    </th>
                                                    <th
                                                        className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer"
                                                        onClick={() => handleSort('revenueSource')}
                                                    >
                                                        <div className="flex items-center">Revenue Source</div>
                                                    </th>
                                                    <th
                                                        className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer"
                                                        onClick={() => handleSort('amount')}
                                                    >
                                                        <div className="flex items-center">Amount (₦)</div>
                                                    </th>
                                                    <th
                                                        className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer"
                                                        onClick={() => handleSort('date')}
                                                    >
                                                        <div className="flex items-center">Date</div>
                                                    </th>
                                                    <th
                                                        className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer"
                                                        onClick={() => handleSort('paymentMethod')}
                                                    >
                                                        <div className="flex items-center">Payment Method</div>
                                                    </th>
                                                    <th
                                                        className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer"
                                                        onClick={() => handleSort('status')}
                                                    >
                                                        <div className="flex items-center">Status</div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {payments.map((payment) => (
                                                    <tr key={payment.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                                                        <td className="px-4 py-3 text-sm text-zinc-900 whitespace-nowrap">{payment.id}</td>
                                                        <td className="px-4 py-3 text-sm text-zinc-900 whitespace-nowrap">{payment.paymentId}</td>
                                                        <td className="px-4 py-3 text-sm text-zinc-700 whitespace-nowrap">{payment.revenueSource}</td>
                                                        <td className="px-4 py-3 text-sm text-zinc-900 whitespace-nowrap">{new Intl.NumberFormat('en-US').format(payment.amount)}</td>
                                                        <td className="px-4 py-3 text-sm text-zinc-900 whitespace-nowrap">{new Date(payment.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-')}</td>
                                                        <td className="px-4 py-3 text-sm text-zinc-700 whitespace-nowrap">{payment.paymentMethod}</td>
                                                        <td className="px-4 py-3 text-sm text-zinc-700 whitespace-nowrap">
                                                            <StatusBadge status={payment.status} />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* PAGINATION COMPONENT SECTION */}
                                    {totalFilteredData.length > 10 && (
                                        <div className="py-4 flex items-center justify-between">
                                            <div className="text-sm text-zinc-600">
                                                Page <span className="font-medium">{currentPage}</span> of{" "}
                                                <span className="font-medium">{Math.ceil(totalFilteredData.length / itemsPerPage)}</span>
                                                <span className="ml-2">({totalFilteredData.length} total items)</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={handlePrevPage}
                                                    disabled={currentPage === 1}
                                                    className="p-2 rounded-md hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <ChevronLeftIcon />
                                                </button>
                                                <button
                                                    onClick={handleNextPage}
                                                    disabled={currentPage === Math.ceil(totalFilteredData.length / itemsPerPage)}
                                                    className="p-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <ChevronRightIcon />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <FilterModal
                        isOpen={isFilterOpen}
                        onClose={closeFilter}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onApply={applyFilters}
                        onClear={clearFilters}
                        paymentIds={paymentIds}
                        revenueSources={revenueSources}
                        paymentMethods={paymentMethods}
                        statuses={statuses}
                        dates={dates}
                    />
                </main>
            </div>
        </div>
    );
}