import React from 'react';
import {
    LayoutDashboardIcon,
    ShoppingCartIcon,
    PackageIcon,
    UsersIcon,
    MenuIcon,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const navItems = [
    {
        id: 'dashboard',
        labelKey: 'nav.dashboard',
        icon: <LayoutDashboardIcon className="w-5 h-5" />,
    },
    {
        id: 'orders',
        labelKey: 'nav.orders',
        icon: <ShoppingCartIcon className="w-5 h-5" />,
    },
    {
        id: 'items',
        labelKey: 'nav.items',
        icon: <PackageIcon className="w-5 h-5" />,
    },
    {
        id: 'customers',
        labelKey: 'nav.customers',
        icon: <UsersIcon className="w-5 h-5" />,
    },
];

const MobileBottomNav = ({
                             currentPage,
                             onNavigate,
                             onMenuClick,
                         }) => {
    const { t } = useLanguage();

    return (
        <nav
            className="fixed bottom-[-10px] left-0 right-0 z-30 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 lg:hidden safe-bottom"
            role="navigation"
            aria-label="Mobile navigation"
        >
            <div className="flex items-center justify-around h-14">
                {navItems.map((item) => {
                    const isActive = currentPage === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`
                flex flex-col items-center justify-center flex-1 h-full px-2 py-1
                transition-colors duration-200 no-select
                ${isActive ? 'text-primary-500' : 'text-slate-500 dark:text-slate-400 active:text-primary-500'}
              `}
                            aria-label={t(item.labelKey)}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {item.icon}
                            <span className="text-[10px] font-medium mt-0.5 truncate">
                {t(item.labelKey)}
              </span>
                        </button>
                    );
                })}

                {/* More button to open full sidebar */}
                <button
                    onClick={onMenuClick}
                    className="flex flex-col items-center justify-center flex-1 h-full px-2 py-1 text-slate-500 dark:text-slate-400 active:text-primary-500 transition-colors duration-200 no-select"
                    aria-label="Open menu"
                >
                    <MenuIcon className="w-5 h-5" />
                    <span className="text-[10px] font-medium mt-0.5">
            {t('nav.more')}
          </span>
                </button>
            </div>
        </nav>
    );
};

export default MobileBottomNav;