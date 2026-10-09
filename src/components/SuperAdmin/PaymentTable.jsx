import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// --- SVG ICONS (Heroicons) ---
const ChevronUpDownIcon = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
    </svg>
);

// Status Badge for the table
const StatusBadge = ({ status }) => {
    const baseClasses = "px-2.5 py-1 text-xs font-medium rounded-full";
    const statusClasses = {
        Successful: "bg-green-100 text-green-800",
        Pending: "bg-yellow-100 text-yellow-800",
        Failed: "bg-red-100 text-red-800",
    };
    return <span className={`${baseClasses} ${statusClasses[status] || 'bg-zinc-100 text-zinc-800'}`}>{status}</span>;
};

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

const ChevronLeftIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
    </svg>
);

const ChevronRightIcon = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
);

const PaymentTable = ({ 
    initialPaymentDetails = [], 
    currentPage = 1, 
    totalPages = 1, 
    onPageChange = () => {}, 
    loading = false,
    totalRevenue = 0
}) => {
    const { items: paymentDetails, requestSort, sortConfig } = useSortableData(initialPaymentDetails);
    const navigate = useNavigate();

    const headers = [
        { key: 's_n', label: 'S/N' },
        { key: 'psp_company', label: 'PSP Company' },
        { key: 'lcda', label: 'LCDA' },
        { key: 'household_covered', label: 'Household covered' },
        { key: 'revenue', label: 'Revenue(₦)' },
        { key: 'outStandingBill', label: 'Bills(₦)' }
    ];

    const getSortIndicator = (key) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <ChevronUpDownIcon className="w-4 h-4 text-zinc-400" />;
        }
        if (sortConfig.direction === 'ascending') {
            return <svg className="w-4 h-4 text-zinc-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M14.77 12.79a.75.75 0 0 1-1.06-.02L10 8.832 6.29 12.77a.75.75 0 1 1-1.08-1.04l4.25-4.5a.75.75 0 0 1 1.08 0l4.25 4.5a.75.75 0 0 1-.02 1.06Z" clipRule="evenodd" /></svg>;
        }
        return <svg className="w-4 h-4 text-zinc-800" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" /></svg>;
    };

    const handleViewAll = () => {
        navigate('/payment-details');
    };

    return (
        <div className="mt-6 bg-white rounded-xl border border-zinc-200">
            <div className="p-4 sm:p-6 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold text-zinc-800">PSP revenue</h2>
                    {totalRevenue > 0 && (
                        <p className="text-xs text-zinc-500 mt-0.5">
                            Total: ₦{Number(totalRevenue).toLocaleString()}
                        </p>
                    )}
                </div>
                <button onClick={handleViewAll} className="text-sm font-medium text-green-600 hover:text-green-700">View all</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-zinc-600">
                    <thead className="text-xs text-zinc-500 uppercase bg-zinc-50">
                        <tr>
                            {headers.map((header) => (
                                <th key={header.key} scope="col" className="px-6 py-3">
                                    <button onClick={() => requestSort(header.key)} className="flex items-center gap-1.5 group">
                                        {header.label}
                                        <span className="opacity-50 group-hover:opacity-100 transition-opacity">
                                            {getSortIndicator(header.key)}
                                        </span>
                                    </button>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="relative">
                        {loading ? (
                            <tr>
                                <td colSpan={headers.length} className="px-6 py-12 text-center text-zinc-500">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                                        <span>Loading PSP revenue...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : paymentDetails.length === 0 ? (
                            <tr>
                                <td colSpan={headers.length} className="px-6 py-10 text-center text-zinc-500">
                                    No records found.
                                </td>
                            </tr>
                        ) : (
                            paymentDetails.map((payment) => (
                                <tr key={payment.id ?? payment.s_n} className="bg-white border-b border-zinc-200 hover:bg-zinc-50">
                                    <td className="px-6 py-4">{payment.s_n}</td>
                                    <td className="px-6 py-4 font-medium text-zinc-900">{payment.psp_company}</td>
                                    <td className="px-6 py-4">{payment.lcda}</td>
                                    <td className="px-6 py-4">{Number(payment.household_covered ?? 0).toLocaleString()}</td>
                                    <td className="px-6 py-4">{new Intl.NumberFormat('en-US').format(payment.revenue)}</td>
                                    <td className="px-6 py-4">{new Intl.NumberFormat('en-US').format(payment.outStandingBill)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center p-4 sm:p-6 border-t border-zinc-200 bg-zinc-50/50 rounded-b-xl">
                    <button
                        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1 || loading}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeftIcon className="w-4 h-4" /> Previous
                    </button>
                    <span className="text-sm text-zinc-600">
                        Page <span className="font-semibold text-zinc-800">{currentPage}</span> of <span className="font-semibold text-zinc-800">{totalPages}</span>
                    </span>
                    <button
                        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages || loading}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next <ChevronRightIcon className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default PaymentTable;