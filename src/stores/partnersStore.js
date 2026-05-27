import { create } from "zustand";

const usePartnersStore = create((set) => ({
  // Super Admin specific information
  profile: null,
  permissions: [],

  // Actions to update Super Admin information
  setProfile: (profile) => set({ profile }),
  setPermissions: (permissions) => set({ permissions }),

  // Set user data from API response
  setUser: (userData) =>
    set({
      profile: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        emailVerified: userData.emailVerified,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      },
    }),

  // Reset store
  reset: () =>
    set({
      profile: null,
      permissions: [],
    }),
}));

export default usePartnersStore;
