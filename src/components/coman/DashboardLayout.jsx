import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileBottomNav from './MobileBottomNav';

const DashboardLayout = ({
                             children,
                             currentPage,
                             pageTitle,
                             onNavigate,
                         }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleMobileMenuOpen = () => {
        setMobileMenuOpen(true);
    };

    const handleMobileMenuClose = () => {
        setMobileMenuOpen(false);
    };

    const handleNavigate = (page) => {
        onNavigate(page);
        setMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
            {/* Sidebar - handles its own mobile visibility */}
            <Sidebar
                currentPage={currentPage}
                onNavigate={handleNavigate}
                isCollapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                isMobileOpen={mobileMenuOpen}
                onCloseMobile={handleMobileMenuClose}
            />

            {/* Main Content */}
            <div
                className={`
          transition-all duration-300
          ml-0
          ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
        `}
            >
                <Header
                    title={pageTitle}
                    showMenuButton
                    onMenuClick={handleMobileMenuOpen}
                />

                {/* Main content area with bottom padding for mobile nav */}
                <main className="p-3 lg:p-6 pb-20 lg:pb-6 scroll-touch">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav
                currentPage={currentPage}
                onNavigate={handleNavigate}
                onMenuClick={handleMobileMenuOpen}
            />
        </div>
    );
};

export default DashboardLayout;