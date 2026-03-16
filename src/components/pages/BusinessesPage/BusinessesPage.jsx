import React, { useEffect, useState } from 'react'
import {
    PlusIcon,
    EditIcon,
    EyeIcon,
    BuildingIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    SearchIcon,
    XIcon,
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const mockBusinesses = [
    {
        business_id: '1',
        business_name: 'Tech Store Pro',
        owner_name: 'John Smith',
        email: 'john@techstore.com',
        phone: '+1234567890',
        address: '123 Tech Lane',
        subscription_status: 'active',
        subscription_start: new Date('2024-01-01'),
        subscription_end: new Date('2025-01-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        business_id: '2',
        business_name: 'Fashion Hub',
        owner_name: 'Sarah Johnson',
        email: 'sarah@fashionhub.com',
        phone: '+1234567891',
        address: '456 Style Ave',
        subscription_status: 'active',
        subscription_start: new Date('2024-02-15'),
        subscription_end: new Date('2025-02-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        business_id: '3',
        business_name: 'Sports Outlet',
        owner_name: 'Mike Brown',
        email: 'mike@sportsoutlet.com',
        phone: '+1234567892',
        address: '789 Sports Blvd',
        subscription_status: 'expired',
        subscription_start: new Date('2023-06-01'),
        subscription_end: new Date('2024-06-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        business_id: '4',
        business_name: 'Home Decor Plus',
        owner_name: 'Emily Davis',
        email: 'emily@homedecor.com',
        phone: '+1234567893',
        address: '321 Home St',
        subscription_status: 'active',
        subscription_start: new Date('2024-03-01'),
        subscription_end: new Date('2025-03-01'),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        business_id: '5',
        business_name: 'Book World',
        owner_name: 'Chris Wilson',
        email: 'chris@bookworld.com',
        phone: '+1234567894',
        address: '654 Book Lane',
        subscription_status: 'suspended',
        subscription_start: new Date('2024-01-15'),
        subscription_end: new Date('2025-01-15'),
        createdAt: new Date(),
        updatedAt: new Date(),
    },
]

const statusColors = {
    active:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    expired:
        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const statusIcons = {
    active: <CheckCircleIcon className="w-4 h-4" />,
    expired: <ClockIcon className="w-4 h-4" />,
    suspended: <XCircleIcon className="w-4 h-4" />,
}

const BusinessesPage = () => {
    const { t } = useLanguage()
    const [businesses, setBusinesses] = useState(mockBusinesses)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [selectedBusiness, setSelectedBusiness] = useState(null)
    const [formData, setFormData] = useState({
        business_name: '',
        owner_name: '',
        email: '',
        phone: '',
        address: '',
        subscription_status: 'active',
        subscription_start: '',
        subscription_end: '',
    })

    useEffect(() => {
        if (isModalOpen || isViewModalOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isModalOpen, isViewModalOpen])

    const filteredBusinesses = businesses.filter((b) => {
        const matchesSearch =
            b.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.owner_name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus =
            !statusFilter || b.subscription_status === statusFilter
        return matchesSearch && matchesStatus
    })

    const handleOpenModal = (business) => {
        if (business) {
            setSelectedBusiness(business)
            setFormData({
                business_name: business.business_name,
                owner_name: business.owner_name,
                email: business.email,
                phone: business.phone,
                address: business.address,
                subscription_status: business.subscription_status,
                subscription_start: new Date(business.subscription_start)
                    .toISOString()
                    .split('T')[0],
                subscription_end: new Date(business.subscription_end)
                    .toISOString()
                    .split('T')[0],
            })
        } else {
            setSelectedBusiness(null)
            const today = new Date().toISOString().split('T')[0]
            const oneYearLater = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0]
            setFormData({
                business_name: '',
                owner_name: '',
                email: '',
                phone: '',
                address: '',
                subscription_status: 'active',
                subscription_start: today,
                subscription_end: oneYearLater,
            })
        }
        setIsModalOpen(true)
    }

    const handleSave = () => {
        if (selectedBusiness) {
            setBusinesses(
                businesses.map((b) =>
                    b.business_id === selectedBusiness.business_id
                        ? {
                            ...b,
                            ...formData,
                            subscription_start: new Date(formData.subscription_start),
                            subscription_end: new Date(formData.subscription_end),
                            updatedAt: new Date(),
                        }
                        : b,
                ),
            )
        } else {
            const newBusiness = {
                business_id: Date.now().toString(),
                ...formData,
                subscription_start: new Date(formData.subscription_start),
                subscription_end: new Date(formData.subscription_end),
                createdAt: new Date(),
                updatedAt: new Date(),
            }
            setBusinesses([...businesses, newBusiness])
        }
        setIsModalOpen(false)
    }

    const handleView = (business) => {
        setSelectedBusiness(business)
        setIsViewModalOpen(true)
    }

    const handleUpdateStatus = (businessId, newStatus) => {
        setBusinesses(
            businesses.map((b) =>
                b.business_id === businessId
                    ? {
                        ...b,
                        subscription_status: newStatus,
                        updatedAt: new Date(),
                    }
                    : b,
            ),
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative w-full sm:w-72">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('businesses.search')}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full sm:w-48 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">{t('businesses.all_status')}</option>
                        <option value="active">{t('businesses.active')}</option>
                        <option value="expired">{t('businesses.expired')}</option>
                        <option value="suspended">{t('businesses.suspended')}</option>
                    </select>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    {t('businesses.add')}
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredBusinesses.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            {t('businesses.no_businesses')}
                        </div>
                    ) : (
                        filteredBusinesses.map((b) => (
                            <div key={b.business_id} className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <BuildingIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">
                                                {b.business_name}
                                            </p>
                                            <p className="text-sm text-slate-500">{b.owner_name}</p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    {t('businesses.id')}: {b.business_id}
                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                    <span className="text-slate-500 text-xs block">
                      {t('businesses.email')}
                    </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                      {b.email}
                    </span>
                                    </div>
                                    <div>
                    <span className="text-slate-500 text-xs block">
                      {t('businesses.phone')}
                    </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                      {b.phone}
                    </span>
                                    </div>
                                    <div>
                    <span className="text-slate-500 text-xs block mb-1">
                      {t('businesses.status')}
                    </span>
                                        <span
                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[b.subscription_status]}`}
                                        >
                      {statusIcons[b.subscription_status]}
                                            {t(`businesses.${b.subscription_status}`)}
                    </span>
                                    </div>
                                    <div>
                    <span className="text-slate-500 text-xs block">
                      {t('businesses.expires')}
                    </span>
                                        <span className="text-slate-700 dark:text-slate-300">
                      {new Date(b.subscription_end).toLocaleDateString()}
                    </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                    <button
                                        onClick={() => handleView(b)}
                                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                    >
                                        <EyeIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleOpenModal(b)}
                                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                    >
                                        <EditIcon className="w-4 h-4" />
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
                                {t('businesses.id')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('businesses.title')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('businesses.email')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('businesses.phone')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('businesses.status')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('businesses.expires')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                                {t('common.actions')}
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredBusinesses.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-4 py-8 text-center text-slate-500"
                                >
                                    {t('businesses.no_businesses')}
                                </td>
                            </tr>
                        ) : (
                            filteredBusinesses.map((b) => (
                                <tr
                                    key={b.business_id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                >
                                    <td className="px-4 py-3 text-sm text-slate-500 font-mono">
                                        {b.business_id}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                <BuildingIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">
                                                    {b.business_name}
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    {b.owner_name}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {b.email}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {b.phone}
                                    </td>
                                    <td className="px-4 py-3">
                      <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[b.subscription_status]}`}
                      >
                        {statusIcons[b.subscription_status]}
                          {t(`businesses.${b.subscription_status}`)}
                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {new Date(b.subscription_end).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleView(b)}
                                                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleOpenModal(b)}
                                                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                            >
                                                <EditIcon className="w-4 h-4" />
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
                        <div className="relative w-full bg-white dark:bg-slate-800 shadow-xl rounded-t-2xl sm:rounded-xl sm:max-w-2xl max-h-[90vh] overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-300 dark:bg-slate-600 rounded-full sm:hidden" />
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white pt-2 sm:pt-0">
                                    {selectedBusiness
                                        ? t('businesses.edit')
                                        : t('businesses.add')}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                >
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)] space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('businesses.name')}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.business_name}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    business_name: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('businesses.owner_name')}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.owner_name}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    owner_name: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('businesses.email')}
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
                                            {t('businesses.phone')}
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
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('businesses.address')}
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
                                            {t('businesses.subscription_status')}
                                        </label>
                                        <select
                                            value={formData.subscription_status}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    subscription_status: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="active">{t('businesses.active')}</option>
                                            <option value="expired">{t('businesses.expired')}</option>
                                            <option value="suspended">
                                                {t('businesses.suspended')}
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('businesses.subscription_start')}
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.subscription_start}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    subscription_start: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('businesses.subscription_end')}
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.subscription_end}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    subscription_end: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
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

            {isViewModalOpen && selectedBusiness && (
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
                        <div className="relative w-full bg-white dark:bg-slate-800 shadow-xl rounded-t-2xl sm:rounded-xl sm:max-w-2xl max-h-[90vh] overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-300 dark:bg-slate-600 rounded-full sm:hidden" />
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white pt-2 sm:pt-0">
                                    {t('businesses.details')}
                                </h2>
                                <button
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                >
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                            <BuildingIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                                {selectedBusiness.business_name}
                                            </h3>
                                            <p className="text-slate-500">
                                                {selectedBusiness.owner_name}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 font-mono">
                    {t('businesses.id')}: {selectedBusiness.business_id}
                  </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {t('businesses.email')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {selectedBusiness.email}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {t('businesses.phone')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {selectedBusiness.phone}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-slate-500">
                                            {t('businesses.address')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {selectedBusiness.address}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {t('businesses.subscription_start')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {new Date(
                                                selectedBusiness.subscription_start,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {t('businesses.subscription_end')}
                                        </p>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {new Date(
                                                selectedBusiness.subscription_end,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">
                                            {t('businesses.status')}
                                        </p>
                                        <span
                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium ${statusColors[selectedBusiness.subscription_status]}`}
                                        >
                      {statusIcons[selectedBusiness.subscription_status]}
                                            {t(`businesses.${selectedBusiness.subscription_status}`)}
                    </span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                                        {t('businesses.quick_actions')}
                                    </p>
                                    <div className="flex gap-2">
                                        {selectedBusiness.subscription_status !== 'active' && (
                                            <button
                                                onClick={() =>
                                                    handleUpdateStatus(
                                                        selectedBusiness.business_id,
                                                        'active',
                                                    )
                                                }
                                                className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                                            >
                                                <CheckCircleIcon className="w-4 h-4 mr-1" />
                                                {t('businesses.activate')}
                                            </button>
                                        )}
                                        {selectedBusiness.subscription_status !== 'suspended' && (
                                            <button
                                                onClick={() =>
                                                    handleUpdateStatus(
                                                        selectedBusiness.business_id,
                                                        'suspended',
                                                    )
                                                }
                                                className="inline-flex items-center px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                                            >
                                                <XCircleIcon className="w-4 h-4 mr-1" />
                                                {t('businesses.suspend')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BusinessesPage