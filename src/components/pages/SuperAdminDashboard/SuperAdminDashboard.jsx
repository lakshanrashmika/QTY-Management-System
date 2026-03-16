import React from 'react';
import {
    BuildingIcon,
    UsersIcon,
    DollarSignIcon,
    ShoppingCartIcon,
    TrendingUpIcon,
    CheckCircleIcon,
    XCircleIcon,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const mockStats = {
    totalBusinesses: 156,
    activeBusinesses: 142,
    suspendedBusinesses: 14,
    totalRevenue: 458920,
    monthlyRevenue: 45890,
    totalUsers: 892,
    totalOrders: 12450,
};

const recentBusinesses = [
    {
        business_id: '1',
        business_name: 'Tech Store Pro',
        owner_name: 'John Smith',
        subscription_status: 'active',
        createdAt: new Date(),
    },
    {
        business_id: '2',
        business_name: 'Fashion Hub',
        owner_name: 'Sarah Johnson',
        subscription_status: 'active',
        createdAt: new Date(),
    },
    {
        business_id: '3',
        business_name: 'Sports Outlet',
        owner_name: 'Mike Brown',
        subscription_status: 'expired',
        createdAt: new Date(),
    },
    {
        business_id: '4',
        business_name: 'Home Decor Plus',
        owner_name: 'Emily Davis',
        subscription_status: 'active',
        createdAt: new Date(),
    },
    {
        business_id: '5',
        business_name: 'Book World',
        owner_name: 'Chris Wilson',
        subscription_status: 'suspended',
        createdAt: new Date(),
    },
];

const statusColors = {
    active:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    expired:
        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

function StatCard({ title, value, icon, color, trend }) {
    const { t } = useLanguage();

    const colors = {
        blue: 'bg-blue-500',
        green: 'bg-emerald-500',
        yellow: 'bg-amber-500',
        red: 'bg-red-500',
        purple: 'bg-purple-500',
        cyan: 'bg-cyan-500',
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {title}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                        {value}
                    </p>
                    {trend && (
                        <p
                            className={`mt-1 text-sm flex items-center gap-1 ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}
                        >
                            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                            <span className="text-slate-500 dark:text-slate-400 ml-1">
                {t('super_admin.vs_last_month')}
              </span>
                        </p>
                    )}
                </div>
                <div className={`${colors[color]} p-3 rounded-lg text-white`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

const SuperAdminDashboard = () => {
    const { t } = useLanguage();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title={t('super_admin.total_businesses')}
                    value={mockStats.totalBusinesses}
                    icon={<BuildingIcon className="w-6 h-6" />}
                    color="blue"
                    trend={{
                        value: 8,
                        isPositive: true,
                    }}
                />
                <StatCard
                    title={t('super_admin.active_businesses')}
                    value={mockStats.activeBusinesses}
                    icon={<CheckCircleIcon className="w-6 h-6" />}
                    color="green"
                />
                <StatCard
                    title={t('super_admin.suspended')}
                    value={mockStats.suspendedBusinesses}
                    icon={<XCircleIcon className="w-6 h-6" />}
                    color="red"
                />
                <StatCard
                    title={t('super_admin.total_users')}
                    value={mockStats.totalUsers}
                    icon={<UsersIcon className="w-6 h-6" />}
                    color="purple"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                    title={t('super_admin.total_revenue')}
                    value={`$${mockStats.totalRevenue.toLocaleString()}`}
                    icon={<DollarSignIcon className="w-6 h-6" />}
                    color="green"
                    trend={{
                        value: 15,
                        isPositive: true,
                    }}
                />
                <StatCard
                    title={t('super_admin.monthly_revenue')}
                    value={`$${mockStats.monthlyRevenue.toLocaleString()}`}
                    icon={<TrendingUpIcon className="w-6 h-6" />}
                    color="cyan"
                    trend={{
                        value: 12,
                        isPositive: true,
                    }}
                />
                <StatCard
                    title={t('super_admin.total_orders')}
                    value={mockStats.totalOrders.toLocaleString()}
                    icon={<ShoppingCartIcon className="w-6 h-6" />}
                    color="blue"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {t('super_admin.recent_businesses')}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            {t('super_admin.latest_registered')}
                        </p>
                    </div>
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {recentBusinesses.map((business) => (
                            <div
                                key={business.business_id}
                                className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <BuildingIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {business.business_name}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {business.owner_name}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[business.subscription_status]}`}
                                >
                  {t(`businesses.${business.subscription_status}`)}
                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {t('super_admin.revenue_overview')}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            {t('super_admin.monthly_breakdown')}
                        </p>
                    </div>
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                            <div>
                                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                                    {t('super_admin.subscription_revenue')}
                                </p>
                                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                                    $38,450
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                                <DollarSignIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                            <div>
                                <p className="text-sm text-blue-600 dark:text-blue-400">
                                    {t('super_admin.transaction_fees')}
                                </p>
                                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                    $7,440
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                <TrendingUpIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">
                  {t('super_admin.total_this_month')}
                </span>
                                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  $45,890
                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {t('super_admin.subscription_status')}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        {t('super_admin.overview_subscriptions')}
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                    <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-center">
                        <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                            {mockStats.activeBusinesses}
                        </p>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
                            {t('super_admin.active_subscriptions')}
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-center">
                        <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">
                            8
                        </p>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                            {t('super_admin.expiring_soon')}
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-center">
                        <p className="text-4xl font-bold text-red-600 dark:text-red-400">
                            {mockStats.suspendedBusinesses}
                        </p>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                            {t('super_admin.suspended')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;