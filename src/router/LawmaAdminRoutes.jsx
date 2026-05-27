import Dashboard from "../LawmaAdmin/Dashboard";
import KYC from "../LawmaAdmin/KYC";
import UserManagementApplicants from "../components/LawmaAdmin/UserManagementApplicants";
import UserManagement from "../LawmaAdmin/UserManagement";
import LoadingComponent from "../components/LoadingComponent";
import PSPManagement from "../LawmaAdmin/PSPManagement";
import PSPCompanies from "../LawmaAdmin/PSPCompanies";
import WasteManagement from "../LawmaAdmin/WasteManagement";
import AuditManager from "../LawmaAdmin/AuditManager";
import Revenue from "../LawmaAdmin/Revenue";
import AllPayments from "../LawmaAdmin/AllPayments";
import PaymentsReport from "../LawmaAdmin/PaymentsReport";
import SmartBinReport from "../LawmaAdmin/SmartBinReport";
import WasteReports from "../LawmaAdmin/WasteReports";
import Reports from "../LawmaAdmin/Reports";
import ProtectedRoute from "../components/ProtectedRoute";

import { Suspense } from "react";
import TeamManagement from "../LawmaAdmin/TeamManagement";
import SmartbinManagement from "../LawmaAdmin/SmartbinManagement";


const LawmaAdminRoutes = [
    {
        path: "/dashboard",
        element: (
            <Suspense fallback={<LoadingComponent />}>
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    {
        path: "/kyc",
        element: (
            <Suspense fallback={<LoadingComponent />}>
                <ProtectedRoute>
                    <KYC />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    {
        path: "/user-management",
        element: (
            <Suspense fallback={<LoadingComponent />}>
                <ProtectedRoute>
                    <UserManagement />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    {
        path: "/user-management/:id",
        element: (
            <Suspense fallback={<LoadingComponent />}>
                <ProtectedRoute>
                    <UserManagementApplicants />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    {
        path: "/psp-management",
        element: (
            <Suspense fallback={<LoadingComponent />}>
                <ProtectedRoute>
                    <PSPManagement />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    {
        path: "/psp-companies",
        element: (
            <Suspense fallback={<LoadingComponent />}>
                <ProtectedRoute>
                    <PSPCompanies />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    {
        path: "/smartbin-management",
        element: (
            <Suspense fallback={<LoadingComponent />}>
                <ProtectedRoute>
                    <SmartbinManagement />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    {
        path: "/waste-management",
        element: (
            <Suspense fallback={<LoadingComponent />}>
                <ProtectedRoute>
                    <WasteManagement />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    {
        path: "/revenue",
        element: (
            <Suspense fallback={<LoadingComponent />}>
                <ProtectedRoute>
                    <Revenue />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    // {
    //     path: "/revenue",
    //     element: (
    //         <Suspense fallback={<LoadingComponent />}>

    //             <Revenue />

    //         </Suspense>
    //     ),
    // },
    {
        path: "/all-payments",
        element: (
            <Suspense fallback={<LoadingComponent />}>
                <ProtectedRoute>
                    <AllPayments />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    {
        path: "/audit-management",
        element: (
            <Suspense fallback={<LoadingComponent />}>
                <ProtectedRoute>
                    <AuditManager />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    {
        path: "/team-management",
        element: (
            <Suspense fallback={<LoadingComponent />}>
                <ProtectedRoute>
                    <TeamManagement />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    {
        path: "/reports",
        element: (
            <Suspense fallback={<LoadingComponent />}>
                <ProtectedRoute>
                    <Reports />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    {
        path: "/smartbin-report",
        element: (
            <Suspense fallback={<LoadingComponent />}>
                <ProtectedRoute>
                    <SmartBinReport />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    {
        path: "/waste-reports",
        element: (
            <Suspense fallback={<LoadingComponent />}>
                <ProtectedRoute>
                    <WasteReports />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    {
        path: "/payment-report",
        element: (
            <Suspense fallback={<LoadingComponent />}>
                <ProtectedRoute>
                    <PaymentsReport />
                </ProtectedRoute>
            </Suspense>
        ),
    },

]

export default LawmaAdminRoutes