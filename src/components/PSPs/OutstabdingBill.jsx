import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Papa from "papaparse";

// --- Mock Data ---
const mockData = [
    {
        id: 1,
        billID: "BILL-001",
        customerName: "Adetutu James",
        address: "123 Victoria Island, Lagos",
        amount: 15000,
        dueDate: "26-05-25",
        status: "Overdue",
        description: "Smart bin service fee",
        details: "view details",
    },
    {
        id: 2,
        billID: "BILL-002",
        customerName: "John Doe",
        address: "456 Ikoyi, Lagos",
        amount: 25000,
        dueDate: "28-05-25",
        status: "Pending",
        description: "Monthly subscription",
        details: "view details",
    },
    {
        id: 3,
        billID: "BILL-003",
        customerName: "Jane Smith",
        address: "789 Lekki, Lagos",
        amount: 18000,
        dueDate: "30-05-25",
        status: "Overdue",
        description: "Service fee",
        details: "view details",
    },
    {
        id: 4,
        billID: "BILL-004",
        customerName: "Mike Johnson",
        address: "321 Surulere, Lagos",
        amount: 32000,
        dueDate: "01-06-25",
        status: "Pending",
        description: "Quarterly payment",
        details: "view details",
    },
    {
        id: 5,
        billID: "BILL-005",
        customerName: "Sarah Wilson",
        address: "654 Yaba, Lagos",
        amount: 12000,
        dueDate: "03-06-25",
        status: "Overdue",
        description: "Maintenance fee",
        details: "view details",
    },
    {
        id: 6,
        billID: "BILL-006",
        customerName: "David Brown",
        address: "987 Ikeja, Lagos",
        amount: 22000,
        dueDate: "05-06-25",
        status: "Pending",
        description: "Installation fee",
        details: "view details",
    },
    {
        id: 7,
        billID: "BILL-007",
        customerName: "Lisa Davis",
        address: "147 Gbagada, Lagos",
        amount: 28000,
        dueDate: "07-06-25",
        status: "Overdue",
        description: "Service upgrade",
        details: "view details",
    },
    {
        id: 7,
        billID: "BILL-007",
        customerName: "Lisa Davis",
        address: "147 Gbagada, Lagos",
        amount: 28000,
        dueDate: "07-06-25",
        status: "Overdue",
        description: "Service upgrade",
        details: "view details",
    },
    {
        id: 7,
        billID: "BILL-007",
        customerName: "Lisa Davis",
        address: "147 Gbagada, Lagos",
        amount: 28000,
        dueDate: "07-06-25",
        status: "Overdue",
        description: "Service upgrade",
        details: "view details",
    },
    {
        id: 7,
        billID: "BILL-007",
        customerName: "Lisa Davis",
        address: "147 Gbagada, Lagos",
        amount: 28000,
        dueDate: "07-06-25",
        status: "Overdue",
        description: "Service upgrade",
        details: "view details",
    },
    {
        id: 7,
        billID: "BILL-007",
        customerName: "Lisa Davis",
        address: "147 Gbagada, Lagos",
        amount: 28000,
        dueDate: "07-06-25",
        status: "Overdue",
        description: "Service upgrade",
        details: "view details",
    },
];

// --- SVG Icons ---
import {
    SearchIcon,
    ExportIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowLeftIcon,
} from "../icons";

// --- Skeleton Components ---
const TableSkeleton = () => (
    <div className="animate-pulse">
        <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
                <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-zinc-100"
                >
                    <div className="flex space-x-4">
                        <div className="h-4 bg-zinc-200 rounded w-6"></div>
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

// --- Skeleton Component ---
const OutstandingBillSkeleton = () => (
    <div className="overflow-x-auto">
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full min-w-[900px] m-4 table-auto border-collapse">
                <thead className="border-b border-zinc-200">
                    <tr>
                        <th className="lg:p-6 p-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider w-12">
                            <div className="h-4 bg-zinc-200 rounded w-6 animate-pulse"></div>
                        </th>
                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider">
                            <div className="h-4 bg-zinc-200 rounded w-12 animate-pulse"></div>
                        </th>
                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider">
                            <div className="h-4 bg-zinc-200 rounded w-20 animate-pulse"></div>
                        </th>
                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider">
                            <div className="h-4 bg-zinc-200 rounded w-12 animate-pulse"></div>
                        </th>
                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider">
                            <div className="h-4 bg-zinc-200 rounded w-12 animate-pulse"></div>
                        </th>
                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider">
                            <div className="h-4 bg-zinc-200 rounded w-16 animate-pulse"></div>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                    <tr>
                        <td colSpan="6" className="py-4">
                            <TableSkeleton />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

// --- Modal Components ---
const BillDetailsModal = ({ bill, onClose }) => {
    if (!bill) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md m-4">
                <div className="flex justify-between items-start mb-6 border-b border-zinc-200 pb-1">
                    <h2 className="text-lg font-bold text-zinc-700">Bill Details</h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-500 hover:text-zinc-800 text-2xl"
                    >
                        &times;
                    </button>
                </div>
                <div className="mt-6 flex flex-col gap-4">
                    <div className="mb-4 flex justify-between">
                        <p className="font-semibold text-zinc-600">Bill Number</p>
                        <p className="text-lg text-zinc-800">{bill.billID}</p>
                    </div>
                    <div className="mb-4 flex justify-between">
                        <p className="font-semibold text-zinc-600">Customer Name</p>
                        <p className="text-lg text-zinc-800">{bill.customerName}</p>
                    </div>
                    <div className="mb-4 flex justify-between">
                        <p className="font-semibold text-zinc-600">Address</p>
                        <p className="text-lg text-zinc-800">{bill.address}</p>
                    </div>
                    <div className="mb-4 flex justify-between">
                        <p className="font-semibold text-zinc-600">Amount</p>
                        <p className="text-lg text-zinc-800 font-bold">₦{bill.amount.toLocaleString()}</p>
                    </div>
                    <div className="mb-4 flex justify-between">
                        <p className="font-semibold text-zinc-600">Due Date</p>
                        <p className="text-lg text-zinc-800">{bill.dueDate}</p>
                    </div>
                    <div className="mb-4 flex justify-between">
                        <p className="font-semibold text-zinc-600">Status</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${bill.status === 'Overdue'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {bill.status}
                        </span>
                    </div>
                    <div className="mb-4 flex justify-between">
                        <p className="font-semibold text-zinc-600">Description</p>
                        <p className="text-lg text-zinc-800">{bill.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FilterModal = ({
    isOpen,
    onClose,
    filters,
    onFilterChange,
    onApply,
    onClear,
    customerNames,
    addresses,
    statuses,
    dueDates,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-zinc-800">Filter Outstanding Bills</h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-500 hover:text-zinc-800 text-2xl"
                    >
                        &times;
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">
                            Customer Name
                        </label>
                        <select
                            name="customerName"
                            value={filters.customerName}
                            onChange={onFilterChange}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Customers</option>
                            {customerNames.map((name, index) => (
                                <option key={index} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">
                            Address
                        </label>
                        <select
                            name="address"
                            value={filters.address}
                            onChange={onFilterChange}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Addresses</option>
                            {addresses.map((address, index) => (
                                <option key={index} value={address}>
                                    {address}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">
                            Status
                        </label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={onFilterChange}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Statuses</option>
                            {statuses.map((status, index) => (
                                <option key={index} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">
                            Due Date
                        </label>
                        <select
                            name="dueDate"
                            value={filters.dueDate}
                            onChange={onFilterChange}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Dates</option>
                            {dueDates.map((date, index) => (
                                <option key={index} value={date}>
                                    {date}
                                </option>
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
export default function OutstandingBill() {
    const navigate = useNavigate();
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        customerName: "",
        address: "",
        status: "",
        dueDate: "",
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Get unique values for dropdowns
    const getUniqueValues = (key) => {
        return [...new Set(mockData.map((item) => item[key]))];
    };

    const customerNames = getUniqueValues("customerName");
    const addresses = getUniqueValues("address");
    const statuses = getUniqueValues("status");
    const dueDates = getUniqueValues("dueDate");

    // Helper function for search
    const applySearch = (data) => {
        if (!searchTerm) return data;

        const term = searchTerm.toLowerCase();
        return data.filter(
            (bill) =>
                bill.customerName.toLowerCase().includes(term) ||
                bill.address.toLowerCase().includes(term) ||
                bill.billID.toLowerCase().includes(term) ||
                bill.dueDate.includes(term) ||
                bill.status.toLowerCase().includes(term) ||
                bill.description.toLowerCase().includes(term)
        );
    };

    // Pagination helper functions
    const getFilteredData = () => {
        // Apply filters first
        let filteredData = mockData.filter((bill) => {
            return Object.keys(filters).every((key) => {
                if (!filters[key]) return true;
                return bill[key] === filters[key];
            });
        });

        // Apply search
        filteredData = applySearch(filteredData);

        // Apply sorting
        if (sortConfig.key) {
            filteredData = [...filteredData].sort((a, b) => {
                const key = sortConfig.key;
                if (a[key] < b[key]) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (a[key] > b[key]) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }

        return filteredData;
    };

    const getPaginatedData = () => {
        const filteredData = getFilteredData();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredData.slice(startIndex, endIndex);
    };

    const getTotalPages = () => {
        const filteredData = getFilteredData();
        return Math.ceil(filteredData.length / itemsPerPage);
    };

    const totalPages = getTotalPages();
    const paginatedBills = getPaginatedData();

    // Mock API call to fetch data
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setBills(paginatedBills);
            setLoading(false);
        }, 1500); // Simulate network delay

        return () => clearTimeout(timer);
    }, [currentPage, filters, searchTerm, sortConfig]);

    // Reset to first page when filters or search change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filters]);

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
        setCurrentPage(1); // Reset to first page when sorting
    };

    const handleActionClick = (bill) => {
        setSelectedBill(bill);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedBill(null);
    };

    const openFilter = () => {
        setIsFilterOpen(true);
    };

    const closeFilter = () => {
        setIsFilterOpen(false);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Pagination navigation handlers
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };


    const applyFilters = () => {
        setCurrentPage(1); // Reset to first page when applying filters
        setIsFilterOpen(false);
    };

    const clearFilters = () => {
        setFilters({
            customerName: "",
            address: "",
            status: "",
            dueDate: "",
        });
        setSearchTerm("");
        setCurrentPage(1); // Reset to first page when clearing filters
        setIsFilterOpen(false);
    };

    const handleExport = () => {
        // Prepare data for export - use all filtered data, not just current page
        const filteredData = getFilteredData();
        const exportData = filteredData.map((bill, index) => ({
            "Bill ID": bill.billID,
            "Customer Name": bill.customerName,
            "Address": bill.address,
            "Amount": `₦${bill.amount.toLocaleString()}`,
            "Due Date": bill.dueDate,
            "Status": bill.status,
            "Description": bill.description,
        }));

        // Use PapaParse to convert to CSV
        const csv = Papa.unparse(exportData);

        // Create blob and download
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "outstanding_bills.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex min-h-screen bg-zinc-100">
            <Sidebar activeRoute="/bills-and-receipts" />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-8xl mx-auto">
                        <div className="">
                            <div>
                                <header className="mb-10">
                                    <div className="flex items-center gap-4 mb-2">
                                        <button
                                            onClick={() => navigate('/bills-and-receipts')}
                                            className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors duration-200"
                                            title="Back"
                                        >
                                            <ArrowLeftIcon className="h-5 w-5 text-zinc-800 hover:text-green-800" />
                                        </button>
                                    <div>
                                    <h1 className="text-2xl font-bold text-zinc-800">
                                        Outstanding Bills
                                    </h1>
                                    <p className="text-zinc-500">
                                        Manage and track all outstanding bills
                                    </p>
                                    </div>
                                    </div>
                                </header>
                            </div>
                            
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                {/* Filter Button */}
                                <button
                                    onClick={openFilter}
                                    className="flex items-center px-4 py-2 border bg-white border-zinc-300 rounded-lg text-zinc-700 hover:text-green-800 transition gap-2"
                                >
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className='text-zinc-600 group hover:text-green-800 transition-colors'>
                                        <path d="M3.33398 4.99984C3.33398 4.5396 3.70708 4.1665 4.16732 4.1665H15.834C16.2942 4.1665 16.6673 4.5396 16.6673 4.99984C16.6673 5.46007 16.2942 5.83317 15.834 5.83317H4.16732C3.70708 5.83317 3.33398 5.46007 3.33398 4.99984Z" fill="currentColor" />
                                        <path d="M5.00065 9.99984C5.00065 9.5396 5.37375 9.1665 5.83398 9.1665H14.1673C14.6276 9.1665 15.0007 9.5396 15.0007 9.99984C15.0007 10.4601 14.6276 10.8332 14.1673 10.8332H5.83398C5.37375 10.8332 5.00065 10.4601 5.00065 9.99984Z" fill="currentColor" />
                                        <path d="M7.50065 14.1665C7.04041 14.1665 6.66732 14.5396 6.66732 14.9998C6.66732 15.4601 7.04041 15.8332 7.50065 15.8332H12.5007C12.9609 15.8332 13.334 15.4601 13.334 14.9998C13.334 14.5396 12.9609 14.1665 12.5007 14.1665H7.50065Z" fill="currentColor" />
                                    </svg>
                                    Filter
                                </button>

                                {/* Search Bar */}
                                <div className="relative w-full sm:w-64 md:w-72 lg:w-80">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <SearchIcon />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search here..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="w-full pl-10 pr-4 py-2 border bg-white border-zinc-300 rounded-lg focus:ring-green-800 focus:border-green-800 text-sm sm:text-base"
                                    />
                                </div>
                            </div>
                            <div>
                                <button
                                    onClick={handleExport}
                                    className="flex items-center justify-center px-5 py-2 border bg-white border-zinc-300 rounded-lg hover:text-green-800 transition w-full sm:w-auto"
                                >
                                    Export Data
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <OutstandingBillSkeleton />
                        ) : paginatedBills.length === 0 ? (
                            <div className="flex flex-col justify-center items-center mt-20">
                                <h2 className="text-xl mb-1 font-sans">
                                    No bills information available
                                </h2>
                                <p className="text-zinc-400 mt-2 font-light">
                                    There are no outstanding bills to display.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
                                    <table className="w-full min-w-[900px] m-4 table-auto border-collapse">
                                        <thead className="border-b border-zinc-200">
                                            <tr>
                                                <th className="lg:p-6 p-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider w-12 cursor-pointer" onClick={() => handleSort('id')}>
                                                    <div className="flex items-center">
                                                        S/N
                                                    </div>
                                                </th>
                                                <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("billID")}>
                                                    <div className="flex items-center">
                                                        Bill ID
                                                    </div>
                                                </th>
                                                <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("customerName")}>
                                                    <div className="flex items-center">
                                                        Customer Name
                                                    </div>
                                                </th>
                                                <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("address")}>
                                                    <div className="flex items-center">
                                                        Address
                                                    </div>
                                                </th>
                                                <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("amount")}>
                                                    <div className="flex items-center">
                                                        Amount (₦)
                                                    </div>
                                                </th>
                                                <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort("dueDate")}>
                                                    <div className="flex items-center">
                                                        Due Date
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-200">
                                            {paginatedBills.map((bill, index) => (
                                                <tr key={bill.id} className="hover:bg-zinc-50 transition-colors duration-150">
                                                    <td className="lg:p-6 p-3 text-sm text-zinc-500">{(currentPage - 1) * itemsPerPage + index + 1}.</td>
                                                    <td className="lg:p-6 p-3 text-sm text-zinc-900">{bill.billID}</td>
                                                    <td className="lg:p-6 p-3 text-sm text-zinc-700">{bill.customerName}</td>
                                                    <td className="lg:p-6 p-3 text-sm text-zinc-700">{bill.address}</td>
                                                    <td className="lg:p-6 p-3 text-sm text-zinc-700">{bill.amount?.toLocaleString()}</td>
                                                    <td className="lg:p-6 p-3 text-sm text-zinc-700">{bill.dueDate}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {getFilteredData().length > 10 && (
                                <div className="flex items-center justify-between mt-5">
                                    <div className="flex items-center text-sm text-zinc-700">
                                        <span>
                                            Page {currentPage} of {totalPages}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={handlePreviousPage}
                                            disabled={currentPage === 1}
                                            className="px-3 py-2 text-sm font-medium text-zinc-700 bg-zinc-300 border border-zinc-300 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeftIcon className="h-4 w-4" />
                                        </button>

                                        <button
                                            onClick={handleNextPage}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-2 text-sm font-medium text-white bg-green-700 border border-zinc-300 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronRightIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                    </div>

                    <BillDetailsModal bill={selectedBill} onClose={closeModal} />
                    <FilterModal
                        isOpen={isFilterOpen}
                        onClose={closeFilter}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onApply={applyFilters}
                        onClear={clearFilters}
                        customerNames={customerNames}
                        addresses={addresses}
                        statuses={statuses}
                        dueDates={dueDates}
                    />
                </main>
            </div>
        </div>
    );
}