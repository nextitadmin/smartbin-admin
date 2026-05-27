import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/PSPsTeamMembers/Sidebar";
import Topbar from "../components/PSPsTeamMembers/Topbar";
import { LoadingSpinnerIcon, SearchIcon } from "../components/icons";

// Dummy row shape:
// { id, name, address, phone, wasteId, fillLevel }
const demoAssigned = [
  {
    id: 1,
    name: "Adebolade Aina",
    email: "adebolade.aina@example.com",
    address: "12, Awolowo Road, Ikoyi, Lagos",
    lga: "Eti-Osa",
    lcda: "Ikoyi-Obalende",
    phone: "08029389102",
    wasteId: "#OD123456789",
    fillLevel: "97%",
    note: "Bin is almost full. Please come today if possible.",
  },
  {
    id: 2,
    name: "Bolanle Toju",
    email: "bolanle.toju@example.com",
    address: "45, Ogunlana Drive, Surulere, Lagos",
    lga: "Surulere",
    lcda: "Coker-Aguda",
    phone: "08032784726",
    wasteId: "#OD123456790",
    fillLevel: "54%",
    note: "Gate is locked; call when you arrive.",
  },
  {
    id: 3,
    name: "Faridat Deola",
    email: "faridat.deola@example.com",
    address: "8, Akin Adesola Street, Victoria Island, Lagos",
    lga: "Eti-Osa",
    lcda: "Victoria Island",
    phone: "08142904836",
    wasteId: "#OD123456791",
    fillLevel: "71%",
    note: "Pickup preferred before 12pm.",
  },
  {
    id: 4,
    name: "Martins Madueke",
    email: "martins.madueke@example.com",
    address: "10, Allen Avenue, Ikeja, Lagos",
    lga: "Ikeja",
    lcda: "Onigbongbo",
    phone: "07023780192",
    wasteId: "#OD123456792",
    fillLevel: "33%",
    note: "Bin is behind the house (second gate).",
  },
  {
    id: 5,
    name: "Fisayo Mabel",
    email: "fisayo.mabel@example.com",
    address: "4, Bode Thomas Street, Surulere, Lagos",
    lga: "Surulere",
    lcda: "Itire-Ikate",
    phone: "09011892739",
    wasteId: "#OD123456793",
    fillLevel: "88%",
    note: "Please avoid blocking the driveway.",
  },
];

const demoCompleted = [
  {
    id: 6,
    name: "Fidelis James",
    email: "fidelis.james@example.com",
    address: "1, Admiralty Way, Lekki Phase 1, Lagos",
    lga: "Eti-Osa",
    lcda: "Lekki",
    phone: "07038902948",
    wasteId: "#OD123456794",
    fillLevel: "62%",
    note: "Pickup completed. Thank you.",
  },
  {
    id: 7,
    name: "Grace Okonkwo",
    email: "grace.okonkwo@example.com",
    address: "22, Ozumba Mbadiwe, Victoria Island, Lagos",
    lga: "Eti-Osa",
    lcda: "Victoria Island",
    phone: "08123456789",
    wasteId: "#OD123456795",
    fillLevel: "40%",
    note: "Waste collected successfully.",
  },
  {
    id: 8,
    name: "Chinedu Okafor",
    email: "chinedu.okafor@example.com",
    address: "15, Herbert Macaulay Way, Yaba, Lagos",
    lga: "Lagos Mainland",
    lcda: "Yaba",
    phone: "08098765432",
    wasteId: "#OD123456796",
    fillLevel: "95%",
    note: "Bin was overflowing. Extra bag collected.",
  },
  {
    id: 9,
    name: "Amina Hassan",
    email: "amina.hassan@example.com",
    address: "9, Adeniran Ogunsanya, Surulere, Lagos",
    lga: "Surulere",
    lcda: "Surulere",
    phone: "07012345678",
    wasteId: "#OD123456797",
    fillLevel: "28%",
    note: "No issues during pickup.",
  },
  {
    id: 10,
    name: "Emmanuel Adebayo",
    email: "emmanuel.adebayo@example.com",
    address: "3, Adeola Odeku, Victoria Island, Lagos",
    lga: "Eti-Osa",
    lcda: "Victoria Island",
    phone: "09087654321",
    wasteId: "#OD123456798",
    fillLevel: "79%",
    note: "Pickup done. Customer requested weekly schedule.",
  },
];

function parseFillLevel(fillLevel) {
  const n = Number(
    String(fillLevel || "")
      .replace("%", "")
      .trim(),
  );
  return Number.isFinite(n) ? n : null;
}

function matchesSearch(item, q) {
  if (!q) return true;
  const s = q.toLowerCase();
  return (
    String(item.wasteId || "")
      .toLowerCase()
      .includes(s) ||
    String(item.name || "")
      .toLowerCase()
      .includes(s) ||
    String(item.address || "")
      .toLowerCase()
      .includes(s) ||
    String(item.phone || "")
      .toLowerCase()
      .includes(s) ||
    String(item.fillLevel || "")
      .toLowerCase()
      .includes(s)
  );
}

function matchesFillFilter(item, filter) {
  if (filter === "all") return true;
  const n = parseFillLevel(item.fillLevel);
  if (n == null) return false;
  if (filter === "high") return n >= 80;
  if (filter === "medium") return n >= 50 && n < 80;
  if (filter === "low") return n < 50;
  return true;
}

function exportCsv(rows, filename) {
  const headers = [
    "S/N",
    "Waste ID",
    "Customer Name",
    "Address",
    "Phone Number",
    "Fill Level",
  ];
  const csvRows = rows.map((r, idx) => [
    idx + 1,
    `"${String(r.wasteId ?? "").replaceAll('"', '""')}"`,
    `"${String(r.name ?? "").replaceAll('"', '""')}"`,
    `"${String(r.address ?? "").replaceAll('"', '""')}"`,
    `"${String(r.phone ?? "").replaceAll('"', '""')}"`,
    `"${String(r.fillLevel ?? "").replaceAll('"', '""')}"`,
  ]);

  const csvContent = [
    headers.join(","),
    ...csvRows.map((r) => r.join(",")),
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function formatNGPhone(phone) {
  if (!phone) return null;
  const raw = String(phone).trim().replace(/\s+/g, "");
  if (!raw) return null;
  if (raw.startsWith("+234")) return `+234 ${raw.slice(4)}`;
  if (raw.startsWith("+")) return raw;
  if (raw.startsWith("234")) return `+234 ${raw.slice(3)}`;
  if (raw.startsWith("0")) return `+234 ${raw.slice(1)}`;
  return `+234 ${raw}`;
}

function StatusPill({ status, onClick }) {
  const normalized = String(status || "").toLowerCase();
  const isPickedUp = normalized === "completed" || normalized === "picked-up";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
        isPickedUp
          ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
      }`}
      aria-haspopup="menu"
      aria-label="Change status"
    >
      {isPickedUp ? "Picked up" : "Assigned"}
      <svg
        width="12"
        height="12"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.24 4.5a.75.75 0 0 1-1.08 0l-4.24-4.5a.75.75 0 0 1 .02-1.06Z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}

function DetailsModal({ open, onClose, row, status, onMarkCompleted }) {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [statusValue, setStatusValue] = useState(status);
  const [showConfirm, setShowConfirm] = useState(false);
  const isAssignedView = String(status).toLowerCase() === "assigned";
  const isCompletedView = String(status).toLowerCase() === "completed";

  useEffect(() => {
    // Reset status when opening a new row or when caller changes it
    setStatusValue(status);
    setIsStatusOpen(false);
  }, [status, row]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isStatusOpen) setIsStatusOpen(false);
        else onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, isStatusOpen]);

  if (!open || !row) return null;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB");
  const timeStr = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal overlay"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden">
        <div className="flex items-start justify-between px-6 py-4 border-b border-zinc-100">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 relative">
              <h3 className="text-lg font-semibold text-zinc-900">
                {row.wasteId || "Details"}
              </h3>
              <div className="relative">
                <StatusPill
                  status={statusValue}
                  onClick={() => setIsStatusOpen((v) => !v)}
                />

                {isStatusOpen && (
                  <div
                    role="menu"
                    className="absolute left-0 mt-2 w-64 bg-white border border-zinc-200 rounded-xl shadow-lg p-2 z-20"
                  >
                    
                    {isAssignedView && (
                      <>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setStatusValue("assigned");
                            setIsStatusOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-50 transition"
                        >
                          <p className="text-sm font-medium text-zinc-900">
                            Assigned
                          </p>
                          <p className="text-xs text-zinc-500">
                            Waste pickup assigned to you
                          </p>
                        </button>

                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setIsStatusOpen(false);
                            setShowConfirm(true);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-50 transition"
                        >
                          <p className="text-sm font-medium text-zinc-900">
                            Picked up
                          </p>
                          <p className="text-xs text-zinc-500">
                            Waste has been picked up
                          </p>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 transition-colors"
            aria-label="Close modal"
          >
            <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>

        <div
          className="px-6 py-5"
          onClick={() => isStatusOpen && setIsStatusOpen(false)}
        >
          <div className="w-full flex items-center gap-2 py-2 text-center mb-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.75 3V5.25M17.25 3V5.25M3 18.75V7.5C3 6.90326 3.23705 6.33097 3.65901 5.90901C4.08097 5.48705 4.65326 5.25 5.25 5.25H18.75C19.3467 5.25 19.919 5.48705 20.341 5.90901C20.7629 6.33097 21 6.90326 21 7.5V18.75M3 18.75C3 19.3467 3.23705 19.919 3.65901 20.341C4.08097 20.7629 4.65326 21 5.25 21H18.75C19.3467 21 19.919 20.7629 20.341 20.341C20.7629 19.919 21 19.3467 21 18.75M3 18.75V11.25C3 10.6533 3.23705 10.081 3.65901 9.65901C4.08097 9.23705 4.65326 9 5.25 9H18.75C19.3467 9 19.919 9.23705 20.341 9.65901C20.7629 10.081 21 10.6533 21 11.25V18.75"
                stroke="#828282"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <p className="text-sm text-zinc-800">
              {dateStr} {timeStr}
            </p>
          </div>
          <h4 className="text-sm  text-zinc-900 mb-4">Details</h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-zinc-500">Customer Name</p>
              <p className="text-sm text-zinc-900 font-medium">
                {row.name || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Phone number</p>
              <p className="text-sm text-zinc-900 font-medium">
                {formatNGPhone(row.phone) || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Email address</p>
              <p className="text-sm text-zinc-900 font-medium">
                {row.email || "—"}
              </p>
            </div>
            <div className="md:col-span-3">
              <p className="text-xs text-zinc-500">Address</p>
              <p className="text-sm text-zinc-900 font-medium">
                {row.address || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">LGA</p>
              <p className="text-sm text-zinc-900 font-medium">
                {row.lga || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">LCDA</p>
              <p className="text-sm text-zinc-900 font-medium">
                {row.lcda || "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">SmartBin waste level</p>
              <p className="text-sm text-zinc-900 font-medium">
                {row.fillLevel || "—"}
              </p>
            </div>
            <div className="md:col-span-3">
              <p className="text-xs text-zinc-500">Note from customer</p>
              <p className="text-sm text-zinc-900 font-medium">
                {row.note || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <ConfirmPickupModal
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          onMarkCompleted(row);
          setShowConfirm(false);
          onClose(); // Close details modal after marking complete
        }}
      />
    </div>
  );
}
function ConfirmPickupModal({ open, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">
          Confirm Pickup
        </h3>
        <p className="text-sm text-zinc-600 mb-6">
          Are you sure you have picked up this waste?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-zinc-300 text-sm text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-green-700 text-white text-sm hover:bg-green-800"
          >
            Yes, Picked Up
          </button>
        </div>
      </div>
    </div>
  );
}

function WasteTable({ rows, onRowClick }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-x-auto">
      {rows.length === 0 ? (
        <div className="p-8 text-center text-zinc-500">No records found.</div>
      ) : (
        <table className="w-full min-w-[900px] table-auto border-collapse">
          <thead className="border-b border-zinc-200 bg-white">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider w-16">
                S/N
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Waste ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Customer Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Fill Level
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {rows.map((r, idx) => (
              <tr
                key={r.id ?? `${r.wasteId}-${idx}`}
                className="hover:bg-zinc-50 transition-colors duration-150 cursor-pointer"
                onClick={() => onRowClick?.(r)}
              >
                <td className="px-6 py-4 text-sm text-zinc-500">{idx + 1}.</td>
                <td className="px-6 py-4 text-sm text-zinc-900 font-medium">
                  {r.wasteId}
                </td>
                <td className="px-6 py-4 text-sm text-zinc-800">{r.name}</td>
                <td className="px-6 py-4 text-sm text-zinc-700">{r.address}</td>
                <td className="px-6 py-4 text-sm text-zinc-700">{r.phone}</td>
                <td className="px-6 py-4 text-sm text-zinc-700">
                  {r.fillLevel}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

function WasteCards({ rows, onItemClick }) {
  if (rows.length === 0) {
    return (
      <div className="p-6 bg-white rounded-2xl border border-zinc-200 text-center text-zinc-500">
        No records found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {rows.map((r, idx) => (
        <button
          key={r.id ?? `${r.wasteId}-${idx}`}
          type="button"
          onClick={() => onItemClick?.(r)}
          className="w-full text-left bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm hover:bg-zinc-50 transition"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-zinc-900 truncate">
                {r.wasteId}
              </p>
              <p className="text-sm text-zinc-700 mt-1">{r.name}</p>
              <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                {r.address}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-xs text-zinc-500">Fill</p>
              <p className="text-sm font-medium text-zinc-900">{r.fillLevel}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600">
            <span>{formatNGPhone(r.phone) || "—"}</span>
            <span className="text-green-700 font-medium">View</span>
          </div>
        </button>
      ))}
    </div>
  );
}

export default function WastePickup() {
  const [assignedRows, setAssignedRows] = useState(demoAssigned);
  const [completedRows, setCompletedRows] = useState(demoCompleted);
  const [searchTerm, setSearchTerm] = useState("");
  const [fillFilter, setFillFilter] = useState("all"); // all | high | medium | low
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [exporting, setExporting] = useState({
    assigned: false,
    completed: false,
  });
  const [activeTab, setActiveTab] = useState("assigned"); // assigned | completed
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleMarkCompleted = (row) => {
    setAssignedRows((prev) => prev.filter((item) => item.id !== row.id));

    setCompletedRows((prev) => [...prev, row]);
  };

  const filteredAssigned = useMemo(() => {
    return assignedRows.filter(
      (item) =>
        matchesSearch(item, searchTerm) && matchesFillFilter(item, fillFilter),
    );
  }, [assignedRows, searchTerm, fillFilter]);

  const filteredCompleted = useMemo(() => {
    return completedRows.filter(
      (item) =>
        matchesSearch(item, searchTerm) && matchesFillFilter(item, fillFilter),
    );
  }, [completedRows, searchTerm, fillFilter]);

  const activeRows =
    activeTab === "assigned" ? filteredAssigned : filteredCompleted;
  const isExportingActive =
    activeTab === "assigned" ? exporting.assigned : exporting.completed;

  const onExportAssigned = async () => {
    setExporting((p) => ({ ...p, assigned: true }));
    try {
      exportCsv(
        filteredAssigned,
        `waste-pickup-assigned-${new Date().toISOString().split("T")[0]}.csv`,
      );
    } finally {
      setExporting((p) => ({ ...p, assigned: false }));
    }
  };

  const onExportCompleted = async () => {
    setExporting((p) => ({ ...p, completed: true }));
    try {
      exportCsv(
        filteredCompleted,
        `waste-pickup-completed-${new Date().toISOString().split("T")[0]}.csv`,
      );
    } finally {
      setExporting((p) => ({ ...p, completed: false }));
    }
  };

  return (
    <div className="flex sans h-screen">
      <Sidebar />
      <div className="flex-1 bg-zinc-100 min-h-screen overflow-y-auto">
        <Topbar />
        <div className="bg-zinc-100 font-sans">
          <main className="p-4 md:px-4">
            <div className="p-4 md:p-8 font-sans">
              <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h1 className="text-2xl md:text-3xl font-semibold text-zinc-800">
                    Waste Pickup
                  </h1>
                  <p className="text-zinc-500 text-lg font-light">
                    Manage waste pick up and disposal
                  </p>
                </div>
              </header>

              <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-grow max-w-lg">
                  <input
                    type="text"
                    placeholder="Search by waste ID, name, address, phone..."
                    className="w-full p-2 pl-10 border border-zinc-300 bg-white rounded-xl focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-600" />
                </div>

                <div className="flex justify-between md:justify gap-4">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsFilterOpen((v) => !v)}
                      className="px-4 py-2 rounded-lg border border-zinc-300 text-sm font-medium text-zinc-700 bg-white hover:bg-zinc-50 transition-colors"
                    >
                      Filter
                    </button>

                    {isFilterOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-zinc-200 rounded-xl shadow-lg p-3 z-20">
                        <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                          Fill level
                        </label>
                        <select
                          className="w-full p-2 border border-zinc-300 bg-white rounded-lg focus:ring focus:outline-none focus:ring-green-700 focus:border-green-700 text-sm"
                          value={fillFilter}
                          onChange={(e) => {
                            setFillFilter(e.target.value);
                            setIsFilterOpen(false);
                          }}
                        >
                          <option value="all">All</option>
                          <option value="high">High (≥ 80%)</option>
                          <option value="medium">Medium (50–79%)</option>
                          <option value="low">Low (&lt; 50%)</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={
                      activeTab === "assigned"
                        ? onExportAssigned
                        : onExportCompleted
                    }
                    disabled={isExportingActive || activeRows.length === 0}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-700 hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isExportingActive && (
                      <LoadingSpinnerIcon className="h-4 w-4 animate-spin" />
                    )}
                    Export
                  </button>
                </div>
              </div>

              <div className="flex gap-3 md:gap-7 mb-6 md:mb-10">
                <button
                  type="button"
                  onClick={() => setActiveTab("assigned")}
                  className={`relative pb-2 -mb-[2px] transition-colors duration-300 ease-out
                  after:content-[''] after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-full after:bg-green-700
                  after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out
                  ${
                    activeTab === "assigned"
                      ? "text-green-700 font-medium after:scale-x-100"
                      : "text-zinc-600 hover:text-zinc-800"
                  }`}
                >
                  Assigned
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("completed")}
                  className={`relative pb-2 -mb-[2px] transition-colors duration-300 ease-out
                  after:content-[''] after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-full after:bg-green-700
                  after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-out
                  ${
                    activeTab === "completed"
                      ? "text-green-700 font-medium after:scale-x-100"
                      : "text-zinc-600 hover:text-zinc-800"
                  }`}
                >
                  Completed
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {activeTab === "assigned" ? (
                  <>
                    {/* Mobile: cards, no table */}
                    <div className="md:hidden">
                      <WasteCards
                        rows={filteredAssigned}
                        onItemClick={(row) => {
                          setSelectedRow(row);
                          setIsDetailsOpen(true);
                        }}
                      />
                    </div>

                    {/* Desktop: table */}
                    <div className="hidden md:block">
                      <WasteTable
                        rows={filteredAssigned}
                        onRowClick={(row) => {
                          setSelectedRow(row);
                          setIsDetailsOpen(true);
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Mobile: cards, no table */}
                    <div className="md:hidden">
                      <WasteCards
                        rows={filteredCompleted}
                        onItemClick={(row) => {
                          setSelectedRow(row);
                          setIsDetailsOpen(true);
                        }}
                      />
                    </div>

                    {/* Desktop: table */}
                    <div className="hidden md:block">
                      <WasteTable
                        rows={filteredCompleted}
                        onRowClick={(row) => {
                          setSelectedRow(row);
                          setIsDetailsOpen(true);
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      <DetailsModal
        open={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        row={selectedRow}
        status={activeTab}
        onMarkCompleted={handleMarkCompleted}
      />
    </div>
  );
}
