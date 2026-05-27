import { Suspense } from "react";
import LoadingComponent from "../components/LoadingComponent";
import Dashboard from "../PSPsTeamMembers/Dashboard";
import ReportsPage from "../PSPsTeamMembers/Reports";
import PaymentsReport from "../PSPsTeamMembers/PaymentsReport";
import SmartBinReport from "../PSPsTeamMembers/SmartBinReport";
import WasteReports from "../PSPsTeamMembers/WasteReports";
import WastePickup from "../PSPsTeamMembers/WastePickup";
import ProtectedRoute from "../components/ProtectedRoute";



const PSPsTeamMembersRoutes = [{
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
    path: "/waste-pickup",
    element: (
        <Suspense fallback={<LoadingComponent />}>
        <ProtectedRoute>
            <WastePickup />
        </ProtectedRoute>
    </Suspense>
    )
}
]
export default PSPsTeamMembersRoutes