import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Sidebar from "../components/LawmaAdmin/Sidebar";
import Topbar from "../components/LawmaAdmin/Topbar";
import { ReceiptIcon, ReceiptTextIcon, PackageDeliveredIcon } from "../components/icons";
import api from "../api/apiConfig";

//––––––––––––––––––––––––––––––––––––––––––––––––––
// MOCK DATA (Replace with your API calls)
//––––––––––––––––––––––––––––––––––––––––––––––––––
const mockDashboardData = {
  stats: [
    { title: "Smart Bin Requests", value: 500000, icon: <ReceiptIcon /> },
    {
      title: "Pending Smart Bin Requests",
      value: 400000,
      icon: <ReceiptTextIcon />,
    },
    { title: "Completed Smart Bin Requests", value: 400000, icon: <PackageDeliveredIcon /> },
  ],
  revenue: {
    total: 40000000000,
    change: 2.6,
    // Note: Recharts data values are just for chart shape, not the displayed total.
    data: [
      { name: "Jan", revenue: 10 },
      { name: "Feb", revenue: 15 },
      { name: "Mar", revenue: 12 },
      { name: "Apr", revenue: 30 },
      { name: "May", revenue: 40 },
      { name: "Jun", revenue: 30 },
      { name: "Jul", revenue: 35 },
      { name: "Aug", revenue: 50 },
      { name: "Sep", revenue: 45 },
      { name: "Oct", revenue: 25 },
      { name: "Nov", revenue: 25 },
      { name: "Dec", revenue: 35 },
    ],
  },
  users: {
    total: 1200000,
    distribution: [
      // Colors are chosen to match the screenshot
      {
        name: "Resident users",
        value: 983998,
        percentage: 20,
        color: "#27AE60",
      }, // approx. orange-500
      { name: "Agents", value: 983998, percentage: 30, color: "#ED7C0D" }, // approx. indigo-600
      {
        name: "Facility Managers",
        value: 200839,
        percentage: 30,
        color: "#625ED7",
      }, // approx. indigo-500
      {
        name: "Corporate users",
        value: 200839,
        percentage: 20,
        color: "#452A74",
      }, // approx. orange-600
    ],
  },
  psp: {
    total: 120,
    top: [
      { name: "Eze sons and kids limited", staff: 50 },
      { name: "Opulent Gsp Properties And Resources", staff: 80 },
      { name: "Abass cleaning Intl", staff: 200 },
      { name: "Sonika International Limited", staff: 15 },
    ],
  },
};

// Dashboard endpoint for Lawma Admin Overview
const DASHBOARD_ENDPOINT = "/lawma/superadmins/admin-dashboard";

const toNumber = (value) => {
  if (typeof value === "number") return value;
  if (value == null) return 0;
  const cleaned = String(value).replace(/₦/g, "").replace(/,/g, "").trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};

// Formats Y-Axis large numbers (e.g., 40B, 500M)
const formatYAxis = (value) => {
  if (value >= 1_000_000_000) return `₦${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(1)}M`;
  return `₦${value.toLocaleString()}`;
};

const transformDashboardResponse = (raw) => {
  const data = raw?.data ?? raw ?? {};

  // =============================
  // SMART BIN REQUESTS
  // =============================
  const smartBinRequests = toNumber(data?.binRequests?.total);
  const pendingRequests = toNumber(data?.binRequests?.pending);
  const completedRequests = toNumber(data?.binRequests?.completed);

  // =============================
  // REVENUE
  // =============================
  const revenueTotal = toNumber(data?.revenue?.total);

  // annualGrowth comes like "-100.00%"
  const revenueChange = toNumber(
    String(data?.revenue?.annualGrowth || "").replace("%", "")
  );

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const monthly = Array.isArray(data?.revenue?.monthlyRevenue)
    ? data.revenue.monthlyRevenue.map((value, i) => ({
      name: months[i],
      revenue: toNumber(value),
    }))
    : mockDashboardData.revenue.data;

  // =============================
  // USERS
  // =============================
  const totalUsers = toNumber(data?.registeredUsers?.total);

  const userDistribution = data?.registeredUsers
    ? [
      {
        name: "Resident users",
        value: toNumber(data.registeredUsers.resident),
        percentage: toNumber(
          data.registeredUsers.percentageByUserType?.resident
        ),
        color: "#27AE60",
      },
      {
        name: "Agents",
        value: toNumber(data.registeredUsers.agent),
        percentage: toNumber(
          data.registeredUsers.percentageByUserType?.agent
        ),
        color: "#ED7C0D",
      },
      {
        name: "Facility Managers",
        value: toNumber(data.registeredUsers.facilityManager),
        percentage: toNumber(
          data.registeredUsers.percentageByUserType?.facilityManager
        ),
        color: "#625ED7",
      },
      {
        name: "Corporate users",
        value: toNumber(data.registeredUsers.corporate),
        percentage: toNumber(
          data.registeredUsers.percentageByUserType?.corporate
        ),
        color: "#452A74",
      },
    ]
    : mockDashboardData.users.distribution;

  // =============================
  // PSP COMPANIES
  // =============================
  const totalPsp = toNumber(data?.psp?.total);

  const topPsp = Array.isArray(data?.psp?.topCompanies)
    ? data.psp.topCompanies.map((p) => ({
      name: p.company_name,
      staff: toNumber(p.teamMembersCount),
    }))
    : mockDashboardData.psp.top;

  // =============================
  // RETURN FINAL STRUCTURE
  // =============================
  return {
    stats: [
      {
        title: "Smart Bin Requests",
        value: smartBinRequests,
        icon: <ReceiptIcon />,
      },
      {
        title: "Pending Smart Bin Requests",
        value: pendingRequests,
        icon: <ReceiptTextIcon />,
      },
      {
        title: "Completed Smart Bin Requests",
        value: completedRequests,
        icon: <PackageDeliveredIcon />,
      },
    ],

    revenue: {
      total: revenueTotal,
      change: revenueChange,
      data: monthly,
    },

    users: {
      total: totalUsers,
      distribution: userDistribution,
    },

    psp: {
      total: totalPsp,
      top: topPsp,
    },
  };
};


const ArrowUp = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"></line>
    <polyline points="5 12 12 5 19 12"></polyline>
  </svg>
);

const ArrowDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <polyline points="19 12 12 19 5 12"></polyline>
  </svg>
);

//––––––––––––––––––––––––––––––––––––––––––––––––––
// HELPER COMPONENTS & ICONS
//––––––––––––––––––––––––––––––––––––––––––––––––––

// You can replace these with an icon library like react-icons if you prefer
const ListIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    />
  </svg>
);
const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// Custom Tooltip for the line chart to match the screenshot's style
const CustomTooltip = ({ active, payload, label, selectedYear }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-800 text-white p-3 rounded-lg shadow-lg">
        <p className="font-bold text-lg">
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0,
          }).format(payload[0].value)}
        </p>
        {/* Now uses the selectedYear from props */}
        <p className="text-sm text-zinc-300">{`${label} ${selectedYear}`}</p>
      </div>
    );
  }
  return null;
};

//––––––––––––––––––––––––––––––––––––––––––––––––––
// MAIN DASHBOARD COMPONENT
//––––––––––––––––––––––––––––––––––––––––––––––––––
export default function DashboardPage() {
  const numberFormatter = new Intl.NumberFormat("en-US");
  const currencyFormatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  });

  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;




  // const getIcon = (iconName) => {
  //   switch (iconName) {
  //     case "list":
  //       return <ListIcon />;
  //     case "clock":
  //       return <ClockIcon />;
  //     case "check":
  //       return <CheckIcon />;
  //     default:
  //       return null;
  //   }
  // };

  const [dashboardData, setDashboardData] = useState(mockDashboardData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const revenueChange = dashboardData.revenue.change;

  const isPositive = revenueChange > 0;
  const isNegative = revenueChange < 0;

  const revenueColorClass = isPositive
    ? "text-green-600 bg-green-200"
    : isNegative
      ? "text-red-600 bg-red-200"
      : "text-zinc-600 bg-zinc-200";

  const fetchDashboardData = async (year) => {
    if (!DASHBOARD_ENDPOINT) {
      setDashboardData(mockDashboardData);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await api.get(`${DASHBOARD_ENDPOINT}?year=${year}`);
      setDashboardData(transformDashboardResponse(response?.data));
    } catch (e) {
      console.error("Error fetching dashboard data:", e);
      setError(e?.response?.data?.message || e?.message || "Failed to load dashboard data.");
      setDashboardData(mockDashboardData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(selectedYear);
  }, [selectedYear]);

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="bg-zinc-100 min-h-screen w-full p-4 sm:p-6 lg:p-8">
          <div className=" mx-auto">
            {/* Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-zinc-800">Dashboard</h1>
              <p className="text-zinc-600 mt-1">
                Here's a review of your activities
              </p>
            </header>

            <main className="flex flex-col gap-6">
              {error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
                  {error}
                </div>
              ) : null}

              {loading ? (
                <div className="flex justify-center items-center">
                  <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-700 rounded-full animate-spin"></div>
                </div>
              ) : null}
              {/* Top Stats Cards */}
              <section className="flex flex-col md:flex-row gap-6 flex-wrap">
                {dashboardData.stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 flex-1 flex items-start gap-4"
                  >
                    <div
                      className={`p-1 rounded-full ${index === 0
                        ? "bg-green-800 text-green-600"
                        : " text-zinc-600"
                        }`}
                    >
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-zinc-500">{stat.title}</p>
                      <p className="text-xl md:text-3xl font-bold text-green-700">
                        {numberFormatter.format(stat.value)}
                      </p>
                    </div>
                  </div>
                ))}
              </section>

              {/* Revenue Chart */}
              <section className="bg-white rounded-xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <div>
                    <h2 className="text-zinc-500">Total revenue</h2>
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <p className="text-xl md:text-2xl font-bold text-zinc-800">
                        {currencyFormatter.format(
                          dashboardData.revenue.total
                        )}
                      </p>
                      {/* <div className="flex items-baseline gap-3 flex-wrap text-sm">

                      <span className="font-semibold text-green-600 bg-green-200 rounded-sm p-1">
                        {dashboardData.revenue.change >= 0 ? "+" : ""} {dashboardData.revenue.change}%
                      </span>
                      <span className="font-bold">
                        vs LastYear
                      </span>
                      </div> */}
                      <div className="flex items-baseline gap-3 flex-wrap text-sm">

                        <span
                          className={`text-xs rounded-sm p-1 flex items-center gap-1 ${revenueColorClass}`}
                        >
                          {isPositive && <ArrowUp />}
                          {isNegative && <ArrowDown />}

                          {revenueChange > 0 ? "+" : ""}
                          {revenueChange}%
                        </span>

                        <span className="">
                          vs LastYear
                        </span>

                      </div>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="border border-zinc-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer bg-white"
                    >
                      <option value={currentYear}>This year</option>
                      <option value={lastYear}>Last year</option>
                    </select>
                  </div>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">

                    <LineChart
                      data={dashboardData.revenue.data}
                      // Added left margin to give labels room
                      margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                    >
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#71717a", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tickFormatter={formatYAxis} // Uses our new formatter
                        tick={{ fill: "#71717a", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        width={80} // Gives space for "₦40.0B"
                      />
                      <Tooltip
                        content={<CustomTooltip selectedYear={selectedYear} />}
                        cursor={{
                          stroke: "#a1a1aa",
                          strokeWidth: 1,
                          strokeDasharray: "3 3",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#FF8E1E"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#FF8E1E" }}
                        activeDot={{
                          r: 8,
                          stroke: "white",
                          strokeWidth: 2,
                          fill: "#FF8E1E",
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              {/* Bottom Section: User Stats and PSP Companies */}
              <section className="flex flex-col lg:flex-row gap-6">
                {/* User Stats */}
                <div className="bg-white rounded-xl p-6 lg:w-3/5">
                  <h2 className="text-xl font-bold text-zinc-800">
                    Total registered Users
                  </h2>
                  <p className="text-xl md:text-3xl font-bold text-zinc-800 mb-4">
                    {numberFormatter.format(dashboardData.users.total)}
                  </p>
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-60 h-60 flex-shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={dashboardData.users.distribution}
                            cx="50%"
                            cy="50%"
                            dataKey="percentage"
                            nameKey="name"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={0}
                          >
                            {dashboardData.users.distribution.map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                  stroke={entry.color}
                                />
                              )
                            )}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 w-full">
                      <ul className="flex flex-col gap-3">
                        {dashboardData.users.distribution.map(
                          (user, index) => (
                            <li
                              key={index}
                              className="flex flex-wrap justify-between items-center w-full gap-2"
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className="h-3 w-3 rounded-full"
                                  style={{ backgroundColor: user.color }}
                                ></span>
                                <span className="text-zinc-600 text-sm">
                                  {user.name}
                                </span>
                              </div>
                              <div className="flex items-baseline gap-2">
                                <span className="font-bold text-zinc-800 text-sm">
                                  {numberFormatter.format(user.value)}
                                </span>
                                <span className="text-zinc-500 text-xs">
                                  ({user.percentage}%)
                                </span>
                              </div>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* PSP Companies */}
                <div className="bg-white rounded-xl p-6 lg:w-2/5">
                  <div className="flex justify-between items-center py-6 mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-zinc-800">
                        Registered PSP companies
                      </h2>
                      <p className="text-xl md:text-3xl font-bold text-zinc-800">
                        {dashboardData.psp.total}
                      </p>
                    </div>

                  </div>
                  <div className="flex justify-between items-center py-3 mb-4">
                    <p className="text-zinc-600 font-semibold mb-3">
                      Top PSP Companies
                    </p>

                    <a
                      href="#"
                      className="text-sm font-semibold text-green-600 underline"
                    >
                      View all
                    </a>
                  </div>

                  <ul className="flex flex-col gap-4">
                    {dashboardData.psp.top.map((company, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center pb-2 border-b border-zinc-200 last:border-b-0"
                      >
                        <span className="text-zinc-800 text-sm pr-2">
                          {company.name}
                        </span>
                        <span className="text-zinc-500 text-sm flex-shrink-0">
                          {company.staff} staff
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </main>
          </div>
        </main>
      </div>
    </div>
  );
}
