import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Sidebar from '../components/PSPs/Sidebar';
import Topbar from '../components/PSPs/Topbar';
import api from '../api/apiConfig';
import { useNavigate } from 'react-router-dom';
// import demoReports from '../data/demoReports';
import SkeletonLoader from '../components/SkeletonLoader';
import {
    PlusIcon,
    SearchIcon,
    ChevronDownIcon,
    ChevronUpDownIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    XMarkIcon,
    DotsVerticalIcon as EllipsisVerticalIcon,
    CheckCircleIconSolid,
    ExclamationTriangleIconSolid,
    LoadingSpinnerIcon,
    CheckIcon
} from '../components/icons';




const REPORT_TYPES = [{ name: 'Payment History', value: 'payment-history' }, { name: 'Bin Request', value: 'smartbin-request' }, { name: 'Waste disposed', value: 'waste-disposed' }];
const selectedReportType = (report) => report;
// const selectedReportType = (report) => {
//     switch (report) {
//         case 'Payment History':
//             return 'payment-history';
//         case 'Bin Request':
//             return 'smartbin-request';
//         case 'Waste disposed':
//             return 'waste-disposed';
//     };
// };



const formatGenerationDate = (isoDateString) => {
    if (!isoDateString) return 'N/A';
    try {
        const date = new Date(isoDateString);
        const datePart = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        const timePart = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        return `${datePart} @ ${timePart}`;
    } catch {
        return 'Invalid Date';
    }
};



// Main Component
const ReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);


    const [notification, setNotification] = useState({ message: '', type: '', visible: false });

    const [searchTerm, setSearchTerm] = useState('');
    const [filterReportType, setFilterReportType] = useState('All');
    const [filterDate, setFilterDate] = useState('');

    const [sortConfig, setSortConfig] = useState({ key: 'generationDate', direction: 'descending' });

    const [newReportName, setNewReportName] = useState('');
    const [newReportType, setNewReportType] = useState('');
    const [newReportStartDate, setNewReportStartDate] = useState('');
    const [newReportEndDate, setNewReportEndDate] = useState('');


    const formatPeriodArrow = (periodObj) => {
        if (!periodObj || !periodObj.from || !periodObj.to) return 'N/A';
        const [fromDay, fromMonth] = periodObj.from.split('/');
        const [toDay, toMonth] = periodObj.to.split('/');
        const fromDate = new Date(2025, parseInt(fromMonth) - 1, parseInt(fromDay));
        const toDate = new Date(2025, parseInt(toMonth) - 1, parseInt(toDay));
        const fromStr = `${fromDate.toLocaleString('en-US', { month: 'short' })} ${fromDay}`;
        const toStr = `${toDate.toLocaleString('en-US', { month: 'short' })} ${toDay}`;
        return (
            <span className="inline-flex items-center gap-1">
                <span>{fromStr}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="8" viewBox="0 0 17 8" fill="none" className="mx-1">
                    <path d="M12.875 0.875L16 4M16 4L12.875 7.125M16 4H1" stroke="#828282" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{toStr}</span>
            </span>
        );
    };
    const fetchReportsAPI = useCallback(async () => {
        setIsLoading(true);
        // Check if we're in development mode
        // if (process.env.NODE_ENV === 'development') {
        //     // Use demo data in development with 2 second delay
        //     setIsLoading(true);
        //     await new Promise(resolve => setTimeout(resolve, 2000));

        //     const reportList = demoReports.map((item) => ({
        //         id: item._id,
        //         reportType: item.type,
        //         reportTitle: item.reportName,
        //         period: formatPeriodArrow(item.period),
        //         generationDate: item.createdAt
        //     }));

        //     setReports(reportList);
        //     setIsLoading(false);
        //     return;
        // }

        // Production API call
        try {
            const params = {
                page: currentPage,
                limit: limit,
                ...(searchTerm && { search: searchTerm }),
                ...(filterReportType !== 'All' && { type: filterReportType }),
                ...(filterDate && { startDate: filterDate }),
            };

            const { data } = await api.get(`/lawma/psp/reports`, { params });

            if (data.success && data.data && Array.isArray(data.data.reports)) {
                const reportList = data.data.reports.map((item) => ({
                    id: item.reportId,
                    reportType: item.reportType,
                    reportTitle: item.title,
                    period: formatPeriodArrow(item.period),
                    generationDate: item.generationDate
                }));
                setReports(reportList);
                if (data.data.totalPages) {
                    setTotalPages(data.data.totalPages);
                }
            }
            console.log("Reports data fetched successfully", data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, limit, searchTerm, filterReportType, filterDate]);
     useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterReportType, filterDate]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(fetchReportsAPI, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [fetchReportsAPI]);

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
                report.reportTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                report.reportType.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (filterReportType !== 'All') {
            filtered = filtered.filter(report => report.reportType === filterReportType);
        }
        if (filterDate) {
            filtered = filtered.filter(report =>
                formatGenerationDate(report.generationDate).toLowerCase().includes(filterDate.toLowerCase())
            );
        }
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                let valA = a[sortConfig.key];
                let valB = b[sortConfig.key];
                if (sortConfig.key === 'generationDate' || sortConfig.key === 'periodStart' || sortConfig.key === 'periodEnd') {
                    valA = new Date(valA);
                    valB = new Date(valB);
                }
                if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [reports, searchTerm, filterReportType, filterDate, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleOpenModal = () => {
        setNewReportName('');
        setNewReportType('');
        setNewReportStartDate('');
        setNewReportEndDate('');
        setIsModalOpen(true);
    };
    const handleCloseModal = () => setIsModalOpen(false);

    // const formatPeriod = (startDate, endDate) => {
    //     const start = new Date(startDate);
    //     const end = new Date(endDate);
    //     const result = `${start.toLocaleDateString('en-US', { month: 'long' })} ${start.toLocaleDateString('en-US', { day: '2-digit' })} - ${end.toLocaleDateString('en-US', { month: 'long' })} ${end.toLocaleDateString('en-US', { day: '2-digit' })}`;
    //     return result;
    // }

    // Pagination navigation functions
    const goToNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const goToPreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const PaginationComponent = () => {
        if (totalPages <= 1) return null;

        return (
            <div className="flex items-center justify-between mt-5">
                <div className="flex items-center text-sm text-zinc-700">
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-zinc-700 bg-zinc-300 border border-zinc-300 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeftIcon className="h-4 w-4" />
                    </button>

                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium text-white bg-green-700 border border-zinc-300 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRightIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
        );
    };



    const handleGenerateReportSubmit = async (e) => {
        e.preventDefault();
        if (!newReportName || !newReportType || !newReportStartDate || !newReportEndDate) {
            showNotification('Please fill all fields in the report form.', 'error');
            return;
        }
        if (new Date(newReportStartDate) > new Date(newReportEndDate)) {
            showNotification('Start date cannot be after end date.', 'error');
            return;
        }

        setIsGeneratingReport(true);
        const selectedType = selectedReportType(newReportType);

        try {
            const { data } = await api.post('/lawma/psp/reports/report', {
                // reportName: newReportName,
                // type: selectedType,
                // startDate: newReportStartDate,
                // endDate: newReportEndDate
                reportName: newReportName,
                type: selectedType,
                startDate: new Date(newReportStartDate).toISOString(),
                endDate: new Date(newReportEndDate).toISOString()
            })
            console.log("Report generated successfully", data);
            if (data.success) {
                showNotification(data.message || 'Report generated successfully!', 'success');
                handleCloseModal();
                const reportObject = data.data.id;
                if (selectedType == 'smartbin-request') {
                    localStorage.setItem('binreport', JSON.stringify(reportObject));
                    navigate('/smartbin-report');
                }
                else if (selectedType == 'waste-pickup') {
                    localStorage.setItem('wastereport', JSON.stringify(reportObject));
                    navigate('/waste-reports');
                }
                else if (selectedType == 'payment-history') {
                    localStorage.setItem('paymentHistory', JSON.stringify(reportObject));
                    navigate('/payment-report');
                }

            } else {
                showNotification(data.message || 'Failed to generate report.', 'error');
            }
        } catch (error) {
            showNotification(error.response.data.message || 'An error occurred while generating the report.', 'error');
        } finally {
            setIsGeneratingReport(false);
            fetchReportsAPI();
        }
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
        { key: 'reportTitle', label: 'Report Title' },
        { key: 'generationDate', label: 'Generation Date' },
        { key: 'period', label: 'Period' },
        { key: 'reportType', label: 'Report Type' },
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

    const handleReportView = () => {
        const reportId = currentDataId.id;
        const reportType = currentDataId.type;
        if (reportType == 'smartbin-request') {
            navigate(`/smartbin-report/${reportId}`);
        }
        else if (reportType == 'waste-disposed') {
            navigate(`/waste-reports/${reportId}`);
        }
        else if (reportType == 'payment-history') {
            navigate(`/payment-report/${reportId}`);
        }
        setCurrentDataId({});
        setRowActionModal(false);
    }

    return (

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
                                    {processedReports.length > 0 && (<button
                                        onClick={handleOpenModal}
                                        className="mt-4 sm:mt-0 bg-green-700 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center transition duration-150 ease-in-out"
                                    >
                                        <PlusIcon className="mr-2 h-5 w-5" />
                                        Generate Report
                                    </button>)}
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
                                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-600" />
                                        </div>

                                        <div className="flex items-center text-sm text-zinc-600 md:ml-auto">Filter by:</div>

                                        <div className="relative">
                                            <select
                                                className="w-full md:w-auto p-2 pr-8 border border-zinc-300 text-zinc-700 text-sm rounded-lg appearance-none focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700 bg-white "
                                                value={filterReportType}
                                                onChange={(e) => setFilterReportType(e.target.value)}
                                            >
                                                <option value="All">Report Types</option>
                                                {REPORT_TYPES.map(type => (
                                                    <option key={type.name} value={type.value}>{type.name}</option>
                                                ))}
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
                                                        <th className="lg:p-6 p-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider w-12">S/N</th>
                                                        {tableHeaders.map(header => (
                                                            <th
                                                                key={header.key}
                                                                className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:bg-zinc-50"
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
                                                    {processedReports.map((report, index) => (
                                                        <tr key={report.id} className="hover:bg-zinc-50 transition-colors duration-150">
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-500">{index + 1}.</td>
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-900 whitespace-nowrap">{report.reportTitle}</td>
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-500 whitespace-nowrap">{formatGenerationDate(report.generationDate)}</td>
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-500 whitespace-nowrap">{report.period}</td>
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-500 whitespace-nowrap">
                                                                <span>
                                                                    {report.reportType}
                                                                </span>
                                                            </td>
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-500 whitespace-nowrap relative">
                                                                <button
                                                                    onClick={() => handleRowAction(report.id, report.reportType)}
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

                                <PaginationComponent />

                                {/* <div className="flex items-center justify-between ">
    <div className="flex justify-between flex-1 sm:hidden">
        <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 disabled:opacity-50"
        >
            Previous
        </button>
        <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 disabled:opacity-50"
        >
            Next
        </button>
    </div>
    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
            <p className="text-sm text-zinc-700">
                Showing Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </p>
        </div>
        <div>
            <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 text-zinc-400 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                    <span className="sr-only">Previous</span>
                   
                    &lt;
                </button>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 text-zinc-400 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                    <span className="sr-only">Next</span>
                    
                    &gt;
                </button>
            </nav>
        </div>
    </div>
</div> */}

                                {isModalOpen && (
                                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-40 transition-opacity duration-300 ease-in-out">
                                        <div className="bg-white rounded-2xl shadow-xl px-8 py-12 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                                            <div className="flex justify-between items-center mb-10 ">
                                                <h3 className="text-2xl font-semibold text-zinc-800">Generate Report</h3>
                                                <button onClick={handleCloseModal} className="text-zinc-400 hover:text-zinc-600">
                                                    <XMarkIcon className="h-6 w-6" />
                                                </button>
                                            </div>
                                            <form onSubmit={handleGenerateReportSubmit}>
                                                <div className="mb-4">
                                                    <label htmlFor="reportName" className="block text-sm font-medium text-zinc-700 mb-1">Report name</label>
                                                    <input
                                                        type="text"
                                                        id="reportName"
                                                        value={newReportName}
                                                        onChange={(e) => setNewReportName(e.target.value)}
                                                        placeholder="My Custom Report"
                                                        className="w-full lg:p-4 p-2 border border-zinc-300 rounded-2xl focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700"
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="reportType" className="block text-sm font-medium text-zinc-700 mb-1">Report type</label>
                                                    <div className="relative">
                                                        <div className="relative inline-block w-full">
                                                            <button
                                                                type="button"
                                                                className={`w-full lg:p-4 p-2 pr-8 border border-zinc-300 rounded-2xl appearance-none focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700 bg-white text-left flex justify-between items-center ${!newReportType ? 'text-zinc-400' : 'text-zinc-900'
                                                                    }`}
                                                                onClick={() => setIsOpen(!isOpen)}
                                                                aria-haspopup="listbox"
                                                                aria-expanded={isOpen}
                                                            >
                                                                {newReportType !== '' ? newReportType : "Select report type"}
                                                                <ChevronDownIcon className={`h-4 w-4 text-zinc-400 transform ${isOpen ? 'rotate-180' : ''}`} />
                                                            </button>

                                                            {isOpen && (
                                                                <ul
                                                                    className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
                                                                    role="listbox"
                                                                    tabIndex={-1}
                                                                >

                                                                    {REPORT_TYPES.map((type) => (
                                                                        <li
                                                                            key={type.name}
                                                                            className="text-zinc-900 cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-zinc-50"
                                                                            role="option"
                                                                            onClick={() => {
                                                                                setNewReportType(type.value);
                                                                                setIsOpen(false);
                                                                            }}
                                                                        >
                                                                            <span className="block truncate">{type.name}</span>
                                                                            {newReportType === type.value && (
                                                                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-green-600">
                                                                                    <CheckIcon className="h-5 w-5" />
                                                                                </span>
                                                                            )}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 gap-4 mb-6">
                                                    <div>
                                                        <label htmlFor="startDate" className="block text-sm font-medium text-zinc-700 mb-1">Start Date</label>
                                                        <input
                                                            type="date"
                                                            id="startDate"
                                                            value={newReportStartDate}
                                                            onChange={(e) => setNewReportStartDate(e.target.value)}
                                                            className="w-full lg:p-4 p-2 border border-zinc-300 rounded-2xl focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="endDate" className="block text-sm font-medium text-zinc-700 mb-1">End Date</label>
                                                        <input
                                                            type="date"
                                                            id="endDate"
                                                            value={newReportEndDate}
                                                            onChange={(e) => setNewReportEndDate(e.target.value)}
                                                            className="w-full lg:p-4 p-2 border border-zinc-300 rounded-2xl focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-end">

                                                    <button
                                                        type="submit"
                                                        className="bg-green-700 hover:bg-green-600 text-white text-lg p-4 w-full  rounded-lg shadow-md flex items-center justify-center transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]"
                                                        disabled={isGeneratingReport}
                                                    >
                                                        {isGeneratingReport ? (
                                                            <>
                                                                <LoadingSpinnerIcon className="h-5 w-5 mr-2" />
                                                                Generating...
                                                            </>
                                                        ) : (
                                                            'Generate report'
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}

                            </div>



                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
