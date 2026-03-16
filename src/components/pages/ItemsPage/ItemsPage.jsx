import React, { useEffect, useState, useRef } from 'react';
import {
    PlusIcon,
    EditIcon,
    TrashIcon,
    EyeIcon,
    ImageIcon,
    SearchIcon,
    XIcon,
    UploadIcon,
    PackageIcon,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const mockItems = [
    {
        item_id: '1',
        business_id: 'biz1',
        item_code: 'ITM001',
        category_id: '1',
        wholesale_id: '1',
        item_name: 'Wireless Headphones',
        sizes: ['One Size'],
        colors: ['Black', 'White'],
        cost_price: 45,
        selling_price: 89.99,
        status: 'active',
        created_by: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        item_id: '2',
        business_id: 'biz1',
        item_code: 'ITM002',
        category_id: '2',
        wholesale_id: '1',
        item_name: 'Cotton T-Shirt',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Blue', 'Red', 'Green'],
        cost_price: 12,
        selling_price: 29.99,
        status: 'active',
        created_by: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        item_id: '3',
        business_id: 'biz1',
        item_code: 'ITM003',
        category_id: '1',
        wholesale_id: '2',
        item_name: 'Smart Watch',
        sizes: ['One Size'],
        colors: ['Silver', 'Gold'],
        cost_price: 120,
        selling_price: 249.99,
        status: 'active',
        created_by: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        item_id: '4',
        business_id: 'biz1',
        item_code: 'ITM004',
        category_id: '3',
        wholesale_id: '1',
        item_name: 'Garden Tools Set',
        sizes: ['Standard'],
        colors: ['Green'],
        cost_price: 35,
        selling_price: 79.99,
        status: 'inactive',
        created_by: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        item_id: '5',
        business_id: 'biz1',
        item_code: 'ITM005',
        category_id: '4',
        wholesale_id: '2',
        item_name: 'Yoga Mat',
        sizes: ['4mm', '6mm', '8mm'],
        colors: ['Purple', 'Blue', 'Pink'],
        cost_price: 15,
        selling_price: 39.99,
        status: 'active',
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

const wholesaleOptions = [
    {
        value: '1',
        label: 'ABC Wholesale',
    },
    {
        value: '2',
        label: 'XYZ Distributors',
    },
];

const ItemsPage = () => {
    const { t } = useLanguage();
    const [items, setItems] = useState(mockItems);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        item_code: '',
        item_name: '',
        category_id: '',
        wholesale_id: '',
        sizes: '',
        colors: '',
        cost_price: '',
        selling_price: '',
        status: 'active',
        item_image: '',
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

    const filteredItems = items.filter(
        (i) =>
            i.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.item_code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = (item) => {
        if (item) {
            setSelectedItem(item);
            setFormData({
                item_code: item.item_code,
                item_name: item.item_name,
                category_id: item.category_id,
                wholesale_id: item.wholesale_id,
                sizes: item.sizes.join(', '),
                colors: item.colors.join(', '),
                cost_price: item.cost_price.toString(),
                selling_price: item.selling_price.toString(),
                status: item.status,
                item_image: item.item_image || '',
            });
        } else {
            setSelectedItem(null);
            const nextCode = `ITM-${String(items.length + 1).padStart(3, '0')}`;
            setFormData({
                item_code: nextCode,
                item_name: '',
                category_id: '',
                wholesale_id: '',
                sizes: '',
                colors: '',
                cost_price: '',
                selling_price: '',
                status: 'active',
                item_image: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    item_image: reader.result,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFormData({
            ...formData,
            item_image: '',
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSave = () => {
        const itemData = {
            ...formData,
            sizes: formData.sizes
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            colors: formData.colors
                .split(',')
                .map((c) => c.trim())
                .filter(Boolean),
            cost_price: parseFloat(formData.cost_price),
            selling_price: parseFloat(formData.selling_price),
            item_image: formData.item_image || undefined,
        };

        if (selectedItem) {
            setItems(
                items.map((i) =>
                    i.item_id === selectedItem.item_id
                        ? {
                            ...i,
                            ...itemData,
                            updatedAt: new Date(),
                        }
                        : i
                )
            );
        } else {
            const newItem = {
                item_id: Date.now().toString(),
                business_id: 'biz1',
                ...itemData,
                created_by: '1',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            setItems([...items, newItem]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (confirm(t('items.delete_confirm'))) {
            setItems(items.filter((i) => i.item_id !== id));
        }
    };

    const handleView = (item) => {
        setSelectedItem(item);
        setIsViewModalOpen(true);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
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
                        placeholder={t('items.search')}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    {t('items.add')}
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredItems.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            {t('items.no_items')}
                        </div>
                    ) : (
                        filteredItems.map((item) => (
                            <div key={item.item_id} className="p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                                        {item.item_image ? (
                                            <img
                                                src={item.item_image}
                                                alt={item.item_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <ImageIcon className="w-5 h-5 text-slate-400" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-900 dark:text-white">
                                            {item.item_name}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {item.item_code}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-slate-500 text-xs block">
                                            {t('items.price')}
                                        </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                                            Rs.{item.selling_price.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-slate-500 text-xs block mb-1">
                                            {t('items.status')}
                                        </span>
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}
                                        >
                                            {item.status === 'active'
                                                ? t('items.active')
                                                : t('items.inactive')}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                    <button
                                        onClick={() => handleView(item)}
                                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                    >
                                        <EyeIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleOpenModal(item)}
                                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                    >
                                        <EditIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.item_id)}
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
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase w-12"></th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('items.code')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('items.name')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('items.price')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('items.status')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('common.actions')}
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredItems.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-4 py-8 text-center text-slate-500"
                                >
                                    {t('items.no_items')}
                                </td>
                            </tr>
                        ) : (
                            filteredItems.map((item) => (
                                <tr
                                    key={item.item_id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                >
                                    <td className="px-4 py-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                                            {item.item_image ? (
                                                <img
                                                    src={item.item_image}
                                                    alt={item.item_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <ImageIcon className="w-5 h-5 text-slate-400" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                                        {item.item_code}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                                        {item.item_name}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        Rs.{item.selling_price.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}
                                            >
                                                {item.status === 'active'
                                                    ? t('items.active')
                                                    : t('items.inactive')}
                                            </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleView(item)}
                                                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleOpenModal(item)}
                                                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                            >
                                                <EditIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.item_id)}
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
                                    {selectedItem ? t('items.edit') : t('items.add')}
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
                                            {t('items.code')}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.item_code}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    item_code: e.target.value,
                                                })
                                            }
                                            disabled={!selectedItem}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            required
                                        />
                                        {!selectedItem && (
                                            <p className="text-xs text-slate-500 mt-1">
                                                {t('common.auto_generated')}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('items.name')}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.item_name}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    item_name: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('items.category')}
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
                                            required
                                        >
                                            <option value="">{t('common.select')}</option>
                                            {categoryOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('items.wholesale')}
                                        </label>
                                        <select
                                            value={formData.wholesale_id}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    wholesale_id: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="">{t('common.select')}</option>
                                            {wholesaleOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('items.sizes_comma_separated')}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.sizes}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    sizes: e.target.value,
                                                })
                                            }
                                            placeholder="S, M, L, XL"
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('items.colors_comma_separated')}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.colors}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    colors: e.target.value,
                                                })
                                            }
                                            placeholder="Red, Blue, Green"
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('items.cost_price')}
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.cost_price}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    cost_price: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('items.selling_price')}
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.selling_price}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    selling_price: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('items.status')}
                                        </label>
                                        <select
                                            value={formData.status}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    status: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="active">{t('items.active')}</option>
                                            <option value="inactive">{t('items.inactive')}</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('items.item_image')}
                                        </label>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        {formData.item_image ? (
                                            <div className="relative w-32 h-32 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-900">
                                                <img
                                                    src={formData.item_image}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <XIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                            >
                                                <UploadIcon className="w-8 h-8 text-slate-400 mb-2" />
                                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                                    {t('items.click_to_upload')}
                                                </span>
                                                <span className="text-xs text-slate-400 mt-1">
                                                    {t('items.png_jpg_limit')}
                                                </span>
                                            </div>
                                        )}
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
            {isViewModalOpen && selectedItem && (
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
                                    {t('items.details')}
                                </h2>
                                <button
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                >
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)] space-y-6">
                                {/* Item Image */}
                                <div className="w-full h-48 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                                    {selectedItem.item_image ? (
                                        <img
                                            src={selectedItem.item_image}
                                            alt={selectedItem.item_name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <ImageIcon className="w-16 h-16 text-slate-400" />
                                    )}
                                </div>

                                {/* Item Details */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-slate-500">{t('items.code')}</p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {selectedItem.item_code}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">{t('items.name')}</p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {selectedItem.item_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {t('items.cost_price')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            Rs.{selectedItem.cost_price.toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {t('items.selling_price')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            Rs.{selectedItem.selling_price.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-slate-500 mb-1">
                                            {t('items.size')}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedItem.sizes.map((size) => (
                                                <span
                                                    key={size}
                                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                                                >
                                                    {size}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-slate-500 mb-1">
                                            {t('items.colors')}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedItem.colors.map((color) => (
                                                <span
                                                    key={color}
                                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                                                >
                                                    {color}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">
                                            {t('items.status')}
                                        </p>
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${selectedItem.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}
                                        >
                                            {selectedItem.status === 'active'
                                                ? t('items.active')
                                                : t('items.inactive')}
                                        </span>
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

export default ItemsPage;