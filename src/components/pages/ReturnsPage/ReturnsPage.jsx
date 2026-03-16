import React, { useEffect, useState } from 'react';
import { PlusIcon, EyeIcon, CheckIcon, XIcon, SearchIcon, EditIcon, TrashIcon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Mock data
const mockReturns = [
    {
        return_id: 'RET-2024-001',
        business_id: 'biz1',
        order_id: '1',
        order_number: 'ORD-2024-001',
        reason: 'Defective product',
        return_status: 'approved',
        returned_date: new Date(),
        refund_status: 'completed',
        created_by: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        return_id: 'RET-2024-002',
        business_id: 'biz1',
        order_id: '2',
        order_number: 'ORD-2024-002',
        reason: 'Wrong size',
        return_status: 'requested',
        refund_status: 'pending',
        created_by: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        return_id: 'RET-2024-003',
        business_id: 'biz1',
        order_id: '3',
        order_number: 'ORD-2024-003',
        reason: 'Changed mind',
        return_status: 'rejected',
        refund_status: 'pending',
        order_lost: 'Customer refused to return',
        created_by: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

const statusColors = {
    requested:
        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    approved:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const refundColors = {
    pending:
        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    completed:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
};

const orderOptions = [
    {
        value: '1',
        label: 'ORD-2024-001',
    },
    {
        value: '2',
        label: 'ORD-2024-002',
    },
    {
        value: '3',
        label: 'ORD-2024-003',
    },
    {
        value: '4',
        label: 'ORD-2024-004',
    },
];

const ReturnsPage = () => {
    const { t } = useLanguage()
    const [returns, setReturns] = useState(mockReturns);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedReturn, setSelectedReturn] = useState(null);
    const [returnToDelete, setReturnToDelete] = useState(null);
    const [formData, setFormData] = useState({
        order_id: '',
        reason: '',
        order_lost: '',
        return_date: '',
        return_status: 'requested',
        refund_status: 'pending',
    });

    useEffect(() => {
        if (isModalOpen || isViewModalOpen || isEditModalOpen || isDeleteModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen, isViewModalOpen, isEditModalOpen, isDeleteModalOpen]);

    const filteredReturns = returns.filter(
        (r) =>
            r.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.return_id.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const handleSave = () => {
        const newReturnId = `RET-${new Date().getFullYear()}-${String(returns.length + 1).padStart(3, '0')}`;
        const newReturn = {
            return_id: newReturnId,
            business_id: 'biz1',
            order_id: formData.order_id,
            order_number: orderOptions.find((o) => o.value === formData.order_id)
                ?.label,
            reason: formData.reason,
            return_status: formData.return_status,
            refund_status: formData.refund_status,
            order_lost: formData.order_lost,
            returned_date: formData.return_date
                ? new Date(formData.return_date)
                : formData.return_status === 'approved'
                    ? new Date()
                    : undefined,
            created_by: '1',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        setReturns([newReturn, ...returns]);
        setIsModalOpen(false);
        resetForm();
    };

    const handleEdit = (ret) => {
        setSelectedReturn(ret);
        setFormData({
            order_id: ret.order_id,
            reason: ret.reason,
            order_lost: ret.order_lost || '',
            return_date: ret.returned_date
                ? new Date(ret.returned_date).toISOString().split('T')[0]
                : '',
            return_status: ret.return_status,
            refund_status: ret.refund_status,
        });
        setIsEditModalOpen(true);
    };

    const handleUpdate = () => {
        const updatedReturns = returns.map((r) =>
            r.return_id === selectedReturn.return_id
                ? {
                    ...r,
                    order_id: formData.order_id,
                    order_number: orderOptions.find((o) => o.value === formData.order_id)?.label,
                    reason: formData.reason,
                    return_status: formData.return_status,
                    refund_status: formData.refund_status,
                    order_lost: formData.order_lost,
                    returned_date: formData.return_date
                        ? new Date(formData.return_date)
                        : formData.return_status === 'approved'
                            ? new Date()
                            : r.returned_date,
                    updatedAt: new Date(),
                }
                : r
        );
        setReturns(updatedReturns);
        setIsEditModalOpen(false);
        setSelectedReturn(null);
        resetForm();
    };

    const handleDelete = (returnId) => {
        setReturns(returns.filter((r) => r.return_id !== returnId));
        setIsDeleteModalOpen(false);
        setReturnToDelete(null);
    };

    const confirmDelete = (ret) => {
        setReturnToDelete(ret);
        setIsDeleteModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            order_id: '',
            reason: '',
            order_lost: '',
            return_date: '',
            return_status: 'requested',
            refund_status: 'pending',
        });
    };

    const handleView = (ret) => {
        setSelectedReturn(ret);
        setIsViewModalOpen(true);
    };

    const handleUpdateStatus = (returnId, newStatus) => {
        setReturns(
            returns.map((r) =>
                r.return_id === returnId
                    ? {
                        ...r,
                        return_status: newStatus,
                        returned_date:
                            newStatus === 'approved' ? new Date() : r.returned_date,
                        updatedAt: new Date(),
                    }
                    : r,
            ),
        );
        setIsViewModalOpen(false);
    };

    const handleCompleteRefund = (returnId) => {
        setReturns(
            returns.map((r) =>
                r.return_id === returnId
                    ? {
                        ...r,
                        refund_status: 'completed',
                        updatedAt: new Date(),
                    }
                    : r,
            ),
        );
        setIsViewModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative w-full sm:w-72">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('returns.search')}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    {t('returns.new_return')}
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredReturns.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            {t('returns.no_returns')}
                        </div>
                    ) : (
                        filteredReturns.map((r) => (
                            <div key={r.return_id} className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="font-medium text-slate-900 dark:text-white">
                                        {r.order_number}
                                    </div>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 font-mono">
                                        {r.return_id}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="col-span-2">
                                        <span className="text-slate-500 text-xs block">
                                            {t('returns.reason')}
                                        </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                                            {r.reason}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 text-xs block mb-1">
                                            {t('common.status')}
                                        </span>
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.return_status]}`}
                                        >
                                            {r.return_status}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 text-xs block mb-1">
                                            {t('returns.refund')}
                                        </span>
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${refundColors[r.refund_status]}`}
                                        >
                                            {r.refund_status}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 text-xs block">
                                            {t('common.date')}
                                        </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                                            {new Date(r.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {r.returned_date && (
                                        <div>
                                            <span className="text-slate-500 text-xs block">
                                                {t('returns.return_date')}
                                            </span>
                                            <span className="text-slate-700 dark:text-slate-300">
                                                {new Date(r.returned_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                    <button
                                        onClick={() => handleView(r)}
                                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                        title={t('common.view')}
                                    >
                                        <EyeIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleEdit(r)}
                                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                        title={t('common.edit')}
                                    >
                                        <EditIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(r)}
                                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                        title={t('common.delete')}
                                    >
                                        <TrashIcon className="w-4 h-4" />
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
                                {t('returns.id')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('returns.order_number')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('returns.reason')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('common.status')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('returns.refund')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('common.date')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('returns.return_date')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('common.actions')}
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredReturns.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-4 py-8 text-center text-slate-500"
                                >
                                    {t('returns.no_returns')}
                                </td>
                            </tr>
                        ) : (
                            filteredReturns.map((r) => (
                                <tr
                                    key={r.return_id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                >
                                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white ">
                                        {r.return_id}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                                        {r.order_number}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {r.reason}
                                    </td>
                                    <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[r.return_status]}`}
                                            >
                                                {r.return_status}
                                            </span>
                                    </td>
                                    <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${refundColors[r.refund_status]}`}
                                            >
                                                {r.refund_status}
                                            </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {new Date(r.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {r.returned_date
                                            ? new Date(r.returned_date).toLocaleDateString()
                                            : '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleView(r)}
                                                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                                title={t('common.view')}
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(r)}
                                                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                                title={t('common.edit')}
                                            >
                                                <EditIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(r)}
                                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                title={t('common.delete')}
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* New Return Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="fixed inset-0 flex flex-col sm:items-center sm:justify-center sm:p-4">
                        <div
                            className="flex-1 sm:hidden"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <div className="relative w-full bg-white dark:bg-slate-800 shadow-xl rounded-t-2xl sm:rounded-xl sm:max-w-md max-h-[90vh] overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-300 dark:bg-slate-600 rounded-full sm:hidden" />
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white pt-2 sm:pt-0">
                                    {t('returns.new_return_request')}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                >
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-4 overflow-y-auto max-h-[calc(80vh-140px)] space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        {t('returns.order')}
                                    </label>
                                    <select
                                        value={formData.order_id}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                order_id: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">{t('common.select')}</option>
                                        {orderOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        {t('returns.reason_for_return')}
                                    </label>
                                    <textarea
                                        value={formData.reason}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                reason: e.target.value,
                                            })
                                        }
                                        rows={3}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('returns.return_status')}
                                        </label>
                                        <select
                                            value={formData.return_status}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    return_status: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="requested">
                                                {t('returns.requested')}
                                            </option>
                                            <option value="approved">{t('returns.approved')}</option>
                                            <option value="rejected">{t('returns.rejected')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('returns.refund_status')}
                                        </label>
                                        <select
                                            value={formData.refund_status}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    refund_status: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="pending">{t('orders.pending')}</option>
                                            <option value="completed">
                                                {t('returns.completed')}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        {t('returns.return_date')}
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.return_date}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                return_date: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        {t('returns.order_lost_notes')}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.order_lost}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                order_lost: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                >
                                    {t('common.cancel')}
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    {t('returns.submit_request')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Return Modal */}
            {isEditModalOpen && selectedReturn && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={() => {
                            setIsEditModalOpen(false);
                            resetForm();
                            setSelectedReturn(null);
                        }}
                    />
                    <div className="fixed inset-0 flex flex-col sm:items-center sm:justify-center sm:p-4">
                        <div
                            className="flex-1 sm:hidden"
                            onClick={() => {
                                setIsEditModalOpen(false);
                                resetForm();
                                setSelectedReturn(null);
                            }}
                        />
                        <div className="relative w-full bg-white dark:bg-slate-800 shadow-xl rounded-t-2xl sm:rounded-xl sm:max-w-md max-h-[90vh] overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-300 dark:bg-slate-600 rounded-full sm:hidden" />
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white pt-2 sm:pt-0">
                                    {t('returns.edit_return')}
                                </h2>
                                <button
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        resetForm();
                                        setSelectedReturn(null);
                                    }}
                                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                >
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-4 overflow-y-auto max-h-[calc(80vh-140px)] space-y-4">
                                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        <span className="font-medium">{t('returns.id')}:</span> {selectedReturn.return_id}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        {t('returns.order')}
                                    </label>
                                    <select
                                        value={formData.order_id}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                order_id: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">{t('common.select')}</option>
                                        {orderOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        {t('returns.reason_for_return')}
                                    </label>
                                    <textarea
                                        value={formData.reason}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                reason: e.target.value,
                                            })
                                        }
                                        rows={3}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('returns.return_status')}
                                        </label>
                                        <select
                                            value={formData.return_status}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    return_status: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="requested">
                                                {t('returns.requested')}
                                            </option>
                                            <option value="approved">{t('returns.approved')}</option>
                                            <option value="rejected">{t('returns.rejected')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('returns.refund_status')}
                                        </label>
                                        <select
                                            value={formData.refund_status}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    refund_status: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="pending">{t('orders.pending')}</option>
                                            <option value="completed">
                                                {t('returns.completed')}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        {t('returns.return_date')}
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.return_date}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                return_date: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        {t('returns.order_lost_notes')}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.order_lost}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                order_lost: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        resetForm();
                                        setSelectedReturn(null);
                                    }}
                                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                >
                                    {t('common.cancel')}
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    {t('common.save')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && returnToDelete && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={() => {
                            setIsDeleteModalOpen(false);
                            setReturnToDelete(null);
                        }}
                    />
                    <div className="fixed inset-0 flex flex-col sm:items-center sm:justify-center sm:p-4">
                        <div
                            className="flex-1 sm:hidden"
                            onClick={() => {
                                setIsDeleteModalOpen(false);
                                setReturnToDelete(null);
                            }}
                        />
                        <div className="relative w-full bg-white dark:bg-slate-800 shadow-xl rounded-t-2xl sm:rounded-xl sm:max-w-md overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                                    <TrashIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-center text-slate-900 dark:text-white mb-2">
                                    {t('returns.delete_confirmation_title')}
                                </h3>
                                <p className="text-sm text-center text-slate-600 dark:text-slate-400 mb-6">
                                    {t('returns.delete_confirmation_message')} "{returnToDelete.return_id}"?
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setIsDeleteModalOpen(false);
                                            setReturnToDelete(null);
                                        }}
                                        className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        {t('common.cancel')}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(returnToDelete.return_id)}
                                        className="flex-1 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        {t('common.delete')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Return Modal */}
            {isViewModalOpen && selectedReturn && (
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
                        <div className="relative w-full bg-white dark:bg-slate-800 shadow-xl rounded-t-2xl sm:rounded-xl sm:max-w-md max-h-[90vh] overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-300 dark:bg-slate-600 rounded-full sm:hidden" />
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white pt-2 sm:pt-0">
                                    {t('returns.details')}
                                </h2>
                                <button
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                >
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-slate-500">{t('returns.id')}</p>
                                        <p className="font-medium text-slate-900 dark:text-white font-mono">
                                            {selectedReturn.return_id}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {t('returns.order_number')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {selectedReturn.order_number}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">
                                            {t('common.status')}
                                        </p>
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[selectedReturn.return_status]}`}
                                        >
                                            {selectedReturn.return_status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">
                                            {t('returns.refund_status')}
                                        </p>
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${refundColors[selectedReturn.refund_status]}`}
                                        >
                                            {selectedReturn.refund_status}
                                        </span>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-slate-500">
                                            {t('returns.reason')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {selectedReturn.reason}
                                        </p>
                                    </div>
                                    {selectedReturn.returned_date && (
                                        <div>
                                            <p className="text-sm text-slate-500">
                                                {t('returns.returned_date')}
                                            </p>
                                            <p className="font-medium text-slate-900 dark:text-white">
                                                {new Date(
                                                    selectedReturn.returned_date,
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                    {selectedReturn.order_lost && (
                                        <div className="col-span-2">
                                            <p className="text-sm text-slate-500">
                                                {t('returns.order_lost_notes')}
                                            </p>
                                            <p className="font-medium text-slate-900 dark:text-white">
                                                {selectedReturn.order_lost}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {selectedReturn.return_status === 'requested' && (
                                    <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                                        <button
                                            onClick={() =>
                                                handleUpdateStatus(selectedReturn.return_id, 'approved')
                                            }
                                            className="flex items-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            <CheckIcon className="w-4 h-4 mr-2" />
                                            {t('returns.approve')}
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleUpdateStatus(selectedReturn.return_id, 'rejected')
                                            }
                                            className="flex items-center px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
                                        >
                                            <XIcon className="w-4 h-4 mr-2" />
                                            {t('returns.reject')}
                                        </button>
                                    </div>
                                )}

                                {selectedReturn.return_status === 'approved' &&
                                    selectedReturn.refund_status === 'pending' && (
                                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                            <button
                                                onClick={() =>
                                                    handleCompleteRefund(selectedReturn.return_id)
                                                }
                                                className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                                            >
                                                {t('returns.complete_refund')}
                                            </button>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReturnsPage;