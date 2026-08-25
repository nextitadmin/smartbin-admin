import React, { useState, useEffect, useMemo, useRef } from 'react';
import Sidebar from '../components/SuperAdmin/Sidebar';
import Topbar from '../components/SuperAdmin/Topbar';
import api from '../api/apiConfig';
import { useNavigate } from 'react-router-dom';
import SkeletonLoader from '../components/SkeletonLoader';
import GenerateReportModal from '../components/SuperAdmin/GenerateReport';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon,
    ChevronUpDownIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    XMarkIcon,
    DotsVerticalIcon as EllipsisVerticalIcon,
    CheckCircleIconSolid,
    ExclamationTriangleIconSolid,
    ChevronLeftIcon,
    ChevronRightIcon
} from '../components/icons';

// Main Component
const ReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const navigate = useNavigate();

    const [notification, setNotification] = useState({ message: '', type: '', visible: false });

    // API Query Filter parameters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterReportType, setFilterReportType] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    const [sortConfig, setSortConfig] = useState({ key: 'generation_date', direction: 'descending' });

    const showNotification = (message, type) => {
        setNotification({ message, type, visible: true });
        setTimeout(() => {
            setNotification({ message: '', type: '', visible: false });
        }, 3000);
    };

    const mapReportItem = (item, index, page, limitValue) => {
        const offset = (page - 1) * limitValue + index + 1;
        
        let type = item?.type ?? item?.report_type ?? item?.reportType ?? 'revenue';
        const typeMapping = {
            'revenue': 'Revenue report',
            'payment-history': 'Payment history',
            'waste-pickup': 'Waste pickup',
            'waste-disposed': 'Waste disposed',
            'smartbin-request': 'Bin request lifecycle',
            'smartbin-delivered': 'Bin delivered report',
            'user-registration': 'User registration',
            'unpaid-bills': 'Unpaid bills'
        };
        const reportTypeLabel = typeMapping[type] ?? type;

        const genDate = item?.generatedAt ?? item?.createdAt ?? item?.generation_date ?? item?.generationDate;
        const formattedDate = genDate 
            ? new Date(genDate).toLocaleString('en-US', { 
                month: '2-digit', 
                day: '2-digit', 
                year: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false
              }).replace(',', '')
            : 'N/A';

        let period = item?.period;
        if (!period && item?.filters) {
            const start = item.filters.startDate ?? item.filters.startdate;
            const end = item.filters.endDate ?? item.filters.enddate;
            if (start && end) {
                period = `${new Date(start).toLocaleDateString('en-US', {month:'short', day:'2-digit'})} → ${new Date(end).toLocaleDateString('en-US', {month:'short', day:'2-digit'})}`;
            }
        }
        if (!period) period = 'N/A';

        const generatedBy = item?.generatedBy ?? item?.generated_by ?? item?.user?.email ?? item?.user?.fullName ?? 'System';
        const method = item?.method ?? item?.report_method ?? item?.reportMethod ?? 'Manual';
        const status = item?.status ? (String(item.status).charAt(0).toUpperCase() + String(item.status).slice(1)) : 'Ready';

        return {
            id: item?.id ?? item?.s_n ?? offset,
            s_n: offset,
            report_type: reportTypeLabel,
            generation_date: formattedDate,
            period: period,
            generated_by: generatedBy,
            report_method: method,
            status: status,
            rawType: type,
            rawData: item
        };
    };

    useEffect(() => {
        let active = true;

        const fetchReportsAPI = async () => {
            try {
                setIsLoading(true);
                const params = {
                    page: currentPage,
                    limit: limit
                };
                if (searchTerm.trim()) params.search = searchTerm.trim();
                if (filterReportType !== 'All') params.type = filterReportType;
                if (startDate) params.startDate = new Date(startDate).toISOString();
                if (endDate) params.endDate = new Date(endDate).toISOString();

                const response = await api.get('/lawma/superadmin/reports', { params });
                if (!active) return;

                const payload = response?.data ?? {};
                const rawList = payload.data ?? payload.table_data ?? (Array.isArray(payload) ? payload : []);
                const totalRecords = payload.total ?? payload.totalCount ?? payload.totalRecords ?? rawList.length;

                const mapped = rawList.map((item, index) => mapReportItem(item, index, currentPage, limit));
                setReports(mapped);
                setTotalPages(Math.max(1, Math.ceil(totalRecords / limit)));

            } catch (error) {
                console.error('Error fetching reports:', error);
                if (!active) return;
                setReports([]);
                setTotalPages(1);
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        fetchReportsAPI();

        return () => {
            active = false;
        };
    }, [currentPage, searchTerm, filterReportType, startDate, endDate]);

    const processedReports = useMemo(() => {
        let sorted = [...reports];
        if (sortConfig.key) {
            sorted.sort((a, b) => {
                let valA = a[sortConfig.key];
                let valB = b[sortConfig.key];
                if (sortConfig.key === 'generation_date') {
                    valA = valA && valA !== 'N/A' ? new Date(valA).getTime() : 0;
                    valB = valB && valB !== 'N/A' ? new Date(valB).getTime() : 0;
                } else {
                    valA = valA || '';
                    valB = valB || '';
                }
                if (typeof valA === 'string' && typeof valB === 'string') {
                    valA = valA.toLowerCase();
                    valB = valB.toLowerCase();
                }
                if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sorted;
    }, [reports, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const SortIcon = ({ columnKey }) => {
        if (sortConfig.key !== columnKey) {
            return <ChevronUpDownIcon className="ml-1 h-4 w-4 text-zinc-400" />;
        }
        if (sortConfig.direction === 'ascending') {
            return <ArrowUpIcon className="ml-1 h-4 w-4 text-green-700" />;
        }
        return <ArrowDownIcon className="ml-1 h-4 w-4 text-green-700" />;
    };

    const tableHeaders = [
        { key: 's_n', label: 'S/N' },
        { key: 'report_type', label: 'Report Type' },
        { key: 'generation_date', label: 'Generation Date' },
        { key: 'period', label: 'Period' },
        { key: 'generated_by', label: 'Generated by' },
        { key: 'report_method', label: 'Report Method' },
        { key: 'status', label: 'Status' },
    ];

    const [rowActionModal, setRowActionModal] = useState(false);
    const [currentDataId, setCurrentDataId] = useState({});
    const modalRef = useRef();

    const handleRowAction = (appId, reportType) => {
        setCurrentDataId({ id: appId, type: reportType });
        setRowActionModal(true);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (rowActionModal && modalRef.current && !modalRef.current.contains(event.target)) {
                setRowActionModal(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [rowActionModal]);

    const handleOpenModal = () => {
        setIsGenerateModalOpen(true);
    };

    const handleReportView = async () => {
        const reportId = currentDataId.id;
        const reportType = currentDataId.type;
        
        try {
            setIsLoading(true);
            const { data } = await api.get(`/lawma/superadmin/reports/${reportId}`);
            const reportObject = data?.data ?? data;

            let internalType = '';
            if (reportType.toLowerCase().includes('bin') || reportType.toLowerCase().includes('request') || reportType.toLowerCase().includes('deliver')) {
                internalType = 'smartbin-request';
            } else if (reportType.toLowerCase().includes('waste')) {
                internalType = 'waste-pickup';
            } else if (reportType.toLowerCase().includes('payment') || reportType.toLowerCase().includes('revenue') || reportType.toLowerCase().includes('bill')) {
                internalType = 'payment-history';
            }
            
            if (internalType === 'smartbin-request') {
                localStorage.setItem('binreport', JSON.stringify(reportObject));
                navigate('/smartbin-report');
            }
            else if (internalType === 'waste-pickup') {
                localStorage.setItem('wastereport', JSON.stringify(reportObject));
                navigate('/waste-reports');
            }
            else if (internalType === 'payment-history') {
                localStorage.setItem('paymentHistory', JSON.stringify(reportObject));
                navigate('/payment-report');
            } else {
                showNotification("No preview available for this report type", "error");
            }
        } catch (error) {
            console.error('Error viewing report details:', error);
            showNotification("Failed to load report data", "error");
        } finally {
            setIsLoading(false);
            setCurrentDataId({});
            setRowActionModal(false);
        }
    };

    return (
        <>
            <div>
                <div className="flex sans h-screen">
                    <Sidebar addkey="1" />
                    <div className="flex-1 bg-zinc-100 min-h-screen overflow-y-auto">
                        <Topbar />
                        <div className="bg-zinc-100 font-sans">
                            <main className="p-4 md:px-4">
                                <div className=" p-4 md:p-8 font-sans">
                                    {notification.visible && (
                                        <div className={`fixed top-5 right-5 z-50 p-4 rounded-md shadow-lg text-white flex items-center space-x-2
                                            ${notification.type === 'success' ? 'bg-green-700' : 'bg-red-500'}`}
                                        >
                                            {notification.type === 'success' ? <CheckCircleIconSolid className="h-5 w-5" /> : <ExclamationTriangleIconSolid className="h-5 w-5" />}
                                            <span>{notification.message}</span>
                                            <button onClick={() => setNotification({ ...notification, visible: false })} className="ml-auto">
                                                <XMarkIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    )}

                                    <header className="mb-6 flex flex-col sm:flex-row justify-between items-center">
                                        <div>
                                            <h1 className="text-2xl md:text-3xl font-semibold text-zinc-800">Reports</h1>
                                            <p className="text-zinc-500 text-lg font-light">Generate comprehensive reports to view your activities</p>
                                        </div>
                                        <button
                                            onClick={handleOpenModal}
                                            className="mt-4 sm:mt-0 bg-green-700 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center transition duration-150 ease-in-out"
                                        >
                                            <PlusIcon className="mr-2 h-5 w-5" />
                                            Generate Report
                                        </button>
                                    </header>

                                    <div className="mb-6 rounded-lg ">
                                        <div className="flex flex-wrap items-center gap-4">
                                            {/* Search */}
                                            <div className="relative flex-grow md:max-w-xs">
                                                <input
                                                    type="text"
                                                    placeholder="Search here..."
                                                    className="w-full p-2 pl-10 border border-zinc-300 bg-white rounded-lg focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700 text-sm"
                                                    value={searchTerm}
                                                    onChange={(e) => {
                                                        setSearchTerm(e.target.value);
                                                        setCurrentPage(1);
                                                    }}
                                                />
                                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                                            </div>

                                            <div className="flex items-center text-sm text-zinc-600 md:ml-auto">Filter by:</div>

                                            {/* Type */}
                                            <div className="relative">
                                                <select
                                                    className="w-full md:w-auto p-2 pr-8 border border-zinc-300 text-zinc-700 text-sm rounded-lg appearance-none focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700 bg-white"
                                                    value={filterReportType}
                                                    onChange={(e) => {
                                                        setFilterReportType(e.target.value);
                                                        setCurrentPage(1);
                                                    }}
                                                >
                                                    <option value="All">Report Types</option>
                                                    <option value="revenue">Revenue</option>
                                                    <option value="payment-history">Payment History</option>
                                                    <option value="waste-pickup">Waste Pickup</option>
                                                    <option value="waste-disposed">Waste Disposed</option>
                                                    <option value="smartbin-request">Smart Bin Request</option>
                                                    <option value="smartbin-delivered">Smart Bin Delivered</option>
                                                    <option value="user-registration">User Registration</option>
                                                    <option value="unpaid-bills">Unpaid Bills</option>
                                                </select>
                                                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                                            </div>

                                            {/* Start Date */}
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-zinc-500 whitespace-nowrap">From:</span>
                                                <input
                                                    type="date"
                                                    className="p-2 text-sm border border-zinc-300 bg-white rounded-lg focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700 text-zinc-700"
                                                    value={startDate}
                                                    onChange={(e) => {
                                                        setStartDate(e.target.value);
                                                        setCurrentPage(1);
                                                    }}
                                                />
                                            </div>

                                            {/* End Date */}
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-zinc-500 whitespace-nowrap">To:</span>
                                                <input
                                                    type="date"
                                                    className="p-2 text-sm border border-zinc-300 bg-white rounded-lg focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700 text-zinc-700"
                                                    value={endDate}
                                                    onChange={(e) => {
                                                        setEndDate(e.target.value);
                                                        setCurrentPage(1);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
                                        <h2 className="text-lg font-semibold text-zinc-700 p-4 border-b border-zinc-100">All Reports</h2>
                                        {isLoading ? (
                                            <div className="p-6"><SkeletonLoader /></div>
                                        ) : processedReports.length === 0 ? (
                                            <div className="flex flex-col justify-center items-center py-20 text-center">
                                                <h2 className="text-xl mb-1 text-zinc-800">No Reports to show</h2>
                                                <p className="text-zinc-400 mt-2 font-light">There are no reports matching your filters</p>
                                                <button
                                                    onClick={handleOpenModal}
                                                    className="mt-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl px-4 py-2 text-sm flex items-center transition"
                                                >
                                                    <PlusIcon className="mr-2 h-4 w-4" />
                                                    Generate Report
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full min-w-[700px] bg-white text-left">
                                                    <thead className="bg-zinc-50 border-b border-zinc-100 text-zinc-500 text-xs uppercase font-medium">
                                                        <tr>
                                                            {tableHeaders.map(header => (
                                                                <th
                                                                    key={header.key}
                                                                    className="px-6 py-4 cursor-pointer hover:bg-zinc-100/50"
                                                                    onClick={() => header.key !== 'period' && requestSort(header.key)}
                                                                >
                                                                    <div className="flex items-center">
                                                                        {header.label}
                                                                        {header.key !== 'period' && <SortIcon columnKey={header.key} />}
                                                                    </div>
                                                                </th>
                                                            ))}
                                                            <th className="px-6 py-4">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-zinc-200 text-sm text-zinc-600">
                                                        {processedReports.map((report) => (
                                                            <tr key={report.id} className="hover:bg-zinc-50 transition-colors">
                                                                <td className="px-6 py-4 whitespace-nowrap">{report.s_n}.</td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-zinc-900 font-medium">{report.report_type}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap">{report.generation_date}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap">{report.period}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap">{report.generated_by}</td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                        report.report_method === 'Manual' 
                                                                            ? 'bg-blue-100 text-blue-800' 
                                                                            : 'bg-purple-100 text-purple-800'
                                                                    }`}>
                                                                        {report.report_method}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                        report.status === 'Ready' 
                                                                            ? 'bg-green-100 text-green-800' 
                                                                            : 'bg-yellow-100 text-yellow-800'
                                                                    }`}>
                                                                        {report.status}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap relative">
                                                                    <button
                                                                        onClick={() => handleRowAction(report.id, report.report_type)}
                                                                        type="button"
                                                                        className="p-1 text-zinc-400 hover:text-zinc-600 rounded-md hover:bg-zinc-100 transition"
                                                                    >
                                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                                                                        </svg>
                                                                    </button>
                                                                    {rowActionModal && currentDataId.id === report.id && (
                                                                        <div
                                                                            ref={modalRef}
                                                                            className="absolute right-6 top-10 z-50 bg-white rounded-xl shadow-xl border border-zinc-200 p-2"
                                                                            style={{ minWidth: 100 }}
                                                                        >
                                                                            <p onClick={handleReportView} className="p-2 hover:bg-zinc-50 rounded-lg cursor-pointer text-center text-sm font-medium text-zinc-700">View</p>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}

                                        {/* Pagination Footer */}
                                        {!isLoading && totalPages > 1 && (
                                            <div className="flex justify-between items-center p-4 bg-zinc-50 border-t border-zinc-200">
                                                <div className="text-sm text-zinc-600">
                                                    Page <span className="font-semibold text-zinc-800">{currentPage}</span> of <span className="font-semibold text-zinc-800">{totalPages}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                                        disabled={currentPage === 1 || isLoading}
                                                        className="p-2 rounded-md hover:bg-zinc-200 border border-zinc-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                    >
                                                        <ChevronLeftIcon className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                                        disabled={currentPage === totalPages || isLoading}
                                                        className="p-2 rounded-md bg-green-700 text-white hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                    >
                                                        <ChevronRightIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
                </div>
            </div>
            
            <GenerateReportModal
                isOpen={isGenerateModalOpen}
                onClose={() => setIsGenerateModalOpen(false)}
            />
        </>
    );
};

export default ReportsPage;
