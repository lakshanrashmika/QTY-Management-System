import React, { useEffect, useState } from 'react';
import {
    PlusIcon,
    EditIcon,
    TrashIcon,
    TruckIcon,
    SearchIcon,
    XIcon,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const mockCouriers = [
    {
        courier_id: 'COU-2024-001',
        business_id: 'biz1',
        courier_name: 'FedEx',
        price: 15.99,
        address: '123 Shipping Lane',
        contact_number: '+1234567890',
        created_by: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        courier_id: 'COU-2024-002',
        business_id: 'biz1',
        courier_name: 'UPS',
        price: 12.99,
        address: '456 Delivery Rd',
        contact_number: '+1234567891',
        created_by: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        courier_id: 'COU-2024-003',
        business_id: 'biz1',
        courier_name: 'DHL',
        price: 18.99,
        address: '789 Express Ave',
        contact_number: '+1234567892',
        created_by: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        courier_id: 'COU-2024-004',
        business_id: 'biz1',
        courier_name: 'Local Courier',
        price: 8.99,
        address: '321 Local St',
        contact_number: '+1234567893',
        created_by: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

function generateCourierId(couriers) {
    const year = new Date().getFullYear();
    const existingCodes = couriers
        .map((c) => {
            const match = c.courier_id.match(/COU-(\d{4})-(\d{3})/);
            return match && match[1] === year.toString() ? parseInt(match[2]) : 0;
        })
        .filter((n) => n > 0);
    const nextNum = existingCodes.length > 0 ? Math.max(...existingCodes) + 1 : 1;
    return `COU-${year}-${String(nextNum).padStart(3, '0')}`;
}

const CouriersPage = () => {
    const { t } = useLanguage();
    const [couriers, setCouriers] = useState(mockCouriers);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourier, setSelectedCourier] = useState(null);
    const [formData, setFormData] = useState({
        courier_id: '',
        courier_name: '',
        price: '',
        address: '',
        contact_number: '',
    });

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    const filteredCouriers = couriers.filter(
        (c) =>
            c.courier_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.courier_id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = (courier) => {
        if (courier) {
            setSelectedCourier(courier);
            setFormData({
                courier_id: courier.courier_id,
                courier_name: courier.courier_name,
                price: courier.price.toString(),
                address: courier.address,
                contact_number: courier.contact_number,
            });
        } else {
            setSelectedCourier(null);
            const nextId = generateCourierId(couriers);
            setFormData({
                courier_id: nextId,
                courier_name: '',
                price: '',
                address: '',
                contact_number: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        const courierData = {
            ...formData,
            price: parseFloat(formData.price),
        };

        if (selectedCourier) {
            setCouriers(
                couriers.map((c) =>
                    c.courier_id === selectedCourier.courier_id
                        ? {
                            ...c,
                            ...courierData,
                            updatedAt: new Date(),
                        }
                        : c
                )
            );
        } else {
            const newCourierId = `COU-${new Date().getFullYear()}-${String(couriers.length + 1).padStart(3, '0')}`;
            const newCourier = {
                courier_id: newCourierId,
                business_id: 'biz1',
                ...courierData,
                created_by: '1',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            setCouriers([...couriers, newCourier]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (confirm(t('couriers.delete_confirm'))) {
            setCouriers(couriers.filter((c) => c.courier_id !== id));
        }
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
                        placeholder={t('couriers.search')}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    {t('couriers.add')}
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                {/* Mobile View */}
                <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredCouriers.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            {t('couriers.no_couriers')}
                        </div>
                    ) : (
                        filteredCouriers.map((courier) => (
                            <div key={courier.courier_id} className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <TruckIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <span className="font-medium text-slate-900 dark:text-white">
                      {courier.courier_name}
                    </span>
                                    </div>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 font-mono">
                    {courier.courier_id}
                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                    <span className="text-slate-500 text-xs block">
                      {t('couriers.delivery_fee')}
                    </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                      ${courier.price.toFixed(2)}
                    </span>
                                    </div>
                                    <div>
                    <span className="text-slate-500 text-xs block">
                      {t('couriers.contact')}
                    </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                      {courier.contact_number}
                    </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                    <button
                                        onClick={() => handleOpenModal(courier)}
                                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                    >
                                        <EditIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(courier.courier_id)}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('couriers.id')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('couriers.name')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('couriers.delivery_fee')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('couriers.contact')}
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
                        {filteredCouriers.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-8 text-center text-slate-500"
                                >
                                    {t('couriers.no_couriers')}
                                </td>
                            </tr>
                        ) : (
                            filteredCouriers.map((courier) => (
                                <tr
                                    key={courier.courier_id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                >
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {courier.courier_id}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                <TruckIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                              {courier.courier_name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        Rs.{courier.price.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {courier.contact_number}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {courier.address}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleOpenModal(courier)}
                                                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                            >
                                                <EditIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(courier.courier_id)}
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

            {/* Modal */}
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
                                    {selectedCourier ? t('couriers.edit') : t('couriers.add')}
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
                                        {t('couriers.id')}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.courier_id}
                                        disabled
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed font-mono"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">
                                        {t('common.auto_generated')}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        {t('couriers.name')}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.courier_name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                courier_name: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        {t('couriers.delivery_fee')}
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                price: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        {t('couriers.contact_number')}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.contact_number}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                contact_number: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
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
        </div>
    );
};

export default CouriersPage;