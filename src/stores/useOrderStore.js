import { create } from 'zustand';
import { orderService } from '../services/orderService';

const useOrderStore = create((set, get) => ({
  orders: [],
  dashboardStats: null,
  orderSummary: null,
  activeOrder: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  },

  fetchDashboardStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const stats = await orderService.getDashboardStats();
      set({ dashboardStats: stats, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchOrders: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const data = await orderService.getAllOrders(page, limit);
      
      const mappedOrders = (data.records || []).map(record => ({
        id: record.id,
        name: record.customerName,
        phone: record.phoneNumber || '', // Not returned by list API currently
        lga: record.lga || '',     // Not returned by list API currently
        orderDate: record.date,
        status: record.status,
        ...record
      }));

      set({
        orders: mappedOrders,
        orderSummary: data.summary || null, // API might not return this here
        pagination: {
          total: data.paging?.total || 0,
          page: Number(data.paging?.page) || 1,
          pages: data.paging?.pages || 1,
          limit: Number(data.paging?.size) || 10,
        },
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchOrderDetails: async (applicationId) => {
    try {
        const data = await orderService.getOrderDetails(applicationId);
        
        // Map API data to Modal expected structure
        // Using "SmartBin Model" from docs for fields
        const mappedOrder = {
            id: data.binId || data.id, 
            applicationId: data.id, // Keep original ID for API calls
            status: data.status,
            orderDate: new Date(data.createdAt || data.orderDate),
            price: `₦${(data.amount || 100000).toLocaleString()}`,
            customer: {
                name: data.customerName,
                phone: data.phoneNumber,
                email: data.email,
                address: data.address,
                lga: data.lga
            },
            items: [
                {
                    name: `${data.quantity}kg ${data.binType === 'smart' ? 'Smart bin' : 'Bin'}`,
                    quantity: data.quantity
                }
            ],
            inventory: {
                dateAdded: data.dateAddedToInventory ? new Date(data.dateAddedToInventory) : null,
                // ... other inventory fields if available
            },
            assignment: {
                assignedTo: data.assignedTo ? {
                   name: data.assignedTo, // It seems API returns ID or Name? Docs say "string", usually ID or Name. 
                   // If it's an ID we might need to look it up, but for now let's hope it's resolved or we just show what we get.
                   // The schedule response returns "assignedTo: { id, name }" but getDetails returns "assignedTo: string".
                   // Let's assume it's a string name or we might need to handle it.
                   date: data.dateAssigned ? new Date(data.dateAssigned) : null
                } : null,
                updatedBy: data.updatedByAssigned?.name || 'Admin',
            },
            delivery: {
                deliveredDate: data.dateDelivered ? new Date(data.dateDelivered) : null,
                deliveredBy: data.deliveredBy,
            },
            activation: {
                activationDate: data.dateActivated ? new Date(data.dateActivated) : null,
            },
            ...data
        };
        
        set({ activeOrder: mappedOrder });
        return mappedOrder;
    } catch (error) {
        console.error("Error loading order details", error);
        throw error;
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
        await orderService.updateOrderStatus(id, status);
        // Refresh details
        await get().fetchOrderDetails(id);
        // Refresh list
        await get().fetchOrders(get().pagination.page, get().pagination.limit);
    } catch (error) {
        set({ error: error.message });
        throw error;
    }
  },

  scheduleOrderDelivery: async (applicationId, teamMemberId, comment) => {
      try {
          await orderService.scheduleDelivery(applicationId, teamMemberId, comment);
          await get().fetchOrderDetails(applicationId);
          await get().fetchOrders(get().pagination.page, get().pagination.limit);
      } catch (error) {
          set({ error: error.message });
          throw error;
      }
  },

  deliverOrder: async (id, deliveryData) => {
      try {
          await orderService.deliverOrder(id, deliveryData);
          await get().fetchOrderDetails(id);
          await get().fetchOrders(get().pagination.page, get().pagination.limit);
      } catch (error) {
          set({ error: error.message });
          throw error;
      }
  }
}));

export default useOrderStore;
