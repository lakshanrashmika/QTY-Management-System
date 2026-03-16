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

const mockCustomers = [
    {
        customer_id: 'CUM-2024-001',
        business_id: 'biz1',
        full_name: 'John Smith',
        phone: '+1234567890',
        email: 'john@example.com',
        address: '123 Main St',
        city: 'New York',
        district: 'Manhattan',
        postal_code: '10001',
        created_by: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        customer_id: 'CUM-2024-002',
        business_id: 'biz1',
        full_name: 'Sarah Johnson',
        phone: '+1234567891',
        email: 'sarah@example.com',
        address: '456 Oak Ave',
        city: 'Los Angeles',
        district: 'Downtown',
        postal_code: '90001',
        created_by: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        customer_id: 'CUM-2024-003',
        business_id: 'biz1',
        full_name: 'Mike Brown',
        phone: '+1234567892',
        email: 'mike@example.com',
        address: '789 Pine Rd',
        city: 'Chicago',
        district: 'Loop',
        postal_code: '60601',
        created_by: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        customer_id: 'CUM-2024-004',
        business_id: 'biz1',
        full_name: 'Emily Davis',
        phone: '+1234567893',
        email: 'emily@example.com',
        address: '321 Elm St',
        city: 'Houston',
        district: 'Midtown',
        postal_code: '77001',
        created_by: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        customer_id: 'CUM-2024-005',
        business_id: 'biz1',
        full_name: 'Chris Wilson',
        phone: '+1234567894',
        email: 'chris@example.com',
        address: '654 Cedar Ln',
        city: 'Phoenix',
        district: 'Central',
        postal_code: '85001',
        created_by: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

const generateCustomerId = (customers) => {
    const year = new Date().getFullYear();
    const existingCodes = customers
        .map((c) => {
            const match = c.customer_id.match(/CUM-(\d{4})-(\d{3})/);
            return match && match[1] === year.toString() ? parseInt(match[2]) : 0;
        })
        .filter((n) => n > 0);
    const nextNum = existingCodes.length > 0 ? Math.max(...existingCodes) + 1 : 1;
    return `CUM-${year}-${String(nextNum).padStart(3, '0')}`;
};

export const CustomersPage = () => {
    const { t } = useLanguage();
    const [customers, setCustomers] = useState(mockCustomers);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [formData, setFormData] = useState({
        customer_id: '',
        full_name: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        district: '',
        postal_code: '',
        notes: '',
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

    const filteredCustomers = customers.filter(
        (c) =>
            c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone.includes(searchQuery) ||
            c.customer_id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = (customer) => {
        if (customer) {
            setSelectedCustomer(customer);
            setFormData({
                customer_id: customer.customer_id,
                full_name: customer.full_name,
                phone: customer.phone,
                email: customer.email,
                address: customer.address,
                city: customer.city,
                district: customer.district,
                postal_code: customer.postal_code,
                notes: customer.notes || '',
            });
        } else {
            setSelectedCustomer(null);
            const nextId = generateCustomerId(customers);
            setFormData({
                customer_id: nextId,
                full_name: '',
                phone: '',
                email: '',
                address: '',
                city: '',
                district: '',
                postal_code: '',
                notes: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (selectedCustomer) {
            setCustomers(
                customers.map((c) =>
                    c.customer_id === selectedCustomer.customer_id
                        ? {
                            ...c,
                            ...formData,
                            updatedAt: new Date(),
                        }
                        : c
                )
            );
        } else {
            const newCustomerId = `CUM-${new Date().getFullYear()}-${String(customers.length + 1).padStart(3, '0')}`;
            const newCustomer = {
                customer_id: newCustomerId,
                business_id: 'biz1',
                ...formData,
                created_by: '1',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            setCustomers([...customers, newCustomer]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (confirm(t('customers.delete_confirm'))) {
            setCustomers(customers.filter((c) => c.customer_id !== id));
        }
    };

    const handleView = (customer) => {
        setSelectedCustomer(customer);
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
                        placeholder={t('customers.search')}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    {t('customers.add')}
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredCustomers.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            {t('customers.no_customers')}
                        </div>
                    ) : (
                        filteredCustomers.map((customer) => (
                            <div key={customer.customer_id} className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="font-medium text-slate-900 dark:text-white">
                                        {customer.full_name}
                                    </div>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 font-mono">
                    {customer.customer_id}
                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                    <span className="text-slate-500 text-xs block">
                      {t('customers.email')}
                    </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                      {customer.email}
                    </span>
                                    </div>
                                    <div>
                    <span className="text-slate-500 text-xs block">
                      {t('customers.phone')}
                    </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                      {customer.phone}
                    </span>
                                    </div>
                                    <div>
                    <span className="text-slate-500 text-xs block">
                      {t('customers.city')}
                    </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                      {customer.city}
                    </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                    <button
                                        onClick={() => handleView(customer)}
                                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                    >
                                        <EyeIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleOpenModal(customer)}
                                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                    >
                                        <EditIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(customer.customer_id)}
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
                                {t('customers.id')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('customers.name')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('customers.email')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('customers.phone')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('customers.city')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('common.actions')}
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredCustomers.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-8 text-center text-slate-500"
                                >
                                    {t('customers.no_customers')}
                                </td>
                            </tr>
                        ) : (
                            filteredCustomers.map((customer) => (
                                <tr
                                    key={customer.customer_id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                >
                                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                                        {customer.customer_id}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                                        {customer.full_name}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {customer.email}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {customer.phone}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {customer.city}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleView(customer)}
                                                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleOpenModal(customer)}
                                                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                            >
                                                <EditIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(customer.customer_id)}
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
                        <div className="relative w-full bg-white dark:bg-slate-800 shadow-xl rounded-t-2xl sm:rounded-xl sm:max-w-2xl max-h-[90vh] overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-300 dark:bg-slate-600 rounded-full sm:hidden" />
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white pt-2 sm:pt-0">
                                    {selectedCustomer ? t('customers.edit') : t('customers.add')}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                >
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-4 overflow-y-auto max-h-[calc(80vh-140px)]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('customers.id')}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.customer_id}
                                            disabled
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed font-mono"
                                        />
                                        <p className="text-xs text-slate-500 mt-1">
                                            {t('common.auto_generated')}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('customers.name')}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.full_name}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    full_name: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('customers.phone')}
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
                                            {t('customers.email')}
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
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('customers.city')}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    city: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('customers.district')}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.district}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    district: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('customers.postal_code')}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.postal_code}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    postal_code: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('customers.address')}
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
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('customers.notes')}
                                        </label>
                                        <textarea
                                            value={formData.notes}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    notes: e.target.value,
                                                })
                                            }
                                            rows={3}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        />
                                    </div>
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
            {isViewModalOpen && selectedCustomer && (
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
                                    {t('customers.details')}
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
                                            {t('customers.id')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white font-mono">
                                            {selectedCustomer.customer_id}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {t('customers.name')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {selectedCustomer.full_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {t('customers.phone')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {selectedCustomer.phone}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {t('customers.email')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {selectedCustomer.email}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {t('customers.city')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {selectedCustomer.city}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {t('customers.district')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {selectedCustomer.district}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-slate-500">
                                            {t('customers.address')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {selectedCustomer.address}
                                        </p>
                                    </div>
                                    {selectedCustomer.notes && (
                                        <div className="col-span-2">
                                            <p className="text-sm text-slate-500">
                                                {t('customers.notes')}
                                            </p>
                                            <p className="font-medium text-slate-900 dark:text-white">
                                                {selectedCustomer.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomersPage;