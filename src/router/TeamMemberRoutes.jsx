import { Suspense } from "react";
import LoadingComponent from "../components/LoadingComponent";
import Dashboard from "../TeamMembers/Dashboard";
import OrderManagement from "../TeamMembers/OrderManagement";
import ReportsPage from "../TeamMembers/Reports";
import PaymentsReport from "../TeamMembers/PaymentsReport";
import SmartBinReport from "../TeamMembers/SmartBinReport";
import WasteReports from "../TeamMembers/WasteReports";
import ProtectedRoute from "../components/ProtectedRoute";
import TestFinishDelivery from "../TeamMembers/TestFinishDelivery";



const TeamMembersRoutes = [{
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
{
    path: "/test-finish-delivery",
    element: (
        <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute>
                <TestFinishDelivery />
            </ProtectedRoute>
        </Suspense>
    ),
},
]
export default TeamMembersRoutes