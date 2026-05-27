import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/LawmaAdmin/Sidebar";
import Topbar from "../components/LawmaAdmin/Topbar";
import { SearchIcon, LoadingSpinnerIcon } from "../components/icons";
import { fetchPSPs, createPSP, deactivatePSP, activatePSP, fetchMembers, changePSPStatus } from "../api/pspApi";
import api from "../api/apiConfig";
import PSPManagementSkeletonLoader from "../components/PSPManagementSkeletonLoader";

// --- MOCK DATA & API ---
// Extracted from the image, to be used as a fallback.
const mockPspData = [
  {
    id: 1,
    companyName: "Bolaji & Co.",
    adminName: "Olabanire Kolawole",
    lga: "Lekki/LCDA",
    dateAdded: "2025-09-25",
    status: "Active",
    address: "Step 2, Nkeuku Rd, Oweri, Lekki",
    phone: "08183294578",
    amacNo: "AMA/COS/124",
    wasteDisposed: 142,
    collectionMethod: "LLC",
  },
  {
    id: 2,
    companyName: "Solar Waste Ltd.",
    adminName: "Adebayo Funmi",
    lga: "Ikeja",
    dateAdded: "2025-09-25",
    status: "Active",
    address: "123 Allen Avenue, Ikeja, Lagos",
    phone: "08012345678",
    amacNo: "AMA/IKE/125",
    wasteDisposed: 200,
    collectionMethod: "Door-to-door",
  },
  {
    id: 3,
    companyName: "GreenScape Inc.",
    adminName: "Chidi Okoro",
    lga: "Ikorodu",
    dateAdded: "2025-09-25",
    status: "Active",
    address: "456 Sagamu Road, Ikorodu, Lagos",
    phone: "08023456789",
    amacNo: "AMA/IKO/126",
    wasteDisposed: 180,
    collectionMethod: "LLC",
  },
  {
    id: 4,
    companyName: "Metro Cleaners",
    adminName: "Fatima Bello",
    lga: "Surulere",
    dateAdded: "2025-09-24",
    status: "Active",
    address: "789 Bode Thomas, Surulere, Lagos",
    phone: "08034567890",
    amacNo: "AMA/SUR/127",
    wasteDisposed: 250,
    collectionMethod: "Community Bin",
  },
  {
    id: 5,
    companyName: "Eco Warriors",
    adminName: "Samson Adeoye",
    lga: "Apapa",
    dateAdded: "2025-09-23",
    status: "Inactive",
    address: "101 Warehouse Rd, Apapa, Lagos",
    phone: "08045678901",
    amacNo: "AMA/APA/128",
    wasteDisposed: 95,
    collectionMethod: "LLC",
  },
  {
    id: 6,
    companyName: "Waste Masters",
    adminName: "Ngozi Eze",
    lga: "Epe",
    dateAdded: "2025-09-22",
    status: "Active",
    address: "212 Marina Rd, Epe, Lagos",
    phone: "08056789012",
    amacNo: "AMA/EPE/129",
    wasteDisposed: 130,
    collectionMethod: "Door-to-door",
  },
  {
    id: 7,
    companyName: "City Recyclers",
    adminName: "Ibrahim Musa",
    lga: "Badagry",
    dateAdded: "2025-09-21",
    status: "Active",
    address: "321 Seme Border Rd, Badagry, Lagos",
    phone: "08067890123",
    amacNo: "AMA/BAD/130",
    wasteDisposed: 160,
    collectionMethod: "LLC",
  },
];

// Mock API query that simulates a network request. It has a 20% chance of failing.
const fetchPspsApi = () => {
  console.log("Fetching data from API...");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.2) {
        console.log("API call successful.");
        resolve(JSON.parse(JSON.stringify(mockPspData)));
      } else {
        console.error("API call failed.");
        reject(new Error("Failed to fetch data from the server."));
      }
    }, 1000); // 1-second delay
  });
};

// --- SVG ICONS (Raw from Heroicons) ---

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
  </svg>
);
const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 mr-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.572a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
    />
  </svg>
);
// const SearchIcon = () => (
//     <svg
//         xmlns="http://www.w3.org/2000/svg"
//         fill="none"
//         viewBox="0 0 24 24"
//         strokeWidth={1.5}
//         stroke="currentColor"
//         className="w-5 h-5 text-zinc-400"
//     >
//         <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
//         />
//     </svg>
// );
const EllipsisVerticalIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
  </svg>
);
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
const SuccessIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-16 h-16 text-green-700"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const FailureIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-16 h-16 text-red-600"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
    />
  </svg>
);
const ChevronUpDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4 ml-1 inline-block text-zinc-400"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
    />
  </svg>
);
const ChevronUpIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4 ml-1 inline-block"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 15.75l7.5-7.5 7.5 7.5"
    />
  </svg>
);
const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-4 h-4 ml-1 inline-block"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
    />
  </svg>
);
const ExportIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 mr-2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 10.5v6m-7.071-2.929l.707-.707A5.002 5.002 0 0112 8.5a5 5 0 013.536 1.464l.707.707m-1.414 0a7.5 7.5 0 00-10.606 0m10.606 0a7.5 7.5 0 00-10.606 0"
    />
  </svg>
);

// --- MAIN COMPONENT ---
function PSPManagement() {
  const [psps, setPsps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
  const [isFailureModalOpen, setFailureModalOpen] = useState(false);
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);
  const [isDeactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [isActivateModalOpen, setActivateModalOpen] = useState(false);

  // Data interaction states
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    lga: "",
    dateFrom: "",
    dateTo: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "companyName",
    direction: "ascending",
  });
  const [openMenuId, setOpenMenuId] = useState(null);

  const [selectedPsp, setSelectedPsp] = useState(null);
  const [pspToDeactivate, setPspToDeactivate] = useState(null);
  const [pspToActivate, setPspToActivate] = useState(null);
  const [newPsp, setNewPsp] = useState({
    companyName: "",
    adminName: "",
    adminEmail: "",
    phone: "",
    lga: "",
    lgaId: "",
    address: "",
  });

  // LGA data state
  const [lgas, setLgas] = useState([]);
  const [loadingLgas, setLoadingLgas] = useState(false);

  // PSP creation loading state
  const [isCreatingPsp, setIsCreatingPsp] = useState(false);

  // Member counts state
  const [memberCounts, setMemberCounts] = useState({});

  const actionMenuRef = useRef(null);
  const navigate = useNavigate();

  // Custom date formatting functions
  const formatDateTable = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  };



  // Fetch LGAs
  const loadLgas = useCallback(async () => {
    setLoadingLgas(true);
    try {
      const { data } = await api.get('/psps/lgas');
      const lgaList = Array.isArray(data) ? data : data?.data || [];
      setLgas(lgaList);
    } catch (error) {
      console.error('Error fetching LGAs:', error);
      // Fallback to mock LGAs if API fails
      setLgas([
        { id: 1, name: "Lekki/LCDA" },
        { id: 2, name: "Ikeja" },
        { id: 3, name: "Ikorodu" },
        { id: 4, name: "Surulere" },
        { id: 5, name: "Apapa" },
        { id: 6, name: "Epe" },
        { id: 7, name: "Badagry" },
        { id: 8, name: "Alimosho" },
        { id: 9, name: "Kosofe" },
        { id: 10, name: "Mushin" }
      ]);
    } finally {
      setLoadingLgas(false);
    }
  }, []);

  // Fetch member counts for all PSPs
  const loadMemberCounts = useCallback(async (pspList) => {
    const counts = {};
    try {
      // Fetch member counts for each PSP in parallel
      const memberPromises = pspList.map(async (psp) => {
        try {
          const response = await fetchMembers(psp.id);
          let memberData = [];

          // Handle different response formats
          if (Array.isArray(response)) {
            memberData = response;
          } else if (response && Array.isArray(response.data)) {
            memberData = response.data;
          } else if (response && Array.isArray(response.members)) {
            memberData = response.members;
          } else if (response && Array.isArray(response.results)) {
            memberData = response.results;
          }

          return { pspId: psp.id, count: memberData.length };
        } catch (error) {
          console.warn(`Failed to fetch members for PSP ${psp.id}:`, error);
          return { pspId: psp.id, count: 0 };
        }
      });

      const results = await Promise.all(memberPromises);
      results.forEach(({ pspId, count }) => {
        counts[pspId] = count;
      });

      setMemberCounts(counts);
    } catch (error) {
      console.error("Error loading member counts:", error);
    }
  }, []);

  // Fetch data
  const loadPsps = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchPSPs()
      .then((data) => {
        const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        const normalized = list.map((item) => ({
          id: item.id || item._id || item.pspId,
          companyName: item.companyName || item.company_name || "",
          adminName: item.adminName || item.administrator_name || item.admin?.name || "",
          lga: item.lga || item.lgaName || item.lga_address || item.lgaLcda || "",
          dateAdded: (item.dateAdded || item.createdAt || new Date().toISOString()).slice(0, 10),
          status: typeof item.status === "string"
            ? item.status
            : (item.status?.active ? "Active" : item.status?.state) || "Active",
          address: item.address || item.company_address || item.location?.address || "",
          phone: item.phone || item.administrator_phone || item.admin?.phone || "",
          amacNo: item.amacNo || item.lgaCode || "",
          wasteDisposed: item.wasteDisposed || 0,
          collectionMethod: item.collectionMethod || "",
        }));
        setPsps(normalized);
        // Load member counts after PSPs are loaded
        loadMemberCounts(normalized);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || err.message || "Failed to load PSPs");
        console.log("Fallback to mock data.");
        setPsps(JSON.parse(JSON.stringify(mockPspData)));
        setLoading(false);
      });
  }, [loadMemberCounts]);

  useEffect(() => {
    loadPsps();
    loadLgas();
  }, [loadPsps, loadLgas]);

  // Close action menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target)
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Data Processing (Filtering, Searching, Sorting)
  const processedPsps = useMemo(() => {
    let processedData = [...psps];

    // 1. Filtering
    processedData = processedData.filter((psp) => {
      const pspDate = new Date(psp.dateAdded);
      const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : null;
      const dateTo = filters.dateTo ? new Date(filters.dateTo) : null;

      return (
        (filters.status ? psp.status === filters.status : true) &&
        (filters.lga
          ? psp.lga.toLowerCase().includes(filters.lga.toLowerCase())
          : true) &&
        (dateFrom ? pspDate >= dateFrom : true) &&
        (dateTo ? pspDate <= dateTo : true)
      );
    });

    // 2. Searching
    if (searchQuery) {
      processedData = processedData.filter((psp) =>
        Object.values(psp).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // 3. Sorting
    if (sortConfig.key) {
      processedData.sort((a, b) => {
        // Handle numeric comparisons for wasteDisposed
        if (sortConfig.key === 'wasteDisposed') {
          const aVal = parseFloat(a.wasteDisposed) || 0;
          const bVal = parseFloat(b.wasteDisposed) || 0;
          if (aVal === bVal) return 0;
          return sortConfig.direction === "ascending" ? aVal - bVal : bVal - aVal;
        }

        // Handle other string comparisons
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    return processedData;
  }, [psps, filters, searchQuery, sortConfig]);

  // Handlers
  const handleOpenViewModal = (psp) => {
    setSelectedPsp(psp);
    setViewModalOpen(true);
    setOpenMenuId(null);
  };
  const handleCloseModals = () => {
    setAddModalOpen(false);
    setViewModalOpen(false);
    setSuccessModalOpen(false);
    setFailureModalOpen(false);
    setFilterModalOpen(false);
    setDeactivateModalOpen(false);
    setActivateModalOpen(false);
    setPspToDeactivate(null);
    setPspToActivate(null);
    // Reset form when closing modals
    setNewPsp({
      companyName: "",
      adminName: "",
      adminEmail: "",
      phone: "",
      lga: "",
      lgaId: "",
      address: "",
    });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPsp((p) => ({ ...p, [name]: value || "" }));
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((p) => ({ ...p, [name]: value }));
  };
  const resetFilters = () => {
    setFilters({ status: "", lga: "", dateFrom: "", dateTo: "" });
    handleCloseModals();
  };
  const toggleActionMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleAddPsp = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!newPsp.companyName || !newPsp.adminName || !newPsp.adminEmail || !newPsp.phone || !newPsp.lga || !newPsp.address) {
      setFailureModalOpen(true);
      setError("Please fill in all required fields");
      return;
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(newPsp.adminEmail)) {
      setFailureModalOpen(true);
      setError("Please enter a valid email address");
      return;
    }

    setIsCreatingPsp(true);
    try {
      // Format data according to backend API requirements
      const pspData = {
        company_name: newPsp.companyName,
        administrator_name: newPsp.adminName,
        administrator_email: newPsp.adminEmail,
        administrator_phone: newPsp.phone,
        lga_id: newPsp.lgaId,
        lga_address: newPsp.lga,
        company_address: newPsp.address
      };

      const { data } = await api.post('/psps', pspData);

      if (data.success) {
        setAddModalOpen(false);
        setSuccessModalOpen(true);
        loadPsps();
      } else {
        throw new Error(data.message || 'Failed to create PSP');
      }
    } catch (err) {
      setAddModalOpen(false);
      setFailureModalOpen(true);
      setError(err?.response?.data?.message || err.message || "Failed to create PSP");
    } finally {
      setIsCreatingPsp(false);
      setNewPsp({
        companyName: "",
        adminName: "",
        adminEmail: "",
        phone: "",
        lga: "",
        lgaId: "",
        address: "",
      });
      setTimeout(() => {
        setSuccessModalOpen(false);
        setFailureModalOpen(false);
      }, 3000);
    }
  };

  const handleDeactivatePsp = (psp) => {
    setPspToDeactivate(psp);
    setDeactivateModalOpen(true);
    setOpenMenuId(null);
  };

  const confirmDeactivatePsp = async () => {
    if (!pspToDeactivate) return;

    try {
      console.log(`Deactivating PSP: ${pspToDeactivate.companyName} (ID: ${pspToDeactivate.id})`);
      await changePSPStatus(pspToDeactivate.id, "Inactive");
      console.log(`Successfully deactivated PSP: ${pspToDeactivate.companyName}`);

      setPsps((prev) => prev.map((p) => (p.id === pspToDeactivate.id ? { ...p, status: "Inactive" } : p)));
      setDeactivateModalOpen(false);
      setPspToDeactivate(null);
    } catch (err) {
      console.error(`Failed to deactivate PSP ${pspToDeactivate.companyName}:`, err);
      setError(err?.response?.data?.message || err.message || "Failed to deactivate PSP");
      setDeactivateModalOpen(false);
      setPspToDeactivate(null);
    }
  };

  const handleActivatePsp = (psp) => {
    setPspToActivate(psp);
    setActivateModalOpen(true);
    setOpenMenuId(null);
  };

  const confirmActivatePsp = async () => {
    if (!pspToActivate) return;

    try {
      console.log(`Activating PSP: ${pspToActivate.companyName} (ID: ${pspToActivate.id})`);
      await changePSPStatus(pspToActivate.id, "Active");
      console.log(`Successfully activated PSP: ${pspToActivate.companyName}`);

      setPsps((prev) => prev.map((p) => (p.id === pspToActivate.id ? { ...p, status: "Active" } : p)));
      setActivateModalOpen(false);
      setPspToActivate(null);
    } catch (err) {
      console.error(`Failed to activate PSP ${pspToActivate.companyName}:`, err);
      setError(err?.response?.data?.message || err.message || "Failed to activate PSP");
      setActivateModalOpen(false);
      setPspToActivate(null);
    }
  };

  const handleExport = () => {
    const headers = [
      "ID",
      "Company Name",
      "Admin Name",
      "LGA",
      "Waste Disposed (kg)",
      "Date Added",
      "Status",
      "Phone",
      "Address",
    ];
    const rows = processedPsps.map((psp) =>
      [
        psp.id,
        psp.companyName,
        psp.adminName,
        psp.lga,
        psp.wasteDisposed || 0,
        psp.dateAdded,
        psp.status,
        psp.phone,
        psp.address,
      ].join(",")
    );
    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "psp_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const SortableHeader = ({ tkey, label }) => {
    const isSorted = sortConfig.key === tkey;
    return (
      <th
        scope="col"
        className="px-6 py-3 cursor-pointer hover:bg-zinc-100"
        onClick={() => handleSort(tkey)}
      >
        {label}
        {isSorted ? (
          sortConfig.direction === "ascending" ? (
            <ChevronUpIcon />
          ) : (
            <ChevronDownIcon />
          )
        ) : (
          <ChevronUpDownIcon />
        )}
      </th>
    );
  };

  const StatusBadge = ({ status }) => (
    <span
      className={`text-sm font-semibold capitalize ${status === "Active" || status === "active"
        ? "text-green-800"
        : "text-red-600"
        }`}
    >
      {status}
    </span>
  );

  return (
    <div className="flex h-screen bg-zinc-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className=" mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-zinc-800">PSPs</h1>
                <p className="text-zinc-500 mt-1">
                  View and manage PSP accounts
                </p>
              </div>
              <button
                onClick={() => setAddModalOpen(true)}
                className="mt-4 sm:mt-0 flex items-center justify-center gap-2 bg-green-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
              >
                <PlusIcon />
                On-board PSP
              </button>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setFilterModalOpen(true)}
                  className="flex group gap-3 items-center bg-white text-zinc-700 hover:text-green-800 px-4 py-2 rounded-lg border border-zinc-300 hover:bg-zinc-50 transition-colors"
                >
                  <span><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className='text-zinc-600 group-hover:text-green-700 transition-colors'>
                    <path d="M3.33398 4.99984C3.33398 4.5396 3.70708 4.1665 4.16732 4.1665H15.834C16.2942 4.1665 16.6673 4.5396 16.6673 4.99984C16.6673 5.46007 16.2942 5.83317 15.834 5.83317H4.16732C3.70708 5.83317 3.33398 5.46007 3.33398 4.99984Z" fill="currentColor" />
                    <path d="M5.00065 9.99984C5.00065 9.5396 5.37375 9.1665 5.83398 9.1665H14.1673C14.6276 9.1665 15.0007 9.5396 15.0007 9.99984C15.0007 10.4601 14.6276 10.8332 14.1673 10.8332H5.83398C5.37375 10.8332 5.00065 10.4601 5.00065 9.99984Z" fill="currentColor" />
                    <path d="M7.50065 14.1665C7.04041 14.1665 6.66732 14.5396 6.66732 14.9998C6.66732 15.4601 7.04041 15.8332 7.50065 15.8332H12.5007C12.9609 15.8332 13.334 15.4601 13.334 14.9998C13.334 14.5396 12.9609 14.1665 12.5007 14.1665H7.50065Z" fill="currentColor" />
                  </svg>
                  </span>
                  <span className="leading-none">Filter</span>
                </button>

                <div className="relative w-full max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon />

                  </div>
                  <input
                    type="text"
                    placeholder="Search here"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded-lg bg-white focus:ring-1 focus:ring-green-700 focus:border-green-700 outline-none"
                  />
                </div>
              </div>
              <div className="flex">
                <button
                  onClick={handleExport}
                  className="flex items-center text-sm bg-white text-zinc-700 px-4 py-2 rounded-lg border border-zinc-300 hover:bg-zinc-50 hover:text-green-700 transition-colors"
                >
                  Export Data
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <PSPManagementSkeletonLoader />
              ) : error ? (
                <div className="bg-white rounded-2xl shadow-sm p-6 text-center text-red-600">
                  <p>{error}</p>
                  <p className="text-zinc-500 text-sm">
                    Displaying cached mock data.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
                  <table className="w-full min-w-[900px] m-4 table-auto border-collapse">
                    <thead className="border-b border-zinc-200">
                      <tr>
                        <th className="lg:p-6 p-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider w-12 cursor-pointer" onClick={() => handleSort('id')}>
                          <div className="flex items-center">
                            S/N
                            {sortConfig.key === 'id' ? (
                              sortConfig.direction === 'ascending' ? (
                                <ChevronUpIcon />
                              ) : (
                                <ChevronDownIcon />
                              )
                            ) : (
                              <ChevronUpDownIcon />
                            )}
                          </div>
                        </th>
                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('companyName')}>
                          <div className="flex items-center">
                            Company Name
                            {sortConfig.key === 'companyName' ? (
                              sortConfig.direction === 'ascending' ? (
                                <ChevronUpIcon />
                              ) : (
                                <ChevronDownIcon />
                              )
                            ) : (
                              <ChevronUpDownIcon />
                            )}
                          </div>
                        </th>
                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider hidden md:table-cell">
                          Admin Name
                        </th>
                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('lga')}>
                          <div className="flex items-center">
                            LGA/LCDA
                            {sortConfig.key === 'lga' ? (
                              sortConfig.direction === 'ascending' ? (
                                <ChevronUpIcon />
                              ) : (
                                <ChevronDownIcon />
                              )
                            ) : (
                              <ChevronUpDownIcon />
                            )}
                          </div>
                        </th>
                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('wasteDisposed')}>
                          <div className="flex items-center">
                            Waste disposed
                            {sortConfig.key === 'wasteDisposed' ? (
                              sortConfig.direction === 'ascending' ? (
                                <ChevronUpIcon />
                              ) : (
                                <ChevronDownIcon />
                              )
                            ) : (
                              <ChevronUpDownIcon />
                            )}
                          </div>
                        </th>
                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer min-w-[120px]" onClick={() => handleSort('dateAdded')}>
                          <div className="flex items-center">
                            Date Added
                            {sortConfig.key === 'dateAdded' ? (
                              sortConfig.direction === 'ascending' ? (
                                <ChevronUpIcon />
                              ) : (
                                <ChevronDownIcon />
                              )
                            ) : (
                              <ChevronUpDownIcon />
                            )}
                          </div>
                        </th>
                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                          <div className="flex items-center">
                            Status
                            {sortConfig.key === 'status' ? (
                              sortConfig.direction === 'ascending' ? (
                                <ChevronUpIcon />
                              ) : (
                                <ChevronDownIcon />
                              )
                            ) : (
                              <ChevronUpDownIcon />
                            )}
                          </div>
                        </th>
                        <th className="lg:p-6 p-3 text-left text-sm font-medium text-zinc-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {processedPsps.map((psp, index) => (
                        <tr key={psp.id} className="hover:bg-zinc-50 transition-colors duration-150">
                          <td className="lg:p-6 p-3 text-sm text-zinc-500">{index + 1}.</td>
                          <td className="lg:p-6 p-3 text-sm text-zinc-900">{psp.companyName}</td>
                          <td className="lg:p-6 p-3 text-sm text-zinc-700 hidden md:table-cell">{psp.adminName}</td>
                          <td className="lg:p-6 p-3 text-sm text-zinc-700">{psp.lga}</td>
                          <td className="lg:p-6 p-3 text-sm text-zinc-700">{psp.wasteDisposed || 0} kg</td>
                          <td className="lg:p-6 p-3 text-sm text-zinc-700 min-w-[120px]">{formatDateTable(psp.dateAdded)}</td>
                          <td className="lg:p-6 p-3 text-sm">
                            <StatusBadge status={psp.status} />
                          </td>
                          <td className="lg:p-6 p-3">
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleActionMenu(psp.id);
                                }}
                                type="button"
                                className="p-1 text-zinc-500 hover:text-zinc-700"
                              >
                                <EllipsisVerticalIcon className="w-5 h-5" />
                              </button>
                              {openMenuId === psp.id && (
                                <div
                                  className="absolute right-3 bottom-[-10px] mt-2 min-w-[160px] bg-white border border-zinc-200 rounded-lg shadow-lg z-20 py-1"
                                  ref={actionMenuRef}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleOpenViewModal(psp);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors duration-150"
                                  >
                                    View details
                                  </button>
                                  {psp.status === "Active" || psp.status === "active" ? (
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleDeactivatePsp(psp);
                                      }}
                                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-zinc-50 transition-colors duration-150"
                                    >
                                      Deactivate PSP
                                    </button>
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleActivatePsp(psp);
                                      }}
                                      className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-zinc-50 transition-colors duration-150"
                                    >
                                      Activate PSP
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {processedPsps.length === 0 && (
                    <p className="p-6 text-center text-zinc-500">
                      No results found.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* --- MODALS --- */}
          {(isAddModalOpen ||
            isViewModalOpen ||
            isSuccessModalOpen ||
            isFailureModalOpen ||
            isFilterModalOpen ||
            isDeactivateModalOpen ||
            isActivateModalOpen) && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 transition-opacity"
                aria-labelledby="modal-title"
                role="dialog"
                aria-modal="true"
              >
                <div className="fixed inset-0" onClick={handleCloseModals}></div>

                {isAddModalOpen && (
                  <div>
                    <div className="relative bg-white rounded-lg w-full max-w-md m-4 transform transition-all">
                      <div className="p-6 sm:p-8">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-zinc-800">
                              On-board PSP
                            </h3>
                            <p className="text-sm text-zinc-500">
                              Add new PSP company
                            </p>
                          </div>
                          <button
                            onClick={handleCloseModals}
                            className="text-zinc-400 hover:text-zinc-600"
                          >
                            <CloseIcon />
                          </button>
                        </div>
                        <form
                          onSubmit={handleAddPsp}
                          className="mt-6 flex flex-col gap-4"
                        >
                          <div>
                            <label
                              htmlFor="companyName"
                              className="block text-sm font-medium text-zinc-700"
                            >
                              Company Name
                            </label>
                            <input
                              type="text"
                              name="companyName"
                              id="companyName"
                              placeholder="Enter company name"
                              value={newPsp.companyName}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700"
                            />
                          </div>
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <label
                                htmlFor="adminName"
                                className="block text-sm font-medium text-zinc-700"
                              >
                                Admin name
                              </label>
                              <input
                                type="text"
                                name="adminName"
                                id="adminName"
                                value={newPsp.adminName}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700"
                              />
                            </div>
                            <div className="flex-1">
                              <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-zinc-700"
                              >
                                Admin phone number
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                id="phone"
                                value={newPsp.phone}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700"
                              />
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="adminEmail"
                              className="block text-sm font-medium text-zinc-700"
                            >
                              Admin email address
                            </label>
                            <input
                              type="email"
                              name="adminEmail"
                              id="adminEmail"
                              placeholder="Admin email address"
                              value={newPsp.adminEmail}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="address"
                              className="block text-sm font-medium text-zinc-700"
                            >
                              Company address
                            </label>
                            <input
                              name="address"
                              id="address"
                              placeholder="Enter company address"
                              value={newPsp.address}
                              onChange={handleInputChange}
                              required
                              className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="lga"
                              className="block text-sm font-medium text-zinc-700"
                            >
                              LGA / LCDA
                            </label>
                            <select
                              name="lga"
                              id="lga"
                              value={newPsp.lga}
                              onChange={(e) => {
                                const selectedLga = lgas.find(lga =>
                                  (lga.name || lga.lgaName || lga.lga) === e.target.value
                                );
                                setNewPsp(prev => ({
                                  ...prev,
                                  lga: e.target.value || "",
                                  lgaId: selectedLga ? (selectedLga.id || selectedLga._id || "") : ""
                                }));
                              }}
                              required
                              disabled={loadingLgas}
                              className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 bg-white disabled:bg-zinc-100 disabled:cursor-not-allowed"
                            >
                              <option value="">
                                {loadingLgas ? "Loading LGAs..." : "Select LGA/LCDA"}
                              </option>
                              {lgas && lgas.length > 0 && lgas.map((lga) => (
                                <option key={lga.id || lga._id} value={lga.name || lga.lgaName || lga.lga}>
                                  {lga.name || lga.lgaName || lga.lga}
                                </option>
                              ))}
                            </select>
                          </div>

                          <button
                            type="submit"
                            disabled={isCreatingPsp}
                            className="w-full bg-green-700 text-white font-semibold py-3 rounded-lg hover:bg-green-800 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {isCreatingPsp ? (
                              <>
                                <LoadingSpinnerIcon className="h-5 w-5 animate-spin" />
                                Creating PSP...
                              </>
                            ) : (
                              "On-board PSP"
                            )}
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {isViewModalOpen && selectedPsp && (
                  <div className="relative bg-white rounded-lg w-full max-w-xl m-4 transform transition-all">
                    <div className="p-6 sm:p-8">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold text-zinc-800">
                          PSP Details
                        </h3>
                        <button
                          onClick={handleCloseModals}
                          className="text-zinc-400 hover:text-zinc-600"
                        >
                          <CloseIcon />
                        </button>
                      </div>
                      <div className="mt-6 flex flex-col gap-3 text-sm">
                        <div className="flex justify-between py-2">
                          <span className="text-zinc-800 font-semibold">
                            Company name
                          </span>
                          <span className="font-semibold text-zinc-600 text-right">
                            {selectedPsp.companyName}
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-zinc-800 font-semibold">
                            Admin name
                          </span>
                          <span className="font-semibold text-zinc-600 text-right">
                            {selectedPsp.adminName}
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-zinc-800 font-semibold">
                            Admin phone number
                          </span>
                          <span className="font-semibold text-zinc-600 text-right">
                            {selectedPsp.phone}
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-zinc-800 font-semibold">
                            LGA/LCDA
                          </span>
                          <span className="font-semibold text-zinc-600 text-right">
                            {selectedPsp.lga}
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-zinc-800 font-semibold">
                            Waste disposed
                          </span>
                          <span className="font-semibold text-zinc-600 text-right">
                            {selectedPsp.wasteDisposed} kg
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-zinc-800 font-semibold">
                            Customers attached
                          </span>
                          <span className="font-semibold text-zinc-600 text-right">
                            0
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-zinc-800 font-semibold">
                            Address
                          </span>
                          <span className="font-semibold text-zinc-600 text-right">
                            {selectedPsp.address}
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-zinc-800 font-semibold">
                            Date added
                          </span>
                          <span className="font-semibold text-zinc-600 text-right">
                            {formatDateTable(selectedPsp.dateAdded)}
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-zinc-800 font-semibold">
                            Status
                          </span>
                          <StatusBadge status={selectedPsp.status} />
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-zinc-800 font-semibold">
                            Number of Staff
                          </span>
                          <span className="font-semibold text-zinc-600 text-right">
                            {memberCounts[selectedPsp?.id] || 0}{" "}
                            <button
                              onClick={() => navigate("/psp-companies", { state: { psp: selectedPsp } })}
                              className="text-green-700 font-bold ml-2"
                            >
                              View all
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {isSuccessModalOpen && (
                  <div className="relative bg-white rounded-lg w-full max-w-sm m-4 transform transition-all">
                    <div className="flex flex-col items-center justify-center text-center p-8">
                      <SuccessIcon />
                      <h3 className="text-xl font-bold text-zinc-800 mt-4">
                        Successful!
                      </h3>
                      <p className="text-zinc-500 mt-1">
                        PSP On-boarded successfully.
                      </p>
                    </div>
                  </div>
                )}
                {isFailureModalOpen && (
                  <div className="relative bg-white rounded-lg w-full max-w-sm m-4 transform transition-all">
                    <div className="flex flex-col items-center justify-center text-center p-8">
                      <FailureIcon />
                      <h3 className="text-xl font-bold text-zinc-800 mt-4">
                        On-boarding Failed
                      </h3>
                      <p className="text-zinc-500 mt-1">
                        Could not add PSP. Please try again.
                      </p>
                    </div>
                  </div>
                )}
                {isFilterModalOpen && (
                  <div className="relative bg-white rounded-lg w-full max-w-md m-4 transform transition-all">
                    <div className="p-6 sm:p-8">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-zinc-800">
                          Filter PSPs
                        </h3>
                        <button
                          onClick={handleCloseModals}
                          className="text-zinc-400 hover:text-zinc-600"
                        >
                          <CloseIcon />
                        </button>
                      </div>
                      <div className="mt-6 flex flex-col gap-4">
                        <div>
                          <label
                            htmlFor="status"
                            className="block text-sm font-medium text-zinc-700"
                          >
                            Status
                          </label>
                          <select
                            name="status"
                            id="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700 bg-white"
                          >
                            <option value="">All</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="lga"
                            className="block text-sm font-medium text-zinc-700"
                          >
                            LGA / LCDA
                          </label>
                          <input
                            type="text"
                            name="lga"
                            id="lga"
                            value={filters.lga}
                            onChange={handleFilterChange}
                            className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700"
                          />
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label
                              htmlFor="dateFrom"
                              className="block text-sm font-medium text-zinc-700"
                            >
                              From
                            </label>
                            <input
                              type="date"
                              name="dateFrom"
                              id="dateFrom"
                              value={filters.dateFrom}
                              onChange={handleFilterChange}
                              className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700"
                            />
                          </div>
                          <div className="flex-1">
                            <label
                              htmlFor="dateTo"
                              className="block text-sm font-medium text-zinc-700"
                            >
                              To
                            </label>
                            <input
                              type="date"
                              name="dateTo"
                              id="dateTo"
                              value={filters.dateTo}
                              onChange={handleFilterChange}
                              className="mt-1 block w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-700 focus:border-green-700"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-4">
                          <button
                            onClick={resetFilters}
                            className="px-4 py-2 text-sm font-semibold text-zinc-700 bg-zinc-100 rounded-lg hover:bg-zinc-200"
                          >
                            Reset
                          </button>
                          <button
                            onClick={handleCloseModals}
                            className="px-4 py-2 text-sm font-semibold text-white bg-green-700 rounded-lg hover:bg-green-800"
                          >
                            Apply Filter
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {isDeactivateModalOpen && pspToDeactivate && (
                  <div className="relative bg-white rounded-lg w-full max-w-md m-4 transform transition-all">
                    <div className="p-6 sm:p-8">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-zinc-800">
                            Deactivate PSP
                          </h3>
                          <p className="text-sm text-zinc-500">
                            Are you sure you want to deactivate this PSP?
                          </p>
                        </div>
                        <button
                          onClick={handleCloseModals}
                          className="text-zinc-400 hover:text-zinc-600"
                        >
                          <CloseIcon />
                        </button>
                      </div>
                      <div className="mt-6">
                        <div className=" p-4 mb-4">
                          <h4 className="font-semibold text-zinc-800 mb-2">PSP Details:</h4>
                          <p className="text-sm text-zinc-600">
                            <span className="font-medium">Company:</span> {pspToDeactivate.companyName}
                          </p>
                          <p className="text-sm text-zinc-600">
                            <span className="font-medium">Admin:</span> {pspToDeactivate.adminName}
                          </p>
                          <p className="text-sm text-zinc-600">
                            <span className="font-medium">LGA:</span> {pspToDeactivate.lga}
                          </p>
                        </div>
                        <div className="flex justify-end gap-4">
                          <button
                            onClick={handleCloseModals}
                            className="px-4 py-2 text-sm font-semibold text-zinc-700 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={confirmDeactivatePsp}
                            className="px-4 py-2 text-sm font-semibold text-white bg-red-700 rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Deactivate PSP
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {isActivateModalOpen && pspToActivate && (
                  <div className="relative bg-white rounded-lg w-full max-w-md m-4 transform transition-all">
                    <div className="p-6 sm:p-8">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-zinc-800">
                            Activate PSP
                          </h3>
                          <p className="text-sm text-zinc-500">
                            Are you sure you want to activate this PSP?
                          </p>
                        </div>
                        <button
                          onClick={handleCloseModals}
                          className="text-zinc-400 hover:text-zinc-600"
                        >
                          <CloseIcon />
                        </button>
                      </div>
                      <div className="mt-6">
                        <div className=" p-4 mb-4">
                          <h4 className="font-semibold text-zinc-800 mb-2">PSP Details:</h4>
                          <p className="text-sm text-zinc-600">
                            <span className="font-medium">Company:</span> {pspToActivate.companyName}
                          </p>
                          <p className="text-sm text-zinc-600">
                            <span className="font-medium">Admin:</span> {pspToActivate.adminName}
                          </p>
                          <p className="text-sm text-zinc-600">
                            <span className="font-medium">LGA:</span> {pspToActivate.lga}
                          </p>
                        </div>
                        <div className="flex justify-end gap-4">
                          <button
                            onClick={handleCloseModals}
                            className="px-4 py-2 text-sm font-semibold text-zinc-700 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={confirmActivatePsp}
                            className="px-4 py-2 text-sm font-semibold text-white bg-green-700 rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Activate PSP
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
        </main>
      </div>
    </div>
  );
}

export default PSPManagement;
