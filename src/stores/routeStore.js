import { create } from "zustand";
import SuperAdminRoutes from "../router/SuperAdminRoutes";
import LawmaAdminRoutes from "../router/LawmaAdminRoutes";
import PartnersRoutes from "../router/PartnersRoutes";
import TeamMembersRoutes from "../router/TeamMemberRoutes";
import PSPsRoutes from "../router/PSPsRoutes";
import PSPsTeamMembersRoutes from "../router/PSPsTeamMemberRoutes";

const useRouteStore = create((set) => ({
  userType: localStorage.getItem("userType") || null,
  routes: [],
  setRoutes: () => {
    if (localStorage.getItem("userType") === "SuperAdmin") {
      set({ routes: SuperAdminRoutes });
    }
    if (localStorage.getItem("userType") === "LawmaAdmin") {
      set({ routes: LawmaAdminRoutes });
    }
    if (localStorage.getItem("userType") === "Partners") {
      set({ routes: PartnersRoutes });
    }
    if (localStorage.getItem("userType") === "TeamMembers") {
      set({ routes: TeamMembersRoutes });
    }
    if (localStorage.getItem("userType") === "PSPs") {
      set({ routes: PSPsRoutes });
    }
    if (localStorage.getItem("userType") === "PSPsTeamMembers") {
      set({ routes: PSPsTeamMembersRoutes });
    }
  },
}));

export default useRouteStore;
