import React, { useEffect, useState } from "react";
// Zustand import removed
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import api from "../api/apiConfig";


// --- DATA AT THE TOP ---
// Initial data state
const initialData = {
  kpis: {
    totalRegisteredUsers: { value: 0, change: 0, changeType: "increase" },
    binRequests: { value: 0, change: 0, changeType: "increase" },
    amountGenerated: { value: 0, change: 0, changeType: "increase" },
    binPurchase: { value: 0 },
    wasteDisposal: { value: 0 },
    revenueByPsp: { value: 0 },
    householdsEnumerated: { value: 0 },
    binsDelivered: { value: 0 },
    wastePickedUp: { value: 0 },
    lgasCovered: { value: 0 },
    unpaidBillsCount: { value: 0 },
    unpaidBillsAmount: { value: 0 },
  },
  binDistribution: [
    { name: "Smart", value: 0, color: "#16a34a" },
    { name: "Non-Smart", value: 0, color: "#a3a3a3" },
  ],
  usersByCategory: [
    { id: 1, category: "Resident users", count: 0, color: "#27AE60" },
    { id: 2, category: "Agents", count: 0, color: "#FFB400" },
    { id: 3, category: "Facility Managers", count: 0, color: "#FF4C51" },
    { id: 4, category: "Corporate users", count: 0, color: "#16B1FF" },
  ],
  binRequestStatus: [
    { status: "Pending", count: 0, color: "bg-blue-100 text-blue-800" },
    { status: "Inventory", count: 0, color: "bg-zinc-100 text-zinc-800" },
    {
      status: "Scheduled for Delivery",
      count: 0,
      color: "bg-purple-100 text-purple-800",
    },
    { status: "Delivered", count: 0, color: "bg-green-100 text-green-800" },
    {
      status: "Activated",
      count: 0,
      color: "bg-orange-100 text-orange-800",
    },
  ],
};

// --- SVG ICONS ---
// Raw SVG icons as requested, to avoid installing a library.

const ArrowUpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-green-500"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-zinc-500"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

// --- REUSABLE COMPONENTS ---

// Card component removed

const SkeletonCard = () => (
  <div className="bg-white p-6 rounded-lg border border-white animate-pulse">
    <div className="h-6 bg-zinc-200 rounded w-1/2 mb-4"></div>
    <div className="h-10 bg-zinc-200 rounded w-1/3 mb-2"></div>
    <div className="h-4 bg-zinc-200 rounded w-1/4"></div>
  </div>
);

const SelectDropdown = ({ label, options = [], onSelect }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(label);

  const handleSelect = (option) => {
    setSelected(option);
    setOpen(false);
    onSelect?.(option);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm bg-zinc-100 px-3 py-2 rounded-xl text-zinc-600 flex items-center gap-1"
      >
        {selected} <ChevronDownIcon className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-zinc-200 rounded-xl shadow-md z-10">
          {options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleSelect(option)}
              className="block w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const KPICard = ({ title, value, change, children }) => (
  <div className="bg-white p-6 rounded-lg border border-white h-full">
    <h3 className="text-zinc-600 text-base">{title}</h3>
    <div className="flex items-baseline space-x-2 mt-2">
      <p className="text-3xl font-semibold text-green-700">{value}</p>
    </div>
    {change && (
      <div className="flex items-center  space-x-1 mt-1 text-sm">
        <span className="bg-green-100 flex p-1 rounded-xl text-green-600 font-semibold text-center mt-1">
          <ArrowUpIcon className="text-center p-2" />
          <span className=" px-1">{change}%</span> vs Last month
        </span>
      </div>
    )}
    {children}
  </div>
);

// --- DASHBOARD SECTION COMPONENTS ---

const Header = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { label: "All Time", value: "" },
    { label: "Today", value: "today" },
    { label: "This month", value: "thismonth" },
    { label: "This Year", value: "thisyear" },
    { label: "MTD", value: "mtd" },
    { label: "YTD", value: "ytd" },
  ];

  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>
        <p className="text-zinc-600 mt-1">Here's a review of your activities</p>
      </div>
      <div className="flex items-center space-x-1 bg-zinc-100 p-1 rounded-lg mt-4 sm:mt-0">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onFilterChange && onFilterChange(filter.value)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeFilter === filter.value
              ? "bg-green-500 text-white"
              : "text-zinc-600 hover:bg-zinc-200"
              }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </header>
  );
};
const BinRequestCard = ({
  title = "Bin requests",
  total = 0,
  smartCount = 0,
  nonSmartCount = 0,
  changePercentage = 0,
  changeContext = "Last month",
}) => {
  // Calculate total for the bar chart comparison (using the provided/default counts)
  const barTotal = smartCount + nonSmartCount;

  // Calculate widths for the progress bar segments
  const smartWidth = barTotal > 0 ? (smartCount / barTotal) * 100 : 0;
  // Non-smart width will be 100 - smartWidth, but calculated explicitly for clarity
  const nonSmartWidth = barTotal > 0 ? (nonSmartCount / barTotal) * 100 : 0;

  // Determine if the change is positive or negative (for the arrow and color)
  const isPositiveChange = changePercentage > 0;
  const absChangePercentage = Math.abs(changePercentage);

  // Utility function for thousands separation
  const formatCount = (count) => {
    return count.toLocaleString();
  };

  // Format the total with a comma separator
  const formattedTotal = total.toLocaleString();

  return (
    // Card Wrapper: Set to be responsive - stacked on mobile, side by side on larger screens
    <div className="p-6 sm:p-8 bg-white flex flex-col sm:flex-row justify-between rounded-xl w-full font-inter">
      {/* LEFT COLUMN: Title, Total Value, Percentage Chip */}
      <div className="flex flex-col justify-between space-y-2 w-full sm:w-1/2 mb-4 sm:mb-0 sm:pr-6">
        {/* Title */}
        <h3 className="text-lg  text-gray-700 select-none">{title}</h3>

        {/* Group for Total Value and Change Chip */}
        <div className="flex flex-col space-y-2">
          {/* Total Value - Increased size */}
          <div className="sm:text-3xl font-semibold text-green-700 select-none">
            {formattedTotal}
          </div>

          {/* Percentage Chip */}
          <div className="select-none">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold 
                      ${isPositiveChange
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
                }`}
            >
              {/* Arrow Icon (using Lucide icons as inline SVG fallback) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`mr-1 ${isPositiveChange ? "rotate-0" : "rotate-180"
                  }`}
              >
                {isPositiveChange ? (
                  // Arrow Up
                  <>
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </>
                ) : (
                  // Arrow Down (The existing arrow up is rotated 180deg to represent down)
                  <>
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </>
                )}
              </svg>
              {absChangePercentage}% vs {changeContext}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Progress Bar and Legend/Counts */}
      <div className="flex flex-col w-full sm:w-1/2 sm:pl-6">
        {/* Progress Bar Container */}
        <div className="w-full mb-6">
          <div className="flex h-4 overflow-hidden w-full">
            {/* Smart Segment (Blue) */}
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${smartWidth}%` }}
              title={`Smart: ${formatCount(smartCount)}`}
            ></div>
            {/* Non-Smart Segment (Green) */}
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${nonSmartWidth}%` }}
              title={`Non-Smart: ${formatCount(nonSmartCount)}`}
            ></div>
          </div>
        </div>

        {/* Legend and Counts - Responsive layout */}
        <div className="flex flex-col sm:flex-row sm:space-x-12 text-sm w-full justify-between">
          {/* Smart Legend */}
          <div className="flex flex-col items-center sm:items-end mb-4 sm:mb-0">
            <div className="flex items-center mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-2"></span>
              <span className="text-gray-600 font-medium">Smart</span>
            </div>
            <div className="text-gray-500 font-semibold text-lg">
              {formatCount(smartCount)}
            </div>
          </div>

          {/* Non-Smart Legend */}
          <div className="flex flex-col items-center sm:items-end">
            <div className="flex items-center mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2"></span>
              <span className="text-gray-600 font-medium whitespace-nowrap">
                Non-Smart
              </span>
            </div>
            <div className="text-gray-500 font-semibold text-lg">
              {formatCount(nonSmartCount)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AmountGeneratedcard = ({
  title = "Amount generated",
  total = 0,
  binPurchaseAmount = 0,
  wasteDisposalAmount = 0,
  changePercentage = 0,
  changeContext = "Last month",
}) => {

  // Utility function for formatting currency with Naira symbol (₦)
  const formatCurrency = (amount, compact = false) => {
    if (compact && amount >= 1000) {
      // Simple 'k' notation for thousands, e.g., 850k
      const amountInK = amount / 1000;
      return `₦${amountInK.toLocaleString()}k`;
    }
    // Full formatting for the large total
    return `₦${amount.toLocaleString()}`;
  };

  // Format the total with a comma separator
  const formattedTotal = formatCurrency(total);

  // Format the breakdown amounts using the compact 'k' notation
  const formattedBinPurchase = formatCurrency(binPurchaseAmount, true);
  const formattedWasteDisposal = formatCurrency(wasteDisposalAmount, true);

  // Determine if the change is positive or negative (for the arrow and color)
  const isPositiveChange = changePercentage > 0;
  const absChangePercentage = Math.abs(changePercentage);

  return (
    // Card Wrapper: Set to be responsive - stacked on mobile, side by side on larger screens
    <div className="p-6 bg-white flex flex-col sm:flex-row justify-between items-center rounded-xl w-full font-inter">
      {/* LEFT COLUMN: Title, Total Value, Percentage Chip */}
      <div className="flex flex-col justify-between space-y-4 w-full sm:w-1/2 mb-4 sm:mb-0 sm:pr-6">
        {/* Title */}
        <h3 className="text-lg text-gray-700 select-none">{title}</h3>

        {/* Group for Total Value and Change Chip */}
        <div className="flex flex-col space-y-4">
          {/* Total Value - Updated to use a darker green for contrast */}
          <div className="sm:text-3xl font-semibold text-green-700 select-none">
            {formattedTotal}
          </div>

          {/* Percentage Chip */}
          <div className="select-none">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold 
                        ${isPositiveChange
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
                }`}
            >
              {/* Arrow Icon (using Lucide icons as inline SVG fallback) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`mr-1 ${isPositiveChange ? "rotate-0" : "rotate-180"
                  }`}
              >
                {isPositiveChange ? (
                  // Arrow Up
                  <polyline points="18 15 12 9 6 15"></polyline>
                ) : (
                  // Arrow Down
                  <polyline points="18 15 12 9 6 15"></polyline>
                )}
              </svg>
              {absChangePercentage}% vs {changeContext}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Breakdown Categories (Replacing the progress bar) */}
      {/* Responsive layout - stacked on mobile, side by side on larger screens */}
      <div className="flex flex-col sm:flex-row justify-between sm:justify-end items-center sm:items-end w-full sm:w-1/2 sm:pl-6 space-y-4 sm:space-y-0 gap-4">
        {/* Bin Purchase */}
        <div className="flex flex-col items-center sm:items-end mb-4 sm:mb-0">
          {/* Amount */}
          <div className="sm:text-3xl font-bold text-gray-800 mb-2">
            {formattedBinPurchase}
          </div>
          {/* Label */}
          <div className="text-base text-green-700 font-medium">
            Bin Purchase
          </div>
        </div>

        {/* Waste disposal */}
        <div className="flex flex-col items-center sm:items-end">
          {/* Amount */}
          <div className="sm:text-3xl font-bold text-gray-800 mb-2">
            {formattedWasteDisposal}
          </div>
          {/* Label */}
          <div className="text-base text-green-700 font-medium">
            Waste disposal
          </div>
        </div>
      </div>
    </div>
  );
};

const BinDistributionList = ({ data }) => (
  <div className="bg-white p-6 rounded-lg border border-white flex flex-col justify-center h-full">
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.name} className="flex items-center justify-between">
          <div className="flex items-center">
            <span
              className="w-3 h-3 rounded-full mr-3"
              style={{ backgroundColor: item.color }}
            ></span>
            <span className="text-sm text-zinc-600">{item.name}</span>
          </div>
          <span className="font-semibold text-zinc-800">
            {item.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const UsersByCategory = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const chartData = data.map((item) => ({
    name: item.category,
    value: item.count,
    color: item.color,
  }));

  return (
    <div className="bg-white p-6 rounded-lg border border-white flex flex-col md:flex-row items-center h-full">
      <div className="w-full md:w-1/2 pr-0 md:pr-8">
        <h3 className="text-zinc-600 text-base mb-4">Users by Category</h3>
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.id} className="flex items-start">
              <span
                className="w-1 h-10 mr-4 rounded"
                style={{ backgroundColor: item.color }}
              ></span>
              <div>
                <p className="text-zinc-800 font-medium">{item.category}</p>
                <p className="text-zinc-600 text-sm">
                  {item.count.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full md:w-1/2 h-64 mt-8 md:mt-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={100}
              outerRadius={120}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-zinc-500 text-sm">Total</span>
          <span className="text-3xl font-bold">{total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

const BinRequestStatus = ({ data }) => (
  <div className="bg-white p-6 rounded-lg border border-white h-full">
    <h3 className="text-zinc-600 text-base mb-4">Bin request status</h3>
    <div className="space-y-5">
      {data.map((item) => (
        <div key={item.status} className="flex justify-between items-center">
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full ${item.color}`}
          >
            {item.status}
          </span>
          <span className="font-semibold text-zinc-800">
            {item.count.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---

const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const transformBackendDashboardToDashpageData = (backendDashboard) => {
  // Support both payload-as-root and payload-wrapped-in-data shapes
  const payload = backendDashboard?.data ?? backendDashboard ?? {};

  // Destructure top-level fields
  const registeredUsers = payload.registeredUsers ?? {};
  const binRequests = payload.binRequests ?? {};
  const revenue = payload.revenue ?? {};
  const pspCompanies = payload.pspCompanies ?? {};
  const unpaidBills = payload.unpaidBills ?? {};
  const operationalMetrics = payload.operationalMetrics ?? {}; // Fallback for some fields if not at root

  // 1. Registered Users
  const totalRegisteredUsers = toNumber(
    registeredUsers.totalRegisteredUsers ?? payload.totals?.registeredUsers
  );

  // 2. Bin Requests
  const summary = binRequests.summary ?? {};
  const totalBinRequests = toNumber(summary.total ?? binRequests.totalBinRequests);

  // 3. Revenue
  const totalRevenue = toNumber(revenue.total ?? payload.totals?.totalRevenue);
  const binPurchaseRevenue = toNumber(revenue.binPurchase);
  const wasteDisposalRevenue = toNumber(revenue.wasteDisposal);

  // 4. PSP Revenue
  const pspCompaniesData = pspCompanies.topPSPcompanies ?? [];
  const topPSPcompanies = pspCompaniesData.map(c => ({
    name: c.company_name,
    revenue: toNumber(c.revenue)
  }));
  const revenueByPsp = toNumber(pspCompanies.revenueSummary);

  // 5. Households Enumerated
  const householdsEnumeratedRaw = payload.householdsEnumerated ?? operationalMetrics.householdsEnumerated;
  const householdsEnumeratedCount = toNumber(householdsEnumeratedRaw?.total ?? householdsEnumeratedRaw);
  const householdsByLga = (householdsEnumeratedRaw?.byLga ?? []).map(l => ({
    lgaName: l.lgaName,
    householdsEnumerated: toNumber(l.householdsEnumerated)
  }));

  // 6. Bins Delivered
  const binDeliveredData = payload.binDelivered ?? {};
  const binDeliveredDetails = {
    total: toNumber(binDeliveredData.total),
    smart: toNumber(binDeliveredData.smart),
    nonSmart: toNumber(binDeliveredData.nonSmart),
  };

  // Operational metrics
  const wastePickedUpTotal = toNumber(payload.numberOfWastePickups ?? operationalMetrics.wastePickedUp?.totalWeight);
  const lgasCoveredCount = toNumber(payload.numberOfLgasCovered ?? operationalMetrics.lgasCovered);

  // Unpaid Bills
  const unpaidBillsCount = toNumber(unpaidBills.count ?? operationalMetrics.unpaidBillsCount);
  const unpaidBillsAmount = toNumber(unpaidBills.totalAmount);

  // Bin Distribution (for Row 1 card)
  const byType = binRequests.byType ?? {};
  const binDistribution = [
    { name: "Smart", value: toNumber(byType.smart), color: "#16a34a" },
    { name: "Non-Smart", value: toNumber(byType.nonSmart), color: "#a3a3a3" },
  ];

  // User Categories
  const usersByCategory = [
    { ...initialData.usersByCategory[0], count: toNumber(registeredUsers.residentUsers) },
    { ...initialData.usersByCategory[1], count: toNumber(registeredUsers.agentsUsers) },
    { ...initialData.usersByCategory[2], count: toNumber(registeredUsers.facilityManagers) },
    { ...initialData.usersByCategory[3], count: toNumber(registeredUsers.corporatesUsers) },
  ];

  // Bin Request Status
  const byStatus = binRequests.byStatus ?? {};
  const binRequestStatus = [
    { ...initialData.binRequestStatus[0], count: toNumber(byStatus.pending) },
    { ...initialData.binRequestStatus[1], count: toNumber(byStatus.inventory) },
    { ...initialData.binRequestStatus[2], count: toNumber(byStatus.scheduledForDelivery) },
    { ...initialData.binRequestStatus[3], count: toNumber(byStatus.delivered) },
    { ...initialData.binRequestStatus[4], count: toNumber(byStatus.activated) },
  ];

  return {
    ...initialData,
    kpis: {
      ...initialData.kpis,
      totalRegisteredUsers: { ...initialData.kpis.totalRegisteredUsers, value: totalRegisteredUsers },
      binRequests: { ...initialData.kpis.binRequests, value: totalBinRequests },
      amountGenerated: { ...initialData.kpis.amountGenerated, value: totalRevenue },
      binPurchase: { ...initialData.kpis.binPurchase, value: binPurchaseRevenue },
      wasteDisposal: { ...initialData.kpis.wasteDisposal, value: wasteDisposalRevenue },
      revenueByPsp: { ...initialData.kpis.revenueByPsp, value: revenueByPsp },
      householdsEnumerated: { ...initialData.kpis.householdsEnumerated, value: householdsEnumeratedCount },
      binsDelivered: { ...initialData.kpis.binsDelivered, value: binDeliveredDetails.total },
      wastePickedUp: { ...initialData.kpis.wastePickedUp, value: wastePickedUpTotal },
      lgasCovered: { ...initialData.kpis.lgasCovered, value: lgasCoveredCount },
      unpaidBillsCount: { ...initialData.kpis.unpaidBillsCount, value: unpaidBillsCount },
      unpaidBillsAmount: { ...initialData.kpis.unpaidBillsAmount, value: unpaidBillsAmount },
    },
    binDistribution,
    usersByCategory,
    binRequestStatus,
    topPSPcompanies,
    householdsByLga,
    binDeliveredDetails,
  };
};

export default function App({ backendDashboard, currentFilter, onFilterChange }) {
  const [data, setData] = useState(() =>
    backendDashboard ? transformBackendDashboardToDashpageData(backendDashboard) : null
  );
  const [loading, setLoading] = useState(() => !backendDashboard);

  // Specific selection states for filters
  const [selectedLga, setSelectedLga] = useState("All LGAs");
  const [selectedBinType, setSelectedBinType] = useState("All delivered");
  const [selectedPsp, setSelectedPsp] = useState("All PSPs");

  useEffect(() => {
    if (backendDashboard) {
      setData(transformBackendDashboardToDashpageData(backendDashboard));
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get("/lawma/superadmins/dashboard");
        setData(transformBackendDashboardToDashpageData(response?.data ?? response));
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [backendDashboard]);

  if (loading) {
    return (
      <div className="bg-zinc-100 min-h-screen p-4 sm:p-8">
        <Header activeFilter={currentFilter} onFilterChange={onFilterChange} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!data)
    return (
      <div className="bg-zinc-100 min-h-screen flex items-center justify-center">
        <p>No data available.</p>
      </div>
    );

  const kpis = data.kpis;

  // LGA Filtering logic
  const lgaOptions = ["All LGAs", ...data.householdsByLga.map(l => l.lgaName)];
  const displayedHouseholdsEnumerated = selectedLga === "All LGAs"
    ? kpis.householdsEnumerated.value
    : (data.householdsByLga.find(l => l.lgaName === selectedLga)?.householdsEnumerated ?? 0);

  // Bin Type Filtering logic
  const binTypeOptions = ["All delivered", "Smart", "Non-smart"];
  const displayedBinsDelivered = selectedBinType === "All delivered"
    ? data.binDeliveredDetails.total
    : selectedBinType === "Smart"
      ? data.binDeliveredDetails.smart
      : data.binDeliveredDetails.nonSmart;

  // PSP Filtering logic
  const pspOptions = ["All PSPs", ...data.topPSPcompanies.map(p => p.name)];
  const displayedRevenueByPsp = selectedPsp === "All PSPs"
    ? kpis.revenueByPsp.value
    : (data.topPSPcompanies.find(p => p.name === selectedPsp)?.revenue ?? 0);

  // Extract Smart and Non-Smart counts from binDistribution (for Row 1 card)
  const smartBinCount = data.binDistribution?.find((x) => x.name === "Smart")?.value ?? 0;
  const nonSmartBinCount = data.binDistribution?.find((x) => x.name === "Non-Smart")?.value ?? 0;

  return (
    <div className="bg-zinc-100 min-h-screen p-4 sm:p-8 font-sans text-zinc-800">
      <div className="max-w-screen-2xl mx-auto">
        <Header activeFilter={currentFilter} onFilterChange={onFilterChange} />

        {/* Row 1 */}
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full lg:w-1/4 px-3 mb-6 lg:mb-0">
            <KPICard
              title="Total registered users"
              value={kpis.totalRegisteredUsers.value.toLocaleString()}
              change={kpis.totalRegisteredUsers.change}
            />
          </div>
          <div className="w-full lg:w-3/4 px-3">
            <BinRequestCard
              total={kpis.binRequests.value}
              smartCount={smartBinCount}
              nonSmartCount={nonSmartBinCount}
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full lg:w-2/3 px-3 mb-6 lg:mb-0">
            <AmountGeneratedcard
              total={kpis.amountGenerated.value}
              binPurchaseAmount={kpis.binPurchase.value}
              wasteDisposalAmount={kpis.wasteDisposal.value}
              changePercentage={kpis.amountGenerated.change}
              changeContext="Last month"
            />
          </div>
          <div className="w-full lg:w-1/3 px-3">
            <div className="bg-white p-6 rounded-lg border border-white h-full">
              <div className="flex justify-between items-start">
                <h3 className="text-zinc-600 text-base">
                  Revenue generated by PSPs
                </h3>
                <SelectDropdown
                  label="All PSPs"
                  options={pspOptions}
                  onSelect={setSelectedPsp}
                />
              </div>
              <p className="text-3xl font-semibold text-green-700 mt-2">
                ₦{displayedRevenueByPsp.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Row 3 */}
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full lg:w-1/3 px-3 mb-6 lg:mb-0">
            <div className="bg-white p-6 rounded-lg border border-white h-full">
              <div className="flex justify-between items-start">
                <h3 className="text-zinc-600 text-base">
                  Households enumerated
                </h3>
                <SelectDropdown
                  label="All LGAs"
                  options={lgaOptions}
                  onSelect={setSelectedLga}
                />
              </div>
              <p className="text-3xl font-semibold text-green-700 mt-2">
                {displayedHouseholdsEnumerated.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="w-full lg:w-1/3 px-3 mb-6 lg:mb-0">
            <div className="bg-white p-6 rounded-lg border border-white h-full">
              <div className="flex justify-between items-start">
                <h3 className="text-zinc-600 text-base">Bins delivered</h3>
                <SelectDropdown
                  label="All delivered"
                  options={binTypeOptions}
                  onSelect={setSelectedBinType}
                />
              </div>
              <p className="text-3xl font-semibold text-green-700 mt-2">
                {displayedBinsDelivered.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="w-full lg:w-1/3 px-3">
            <KPICard
              title="Waste picked up"
              value={kpis.wastePickedUp.value.toLocaleString()}
            />
          </div>
        </div>

        {/* Row 4 */}
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full lg:w-2/3 px-3 mb-6 lg:mb-0">
            <UsersByCategory data={data.usersByCategory} />
          </div>
          <div className="w-full lg:w-1/3 px-3">
            <BinRequestStatus data={data.binRequestStatus} />
          </div>
        </div>

        {/* Row 5 */}
        <div className="flex flex-wrap -mx-3">
          <div className="w-full lg:w-1/3 px-3 mb-6 lg:mb-0">
            <KPICard
              title="LGAs covered"
              value={kpis.lgasCovered.value.toLocaleString()}
            />
          </div>
          <div className="w-full lg:w-1/3 px-3 mb-6 lg:mb-0">
            <KPICard
              title="Unpaid Bills"
              value={kpis.unpaidBillsCount.value.toLocaleString()}
            />
          </div>
          <div className="w-full lg:w-1/3 px-3">
            <KPICard
              title="Amount of unpaid bills"
              value={`₦${kpis.unpaidBillsAmount.value.toLocaleString()}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
