import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import Sidebar from '../components/PSPs/Sidebar';
import Topbar from '../components/PSPs/Topbar';
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

// Demo Data for Roles and Privileges
const demoRoles = [
    {
        id: 1,
        role: 'Super Admin',
        permission: 'Full System Access',
        members: 2,
        dateCreated: '2024-01-10'
    },
    {
        id: 2,
        role: 'Admin',
        permission: 'User Management & Reports',
        members: 3,
        dateCreated: '2024-01-15'
    },
    {
        id: 3,
        role: 'Manager',
        permission: 'Team Management & Analytics',
        members: 4,
        dateCreated: '2024-01-20'
    },
    {
        id: 4,
        role: 'Supervisor',
        permission: 'Field Operations & Monitoring',
        members: 6,
        dateCreated: '2024-02-01'
    },
    {
        id: 5,
        role: 'Analyst',
        permission: 'Data Analysis & Reporting',
        members: 3,
        dateCreated: '2024-02-05'
    },
    {
        id: 6,
        role: 'Coordinator',
        permission: 'Project Coordination',
        members: 4,
        dateCreated: '2024-02-10'
    },
    {
        id: 7,
        role: 'Field Agent',
        permission: 'Data Collection & Updates',
        members: 8,
        dateCreated: '2024-02-15'
    },
    {
        id: 8,
        role: 'Viewer',
        permission: 'Read-Only Access',
        members: 5,
        dateCreated: '2024-02-20'
    },
    {
        id: 9,
        role: 'Auditor',
        permission: 'System Audit & Compliance',
        members: 2,
        dateCreated: '2024-02-25'
    },
    {
        id: 10,
        role: 'Support',
        permission: 'User Support & Maintenance',
        members: 3,
        dateCreated: '2024-03-01'
    }
];

// Main Component
const AdminAccess = () => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '', visible: false });
    const [searchTerm, setSearchTerm] = useState('');
    const [isExporting, setIsExporting] = useState(false);
    const [activeTab, setActiveTab] = useState('members');

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
    const [newRoleName, setNewRoleName] = useState('');

    // Row action modal
    const [rowActionModal, setRowActionModal] = useState(false);
    const [currentMemberId, setCurrentMemberId] = useState(null);
    const [currentRoleId, setCurrentRoleId] = useState(null);
    const [actionType, setActionType] = useState('member'); // 'member' or 'role'
    const [originalTab, setOriginalTab] = useState('members'); // Store original tab before opening modal
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const modalRef = useRef();
    const buttonRef = useRef();

    // Edit member state
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingMember, setEditingMember] = useState(null);

    // Edit role state
    const [isEditRoleMode, setIsEditRoleMode] = useState(false);
    const [editingRole, setEditingRole] = useState(null);

    // Roles for dropdown
    const ROLES = ['super admin', 'admin', 'manager', 'supervisor', 'analyst', 'coordinator', 'field agent', 'viewer', 'auditor', 'support'];

    // Modules for dropdown
    const [modules, setModules] = useState([{ name: "", privileges: [] }]);

    // Role creation loading state
    const [isRoleLoading, setIsRoleLoading] = useState(false);

    // Deactivation loading state
    const [isDeactivating, setIsDeactivating] = useState(false);

    // Role removal loading state
    const [isRemovingRole, setIsRemovingRole] = useState(false);

    // Available modules for the select dropdown
    const availableModules = [
        { id: 1, name: 'PSPs', value: 'psps' },
        { id: 2, name: 'Revenue', value: 'revenue' },
        { id: 3, name: 'Waste Management', value: 'waste-management' },
        { id: 4, name: 'User Management', value: 'user-management' },
        { id: 5, name: 'Reports', value: 'reports' },
        { id: 6, name: 'Analytics', value: 'analytics' },
        { id: 7, name: 'Settings', value: 'settings' }
    ];

    // Add module
    const addModule = () => {
        setModules([...modules, { name: "", privileges: [] }]);
    };

    // Remove module
    const removeModule = (index) => {
        if (modules.length > 1) {
            setModules(modules.filter((_, i) => i !== index));
        }
    };

    // Reset role form
    const resetRoleForm = () => {
        setNewRoleName('');
        setModules([{ name: "", privileges: [] }]);
    };

    // Handle role form submission
    const handleAddRoleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!newRoleName.trim()) {
            showNotification('Please enter a role name.', 'error');
            return;
        }

        // Validate modules
        const validModules = modules.filter(module => module.name && module.privileges.length > 0);
        if (validModules.length === 0) {
            showNotification('Please select at least one module with privileges.', 'error');
            return;
        }

        setIsRoleLoading(true);

        try {
            // Prepare role data
            const roleData = {
                name: newRoleName.trim(),
                modules: validModules.map(module => ({
                    name: module.name,
                    privileges: module.privileges
                }))
            };

            if (import.meta.env.DEV) {
                // Simulate API call in development
                await new Promise(resolve => setTimeout(resolve, 2000));

                if (isEditRoleMode) {
                    // Update existing role
                    const updatedRole = {
                        ...editingRole,
                        role: newRoleName.trim(),
                        permission: validModules.map(m => m.name).join(', ')
                    };
                    setRoles(prevRoles => prevRoles.map(role =>
                        role.id === editingRole.id ? updatedRole : role
                    ));
                    showNotification('Role updated successfully!', 'success');
                } else {
                    // Add new role
                    const newRole = {
                        id: roles.length + 1,
                        role: newRoleName.trim(),
                        permission: validModules.map(m => m.name).join(', '),
                        members: 0,
                        dateCreated: new Date().toISOString().split('T')[0]
                    };
                    setRoles([...roles, newRole]);
                    showNotification('Role created successfully!', 'success');
                }
            } else {
                if (isEditRoleMode) {
                    // Update existing role
                    const { data } = await api.put(`/corporate/roles/${editingRole.id}`, roleData);
                    if (data.success) {
                        // Refresh roles list
                        const rolesData = await api.get('/corporate/roles');
                        if (rolesData.data.success) {
                            setRoles(rolesData.data.data);
                        }
                        showNotification('Role updated successfully!', 'success');
                    } else {
                        showNotification(data.message || 'Failed to update role.', 'error');
                    }
                } else {
                    // Create new role
                    const { data } = await api.post('/corporate/roles', roleData);
                    if (data.success) {
                        // Refresh roles list
                        const rolesData = await api.get('/corporate/roles');
                        if (rolesData.data.success) {
                            setRoles(rolesData.data.data);
                        }
                        showNotification('Role created successfully!', 'success');
                    } else {
                        showNotification(data.message || 'Failed to create role.', 'error');
                    }
                }
            }
        } catch (error) {
            console.error(`Error ${isEditRoleMode ? 'updating' : 'creating'} role:`, error);
            showNotification(`An error occurred while ${isEditRoleMode ? 'updating' : 'creating'} the role.`, 'error');
        } finally {
            setIsRoleLoading(false);
            setIsModalOpen(false);
            setIsEditRoleMode(false);
            setEditingRole(null);
            resetRoleForm();
        }
    };

    // Handle deactivate member
    const handleDeactivateMember = async () => {
        if (!currentMemberId) return;

        setIsDeactivating(true);

        try {
            const memberId = currentMemberId;

            // Make API call to deactivate member
            const { data } = await api.put(`/lawma/teams/${memberId}/status`, {
                status: 'deactivated'
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
                    console.error('Error refreshing team members after deactivation:', refreshError);
                    // Even if refresh fails, the deactivation was successful
                }

                showNotification('Member deactivated successfully!', 'success');
            } else {
                throw new Error(data.message || 'Failed to deactivate member');
            }
        } catch (error) {
            console.error('Error deactivating member:', error);

            // Check if it's a network error or server error
            if (error.response) {
                // Server responded with error status
                const status = error.response.status;
                const errorMessage = error.response.data?.message || error.response.data?.error || 'Server error occurred';

                if (status === 404) {
                    showNotification('Member not found. It may have already been deactivated.', 'error');
                } else if (status === 403) {
                    showNotification('You do not have permission to deactivate this member.', 'error');
                } else if (status === 409) {
                    showNotification('Cannot deactivate member. Please check for dependencies.', 'error');
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
                showNotification('An unexpected error occurred while deactivating the member.', 'error');
            }
        } finally {
            setIsDeactivating(false);
            setIsModalOpen(false);
            setRowActionModal(false);
            setCurrentMemberId(null);
            setActiveTab(originalTab); // Return to original tab
        }
    };

    // Handle deactivate button click
    const handleDeactivateClick = () => {
        setRowActionModal(false);
        setOriginalTab(activeTab); // Store current tab before switching
        setActiveTab('deactivate');
        setActionType('member');
        setIsModalOpen(true);
    };

    // Handle edit role button click
    const handleEditRoleClick = () => {
        const roleToEdit = roles.find(role => role.id === currentRoleId);
        if (roleToEdit) {
            setEditingRole(roleToEdit);
            setNewRoleName(roleToEdit.role);
            // For demo purposes, we'll create a default module structure
            // In a real app, you'd fetch the role's modules from the API
            setModules([{ name: roleToEdit.permission, privileges: ["View", "Edit"] }]);
            setIsEditRoleMode(true);
            setRowActionModal(false);
            setActiveTab('roles-and-privileges');
            setIsModalOpen(true);
        }
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
            setActiveTab('members');
            setIsModalOpen(true);
        }
    };

    // Handle remove role button click
    const handleRemoveRoleClick = () => {
        setRowActionModal(false);
        setOriginalTab(activeTab); // Store current tab before switching
        setActiveTab('deactivate');
        setActionType('role');
        setIsModalOpen(true);
    };

    // Handle role removal
    const handleRemoveRole = async () => {
        if (!currentRoleId) return;

        setIsRemovingRole(true);

        try {
            if (import.meta.env.DEV) {
                // Simulate API call in development
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Remove role from local state
                setRoles(prevRoles => prevRoles.filter(role => role.id !== currentRoleId));

                showNotification('Role removed successfully!', 'success');
            } else {
                // Make actual API call
                const { data } = await api.delete(`/corporate/roles/${currentRoleId}`);

                if (data.success) {
                    // Refresh roles list
                    const rolesData = await api.get('/corporate/roles');
                    if (rolesData.data.success) {
                        setRoles(rolesData.data.data);
                    }
                    showNotification('Role removed successfully!', 'success');
                } else {
                    showNotification(data.message || 'Failed to remove role.', 'error');
                }
            }
        } catch (error) {
            console.error('Error removing role:', error);
            showNotification('An error occurred while removing the role.', 'error');
        } finally {
            setIsRemovingRole(false);
            setIsModalOpen(false);
            setRowActionModal(false);
            setCurrentRoleId(null);
            setActiveTab(originalTab); // Return to original tab
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
                phone: member.phoneNumber,
                role: member.role,
                status: member.status ? member.status.charAt(0).toUpperCase() + member.status.slice(1) : 'Active'
            }));
            setTeamMembers(members);

            // Fetch roles (separate try-catch to not affect team members)
            try {
                const { data: rolesData } = await api.get('/corporate/roles');
                const roles = Array.isArray(rolesData) ? rolesData : rolesData?.data || [];
                setRoles(roles);
            } catch (rolesError) {
                console.error('Error fetching roles:', rolesError);
                setRoles(demoRoles);
            }

        } catch (error) {
            console.error('Error fetching team members:', error);
            // Fallback to demo data
            if (import.meta.env.DEV) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            setTeamMembers(demoTeamMembers);
            setRoles(demoRoles);
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
            (member.phone || '').includes(search)
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

    // Filtered and sorted roles
    const filteredRoles = useMemo(() => {
        const search = searchTerm || '';
        let filtered = roles.filter(role =>
            (role.role || '').toLowerCase().includes(search.toLowerCase()) ||
            (role.permission || '').toLowerCase().includes(search.toLowerCase()) ||
            (role.members || 0).toString().includes(search)
        );

        // Apply sorting
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                // Handle numeric comparisons for members count
                if (sortConfig.key === 'members') {
                    const aVal = a.members;
                    const bVal = b.members;
                    if (aVal === bVal) return 0;
                    return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
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
        } else {
            // Default sorting: show newest data at the top (by ID descending)
            filtered.sort((a, b) => {
                const aId = a.id || a._id || 0;
                const bId = b.id || b._id || 0;
                return bId - aId; // Descending order (newest first)
            });
        }

        return filtered;
    }, [roles, searchTerm, sortConfig]);

    // Pagination calculations
    const totalPages = Math.ceil((activeTab === 'members' ? filteredMembers.length : filteredRoles.length) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageItems = activeTab === 'members'
        ? filteredMembers.slice(startIndex, endIndex)
        : filteredRoles.slice(startIndex, endIndex);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, activeTab]);

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
                const { data } = await api.put(`/lawma/teams/${memberId}/status`, {
                    name: newName,
                    email: newEmail,
                    phoneNumber: newPhone,
                    role: newRole,
                    // status: newStatus
                });
                showNotification('Team member updated successfully!', 'success');

                if (mockSuccess) {
                    // Update local list
                    setTeamMembers(prev => prev.map(member =>
                        member.id === editingMember.id
                            ? { ...member, name: newName, email: newEmail, phone: newPhone, role: newRole, status: newStatus }
                            : member
                    ));
                } else {
                    showNotification('Failed to update team member. Please try again.', 'error');
                }
            } else {
                // Add new member
                const { data } = await api.post('/lawma/teams', {
                    name: newName,
                    email: newEmail,
                    phoneNumber: newPhone,
                    role: newRole,
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
            let csvContent = '';
            let filename = '';

            if (activeTab === 'members') {
                // Export members data
                const headers = ['S/N', 'Name', 'Email Address', 'Phone Number', 'Role', 'Status'];
                const rows = filteredMembers.map((member, index) => [
                    index + 1,
                    `"${member.name}"`,
                    `"${member.email}"`,
                    `"${member.phone}"`,
                    `"${member.role}"`,
                    `"${member.status}"`
                ]);

                csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
                filename = `team-members-${new Date().toISOString().split('T')[0]}.csv`;
            } else {
                // Export roles data
                const headers = ['S/N', 'Role', 'Permission', 'Members', 'Date Created'];
                const rows = filteredRoles.map((role, index) => [
                    index + 1,
                    `"${role.role}"`,
                    `"${role.permission}"`,
                    role.members,
                    `"${role.dateCreated}"`
                ]);

                csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
                filename = `roles-and-privileges-${new Date().toISOString().split('T')[0]}.csv`;
            }

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

            showNotification(`${activeTab === 'members' ? 'Members' : 'Roles'} data exported successfully!`, 'success');
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

        if (activeTab === 'members') {
            setCurrentMemberId(id);
            setCurrentRoleId(null);
            setActionType('member');
        } else {
            setCurrentRoleId(id);
            setCurrentMemberId(null);
            setActionType('role');
        }

        setRowActionModal(true);
    };

    // Close row action modal when clicking outside
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

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
        resetRoleForm();
        setCurrentMemberId(null);
        setCurrentRoleId(null);
        setIsEditMode(false);
        setEditingMember(null);
        setIsEditRoleMode(false);
        setEditingRole(null);
        // Return to original tab when closing deactivate modal
        if (activeTab === 'deactivate') {
            setActiveTab(originalTab);
        }
        // Don't reset actionType here - let it be preserved for the next modal
    };

    // Status badge
    const StatusBadge = ({ status }) => {
        const color = status === 'Active' || status === 'active' ? 'text-green-700' : status === 'Deactivated' || status === 'deactivated' ? 'text-red-600' : 'text-zinc-500';
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
                {actionType === 'member' ? (
                    <>
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
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-zinc-50 transition-colors duration-150"
                        >
                            Deactivate
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={handleEditRoleClick}
                            className="w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors duration-150"
                        >
                            Edit role
                        </button>
                        <button
                            onClick={handleRemoveRoleClick}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-zinc-50 transition-colors duration-150"
                        >
                            Remove
                        </button>
                    </>
                )}
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
                                    <h1 className="text-2xl md:text-3xl font-semibold text-zinc-800">Admin access</h1>
                                    <p className="text-zinc-500 text-lg font-light">Invite and manage admin team members here</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="mt-4 sm:mt-0 bg-green-700 hover:bg-green-600 sm:text-xs text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center transition duration-150 ease-in-out"
                                >
                                    <PlusIcon className="mr-2 h-5 w-5" />
                                    {activeTab === 'members' ? 'Add new member' : 'Add new'}
                                </button>
                            </header>

                            {/* Active selection */}
                            <div className='inline-flex gap-7 text-lg mb-7 border-b border-zinc-200'>
                                <button
                                    type="button"
                                    className={`relative pb-2 -mb-[2px] transition-colors duration-300 ease-out
                        after:content-["\""] after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-full after:bg-green-700
                        after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out
                        ${activeTab === 'members'
                                            ? 'text-green-700 after:scale-x-100'
                                            : 'text-zinc-500 hover:text-zinc-700 after:scale-x-0'
                                        }`}
                                    onClick={() => setActiveTab('members')}
                                >
                                    Members
                                </button>
                                <button
                                    type="button"
                                    className={`relative pb-2 -mb-[2px] transition-colors duration-300 ease-out
                        after:content-["\""] after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-full after:bg-green-700
                        after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out
                        ${activeTab === 'roles-and-privileges'
                                            ? 'text-green-700 after:scale-x-100'
                                            : 'text-zinc-500 hover:text-zinc-700 after:scale-x-0'
                                        }`}
                                    onClick={() => setActiveTab('roles-and-privileges')}
                                >
                                    Roles and Privileges
                                </button>
                            </div>

                            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="relative flex-grow max-w-lg">
                                    <input
                                        type="text"
                                        placeholder={activeTab === 'members' ? 'Search members' : 'Search roles'}
                                        className="w-full p-2 pl-10 border border-zinc-300 bg-white rounded-xl focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-600" />
                                </div>
                                <button
                                    onClick={handleExportData}
                                    disabled={isExporting}
                                    className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-xl hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition"
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
                                ) : (activeTab === 'members' ? filteredMembers.length === 0 : filteredRoles.length === 0) ? (
                                    <div className="flex flex-col justify-center items-center mt-20">
                                        <h2 className="text-xl mb-1 sans">
                                            {activeTab === 'members' ? 'No team members found' : 'No roles found'}
                                        </h2>
                                        <p className="text-zinc-400 mt-2 font-light">
                                            {activeTab === 'members'
                                                ? 'There are no members matching your search.'
                                                : 'There are no roles matching your search.'
                                            }
                                        </p>
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="mt-6 text-zinc-600 pointer lg:w-1/2 rounded-xl text-lg mb-6 flex flex-row items-center font-light justify-center p-3"
                                        >
                                            <PlusIcon className="mr-2 h-5 w-5" />
                                            {activeTab === 'members' ? 'Add New Member' : 'Add New Role'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
                                        <table className="w-full min-w-[900px] m-4 table-auto border-collapse">
                                            <thead className="border-b border-zinc-200">
                                                {activeTab === 'members' ? (
                                                    <tr>
                                                        <th className="lg:p-6 p-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider w-12 cursor-pointer" onClick={() => handleSort('id')}>
                                                            <div className="flex items-center">
                                                                S/N
                                                                <SortIcon direction={sortConfig.key === 'id' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                                                            <div className="flex items-center">
                                                                Name
                                                                <SortIcon direction={sortConfig.key === 'name' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('email')}>
                                                            <div className="flex items-center">
                                                                Email address
                                                                <SortIcon direction={sortConfig.key === 'email' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('phone')}>
                                                            <div className="flex items-center">
                                                                Phone number
                                                                <SortIcon direction={sortConfig.key === 'phone' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('role')}>
                                                            <div className="flex items-center">
                                                                Role
                                                                <SortIcon direction={sortConfig.key === 'role' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                                                            <div className="flex items-center">
                                                                Status
                                                                <SortIcon direction={sortConfig.key === 'status' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider">Action</th>
                                                    </tr>
                                                ) : (
                                                    <tr>
                                                        <th className="lg:p-6 p-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider w-12 cursor-pointer" onClick={() => handleSort('id')}>
                                                            <div className="flex items-center">
                                                                S/N
                                                                <SortIcon direction={sortConfig.key === 'id' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('role')}>
                                                            <div className="flex items-center">
                                                                Role
                                                                <SortIcon direction={sortConfig.key === 'role' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('permission')}>
                                                            <div className="flex items-center">
                                                                Permission
                                                                <SortIcon direction={sortConfig.key === 'permission' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('members')}>
                                                            <div className="flex items-center">
                                                                Members
                                                                <SortIcon direction={sortConfig.key === 'members' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('dateCreated')}>
                                                            <div className="flex items-center">
                                                                Date created
                                                                <SortIcon direction={sortConfig.key === 'dateCreated' ? sortConfig.direction : null} />
                                                            </div>
                                                        </th>
                                                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider">Action</th>
                                                    </tr>
                                                )}
                                            </thead>
                                            <tbody className="divide-y divide-zinc-200">
                                                {activeTab === 'members' ? (
                                                    currentPageItems.map((member, index) => (
                                                        <tr key={member.id} className="hover:bg-zinc-50 transition-colors duration-150">
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-500">{startIndex + index + 1}.</td>
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-900">{member.name}</td>
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{member.email}</td>
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{member.phone || member.phoneNumber}</td>
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{member.role}</td>
                                                            <td className="lg:p-6 p-3 text-sm">
                                                                <StatusBadge status={member.status} />
                                                            </td>
                                                            <td className="lg:p-6 p-3">
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
                                                    ))
                                                ) : (
                                                    currentPageItems.map((role, index) => (
                                                        <tr key={role.id} className="hover:bg-zinc-50 transition-colors duration-150">
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-500">{startIndex + index + 1}.</td>
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-900">{role.role}</td>
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{role.permission}</td>
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{role.members}</td>
                                                            <td className="lg:p-6 p-3 text-sm text-zinc-700">{role.dateCreated}</td>
                                                            <td className="lg:p-6 p-3">
                                                                <div className="relative">
                                                                    <button
                                                                        onClick={(e) => handleRowActionClick(role.id, e)}
                                                                        type="button"
                                                                        className="p-1 text-zinc-500 hover:text-zinc-700"
                                                                    >
                                                                        <EllipsisVerticalIcon className="w-5 h-5" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            <PaginationComponent />

                            {/* Add/Edit Member Modal */}
                            {isModalOpen && activeTab === 'members' && (
                                <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-40 transition-opacity duration-300 ease-in-out">
                                    <div className="bg-white rounded-2xl shadow-xl px-8 py-12 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                                        <div className="flex justify-between items-center mb-10">
                                            <h3 className="text-2xl font-semibold text-zinc-800">
                                                {isEditMode ? 'Edit Team Member' : 'Add New Team Member'}
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
                                                    placeholder="name"
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
                                            </div>

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

                            {/* Add Role Modal */}
                            {isModalOpen && activeTab === 'roles-and-privileges' && (
                                <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-40 transition-opacity duration-300 ease-in-out">
                                    <div className="bg-white rounded-2xl shadow-xl px-8 py-12 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                                        <div className="flex justify-between items-center mb-10">
                                            <h3 className="text-2xl font-semibold text-zinc-800">
                                                {isEditRoleMode ? 'Edit Role' : 'Add New Role'}
                                            </h3>
                                            <button onClick={closeModal} className="text-zinc-400 hover:text-zinc-600">
                                                <XMarkIcon className="h-6 w-6" />
                                            </button>
                                        </div>
                                        <form onSubmit={handleAddRoleSubmit} className="">
                                            <div className="mb-7">
                                                <label htmlFor="roleName" className="block text-sm font-medium text-zinc-700 mb-1">Name</label>
                                                <input
                                                    type="text"
                                                    id="roleName"
                                                    value={newRoleName}
                                                    onChange={(e) => setNewRoleName(e.target.value)}
                                                    placeholder="Role name"
                                                    className="w-full lg:p-4 p-2 border border-zinc-300 rounded-2xl focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700"
                                                    required
                                                />
                                            </div>

                                            {/* Modules */}
                                            <div className="space-y-4">
                                                <div className="flex space-x-3">
                                                    <div className="w-1/2">
                                                        <p className="text-lg font-medium text-zinc-700">Module</p>
                                                    </div>
                                                    <div className="w-1/2">
                                                        <p className="text-lg font-medium text-zinc-700">Privileges</p>
                                                    </div>
                                                </div>
                                                {modules.map((_, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-3"
                                                    >

                                                        {/* Select */}
                                                        <div className="w-1/2">
                                                            <select
                                                                className=" border border-zinc-300 rounded-2xl focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700 w-full rounded-lg px-2 py-2 text-lg"
                                                                value={modules[index].name}
                                                                onChange={(e) => {
                                                                    const newModules = [...modules];
                                                                    newModules[index].name = e.target.value;
                                                                    setModules(newModules);
                                                                }}
                                                            >
                                                                <option value="">Select</option>
                                                                {availableModules.map(module => (
                                                                    <option key={module.id} value={module.value}>
                                                                        {module.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        {/* Privileges */}
                                                        <div className="w-1/2 flex items-center">
                                                            <div className="flex gap-x-4 gap-y-2">
                                                                {["View", "Edit", "Export", "Something"].map((priv, i) => (
                                                                    <label
                                                                        key={i}
                                                                        className="flex items-center space-x-2 text-lg"
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 checked:bg-green-600 checked:border-green-600 appearance-none border-2 checked:appearance-auto cursor-pointer"
                                                                            style={{
                                                                                accentColor: '#16a34a'
                                                                            }}
                                                                            checked={modules[index].privileges.includes(priv)}
                                                                            onChange={(e) => {
                                                                                const newModules = [...modules];
                                                                                if (e.target.checked) {
                                                                                    newModules[index].privileges = [...newModules[index].privileges, priv];
                                                                                } else {
                                                                                    newModules[index].privileges = newModules[index].privileges.filter(p => p !== priv);
                                                                                }
                                                                                setModules(newModules);
                                                                            }}
                                                                        />
                                                                        <span>{priv}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Remove Button */}
                                                        {modules.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeModule(index)}
                                                                className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                                title="Remove module"
                                                            >
                                                                <XMarkIcon className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                onClick={addModule}
                                                className="mt-3 text-sm text-green-600 hover:underline"
                                            >
                                                + New module
                                            </button>

                                            <div className="flex justify-end mt-6">
                                                <button
                                                    type="submit"
                                                    className="bg-green-700 hover:bg-green-600 text-white text-lg py-4 px-20 rounded-lg shadow-md flex items-center justify-center transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]"
                                                    disabled={isRoleLoading}
                                                >
                                                    {isRoleLoading ? (
                                                        <>
                                                            <LoadingSpinnerIcon className="h-5 w-5 mr-2" />
                                                            {isEditRoleMode ? 'Updating...' : 'Saving...'}
                                                        </>
                                                    ) : (
                                                        isEditRoleMode ? 'Update Role' : 'Save'
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* deactivate/remove modal */}
                            {isModalOpen && activeTab === 'deactivate' && (
                                <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-40 transition-opacity duration-300 ease-in-out">
                                    <div className="bg-white rounded-2xl shadow-xl px-8 py-12 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                                        <div className="flex flex-col justify-center items-center gap-4">
                                            {/* icon */}
                                            <span className='mt-7'>
                                                <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M5.5 10.5H8.83333H35.5" stroke="#D70606" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M32.1673 10.5007V33.834C32.1673 34.718 31.8161 35.5659 31.191 36.191C30.5659 36.8161 29.718 37.1673 28.834 37.1673H12.1673C11.2833 37.1673 10.4354 36.8161 9.81029 36.191C9.18517 35.5659 8.83398 34.718 8.83398 33.834V10.5007M13.834 10.5007V7.16732C13.834 6.28326 14.1852 5.43542 14.8103 4.81029C15.4354 4.18517 16.2833 3.83398 17.1673 3.83398H23.834C24.718 3.83398 25.5659 4.18517 26.191 4.81029C26.8161 5.43542 27.1673 6.28326 27.1673 7.16732V10.5007" stroke="#D70606" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M17.166 18.834V28.834" stroke="#D70606" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M23.834 18.834V28.834" stroke="#D70606" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                            </span>

                                            {/* title */}
                                            <h3 className="text-2xl font-semibold text-red-700">
                                                {actionType === 'member' ? 'Deactivate User?' : 'Remove Role?'}
                                            </h3>

                                            {/* description */}
                                            {(currentMemberId || currentRoleId) && (
                                                <div className="mb-6">
                                                    <p className="text-zinc-700 text-lg">
                                                        Are you sure you want to {actionType === 'member' ? 'deactivate' : 'remove'}{' '}
                                                        <span className="font-semibold text-zinc-800">
                                                            {actionType === 'member'
                                                                ? teamMembers.find(member => member.id === currentMemberId || member._id === currentMemberId)?.name
                                                                : roles.find(role => role.id === currentRoleId)?.role
                                                            }
                                                        </span>?
                                                    </p>
                                                    <p className="text-zinc-500 text-sm mt-2">
                                                        {actionType === 'member'
                                                            ? 'This action will prevent the user from accessing the system.'
                                                            : 'This action will permanently remove the role and its permissions.'
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                            <div className="flex justify-end gap-4 mt-2">
                                                <button
                                                    onClick={closeModal}
                                                    className="px-6 py-3 text-zinc-600 hover:text-zinc-800 rounded-lg transition-colors duration-150"
                                                    disabled={isDeactivating || isRemovingRole}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={actionType === 'member' ? handleDeactivateMember : handleRemoveRole}
                                                    className="bg-red-500 hover:bg-red-600 text-white text-lg py-3 px-8 rounded-lg shadow-md flex items-center justify-center transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]"
                                                    disabled={isDeactivating || isRemovingRole}
                                                >
                                                    {(isDeactivating || isRemovingRole) ? (
                                                        <>
                                                            <LoadingSpinnerIcon className="h-5 w-5 mr-2" />
                                                            {actionType === 'member' ? 'Deactivating...' : 'Removing...'}
                                                        </>
                                                    ) : (
                                                        actionType === 'member' ? 'Deactivate' : 'Remove'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
            <DropdownPortal />
        </div>
    );
};

export default AdminAccess;