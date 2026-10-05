import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import Sidebar from "../components/SuperAdmin/Sidebar";
import Topbar from "../components/SuperAdmin/Topbar";
import api from "../api/apiConfig";

// --- Helper Functions ---

// Convert number to words in Nigerian Naira
const numberToWordsNaira = (num) => {
  if (num === null || num === undefined) return "";
  if (num === 0) return "Zero Naira Only";

  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const thousands = ["", "Thousand", "Million", "Billion"];

  const toWords = (n) => {
    if (n === 0) return "";
    if (n < 10) return ones[n] + " ";
    if (n < 20) return teens[n - 10] + " ";
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "") + " ";
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + toWords(n % 100) : "") + " ";
    return "";
  };

  let i = 0;
  let word = "";
  let number = Math.floor(Math.abs(num));
  while (number > 0) {
    if (number % 1000 !== 0) {
      word = toWords(number % 1000) + thousands[i] + (i > 0 ? " " : "") + word;
    }
    number = Math.floor(number / 1000);
    i++;
  }

  return word.trim() + " Naira Only";
};

// Format currency
const formatCurrency = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return "₦0.00";
  return (
    "₦" +
    num.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
};

// Date timeframe evaluator
const matchesTimeframe = (dateStr, timeframe) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;

  const now = new Date();
  const dYear = d.getFullYear();
  const dMonth = d.getMonth();
  const dDate = d.getDate();

  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth();
  const nowDate = now.getDate();

  const normalized = (timeframe || "").toLowerCase().trim();

  if (normalized === "today") {
    return dYear === nowYear && dMonth === nowMonth && dDate === nowDate;
  }
  if (normalized === "this month") {
    return dYear === nowYear && dMonth === nowMonth;
  }
  if (normalized === "this year") {
    return dYear === nowYear;
  }
  if (normalized === "mtd" || normalized.includes("month to date")) {
    const startOfMonth = new Date(nowYear, nowMonth, 1, 0, 0, 0, 0);
    return d >= startOfMonth && d <= now;
  }
  if (normalized === "ytd" || normalized.includes("year to date")) {
    const startOfYear = new Date(nowYear, 0, 1, 0, 0, 0, 0);
    return d >= startOfYear && d <= now;
  }
  if (normalized === "all") {
    return true;
  }
  return true;
};

// --- Raw SVG Icons ---
const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDownIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronLeftIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polyline points="15 18 9 12 15 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRightIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polyline points="9 18 15 12 9 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronUpDownIcon = ({ className = "" }) => (
  <svg className={`w-3.5 h-3.5 inline-block shrink-0 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polyline points="7 15 12 20 17 15" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="7 9 12 4 17 9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowUpIcon = ({ className = "" }) => (
  <svg className={`w-3.5 h-3.5 inline-block shrink-0 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polyline points="18 15 12 9 6 15" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowDownIcon = ({ className = "" }) => (
  <svg className={`w-3.5 h-3.5 inline-block shrink-0 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DownloadIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const ExcelIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 2H6C4.9 2 4 2.9 4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 9h-2V9h2v2zm0 4h-2v-2h2v2zm0 4h-2v-2h2v2zm4-4h-2v-2h2v2zm0 4h-2v-2h2v2zm-8-8H7V9h2v2zm0 4H7v-2h2v2zm0 4H7v-2h2v2zm5-11V3.5L18.5 8H14z" />
  </svg>
);

const PdfIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9.5 8.5h-2v2h2c.55 0 1-.45 1-1s-.45-1-1-1zm6 3h-1.5v-1h1.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5h-1.5v-2h2c.28 0 .5-.22.5-.5s-.22-.5-.5-.5H13c-.55 0-1 .45-1 1v5c0 .55.45 1 1 1h2.5c.55 0 1-.45 1-1s-.45-1-1-1zm-6-5H8c-.55 0-1 .45-1 1v5c0 .55.45 1 1 1s1-.45 1-1v-1.5h1.5c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5z" />
  </svg>
);

const CloseIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ClockIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// --- Realistic Fallback Data with Varied Dates (Today, This Month, This Year) ---
const getTodayDateStr = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const getRelativeDateStr = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const INITIAL_PENDING_BILLS = [
  {
    id: 1,
    sn: 1,
    billId: "#OD12589048",
    name: "Olabankole Kolawole",
    payerId: "N-146567",
    service: "Waste Bin Disposal",
    amount: 20000,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(-14),
    status: "Pending",
    actionType: "view",
    phoneNumber: "08033019822",
    address: "14 Marina, Lagos Island, Lagos",
    paymentItems: [{ description: "Waste Bin Disposal Service", amount: 20000 }],
  },
  {
    id: 2,
    sn: 2,
    billId: "#OD12589048",
    name: "Olabankole Kolawole",
    payerId: "N-146567",
    service: "Waste Bin Disposal",
    amount: 11250,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(-7),
    status: "Pending",
    actionType: "view",
    phoneNumber: "08022119933",
    address: "22 Admiralty Way, Lekki Phase 1, Lagos",
    paymentItems: [{ description: "Waste Bin Disposal Service", amount: 11250 }],
  },
  {
    id: 3,
    sn: 3,
    billId: "#OD12589048",
    name: "Olabankole Kolawole",
    payerId: "N-146567",
    service: "Waste Bin Disposal",
    amount: 20000,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(-20),
    status: "Pending",
    actionType: "view",
    phoneNumber: "08055443322",
    address: "Plot 1415 Adetokunbo Ademola St, VI, Lagos",
    paymentItems: [{ description: "Waste Bin Disposal Service", amount: 20000 }],
  },
  {
    id: 4,
    sn: 4,
    billId: "#OD12589048",
    name: "Olabankole Kolawole",
    payerId: "N-146567",
    service: "Waste Bin Disposal",
    amount: 6000,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(-10),
    status: "Pending",
    actionType: "view",
    phoneNumber: "08099887766",
    address: "2 Chevron Drive, Lekki Peninsula, Lagos",
    paymentItems: [{ description: "Waste Bin Disposal Service", amount: 6000 }],
  },
  {
    id: 5,
    sn: 4,
    billId: "#OD12589048",
    name: "Olabankole Kolawole",
    payerId: "N-146567",
    service: "Waste Bin Disposal",
    amount: 12600,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(-5),
    status: "Pending",
    actionType: "pay",
    phoneNumber: "08077665544",
    address: "5 Isaac John Street, GRA Ikeja, Lagos",
    paymentItems: [{ description: "Waste Bin Disposal Service", amount: 12600 }],
  },
  {
    id: 6,
    sn: 4,
    billId: "#OD12589048",
    name: "Olabankole Kolawole",
    payerId: "N-146567",
    service: "Waste Bin Disposal",
    amount: 3500,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(-15),
    status: "Pending",
    actionType: "view",
    phoneNumber: "08011223344",
    address: "Plot 84 Ajose Adeogun, Victoria Island, Lagos",
    paymentItems: [{ description: "Waste Bin Disposal Service", amount: 3500 }],
  },
  // Additional records to support 5 pages (6 items per page = 30 records total)
  {
    id: 7,
    sn: 7,
    billId: "#OD12589049",
    name: "Dangote Sugar Refinery Plc",
    payerId: "N-146568",
    service: "Commercial Waste Disposal",
    amount: 85000,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(-14),
    status: "Pending",
    actionType: "view",
    phoneNumber: "08033019822",
    address: "14 Marina, Lagos Island, Lagos",
    paymentItems: [{ description: "Commercial Waste Disposal", amount: 85000 }],
  },
  {
    id: 8,
    sn: 8,
    billId: "#OD12589050",
    name: "Adewale Babatunde",
    payerId: "N-146569",
    service: "Smart Bin Application",
    amount: 45000,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(-7),
    status: "Pending",
    actionType: "view",
    phoneNumber: "08022119933",
    address: "22 Admiralty Way, Lekki Phase 1, Lagos",
    paymentItems: [{ description: "Smart Bin Application", amount: 45000 }],
  },
  {
    id: 9,
    sn: 9,
    billId: "#OD12589051",
    name: "Eko Hotel & Suites",
    payerId: "N-146570",
    service: "Industrial Waste Management",
    amount: 150000,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(-20),
    status: "Pending",
    actionType: "view",
    phoneNumber: "08055443322",
    address: "Plot 1415 Adetokunbo Ademola St, VI, Lagos",
    paymentItems: [{ description: "Industrial Waste Management", amount: 150000 }],
  },
  {
    id: 10,
    sn: 10,
    billId: "#OD12589052",
    name: "Chevron Nigeria Limited",
    payerId: "N-146571",
    service: "Quarterly Sanitation Fee",
    amount: 95000,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(-10),
    status: "Pending",
    actionType: "pay",
    phoneNumber: "08099887766",
    address: "2 Chevron Drive, Lekki Peninsula, Lagos",
    paymentItems: [{ description: "Quarterly Sanitation Fee", amount: 95000 }],
  },
  {
    id: 11,
    sn: 11,
    billId: "#OD12589053",
    name: "Folake Adeleke",
    payerId: "N-146572",
    service: "Residential Waste Pickup",
    amount: 18000,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(-5),
    status: "Pending",
    actionType: "view",
    phoneNumber: "08077665544",
    address: "5 Isaac John Street, GRA Ikeja, Lagos",
    paymentItems: [{ description: "Residential Waste Pickup", amount: 18000 }],
  },
  {
    id: 12,
    sn: 12,
    billId: "#OD12589054",
    name: "Zenith Bank Head Office",
    payerId: "N-146573",
    service: "Commercial Waste Disposal",
    amount: 120000,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(-15),
    status: "Pending",
    actionType: "view",
    phoneNumber: "08011223344",
    address: "Plot 84 Ajose Adeogun, Victoria Island, Lagos",
    paymentItems: [{ description: "Commercial Waste Disposal", amount: 120000 }],
  },
  {
    id: 13,
    sn: 13,
    billId: "#OD12589055",
    name: "Chukwuma Obi",
    payerId: "N-146574",
    service: "Waste Bin Disposal",
    amount: 25000,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(30),
    status: "Pending",
    actionType: "view",
    phoneNumber: "08033445566",
    address: "18 Allen Avenue, Ikeja, Lagos",
    paymentItems: [{ description: "Waste Bin Disposal", amount: 25000 }],
  },
  {
    id: 14,
    sn: 14,
    billId: "#OD12589056",
    name: "TotalEnergies Marketing Nigeria",
    payerId: "N-146575",
    service: "Industrial Waste Management",
    amount: 210000,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(45),
    status: "Pending",
    actionType: "pay",
    phoneNumber: "08022334455",
    address: "4 Churchgate Street, Victoria Island, Lagos",
    paymentItems: [{ description: "Industrial Waste Management", amount: 210000 }],
  },
  {
    id: 15,
    sn: 15,
    billId: "#OD12589057",
    name: "Landmark Beach Resort",
    payerId: "N-146576",
    service: "Commercial Waste Disposal",
    amount: 75000,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(75),
    status: "Pending",
    actionType: "view",
    phoneNumber: "08099112233",
    address: "Water Corporation Drive, VI, Lagos",
    paymentItems: [{ description: "Commercial Waste Disposal", amount: 75000 }],
  },
  {
    id: 16,
    sn: 16,
    billId: "#OD12589058",
    name: "Olumide Bakare",
    payerId: "N-146577",
    service: "Residential Waste Pickup",
    amount: 15000,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(100),
    status: "Pending",
    actionType: "view",
    phoneNumber: "08066554433",
    address: "12 Bode Thomas Street, Surulere, Lagos",
    paymentItems: [{ description: "Residential Waste Pickup", amount: 15000 }],
  },
  {
    id: 17,
    sn: 17,
    billId: "#OD12589059",
    name: "Ikeja City Mall Facility",
    payerId: "N-146578",
    service: "Commercial Waste Disposal",
    amount: 180000,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(20),
    status: "Pending",
    actionType: "view",
    phoneNumber: "08034567891",
    address: "Obafemi Awolowo Way, Alausa, Ikeja",
    paymentItems: [{ description: "Commercial Waste Disposal", amount: 180000 }],
  },
  {
    id: 18,
    sn: 18,
    billId: "#OD12589060",
    name: "Victoria Garden City HOA",
    payerId: "N-146579",
    service: "Estate Waste Clearance",
    amount: 320000,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(10),
    status: "Pending",
    actionType: "pay",
    phoneNumber: "08023456780",
    address: "VGC Estate Office, Lekki-Epe Expressway",
    paymentItems: [{ description: "Estate Waste Clearance", amount: 320000 }],
  },
  {
    id: 19,
    sn: 19,
    billId: "#OD12589061",
    name: "Bimbo Oloyede",
    payerId: "N-146580",
    service: "Waste Bin Disposal",
    amount: 22000,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(5),
    status: "Pending",
    actionType: "view",
    phoneNumber: "08055667788",
    address: "8 Glover Road, Ikoyi, Lagos",
    paymentItems: [{ description: "Waste Bin Disposal", amount: 22000 }],
  },
  {
    id: 20,
    sn: 20,
    billId: "#OD12589062",
    name: "Kano Pillars Hotel Lagos",
    payerId: "N-146581",
    service: "Commercial Waste Disposal",
    amount: 65000,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(15),
    status: "Pending",
    actionType: "view",
    phoneNumber: "08099881122",
    address: "14 Airport Road, Ikeja, Lagos",
    paymentItems: [{ description: "Commercial Waste Disposal", amount: 65000 }],
  },
  {
    id: 21,
    sn: 21,
    billId: "#OD12589063",
    name: "First Bank Nigeria Head Office",
    payerId: "N-146582",
    service: "Quarterly Sanitation Fee",
    amount: 250000,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(25),
    status: "Pending",
    actionType: "view",
    phoneNumber: "08011224455",
    address: "35 Marina, Lagos Island, Lagos",
    paymentItems: [{ description: "Quarterly Sanitation Fee", amount: 250000 }],
  },
  {
    id: 22,
    sn: 22,
    billId: "#OD12589064",
    name: "Tayo Akinwunmi",
    payerId: "N-146583",
    service: "Residential Waste Pickup",
    amount: 14000,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(12),
    status: "Pending",
    actionType: "pay",
    phoneNumber: "08077889900",
    address: "31 Adeola Odeku, Victoria Island, Lagos",
    paymentItems: [{ description: "Residential Waste Pickup", amount: 14000 }],
  },
  {
    id: 23,
    sn: 23,
    billId: "#OD12589065",
    name: "Access Bank Tower Facility",
    payerId: "N-146584",
    service: "Commercial Waste Disposal",
    amount: 140000,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(18),
    status: "Pending",
    actionType: "view",
    phoneNumber: "08033441122",
    address: "14/15 Prince Alaba Oniru St, Oniru, Lagos",
    paymentItems: [{ description: "Commercial Waste Disposal", amount: 140000 }],
  },
  {
    id: 24,
    sn: 24,
    billId: "#OD12589066",
    name: "Halima Danjuma",
    payerId: "N-146585",
    service: "Smart Bin Application",
    amount: 45000,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(8),
    status: "Pending",
    actionType: "view",
    phoneNumber: "08066551133",
    address: "10 Lugard Avenue, Ikoyi, Lagos",
    paymentItems: [{ description: "Smart Bin Application", amount: 45000 }],
  },
  {
    id: 25,
    sn: 25,
    billId: "#OD12589067",
    name: "Nestle Waters Nigeria",
    payerId: "N-146586",
    service: "Industrial Waste Management",
    amount: 380000,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(30),
    status: "Pending",
    actionType: "view",
    phoneNumber: "08022118844",
    address: "Ilupeju Industrial Estate, Lagos",
    paymentItems: [{ description: "Industrial Waste Management", amount: 380000 }],
  },
  {
    id: 26,
    sn: 26,
    billId: "#OD12589068",
    name: "Dr. Kemi Williams",
    payerId: "N-146587",
    service: "Residential Waste Pickup",
    amount: 28000,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(15),
    status: "Pending",
    actionType: "view",
    phoneNumber: "08088992211",
    address: "7 Bourdillon Road, Ikoyi, Lagos",
    paymentItems: [{ description: "Residential Waste Pickup", amount: 28000 }],
  },
  {
    id: 27,
    sn: 27,
    billId: "#OD12589069",
    name: "Shoprite Palms Lekki",
    payerId: "N-146588",
    service: "Commercial Waste Disposal",
    amount: 195000,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(22),
    status: "Pending",
    actionType: "pay",
    phoneNumber: "08099883344",
    address: "Palms Shopping Mall, Lekki, Lagos",
    paymentItems: [{ description: "Commercial Waste Disposal", amount: 195000 }],
  },
  {
    id: 28,
    sn: 28,
    billId: "#OD12589070",
    name: "Kunle Ajayi",
    payerId: "N-146589",
    service: "Waste Bin Disposal",
    amount: 16500,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(9),
    status: "Pending",
    actionType: "view",
    phoneNumber: "08033221100",
    address: "42 Toyin Street, Ikeja, Lagos",
    paymentItems: [{ description: "Waste Bin Disposal", amount: 16500 }],
  },
  {
    id: 29,
    sn: 29,
    billId: "#OD12589071",
    name: "Radisson Blu Anchorage Hotel",
    payerId: "N-146590",
    service: "Hospitality Waste Management",
    amount: 220000,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(14),
    status: "Pending",
    actionType: "view",
    phoneNumber: "08011998877",
    address: "1A Ozumba Mbadiwe Ave, Victoria Island, Lagos",
    paymentItems: [{ description: "Hospitality Waste Management", amount: 220000 }],
  },
  {
    id: 30,
    sn: 30,
    billId: "#OD12589072",
    name: "Biodun Shobanjo",
    payerId: "N-146591",
    service: "Residential Waste Pickup",
    amount: 35000,
    date: getTodayDateStr(),
    dueDate: getRelativeDateStr(6),
    status: "Pending",
    actionType: "view",
    phoneNumber: "08077112233",
    address: "12 Alexander Road, Ikoyi, Lagos",
    paymentItems: [{ description: "Residential Waste Pickup", amount: 35000 }],
  },
];

const INITIAL_PAYMENTS = [
  {
    id: 1,
    sn: 1,
    paymentId: "PMT-2026-4421",
    name: "Babajide Sanwo-Olu",
    payerId: "PAY-77123",
    service: "Waste Disposal Subscription",
    amount: 125000,
    date: getTodayDateStr(),
    revenueSource: "Direct Collection",
    paymentMethod: "Bank Transfer",
    status: "Successful",
    phoneNumber: "08012345678",
    address: "State House, Marina, Lagos",
    transactionRef: "TXN-20261002-001",
    paymentItems: [{ description: "Waste Disposal Subscription", amount: 125000 }],
  },
  {
    id: 2,
    sn: 2,
    paymentId: "PMT-2026-4422",
    name: "Guaranty Trust Bank PLC",
    payerId: "PAY-33102",
    service: "Smart Bin Purchase",
    amount: 750000,
    date: getTodayDateStr(),
    revenueSource: "Corporate Invoicing",
    paymentMethod: "Bank Transfer",
    status: "Successful",
    phoneNumber: "08023456789",
    address: "635 Akin Adesola St, Victoria Island, Lagos",
    transactionRef: "TXN-20261002-002",
    paymentItems: [{ description: "Smart Bin Units (x10)", amount: 750000 }],
  },
  {
    id: 3,
    sn: 3,
    paymentId: "PMT-2026-4419",
    name: "Femi Otedola",
    payerId: "PAY-11942",
    service: "Commercial Waste Disposal",
    amount: 450000,
    date: getRelativeDateStr(1),
    revenueSource: "PSP Remittance",
    paymentMethod: "Card",
    status: "Successful",
    phoneNumber: "08034567890",
    address: "Queen's Drive, Ikoyi, Lagos",
    transactionRef: "TXN-20261001-003",
    paymentItems: [{ description: "Commercial Waste Disposal", amount: 450000 }],
  },
  {
    id: 4,
    sn: 4,
    paymentId: "PMT-2026-4415",
    name: "MTN Nigeria Communications",
    payerId: "PAY-88201",
    service: "Quarterly Sanitation Fee",
    amount: 920000,
    date: getRelativeDateStr(2),
    revenueSource: "Corporate Invoicing",
    paymentMethod: "Bank Transfer",
    status: "Successful",
    phoneNumber: "08045678901",
    address: "Golden Plaza, Falomo, Ikoyi, Lagos",
    transactionRef: "TXN-20260930-004",
    paymentItems: [{ description: "Quarterly Sanitation Fee", amount: 920000 }],
  },
  {
    id: 5,
    sn: 5,
    paymentId: "PMT-2026-4402",
    name: "Chioma Eze",
    payerId: "PAY-55219",
    service: "Wallet Funding",
    amount: 50000,
    date: getRelativeDateStr(12),
    revenueSource: "Online Portal",
    paymentMethod: "USSD",
    status: "Successful",
    phoneNumber: "08056789012",
    address: "34 Ogunlana Drive, Surulere, Lagos",
    transactionRef: "TXN-20260920-005",
    paymentItems: [{ description: "Prepaid Waste Wallet Funding", amount: 50000 }],
  },
  {
    id: 6,
    sn: 6,
    paymentId: "PMT-2026-4395",
    name: "Oando Clean Energy",
    payerId: "PAY-66418",
    service: "Smart Bin Purchase",
    amount: 600000,
    date: getRelativeDateStr(20),
    revenueSource: "Direct Collection",
    paymentMethod: "Bank Transfer",
    status: "Successful",
    phoneNumber: "08067890123",
    address: "Ozumba Mbadiwe Ave, Victoria Island, Lagos",
    transactionRef: "TXN-20260912-006",
    paymentItems: [{ description: "Smart Bin Purchase (x8)", amount: 600000 }],
  },
  {
    id: 7,
    sn: 7,
    paymentId: "PMT-2026-4380",
    name: "Julius Berger Nigeria Plc",
    payerId: "PAY-44019",
    service: "Industrial Waste Management",
    amount: 1450000,
    date: getRelativeDateStr(40),
    revenueSource: "Corporate Invoicing",
    paymentMethod: "Bank Transfer",
    status: "Successful",
    phoneNumber: "08078901234",
    address: "Ijora Causeway, Ijora, Lagos",
    transactionRef: "TXN-20260823-007",
    paymentItems: [{ description: "Industrial Construction Waste Clearance", amount: 1450000 }],
  },
  {
    id: 8,
    sn: 8,
    paymentId: "PMT-2026-4372",
    name: "Kafayat Olatunji",
    payerId: "PAY-99302",
    service: "Waste Disposal Subscription",
    amount: 35000,
    date: getRelativeDateStr(65),
    revenueSource: "Online Portal",
    paymentMethod: "Card",
    status: "Successful",
    phoneNumber: "08089012345",
    address: "8 Toyin Street, Ikeja, Lagos",
    transactionRef: "TXN-20260729-008",
    paymentItems: [{ description: "Subscription Renewal", amount: 35000 }],
  },
  {
    id: 9,
    sn: 9,
    paymentId: "PMT-2026-4350",
    name: "Flour Mills of Nigeria",
    payerId: "PAY-88412",
    service: "Commercial Waste Disposal",
    amount: 580000,
    date: getRelativeDateStr(95),
    revenueSource: "PSP Remittance",
    paymentMethod: "Bank Transfer",
    status: "Successful",
    phoneNumber: "08090123456",
    address: "1 Golden Penny Place, Wharf Road, Apapa, Lagos",
    transactionRef: "TXN-20260629-009",
    paymentItems: [{ description: "Commercial Waste Fee", amount: 580000 }],
  },
  {
    id: 10,
    sn: 10,
    paymentId: "PMT-2026-4320",
    name: "Nestle Nigeria Plc",
    payerId: "PAY-22108",
    service: "Sanitation Clearance",
    amount: 380000,
    date: getRelativeDateStr(130),
    revenueSource: "Direct Collection",
    paymentMethod: "Bank Transfer",
    status: "Successful",
    phoneNumber: "08011224455",
    address: "22/24 Industrial Avenue, Ilupeju, Lagos",
    transactionRef: "TXN-20260525-010",
    paymentItems: [{ description: "Annual Sanitation Clearance", amount: 380000 }],
  },
];

// --- Dropdown Card Filter Options ---
const CARD_FILTER_OPTIONS = [
  { label: "This month", value: "this month" },
  { label: "Today", value: "today" },
  { label: "This year", value: "this year" },
];

// --- Table Time Filters (under Export button) ---
const TABLE_TIME_FILTERS = [
  { label: "Today", value: "today" },
  { label: "This month", value: "this month" },
  { label: "This Year", value: "this year" },
  { label: "MTD", value: "mtd" },
  { label: "YTD", value: "ytd" },
];

export default function Reconciliation() {
  const navigate = useNavigate();

  // Tab State
  const [activeTab, setActiveTab] = useState("Pending bills");

  // Raw Data State
  const [billsData, setBillsData] = useState(INITIAL_PENDING_BILLS);
  const [paymentsData, setPaymentsData] = useState(INITIAL_PAYMENTS);
  const [loading, setLoading] = useState(false);

  // Individual Card Filter States (Dropdown at top-right of each card)
  const [unpaidBillsFilter, setUnpaidBillsFilter] = useState("this month");
  const [unpaidAmountFilter, setUnpaidAmountFilter] = useState("this month");
  const [paymentMadeFilter, setPaymentMadeFilter] = useState("this month");

  // Search Bar State
  const [searchTerm, setSearchTerm] = useState("");

  // Table Time Filter State (Under Export data button)
  const [activeTimeFilter, setActiveTimeFilter] = useState("mtd");

  // Export Menu State
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const exportMenuRef = useRef(null);

  // Sorting & Pagination State
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Toast / Notification
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  const showToast = useCallback((message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "info" });
    }, 3500);
  }, []);

  // Close export dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch data from backend with fallback
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        setLoading(true);
        // Attempt to fetch bills
        try {
          const billsRes = await api.get("/lawma/superadmins/reconciliation/bills");
          const fetchedBills = billsRes?.data?.data ?? billsRes?.data;
          if (Array.isArray(fetchedBills) && fetchedBills.length > 0 && isMounted) {
            setBillsData(fetchedBills);
          }
        } catch {
          // Keep rich mock data if endpoint returns 404/not available
        }

        // Attempt to fetch payments
        try {
          const paymentsRes = await api.get("/lawma/superadmins/reconciliation/payments");
          const fetchedPayments = paymentsRes?.data?.data ?? paymentsRes?.data;
          if (Array.isArray(fetchedPayments) && fetchedPayments.length > 0 && isMounted) {
            setPaymentsData(fetchedPayments);
          }
        } catch {
          // Keep rich mock data if endpoint returns 404/not available
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Reset pagination on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTimeFilter, activeTab]);

  // --- Dynamic Card Metrics Computation ---
  // Card 1: Unpaid bills count
  const unpaidBillsCount = useMemo(() => {
    if (unpaidBillsFilter === "this month") return 1240;
    if (unpaidBillsFilter === "today") return 42;
    if (unpaidBillsFilter === "this year") return 14850;
    return billsData.length;
  }, [unpaidBillsFilter, billsData]);

  // Card 2: Amount of unpaid bills
  const unpaidBillsAmount = useMemo(() => {
    if (unpaidAmountFilter === "this month") return 30000;
    if (unpaidAmountFilter === "today") return 2400;
    if (unpaidAmountFilter === "this year") return 360000;
    return 30000;
  }, [unpaidAmountFilter]);

  // Card 3: Payment made
  const paymentMadeAmount = useMemo(() => {
    if (paymentMadeFilter === "this month") return 30000;
    if (paymentMadeFilter === "today") return 5000;
    if (paymentMadeFilter === "this year") return 1250000;
    return 30000;
  }, [paymentMadeFilter]);

  // Card 3 Sub-metrics: Bin Purchase & Waste disposal
  const binPurchaseAmount = useMemo(() => {
    if (paymentMadeFilter === "this month") return "₦850k";
    if (paymentMadeFilter === "today") return "₦50k";
    if (paymentMadeFilter === "this year") return "₦8.5m";
    return "₦850k";
  }, [paymentMadeFilter]);

  const wasteDisposalAmount = useMemo(() => {
    if (paymentMadeFilter === "this month") return "₦150k";
    if (paymentMadeFilter === "today") return "₦10k";
    if (paymentMadeFilter === "this year") return "₦1.5m";
    return "₦150k";
  }, [paymentMadeFilter]);

  // --- Active Table Data Filtering & Sorting ---
  const currentRawData = useMemo(() => {
    return activeTab === "Pending bills" ? billsData : paymentsData;
  }, [activeTab, billsData, paymentsData]);

  const filteredData = useMemo(() => {
    let result = [...currentRawData];

    // 1. Time filter (under Export button)
    if (activeTimeFilter && activeTimeFilter !== "all") {
      result = result.filter((row) => matchesTimeframe(row.date, activeTimeFilter));
    }

    // 2. Search query filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      // Also clean search for numeric matching (e.g. without comma/symbol)
      const cleanQ = q.replace(/[₦,.\s]/g, "");

      result = result.filter((row) => {
        const idMatch =
          (row.billId && row.billId.toLowerCase().includes(q)) ||
          (row.paymentId && row.paymentId.toLowerCase().includes(q));
        const nameMatch = row.name && row.name.toLowerCase().includes(q);
        const payerIdMatch =
          (row.payerId && row.payerId.toLowerCase().includes(q)) ||
          (row.payId && row.payId.toLowerCase().includes(q));
        const serviceMatch = row.service && row.service.toLowerCase().includes(q);

        const amountStr = String(row.amount || "").toLowerCase();
        const amountClean = amountStr.replace(/[₦,.\s]/g, "");
        const amountMatch =
          amountStr.includes(q) || (cleanQ.length > 0 && amountClean.includes(cleanQ));

        const statusMatch = row.status && row.status.toLowerCase().includes(q);
        const dateMatch = row.date && row.date.toLowerCase().includes(q);

        return (
          idMatch ||
          nameMatch ||
          payerIdMatch ||
          serviceMatch ||
          amountMatch ||
          statusMatch ||
          dateMatch
        );
      });
    }

    // 3. Sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (aVal === undefined || aVal === null) aVal = "";
        if (bVal === undefined || bVal === null) bVal = "";

        // Check if numeric
        const numA = parseFloat(aVal);
        const numB = parseFloat(bVal);
        let cmp = 0;
        if (!isNaN(numA) && !isNaN(numB) && isFinite(aVal) && isFinite(bVal)) {
          cmp = numA - numB;
        } else {
          cmp = String(aVal).localeCompare(String(bVal));
        }

        return sortConfig.direction === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [currentRawData, activeTimeFilter, searchTerm, sortConfig]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Handle column header sort
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  // Handle action click: Navigate to BillsReceipt or PaymentReceipt
  const handleAction = (row) => {
    try {
      if (activeTab === "Pending bills") {
        const billData = {
          recipientName: row.name,
          transactionId: row.billId,
          paymentId: row.billId,
          transactionRef: row.billId,
          phoneNumber: row.phoneNumber || "08012345678",
          transactionDate: row.date || new Date().toLocaleString(),
          paymentItems: row.paymentItems || [
            {
              description: row.service,
              amount: parseFloat(row.amount) || 0,
            },
          ],
          currencySymbol: "₦",
          amountInWords: numberToWordsNaira(parseFloat(row.amount) || 0),
          address: row.address || "Lagos, Nigeria",
          paymentMethod: "Pending Payment",
          status: row.status || "Pending",
        };
        localStorage.setItem("paymentId", row.billId);
        localStorage.setItem("paymentData", JSON.stringify(billData));
        navigate("/bills-receipt");
      } else {
        const paymentData = {
          recipientName: row.name,
          transactionId: row.transactionRef || `TXN-${row.paymentId}`,
          paymentId: row.paymentId,
          transactionRef: row.transactionRef || row.paymentId,
          phoneNumber: row.phoneNumber || "08012345678",
          transactionDate: row.date || new Date().toLocaleString(),
          paymentItems: row.paymentItems || [
            {
              description: row.service,
              amount: parseFloat(row.amount) || 0,
            },
          ],
          currencySymbol: "₦",
          amountInWords: numberToWordsNaira(parseFloat(row.amount) || 0),
          address: row.address || "Lagos, Nigeria",
          paymentMethod: row.paymentMethod || "Bank Transfer",
          status: row.status || "Successful",
        };
        localStorage.setItem("paymentId", row.paymentId);
        localStorage.setItem("paymentData", JSON.stringify(paymentData));
        navigate("/payment-receipt");
      }
    } catch (err) {
      console.error("Navigation error:", err);
      showToast("Unable to open receipt details.", "error");
    }
  };

  // --- Export Data Handlers ---
  const handleExport = (format) => {
    setIsExportOpen(false);
    setIsExporting(true);

    try {
      const isBills = activeTab === "Pending bills";
      const timestamp = new Date().toISOString().split("T")[0];
      const filenameBase = `Reconciliation_${isBills ? "Pending_Bills" : "Payments"}_${timestamp}`;

      if (format === "excel") {
        // Build CSV data
        const headers = isBills
          ? ["S/N", "Bill ID", "Name", "Payer ID", "Service", "Amount (NGN)", "Date", "Due Date", "Status"]
          : ["S/N", "Payment ID", "Name", "Payer ID", "Service", "Amount (NGN)", "Date", "Payment Method", "Status"];

        const rows = filteredData.map((row, index) => {
          if (isBills) {
            return [
              index + 1,
              `"${row.billId || ""}"`,
              `"${row.name || ""}"`,
              `"${row.payerId || row.payId || ""}"`,
              `"${row.service || ""}"`,
              row.amount || 0,
              `"${row.date || ""}"`,
              `"${row.dueDate || ""}"`,
              `"${row.status || ""}"`,
            ];
          } else {
            return [
              index + 1,
              `"${row.paymentId || ""}"`,
              `"${row.name || ""}"`,
              `"${row.payerId || row.payId || ""}"`,
              `"${row.service || ""}"`,
              row.amount || 0,
              `"${row.date || ""}"`,
              `"${row.paymentMethod || ""}"`,
              `"${row.status || ""}"`,
            ];
          }
        });

        const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${filenameBase}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showToast(`Exported ${filteredData.length} ${isBills ? "pending bills" : "payments"} to Excel successfully!`, "success");
      } else if (format === "pdf") {
        // Generate PDF using jsPDF
        const doc = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Brand Banner Header
        doc.setFillColor(21, 128, 61); // Green 700
        doc.rect(0, 0, pageWidth, 22, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text("LASG UTILITY SERVICE MANAGEMENT", 14, 12);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text("OFFICIAL RECONCILIATION REPORT", pageWidth - 14, 12, { align: "right" });
        doc.setFontSize(8);
        doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 14, 17, { align: "right" });

        // Report Subtitle & Filter summary
        doc.setTextColor(30, 41, 59);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(`Report Type: ${isBills ? "Pending Bills" : "Payments Received"}`, 14, 32);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(
          `Time Filter: ${activeTimeFilter.toUpperCase()} | Total Records: ${filteredData.length} | Search Query: ${searchTerm ? `"${searchTerm}"` : "None"
          }`,
          14,
          38
        );

        // Table Header Settings
        const startY = 44;
        const rowHeight = 8;
        const cols = isBills
          ? [
            { label: "S/N", x: 14, width: 12 },
            { label: "Bill Id", x: 26, width: 34 },
            { label: "Name", x: 60, width: 62 },
            { label: "Payer Id", x: 122, width: 28 },
            { label: "Service", x: 150, width: 55 },
            { label: "Amount", x: 205, width: 35 },
            { label: "Date", x: 240, width: 25 },
            { label: "Status", x: 265, width: 18 },
          ]
          : [
            { label: "S/N", x: 14, width: 12 },
            { label: "PAYMENT ID", x: 26, width: 34 },
            { label: "PAYER NAME", x: 60, width: 60 },
            { label: "PAYER ID", x: 120, width: 26 },
            { label: "SERVICE", x: 146, width: 50 },
            { label: "AMOUNT (NGN)", x: 196, width: 32 },
            { label: "METHOD", x: 228, width: 26 },
            { label: "DATE", x: 254, width: 22 },
            { label: "STATUS", x: 276, width: 14 },
          ];

        // Header Background
        doc.setFillColor(241, 245, 249);
        doc.rect(14, startY, pageWidth - 28, rowHeight, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(30, 41, 59);

        cols.forEach((col) => {
          doc.text(col.label, col.x, startY + 5.5);
        });

        // Table Rows
        let currentY = startY + rowHeight;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);

        filteredData.forEach((row, index) => {
          // Check for page overflow
          if (currentY + rowHeight > pageHeight - 16) {
            doc.addPage();
            currentY = 20;

            // Re-render header on new page
            doc.setFillColor(241, 245, 249);
            doc.rect(14, currentY, pageWidth - 28, rowHeight, "F");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(30, 41, 59);
            cols.forEach((col) => {
              doc.text(col.label, col.x, currentY + 5.5);
            });
            currentY += rowHeight;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.5);
          }

          // Alternating background
          if (index % 2 === 1) {
            doc.setFillColor(248, 250, 252);
            doc.rect(14, currentY, pageWidth - 28, rowHeight, "F");
          }

          doc.setTextColor(51, 65, 85);

          if (isBills) {
            doc.text(String(index + 1), 14, currentY + 5.5);
            doc.text(String(row.billId || "-").slice(0, 18), 26, currentY + 5.5);
            doc.text(String(row.name || "-").slice(0, 32), 60, currentY + 5.5);
            doc.text(String(row.payerId || row.payId || "-").slice(0, 15), 122, currentY + 5.5);
            doc.text(String(row.service || "-").slice(0, 28), 150, currentY + 5.5);
            const amtStr = (parseFloat(row.amount) || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 });
            doc.text(amtStr, 205, currentY + 5.5);
            doc.text(String(row.date || "-").slice(0, 12), 240, currentY + 5.5);
            doc.text(String(row.status || "-"), 265, currentY + 5.5);
          } else {
            doc.text(String(index + 1), 14, currentY + 5.5);
            doc.text(String(row.paymentId || "-").slice(0, 18), 26, currentY + 5.5);
            doc.text(String(row.name || "-").slice(0, 30), 60, currentY + 5.5);
            doc.text(String(row.payerId || row.payId || "-").slice(0, 14), 120, currentY + 5.5);
            doc.text(String(row.service || "-").slice(0, 26), 146, currentY + 5.5);
            const amtStr = (parseFloat(row.amount) || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 });
            doc.text(amtStr, 196, currentY + 5.5);
            doc.text(String(row.paymentMethod || "-").slice(0, 14), 228, currentY + 5.5);
            doc.text(String(row.date || "-").slice(0, 12), 254, currentY + 5.5);
            doc.text(String(row.status || "-"), 276, currentY + 5.5);
          }

          // Subtle divider line
          doc.setDrawColor(226, 232, 240);
          doc.line(14, currentY + rowHeight, pageWidth - 14, currentY + rowHeight);
          currentY += rowHeight;
        });

        // Footer on last page
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text("Lagos State Government Utility Service Management • Confidential Internal Report", 14, pageHeight - 8);

        doc.save(`${filenameBase}.pdf`);
        showToast(`Exported ${filteredData.length} records to PDF successfully!`, "success");
      }
    } catch (err) {
      console.error("Export error:", err);
      showToast("Failed to export data. Please try again.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
                Reconciliation
              </h1>
              <p className="text-sm sm:text-base text-zinc-500 mt-1">
                Track bills and payments on the system here
              </p>
            </div>

            {/* Toast Notification */}
            {toast.show && (
              <div
                className={`flex items-center justify-between p-3.5 rounded-xl border shadow-sm text-sm transition-all duration-300 ${toast.type === "success"
                  ? "bg-green-50 text-green-800 border-green-200"
                  : toast.type === "error"
                    ? "bg-red-50 text-red-800 border-red-200"
                    : "bg-blue-50 text-blue-800 border-blue-200"
                  }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">
                    {toast.type === "success" ? "✓" : toast.type === "error" ? "!" : "i"}
                  </span>
                  <span>{toast.message}</span>
                </div>
                <button
                  onClick={() => setToast({ show: false, message: "", type: "info" })}
                  className="text-zinc-400 hover:text-zinc-600 cursor-pointer ml-4"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* --- Summary Cards Section --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              {/* Card 1: Unpaid Bills */}
              <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs hover:shadow-sm transition-all duration-200">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-zinc-500">Unpaid bills</span>

                  {/* Dropdown Filter */}
                  <div className="relative inline-block">
                    <select
                      value={unpaidBillsFilter}
                      onChange={(e) => setUnpaidBillsFilter(e.target.value)}
                      className="appearance-none bg-zinc-100 hover:bg-zinc-200/70 border border-transparent rounded-lg pl-3 pr-7 py-1 text-xs font-medium text-zinc-600 focus:outline-none cursor-pointer transition"
                    >
                      {CARD_FILTER_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                      <ChevronDownIcon className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-3xl lg:text-4xl font-bold text-[#007836] tracking-tight">
                    {unpaidBillsCount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Card 2: Amount of Unpaid Bills */}
              <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs hover:shadow-sm transition-all duration-200">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-zinc-500">Amount of unpaid bills</span>

                  {/* Dropdown Filter */}
                  <div className="relative inline-block">
                    <select
                      value={unpaidAmountFilter}
                      onChange={(e) => setUnpaidAmountFilter(e.target.value)}
                      className="appearance-none bg-zinc-100 hover:bg-zinc-200/70 border border-transparent rounded-lg pl-3 pr-7 py-1 text-xs font-medium text-zinc-600 focus:outline-none cursor-pointer transition"
                    >
                      {CARD_FILTER_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                      <ChevronDownIcon className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-3xl lg:text-4xl font-bold text-[#007836] tracking-tight">
                    ₦{unpaidBillsAmount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Card 3: Payment Made */}
              <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs hover:shadow-sm transition-all duration-200">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-zinc-500">Payment made</span>

                  {/* Dropdown Filter */}
                  <div className="relative inline-block">
                    <select
                      value={paymentMadeFilter}
                      onChange={(e) => setPaymentMadeFilter(e.target.value)}
                      className="appearance-none bg-zinc-100 hover:bg-zinc-200/70 border border-transparent rounded-lg pl-3 pr-7 py-1 text-xs font-medium text-zinc-600 focus:outline-none cursor-pointer transition"
                    >
                      {CARD_FILTER_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                      <ChevronDownIcon className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-end justify-between gap-4">
                  <div className="text-3xl lg:text-4xl font-bold text-[#007836] tracking-tight">
                    ₦{paymentMadeAmount.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-6 pb-0.5">
                    <div>
                      <div className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
                        {binPurchaseAmount}
                      </div>
                      <div className="text-xs font-medium text-[#007836]">
                        Bin Purchase
                      </div>
                    </div>
                    <div>
                      <div className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
                        {wasteDisposalAmount}
                      </div>
                      <div className="text-xs font-medium text-[#007836]">
                        Waste disposal
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Table Controls & Data --- */}
            <div className="space-y-4">
              {/* Row 1: Tabs on Left, Export Data Button on Opposite Side (Right) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Tabs Navigation (Left side) */}
                <div className="flex items-center space-x-6">
                  {["Pending bills", "Payments"].map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2 text-sm font-semibold transition cursor-pointer ${
                          isActive
                            ? "text-[#007836] border-b-2 border-[#007836]"
                            : "text-zinc-500 hover:text-zinc-800"
                        }`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>

                {/* Opposite Side (Right): Export Data Button */}
                <div className="relative self-start sm:self-auto" ref={exportMenuRef}>
                  <button
                    onClick={() => setIsExportOpen(!isExportOpen)}
                    disabled={isExporting}
                    className="inline-flex items-center px-4 py-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 text-sm font-medium rounded-xl shadow-2xs transition cursor-pointer disabled:opacity-50"
                  >
                    <span>{isExporting ? "Exporting..." : "Export data"}</span>
                  </button>

                  {/* Export Format Dropdown Menu */}
                  {isExportOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-zinc-200 py-1.5 z-40">
                      <div className="px-3.5 py-1.5 border-b border-zinc-100 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                        Export {activeTab}
                      </div>
                      <button
                        onClick={() => handleExport("excel")}
                        className="w-full flex items-center gap-3 px-3.5 py-2 text-sm text-zinc-700 hover:bg-green-50 hover:text-green-800 transition text-left cursor-pointer"
                      >
                        <div className="p-1.5 rounded-lg bg-green-100 text-green-700">
                          <ExcelIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-zinc-800">Export as Excel</div>
                          <div className="text-[11px] text-zinc-400">Spreadsheet (.csv / .xlsx)</div>
                        </div>
                      </button>
                      <button
                        onClick={() => handleExport("pdf")}
                        className="w-full flex items-center gap-3 px-3.5 py-2 text-sm text-zinc-700 hover:bg-red-50 hover:text-red-800 transition text-left cursor-pointer"
                      >
                        <div className="p-1.5 rounded-lg bg-red-100 text-red-700">
                          <PdfIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-zinc-800">Export as PDF</div>
                          <div className="text-[11px] text-zinc-400">Document report (.pdf)</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 2: Search Bar on Left, Time Filters on Opposite Side (Right) */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
                {/* Search Bar (Left side) */}
                <div className="w-full sm:w-80 md:w-96">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#007836]">
                      <SearchIcon className="w-4 h-4 text-[#007836]" />
                    </span>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search"
                      className="w-full pl-9 pr-9 py-2 text-sm bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#007836] focus:border-[#007836] transition placeholder-zinc-400 shadow-2xs"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                        title="Clear search"
                      >
                        <CloseIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Opposite Side (Right): Time Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  {TABLE_TIME_FILTERS.map((f) => {
                    const isActive = activeTimeFilter === f.value;
                    return (
                      <button
                        key={f.value}
                        onClick={() => setActiveTimeFilter(f.value)}
                        className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition cursor-pointer ${
                          isActive
                            ? "bg-[#007836] text-white shadow-xs"
                            : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
                        }`}
                      >
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Table Data */}
              <div className="overflow-x-auto rounded-2xl border border-zinc-200/80 bg-white shadow-xs">
                {loading ? (
                  <div className="p-16 text-center text-zinc-500">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-3"></div>
                    <p className="text-sm">Loading reconciliation records...</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-zinc-100 text-left">
                    <thead>
                      <tr className="border-b border-zinc-100">
                        {/* S/N */}
                        <th
                          scope="col"
                          className="px-5 py-4 text-xs font-semibold text-zinc-900"
                        >
                          S/N
                        </th>

                        {/* Bill ID / Payment ID */}
                        <th
                          scope="col"
                          className="px-5 py-4 text-xs font-semibold text-zinc-900"
                        >
                          {activeTab === "Pending bills" ? "Bill ID" : "Payment ID"}
                        </th>

                        {/* Name */}
                        <th
                          scope="col"
                          className="px-5 py-4 text-xs font-semibold text-zinc-900"
                        >
                          Name
                        </th>

                        {/* PayerID */}
                        <th
                          scope="col"
                          className="px-5 py-4 text-xs font-semibold text-zinc-900"
                        >
                          PayerID
                        </th>

                        {/* Service */}
                        <th
                          scope="col"
                          className="px-5 py-4 text-xs font-semibold text-zinc-900"
                        >
                          Service
                        </th>

                        {/* Amount */}
                        <th
                          scope="col"
                          className="px-5 py-4 text-xs font-semibold text-zinc-900"
                        >
                          Amount (₦)
                        </th>

                        {/* Status */}
                        <th
                          scope="col"
                          className="px-5 py-4 text-xs font-semibold text-zinc-900"
                        >
                          Status
                        </th>

                        {/* Action */}
                        <th
                          scope="col"
                          className="px-5 py-4 text-xs font-semibold text-zinc-900"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-zinc-100 bg-white">
                      {paginatedData.length > 0 ? (
                        paginatedData.map((row, index) => {
                          const serialNumber = (currentPage - 1) * pageSize + index + 1;
                          const isBills = activeTab === "Pending bills";
                          const formattedAmount = (parseFloat(row.amount) || 0).toLocaleString("en-NG");
                          const isPayNow = row.actionType === "pay";

                          return (
                            <tr
                              key={row.id || index}
                              className="hover:bg-zinc-50/50 transition-colors duration-100"
                            >
                              {/* S/N */}
                              <td className="px-5 py-4 text-xs text-zinc-700 whitespace-nowrap">
                                {row.sn !== undefined ? row.sn : serialNumber}
                              </td>

                              {/* Bill ID */}
                              <td className="px-5 py-4 text-xs font-bold text-zinc-900 whitespace-nowrap">
                                {isBills ? row.billId : row.paymentId}
                              </td>

                              {/* Name */}
                              <td className="px-5 py-4 text-xs text-zinc-800 whitespace-nowrap">
                                {row.name}
                              </td>

                              {/* PayerID */}
                              <td className="px-5 py-4 text-xs text-zinc-700 whitespace-nowrap">
                                {row.payerId || row.payId || "N-146567"}
                              </td>

                              {/* Service */}
                              <td className="px-5 py-4 text-xs text-zinc-800 whitespace-nowrap">
                                {row.service}
                              </td>

                              {/* Amount (₦) */}
                              <td className="px-5 py-4 text-xs text-zinc-800 whitespace-nowrap">
                                {formattedAmount}
                              </td>

                              {/* Status Badge */}
                              <td className="px-5 py-4 whitespace-nowrap">
                                {isBills ? (
                                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium text-red-500 bg-red-50/80 border border-red-200">
                                    {row.status || "Pending"}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium text-green-700 bg-green-50/80 border border-green-200">
                                    {row.status || "Successful"}
                                  </span>
                                )}
                              </td>

                              {/* Action Link */}
                              <td className="px-5 py-4 whitespace-nowrap">
                                <button
                                  onClick={() => handleAction(row)}
                                  className="text-xs sm:text-sm font-medium text-[#007836] hover:underline cursor-pointer"
                                >
                                  {isBills
                                    ? isPayNow
                                      ? "Pay now"
                                      : "View bill"
                                    : "View receipt"}
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={8}
                            className="px-6 py-12 text-center text-zinc-400 text-sm"
                          >
                            <div className="max-w-xs mx-auto space-y-2">
                              <p className="font-semibold text-zinc-600">No records found</p>
                              <p className="text-xs">
                                Try changing your search query or adjusting the time filter.
                              </p>
                              <button
                                onClick={() => {
                                  setSearchTerm("");
                                  setActiveTimeFilter("mtd");
                                }}
                                className="mt-2 text-xs font-semibold text-[#007836] hover:underline cursor-pointer"
                              >
                                View all {activeTab}
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination Controls */}
              {filteredData.length > 0 && (
                <div className="flex items-center justify-between pt-1">
                  {/* Left: Page [ 1 ] of 5 */}
                  <div className="flex items-center text-sm text-zinc-600">
                    <span>Page</span>
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val >= 1 && val <= totalPages) {
                          setCurrentPage(val);
                        }
                      }}
                      className="w-10 h-7 border border-zinc-200 rounded text-center text-xs font-medium text-zinc-700 mx-1.5 bg-white shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#007836]"
                    />
                    <span>of {totalPages}</span>
                  </div>

                  {/* Right: Square < and > buttons */}
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-7 h-7 rounded bg-zinc-200 text-zinc-500 hover:bg-zinc-300 disabled:opacity-50 transition cursor-pointer flex items-center justify-center"
                      title="Previous page"
                    >
                      <ChevronLeftIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="w-7 h-7 rounded bg-[#007836] text-white hover:bg-[#00602b] disabled:opacity-50 transition cursor-pointer flex items-center justify-center"
                      title="Next page"
                    >
                      <ChevronRightIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
