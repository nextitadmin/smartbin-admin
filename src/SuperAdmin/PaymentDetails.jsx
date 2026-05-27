import React, { useState, useEffect } from 'react';
import api from '../api/apiConfig';
import Sidebar from '../components/SuperAdmin/Sidebar';
import Topbar from '../components/SuperAdmin/Topbar';
import Papa from 'papaparse';

// --- SVG Icons ---
import { 
    FilterIcon, 
    SearchIcon, 
    ExportIcon, 
    DotsVerticalIcon, 
    ChevronLeftIcon, 
    ChevronRightIcon, 
    SortIcon 
} from '../components/icons';

// --- Skeleton Components ---
const TableSkeleton = () => (
    <div className="animate-pulse">
        <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-zinc-100">
                    <div className="flex space-x-4">
                        <div className="h-4 bg-zinc-200 rounded w-8"></div>
                        <div className="h-4 bg-zinc-200 rounded w-32"></div>
                        <div className="h-4 bg-zinc-200 rounded w-24"></div>
                        <div className="h-4 bg-zinc-200 rounded w-20"></div>
                        <div className="h-4 bg-zinc-200 rounded w-16"></div>
                    </div>
                    <div className="h-4 bg-zinc-200 rounded w-16"></div>
                    <div className="h-6 bg-zinc-200 rounded w-6"></div>
                </div>
            ))}
        </div>
    </div>
);

const HeaderSkeleton = () => (
    <div className="animate-pulse mb-6">
        <div className="h-8 bg-zinc-200 rounded w-1/4 mb-4"></div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="h-10 bg-zinc-200 rounded w-24"></div>
                <div className="h-10 bg-zinc-200 rounded w-64"></div>
            </div>
            <div className="h-10 bg-zinc-200 rounded w-32"></div>
        </div>
    </div>
);

// --- Content Component ---
const PaymentDetailsContent = ({ 
    paginatedPayments, 
    handleActionClick,
    handleSort, 
    sortConfig, 
    openFilter, 
    handleExport, 
    searchTerm, 
    handleSearchChange,
    currentPage,
    totalPages,
    onPageChange,
    totalPayments
}) => (
    <>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                    onClick={openFilter}
                    className="flex items-center px-4 py-2 border bg-white border-zinc-300 rounded-lg text-zinc-700 hover:bg-zinc-100 transition"
                >
                    <FilterIcon />
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
                        className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </div>
            <button
                onClick={handleExport}
                className="flex items-center justify-center px-4 py-2 border bg-white border-zinc-300 rounded-lg text-zinc-700 hover:bg-zinc-100 transition w-full sm:w-auto"
            >
                Export
                <ExportIcon />
            </button>
        </div>

        <div className="overflow-x-auto my-12 bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-zinc-200">
                <thead className="bg-zinc-50">
                    <tr>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:bg-zinc-100"
                            onClick={() => handleSort('id')}
                        >
                            <div className="flex items-center">
                                S/N
                                <SortIcon direction={sortConfig.key === 'id' ? sortConfig.direction : null} />
                            </div>
                        </th>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:bg-zinc-100"
                            onClick={() => handleSort('paymentId')}
                        >
                            <div className="flex items-center">
                                Payment ID
                                <SortIcon direction={sortConfig.key === 'paymentId' ? sortConfig.direction : null} />
                            </div>
                        </th>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:bg-zinc-100"
                            onClick={() => handleSort('revenueSource')}
                        >
                            <div className="flex items-center">
                                Revenue Source
                                <SortIcon direction={sortConfig.key === 'revenueSource' ? sortConfig.direction : null} />
                            </div>
                        </th>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:bg-zinc-100"
                            onClick={() => handleSort('amount')}
                        >
                            <div className="flex items-center">
                                Amount(₦)
                                <SortIcon direction={sortConfig.key === 'amount' ? sortConfig.direction : null} />
                            </div>
                        </th>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:bg-zinc-100"
                            onClick={() => handleSort('date')}
                        >
                            <div className="flex items-center">
                                Date
                                <SortIcon direction={sortConfig.key === 'date' ? sortConfig.direction : null} />
                            </div>
                        </th>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:bg-zinc-100"
                            onClick={() => handleSort('paymentMethod')}
                        >
                            <div className="flex items-center">
                                Payment method
                                <SortIcon direction={sortConfig.key === 'paymentMethod' ? sortConfig.direction : null} />
                            </div>
                        </th>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:bg-zinc-100"
                            onClick={() => handleSort('status')}
                        >
                            <div className="flex items-center">
                                Status
                                <SortIcon direction={sortConfig.key === 'status' ? sortConfig.direction : null} />
                            </div>
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-zinc-200">
                    {paginatedPayments.map((payment, index) => (
                        <tr key={payment.id} className="hover:bg-zinc-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                                {(currentPage - 1) * 10 + index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">{payment.paymentId}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">{payment.revenueSource}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">₦{payment.amount.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">{payment.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">{payment.paymentMethod}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    payment.status === 'Successful' 
                                        ? 'bg-green-100 text-green-800' 
                                        : payment.status === 'Failed' 
                                            ? 'bg-red-100 text-red-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {payment.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                <button
                                    type="button"
                                    onClick={() => handleActionClick(payment)}
                                    className="p-2 rounded-md hover:bg-zinc-100"
                                    aria-label="View payment details"
                                >
                                    <DotsVerticalIcon />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="py-4 flex items-center justify-between">
            <div className="text-sm text-zinc-600">
                Showing {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, totalPayments)} of {totalPayments} entries
            </div>
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => onPageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="p-2 rounded-md hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeftIcon />
                </button>
                
                {/* Show page numbers with current page highlighted */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                        // If total pages <= 5, show all pages
                        pageNum = i + 1;
                    } else if (currentPage <= 3) {
                        // If current page is in first 3, show first 4 and last
                        pageNum = i < 4 ? i + 1 : totalPages;
                    } else if (currentPage >= totalPages - 2) {
                        // If current page is in last 3, show first and last 4
                        pageNum = i === 0 ? 1 : totalPages - 4 + i;
                    } else {
                        // Show current page in middle with 2 before and after
                        pageNum = currentPage - 2 + i;
                        if (i === 4) pageNum = totalPages;
                    }
                    
                    // Add ellipsis if needed
                    if (i === 3 && totalPages > 5 && currentPage < totalPages - 2) {
                        return <span key="ellipsis" className="px-3 py-2">...</span>;
                    }
                    
                    return (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`px-3 py-2 rounded-md ${
                                currentPage === pageNum 
                                    ? 'bg-green-600 text-white' 
                                    : 'hover:bg-zinc-200'
                            }`}
                        >
                            {pageNum}
                        </button>
                    );
                })}
                
                <button 
                    onClick={() => onPageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRightIcon />
                </button>
            </div>
        </div>
    </>
);

// --- Skeleton Component ---
const PaymentDetailsSkeleton = () => (
    <>
        <HeaderSkeleton />
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200">
                <thead className="bg-zinc-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">S/N</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Payment ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Revenue Source</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Amount(₦)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Payment method</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-zinc-200">
                    <tr>
                        <td colSpan="7" className="py-4">
                            <TableSkeleton />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </>
);

// --- Modal Components ---
const PaymentDetailsModal = ({ payment, onClose }) => {
    if (!payment) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-zinc-800">Payment Details</h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-800 text-2xl">&times;</button>
                </div>
                <div>
                    <div className="mb-4">
                        <p className="font-semibold text-zinc-600">Payment ID:</p>
                        <p className="text-lg text-zinc-800">{payment.paymentId}</p>
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold text-zinc-600">Revenue Source:</p>
                        <p className="text-lg text-zinc-800">{payment.revenueSource}</p>
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold text-zinc-600">Amount:</p>
                        <p className="text-lg text-zinc-800">₦{payment.amount.toLocaleString()}</p>
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold text-zinc-600">Date:</p>
                        <p className="text-lg text-zinc-800">{payment.date}</p>
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold text-zinc-600">Payment Method:</p>
                        <p className="text-lg text-zinc-800">{payment.paymentMethod}</p>
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold text-zinc-600">Status:</p>
                        <p className={`text-lg font-semibold ${
                            payment.status === 'Successful' 
                                ? 'text-green-600' 
                                : payment.status === 'Failed' 
                                    ? 'text-red-600' 
                                    : 'text-yellow-600'
                        }`}>
                            {payment.status}
                        </p>
                    </div>
                </div>
                <div className="text-right mt-6">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-zinc-200 text-zinc-800 rounded-lg hover:bg-zinc-300 transition duration-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

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
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Date</label>
                        <select
                            name="date"
                            value={filters.date}
                            onChange={onFilterChange}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Dates</option>
                            {dates.map((date, index) => (
                                <option key={index} value={date}>{date}</option>
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
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClear}
                        className="px-4 py-2 border border-zinc-300 text-zinc-700 rounded-md hover:bg-zinc-100 transition"
                    >
                        Clear
                    </button>
                    <button
                        onClick={onApply}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---
export default function PaymentDetails() {
    const [payments, setPayments] = useState([]);
    const [paginatedPayments, setPaginatedPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState(null);
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
    const itemsPerPage = 10; // Set number of items per page

    // Get unique values for dropdowns
    const getUniqueValues = (key) => {
        return [...new Set(payments.map(item => item[key]))];
    };

    const paymentIds = getUniqueValues('paymentId');
    const revenueSources = getUniqueValues('revenueSource');
    const paymentMethods = getUniqueValues('paymentMethod');
    const statuses = getUniqueValues('status');
    const dates = getUniqueValues('date');

    // API call to fetch payment data
    useEffect(() => {
        const fetchPaymentData = async () => {
            try {
                setLoading(true);
                const response = await api.get('/lawma/superadmins/revenue-overview');
                
                // Transform the API response to match the table format
                const transformedPayments = response.data.paymentDetails?.map((payment, index) => ({
                    id: index + 1,
                    paymentId: payment?._id
                        ? `#${payment._id.substring(0, 8).toUpperCase()}`
                        : `#PD${index + 1}`,
                    revenueSource: payment.service || 'Unknown Service',
                    amount: payment.amount || 0,
                    date: new Date(payment.createdAt).toLocaleDateString('en-GB', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: '2-digit' 
                    }) || 'N/A',
                    paymentMethod: payment.paymentMethod ? payment.paymentMethod.replace(/_/g, ' ') : 'Unknown',
                    status: payment.status ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1) : 'Unknown'
                })) || [];

                setPayments(transformedPayments);
            } catch (error) {
                console.error('Error fetching payment details:', error);
                // In case of error, we could set to an empty array or handle as needed
                setPayments([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentData();
    }, []);

    // Define applySearch function (stable reference for useEffect deps)
    const applySearch = React.useCallback((data) => {
        if (!searchTerm) return data;

        const term = searchTerm.toLowerCase();
        return data.filter(payment =>
            payment.paymentId.toLowerCase().includes(term) ||
            payment.revenueSource.toLowerCase().includes(term) ||
            payment.amount.toString().includes(term) ||
            payment.date.includes(term) ||
            payment.paymentMethod.toLowerCase().includes(term) ||
            payment.status.toLowerCase().includes(term)
        );
    }, [searchTerm]);

    // Apply filtering, searching, and sorting first, then calculate paginated results
    useEffect(() => {
        // Apply filters first
        let filteredData = payments.filter(payment => {
            return Object.keys(filters).every(key => {
                if (!filters[key]) return true;
                return payment[key] === filters[key];
            });
        });

        // Apply search
        filteredData = applySearch(filteredData);

        // Apply current sort if exists
        let sortedData = [...filteredData];
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
        }

        // Calculate paginated results
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = sortedData.slice(startIndex, endIndex);
        
        setPaginatedPayments(paginatedData);
    }, [payments, filters, applySearch, sortConfig, currentPage]);

    // Calculate total pages
    const filteredPayments = payments.filter(payment => {
        return Object.keys(filters).every(key => {
            if (!filters[key]) return true;
            return payment[key] === filters[key];
        });
    });

    const searchedPayments = applySearch(filteredPayments);
    const totalPayments = searchedPayments.length;
    const totalPages = Math.ceil(totalPayments / itemsPerPage);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1); // Reset to first page when sorting
    };

    const handleActionClick = (payment) => {
        setSelectedPayment(payment);
    };

    const closeModal = () => {
        setSelectedPayment(null);
    };

    const openFilter = () => {
        setIsFilterOpen(true);
    };

    const closeFilter = () => {
        setIsFilterOpen(false);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
        setCurrentPage(1); // Reset to first page when filtering
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const applyFilters = () => {
        setIsFilterOpen(false);
        setCurrentPage(1); // Reset to first page when applying filters
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
        setCurrentPage(1); // Reset to first page when clearing filters

        setIsFilterOpen(false);
    };

    const handleExport = () => {
        // Prepare data for export - use the searched and filtered data
        const filteredData = payments.filter(payment => {
            return Object.keys(filters).every(key => {
                if (!filters[key]) return true;
                return payment[key] === filters[key];
            });
        });

        const searchedData = applySearch(filteredData);
        
        const exportData = searchedData.map((payment, index) => ({
            'S/N': index + 1,
            'Payment ID': payment.paymentId,
            'Revenue Source': payment.revenueSource,
            'Amount(₦)': payment.amount,
            'Date': payment.date,
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
        link.setAttribute('download', 'payment_details.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const onPageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="flex min-h-screen bg-zinc-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-8xl mx-auto">
                        <header className="mb-6">
                            <h1 className="text-2xl font-bold text-zinc-800">Payment details</h1>
                        </header>

                        <div className=" p-4">
                            {loading ? (
                                <PaymentDetailsSkeleton />
                            ) : (
                                <PaymentDetailsContent
                                    paginatedPayments={paginatedPayments}
                                    handleActionClick={handleActionClick}
                                    handleSort={handleSort}
                                    sortConfig={sortConfig}
                                    openFilter={openFilter}
                                    handleExport={handleExport}
                                    searchTerm={searchTerm}
                                    handleSearchChange={handleSearchChange}
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={onPageChange}
                                    totalPayments={totalPayments}
                                />
                            )}
                        </div>
                    </div>

                    <PaymentDetailsModal payment={selectedPayment} onClose={closeModal} />
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