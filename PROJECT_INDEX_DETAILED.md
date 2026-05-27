# SmartBin Admin Frontend - Detailed Project Index

## Root Directory Files

### .env
Environment variables for the application configuration.

### .gitignore
Specifies intentionally untracked files to ignore in Git.

### eslint.config.js
Configuration file for ESLint, defining code quality rules and linting settings.

### index.html
Main HTML template file that serves as the entry point for the application.

### package-lock.json
Automatically generated file that describes the exact tree that was installed, ensuring consistent installs across environments.

### package.json
Project metadata, dependencies, scripts, and configuration.

### README.md
Project documentation and setup instructions.

### rules.md
Project-specific rules and guidelines.

### tailwind.config.js
Configuration file for Tailwind CSS, defining custom themes, variants, and plugins.

### vite.config.js
Configuration file for Vite build tool, defining build settings, plugins, and development server options.

## Public Directory

### public/
Contains static assets that are served directly without processing.

#### public/vite.svg
Default Vite logo.

#### public/images/
Directory containing various image assets used throughout the application:
- bill.svg
- box-search.svg
- bpim.jpg
- cardbg.png
- checkgradient.png
- document-text.svg
- documenticon.svg
- emptyimage.png
- lagosmewr.png
- lagosseal.png
- lawma-logo.png
- plus-square.svg
- sealLogo.svg
- smilebin.jpg
- wema-logo.png

## Source Directory (src/)

### Main Application Files

#### src/App.css
Global CSS styles for the application.

#### src/index.css
Main CSS file that imports Tailwind CSS and other global styles.

#### src/main.jsx
Entry point of the React application, where the app is rendered to the DOM.

### API Directory (src/api/)

#### src/api/apiConfig.js
Configuration for API endpoints, including base URLs, headers, and request/response interceptors.

#### src/api/test/
Directory containing API test files using Hurl, a command line tool for testing HTTP APIs.

##### src/api/test/README.md
Documentation for the API testing setup and usage instructions.

##### src/api/test/auth.hurl
API tests for authentication endpoints.

##### src/api/test/users.hurl
API tests for user management endpoints.

##### src/api/test/base.hurl
Base configuration file for Hurl tests with common variables and setup.

##### src/api/test/login.hurl
API tests for user login functionality.

##### src/api/test/login_verify.hurl
API tests for login verification endpoints.

##### src/api/test/create_account.hurl
API tests for account creation functionality.

##### src/api/test/accounts.hurl
API tests for account management endpoints.

##### src/api/test/accounts_roles.hurl
API tests for account roles and permissions endpoints.

##### src/api/test/smartbins.hurl
API tests for smartbins listing endpoints.

##### src/api/test/smartbin.hurl
API tests for individual smartbin endpoints.

##### src/api/test/smartbinOverview.hurl
API tests for smartbin overview data endpoints.

##### src/api/test/smartbin_delivered.hurl
API tests for delivered smartbins endpoints.

##### src/api/test/smartbin_application_details.hurl
API tests for smartbin application details endpoints.

### Assets Directory (src/assets/)

#### src/assets/react.svg
Default React logo asset.

### Components Directory (src/components/)

#### src/components/BinDisposalLineChart.jsx
React component for displaying bin disposal data in a line chart format.

#### src/components/ProtectedRoute.jsx
React component that protects routes requiring authentication by checking for valid tokens.

#### src/components/icons.jsx
Primary icon library containing all SVG icons used throughout the application with proper styling and active state handling.

#### src/components/icons2.jsx
Secondary icon library (alternative implementation) containing SVG icons.

#### src/components/LoadingComponent.jsx
Reusable loading indicator component.

#### src/components/SkeletonLoader.jsx
Skeleton loading component for displaying loading states while content is being fetched.

#### src/components/SuperAdmin/
Directory containing Super Admin specific components.

##### src/components/SuperAdmin/PaymentDetailsTable.jsx
Table component for displaying payment details with sorting and filtering capabilities.

##### src/components/SuperAdmin/PaymentsReportSkeletonLoader.jsx
Skeleton loader specifically for the payments report page.

##### src/components/SuperAdmin/RevenueSkeletonLoader.jsx
Skeleton loader specifically for the revenue page.

##### src/components/SuperAdmin/Sidebar.jsx
Navigation sidebar component for Super Admin users with menu items and active route highlighting.

##### src/components/SuperAdmin/Topbar.jsx
Top navigation bar component for Super Admin users with user profile and logout functionality.

##### src/components/SuperAdmin/SmartbinOverviewSkeletonLoader.jsx
Skeleton loader specifically for the smartbin overview page.

### Data Directory (src/data/)

#### src/data/demoReports.js
Demo data for reports, likely used for development and testing purposes.

### Pages Directory (src/pages/)

#### src/pages/404.jsx
Not found page component displayed when a route doesn't exist.

#### src/pages/App.jsx
Main application component that serves as the authentication login page for the application.

#### src/pages/Confirmation.jsx
Email verification and OTP confirmation page. This page handles the second step of the authentication process where users enter a 5-digit code sent to their email address to verify their identity.

### Router Directory (src/router/)

#### src/router/index.jsx
Main router configuration that defines the application's routing structure.

#### src/router/SuperAdminRoutes.jsx
Router configuration specifically for Super Admin routes and protected pages.

### Stores Directory (src/stores/)

#### src/stores/routeStore.js
State management store for handling route-related data and navigation state.

#### src/stores/tokenStore.js
State management store for handling authentication tokens and user session data.

### SuperAdmin Directory (src/SuperAdmin/)

#### src/SuperAdmin/Dashboard.jsx
Main dashboard page for Super Admin users, likely showing an overview of key metrics.

#### src/SuperAdmin/DeliveredSmartBins.jsx
Page for tracking and managing delivered smart bins.

#### src/SuperAdmin/PaymentDetails.jsx
Page displaying detailed payment information and transaction history.

#### src/SuperAdmin/PaymentsReport.jsx
Page for viewing and analyzing payment reports with filtering and export capabilities.

#### src/SuperAdmin/PSPCompanies.jsx
Page for managing Payment Service Provider (PSP) companies and their details.

#### src/SuperAdmin/Reports.jsx
General reports page that may aggregate various types of reports.

#### src/SuperAdmin/Revenue.jsx
Page for tracking and analyzing revenue metrics and trends.

#### src/SuperAdmin/SmartbinOverview.jsx
Page providing an overview of smart bin statuses, locations, and performance metrics.

#### src/SuperAdmin/SmartBinReport.jsx
Detailed reports specifically for smart bin data and analytics.

#### src/SuperAdmin/TeamsPage.jsx
Page for managing teams and users with role-based access control.

#### src/SuperAdmin/WasteReports.jsx
Page for viewing and analyzing waste collection and disposal reports.

#### src/SuperAdmin/DeliveredSmartBins.jsx
Page for tracking and managing delivered smart bins.

### Utils Directory (src/utils/)
Currently empty. Reserved for utility functions and helper methods.

## Key Features and Functionality

### Authentication and Authorization
- Token-based authentication with tokenStore.js
- Route protection for Super Admin pages using ProtectedRoute.jsx
- Login/logout functionality in Topbar component

### Data Visualization
- BinDisposalLineChart.jsx for displaying disposal trends
- Various reports pages with data tables and charts

### State Management
- Zustand stores for route and token management
- Component-level state for UI interactions

### UI Components
- Responsive sidebar navigation
- Loading states with skeleton loaders
- Icon library with consistent styling
- Data tables with sorting and filtering

### Reporting
- Multiple report types (payments, waste, smart bins)
- Export functionality for reports
- Demo data for development/testing

### API Testing
- Comprehensive API testing using Hurl
- Tests for authentication, user management, and smartbin endpoints
- README documentation for test usage

This index provides a comprehensive overview of the SmartBin Admin Frontend project structure and components.