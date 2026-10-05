import React, { useState, useEffect, useMemo, useRef } from 'react';
import Sidebar from '../components/LawmaAdmin/Sidebar';
import Topbar from '../components/LawmaAdmin/Topbar';
import api from '../api/apiConfig';
import { useNavigate } from 'react-router-dom';
import ActorModals from '../components/LawmaAdmin/AdminKYC/ActorModals';
import SkeletonLoader from '../components/SkeletonLoader';
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  XMarkIcon,
  CheckCircleIconSolid,
  ExclamationTriangleIconSolid
} from '../components/icons';
import { showToast } from '../stores/toastStore';






const formatGenerationDate = (isoDateString) => {
  if (!isoDateString) return 'N/A';
  try {
    const date = new Date(isoDateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  } catch (e) {
    console.log(e);
    return 'Invalid Date';
  }
};

const sanitizeUserType = (value) => {
  if (!value && value !== 0) return '';
  return String(value).trim().replace(/\.+$/, '');
};



// Main Component
const KYC = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const navigate = useNavigate();




  const [searchTerm, setSearchTerm] = useState('');
  const [filterReportType, setFilterReportType] = useState('All');
  const [filterDate, setFilterDate] = useState('');

  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });

  const [newReportName, setNewReportName] = useState('');
  const [newReportType, setNewReportType] = useState('');
  const [newReportStartDate, setNewReportStartDate] = useState('');
  const [newReportEndDate, setNewReportEndDate] = useState('');


  const fetchKYCAPI = async (tab = activeTab, page = 1) => {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/lawma/kycs?status=${tab}&page=${page}&limit=${limit}`);
      console.log("KYC data", data);
      
      if (data && data.data && Array.isArray(data.data)) {
        const reportList = data.data.map((item) => ({
          id: item._id || item.id,
          // Map API fields into the same shape used in the UI
          userType: item.userType,
          applicant: item.userId ? `${item.userId.firstName} ${item.userId.lastName}` : 'N/A',
          email: item.userId ? item.userId.email : 'N/A',
          date: item.createdAt,
          // Preserve all original fields for modal usage
          ...item
        }));
        setReports(reportList);
        
        if (data.paging) {
          setCurrentPage(Number(data.paging.page) || 1);
          setTotalPages(Number(data.paging.pages) || 1);
        } else {
          setCurrentPage(1);
          setTotalPages(1);
        }
      } else {
        console.error('API returned unexpected response structure:', data);
        setReports([]);
        setCurrentPage(1);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching KYC data:', error);
      setReports([]);
      setCurrentPage(1);
      setTotalPages(1);
      showNotification('Failed to fetch KYC data', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchKYCAPI(activeTab, newPage);
    }
  };

  useEffect(() => {
    fetchKYCAPI(activeTab, 1);
  }, [activeTab]);

  const showNotification = (message, type = 'success') => {
    showToast(message, type);
  };

  const processedReports = useMemo(() => {
    let filtered = [...reports];
    if (searchTerm) {
      filtered = filtered.filter(report =>
        (report.applicant || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.userType || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterReportType !== 'All') {
      filtered = filtered.filter(report => normalizeUserType(report.userType) === filterReportType);
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

  const formatPeriod = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const result = `${start.toLocaleDateString('en-US', { month: 'long' })} ${start.toLocaleDateString('en-US', { day: '2-digit' })} - ${end.toLocaleDateString('en-US', { month: 'long' })} ${end.toLocaleDateString('en-US', { day: '2-digit' })}`;
    return result;
  }



  const fetchData = () => {
    try {

    } catch (error) {

    }
  }

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
    { key: 'date', label: 'Date', sortable: true },
    { key: 'applicant', label: 'Applicant Name', sortable: true },
    { key: 'userType', label: 'User type', sortable: true },
    { key: 'email', label: 'Email Address', sortable: true },
    { key: 'details', label: 'Details', sortable: false },
  ];

  const [verificationModal, setVerificationModal] = useState(false);
  const [rejectionModal, setRejectionModal] = useState(false);
  const [membersModal, setMembersModal] = useState(false);
  const [userDetail, setUserDetail] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const filterRef = useRef();
  const [isNinVerifyOpen, setIsNinVerifyOpen] = useState(false);
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);

  function normalizeUserType(rawType) {
    const value = sanitizeUserType(rawType).toLowerCase();
    if (!value) return '';
    if (['facility manager', 'facility_manager', 'facilitymanager', 'facility'].includes(value)) return 'facility manager';
    if (['resident'].includes(value)) return 'resident';
    if (['corporate', 'corporate customer', 'corporate_user'].includes(value)) return 'corporate';
    if (['agent', 'field agent'].includes(value)) return 'agent';
    return value;
  }

  const triggerVerificationForUser = (user) => {
    const normalizedType = normalizeUserType(user?.userType);
    const supportedTypes = ['facility manager', 'resident', 'corporate', 'agent'];
    if (!supportedTypes.includes(normalizedType)) {
      showNotification('Unsupported user type for verification', 'error');
      return;
    }
    setSelectedUser(user);
    setIsViewingDetails(false);
    setVerificationModal(true);
  };


  const fetchDetailedKYCData = async (kycId) => {
    try {
      const { data } = await api.get(`/lawma/kycs/${kycId}`);
      console.log("Detailed KYC data", data);
      
      // Handle the response structure - data is nested under 'data' property
      if (data && data.data) {
        return data.data;
      } else if (data) {
        return data;
      } else {
        console.error('Unexpected response structure:', data);
        return null;
      }
    } catch (error) {
      console.error('Error fetching detailed KYC data:', error);
      showNotification('Failed to fetch detailed KYC data', 'error');
      return null;
    }
  };

  const handleViewDetails = async (report) => {
    try {
      // Fetch detailed KYC data
      const kycId = report.id || report._id;
      const detailedData = await fetchDetailedKYCData(kycId);
      if (detailedData) {
        // Merge the detailed data with the existing report data
        const enrichedReport = {
          ...report,
          ...detailedData,
          id: kycId || detailedData._id,
          _id: kycId || detailedData._id
        };
        setSelectedUser(enrichedReport);
        setIsViewingDetails(true);
        setVerificationModal(true);
      } else {
        // Fallback to basic report data if detailed fetch fails
        setSelectedUser(report);
        setIsViewingDetails(true);
        setVerificationModal(true);
      }
    } catch (e) {
      console.error(e);
      showNotification('Unable to open details', 'error');
    }
  };

  const handleVerifyUser = async (user) => {
    try {
      // Fetch detailed KYC data before opening verification modal
      const kycId = user.id || user._id;
      const detailedData = await fetchDetailedKYCData(kycId);
      if (detailedData) {
        // Merge the detailed data with the existing user data
        const enrichedUser = {
          ...user,
          ...detailedData,
          id: kycId || detailedData._id,
          _id: kycId || detailedData._id
        };
        triggerVerificationForUser(enrichedUser);
      } else {
        // Fallback to basic user data if detailed fetch fails
        triggerVerificationForUser(user);
      }
    } catch (e) {
      console.error(e);
      showNotification('Unable to open verification modal', 'error');
    }
  };

  const handleApproveUser = async (user) => {
    try {
      const kycId = user?.id || user?._id;
      if (!kycId) {
        showNotification('User ID not found for approval', 'error');
        return;
      }
      console.log('Approving user with ID:', kycId);
      console.log('API endpoint:', `/lawma/kycs/${kycId}/approve`);
      const { data } = await api.patch(`/lawma/kycs/${kycId}/approve`);
      console.log('Approval response:', data);
      if (data) {
        const displayName = (user.applicant && user.applicant !== 'N/A') ? user.applicant : (user.userType || 'User');
        showNotification(`User ${displayName} has been approved`, 'success');
        setVerificationModal(false);
        fetchKYCAPI(activeTab);
      } else {
        showNotification('Approval failed', 'error');
      }
    } catch (e) {
      console.error('Error approving user:', e);
      console.error('Error response:', e.response?.data);
      console.error('Error status:', e.response?.status);
      showNotification(`Approval failed: ${e.response?.data?.message || e.message}`, 'error');
    }
  };

  const handleRejectUser = async (user) => {
    try {
      const kycId = user?.id || user?._id;
      if (!kycId) {
        showNotification('User ID not found for rejection', 'error');
        return;
      }
      console.log('Rejecting user with ID:', kycId);
      console.log('API endpoint:', `/lawma/kycs/${kycId}/reject`);
      const { data } = await api.patch(`/lawma/kycs/${kycId}/reject`, {
        reason: rejectionReason || 'No reason provided'
      });
      console.log('Rejection response:', data);
      if (data) {
        const displayName = (user.applicant && user.applicant !== 'N/A') ? user.applicant : (user.userType || 'User');
        showNotification(`User ${displayName} has been rejected`, 'success');
        setVerificationModal(false);
        fetchKYCAPI(activeTab);
      } else {
        showNotification('Rejection failed', 'error');
      }
    } catch (e) {
      console.error('Error rejecting user:', e);
      console.error('Error response:', e.response?.data);
      console.error('Error status:', e.response?.status);
      showNotification(`Rejection failed: ${e.response?.data?.message || e.message}`, 'error');
    }
  };

  const HandleRejectModal = async () => {
    try {
      // Optionally pass rejectionReason to API when integrated
      await handleRejectUser(selectedUser);
      setRejectionModal(false);
      setRejectionReason('');
    } catch (e) {
      // Error already handled in handleRejectUser
    }
  };

  const handleOpenNinVerify = () => {
    setIsNinVerifyOpen(true);
  };
  const handleCloseNinVerify = () => {
    setIsNinVerifyOpen(false);
  };
  const handleVerifyNin = async () => {
    try {
      const kycId = selectedUser?.id || selectedUser?._id;
      if (!kycId) {
        showNotification('No active user selected for verification', 'error');
        return;
      }
      
      console.log('Verifying NIN for KYC:', kycId);
      const { data } = await api.patch(`/lawma/kycs/${kycId}/verify-nin`);
      console.log('NIN verification response:', data);
      
      if (data) {
        showNotification('NIN verified successfully', 'success');
        setIsNinVerifyOpen(false);
        fetchKYCAPI(activeTab);
        
        // Refresh the selected user details to show updated status
        const detailedData = await fetchDetailedKYCData(kycId);
        if (detailedData) {
          const enrichedUser = { ...selectedUser, ...detailedData };
          setSelectedUser(enrichedUser);
          
          if (selectedMember) {
            // Also refresh selected member in state if it's a corporate member
            const updatedMember = enrichedUser.members?.find(
              m => m.id === selectedMember.id || m._id === selectedMember._id
            );
            if (updatedMember) {
              setSelectedMember(updatedMember);
            }
          }
        }
      } else {
        showNotification('NIN verification failed', 'error');
      }
    } catch (e) {
      console.error('Error verifying NIN:', e);
      showNotification(`NIN verification failed: ${e.response?.data?.message || e.message}`, 'error');
    }
  };
  const handleOpenDocViewer = (documentUrl, documentName) => {
    if (!documentUrl) {
      showNotification('No document available', 'error');
      return;
    }

    const documentType = getDocumentType(documentUrl);
    setCurrentDocument({
      url: documentUrl,
      name: documentName || 'Document',
      type: documentType
    });
    setIsDocViewerOpen(true);
  };

  const handleCloseDocViewer = () => {
    setIsDocViewerOpen(false);
    setCurrentDocument(null);
  };

  const getDocumentType = (url) => {
    if (!url) return 'pdf';
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
      return 'image';
    }
    return 'pdf';
  };

  const getNinDocUrl = (user) => {
    if (!user) return '';
    // Check for both ninDoc and idDocument fields
    const value = user.ninDoc || user.idDocument || user.documentUrl;
    if (!value) return '';
    if (/^https?:\/\//i.test(value)) return value;
    return `/images/${value}`;
  };

  const getMembersList = (user) => {
    if (!user) return [];
    const arrays = [user.members, user.signatories, user.signatoryList];
    const list = arrays.find((arr) => Array.isArray(arr));
    return Array.isArray(list) ? list : [];
  };

  const getAgentCertUrl = (user) => {
    if (!user || (!user.AgentCertificate && !user.agentCertificate)) return '';
    const value = user.AgentCertificate || user.agentCertificate;
    if (/^https?:\/\//i.test(value)) return value;
    return `/images/${value}`;
  };

  const getVerificationStatus = () => {
    switch (activeTab) {
      case 'pending':
        return { text: 'Pending', color: 'text-yellow-700', bgColor: 'bg-yellow-50 border border-yellow-200' };
      case 'approved':
        return { text: 'Verified', color: 'text-green-700', bgColor: 'bg-green-50 border border-green-200' };
      case 'rejected':
        return { text: 'Rejected', color: 'text-red-700', bgColor: 'bg-red-50 border border-red-200' };
      default:
        return { text: 'Unknown', color: 'text-gray-700', bgColor: 'bg-gray-50 border border-gray-200' };
    }
  };

  const isNinVerified = (user) => {
    if (!user) return false;
    return (
      user.ninVerified === true ||
      user.ninVerificationProviderStatus === 'verified' ||
      user.identityVerificationStatus === 'verified'
    );
  };

  const handleExport = () => {
    const headers = ['S/N', 'Date', 'Applicant Name', 'User type', 'Email Address'];
    const escapeCsv = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value).replace(/"/g, '""');
      return /[",\n]/.test(str) ? `"${str}"` : str;
    };

    let csv = '';
    csv += headers.map(escapeCsv).join(',') + '\n';

    processedReports.forEach((report, index) => {
      const row = [
        index + 1,
        formatGenerationDate(report.date),
        report.applicant || '',
        sanitizeUserType(report.userType),
        report.email || ''
      ].map(escapeCsv).join(',');
      csv += row + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'LAWMA_KYC.csv');
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

                <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-semibold text-zinc-800">KYC Request</h1>
                    <p className="text-zinc-500 text-lg font-light">View and manage User verification</p>
                  </div>
                </header>

                <div className="mb-6   rounded-lg ">

                  {/* Active selection */}
                  <div className='inline-flex gap-7 text-lg mb-7 border-b border-zinc-200'>
                    <button
                      type="button"
                      className={`relative pb-2 -mb-[2px] transition-colors duration-300 ease-out
                        after:content-["\""] after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-full after:bg-green-700
                        after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out
                        ${activeTab === 'pending'
                          ? 'text-green-700 after:scale-x-100'
                          : 'text-zinc-500 hover:text-zinc-700 after:scale-x-0'
                        }`}
                      onClick={() => setActiveTab('pending')}
                    >
                      Pending requests
                    </button>
                    <button
                      type="button"
                      className={`relative pb-2 -mb-[2px] transition-colors duration-300 ease-out
                        after:content-["\""] after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-full after:bg-green-700
                        after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out
                        ${activeTab === 'approved'
                          ? 'text-green-700 after:scale-x-100'
                          : 'text-zinc-500 hover:text-zinc-700 after:scale-x-0'
                        }`}
                      onClick={() => setActiveTab('approved')}
                    >
                      Approved
                    </button>
                    <button
                      type="button"
                      className={`relative pb-2 -mb-[2px] transition-colors duration-300 ease-out
                        after:content-["\""] after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-full after:bg-green-700
                        after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out
                        ${activeTab === 'rejected'
                          ? 'text-green-700 after:scale-x-100'
                          : 'text-zinc-500 hover:text-zinc-700 after:scale-x-0'
                        }`}
                      onClick={() => setActiveTab('rejected')}
                    >
                      Rejected
                    </button>
                  </div>

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
                              <option value="corporate">Corporate</option>
                              <option value="agent">Agent</option>
                            </select>
                          </div>
                          <div className='mb-4'>
                            <label className='block text-sm text-zinc-600 mb-1'>Date</label>
                            <input type='date' value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className='w-full p-2 border border-zinc-300 rounded-lg bg-white focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700' />
                          </div>
                          <div className='flex justify-between gap-2'>
                            <button type='button' className='px-3 py-2 text-sm text-zinc-600 hover:text-green-700' onClick={() => setIsOpen(false)}>Close</button>
                            <button type='button' className='px-3 py-2 text-sm text-zinc-600 hover:text-green-700' onClick={() => { setFilterReportType('All'); setFilterDate(''); }}>Clear</button>
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
                    <button className='text-sm text-zinc-600 hover:text-green-700 hover:border-green- md:ml-auto p-2 px-4 border border-gray-300 rounded-lg bg-white' onClick={()=> handleExport()}>Export data</button>
                  </div>
                </div>

                <div className="overflow-x-auto my-8">
                  {isLoading ? (
                    <SkeletonLoader />
                  ) : processedReports.length === 0 ? (
                    <div className="flex flex-col justify-center items-center mt-20">
                      <div className="max-w-xl w-full flex flex-col items-center justify-center text-center">
                        <h2 className="text-xl mb-1 sans">No KYC available</h2>
                        <p className="text-zinc-400 mt-2 font-light">
                          There are no KYC data to show
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-zinc-200 rounded-xl overflow-x-auto">
                      <table className="w-full table-auto border-collapse">
                        <thead>
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer">
                              <div className="flex items-center">S/N</div>
                            </th>
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
                            <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700">
                              <div className="flex items-center">Action</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {processedReports.map((report, index) => (
                            <tr key={report.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                              <td className="px-4 py-3 text-sm text-zinc-900 whitespace-nowrap">
                                {index + 1}.
                              </td>
                              <td className="px-4 py-3 text-sm text-zinc-900 whitespace-nowrap">
                                {formatGenerationDate(report.date)}
                              </td>
                              <td className="px-4 py-3 text-sm text-zinc-900 whitespace-nowrap">
                                {report.applicant}
                              </td>
                              <td className="px-4 py-3 text-sm text-zinc-700 whitespace-nowrap">
                                {sanitizeUserType(report.userType)}
                              </td>
                              <td className="px-4 py-3 text-sm text-zinc-700 whitespace-nowrap">
                                {report.email}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <a
                                  onClick={() => handleViewDetails(report)}
                                  className="cursor-pointer hover:text-green-800 text-sm"
                                >
                                  View details
                                </a>
                              </td>
                              <td className="px-4 py-3 text-sm text-zinc-700 whitespace-nowrap">
                                {activeTab === 'pending' && (
                                  <button
                                    onClick={() => handleVerifyUser(report)}
                                    type="button"
                                    className="px-3 py-2 rounded-lg bg-green-700 text-white hover:bg-green-600 transition-colors"
                                    title={`Verify user ${report.applicant}`}
                                  >
                                    Verify User
                                  </button>
                                )}
                                {activeTab === 'approved' && (
                                  <span className="px-3 py-2 rounded-lg bg-green-100 text-green-700 font-medium">
                                    Approved
                                  </span>
                                )}
                                {activeTab === 'rejected' && (
                                  <span className="px-3 py-2 rounded-lg bg-red-100 text-red-700 font-medium">
                                    Rejected
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-zinc-200 bg-white px-4 py-4 sm:px-6 rounded-b-xl">
                          <div className="flex flex-1 justify-between sm:hidden">
                            <button
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                              className={`relative inline-flex items-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              Previous
                            </button>
                            <button
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className={`relative ml-3 inline-flex items-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              Next
                            </button>
                          </div>
                          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                              <p className="text-sm text-zinc-700">
                                Showing page <span className="font-semibold text-green-700">{currentPage}</span> of{' '}
                                <span className="font-semibold text-zinc-800">{totalPages}</span>
                              </p>
                            </div>
                            <div>
                              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <button
                                  onClick={() => handlePageChange(currentPage - 1)}
                                  disabled={currentPage === 1}
                                  className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-zinc-400 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 focus:z-20 focus:outline-offset-0 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  <span className="sr-only">Previous</span>
                                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                
                                {Array.from({ length: totalPages }, (_, index) => {
                                  const pageNumber = index + 1;
                                  return (
                                    <button
                                      key={pageNumber}
                                      onClick={() => handlePageChange(pageNumber)}
                                      aria-current={currentPage === pageNumber ? 'page' : undefined}
                                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 ${currentPage === pageNumber ? 'z-10 bg-green-700 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700' : 'text-zinc-900 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 focus:outline-offset-0'}`}
                                    >
                                      {pageNumber}
                                    </button>
                                  );
                                })}

                                <button
                                  onClick={() => handlePageChange(currentPage + 1)}
                                  disabled={currentPage === totalPages}
                                  className={`relative inline-flex items-center rounded-r-md px-3 py-2 text-zinc-400 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 focus:z-20 focus:outline-offset-0 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  <span className="sr-only">Next</span>
                                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </nav>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>




                {/* All Modals */}
                <ActorModals
                  verificationModal={verificationModal}
                  setVerificationModal={setVerificationModal}
                  rejectionModal={rejectionModal}
                  setRejectionModal={setRejectionModal}
                  membersModal={membersModal}
                  setMembersModal={setMembersModal}
                  userDetail={userDetail}
                  setUserDetail={setUserDetail}
                  isNinVerifyOpen={isNinVerifyOpen}
                  setIsNinVerifyOpen={setIsNinVerifyOpen}
                  isDocViewerOpen={isDocViewerOpen}
                  setIsDocViewerOpen={setIsDocViewerOpen}
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                  selectedMember={selectedMember}
                  setSelectedMember={setSelectedMember}
                  currentDocument={currentDocument}
                  setCurrentDocument={setCurrentDocument}
                  rejectionReason={rejectionReason}
                  setRejectionReason={setRejectionReason}
                  isViewingDetails={isViewingDetails}
                  setIsViewingDetails={setIsViewingDetails}
                  handleApproveUser={handleApproveUser}
                  handleRejectUser={handleRejectUser}
                  HandleRejectModal={HandleRejectModal}
                  handleOpenNinVerify={handleOpenNinVerify}
                  handleCloseNinVerify={handleCloseNinVerify}
                  handleVerifyNin={handleVerifyNin}
                  handleOpenDocViewer={handleOpenDocViewer}
                  handleCloseDocViewer={handleCloseDocViewer}
                  getNinDocUrl={getNinDocUrl}
                  getAgentCertUrl={getAgentCertUrl}
                  getMembersList={getMembersList}
                  getVerificationStatus={getVerificationStatus}
                  isNinVerified={isNinVerified}
                  formatGenerationDate={formatGenerationDate}
                  activeTab={activeTab}
                />


              </div>



            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYC;
