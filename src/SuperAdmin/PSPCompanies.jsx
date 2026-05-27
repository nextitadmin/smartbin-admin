import React, { useState, useEffect } from 'react';
import Sidebar from '../components/SuperAdmin/Sidebar';
import Topbar from '../components/SuperAdmin/Topbar';
import Papa from 'papaparse';
import { fetchPSPs } from '../api/pspApi';

// --- Helper Functions ---
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Format as DD/MM/YY
};

const mapPSPData = (pspData) => {
    return pspData.map((psp, index) => ({
        id: psp._id,
        companyName: psp.company_name,
        adminName: psp.administrator_name,
        adminPhone: psp.administrator_phone,
        lga: psp.lga_address,
        companyAddress: psp.company_address,
        dateJoined: formatDate(psp.createdAt),
        status: 'Active' // Assuming all PSPs are active by default
    }));
};


// --- SVG Icons ---
import { 
    FilterIcon, 
    SearchIcon, 
    ExportIcon, 
    DotsVerticalIcon, 
    ChevronLeftIcon, 
    ChevronRightIcon, 
    SortIcon 
} from '../components/icons';

// --- Skeleton Components ---
const TableSkeleton = () => (
    <div className="animate-pulse">
        <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-zinc-100">
                    <div className="flex space-x-4">
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

// --- Content Component ---
const PSPCompaniesContent = ({ companies, handleActionClick, handleSort, sortConfig, openFilter, handleExport, searchTerm, handleSearchChange }) => (
    <>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                    onClick={openFilter}
                    className="flex items-center px-4 py-2 border bg-white border-zinc-300 rounded-lg text-zinc-700 hover:bg-zinc-100 transition"
                >
                    <FilterIcon />
                    Filter
                </button>
                <div className="relative w-full sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon />
                    </div>
                    <input
                        type="text"
                        placeholder="Search here..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </div>
            <button
                onClick={handleExport}
                className="flex items-center justify-center px-4 py-2 border bg-white border-zinc-300 rounded-lg text-zinc-700 hover:bg-zinc-100 transition w-full sm:w-auto"
            >
                Export
                <ExportIcon />
            </button>
        </div>

        <div className="overflow-x-auto my-12 bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-zinc-200">
                <thead className="bg-zinc-50">
                    <tr>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:bg-zinc-100"
                            onClick={() => handleSort('id')}
                        >
                            <div className="flex items-center">
                                S/N
                                <SortIcon direction={sortConfig.key === 'id' ? sortConfig.direction : null} />
                            </div>
                        </th>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:bg-zinc-100"
                            onClick={() => handleSort('companyName')}
                        >
                            <div className="flex items-center">
                                Company Name
                                <SortIcon direction={sortConfig.key === 'companyName' ? sortConfig.direction : null} />
                            </div>
                        </th>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:bg-zinc-100"
                            onClick={() => handleSort('adminName')}
                        >
                            <div className="flex items-center">
                                Admin name
                                <SortIcon direction={sortConfig.key === 'adminName' ? sortConfig.direction : null} />
                            </div>
                        </th>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:bg-zinc-100"
                            onClick={() => handleSort('lga')}
                        >
                            <div className="flex items-center">
                                LGA/LCDA
                                <SortIcon direction={sortConfig.key === 'lga' ? sortConfig.direction : null} />
                            </div>
                        </th>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:bg-zinc-100"
                            onClick={() => handleSort('dateJoined')}
                        >
                            <div className="flex items-center">
                                Date Joined
                                <SortIcon direction={sortConfig.key === 'dateJoined' ? sortConfig.direction : null} />
                            </div>
                        </th>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider cursor-pointer hover:bg-zinc-100"
                            onClick={() => handleSort('status')}
                        >
                            <div className="flex items-center">
                                Status
                                <SortIcon direction={sortConfig.key === 'status' ? sortConfig.direction : null} />
                            </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-zinc-200">
                    {companies.map((company, index) => (
                        <tr key={company.id} className="hover:bg-zinc-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">{index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">{company.companyName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">{company.adminName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">{company.lga}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">{company.dateJoined}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${company.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {company.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button onClick={() => handleActionClick(company)} className="text-indigo-600 hover:text-indigo-900">
                                    <DotsVerticalIcon />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="py-4 flex items-center justify-between">
            <div className="text-sm text-zinc-600">
                Page <span className="font-medium">1</span> of <span className="font-medium">5</span>
            </div>
            <div className="flex items-center gap-2">
                <button className="p-2 rounded-md hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronLeftIcon />
                </button>
                <button className="p-2 rounded-md bg-green-600 text-white hover:bg-green-700">
                    <ChevronRightIcon />
                </button>
            </div>
        </div>
    </>
);

// --- Skeleton Component ---
const PSPCompaniesSkeleton = () => (
    <>
        <HeaderSkeleton />
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200">
                <thead className="bg-zinc-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">S/N</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Company Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Admin name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">LGA/LCDA</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Date Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-zinc-200">
                    <tr>
                        <td colSpan="7" className="py-4">
                            <TableSkeleton />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </>
);

// --- Modal Components ---
const CompanyDetailsModal = ({ company, onClose }) => {
    if (!company) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-zinc-800">Company Details</h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-800 text-2xl">&times;</button>
                </div>
                <div>
                    <div className="mb-4">
                        <p className="font-semibold text-zinc-600">Company Name:</p>
                        <p className="text-lg text-zinc-800">{company.companyName}</p>
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold text-zinc-600">Admin Name:</p>
                        <p className="text-lg text-zinc-800">{company.adminName}</p>
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold text-zinc-600">Admin Phone:</p>
                        <p className="text-lg text-zinc-800">{company.adminPhone}</p>
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold text-zinc-600">LGA/LCDA:</p>
                        <p className="text-lg text-zinc-800">{company.lga}</p>
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold text-zinc-600">Company Address:</p>
                        <p className="text-lg text-zinc-800">{company.companyAddress}</p>
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold text-zinc-600">Date Joined:</p>
                        <p className="text-lg text-zinc-800">{company.dateJoined}</p>
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold text-zinc-600">Status:</p>
                        <p className={`text-lg font-semibold ${company.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                            {company.status}
                        </p>
                    </div>
                </div>
                <div className="text-right mt-6">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-zinc-200 text-zinc-800 rounded-lg hover:bg-zinc-300 transition duration-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const FilterModal = ({ isOpen, onClose, filters, onFilterChange, onApply, onClear, companyNames, adminNames, lgas, statuses, dates }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-zinc-800">Filter Companies</h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-800 text-2xl">&times;</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Company Name</label>
                        <select
                            name="companyName"
                            value={filters.companyName}
                            onChange={onFilterChange}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Companies</option>
                            {companyNames.map((name, index) => (
                                <option key={index} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Admin Name</label>
                        <select
                            name="adminName"
                            value={filters.adminName}
                            onChange={onFilterChange}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Admins</option>
                            {adminNames.map((name, index) => (
                                <option key={index} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">LGA/LCDA</label>
                        <select
                            name="lga"
                            value={filters.lga}
                            onChange={onFilterChange}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All LGA/LCDA</option>
                            {lgas.map((lga, index) => (
                                <option key={index} value={lga}>{lga}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Date Joined</label>
                        <select
                            name="dateJoined"
                            value={filters.dateJoined}
                            onChange={onFilterChange}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Dates</option>
                            {dates.map((date, index) => (
                                <option key={index} value={date}>{date}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Status</label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={onFilterChange}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Statuses</option>
                            {statuses.map((status, index) => (
                                <option key={index} value={status}>{status}</option>
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
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---
export default function PSPCompanies() {
    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        companyName: '',
        adminName: '',
        lga: '',
        status: '',
        dateJoined: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    // Get unique values for dropdowns
    const getUniqueValues = (key) => {
        return [...new Set(companies.map(item => item[key]))];
    };

    const companyNames = getUniqueValues('companyName');
    const adminNames = getUniqueValues('adminName');
    const lgas = getUniqueValues('lga');
    const statuses = getUniqueValues('status');
    const dates = getUniqueValues('dateJoined');

    // Fetch real PSP data from API
    useEffect(() => {
        const loadPSPs = async () => {
            setLoading(true);
            try {
                const response = await fetchPSPs();
                const mappedData = mapPSPData(response.data);
                setCompanies(mappedData);
                setFilteredCompanies(mappedData);
            } catch (error) {
                console.error('Error fetching PSP data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPSPs();
    }, []);

    // Removed the problematic useEffect hook that was causing circular dependencies

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        // Apply filters and search first, then sort
        let filteredData = companies.filter(company => {
            return Object.keys(filters).every(key => {
                if (!filters[key]) return true;
                if (key === 'status' || key === 'dateJoined') {
                    return company[key] === filters[key];
                }
                return company[key].toLowerCase().includes(filters[key].toLowerCase());
            });
        });

        // Apply search
        filteredData = applySearch(filteredData);

        const sortedCompanies = [...filteredData].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        setFilteredCompanies(sortedCompanies);
    };

    const handleActionClick = (company) => {
        setSelectedCompany(company);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCompany(null);
    };

    const openFilter = () => {
        setIsFilterOpen(true);
    };

    const closeFilter = () => {
        setIsFilterOpen(false);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        // Apply filters first
        let filteredData = companies.filter(company => {
            return Object.keys(filters).every(key => {
                if (!filters[key]) return true;
                if (key === 'status' || key === 'dateJoined') {
                    return company[key] === filters[key];
                }
                return company[key].toLowerCase().includes(filters[key].toLowerCase());
            });
        });

        // Apply search
        if (term) {
            const lowerTerm = term.toLowerCase();
            filteredData = filteredData.filter(company =>
                company.companyName.toLowerCase().includes(lowerTerm) ||
                company.adminName.toLowerCase().includes(lowerTerm) ||
                company.lga.toLowerCase().includes(lowerTerm) ||
                company.dateJoined.includes(term) ||
                company.status.toLowerCase().includes(lowerTerm)
            );
        }

        // Apply current sort if exists
        if (sortConfig.key) {
            const sortedCompanies = [...filteredData].sort((a, b) => {
                const key = sortConfig.key;
                if (a[key] < b[key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[key] > b[key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
            setFilteredCompanies(sortedCompanies);
        } else {
            setFilteredCompanies(filteredData);
        }
    };

    const applySearch = (data) => {
        if (!searchTerm) return data;

        const term = searchTerm.toLowerCase();
        return data.filter(company =>
            company.companyName.toLowerCase().includes(term) ||
            company.adminName.toLowerCase().includes(term) ||
            company.lga.toLowerCase().includes(term) ||
            company.dateJoined.includes(term) ||
            company.status.toLowerCase().includes(term)
        );
    };

    const applyFilters = () => {
        // Note: We're keeping the filter logic but it will work with the real data
        // In a real implementation, we might want to filter on the server side
        let filteredData = companies.filter(company => {
            return Object.keys(filters).every(key => {
                if (!filters[key]) return true;
                if (key === 'status' || key === 'dateJoined') {
                    return company[key] === filters[key];
                }
                return company[key].toLowerCase().includes(filters[key].toLowerCase());
            });
        });

        // Apply search
        filteredData = applySearch(filteredData);

        // Apply current sort if exists
        if (sortConfig.key) {
            const sortedCompanies = [...filteredData].sort((a, b) => {
                const key = sortConfig.key;
                if (a[key] < b[key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[key] > b[key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
            setFilteredCompanies(sortedCompanies);
        } else {
            setFilteredCompanies(filteredData);
        }

        setIsFilterOpen(false);
    };

    const clearFilters = () => {
        setFilters({
            companyName: '',
            adminName: '',
            lga: '',
            status: '',
            dateJoined: ''
        });
        setSearchTerm('');

        // Reset to original data (refetch from API)
        const loadPSPs = async () => {
            setLoading(true);
            try {
                const response = await fetchPSPs();
                const mappedData = mapPSPData(response.data);
                setCompanies(mappedData);
                setFilteredCompanies(mappedData);
            } catch (error) {
                console.error('Error fetching PSP data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPSPs();
        setIsFilterOpen(false);
    };

    const handleExport = () => {
        // Prepare data for export
        const exportData = companies.map((company, index) => ({
            'S/N': index + 1,
            'Company Name': company.companyName,
            'Admin Name': company.adminName,
            'Admin Phone': company.adminPhone,
            'LGA/LCDA': company.lga,
            'Company Address': company.companyAddress,
            'Date Joined': company.dateJoined,
            'Status': company.status
        }));

        // Use PapaParse to convert to CSV
        const csv = Papa.unparse(exportData);

        // Create blob and download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'psp_companies.csv');
        link.style.visibility = 'hidden';
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
                    <div className="max-w-8xl mx-auto">
                        <header className="mb-6">
                            <h1 className="text-2xl font-bold text-zinc-800">PSP Companies</h1>
                        </header>

                        <div className=" p-4">
                            {loading ? (
                                <PSPCompaniesSkeleton />
                            ) : (
                                <PSPCompaniesContent
                                    companies={filteredCompanies}
                                    handleActionClick={handleActionClick}
                                    handleSort={handleSort}
                                    sortConfig={sortConfig}
                                    openFilter={openFilter}
                                    handleExport={handleExport}
                                    searchTerm={searchTerm}
                                    handleSearchChange={handleSearchChange}
                                />
                            )}
                        </div>
                    </div>

                    <CompanyDetailsModal company={selectedCompany} onClose={closeModal} />
                    <FilterModal
                        isOpen={isFilterOpen}
                        onClose={closeFilter}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onApply={applyFilters}
                        onClear={clearFilters}
                        companyNames={companyNames}
                        adminNames={adminNames}
                        lgas={lgas}
                        statuses={statuses}
                        dates={dates}
                    />
                </main>
            </div>
        </div>
    );
}
