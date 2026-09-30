import { create } from "zustand";

export const useToastStore = create((set) => ({
  toasts: [],
  addToast: (message, type = "success", duration = 5000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id)
        }));
      }, duration);
    }
    return id;
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }));
  },
  clearToasts: () => set({ toasts: [] })
}));

/**
 * Global helper to trigger a toast from anywhere (inside or outside React components).
 * @param {string} message - Message to display
 * @param {'success'|'error'|'warning'|'info'} [type='success'] - Toast type
 * @param {number} [duration=5000] - Duration in ms before auto-dismiss (default 5000ms)
 */
export const showToast = (message, type = "success", duration = 5000) => {
  return useToastStore.getState().addToast(message, type, duration);
};

export default useToastStore;
