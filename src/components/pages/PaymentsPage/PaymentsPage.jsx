import React, { useState } from 'react';
import {
    EyeIcon,
    CheckIcon,
    DollarSignIcon,
    CreditCardIcon,
    BanknoteIcon,
    SearchIcon,
    XIcon,
    CalendarIcon,
    PencilIcon,
    TrashIcon,
} from 'lucide-react';
import {useLanguage} from "../../context/LanguageContext.jsx";


// Mock data
const mockPayments = [
    {
        payment_id: 'PAY-2024-001',
        business_id: 'biz1',
        order_id: '1',
        order_number: 'ORD-2024-001',
        amount: 185.97,
        payment_method: 'bank_transfer',
        payment_date: new Date('2024-01-15'),
        payment_status: 'verified',
        verified_by: '1',
        created_by: '1',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
    },
    {
        payment_id: 'PAY-2024-002',
        business_id: 'biz1',
        order_id: '2',
        order_number: 'ORD-2024-002',
        amount: 102.96,
        payment_method: 'cod',
        payment_date: new Date('2024-01-18'),
        payment_status: 'pending',
        created_by: '1',
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-18'),
    },
    {
        payment_id: 'PAY-2024-003',
        business_id: 'biz1',
        order_id: '3',
        order_number: 'ORD-2024-003',
        amount: 240.98,
        payment_method: 'bank_transfer',
        payment_date: new Date('2024-01-20'),
        payment_status: 'verified',
        verified_by: '1',
        created_by: '1',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
    },
    {
        payment_id: 'PAY-2024-004',
        business_id: 'biz1',
        order_id: '4',
        order_number: 'ORD-2024-004',
        amount: 83.97,
        payment_method: 'cod',
        payment_date: new Date('2024-01-22'),
        payment_status: 'pending',
        created_by: '1',
        createdAt: new Date('2024-01-22'),
        updatedAt: new Date('2024-01-22'),
    },
];

const statusColors = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    verified: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
};

const PaymentsPage = () => {
    // Language context mock (replace with your actual implementation)
    const { t } = useLanguage()
    const [payments, setPayments] = useState(mockPayments);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    // useEffect(() => {
    //     if (isViewModalOpen || isEditModalOpen || isDeleteModalOpen) {
    //         document.body.style.overflow = 'hidden';
    //     } else {
    //         document.body.style.overflow = 'unset';
    //     }
    //     return () => {
    //         document.body.style.overflow = 'unset';
    //     };
    // }, [isViewModalOpen, isEditModalOpen, isDeleteModalOpen]);

    const filteredPayments = payments.filter((p) => {
        const matchesSearch =
            p.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.payment_id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !statusFilter || p.payment_status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleView = (payment) => {
        setSelectedPayment(payment);
        setIsViewModalOpen(true);
    };


    const handleDelete = (payment) => {
        setSelectedPayment(payment);
        setIsDeleteModalOpen(true);
    };

    const handleVerify = (paymentId) => {
        setPayments(
            payments.map((p) =>
                p.payment_id === paymentId
                    ? {
                        ...p,
                        payment_status: 'verified',
                        verified_by: '1',
                        updatedAt: new Date(),
                    }
                    : p
            )
        );
        setIsViewModalOpen(false);
    };


    const handleDeleteConfirm = () => {
        setPayments(payments.filter((p) => p.payment_id !== selectedPayment.payment_id));
        setIsDeleteModalOpen(false);
        setSelectedPayment(null);
    };


    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const totalRevenue = payments
        .filter((p) => p.payment_status === 'verified')
        .reduce((sum, p) => sum + p.amount, 0);

    const pendingAmount = payments
        .filter((p) => p.payment_status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0);

    const codPayments = payments.filter((p) => p.payment_method === 'cod').length;
    const bankPayments = payments.filter((p) => p.payment_method === 'bank_transfer').length;

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                {t('payments.total_revenue')}
                            </p>
                            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                                ${totalRevenue.toFixed(2)}
                            </p>
                        </div>
                        <div className="bg-emerald-500 p-3 rounded-lg text-white">
                            <DollarSignIcon className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                {t('payments.pending_amount')}
                            </p>
                            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                                ${pendingAmount.toFixed(2)}
                            </p>
                        </div>
                        <div className="bg-amber-500 p-3 rounded-lg text-white">
                            <DollarSignIcon className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                {t('payments.cod_payments')}
                            </p>
                            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                                {codPayments}
                            </p>
                        </div>
                        <div className="bg-blue-500 p-3 rounded-lg text-white">
                            <BanknoteIcon className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                {t('payments.bank_transfers')}
                            </p>
                            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                                {bankPayments}
                            </p>
                        </div>
                        <div className="bg-purple-500 p-3 rounded-lg text-white">
                            <CreditCardIcon className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative w-full sm:w-72">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('payments.search')}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full sm:w-48 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">{t('payments.all_status')}</option>
                    <option value="pending">{t('orders.pending')}</option>
                    <option value="verified">{t('payments.verified')}</option>
                </select>
            </div>

            {/* Table Section */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredPayments.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            {t('payments.no_payments')}
                        </div>
                    ) : (
                        filteredPayments.map((p) => (
                            <div key={p.payment_id} className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="font-medium text-slate-900 dark:text-white">
                                        {p.order_number}
                                    </div>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 font-mono">
                    {p.payment_id}
                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                    <span className="text-slate-500 text-xs block">
                      {t('payments.amount')}
                    </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                      ${p.amount.toFixed(2)}
                    </span>
                                    </div>
                                    <div>
                    <span className="text-slate-500 text-xs block">
                      {t('payments.method')}
                    </span>
                                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                            {p.payment_method === 'cod' ? (
                                                <BanknoteIcon className="w-4 h-4 text-emerald-500" />
                                            ) : (
                                                <CreditCardIcon className="w-4 h-4 text-blue-500" />
                                            )}
                                            <span className="capitalize">
                        {p.payment_method.replace('_', ' ')}
                      </span>
                                        </div>
                                    </div>
                                    <div>
                    <span className="text-slate-500 text-xs block mb-1">
                      {t('common.status')}
                    </span>
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[p.payment_status]}`}
                                        >
                      {p.payment_status}
                    </span>
                                    </div>
                                    <div>
                    <span className="text-slate-500 text-xs block">
                      {t('common.date')}
                    </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                      {formatDate(p.payment_date)}
                    </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                    <button
                                        onClick={() => handleView(p)}
                                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                    >
                                        <EyeIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p)}
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                    {p.payment_status === 'pending' && (
                                        <button
                                            onClick={() => handleVerify(p.payment_id)}
                                            className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg"
                                        >
                                            <CheckIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('payments.payment_id')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('payments.order_number')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('payments.amount')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('payments.method')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('common.status')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('common.date')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('common.actions')}
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredPayments.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                                    {t('payments.no_payments')}
                                </td>
                            </tr>
                        ) : (
                            filteredPayments.map((p) => (
                                <tr
                                    key={p.payment_id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                >
                                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                                        {p.payment_id}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                                        {p.order_number}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        ${p.amount.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                            {p.payment_method === 'cod' ? (
                                                <BanknoteIcon className="w-4 h-4 text-emerald-500" />
                                            ) : (
                                                <CreditCardIcon className="w-4 h-4 text-blue-500" />
                                            )}
                                            <span className="capitalize">
                          {p.payment_method.replace('_', ' ')}
                        </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                      <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[p.payment_status]}`}
                      >
                        {p.payment_status}
                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {formatDate(p.payment_date)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleView(p)}
                                                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                                title="View Details"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p)}
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                title="Delete Payment"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                            {p.payment_status === 'pending' && (
                                                <button
                                                    onClick={() => handleVerify(p.payment_id)}
                                                    className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg"
                                                    title="Verify Payment"
                                                >
                                                    <CheckIcon className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Payment Modal */}
            {isViewModalOpen && selectedPayment && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={() => setIsViewModalOpen(false)}
                    />
                    <div className="fixed inset-0 flex flex-col sm:items-center sm:justify-center sm:p-4">
                        <div
                            className="flex-1 sm:hidden"
                            onClick={() => setIsViewModalOpen(false)}
                        />
                        <div className="relative w-full bg-white dark:bg-slate-800 shadow-xl rounded-t-2xl sm:rounded-xl sm:max-w-lg max-h-[90vh] overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-300 dark:bg-slate-600 rounded-full sm:hidden" />
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white pt-2 sm:pt-0">
                                    {t('payments.payment_details')}
                                </h2>
                                <button
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                >
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
                                {/* Payment Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                                selectedPayment.payment_method === 'cod'
                                                    ? 'bg-emerald-100 dark:bg-emerald-900/30'
                                                    : 'bg-blue-100 dark:bg-blue-900/30'
                                            }`}
                                        >
                                            {selectedPayment.payment_method === 'cod' ? (
                                                <BanknoteIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                            ) : (
                                                <CreditCardIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                {selectedPayment.payment_id}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {formatDate(selectedPayment.payment_date)}
                                            </p>
                                        </div>
                                    </div>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${statusColors[selectedPayment.payment_status]}`}
                                    >
                    {selectedPayment.payment_status}
                  </span>
                                </div>

                                {/* Payment Details */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {t('payments.order_number')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {selectedPayment.order_number}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {t('payments.amount')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white text-xl">
                                            ${selectedPayment.amount.toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {t('orders.payment_method')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white capitalize">
                                            {selectedPayment.payment_method.replace('_', ' ')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {t('payments.payment_date')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {formatDate(selectedPayment.payment_date)}
                                        </p>
                                    </div>
                                    {selectedPayment.verified_by && (
                                        <div className="col-span-2">
                                            <p className="text-sm text-slate-500">
                                                {t('payments.verified_by')}
                                            </p>
                                            <p className="font-medium text-slate-900 dark:text-white">
                                                Admin User
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                {selectedPayment.payment_status === 'pending' && (
                                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                        <button
                                            onClick={() => handleVerify(selectedPayment.payment_id)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-colors"
                                        >
                                            <CheckIcon className="w-5 h-5" />
                                            {t('payments.verify_payment')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && selectedPayment && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={() => setIsDeleteModalOpen(false)}
                    />
                    <div className="fixed inset-0 flex flex-col sm:items-center sm:justify-center sm:p-4">
                        <div
                            className="flex-1 sm:hidden"
                            onClick={() => setIsDeleteModalOpen(false)}
                        />
                        <div className="relative w-full bg-white dark:bg-slate-800 shadow-xl rounded-t-2xl sm:rounded-xl sm:max-w-md max-h-[90vh] overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-300 dark:bg-slate-600 rounded-full sm:hidden" />
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white pt-2 sm:pt-0">
                                    {t('payments.confirm_delete')}
                                </h2>
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                >
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 text-center">
                                <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                                    <TrashIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                                <p className="text-slate-900 dark:text-white font-medium mb-2">
                                    {t('payments.delete_confirmation')}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                    {t('payments.delete_warning')}
                                </p>
                                <p className="text-sm font-mono bg-slate-100 dark:bg-slate-700 p-2 rounded mb-6">
                                    {selectedPayment.payment_id} - ${selectedPayment.amount.toFixed(2)}
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        {t('payments.cancel')}
                                    </button>
                                    <button
                                        onClick={handleDeleteConfirm}
                                        className="flex-1 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        {t('payments.delete_payment')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentsPage;