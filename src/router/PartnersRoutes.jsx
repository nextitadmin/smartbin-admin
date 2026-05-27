import { Suspense } from "react";
import LoadingComponent from "../components/LoadingComponent";
import TeamManagement from "../Partners/TeamManagement";
import AdminAccess from "../Partners/AdminAccess"
import Dashboard from "../Partners/Dashboard";
import AuditManager from "../Partners/AuditManager";
import OrderManagement from "../Partners/OrderManagement";
import ReportsPage from "../Partners/Reports";
import PaymentsReport from "../Partners/PaymentsReport";
import SmartBinReport from "../Partners/SmartBinReport";
import WasteReports from "../Partners/WasteReports";
import ProtectedRoute from "../components/ProtectedRoute";

import OrderManagementModals from "../Partners/OrderManagementModals";


const PartnersRoutes = [{
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
    path: "/admin-access",
    element: (
        <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute>
                <AdminAccess />
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
    path: "/order-management-modals",
    element: (
        <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute>
                <OrderManagementModals />
            </ProtectedRoute>
        </Suspense>
    ),
},
{
    path: "/order-management",
    element: (
        <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute>
                <OrderManagement />
            </ProtectedRoute>
        </Suspense>
    ),
},
{
    path: "/reports",
    element: (
        <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute>
                <ReportsPage />
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
]
export default PartnersRoutes