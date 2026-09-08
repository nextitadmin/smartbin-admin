import React, { useEffect, useMemo, useState } from "react";
import api from "../api/apiConfig";
import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon } from "../components/icons";

const ROLE_OPTIONS = [
  { value: "Admin", label: "Admin" },
  { value: "Member", label: "Member" },
  { value: "Super Admin", label: "Super Admin" },
  { value: "Viewer", label: "Viewer" },
];

const GROUP_OPTIONS = [
  { value: "LAWMA", label: "LAWMA" },
  { value: "PSP", label: "PSP" },
  { value: "Partner", label: "Partner" },
  { value: "Corporate", label: "Corporate" },
];

const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "N/A";
  return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
};

const normalizeString = (value) => {
  if (value === undefined || value === null) return "";
  return String(value).trim();
};

const buildUser = (user) => ({
  id: user.userId || user.id || user._id || `${user.email || 'user'}-${Date.now()}`,
  name: normalizeString(user.name || user.fullName || user.username),
  email: normalizeString(user.email || user.businessEmail),
  phone: normalizeString(user.phone || user.phoneNumber || user.businessPhone),
  group: normalizeString(user.group || user.pspCompany || user.companyName || user.userType || "LAWMA"),
  role: normalizeString(user.role || user.userType || user.accessRole || "Member"),
  status: normalizeString(user.status || "Active"),
  createdAt: user.createdAt || user.dateAdded || user.date || null,
  lastActive: user.lastLogin || user.lastActive || user.updatedAt || null,
});

const UserManagementModal = ({ isOpen, onClose }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "", visible: false });
  const [newUser, setNewUser] = useState({ name: "", email: "", phone: "", group: "LAWMA", role: "Admin" });

  const showNotification = (message, type = "success") => {
    setNotification({ message, type, visible: true });
    window.setTimeout(() => setNotification({ message: "", type: "", visible: false }), 3200);
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("admin/users?page=1&size=100");
      const items = Array.isArray(data?.allUsers) ? data.allUsers : [];
      const mapped = items.map(buildUser);
      setUsers(mapped);
    } catch (error) {
      console.error("Failed to load users", error);
      showNotification("Unable to load users", "error");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchUsers();
  }, [isOpen]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = [user.name, user.email, user.phone, user.group, user.role]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());

      const matchesRole = filterRole === "All" || user.role.toLowerCase() === filterRole.toLowerCase();
      const matchesStatus = filterStatus === "All" || user.status.toLowerCase() === filterStatus.toLowerCase();

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, filterRole, filterStatus]);

  const handleAddUserSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await api.post("admin/users", {
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        group: newUser.group,
        role: newUser.role,
      });
      showNotification("New user added successfully", "success");
      setIsAddOpen(false);
      setNewUser({ name: "", email: "", phone: "", group: "LAWMA", role: "Admin" });
      await fetchUsers();
    } catch (error) {
      console.error("Unable to add user", error);
      showNotification("Unable to add user. Confirm backend endpoint exists.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDetails = (user) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedUser(null);
    setIsDetailOpen(false);
  };

  const handleClose = () => {
    setSearchTerm("");
    setFilterRole("All");
    setFilterStatus("All");
    setIsAddOpen(false);
    setIsDetailOpen(false);
    setSelectedUser(null);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-[1200px] bg-white rounded-[28px] shadow-2xl overflow-hidden">
        {notification.visible && (
          <div className={`absolute top-4 left-1/2 z-50 -translate-x-1/2 rounded-full px-5 py-3 text-sm font-medium shadow-lg ${notification.type === "success" ? "bg-green-700 text-white" : "bg-red-600 text-white"}`}>
            {notification.message}
          </div>
        )}

        <div className="flex items-start justify-between p-6 border-b border-zinc-200">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-900">User Management</h2>
            <p className="text-zinc-500 mt-1">Invite and manage members of organizations</p>
          </div>
          <button onClick={handleClose} className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-[280px]">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search members"
                  className="w-full pl-10 pr-3 py-3 border border-zinc-300 rounded-2xl bg-white text-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-700"
                />
              </div>
              <div className="min-w-[180px]">
                <label className="text-xs uppercase tracking-[.18em] text-zinc-500 mb-1 block">Filter by role</label>
                <div className="relative">
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full appearance-none border border-zinc-300 rounded-2xl bg-white px-4 py-3 pr-10 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-700"
                  >
                    <option>All</option>
                    {ROLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                </div>
              </div>
              <div className="min-w-[180px]">
                <label className="text-xs uppercase tracking-[.18em] text-zinc-500 mb-1 block">Select status</label>
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full appearance-none border border-zinc-300 rounded-2xl bg-white px-4 py-3 pr-10 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-700"
                  >
                    <option>All</option>
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Deactivated</option>
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center justify-center rounded-2xl bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
            >
              Add new user
            </button>
          </div>

          <div className="overflow-x-auto bg-white border border-zinc-200 rounded-3xl">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-zinc-50">
                  {[
                    { label: "S/N" },
                    { label: "Name" },
                    { label: "Email address" },
                    { label: "Phone number" },
                    { label: "Group" },
                    { label: "Role" },
                    { label: "Status" },
                    { label: "Action" },
                  ].map((header) => (
                    <th key={header.label} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[.18em] text-zinc-500">
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-8 text-center text-zinc-500">Loading users...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-8 text-center text-zinc-500">No users found</td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr key={user.id} className="border-t border-zinc-200 hover:bg-zinc-50">
                      <td className="px-5 py-4 text-sm text-zinc-700">{index + 1}</td>
                      <td className="px-5 py-4 text-sm text-zinc-900">{user.name || "-"}</td>
                      <td className="px-5 py-4 text-sm text-zinc-700">{user.email || "-"}</td>
                      <td className="px-5 py-4 text-sm text-zinc-700">{user.phone || "-"}</td>
                      <td className="px-5 py-4 text-sm text-zinc-700">{user.group || "-"}</td>
                      <td className="px-5 py-4 text-sm text-zinc-700">{user.role || "-"}</td>
                      <td className="px-5 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${user.status.toLowerCase() === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                          {user.status || "Active"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm">
                        <button
                          type="button"
                          onClick={() => handleOpenDetails(user)}
                          className="text-sm font-semibold text-green-700 hover:text-green-900"
                        >
                          View details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {isAddOpen && (
          <div className="fixed inset-0 z-60 bg-black/40 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-semibold text-zinc-900">Add new user</h3>
                  <p className="text-sm text-zinc-500">Add new members of organizations</p>
                </div>
                <button onClick={() => setIsAddOpen(false)} className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleAddUserSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-zinc-700">Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Name"
                    className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-700"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700">Email address</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Email address"
                    className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-700"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-700">Phone number</label>
                  <input
                    type="tel"
                    value={newUser.phone}
                    onChange={(e) => setNewUser((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="Phone number"
                    className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-700"
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-zinc-700">Group</label>
                    <div className="relative mt-2">
                      <select
                        value={newUser.group}
                        onChange={(e) => setNewUser((prev) => ({ ...prev, group: e.target.value }))}
                        className="w-full appearance-none rounded-2xl border border-zinc-300 bg-white px-4 py-3 pr-10 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-700"
                      >
                        {GROUP_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
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
                        onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value }))}
                        className="w-full appearance-none rounded-2xl border border-zinc-300 bg-white px-4 py-3 pr-10 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-green-700"
                      >
                        {ROLE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-green-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:opacity-70"
                  disabled={isLoading}
                >
                  {isLoading ? "Adding user..." : "Add user"}
                </button>
              </form>
            </div>
          </div>
        )}

        {isDetailOpen && selectedUser && (
          <div className="fixed inset-0 z-60 bg-black/40 flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-semibold text-zinc-900">User details</h3>
                  <p className="text-sm text-zinc-500">View the selected user&apos;s information</p>
                </div>
                <button onClick={handleCloseDetails} className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="grid gap-4">
                {[
                  { label: "Name", value: selectedUser.name },
                  { label: "Email address", value: selectedUser.email },
                  { label: "Phone number", value: selectedUser.phone },
                  { label: "Group", value: selectedUser.group },
                  { label: "User role", value: selectedUser.role },
                  { label: "Date created", value: formatDate(selectedUser.createdAt) },
                  { label: "Last active", value: formatDate(selectedUser.lastActive) },
                  { label: "Status", value: selectedUser.status },
                ].map((field) => (
                  <div key={field.label} className="flex flex-col gap-2 rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
                    <span className="text-xs uppercase tracking-[.18em] text-zinc-500">{field.label}</span>
                    {field.label === "Status" ? (
                      <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${selectedUser.status.toLowerCase() === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                        {selectedUser.status}
                      </span>
                    ) : (
                      <span className="text-sm text-zinc-900">{field.value || "-"}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementModal;
