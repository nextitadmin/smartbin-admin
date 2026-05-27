// components/RouterWrapper.jsx
import React, { Suspense, lazy, useState, useEffect, useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import useRouteStore from "../stores/routeStore";
import LoadingComponent from "../components/LoadingComponent";
import SuperAdminRoutes from "./SuperAdminRoutes";
import LawmaAdminRoutes from "./LawmaAdminRoutes"
import PartnersRoutes from "./PartnersRoutes";
import TeamMembersRoutes from "./TeamMemberRoutes";
import PSPsRoutes from "./PSPsRoutes";
import PSPsTeamMembersRoutes from "./PSPsTeamMemberRoutes";

const App = lazy(() => import("../pages/App"));
const Confirmation = lazy(() => import("../pages/Confirmation"));
const SuccessVerification = lazy(() => import("../pages/SuccessVerification"));
const ErrorPage = lazy(() => import("../pages/404"));


// Loading component
// Helper function to determine routes based on user type
const getRoutesForUserType = (userType) => {
  switch (userType) {
    case "SuperAdmin":
      return SuperAdminRoutes;
    case "LawmaAdmin":
      return LawmaAdminRoutes;
    case "Partners":
      return PartnersRoutes;
    case "TeamMembers":
      return TeamMembersRoutes
    case "PSPs":
      return PSPsRoutes
    case "PSPsTeamMembers":
      return PSPsTeamMembersRoutes
    default:
      return SuperAdminRoutes;
  }
};

export default function RouterWrapper() {
  const [router, setRouter] = useState(null);
  const [userType, setUserType] = useState(null);
  const dynamicRoutes = useRouteStore((state) => state.routes);


  // Initialize user type
  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      setUserType(storedUserType);
    } else {
      localStorage.setItem("userType", "SuperAdmin");
      setUserType("SuperAdmin");
    }
  }, []);

  // Memoize static routes to prevent recreation on every render
  const staticRoutes = useMemo(
    () =>
      [
        {
          path: "/",
          element: (
            <Suspense fallback={<LoadingComponent />}>
              <App />
            </Suspense>
          ),
        },
        {
          path: "/confirm",
          element: (
            <Suspense fallback={<LoadingComponent />}>
              <Confirmation />
            </Suspense>
          ),
        },
        {
          path: "/success",
          element: (
            <Suspense fallback={<LoadingComponent />}>
              <SuccessVerification />
            </Suspense>
          ),
        },
      ]
    ,
    []
  );

  // Create router when dependencies change
  useEffect(() => {
    // Wait for userType to be initialized
    if (userType === null) return;

    // Determine which routes to use
    const userTypeRoutes =
      dynamicRoutes.length > 0 ? dynamicRoutes : getRoutesForUserType(userType);

    // Add the error page as a fallback route
    const fullRoutes = [
      ...staticRoutes,
      ...userTypeRoutes,
      {
        path: "*",
        element: (
          <Suspense fallback={<LoadingComponent />}>
            <ErrorPage />
          </Suspense>
        ),
      },
    ];

    try {
      const newRouter = createBrowserRouter(fullRoutes);
      setRouter(newRouter);
    } catch (error) {
      console.error("Failed to create router:", error);
      // Fallback to error page
      const errorRouter = createBrowserRouter([
        {
          path: "*",
          element: (
            <Suspense fallback={<LoadingComponent />}>
              <ErrorPage />
            </Suspense>
          ),
        },
      ]);
      setRouter(errorRouter);
    }

    // Add this at the top of your component for development logging
    const isDevelopment = true;

    // Then in the useEffect:
    if (isDevelopment) {
      console.log("Dynamic Routes:", userTypeRoutes);

    }
  }, [dynamicRoutes, userType, staticRoutes]);

  // Show loading state while router is being created
  if (!router || userType === null) {
    return <LoadingComponent />;
  }

  return <RouterProvider router={router} />;
}
