import { create } from 'zustand';

const useOrderModalStore = create((set) => ({
  activeModal: null, // 'pending', 'inventory', 'schedule', 'delivered', 'activated' or null
  orderData: null, // The unified order object

  openModal: (modalType, order = null) => {
      set({ activeModal: modalType, orderData: typeof order === 'object' ? order : null });
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
