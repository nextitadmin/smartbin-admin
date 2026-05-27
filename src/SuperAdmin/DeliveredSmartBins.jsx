import React, { useState, useEffect } from 'react';
import Sidebar from '../components/SuperAdmin/Sidebar';
import Topbar from '../components/SuperAdmin/Topbar';
import Papa from 'papaparse';
import api from '../api/apiConfig';
import { useNavigate } from 'react-router-dom';

// --- Mock Data ---
const mockData = [
    { id: 1, date: '21-01-25', name: 'Olabankole Kolawole', binId: '#OD12589048', binType: 'Smart', lga: 'Ibeju-Lekki', address: '23, Association Dr, Dolphin estate, Lagos' },
    { id: 2, date: '22-01-25', name: 'Adewale Johnson', binId: '#OD12589049', binType: 'Non-Smart', lga: 'Ibeju-Lekki', address: '23, Association Dr, Dolphin estate, Lagos' },
    { id: 3, date: '24-01-25', name: 'Olabankole Kolawole', binId: '#OD12589050', binType: 'Smart', lga: 'Ajah', address: '23, Association Dr, Dolphin estate, Lagos' },
    { id: 4, date: '28-01-25', name: 'Maryam Abdullahi', binId: '#OD12589051', binType: 'Non-Smart', lga: 'Ajah', address: '23, Association Dr, Dolphin estate, Lagos' },
    { id: 5, date: '28-01-25', name: 'Olabankole Kolawole', binId: '#OD12589052', binType: 'Smart', lga: 'Ibeju-Lekki', address: '45, Palm Street, Lekki Phase 1, Lagos' },
    { id: 6, date: '28-01-25', name: 'Chinedu Eze', binId: '#OD12589053', binType: 'Smart', lga: 'Eti-Osa', address: '23, Association Dr, Dolphin estate, Lagos' },
    { id: 7, date: '28-01-25', name: 'Olabankole Kolawole', binId: '#OD12589054', binType: 'Smart', lga: 'Ibeju-Lekki', address: '23, Association Dr, Dolphin estate, Lagos' },
    { id: 8, date: '28-01-25', name: 'Adewale Johnson', binId: '#OD12589055', binType: 'Non-Smart', lga: 'Eti-Osa', address: '12, Victoria Island, Lagos' },
    { id: 9, date: '28-01-25', name: 'Olabankole Kolawole', binId: '#OD12589056', binType: 'Non-Smart', lga: 'Ibeju-Lekki', address: '23, Association Dr, Dolphin estate, Lagos' },
    { id: 10, date: '28-01-25', name: 'Maryam Abdullahi', binId: '#OD12589057', binType: 'Non-Smart', lga: 'Ajah', address: '7, Lekki Gardens, Lagos' },
    { id: 11, date: '28-01-25', name: 'Olabankole Kolawole', binId: '#OD12589058', binType: 'Non-Smart', lga: 'Ibeju-Lekki', address: '23, Association Dr, Dolphin estate, Lagos' },
    { id: 12, date: '28-01-25', name: 'Chinedu Eze', binId: '#OD12589059', binType: 'Smart', lga: 'Eti-Osa', address: '23, Association Dr, Dolphin estate, Lagos' },
    { id: 13, date: '28-01-25', name: 'Olabankole Kolawole', binId: '#OD12589060', binType: 'Smart', lga: 'Ibeju-Lekki', address: '23, Association Dr, Dolphin estate, Lagos' },
];

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
const DeliveredSmartBinsContent = ({ bins, handleSort, sortConfig, openFilter, handleExport, searchTerm, handleSearchChange }) => (
    <>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                    onClick={openFilter}
                    className="flex items-center px-4 py-2 border bg-white border-zinc-300 rounded-lg text-green-700 hover:bg-zinc-100 transition"
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
                        className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded-lg focus:ring-green-500 focus:border-green-500"
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

        <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
            <table className="min-w-full divide-y divide-zinc-200">
                <thead className="bg-zinc-50">
                    <tr>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider cursor-pointer hover:bg-zinc-100"
                            onClick={() => handleSort('id')}
                        >
                            <div className="flex items-center">
                                S/N
                                <SortIcon direction={sortConfig.key === 'id' ? sortConfig.direction : null} />
                            </div>
                        </th>
                        <th
                            className="px-6 py-3 text-center text-xs font-medium text-zinc-600 uppercase tracking-wider cursor-pointer hover:bg-zinc-100"
                            onClick={() => handleSort('date')}
                        >
                            <div className="flex items-center justify-center">
                                Date
                                <SortIcon direction={sortConfig.key === 'date' ? sortConfig.direction : null} />
                            </div>
                        </th>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider cursor-pointer hover:bg-zinc-100"
                            onClick={() => handleSort('name')}
                        >
                            <div className="flex items-center">
                                Name
                                <SortIcon direction={sortConfig.key === 'name' ? sortConfig.direction : null} />
                            </div>
                        </th>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider cursor-pointer hover:bg-zinc-100"
                            onClick={() => handleSort('binId')}
                        >
                            <div className="flex items-center">
                                Bin ID
                                <SortIcon direction={sortConfig.key === 'binId' ? sortConfig.direction : null} />
                            </div>
                        </th>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider cursor-pointer hover:bg-zinc-100"
                            onClick={() => handleSort('binType')}
                        >
                            <div className="flex items-center">
                                Bin Type
                                <SortIcon direction={sortConfig.key === 'binType' ? sortConfig.direction : null} />
                            </div>
                        </th>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider cursor-pointer hover:bg-zinc-100"
                            onClick={() => handleSort('lga')}
                        >
                            <div className="flex items-center">
                                LGA
                                <SortIcon direction={sortConfig.key === 'lga' ? sortConfig.direction : null} />
                            </div>
                        </th>
                        <th
                            className="px-6 py-3 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider cursor-pointer hover:bg-zinc-100"
                            onClick={() => handleSort('address')}
                        >
                            <div className="flex items-center">
                                Address
                                <SortIcon direction={sortConfig.key === 'address' ? sortConfig.direction : null} />
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-zinc-200">
                    {bins.map((bin) => (
                        <tr key={bin.id} className="hover:bg-zinc-50 border-b border-zinc-100">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600">{bin.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 text-center">{bin.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600">{bin.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600">{bin.binId}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600">{bin.binType}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600">{bin.lga}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600">{bin.address}</td>
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
const DeliveredSmartBinsSkeleton = () => (
    <>
        <HeaderSkeleton />
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200">
                <thead className="bg-zinc-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider">S/N</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-zinc-600 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider">Bin ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider">Bin Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider">LGA</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-600 uppercase tracking-wider">Address</th>
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
const BinDetailsModal = ({ bin, onClose }) => {
    if (!bin) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-zinc-800">Bin Details</h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-800 text-2xl">&times;</button>
                </div>
                <div>
                    <div className="mb-4">
                        <p className="font-semibold text-zinc-600">S/N:</p>
                        <p className="text-lg text-zinc-800">{bin.id}</p>
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold text-zinc-600">Date:</p>
                        <p className="text-lg text-zinc-800">{bin.date}</p>
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold text-zinc-600">Name:</p>
                        <p className="text-lg text-zinc-800">{bin.name}</p>
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold text-zinc-600">Bin ID:</p>
                        <p className="text-lg text-zinc-800">{bin.binId}</p>
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold text-zinc-600">Bin Type:</p>
                        <p className="text-lg text-zinc-800">{bin.binType}</p>
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold text-zinc-600">LGA:</p>
                        <p className="text-lg text-zinc-800">{bin.lga}</p>
                    </div>
                    <div className="mb-4">
                        <p className="font-semibold text-zinc-600">Address:</p>
                        <p className="text-lg text-zinc-800">{bin.address}</p>
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

const FilterModal = ({ isOpen, onClose, filters, onFilterChange, onApply, onClear, binIds, binTypes, lgas, dates, names, addresses }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-green-800">Filter Bins</h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-800 text-2xl">&times;</button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Name</label>
                        <select
                            name="name"
                            value={filters.name}
                            onChange={onFilterChange}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Names</option>
                            {names.map((name, index) => (
                                <option key={index} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Bin ID</label>
                        <select
                            name="binId"
                            value={filters.binId}
                            onChange={onFilterChange}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Bin IDs</option>
                            {binIds.map((id, index) => (
                                <option key={index} value={id}>{id}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Bin Type</label>
                        <select
                            name="binType"
                            value={filters.binType}
                            onChange={onFilterChange}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Bin Types</option>
                            {binTypes.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">LGA</label>
                        <select
                            name="lga"
                            value={filters.lga}
                            onChange={onFilterChange}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All LGAs</option>
                            {lgas.map((lga, index) => (
                                <option key={index} value={lga}>{lga}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Address</label>
                        <select
                            name="address"
                            value={filters.address}
                            onChange={onFilterChange}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Addresses</option>
                            {addresses.map((address, index) => (
                                <option key={index} value={address}>{address}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-1">Date</label>
                        <select
                            name="date"
                            value={filters.date}
                            onChange={onFilterChange}
                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Dates</option>
                            {dates.map((date, index) => (
                                <option key={index} value={date}>{date}</option>
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
                        onClick={() => {
                            onApply();
                            onClose();
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-800 transition"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---
export default function DeliveredSmartBins() {
    const navigate = useNavigate();
    const [bins, setBins] = useState([]);
    const [filteredBins, setFilteredBins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBin, setSelectedBin] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        name: '',
        binId: '',
        binType: '',
        lga: '',
        date: '',
        address: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    // Transform API data to match component's expected format
    const transformApiData = (apiData) => {
        if (!apiData || !apiData.records) return [];
        
        const normalizeBinType = (raw) => {
            const v = String(raw ?? '').toLowerCase().trim();
            if (v === 'smart') return 'Smart';
            if (v === 'non_smart' || v === 'non-smart' || v === 'nonsmart') return 'Non-Smart';
            return raw || 'N/A';
        };

        return apiData.records.map((record, index) => ({
            id: index + 1,
            date: record.date ? new Date(record.date).toLocaleDateString('en-GB') : 'N/A',
            name:
                record.name ||
                record.fullName ||
                record.userName ||
                record.applicantName ||
                record.customerName ||
                'N/A',
            binId: record.binId || record.bin_id || record.id || 'N/A',
            binType: normalizeBinType(record.binType ?? record.bin_type),
            lga: record.lga || record.lga_address || record.lgaAddress || 'N/A',
            address: record.address || record.userAddress || record.company_address || 'N/A'
        }));
    };

    // Get unique values for dropdowns from API data
    const getUniqueValues = (data, key) => {
        if (!data || !Array.isArray(data)) return [];
        return [...new Set(data.map(item => item[key]).filter(Boolean))];
    };

    // Fetch data from API
    useEffect(() => {
        const fetchDeliveredBins = async () => {
            try {
                setLoading(true);
                // Use the same endpoint as SmartbinOverview (it returns { records: [...] })
                const response = await api.get('/lawma/smartbins/superadmin/overview');
                const transformedData = transformApiData(response.data);
                setBins(transformedData);
                setFilteredBins(transformedData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching delivered bins:', error);
                // Fallback to mock data in case of error
                setBins(mockData);
                setFilteredBins(mockData);
                setLoading(false);
            }
        };

        fetchDeliveredBins();
    }, []);

    // Apply filters and search when they change
    useEffect(() => {
        let result = [...bins];
        
        // Apply filters
        result = result.filter(bin => {
            return Object.keys(filters).every(key => {
                if (!filters[key]) return true;
                return bin[key] && bin[key].toString().toLowerCase().includes(filters[key].toLowerCase());
            });
        });

        // Apply search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(bin =>
                bin.id.toString().includes(term) ||
                (bin.date && bin.date.toLowerCase().includes(term)) ||
                (bin.name && bin.name.toLowerCase().includes(term)) ||
                (bin.binId && bin.binId.toLowerCase().includes(term)) ||
                (bin.binType && bin.binType.toLowerCase().includes(term)) ||
                (bin.lga && bin.lga.toLowerCase().includes(term)) ||
                (bin.address && bin.address.toLowerCase().includes(term))
            );
        }

        // Apply sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                const key = sortConfig.key;
                if (a[key] < b[key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[key] > b[key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        setFilteredBins(result);
    }, [bins, filters, searchTerm, sortConfig]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const closeModal = () => {
        setSelectedBin(null);
    };

    const openFilter = () => {
        setIsFilterOpen(true);
    };

    const closeFilter = () => {
        setIsFilterOpen(false);
    };

    // Update filter state when user selects options
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const applyFilters = () => {
        // Filtering is automatically applied by the useEffect hook
    };

    const clearFilters = () => {
        setFilters({
            name: '',
            binId: '',
            binType: '',
            lga: '',
            date: '',
            address: ''
        });
        setSearchTerm('');
    };

    const handleExport = () => {
        // Prepare data for export
        const exportData = filteredBins.map((bin) => ({
            'S/N': bin.id,
            'Date': bin.date,
            'Name': bin.name,
            'Bin ID': bin.binId,
            'Bin Type': bin.binType,
            'LGA': bin.lga,
            'Address': bin.address
        }));

        // Use PapaParse to convert to CSV
        const csv = Papa.unparse(exportData);

        // Create blob and download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'delivered_smart_bins.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Get unique values for dropdowns
    const binIds = getUniqueValues(filteredBins, 'binId');
    const binTypes = getUniqueValues(filteredBins, 'binType');
    const lgas = getUniqueValues(filteredBins, 'lga');
    const dates = getUniqueValues(filteredBins, 'date');
    const names = getUniqueValues(filteredBins, 'name');
    const addresses = getUniqueValues(filteredBins, 'address');

    return (
        <div className="flex min-h-screen bg-zinc-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-8xl mx-auto">
                        <header className="mb-6">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="p-2 rounded-md hover:bg-zinc-200"
                                    aria-label="Go back"
                                >
                                    <ChevronLeftIcon />
                                </button>
                                <h1 className="text-2xl font-semibold text-zinc-800">Delivered smart bins</h1>
                            </div>
                        </header>

                        <div className="p-4">
                            {loading ? (
                                <DeliveredSmartBinsSkeleton />
                            ) : (
                                <DeliveredSmartBinsContent
                                    bins={filteredBins}
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

                    <BinDetailsModal bin={selectedBin} onClose={closeModal} />
                    <FilterModal
                        isOpen={isFilterOpen}
                        onClose={closeFilter}
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onApply={applyFilters}
                        onClear={clearFilters}
                        binIds={binIds}
                        binTypes={binTypes}
                        lgas={lgas}
                        dates={dates}
                        names={names}
                        addresses={addresses}
                    />
                </main>
            </div>
        </div>
    );
}