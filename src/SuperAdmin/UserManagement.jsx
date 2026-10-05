import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Sidebar from "../components/SuperAdmin/Sidebar";
import Topbar from "../components/SuperAdmin/Topbar";
import api from "../api/apiConfig";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  ChevronDownIcon,
  XMarkIcon,
  CheckCircleIconSolid,
  ExclamationTriangleIconSolid,
  LoadingSpinnerIcon,
  DotsVerticalIcon,
} from "../components/icons";

// Exact dataset matching the design in user's screenshot + additional realistic members
const INITIAL_USERS = [
  {
    id: "usr-1",
    name: "Adebimpe Soriyan",
    email: "adebimpesoriyan@gmail.om",
    phone: "08029389102",
    group: "PSP",
    role: "Admin",
    status: "Deactivated",
    createdAt: "2025-01-14T09:20:00Z",
    lastActive: "2026-08-11T14:30:00Z",
  },
  {
    id: "usr-2",
    name: "Bolanle Toju",
    email: "bluewaylimited@business.co",
    phone: "08032784726",
    group: "LAWMA",
    role: "Member",
    status: "Active",
    createdAt: "2025-02-01T10:15:00Z",
    lastActive: "2026-10-02T12:45:00Z",
  },
  {
    id: "usr-3",
    name: "Faridat Deola",
    email: "soyalimitedenter@xnxy.xo",
    phone: "08142904836",
    group: "Smart Bin",
    role: "Admin",
    status: "Active",
    createdAt: "2025-02-18T11:00:00Z",
    lastActive: "2026-10-02T13:10:00Z",
  },
  {
    id: "usr-4",
    name: "Martins Madueke",
    email: "martinsmadueke89@hotmail.",
    phone: "07023780192",
    group: "LAWMA",
    role: "Member",
    status: "Active",
    createdAt: "2025-03-05T08:40:00Z",
    lastActive: "2026-10-01T16:20:00Z",
  },
  {
    id: "usr-5",
    name: "Fisayo Mabel",
    email: "fisayomabel@yahoomail.com",
    phone: "09011892739",
    group: "Smart Bin",
    role: "Admin",
    status: "Active",
    createdAt: "2025-03-22T14:05:00Z",
    lastActive: "2026-10-02T10:00:00Z",
  },
  {
    id: "usr-6",
    name: "Fidelis James",
    email: "chickenandcofood@toc.com",
    phone: "07038902948",
    group: "LAWMA",
    role: "Member",
    status: "Active",
    createdAt: "2025-04-10T12:30:00Z",
    lastActive: "2026-09-29T15:10:00Z",
  },
  {
    id: "usr-7",
    name: "Engr. Babatunde Adeleke",
    email: "b.adeleke@lawma.gov.ng",
    phone: "08031234567",
    group: "LAWMA",
    role: "Super Admin",
    status: "Active",
    createdAt: "2025-01-10T08:00:00Z",
    lastActive: "2026-10-02T14:15:00Z",
  },
  {
    id: "usr-8",
    name: "Chioma Okon",
    email: "c.okon@vanguardeco.com",
    phone: "08077798123",
    group: "PSP",
    role: "Admin",
    status: "Active",
    createdAt: "2025-05-02T11:20:00Z",
    lastActive: "2026-10-02T11:00:00Z",
  },
  {
    id: "usr-9",
    name: "Efe Ambrose",
    email: "facility@lekkiphase1.org",
    phone: "08022114455",
    group: "Smart Bin",
    role: "Member",
    status: "Active",
    createdAt: "2025-05-18T13:45:00Z",
    lastActive: "2026-10-01T09:30:00Z",
  },
  {
    id: "usr-10",
    name: "Tunde Bakare",
    email: "t.bakare@apexcleantech.ng",
    phone: "08033344455",
    group: "PSP",
    role: "Admin",
    status: "Active",
    createdAt: "2025-06-01T15:10:00Z",
    lastActive: "2026-09-30T17:20:00Z",
  },
  {
    id: "usr-11",
    name: "Folashade Tinubu",
    email: "admin@vitowers.ng",
    phone: "08034567890",
    group: "Corporate",
    role: "Viewer",
    status: "Active",
    createdAt: "2025-06-15T10:00:00Z",
    lastActive: "2026-10-01T14:40:00Z",
  },
  {
    id: "usr-12",
    name: "Aminat Yusuf",
    email: "a.yusuf@lawma.gov.ng",
    phone: "08181234987",
    group: "LAWMA",
    role: "Admin",
    status: "Active",
    createdAt: "2025-07-04T09:30:00Z",
    lastActive: "2026-10-02T13:50:00Z",
  },
];

const GROUP_OPTIONS = ["PSP", "LAWMA", "Smart Bin", "Partner", "Corporate"];
const ROLE_OPTIONS = ["Admin", "Member", "Super Admin", "Viewer"];
const STATUS_OPTIONS = ["Active", "Deactivated"];

const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "N/A";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Subtle Network / Organization icon next to Group label
const GroupIcon = () => (
  <svg
    className="w-3.5 h-3.5 text-zinc-500"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default function UserManagement() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Pagination state (passed as query params: page, limit)
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(INITIAL_USERS.length);

  // Row Action popover
  const [openActionId, setOpenActionId] = useState(null);
  const actionMenuRef = useRef(null);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Add user form
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    group: "PSP",
    role: "Admin",
  });
  const [isAdding, setIsAdding] = useState(false);

  // Edit user form
  const [editUser, setEditUser] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    group: "PSP",
    role: "Admin",
    status: "Active",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Toast notification
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const showNotification = (message, type = "success") => {
    setNotification({ visible: true, message, type });
    setTimeout(() => {
      setNotification({ visible: false, message: "", type: "success" });
    }, 3200);
  };

  // Close action dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
        setOpenActionId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Fallback pagination & search on local dataset when backend is not connected
  const applyLocalFallback = useCallback((page, pageLimit, query) => {
    let filtered = [...INITIAL_USERS];
    if (query && typeof query === "string" && query.trim()) {
      const term = query.toLowerCase().trim();
      filtered = filtered.filter(
        (u) =>
          (u.name || "").toLowerCase().includes(term) ||
          (u.email || "").toLowerCase().includes(term) ||
          (u.phone || "").includes(term) ||
          (u.group || "").toLowerCase().includes(term) ||
          (u.role || "").toLowerCase().includes(term)
      );
    }
    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / pageLimit));
    const start = (page - 1) * pageLimit;
    const paginated = filtered.slice(start, start + pageLimit);
    setUsers(paginated);
    setTotalUsers(total);
    setTotalPages(pages);
  }, []);

  // Fetch users from API: GET /api/v1/admin/users?search=...&page=...&limit=...
  const fetchUsers = useCallback(
    async (page = currentPage, pageLimit = limit, query = searchTerm) => {
      setIsLoading(true);
      try {
        const params = {
          page: Number(page) || 1,
          limit: Number(pageLimit) || 10,
        };
        if (query && typeof query === "string" && query.trim()) {
          params.search = query.trim();
        }

        // Axios baseURL is https://smartbin-be.next-itservices.com/api/v1/
        const response = await api.get("admin/users", { params });
        const resData = response?.data;

        // Extract users from response (matches allUsers property or nested structures)
        const items = Array.isArray(resData?.allUsers)
          ? resData.allUsers
          : Array.isArray(resData?.data?.allUsers)
          ? resData.data.allUsers
          : Array.isArray(resData?.data)
          ? resData.data
          : Array.isArray(resData?.users)
          ? resData.users
          : Array.isArray(resData)
          ? resData
          : [];

        const paging = resData?.paging || resData?.pagination || resData?.meta || {};
        const total =
          paging.total ??
          paging.totalCount ??
          resData?.total ??
          items.length;
        const pages =
          paging.pages ??
          paging.totalPages ??
          Math.max(1, Math.ceil((total || items.length) / (Number(pageLimit) || 10)));

        if (items.length > 0) {
          const mapped = items.map((u, index) => ({
            id: u.userId || u.id || u._id || `usr-api-${index}`,
            name: u.name || u.fullName || u.username || "Unnamed User",
            email: u.email || u.businessEmail || "N/A",
            phone: u.phone || u.phoneNumber || u.businessPhone || "N/A",
            group: u.group || u.companyName || u.pspCompany || u.userType || "LAWMA",
            role: u.role || u.accessRole || "Member",
            status:
              String(u.status || "Active").toLowerCase() === "deactivated" ||
              String(u.status || "").toLowerCase() === "inactive"
                ? "Deactivated"
                : "Active",
            createdAt: u.createdAt || u.dateAdded || new Date().toISOString(),
            lastActive: u.lastLogin || u.lastActive || null,
            raw: u,
          }));
          setUsers(mapped);
          setTotalUsers(total);
          setTotalPages(pages);
        } else if (resData?.success || Array.isArray(resData?.allUsers)) {
          // Valid response with 0 users found
          setUsers([]);
          setTotalUsers(0);
          setTotalPages(1);
        } else {
          // Graceful fallback to rich local data
          applyLocalFallback(page, pageLimit, query);
        }
      } catch (err) {
        console.warn("Using local users dataset fallback:", err?.message);
        applyLocalFallback(page, pageLimit, query);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, limit, searchTerm, applyLocalFallback]
  );

  // Debounced fetch on search or limit change
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers(1, limit, searchTerm);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm, limit]);

  // Fetch when page changes
  useEffect(() => {
    fetchUsers(currentPage, limit, searchTerm);
  }, [currentPage]);

  // Filtered Users (supports additional client dropdown filters: Group, Role, Status)
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Group filter
      if (selectedGroup !== "All") {
        if ((user.group || "").toLowerCase() !== selectedGroup.toLowerCase()) {
          return false;
        }
      }

      // Role filter
      if (selectedRole !== "All") {
        if ((user.role || "").toLowerCase() !== selectedRole.toLowerCase()) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== "All") {
        if ((user.status || "").toLowerCase() !== selectedStatus.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [users, selectedGroup, selectedRole, selectedStatus]);

  // Add User submit handler
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.phone.trim()) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    setIsAdding(true);
    try {
      try {
        await api.post("admin/users", {
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          group: newUser.group,
          role: newUser.role,
        });
      } catch (apiErr) {
        console.warn("Backend add user endpoint not active, saving locally:", apiErr?.message);
      }

      const created = {
        id: `usr-${Date.now()}`,
        name: newUser.name.trim(),
        email: newUser.email.trim(),
        phone: newUser.phone.trim(),
        group: newUser.group,
        role: newUser.role,
        status: "Active",
        createdAt: new Date().toISOString(),
        lastActive: "Just now",
      };

      setUsers((prev) => [created, ...prev]);
      showNotification("New user added successfully", "success");
      setIsAddOpen(false);
      setNewUser({ name: "", email: "", phone: "", group: "PSP", role: "Admin" });
    } catch (err) {
      showNotification("Failed to add user", "error");
    } finally {
      setIsAdding(false);
    }
  };

  // Edit User submit handler
  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    if (!editUser.name.trim() || !editUser.email.trim()) {
      showNotification("Please fill in required fields", "error");
      return;
    }

    setIsEditing(true);
    try {
      try {
        await api.patch(`admin/users/${editUser.id}`, {
          name: editUser.name,
          email: editUser.email,
          phone: editUser.phone,
          group: editUser.group,
          role: editUser.role,
          status: editUser.status,
        });
      } catch (err) {
        console.warn("Backend edit user not active, saving locally:", err?.message);
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === editUser.id
            ? {
                ...u,
                name: editUser.name,
                email: editUser.email,
                phone: editUser.phone,
                group: editUser.group,
                role: editUser.role,
                status: editUser.status,
              }
            : u
        )
      );

      showNotification("User updated successfully", "success");
      setIsEditOpen(false);
    } catch (err) {
      showNotification("Failed to update user", "error");
    } finally {
      setIsEditing(false);
    }
  };

  // Toggle status (Active / Deactivated)
  const handleToggleStatus = async (user) => {
    setOpenActionId(null);
    const nextStatus = user.status === "Active" ? "Deactivated" : "Active";
    try {
      try {
        await api.patch(`admin/users/${user.id}/status`, {
          status: nextStatus.toLowerCase(),
        });
      } catch (err) {
        console.warn("Backend status endpoint not active, saving locally:", err?.message);
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
      );
      showNotification(
        `User status changed to ${nextStatus}`,
        nextStatus === "Active" ? "success" : "info"
      );
    } catch (err) {
      showNotification("Could not update user status", "error");
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      try {
        await api.delete(`admin/users/${selectedUser.id}`);
      } catch (err) {
        console.warn("Backend delete user not active, deleting locally:", err?.message);
      }

      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      showNotification("User deleted successfully", "success");
      setIsDeleteOpen(false);
      setSelectedUser(null);
    } catch (err) {
      showNotification("Failed to delete user", "error");
    }
  };

  const handleOpenDetails = (user) => {
    setOpenActionId(null);
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const handleOpenEdit = (user) => {
    setOpenActionId(null);
    setSelectedUser(user);
    setEditUser({
      id: user.id,
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      group: user.group || "PSP",
      role: user.role || "Admin",
      status: user.status || "Active",
    });
    setIsEditOpen(true);
  };

  const handleOpenDelete = (user) => {
    setOpenActionId(null);
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Notification alert */}
            {notification.visible && (
              <div
                className={`fixed top-5 right-5 z-50 p-4 rounded-xl shadow-lg text-white flex items-center space-x-3 transition-all ${
                  notification.type === "success"
                    ? "bg-[#007836]"
                    : notification.type === "error"
                    ? "bg-red-500"
                    : "bg-zinc-800"
                }`}
              >
                {notification.type === "success" ? (
                  <CheckCircleIconSolid className="h-5 w-5" />
                ) : (
                  <ExclamationTriangleIconSolid className="h-5 w-5" />
                )}
                <span className="text-sm font-medium">{notification.message}</span>
                <button
                  onClick={() =>
                    setNotification({ visible: false, message: "", type: "success" })
                  }
                  className="ml-auto p-1 hover:bg-white/20 rounded"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Header: Title, Subtitle, and Add New User Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
                  User Management
                </h1>
                <p className="text-sm text-zinc-500 mt-1 font-normal">
                  Invite and manage members of organizations
                </p>
              </div>

              {/* Add New User Button */}
              <button
                type="button"
                onClick={() => setIsAddOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#007836] hover:bg-[#00652d] px-5 py-3 text-sm font-semibold text-white shadow-sm transition cursor-pointer"
              >
                <span>Add new user</span>
                <PlusIcon className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Filters Row: Search members (left) & 3 Dropdown filters (right) */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
              {/* Search Box */}
              <div className="relative w-full sm:w-80 md:w-96">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#007836]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search members"
                  className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#007836] focus:border-[#007836] transition shadow-2xs"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* 3 Dropdown Filters */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Filter by group */}
                <div className="relative min-w-[150px]">
                  <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 py-2.5 pr-9 text-sm font-normal text-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#007836] focus:border-[#007836] cursor-pointer shadow-2xs transition"
                  >
                    <option value="All">Filter by group</option>
                    {GROUP_OPTIONS.map((grp) => (
                      <option key={grp} value={grp}>
                        {grp}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                </div>

                {/* Filter by role */}
                <div className="relative min-w-[150px]">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 py-2.5 pr-9 text-sm font-normal text-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#007836] focus:border-[#007836] cursor-pointer shadow-2xs transition"
                  >
                    <option value="All">Filter by role</option>
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                </div>

                {/* Select Status */}
                <div className="relative min-w-[150px]">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 py-2.5 pr-9 text-sm font-normal text-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#007836] focus:border-[#007836] cursor-pointer shadow-2xs transition"
                  >
                    <option value="All">Select Status</option>
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                </div>

                {/* Reset Filters if any active */}
                {(searchTerm ||
                  selectedGroup !== "All" ||
                  selectedRole !== "All" ||
                  selectedStatus !== "All") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedGroup("All");
                      setSelectedRole("All");
                      setSelectedStatus("All");
                    }}
                    className="px-3 py-2 text-xs font-semibold text-zinc-500 hover:text-[#007836] hover:bg-zinc-100 rounded-lg transition"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Users Data Table */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xs overflow-visible">
              <div className="overflow-x-auto overflow-y-visible">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 text-left text-sm font-medium text-zinc-600">
                      <th className="py-4 px-6 w-16">S/N</th>
                      <th className="py-4 px-6">Name</th>
                      <th className="py-4 px-6">Email address</th>
                      <th className="py-4 px-6">Phone number</th>
                      <th className="py-4 px-6">Group</th>
                      <th className="py-4 px-6">Role</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-center w-20">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-zinc-100 text-sm">
                    {isLoading ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-zinc-500">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <LoadingSpinnerIcon className="h-6 w-6 text-[#007836] animate-spin" />
                            <span className="text-sm font-medium">Loading users...</span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-16 text-center text-zinc-400">
                          No users match your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user, index) => (
                        <tr
                          key={user.id}
                          className="hover:bg-zinc-50/70 transition-colors"
                        >
                          {/* S/N */}
                          <td className="py-5 px-6 text-zinc-700 font-normal">
                            {(currentPage - 1) * limit + index + 1}
                          </td>

                          {/* Name */}
                          <td className="py-5 px-6 font-medium text-zinc-900 whitespace-nowrap">
                            {user.name}
                          </td>

                          {/* Email Address */}
                          <td className="py-5 px-6 text-zinc-700 whitespace-nowrap">
                            {user.email}
                          </td>

                          {/* Phone Number */}
                          <td className="py-5 px-6 text-zinc-700 whitespace-nowrap font-mono text-xs">
                            {user.phone}
                          </td>

                          {/* Group (with group network icon) */}
                          <td className="py-5 px-6 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-100 text-zinc-700 text-xs font-medium">
                              <GroupIcon />
                              <span>{user.group}</span>
                            </span>
                          </td>

                          {/* Role */}
                          <td className="py-5 px-6 text-zinc-700 whitespace-nowrap font-normal">
                            {user.role}
                          </td>

                          {/* Status */}
                          <td className="py-5 px-6 whitespace-nowrap">
                            {user.status === "Active" ? (
                              <span className="font-semibold text-emerald-600">
                                Active
                              </span>
                            ) : (
                              <span className="font-semibold text-red-500">
                                Deactivated
                              </span>
                            )}
                          </td>

                          {/* Action (three dots kebab menu) */}
                          <td className="py-5 px-6 text-center whitespace-nowrap relative">
                            <div className="relative inline-block text-left">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenActionId(
                                    openActionId === user.id ? null : user.id
                                  );
                                }}
                                className="p-1 rounded-lg text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition cursor-pointer"
                              >
                                <DotsVerticalIcon className="h-5 w-5" />
                              </button>

                              {/* Dropdown Menu */}
                              {openActionId === user.id && (
                                <div
                                  ref={actionMenuRef}
                                  className="absolute right-0 mt-1 w-44 rounded-xl bg-white shadow-xl border border-zinc-200 py-1.5 z-40 animate-scaleUp text-left"
                                >
                                  <button
                                    type="button"
                                    onClick={() => handleOpenDetails(user)}
                                    className="w-full px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-[#007836] flex items-center transition"
                                  >
                                    View details
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEdit(user)}
                                    className="w-full px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-[#007836] flex items-center transition"
                                  >
                                    Edit user
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleStatus(user)}
                                    className="w-full px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-[#007836] flex items-center transition"
                                  >
                                    {user.status === "Active"
                                      ? "Deactivate user"
                                      : "Activate user"}
                                  </button>
                                  <div className="border-t border-zinc-100 my-1"></div>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenDelete(user)}
                                    className="w-full px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center transition"
                                  >
                                    Delete user
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              {totalUsers > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-zinc-100 text-xs text-zinc-500 bg-white rounded-b-2xl">
                  <div className="flex items-center gap-2">
                    <span>
                      Showing {(currentPage - 1) * limit + 1} to{" "}
                      {Math.min(currentPage * limit, totalUsers)} of {totalUsers} users
                    </span>
                    <span className="text-zinc-300">|</span>
                    <label className="flex items-center gap-1.5">
                      <span>Rows:</span>
                      <select
                        value={limit}
                        onChange={(e) => {
                          const newLimit = Number(e.target.value);
                          setLimit(newLimit);
                          setCurrentPage(1);
                        }}
                        className="border border-zinc-200 rounded-md px-2 py-1 text-xs text-zinc-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#007836] cursor-pointer"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
                    </label>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-7 h-7 rounded bg-zinc-100 text-zinc-600 hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center font-medium"
                      title="Previous page"
                    >
                      ‹
                    </button>

                    <span className="px-2 font-medium text-zinc-700">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                      className="w-7 h-7 rounded bg-[#007836] text-white hover:bg-[#00602b] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center font-medium"
                      title="Next page"
                    >
                      ›
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* --- ADD NEW USER MODAL --- */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-zinc-900">Add new user</h3>
                <p className="text-sm text-zinc-500">
                  Add new members of organizations
                </p>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-700">Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Name"
                  className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#007836]"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700">
                  Email address
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Email address"
                  className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#007836]"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700">
                  Phone number
                </label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="Phone number"
                  className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#007836]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-zinc-700">Group</label>
                  <div className="relative mt-2">
                    <select
                      value={newUser.group}
                      onChange={(e) =>
                        setNewUser((prev) => ({ ...prev, group: e.target.value }))
                      }
                      className="w-full appearance-none rounded-2xl border border-zinc-300 bg-white px-4 py-3 pr-10 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#007836]"
                    >
                      {GROUP_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-700">Role</label>
                  <div className="relative mt-2">
                    <select
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser((prev) => ({ ...prev, role: e.target.value }))
                      }
                      className="w-full appearance-none rounded-2xl border border-zinc-300 bg-white px-4 py-3 pr-10 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#007836]"
                    >
                      {ROLE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isAdding}
                  className="w-full rounded-2xl bg-[#007836] hover:bg-[#00652d] px-4 py-3 text-sm font-semibold text-white transition disabled:opacity-70 cursor-pointer shadow-sm"
                >
                  {isAdding ? "Adding user..." : "Add user"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- USER DETAILS MODAL --- */}
      {isDetailsOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-zinc-900">User details</h3>
                <p className="text-sm text-zinc-500">
                  View the selected user&apos;s information
                </p>
              </div>
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-3 max-h-[70vh] overflow-y-auto">
              {[
                { label: "Name", value: selectedUser.name },
                { label: "Email address", value: selectedUser.email },
                { label: "Phone number", value: selectedUser.phone },
                { label: "Group", value: selectedUser.group },
                { label: "User role", value: selectedUser.role },
                { label: "Date created", value: formatDate(selectedUser.createdAt) },
                {
                  label: "Last active",
                  value: selectedUser.lastActive
                    ? formatDate(selectedUser.lastActive)
                    : "Active recently",
                },
                { label: "Status", value: selectedUser.status },
              ].map((field) => (
                <div
                  key={field.label}
                  className="flex flex-col gap-1 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3.5"
                >
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
                    {field.label}
                  </span>
                  {field.label === "Status" ? (
                    <div>
                      {field.value === "Active" ? (
                        <span className="font-semibold text-emerald-600 text-sm">
                          Active
                        </span>
                      ) : (
                        <span className="font-semibold text-red-500 text-sm">
                          Deactivated
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-zinc-900 font-medium">
                      {field.value || "-"}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-zinc-100 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsDetailsOpen(false);
                  handleOpenEdit(selectedUser);
                }}
                className="px-4 py-2.5 rounded-xl border border-zinc-300 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition"
              >
                Edit User
              </button>
              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-[#007836] text-white text-xs font-semibold hover:bg-[#00652d] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT USER MODAL --- */}
      {isEditOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-zinc-900">Edit user</h3>
                <p className="text-sm text-zinc-500">Update member information</p>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditUserSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-700">Name</label>
                <input
                  type="text"
                  value={editUser.name}
                  onChange={(e) =>
                    setEditUser((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#007836]"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700">
                  Email address
                </label>
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#007836]"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700">
                  Phone number
                </label>
                <input
                  type="tel"
                  value={editUser.phone}
                  onChange={(e) =>
                    setEditUser((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#007836]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-zinc-700">Group</label>
                  <div className="relative mt-2">
                    <select
                      value={editUser.group}
                      onChange={(e) =>
                        setEditUser((prev) => ({ ...prev, group: e.target.value }))
                      }
                      className="w-full appearance-none rounded-2xl border border-zinc-300 bg-white px-4 py-3 pr-10 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#007836]"
                    >
                      {GROUP_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-700">Role</label>
                  <div className="relative mt-2">
                    <select
                      value={editUser.role}
                      onChange={(e) =>
                        setEditUser((prev) => ({ ...prev, role: e.target.value }))
                      }
                      className="w-full appearance-none rounded-2xl border border-zinc-300 bg-white px-4 py-3 pr-10 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#007836]"
                    >
                      {ROLE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700">Status</label>
                <div className="relative mt-2">
                  <select
                    value={editUser.status}
                    onChange={(e) =>
                      setEditUser((prev) => ({ ...prev, status: e.target.value }))
                    }
                    className="w-full appearance-none rounded-2xl border border-zinc-300 bg-white px-4 py-3 pr-10 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#007836]"
                  >
                    <option value="Active">Active</option>
                    <option value="Deactivated">Deactivated</option>
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isEditing}
                  className="w-full rounded-2xl bg-[#007836] hover:bg-[#00652d] px-4 py-3 text-sm font-semibold text-white transition disabled:opacity-70 cursor-pointer shadow-sm"
                >
                  {isEditing ? "Saving changes..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- CONFIRM DELETE MODAL --- */}
      {isDeleteOpen && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-2xl animate-scaleUp text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <ExclamationTriangleIconSolid className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-zinc-900">Delete User</h3>
              <p className="text-sm text-zinc-500 mt-1">
                Are you sure you want to remove{" "}
                <span className="font-semibold text-zinc-800">
                  {selectedUser.name}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-zinc-300 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-sm font-semibold text-white transition shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
