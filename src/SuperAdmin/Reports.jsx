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
    LoadingSpinnerIcon
} from '../components/icons';

const formatGenerationDate = (dateString) => {
    if (!dateString) return 'N/A';
    // The new format is "MM/DD/YYYY HH:MM", so we'll return it as is for now
    // If we need to reformat it differently, we can parse and adjust
    return dateString;
};

// Main Component
const ReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const navigate = useNavigate();

    const [notification, setNotification] = useState({ message: '', type: '', visible: false });

    const [searchTerm, setSearchTerm] = useState('');
    const [filterReportType, setFilterReportType] = useState('All');
    const [filterReportMethod, setFilterReportMethod] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterDate, setFilterDate] = useState('');

    const [sortConfig, setSortConfig] = useState({ key: 'generation_date', direction: 'descending' });

    const fetchReportsAPI = async () => {
        // Check if we're in development mode
        if (process.env.NODE_ENV === 'development') {
            // Use mock data in development with 2 second delay
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 2000));

            const mockTableData = [
                {
                    s_n: 1,
                    report_type: "Revenue report",
                    generation_date: "10/06/2023 11:36",
                    period: "May 05 → June 14",
                    generated_by: "Samuel Pearls",
                    report_method: "Manual",
                    status: "Processing"
                },
                {
                    s_n: 2,
                    report_type: "User registration",
                    generation_date: "10/06/2023 11:36",
                    period: "May 05 → June 14",
                    generated_by: "Adesoji Seyi",
                    report_method: "Automatic",
                    status: "Processing"
                },
                {
                    s_n: 3,
                    report_type: "Waste pickup",
                    generation_date: "10/06/2023 11:36",
                    period: "May 05 → June 14",
                    generated_by: "Moysade Beatrice",
                    report_method: "Manual",
                    status: "Ready"
                },
                {
                    s_n: 4,
                    report_type: "Bin request lifecycle",
                    generation_date: "10/06/2023 11:36",
                    period: "May 05 → June 14",
                    generated_by: "Omolola James",
                    report_method: "Automatic",
                    status: "Ready"
                }
            ];

            const reportList = mockTableData.map((item, index) => ({
                id: item.s_n, // Using s_n as the unique id for development
                ...item
            }));

            setReports(reportList);
            setIsLoading(false);
            return;
        }

        // Production API call
        try {
            const { data } = await api.get(`/corporate/reports`);
            if (data.success) {
                const reportList = data.table_data.map((item, index) => ({
                    id: item.id || item.s_n || index, // Use provided id or s_n or index as fallback
                    ...item
                }));
                setReports(reportList);
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchReportsAPI();
    }, []);

    const showNotification = (message, type) => {
        setNotification({ message, type, visible: true });
        setTimeout(() => {
            setNotification({ message: '', type: '', visible: false });
        }, 3000);
    };

    const processedReports = useMemo(() => {
        let filtered = [...reports];
        
        if (searchTerm) {
            filtered = filtered.filter(report =>
                report.report_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.generated_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.report_method.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.status.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (filterReportType !== 'All') {
            filtered = filtered.filter(report => report.report_type === filterReportType);
        }
        
        if (filterReportMethod !== 'All') {
            filtered = filtered.filter(report => report.report_method === filterReportMethod);
        }
        
        if (filterStatus !== 'All') {
            filtered = filtered.filter(report => report.status === filterStatus);
        }
        
        if (filterDate) {
            filtered = filtered.filter(report =>
                formatGenerationDate(report.generation_date).toLowerCase().includes(filterDate.toLowerCase())
            );
        }
        
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let valA = a[sortConfig.key];
                let valB = b[sortConfig.key];
                if (sortConfig.key === 'generation_date') {
                    // For date comparison, we'll convert to a comparable format if needed
                    // For now, we'll do string comparison which works for "MM/DD/YYYY HH:MM"
                    valA = valA || '';
                    valB = valB || '';
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
        return filtered;
    }, [reports, searchTerm, filterReportType, filterReportMethod, filterStatus, filterDate, sortConfig]);

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

    const handleReportView = () => {
        const reportObject = currentDataId.id;
        const reportType = currentDataId.type;
        // Map the new report types to the internal navigation types
        let internalType = '';
        if (reportType.toLowerCase().includes('bin') || reportType.toLowerCase().includes('request')) {
            internalType = 'smartbin-request';
        } else if (reportType.toLowerCase().includes('waste')) {
            internalType = 'waste-pickup';
        } else if (reportType.toLowerCase().includes('payment') || reportType.toLowerCase().includes('revenue')) {
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
        }
        setCurrentDataId({});
        setRowActionModal(false);
    }

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

                                    <div className="mb-6   rounded-lg ">
                                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                                            <div className="relative flex-grow md:max-w-xs">
                                                <input
                                                    type="text"
                                                    placeholder="Search here..."
                                                    className="w-full p-2 pl-10 border border-zinc-300  bg-white rounded-lg focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700  "
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                                            </div>

                                            <div className="flex items-center text-sm text-zinc-600 md:ml-auto">Filter by:</div>

                                            <div className="relative">
                                                <select
                                                    className="w-full md:w-auto p-2 pr-8 border border-zinc-300 text-zinc-700 text-sm rounded-lg appearance-none focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700 bg-white "
                                                    value={filterReportType}
                                                    onChange={(e) => setFilterReportType(e.target.value)}
                                                >
                                                    <option value="All">Report Types</option>
                                                    <option value="Revenue report">Revenue report</option>
                                                    <option value="User registration">User registration</option>
                                                    <option value="Waste pickup">Waste pickup</option>
                                                    <option value="Bin request lifecycle">Bin request lifecycle</option>
                                                </select>
                                                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                                            </div>
                                            
                                            <div className="relative">
                                                <select
                                                    className="w-full md:w-auto p-2 pr-8 border border-zinc-300 text-zinc-700 text-sm rounded-lg appearance-none focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700 bg-white "
                                                    value={filterReportMethod}
                                                    onChange={(e) => setFilterReportMethod(e.target.value)}
                                                >
                                                    <option value="All">Report Method</option>
                                                    <option value="Manual">Manual</option>
                                                    <option value="Automatic">Automatic</option>
                                                </select>
                                                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                                            </div>

                                            <div className="relative">
                                                <select
                                                    className="w-full md:w-auto p-2 pr-8 border border-zinc-300 text-zinc-700 text-sm rounded-lg appearance-none focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700 bg-white "
                                                    value={filterStatus}
                                                    onChange={(e) => setFilterStatus(e.target.value)}
                                                >
                                                    <option value="All">Status</option>
                                                    <option value="Ready">Ready</option>
                                                    <option value="Processing">Processing</option>
                                                </select>
                                                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                                            </div>

                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Filter by Date"
                                                    className="w-full md:w-auto p-2 text-sm border border-zinc-300 bg-white rounded-lg focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700 "
                                                    value={filterDate}
                                                    onChange={(e) => setFilterDate(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="  overflow-x-auto">
                                        <h2 className="text-lg font-semibold text-zinc-700 p-4 ">All Reports</h2>
                                        {isLoading ? (
                                            <SkeletonLoader />
                                        ) : processedReports.length === 0 ? (


                                            <div className="flex flex-col justify-center items-center mt-20">

                                                <div className="max-w-xl w-full flex flex-col items-center justify-center text-center">
                                                    <h2 className="text-xl mb-1 sans">No Reports to show</h2>
                                                    <p className="text-zinc-400  mt-2 font-light">
                                                        There are no reports to show

                                                    </p>

                                                    <button
                                                        onClick={handleOpenModal}
                                                        className=" text-zinc-600 pointer lg:w-1/2 rounded-xl text-lg mb-6 flex flex-row items-center font-light justify-center p-3"
                                                    >
                                                        <PlusIcon className="mr-2 h-5 w-5" />
                                                        Generate Report
                                                    </button>
                                                </div>

                                            </div>
                                        ) : (
                                            <div className='bg-white rounded-2xl '>
                                                <table className="w-full min-w-[700px] m-4 bg-white ">
                                                    <thead className="border-b border-zinc-200">
                                                        <tr>
                                                            {tableHeaders.map(header => (
                                                                <th
                                                                    key={header.key}
                                                                    className="lg:p-6 p-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:bg-zinc-50"
                                                                    onClick={() => header.key !== 'period' && requestSort(header.key)}
                                                                >
                                                                    <div className="flex items-center">
                                                                        {header.label}
                                                                        {header.key !== 'period' && <SortIcon columnKey={header.key} />}
                                                                    </div>
                                                                </th>
                                                            ))}
                                                            <th className="lg:p-6 p-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-zinc-200">
                                                        {processedReports.map((report) => (
                                                            <tr key={report.id} className="hover:bg-zinc-50 transition-colors duration-150">
                                                                <td className="lg:p-6 p-3 text-sm text-zinc-500">{report.s_n}.</td>
                                                                <td className="lg:p-6 p-3 text-sm text-zinc-900 whitespace-nowrap">{report.report_type}</td>
                                                                <td className="lg:p-6 p-3 text-sm text-zinc-500 whitespace-nowrap">{formatGenerationDate(report.generation_date)}</td>
                                                                <td className="lg:p-6 p-3 text-sm text-zinc-500 whitespace-nowrap">{report.period}</td>
                                                                <td className="lg:p-6 p-3 text-sm text-zinc-500 whitespace-nowrap">{report.generated_by}</td>
                                                                <td className="lg:p-6 p-3 text-sm text-zinc-500 whitespace-nowrap">
                                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                                        report.report_method === 'Manual' 
                                                                            ? 'bg-blue-100 text-blue-800' 
                                                                            : 'bg-purple-100 text-purple-800'
                                                                    }`}>
                                                                        {report.report_method}
                                                                    </span>
                                                                </td>
                                                                <td className="lg:p-6 p-3 text-sm text-zinc-500 whitespace-nowrap">
                                                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                                                        report.status === 'Ready' 
                                                                            ? 'bg-green-100 text-green-800' 
                                                                            : 'bg-yellow-100 text-yellow-800'
                                                                    }`}>
                                                                        {report.status}
                                                                    </span>
                                                                </td>
                                                                <td className="lg:p-6 p-3 text-sm text-zinc-500 whitespace-nowrap relative">
                                                                    <button
                                                                        onClick={() => handleRowAction(report.id, report.report_type)}
                                                                        type="button"
                                                                        className="p-1 text-zinc-500 hover:text-zinc-700"
                                                                    >
                                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                                                                        </svg>
                                                                    </button>
                                                                    {rowActionModal && currentDataId.id === report.id && (
                                                                        <div
                                                                            ref={modalRef}
                                                                            className="absolute z-50 bg-white rounded-xl shadow-xl p-4 "
                                                                            style={{ minWidth: 120 }}
                                                                        >
                                                                            <p onClick={handleReportView} className='p-2 cursor-pointer'>View</p>
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
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
