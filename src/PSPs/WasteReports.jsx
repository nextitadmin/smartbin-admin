import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/PSPs/Sidebar";
import Topbar from "../components/PSPs/Topbar";
import api from "../api/apiConfig";
import BinDisposalLineChart from "../components/BinDisposalLineChart";


// Dummy data for simulation
const dummyReportData = {
  reports: [
    {
      sn: 1,
      id: "1",
      wasteId: "WST001",
      date: "2025-04-05T10:30:00Z",
      address: "123 Main St, Lagos",
      branch: "Lagos Branch",
      weightKgTon: 150,
      status: "DELIVERED",
    },
    {
      sn: 2,
      id: "2",
      wasteId: "WST002",
      date: "2025-04-06T14:15:00Z",
      address: "456 Park Ave, Abuja",
      branch: "Abuja Branch",
      weightKgTon: 200,
      status: "DELIVERED",
    },
    {
      sn: 3,
      id: "3",
      wasteId: "WST003",
      date: "2025-04-07T09:45:00Z",
      address: "789 Beach Rd, Port Harcourt",
      branch: "Port Harcourt Branch",
      weightKgTon: 175,
      status: "DELIVERED",
    },
    {
      sn: 4,
      id: "4",
      wasteId: "WST004",
      date: "2025-04-08T16:20:00Z",
      address: "101 Hilltop Dr, Enugu",
      branch: "Enugu Branch",
      weightKgTon: 120,
      status: "CANCELLED",
    },
    {
      sn: 5,
      id: "5",
      wasteId: "WST005",
      date: "2025-04-09T11:30:00Z",
      address: "202 Riverside Cres, Kano",
      branch: "Kano Branch",
      weightKgTon: 180,
      status: "DELIVERED",
    },
    {
      sn: 6,
      id: "6",
      wasteId: "WST006",
      date: "2025-04-10T13:45:00Z",
      address: "303 Mountain View, Ibadan",
      branch: "Ibadan Branch",
      weightKgTon: 160,
      status: "DELIVERED",
    },
    {
      sn: 7,
      id: "7",
      wasteId: "WST007",
      date: "2025-04-11T08:30:00Z",
      address: "404 Lakeside Blvd, Benin",
      branch: "Benin Branch",
      weightKgTon: 140,
      status: "DELIVERED",
    },
    {
      sn: 8,
      id: "8",
      wasteId: "WST008",
      date: "2025-04-12T15:15:00Z",
      address: "505 Oceanview St, Calabar",
      branch: "Calabar Branch",
      weightKgTon: 190,
      status: "CANCELLED",
    },
    {
      sn: 9,
      id: "9",
      wasteId: "WST009",
      date: "2025-04-13T10:00:00Z",
      address: "606 Forest Ln, Jos",
      branch: "Jos Branch",
      weightKgTon: 155,
      status: "DELIVERED",
    },
    {
      sn: 10,
      id: "10",
      wasteId: "WST010",
      date: "2025-04-14T12:30:00Z",
      address: "707 Desert Rd, Maiduguri",
      branch: "Maiduguri Branch",
      weightKgTon: 165,
      status: "DELIVERED",
    },
    {
      sn: 11,
      id: "11",
      wasteId: "WST011",
      date: "2025-04-15T14:45:00Z",
      address: "808 Savannah Ave, Sokoto",
      branch: "Sokoto Branch",
      weightKgTon: 170,
      status: "DELIVERED",
    },
    {
      sn: 12,
      id: "12",
      wasteId: "WST012",
      date: "2025-04-16T09:15:00Z",
      address: "909 Jungle St, Uyo",
      branch: "Uyo Branch",
      weightKgTon: 145,
      status: "CANCELLED",
    },
    {
      sn: 13,
      id: "13",
      wasteId: "WST013",
      date: "2025-04-17T11:30:00Z",
      address: "1000 Rainforest Dr, Minna",
      branch: "Minna Branch",
      weightKgTon: 185,
      status: "DELIVERED",
    },
    {
      sn: 14,
      id: "14",
      wasteId: "WST014",
      date: "2025-04-18T13:00:00Z",
      address: "1100 Grassland Rd, Akure",
      branch: "Akure Branch",
      weightKgTon: 150,
      status: "DELIVERED",
    },
    {
      sn: 15,
      id: "15",
      wasteId: "WST015",
      date: "2025-04-19T15:45:00Z",
      address: "1200 Wetland Ave, Owerri",
      branch: "Owerri Branch",
      weightKgTon: 175,
      status: "DELIVERED",
    },
  ],
  chartDetails: [
    { month: "Apr 2025", wasteCount: 15 },
    { month: "May 2025", wasteCount: 18 },
    { month: "Jun 2025", wasteCount: 12 },
  ],
  summary: {
    period: { from: "01/04", to: "30/06" },
    generationDate: "2025-07-15T14:30:00Z",
    title: "Q2 Waste Disposal Report",
    totalDisposed: 45,
    totalWeight: 2450,
  },
};

const WasteReports = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // --- State ---
  const [reports, setReports] = useState([]);
  const [chartDetails, setChartDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("dsc");
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState(null);
  const [summary, setSummary] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 12;

  // Helper function to parse ISO date strings
  const parseISO = (dateString) => {
    return new Date(dateString);
  };

  // Helper function to format date as "MMM yyyy"
  const format = (date, formatString) => {
    if (formatString === "MMM yyyy") {
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
      return `${months[date.getMonth()]} ${date.getFullYear()}`;
    }
    return date.toString(); // fallback
  };

  const formatPeriodArrow = (periodObj) => {
    if (!periodObj || !periodObj.from || !periodObj.to) return "N/A";
    const [fromDay, fromMonth] = periodObj.from.split("/");
    const [toDay, toMonth] = periodObj.to.split("/");
    const fromDate = new Date(
      2025,
      parseInt(fromMonth, 10) - 1,
      parseInt(fromDay, 10),
    ); // Year is arbitrary
    const toDate = new Date(
      2025,
      parseInt(toMonth, 10) - 1,
      parseInt(toDay, 10),
    );
    const fromStr = `${fromDate.toLocaleString("en-US", { month: "short" })} ${fromDay}`;
    const toStr = `${toDate.toLocaleString("en-US", { month: "short" })} ${toDay}`;
    return `${fromStr} - ${toStr}`;
  };

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      if (!id) {
        setReports([]);
        setNotification({
          show: true,
          type: "error",
          message: "No report ID provided.",
        });
        setIsLoading(false);
        return;
      }

      const { data } = await api.get(`/lawma/psp/reports/${id}`);
      if (data.success) {
        const report = data.data.report;
        const pickupArray = report.data.pickups || [];

        // Map pickups to table rows (backend uses wasteId and pickupDate)
        const reportsData = pickupArray.map((item, index) => ({
          sn: index + 1,
          id: item.wasteId || item._id || `${index + 1}`,
          wasteId: item.wasteId || item.transactionReference || item._id || "-",
          date: item.pickupDate || report.startDate,
          address: item.address || "-",
          branch: item.branch || "-",
          weightKgTon: item.weight || 0,
          status: (item.status || "").toString().toUpperCase(),
          assignedTo: item.assignedTo || "-",
        }));
        setReports(reportsData);

        // Use binDisposalAnalytics from backend when available for chart
        const analytics = report.data?.binDisposalAnalytics;
        if (Array.isArray(analytics) && analytics.length > 0) {
          const chartFormattedData = analytics.map((it) => ({
            month: it.month,
            count: Number(it.count) || 0,
          }));
          setChartDetails(chartFormattedData);
        } else {
          // Fallback: compute from pickups
          const monthlyFrequencyMap = {};
          pickupArray.forEach((pickup) => {
            const month = format(
              parseISO(pickup.pickupDate || report.startDate),
              "MMM yyyy",
            );
            monthlyFrequencyMap[month] = (monthlyFrequencyMap[month] || 0) + 1;
          });
          const chartFormattedData = Object.entries(monthlyFrequencyMap)
            .map(([month, wasteCount]) => ({ month, count: wasteCount }))
            .sort((a, b) => new Date(a.month) - new Date(b.month));
          setChartDetails(chartFormattedData);
        }

        // Summary from backend
        setSummary({
          period: report.period || "",
          generationDate: report.createdAt,
          title: report.reportName || "",
          totalDisposed: report.data?.summary?.totalPickups || pickupArray.length,
          totalWeight: report.data?.summary?.totalWeight || pickupArray.reduce((s, it) => s + (it.weight || 0), 0),
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.log("Error is ", error);
      // Fallback to dummy data on error
      setReports(dummyReportData.reports);
      setChartDetails(dummyReportData.chartDetails);
      setSummary(dummyReportData.summary);
      setNotification({
        show: true,
        type: "error",
        message: "Failed to load data. Showing sample data.",
      });
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
    return datePart;
  };

  const formatWeight = (weight) => {
    return `${weight} kg`;
  };

  const clearNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 5000); // Hide after 5 seconds
      return () => clearTimeout(timer); // Cleanup timer on component unmount or notification change
    }
  }, [notification]);
  // --- Computed Properties ---
  const filteredReports = useMemo(() => {
    if (!searchQuery) {
      return reports;
    }
    const lowerQuery = searchQuery.toLowerCase();
    return reports?.filter((report) => {
      return (
        report.wasteId.toLowerCase().includes(lowerQuery) ||
        report.address.toLowerCase().includes(lowerQuery) ||
        report.status.toLowerCase().includes(lowerQuery) ||
        formatDate(report.date).includes(lowerQuery) ||
        report.weightKgTon.toString().includes(lowerQuery)
      );
    });
  }, [reports, searchQuery]);

  const sortedReports = useMemo(() => {
    const items = Array.isArray(filteredReports) ? filteredReports : [];
    return [...items].sort((a, b) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];

      if (sortColumn === "weightKgTon") {
        // Numeric comparison for weights
        valA = Number(valA);
        valB = Number(valB);
      } else if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (sortColumn === "date") {
        const parseDate = (val) => {
          if (val instanceof Date) return val;
          if (typeof val === "string") {
            // Try to detect DD-MM-YY or DD-MM-YYYY
            const ddmmyy = val.match(/^(\d{2})-(\d{2})-(\d{2,4})$/);
            if (ddmmyy) {
              const [, day, month, year] = ddmmyy;
              const fullYear =
                year.length === 2 ? 2000 + parseInt(year) : parseInt(year);
              return new Date(fullYear, parseInt(month) - 1, parseInt(day));
            }
            // Fallback to Date constructor for ISO or browser-parsable formats
            return new Date(val);
          }
          return new Date(0); // fallback invalid date
        };

        const dateA = parseDate(valA);
        const dateB = parseDate(valB);

        valA = dateA.getTime();
        valB = dateB.getTime();
      }

      let comparison = 0;
      if (valA > valB) {
        comparison = 1;
      } else if (valA < valB) {
        comparison = -1;
      }

      return sortDirection === "dsc" ? comparison * -1 : comparison;
    });
  }, [filteredReports, sortColumn, sortDirection]);

  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedReports?.slice(start, end);
  }, [sortedReports, currentPage]);

  const totalPages = useMemo(() => {
    if (sortedReports.length === 0) return 0;
    return Math.ceil(sortedReports.length / itemsPerPage);
  }, [sortedReports]);

  // --- Methods ---
  const sortBy = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "dsc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const sortIcon = (columnKey) => {
    if (sortColumn !== columnKey) return "↕";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-zinc-100 text-zinc-800 border-zinc-300";
    }
  };

  // Placeholder Action Methods
  const filterData = () => {
    console.log("Filter action triggered");
    setNotification({ type: "error", message: "Coming soon.." });
  };

  const exportData = () => {
    console.log("Export action triggered");
    setNotification({ type: "error", message: "Coming soon.." });
  };

  const handleRowAction = (wasteId) => {
    console.log("Row action triggered for ID:", wasteId);
    setNotification({ type: "error", message: "Coming soon.." });
  };

  const formatGenerationDate = (date) => {
    let newDate = new Date(date);
    if (isNaN(newDate.getTime())) return "";
    const day = newDate.getDate();
    const daySuffix = (d) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
    const month = newDate.toLocaleString("en-US", { month: "long" });
    const year = newDate.getFullYear();
    let hours = newDate.getHours();
    const minutes = newDate.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;
    return `${day}${daySuffix(day)} ${month} ${year} | ${hours}:${minutes}${ampm}`;
  };

  const formatPeriodShort = (periodObj) => {
    if (!periodObj || !periodObj.from || !periodObj.to) return "";
    const parseDate = (str) => {
      const parts = str.split("/");
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parts[2] ? parseInt(parts[2], 10) : 2025;
      return new Date(year, month, day);
    };
    const daySuffix = (d) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
    const format = (date) => {
      const day = date.getDate();
      const month = date.toLocaleString("en-US", { month: "short" });
      return `${day}${daySuffix(day)} ${month}`;
    };
    const fromDate = parseDate(periodObj.from);
    const toDate = parseDate(periodObj.to);
    return `${format(fromDate)} & ${format(toDate)}`;
  };

  // --- Skeleton Loader Components ---
  const SkeletonHeader = () => (
    <div className="flex flex-wrap justify-between items-center gap-4 mb-2 animate-pulse">
      <div className="flex flex-col gap-2">
        <div className="h-6 bg-zinc-200 rounded w-48"></div>
        <div className="h-4 bg-zinc-200 rounded w-64"></div>
      </div>
    </div>
  );

  const SkeletonSearchActions = () => (
    <div className="flex lg:flex-row flex-col justify-between gap-4 mb-6 animate-pulse">
      <div className="relative">
        <div className="h-10 bg-zinc-200 rounded w-full lg:w-96"></div>
      </div>
      <div className="flex">
        <div className="h-10 bg-zinc-200 rounded w-20 mx-2"></div>
        <div className="h-10 bg-zinc-200 rounded w-20 mx-2"></div>
      </div>
    </div>
  );

  const SkeletonChart = () => (
    <div className="bg-white rounded-t-2xl border border-zinc-200 flex flex-col pb-20 animate-pulse">
      <div className="w-full flex lg:flex-row flex-col justify-between lg:items-center p-8 lg:p-12">
        <div className="lg:items-center flex flex-col justify-center lg:mb-0 mb-4">
          <div className="h-6 bg-zinc-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-zinc-200 rounded w-32"></div>
        </div>
        <div className="flex llg:flex-row flex-co items-center">
          <div className="h-4 bg-zinc-200 rounded w-64"></div>
        </div>
      </div>

      <section className="flex lg:flex-row flex-col justify-between mt-8">
        <div className="lg:ml-8 flex lg:flex-col space-x-4 flex-row lg:justify-center w-2-9 p-4">
          <div className="flex flex-col py-4">
            <div className="h-12 bg-zinc-200 rounded w-24 mb-2"></div>
            <div className="h-4 bg-zinc-200 rounded w-32"></div>
          </div>
          <div className="flex flex-col py-4">
            <div className="h-12 bg-zinc-200 rounded w-24 mb-2"></div>
            <div className="h-4 bg-zinc-200 rounded w-32"></div>
          </div>
        </div>
        <div className="flex flex-col space-x-3 items-center w-full mt-4 lg:mt-0">
          <div className="h-6 bg-zinc-200 rounded w-80 mb-4"></div>
          <div className="h-64 bg-zinc-200 rounded w-full"></div>
        </div>
      </section>
    </div>
  );

  const SkeletonTable = () => (
    <div className="table-container border border-zinc-200 bg-white rounded-b-2xl p-4 animate-pulse">
      <div className="w-full min-w-[768px]">
        <div className="font-light text-zinc-700 uppercase bg-white h-12 flex items-center">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="px-4 py-3 flex-1">
              <div className="h-4 bg-zinc-200 rounded"></div>
            </div>
          ))}
        </div>
        <div>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 border-b border-zinc-200 flex items-center"
            >
              {[...Array(8)].map((_, j) => (
                <div key={j} className="px-4 py-3 flex-1">
                  <div className="h-4 bg-zinc-200 rounded"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SkeletonPagination = () => (
    <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 animate-pulse">
      <div className="h-4 bg-zinc-200 rounded w-64"></div>
      <div className="flex">
        <div className="h-10 bg-zinc-200 rounded w-12 mr-2"></div>
        <div className="h-10 bg-zinc-200 rounded w-12"></div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex sans h-screen">
        <Sidebar addkey="1" />
        <div className="flex-1 bg-zinc-100 min-h-screen overflow-y-auto">
          <Topbar />
          <div className="bg-zinc-100 font-sans">
            <main className="p-4 md:px-4">
              <div className="p-5 md:p-8 rounded-lg w-full  mx-auto max-w-[93vw]">
                {/* Header */}
                {isLoading ? (
                  <SkeletonHeader />
                ) : (
                  <div className="flex flex-wrap justify-between items-center gap-4 mb-2">
                    <div className="flex items-center gap-4">
                      <button
                      title="Back"
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center px-3 py-2 text-zinc-700 hover:text-green-700"
                      >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                      </button>
                      <div className="flex flex-col gap-2">
                        <h1 className="text-xl md:text-2xl font-semibold text-zinc-800">
                          Waste Reports
                        </h1>
                        <span className="text-zinc-500">
                          Track your waste disposal history
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Search and Actions */}
                {isLoading ? (
                  <SkeletonSearchActions />
                ) : (
                  <div className="flex lg:flex-row flex-col justify-between gap-4 mb-6">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 text-green-700 flex items-center pl-3">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          ></path>
                        </svg>
                      </span>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search reports..."
                        className="w-full lg:w-[24rem] pl-10 pr-4 py-2 border border-zinc-300 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <button
                        onClick={filterData}
                        type="button"
                        className="px-4 lg:mx-4 py-2 border border-zinc-300 text-sm font-medium rounded-xl text-zinc-700 bg-white hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Filter
                      </button>
                      <button
                        onClick={exportData}
                        type="button"
                        className="px-4 py-2 mx-4 border border-zinc-300 lg:mx-0 text-sm font-medium rounded-xl text-zinc-700 bg-white hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Export
                      </button>
                    </div>
                  </div>
                )}

                {/* Chart */}
                {isLoading ? (
                  <SkeletonChart />
                ) : (
                  <div className="bg-white rounded-t-2xl border border-zinc-200 flex flex-col  pb-20 ">
                    <div className=" w-full flex lg:flex-row flex-col justify-between lg:items-center p-8 lg:p-12 ">
                      <div className="lg:items-center flex flex-col justify-center lg:mb-0 mb-4">
                        <p className="flex flex-col">
                          {" "}
                          <span className="text-xl font-semibold capitalize text-zinc-800">
                            {summary.title}
                          </span>{" "}
                          <span className="text-zinc-500">
                            {formatPeriodArrow(summary.period)}
                          </span>
                        </p>
                      </div>
                      <div className=" flex llg:flex-row flex-co  items-center">
                        <p className="flex lg:flex-row flex-col">
                          <span>Date generated: </span>
                          <span>
                            {formatGenerationDate(summary.generationDate)}
                          </span>
                        </p>
                      </div>
                    </div>

                    <section className="flex flex-col items-center justify-center mt-8 w-full">
                      {/* Stats Container */}
                      <div className="flex gap-8 items-center justify-center w-full p-4 text-center">
                        <p className="flex flex-col py-4">
                          <span className="lg:text-5xl text-3xl font-bold text-green-700">
                            {summary.totalDisposed}
                          </span>
                          <span className="uppercase text-zinc-600 font-light">
                            wastes Picked Up
                          </span>
                        </p>
                        <p className="flex flex-col py-4">
                          <span className="lg:text-5xl text-3xl font-bold text-zinc-500">
                            {summary.totalWeight}
                          </span>
                          <span className="uppercase text-zinc-600 font-light">
                            Kg/Tonnes
                          </span>
                        </p>
                      </div>

                      {/* Chart Container */}
                      <div className="flex flex-col items-center justify-center w-full mt-4">
                        <p className="font-bold text-lg mb-4 text-center">
                          {`Waste Disposed between ${formatPeriodShort(summary.period)}`}
                        </p>
                        <div className=" w-full flex justify-center">
                          <BinDisposalLineChart data={chartDetails} />
                        </div>
                      </div>
                    </section>
                  </div>
                )}

                {/* Table */}
                {isLoading ? (
                  <SkeletonTable />
                ) : (
                  <div className="table-container border border-zinc-200 bg-white rounded-b-2xl p-4">
                    <table className="w-full min-w-[768px] text-sm text-left text-zinc-600">
                      <thead className="font-light text-zinc-700 uppercase bg-white">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-3"
                            role="button"
                            onClick={() => sortBy("sn")}
                          >
                            <div className="flex items-center justify-between">
                              S/N{" "}
                              <span
                                className={`sort-icon ${sortColumn === "sn" ? "active" : ""}`}
                              >
                                {sortIcon("sn")}
                              </span>
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3"
                            role="button"
                            onClick={() => sortBy("wasteId")}
                          >
                            <div className="flex items-center justify-between">
                              Waste ID{" "}
                              <span
                                className={`sort-icon ${sortColumn === "wasteId" ? "active" : ""}`}
                              >
                                {sortIcon("wasteId")}
                              </span>
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3"
                            role="button"
                            onClick={() => sortBy("date")}
                          >
                            <div className="flex items-center justify-between">
                              Date{" "}
                              <span
                                className={`sort-icon ${sortColumn === "date" ? "active" : ""}`}
                              >
                                {sortIcon("date")}
                              </span>
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3"
                            role="button"
                            onClick={() => sortBy("branch")}
                          >
                            <div className="flex items-center justify-between">
                              Branch{" "}
                              <span
                                className={`sort-icon ${sortColumn === "branch" ? "active" : ""}`}
                              >
                                {sortIcon("branch")}
                              </span>
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3"
                            role="button"
                            onClick={() => sortBy("address")}
                          >
                            <div className="flex items-center justify-between">
                              Address{" "}
                              <span
                                className={`sort-icon ${sortColumn === "address" ? "active" : ""}`}
                              >
                                {sortIcon("address")}
                              </span>
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3"
                            role="button"
                            onClick={() => sortBy("weightKgTon")}
                          >
                            <div className="flex items-center justify-between">
                              Weight (kg){" "}
                              <span
                                className={`sort-icon ${sortColumn === "weightKgTon" ? "active" : ""}`}
                              >
                                {sortIcon("weightKgTon")}
                              </span>
                            </div>
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3"
                            role="button"
                            onClick={() => sortBy("status")}
                          >
                            <div className="flex items-center justify-between">
                              Status{" "}
                              <span
                                className={`sort-icon ${sortColumn === "status" ? "active" : ""}`}
                              >
                                {sortIcon("status")}
                              </span>
                            </div>
                          </th>
                          <th scope="col" className="pl-6 py-3 text-left">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedReports?.length === 0 ? (
                          <tr>
                            <td
                              colSpan="7"
                              className="text-center py-10 text-zinc-500"
                            >
                              No reports found.
                            </td>
                          </tr>
                        ) : (
                          paginatedReports?.map((report) => (
                            <tr
                              key={report.wasteId + report.sn}
                              className="bg-white border-b border-zinc-200 hover:bg-zinc-50 lg:h-20  last:border-0"
                            >
                              <td className="px-4 py-3 font-medium text-zinc-900">
                                {report.sn}
                              </td>
                              <td className="px-4 py-3 font-medium text-zinc-900 whitespace-nowrap">
                                {report.wasteId}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                {formatDate(report.date)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                {report.branch}
                              </td>
                              <td className="px-4 py-3">{report.address}</td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                {formatWeight(report.weightKgTon)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span
                                  className={`px-3 py-1 border rounded-full text-xs font-medium inline-block ${getStatusClass(report.status)}`}
                                >
                                  {report.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-left">
                                <button
                                  onClick={() =>
                                    handleRowAction(report.wasteId)
                                  }
                                  type="button"
                                  className="p-1 text-zinc-500 hover:text-zinc-700 flex flex-row"
                                >
                                  <svg
                                    className="h-4 w-4 "
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                                      stroke="#007836"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M7 10L12 15L17 10"
                                      stroke="#007836"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M12 15V3"
                                      stroke="#007836"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                  <span className="px-4 text-green-700">
                                    Download
                                  </span>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                {isLoading ? (
                  <SkeletonPagination />
                ) : (
                  <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
                    <span className="text-sm text-zinc-700">
                      Page <span className="font-semibold">{currentPage}</span>{" "}
                      of <span className="font-semibold">{totalPages}</span>
                      <span className="mx-2">|</span>
                      Total{" "}
                      <span className="font-semibold">
                        {reports.length}
                      </span>{" "}
                      items
                    </span>
                    <div
                      className="inline-flex rounded-md shadow-sm -space-x-px"
                      role="group"
                    >
                      <button
                        onClick={() => changePage(currentPage - 1)}
                        disabled={currentPage === 1}
                        type="button"
                        className="px-3 mr-4 py-2 text-sm font-medium text-zinc-500 bg-white border border-zinc-300 hover:bg-zinc-100 focus:z-10 focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => changePage(currentPage + 1)}
                        disabled={
                          currentPage === totalPages || totalPages === 0
                        }
                        type="button"
                        className="px-3 py-2 text-sm font-medium text-zinc-50 bg-green-700 border border-zinc-300 hover:bg-green-600 focus:z-10 focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {notification && (
                <div
                  // Using fixed positioning to overlay on the page
                  className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg max-w-sm z-50 ${
                    notification.type === "success"
                      ? "bg-green-100 border border-green-400 text-green-800"
                      : "bg-red-100 border border-red-400 text-red-800"
                  }`}
                  // ARIA roles for accessibility
                  role={notification.type === "error" ? "alert" : "status"}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      {notification.message}
                    </p>
                    {/* Close button for the notification */}
                    <button
                      onClick={clearNotification}
                      className={`ml-4 text-xl font-semibold leading-none ${notification.type === "success" ? "text-green-800 hover:text-green-900" : "text-red-800 hover:text-red-900"} focus:outline-none`}
                      aria-label="Close notification"
                    >
                      &times; {/* Unicode multiplication sign for 'x' */}
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteReports;
