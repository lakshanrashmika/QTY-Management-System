import React, { useEffect, useState } from 'react';
import {
    PlusIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    SearchIcon,
    XIcon,
} from 'lucide-react';

const mockMovements = [
    {
        qty_id: 'QTY-2024-001',
        business_id: 'biz1',
        category_id: '1',
        item_id: '1',
        wholesale_id: '1',
        quantity: 100,
        price: 4500,
        note: 'Initial stock',
        created_by: '1',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date(),
    },
    {
        qty_id: 'QTY-2024-002',
        business_id: 'biz1',
        category_id: '1',
        item_id: '1',
        wholesale_id: '1',
        quantity: 50,
        price: 2250,
        note: 'Restock',
        created_by: '1',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date(),
    },
    {
        qty_id: 'QTY-2024-003',
        business_id: 'biz1',
        category_id: '2',
        item_id: '2',
        wholesale_id: '1',
        quantity: 200,
        price: 2400,
        note: 'New batch',
        created_by: '1',
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date(),
    },
    {
        qty_id: 'QTY-2024-004',
        business_id: 'biz1',
        category_id: '1',
        item_id: '3',
        wholesale_id: '2',
        quantity: 25,
        price: 3000,
        note: 'Limited stock',
        created_by: '1',
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date(),
    },
];

const itemOptions = [
    {
        value: '1',
        label: 'Wireless Headphones',
    },
    {
        value: '2',
        label: 'Cotton T-Shirt',
    },
    {
        value: '3',
        label: 'Smart Watch',
    },
    {
        value: '5',
        label: 'Yoga Mat',
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

function generateQtyId(movements) {
    const year = new Date().getFullYear();
    const existingCodes = movements
        .map((m) => {
            const match = m.qty_id.match(/QTY-(\d{4})-(\d{3})/);
            return match && match[1] === year.toString() ? parseInt(match[2]) : 0;
        })
        .filter((n) => n > 0);
    const nextNum = existingCodes.length > 0 ? Math.max(...existingCodes) + 1 : 1;
    return `QTY-${year}-${String(nextNum).padStart(3, '0')}`;
}

const QtyManagementPage = () => {
    const [movements, setMovements] = useState(mockMovements);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        qty_id: '',
        category_id: '',
        item_id: '',
        wholesale_id: '',
        quantity: '',
        price: '',
        note: '',
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

    const filteredMovements = movements.filter((m) => {
        const itemName = itemOptions.find((i) => i.value === m.item_id)?.label || '';
        return (
            itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.qty_id.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const handleOpenModal = () => {
        const nextId = generateQtyId(movements);
        setFormData({
            qty_id: nextId,
            category_id: '',
            item_id: '',
            wholesale_id: '',
            quantity: '',
            price: '',
            note: '',
        });
        setIsModalOpen(true);
    };

    const handleSave = () => {
        const newQtyId = `QTY-${new Date().getFullYear()}-${String(movements.length + 1).padStart(3, '0')}`;
        const newMovement = {
            qty_id: newQtyId,
            business_id: 'biz1',
            category_id: formData.category_id,
            item_id: formData.item_id,
            wholesale_id: formData.wholesale_id,
            quantity: parseInt(formData.quantity),
            price: parseFloat(formData.price),
            note: formData.note,
            created_by: '1',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        setMovements([newMovement, ...movements]);
        setIsModalOpen(false);
    };

    const totalItems = movements.reduce((sum, m) => sum + m.quantity, 0);
    const totalCost = movements.reduce((sum, m) => sum + m.price, 0);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <ArrowUpIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Total Stock Added
                            </p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {totalItems.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <ArrowDownIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Total Investment
                            </p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                ${totalCost.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                #
              </span>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Total Movements
                            </p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {movements.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative w-full sm:w-72">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search movements..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={handleOpenModal}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Stock
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredMovements.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            No stock movements found
                        </div>
                    ) : (
                        filteredMovements.map((m) => (
                            <div key={m.qty_id} className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="font-medium text-slate-900 dark:text-white">
                                        {itemOptions.find((i) => i.value === m.item_id)?.label ||
                                            m.item_id}
                                    </div>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 font-mono">
                    {m.qty_id}
                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                    <span className="text-slate-500 text-xs block">
                      Quantity
                    </span>
                                        <div className="flex items-center gap-1">
                                            <ArrowUpIcon className="w-3 h-3 text-emerald-500" />
                                            <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        +{m.quantity}
                      </span>
                                        </div>
                                    </div>
                                    <div>
                    <span className="text-slate-500 text-xs block">
                      Total Cost
                    </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                      ${m.price.toFixed(2)}
                    </span>
                                    </div>
                                    <div>
                    <span className="text-slate-500 text-xs block">
                      Wholesale
                    </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                      {wholesaleOptions.find((w) => w.value === m.wholesale_id)
                          ?.label || m.wholesale_id}
                    </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 text-xs block">Date</span>
                                        <span className="text-slate-700 dark:text-slate-300">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </span>
                                    </div>
                                    {m.note && (
                                        <div className="col-span-2">
                                            <span className="text-slate-500 text-xs block">Note</span>
                                            <span className="text-slate-700 dark:text-slate-300">
                        {m.note}
                      </span>
                                        </div>
                                    )}
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
                                QTY ID
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                Item
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                Quantity
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                Total Cost
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                Wholesale
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                Note
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                Date
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredMovements.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-4 py-8 text-center text-slate-500"
                                >
                                    No stock movements found
                                </td>
                            </tr>
                        ) : (
                            filteredMovements.map((m) => (
                                <tr
                                    key={m.qty_id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                >
                                    <td className="px-4 py-3 text-sm text-slate-500 font-mono">
                                        {m.qty_id}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                                        {itemOptions.find((i) => i.value === m.item_id)?.label ||
                                            m.item_id}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <ArrowUpIcon className="w-4 h-4 text-emerald-500" />
                                            <span className="font-medium text-emerald-600 dark:text-emerald-400">
                          +{m.quantity}
                        </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        ${m.price.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {wholesaleOptions.find((w) => w.value === m.wholesale_id)
                                            ?.label || m.wholesale_id}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {m.note}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {new Date(m.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

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
                                    Add Stock
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                >
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)] space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        QTY ID
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.qty_id}
                                        disabled
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed font-mono"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Auto-generated</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        Category
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
                                        <option value="">Select...</option>
                                        {categoryOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        Item
                                    </label>
                                    <select
                                        value={formData.item_id}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                item_id: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select...</option>
                                        {itemOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        Wholesale
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
                                        <option value="">Select...</option>
                                        {wholesaleOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.quantity}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    quantity: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            Total Cost
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
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        Note
                                    </label>
                                    <textarea
                                        value={formData.note}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                note: e.target.value,
                                            })
                                        }
                                        rows={3}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Add Stock
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QtyManagementPage;