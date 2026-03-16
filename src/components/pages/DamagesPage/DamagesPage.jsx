import React, { useEffect, useState } from 'react'
import { PlusIcon, AlertTriangleIcon, SearchIcon, XIcon, EyeIcon, EditIcon, TrashIcon } from 'lucide-react'
import {useLanguage} from "../../context/LanguageContext.jsx";

// Mock data
const mockDamages = [
    {
        damage_id: '1',
        business_id: 'biz1',
        item_id: '1',
        item_name: 'Wireless Headphones',
        quantity: 3,
        reason: 'Shipping damage',
        reported_by: 'Jane Staff',
        created_by: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        damage_id: '2',
        business_id: 'biz1',
        item_id: '2',
        item_name: 'Cotton T-Shirt',
        quantity: 5,
        reason: 'Water damage in warehouse',
        reported_by: 'John Admin',
        created_by: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        damage_id: '3',
        business_id: 'biz1',
        item_id: '3',
        item_name: 'Smart Watch',
        quantity: 1,
        reason: 'Manufacturing defect',
        reported_by: 'Jane Staff',
        created_by: '2',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
]

const itemOptions = [
    {
        value: '1',
        label: 'Wireless Headphones',
        code: 'ITM001',
    },
    {
        value: '2',
        label: 'Cotton T-Shirt',
        code: 'ITM002',
    },
    {
        value: '3',
        label: 'Smart Watch',
        code: 'ITM003',
    },
    {
        value: '5',
        label: 'Yoga Mat',
        code: 'ITM005',
    },
]

const DamagesPage = () => {
    const { t } = useLanguage()
    const [damages, setDamages] = useState(mockDamages)
    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState('add') // 'add', 'edit'
    const [selectedDamage, setSelectedDamage] = useState(null)
    const [formData, setFormData] = useState({
        item_id: '',
        quantity: '',
        reason: '',
        reported_by: '',
    })
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [damageToDelete, setDamageToDelete] = useState(null)

    useEffect(() => {
        if (isModalOpen || deleteConfirmOpen || isViewModalOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isModalOpen, deleteConfirmOpen, isViewModalOpen])

    const filteredDamages = damages.filter(
        (d) =>
            d.item_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.reported_by.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getItemCode = (itemId) => {
        return itemOptions.find((i) => i.value === itemId)?.code || itemId
    }

    const handleView = (damage) => {
        setSelectedDamage(damage)
        setIsViewModalOpen(true)
    }

    const handleEdit = (damage) => {
        setSelectedDamage(damage)
        setFormData({
            item_id: damage.item_id,
            quantity: damage.quantity.toString(),
            reason: damage.reason,
            reported_by: damage.reported_by,
        })
        setModalMode('edit')
        setIsModalOpen(true)
    }

    const handleDeleteClick = (damage) => {
        setDamageToDelete(damage)
        setDeleteConfirmOpen(true)
    }

    const handleDeleteConfirm = () => {
        if (damageToDelete) {
            setDamages(damages.filter(d => d.damage_id !== damageToDelete.damage_id))
            setDeleteConfirmOpen(false)
            setDamageToDelete(null)
        }
    }

    const handleDeleteCancel = () => {
        setDeleteConfirmOpen(false)
        setDamageToDelete(null)
    }

    const handleSave = () => {
        if (modalMode === 'add') {
            const newDamage = {
                damage_id: Date.now().toString(),
                business_id: 'biz1',
                item_id: formData.item_id,
                item_name: itemOptions.find((i) => i.value === formData.item_id)?.label,
                quantity: parseInt(formData.quantity),
                reason: formData.reason,
                reported_by: formData.reported_by,
                created_by: '1',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
            setDamages([newDamage, ...damages])
        } else if (modalMode === 'edit' && selectedDamage) {
            const updatedDamages = damages.map(d =>
                d.damage_id === selectedDamage.damage_id
                    ? {
                        ...d,
                        item_id: formData.item_id,
                        item_name: itemOptions.find((i) => i.value === formData.item_id)?.label,
                        quantity: parseInt(formData.quantity),
                        reason: formData.reason,
                        reported_by: formData.reported_by,
                        updatedAt: new Date(),
                    }
                    : d
            )
            setDamages(updatedDamages)
        }

        setIsModalOpen(false)
        setModalMode('add')
        setSelectedDamage(null)
        setFormData({
            item_id: '',
            quantity: '',
            reason: '',
            reported_by: '',
        })
    }

    const handleAddNew = () => {
        setModalMode('add')
        setSelectedDamage(null)
        setFormData({
            item_id: '',
            quantity: '',
            reason: '',
            reported_by: '',
        })
        setIsModalOpen(true)
    }

    const isEditMode = modalMode === 'edit'
    const isAddMode = modalMode === 'add'

    const totalDamaged = damages.reduce((sum, d) => sum + d.quantity, 0)

    return (
        <div className="space-y-6">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                        <AlertTriangleIcon className="w-7 h-7 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {t('damages.total_damaged_items')}
                        </p>
                        <p className="text-3xl font-bold text-red-700 dark:text-red-300">
                            {totalDamaged}
                        </p>
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
                        placeholder={t('damages.search')}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={handleAddNew}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    {t('damages.report_damage')}
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                {/* Mobile View */}
                <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredDamages.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            {t('damages.no_damages')}
                        </div>
                    ) : (
                        filteredDamages.map((d) => (
                            <div key={d.damage_id} className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                            <AlertTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                                        </div>
                                        <span className="font-medium text-slate-900 dark:text-white">
                                          {d.item_name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleView(d)}
                                            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                        >
                                            <EyeIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(d)}
                                            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                        >
                                            <EditIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(d)}
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-slate-500 text-xs block">
                                          {t('damages.quantity')}
                                        </span>
                                        <span className="font-medium text-red-600 dark:text-red-400">
                                          {d.quantity}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 text-xs block">
                                          {t('damages.item_code')}
                                        </span>
                                        <span className="text-slate-700 dark:text-slate-300 font-mono text-xs">
                                          {getItemCode(d.item_id)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 text-xs block">
                                          {t('damages.reported_date')}
                                        </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                                          {new Date(d.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-slate-500 text-xs block">
                                          {t('damages.reason')}
                                        </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                                          {d.reason}
                                        </span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-slate-500 text-xs block">
                                          {t('damages.reported_by')}
                                        </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                                          {d.reported_by}
                                        </span>
                                    </div>
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
                                {t('damages.item')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('damages.item_code')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('damages.quantity')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('damages.reason')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('damages.reported_by')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('damages.reported_date')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('common.actions')}
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredDamages.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-4 py-8 text-center text-slate-500"
                                >
                                    {t('damages.no_damages')}
                                </td>
                            </tr>
                        ) : (
                            filteredDamages.map((d) => (
                                <tr
                                    key={d.damage_id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                                <AlertTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                                            </div>
                                            <span className="font-medium text-slate-900 dark:text-white">
                          {d.item_name}
                        </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                                        {getItemCode(d.item_id)}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400">
                                        {d.quantity}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {d.reason}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {d.reported_by}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {new Date(d.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleView(d)}
                                                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(d)}
                                                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                            >
                                                <EditIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(d)}
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
                        onClick={() => {
                            setIsModalOpen(false)
                            setModalMode('add')
                            setSelectedDamage(null)
                        }}
                    />
                    <div className="fixed inset-0 flex flex-col sm:items-center sm:justify-center sm:p-4">
                        <div
                            className="flex-1 sm:hidden"
                            onClick={() => {
                                setIsModalOpen(false)
                                setModalMode('add')
                                setSelectedDamage(null)
                            }}
                        />
                        <div className="relative w-full bg-white dark:bg-slate-800 shadow-xl rounded-t-2xl sm:rounded-xl sm:max-w-md max-h-[90vh] overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-300 dark:bg-slate-600 rounded-full sm:hidden" />
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white pt-2 sm:pt-0">
                                    {isEditMode && t('common.edit')}
                                    {isAddMode && t('damages.report_damage')}
                                </h2>
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false)
                                        setModalMode('add')
                                        setSelectedDamage(null)
                                    }}
                                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                >
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-4 overflow-y-auto max-h-[calc(80vh-140px)] space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        {t('damages.item')}
                                    </label>
                                    <select
                                        value={formData.item_id}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                item_id: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">{t('common.select')}</option>
                                        {itemOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    {formData.item_id && (
                                        <p className="text-xs text-slate-500 font-mono mt-1">
                                            Item Code: {getItemCode(formData.item_id)}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        {t('damages.quantity')}
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
                                        className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        {t('damages.reason')}
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
                                        className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        {t('damages.reported_by')}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.reported_by}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                reported_by: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 p-4 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false)
                                        setModalMode('add')
                                        setSelectedDamage(null)
                                    }}
                                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                >
                                    {t('common.cancel')}
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    {isEditMode ? t('common.save') : t('damages.report')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {isViewModalOpen && selectedDamage && (
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
                                    {t('damages.details')}
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
                                            {t('damages.id')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white font-mono">
                                            {selectedDamage.damage_id}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">{t('damages.item')}</p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {selectedDamage.item_name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {t('damages.item_code')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white font-mono">
                                            {getItemCode(selectedDamage.item_id)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {t('damages.quantity')}
                                        </p>
                                        <p className="font-medium text-red-600 dark:text-red-400">
                                            {selectedDamage.quantity}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-slate-500">
                                            {t('damages.reason')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {selectedDamage.reason}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {t('damages.reported_by')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {selectedDamage.reported_by}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {t('damages.reported_date')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {new Date(selectedDamage.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {selectedDamage.updatedAt && selectedDamage.createdAt !== selectedDamage.updatedAt && (
                                        <div className="col-span-2">
                                            <p className="text-sm text-slate-500">
                                                {t('common.last_updated')}
                                            </p>
                                            <p className="font-medium text-slate-900 dark:text-white">
                                                {new Date(selectedDamage.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    {t('common.cancel')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={handleDeleteCancel}
                    />
                    <div className="fixed inset-0 flex flex-col sm:items-center sm:justify-center sm:p-4">
                        <div
                            className="flex-1 sm:hidden"
                            onClick={handleDeleteCancel}
                        />
                        <div className="relative w-full bg-white dark:bg-slate-800 shadow-xl rounded-t-2xl sm:rounded-xl sm:max-w-md overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                                    <AlertTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-center text-slate-900 dark:text-white mb-2">
                                    {t('common.confirm_delete')}
                                </h3>
                                <p className="text-center text-slate-600 dark:text-slate-400 mb-6">
                                    {t('damages.delete_confirmation')}
                                </p>
                                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
                                    <button
                                        onClick={handleDeleteCancel}
                                        className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        {t('common.cancel')}
                                    </button>
                                    <button
                                        onClick={handleDeleteConfirm}
                                        className="px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        {t('common.delete')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DamagesPage