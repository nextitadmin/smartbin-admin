import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import Sidebar from '../components/SuperAdmin/Sidebar';
import Topbar from '../components/SuperAdmin/Topbar';
import api from '../api/apiConfig';

import { PlusIcon, MagnifyingGlassIcon, XMarkIcon, EllipsisVerticalIcon, CheckCircleIconSolid, ExclamationTriangleIconSolid, LoadingSpinnerIcon, SortIcon } from '../components/icons';
import SkeletonLoader from '../components/SkeletonLoader';

// Main Component
const TeamsPage = () => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '', visible: false });
    const [searchTerm, setSearchTerm] = useState('');
    const [isExporting, setIsExporting] = useState(false);

    // Sorting state
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Modal form fields
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newRole, setNewRole] = useState('team_member');
    const [newStatus, setNewStatus] = useState('Active');

    // Edit modal fields
    const [editMemberId, setEditMemberId] = useState(null);
    const [isEditFetching, setIsEditFetching] = useState(false);
    const [isEditSaving, setIsEditSaving] = useState(false);
    const [isEditDirty, setIsEditDirty] = useState(false);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editRole, setEditRole] = useState('team_member');
    const [editStatus, setEditStatus] = useState('Active');
    const editFetchSeqRef = useRef(0);

    // Row action modal
    const [rowActionModal, setRowActionModal] = useState(false);
    const [currentMemberId, setCurrentMemberId] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: null, bottom: null, right: 0 });
    const modalRef = useRef();

    // Activate/Deactivate modals
    const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
    const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
    const [memberToModify, setMemberToModify] = useState(null);

    // Roles for dropdown (display names)
    const ROLE_OPTIONS = [
        { value: 'admin', label: 'Admin' },
        { value: 'team_member', label: 'Team Member' },
        { value: 'smartbin_partner', label: 'SmartBin Partner' },
        { value: 'psp_admin', label: 'PSP Admin' }
    ];

    // Delete confirmation modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState(null);

    // Fetch team members
    const fetchTeamMembers = async () => {
        try {
            const { data } = await api.get('/lawma/teams');
            if (data.success) {
                // Map the API response to match the expected structure
                const mappedTeamMembers = data.data.map(member => ({
                    // keep both for convenience since backend uses `_id`
                    id: member._id,
                    _id: member._id,
                    name: member.name,
                    email: member.email,
                    phone: member.phoneNumber,
                    role: member.role,
                    status: member.status.charAt(0).toUpperCase() + member.status.slice(1) // Capitalize status
                }));
                setTeamMembers(mappedTeamMembers);
            }
        } catch (error) {
            console.error('Error fetching team members:', error);
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

    // Handle delete click
    const handleDeleteClick = (member) => {
        setMemberToDelete(member);
        setIsDeleteModalOpen(true);
        setRowActionModal(false);
    };

    // Handle confirm delete
    const handleConfirmDelete = async () => {
        if (!memberToDelete) return;

        try {
            const response = await api.delete(`/lawma/teams/${memberToDelete.id}`);

            if (response.data.success) {
                setTeamMembers(prev => prev.filter(member => member.id !== memberToDelete.id));
                showNotification('Team member deleted successfully!', 'success');
            } else {
                showNotification('Failed to delete team member.', 'error');
            }
        } catch (error) {
            console.error('Error deleting team member:', error);
            showNotification('An error occurred while deleting the team member.', 'error');
        } finally {
            setIsDeleteModalOpen(false);
            setMemberToDelete(null);
        }
    };

    // Filtered and sorted members
    const filteredMembers = useMemo(() => {
        let filtered = teamMembers.filter(member =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.phone.includes(searchTerm)
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

                // Handle other string comparisons
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return filtered;
    }, [teamMembers, searchTerm, sortConfig]);

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

        setIsLoading(true);
        try {
            const { data } = await api.post('/lawma/teams', {
                name: newName,
                email: newEmail,
                phoneNumber: newPhone,
                role: newRole
            });

            console.log('Member added:', data);
            showNotification('Team member added successfully!', 'success');
            // Add to local list
            setTeamMembers(prev => [...prev, {
                id: Date.now(),
                name: newName,
                email: newEmail,
                phone: newPhone,
                role: newRole,
                status: newStatus // Note: API doesn't return status, so we use the default newStatus
            }]);
        } catch (error) {
            showNotification('An error occurred while adding the member.', `${error?.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
            setIsModalOpen(false);
            resetForm();
        }
    };

    const resetForm = () => {
        setNewName('');
        setNewEmail('');
        setNewPhone('');
        setNewRole('team_member');
        setNewStatus('Active');
    };

    const resetEditForm = () => {
        setEditMemberId(null);
        setEditName('');
        setEditEmail('');
        setEditPhone('');
        setEditRole('team_member');
        setEditStatus('Active');
        setIsEditDirty(false);
        setIsEditFetching(false);
        setIsEditSaving(false);
    };

    // Export data
    const handleExportData = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            showNotification('Data exported successfully!', 'success');
        }, 1500);
    };

    // Handle row action click
    const handleRowActionClick = (id, event) => {
        event.stopPropagation();
        if (rowActionModal && currentMemberId === id) {
            setRowActionModal(false);
            setCurrentMemberId(null);
            return;
        }

        const buttonRect = event.currentTarget.getBoundingClientRect();
        const spaceBelow = window.innerHeight - buttonRect.bottom;
        const openUpward = spaceBelow < 160 && buttonRect.top > spaceBelow;
        const rightPos = Math.max(12, window.innerWidth - buttonRect.right);

        if (openUpward) {
            setDropdownPosition({
                top: null,
                bottom: Math.max(12, window.innerHeight - buttonRect.top + 6),
                right: rightPos
            });
        } else {
            setDropdownPosition({
                top: Math.max(12, buttonRect.bottom + 6),
                bottom: null,
                right: rightPos
            });
        }

        setCurrentMemberId(id);
        setRowActionModal(true);
    };

    // Close row action modal when clicking outside or scrolling
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                rowActionModal &&
                modalRef.current &&
                !modalRef.current.contains(event.target) &&
                !event.target.closest('[data-action-trigger="true"]')
            ) {
                setRowActionModal(false);
                setCurrentMemberId(null);
            }
        }

        function handleScrollOrResize() {
            if (rowActionModal) {
                setRowActionModal(false);
                setCurrentMemberId(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScrollOrResize, true);
        window.addEventListener("resize", handleScrollOrResize);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScrollOrResize, true);
            window.removeEventListener("resize", handleScrollOrResize);
        };
    }, [rowActionModal]);

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        resetEditForm();
    };

    // Get member by ID
    const getMemberById = (id) => {
        // In our UI state we map backend `_id` to `id`
        return teamMembers.find(member => member.id === id || member._id === id);
    };

    const openEditModal = async (memberId) => {
        const seq = ++editFetchSeqRef.current;
        setRowActionModal(false);
        setEditMemberId(memberId);
        setIsEditModalOpen(true);
        setIsEditFetching(true);
        setIsEditDirty(false);

        // Prefill with existing row data immediately (for perceived speed)
        const local = getMemberById(memberId);
        if (local) {
            setEditName(local.name ?? '');
            setEditEmail(local.email ?? '');
            setEditPhone(local.phone ?? '');
            setEditRole(local.role ?? 'team_member');
            setEditStatus(local.status ?? 'Active');
        }

        try {
           
            const { data } = await api.get('/lawma/teams');
            const list = data?.data ?? [];
            const member = Array.isArray(list) ? list.find((m) => m?._id === memberId) : null;

            if (seq !== editFetchSeqRef.current) return; 

            // If the user already started typing, don't overwrite their changes with late network data.
            if (!isEditDirty && member) {
                setEditName(member?.name ?? local?.name ?? '');
                setEditEmail(member?.email ?? local?.email ?? '');
                setEditPhone(member?.phoneNumber ?? member?.phone ?? local?.phone ?? '');
                setEditRole(member?.role ?? local?.role ?? 'team_member');

                const statusRaw = member?.status ?? local?.status ?? 'active';
                const normalizedStatus =
                    String(statusRaw).toLowerCase() === 'inactive' ? 'Inactive' : 'Active';
                setEditStatus(normalizedStatus);
            }
        } catch (error) {
            console.error('Error fetching team member details:', error);
            const apiMessage = error?.response?.data?.message || error?.message;
            showNotification(apiMessage || 'Failed to load member details.', 'error');
        } finally {
            if (seq === editFetchSeqRef.current) setIsEditFetching(false);
        }
    };

    const handleEditMemberSubmit = async (e) => {
        e.preventDefault();
        if (!editMemberId) return;

        if (!editName || !editEmail || !editPhone) {
            showNotification('Please fill all required fields.', 'error');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(editEmail)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        if (!/^\d{11}$/.test(editPhone)) {
            showNotification('Phone number must be exactly 11 digits.', 'error');
            return;
        }

        setIsEditSaving(true);
        try {
            const updatePayload = {
                name: editName,
                email: editEmail,
                phoneNumber: editPhone,
                phone: editPhone,
                role: editRole,
                status: String(editStatus).toLowerCase() // "active" | "inactive"
            };

            await api.patch(`/lawma/teams/${editMemberId}`, updatePayload);

            showNotification('Team member updated successfully!', 'success');
            await fetchTeamMembers();
            closeEditModal();
        } catch (error) {
            console.error('Error updating team member:', error);
            const apiMessage = error?.response?.data?.message || error?.message;
            showNotification(apiMessage || 'Failed to update team member.', 'error');
        } finally {
            setIsEditSaving(false);
        }
    };

    // Handle activate action
    const handleActivateClick = (member) => {
        setMemberToModify(member);
        setIsActivateModalOpen(true);
        setRowActionModal(false);
    };

    // Handle deactivate action
    const handleDeactivateClick = (member) => {
        setMemberToModify(member);
        setIsDeactivateModalOpen(true);
        setRowActionModal(false);
    };

    // Handle confirm activate
    const handleConfirmActivate = async () => {
    if (!memberToModify) return;

    try {
        await api.patch(`/lawma/teams/${memberToModify.id}`, {
            status: "active"
        });

        setTeamMembers(prev =>
            prev.map(member =>
                member.id === memberToModify.id
                    ? { ...member, status: "Active" }
                    : member
            )
        );

        showNotification('Member activated successfully!', 'success');
    } catch (error) {
        console.error(error);
        const apiMessage = error?.response?.data?.message || error?.message;
        showNotification(apiMessage || 'Failed to activate member.', 'error');
    } finally {
        setIsActivateModalOpen(false);
        setMemberToModify(null);
    }
};


    // Handle confirm deactivate
    const handleConfirmDeactivate = async () => {
    if (!memberToModify) return;

    try {
        await api.patch(`/lawma/teams/${memberToModify.id}`, {
            status: "inactive"
        });

        setTeamMembers(prev =>
            prev.map(member =>
                member.id === memberToModify.id
                    ? { ...member, status: "Inactive" } // UI format
                    : member
            )
        );

        showNotification('Member deactivated successfully!', 'success');
    } catch (error) {
        console.error(error);
        const apiMessage = error?.response?.data?.message || error?.message;
        showNotification(apiMessage || 'Failed to deactivate member.', 'error');
    } finally {
        setIsDeactivateModalOpen(false);
        setMemberToModify(null);
    }
};


    // Status badge
    const StatusBadge = ({ status }) => {
        const color = status === 'Active' ? 'text-green-700' : 'text-red-600';
        return <span className={`font-medium ${color}`}>{status}</span>;
    };

    // Get role display name
    const getRoleDisplayName = (roleValue) => {
        const role = ROLE_OPTIONS.find(r => r.value === roleValue);
        return role ? role.label : roleValue;
    };

    return (
        <div>
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
                                        <p className="text-zinc-500 text-lg font-light">Invite and manage super admin team members here</p>
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="mt-4 sm:mt-0 bg-green-700 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center transition duration-150 ease-in-out"
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
                                            className="w-full p-3 pl-10 border border-zinc-300 bg-white rounded-xl focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
                                    </div>
                                    <button
                                        onClick={handleExportData}
                                        disabled={isExporting}
                                        className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-xl hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition"
                                    >
                                        {isExporting ? (
                                            <>
                                                <LoadingSpinnerIcon className="h-4 w-4 animate-spin" />
                                                Exporting...
                                            </>
                                        ) : (
                                            <>Export data</>
                                        )}
                                    </button>
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold text-zinc-700 p-4">All Team Members</h2>
                                    {isLoading ? (
                                        <SkeletonLoader />
                                    ) : filteredMembers.length === 0 ? (
                                        <div className="flex flex-col justify-center items-center mt-20">
                                            <h2 className="text-xl mb-1 sans">No team members found</h2>
                                            <p className="text-zinc-400 mt-2 font-light">There are no members matching your search.</p>
                                            <button
                                                onClick={() => setIsModalOpen(true)}
                                                className="mt-6 text-zinc-600 pointer lg:w-1/2 rounded-xl text-lg mb-6 flex flex-row items-center font-light justify-center p-3"
                                            >
                                                <PlusIcon className="mr-2 h-5 w-5" />
                                                Add New Member
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-x-auto">
                                            <table className="w-full min-w-[850px] bg-white">
                                                <thead className="border-b border-zinc-200 bg-zinc-50/50">
                                                    <tr>
                                                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider w-14 cursor-pointer" onClick={() => handleSort('id')}>
                                                            <div className="flex items-center">
                                                                S/N
                                                                <SortIcon direction={sortConfig.key === 'id' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                                                            <div className="flex items-center">
                                                                Name
                                                                <SortIcon direction={sortConfig.key === 'name' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('email')}>
                                                            <div className="flex items-center">
                                                                Email address
                                                                <SortIcon direction={sortConfig.key === 'email' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('phone')}>
                                                            <div className="flex items-center">
                                                                Phone number
                                                                <SortIcon direction={sortConfig.key === 'phone' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('role')}>
                                                            <div className="flex items-center">
                                                                Role
                                                                <SortIcon direction={sortConfig.key === 'role' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="px-4 py-3.5 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                                                            <div className="flex items-center">
                                                                Status
                                                                <SortIcon direction={sortConfig.key === 'status' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="px-4 py-3.5 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wider w-16">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-zinc-200">
                                                    {filteredMembers.map((member, index) => (
                                                        <tr key={member.id} className="hover:bg-zinc-50/80 transition-colors duration-150">
                                                            <td className="px-4 py-3.5 text-sm text-zinc-500">{index + 1}.</td>
                                                            <td className="px-4 py-3.5 text-sm font-medium text-zinc-900">{member.name}</td>
                                                            <td className="px-4 py-3.5 text-sm text-zinc-600">{member.email}</td>
                                                            <td className="px-4 py-3.5 text-sm text-zinc-600">{member.phone}</td>
                                                            <td className="px-4 py-3.5 text-sm text-zinc-600">{getRoleDisplayName(member.role)}</td>
                                                            <td className="px-4 py-3.5 text-sm">
                                                                <StatusBadge status={member.status} />
                                                            </td>
                                                            <td className="px-4 py-3.5 text-right">
                                                                <button
                                                                    data-action-trigger="true"
                                                                    onClick={(e) => handleRowActionClick(member.id, e)}
                                                                    type="button"
                                                                    className="p-1.5 text-zinc-500 hover:text-zinc-800 rounded-lg hover:bg-zinc-100 transition duration-150"
                                                                    title="Actions"
                                                                >
                                                                    <EllipsisVerticalIcon className="w-5 h-5" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                {/* Portal dropdown for row actions */}
                                {rowActionModal && currentMemberId !== null && (() => {
                                    const member = teamMembers.find(m => m.id === currentMemberId || m._id === currentMemberId);
                                    if (!member) return null;

                                    return createPortal(
                                        <div
                                            ref={modalRef}
                                            className="fixed z-[9999] bg-white rounded-xl shadow-xl py-1.5 px-1 border border-zinc-200 min-w-[150px] text-sm animate-in fade-in duration-150"
                                            style={{
                                                position: 'fixed',
                                                zIndex: 9999,
                                                right: dropdownPosition.right,
                                                ...(dropdownPosition.top !== null ? { top: dropdownPosition.top } : {}),
                                                ...(dropdownPosition.bottom !== null ? { bottom: dropdownPosition.bottom } : {})
                                            }}
                                        >
                                            <button
                                                type="button"
                                                className="w-full text-left px-3 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 rounded-lg transition-colors duration-150"
                                                onClick={() => openEditModal(member._id ?? member.id)}
                                            >
                                                Edit
                                            </button>
                                            {member.status === 'Active' ? (
                                                <button
                                                    type="button"
                                                    className="w-full text-left px-3 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 rounded-lg transition-colors duration-150"
                                                    onClick={() => handleDeactivateClick(member)}
                                                >
                                                    Deactivate
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="w-full text-left px-3 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 rounded-lg transition-colors duration-150"
                                                    onClick={() => handleActivateClick(member)}
                                                >
                                                    Activate
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                                                onClick={() => handleDeleteClick(member)}
                                            >
                                                Delete
                                            </button>
                                        </div>,
                                        document.body
                                    );
                                })()}

                                {/* Add Member Modal */}
                                {isModalOpen && (
                                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-40 transition-opacity duration-300 ease-in-out">
                                        <div className="bg-white rounded-2xl shadow-xl px-8 py-12 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                                            <div className="flex justify-between items-center mb-10">
                                                <h3 className="text-2xl font-semibold text-zinc-800">Add New Team Member</h3>
                                                <button onClick={closeModal} className="text-zinc-400 hover:text-zinc-600">
                                                    <XMarkIcon className="h-6 w-6" />
                                                </button>
                                            </div>
                                            <form onSubmit={handleAddMemberSubmit}>
                                                <div className="mb-4">
                                                    <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
                                                    <input
                                                        type="text"
                                                        id="name"
                                                        value={newName}
                                                        onChange={(e) => setNewName(e.target.value)}
                                                        placeholder="Enter full name"
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
                                                        placeholder="example@domain.com"
                                                        className="w-full lg:p-4 p-2 border border-zinc-300 rounded-2xl focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700"
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 mb-1">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        id="phone"
                                                        value={newPhone}
                                                        onChange={(e) => setNewPhone(e.target.value)}
                                                        placeholder="08012345678"
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
                                                        {ROLE_OPTIONS.map(role => (
                                                            <option key={role.value} value={role.value}>{role.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="flex justify-end">
                                                    <button
                                                        type="submit"
                                                        className="bg-green-700 hover:bg-green-600 text-white text-lg p-4 w-full rounded-lg shadow-md flex items-center justify-center transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]"
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading ? (
                                                            <>
                                                                <LoadingSpinnerIcon className="h-5 w-5 mr-2" />
                                                                Adding...
                                                            </>
                                                        ) : (
                                                            'Add Member'
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}

                                {/* Edit Member Modal */}
                                {isEditModalOpen && (
                                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
                                        <div className="bg-white rounded-2xl shadow-xl px-8 py-12 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                                            <div className="flex justify-between items-center mb-10">
                                                <h3 className="text-2xl font-semibold text-zinc-800">Edit Team Member</h3>
                                                <button onClick={closeEditModal} className="text-zinc-400 hover:text-zinc-600">
                                                    <XMarkIcon className="h-6 w-6" />
                                                </button>
                                            </div>

                                            <form onSubmit={handleEditMemberSubmit}>
                                                    <div className="mb-4">
                                                        <label htmlFor="edit-name" className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
                                                        <input
                                                            type="text"
                                                            id="edit-name"
                                                            value={editName}
                                                            onChange={(e) => { setIsEditDirty(true); setEditName(e.target.value); }}
                                                            placeholder="Enter full name"
                                                            className="w-full lg:p-4 p-2 border border-zinc-300 rounded-2xl focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-4">
                                                        <label htmlFor="edit-email" className="block text-sm font-medium text-zinc-700 mb-1">Email Address</label>
                                                        <input
                                                            type="email"
                                                            id="edit-email"
                                                            value={editEmail}
                                                            onChange={(e) => { setIsEditDirty(true); setEditEmail(e.target.value); }}
                                                            placeholder="example@domain.com"
                                                            className="w-full lg:p-4 p-2 border border-zinc-300 rounded-2xl focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-4">
                                                        <label htmlFor="edit-phone" className="block text-sm font-medium text-zinc-700 mb-1">Phone Number</label>
                                                        <input
                                                            type="tel"
                                                            id="edit-phone"
                                                            value={editPhone}
                                                            onChange={(e) => { setIsEditDirty(true); setEditPhone(e.target.value); }}
                                                            placeholder="08012345678"
                                                            className="w-full lg:p-4 p-2 border border-zinc-300 rounded-2xl focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mb-4">
                                                        <label htmlFor="edit-role" className="block text-sm font-medium text-zinc-700 mb-1">Role</label>
                                                        <select
                                                            id="edit-role"
                                                            value={editRole}
                                                            onChange={(e) => { setIsEditDirty(true); setEditRole(e.target.value); }}
                                                            className="w-full lg:p-4 p-2 border border-zinc-300 rounded-2xl focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700"
                                                        >
                                                            {ROLE_OPTIONS.map(role => (
                                                                <option key={role.value} value={role.value}>{role.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    {/* <div className="mb-8">
                                                        <label htmlFor="edit-status" className="block text-sm font-medium text-zinc-700 mb-1">Status</label>
                                                        <select
                                                            id="edit-status"
                                                            value={editStatus}
                                                            onChange={(e) => { setIsEditDirty(true); setEditStatus(e.target.value); }}
                                                            className="w-full lg:p-4 p-2 border border-zinc-300 rounded-2xl focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700"
                                                        >
                                                            <option value="Active">Active</option>
                                                            <option value="Inactive">Inactive</option>
                                                        </select>
                                                    </div> */}
                                                    <div className="flex justify-end">
                                                        <button
                                                            type="submit"
                                                            className="bg-green-700 hover:bg-green-600 text-white text-lg p-4 w-full rounded-lg shadow-md flex items-center justify-center transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]"
                                                            disabled={isEditSaving || isEditFetching}
                                                        >
                                                            {isEditSaving ? (
                                                                <>
                                                                    <LoadingSpinnerIcon className="h-5 w-5 mr-2 animate-spin" />
                                                                    Saving...
                                                                </>
                                                            ) : (
                                                                'Save changes'
                                                            )}
                                                        </button>
                                                    </div>
                                            </form>
                                        </div>
                                    </div>
                                )}

                                {/* Activate Confirmation Modal */}
                                {isActivateModalOpen && (
                                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
                                        <div className="bg-white rounded-2xl shadow-xl px-8 py-12 w-full max-w-md">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-2xl font-semibold text-zinc-800">Activate Member</h3>
                                                <button 
                                                    onClick={() => setIsActivateModalOpen(false)} 
                                                    className="text-zinc-400 hover:text-zinc-600"
                                                >
                                                    <XMarkIcon className="h-6 w-6" />
                                                </button>
                                            </div>
                                            <p className="text-zinc-600 mb-8">
                                                Are you sure you want to activate <span className="font-semibold">{memberToModify?.name}</span>?
                                            </p>
                                            <div className="flex justify-end space-x-4">
                                                <button
                                                    onClick={() => setIsActivateModalOpen(false)}
                                                    className="px-6 py-3 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleConfirmActivate}
                                                    className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-600 transition"
                                                >
                                                    Activate
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Deactivate Confirmation Modal */}
                                {isDeactivateModalOpen && (
                                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
                                        <div className="bg-white rounded-2xl shadow-xl px-8 py-12 w-full max-w-md">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-2xl font-semibold text-zinc-800">Deactivate Member</h3>
                                                <button 
                                                    onClick={() => setIsDeactivateModalOpen(false)} 
                                                    className="text-zinc-400 hover:text-zinc-600"
                                                >
                                                    <XMarkIcon className="h-6 w-6" />
                                                </button>
                                            </div>
                                            <p className="text-zinc-600 mb-8">
                                                Are you sure you want to deactivate <span className="font-semibold">{memberToModify?.name}</span>?
                                            </p>
                                            <div className="flex justify-end space-x-4">
                                                <button
                                                    onClick={() => setIsDeactivateModalOpen(false)}
                                                    className="px-6 py-3 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleConfirmDeactivate}
                                                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                                >
                                                    Deactivate
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Delete Confirmation Modal */}
                                {isDeleteModalOpen && (
                                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
                                        <div className="bg-white rounded-2xl shadow-xl px-8 py-12 w-full max-w-md">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-2xl font-semibold text-zinc-800">Delete Member</h3>
                                                <button 
                                                    onClick={() => setIsDeleteModalOpen(false)} 
                                                    className="text-zinc-400 hover:text-zinc-600"
                                                >
                                                    <XMarkIcon className="h-6 w-6" />
                                                </button>
                                            </div>
                                            <p className="text-zinc-600 mb-8">
                                                Are you sure you want to delete <span className="font-semibold">{memberToDelete?.name}</span>? This action cannot be undone.
                                            </p>
                                            <div className="flex justify-end space-x-4">
                                                <button
                                                    onClick={() => setIsDeleteModalOpen(false)}
                                                    className="px-6 py-3 border border-zinc-300 text-zinc-700 rounded-lg hover:bg-zinc-50 transition"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleConfirmDelete}
                                                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
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

export default TeamsPage;