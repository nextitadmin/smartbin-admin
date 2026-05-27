import React, { useState, useEffect, useMemo } from 'react';

import Sidebar from '../components/SuperAdmin/Sidebar';
import Topbar from '../components/SuperAdmin/Topbar';
import api from '../api/apiConfig';
import PaymentsReportSkeletonLoader from '../components/SuperAdmin/PaymentsReportSkeletonLoader';

// --- Data Layer & API Simulation ---

// Default data (same as before)
const defaultReportData = {
    title: 'My Report',
    generatedDate: 'Loading...',
    dateRange: 'Loading...',
    totalPaymentMade: 0,
    smartBinPurchaseTotal: 0,
    wasteDisposalTotal: 0,
    walletFundingTotal: 0,
    subscriptionFundingTotal: 0,
    smartBinPurchaseProgress: 0,
    wasteDisposalProgress: 0,
    walletFundingProgress: 0,
    subscriptionFundingProgress: 0,
    transactions: [],
};

// Dummy data for simulation
const dummyReportData = {
    title: 'Q2 Payment Report',
    generatedDate: '2025-07-15T14:30:00Z',
    dateRange: 'Apr 1 - Jun 30',
    totalPaymentMade: 2500000,
    smartBinPurchaseTotal: 1000000,
    wasteDisposalTotal: 750000,
    walletFundingTotal: 500000,
    subscriptionFundingTotal: 250000,
    smartBinPurchaseProgress: 40,
    wasteDisposalProgress: 30,
    walletFundingProgress: 20,
    subscriptionFundingProgress: 10,
    transactions: [
        { sn: 1, id: 'TXN001', receiptId: 'RCPT001', service: 'Smart Bin Purchase', amount: 50000, paymentMethod: 'Credit Card', date: '2025-04-15' },
        { sn: 2, id: 'TXN002', receiptId: 'RCPT002', service: 'Waste Disposal', amount: 25000, paymentMethod: 'Bank Transfer', date: '2025-04-18' },
        { sn: 3, id: 'TXN003', receiptId: 'RCPT003', service: 'Wallet Top-Up', amount: 10000, paymentMethod: 'PayPal', date: '2025-04-20' },
        { sn: 4, id: 'TXN004', receiptId: 'RCPT004', service: 'Subscription', amount: 15000, paymentMethod: 'Credit Card', date: '2025-04-22' },
        { sn: 5, id: 'TXN005', receiptId: 'RCPT005', service: 'Smart Bin Purchase', amount: 75000, paymentMethod: 'Bank Transfer', date: '2025-05-01' },
        { sn: 6, id: 'TXN006', receiptId: 'RCPT006', service: 'Waste Disposal', amount: 30000, paymentMethod: 'Credit Card', date: '2025-05-05' },
        { sn: 7, id: 'TXN007', receiptId: 'RCPT007', service: 'Wallet Top-Up', amount: 20000, paymentMethod: 'PayPal', date: '2025-05-10' },
        { sn: 8, id: 'TXN008', receiptId: 'RCPT008', service: 'Subscription', amount: 15000, paymentMethod: 'Bank Transfer', date: '2025-05-15' },
        { sn: 9, id: 'TXN009', receiptId: 'RCPT009', service: 'Smart Bin Purchase', amount: 100000, paymentMethod: 'Credit Card', date: '2025-05-20' },
        { sn: 10, id: 'TXN010', receiptId: 'RCPT010', service: 'Waste Disposal', amount: 35000, paymentMethod: 'Credit Card', date: '2025-05-25' },
        { sn: 11, id: 'TXN011', receiptId: 'RCPT011', service: 'Wallet Top-Up', amount: 25000, paymentMethod: 'Bank Transfer', date: '2025-06-01' },
        { sn: 12, id: 'TXN012', receiptId: 'RCPT012', service: 'Subscription', amount: 15000, paymentMethod: 'PayPal', date: '2025-06-05' },
        { sn: 13, id: 'TXN013', receiptId: 'RCPT013', service: 'Smart Bin Purchase', amount: 125000, paymentMethod: 'Credit Card', date: '2025-06-10' },
        { sn: 14, id: 'TXN014', receiptId: 'RCPT014', service: 'Waste Disposal', amount: 40000, paymentMethod: 'Bank Transfer', date: '2025-06-15' },
        { sn: 15, id: 'TXN015', receiptId: 'RCPT015', service: 'Wallet Top-Up', amount: 30000, paymentMethod: 'Credit Card', date: '2025-06-20' },
    ],
};



// --- Helper Functions ---

// Format currency (Naira) (same as before)
const formatCurrency = (amount) => {
    if (amount >= 1000000) {
        return `N${(amount / 1000000).toFixed(0)}M`;
    }
    if (amount >= 1000) {
        return `N${(amount / 1000).toFixed(0)}k`;
    }
    return `N${amount}`;
};

// --- React Component ---

const PaymentReportPage = () => {
    // State for report data, loading, and notifications (same as before)
    const [reportData, setReportData] = useState(defaultReportData);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // --- State for Table Features ---
    const [filterQuery, setFilterQuery] = useState(''); // State for the search/filter input
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' }); // State for sorting { key: 'columnName', direction: 'ascending' | 'descending' }
    const [currentPage, setCurrentPage] = useState(1); // State for the current page number
    const itemsPerPage = 12; // State for items per page



    // Fetch data on mount (same as before)
    const formatPeriodArrow = (periodObj) => {
        if (!periodObj || !periodObj.from || !periodObj.to) return 'N/A';
        const [fromDay, fromMonth] = periodObj.from.split('/');
        const [toDay, toMonth] = periodObj.to.split('/');
        const fromDate = new Date(2025, parseInt(fromMonth, 10) - 1, parseInt(fromDay, 10)); // Year is arbitrary
        const toDate = new Date(2025, parseInt(toMonth, 10) - 1, parseInt(toDay, 10));
        const fromStr = `${fromDate.toLocaleString('en-US', { month: 'short' })} ${fromDay}`;
        const toStr = `${toDate.toLocaleString('en-US', { month: 'short' })} ${toDay}`;
        return `${fromStr} - ${toStr}`;
    };

    const formatGenerationDate = (date) => {
        let newDate = new Date(date);
        if (isNaN(newDate.getTime())) return "";
        const day = newDate.getDate();
        const daySuffix = (d) => {
            if (d > 3 && d < 21) return 'th';
            switch (d % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };
        const month = newDate.toLocaleString('en-US', { month: 'long' });
        const year = newDate.getFullYear();
        let hours = newDate.getHours();
        const minutes = newDate.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12 || 12;
        return `${day}${daySuffix(day)} ${month} ${year} | ${hours}:${minutes}${ampm}`;
    }

    const fetchData = async () => {




        try {
            setIsLoading(true);
            setError(null);
            setSuccess(null);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Check if we should use dummy data (when no real API data is available)
            const useDummyData = !localStorage.getItem('paymentHistory');

            if (useDummyData) {
                // Use dummy data for simulation and format the date
                setReportData({
                    ...dummyReportData,
                    generatedDate: formatGenerationDate(dummyReportData.generatedDate)
                });
                setIsLoading(false);
                return;
            }

            // Original API call logic
            const paymentData = JSON.parse(localStorage.getItem('paymentHistory'));
            if (!paymentData) {
                setReportData({ transactions: [] });
                setError('No payment report found in localStorage.');
                setIsLoading(false);
                return;
            }

            const { data } = await api.get(`/corporate/reports/${paymentData}`);
            if (data.success) {
                const reportsData = data.data.data.records.map((item, index) => ({
                    sn: index + 1,
                    id: item.transactionId,
                    receiptId: item.receiptId,
                    service: item.service,
                    amount: item.amount,
                    paymentMethod: item.paymentMethod,
                    date: item.paidAt.slice(0, 10),
                }));

                setReportData({
                    title: data.data.reportName || "",
                    dateRange: formatPeriodArrow(data.data.period) || " ",
                    generatedDate: formatGenerationDate(data.data.generatedAt),
                    totalPaymentMade: data.data.data.chartSummary.totalPayment || 0,
                    smartBinPurchaseTotal: data.data.data.chartSummary.breakdown["Smart Bin Purchase"].totalAmount || 0,
                    smartBinPurchaseProgress: data.data.data.chartSummary.breakdown["Smart Bin Purchase"].percentage || 0,
                    wasteDisposalTotal: data.data.data.chartSummary.breakdown["Waste Bin Disposal"].totalAmount || 0,
                    wasteDisposalProgress: data.data.data.chartSummary.breakdown["Waste Bin Disposal"].percentage || 0,
                    walletFundingTotal: data.data.data.chartSummary.breakdown["Wallet Top-Up"].totalAmount || 0,
                    walletFundingProgress: data.data.data.chartSummary.breakdown["Wallet Top-Up"].percentage || 0,
                    subscriptionFundingTotal: data.data.data.chartSummary.breakdown["Subscription"].totalAmount || 0,
                    subscriptionFundingProgress: data.data.data.chartSummary.breakdown["Subscription"].percentage || 0,
                    transactions: reportsData
                });
            }
            setIsLoading(false);
        } catch (error) {
            console.log("Error is ", error);
            // Fallback to dummy data on error and format the date
            setReportData({
                ...dummyReportData,
                generatedDate: formatGenerationDate(dummyReportData.generatedDate)
            });
            setError('Failed to load data. Showing sample data.');
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchData();

    }, []);



    // --- Memoized Data Processing for Table ---
    const processedTransactions = useMemo(() => {
        const items = Array.isArray(reportData?.transactions) ? [...reportData.transactions] : [];
        let filteredData = [...items];

        // 1. Filtering
        if (filterQuery) {
            const lowerCaseQuery = filterQuery.toLowerCase();
            filteredData = filteredData.filter(item =>
                Object.values(item).some(value =>
                    String(value).toLowerCase().includes(lowerCaseQuery)
                )
            );
        }

        // 2. Sorting
        if (sortConfig.key !== null) {
            filteredData.sort((a, b) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];

                // Basic comparison (can be enhanced for different data types)
                if (valA < valB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (valA > valB) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return filteredData; // Return filtered and sorted data
    }, [reportData.transactions, filterQuery, sortConfig]); // Recalculate when these change

    // --- Memoized Pagination Logic ---
    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return processedTransactions.slice(startIndex, endIndex); // Slice the processed data for the current page
    }, [processedTransactions, currentPage, itemsPerPage]); // Recalculate when these change

    // --- Event Handlers ---

    // Handle clicking on table headers for sorting
    const requestSort = (key) => {
        let direction = 'ascending';
        // If clicking the same key, toggle direction
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1); // Reset to first page on sort
    };

    // Handle filter input change
    const handleFilterChange = (event) => {
        setFilterQuery(event.target.value);
        setCurrentPage(1); // Reset to first page on filter change
    };

    // Handle changing the current page
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) { // Basic boundary check
            setCurrentPage(newPage);
        }
    };

    // Calculate total pages for pagination controls
    const totalPages = Math.ceil(processedTransactions.length / itemsPerPage);

    // --- Render Logic ---

    return (

        <div>
            <div className="flex sans h-screen">
                <Sidebar addkey="1" />
                <div className="flex-1 bg-zinc-100 min-h-screen overflow-y-auto">
                    <Topbar />
                    <div className="bg-zinc-100 font-sans">
                        <main className="p-4 md:px-4">
                            <div className="lg:p-5 md:p-8 rounded-lg w-full  mx-auto max-w-[93vw]">
                                {/* Header */}
                                <div className="flex flex-wrap justify-between items-center gap-4 mb-2">
                                    <div className="flex flex-col gap-2">
                                        <h1 className="text-xl md:text-2xl font-semibold text-zinc-800">Payment History report</h1>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <button
                                            type="button"

                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-green-700 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                            Export Data
                                        </button>
                                    </div>
                                </div>


                                <div className="p-6 md:p-6 lg:p-8 bg-white min-h-screen font-sans my-20">
                                    {/* Header Section (same as before) */}
                                    {!isLoading && !error && (
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 ">
                                            <div>
                                                <h1 className="text-2xl lg:text-3xl  font-semibold text-zinc-800">{reportData.title}</h1>
                                                <p className="text-sm text-zinc-500 mt-1">{reportData.dateRange}</p>
                                            </div>
                                            <p className="lg:text-lg text-zinc-600  mt-2 sm:mt-0">
                                                Date generated : {reportData.generatedDate}
                                            </p>
                                        </div>
                                    )}



                                    {/* Error Notification (same as before) */}
                                    {error && (
                                        <div className="text-center p-4 my-4 bg-red-100 text-red-700 rounded-md">
                                            Error: {error}
                                        </div>
                                    )}

                                    {/* Success Notification (same as before) */}
                                    {success && (
                                        <div className="text-center p-4 my-4 bg-green-100 text-green-700 rounded-md">
                                            {success}
                                        </div>
                                    )}

                                    {/* --- Main Content Area (Stats, Progress, Table) --- */}
                                    {isLoading ? (
                                        <PaymentsReportSkeletonLoader />
                                    ) : (
                                        <>
                                            {/* Summary Stats Section (same as before) */}
                                            <div className="mb-8 lg:p-4  flex lg:flex-row flex-col justify-between items-center  ">
                                                <div className='lg:w-5/9 w-full justify-center items-start flex flex-col lg:mb-0 mb-6'>
                                                    <h2 className="text-xs text-zinc-500  uppercase tracking-wider">Total Payment Made</h2>
                                                    <p className="text-3xl md:text-4xl font-bold text-zinc-800 ">{formatCurrency(reportData.totalPaymentMade)}</p>
                                                </div>
                                                <div className="lg:w-4/9 w-full flex flex-row justify-between items-center ">
                                                    <div className="flex flex-col">
                                                        <p className="lg:text-3xl text-xl font-semibold text-zinc-700 py-2">{formatCurrency(reportData.smartBinPurchaseTotal)}</p>
                                                        <p className="text-xs text-zinc-500 border-l-4 border-green-700 px-1">SMART BIN PURCHASE</p>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <p className="lg:text-3xl text-xl font-semibold text-zinc-700 py-2">{formatCurrency(reportData.wasteDisposalTotal)}</p>
                                                        <p className="text-xs text-zinc-500 border-l-4 border-green-700 px-1">WASTE DISPOSAL</p>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <p className="lg:text-3xl text-xl font-semibold text-zinc-700 py-2">{formatCurrency(reportData.subscriptionFundingTotal)}</p>
                                                        <p className="text-xs text-zinc-500 border-l-4 border-green-700 px-1">SUBSCRIPTION FUNDING</p>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <p className="lg:text-3xl text-xl font-semibold text-zinc-700 py-2">{formatCurrency(reportData.walletFundingTotal)}</p>
                                                        <p className="text-xs text-zinc-500 border-l-4 border-green-700 px-1">WALLET FUNDING</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Progress Bars Section (same as before) */}
                                            <div className="mb-8 lg:p-4 lg:max-w-2/3 ">
                                                <div className="space-y-4">
                                                    {/* Smart Bin Purchase Progress */}
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <div className="w-full bg-zinc-200  lg:h-12 h-8 ">
                                                                <div
                                                                    className="bg-green-500 lg:h-12 h-8  justify-start items-center flex"
                                                                    style={{ width: `${reportData.smartBinPurchaseProgress}%` }}
                                                                    aria-valuenow={reportData.smartBinPurchaseProgress} aria-valuemin={0} aria-valuemax={100}
                                                                >
                                                                    <p className='text-white px-4 text-xs'> SMART BIN PURCHASE</p>
                                                                </div>
                                                            </div>
                                                            <span className="text-xs font-semibold text-green-700 px-4">{reportData.smartBinPurchaseProgress}%</span>
                                                        </div>

                                                    </div>
                                                    {/* Waste Disposal Progress */}
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <div className="w-full bg-zinc-200 lg:h-12 h-8 ">
                                                                <div
                                                                    className="bg-green-700 lg:h-12 h-8  justify-start items-center flex"
                                                                    style={{ width: `${reportData.wasteDisposalProgress}%` }}
                                                                    aria-valuenow={reportData.wasteDisposalProgress} aria-valuemin={0} aria-valuemax={100}
                                                                >
                                                                    <p className='text-white px-4 text-xs'> WASTE DISPOSAL</p>
                                                                </div>
                                                            </div>

                                                            <span className="text-xs font-semibold text-green-700 px-4">{reportData.wasteDisposalProgress}%</span>
                                                        </div>

                                                    </div>

                                                    <div>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <div className="w-full bg-zinc-200 lg:h-12 h-8 ">
                                                                <div
                                                                    className="bg-green-600 lg:h-12 h-8  justify-start items-center flex"
                                                                    style={{ width: `${reportData.subscriptionFundingProgress}%` }}
                                                                    aria-valuenow={reportData.subscriptionFundingProgress} aria-valuemin={0} aria-valuemax={100}
                                                                >
                                                                    <p className='text-white px-4 text-xs '>  SUBSCRIPTION FUNDING</p>



                                                                </div>
                                                            </div>
                                                            <span className="text-xs font-semibold text-green-700 px-4">{reportData.subscriptionFundingProgress}%</span>
                                                        </div>

                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <div className="w-full bg-zinc-200 lg:h-12 h-8 ">
                                                                <div
                                                                    className="bg-green-600 lg:h-12 h-8  justify-start items-center flex"
                                                                    style={{ width: `${reportData.walletFundingProgress}%` }}
                                                                    aria-valuenow={reportData.walletFundingProgress} aria-valuemin={0} aria-valuemax={100}
                                                                >
                                                                    <p className='text-white px-4 text-xs'>  WALLET FUNDING</p>



                                                                </div>
                                                            </div>
                                                            <span className="text-xs font-semibold text-green-700 px-4">{reportData.walletFundingProgress}%</span>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>

                                            {/* --- Enhanced Transactions Table Section --- */}
                                            <div className=" overflow-hidden">
                                                {/* Filter Input */}
                                                <div className="p-6 hidden">
                                                    <input
                                                        type="text"
                                                        placeholder="Filter transactions..."
                                                        value={filterQuery}
                                                        onChange={handleFilterChange}
                                                        className="w-full p-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>

                                                {/* Responsive Table Wrapper */}
                                                <div className="overflow-x-auto  border border-zinc-300 rounded-2xl">
                                                    <table className="w-full min-w-[768px] text-sm text-left text-zinc-700"> {/* Increased min-width slightly */}
                                                        {/* Table Header with Sorting */}
                                                        <thead className="text-xs text-zinc-700  uppercase py-4 ">
                                                            <tr>
                                                                {/* Add onClick handlers and visual indicators for sortable columns */}
                                                                <th scope="col" className="lg:p-6 p-2">S/N</th>
                                                                <th scope="col" className="p-6 cursor-pointer hover:bg-zinc-200" onClick={() => requestSort('id')}>
                                                                    Transaction ID {sortConfig.key === 'id' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                                                                </th>
                                                                <th scope="col" className="p-6 cursor-pointer hover:bg-zinc-200" onClick={() => requestSort('receiptId')}>
                                                                    Receipt ID {sortConfig.key === 'receiptId' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                                                                </th>
                                                                <th scope="col" className="p-6 cursor-pointer hover:bg-zinc-200" onClick={() => requestSort('service')}>
                                                                    Service {sortConfig.key === 'service' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                                                                </th>
                                                                <th scope="col" className="p-6  cursor-pointer hover:bg-zinc-200" onClick={() => requestSort('amount')}>
                                                                    Amount (N) {sortConfig.key === 'amount' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                                                                </th>
                                                                <th scope="col" className="p-6 cursor-pointer hover:bg-zinc-200" onClick={() => requestSort('date')}>
                                                                    Date {sortConfig.key === 'date' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                                                                </th>
                                                                <th scope="col" className="p-6 cursor-pointer hover:bg-zinc-200" onClick={() => requestSort('paymentMethod')}>
                                                                    Payment Method {sortConfig.key === 'paymentMethod' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        {/* Table Body - Renders Paginated Data */}
                                                        <tbody>
                                                            {paginatedTransactions.length > 0 ? (
                                                                paginatedTransactions.map((transaction, index) => {
                                                                    // Calculate the original index based on pagination
                                                                    const originalIndex = (currentPage - 1) * itemsPerPage + index + 1;
                                                                    return (
                                                                        <tr key={transaction.id} className="bg-white border-t border-zinc-300  hover:bg-zinc-50 ">
                                                                            <td className="lg:p-6 p-2">{originalIndex}</td> {/* Use original index */}
                                                                            <td className="lg:p-6 p-2 font-medium text-zinc-900 whitespace-nowrap">{transaction.id}</td>
                                                                            <td className="lg:p-6 p-2">{transaction.receiptId}</td>
                                                                            <td className="lg:p-6 p-2">{transaction.service}</td>
                                                                            <td className="lg:p-6 p-2">{transaction.amount.toLocaleString()}</td>
                                                                            <td className="lg:p-6 p-2">{transaction.date}</td>
                                                                            <td className="lg:p-6 p-2">{transaction.paymentMethod}</td>
                                                                        </tr>
                                                                    );
                                                                })
                                                            ) : (
                                                                // Display when no transactions match filter or no data
                                                                <tr>
                                                                    <td colSpan={7} className="text-center py-4 text-zinc-500">
                                                                        {filterQuery ? 'No transactions match your filter.' : 'No transactions found for this period.'}
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {/* Pagination Controls */}
                                                {totalPages > 1 && (
                                                    <div className="flex flex-col sm:flex-row justify-between items-center p-4  text-sm text-zinc-600">
                                                        {/* Items per page selector (optional) */}
                                                        {/* <div className="mb-2 sm:mb-0">
                            <label htmlFor="itemsPerPage" className="mr-2">Items per page:</label>
                            <select
                                id="itemsPerPage"
                                value={itemsPerPage}
                                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                className="p-1 border border-zinc-300 rounded-md"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div> */}

                                                        {/* Page Info */}
                                                        <div className="mb-2 sm:mb-0">
                                                            Page {currentPage} of {totalPages} ({processedTransactions.length} items)
                                                        </div>

                                                        {/* Navigation Buttons */}
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handlePageChange(currentPage - 1)}
                                                                disabled={currentPage === 1}
                                                                className="px-3 py-1 border border-zinc-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100"
                                                            >
                                                                Previous
                                                            </button>
                                                            <button
                                                                onClick={() => handlePageChange(currentPage + 1)}
                                                                disabled={currentPage === totalPages}
                                                                className="px-3 py-1 border border-zinc-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100"
                                                            >
                                                                Next
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>

                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentReportPage;
