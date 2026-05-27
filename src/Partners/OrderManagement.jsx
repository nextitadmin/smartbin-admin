import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from '../components/Partners/Sidebar';
import Topbar from '../components/Partners/Topbar';
import useOrderModalStore from '../stores/useOrderModalStore';
import useOrderStore from '../stores/useOrderStore';
import { exportToCSV } from '../utils/csvExport';

import ScheduleDeliveryModal from '../components/Partners/OrderManagement/ScheduleDeliveryModal';
import PendingOrderModal from '../components/Partners/OrderManagement/PendingModal';
import InventoryModal from '../components/Partners/OrderManagement/InventoryModal';
import DeliveredOrderModal from '../components/Partners/OrderManagement/DeliveredModal';
import ActivatedOrderModal from '../components/Partners/OrderManagement/ActivatedModal';

// --- HEROICONS SVGs ---
// Using raw SVGs as requested since no icon library is installed.

const DocumentTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);

const ShopIcon = () => (
  <div className="flex items-center justify-center w-10 h-10 bg-green-700 rounded-full">
    <img
      src="/images/shop.svg"
      alt="Shop icon"
      className="w-5 h-5"
    />
  </div>
);

const EmptyWalletIcon = () => (
  <div className="flex items-center justify-center w-10 h-10 bg-green-700 rounded-full">
    <img
      src="/images/empty-wallet.svg"
      alt="Empty wallet icon"
      className="w-5 h-5"
    />
  </div>
);


const BanknotesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-15c-.621 0-1.125-.504-1.125-1.125V8.25m0 0A.75.75 0 0 1 3 7.5h.75M3 7.5v.375c0 .621.504 1.125 1.125 1.125h13.5m-15-3.375V5.625c0-.621.504-1.125 1.125-1.125h1.5c.621 0 1.125.504 1.125 1.125v.375m13.5 0v-.375c0-.621-.504-1.125-1.125-1.125h-1.5c-.621 0-1.125.504-1.125 1.125v.375" />
  </svg>
);

const MagnifyingGlassIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);


// --- MOCK DATA REMOVED ---

// --- COMPONENTS ---

const StatCard = ({ icon, title, value, bgColor, titleColor, valueColor }) => {
  return (
    <div className={`flex-1 p-6 rounded-2xl flex items-center ${bgColor}`}>

      <div>
        {icon && <div className="p-3 bg-white/20 rounded-full mr-4">
          {icon}
        </div>}
        <p className={`text-base text-[18px] ${titleColor}`}>{title}</p>
        <p className={`text-3xl font-semibold ${valueColor}`}>{value}</p>
      </div>
    </div>
  );
};

const Header = () => (
  <header className="mb-6">
    <h1 className="text-3xl font-bold text-zinc-800">Order Management</h1>
    <p className="text-zinc-500">Here's a review of your orders</p>
  </header>
);

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = ['Pending requests', 'Inventory', 'Scheduled', 'Delivered', 'Activated'];
  return (
    <div className="mb-4">
      <div className="border-b border-zinc-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                                ${activeTab === tab
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300'
                }`
              }
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

const OrderTable = ({ orders, onRowClick, pagination, onPageChange, filters, setFilters }) => {
  const { items, requestSort, sortConfig } = useSortableData(orders);
  // Remove local pagination state
  // const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const ITEMS_PER_PAGE = pagination?.limit || 10;

  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.pages || 1;

  // filteredItems is now just local filtering of the CURRENT PAGE if needed, 
  // but ideally search should be server-side too. For now keeping client-side search on the current page
  // as the API doesn't document search query params yet.
  const filteredItems = useMemo(() => {
    return items.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [items, searchTerm]);

  // Using filteredItems directly as currentTableData since pagination is server-side
  const currentTableData = filteredItems;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const getSortIcon = (name) => {
    if (!sortConfig || sortConfig.key !== name) {
      return <div className="w-4 h-4" />;
    }
    return sortConfig.direction === 'ascending' ? <ChevronUpIcon /> : <ChevronDownIcon />;
  };

  const headers = [
    { key: 'id', label: 'Order ID' },
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone number' },
    { key: 'lga', label: 'LGA' },
    { key: 'orderDate', label: 'Order date' },
    { key: 'status', label: 'Status' },
  ];

  const getStatusChip = (status) => {
    const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'Pending': return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'Delivered': return `${baseClasses} bg-green-100 text-green-800`;
      case 'Scheduled': return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'Activated': return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'Inventory': return `${baseClasses} bg-zinc-200 text-zinc-800`;
      default: return `${baseClasses} bg-zinc-100 text-zinc-800`;
    }
  };

  return (
    <>
      {/* Toolbar - outside the table */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="relative w-full sm:w-auto sm:flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon />
          </span>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              // setCurrentPage(1); // No longer relevant for server-side pagination with client-side filter on page
            }}
            className="w-full sm:max-w-xs pl-10 pr-4 py-[12px] border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          />
        </div>
        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`px-[24px] py-[12px] border rounded-xl text-sm font-medium transition-colors ${isFilterOpen ? 'bg-green-50 border-green-500 text-green-700' : 'border-zinc-300 text-zinc-700 hover:bg-zinc-50 bg-white'}`}
          >
            Filter
          </button>
          <button
            onClick={() => exportToCSV(orders, `orders_export_${new Date().toISOString().split('T')[0]}`)}
            className="px-[24px] py-[12px] border border-zinc-300 rounded-xl text-sm font-medium text-zinc-700 hover:bg-zinc-50 bg-white"
          >
            Export
          </button>

          {/* Filter Popover */}
          {isFilterOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-zinc-800">Filter Orders</h3>
                <button
                  onClick={() => {
                    setFilters({ lga: '', startDate: '', endDate: '' });
                    setIsFilterOpen(false);
                  }}
                  className="text-xs text-green-600 hover:text-green-700 font-medium"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">LGA</label>
                  <select
                    value={filters.lga}
                    onChange={(e) => setFilters({ ...filters, lga: e.target.value })}
                    className="w-full p-2 border border-zinc-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  >
                    <option value="">All LGAs</option>
                    {[...new Set(orders.map(o => o.lga))].filter(Boolean).map(lga => (
                      <option key={lga} value={lga}>{lga}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    className="w-full p-2 border border-zinc-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">End Date</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    className="w-full p-2 border border-zinc-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-full mt-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          )}
        </div>
      </div>


      {/* Table container */}
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-zinc-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium font-extrabold text-gray-700 uppercase tracking-wider">
                  S/N
                </th>
                {headers.map((header) => (
                  <th
                    key={header.key}
                    className="px-6 py-3 text-left text-xs font-extrabold text-gray-700 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort(header.key)}
                  >
                    <div className="flex items-center gap-2">
                      {header.label}
                      {getSortIcon(header.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-zinc-200">
              {currentTableData.map((order, index) => (
                <tr
                  key={order.id}
                  onClick={() => onRowClick && onRowClick(order)}
                  className="cursor-pointer hover:bg-zinc-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-normal text-zinc-900">
                    {order.orderId || order.id /* Handle API vs Mock ID field names */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                    {order.name || order.customerName /* Handle API vs Mock Name field names */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                    {order.phoneNumber || order.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                    {order.lga}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                    {new Date(order.orderDate).toLocaleString('en-US', {
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={getStatusChip(order.status)}>{order.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-4">
          <div className="text-sm text-zinc-500 mb-2 sm:mb-0">
            Page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 border border-zinc-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-100"
            >
              <ChevronLeftIcon />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 border border-zinc-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 bg-green-600 text-white"
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>
    </>
  );

};


export default function OrderManagement() {
  const [activeTab, setActiveTab] = useState('Pending requests');
  const [filters, setFilters] = useState({ lga: '', startDate: '', endDate: '' });

  const { activeModal, openModal, closeModal, transitionTo, orderData } = useOrderModalStore();
  const { orders, orderSummary, fetchOrders, fetchOrderDetails, isLoading, pagination } = useOrderStore();

  useEffect(() => {
    fetchOrders(1);
  }, []);

  const handlePageChange = (page) => {
    fetchOrders(page);
  };


  const handlePendingTransition = (action) => {
    if (action === 'inventory') {
      transitionTo('inventory');
    } else if (action === 'schedule') {
      transitionTo('schedule');
    }
  };

  const handleInventoryTransition = (action) => {
    if (action === 'schedule') {
      transitionTo('schedule');
    }
  };

  const handleScheduleTransition = () => {
    transitionTo('delivered');
  };

  const handleRowClick = async (order) => {
    const statusToModalMap = {
      'Pending': 'pending',
      'Inventory': 'inventory',
      'Scheduled': 'schedule',
      'Delivered': 'delivered',
      'Activated': 'activated'
    };

    // Normalize status match - API might return different casing
    // We try exact match first, then case-insensitive
    let modalType = statusToModalMap[order.status];
    if (!modalType) {
      // Try finding key that matches lowercase
      const statusKey = Object.keys(statusToModalMap).find(key => key.toLowerCase() === order.status?.toLowerCase());
      if (statusKey) modalType = statusToModalMap[statusKey];

      // Special handling for 'scheduledForDelivery' -> 'schedule'
      if (order.status === 'scheduledForDelivery') modalType = 'schedule';
    }

    if (modalType) {
      // 1. Open modal with null data to trigger loading state (if modal supports it)
      openModal(modalType, null);

      try {
        // 2. Fetch full details which includes customer info etc.
        // Note: fetchOrderDetails returns the mapped object
        const fullOrder = await fetchOrderDetails(order.id);

        // 3. Update modal with full data
        openModal(modalType, fullOrder);
      } catch (error) {
        console.error("Failed to fetch order details", error);
        // Optionally close modal or show error state
        // closeModal(); 
      }
    }
  };

  /* 
     Note: The API doesn't support status filtering via query params in the docs for /order-management.
     We are fetching all orders via pagination. 
     If we want to filter by tabs, we have two options:
     1. Filter client-side (but we only have one page of data).
     2. Assume the API will support filtering or ignore tabs for now, OR fetch all pages (bad).
     
     For now, I will keep client-side filtering on the fetched page as a placeholder,
     but in reality the backend should support `status` query param.
  */
  const filteredOrders = useMemo(() => {
    const tabStatusMap = {
      'Pending requests': 'Pending', // API returns lowercase 'pending' usually, need to normalize
      'Scheduled': 'Scheduled',
      'Delivered': 'Delivered',
      'Activated': 'Activated',
      'Inventory': 'Inventory',
    };

    const statusToFilter = tabStatusMap[activeTab];

    let result = orders || [];

    // Filter by tab status
    if (statusToFilter) {
      result = result.filter(order => order.status?.toLowerCase() === statusToFilter.toLowerCase() ||
        (statusToFilter === 'Scheduled' && order.status === 'scheduledForDelivery'));
    }

    // Apply additional filters
    if (filters.lga) {
      result = result.filter(order => order.lga === filters.lga);
    }

    if (filters.startDate) {
      const start = new Date(filters.startDate);
      result = result.filter(order => new Date(order.orderDate) >= start);
    }

    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter(order => new Date(order.orderDate) <= end);
    }

    return result;
  }, [activeTab, orders, filters]);


  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="bg-zinc-100 min-h-screen w-full p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Header />

            {/* Stat Cards */}
            <div className="flex flex-col sm:flex-row gap-6 mb-8">
              <StatCard
                icon={<DocumentTextIcon />}
                title="Total orders"
                value={orderSummary?.totalOrders?.toLocaleString() || "..."}
                bgColor="bg-white"
                titleColor="text-gray-800"
                valueColor="text-green-700"
              />
              <StatCard
                icon={<BanknotesIcon />}
                title="Order value"
                value={`₦${orderSummary?.orderValue?.toLocaleString() || "..."}`}
                bgColor="bg-white"
                titleColor="text-gray-800"
                valueColor="text-green-700"
              />
              <StatCard
                title="On going orders"
                value={orderSummary?.ongoingOrders?.toLocaleString() || "..."}
                bgColor="bg-orange-400"
                titleColor="text-white"
                valueColor="text-white"
              />
              <StatCard

                title="Completed orders"
                value={orderSummary?.completedOrders?.toLocaleString() || "..."}
                bgColor="bg-green-700"
                titleColor="text-white"
                valueColor="text-white"
              />
            </div>

            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

            <OrderTable
              orders={filteredOrders}
              onRowClick={handleRowClick}
              pagination={pagination}
              onPageChange={handlePageChange}
              filters={filters}
              setFilters={setFilters}
            />

          </div>
        </main>

        {/* --- Modals --- */}
        <PendingOrderModal
          isOpen={activeModal === 'pending'}
          onClose={closeModal}
          order={orderData}
          onTransition={handlePendingTransition}
        />
        <InventoryModal
          isOpen={activeModal === 'inventory'}
          onClose={closeModal}
          order={orderData}
          onTransition={handleInventoryTransition}
        />
        <ScheduleDeliveryModal
          isOpen={activeModal === 'schedule'}
          onClose={closeModal}
          order={orderData}
          onTransition={handleScheduleTransition}
        />
        <DeliveredOrderModal
          isOpen={activeModal === 'delivered'}
          onClose={closeModal}
          order={orderData}
        />
        <ActivatedOrderModal
          isOpen={activeModal === 'activated'}
          onClose={closeModal}
          order={orderData}
        />
      </div>
    </div>
  );
}


