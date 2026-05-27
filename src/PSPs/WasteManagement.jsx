import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '../components/PSPs/Sidebar';
import Topbar from '../components/PSPs/Topbar';
import SkeletonLoader from '../components/SkeletonLoader';

// --- SVG ICONS (Heroicons) ---
const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
);

const XMarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


// --- MOCK API DATA ---
const mockScheduledPickups = [
    { 
        id: '#OD12589048', 
        customerName: 'Adebola Ade', 
        phone: '+234 801 234 5678',
        email: 'adebola.ade@email.com',
        address: '12, Awolowo Road, Ikoyi, Lagos', 
        lga: 'Eti-Osa LGA', 
        lcda: 'Ikoyi LCDA',
        pspTeam: 'Adenike James', 
        fillLevel: '97%',
        note: 'Please collect early morning as bin is almost full'
    },
    { 
        id: '#OD12589049', 
        customerName: 'Falomo Jide', 
        phone: '+234 802 345 6789',
        email: 'falomo.jide@email.com',
        address: '45, Oguntana Drive, Surulere, Lagos', 
        lga: 'Surulere LGA', 
        lcda: 'Surulere LCDA',
        pspTeam: 'Adenike James', 
        fillLevel: '75%',
        note: 'Gate access code: 1234'
    },
    { 
        id: '#OD12589050', 
        customerName: 'Babatunde Shina', 
        phone: '+234 803 456 7890',
        email: 'babatunde.shina@email.com',
        address: '4, Bode Thomas Street, Surulere, Lagos', 
        lga: 'Surulere LGA', 
        lcda: 'Surulere LCDA',
        pspTeam: 'Adenike James', 
        fillLevel: '35%',
        note: 'Contact security before entry'
    },
    { 
        id: '#OD12589051', 
        customerName: 'Fatimo Adetola', 
        phone: '+234 804 567 8901',
        email: 'fatimo.adetola@email.com',
        address: '8, Akin Adedeji Street, Victoria Island, Lagos', 
        lga: 'Eti-Osa LGA', 
        lcda: 'Victoria Island LCDA',
        pspTeam: '7th Jun, 2025', 
        fillLevel: '35%',
        note: 'Building has restricted access, call before arrival'
    },
    { 
        id: '#OD12589052', 
        customerName: 'Chinedu Okoro', 
        phone: '+234 805 678 9012',
        email: 'chinedu.okoro@email.com',
        address: '15, Allen Avenue, Ikeja, Lagos', 
        lga: 'Ikeja LGA', 
        lcda: 'Ikeja LCDA',
        pspTeam: 'Babatunde Toba', 
        fillLevel: '80%',
        note: 'Please use service entrance at the back'
    },
    { 
        id: '#OD12589053', 
        customerName: 'Grace Okafor', 
        phone: '+234 806 789 0123',
        email: 'grace.okafor@email.com',
        address: '22, Admiralty Way, Lekki, Lagos', 
        lga: 'Eti-Osa LGA', 
        lcda: 'Lekki LCDA',
        pspTeam: 'Adenike James', 
        fillLevel: '60%',
        note: 'Gate opens at 8 AM, contact if earlier pickup needed'
    },
];

const mockAssignedPickups = [
    { id: '#OD12589054', name: 'Chibuikem Nkeonye', address: '12, Awolowo Road, Ikoyi, Lagos', assignedTo: 'Babatunde Toba', dateAssigned: '09/08/2023 2:33PM' },
    { id: '#OD12589055', name: 'Aisha Mohammed', address: '45, Oguntana Drive, Surulere, Lagos', assignedTo: 'Adenike James', dateAssigned: '10/08/2023 9:15AM' },
    { id: '#OD12589056', name: 'Emmanuel Okafor', address: '4, Bode Thomas Street, Surulere, Lagos', assignedTo: 'Babatunde Toba', dateAssigned: '11/08/2023 1:45PM' },
    { id: '#OD12589057', name: 'Kemi Adebayo', address: '8, Akin Adedeji Street, Victoria Island, Lagos', assignedTo: 'Adenike James', dateAssigned: '12/08/2023 3:20PM' },
];

const mockCompletedPickups = [
    { id: '#OD12589058', name: 'Oluwaseun Adeyemi', address: '12, Awolowo Road, Ikoyi, Lagos', assignedTo: 'Babatunde Toba', dateCompleted: '09/08/2023 2:33PM' },
    { id: '#OD12589059', name: 'Funmi Olatunji', address: '45, Oguntana Drive, Surulere, Lagos', assignedTo: 'Adenike James', dateCompleted: '10/08/2023 4:15PM' },
];

const mockPSPTeamMembers = [
    { id: 1, name: 'Adenike James', email: 'adenike.james@psp.com', phone: '+234 801 234 5678', status: 'Available' },
    { id: 2, name: 'Babatunde Toba', email: 'babatunde.toba@psp.com', phone: '+234 802 345 6789', status: 'Available' },
    { id: 3, name: 'Chinedu Okoro', email: 'chinedu.okoro@psp.com', phone: '+234 803 456 7890', status: 'Busy' },
    { id: 4, name: 'Fatima Ibrahim', email: 'fatima.ibrahim@psp.com', phone: '+234 804 567 8901', status: 'Available' },
    { id: 5, name: 'Emmanuel Okafor', email: 'emmanuel.okafor@psp.com', phone: '+234 805 678 9012', status: 'Available' },
    { id: 6, name: 'Grace Adebayo', email: 'grace.adebayo@psp.com', phone: '+234 806 789 0123', status: 'Busy' },
    { id: 7, name: 'Ibrahim Mohammed', email: 'ibrahim.mohammed@psp.com', phone: '+234 807 890 1234', status: 'Available' },
    { id: 8, name: 'Kemi Adesanya', email: 'kemi.adesanya@psp.com', phone: '+234 808 901 2345', status: 'Available' },
];

// --- MOCK API FETCH FUNCTIONS ---
const fetchScheduledPickups = () => new Promise(resolve => setTimeout(() => resolve(mockScheduledPickups), 500));
const fetchAssignedPickups = () => new Promise(resolve => setTimeout(() => resolve(mockAssignedPickups), 500));
const fetchCompletedPickups = () => new Promise(resolve => setTimeout(() => resolve(mockCompletedPickups), 500));


// --- HELPER HOOK for sorting ---
const useSortableData = (items, config = null) => {
    const [sortConfig, setSortConfig] = useState(config);

    const sortedItems = useMemo(() => {
        let sortableItems = [...items];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return { items: sortedItems, requestSort, sortConfig };
};


// --- COMPONENTS ---

// Notification Component
const Notification = ({ message, type = 'success', isVisible, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000); // Auto-close after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
            <div className={`p-4 rounded-lg shadow-lg border-l-4 ${
                type === 'success' 
                    ? 'bg-green-50 border-green-400 text-green-800' 
                    : 'bg-red-50 border-red-400 text-red-800'
            }`}>
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        {type === 'success' ? (
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium">{message}</p>
                    </div>
                    <div className="ml-auto pl-3">
                        <button
                            onClick={onClose}
                            className={`inline-flex rounded-md p-1.5 ${
                                type === 'success' 
                                    ? 'text-green-500 hover:bg-green-100' 
                                    : 'text-red-500 hover:bg-red-100'
                            }`}
                        >
                            <XMarkIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PickupDetailsModal = ({ isOpen, onClose, pickup, onAssignClick }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-lg p-8 w-full max-w-2xl m-4 transform transition-transform duration-300 ease-out"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center pb-4 border-b border-zinc-200 mb-6">
                    <div className='flex items-center space-x-2'>
                        <button onClick={onClose} className="text-zinc-500 hover:text-zinc-800">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <h2 className="text-xl font-semibold text-zinc-900">{pickup?.id}</h2>
                        <p className='text-sm text-zinc-500 font-medium bg-zinc-100 px-2 py-1 rounded-full'>Scheduled</p>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-800">
                        <XMarkIcon />
                    </button>
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-zinc-800 mb-6">Details</h3>
                    <div className='grid grid-cols-3 w-full gap-5 mb-6'>
                        <div className="break-words">
                            <label className="block text-sm font-medium text-zinc-500 mb-1" htmlFor="customerName">Customer name</label>
                            <p className="md:text-lg break-words">{pickup?.customerName || 'N/A'}</p>
                        </div>
                        <div className="break-words">
                            <label className="block text-sm font-medium text-zinc-500 mb-1" htmlFor="phone">Phone number</label>
                            <p className="md:text-lg break-words">{pickup?.phone || 'N/A'}</p>
                        </div>
                        <div className="break-words">
                            <label className="block text-sm font-medium text-zinc-500 mb-1" htmlFor="email">Email address</label>
                            <p className="md:text-lg break-words">{pickup?.email || 'N/A'}</p>
                        </div>
                        <div className="col-span-3 break-words">
                            <label className="block text-sm font-medium text-zinc-500 mb-1" htmlFor="address">Address</label>
                            <p className="md:text-lg break-words">{pickup?.address || 'N/A'}</p>
                        </div>
                        <div className="break-words">
                            <label className="block text-sm font-medium text-zinc-500 mb-1" htmlFor="lga">LGA</label>
                            <p className="md:text-lg break-words">{pickup?.lga || 'N/A'}</p>
                        </div>
                        <div className="break-words">
                            <label className="block text-sm font-medium text-zinc-500 mb-1" htmlFor="lcda">LCDA</label>
                            <p className="md:text-lg break-words">{pickup?.lcda || 'N/A'}</p>
                        </div>
                        <div className="break-words">
                            <label className="block text-sm font-medium text-zinc-500 mb-1" htmlFor="fillLevel">SmartBin waste level</label>
                            <p className="md:text-lg break-words">{pickup?.fillLevel || 'N/A'}</p>
                        </div>
                        <div className="col-span-3 break-words">
                            <label className="block text-sm font-medium text-zinc-500 mb-1" htmlFor="note">Note from customer</label>
                            <p className="md:text-lg break-words">{pickup?.note || '-'}</p>
                        </div>
                    </div>

                    <div className='flex justify-end gap-2'>
                        <button onClick={onClose} type="button" className="text-green-800 border border-green-800 px-6 py-2.5 rounded-md hover:bg-zinc-100 transition-colors text-sm font-semibold">
                            Cancel
                        </button>
                        <button onClick={() => onAssignClick(pickup)} type="button" className="bg-green-700 text-white px-6 py-2.5 rounded-md hover:bg-green-800 transition-colors text-sm font-semibold">
                            Assign PSP member
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AssignTeamMemberModal = ({ isOpen, onClose, onBack, pickup, onAssignSuccess }) => {
    const [selectedMember, setSelectedMember] = useState('');
    const [email, setEmail] = useState('');
    const [comment, setComment] = useState('');

    // Clear form when modal opens to ensure fresh state
    useEffect(() => {
        if (isOpen) {
            setSelectedMember('');
            setEmail('');
            setComment('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Function to clear form fields
    const clearForm = () => {
        setSelectedMember('');
        setEmail('');
        setComment('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Assigning member:', { selectedMember, email, comment, pickup });
        
        // Get the selected member's name for the notification
        const member = mockPSPTeamMembers.find(m => m.id.toString() === selectedMember);
        const memberName = member ? member.name : 'Unknown Member';
        
        // Trigger success notification
        if (onAssignSuccess) {
            onAssignSuccess(`Team member ${memberName} has been successfully assigned to ${pickup?.id}`);
        }
        
        // Clear the form after successful assignment
        clearForm();
        
        onClose();
    };

    const handleMemberChange = (e) => {
        const memberId = e.target.value;
        setSelectedMember(memberId);
        const member = mockPSPTeamMembers.find(m => m.id.toString() === memberId);
        if (member) {
            setEmail(member.email);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-lg p-8 w-full max-w-2xl m-4 transform transition-transform duration-300 ease-out"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center pb-4 border-b border-zinc-200 mb-6">
                    <div className='flex items-center space-x-2'>
                        <button onClick={onBack} className="text-zinc-500 hover:text-zinc-800">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <h2 className="text-xl font-semibold text-zinc-900">{pickup?.id}</h2>
                        <p className='text-sm text-zinc-500 font-medium bg-zinc-100 px-2 py-1 rounded-full'>Scheduled</p>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-800">
                        <XMarkIcon />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <h3 className="text-lg font-semibold text-zinc-800 mb-6">Assign team member</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-zinc-600 mb-2" htmlFor="pspTeam">Select PSP team member</label>
                            <div className="relative">
                                <select 
                                    id="pspTeam" 
                                    value={selectedMember}
                                    onChange={handleMemberChange}
                                    className="w-full px-4 py-2.5 border border-zinc-200 rounded-md appearance-none bg-white"
                                >
                                    <option value="">Choose a team member</option>
                                    {mockPSPTeamMembers.map(member => (
                                        <option key={member.id} value={member.id}>
                                            {member.name} - {member.status}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-700">
                                    <ChevronDownIcon />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-600 mb-2" htmlFor="email">Email address</label>
                            <input 
                                type="email" 
                                id="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address" 
                                className="w-full px-4 py-2.5 border border-zinc-200 rounded-md" 
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-medium text-zinc-600 mb-2" htmlFor="comment">Comment</label>
                        <textarea 
                            id="comment" 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add comment" 
                            rows="4" 
                            className="w-full px-4 py-2.5 border border-zinc-200 rounded-md"
                        ></textarea>
                    </div>

                    <div className='flex justify-end gap-2'>
                        <button onClick={onClose} type="button" className="text-green-800 border border-green-800 px-6 py-2.5 rounded-md hover:bg-zinc-100 transition-colors text-sm font-semibold">
                            Cancel
                        </button>
                        <button type="submit" className="bg-green-700 text-white px-6 py-2.5 rounded-md hover:bg-green-800 transition-colors text-sm font-semibold">
                            Assign member
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ScheduledPickupsTable = ({ onScheduleClick, searchTerm = '', filters = {} }) => {
    const [pickups, setPickups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { items, requestSort } = useSortableData(pickups);

    useEffect(() => {
        setIsLoading(true);
        fetchScheduledPickups().then(data => {
            setPickups(data);
            setIsLoading(false);
        });
    }, []);

    // Filter and search data
    const filteredItems = useMemo(() => {
        let filtered = [...items];
        
        // Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                Object.values(item).some(value =>
                    String(value).toLowerCase().includes(searchLower)
                )
            );
        }
        
        // Apply other filters
        if (filters.lga) {
            filtered = filtered.filter(item =>
                item.lga && item.lga.toLowerCase().includes(filters.lga.toLowerCase())
            );
        }
        
        if (filters.fillLevel) {
            filtered = filtered.filter(item => {
                const fillLevel = parseInt(item.fillLevel.replace('%', ''));
                const filterLevel = parseInt(filters.fillLevel);
                return fillLevel >= filterLevel;
            });
        }
        
        return filtered;
    }, [items, searchTerm, filters]);

    const headers = [
        { key: 'id', label: 'Waste ID' },
        { key: 'customerName', label: 'Customer name' },
        { key: 'address', label: 'Address' },
        { key: 'lga', label: 'LCDA' },
        // { key: 'pspTeam', label: 'PSP Team' },
        { key: 'fillLevel', label: 'Bin Fill Level' }
    ];

    if (isLoading) {
        return <SkeletonLoader />;
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full min-w-[900px] m-4 table-auto border-collapse">
                <thead className="border-b border-zinc-200">
                    <tr>
                        <th className="lg:p-6 p-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider w-12">S/N</th>
                        {headers.map(header => (
                            <th key={header.key} className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort(header.key)}>
                                {header.label}
                            </th>
                        ))}
                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                    {filteredItems.map((pickup, index) => (
                        <tr key={index} className="hover:bg-zinc-50 transition-colors duration-150">
                            <td className="lg:p-6 p-3 text-sm text-zinc-500">{index + 1}.</td>
                            <td className="lg:p-6 p-3 text-sm text-zinc-900">{pickup.id}</td>
                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{pickup.customerName}</td>
                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{pickup.address}</td>
                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{pickup.lga}</td>
                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{pickup.fillLevel}</td>
                            <td className="lg:p-6 p-3">
                                <button
                                    onClick={() => onScheduleClick(pickup)}
                                    className="bg-green-700 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-green-800 transition-colors whitespace-nowrap">
                                    Schedule pickup
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const AssignedPickupsTable = ({ searchTerm = '', filters = {} }) => {
    const [pickups, setPickups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { items, requestSort } = useSortableData(pickups);

    useEffect(() => {
        setIsLoading(true);
        fetchAssignedPickups().then(data => {
            setPickups(data);
            setIsLoading(false);
        });
    }, []);

    // Filter and search data
    const filteredItems = useMemo(() => {
        let filtered = [...items];
        
        // Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                Object.values(item).some(value =>
                    String(value).toLowerCase().includes(searchLower)
                )
            );
        }
        
        return filtered;
    }, [items, searchTerm, filters]);

    const headers = [
        { key: 'id', label: 'Waste ID' },
        { key: 'name', label: 'Name' },
        { key: 'address', label: 'Address' },
        { key: 'assignedTo', label: 'Assigned to' },
        { key: 'dateAssigned', label: 'Date assigned' }
    ];

    if (isLoading) {
        return <SkeletonLoader />;
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full min-w-[900px] m-4 table-auto border-collapse">
                <thead className="border-b border-zinc-200">
                    <tr>
                        <th className="lg:p-6 p-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider w-12">S/N</th>
                        {headers.map(header => (
                            <th key={header.key} className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort(header.key)}>
                                {header.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                    {filteredItems.map((pickup, index) => (
                        <tr key={index} className="hover:bg-zinc-50 transition-colors duration-150">
                            <td className="lg:p-6 p-3 text-sm text-zinc-500">{index + 1}.</td>
                            <td className="lg:p-6 p-3 text-sm text-zinc-900">{pickup.id}</td>
                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{pickup.name}</td>
                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{pickup.address}</td>
                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{pickup.assignedTo}</td>
                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{pickup.dateAssigned}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const CompletedPickupsTable = ({ searchTerm = '', filters = {} }) => {
    const [pickups, setPickups] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { items, requestSort } = useSortableData(pickups);

    useEffect(() => {
        setIsLoading(true);
        fetchCompletedPickups().then(data => {
            setPickups(data);
            setIsLoading(false);
        });
    }, []);

    // Filter and search data
    const filteredItems = useMemo(() => {
        let filtered = [...items];
        
        // Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                Object.values(item).some(value =>
                    String(value).toLowerCase().includes(searchLower)
                )
            );
        }
        
        return filtered;
    }, [items, searchTerm, filters]);

    const headers = [
        { key: 'id', label: 'Waste ID' },
        { key: 'name', label: 'Name' },
        { key: 'address', label: 'Address' },
        { key: 'assignedTo', label: 'Assigned to' },
        { key: 'dateCompleted', label: 'Date completed' }
    ];

    if (isLoading) {
        return <SkeletonLoader />;
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full min-w-[900px] m-4 table-auto border-collapse">
                <thead className="border-b border-zinc-200">
                    <tr>
                        <th className="lg:p-6 p-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider w-12">S/N</th>
                        {headers.map(header => (
                            <th key={header.key} className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort(header.key)}>
                                {header.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                    {filteredItems.map((pickup, index) => (
                        <tr key={index} className="hover:bg-zinc-50 transition-colors duration-150">
                            <td className="lg:p-6 p-3 text-sm text-zinc-500">{index + 1}.</td>
                            <td className="lg:p-6 p-3 text-sm text-zinc-900">{pickup.id}</td>
                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{pickup.name}</td>
                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{pickup.address}</td>
                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{pickup.assignedTo}</td>
                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{pickup.dateCompleted}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Filter Modal Component
const FilterModal = ({ isOpen, onClose, filters, onFilterChange, onDateRangeChange, onApply, onClear }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-lg p-8 w-full max-w-2xl m-4 transform transition-transform duration-300 ease-out"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center pb-4 border-b border-zinc-200 mb-6">
                    <h2 className="text-xl font-semibold text-zinc-900">Filter Data</h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-zinc-800">
                        <XMarkIcon />
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-600 mb-2" htmlFor="lga">LGA</label>
                        <input 
                            type="text" 
                            id="lga"
                            value={filters.lga}
                            onChange={(e) => onFilterChange('lga', e.target.value)}
                            placeholder="Enter LGA name"
                            className="w-full px-4 py-2.5 border border-zinc-200 rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-600 mb-2" htmlFor="fillLevel">Minimum Fill Level (%)</label>
                        <input 
                            type="number" 
                            id="fillLevel"
                            value={filters.fillLevel}
                            onChange={(e) => onFilterChange('fillLevel', e.target.value)}
                            placeholder="Enter minimum fill level"
                            min="0"
                            max="100"
                            className="w-full px-4 py-2.5 border border-zinc-200 rounded-md"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-600 mb-2" htmlFor="startDate">Start Date</label>
                            <input 
                                type="date" 
                                id="startDate"
                                value={filters.dateRange.start}
                                onChange={(e) => onDateRangeChange('start', e.target.value)}
                                className="w-full px-4 py-2.5 border border-zinc-200 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-600 mb-2" htmlFor="endDate">End Date</label>
                            <input 
                                type="date" 
                                id="endDate"
                                value={filters.dateRange.end}
                                onChange={(e) => onDateRangeChange('end', e.target.value)}
                                className="w-full px-4 py-2.5 border border-zinc-200 rounded-md"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                    <button 
                        onClick={onClear}
                        className="px-6 py-2 text-zinc-600 hover:text-zinc-800 rounded-lg transition-colors"
                    >
                        Clear All
                    </button>
                    <button 
                        onClick={onApply}
                        className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition-colors"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function WasteManagement() {
    const [activeTab, setActiveTab] = useState('Scheduled pickups');
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedPickup, setSelectedPickup] = useState(null);
    const [notification, setNotification] = useState({ isVisible: false, message: '', type: 'success' });
    
    // Search and filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [filters, setFilters] = useState({
        lga: '',
        fillLevel: '',
        dateRange: { start: '', end: '' }
    });

    const handleScheduleClick = (pickup) => {
        setSelectedPickup(pickup);
        setIsDetailsModalOpen(true);
    };

    const handleAssignClick = (pickup) => {
        setSelectedPickup(pickup);
        setIsDetailsModalOpen(false);
        setIsAssignModalOpen(true);
    };

    const handleBackToDetails = () => {
        setIsAssignModalOpen(false);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedPickup(null);
    };

    const handleCloseAssignModal = () => {
        setIsAssignModalOpen(false);
        setSelectedPickup(null);
    };

    const handleAssignSuccess = (message) => {
        setNotification({
            isVisible: true,
            message: message,
            type: 'success'
        });
    };

    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, isVisible: false }));
    };

    // Search functionality
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filter functionality
    const handleFilterClick = () => {
        setIsFilterModalOpen(true);
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const handleDateRangeChange = (type, value) => {
        setFilters(prev => ({
            ...prev,
            dateRange: {
                ...prev.dateRange,
                [type]: value
            }
        }));
    };

    const applyFilters = () => {
        setIsFilterModalOpen(false);
        // Filters are applied in the table components
    };

    const clearFilters = () => {
        setFilters({
            lga: '',
            fillLevel: '',
            dateRange: { start: '', end: '' }
        });
        setSearchTerm('');
    };

    // Export functionality
    const handleExportClick = async () => {
        setIsExporting(true);
        
        try {
            // Add a small delay to make the loading state visible
            await new Promise(resolve => setTimeout(resolve, 500));

            let csvContent = '';
            let filename = '';

            // Get current data based on active tab
            let data = [];
            let headers = [];

            switch (activeTab) {
                case 'Scheduled pickups':
                    data = mockScheduledPickups;
                    headers = ['S/N', 'Waste ID', 'Customer Name', 'Phone', 'Email', 'Address', 'LGA', 'LCDA', 'PSP Team', 'Fill Level', 'Note'];
                    break;
                case 'Assigned':
                    data = mockAssignedPickups;
                    headers = ['S/N', 'Waste ID', 'Name', 'Address', 'Assigned To', 'Date Assigned'];
                    break;
                case 'Completed':
                    data = mockCompletedPickups;
                    headers = ['S/N', 'Waste ID', 'Name', 'Address', 'Assigned To', 'Date Completed'];
                    break;
                default:
                    data = [];
            }

            // Apply search filter
            const filteredData = data.filter(item => {
                const searchLower = searchTerm.toLowerCase();
                return Object.values(item).some(value => 
                    String(value).toLowerCase().includes(searchLower)
                );
            });

            // Apply other filters
            const finalData = filteredData.filter(item => {
                if (filters.lga && item.lga && !item.lga.toLowerCase().includes(filters.lga.toLowerCase())) {
                    return false;
                }
                if (filters.fillLevel && item.fillLevel) {
                    const fillLevel = parseInt(item.fillLevel.replace('%', ''));
                    const filterLevel = parseInt(filters.fillLevel);
                    if (fillLevel < filterLevel) return false;
                }
                return true;
            });

            // Create CSV content
            const rows = finalData.map((item, index) => {
                switch (activeTab) {
                    case 'Scheduled pickups':
                        return [
                            index + 1,
                            `"${item.id}"`,
                            `"${item.customerName}"`,
                            `"${item.phone}"`,
                            `"${item.email}"`,
                            `"${item.address}"`,
                            `"${item.lga}"`,
                            `"${item.lcda}"`,
                            `"${item.pspTeam}"`,
                            `"${item.fillLevel}"`,
                            `"${item.note}"`
                        ];
                    case 'Assigned':
                        return [
                            index + 1,
                            `"${item.id}"`,
                            `"${item.name}"`,
                            `"${item.address}"`,
                            `"${item.assignedTo}"`,
                            `"${item.dateAssigned}"`
                        ];
                    case 'Completed':
                        return [
                            index + 1,
                            `"${item.id}"`,
                            `"${item.name}"`,
                            `"${item.address}"`,
                            `"${item.assignedTo}"`,
                            `"${item.dateCompleted}"`
                        ];
                    default:
                        return [];
                }
            });

            csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
            filename = `waste-management-${activeTab.toLowerCase().replace(' ', '-')}-${new Date().toISOString().split('T')[0]}.csv`;

            // Create and download the file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');

            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            setNotification({
                isVisible: true,
                message: `${activeTab} data exported successfully!`,
                type: 'success'
            });
        } catch (error) {
            console.error('Error exporting data:', error);
            setNotification({
                isVisible: true,
                message: 'Failed to export data. Please try again.',
                type: 'error'
            });
        } finally {
            setIsExporting(false);
        }
    };

    const renderTable = () => {
        switch (activeTab) {
            case 'Scheduled pickups':
                return <ScheduledPickupsTable onScheduleClick={handleScheduleClick} searchTerm={searchTerm} filters={filters} />;
            case 'Assigned':
                return <AssignedPickupsTable searchTerm={searchTerm} filters={filters} />;
            case 'Completed':
                return <CompletedPickupsTable searchTerm={searchTerm} filters={filters} />;
            default:
                return null;
        }
    };

    const tabs = ['Scheduled pickups', 'Assigned', 'Completed'];

    return (
        <div className="flex h-screen">
            <Sidebar addkey="1" />
            <div className="flex-1 bg-zinc-100 min-h-screen overflow-y-auto">
                <Topbar />
                <div className="bg-zinc-100 font-sans">
                    <main className="p-4 md:px-4">
                        <div className="p-4 md:p-8 font-sans">
                            <header className="mb-8">
                                <h1 className="text-3xl font-bold text-zinc-800">Waste management</h1>
                                <p className="text-zinc-500 mt-1">Manage waste pick up and disposal</p>
                            </header>

                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                {/* Tabs */}
                                <div className='inline-flex gap-7 text-lg mb-7 border-b border-zinc-200'>
                                    {tabs.map(tab => (
                                        <button
                                            key={tab}
                                            type="button"
                                            className={`relative pb-2 -mb-[2px] transition-colors duration-300 ease-out
                        after:content-["\""] after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-full after:bg-green-700
                        after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out
                        ${activeTab === tab
                                                ? 'text-green-700 after:scale-x-100'
                                                : 'text-zinc-500 hover:text-zinc-700 after:scale-x-0'
                                            }`}
                                            onClick={() => setActiveTab(tab)}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>


                            </div>
                            {/* Controls */}
                            <div className="flex items-center justify-center space-x-4 mt-4 md:mt-0 mb-3">
                                <div className="relative flex-grow">
                                    <input 
                                        type="text" 
                                        placeholder="Search" 
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="w-full sm:w-75 pl-10 pr-4 py-3 border border-zinc-200 rounded-md text-sm bg-white focus:ring-green-700 focus:border-green-700" 
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-800">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className='flex space-x-4 items-center mb-5 md:mb-5'>
                                    <button 
                                        onClick={handleFilterClick}
                                        className="px-4 py-3 rounded-md border border-zinc-300 text-sm font-medium text-zinc-700 bg-white hover:bg-zinc-50 transition-colors"
                                    >
                                        Filter
                                    </button>
                                    <button 
                                        onClick={handleExportClick}
                                        disabled={isExporting}
                                        className="px-4 py-3 rounded-md border border-zinc-300 text-sm font-medium text-zinc-700 bg-white hover:bg-zinc-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isExporting ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Exporting...
                                            </>
                                        ) : (
                                            'Export'
                                        )}
                                    </button>
                                </div>
                            </div>

                            {renderTable()}
                        </div>

                        <PickupDetailsModal
                            isOpen={isDetailsModalOpen}
                            onClose={handleCloseDetailsModal}
                            pickup={selectedPickup}
                            onAssignClick={handleAssignClick}
                        />
                        <AssignTeamMemberModal
                            isOpen={isAssignModalOpen}
                            onClose={handleCloseAssignModal}
                            onBack={handleBackToDetails}
                            pickup={selectedPickup}
                            onAssignSuccess={handleAssignSuccess}
                        />
                        
                        {/* Filter Modal */}
                        <FilterModal
                            isOpen={isFilterModalOpen}
                            onClose={() => setIsFilterModalOpen(false)}
                            filters={filters}
                            onFilterChange={handleFilterChange}
                            onDateRangeChange={handleDateRangeChange}
                            onApply={applyFilters}
                            onClear={clearFilters}
                        />

                        {/* Notification Component */}
                        <Notification
                            message={notification.message}
                            type={notification.type}
                            isVisible={notification.isVisible}
                            onClose={handleCloseNotification}
                        />
                    </main>
                </div>
            </div>
        </div>
    );
}

