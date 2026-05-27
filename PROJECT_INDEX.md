# SmartBin Admin Frontend - Project Index

## Project Structure

```
smartbin-admin-frontend/
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── rules.md
├── tailwind.config.js
├── vite.config.js
├── public/
│   ├── vite.svg
│   └── images/
│       ├── bill.svg
│       ├── box-search.svg
│       ├── bpim.jpg
│       ├── cardbg.png
│       ├── checkgradient.png
│       ├── document-text.svg
│       ├── documenticon.svg
│       ├── emptyimage.png
│       ├── lagosmewr.png
│       ├── lagosseal.png
│       ├── lawma-logo.png
│       ├── plus-square.svg
│       ├── sealLogo.svg
│       ├── smilebin.jpg
│       └── wema-logo.png
├── src/
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   ├── api/
│   │   ├── apiConfig.js
│   │   └── test/
│   │       ├── README.md
│   │       ├── auth.hurl
│   │       ├── users.hurl
│   │       ├── base.hurl
│   │       ├── login.hurl
│   │       ├── login_verify.hurl
│   │       ├── create_account.hurl
│   │       ├── accounts.hurl
│   │       ├── accounts_roles.hurl
│   │       ├── smartbins.hurl
│   │       ├── smartbin.hurl
│   │       ├── smartbinOverview.hurl
│   │       ├── smartbin_delivered.hurl
│   │       └── smartbin_application_details.hurl
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── BinDisposalLineChart.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── icons.jsx
│   │   ├── icons2.jsx
│   │   ├── LoadingComponent.jsx
│   │   ├── SkeletonLoader.jsx
│   │   └── SuperAdmin/
│   │       ├── PaymentDetailsTable.jsx
│   │       ├── PaymentsReportSkeletonLoader.jsx
│   │       ├── RevenueSkeletonLoader.jsx
│   │       ├── Sidebar.jsx
│   │       └── Topbar.jsx
│   ├── data/
│   │   └── demoReports.js
│   ├── pages/
│   │   ├── 404.jsx
│   │   ├── App.jsx
│   │   └── Confirmation.jsx
│   ├── router/
│   │   ├── index.jsx
│   │   └── SuperAdminRoutes.jsx
│   ├── stores/
│   │   ├── routeStore.js
│   │   └── tokenStore.js
│   ├── SuperAdmin/
│   │   ├── Dashboard.jsx
│   │   ├── DeliveredSmartBins.jsx
│   │   ├── PaymentDetails.jsx
│   │   ├── PaymentsReport.jsx
│   │   ├── PSPCompanies.jsx
│   │   ├── Reports.jsx
│   │   ├── Revenue.jsx
│   │   ├── SmartbinOverview.jsx
│   │   ├── SmartBinReport.jsx
│   │   ├── TeamsPage.jsx
│   │   └── WasteReports.jsx
│   └── utils/
```

## Key Components

### Icons
- `src/components/icons.jsx` - Main icon library with all SVG icons
- `src/components/icons2.jsx` - Alternative icon library

### Super Admin Components
- `src/components/SuperAdmin/Sidebar.jsx` - Navigation sidebar for Super Admin
- `src/components/SuperAdmin/Topbar.jsx` - Top navigation bar
- `src/components/SuperAdmin/PaymentDetailsTable.jsx` - Table for payment details
- Various skeleton loaders for loading states

### Authentication Components
- `src/components/ProtectedRoute.jsx` - Component for protecting routes that require authentication

### Main Pages
- `src/SuperAdmin/Dashboard.jsx` - Main dashboard
- `src/SuperAdmin/Revenue.jsx` - Revenue tracking
- `src/SuperAdmin/SmartbinOverview.jsx` - Smartbin status overview
- `src/SuperAdmin/PSPCompanies.jsx` - Payment Service Providers
- `src/SuperAdmin/PaymentDetails.jsx` - Detailed payment information
- `src/SuperAdmin/Reports.jsx` - General reports
- `src/SuperAdmin/SmartBinReport.jsx` - Specific smartbin reports
- `src/SuperAdmin/WasteReports.jsx` - Waste collection reports
- `src/SuperAdmin/TeamsPage.jsx` - Team management
- `src/SuperAdmin/DeliveredSmartBins.jsx` - Delivered smartbins tracking
- `src/SuperAdmin/PaymentsReport.jsx` - Payment reports

### Authentication Pages
- `src/pages/App.jsx` - Authentication login page
- `src/pages/Confirmation.jsx` - Email verification and OTP confirmation page

### Routing
- `src/router/index.jsx` - Main router configuration
- `src/router/SuperAdminRoutes.jsx` - Super Admin specific routes

### State Management
- `src/stores/routeStore.js` - Route state management
- `src/stores/tokenStore.js` - Authentication token storage

### API
- `src/api/apiConfig.js` - API configuration and endpoints

### API Testing
- `src/api/test/` - Directory containing Hurl API test files
- Various `.hurl` files for testing different API endpoints

### Utilities
- `src/data/demoReports.js` - Demo data for reports
- `src/pages/404.jsx` - Not found page
- `src/pages/App.jsx` - Main app component

## Configuration Files
- `package.json` - Project dependencies and scripts
- `tailwind.config.js` - Tailwind CSS configuration
- `vite.config.js` - Vite build configuration
- `eslint.config.js` - ESLint configuration
- `.env` - Environment variables
- `.gitignore` - Git ignore patterns