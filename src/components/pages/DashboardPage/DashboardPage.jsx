import React from 'react';
import {
    ShoppingCartIcon,
    PackageIcon,
    TruckIcon,
    UsersIcon,
    AlertTriangleIcon,
    DollarSignIcon,
    ClockIcon,
    CheckCircleIcon,
    RotateCcwIcon,
    BoxIcon,
    TrendingUpIcon,
    TrendingDownIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const mockStats = {
    totalOrders: 1247,
    todayOrders: 23,
    pendingOrders: 45,
    deliveredOrders: 1156,
    returnedOrders: 46,
    totalCustomers: 892,
    lowStockItems: 12,
    damagedItems: 8,
    totalRevenue: 125680,
};

const recentOrders = [
    {
        order_id: '1',
        order_number: 'ORD-2024-001',
        customer_name: 'John Smith',
        total_amount: 299.99,
        status: 'pending',
    },
    {
        order_id: '2',
        order_number: 'ORD-2024-002',
        customer_name: 'Sarah Johnson',
        total_amount: 149.5,
        status: 'processing',
    },
    {
        order_id: '3',
        order_number: 'ORD-2024-003',
        customer_name: 'Mike Brown',
        total_amount: 599.0,
        status: 'shipped',
    },
    {
        order_id: '4',
        order_number: 'ORD-2024-004',
        customer_name: 'Emily Davis',
        total_amount: 89.99,
        status: 'delivered',
    },
    {
        order_id: '5',
        order_number: 'ORD-2024-005',
        customer_name: 'Chris Wilson',
        total_amount: 449.0,
        status: 'pending',
    },
];

const statusColors = {
    pending:
        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    processing:
        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    shipped: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    delivered:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    returned: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const StatCard = ({ title, value, icon, color, trend }) => {
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
                            className={`mt-1 text-sm flex items-center gap-1 ${
                                trend.isPositive ? 'text-emerald-600' : 'text-red-600'
                            }`}
                        >
                            {trend.isPositive ? (
                                <TrendingUpIcon className="w-4 h-4" />
                            ) : (
                                <TrendingDownIcon className="w-4 h-4" />
                            )}
                            {Math.abs(trend.value)}%
                            <span className="text-slate-500 dark:text-slate-400 ml-1">
                {t('dashboard.vs_last_month')}
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
};

export const DashboardPage = () => {
    const { hasPermission } = useAuth();
    const { t } = useLanguage();
    const showRevenue = hasPermission('revenue');

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title={t('dashboard.total_orders')}
                    value={mockStats.totalOrders.toLocaleString()}
                    icon={<ShoppingCartIcon className="w-6 h-6" />}
                    color="blue"
                    trend={{
                        value: 12,
                        isPositive: true,
                    }}
                />
                <StatCard
                    title={t('dashboard.todays_orders')}
                    value={mockStats.todayOrders}
                    icon={<ClockIcon className="w-6 h-6" />}
                    color="cyan"
                />
                <StatCard
                    title={t('dashboard.pending_orders')}
                    value={mockStats.pendingOrders}
                    icon={<PackageIcon className="w-6 h-6" />}
                    color="yellow"
                />
                <StatCard
                    title={t('dashboard.delivered_orders')}
                    value={mockStats.deliveredOrders.toLocaleString()}
                    icon={<CheckCircleIcon className="w-6 h-6" />}
                    color="green"
                />
            </div>



            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title={t('dashboard.returned_orders')}
                    value={mockStats.returnedOrders}
                    icon={<RotateCcwIcon className="w-6 h-6" />}
                    color="red"
                />
                <StatCard
                    title={t('dashboard.total_customers')}
                    value={mockStats.totalCustomers.toLocaleString()}
                    icon={<UsersIcon className="w-6 h-6" />}
                    color="purple"
                    trend={{
                        value: 8,
                        isPositive: true,
                    }}
                />
                <StatCard
                    title={t('dashboard.low_stock_items')}
                    value={mockStats.lowStockItems}
                    icon={<BoxIcon className="w-6 h-6" />}
                    color="yellow"
                />
                <StatCard
                    title={t('dashboard.damaged_items')}
                    value={mockStats.damagedItems}
                    icon={<AlertTriangleIcon className="w-6 h-6" />}
                    color="red"
                />
            </div>

            {showRevenue && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <StatCard
                        title={t('dashboard.total_revenue')}
                        value={`$${mockStats.totalRevenue.toLocaleString()}`}
                        icon={<DollarSignIcon className="w-6 h-6" />}
                        color="green"
                        trend={{
                            value: 15,
                            isPositive: true,
                        }}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {t('dashboard.recent_orders')}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            {t('dashboard.latest_orders')}
                        </p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                    {t('dashboard.order')}
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                    {t('dashboard.customer')}
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                    {t('dashboard.amount')}
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                    {t('common.status')}
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {recentOrders.map((order) => (
                                <tr
                                    key={order.order_id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                >
                                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                                        {order.order_number}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {order.customer_name}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        ${order.total_amount.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3">
                      <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}
                      >
                        {order.status}
                      </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                        {t('dashboard.quick_actions')}
                    </h3>
                    <div className="space-y-3">
                        <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                            <ShoppingCartIcon className="w-5 h-5" />
                            <span className="font-medium">{t('dashboard.new_order')}</span>
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                            <UsersIcon className="w-5 h-5" />
                            <span className="font-medium">{t('dashboard.add_customer')}</span>
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                            <PackageIcon className="w-5 h-5" />
                            <span className="font-medium">{t('dashboard.add_item')}</span>
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
                            <TruckIcon className="w-5 h-5" />
                            <span className="font-medium">
                {t('dashboard.track_shipment')}
              </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;