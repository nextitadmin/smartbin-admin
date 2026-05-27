import { Suspense } from "react";
import LoadingComponent from "../components/LoadingComponent";
import Dashboard from "../PSPs/Dashboard";
import OrderManagement from "../PSPs/OrderManagement";
import ReportsPage from "../PSPs/Reports";
import PaymentsReport from "../PSPs/PaymentsReport";
import SmartBinReport from "../PSPs/SmartBinReport";
import WasteReports from "../PSPs/WasteReports";
import WasteManagement from "../PSPs/WasteManagement";
import AuditManager from "../PSPs/AuditManager";
import ServiceConfiguration from "../PSPs/ServiceConfiguration";
import TeamManagement from "../PSPs/TeamManagement"
import AdminAccess from "../PSPs/AdminAccess"
import BillsAndReceipts from "../PSPs/BillsAndReceipts";
import OutstandingBillComponent from "../components/PSPs/OutstabdingBill";
import Payments from "../components/PSPs/Payments";
import PaymentReceipt from "../components/PSPs/PaymentReceipt";
import ProtectedRoute from "../components/ProtectedRoute";


const PSPsRoutes = [{
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
    path: "/bills-and-receipts",
    element: (
        <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute>
                <BillsAndReceipts />
            </ProtectedRoute>
        </Suspense>
    ),
},
{
    path: "/outstanding-bills",
    element: (
        <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute>
                <OutstandingBillComponent />
            </ProtectedRoute>
        </Suspense>
    ),
},
{
    path: "/payments",
    element: (
        <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute>
                <Payments />
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
    path: "/service-configuration",
    element: (
        <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute>
                <ServiceConfiguration />
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
    path: "/reports/:id",
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
    path: "/payment-report/:id",
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
    path: "/smartbin-report/:id",
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
    path: "/waste-reports/:id",
    element: (
        <Suspense fallback={<LoadingComponent />}>
            <ProtectedRoute>
                <WasteReports />
            </ProtectedRoute>
        </Suspense>
    ),
},
]
export default PSPsRoutes