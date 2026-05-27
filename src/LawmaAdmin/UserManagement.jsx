import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/LawmaAdmin/Sidebar';
import Topbar from '../components/LawmaAdmin/Topbar';
import api from '../api/apiConfig';
import demoUserDetails from '../data/demoUserManager';
import DocumentViewer from '../components/LawmaAdmin/AdminKYC/DocumentViewer';
import SkeletonLoader from '../components/SkeletonLoader';
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  XMarkIcon,
  CheckCircleIconSolid,
  ExclamationTriangleIconSolid,
  ChevronLeftIcon,
  ChevronRightIcon
} from '../components/icons';






const formatGenerationDate = (isoDateString) => {
  if (!isoDateString) return 'N/A';
  try {
    const date = new Date(isoDateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  } catch (e) {
    return 'Invalid Date';
  }
};

const sanitizeUserType = (value) => {
  if (!value && value !== 0) return '';
  return String(value).trim().replace(/\.+$/, '');
};



// Main Component
const UserManagement = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  
  // Pagination state
  const [paginationData, setPaginationData] = useState({
    page: 1,
    pages: 1,
    size: 10,
    total: 0
  });

  const [notification, setNotification] = useState({ message: '', type: '', visible: false });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterReportType, setFilterReportType] = useState('All');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });


  const fetchUserData = async (tab = activeTab) => {
    // Check if we're in development mode (supports CRA and Vite)
    const isDev =
      (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE !== 'production') ||
      process.env.NODE_ENV === 'development';


    // Force API call for testing - set to false to use demo data
    const forceApiCall = true;

    if (isDev && !forceApiCall) {
      // Use demoUserManager data in development with brief delay
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      try {
        const details = demoUserDetails || {};
        const rows = [];

        // Process residents
        if (Array.isArray(details.resident)) {
          details.resident.forEach((user, index) => {
            rows.push({
              id: `resident-${index}`,
              name: user.name || '',
              userId: user.userID || '',
              email: user.email || '',
              lga: user.lga || '',
              userType: user.customerType || 'Resident',
              pspCompany: user.pspCompany || '',
              status: user.status || 'Active',
              phone: user.phoneNumber || '',
              address: user.address || '',
              subscription: user.subscription || '',
              lastLogin: user.lastLogin || '',
              expiration: user.expiration || '',
              date: user.dateAdded || new Date().toISOString()
            });
          });
        }

        // Process agents
        if (Array.isArray(details.agent)) {
          details.agent.forEach((user, index) => {
            rows.push({
              id: `agent-${index}`,
              name: user.name || '',
              userId: user.userID || '',
              email: user.email || '',
              lga: user.lga || '',
              userType: user.customerType || 'Agent',
              pspCompany: user.agencyName || '',
              status: user.status || 'Active',
              phone: user.phoneNumber || '',
              address: user.address || '',
              subscription: user.subscription || '',
              expiration: user.expiration || '',
              lastLogin: user.lastLogin || '',
              registrationNumber: user.registrationNumber || '',
              date: user.dateAdded || new Date().toISOString()
            });
          });
        }

        // Process corporate
        if (Array.isArray(details.corporate)) {
          details.corporate.forEach((user, index) => {
            rows.push({
              id: `corporate-${index}`,
              name: user.name || '',
              userId: user.userID || '',
              email: user.businessEmail || '',
              lga: user.lga || '',
              userType: user.customerType || 'Corporate',
              pspCompany: user.pspCompany || '',
              status: user.status || 'Active',
              phone: user.businessPhone || '',
              address: user.address || '',
              subscription: user.subscription || '',
              expiration: user.expiration || '',
              lastLogin: user.lastLogin || '',
              date: user.dateAdded || new Date().toISOString()
            });
          });
        }

        // Process facility managers
        if (Array.isArray(details.facilityManager)) {
          details.facilityManager.forEach((user, index) => {
            rows.push({
              id: `facility-${index}`,
              name: user.name || '',
              userId: user.userID || '',
              email: user.email || '',
              lga: user.lga || '',
              userType: user.customerType || 'Facility Manager',
              pspCompany: user.pspCompany || '',
              status: user.status || 'Active',
              phone: user.phoneNumber || '',
              address: user.address || '',
              subscription: user.subscription || '',
              expiration: user.expiration || '',
              lastLogin: user.lastLogin || '',
              binID: user.binID || '',
              binStatus: user.binStatus || '',
              buildingName: user.buildingName || '',
              branchName: user.branchName || '',
              branchAddress: user.branchAddress || '',
              date: user.dateAdded || new Date().toISOString()
            });
          });
        }

        setReports(rows);
      } catch (e) {
        console.error('Error building demo user data:', e);
        setReports([]);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Production API call
    try {
      // Get current page for API call
      const currentPage = paginationData.page;
      const pageSize = paginationData.size;
      
      const { data } = await api.get(`admin/users?page=${currentPage}&size=${pageSize}`);
      // Extract users from allUsers property
      const items = Array.isArray(data?.allUsers) ? data.allUsers : [];
      
      // Handle pagination data
      const pagination = data?.paging || {};
      
      const reportList = items.map((item, index) => ({
        id: item.userId || `user-${index}`,
        name: item.name || '',
        userId: item.userId || '',
        email: item.email || 'N/A',
        lga: item.lga || 'N/A',
        userType: item.userType || '',
        pspCompany: item.pspCompany || 'N/A',
        status: item.status || 'Active',
        phone: item.phone || 'N/A',
        address: item.address || 'N/A',
        subscription: item.subscription || 'N/A',
        lastLogin: item.lastLogin || 'N/A',
        expiration: item.expiration || 'N/A',
        date: item.createdAt || new Date().toISOString()
      }));
      setReports(reportList);
      
      // Update pagination state
      if (pagination.total) {
        setPaginationData({
          page: pagination.page || 1,
          pages: pagination.pages || 1,
          size: pagination.size || 10,
          total: pagination.total || 0
        });
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchUserData(activeTab);
  }, [activeTab, paginationData.page]);

  const showNotification = (message, type) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ message: '', type: '', visible: false });
    }, 3000);
  };

  // Process reports for display (no client-side pagination needed since backend handles it)
  const processedReports = useMemo(() => {
    let filtered = [...reports];
    if (searchTerm) {
      filtered = filtered.filter(report =>
        (report.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.userType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.userId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.lga || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.pspCompany || '').toLowerCase().includes(searchTerm.toLowerCase()) 
      );
    }
    if (filterReportType !== 'All') {
      filtered = filtered.filter(report => normalizeUserType(report.userType) === filterReportType);
    }
    if (filterStatus !== 'All') {
      filtered = filtered.filter(report => (report.status || 'Active').toLowerCase() === filterStatus.toLowerCase());
    }
    if (filterDate) {
      const selected = new Date(filterDate);
      const isValidDate = !isNaN(selected.getTime());
      if (isValidDate) {
        const isSameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
        filtered = filtered.filter(report => {
          const reportDate = new Date(report.date);
          return isSameDay(reportDate, selected);
        });
      } else {
        filtered = filtered.filter(report =>
          formatGenerationDate(report.date).toLowerCase().includes(String(filterDate).toLowerCase())
        );
      }
    }
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        if (sortConfig.key === 'date' || sortConfig.key === 'periodStart' || sortConfig.key === 'periodEnd') {
          valA = new Date(valA);
          valB = new Date(valB);
        }
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [reports, searchTerm, filterReportType, filterStatus, filterDate, sortConfig]);

  // Reset to first page when filters change
  useEffect(() => {
    setPaginationData(prev => ({ ...prev, page: 1 }));
  }, [searchTerm, filterReportType, filterStatus, filterDate]);


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
    { key: 'userId', label: 'User ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'userType', label: 'User type', sortable: true },
    { key: 'lga', label: 'LGA', sortable: true },
    { key: 'pspCompany', label: 'PSP Company', sortable: true },
    { key: 'status', label: 'Status', sortable: false },
  ];

  const [verificationModal, setVerificationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const filterRef = useRef();
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [isLoadingUserDetails, setIsLoadingUserDetails] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  function normalizeUserType(rawType) {
    const value = sanitizeUserType(rawType).toLowerCase();
    if (!value) return '';
    if (['facility manager', 'facility_manager', 'facilitymanager', 'facility'].includes(value)) return 'facility manager';
    if (['resident'].includes(value)) return 'resident';
    if (['corporate', 'corporate customer', 'corporate_user'].includes(value)) return 'corporate';
    if (['agent', 'field agent'].includes(value)) return 'agent';
    return value;
  }

  const fetchUserDetails = async (userId, userType) => {
    try {
      setIsLoadingUserDetails(true);
      
      // Normalize user type to match API expectations
      const normalizedUserType = normalizeUserType(userType);
      
      // Build endpoints based on user type with role parameter
      const endpoints = [];
      
      if (normalizedUserType === 'facility manager') {
        endpoints.push({ url: `admin/users/${userId}?role=Facility`, type: 'facility' });
        endpoints.push({ url: `admin/users/${userId}?role=Facility_Manager`, type: 'facility_manager' });
      } else if (normalizedUserType === 'agent') {
        endpoints.push({ url: `admin/users/${userId}?role=Agent`, type: 'agent' });
      } else if (normalizedUserType === 'resident') {
        endpoints.push({ url: `admin/users/${userId}?role=Resident`, type: 'resident' });
      } else if (normalizedUserType === 'corporate') {
        endpoints.push({ url: `admin/users/${userId}?role=Corporate`, type: 'corporate' });
      } else {
        // Fallback: try common roles if userType is not recognized
        endpoints.push({ url: `admin/users/${userId}?role=Resident`, type: 'resident_fallback' });
        endpoints.push({ url: `admin/users/${userId}?role=Agent`, type: 'agent_fallback' });
        endpoints.push({ url: `admin/users/${userId}?role=Corporate`, type: 'corporate_fallback' });
        endpoints.push({ url: `admin/users/${userId}?role=Facility`, type: 'facility_fallback' });
      }
       
      let data;
      let lastError;
      
      for (const endpoint of endpoints) {
        try {
          const response = await api.get(endpoint.url);
          data = response.data;
          break; // If successful, break out of the loop
        } catch (error) {
          lastError = error;
          continue; // Try next endpoint
        }
      }
      
      if (!data) {
        throw lastError || new Error('All endpoints failed');
      }
      
      // Process the user details data
      const userDetailsData = {
        id: data.userId || data.id || userId,
        name: data.name || '',
        userId: data.userId || data.id || '',
        email: data.email || 'N/A',
        lga: data.lga || 'N/A',
        userType: data.userType || data.customerType || userType, // Preserve original userType
        pspCompany: data.pspCompany || 'N/A',
        status: data.status || 'Active',
        phone: data.phone || data.phoneNumber || 'N/A',
        address: data.address || 'N/A',
        subscription: data.subscription || 'N/A',
        lastLogin: data.lastLogin || 'N/A',
        expiration: data.expiration || 'N/A',
        date: data.createdAt || data.dateAdded || new Date().toISOString(),
        // Additional fields that might be specific to user types
        registrationNumber: data.registrationNumber || '',
        companyName: data.companyName || 'N/A',
        buildingName: data.buildingName || '',
        binID: data.binID || '',
        binStatus: data.binStatus || '',
        branchName: data.branchName || '',
        branchAddress: data.branchAddress || '',
        businessEmail: data.businessEmail || '',
        businessPhone: data.businessPhone || '',
        agencyName: data.agencyName || '',
        registeredApplicant: data.registeredApplicant || 'View all applicants'
      };
      
      setUserDetails(userDetailsData);
      return userDetailsData;
    } catch (error) {
      console.error('❌ Error fetching user details:', error);
      
      // Don't show notifications that might interfere with modal state
      // Just log the error and return null
      
      return null;
    } finally {
      setIsLoadingUserDetails(false);
    }
  };

  const handleViewDetails = async (report) => {
    // Set the selected user and open verification modal for viewing
    setSelectedUser(report);
    setIsViewingDetails(true);
    setVerificationModal(true);
    
    // Fetch detailed user data from the API with user type
    try {
      const detailedUserData = await fetchUserDetails(report.userId, report.userType);
      if (detailedUserData) {
        setSelectedUser(detailedUserData);
      }
    } catch (e) {
      console.error('Error fetching user details:', e);
      // Modal stays open with original data
    }
  };

  

  // Pagination Component
  const PaginationComponent = () => {
    const { page: currentPage, pages: totalPages, total } = paginationData;
    
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;

      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (startPage > 1) {
          pages.push(1);
          if (startPage > 2) {
            pages.push('...');
          }
        }

        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }

        if (endPage < totalPages) {
          if (endPage < totalPages - 1) {
            pages.push('...');
          }
          pages.push(totalPages);
        }
      }

      return pages;
    };

    const handlePageChange = (newPage) => {
      if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
        setPaginationData(prev => ({ ...prev, page: newPage }));
        // The useEffect will trigger fetchUserData when paginationData changes
      }
    };

    return (
      <div className="flex items-center justify-between mt-5">
        <div className="flex items-center text-sm text-zinc-700">
          <span>
            Page {currentPage} of {totalPages} ({total} total items)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-zinc-700 bg-zinc-300 border border-zinc-300 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-white bg-green-700 border border-zinc-300 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };



  //   Export Button logic
  const handleExport = () => {
    const headers = ['S/N', 'User ID', 'Name', 'User type', 'LGA', 'PSP Company', 'Status'];
    const escapeCsv = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value).replace(/"/g, '""');
      return /[",\n]/.test(str) ? `"${str}"` : str;
    };

    let csv = '';
    csv += headers.map(escapeCsv).join(',') + '\n';

    // Export all filtered data, not just current page
    processedReports.forEach((report, index) => {
      const row = [
        index + 1,
        report.userId || '',
        report.name || '',
        sanitizeUserType(report.userType),
        report.lga || '',
        report.pspCompany || '',
        (report.status || 'Active')
      ].map(escapeCsv).join(',');
      csv += row + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'LAWMA_User.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  useEffect(() => {
    function handleFilterOutside(event) {
      if (isOpen && filterRef.current && !filterRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleFilterOutside);
    return () => {
      document.removeEventListener('mousedown', handleFilterOutside);
    };
  }, [isOpen]);



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

                <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-semibold text-zinc-800">User Management</h1>
                    <p className="text-zinc-500 text-lg font-light">View and manage User accounts</p>
                  </div>
                </header>

                <div className="mb-6   rounded-lg ">

                  {/* Filter */}
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div ref={filterRef} className='relative'>
                      <div onClick={() => setIsOpen(prev => !prev)} className='group flex gap-2 p-2 px-4 border border-zinc-300 rounded-lg bg-white hover:text-green-700 items-center cursor-pointer'>
                        <span ><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className=' text-zinc-600 group-hover:text-green-700 transition-colors'>
                          <path d="M3.33398 4.99984C3.33398 4.5396 3.70708 4.1665 4.16732 4.1665H15.834C16.2942 4.1665 16.6673 4.5396 16.6673 4.99984C16.6673 5.46007 16.2942 5.83317 15.834 5.83317H4.16732C3.70708 5.83317 3.33398 5.46007 3.33398 4.99984Z" fill="currentColor" />
                          <path d="M5.00065 9.99984C5.00065 9.5396 5.37375 9.1665 5.83398 9.1665H14.1673C14.6276 9.1665 15.0007 9.5396 15.0007 9.99984C15.0007 10.4601 14.6276 10.8332 14.1673 10.8332H5.83398C5.37375 10.8332 5.00065 10.4601 5.00065 9.99984Z" fill="currentColor" />
                          <path d="M7.50065 14.1665C7.04041 14.1665 6.66732 14.5396 6.66732 14.9998C6.66732 15.4601 7.04041 15.8332 7.50065 15.8332H12.5007C12.9609 15.8332 13.334 15.4601 13.334 14.9998C13.334 14.5396 12.9609 14.1665 12.5007 14.1665H7.50065Z" fill="currentColor" />
                        </svg>
                        </span>
                        <p> Filter</p>
                      </div>
                      {isOpen && (
                        <div className='absolute z-20 mt-2 w-72 p-4 bg-white rounded-lg shadow-lg border border-zinc-200'>
                          <div className='mb-3'>
                            <label className='block text-sm text-zinc-600 mb-1'>User type</label>
                            <select value={filterReportType} onChange={(e) => setFilterReportType(e.target.value)} className='w-full p-2 border border-zinc-300 rounded-lg bg-white focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700'>
                              <option value="All">All</option>
                              <option value="resident">Resident</option>
                              <option value="facility manager">Facility Manager</option>
                              <option value="facility">Facility</option>
                              <option value="corporate">Corporate</option>
                              <option value="agent">Agent</option>
                            </select>
                          </div>
                          <div className='mb-3'>
                            <label className='block text-sm text-zinc-600 mb-1'>Status</label>
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className='w-full p-2 border border-zinc-300 rounded-lg bg-white focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700'>
                              <option value="All">All</option>
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          </div>
                          <div className='mb-4'>
                            <label className='block text-sm text-zinc-600 mb-1'>Date</label>
                            <input type='date' value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className='w-full p-2 border border-zinc-300 rounded-lg bg-white focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700' />
                          </div>
                          <div className='flex justify-between gap-2'>
                            <button type='button' className='px-3 py-2 text-sm text-zinc-600 hover:text-green-700' onClick={() => setIsOpen(false)}>Close</button>
                            <button type='button' className='px-3 py-2 text-sm text-zinc-600 hover:text-green-700' onClick={() => { setFilterReportType('All'); setFilterStatus('All'); setFilterDate(''); }}>Clear</button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Search box */}
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


                    {/* Export button */}
                    <button className='text-sm text-zinc-600 hover:text-green-700 hover:border-green- md:ml-auto p-2 px-4 border border-gray-300 rounded-lg bg-white' onClick={() => handleExport()}>Export data</button>
                  </div>
                </div>

                <div className="  overflow-x-auto">

                  {isLoading ? (
                    <SkeletonLoader />
                  ) : processedReports.length === 0 ? (


                    <div className="flex flex-col justify-center items-center mt-50">

                      <div className="max-w-xl w-full flex flex-col items-center justify-center text-center">
                        <h2 className="text-xl mb-1 sans">No active account at this time</h2>
                        <p className="text-zinc-400  mt-2 font-light">
                          There are no accounts to show
                        </p>
                      </div>

                    </div>
                  ) : (
                    <div className="bg-white border border-zinc-200 rounded-xl overflow-x-auto">
                      <table className="w-full table-auto border-collapse">
                        <thead>
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700">S/N</th>
                            {tableHeaders.map(header => (
                              <th
                                key={header.key}
                                className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer"
                                onClick={() => header.sortable && requestSort(header.key)}
                              >
                                <div className="flex items-center">
                                  {header.label}
                                  {header.sortable && <SortIcon columnKey={header.key} />}
                                </div>
                              </th>
                            ))}
                            <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {processedReports.map((report, index) => (
                            <tr key={report.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                              <td className="px-4 py-3 text-sm text-zinc-900 whitespace-nowrap">{index + 1}.</td>
                              <td className="px-4 py-3 text-sm text-zinc-900 whitespace-nowrap">
                                {report.userId}
                              </td>
                              <td className="px-4 py-3 text-sm text-zinc-900 whitespace-nowrap">
                                {report.name}
                              </td>
                              <td className="px-4 py-3 text-sm text-zinc-700 whitespace-nowrap">
                                {sanitizeUserType(report.userType)}
                              </td>
                              <td className="px-4 py-3 text-sm text-zinc-700 whitespace-nowrap">
                                {report.lga}
                              </td>
                              <td className="px-4 py-3 text-sm text-zinc-700 whitespace-nowrap">
                                {report.pspCompany}
                              </td>
                              <td className="px-4 py-3 text-sm whitespace-nowrap">
                                {(() => {
                                  const s = (report.status || '').toLowerCase();
                                  const map = {
                                    active: { text: 'Active', color: 'text-green-600', font: "bold" },
                                    inactive: { text: 'Inactive', color: 'text-red-600', font: "bold" },
                                  };
                                  const statusConf = map[s] || { text: 'Active', color: 'text-green-600', bgColor: 'bg-green-100' };
                                  return (
                                    <div className={`inline-flex px-2 py-1 rounded ${statusConf.bgColor} ${statusConf.color}`}>
                                      {report.status ? (statusConf.text) : 'Active'}
                                    </div>
                                  );
                                })()}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <a
                                  onClick={() => handleViewDetails(report)}
                                  className="cursor-pointer hover:text-green-800 text-sm"
                                >
                                  View details
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>


                {/* Verification Modal Resident*/}
                {verificationModal && selectedUser && (selectedUser.userType === 'Resident' || selectedUser.userType === 'resident') && (
                  <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
                    <div className="bg-white rounded-2xl shadow-xl px-8 py-12 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-semibold text-zinc-800">User Details</h3>
                        <button
                          onClick={() => { setVerificationModal(false); setIsViewingDetails(false); setUserDetails(null); }}
                          className="text-zinc-400 hover:text-zinc-600"
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>

                      {isLoadingUserDetails ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
                            <p className="text-zinc-600">Loading user details...</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                        <div className="">
                          <div className="grid grid-cols-1 gap-4">
                            {[
                              { label: "User ID", value: (userDetails || selectedUser).userId },
                              { label: "Name", value: (userDetails || selectedUser).name },
                              { label: "LGA", value: (userDetails || selectedUser).lga },
                              { label: "Address", value: (userDetails || selectedUser).address },
                              { label: "Email", value: (userDetails || selectedUser).email },
                              { label: "Phone number", value: (userDetails || selectedUser).phone },
                              { label: "Customer Type", value: (userDetails || selectedUser).userType },
                              { label: "PSP Company", value: (userDetails || selectedUser).pspCompany },
                              { label: "Subscription", value: (userDetails || selectedUser).subscription },
                              { label: "Status", value: (userDetails || selectedUser).status },
                              { label: "Last Login", value: (userDetails || selectedUser).lastLogin },
                            ].map((field) => (
                              <div key={field.label} className="flex justify-between items-center gap-4">
                                <label className="block text-sm font-medium text-zinc-600 mb-1">
                                  {field.label}
                                </label>
                                <div className="flex items-center gap-3">
                                  {field.label === "Status" ? (
                                    <span
                                      className={`px-3 py-1 rounded-full text-sm font-medium 
                      ${field.value?.toLowerCase() === "active"
                                          ? "text-green-700"
                                          : "text-red-700"
                                        }`}
                                    >
                                      {field.value}
                                    </span>
                                  ) : field.label === "Subscription" ? (
                                    <div className="flex items-center gap-2">
                                      <p className="text-zinc-900">{field.value}</p>
                                      <span className="text-sm text-green-700">
                                        ({(userDetails || selectedUser).expiration})
                                      </span>
                                    </div>
                                  ) : (
                                    <p className="text-zinc-900">{field.value}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Verification Modal for Facility Manager */}
                {verificationModal && selectedUser && (() => {
                  const userType = selectedUser.userType?.toLowerCase();
                  return userType === 'facility manager' || 
                         userType === 'facility_manager' || 
                         userType === 'facilitymanager' ||
                         userType === 'facility';
                })() && (
                  <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
                    <div className="bg-white rounded-2xl shadow-xl px-8 py-12 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-semibold text-zinc-800">User Details</h3>
                        <button
                          onClick={() => { setVerificationModal(false); setIsViewingDetails(false); setUserDetails(null); }}
                          className="text-zinc-400 hover:text-zinc-600"
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>

                      {isLoadingUserDetails ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
                            <p className="text-zinc-600">Loading user details...</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                        <div className="">
                          <div className="grid grid-cols-1 gap-4">
                            {[
                              { label: "User ID", value: (userDetails || selectedUser).userId },
                              { label: "Name", value: (userDetails || selectedUser).name },
                              { label: "LGA", value: (userDetails || selectedUser).lga },
                              { label: "Address", value: (userDetails || selectedUser).address },
                              { label: "Email", value: (userDetails || selectedUser).email },
                              { label: "Phone number", value: (userDetails || selectedUser).phone },
                              { label: "Customer Type", value: (userDetails || selectedUser).userType },
                              { label: "PSP Company", value: (userDetails || selectedUser).pspCompany },
                              { label: "Subscription", value: (userDetails || selectedUser).subscription },
                              { label: "Status", value: (userDetails || selectedUser).status },
                              { label: "Last Login", value: (userDetails || selectedUser).lastLogin },
                              { label: "Registered applicant", value: (userDetails || selectedUser).registeredApplicant || "View all applicants", action: "view all" },
                              //   { label: "Building Name", value: selectedUser.buildingName },
                              //   { label: "Bin ID", value: selectedUser.binID },
                              //   { label: "Bin Status", value: selectedUser.binStatus },
                              //   { label: "Branch Name", value: selectedUser.branchName },
                              //   { label: "Branch Address", value: selectedUser.branchAddress },
                            ].map((field) => (
                              <div key={field.label} className="flex justify-between items-center gap-4">
                                <label className="block text-sm font-medium text-zinc-600 mb-1">
                                  {field.label}
                                </label>
                                <div className="flex items-center gap-3">

                                  <div className="flex items-center gap-3">
                                    {field.label === "Status" ? (
                                      <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium 
                      ${field.value?.toLowerCase() === "active"
                                            ? "text-green-700"
                                            : "text-red-700"
                                          }`}
                                      >
                                        {field.value}
                                      </span>
                                    ) : field.label === "Subscription" ? (
                                      <div className="flex items-center gap-2">
                                        <p className="text-zinc-900">{field.value}</p>
                                        <span className="text-sm text-green-700">
                                          ({(userDetails || selectedUser).expiration})
                                        </span>
                                      </div>
                                    ) : (
                                      <p className="text-zinc-900">{field.value}</p>
                                    )}
                                  </div>
                                  {field.action === 'view all' && (selectedUser) && (
                                    <Link
                                      to={`/user-management/${selectedUser.userId}`}
                                      state={{ userData: selectedUser }}
                                      className="text-zinc-500 hover:text-green-700 hover:underline"
                                      onClick={() => {
                                        
                                        // Validate userId before navigation
                                        if (!selectedUser.userId) {
                                          console.error('❌ User ID is undefined, cannot navigate');
                                          showNotification('User ID not found, cannot navigate', 'error');
                                          return;
                                        }
                                        
                                        // Close the modal before navigating
                                        setVerificationModal(false);
                                        setIsViewingDetails(false);
                                        setUserDetails(null);
                                      }}
                                    >
                                      View all
                                    </Link>
                                  )}

                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Verification Modal for Agent */}
                {verificationModal && selectedUser && (selectedUser.userType === 'Agent' || selectedUser.userType === 'agent') && (
                  <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
                    <div className="bg-white rounded-2xl shadow-xl px-8 py-12 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-semibold text-zinc-800">User Details</h3>
                        <button
                          onClick={() => { setVerificationModal(false); setIsViewingDetails(false); setUserDetails(null); }}
                          className="text-zinc-400 hover:text-zinc-600"
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>

                      {isLoadingUserDetails ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
                            <p className="text-zinc-600">Loading user details...</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                        <div className="">
                          <div className="grid grid-cols-1 gap-4">
                            {[
                              { label: "User ID", value: (userDetails || selectedUser).userId },
                              { label: "Name", value: (userDetails || selectedUser).name },
                              { label: "LGA", value: (userDetails || selectedUser).lga },
                              { label: "Address", value: (userDetails || selectedUser).address },
                              { label: "Email", value: (userDetails || selectedUser).email },
                              { label: "Phone Number", value: (userDetails || selectedUser).phone },
                              { label: "User Type", value: (userDetails || selectedUser).userType },
                              { label: "PSP Company", value: (userDetails || selectedUser).pspCompany },
                              { label: "Subscription", value: (userDetails || selectedUser).subscription },
                              { label: "Status", value: (userDetails || selectedUser).status },
                              { label: "Last Login", value: (userDetails || selectedUser).lastLogin },
                              { label: "Registered applicant", value: (userDetails || selectedUser).registeredApplicant, action: "view all" },
                              // { label: "Registration Number", value: selectedUser.registrationNumber },
                            ].map((field) => (
                              <div key={field.label} className="flex justify-between items-center gap-4">
                                <label className="block text-sm font-medium text-zinc-600 mb-1">
                                  {field.label}
                                </label>
                                <div className="flex items-center gap-3">

                                  <div className="flex items-center gap-3">
                                    {field.label === "Status" ? (
                                      <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium 
                      ${field.value?.toLowerCase() === "active"
                                            ? "text-green-700"
                                            : "text-red-700"
                                          }`}
                                      >
                                        {field.value}
                                      </span>
                                    ) : field.label === "Subscription" ? (
                                      <div className="flex items-center gap-2">
                                        <p className="text-zinc-900">{field.value}</p>
                                        <span className="text-sm text-green-700">
                                          ({(userDetails || selectedUser).expiration})
                                        </span>
                                      </div>
                                    ) : (
                                      <p className="text-zinc-900">{field.value}</p>
                                    )}
                                  </div>
                                  {field.action === 'view all' && (selectedUser) && (
                                    <Link
                                      to={`/user-management/${selectedUser.userId}`}
                                      state={{ userData: selectedUser }}
                                      className="text-zinc-500 hover:text-green-700 hover:underline"
                                      onClick={() => {
                                        
                                        // Validate userId before navigation
                                        if (!selectedUser.userId) {
                                          console.error('❌ User ID is undefined, cannot navigate');
                                          showNotification('User ID not found, cannot navigate', 'error');
                                          return;
                                        }
                                        
                                        // Close the modal before navigating
                                        setVerificationModal(false);
                                        setIsViewingDetails(false);
                                        setUserDetails(null);
                                      }}
                                    >
                                      View all
                                    </Link>
                                  )}

                                </div>
                              </div>
                            ))}
                          </div>
                        </div>


                      </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Verification Modal for Corporate*/}
                {verificationModal && selectedUser && (selectedUser.userType === 'Corporate' || selectedUser.userType === 'corporate') && (
                  <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
                    <div className="bg-white rounded-2xl shadow-xl px-8 py-12 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-semibold text-zinc-800">User Details</h3>
                        <button
                          onClick={() => { setVerificationModal(false); setIsViewingDetails(false); setUserDetails(null); }}
                          className="text-zinc-400 hover:text-zinc-600"
                        >
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </div>

                      {isLoadingUserDetails ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
                            <p className="text-zinc-600">Loading user details...</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                        <div className="">
                          <div className="grid grid-cols-1 gap-4">
                            {[
                              { label: "User ID", value: (userDetails || selectedUser).userId },
                              { label: "Company Name", value: (userDetails || selectedUser).companyName },
                              { label: "Company Email address", value: (userDetails || selectedUser).email },
                              { label: "Business Phone number", value: (userDetails || selectedUser).phone },
                              { label: "LGA", value: (userDetails || selectedUser).lga },
                              { label: "Company Address", value: (userDetails || selectedUser).address },
                              { label: "Customer Type", value: (userDetails || selectedUser).userType },
                              { label: "PSP Company", value: (userDetails || selectedUser).pspCompany },
                              { label: "Subscription", value: (userDetails || selectedUser).subscription },
                              { label: "Status", value: (userDetails || selectedUser).status },
                              { label: "Last Login", value: (userDetails || selectedUser).lastLogin },
                              // { label: "Registered applicant", value: selectedUser.registeredApplicant, action: "view all" },
                            ].map((field) => (
                              <div key={field.label} className="flex justify-between items-center gap-4">
                                <label className="block text-sm font-medium text-zinc-600 mb-1">
                                  {field.label}
                                </label>
                                <div className="flex items-center gap-3">

                                  <div className="flex items-center gap-3">
                                    {field.label === "Status" ? (
                                      <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium 
                      ${field.value?.toLowerCase() === "active"
                                            ? "text-green-700"
                                            : "text-red-700"
                                          }`}
                                      >
                                        {field.value}
                                      </span>
                                    ) : field.label === "Subscription" ? (
                                      <div className="flex items-center gap-2">
                                        <p className="text-zinc-900">{field.value}</p>
                                        <span className="text-sm text-green-700">
                                          ({(userDetails || selectedUser).expiration})
                                        </span>
                                      </div>
                                    ) : (
                                      <p className="text-zinc-900">{field.value}</p>
                                    )}
                                  </div>
                                  {/* {field.action === 'view all' && (selectedUser) && (
                                    <Link
                                      to={`/user-management/${selectedUser.userId}`}
                                      className="text-zinc-500 hover:text-green-700 hover:underline"
                                      onClick={() => {
                                      }}
                                    >
                                      View all
                                    </Link>
                                  )} */}

                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                      )}
                    </div>
                  </div>
                )}


                <PaginationComponent />
                
              </div>



            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
