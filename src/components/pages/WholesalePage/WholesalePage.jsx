import React, { useEffect, useState } from 'react';
import {
    PlusIcon,
    EditIcon,
    TrashIcon,
    EyeIcon,
    SearchIcon,
    XIcon,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const mockWholesales = [
    {
        wholesale_id: 'WS-2024-001',
        business_id: 'biz1',
        wholesale_name: 'ABC Wholesale',
        phone: '+1234567890',
        address: '100 Industrial Blvd',
        email: 'abc@wholesale.com',
        category_id: '1',
        created_by: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        wholesale_id: 'WS-2024-002',
        business_id: 'biz1',
        wholesale_name: 'XYZ Distributors',
        phone: '+1234567891',
        address: '200 Commerce St',
        email: 'xyz@dist.com',
        category_id: '2',
        created_by: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        wholesale_id: 'WS-2024-003',
        business_id: 'biz1',
        wholesale_name: 'Global Supplies',
        phone: '+1234567892',
        address: '300 Trade Ave',
        email: 'global@supplies.com',
        category_id: '1',
        created_by: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

const categoryOptions = [
    {
        value: '1',
        label: 'Electronics',
    },
    {
        value: '2',
        label: 'Clothing',
    },
    {
        value: '3',
        label: 'Home & Garden',
    },
    {
        value: '4',
        label: 'Sports',
    },
];

function generateWholesaleId(wholesales) {
    const year = new Date().getFullYear();
    const existingCodes = wholesales
        .map((w) => {
            const match = w.wholesale_id.match(/WS-(\d{4})-(\d{3})/);
            return match && match[1] === year.toString() ? parseInt(match[2]) : 0;
        })
        .filter((n) => n > 0);
    const nextNum = existingCodes.length > 0 ? Math.max(...existingCodes) + 1 : 1;
    return `WS-${year}-${String(nextNum).padStart(3, '0')}`;
}

const WholesalePage = () => {
    const { t } = useLanguage();
    const [wholesales, setWholesales] = useState(mockWholesales);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedWholesale, setSelectedWholesale] = useState(null);
    const [formData, setFormData] = useState({
        wholesale_id: '',
        wholesale_name: '',
        phone: '',
        email: '',
        address: '',
        category_id: '',
    });

    useEffect(() => {
        if (isModalOpen || isViewModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen, isViewModalOpen]);

    const filteredWholesales = wholesales.filter(
        (w) =>
            w.wholesale_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            w.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            w.wholesale_id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = (wholesale) => {
        if (wholesale) {
            setSelectedWholesale(wholesale);
            setFormData({
                wholesale_id: wholesale.wholesale_id,
                wholesale_name: wholesale.wholesale_name,
                phone: wholesale.phone,
                email: wholesale.email,
                address: wholesale.address,
                category_id: wholesale.category_id,
            });
        } else {
            setSelectedWholesale(null);
            const nextId = generateWholesaleId(wholesales);
            setFormData({
                wholesale_id: nextId,
                wholesale_name: '',
                phone: '',
                email: '',
                address: '',
                category_id: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (selectedWholesale) {
            setWholesales(
                wholesales.map((w) =>
                    w.wholesale_id === selectedWholesale.wholesale_id
                        ? {
                            ...w,
                            ...formData,
                            updatedAt: new Date(),
                        }
                        : w
                )
            );
        } else {
            const newWholesaleId = `WS-${new Date().getFullYear()}-${String(wholesales.length + 1).padStart(3, '0')}`;
            const newWholesale = {
                wholesale_id: newWholesaleId,
                business_id: 'biz1',
                ...formData,
                created_by: '1',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            setWholesales([...wholesales, newWholesale]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (confirm(t('wholesale.delete_confirm'))) {
            setWholesales(wholesales.filter((w) => w.wholesale_id !== id));
        }
    };

    const handleView = (wholesale) => {
        setSelectedWholesale(wholesale);
        setIsViewModalOpen(true);
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
                        placeholder={t('wholesale.search')}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    {t('wholesale.add')}
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                {/* Mobile View */}
                <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredWholesales.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            {t('wholesale.no_wholesale')}
                        </div>
                    ) : (
                        filteredWholesales.map((wholesale) => (
                            <div key={wholesale.wholesale_id} className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="font-medium text-slate-900 dark:text-white">
                                        {wholesale.wholesale_name}
                                    </div>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 font-mono">
                    {wholesale.wholesale_id}
                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                    <span className="text-slate-500 text-xs block">
                      {t('common.email')}
                    </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                      {wholesale.email}
                    </span>
                                    </div>
                                    <div>
                    <span className="text-slate-500 text-xs block">
                      {t('common.phone')}
                    </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                      {wholesale.phone}
                    </span>
                                    </div>
                                    <div className="col-span-2">
                    <span className="text-slate-500 text-xs block">
                      {t('common.address')}
                    </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                      {wholesale.address}
                    </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                    <button
                                        onClick={() => handleView(wholesale)}
                                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                    >
                                        <EyeIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleOpenModal(wholesale)}
                                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                    >
                                        <EditIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(wholesale.wholesale_id)}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
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
                                {t('wholesale.id')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('common.name')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('common.email')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('common.phone')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('common.address')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('common.actions')}
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredWholesales.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-8 text-center text-slate-500"
                                >
                                    {t('wholesale.no_wholesale')}
                                </td>
                            </tr>
                        ) : (
                            filteredWholesales.map((wholesale) => (
                                <tr
                                    key={wholesale.wholesale_id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                >
                                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                                        {wholesale.wholesale_id}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                                        {wholesale.wholesale_name}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {wholesale.email}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {wholesale.phone}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {wholesale.address}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleView(wholesale)}
                                                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleOpenModal(wholesale)}
                                                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                            >
                                                <EditIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(wholesale.wholesale_id)}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
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

            {/* Add/Edit Modal */}
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
                        <div className="relative w-full bg-white dark:bg-slate-800 shadow-xl rounded-t-2xl sm:rounded-xl sm:max-w-lg max-h-[90vh] overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-300 dark:bg-slate-600 rounded-full sm:hidden" />
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white pt-2 sm:pt-0">
                                    {selectedWholesale ? t('wholesale.edit') : t('wholesale.add')}
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
                                        {t('wholesale.id')}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.wholesale_id}
                                        disabled
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed font-mono"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">
                                        {t('common.auto_generated')}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        {t('wholesale.name')}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.wholesale_name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                wholesale_name: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('common.phone')}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    phone: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('common.email')}
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    email: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        {t('common.address')}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                address: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        {t('common.category')}
                                    </label>
                                    <select
                                        value={formData.category_id}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                category_id: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">{t('common.select')}</option>
                                        {categoryOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                >
                                    {t('common.cancel')}
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    {t('common.save')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {isViewModalOpen && selectedWholesale && (
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
                                    {t('wholesale.details')}
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
                                        <p className="text-sm text-slate-500">
                                            {t('wholesale.id')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white font-mono">
                                            {selectedWholesale.wholesale_id}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">{t('common.name')}</p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {selectedWholesale.wholesale_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {t('common.phone')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {selectedWholesale.phone}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {t('common.email')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {selectedWholesale.email}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-slate-500">
                                            {t('common.address')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {selectedWholesale.address}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WholesalePage;