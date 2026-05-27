import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import Sidebar from '../components/Partners/Sidebar';
import Topbar from '../components/Partners/Topbar';
import api from '../api/apiConfig';
// import api from '../api/apiOnlyConfig';

import { PlusIcon, MagnifyingGlassIcon, XMarkIcon, EllipsisVerticalIcon, CheckCircleIconSolid, ExclamationTriangleIconSolid, LoadingSpinnerIcon, SortIcon, ChevronLeftIcon, ChevronRightIcon } from '../components/icons';
import SkeletonLoader from '../components/SkeletonLoader';

// Demo Data (as per image)
const demoTeamMembers = [
    {
        id: 1,
        name: 'Adebimpe Soriyan',
        email: 'adebimpe.soriyan@lawma.gov.ng',
        phone: '08029389102',
        role: 'Super Admin',
        status: 'Active'
    },
    {
        id: 2,
        name: 'Bolanle Toju',
        email: 'bolanle.toju@lawma.gov.ng',
        phone: '08032784726',
        role: 'Admin',
        status: 'Active'
    },
    {
        id: 3,
        name: 'Faridat Deola',
        email: 'faridat.deola@lawma.gov.ng',
        phone: '08142904836',
        role: 'Manager',
        status: 'Deactivated'
    },
    {
        id: 4,
        name: 'Martins Madueke',
        email: 'martins.madueke@lawma.gov.ng',
        phone: '07023780192',
        role: 'Supervisor',
        status: 'Deactivated'
    },
    {
        id: 5,
        name: 'Fisayo Mabel',
        email: 'fisayo.mabel@lawma.gov.ng',
        phone: '09011892739',
        role: 'Analyst',
        status: 'Active'
    },
    {
        id: 6,
        name: 'Fidelis James',
        email: 'fidelis.james@lawma.gov.ng',
        phone: '07038902948',
        role: 'Coordinator',
        status: 'Active'
    },
    {
        id: 7,
        name: 'Grace Okonkwo',
        email: 'grace.okonkwo@lawma.gov.ng',
        phone: '08123456789',
        role: 'Manager',
        status: 'Active'
    },
    {
        id: 8,
        name: 'Chinedu Okafor',
        email: 'chinedu.okafor@lawma.gov.ng',
        phone: '08098765432',
        role: 'Supervisor',
        status: 'Deactivated'
    },
    {
        id: 9,
        name: 'Amina Hassan',
        email: 'amina.hassan@lawma.gov.ng',
        phone: '07012345678',
        role: 'Analyst',
        status: 'Active'
    },
    {
        id: 10,
        name: 'Emmanuel Adebayo',
        email: 'emmanuel.adebayo@lawma.gov.ng',
        phone: '09087654321',
        role: 'Coordinator',
        status: 'Active'
    },
    {
        id: 11,
        name: 'Patience Nwosu',
        email: 'patience.nwosu@lawma.gov.ng',
        phone: '08134567890',
        role: 'Admin',
        status: 'Active'
    },
    {
        id: 12,
        name: 'Ibrahim Mohammed',
        email: 'ibrahim.mohammed@lawma.gov.ng',
        phone: '08076543210',
        role: 'Supervisor',
        status: 'Active'
    },
    {
        id: 13,
        name: 'Blessing Okafor',
        email: 'blessing.okafor@lawma.gov.ng',
        phone: '07098765432',
        role: 'Analyst',
        status: 'Deactivated'
    },
    {
        id: 14,
        name: 'Samuel Johnson',
        email: 'samuel.johnson@lawma.gov.ng',
        phone: '08123456789',
        role: 'Manager',
        status: 'Active'
    },
    {
        id: 15,
        name: 'Victoria Eze',
        email: 'victoria.eze@lawma.gov.ng',
        phone: '08012345678',
        role: 'Coordinator',
        status: 'Active'
    }
];


// Main Component
const TeamManagement = () => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '', visible: false });
    const [searchTerm, setSearchTerm] = useState('');
    const [isExporting, setIsExporting] = useState(false);

    // Sorting state
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Modal form fields
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newRole, setNewRole] = useState('Admin');
    const [newStatus, setNewStatus] = useState('Active');

    // Row action modal
    const [rowActionModal, setRowActionModal] = useState(false);
    const [currentMemberId, setCurrentMemberId] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const modalRef = useRef();

    // Edit member state
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingMember, setEditingMember] = useState(null);

    // Roles for dropdown
    const ROLES = ['admin', 'PSP Admin', 'PSP team member', 'smartbin partner', 'smartbin team member', 'super admin'];

    // Deactivation loading state
    const [isDeactivating, setIsDeactivating] = useState(false);

    // Handle activate/deactivate member (toggle status)
    const handleDeactivateMember = async () => {
        if (!currentMemberId) return;

        setIsDeactivating(true);

        try {
            const memberId = currentMemberId;
            
            // Find the current member to check their status
            const currentMember = teamMembers.find(member => 
                member.id === currentMemberId || member._id === currentMemberId
            );
            
            // Determine the new status based on current status
            const currentStatus = currentMember?.status?.toLowerCase() || 'active';
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            
            // Make API call to toggle member status
            const { data } = await api.put(`/lawma/teams/${memberId}/status`, {
                status: newStatus
            });
            
            if (data.success) {
                // Refresh team members list
                try {
                    const membersData = await api.get('/lawma/teams');
                    if (membersData.data.success) {
                        const rawMembers = Array.isArray(membersData.data) ? membersData.data : membersData.data?.data || [];
                        const members = rawMembers.map(member => ({
                            id: member._id,
                            _id: member._id,
                            name: member.name,
                            email: member.email,
                            phone: member.phoneNumber,
                            role: member.role,
                            status: member.status ? member.status.charAt(0).toUpperCase() + member.status.slice(1) : 'Active'
                        }));
                        setTeamMembers(members);
                    }
                } catch (refreshError) {
                    console.error('Error refreshing team members after status change:', refreshError);
                    // Even if refresh fails, the status change was successful
                }
                
                const actionText = newStatus === 'active' ? 'activated' : 'deactivated';
                showNotification(`Member ${actionText} successfully!`, 'success');
            } else {
                throw new Error(data.message || 'Failed to update member status');
            }
        } catch (error) {
            console.error('Error updating member status:', error);
            
            // Check if it's a network error or server error
            if (error.response) {
                // Server responded with error status
                const status = error.response.status;
                const errorMessage = error.response.data?.message || error.response.data?.error || 'Server error occurred';
                
                if (status === 404) {
                    showNotification('Member not found. It may have already been updated.', 'error');
                } else if (status === 403) {
                    showNotification('You do not have permission to update this member.', 'error');
                } else if (status === 409) {
                    showNotification('Cannot update member. Please check for dependencies.', 'error');
                } else if (status >= 500) {
                    showNotification('Server error. Please try again later.', 'error');
                } else {
                    showNotification(`Error: ${errorMessage}`, 'error');
                }
            } else if (error.request) {
                // Network error
                showNotification('Network error. Please check your connection and try again.', 'error');
            } else {
                // Other error
                showNotification('An unexpected error occurred while updating the member status.', 'error');
            }
        } finally {
            setIsDeactivating(false);
            setIsModalOpen(false);
            setRowActionModal(false);
            setCurrentMemberId(null);
        }
    };

    // Handle deactivate button click
    const handleDeactivateClick = () => {
        setRowActionModal(false);
        setIsModalOpen(true);
    };

    // Handle edit member button click
    const handleEditMemberClick = () => {
        const memberToEdit = teamMembers.find(member => 
            member.id === currentMemberId || member._id === currentMemberId
        );
        if (memberToEdit) {
            setEditingMember(memberToEdit);
            setNewName(memberToEdit.name);
            setNewEmail(memberToEdit.email);
            setNewPhone(memberToEdit.phoneNumber || memberToEdit.phone);
            setNewRole(memberToEdit.role);
            setNewStatus(memberToEdit.status);
            setIsEditMode(true);
            setRowActionModal(false);
            setIsModalOpen(true);
        }
    };



    // Fetch team members and roles (simulated API call)
    const fetchTeamMembers = async () => {
        setIsLoading(true);

        try {
            // Fetch team members
            const { data: teamData } = await api.get('/lawma/teams');
            const rawMembers = Array.isArray(teamData) ? teamData : teamData?.data || [];
            
            // Map the API response to match the expected structure
            const members = rawMembers.map(member => ({
                id: member._id,  // Map _id to id for consistency
                _id: member._id, // Keep original _id as well
                name: member.name,
                email: member.email,
                phone: member.phoneNumber || member.phone,
                role: member.role,
                status: member.status ? member.status.charAt(0).toUpperCase() + member.status.slice(1) : 'Active',
                taskAssigned: member.taskAssigned || member.tasksAssigned || 0,
                taskCompleted: member.taskCompleted || member.tasksCompleted || 0
            }));
            setTeamMembers(members);

        } catch (error) {
            console.error('Error fetching team members:', error);
            // Fallback to demo data
            if (import.meta.env.DEV) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            // Add task fields to demo data
            const demoDataWithTasks = demoTeamMembers.map(member => ({
                ...member,
                taskAssigned: Math.floor(Math.random() * 20),
                taskCompleted: Math.floor(Math.random() * 15)
            }));
            setTeamMembers(demoDataWithTasks);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTeamMembers();
    }, []);

    // Show notification
    const showNotification = (message, type) => {
        setNotification({ message, type, visible: true });
        setTimeout(() => {
            setNotification({ message: '', type: '', visible: false });
        }, 3000);
    };

    // Filtered and sorted members
    const filteredMembers = useMemo(() => {
        const search = searchTerm || '';
        let filtered = teamMembers.filter(member =>
            (member.name || '').toLowerCase().includes(search.toLowerCase()) ||
            (member.email || '').toLowerCase().includes(search.toLowerCase()) ||
            (member.role || '').toLowerCase().includes(search.toLowerCase()) ||
            (member.status || '').toLowerCase().includes(search.toLowerCase()) ||
            (member.phone || '').includes(search) ||
            (member.taskAssigned || 0).toString().includes(search) ||
            (member.taskCompleted || 0).toString().includes(search)
        );

        // Apply sorting
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                // Handle status sorting (Active/Deactivated)
                if (sortConfig.key === 'status') {
                    if (a.status === b.status) return 0;
                    if (sortConfig.direction === 'asc') {
                        return a.status === 'Active' ? -1 : 1;
                    } else {
                        return a.status === 'Active' ? 1 : -1;
                    }
                }

                // Handle numeric comparisons for task fields
                if (sortConfig.key === 'taskAssigned' || sortConfig.key === 'task-completed') {
                    const key = sortConfig.key === 'task-completed' ? 'taskCompleted' : 'taskAssigned';
                    const aVal = a[key] || 0;
                    const bVal = b[key] || 0;
                    if (aVal === bVal) return 0;
                    return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
                }

                // Handle other string/number comparisons
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];
                if (aVal < bVal) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aVal > bVal) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        } else {
            // Default sorting: show newest data at the top (by ID descending)
            filtered.sort((a, b) => {
                const aId = a.id || a._id || 0;
                const bId = b.id || b._id || 0;
                return bId - aId; // Descending order (newest first)
            });
        }

        return filtered;
    }, [teamMembers, searchTerm, sortConfig]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageItems = filteredMembers.slice(startIndex, endIndex);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Pagination navigation functions
    const goToNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const goToPreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    // Handle sorting
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Handle add member submit
    const handleAddMemberSubmit = async (e) => {
        e.preventDefault();

        if (!newName || !newEmail || !newPhone) {
            showNotification('Please fill all required fields.', 'error');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(newEmail)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        if (!/^\d{11}$/.test(newPhone)) {
            showNotification('Phone number must be exactly 11 digits.', 'error');
            return;
        }

        const mockSuccess = Math.random() > 0.2; // 80% success rate for demo

        setIsLoading(true);
        try {
            if (isEditMode) {
                // Update existing member
                const memberId = editingMember._id || editingMember.id;
                const { data } = await api.patch(`/lawma/teams/${memberId}`, {
                    name: newName,
                    email: newEmail,
                    // phoneNumber: newPhone,
                    // role: newRole,
                    // status: newStatus
                });
                showNotification('Team member updated successfully!', 'success');

                if (mockSuccess) {
                    // Update local list
                    setTeamMembers(prev => prev.map(member => 
                        member.id === editingMember.id 
                        ? { ...member, name: newName, email: newEmail, phone: newPhone, role: newRole, status: newStatus }
                        : member
                    )                    );
                } else {
                    showNotification('Failed to update team member. Please try again.', 'error');
                }
            } else {
                // Add new member
                const { data } = await api.post('/lawma/teams', {
                    name: newName,
                    email: newEmail,
                    // phoneNumber: newPhone,
                    // role: newRole,
                    // status: newStatus
                });

                if (mockSuccess) {
                    showNotification('Team member added successfully!', 'success');
                    // Add to local list
                    setTeamMembers(prev => [...prev, {
                        id: Date.now(),
                        name: newName,
                        email: newEmail,
                        phone: newPhone,
                        role: newRole,
                        status: newStatus
                    }]);
                } else {
                    showNotification('Failed to add team member. Please try again.', 'error');
                }
            }
        } catch (error) {
            showNotification(`An error occurred while ${isEditMode ? 'updating' : 'adding'} the member.`, `${error}`);
        } finally {
            setIsLoading(false);
            setIsModalOpen(false);
            setIsEditMode(false);
            setEditingMember(null);
            resetForm();
        }
    };

    const resetForm = () => {
        setNewName('');
        setNewEmail('');
        setNewPhone('');
        setNewRole('Admin');
        setNewStatus('Active');
    };

    // Export data to CSV
    const handleExportData = async () => {
        setIsExporting(true);
        
        // Add a small delay to make the loading state visible
        await new Promise(resolve => setTimeout(resolve, 500));
        
        try {
            // Export members data
            const headers = ['S/N', 'Name', 'Email Address', 'Phone Number', 'Task Assigned', 'Task Completed', 'Status'];
            const rows = filteredMembers.map((member, index) => [
                index + 1,
                `"${member.name}"`,
                `"${member.email}"`,
                `"${member.phone || ''}"`,
                member.taskAssigned || 0,
                member.taskCompleted || 0,
                `"${member.status}"`
            ]);
            
            const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
            const filename = `team-members-${new Date().toISOString().split('T')[0]}.csv`;
            
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
            
            showNotification('Members data exported successfully!', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            showNotification('Failed to export data. Please try again.', 'error');
        } finally {
            setIsExporting(false);
        }
    };

    // Handle row action click
    const handleRowActionClick = (id, event) => {
        const buttonRect = event.currentTarget.getBoundingClientRect();
        setDropdownPosition({
            top: buttonRect.bottom + window.scrollY + 8,
            left: buttonRect.right - 160 + window.scrollX // 160px is min-width of dropdown
        });
        
        setCurrentMemberId(id);
        setRowActionModal(true);
    };

    // Close row action modal when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (rowActionModal && modalRef.current && !modalRef.current.contains(event.target) && !event.target.closest('button')) {
                setRowActionModal(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [rowActionModal]);

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
        setCurrentMemberId(null);
        setIsEditMode(false);
        setEditingMember(null);
    };

    // Status badge
    const StatusBadge = ({ status }) => {
        const statusLower = status?.toLowerCase();
        const color = statusLower === 'active' ? 'text-green-700' : 
                     (statusLower === 'inactive' || statusLower === 'deactivated') ? 'text-red-600' : 'text-zinc-500';
        return <span className={`font-medium ${color}`}>{status}</span>;
    };

    // Pagination Component
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

    // Portal-based dropdown component
    const DropdownPortal = () => {
        if (!rowActionModal) return null;

        return createPortal(
            <div
                ref={modalRef}
                className="fixed z-[9999] bg-white rounded-lg shadow-lg border border-zinc-200 py-1 min-w-[160px]"
                style={{
                    top: dropdownPosition.top,
                    left: dropdownPosition.left,
                }}
            >
                <button 
                    onClick={handleEditMemberClick}
                    className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors duration-150"
                >
                    Edit details
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeactivateClick();
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-zinc-50 transition-colors duration-150 ${
                        (() => {
                            const member = teamMembers.find(m => m.id === currentMemberId || m._id === currentMemberId);
                            const status = member?.status?.toLowerCase();
                            return status === 'inactive' || status === 'deactivated' ? 'text-green-600' : 'text-red-600';
                        })()
                    }`}
                >
                    {(() => {
                        const member = teamMembers.find(m => m.id === currentMemberId || m._id === currentMemberId);
                        const status = member?.status?.toLowerCase();
                        return status === 'inactive' || status === 'deactivated' ? 'Activate' : 'Deactivate';
                    })()}
                </button>
            </div>,
            document.body
        );
    };

    return (
        <div className="flex sans h-screen">
            <Sidebar addkey="1" />
            <div className="flex-1 bg-zinc-100 min-h-screen overflow-y-auto">
                <Topbar />
                <div className="bg-zinc-100 font-sans">
                    <main className="p-4 md:px-4">
                        <div className="p-4 md:p-8 font-sans">
                            {/* Notification */}
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
                                    <h1 className="text-2xl md:text-3xl font-semibold text-zinc-800">Team Management</h1>
                                    <p className="text-zinc-500 text-lg font-light">Invite and manage admin team members here</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="mt-4 sm:mt-0 bg-green-700 hover:bg-green-600 sm:text-sm text-white font-semibold py-3 px-4 rounded-lg shadow-md flex items-center transition duration-150 ease-in-out"
                                >
                                    <PlusIcon className="mr-2 h-5 w-5" />
                                    Add new member
                                </button>
                            </header>

                

                            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="relative flex-grow max-w-lg">
                                    <input
                                        type="text"
                                        placeholder="Search members"
                                        className="w-full p-2 pl-10 border border-zinc-300 bg-white rounded-xl focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                                </div>
                                <button
                                    onClick={handleExportData}
                                    disabled={isExporting}
                                    className="px-4 py-3 text-sm text-zinc-700 bg-white border border-zinc-300 rounded-xl hover:bg-zinc-50 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition"
                                >
                                    {isExporting ? (
                                        <>
                                            <LoadingSpinnerIcon className="h-4 w-4 animate-spin" />
                                            Exporting...
                                        </>
                                    ) : (
                                        <>Export  data</>
                                    )}
                                </button>
                            </div>

                            <div className="overflow-x-auto">

                                {isLoading ? (
                                    <SkeletonLoader />
                                ) : filteredMembers.length === 0 ? (
                                    <div className="flex flex-col justify-center items-center mt-20">
                                        <h2 className="text-xl mb-1 sans">
                                            No team members found
                                        </h2>
                                        <p className="text-zinc-400 mt-2 font-light">
                                            There are no members matching your search.
                                        </p>
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="mt-6 text-zinc-600 pointer lg:w-1/2 rounded-xl text-lg mb-6 flex flex-row items-center font-light justify-center p-3"
                                        >
                                            <PlusIcon className="mr-2 h-5 w-5" />
                                            Add New Member
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-white border border-zinc-200 rounded-xl overflow-x-auto">
                                        <table className="w-full table-auto border-collapse">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer" onClick={() => handleSort('id')}>
                                                        <div className="flex items-center">
                                                            S/N
                                                            <SortIcon direction={sortConfig.key === 'id' ? sortConfig.direction : null} />
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer" onClick={() => handleSort('name')}>
                                                        <div className="flex items-center">
                                                            Name
                                                            <SortIcon direction={sortConfig.key === 'name' ? sortConfig.direction : null} />
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer" onClick={() => handleSort('email')}>
                                                        <div className="flex items-center">
                                                            Email address
                                                            <SortIcon direction={sortConfig.key === 'email' ? sortConfig.direction : null} />
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer" onClick={() => handleSort('taskAssigned')}>
                                                        <div className="flex items-center">
                                                            Task Assigned
                                                            <SortIcon direction={sortConfig.key === 'taskAssigned' ? sortConfig.direction : null} />
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer" onClick={() => handleSort('taskCompleted')}>
                                                        <div className="flex items-center">
                                                            Task Completed
                                                            <SortIcon direction={sortConfig.key === 'taskCompleted' ? sortConfig.direction : null} />
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700 cursor-pointer" onClick={() => handleSort('status')}>
                                                        <div className="flex items-center">
                                                            Status
                                                            <SortIcon direction={sortConfig.key === 'status' ? sortConfig.direction : null} />
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider text-zinc-700">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentPageItems.map((member, index) => (
                                                    <tr key={member.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                                                        <td className="px-4 py-3 text-sm text-zinc-900 whitespace-nowrap">{startIndex + index + 1}.</td>
                                                        <td className="px-4 py-3 text-sm text-zinc-900 whitespace-nowrap">{member.name}</td>
                                                        <td className="px-4 py-3 text-sm text-zinc-700 whitespace-nowrap">{member.email}</td>
                                                        <td className="px-4 py-3 text-sm text-zinc-700 whitespace-nowrap">{member.taskAssigned || 0}</td>
                                                        <td className="px-4 py-3 text-sm text-zinc-700 whitespace-nowrap">{member.taskCompleted || 0}</td>
                                                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                                                            <StatusBadge status={member.status} />
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="relative">
                                                                <button
                                                                    onClick={(e) => {
                                                                        handleRowActionClick(member.id || member._id, e);
                                                                    }}
                                                                    type="button"
                                                                    className="p-1 text-zinc-500 hover:text-zinc-700"
                                                                >
                                                                    <EllipsisVerticalIcon className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            <PaginationComponent />

                            {/* Add/Edit Member Modal */}
                              {isModalOpen && (
                                <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-40 transition-opacity duration-300 ease-in-out">
                                    <div className="bg-white rounded-2xl shadow-xl px-8 py-12 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                                        <div className="flex justify-between items-center mb-10">
                                            <h3 className="text-2xl font-semibold text-zinc-800">
                                                {isEditMode ? 'Edit Team Member' : 'Add Team Member'}
                                            </h3>
                                            <button onClick={closeModal} className="text-zinc-400 hover:text-zinc-600">
                                                <XMarkIcon className="h-6 w-6" />
                                            </button>
                                        </div>
                                        <form onSubmit={handleAddMemberSubmit}>
                                            <div className="mb-4">
                                                <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1">Name</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    value={newName}
                                                    onChange={(e) => setNewName(e.target.value)}
                                                    placeholder="Name"
                                                    className="w-full lg:p-4 p-2 border border-zinc-300 rounded-2xl focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">Email Address</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    value={newEmail}
                                                    onChange={(e) => setNewEmail(e.target.value)}
                                                    placeholder="Email address"
                                                    className="w-full lg:p-4 p-2 border border-zinc-300 rounded-2xl focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700"
                                                    required
                                                />
                                            </div>
                                            {/* <div className="mb-4">
                                                <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 mb-1">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    id="phone"
                                                    value={newPhone}
                                                    onChange={(e) => setNewPhone(e.target.value)}
                                                    placeholder="phone number"
                                                    className="w-full lg:p-4 p-2 border border-zinc-300 rounded-2xl focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="role" className="block text-sm font-medium text-zinc-700 mb-1">Role</label>
                                                <select
                                                    id="role"
                                                    value={newRole}
                                                    onChange={(e) => setNewRole(e.target.value)}
                                                    className="w-full lg:p-4 p-2 border border-zinc-300 rounded-2xl focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700"
                                                >
                                                    {ROLES.map(role => (
                                                        <option key={role} value={role}>{role}</option>
                                                    ))}
                                                </select>
                                            </div> */}
                                            
                                            {/* Submit button */}
                                            <div className="flex justify-end">
                                                <button
                                                    type="submit"
                                                    className="bg-green-700 hover:bg-green-600 text-white text-lg p-4 w-full rounded-lg shadow-md flex items-center justify-center transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <LoadingSpinnerIcon className="h-5 w-5 mr-2" />
                                                            {isEditMode ? 'Updating...' : 'Adding...'}
                                                        </>
                                                    ) : (
                                                        isEditMode ? 'Update Member' : 'Add Member'
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* activate/deactivate modal */}
                            {isModalOpen && currentMemberId && (() => {
                                // Determine if member is currently active or inactive
                                const currentMember = teamMembers.find(member => member.id === currentMemberId || member._id === currentMemberId);
                                const isActivating = currentMember?.status?.toLowerCase() === 'inactive' || currentMember?.status?.toLowerCase() === 'deactivated';
                                const actionText = isActivating ? 'activate' : 'deactivate';
                                const actionTextCap = isActivating ? 'Activate' : 'Deactivate';
                                
                                return (
                                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-40 transition-opacity duration-300 ease-in-out">
                                        <div className="bg-white rounded-2xl shadow-xl px-8 py-12 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                                            <div className="flex flex-col justify-center items-center gap-4">
                                                {/* icon */}
                                                <span className='mt-7'>
                                                    {isActivating ? (
                                                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M24 8C16.27 8 10 14.27 10 22C10 29.73 16.27 36 24 36C31.73 36 38 29.73 38 22C38 14.27 31.73 8 24 8Z" fill="#16a34a" />
                                                            <path d="M24 14V24M24 24L19 19M24 24L29 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    ) : (
                                                        <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.5 10.5H8.83333H35.5" stroke="#D70606" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M32.1673 10.5007V33.834C32.1673 34.718 31.8161 35.5659 31.191 36.191C30.5659 36.8161 29.718 37.1673 28.834 37.1673H12.1673C11.2833 37.1673 10.4354 36.8161 9.81029 36.191C9.18517 35.5659 8.83398 34.718 8.83398 33.834V10.5007M13.834 10.5007V7.16732C13.834 6.28326 14.1852 5.43542 14.8103 4.81029C15.4354 4.18517 16.2833 3.83398 17.1673 3.83398H23.834C24.718 3.83398 25.5659 4.18517 26.191 4.81029C26.8161 5.43542 27.1673 6.28326 27.1673 7.16732V10.5007" stroke="#D70606" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M17.166 18.834V28.834" stroke="#D70606" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M23.834 18.834V28.834" stroke="#D70606" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    )}
                                                </span>

                                                {/* title */}
                                                <h3 className={`text-2xl font-semibold ${isActivating ? 'text-green-700' : 'text-red-700'}`}>
                                                    {actionTextCap} User?
                                                </h3>

                                                {/* description */}
                                                {currentMember && (
                                                    <div className="mb-6">
                                                        <p className="text-zinc-700 text-lg">
                                                            Are you sure you want to {actionText}{' '}
                                                            <span className="font-semibold text-zinc-800">
                                                                {currentMember?.name}
                                                            </span>?
                                                        </p>
                                                        <p className="text-zinc-500 text-sm mt-2">
                                                            {isActivating 
                                                                ? 'This action will allow the user to access the system again.'
                                                                : 'This action will prevent the user from accessing the system.'
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                                <div className="flex justify-end gap-4 mt-2">
                                                    <button
                                                        onClick={closeModal}
                                                        className="px-6 py-3 text-zinc-600 hover:text-zinc-800 rounded-lg transition-colors duration-150"
                                                        disabled={isDeactivating}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleDeactivateMember}
                                                        className={`${isActivating ? 'bg-green-700 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white text-lg py-3 px-8 rounded-lg shadow-md flex items-center justify-center transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]`}
                                                        disabled={isDeactivating}
                                                    >
                                                        {isDeactivating ? (
                                                            <>
                                                                <LoadingSpinnerIcon className="h-5 w-5 mr-2" />
                                                                {isActivating ? 'Activating...' : 'Deactivating...'}
                                                            </>
                                                        ) : (
                                                            actionTextCap
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </main>
                </div>
            </div>
            <DropdownPortal />
        </div>
    );
};

export default TeamManagement;