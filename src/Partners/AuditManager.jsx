import React, { useState, useEffect } from "react";
import api from "../api/apiConfig";
import Sidebar from "../components/Partners/Sidebar";
import Topbar from "../components/Partners/Topbar";
import Papa from "papaparse";

// --- Mock Data removed; replaced with API data fetch ---

// --- SVG Icons ---
import {
  SearchIcon,
  ExportIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "../components/icons";

// removed invalid top-level fetch/useEffect; fetching is handled inside component

// --- Format Helpers ---
const formatTimestamp = (value) => {
  if (!value) return "";
  // Try to handle numbers (unix seconds/ms) and strings
  let date;
  if (typeof value === "number") {
    // Assume seconds if 10 digits, ms if 13
    const ms = value < 2_000_000_000 ? value * 1000 : value;
    date = new Date(ms);
  } else if (typeof value === "string") {
    // Try ISO or parseable string
    const num = Number(value);
    if (!Number.isNaN(num) && value.trim() !== "") {
      const ms = num < 2_000_000_000 ? num * 1000 : num;
      date = new Date(ms);
    } else {
      // Attempt to normalize common dd-mm-yy formats by swapping to yyyy-mm-dd
      const ddmmyy = value.match(/^(\d{2})[-\/](\d{2})[-\/]((\d{2}){1,2})/);
      if (ddmmyy) {
        const [_, d, m, y] = ddmmyy;
        const year = y.length === 2 ? `20${y}` : y;
        date = new Date(`${year}-${m}-${d}`);
      } else {
        const parsed = new Date(value);
        date = isNaN(parsed.getTime()) ? null : parsed;
      }
    }
  }
  if (!date || isNaN(date.getTime())) return String(value);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const normalizeIp = (ip) => {
  if (!ip) return "";
  // Remove IPv6-mapped IPv4 prefix like ::ffff:127.0.0.1
  return String(ip).replace(/^::ffff:/i, "");
};

// Helper function to parse dates properly
const parseDate = (dateValue) => {
  if (!dateValue) return null;
  
  let date;
  if (typeof dateValue === 'number') {
    // Handle unix timestamp
    const ms = dateValue < 2_000_000_000 ? dateValue * 1000 : dateValue;
    date = new Date(ms);
  } else if (typeof dateValue === 'string') {
    // Try to parse string date
    const parsed = new Date(dateValue);
    date = isNaN(parsed.getTime()) ? null : parsed;
  } else {
    date = new Date(dateValue);
  }
  
  return date && !isNaN(date.getTime()) ? date : null;
};

const IpBadge = ({ ip }) => (
  <span className="font-mono ">
    {normalizeIp(ip)}
  </span>
);


// --- TABLE SKELETON COMPONENT ---
const TableSkeletonLoader = () => (
  <div className="bg-white border border-zinc-200 rounded-xl overflow-x-auto my-8">
    <div className="animate-pulse">
      <div className="space-y-4 p-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-3 border-b border-zinc-100"
          >
            <div className="flex space-x-4">
              <div className="h-4 bg-zinc-200 rounded w-32"></div>
              <div className="h-4 bg-zinc-200 rounded w-24"></div>
              <div className="h-4 bg-zinc-200 rounded w-40"></div>
              <div className="h-4 bg-zinc-200 rounded w-20"></div>
              <div className="h-4 bg-zinc-200 rounded w-24"></div>
            </div>
            <div className="h-4 bg-zinc-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- VIEW DETAILS MODAL COMPONENT ---
const AuditLogModal = ({ audit, onClose }) => {
  if (!audit) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl m-4">
        <div className="flex justify-between items-start mb-6 border-b border-zinc-200 pb-1">
          <h2 className="text-lg font-bold text-zinc-700">Log Details</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-800 text-2xl"
          >
            &times;
          </button>
        </div>
        <div className="mt-6 flex flex-col space-y-4">
          <div className=" flex  justify-between">
            <p className="font-semibold text-zinc-700">Name</p>
            <p className=" md:text-lg text-zinc-800 text-end">{audit.name}</p>
          </div>
          <div className=" flex justify-between">
            <p className="font-semibold text-zinc-700">Email</p>
            <p className="md:text-lg text-zinc-800 text-end">{audit.email}</p>
          </div>
          <div className=" flex justify-between">
            <p className="font-semibold text-zinc-700">Action</p>
            <p className="md:text-lg text-zinc-800 text-end">{audit.action}</p>
          </div>
          <div className=" flex justify-between">
            <p className="font-semibold text-zinc-700">Time Stamp</p>
            <p className="md:text-lg text-zinc-800 text-end">{formatTimestamp(audit.date)}</p>
          </div>
          <div className=" flex justify-between">
            <p className="font-semibold text-zinc-700">IP Address</p>
            <p className="md:text-lg text-zinc-800 text-end"><IpBadge ip={audit.ipAddress} /></p>
          </div>
          <div className=" flex gap-4 justify-between ">
            <p className="font-semibold text-zinc-700 w-3/4">Device/Browser Info</p>
            <p
              className="md:text-lg text-zinc-800 text-end"
            >
              {audit.deviceInfo}
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
};


// --- MAIN AUDIT MANAGER COMPONENT ---
export default function AuditManager() {
  const [allAudits, setAllAudits] = useState([]);
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    ipAddress: "",
    details: "",
    startDate: "",
    endDate: "",
    role: "",
    action: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFilteredData, setTotalFilteredData] = useState([]);
  const itemsPerPage = 10;

  // Pagination helper functions
  const getPaginatedData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (totalItems) => {
    return Math.ceil(totalItems / itemsPerPage);
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDateDropdownOpen && !event.target.closest('.date-dropdown-container')) {
        setIsDateDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDateDropdownOpen]);

  // Fetch audit logs
  useEffect(() => {
    const fetchAuditLogs = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("lawma/auditlogs");
        console.log('Audit logs data:', data);
        
        // Handle potential shapes: { success, data } or array
        const payload = Array.isArray(data) ? data : (data?.data || []);
        // Normalize records to expected UI fields
        const normalized = payload.map((item) => ({
          id: item.id || item._id || item.log_id || undefined,
          date: item.date || item.timestamp || item.createdAt || "",
          name: item.name || item.userName || item.actor_name || item.user?.name || "",
          email: item.email || item.userEmail || item.actor_email || item.user?.email || "",
          action: item.action || item.event || item.activity || "",
          role: item.role || item.userRole || item.actor_role || item.user?.role || "",
          ipAddress: item.ipAddress || item.ip || item.ip_address || "",
          details: item.details || item.description || item.meta || "",
          deviceInfo: item.deviceInfo || item.platform || item.browser || "",
        }));
        setAllAudits(normalized);
        setAudits(normalized);
      } catch (error) {
        console.error("Error fetching audit logs:", error);
        setAllAudits([]);
        setAudits([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAuditLogs();
  }, []);

  // Get unique values for dropdowns from allAudits
  const getUniqueValues = (key) => {
    return [...new Set(allAudits.map((item) => item[key]).filter(Boolean))];
  };

  const roles = getUniqueValues("role");
  const actions = getUniqueValues("action");

  // Apply search when search term changes
  useEffect(() => {
    // Apply filters first
    let filteredData = allAudits.filter((audit) => {
      return Object.keys(filters).every((key) => {
        if (!filters[key]) return true;
        
        // Handle date range filtering
        if (key === 'startDate' || key === 'endDate') {
          return true; // Skip individual date checks, we'll handle range separately
        }
        
        return audit[key] === filters[key];
      });
    });

    // Apply date range filtering
    if (filters.startDate || filters.endDate) {
      filteredData = filteredData.filter((audit) => {
        const auditDate = parseDate(audit.date);
        if (!auditDate) return false;
        
        const startDate = filters.startDate ? new Date(filters.startDate + 'T00:00:00') : null;
        const endDate = filters.endDate ? new Date(filters.endDate + 'T23:59:59') : null;
        
        if (startDate && endDate) {
          return auditDate >= startDate && auditDate <= endDate;
        } else if (startDate) {
          return auditDate >= startDate;
        } else if (endDate) {
          return auditDate <= endDate;
        }
        
        return true;
      });
    }

    // Apply search
    filteredData = applySearch(filteredData);

    // Apply current sort if exists
    let sortedData;
    if (sortConfig.key) {
      sortedData = [...filteredData].sort((a, b) => {
        const key = sortConfig.key;
        if (a[key] < b[key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    } else {
      // Default to ascending timestamp order when a date range is active
      if (filters.startDate || filters.endDate) {
        sortedData = [...filteredData].sort((a, b) => {
          const aDate = parseDate(a.date);
          const bDate = parseDate(b.date);
          if (!aDate && !bDate) return 0;
          if (!aDate) return 1;
          if (!bDate) return -1;
          return aDate.getTime() - bDate.getTime();
        });
      } else {
        sortedData = filteredData;
      }
    }

    // Store total filtered data for pagination
    setTotalFilteredData(sortedData);
    
    // Apply pagination
    const paginatedData = getPaginatedData(sortedData);
    setAudits(paginatedData);
  }, [searchTerm, allAudits, filters, sortConfig.key, sortConfig.direction, currentPage]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    // Apply filters and search first, then sort
    let filteredData = allAudits.filter((audit) => {
      return Object.keys(filters).every((key) => {
        if (!filters[key]) return true;
        
        // Handle date range filtering
        if (key === 'startDate' || key === 'endDate') {
          return true; // Skip individual date checks, we'll handle range separately
        }
        
        return audit[key] === filters[key];
      });
    });

    // Apply date range filtering
    if (filters.startDate || filters.endDate) {
      filteredData = filteredData.filter((audit) => {
        const auditDate = parseDate(audit.date);
        if (!auditDate) return false;
        
        const startDate = filters.startDate ? new Date(filters.startDate + 'T00:00:00') : null;
        const endDate = filters.endDate ? new Date(filters.endDate + 'T23:59:59') : null;
        
        if (startDate && endDate) {
          return auditDate >= startDate && auditDate <= endDate;
        } else if (startDate) {
          return auditDate >= startDate;
        } else if (endDate) {
          return auditDate <= endDate;
        }
        
        return true;
      });
    }

    // Apply search
    filteredData = applySearch(filteredData);

    const sortedData = [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    // Store total filtered data for pagination
    setTotalFilteredData(sortedData);
    
    // Apply pagination
    const paginatedData = getPaginatedData(sortedData);
    setAudits(paginatedData);
  };

  const handleActionClick = (audit) => {
    setSelectedAudit(audit);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAudit(null);
  };


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInlineFilterChange = (e) => {
    handleFilterChange(e);
  };

  const clearInlineFilters = () => {
    setFilters((prev) => ({
      ...prev,
      startDate: "",
      endDate: "",
      role: "",
      action: "",
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const applySearch = (data) => {
    if (!searchTerm) return data;

    const term = searchTerm.toLowerCase();
    return data.filter(
      (audit) =>
        audit.name.toLowerCase().includes(term) ||
        audit.email.toLowerCase().includes(term) ||
        audit.action.toString().includes(term) ||
        audit.date.includes(term) ||
        audit.ipAddress.toLowerCase().includes(term) ||
        audit.details.toLowerCase().includes(term)
    );
  };


  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = getTotalPages(totalFilteredData.length);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleExport = () => {
    // Prepare data for export (use total filtered data, not just current page)
    const exportData = totalFilteredData.map((audit, index) => ({
      Name: audit.name,
      Email: audit.email,
      Action: audit.action,
      "Time Stamp": audit.date,
      "IP Address": audit.ipAddress,
      Details: audit.details,
    }));

    // Use PapaParse to convert to CSV
    const csv = Papa.unparse(exportData);

    // Create blob and download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "audit log.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="w-full">
              <div className="md:flex sm:flex-row items-center sm:items-center justify-between gap-3 mr-3">
              <div className=" w-full">
                <header className="mb-6 ml-3">
                  <h1 className="text-2xl md:text-3xl font-semibold text-zinc-800">
                    Audit Log
                  </h1>
                  <p className="text-zinc-500 text-lg font-light text-wrap">
                    Track and audit all actions performed within the application
                  </p>
                </header>
              </div>
              <div className="md:w-2/4 ml-3 md:ml-0 w-full flex md:justify-end">
                <button
                  onClick={handleExport}
                  className="flex items-center flex-row justify-center px-3 py-3 border bg-green-700 border-zinc-300 rounded-2xl text-white hover:bg-green-600 hover:text-white transition sm:w-auto"
                >
                  <span className="me-2 hover:text-green-800">
                    <ExportIcon />
                  </span>
                  Export Data
                </button>
              </div>
            </div>

            <div className=" p-4">
              {/* Always show filters and search */}
              <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-6 gap-4">
                <div className="relative w-full sm:w-64 lg:w-50 flex-shrink-0">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon />
                  </div>
                  <input
                    type="text"
                    placeholder="Search here..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 border bg-white border-zinc-300 rounded-lg focus:ring-green-800 focus:border-green-800"
                  />
                </div>

                {/* FILTER COMPONENT */}
                <div className="flex items-center gap-2 sm:gap-3 flex-col md:flex-row">
                  <p className="text-sm text-zinc-700 shrink-0">Filter By</p>

                  {/* DATE DROPDOWN */}
                  <div className="relative w-full lg:w-40 sm:w-auto date-dropdown-container">
                    <button
                      type="button"
                      onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                      className={`w-full px-3 py-2 border bg-white border-zinc-300 rounded-md text-left flex items-center justify-between ${!filters.startDate && !filters.endDate ? 'text-zinc-400' : 'text-zinc-900'}`}
                    >
                      <span className=" truncate flex-1 mr-2">
                        {filters.startDate && filters.endDate 
                          ? `${filters.startDate} - ${filters.endDate}`
                          : filters.startDate 
                          ? `From ${filters.startDate}`
                          : filters.endDate 
                          ? `Until ${filters.endDate}`
                          : 'Date Range'
                        }
                      </span>
                      <svg className={`w-4 h-4 transition-transform flex-shrink-0 ${isDateDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* DATE DROPDOWN */}
                    {isDateDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-300 rounded-md shadow-lg z-10 p-3">
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-zinc-600 mb-1">Start Date</label>
                            <input
                              type="date"
                              id="startDate"
                              name="startDate"
                              value={filters.startDate}
                              onChange={handleInlineFilterChange}
                              className="w-full px-2 py-1 border border-zinc-300 rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-zinc-600 mb-1">End Date</label>
                            <input
                              type="date"
                              id="endDate"
                              name="endDate"
                              value={filters.endDate}
                              onChange={handleInlineFilterChange}
                              className="w-full px-2 py-1 border border-zinc-300 rounded text-sm"
                            />
                          </div>
                          <div className="flex gap-2 pt-2 border-t border-zinc-200">
                            <button
                              type="button"
                              onClick={() => {
                                // Clear start date
                                const startDateEvent = { target: { name: 'startDate', value: '' } };
                                handleInlineFilterChange(startDateEvent);
                                // Clear end date
                                const endDateEvent = { target: { name: 'endDate', value: '' } };
                                handleInlineFilterChange(endDateEvent);
                                setIsDateDropdownOpen(false);
                              }}
                              className="flex-1 px-2 py-1 text-xs border border-zinc-300 rounded hover:bg-zinc-50"
                            >
                              Clear
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsDateDropdownOpen(false)}
                              className="flex-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* USER ROLE DROPDOWN */}
                  <div className="w-full lg:w-40 sm:w-auto">
                    <select
                      id="role"
                      name="role"
                      value={filters.role}
                      onChange={handleInlineFilterChange}
                      className={`w-full px-3 py-2 border bg-white border-zinc-300 rounded-md ${!filters.role ? 'text-zinc-400' : 'text-zinc-900'}`}
                    >
                      <option value="">User Role</option>
                      {roles.map((opt, idx) => (
                        <option key={idx} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* ACTIVITY TYPE DROPDOWN */}
                  <div className="lg:min-w-20 w-full sm:w-auto">
                    <select
                      id="action"
                      name="action"
                      value={filters.action}
                      onChange={handleInlineFilterChange}
                      className={`w-full px-3 py-2 border bg-white border-zinc-300 rounded-md ${!filters.action ? 'text-zinc-400' : 'text-zinc-900'}`}
                    >
                      <option value="">Activity type</option>
                      {actions.map((opt, idx) => (
                        <option key={idx} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* CLEAR FILTER BUTTON */}
                  <button
                    onClick={clearInlineFilters}
                    className="px-3 py-2 min-w-30 border bg-white border-zinc-300 rounded-md hover:bg-zinc-100 sm:w-auto hover:text-green-800 hover:border-green-800 w-full"
                  >
                    Clear Filter
                  </button>
                </div>
              </div>

              {/* Show skeleton loader for table or actual content */}
              {loading ? (
                <TableSkeletonLoader />
              ) : (
                <>
                  {/* TABLE COMPONENT SECTION */}
                  <div className="bg-white border border-zinc-200 rounded-xl overflow-x-auto my-8">
                    <table className="w-full table-auto border-collapse">
                      <thead>
                        <tr>
                          <th
                            className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer"
                            onClick={() => handleSort("date")}
                          >
                            <div className="flex items-center">Time Stamp</div>
                          </th>
                          <th
                            className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer"
                            onClick={() => handleSort("name")}
                          >
                            <div className="flex items-center">Name</div>
                          </th>
                          <th
                            className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer"
                            onClick={() => handleSort("email")}
                          >
                            <div className="flex items-center">Email address</div>
                          </th>
                          <th
                            className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer"
                            onClick={() => handleSort("action")}
                          >
                            <div className="flex items-center">Action</div>
                          </th>

                          <th
                            className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer"
                            onClick={() => handleSort("ipAddress")}
                          >
                            <div className="flex items-center">IP Address</div>
                          </th>
                          <th
                            className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer"
                            onClick={() => handleSort("details")}
                          >
                            <div className="flex items-center">Details</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {audits.map((audit, index) => (
                          <tr key={audit.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                            <td className="px-4 py-3 text-sm text-zinc-900 whitespace-nowrap">
                              {formatTimestamp(audit.date)}
                            </td>
                            <td className="px-4 py-3 text-sm text-zinc-900 whitespace-nowrap">
                              {audit.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-zinc-700 whitespace-nowrap">
                              {audit.email}
                            </td>
                            <td className="px-4 py-3 text-sm text-zinc-900 whitespace-nowrap">
                              {audit.action}
                            </td>
                            <td className="px-4 py-3 text-sm text-zinc-700 whitespace-nowrap">
                              <IpBadge ip={audit.ipAddress} />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <a
                                onClick={() => handleActionClick(audit)} // pass row data to modal
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

                  {/* PAGINATION COMPONENT SECTION */}
                  {totalFilteredData.length > 10 && (
                    <div className="py-4 flex items-center justify-between">
                      <div className="text-sm text-zinc-600">
                        Page <span className="font-medium">{currentPage}</span> of{" "}
                        <span className="font-medium">{Math.ceil(totalFilteredData.length / itemsPerPage)}</span>
                        <span className="ml-2">({totalFilteredData.length} total items)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={handlePrevPage}
                          disabled={currentPage === 1}
                          className="p-2 rounded-md hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeftIcon />
                        </button>
                        <button 
                          onClick={handleNextPage}
                          disabled={currentPage === Math.ceil(totalFilteredData.length / itemsPerPage)}
                          className="p-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRightIcon />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <AuditLogModal audit={selectedAudit} onClose={closeModal} />
        </main>
      </div>
    </div>
  );
}
