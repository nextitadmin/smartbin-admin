import React, { useMemo, useRef, useState, useEffect } from "react";
import api from "../api/apiConfig";
// Using the installed 'recharts' library
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "../components/SuperAdmin/Sidebar";
import Topbar from "../components/SuperAdmin/Topbar";
import PaymentDetailsTable from "../components/SuperAdmin/PaymentDetailsTable";
import RevenueSkeletonLoader from "../components/SuperAdmin/RevenueSkeletonLoader";

// --- Mock Data ---
// All data needed for the UI is collected in this section
const mockRevenueData = {
  totalGenerated: "70,900,000",
  revenueSources: [
    {
      name: "Smart Bin Application",
      amount: "8,000,000",
      transactions: "10,000",
    },
    { name: "Waste Disposal", amount: "8,000,000", transactions: "800" },
  ],
  totalRevenue: {
    amount: "400,000,000.00",
    change: "+2.6%",
    changeType: "increase",
  },
  monthlyRevenue: [
    { name: "Jan", revenue: 10 },
    { name: "Feb", revenue: 5 },
    { name: "Mar", revenue: 15 },
    { name: "Apr", revenue: 10 },
    { name: "May", revenue: 30 },
    { name: "Jun", revenue: 40 },
    { name: "Jul", revenue: 30 },
    { name: "Aug", revenue: 50 },
    { name: "Sep", revenue: 45 },
    { name: "Oct", revenue: 25 },
    { name: "Nov", revenue: 25 },
    { name: "Dec", revenue: 35 },
  ],
  yearlyRevenue: [],
};

// --- SVG Icons ---
import { ChevronDownIcon, ArrowUpIcon, ArrowDownIcon } from "../components/icons";

// --- Background for the main card ---
const GreenCardBackground = () => (
  <div className="absolute inset-0 opacity-20 overflow-hidden rounded-xl">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern
          id="pattern"
          patternUnits="userSpaceOnUse"
          width="50"
          height="50"
          patternTransform="scale(2) rotate(45)"
        >
          <path d="M 12.5,0 L 25,12.5 L 12.5,25 L 0,12.5 Z" fill="#007836" />
          <path d="M 37.5,0 L 50,12.5 L 37.5,25 L 25,12.5 Z" fill="#007836" />
          <path d="M 12.5,25 L 25,37.5 L 12.5,50 L 0,37.5 Z" fill="#007836" />
          <path d="M 37.5,25 L 50,37.5 L 37.5,50 L 25,37.5 Z" fill="#007836" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pattern)" />
    </svg>
  </div>
);

// Helper function to convert month number to month name
const getMonthName = (monthNumber) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[monthNumber - 1] || "Unknown";
};



const toNumber = (value) => {
  if (typeof value === "number") return value;
  if (value == null) return 0;
  const cleaned = String(value).replace(/₦/g, "").replace(/,/g, "").trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};

const formatNaira = (value) => {
  const n = toNumber(value);
  return n.toLocaleString();
};

const formatYAxisTick = (value) => {
  const n = toNumber(value);
  // Prefer compact for big numbers so ticks don't overlap; fall back to comma formatting.
  try {
    const compact = new Intl.NumberFormat("en-NG", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(n);
    return `₦${compact}`;
  } catch {
    return `₦${n.toLocaleString()}`;
  }
};

const buildMonthlyRevenue = (raw, yearOverride) => {
  const rows = Array.isArray(raw) ? raw : [];

  // If the API returns multiple years, pick the latest year available.
  const years = rows
    .map((item) => item?._id?.year ?? item?.year)
    .map((y) => (y == null ? null : Number(y)))
    .filter((y) => Number.isFinite(y));
  const inferredLatestYear = years.length ? Math.max(...years) : new Date().getFullYear();
  const selectedYear = yearOverride ?? inferredLatestYear;

  const byMonth = new Map(); 
  for (const item of rows) {
    const month =
      item?._id?.month ??
      item?.month ??
      item?.monthNumber ??
      item?.Month ??
      item?.MONTH;
    const year = item?._id?.year ?? item?.year ?? selectedYear;
    if (Number(year) !== selectedYear) continue;

    const monthNum = Number(month);
    if (!Number.isFinite(monthNum) || monthNum < 1 || monthNum > 12) continue;

    const total =
      item?.total ?? item?.revenue ?? item?.amount ?? item?.value ?? item?.sum ?? 0;
    const prev = byMonth.get(monthNum) ?? 0;
    byMonth.set(monthNum, prev + toNumber(total));
  }

  // Always return Jan–Dec so the chart is stable even when months are missing.
  return Array.from({ length: 12 }, (_, i) => {
    const monthNum = i + 1;
    return {
      name: getMonthName(monthNum),
      revenue: byMonth.get(monthNum) ?? 0,
      year: selectedYear,
      month: monthNum,
    };
  });
};

const normalizePSPRevenueRow = (item, index) => ({
  id: item?.pspId ?? item?.id ?? index + 1,
  psp_company:
    item?.psp_company ??
    item?.pspCompany ??
    item?.pspCompany ??
    item?.pspCompanyName ??
    item?.companyName ??
    item?.psp?.companyName ??
    "—",
  lcda: item?.lcda ?? item?.lga ?? item?.lgaName ?? item?.lcdaName ?? "—",
  household_covered:
    toNumber(
      item?.household_covered ??
        item?.householdCovered ??
        item?.householdsCovered ??
        item?.households ??
        item?.householdCount
    ) || 0,
  revenue: toNumber(item?.revenue ?? item?.totalRevenue ?? item?.amountGenerated ?? item?.amount),
  outStandingBill: toNumber(
    item?.outStandingBill ??
      item?.outstandingBill ??
      item?.outstandingBills ??
      item?.bills ??
      item?.bill ??
      item?.totalBill
  ),
});

// --- Chart Components ---
const CustomTooltip = ({ active, payload, label, yearOverride }) => {
  if (active && payload && payload.length) {
    const year =
      payload?.[0]?.payload?.year ??
      payload?.[0]?.payload?._id?.year ??
      yearOverride ??
      new Date().getFullYear();
    return (
      <div className="bg-zinc-800 text-white p-3 rounded-md shadow-lg">
        <p className="font-bold text-lg">{`₦${payload[0].value.toLocaleString()}`}</p>
        <p className="text-sm text-zinc-300">{label} {year}</p>
      </div>
    );
  }
  return null;
};

const RevenueLineChart = ({ data, selectedYear }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#E5E7EB"
        />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#6B7280" }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#6B7280" }}
          tickFormatter={formatYAxisTick}
          allowDecimals={false}
          domain={[0, "auto"]}
          width={90}
        />
        <Tooltip
          content={<CustomTooltip yearOverride={selectedYear} />}
          cursor={{
            stroke: "rgba(251, 146, 60, 0.5)",
            strokeWidth: 2,
            strokeDasharray: "3 3",
          }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#F97316"
          strokeWidth={3}
          dot={{ r: 4, fill: "#F97316" }}
          activeDot={{ r: 8, stroke: "white", strokeWidth: 2, fill: "#F97316" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// --- Main App Component ---
export default function Revenue() {
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isYearMenuOpen, setIsYearMenuOpen] = useState(false);
  const yearMenuRef = useRef(null);

  useEffect(() => {
    if (!isYearMenuOpen) return;
    const onMouseDown = (e) => {
      const el = yearMenuRef.current;
      if (!el) return;
      if (!el.contains(e.target)) setIsYearMenuOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [isYearMenuOpen]);

  // API call to fetch revenue data
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/lawma/superadmins/revenue-analysis", {
          params: { year: selectedYear },
        });

        const data = response.data ?? {};

        const totalGeneratedRaw = data.totalAmountGeneratedOvertime ?? 0;
        const smartBinSuppliers = data.smartBinSuppliers ?? {};
        const pspCompanies = data.pspCompanies ?? {};

        const totalRevenue = data.totalRevenue ?? {};
        const apiYear = totalRevenue.year ?? selectedYear ?? currentYear;
        const percentageChange = toNumber(totalRevenue.percentageChange ?? 0);
        const changePrefix = percentageChange > 0 ? "+" : "";

        const monthlyBreakdown = Array.isArray(totalRevenue.monthlyBreakdown)
          ? totalRevenue.monthlyBreakdown
          : [];

        const monthlyRevenue = monthlyBreakdown.map((m) => ({
          name: m?.month ?? "—",
          revenue: toNumber(m?.total ?? 0),
          year: apiYear,
        }));

        const pspRevenueRows = Array.isArray(data.pspRevenue?.pspRevenue)
          ? data.pspRevenue.pspRevenue.map(normalizePSPRevenueRow)
          : [];

        const transformedData = {
          totalGenerated: toNumber(totalGeneratedRaw),
          revenueSources: [
            {
              name: "Smart Bin Suppliers",
              amount: toNumber(smartBinSuppliers.revenue ?? 0),
              transactions: smartBinSuppliers.totalTransactions ?? "0",
            },
            {
              name: "PSP Companies",
              amount: toNumber(pspCompanies.revenue ?? 0),
              transactions: pspCompanies.totalTransactions ?? "0",
            },
          ],
          totalRevenue: {
            amount: toNumber(totalRevenue.amount ?? 0),
            percentageChange,
            change: `${changePrefix}${percentageChange}%`,
            changeType: percentageChange >= 0 ? "increase" : "decrease",
            comparisonText: totalRevenue.comparisonText ?? "vs Last Year",
            year: apiYear,
          },
          monthlyRevenue,
          // Keep raw available if needed later
          yearlyRevenue: monthlyBreakdown,
          pspRevenue: pspRevenueRows,
        };

        setRevenueData(transformedData);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        // Fallback to mock data in case of error
        const fallbackYearlyRevenue =
          mockRevenueData.yearlyRevenue?.length
            ? mockRevenueData.yearlyRevenue
            : mockRevenueData.monthlyRevenue.map((m, idx) => ({
                _id: { month: idx + 1, year: currentYear },
                total: toNumber(m.revenue),
              }));

        setRevenueData({
          ...mockRevenueData,
          totalGenerated: toNumber(mockRevenueData.totalGenerated),
          revenueSources: (mockRevenueData.revenueSources ?? []).map((s) => ({
            ...s,
            amount: toNumber(s.amount),
          })),
          totalRevenue: {
            ...mockRevenueData.totalRevenue,
            amount: toNumber(mockRevenueData.totalRevenue?.amount),
            percentageChange: 0,
            comparisonText: "vs Last Year",
            year: currentYear,
          },
          yearlyRevenue: fallbackYearlyRevenue,
          monthlyRevenue: buildMonthlyRevenue(fallbackYearlyRevenue, currentYear),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [currentYear, selectedYear]);

  const chartData = useMemo(() => revenueData?.monthlyRevenue ?? [], [revenueData]);

  const yearLabel =
    selectedYear === currentYear
      ? "This year"
      : selectedYear === currentYear - 1
        ? "Last year"
        : String(selectedYear);

  const pctChange = revenueData?.totalRevenue?.percentageChange ?? 0;
  const isIncrease = pctChange > 0;
  const isDecrease = pctChange < 0;
  const changeColorClass = isIncrease
    ? "text-green-600"
    : isDecrease
      ? "text-red-600"
      : "text-zinc-500";

  if (loading) {
    return <RevenueSkeletonLoader />;
  }

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-8xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-zinc-900">
                Revenue overview
              </h1>
              <p className="text-zinc-500 mt-1">Track your review here</p>
            </header>

            <main className="space-y-8">
              {/* Top Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="md:col-span-2 lg:col-span-1 bg-green-700 text-white rounded-xl shadow-md p-6 relative flex flex-col justify-center">
                  <GreenCardBackground />
                  <div className="relative z-10">
                    <p className="lg:text-lg text-base opacity-90">
                      Total amount generated overtime
                    </p>
                    <p className="lg:text-4xl text-2xl font-extrabold mt-2">
                      ₦ {formatNaira(revenueData.totalGenerated)}
                    </p>
                  </div>
                </div>
                {revenueData.revenueSources.map((source, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm p-6 flex flex-col justify-between"
                  >
                    <div>
                      <p className="font-semibold text-zinc-800">{source.name}</p>
                      <p className="text-2xl font-bold text-green-700 my-3">
                        ₦{formatNaira(source.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Chart Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-zinc-800">
                      Total revenue
                    </h2>
                    <div className="flex items-baseline space-x-3 mt-1">
                      <p className="text-3xl font-bold text-zinc-900">
                        ₦{formatNaira(revenueData.totalRevenue.amount)}
                      </p>
                      <div className={`flex items-center text-sm font-semibold ${changeColorClass}`}>
                        {isIncrease ? (
                          <ArrowUpIcon className="h-4 w-4" />
                        ) : isDecrease ? (
                          <ArrowDownIcon className="h-4 w-4" />
                        ) : null}
                        <span>
                          {revenueData.totalRevenue.change}{" "}
                          {revenueData.totalRevenue.comparisonText ?? "vs Last Year"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-4 sm:mt-0" ref={yearMenuRef}>
                    <button
                      type="button"
                      onClick={() => setIsYearMenuOpen((v) => !v)}
                      className="flex items-center px-4 py-2 border border-zinc-300 rounded-lg text-zinc-700 bg-white hover:bg-zinc-50 transition"
                      aria-haspopup="menu"
                      aria-expanded={isYearMenuOpen}
                    >
                      {yearLabel} <ChevronDownIcon />
                    </button>

                    {isYearMenuOpen && (
                      <div
                        role="menu"
                        className="absolute right-0 mt-2 w-44 bg-white border border-zinc-200 rounded-lg shadow-lg overflow-hidden z-10"
                      >
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setSelectedYear(currentYear);
                            setIsYearMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-zinc-50 ${
                            selectedYear === currentYear ? "font-semibold text-zinc-900" : "text-zinc-700"
                          }`}
                        >
                          This year
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            setSelectedYear(currentYear - 1);
                            setIsYearMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-zinc-50 ${
                            selectedYear === currentYear - 1
                              ? "font-semibold text-zinc-900"
                              : "text-zinc-700"
                          }`}
                        >
                          Last year
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <RevenueLineChart data={chartData} selectedYear={selectedYear} />
                </div>
              </div>

              {/* Payment Details Table */}
              <PaymentDetailsTable
                pspRevenue={revenueData.pspRevenue || []}
              />
            </main>
          </div>
        </main>
      </div>
    </div>
  );
}
