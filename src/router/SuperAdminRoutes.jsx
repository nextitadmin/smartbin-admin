import Dashboard from "../SuperAdmin/Dashboard";
import PSPCompanies from "../SuperAdmin/PSPCompanies";
import PaymentDetails from "../SuperAdmin/PaymentDetails";
import PSPRevenue from "../SuperAdmin/PSPRevenue";
import Revenue from "../SuperAdmin/Revenue";
import SmartbinOverview from "../SuperAdmin/SmartbinOverview";
import DeliveredSmartBins from "../SuperAdmin/DeliveredSmartBins";
import ReportsPage from "../SuperAdmin/Reports";
import SmartBinReport from "../SuperAdmin/SmartBinReport";
import WasteReports from "../SuperAdmin/WasteReports";
import PaymentReportPage from "../SuperAdmin/PaymentsReport";
import TeamsPage from "../SuperAdmin/TeamsPage";
import Reconciliation from "../SuperAdmin/Reconciliation";
import ProtectedRoute from "../components/ProtectedRoute";

import LoadingComponent from "../components/LoadingComponent";
import PaymentReceipt from "../components/SuperAdmin/Receipt";
import BillsReceipt from "../components/SuperAdmin/BillsReceipt";
import { Suspense } from "react";


const SuperAdminRoutes = [
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
        path: "/payment-details",
        element: (
            <Suspense fallback={<LoadingComponent />}>
                <ProtectedRoute>
                    <PSPRevenue />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    {
        // Keep the old "payment transactions" page accessible (it was previously mounted at /payment-details)
        path: "/payment-transactions",
        element: (
            <Suspense fallback={<LoadingComponent />}>
                <ProtectedRoute>
                    <PaymentDetails />
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
    {
        path: "/revenue-analysis",
        element: (
            <Suspense fallback={<LoadingComponent />}>
                <ProtectedRoute>
                    <Revenue />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    {
        path: "/reconciliation",
        element: (
            <Suspense fallback={<LoadingComponent />}>
                <ProtectedRoute>
                    <Reconciliation />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    {
        path: "/smartbin-overview",
        element: (
            <Suspense fallback={<LoadingComponent />}>
                <ProtectedRoute>
                    <SmartbinOverview />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    {
        path: "/delivered-smart-bins",
        element: (
            <Suspense fallback={<LoadingComponent />}>
                <ProtectedRoute>
                    <DeliveredSmartBins />
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
                    <PaymentReportPage />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    {
        path: "/team",
        element: (
            <Suspense fallback={<LoadingComponent />}>
                <ProtectedRoute>
                    <TeamsPage />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    {
        path: "/payment-receipt",
        element: (
            <Suspense fallback={<LoadingComponent />}>
                <ProtectedRoute>
                    <PaymentReceipt />
                </ProtectedRoute>
            </Suspense>
        ),
    },
    {
        path: "/bills-receipt",
        element: (
            <Suspense fallback={<LoadingComponent />}>
                <ProtectedRoute>
                    <BillsReceipt />
                </ProtectedRoute>
            </Suspense>
        ),
    },
]
export default SuperAdminRoutes;