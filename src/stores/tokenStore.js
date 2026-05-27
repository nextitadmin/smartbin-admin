import { create } from 'zustand';

const useTokenStore = create((set) => ({
  bearerToken: localStorage.getItem('bearerToken') || null,
  setBearerToken: (token) => {
    localStorage.setItem('bearerToken', token);
    set({ bearerToken: token });
  },
  clearBearerToken: () => {
    localStorage.removeItem('bearerToken');
    set({ bearerToken: null });
  },
}));

export default useTokenStore;
