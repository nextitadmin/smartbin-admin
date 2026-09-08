import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Papa from "papaparse";

import api from "../api/apiConfig";
import Sidebar from "../components/SuperAdmin/Sidebar";
import Topbar from "../components/SuperAdmin/Topbar";

import { ExportIcon, SearchIcon, ChevronLeftIcon, ChevronRightIcon } from "../components/icons";

const toNumber = (value) => {
  if (typeof value === "number") return value;
  if (value == null) return 0;
  const cleaned = String(value).replace(/₦/g, "").replace(/,/g, "").trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};

const formatNaira = (value) => `₦${toNumber(value).toLocaleString()}`;

const normalizePSPRevenueRow = (item, index) => ({
  id: item?.pspId ?? item?.id ?? index + 1,
  psp_company:
    item?.psp_company ??
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

export default function PSPRevenue() {
  const location = useLocation();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLcda, setSelectedLcda] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [lgas, setLgas] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [apiTotalPages, setApiTotalPages] = useState(1);
  const itemsPerPage = 10;

  const isLocalMode = useMemo(() => {
    return Array.isArray(location?.state?.pspRevenue) && location.state.pspRevenue.length > 0;
  }, [location?.state?.pspRevenue]);

  // Initial rows: allow preview page to pass data via route state
  useEffect(() => {
    const stateRows = location?.state?.pspRevenue;
    if (Array.isArray(stateRows) && stateRows.length) {
      setRows(stateRows.map(normalizePSPRevenueRow));
      setLoading(false);
    }
  }, [location?.state]);

  // Fetch LGA list on mount (only if not in local mode)
  useEffect(() => {
    if (isLocalMode) return;
    
    const fetchLgas = async () => {
      try {
        const { data } = await api.get('/psps/lgas');
        const list = Array.isArray(data) ? data : data?.data || [];
        setLgas(list);
      } catch (error) {
        console.error('Error fetching LGAs:', error);
        // Fallback standard LGA list
        setLgas([
          { name: "Lagos Island" },
          { name: "Ifako-Ijaiye" },
          { name: "Kosofe" },
          { name: "Badagry" },
          { name: "Apapa" },
          { name: "Ikeja" },
          { name: "Alimosho" },
          { name: "Surulere" },
          { name: "Lekki/LCDA" },
          { name: "Ikorodu" },
          { name: "Epe" }
        ]);
      }
    };
    fetchLgas();
  }, [isLocalMode]);

  // Fetch live paginated API data
  useEffect(() => {
    if (isLocalMode) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: itemsPerPage
        };
        if (searchTerm.trim()) params.search = searchTerm.trim();
        if (selectedLcda) params.lga = selectedLcda;
        if (startDate) params.startDate = new Date(startDate).toISOString();
        if (endDate) params.endDate = new Date(endDate).toISOString();

        const response = await api.get("/lawma/superadmins/all-psp-revenue", { params });

        const raw = response?.data?.data ?? response?.data?.pspRevenue ?? response?.data?.pspRevenue?.pspRevenue ?? response?.data ?? [];
        const normalized = Array.isArray(raw) ? raw.map(normalizePSPRevenueRow) : [];
        
        // Extract total records for page count
        const totalRecords = response?.data?.totalCount ?? response?.data?.total ?? response?.data?.meta?.total ?? response?.data?.meta?.totalCount ?? (Array.isArray(raw) ? raw.length : 0);

        setRows(normalized);
        setApiTotalPages(Math.max(1, Math.ceil(totalRecords / itemsPerPage)));
      } catch (error) {
        console.error("Error fetching PSP revenue:", error);
        setRows([]);
        setApiTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLocalMode, currentPage, searchTerm, selectedLcda, startDate, endDate]);

  const lcdaOptions = useMemo(() => {
    if (isLocalMode) {
      const set = new Set(rows.map((r) => r.lcda).filter(Boolean));
      return ["", ...Array.from(set)];
    } else {
      const set = new Set(lgas.map((l) => l.name || l.lgaName || l).filter(Boolean));
      return ["", ...Array.from(set)];
    }
  }, [rows, lgas, isLocalMode]);

  const filteredRows = useMemo(() => {
    if (!isLocalMode) {
      // In API mode, server already filtered the data
      return rows;
    }
    const term = searchTerm.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesLcda = !selectedLcda || r.lcda === selectedLcda;
      const matchesSearch =
        !term ||
        String(r.psp_company).toLowerCase().includes(term) ||
        String(r.lcda).toLowerCase().includes(term);
      return matchesLcda && matchesSearch;
    });
  }, [rows, searchTerm, selectedLcda, isLocalMode]);

  const totalPages = useMemo(() => {
    if (isLocalMode) {
      return Math.max(1, Math.ceil(filteredRows.length / itemsPerPage));
    }
    return apiTotalPages;
  }, [filteredRows, itemsPerPage, apiTotalPages, isLocalMode]);

  const safePage = useMemo(() => {
    return Math.min(Math.max(currentPage, 1), totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (safePage !== currentPage) setCurrentPage(safePage);
  }, [safePage, currentPage]);

  const displayRows = useMemo(() => {
    if (isLocalMode) {
      const start = (safePage - 1) * itemsPerPage;
      return filteredRows.slice(start, start + itemsPerPage);
    }
    return rows;
  }, [rows, filteredRows, safePage, itemsPerPage, isLocalMode]);

  const handleExport = async () => {
    try {
      let exportRows = [];
      if (isLocalMode) {
        exportRows = filteredRows;
      } else {
        setLoading(true);
        const params = {
          page: 1,
          limit: 10000 // get all matching records
        };
        if (searchTerm.trim()) params.search = searchTerm.trim();
        if (selectedLcda) params.lga = selectedLcda;
        if (startDate) params.startDate = new Date(startDate).toISOString();
        if (endDate) params.endDate = new Date(endDate).toISOString();

        const response = await api.get("/lawma/superadmins/all-psp-revenue", { params });
        const raw = response?.data?.data ?? response?.data?.pspRevenue ?? response?.data?.pspRevenue?.pspRevenue ?? response?.data ?? [];
        exportRows = Array.isArray(raw) ? raw.map(normalizePSPRevenueRow) : [];
        if (exportRows.length === 0) {
          exportRows = rows;
        }
      }

      const exportData = exportRows.map((r, idx) => ({
        "S/N": idx + 1,
        "PSP Company": r.psp_company,
        LCDA: r.lcda,
        "Household covered": r.household_covered,
        "Revenue(₦)": r.revenue,
        "Bills(₦)": r.outStandingBill,
      }));

      const csv = Papa.unparse(exportData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "psp_revenue.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      if (!isLocalMode) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-8xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="p-2 rounded-md hover:bg-zinc-200"
                aria-label="Go back"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-zinc-800">PSP revenue</h1>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-zinc-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search here..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded-lg focus:ring-green-600 focus:border-green-600 bg-white text-sm"
                  />
                </div>

                <div className="w-full sm:w-48">
                  <select
                    value={selectedLcda}
                    onChange={(e) => {
                      setSelectedLcda(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white focus:ring-green-600 focus:border-green-600 text-sm"
                  >
                    {lcdaOptions.map((opt) => (
                      <option key={opt || "all"} value={opt}>
                        {opt ? opt : "Filter by: Select LGA"}
                      </option>
                    ))}
                  </select>
                </div>

                {!isLocalMode && (
                  <>
                    <div className="w-full sm:w-auto flex items-center gap-2">
                      <span className="text-xs text-zinc-500 whitespace-nowrap">From:</span>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="px-3 py-2 border border-zinc-300 rounded-lg bg-white focus:ring-green-600 focus:border-green-600 text-sm"
                      />
                    </div>
                    <div className="w-full sm:w-auto flex items-center gap-2">
                      <span className="text-xs text-zinc-500 whitespace-nowrap">To:</span>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="px-3 py-2 border border-zinc-300 rounded-lg bg-white focus:ring-green-600 focus:border-green-600 text-sm"
                      />
                    </div>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={handleExport}
                className="flex items-center justify-center px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition w-full sm:w-auto self-stretch sm:self-auto"
              >
                Export <ExportIcon />
              </button>
            </div>

            <div className="mt-6 bg-white rounded-xl border border-zinc-200 overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      S/N
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      PSP Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      LCDA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Household covered
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Revenue(₦)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                      Bills(₦)
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-zinc-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-sm text-zinc-500">
                        Loading...
                      </td>
                    </tr>
                  ) : displayRows.length ? (
                    displayRows.map((r, idx) => (
                      <tr key={r.id ?? idx} className="hover:bg-zinc-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                          {(safePage - 1) * itemsPerPage + idx + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                          {r.psp_company}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">{r.lcda}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                          {Number(r.household_covered ?? 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                          {formatNaira(r.revenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-900">
                          {formatNaira(r.outStandingBill)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-sm text-zinc-500">
                        No data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-zinc-600">
                Page <span className="font-medium">{safePage}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1 || loading}
                  className="p-2 rounded-md hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages || loading}
                  className="p-2 rounded-md bg-green-700 text-white hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


