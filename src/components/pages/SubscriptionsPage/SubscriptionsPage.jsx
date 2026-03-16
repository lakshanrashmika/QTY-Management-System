import React, { useState } from 'react';
import {
    CreditCardIcon,
    CheckCircleIcon,
    ClockIcon,
    AlertTriangleIcon,
    SearchIcon,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const mockSubscriptions = [
    {
        id: '1',
        business_name: 'Tech Store Pro',
        plan: 'pro',
        amount: 49.99,
        status: 'active',
        start_date: new Date('2024-01-01'),
        end_date: new Date('2025-01-01'),
        auto_renew: true,
    },
    {
        id: '2',
        business_name: 'Fashion Hub',
        plan: 'enterprise',
        amount: 99.99,
        status: 'active',
        start_date: new Date('2024-02-15'),
        end_date: new Date('2025-02-15'),
        auto_renew: true,
    },
    {
        id: '3',
        business_name: 'Sports Outlet',
        plan: 'basic',
        amount: 19.99,
        status: 'expired',
        start_date: new Date('2023-06-01'),
        end_date: new Date('2024-06-01'),
        auto_renew: false,
    },
    {
        id: '4',
        business_name: 'Home Decor Plus',
        plan: 'pro',
        amount: 49.99,
        status: 'expiring',
        start_date: new Date('2024-03-01'),
        end_date: new Date('2024-03-15'),
        auto_renew: false,
    },
    {
        id: '5',
        business_name: 'Book World',
        plan: 'basic',
        amount: 19.99,
        status: 'active',
        start_date: new Date('2024-01-15'),
        end_date: new Date('2025-01-15'),
        auto_renew: true,
    },
];

const statusColors = {
    active:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    expiring:
        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    expired: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const planColors = {
    basic: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    pro: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    enterprise:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
};

function StatCard({ title, value, icon, color }) {
    const colors = {
        blue: 'bg-blue-500',
        green: 'bg-emerald-500',
        yellow: 'bg-amber-500',
        red: 'bg-red-500',
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
                </div>
                <div className={`${colors[color]} p-3 rounded-lg text-white`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

const SubscriptionsPage = () => {
    const { t } = useLanguage();
    const [subscriptions] = useState(mockSubscriptions);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const filteredSubscriptions = subscriptions.filter((s) => {
        const matchesSearch = s.business_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesStatus = !statusFilter || s.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const activeCount = subscriptions.filter((s) => s.status === 'active').length;
    const expiringCount = subscriptions.filter(
        (s) => s.status === 'expiring'
    ).length;
    const monthlyRevenue = subscriptions
        .filter((s) => s.status === 'active')
        .reduce((sum, s) => sum + s.amount, 0);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title={t('subscriptions.active_subscriptions')}
                    value={activeCount}
                    icon={<CheckCircleIcon className="w-6 h-6" />}
                    color="green"
                />
                <StatCard
                    title={t('subscriptions.expiring_soon')}
                    value={expiringCount}
                    icon={<ClockIcon className="w-6 h-6" />}
                    color="yellow"
                />
                <StatCard
                    title={t('subscriptions.monthly_revenue')}
                    value={`$${monthlyRevenue.toFixed(2)}`}
                    icon={<CreditCardIcon className="w-6 h-6" />}
                    color="blue"
                />
                <StatCard
                    title={t('subscriptions.churn_risk')}
                    value={`${((expiringCount / subscriptions.length) * 100).toFixed(1)}%`}
                    icon={<AlertTriangleIcon className="w-6 h-6" />}
                    color="red"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
                    <p className="text-sm text-slate-500 mb-1">
                        {t('subscriptions.basic_plan')}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        $19.99
                    </p>
                    <p className="text-sm text-slate-500">
                        {t('subscriptions.per_month')}
                    </p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        {subscriptions.filter((s) => s.plan === 'basic').length}{' '}
                        {t('subscriptions.businesses')}
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl border-2 border-blue-500 p-6 text-center relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
            {t('subscriptions.popular')}
          </span>
                    <p className="text-sm text-slate-500 mb-1 mt-2">
                        {t('subscriptions.pro_plan')}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        $49.99
                    </p>
                    <p className="text-sm text-slate-500">
                        {t('subscriptions.per_month')}
                    </p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        {subscriptions.filter((s) => s.plan === 'pro').length}{' '}
                        {t('subscriptions.businesses')}
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
                    <p className="text-sm text-slate-500 mb-1">
                        {t('subscriptions.enterprise_plan')}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        $99.99
                    </p>
                    <p className="text-sm text-slate-500">
                        {t('subscriptions.per_month')}
                    </p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        {subscriptions.filter((s) => s.plan === 'enterprise').length}{' '}
                        {t('subscriptions.businesses')}
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative w-full sm:w-72">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('subscriptions.search')}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full sm:w-48 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">{t('subscriptions.all_status')}</option>
                    <option value="active">{t('subscriptions.active')}</option>
                    <option value="expiring">{t('subscriptions.expiring')}</option>
                    <option value="expired">{t('subscriptions.expired')}</option>
                </select>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredSubscriptions.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            {t('subscriptions.no_subscriptions')}
                        </div>
                    ) : (
                        filteredSubscriptions.map((s) => (
                            <div key={s.id} className="p-4 space-y-3">
                                <div className="font-medium text-slate-900 dark:text-white">
                                    {s.business_name}
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                    <span className="text-slate-500 text-xs block mb-1">
                      {t('subscriptions.plan')}
                    </span>
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${planColors[s.plan]}`}
                                        >
                      {s.plan}
                    </span>
                                    </div>
                                    <div>
                    <span className="text-slate-500 text-xs block">
                      {t('subscriptions.amount')}
                    </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                      ${s.amount.toFixed(2)}
                                            {t('subscriptions.per_month')}
                    </span>
                                    </div>
                                    <div>
                    <span className="text-slate-500 text-xs block mb-1">
                      {t('subscriptions.status')}
                    </span>
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[s.status]}`}
                                        >
                      {t(`subscriptions.${s.status}`)}
                    </span>
                                    </div>
                                    <div>
                    <span className="text-slate-500 text-xs block">
                      {t('subscriptions.expires')}
                    </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                      {new Date(s.end_date).toLocaleDateString()}
                    </span>
                                    </div>
                                </div>
                                <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                                    <button className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        {t('subscriptions.manage')}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('subscriptions.businesses')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('subscriptions.plan')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('subscriptions.amount')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('subscriptions.status')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('subscriptions.expires')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('subscriptions.auto_renew')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('common.actions')}
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredSubscriptions.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-4 py-8 text-center text-slate-500"
                                >
                                    {t('subscriptions.no_subscriptions')}
                                </td>
                            </tr>
                        ) : (
                            filteredSubscriptions.map((s) => (
                                <tr
                                    key={s.id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                >
                                    <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                                        {s.business_name}
                                    </td>
                                    <td className="px-4 py-3">
                      <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${planColors[s.plan]}`}
                      >
                        {s.plan}
                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        ${s.amount.toFixed(2)}
                                        {t('subscriptions.per_month')}
                                    </td>
                                    <td className="px-4 py-3">
                      <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[s.status]}`}
                      >
                        {t(`subscriptions.${s.status}`)}
                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {new Date(s.end_date).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                      <span
                          className={
                              s.auto_renew ? 'text-emerald-600' : 'text-slate-400'
                          }
                      >
                        {s.auto_renew
                            ? t('subscriptions.yes')
                            : t('subscriptions.no')}
                      </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                            {t('subscriptions.manage')}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionsPage;