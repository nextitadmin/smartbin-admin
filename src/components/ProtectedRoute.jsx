import { useEffect, useRef, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import useTokenStore from '../stores/tokenStore';
import useRouteStore from '../stores/routeStore';
import useSuperAdminStore from '../stores/superAdminStore';
import useLawmaAdminStore from '../stores/lawmaAdminStore';
import usePartnersStore from '../stores/partnersStore';
import useTeamMembersStore from '../stores/teamMembersStore';
import usePSPsStore from '../stores/PSPsStore';
import usePSPsTeamMembersStore from '../stores/PSPsTeamMembersStore';

// Custom hook for inactivity timer
const useInactivityTimer = (logoutCallback, timeout = 12300000) => {
    const timerRef = useRef();

    const resetTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(logoutCallback, timeout);
    }, [logoutCallback, timeout]);

    useEffect(() => {
        const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];

        // Set up event listeners
        events.forEach(event => {
            window.addEventListener(event, resetTimer);
        });

        // Initial timer setup
        resetTimer();

        // Cleanup function
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            events.forEach(event => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, [resetTimer]);
};

const ProtectedRoute = ({ children }) => {
    const bearerToken = useTokenStore((state) => state.bearerToken);
    // Use bearerToken as the primary authentication check
    const token = bearerToken;
    const userType = localStorage.getItem("userType");
    const logout = useAuthStore((state) => state.logout);
    const clearToken = useTokenStore((state) => state.clearBearerToken);
    const setRoutes = useRouteStore((state) => state.setRoutes);

    const navigate = useNavigate();

    const handleLogout = useCallback(() => {
        // Clear user profile data based on user type
        const clearUserProfile = () => {
            switch (userType) {
                case 'SuperAdmin':
                    useSuperAdminStore.getState().reset();
                    break;
                case 'LawmaAdmin':
                    useLawmaAdminStore.getState().reset();
                    break;
                case 'Partners':
                    usePartnersStore.getState().reset();
                    break;
                case 'TeamMembers':
                    useTeamMembersStore.getState().reset();
                    break;
                case 'PSPs':
                    usePSPsStore.getState().reset();
                    break;
                case 'PSPsTeamMembers':
                    usePSPsTeamMembersStore.getState().reset();
                    break;
                default:
                    // For any other user type or if userType is not set
                    if (typeof useSuperAdminStore.getState().reset === 'function') {
                        useSuperAdminStore.getState().reset();
                    }
                    break;
            }
        };

        logout();
        clearToken();
        clearUserProfile();
        setRoutes();
        localStorage.removeItem("userType");
        localStorage.removeItem("userId");
        localStorage.removeItem("bearerToken");
        navigate("/");
    }, [logout, clearToken, setRoutes, navigate, userType]);

    // Initialize inactivity timer and session check
    useInactivityTimer(handleLogout);

    return token ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
