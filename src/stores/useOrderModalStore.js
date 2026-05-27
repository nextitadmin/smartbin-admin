import { create } from 'zustand';
import { createMockOrder } from '../data/mockOrderData';

const useOrderModalStore = create((set) => ({
  activeModal: null, // 'pending', 'inventory', 'schedule', 'delivered', 'activated' or null
  orderData: null, // The unified order object

  openModal: (modalType, dataOrId) => {
      let data = dataOrId;
      // If a string ID is passed, create the mock object
      if (typeof dataOrId === 'string') {
          data = createMockOrder(dataOrId);
          // Set appropriate status based on modal we are opening (for demo consistency)
          if (modalType === 'pending') data.status = 'Pending';
          if (modalType === 'inventory') data.status = 'Inventory';
          if (modalType === 'schedule') data.status = 'Scheduled for delivery'; // or 'Scheduled'
          if (modalType === 'delivered') data.status = 'Delivered';
          if (modalType === 'activated') data.status = 'Activated';
      }
      set({ activeModal: modalType, orderData: data });
  },

  closeModal: () => set({ activeModal: null, orderData: null }),
  
  // Transitions close the current modal and open the next one with the same data (unless new data is provided)
  transitionTo: (nextModalType, newData = null) => set((state) => {
    const updatedData = newData ? { ...state.orderData, ...newData } : { ...state.orderData };
    
    // Auto-update status on transition for the demo
    if (nextModalType === 'pending') updatedData.status = 'Pending';
    if (nextModalType === 'inventory') updatedData.status = 'Inventory';
    if (nextModalType === 'schedule') updatedData.status = 'Scheduled for delivery';
    if (nextModalType === 'delivered') updatedData.status = 'Delivered';
    if (nextModalType === 'activated') updatedData.status = 'Activated';

    return {
        activeModal: nextModalType,
        orderData: updatedData
    };
  }),
}));

export default useOrderModalStore;
