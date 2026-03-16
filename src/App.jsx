import React, { useState } from 'react';
import { ThemeProvider } from './components/context/ThemeContext';
import { AuthProvider, useAuth } from './components/context/AuthContext';
import { LanguageProvider, useLanguage } from './components/context/LanguageContext';
import DashboardLayout from './components/coman/DashboardLayout';
import DashboardPage from './components/pages/DashboardPage/DashboardPage';
import CustomersPage from './components/pages/CustomersPage/CustomersPage';
import LoginPage from "./components/pages/LoginPage/LoginPage.jsx";
import CategoriesPage from "./components/pages/CategoriesPage/CategoriesPage.jsx";
import ItemsPage from "./components/pages/ItemsPage/ItemsPage.jsx";
import WholesalePage from "./components/pages/WholesalePage/WholesalePage.jsx";
import QtyManagementPage from "./components/pages/QtyManagementPage/QtyManagementPage.jsx";
import CouriersPage from "./components/pages/CouriersPage/CouriersPage.jsx";
import ReturnsPage from "./components/pages/ReturnsPage/ReturnsPage.jsx";
import PaymentsPage from "./components/pages/PaymentsPage/PaymentsPage.jsx";
import DamagesPage from "./components/pages/DamagesPage/DamagesPage.jsx";
import UsersPage from "./components/pages/UsersPage/UsersPage.jsx";
import ReportsPage from "./components/pages/ReportsPage/ReportsPage.jsx";
import SettingsPage from "./components/pages/SettingsPage/SettingsPage.jsx";
import OrdersPage from "./components/pages/OrdersPage/OrdersPage.jsx";
import SuperAdminDashboard from "./components/pages/SuperAdminDashboard/SuperAdminDashboard.jsx";
import BusinessesPage from "./components/pages/BusinessesPage/BusinessesPage.jsx";
import SubscriptionsPage from "./components/pages/SubscriptionsPage/SubscriptionsPage.jsx";

const pageTitleKeys = {
    dashboard: 'nav.dashboard',
    customers: 'nav.customers',
    categories: 'nav.categories',
    items: 'nav.items',
    wholesale: 'nav.wholesale',
    couriers: 'nav.couriers',
    orders: 'nav.orders',
    'qty-management': 'nav.qty_management',
    returns: 'nav.returns',
    payments: 'nav.payments',
    damages: 'nav.damages',
    users: 'nav.users',
    reports: 'nav.reports',
    settings: 'nav.settings',
    'super-dashboard': 'nav.dashboard',
    businesses: 'nav.businesses',
    'all-users': 'nav.all_users',
    subscriptions: 'nav.subscriptions',
    'super-reports': 'nav.reports',
};


function AppContent() {
    const { isAuthenticated, user } = useAuth();
    const { t } = useLanguage();
    const [currentPage, setCurrentPage] = useState(() => {
        return user?.role === 'super_admin' ? 'super-dashboard' : 'dashboard';
    });

    if (!isAuthenticated) {
        return <LoginPage />;
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <DashboardPage />;
            case 'customers':
                return <CustomersPage />;
            case 'categories':
                return <CategoriesPage />
            case 'items':
                return <ItemsPage />
            case 'wholesale':
                return <WholesalePage />
            case 'couriers':
                return <CouriersPage />
            case 'orders':
                return <OrdersPage />
            case 'qty-management':
                return <QtyManagementPage />
            case 'returns':
                return <ReturnsPage />
            case 'payments':
                return <PaymentsPage />
            case 'damages':
                return <DamagesPage />
            case 'users':
                return <UsersPage />
            case 'reports':
                return <ReportsPage />
            case 'settings':
                return <SettingsPage />
            case 'super-dashboard':
                return <SuperAdminDashboard />
            case 'businesses':
                return <BusinessesPage />
            case 'all-users':
                return <UsersPage />
            case 'subscriptions':
                return <SubscriptionsPage />
            case 'super-reports':
                return <ReportsPage />
            default:
                return <DashboardPage />;
        }
    };

    const titleKey = pageTitleKeys[currentPage] || 'nav.dashboard';

    return (
        <DashboardLayout
            currentPage={currentPage}
            pageTitle={t(titleKey)}
            onNavigate={setCurrentPage}
        >
            {renderPage()}
        </DashboardLayout>
    );
}

export function App() {
    return (
        <ThemeProvider>
            <LanguageProvider>
                <AuthProvider>
                    <AppContent />
                </AuthProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
}

export default App;