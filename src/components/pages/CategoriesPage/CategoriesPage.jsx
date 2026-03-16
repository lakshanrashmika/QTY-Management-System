import React, { useEffect, useState } from 'react';
import { PlusIcon, EditIcon, TrashIcon, SearchIcon, XIcon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const mockCategories = [
    {
        category_id: 'CG-2024-001',
        business_id: 'biz1',
        category_name: 'Electronics',
        created_by: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        category_id: 'CG-2024-002',
        business_id: 'biz1',
        category_name: 'Clothing',
        created_by: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        category_id: 'CG-2024-003',
        business_id: 'biz1',
        category_name: 'Home & Garden',
        created_by: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        category_id: 'CG-2024-004',
        business_id: 'biz1',
        category_name: 'Sports',
        created_by: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        category_id: 'CG-2024-005',
        business_id: 'biz1',
        category_name: 'Books',
        created_by: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

function generateCategoryId(categories) {
    const year = new Date().getFullYear();
    const existingCodes = categories
        .map((c) => {
            const match = c.category_id.match(/CG-(\d{4})-(\d{3})/);
            return match && match[1] === year.toString() ? parseInt(match[2]) : 0;
        })
        .filter((n) => n > 0);
    const nextNum = existingCodes.length > 0 ? Math.max(...existingCodes) + 1 : 1;
    return `CG-${year}-${String(nextNum).padStart(3, '0')}`;
}

const CategoriesPage = () => {
    const { t } = useLanguage();
    const [categories, setCategories] = useState(mockCategories);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({
        category_id: '',
        category_name: '',
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

    const filteredCategories = categories.filter(
        (c) =>
            c.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.category_id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = (category) => {
        if (category) {
            setSelectedCategory(category);
            setFormData({
                category_id: category.category_id,
                category_name: category.category_name,
            });
        } else {
            setSelectedCategory(null);
            const nextId = generateCategoryId(categories);
            setFormData({
                category_id: nextId,
                category_name: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = () => {
        if (selectedCategory) {
            setCategories(
                categories.map((c) =>
                    c.category_id === selectedCategory.category_id
                        ? {
                            ...c,
                            category_name: formData.category_name,
                            updatedAt: new Date(),
                        }
                        : c
                )
            );
        } else {
            const newCategoryId = `CG-${new Date().getFullYear()}-${String(categories.length + 1).padStart(3, '0')}`;
            const newCategory = {
                category_id: newCategoryId,
                business_id: 'biz1',
                category_name: formData.category_name,
                created_by: '1',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            setCategories([...categories, newCategory]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (confirm(t('categories.delete_confirm'))) {
            setCategories(categories.filter((c) => c.category_id !== id));
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
                        placeholder={t('categories.search')}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    {t('categories.add')}
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredCategories.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            {t('categories.no_categories')}
                        </div>
                    ) : (
                        filteredCategories.map((category) => (
                            <div key={category.category_id} className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="font-medium text-slate-900 dark:text-white">
                                        {category.category_name}
                                    </div>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 font-mono">
                    {category.category_id}
                  </span>
                                </div>
                                <div className="text-sm text-slate-500">
                                    {new Date(category.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                    <button
                                        onClick={() => handleOpenModal(category)}
                                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                    >
                                        <EditIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.category_id)}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
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
                                {t('categories.id')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('categories.name')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('categories.created')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('common.actions')}
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredCategories.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-4 py-8 text-center text-slate-500"
                                >
                                    {t('categories.no_categories')}
                                </td>
                            </tr>
                        ) : (
                            filteredCategories.map((category) => (
                                <tr
                                    key={category.category_id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                >
                                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                                        {category.category_id}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                                        {category.category_name}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {new Date(category.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleOpenModal(category)}
                                                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                            >
                                                <EditIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.category_id)}
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
                                    {selectedCategory
                                        ? t('categories.edit')
                                        : t('categories.add')}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                >
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        {t('categories.id')}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.category_id}
                                        disabled
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed font-mono"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">
                                        {t('common.auto_generated')}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        {t('categories.name')}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.category_name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                category_name: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
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

export default CategoriesPage;