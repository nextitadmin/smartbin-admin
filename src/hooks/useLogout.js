import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import useTokenStore from "../stores/tokenStore";

const useLogout = () => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.logout);
  const clearToken = useTokenStore((state) => state.clearBearerToken);

  const logout = () => {
    // Clear authentication state
    clearAuth();
    clearToken();

    // Clear localStorage items related to auth
    localStorage.removeItem("email");
    localStorage.removeItem("userType");

    // Redirect to login
    navigate("/");
  };

  return { logout };
};

export default useLogout;
