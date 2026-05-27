import React, { useState, useEffect, useMemo, useRef } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import api from '../../api/apiConfig';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import demoUserDetails from '../../data/demoUserManager';
import SkeletonLoader from '../SkeletonLoader';
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  XMarkIcon,
  CheckCircleIconSolid,
  ExclamationTriangleIconSolid
} from '../icons';



// Date Formatting
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

// User Type Sanitization
const sanitizeUserType = (value) => {
  if (!value && value !== 0) return '';
  return String(value).trim().replace(/\.+$/, '');
};

// Main Component
const Applicants = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // State Management
  const [reports, setReports] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedUser, setSelectedUser] = useState(null);

  // Notification
  const [notification, setNotification] = useState({ message: '', type: '', visible: false });

  // Search and Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUserType, setFilterUserType] = useState('All');
  const [filterDate, setFilterDate] = useState('');
  const [filterBinStatus, setFilterBinStatus] = useState('All');

  // Sorting
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });


  const fetchKYCAPI = async (tab = activeTab) => {
    // Check if we're in development mode (supports CRA and Vite)
    const isDev =
      (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE !== 'production') ||
      process.env.NODE_ENV === 'development';

    if (isDev) {
      // Use demoUserManager data in development with brief delay
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      try {
        const details = demoUserDetails || {};
        const rows = [];

        // Process residents
        // if (Array.isArray(details.resident)) {
        //   details.resident.forEach((user, index) => {
        //     rows.push({
        //       id: `resident-${index}`,
        //       name: user.name || '',
        //       userId: user.userID || '',
        //       email: user.email || '',
        //       lga: user.lga || '',
        //       userType: user.customerType || 'Resident',
        //       pspCompany: user.pspCompany || '',
        //       status: user.status || 'Active',
        //       phone: user.phoneNumber || '',
        //       address: user.address || '',
        //       subscription: user.subscription || '',
        //       lastLogin: user.lastLogin || '',
        //       expiration: user.expiration || '',
        //       date: user.dateAdded || new Date().toISOString()
        //     });
        //   });
        // }

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
        // if (Array.isArray(details.corporate)) {
        //   details.corporate.forEach((user, index) => {
        //     rows.push({
        //       id: `corporate-${index}`,
        //       name: user.name || '',
        //       userId: user.userID || '',
        //       email: user.businessEmail || '',
        //       lga: user.lga || '',
        //       userType: user.customerType || 'Corporate',
        //       pspCompany: user.pspCompany || '',
        //       status: user.status || 'Active',
        //       phone: user.businessPhone || '',
        //       address: user.address || '',
        //       subscription: user.subscription || '',
        //       expiration: user.expiration || '',
        //       lastLogin: user.lastLogin || '',
        //       date: user.dateAdded || new Date().toISOString()
        //     });
        //   });
        // }

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
      const { data } = await api.get(`admin/users`);
      
      // Extract users from allUsers property to match your backend structure
      const items = Array.isArray(data?.allUsers) ? data.allUsers : [];
      
      const reportList = items.map((item, index) => ({
        id: item.userId || item._id || item.id || `user-${index}`,
        name: item.name || '',
        userId: item.userId || '',
        email: item.email || 'N/A',
        phoneNumber: item.phone || item.phoneNumber || 'N/A',
        userType: item.userType || '',
        date: item.createdAt || new Date().toISOString()
      }));
      setReports(reportList);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchKYCAPI(activeTab);
  }, [activeTab]);

  // Fetch individual user data and applicants
  const fetchUserAndApplicants = async (userId) => {
    try {
      setIsLoading(true);
      
      // First, check if user data is passed from navigation state
      const userDataFromState = location.state?.userData;
      
      let user = null;
      
      if (userDataFromState) {
        // Use user data from navigation state
        user = userDataFromState;
      } else {
        // Fallback: try to find user in the reports list
        user = reports.find(report => report.userId === userId);
      }
      
      if (!user) {
        // If not found in navigation state or reports, fetch individual user data
        let userData = null;
        let userType = null;
        
        // Try facility manager endpoint first
        try {
          const { data } = await api.get(`admin/users/facility/${userId}`);
          userData = data;
          userType = 'facility manager';
        } catch (facilityError) {
          // Try agent endpoint
          try {
            const { data } = await api.get(`admin/users/agent/${userId}`);
            userData = data;
            userType = 'agent';
          } catch (agentError) {
            throw new Error('User not found in either facility manager or agent endpoints');
          }
        }
        
        if (userData) {
          // Process the user data
          // Try multiple possible name fields from the API response
          const userName = userData.name || 
            userData.fullName ||
            (userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : '') ||
            userData.firstName || 
            userData.lastName ||
            userData.displayName ||
            userData.username ||
            userData.email?.split('@')[0] || // Use email prefix as fallback
            'User';
          
          user = {
            id: userData.userId || userData.id || userId || userData._id,
            name: userName,
            userId: userData.userId || userData.id || userData._id || '',
            email: userData.email || 'N/A',
            phoneNumber: userData.phone || userData.phoneNumber || 'N/A',
            userType: userData.userType || userData.customerType || userType || '',
            date: userData.createdAt || userData.dateAdded || new Date().toISOString()
          };
        }
      }
      
      if (user) {
        // If user was found in reports but has no name, try to get it from the user object
        if (!user.name || user.name === 'Unknown User') {
          const alternativeName = user.fullName || 
            (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '') ||
            user.firstName || 
            user.lastName ||
            user.displayName ||
            user.username ||
            user.email?.split('@')[0] ||
            'User';
          
          if (alternativeName && alternativeName !== 'Unknown User') {
            user.name = alternativeName;
          }
        }
        
        setSelectedUser(user);
        
        // If user is an agent or facility manager, extract applicants from API
        if (normalizeUserType(user.userType) === 'agent' || normalizeUserType(user.userType) === 'facility manager') {
          // Always use API for now (remove demo data logic)
          const fetchApplicantsFromAPI = async () => {
            try {
              // Determine the correct endpoint based on user type
              const endpoint = normalizeUserType(user.userType) === 'agent' 
                ? `admin/users/agent/${userId}` 
                : `admin/users/facility/${userId}`;
              
              const { data } = await api.get(endpoint);
              
              // Extract applicants from the API response
              let applicantsData = [];
              
              if (data.data && Array.isArray(data.data)) {
                applicantsData = data.data;
              } else if (data.applicants && Array.isArray(data.applicants)) {
                applicantsData = data.applicants;
              } else if (data.users && Array.isArray(data.users)) {
                applicantsData = data.users;
              } else if (Array.isArray(data)) {
                applicantsData = data;
              }
              
              // Map the applicants data to the expected format
              const applicantRows = applicantsData.map((applicant, index) => {
                const mappedApplicant = {
                  id: applicant.userId || applicant._id || `applicant-${index}`,
                  userId: applicant.userId || applicant._id || '',
                  name: applicant.firstName && applicant.lastName 
                    ? `${applicant.firstName} ${applicant.lastName}` 
                    : applicant.firstName || applicant.name || '',
                  email: applicant.email || '',
                  customerType: applicant.lawmaCustomerType || applicant.customerType || applicant.userType || '',
                  phoneNumber: applicant.phoneNumber || applicant.phone || '',
                  binId: applicant.binId || applicant.binID || '',
                  binStatus: applicant.binStatus || '',
                  buildingName: applicant.buildingName || '',
                  address: applicant.address || '',
                  localGovernment: applicant.localGovernment || '',
                  houseNumber: applicant.houseNumber || '',
                  flatNumber: applicant.flatNumber || '',
                  buildingType: applicant.buildingType || '',
                  closestLandmark: applicant.closestLandmark || '',
                  binType: applicant.binType || '',
                  addedDate: applicant.createdAt || applicant.addedDate || applicant.dateAdded || new Date().toISOString(),
                  dateAdded: applicant.createdAt || applicant.addedDate || applicant.dateAdded || new Date().toISOString()
                };
                
                return mappedApplicant;
              });
              
              setApplicants(applicantRows);
              
            } catch (error) {
              setApplicants([]);
              showNotification('Failed to load applicants data', 'error');
            }
          };
          
          fetchApplicantsFromAPI();
          
        } else {
          setApplicants([]);
        }
      } else {
        // If user still not found, show notification and navigate back
        showNotification('User not found', 'error');
        navigate('/user-management');
      }
    } catch (error) {
      showNotification('Failed to load user data', 'error');
      navigate('/user-management');
    } finally {
      setIsLoading(false);
    }
  };

  // Find the specific user based on userId from URL params and extract applicants
  useEffect(() => {
    if (userId) {
      fetchUserAndApplicants(userId);
    }
  }, [userId]);

 

  const showNotification = (message, type) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ message: '', type: '', visible: false });
    }, 3000);
  };

  const processedReports = useMemo(() => {
    // Use applicants data if user is an agent or facility manager, otherwise use reports
    const dataSource = selectedUser && (normalizeUserType(selectedUser.userType) === 'agent' || normalizeUserType(selectedUser.userType) === 'facility manager') ? applicants : reports;
    
    let filtered = [...dataSource];
    
    if (searchTerm) {
      filtered = filtered.filter(item =>
        (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.customerType || item.userType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.userId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.phoneNumber || item.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.binId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.binStatus || item.binStatus || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterUserType !== 'All') {
      filtered = filtered.filter(item => {
        const userType = item.customerType || item.userType;
        return normalizeUserType(userType) === filterUserType.toLowerCase();
      });
    }
    if (filterDate) {
      const selected = new Date(filterDate);
      const isValidDate = !isNaN(selected.getTime());
      if (isValidDate) {
        const isSameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.dateAdded || item.date);
          return isSameDay(itemDate, selected);
        });
      } else {
        filtered = filtered.filter(item =>
          formatGenerationDate(item.dateAdded || item.date).toLowerCase().includes(String(filterDate).toLowerCase())
        );
      }
    }
    if (filterBinStatus !== 'All') {
      filtered = filtered.filter(item => {
        const binStatus = item.binStatus || '';
        return binStatus.toLowerCase() === filterBinStatus.toLowerCase();
      });
    }
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        if (sortConfig.key === 'date' || sortConfig.key === 'dateAdded' || sortConfig.key === 'periodStart' || sortConfig.key === 'periodEnd') {
          valA = new Date(valA);
          valB = new Date(valB);
        }
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [reports, applicants, selectedUser, searchTerm, filterUserType, filterDate, filterBinStatus, sortConfig]);

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




  const filterRef = useRef();


  // Applicant Type Normalization
  function normalizeUserType(rawType) {
    const value = sanitizeUserType(rawType).toLowerCase();
    if (!value) return '';
    if (['facility manager', 'facility_manager', 'facilitymanager', 'facility'].includes(value)) return 'facility manager';
    if (['resident'].includes(value)) return 'resident';
    if (['corporate', 'corporate customer', 'corporate_user'].includes(value)) return 'corporate';
    if (['agent', 'field agent'].includes(value)) return 'agent';
    return value;
  }





  // Dynamic table headers based on user type
  const getTableHeaders = (userType) => {
    const Applicant = normalizeUserType(userType);

    if (Applicant === 'agent') {
      // For agents, show applicant data headers
      return [
        { key: 'userId', label: 'User ID', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email Address', sortable: true },
        { key: 'customerType', label: 'Customer Type', sortable: true },
        { key: 'phoneNumber', label: 'Phone Number', sortable: true },
        { key: 'dateAdded', label: 'Date Added', sortable: true },
      ];
    } else if (Applicant === 'facility manager') {
      return [
        { key: 'userId', label: 'User ID', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'phoneNumber', label: 'Phone Number', sortable: true },
        { key: 'buildingName', label: 'Building Name', sortable: true },
        { key: 'binStatus', label: 'Bin Status', sortable: true },
        { key: 'addedDate', label: 'Date Added', sortable: true },
      ];
    } else {
      // Default headers for other user types
      return [
        { key: 'userId', label: 'User ID', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email Address', sortable: true },
        { key: 'userType', label: 'Customer Type', sortable: true },
        { key: 'phoneNumber', label: 'Phone Number', sortable: true },
        { key: 'date', label: 'Date Added', sortable: false },
      ];
    }
  };

  const tableHeaders = selectedUser ? getTableHeaders(selectedUser.userType) : [];


  //   Export Button logic
  const handleExport = () => {
    if (!selectedUser) {
      showNotification('No user data to export', 'error');
      return;
    }

    // Get dynamic headers based on user type
    const dynamicHeaders = tableHeaders.map(header => header.label);
    const headers = ['S/N', ...dynamicHeaders];

    const escapeCsv = (value) => {
      if (value === null || value === undefined) return '';
      const str = String(value).replace(/"/g, '""');
      return /[",\n]/.test(str) ? `"${str}"` : str;
    };

    let csv = '';
    csv += headers.map(escapeCsv).join(',') + '\n';

    // Get data to export - applicants if agent or facility manager, otherwise selected user
    const dataToExport = selectedUser && (normalizeUserType(selectedUser.userType) === 'agent' || normalizeUserType(selectedUser.userType) === 'facility manager')
      ? processedReports 
      : [selectedUser];

    dataToExport.forEach((item, index) => {
      const rowData = [index + 1]; // S/N starts at 1

      tableHeaders.forEach(header => {
        let cellValue = '';

        switch (header.key) {
          case 'userId':
            cellValue = item.userId || '';
            break;
          case 'name':
            cellValue = item.name || '';
            break;
          case 'email':
            cellValue = item.email || '';
            break;
          case 'userType':
            cellValue = sanitizeUserType(item.userType);
            break;
          case 'customerType':
            cellValue = sanitizeUserType(item.customerType);
            break;
          case 'phoneNumber':
            cellValue = item.phone || item.phoneNumber || '';
            break;
          case 'binId':
            cellValue = item.binID || item.binId || '';
            break;
          case 'binStatus':
            cellValue = item.binStatus || '';
            break;
          case 'buildingName':
            cellValue = item.buildingName || '';
            break;
          case 'branchName':
            cellValue = item.branchName || '';
            break;
          case 'registrationNumber':
            cellValue = item.registrationNumber || '';
            break;
          case 'pspCompany':
            cellValue = item.pspCompany || '';
            break;
          case 'date':
            cellValue = item.date ? formatGenerationDate(item.date) : 'N/A';
            break;
          case 'dateAdded':
            cellValue = item.dateAdded ? formatGenerationDate(item.dateAdded) : 'N/A';
            break;
          case 'addedDate':
            cellValue = item.addedDate ? formatGenerationDate(item.addedDate) : 'N/A';
            break;
          default:
            cellValue = item[header.key] || '';
        }

        rowData.push(cellValue);
      });

      const row = rowData.map(escapeCsv).join(',');
      csv += row + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const userType = sanitizeUserType(selectedUser.userType).replace(' ', '_');
    const fileName = selectedUser && (normalizeUserType(selectedUser.userType) === 'agent' || normalizeUserType(selectedUser.userType) === 'facility manager')
      ? `LAWMA_${userType}_${selectedUser.userId || 'User'}_Applicants` 
      : `LAWMA_${userType}_${selectedUser.userId || 'User'}`;
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Data exported successfully', 'success');
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

                <header className="mb-6 flex flex-col sm:flex-row justify-between lg:items-center">
                  <div className='flex items-center gap-5'>

                    {/* Back Navigation */}
                    <div className='items-center flex'>
                      <span
                        onClick={() => navigate('/user-management')}
                        className="group cursor-pointer"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:text-green-700 transition-colors">
                          <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>

                    </div>

                    {/* User Details */}
                    <div>
                      <h1 className="text-xl md:text-xl font-semibold text-zinc-800">
                        {selectedUser ? selectedUser.name : 'Loading...'}
                      </h1>
                      <p className="text-zinc-500 text-sm font-light">
                        {selectedUser ? selectedUser.userType : 'Loading...'}
                      </p>

                      {/* Agent and Facility Manager user type with PSP company and building name */}
                      {/* <p className="text-zinc-500 text-sm font-light">
                        {selectedUser ? (
                          normalizeUserType(selectedUser.userType) === 'agent' 
                            ? `Agent - ${selectedUser.pspCompany || 'N/A'}` 
                            : normalizeUserType(selectedUser.userType) === 'facility manager'
                            ? `Facility Manager - ${selectedUser.buildingName || 'N/A'}`
                            : sanitizeUserType(selectedUser.userType)
                        ) : 'Loading...'}
                      </p> */}
                      
                    </div>

                  </div>
                </header>

                <div className="mb-6   rounded-lg ">

                  {/* Filter */}
                  <div className="flex items-center gap-4 justify-between">

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

                    {/* Filter by Category and Date - for Agent user type */}
                    {selectedUser && (normalizeUserType(selectedUser.userType) === 'agent') && (
                      <div className=" flex items-center gap-4">
                        <p className="text-zinc-700">Filter by</p>

                        {/* Customer Type Filter */}
                        <div className="">
                          <select
                            id="customerType"
                            value={filterUserType}
                            onChange={(e) => setFilterUserType(e.target.value)}
                            className="w-full p-2 bg-white border border-zinc-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                          >
                            <option value="All">Customer Type</option>
                            {/* <option value="Agent">Agent</option>
                            <option value="FacilityManager">Facility Manager</option> */}
                            <option value="Resident">Resident</option>
                            <option value="Corporate">Corporate</option>
                          </select>
                        </div>

                        {/* Date Added Filter */}
                        <div>
                          <input
                            type="date"
                            id="dateAdded"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            placeholder="Date Added"
                            className="w-full p-2 bg-white border border-zinc-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Export button */}
                    <button className='text-sm text-zinc-600 hover:text-green-700 hover:border-green-  p-2 px-4 border border-gray-300 rounded-lg bg-white' onClick={() => handleExport()}>Export data</button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {isLoading ? (
                    <SkeletonLoader />
                  ) : !selectedUser ? (
                    <div className="flex flex-col justify-center items-center mt-50">
                      <div className="max-w-xl w-full flex flex-col items-center justify-center text-center">
                        <h2 className="text-xl mb-1 sans">User not found</h2>
                        <p className="text-zinc-400 mt-2 font-light">
                          The requested user could not be found
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className='bg-white rounded-2xl'>
                      <table className="w-full min-w-[900px] m-4 bg-white table-fixed">
                        <thead className="border-b border-zinc-200">
                          <tr>
                            <th className="lg:p-6 p-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider w-12">S/N</th>
                            {tableHeaders.map(header => (
                              <th
                                key={header.key}
                                className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:bg-zinc-50"
                                onClick={() => header.sortable && requestSort(header.key)}
                              >
                                <div className="flex items-center">
                                  {header.label}
                                  {header.sortable && <SortIcon columnKey={header.key} />}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-zinc-200">
                          {processedReports.length === 0 ? (
                            <tr>
                              <td colSpan={tableHeaders.length + 1} className="lg:p-6 p-3 text-center text-sm text-zinc-500">
                                {selectedUser && (normalizeUserType(selectedUser.userType) === 'agent' || normalizeUserType(selectedUser.userType) === 'facility manager')
                                  ? `No applicants found for this ${normalizeUserType(selectedUser.userType)}`
                                  : 'No data available'
                                }
                              </td>
                            </tr>
                          ) : (
                            processedReports.map((item, index) => (
                              <tr key={item.id || index} className="hover:bg-zinc-50 transition-colors duration-150">
                                <td className="lg:p-6 p-3 text-sm text-zinc-500">{index + 1}.</td>
                                {tableHeaders.map(header => {
                                  let cellValue = '';
                                  let displayValue = '';

                                  switch (header.key) {
                                    case 'userId':
                                      cellValue = item.userId || '';
                                      displayValue = cellValue;
                                      break;
                                    case 'name':
                                      cellValue = item.name || '';
                                      displayValue = cellValue;
                                      break;
                                    case 'email':
                                      cellValue = item.email || '';
                                      displayValue = cellValue;
                                      break;
                                    case 'userType':
                                      cellValue = sanitizeUserType(item.userType);
                                      displayValue = cellValue;
                                      break;
                                    case 'customerType':
                                      cellValue = sanitizeUserType(item.customerType);
                                      displayValue = cellValue;
                                      break;
                                    case 'phoneNumber':
                                      cellValue = item.phone || item.phoneNumber || '';
                                      displayValue = cellValue;
                                      break;
                                    case 'binId':
                                      cellValue = item.binID || item.binId || '';
                                      displayValue = cellValue;
                                      break;
                                    case 'binStatus':
                                      cellValue = item.binStatus || '';
                                      displayValue = cellValue;
                                      break;
                                    case 'buildingName':
                                      cellValue = item.buildingName || '';
                                      displayValue = cellValue;
                                      break;
                                    case 'branchName':
                                      cellValue = item.branchName || '';
                                      displayValue = cellValue;
                                      break;
                                    case 'registrationNumber':
                                      cellValue = item.registrationNumber || '';
                                      displayValue = cellValue;
                                      break;
                                    case 'pspCompany':
                                      cellValue = item.pspCompany || '';
                                      displayValue = cellValue;
                                      break;
                                    case 'date':
                                      cellValue = item.date || '';
                                      displayValue = item.date ? formatGenerationDate(item.date) : 'N/A';
                                      break;
                                    case 'dateAdded':
                                      cellValue = item.dateAdded || '';
                                      displayValue = item.dateAdded ? formatGenerationDate(item.dateAdded) : 'N/A';
                                      break;
                                    case 'addedDate':
                                      cellValue = item.addedDate || '';
                                      displayValue = item.addedDate ? formatGenerationDate(item.addedDate) : 'N/A';
                                      break;
                                    default:
                                      cellValue = item[header.key] || '';
                                      displayValue = cellValue;
                                  }

                                  return (
                                    <td
                                      key={header.key}
                                      className="lg:p-6 p-3 text-sm text-zinc-500 whitespace-nowrap overflow-hidden"
                                    >
                                      <div className="truncate" title={cellValue}>
                                        {header.key === 'binStatus' ? (
                                          <span className={`font-medium ${
                                            displayValue.toLowerCase() === 'assigned' 
                                              ? 'text-green-600' 
                                              : displayValue.toLowerCase() === 'unassigned' 
                                                ? 'text-red-600' 
                                                : 'text-zinc-500'
                                          }`}>
                                            {displayValue}
                                          </span>
                                        ) : (
                                          displayValue
                                        )}
                                      </div>
                                    </td>
                                  );
                                })}
                              </tr>
                            ))
                          )}
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
  );
};

export default Applicants;
