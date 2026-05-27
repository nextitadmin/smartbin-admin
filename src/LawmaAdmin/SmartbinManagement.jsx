import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/apiConfig';
import Sidebar from '../components/LawmaAdmin/Sidebar';
import Topbar from '../components/LawmaAdmin/Topbar';
import SmartbinManagementSkeleton from '../components/SmartbinManagementSkeleton';
import SmartbinProgress from '../components/LawmaAdmin/SmartbinProgress';


// --- Helper Components ---
import {  DeliveredIcon, TwoUsersIcon, WalletIcon, ChevronLeftIcon, ChevronRightIcon } from '../components/icons';

// Table Icons
const EllipsisVerticalIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
);

const SortIcon = ({ direction }) => (
    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={direction === 'asc' ? "M5 15l7-7 7 7" : direction === 'desc' ? "M19 9l-7 7-7-7" : "M8 9l4-4 4 4m0 6l-4 4-4-4"} />
    </svg>
);

const MagnifyingGlassIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const LoadingSpinnerIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

// StatusBadge component is now imported from components/StatusBadge.jsx

// Custom Tooltip for the Bar Chart
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const value = payload[0].value;
        const fullName = (payload[0] && payload[0].payload && payload[0].payload.fullName) ? payload[0].payload.fullName : label;
        const formattedValue = value >= 1000000 
            ? `${(value / 1000000).toFixed(1)}M` 
            : value >= 1000 
            ? `${(value / 1000).toFixed(0)}k` 
            : value.toString();
        
        return (
            <div className="bg-zinc-800 text-white p-3 rounded-lg shadow-lg">
                <p className="font-semibold">{fullName}</p>
                <p className="text-sm text-zinc-300">{`${formattedValue} users (${value.toLocaleString()} total)`}</p>
            </div>
        );
    }
    return null;
};

// Custom XAxis tick to show full LGA name on hover via native title
const CustomizedXAxisTick = (props) => {
    const { x, y, payload } = props;
    const label = payload && typeof payload.value !== 'undefined' ? payload.value : '';
    const title = (payload && payload.payload && payload.payload.fullName) ? payload.payload.fullName : label;
    return (
        <g transform={`translate(${x},${y})`}>
            <text title={title} dy={16} textAnchor="middle" fill="#525252" style={{ fontSize: 12 }}>
                {label}
            </text>
        </g>
    );
};


// --- Main Component ---
export default function SmartbinManagement() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [requestsLoading, setRequestsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [showTrackApplication, setShowTrackApplication] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [applicationDetails, setApplicationDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [showProgressPage, setShowProgressPage] = useState(false);
    const [progressOrderId, setProgressOrderId] = useState(null);
    
    // Table state
    const [requests, setRequests] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [serverPaging, setServerPaging] = useState(null);
    const [actionMenuOpen, setActionMenuOpen] = useState(null);
    const [rowActionModal, setRowActionModal] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const modalRef = useRef();
    const isInitialMount = useRef(true);
    
    // Search and export state
    const [searchTerm, setSearchTerm] = useState('');
    const [isExporting, setIsExporting] = useState(false);
    
    // Filter state
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        customerType: '',
        dateFrom: '',
        dateTo: ''
    });

    // Overview filter state for year and binType
    const [overviewYear, setOverviewYear] = useState(new Date().getFullYear().toString());
    const [overviewBinType, setOverviewBinType] = useState('smart');

    // --- TABLE HELPER FUNCTIONS ---
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleRowActionClick = (requestId, event) => {
        event.stopPropagation();
        const buttonRect = event.currentTarget.getBoundingClientRect();
        setDropdownPosition({
            // Use viewport coordinates since portal uses fixed positioning
            top: buttonRect.bottom + 8,
            left: buttonRect.right - 192 // 192px aligns with w-48
        });
        if (actionMenuOpen === requestId && rowActionModal) {
            setRowActionModal(false);
            setActionMenuOpen(null);
        } else {
            setActionMenuOpen(requestId);
            setRowActionModal(true);
        }
    };

    const closeActionMenu = () => {
        setActionMenuOpen(null);
        setRowActionModal(false);
    };

    const openTrackApplication = (request) => {
        setSelectedRequest(request);
        setProgressOrderId(request.id);
        setShowProgressPage(true);
        closeActionMenu();
    };

    const openTrackApplicationModal = async (request) => {
        setSelectedRequest(request);
        setShowTrackApplication(true);
        setDetailsLoading(true);
        setApplicationDetails(null);
        closeActionMenu();
        
        // Fetch detailed application information
        try {
            const details = await fetchApplicationDetails(request.id);
            setApplicationDetails(details);
        } catch (error) {
            console.error("Failed to fetch application details:", error);
        } finally {
            setDetailsLoading(false);
        }
    };

    const closeTrackApplication = () => {
        setShowTrackApplication(false);
        setSelectedRequest(null);
        setApplicationDetails(null);
        setDetailsLoading(false);
    };

    const closeProgressPage = () => {
        setShowProgressPage(false);
        setProgressOrderId(null);
        setSelectedRequest(null);
    };

    // Filter functions
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        setCurrentPage(1);
        setShowFilter(false);
        // Refetch data with new filters
        fetchSmartbinRequests(1);
    };

    const clearFilters = () => {
        setFilters({
            status: '',
            customerType: '',
            dateFrom: '',
            dateTo: ''
        });
        setCurrentPage(1);
        // Refetch data without filters
        fetchSmartbinRequests(1);
    };

    // Export functionality
    const handleExportData = async () => {
        setIsExporting(true);
        try {
            // Create CSV content
            const headers = ['S/N', 'Name', 'Customer type', 'Date', 'Address', 'Status'];
            const csvContent = [
                headers.join(','),
                ...filteredRequests.map((request, index) => [
                    index + 1,
                    `"${request.name}"`,
                    `"${request.customerType || 'Individual'}"`,
                    `"${request.date}"`,
                    `"${request.address}"`,
                    `"${request.status}"`
                ].join(','))
            ].join('\n');

            // Create and download file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `smartbin-requests-${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error exporting data:', error);
        } finally {
            setIsExporting(false);
        }
    };

    // Close dropdown portal and filter when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (rowActionModal && modalRef.current && !modalRef.current.contains(event.target)) {
                closeActionMenu();
            }
            if (showFilter && !event.target.closest('.relative')) {
                setShowFilter(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [rowActionModal, showFilter]);

    // Filter requests based on search term and filters
    const filteredRequests = requests.filter(request => {
        // Search filter
        const searchMatch = !searchTerm || (
            request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (request.customerType && request.customerType.toLowerCase().includes(searchTerm.toLowerCase())) ||
            request.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.lga.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Status filter
        const statusMatch = !filters.status || request.status === filters.status;

        // Customer type filter
        const customerTypeMatch = !filters.customerType || request.customerType === filters.customerType;

        // Date range filter
        const dateMatch = !filters.dateFrom || !filters.dateTo || (
            request.date >= filters.dateFrom && request.date <= filters.dateTo
        );

        return searchMatch && statusMatch && customerTypeMatch && dateMatch;
    });

    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const totalPages = serverPaging && serverPaging.pages ? serverPaging.pages : Math.ceil(filteredRequests.length / itemsPerPage);

    // Sort and paginate requests
    const sortedRequests = [...filteredRequests].sort((a, b) => {
        if (!sortConfig.key) return 0;
        
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const currentPageItems = serverPaging && serverPaging.pages ? sortedRequests : sortedRequests.slice(startIndex, endIndex);

    // Reset to first page when search term or filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filters]);

    // Debounced search - refetch when searchTerm changes
    useEffect(() => {
        if (!isInitialMount.current) {
            const searchTimeout = setTimeout(() => {
                fetchSmartbinRequests(1);
            }, 500); // 500ms debounce

            return () => clearTimeout(searchTimeout);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    // --- API LOGIC ---
    
    // Fetch smartbin overview data (stats, charts, etc.)
    const fetchSmartbinOverview = useCallback(async () => {
        try {
            const response = await api.get('lawma/smartbins/lawma-admin/overview', {
                params: {
                    year: overviewYear,
                    binType: overviewBinType
                }
            });

            // Map smartbinUsersByLGA -> userDistribution for chart
            const lgaArray = Array.isArray(response.data.smartbinUsersByLGA)
                ? response.data.smartbinUsersByLGA
                : [];

            const toAbbr = (name) => {
                const cleaned = String(name || 'UNK').replace(/[^A-Za-z]/g, '');
                return cleaned.slice(0, 3).toUpperCase() || 'UNK';
            };

            let userDistribution = lgaArray
                .map((item) => ({
                    name: toAbbr(item.lgaName),
                    fullName: item.lgaName || 'Unknown',
                    users: Number(item.count) || 0,
                }))
                .sort((a, b) => b.users - a.users);

            // Use actual data from API with fallbacks
            const transformedData = {
                totalUsers: Number(response.data.totalSmartbinUsers) || 0,
                smartBinRequests: Number(response.data.smartbinRequests) || 0,
                smartBinsDelivered: Number(response.data.deliveredSmartbins) || 0,
                userDistribution,
                // This endpoint doesn't provide recent deliveries; keep empty for now
                recentlyDelivered: [],
            };

            setStats(transformedData);

        } catch (error) {
            console.error('Error fetching smartbin overview:', error);
            // Fallback to mock data in case of error
            // const mockData = {
            //     totalUsers: 5000000,
            //     smartBinRequests: 3000,
            //     smartBinsDelivered: 400,
            //     userDistribution: [
            //         { name: 'AGL', users: 10000 },
            //         { name: 'KTU', users: 25000 },
            //         { name: 'FST', users: 28000 },
            //         { name: 'APP', users: 19000 },
            //         { name: 'BDG', users: 32000 },
            //         { name: 'EPE', users: 15000 },
            //         { name: 'EKY', users: 58000 },
            //         { name: 'AKD', users: 62000 },
            //         { name: 'FKJ', users: 78000 },
            //         { name: 'KJA', users: 32000 },
            //         { name: 'KRD', users: 14000 },
            //         { name: 'KSF', users: 70000 }, // This is the highlighted bar
            //         { name: 'AAA', users: 45000 },
            //         { name: 'LND', users: 47000 },
            //         { name: 'MUS', users: 30000 },
            //         { name: 'LSD', users: 52000 },
            //         { name: 'SMK', users: 22000 },
            //         { name: 'LSR', users: 42000 },
            //         { name: 'GGE', users: 53000 },
            //     ],
            //     recentlyDelivered: [
            //         { sn: 1, date: '21-01-25', binType: 'Smart', binId: '#OD12589048', address: '23, Association Dr, Dolphin estate...' },
            //         { sn: 2, date: '22-01-25', binType: 'Non smart', binId: '#OD12589048', address: '23, Association Dr, Dolphin estate...' },
            //         { sn: 3, date: '24-01-25', binType: 'Smart', binId: '#OD12589048', address: '23, Association Dr, Dolphin estate...' },
            //     ]
            // };
            
            // setStats(mockData);
            
        }
    }, [overviewYear, overviewBinType]);

    

    // Fetch smartbin requests data (table data)
    const fetchSmartbinRequests = async (page = 1) => {
        try {
            // Build params object, only including non-empty values
            const params = {
                page,
                size: itemsPerPage,
            };
            
            if (searchTerm) {
                params.search = searchTerm;
            }
            if (filters.customerType) {
                params.customerType = filters.customerType;
            }
            if (filters.status) {
                params.status = filters.status;
            }
            if (filters.dateFrom) {
                params.dateFrom = filters.dateFrom;
            }
            if (filters.dateTo) {
                params.dateTo = filters.dateTo;
            }
            
            const smartbinRequests = await api.get('lawma/smartbins', {
                params
            });
                    
            // Transform records to requests format
            const requestsData = smartbinRequests.data.records && Array.isArray(smartbinRequests.data.records) 
                ? smartbinRequests.data.records.map((record, index) => {
                    return {
                        id: record.id || index,
                        name: record.name || 'N/A',
                        customerType: record.customerType || 'Unknown',
                        email: record.email || 'N/A',
                        phone: record.phone || 'N/A',
                        address: record.address || 'N/A',
                        status: record.status || 'pending',
                        date: record.date ? new Date(record.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-') : 'N/A',
                        approvedDate: record.approvedDate ? new Date(record.approvedDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-') : null,
                        deliveredDate: record.deliveredDate ? new Date(record.deliveredDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-') : null,
                        deliveredBy: record.deliveredBy || null,
                        lga: record.lga || 'Unknown',

                    };
                })
                : [];
            
            setRequests(requestsData);
            const paging = smartbinRequests.data && smartbinRequests.data.paging ? smartbinRequests.data.paging : null;
            if (paging) {
                setServerPaging(paging);
                setCurrentPage(paging.page || 1);
            } else {
                setServerPaging(null);
            }
            
        } catch (error) {
            console.error('Error fetching smartbin requests:', error);
            // Fallback to mock data in case of error
            const mockRequests = [
                { id: 1, name: 'John Doe', customerType: 'Resident', email: 'john@example.com', phone: '+234 801 234 5678', address: '123 Main St, Lagos', status: 'pending', date: '21-01-25', lga: 'Ikeja' },
                { id: 2, name: 'Jane Smith', customerType: 'Corporate', email: 'jane@example.com', phone: '+234 802 345 6789', address: '456 Oak Ave, Lagos', status: 'approved', date: '22-01-25', approvedDate: '23-01-25', lga: 'Victoria Island' },
                { id: 3, name: 'Mike Johnson', customerType: 'Facility Manager', email: 'mike@example.com', phone: '+234 803 456 7890', address: '789 Pine St, Lagos', status: 'delivered', date: '23-01-25', deliveredDate: '25-01-25', deliveredBy: 'Fred Chukwuemeka', lga: 'Surulere' },
                { id: 4, name: 'Sarah Wilson', customerType: 'Resident', email: 'sarah@example.com', phone: '+234 804 567 8901', address: '321 Elm St, Lagos', status: 'pending', date: '24-01-25', lga: 'Ikoyi' },
                { id: 5, name: 'David Brown', customerType: 'Corporate', email: 'david@example.com', phone: '+234 805 678 9012', address: '654 Maple Ave, Lagos', status: 'pending', date: '25-01-25', lga: 'Lekki' },
            ];
            
            setRequests(mockRequests);
            
        }
    };

    // Fetch application details for tracking
    const fetchApplicationDetails = async (id) => {
        try {
            const response = await api.get(`lawma/smartbins/application-details?applicationId=${id}`);
            
            // Transform the response to get the application details
            const applicationDetails = response.data.records && Array.isArray(response.data.records) && response.data.records.length > 0
                ? response.data.records[0] // Get the first (and should be only) record
                : response.data;
            
            // Transform the record to match our expected format
            const transformedDetails = {
                id: applicationDetails.id,
                name: applicationDetails.name || 'N/A',
                customerType: applicationDetails.customerType || 'Unknown',
                email: applicationDetails.email || applicationDetails.emailAddress || 'N/A',
                phone: applicationDetails.phone || applicationDetails.phoneNumber || 'N/A',
                address: applicationDetails.address || 'N/A',
                status: applicationDetails.status || 'pending',
                date: applicationDetails.date ? new Date(applicationDetails.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-') : 'N/A',
                approvedDate: applicationDetails.approvedDate ? new Date(applicationDetails.approvedDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-') : null,
                deliveredDate: applicationDetails.deliveredDate || applicationDetails.deliveredOn ? new Date(applicationDetails.deliveredDate || applicationDetails.deliveredOn).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '-') : null,
                deliveredBy: applicationDetails.deliveredBy || applicationDetails.assignedTo || null,
                lga: applicationDetails.lga || applicationDetails.localGovernmentArea || 'Unknown',
                binType: applicationDetails.binType,
                notes: applicationDetails.notes || applicationDetails.description || null
            };
            
            return transformedDetails;
        } catch (error) {
            console.error("Error fetching application details:", error);
            throw error;
        }
    };

   

    // Load data on component mount
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([
                fetchSmartbinOverview(),
                fetchSmartbinRequests(1)
            ]);
            setLoading(false);
            isInitialMount.current = false;
        };

        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Refetch overview data when year or binType changes (but not on initial mount)
    useEffect(() => {
        // Only refetch if component has already loaded once (skip initial mount)
        if (!isInitialMount.current) {
            fetchSmartbinOverview();
        }
    }, [fetchSmartbinOverview]);

    if (loading) {
        return <SmartbinManagementSkeleton />;
    }

    // --- RENDER LOGIC ---
    // This is for the smartbin progress page
    if (showProgressPage) {
        return (
            <SmartbinProgress 
                onClose={closeProgressPage}
                orderData={selectedRequest}
            />
        );
    }
    // Status color function
    const statusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'border-yellow-400 text-yellow-800 bg-yellow-50';
            case 'approved':
                return 'border-blue-400 text-blue-800 bg-blue-50';
            case 'delivered':
                return 'border-green-400 text-green-800 bg-green-50';
            case 'rejected':
                return 'border-red-400 text-red-800 bg-red-50';
            default:
                return 'border-gray-400 text-gray-800 bg-gray-50';
        }
    };

    const StatusBadge = ({ status }) => {
        return (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${statusColor(status)}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="flex min-h-screen bg-zinc-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-8xl mx-auto">
                        {/* Header */}
                        <header className="mb-8">
                            <h1 className="md:text-3xl text-2xl font-bold text-zinc-800">Smart Bin Management</h1>
                            <p className="text-zinc-500 mt-1">Smartbins overview and requests</p>
                        </header>
                         {/* Active selection */}
                         <div className='inline-flex gap-7 text-lg mb-7 border-b border-b-2 border-zinc-200'>
                                <button
                                    type="button"
                                    className={`relative pb-2 -mb-[1.5px] transition-colors duration-300 ease-out
                        after:content-["\""] after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-full after:bg-green-700
                        after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out
                        ${activeTab === 'overview'
                                            ? 'text-green-700 after:scale-x-100'
                                            : 'text-zinc-500 hover:text-zinc-700 after:scale-x-0'
                                        }`}
                                    onClick={() => setActiveTab('overview')}
                                >
                                    Overview
                                </button>
                                <button
                                    type="button"
                                    className={`relative pb-2 -mb-[1.5px] transition-colors duration-300 ease-out
                        after:content-["\""] after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-full after:bg-green-700
                        after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out
                        ${activeTab === 'requests'
                                            ? 'text-green-700 after:scale-x-100'
                                            : 'text-zinc-500 hover:text-zinc-700 after:scale-x-0'
                                        }`}
                                    onClick={() => setActiveTab('requests')}
                                >
                                    Requests
                                </button>
                            </div>

                        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                            {activeTab === 'overview' && (
                                <>
                                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Info Cards */}
                                <div className="col-span-1 h-full">
                                    <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-start space-y-2 h-full">
                                        <div className="p-1 rounded-full">
                                            <TwoUsersIcon />
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <h4 className="text-zinc-500 sm:text-sm">Total SmartBin users</h4>
                                            <p className="text-3xl font-bold text-zinc-800">{stats.totalUsers?.toLocaleString() || '0'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-1 h-full">
                                    <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-start space-y-2 h-full">
                                        <div className="p-3 rounded-full bg-green-800">
                                            <WalletIcon />
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <h4 className="text-zinc-500 sm:text-sm">Smart Bin requests</h4>
                                            <p className="text-3xl font-bold text-zinc-800">{stats.smartBinRequests?.toLocaleString() || '0'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-1 h-full">
                                    <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-start space-y-2 h-full">
                                        <div className="p-3 rounded-full">
                                            <DeliveredIcon />
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <h4 className="text-zinc-500 sm:text-sm">Smart Bin Delivered</h4>
                                            <p className="text-3xl font-bold text-zinc-800">{stats.smartBinsDelivered?.toLocaleString() || '0'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Chart Section */}
                            <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                                    <div>
                                        <h3 className="text-zinc-500">Total SmartBin Users</h3>
                                        <p className="text-4xl font-bold text-zinc-800">{stats.totalUsers?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</p>
                                    </div>
                                    <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                                        <select 
                                            className="bg-zinc-100 border-none rounded-md px-3 py-2 text-sm font-medium text-zinc-700 focus:ring-2 focus:ring-green-500"
                                            value={overviewBinType}
                                            onChange={(e) => setOverviewBinType(e.target.value)}
                                        >
                                            <option value="smart">Smart Bin</option>
                                            <option value="non_smart">Non-Smart Bin</option>
                                        </select>
                                        <select 
                                            className="bg-zinc-100 border-none rounded-md px-3 py-2 text-sm font-medium text-zinc-700 focus:ring-2 focus:ring-green-500"
                                            value={overviewYear}
                                            onChange={(e) => setOverviewYear(e.target.value)}
                                        >
                                            <option value={new Date().getFullYear().toString()}>This year</option>
                                            <option value={(new Date().getFullYear() - 1).toString()}>Last year</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Chart */}
                                <div className="w-full h-80">
                                    {(() => {
                                        if (stats?.userDistribution && stats.userDistribution.length > 0) {
                                            const maxValue = Math.max(...stats.userDistribution.map(item => item.users));
                                            
                                            return (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={stats.userDistribution} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                        <XAxis dataKey="name" tick={<CustomizedXAxisTick />} axisLine={false} tickLine={false} />
                                                        <YAxis
                                                            tickFormatter={(tick) => {
                                                                if (tick >= 1000000) {
                                                                    return `${(tick / 1000000).toFixed(1)}M`;
                                                                } else if (tick >= 1000) {
                                                                    return `${(tick / 1000).toFixed(0)}k`;
                                                                }
                                                                return tick.toString();
                                                            }}
                                                            tick={{ fontSize: 12 }}
                                                            axisLine={false}
                                                            tickLine={false}
                                                            domain={[0, maxValue * 1.2]}
                                                            allowDataOverflow={false}
                                                        />
                                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(230, 240, 230, 0.5)' }} />
                                                        <Bar dataKey="users" radius={[4, 4, 0, 0]}>
                                                            {stats.userDistribution.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill="#15803d" />
                                                            ))}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            );
                                        } else {
                                            return (
                                                <div className="flex items-center justify-center h-full text-zinc-500">
                                                    <p>No data available for chart</p>
                                                </div>
                                            );
                                        }
                                    })()}
                                </div>
                                <p className="sm:text-center text-sm text-zinc-500 mt-2">User Distribution by LGA</p>
                            </div>
                                </>
                            )}

                            {/* Info Cards and Recent Deliveries */}
                            


                            {/* Table Section - Only show when requests tab is active */}
                            {activeTab === 'requests' && (
                                <>
                                {requestsLoading ? (
                                    <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm overflow-x-auto">
                                        <div className="p-6">
                                            <div className="animate-pulse">
                                                <div className="w-full min-w-[900px] table-auto border-collapse">
                                                    <div className="border-b border-zinc-200">
                                                        <div className="flex space-x-6 py-4">
                                                            {[...Array(7)].map((_, index) => (
                                                                <div key={index} className="h-4 bg-zinc-200 rounded w-20"></div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="divide-y divide-zinc-200">
                                                        {[...Array(5)].map((_, index) => (
                                                            <div key={index} className="flex space-x-6 py-4">
                                                                <div className="h-4 bg-zinc-200 rounded w-8"></div>
                                                                <div className="h-4 bg-zinc-200 rounded w-32"></div>
                                                                <div className="h-4 bg-zinc-200 rounded w-24"></div>
                                                                <div className="h-4 bg-zinc-200 rounded w-20"></div>
                                                                <div className="h-4 bg-zinc-200 rounded w-48"></div>
                                                                <div className="h-4 bg-zinc-200 rounded w-16"></div>
                                                                <div className="h-4 bg-zinc-200 rounded w-8"></div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                    <div className="lg:col-span-3 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                                <div className="relative flex-grow w-full md:w-auto">
                                    <input
                                        type="text"
                                        placeholder="Search members"
                                        className="lg:w-1/3 p-2 pl-10 border border-zinc-300 bg-white rounded-xl focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700 w-full"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                                </div>

                                {/* Filter and Export */}
                                <div className="flex flex-col md:flex-row gap-2 flex-shrink-0">

                                <div className="relative">
                                    <button 
                                        onClick={() => setShowFilter(!showFilter)}
                                        className="px-4 py-3 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-xl hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition w-full"
                                    >
                                        Filter
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    
                                    {showFilter && (
                                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-zinc-200 z-50 p-4">
                                            <div className="flex justify-end items-center mb-2">
                                                
                                                <button
                                                    onClick={() => setShowFilter(false)}
                                                    className="text-zinc-500 hover:text-zinc-700 transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-zinc-700 mb-2">Status</label>
                                                    <select
                                                        value={filters.status}
                                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                                        className="w-full p-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                    >
                                                        <option value="">All Status</option>
                                                        <option value="pending">Pending</option>
                                                        <option value="approved">Approved</option>
                                                        <option value="delivered">Delivered</option>
                                                        {/* <option value="rejected">Rejected</option> */}
                                                    </select>
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-zinc-700 mb-2">Customer Type</label>
                                                    <select
                                                        value={filters.customerType}
                                                        onChange={(e) => handleFilterChange('customerType', e.target.value)}
                                                        className="w-full p-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                    >
                                                        <option value="">All Types</option>
                                                        <option value="Resident">Resident</option>
                                                        <option value="Corporate">Corporate</option>
                                                        <option value="Facility">Facility Manager</option>
                                                    </select>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="block text-sm font-medium text-zinc-700 mb-2">From Date</label>
                                                        <input
                                                            type="date"
                                                            value={filters.dateFrom}
                                                            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                                                            className="w-full p-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-zinc-700 mb-2">To Date</label>
                                                        <input
                                                            type="date"
                                                            value={filters.dateTo}
                                                            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                                                            className="w-full p-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                        />
                                                    </div>
                                                </div>
                                                
                                                <div className="flex gap-2 pt-2">
                                                    <button
                                                        onClick={applyFilters}
                                                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                                    >
                                                        Apply
                                                    </button>
                                                    <button
                                                        onClick={clearFilters}
                                                        className="flex-1 px-4 py-2 bg-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-300 transition"
                                                    >
                                                        Clear
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={handleExportData}
                                    disabled={isExporting}
                                    className="px-4 py-3 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-xl hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition"
                                >
                                    {isExporting ? (
                                        <>
                                            <LoadingSpinnerIcon className="h-4 w-4 animate-spin" />
                                            Exporting...
                                        </>
                                    ) : (
                                        <>Export  data</>
                                    )}
                                </button>
                                </div>
                            </div>
                            
                                <div className="lg:col-span-3 bg-white border border-zinc-200 rounded-xl overflow-x-auto mt-2">
                                    <div className="p-0">
                                        <table className="w-full table-auto border-collapse">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer w-12" onClick={() => handleSort('id')}>
                                                        <div className="flex items-center">
                                                            SN
                                                            <SortIcon direction={sortConfig.key === 'id' ? sortConfig.direction : null} />
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer" onClick={() => handleSort('name')}>
                                                        <div className="flex items-center">
                                                            Name
                                                            <SortIcon direction={sortConfig.key === 'name' ? sortConfig.direction : null} />
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer w-48" onClick={() => handleSort('customerType')}>
                                                        <div className="flex items-center">
                                                            Customer type
                                                            <SortIcon direction={sortConfig.key === 'customerType' ? sortConfig.direction : null} />
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer w-24" onClick={() => handleSort('date')}>
                                                        <div className="flex items-center">
                                                            Date
                                                            <SortIcon direction={sortConfig.key === 'date' ? sortConfig.direction : null} />
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer" onClick={() => handleSort('address')}>
                                                        <div className="flex items-center">
                                                            Address
                                                            <SortIcon direction={sortConfig.key === 'address' ? sortConfig.direction : null} />
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer" onClick={() => handleSort('status')}>
                                                        <div className="flex items-center">
                                                            Status
                                                            <SortIcon direction={sortConfig.key === 'status' ? sortConfig.direction : null} />
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentPageItems.map((request, index) => (
                                                    <tr key={request.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                                                        <td className="px-4 py-3 text-sm text-zinc-700 whitespace-nowrap">{startIndex + index + 1}.</td>
                                                        <td className="px-4 py-3 text-sm text-zinc-900 whitespace-nowrap">{request.name}</td>
                                                        <td className="px-4 py-3 text-sm text-zinc-700 whitespace-nowrap">{request.customerType}</td>
                                                        <td className="px-4 py-3 text-sm text-zinc-700 whitespace-nowrap">{request.date}</td>
                                                        <td className="px-4 py-3 text-sm text-zinc-700 whitespace-nowrap">{request.address}</td>
                                                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                                                            <StatusBadge status={request.status} />
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="relative">
                                                                <button
                                                                    onClick={(e) => handleRowActionClick(request.id, e)}
                                                                    type="button"
                                                                    className="p-1 text-zinc-500 hover:text-zinc-700"
                                                                >
                                                                    <EllipsisVerticalIcon className="w-5 h-5" />
                                                                </button>
                                                                {/* Dropdown rendered via portal below */}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        
                                    </div>
                                </div>
                                {/* Pagination - outside the table container */}
                                {totalPages > 1 && (
                                    <div className="lg:col-span-3 flex items-center justify-between w-full">
                                        <div className="flex items-center text-sm text-zinc-700">
                                            <span>
                                                Page {serverPaging && serverPaging.pages ? (serverPaging.page || 1) : currentPage} of {totalPages} total results {serverPaging?.total || 0}
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => serverPaging && serverPaging.pages ? fetchSmartbinRequests(Math.max((serverPaging.page || 1) - 1, 1)) : setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={(serverPaging && serverPaging.pages ? (serverPaging.page || 1) === 1 : currentPage === 1)}
                                                className="px-3 py-2 text-sm font-medium text-zinc-700 bg-zinc-300 border border-zinc-300 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ChevronLeftIcon className="h-4 w-4" />
                                            </button>

                                            <button
                                                onClick={() => serverPaging && serverPaging.pages ? fetchSmartbinRequests(Math.min((serverPaging.page || 1) + 1, totalPages)) : setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={(serverPaging && serverPaging.pages ? (serverPaging.page || 1) === totalPages : currentPage === totalPages)}
                                                className="px-3 py-2 text-sm font-medium text-white bg-green-700 border border-zinc-300 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ChevronRightIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                </>
                                )}
                                </>
                            )}

                            {showTrackApplication && (
                                <>
                                    <div onClick={closeTrackApplication} className="fixed inset-0 bg-black/30 z-40" style={{ left: '256px' }}></div>
                                    <aside className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-out" style={{ right: '0px' }}>
                                        <div className="flex items-center justify-between p-4 border-b border-zinc-200">
                                            <h3 className="text-lg font-semibold text-zinc-800">Application details</h3>
                                            <button onClick={closeTrackApplication} className="text-zinc-500 hover:text-zinc-700">✕</button>
                                        </div>
                                        <div className="p-6 space-y-4 overflow-y-auto h-full">
                                            {detailsLoading ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                                    <span className="ml-2 text-zinc-600">Loading application details...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex justify-between items-center py-2">
                                                        <p className="text-xs uppercase text-zinc-500">Order ID</p>
                                                        <p className="text-sm font-medium text-zinc-800">{applicationDetails?.id || selectedRequest?.id || 'N/A'}</p>
                                                    </div>
                                                    <div className="flex justify-between items-center py-2">
                                                        <p className="text-xs uppercase text-zinc-500">Date</p>
                                                        <p className="text-sm font-medium text-zinc-800">{applicationDetails?.date || selectedRequest?.date || 'N/A'}</p>
                                                    </div>
                                                    <div className="flex justify-between items-center py-2">
                                                        <p className="text-xs uppercase text-zinc-500">Name</p>
                                                        <p className="text-sm font-medium text-zinc-800 text-right max-w-[200px]">{applicationDetails?.name || selectedRequest?.name || 'N/A'}</p>
                                                    </div>
                                                    <div className="flex justify-between items-center py-2">
                                                        <p className="text-xs uppercase text-zinc-500">Customer type</p>
                                                        <p className="text-sm font-medium text-zinc-800">{applicationDetails?.customerType || selectedRequest?.customerType || 'N/A'}</p>
                                                    </div>
                                                    <div className="flex justify-between items-center py-2">
                                                        <p className="text-xs uppercase text-zinc-500">Phone number</p>
                                                        <p className="text-sm font-medium text-zinc-800">{applicationDetails?.phone || selectedRequest?.phone || 'N/A'}</p>
                                                    </div>
                                                    <div className="flex justify-between items-start py-2">
                                                        <p className="text-xs uppercase text-zinc-500">Email address</p>
                                                        <p className="text-sm font-medium text-zinc-800 text-right max-w-[200px] break-words">{applicationDetails?.email || selectedRequest?.email || 'N/A'}</p>
                                                    </div>
                                                    <div className="flex justify-between items-start py-2">
                                                        <p className="text-xs uppercase text-zinc-500">Address</p>
                                                        <p className="text-sm font-medium text-zinc-800 text-right max-w-[200px] break-words">{applicationDetails?.address || selectedRequest?.address || 'N/A'}</p>
                                                    </div>
                                                    <div className="flex justify-between items-center py-2">
                                                        <p className="text-xs uppercase text-zinc-500">Status</p>
                                                        <div><StatusBadge status={applicationDetails?.status || selectedRequest?.status} /></div>
                                                    </div>
                                                    {(applicationDetails?.status || selectedRequest?.status) === 'approved' && (
                                                        <div className="flex justify-between items-center py-2">
                                                            <p className="text-xs uppercase text-zinc-500">Approved date</p>
                                                            <p className="text-sm font-medium text-zinc-800">{applicationDetails?.approvedDate || selectedRequest?.approvedDate || 'N/A'}</p>
                                                        </div>
                                                    )}
                                                    {(applicationDetails?.status || selectedRequest?.status) === 'delivered' && (
                                                        <>
                                                            <div className="flex justify-between items-center py-2">
                                                                <p className="text-xs uppercase text-zinc-500">Delivered on</p>
                                                                <p className="text-sm font-medium text-zinc-800">{applicationDetails?.deliveredDate || selectedRequest?.deliveredDate || 'N/A'}</p>
                                                            </div>
                                                            <div className="flex justify-between items-center py-2">
                                                                <p className="text-xs uppercase text-zinc-500">Delivered by</p>
                                                                <p className="text-sm font-medium text-zinc-800">{applicationDetails?.deliveredBy || selectedRequest?.deliveredBy || 'N/A'}</p>
                                                            </div>
                                                        </>
                                                    )}
                                                    {/* Additional details from API */}
                                                    {applicationDetails && (
                                                        <>
                                                            {applicationDetails.lga && (
                                                                <div className="flex justify-between items-center py-2">
                                                                    <p className="text-xs uppercase text-zinc-500">LGA</p>
                                                                    <p className="text-sm font-medium text-zinc-800">{applicationDetails.lga}</p>
                                                                </div>
                                                            )}
                                                            {applicationDetails.binType && (
                                                                <div className="flex justify-between items-center py-2">
                                                                    <p className="text-xs uppercase text-zinc-500">Bin Type</p>
                                                                    <p className="text-sm font-medium text-zinc-800">{applicationDetails.binType}</p>
                                                                </div>
                                                            )}
                                                            {applicationDetails.notes && (
                                                                <div className="flex justify-between items-start py-2">
                                                                    <p className="text-xs uppercase text-zinc-500">Notes</p>
                                                                    <p className="text-sm font-medium text-zinc-800 text-right max-w-[200px] break-words">{applicationDetails.notes}</p>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </aside>
                                </>
                            )}

                            {/* Portal-based dropdown for row actions */}
                            {rowActionModal && actionMenuOpen !== null && createPortal(
                                (
                                    <div
                                        ref={modalRef}
                                        className="fixed z-[9999] bg-white rounded-lg shadow-lg border border-zinc-200 py-1 min-w-[192px]"
                                        style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
                                    >
                                        <button 
                                            onClick={() => {
                                                const req = currentPageItems.find(r => r.id === actionMenuOpen);
                                                if (req) openTrackApplication(req);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors duration-150"
                                        >
                                            View Details
                                        </button>
                                        <button 
                                            onClick={() => {
                                                const req = currentPageItems.find(r => r.id === actionMenuOpen);
                                                if (req) openTrackApplicationModal(req);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors duration-150"
                                        >
                                            Track Application
                                        </button>
                                    </div>
                                ),
                                document.body
                            )}

                            
                        </main>
                    </div>
                </main>
            </div>
        </div>
    );
}
