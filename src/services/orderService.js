import api from '../api/apiConfig';

const ENDPOINT_PREFIX = 'lawma/smartbin-partners';

export const orderService = {
  getDashboardStats: async () => {
    try {
      const response = await api.get(`${ENDPOINT_PREFIX}/dashboard`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  getAllOrders: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`${ENDPOINT_PREFIX}/order-management`, {
        params: { page, limit }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  getOrderDetails: async (applicationId) => {
    try {
      const response = await api.get(`${ENDPOINT_PREFIX}/order/application-details`, {
        params: { applicationId }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  },

  scheduleDelivery: async (applicationId, teamMemberId, comment) => {
    try {
      const response = await api.put(`${ENDPOINT_PREFIX}/schedule-delivery`, {
        applicationId,
        teamMemberId,
        comment
      });
      return response.data;
    } catch (error) {
      console.error('Error scheduling delivery:', error);
      throw error;
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      const response = await api.patch(`${ENDPOINT_PREFIX}/${id}/update-status`, {
        status
      });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  deliverOrder: async (id, deliveryData) => {
    try {
      const response = await api.patch(`${ENDPOINT_PREFIX}/team-member/${id}/deliver`, deliveryData);
      return response.data;
    } catch (error) {
      console.error('Error delivering order:', error);
      throw error;
    }
  },
  
  // Method to fetch team member dashboard stats if needed later
  getTeamMemberStats: async (partnerId) => {
      try {
          const response = await api.get(`${ENDPOINT_PREFIX}/team-member/${partnerId}`);
          return response.data;
      } catch (error) {
          console.error('Error fetching team member stats:', error);
          throw error;
      }
  }
};
