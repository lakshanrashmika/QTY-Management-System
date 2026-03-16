import React from 'react';
import {
    LayoutDashboardIcon,
    UsersIcon,
    TagIcon,
    PackageIcon,
    TruckIcon,
    ShoppingCartIcon,
    BoxIcon,
    RotateCcwIcon,
    CreditCardIcon,
    AlertTriangleIcon,
    UserCogIcon,
    SettingsIcon,
    FileTextIcon,
    BuildingIcon,
    LogOutIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    WarehouseIcon,
    XIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const businessNavItems = [
    {
        id: 'dashboard',
        labelKey: 'nav.dashboard',
        icon: <LayoutDashboardIcon className="w-5 h-5" />,
        permission: 'dashboard',
    },
    {
        id: 'customers',
        labelKey: 'nav.customers',
        icon: <UsersIcon className="w-5 h-5" />,
        permission: 'customers',
    },
    {
        id: 'categories',
        labelKey: 'nav.categories',
        icon: <TagIcon className="w-5 h-5" />,
        permission: 'categories',
    },
    {
        id: 'items',
        labelKey: 'nav.items',
        icon: <PackageIcon className="w-5 h-5" />,
        permission: 'items',
    },
    {
        id: 'wholesale',
        labelKey: 'nav.wholesale',
        icon: <WarehouseIcon className="w-5 h-5" />,
        permission: 'wholesale',
    },
    {
        id: 'couriers',
        labelKey: 'nav.couriers',
        icon: <TruckIcon className="w-5 h-5" />,
        permission: 'couriers',
    },
    {
        id: 'orders',
        labelKey: 'nav.orders',
        icon: <ShoppingCartIcon className="w-5 h-5" />,
        permission: 'orders',
    },
    {
        id: 'qty-management',
        labelKey: 'nav.qty_management',
        icon: <BoxIcon className="w-5 h-5" />,
        permission: 'qty_management',
    },
    {
        id: 'returns',
        labelKey: 'nav.returns',
        icon: <RotateCcwIcon className="w-5 h-5" />,
        permission: 'returns',
    },
    {
        id: 'payments',
        labelKey: 'nav.payments',
        icon: <CreditCardIcon className="w-5 h-5" />,
        permission: 'payments',
    },
    {
        id: 'damages',
        labelKey: 'nav.damages',
        icon: <AlertTriangleIcon className="w-5 h-5" />,
        permission: 'damages',
    },
    {
        id: 'users',
        labelKey: 'nav.users',
        icon: <UserCogIcon className="w-5 h-5" />,
        permission: 'users',
    },
    {
        id: 'reports',
        labelKey: 'nav.reports',
        icon: <FileTextIcon className="w-5 h-5" />,
        permission: 'reports',
    },
    {
        id: 'settings',
        labelKey: 'nav.settings',
        icon: <SettingsIcon className="w-5 h-5" />,
        permission: 'settings',
    },
];

const superAdminNavItems = [
    {
        id: 'super-dashboard',
        labelKey: 'nav.dashboard',
        icon: <LayoutDashboardIcon className="w-5 h-5" />,
        permission: '*',
    },
    {
        id: 'businesses',
        labelKey: 'nav.businesses',
        icon: <BuildingIcon className="w-5 h-5" />,
        permission: '*',
    },
    {
        id: 'all-users',
        labelKey: 'nav.all_users',
        icon: <UsersIcon className="w-5 h-5" />,
        permission: '*',
    },
    {
        id: 'subscriptions',
        labelKey: 'nav.subscriptions',
        icon: <CreditCardIcon className="w-5 h-5" />,
        permission: '*',
    },
    {
        id: 'super-reports',
        labelKey: 'nav.reports',
        icon: <FileTextIcon className="w-5 h-5" />,
        permission: '*',
    },
];

const Sidebar = ({
                     currentPage,
                     onNavigate,
                     isCollapsed,
                     onToggleCollapse,
                     isMobileOpen = false,
                     onCloseMobile,
                 }) => {
    const { user, logout, hasPermission } = useAuth();
    const { t } = useLanguage();

    const navItems =
        user?.role === 'super_admin' ? superAdminNavItems : businessNavItems;

    const filteredItems = navItems.filter((item) =>
        hasPermission(item.permission)
    );

    const handleNavClick = (page) => {
        onNavigate(page);
        if (onCloseMobile) {
            onCloseMobile();
        }
    };

    const handleLogout = () => {
        logout();
        if (onCloseMobile) {
            onCloseMobile();
        }
    };

    return (
        <>
            {/* Mobile backdrop overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
                    onClick={onCloseMobile}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed left-0 top-0 h-full z-50
          bg-white dark:bg-slate-900 
          border-r border-slate-200 dark:border-slate-800
          transition-all duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          w-72
          lg:translate-x-0
          ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
        `}
            >
                {/* Logo & Mobile Close */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          <span
              className={`text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent ${isCollapsed ? 'lg:hidden' : ''}`}
          >
            BizManager
          </span>

                    {/* Mobile close button */}
                    <button
                        onClick={onCloseMobile}
                        className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
                        aria-label="Close menu"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>

                    {/* Desktop collapse toggle */}
                    <button
                        onClick={onToggleCollapse}
                        className="hidden lg:flex p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isCollapsed ? (
                            <ChevronRightIcon className="w-5 h-5" />
                        ) : (
                            <ChevronLeftIcon className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* User Info */}
                <div
                    className={`p-4 border-b border-slate-200 dark:border-slate-800 ${isCollapsed ? 'lg:hidden' : ''}`}
                >
                    <p className="font-medium text-sm truncate text-slate-900 dark:text-white">
                        {user?.full_name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                        {user?.role?.replace('_', ' ')}
                    </p>
                </div>

                {/* Navigation */}
                <nav
                    className="p-2 flex-1 overflow-y-auto scroll-touch"
                    style={{
                        maxHeight: 'calc(100vh - 180px)',
                    }}
                >
                    <ul className="space-y-1">
                        {filteredItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => handleNavClick(item.id)}
                                    className={`
                    w-full flex items-center gap-3 px-3 rounded-lg transition-all duration-200
                    py-3 lg:py-2.5
                    ${currentPage === item.id ? 'bg-blue-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white active:bg-slate-200 dark:active:bg-slate-700'}
                    ${isCollapsed ? 'lg:justify-center' : ''}
                  `}
                                    title={isCollapsed ? t(item.labelKey) : undefined}
                                >
                                    {item.icon}
                                    <span
                                        className={`text-sm font-medium ${isCollapsed ? 'lg:hidden' : ''}`}
                                    >
                    {t(item.labelKey)}
                  </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Logout */}
                <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-slate-200 dark:border-slate-800 safe-bottom bg-white dark:bg-slate-900">
                    <button
                        onClick={handleLogout}
                        className={`
              w-full flex items-center gap-3 px-3 py-3 lg:py-2.5 rounded-lg
              text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 active:bg-red-100 dark:active:bg-red-500/20 transition-colors
              ${isCollapsed ? 'lg:justify-center' : ''}
            `}
                        title={isCollapsed ? t('nav.logout') : undefined}
                    >
                        <LogOutIcon className="w-5 h-5" />
                        <span
                            className={`text-sm font-medium ${isCollapsed ? 'lg:hidden' : ''}`}
                        >
              {t('nav.logout')}
            </span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;