import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import Sidebar from "../components/LawmaAdmin/Sidebar";
import Topbar from "../components/LawmaAdmin/Topbar";

import { SearchIcon } from "../components/icons";

const WasteManagement = () => {
  const [wasteData, setWasteData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    date: "",
    representative: "",
    address: "",
  });

  // Mock Data (fallback)
  const mockData = [
    {
      id: 1,
      wasteId: "#OD12589048",
      date: "21-01-25",
      address: "12, Awolowo Road, Ikoyi, Lagos",
      representative: "",
      status: "Pending",
    },
    {
      id: 2,
      wasteId: "#OD12589048",
      date: "21-01-25",
      address: "45, Ogunlana Drive, Surulere, Lagos",
      representative: "Falomo Jide",
      status: "Picked up",
    },
    {
      id: 3,
      wasteId: "#OD12589048",
      date: "21-01-25",
      address: "4, Bode Thomas Street, Surulere, Lagos",
      representative: "",
      status: "Pending",
    },
    {
      id: 4,
      wasteId: "#OD12589048",
      date: "21-01-25",
      address: "8, Akin Adesola Street, Victoria Island, Lagos",
      representative: "Fatimo Adetola",
      status: "Picked up",
    },
    {
      id: 5,
      wasteId: "#OD12589048",
      date: "21-01-25",
      address: "8, Akin Adesola Street, Victoria Island, Lagos",
      representative: "Chiduke Uchenna",
      status: "Picked up",
    },
    {
      id: 6,
      wasteId: "#OD12589048",
      date: "21-01-25",
      address: "8, Akin Adesola Street, Victoria Island, Lagos",
      representative: "Mattias Piaus",
      status: "Picked up",
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setWasteData(mockData);
      setFilteredData(mockData);
    }, 500);
  }, []);

  // Apply search and filters
  useEffect(() => {
    let result = wasteData;

    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.wasteId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.representative &&
            item.representative
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
    }

    if (filters.status) {
      result = result.filter((item) => item.status === filters.status);
    }

    if (filters.date) {
      result = result.filter((item) => item.date === filters.date);
    }

    if (filters.representative) {
      result = result.filter(
        (item) => item.representative === filters.representative
      );
    }

    if (filters.address) {
      result = result.filter((item) => item.address.includes(filters.address));
    }

    setFilteredData(result);
  }, [searchTerm, filters, wasteData]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      date: "",
      representative: "",
      address: "",
    });
  };

  const handleExport = () => {
    const headers = [
      "S/N",
      "Waste ID",
      "Date",
      "Address",
      "Representative",
      "Status",
    ];
    const csvData = filteredData.map((row, index) => ({
      "S/N": index + 1,
      "Waste ID": row.wasteId,
      Date: row.date,
      Address: row.address,
      Representative: row.representative || "-",
      Status: row.status,
    }));

    const csv = Papa.unparse(csvData, { header: true });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "waste_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Icons
  const TrashIcon = () => (
    <div className="bg-green-800 p-2 rounded-full text-white">
      <svg
        width="21"
        height="21"
        viewBox="0 0 21 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.85547 5.85547H4.52214H17.8555"
          stroke="white"
          stroke-width="1.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M16.1901 5.85677V17.5234C16.1901 17.9655 16.0145 18.3894 15.7019 18.7019C15.3894 19.0145 14.9655 19.1901 14.5234 19.1901H6.1901C5.74808 19.1901 5.32415 19.0145 5.01159 18.7019C4.69903 18.3894 4.52344 17.9655 4.52344 17.5234V5.85677M7.02344 5.85677V4.1901C7.02344 3.74808 7.19903 3.32415 7.51159 3.01159C7.82415 2.69903 8.24808 2.52344 8.6901 2.52344H12.0234C12.4655 2.52344 12.8894 2.69903 13.2019 3.01159C13.5145 3.32415 13.6901 3.74808 13.6901 4.1901V5.85677"
          stroke="white"
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );

  const TrashCanIcon = () => (
    <div className="bg-green-800 p-2 rounded-full text-white">
      <svg
        width="21"
        height="21"
        viewBox="0 0 21 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2.85547 5.35547H4.52214H17.8555"
          stroke="white"
          stroke-width="1.66667"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M16.1901 5.35677V17.0234C16.1901 17.4655 16.0145 17.8894 15.7019 18.2019C15.3894 18.5145 14.9655 18.6901 14.5234 18.6901H6.1901C5.74808 18.6901 5.32415 18.5145 5.01159 18.2019C4.69903 17.8894 4.52344 17.4655 4.52344 17.0234V5.35677M7.02344 5.35677V3.6901C7.02344 3.24808 7.19903 2.82415 7.51159 2.51159C7.82415 2.19903 8.24808 2.02344 8.6901 2.02344H12.0234C12.4655 2.02344 12.8894 2.19903 13.2019 2.51159C13.5145 2.82415 13.6901 3.24808 13.6901 3.6901V5.35677"
          stroke="white"
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M8.68945 9.52344V14.5234"
          stroke="white"
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M12.0234 9.52344V14.5234"
          stroke="white"
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );

  const WalletIcon = () => (
    <div className="bg-green-800 p-2 text-white rounded-full">
      <svg
        width="21"
        height="21"
        viewBox="0 0 21 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.3895 11.6478C15.0395 11.9894 14.8395 12.4811 14.8895 13.0061C14.9645 13.9061 15.7895 14.5644 16.6895 14.5644H18.2728V15.5561C18.2728 17.2811 16.8645 18.6895 15.1395 18.6895H5.57279C3.84779 18.6895 2.43945 17.2811 2.43945 15.5561V9.94779C2.43945 8.22279 3.84779 6.81445 5.57279 6.81445H15.1395C16.8645 6.81445 18.2728 8.22279 18.2728 9.94779V11.1478H16.5895C16.1228 11.1478 15.6978 11.3311 15.3895 11.6478Z"
          stroke="white"
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M2.43945 10.6975V6.88926C2.43945 5.89759 3.04779 5.01422 3.97279 4.66422L10.5895 2.16422C11.6228 1.77255 12.7311 2.53924 12.7311 3.64758V6.81423"
          stroke="white"
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M19.1551 11.9984V13.7151C19.1551 14.1735 18.7885 14.5484 18.3218 14.5651H16.6885C15.7885 14.5651 14.9635 13.9068 14.8885 13.0068C14.8385 12.4818 15.0385 11.9901 15.3885 11.6484C15.6968 11.3318 16.1218 11.1484 16.5885 11.1484H18.3218C18.7885 11.1651 19.1551 11.5401 19.1551 11.9984Z"
          stroke="white"
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M6.18945 10.3555H12.0228"
          stroke="white"
          stroke-width="1.25"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );

  //   const SearchIcon = () => (
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       viewBox="0 0 24 24"
  //       fill="currentColor"
  //       className="w-5 h-5 text-zinc-500"
  //     >
  //       <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 5 1.47-1.47L21 14l-5-5-5 5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  //     </svg>
  //   );

  // Components
  const Card = ({ icon, title, value, color }) => {
    const colorClasses = {
      green: "text-green-700",
    };
    const bgColor = "bg-white";

    return (
      <div
        className={`${bgColor} p-5 rounded-xl border border-zinc-200 flex flex-col items-start`}
      >
        {/* Icon */}
        <div
          className={`p-3 mb-3 ${"text-gray-600"
            }`}
        >
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-[18px] font-medium text-zinc-700 mb-1">{title}</h3>

        {/* Value */}
        <p
          className={`text-2xl font-semibold ${colorClasses[color] || "text-green-700"
            }`}
        >
          {value}
        </p>
      </div>
    );
  };

  const SearchBar = ({ value, onChange, placeholder }) => {
    return (
      <div className="relative w-full max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon />
        </div>
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="block w-70 pl-10 pr-3 py-2 bg-white border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-zinc-700"
        />
      </div>
    );
  };

  const FilterModal = ({
    isOpen,
    onClose,
    filters,
    onFilterChange,
    onReset,
  }) => {
    if (!isOpen) return null;

    const statuses = ["Pending", "Picked up"];
    const dates = ["21-01-25"];
    const representatives = [
      "",
      "Falomo Jide",
      "Fatimo Adetola",
      "Chiduke Uchenna",
      "Mattias Piaus",
    ];
    const addresses = [
      "12, Awolowo Road, Ikoyi, Lagos",
      "45, Ogunlana Drive, Surulere, Lagos",
    ];

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white w-full max-w-md p-6 rounded-xl border border-zinc-200">
          <h2 className="text-xl font-semibold text-zinc-800 mb-4">
            Filter Waste Records
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => onFilterChange("status", e.target.value)}
                className="w-full p-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Status</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Date
              </label>
              <select
                value={filters.date}
                onChange={(e) => onFilterChange("date", e.target.value)}
                className="w-full p-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Dates</option>
                {dates.map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Representative
              </label>
              <select
                value={filters.representative}
                onChange={(e) =>
                  onFilterChange("representative", e.target.value)
                }
                className="w-full p-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Representatives</option>
                {representatives.map((rep) => (
                  <option key={rep} value={rep}>
                    {rep || "No Representative"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Address
              </label>
              <select
                value={filters.address}
                onChange={(e) => onFilterChange("address", e.target.value)}
                className="w-full p-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Addresses</option>
                {addresses.map((addr) => (
                  <option key={addr} value={addr}>
                    {addr}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onReset}
              className="px-4 py-2 text-sm font-medium text-zinc-700 border border-zinc-300 rounded-lg hover:bg-zinc-100"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-green-700 rounded-lg hover:bg-green-800"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    );
  };

  const StatusBadge = ({ status }) => {
    const getStatusClass = (status) => {
      switch (status) {
        case "Picked up":
          return "bg-green-100 text-green-800 border border-green-300";
        case "Pending":
          return "bg-zinc-100 text-zinc-700 border border-zinc-300";
        default:
          return "bg-zinc-100 text-zinc-700 border border-zinc-300";
      }
    };

    return (
      <span
        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusClass(
          status
        )}`}
      >
        {status}
      </span>
    );
  };

  const Table = ({ data }) => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className=" border-zinc-200">
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-700">
                S/N
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-700">
                Waste ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-700">
                Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-700">
                Address
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-700">
                Representative
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr
                  key={row.id}
                  className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-zinc-700">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-700">
                    {row.wasteId}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-700">
                    {row.date}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-700">
                    {row.address}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-700">
                    {row.representative || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-zinc-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="bg-zinc-100 min-h-screen w-full p-4 sm:p-6 lg:p-8">
          <div className=" mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Card
                icon={<TrashIcon />}
                className="block"
                title="Waste Picked up"
                value="200"
              />
              <Card
                icon={<TrashCanIcon />}
                title="Pending waste pickups"
                value="24"
              />
              <Card
                icon={<WalletIcon />}
                title="Amount generated"
                value="₦1,000,000"
              />
            </div>

            {/* Search & Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="px-4 py-2 border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
                >
                  Filter
                </button>
                <button
                  onClick={handleExport}
                  className="px-4 py-2 border border-zinc-300 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
                >
                  Export
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-none">
              <Table data={filteredData} />
            </div>

            {/* Filter Modal */}
            {isFilterOpen && (
              <FilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={resetFilters}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default WasteManagement;
