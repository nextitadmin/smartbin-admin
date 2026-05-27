import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/SuperAdmin/Sidebar";
import Topbar from "../components/SuperAdmin/Topbar";

// --- Helper Functions ---

// Helper function to convert number to words (Nigerian Naira)
const numberToWordsNaira = (num) => {
    if (num === null || num === undefined) return '';
    if (num === 0) return 'Zero Naira Only';

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Million', 'Billion'];

    let word = '';

    const toWords = (n) => {
        if (n === 0) return '';
        if (n < 10) return ones[n] + ' ';
        if (n < 20) return teens[n - 10] + ' ';
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '') + ' ';
        if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + toWords(n % 100, '') : '') + ' ';
        return '';
    };

    let i = 0;
    let number = num;
    while (number > 0) {
        if (number % 1000 !== 0) {
            word = toWords(number % 1000, '') + thousands[i] + (i > 0 ? ' ' : '') + word;
        }
        number = Math.floor(number / 1000);
        i++;
    }

    return word.trim() + ' Naira Only';
};

// --- Raw SVG Icons (Hero Icons) ---

// Search Icon
const SEARCH_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';

// Chevron Up Down Icon for sorting
const CHEVRON_UP_DOWN_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';

// Arrow Down Icon for sorting direction
const ARROW_DOWN_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';

// Arrow Up Icon for sorting direction
const ARROW_UP_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></polyline></svg>';

// --- Constants and Helper Component for Icons ---

const HeroIcon = ({ svg, className = "w-5 h-5 text-zinc-500" }) => (
  <span className={className} dangerouslySetInnerHTML={{ __html: svg }} />
);

// Month constants for the new dropdown
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const CURRENT_MONTH_INDEX = new Date().getMonth();
const CURRENT_MONTH_NAME = MONTHS[CURRENT_MONTH_INDEX];

// --- Reusable Month Select Component ---

const MonthTimeSelect = () => {
  // Initialize state to the current month index (0-11)
  const [selectedMonthIndex, setSelectedMonthIndex] =
    useState(CURRENT_MONTH_INDEX);

  const handleChange = (event) => {
    setSelectedMonthIndex(parseInt(event.target.value, 10));
  };

  return (
    <div className="relative border border-zinc-300 rounded-lg cursor-pointer hover:bg-zinc-50 transition">
      <select
        value={selectedMonthIndex}
        onChange={handleChange}
        // appearance-none hides the default select arrow
        className="appearance-none bg-transparent px-2 py-1 text-sm text-zinc-600 focus:outline-none w-full h-full pr-6"
      >
        {MONTHS.map((monthName, index) => (
          <option key={index} value={index}>
            {index === CURRENT_MONTH_INDEX ? "This month" : monthName}
          </option>
        ))}
      </select>
      {/* Custom Arrow Down Icon, pointer-events-none ensures clicks go to the select */}
      <HeroIcon
        svg={ARROW_DOWN_ICON}
        className="w-3 h-3 ml-1 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-zinc-600"
      />
    </div>
  );
};

// --- Mock Data and API Simulation (Unchanged) ---

const pendingBillsColumns = [
  { key: "sn", label: "S/N", sortable: true },
  { key: "billId", label: "Bill ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "payId", label: "Pay ID", sortable: true },
  { key: "service", label: "Service", sortable: true },
  { key: "amount", label: "Amount (₦)", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "action", label: "Action", sortable: false },
];

const paymentsColumns = [
  { key: "sn", label: "S/N", sortable: true },
  { key: "paymentId", label: "Payment ID", sortable: true },
  { key: "revenueSource", label: "Revenue Source", sortable: true },
  { key: "amount", label: "Amount (₦)", sortable: true },
  { key: "date", label: "Date", sortable: true },
  { key: "paymentMethod", label: "Payment method", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "action", label: "Action", sortable: false },
];

// Generate mock data for Pending Bills
const MOCK_PENDING_BILLS = Array.from({ length: 15 }, (_, i) => ({
  sn: i + 1,
  billId: `#OD1258904${i}`,
  name: "Olabankole Kolawole",
  payId: `N-1465${6 + i}`,
  service: "Waste Bin Disposal",
  amount: (3500 + i * 1000).toFixed(2),
  status: "Pending",
  // Based on design, only one row has 'Pay now'
  action: i === 4 ? "Pay now" : "View bill",
  // Add multiple payment items for bills
  paymentItems: [
    { 
      description: "Waste Bin Disposal Service", 
      amount: 3500 + i * 1000 
    },
    // { 
    //     description: 'Environmental compliance fee', 
    //     amount: 1500 + i * 200 
    // },
    // { 
    //     description: 'Service maintenance fee', 
    //     amount: 800 + i * 150 
    // }
  ],
}));

// Generate mock data for Payments
const MOCK_PAYMENTS = Array.from({ length: 15 }, (_, i) => ({
  sn: i + 1,
  paymentId: `PAY-${String(i + 1).padStart(3, '0')}`, // Match Receipt component format
  revenueSource: i % 3 === 0 ? "Waste Collection" : "Smart Bin purchase",
  amount: (20000 + i * 50).toFixed(2),
  date: `26-06-23`,
  paymentMethod: i % 2 === 0 ? "Alat by Wema" : "In-app wallet",
  status: "Successful",
  action: "View receipt",
  // Additional fields needed for Receipt component
  recipientName: `Customer ${i + 1}`,
  transactionId: `TXN-${String(i + 1).padStart(3, '0')}-2025`,
  transactionRef: `REF-${String(i + 1).padStart(3, '0')}-2025`,
  phoneNumber: `+234 80${i + 1} ${String(Math.floor(Math.random() * 1000)).padStart(3, '0')} ${String(Math.floor(Math.random() * 10000)).padStart(3, '0')}`,
  transactionDate: new Date().toLocaleString(),
  address: `${100 + i} Main Street, Lagos`,
  paymentItems: [
    { 
      description: i % 3 === 0 ? "Waste Collection Service" : "Smart Bin purchase", 
      amount: 20000 + i * 50 
    }
  ],
  currencySymbol: "₦",
  amountInWords: numberToWordsNaira(20000 + i * 50),
}));

// Function to simulate API call returning a promise
const fetchData = (type) =>
  new Promise((resolve) => {
    setTimeout(() => {
      if (type === "bills") {
        resolve(MOCK_PENDING_BILLS);
      } else {
        resolve(MOCK_PAYMENTS);
      }
    }, 500); // Simulate network delay
  });

// --- Table Component (Handles Sorting and Rendering) ---

const ReconciliationTable = ({ columns, tabType }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState({ key: "", direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  // State to manage the active time filter (for button group visual feedback)
  const [activeTimeFilter, setActiveTimeFilter] = useState("MTD");

  useEffect(() => {
    setLoading(true);
    // Determine the type for fetching based on the current tab
    const type = tabType === "Pending Bills" ? "bills" : "payments";

    fetchData(type)
      .then((fetchedData) => {
        setData(fetchedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [tabType]);

  // Sorting logic
  const handleSort = useCallback((key) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  // Handle action clicks
  const handleActionClick = (action, row) => {
    console.log("Action clicked:", action, "Row data:", row);
    
    try {
      if (action === "View receipt") {
        // Store payment ID in localStorage for the receipt component
        localStorage.setItem("paymentId", row.paymentId);
        // Store complete payment data for the receipt component
        localStorage.setItem("paymentData", JSON.stringify(row));
        console.log("Navigating to payment receipt with data:", row);
        // Navigate to receipt page
        navigate("/payment-receipt");
      } else if (action === "View bill") {
        // Store bill ID in localStorage for the BillsReceipt component
        localStorage.setItem("paymentId", row.billId);
        // Create bill data structure for BillsReceipt component
        const billData = {
          recipientName: row.name,
          transactionId: row.billId,
          paymentId: row.billId,
          transactionRef: row.billId,
          phoneNumber: `+234 80${Math.floor(Math.random() * 1000000000)}`, // Generate random phone
          transactionDate: new Date().toLocaleString(),
          paymentItems: row.paymentItems || [
            { 
              description: row.service, 
              amount: parseFloat(row.amount) 
            }
          ],
          currencySymbol: "₦",
          amountInWords: row.paymentItems ? 
            numberToWordsNaira(row.paymentItems.reduce((sum, item) => sum + item.amount, 0)) :
            numberToWordsNaira(parseFloat(row.amount)),
          address: "Lagos, Nigeria", // Default address
          paymentMethod: "Pending Payment",
          status: row.status
        };
        // Store complete bill data for the BillsReceipt component
        localStorage.setItem("paymentData", JSON.stringify(billData));
        console.log("Navigating to bills receipt with data:", billData);
        // Navigate to BillsReceipt page
        navigate("/bills-receipt");
      } else if (action === "Pay now") {
        // Handle pay now action if needed
        console.log("Pay now clicked for:", row);
      }
    } catch (error) {
      console.error("Error in handleActionClick:", error);
    }
  };

  const sortedAndFilteredData = useMemo(() => {
    let currentData = [...data];

    // 1. Filtering
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      currentData = currentData.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(lowerCaseSearch)
        )
      );
    }

    // 2. Sorting
    if (sort.key) {
      currentData.sort((a, b) => {
        const aValue = a[sort.key];
        const bValue = b[sort.key];
        let comparison = 0;

        // Handle numeric vs string comparison
        if (
          !isNaN(parseFloat(aValue)) &&
          isFinite(aValue) &&
          !isNaN(parseFloat(bValue)) &&
          isFinite(bValue)
        ) {
          comparison = parseFloat(aValue) - parseFloat(bValue);
        } else {
          // FIX: Removed the misplaced colon (was "}: {")
          comparison = String(aValue).localeCompare(String(bValue));
        }

        return sort.direction === "asc" ? comparison : comparison * -1;
      });
    }

    return currentData;
  }, [data, sort, searchTerm]);

  // Updated styles to match design colors (pink/red for Pending)
  const getStatusStyle = (status) => {
    if (status === "Successful")
      return "text-green-600 bg-green-100 border-green-300";
    // Use a pink/light red color scheme for Pending, matching the design
    if (status === "Pending") return "text-red-500 bg-red-100 border-red-300";
    return "text-zinc-600 bg-zinc-100 border-zinc-300"; // Fallback
  };

  // Updated styles to match design colors (Red for Pay now, Green for others)
  const getActionStyle = (action) => {
    if (action === "Pay now") return "text-red-500 font-medium";
    return "text-green-500 font-medium";
  };

  const getSortIcon = (key) => {
    if (sort.key !== key) {
      return (
        <HeroIcon
          svg={CHEVRON_UP_DOWN_ICON}
          className="w-4 h-4 text-zinc-400 ml-1"
        />
      );
    }
    return sort.direction === "asc" ? (
      <HeroIcon svg={ARROW_UP_ICON} className="w-4 h-4 text-zinc-700 ml-1" />
    ) : (
      <HeroIcon svg={ARROW_DOWN_ICON} className="w-4 h-4 text-zinc-700 ml-1" />
    );
  };

  const TimeFilterButton = ({ label, value }) => {
    const isActive = activeTimeFilter === value;
    const baseClasses =
      "px-2 py-1 text-sm flex font-medium rounded-lg cursor-pointer transition text-center";

    const activeClasses = isActive
      ? "bg-green-500 text-white shadow-md"
      : "text-zinc-600 border border-zinc-300 hover:bg-zinc-100";

    return (
      <span
        onClick={() => setActiveTimeFilter(value)}
        className={`${baseClasses} ${activeClasses}`}
      >
        {label}
      </span>
    );
  };
  const MonthFilterButton = ({ label, value }) => {
    const isActive = activeTimeFilter === value;
    const baseClasses =
      "px-2 py-1 text-sm font-medium rounded-lg cursor-pointer transition text-center";

    const activeClasses = isActive
      ? "bg-green-500 text-white shadow-md"
      : "text-zinc-600 border border-zinc-300 hover:bg-zinc-100";

    return (
      <span
        onClick={() => setActiveTimeFilter(value)}
        className={`${baseClasses} ${activeClasses}`}
      >
        {label}
      </span>
    );
  };

  return (
    <div className=" rounded-xl p-4 md:p-6">
      {/* Search and Filter Row */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-3 sm:space-y-0">
        <div className="relative w-full sm:w-64">
          <HeroIcon
            svg={SEARCH_ICON}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400"
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-zinc-300 rounded-lg focus:ring-zinc-500 focus:border-zinc-500 transition duration-150"
          />
        </div>

        {/* Time Filters - Includes MonthSelect and active state management */}
        <div className="flex items-center space-x-2 text-sm font-medium text-zinc-600">
          <TimeFilterButton label="Today" value="Today" />

          {/* Month selection component */}
          
          <MonthFilterButton cla label="This Month" value="This Month" />

          <TimeFilterButton
            className="flex flex-row"
            label="This Year"
            value="This Year"
          />

          {/* The design shows MTD active by default */}
          <TimeFilterButton label="MTD" value="MTD" />

          <TimeFilterButton label="YTD" value="YTD" />
        </div>
      </div>

      {/* Table Container (Responsive) */}
      <div className="overflow-x-auto rounded-lg border border-zinc-200">
        {loading ? (
          <div className="p-12 text-center text-zinc-500">Loading data...</div>
        ) : (
          <table className="min-w-full divide-zinc-200">
            {/* Table Header */}
            <thead className="">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600 ${
                      col.sortable
                        ? "cursor-pointer hover:bg-zinc-100 transition duration-150"
                        : ""
                    }`}
                  >
                    <div className="flex items-center">
                      {col.label}
                      {col.sortable && getSortIcon(col.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-zinc-100 bg-white">
              {sortedAndFilteredData.length > 0 ? (
                sortedAndFilteredData.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-zinc-50 transition duration-100"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="whitespace-nowrap px-6 py-4 text-sm text-zinc-800"
                      >
                        {col.key === "status" ? (
                          <span
                            className={`inline-flex items-center rounded-lg px-3 py-0.5 text-xs font-medium border ${getStatusStyle(
                              row[col.key]
                            )}`}
                          >
                            {row[col.key]}
                          </span>
                        ) : col.key === "action" ? (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              console.log("Button clicked:", row[col.key], row);
                              handleActionClick(row[col.key], row);
                            }}
                            className={`text-sm ${getActionStyle(
                              row[col.key]
                            )} hover:underline cursor-pointer`}
                          >
                            {row[col.key]}
                          </button>
                        ) : (
                          row[col.key]
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-4 text-center text-sm text-zinc-500"
                  >
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-zinc-600">
        <span>
          Page 1 of {Math.ceil(sortedAndFilteredData.length / 10) || 1}
        </span>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-zinc-300 rounded-lg hover:bg-zinc-100 transition">
            &lt;
          </button>
          <button className="px-3 py-1 border border-zinc-300 rounded-lg hover:bg-zinc-100 transition">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Summary Cards Component ---

const SummaryCards = () => {
  // Updated mock data values and colors to match the design (Payment made is green)
  const cards = [
    { title: "Unpaid bills", value: "1,240", isCurrency: false, valueColor: "text-green-700" },
    {
      title: "Amount of unpaid bills",
      value: "30,000",
      valueColor: "text-green-700",
      isCurrency: true,
    },
    {
      title: "Payment made",
      value: "30,000",
      valueColor: "text-green-700",
      isCurrency: true,
      subtitle: "₦850k ₦150k",
      subtitles:"Bin purchase Waste disposal",
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="flex-1 bg-white rounded-xl p-4 border border-zinc-200"
        >
          {/* Month selection dropdown integrated */}
          <div className="flex justify-end items-end mb-2">
            <MonthTimeSelect />
          </div>
          <div className="flex flex-col">
            <p className="text-zinc-500 text-sm pb-3">{card.title}</p>

            {/* Value and subtitle side by side */}
            <div className="flex items-baseline justify-between">
              <p className={`text-3xl font-bold ${card.valueColor}`}>
                {card.isCurrency && "₦"}
                {card.value}
              </p>

              {card.subtitle && card.subtitles && (
                <p className="flex flex-col text-xs text-zinc-500 justify-center items-center whitespace-nowrap">
                  {card.subtitle}
                  <div className="flex justify-center text-left">
                    <p>{card.subtitles}</p>
                  </div>
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [activeTab, setActiveTab] = useState("Pending Bills");

  const columns =
    activeTab === "Pending Bills" ? pendingBillsColumns : paymentsColumns;

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-8xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-zinc-900">
                Reconciliation
              </h1>
              <p className="text-zinc-500 mt-1">
                Track bills and payments on the system here
              </p>
            </header>

            {/* Summary Cards */}
            <SummaryCards />

            {/* Tab Navigation */}
            <div className="flex justify-between">
              <div className="flex border-b border-zinc-300 mb-6">
                {["Pending Bills", "Payments"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium transition duration-200 ${
                      activeTab === tab
                        ? "text-green-500 border-b-2 border-green-500" // Changed active tab color to green border for contrast
                        : "text-zinc-500 hover:text-zinc-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div>
                <button className="text-sm text-zinc-600 border bg-white border-zinc-300 rounded-lg px-3 py-2 hover:bg-zinc-100 transition w-full sm:w-auto">
                  Export data
                </button>
              </div>
            </div>

            {/* Table Section */}
            <ReconciliationTable columns={columns} tabType={activeTab} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
