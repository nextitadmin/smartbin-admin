import { create } from 'zustand';

const useSuperAdminStore = create((set) => ({
  // Super Admin specific information
  profile: null,
  permissions: [],
  
  // Actions to update Super Admin information
  setProfile: (profile) => set({ profile }),
  setPermissions: (permissions) => set({ permissions }),
  
  // Set user data from API response
  setUser: (userData) => set({ 
    profile: {
      id: userData.id || userData._id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      token: userData.token,
      ipAddress: userData.ipAddress,
      userAgent: userData.userAgent,
      emailVerified: userData.emailVerified,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      ...userData,
    }
  }),
  
  // Reset store
  reset: () => set({
    profile: null,
    permissions: [],
  }),
}));

export default useSuperAdminStore;