import React, { useEffect, useState, useRef } from 'react';
import {
    PlusIcon,
    EditIcon,
    TrashIcon,
    UserIcon,
    ShieldIcon,
    SearchIcon,
    XIcon,
    UploadIcon,
    EyeIcon,
    MailIcon,
    PhoneIcon,
    CalendarIcon,
    FingerprintIcon,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const mockUsers = [
    {
        user_id: 'USE-2024-001',
        business_id: 'biz1',
        full_name: 'John Admin',
        email: 'admin@demo.com',
        phone: '+1234567890',
        role: 'admin',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        user_id: 'USE-2024-002',
        business_id: 'biz1',
        full_name: 'Jane Staff',
        email: 'staff@demo.com',
        phone: '+1234567891',
        role: 'staff',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        user_id: 'USE-2024-003',
        business_id: 'biz1',
        full_name: 'Mike Staff',
        email: 'mike@demo.com',
        phone: '+1234567892',
        role: 'staff',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        user_id: 'USE-2024-004',
        business_id: 'biz1',
        full_name: 'Sarah Staff',
        email: 'sarah@demo.com',
        phone: '+1234567893',
        role: 'staff',
        status: 'inactive',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

const roleColors = {
    admin: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    staff: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
};

const statusColors = {
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    inactive: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
};

function generateUserId(users) {
    const year = new Date().getFullYear();
    const existingCodes = users
        .map((u) => {
            const match = u.user_id.match(/USE-(\d{4})-(\d{3})/);
            return match && match[1] === year.toString() ? parseInt(match[2]) : 0;
        })
        .filter((n) => n > 0);
    const nextNum = existingCodes.length > 0 ? Math.max(...existingCodes) + 1 : 1;
    return `USE-${year}-${String(nextNum).padStart(3, '0')}`;
}

const UsersPage = () => {
    const { t } = useLanguage();
    const [users, setUsers] = useState(mockUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [viewUser, setViewUser] = useState(null);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        user_id: '',
        full_name: '',
        email: '',
        phone: '',
        role: 'staff',
        status: 'active',
        password: '',
        user_image: '',
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

    const filteredUsers = users.filter(
        (u) =>
            u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.user_id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = (user) => {
        if (user) {
            setSelectedUser(user);
            setFormData({
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status,
                password: '',
                user_image: user.user_image || '',
            });
        } else {
            setSelectedUser(null);
            const nextId = generateUserId(users);
            setFormData({
                user_id: nextId,
                full_name: '',
                email: '',
                phone: '',
                role: 'staff',
                status: 'active',
                password: '',
                user_image: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleViewUser = (user) => {
        setViewUser(user);
        setIsViewModalOpen(true);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    user_image: reader.result,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFormData({
            ...formData,
            user_image: '',
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSave = () => {
        if (selectedUser) {
            setUsers(
                users.map((u) =>
                    u.user_id === selectedUser.user_id
                        ? {
                            ...u,
                            ...formData,
                            user_image: formData.user_image || undefined,
                            updatedAt: new Date(),
                        }
                        : u
                )
            );
        } else {
            const newUser = {
                user_id: formData.user_id,
                business_id: 'biz1',
                full_name: formData.full_name,
                email: formData.email,
                phone: formData.phone,
                role: formData.role,
                status: formData.status,
                user_image: formData.user_image || undefined,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            setUsers([...users, newUser]);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (confirm(t('users.delete_confirm'))) {
            setUsers(users.filter((u) => u.user_id !== id));
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
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
                        placeholder={t('users.search')}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    {t('users.add')}
                </button>
            </div>

            {/* User Table View - Desktop */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {t('users.id')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {t('users.user')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {t('users.phone')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {t('users.role')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {t('users.status')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                {t('common.actions')}
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                                    {t('users.no_users')}
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.user_id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                                        {user.user_id}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${
                                                    user.role === 'admin'
                                                        ? 'bg-blue-100 dark:bg-blue-900/30'
                                                        : 'bg-emerald-100 dark:bg-emerald-900/30'
                                                }`}
                                            >
                                                {user.user_image ? (
                                                    <img
                                                        src={user.user_image}
                                                        alt={user.full_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : user.role === 'admin' ? (
                                                    <ShieldIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                                ) : (
                                                    <UserIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">
                                                    {user.full_name}
                                                </p>
                                                <p className="text-sm text-slate-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                                        {user.phone}
                                    </td>
                                    <td className="px-4 py-3">
                      <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              roleColors[user.role]
                          }`}
                      >
                        {user.role === 'admin' ? t('users.roles.admin') : t('users.roles.staff')}
                      </span>
                                    </td>
                                    <td className="px-4 py-3">
                      <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              statusColors[user.status]
                          }`}
                      >
                        {user.status === 'active' ? t('users.status.active') : t('users.status.inactive')}
                      </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleViewUser(user)}
                                                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                                title={t('common.view')}
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleOpenModal(user)}
                                                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                                title={t('common.edit')}
                                            >
                                                <EditIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.user_id)}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredUsers.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">{t('users.no_users')}</div>
                    ) : (
                        filteredUsers.map((user) => (
                            <div key={user.user_id} className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${
                                                user.role === 'admin'
                                                    ? 'bg-blue-100 dark:bg-blue-900/30'
                                                    : 'bg-emerald-100 dark:bg-emerald-900/30'
                                            }`}
                                        >
                                            {user.user_image ? (
                                                <img
                                                    src={user.user_image}
                                                    alt={user.full_name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : user.role === 'admin' ? (
                                                <ShieldIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            ) : (
                                                <UserIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">
                                                {user.full_name}
                                            </p>
                                            <p className="text-sm text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 font-mono">
                    {user.user_id}
                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-slate-500 text-xs block">{t('users.phone')}</span>
                                        <span className="text-slate-700 dark:text-slate-300">
                      {user.phone}
                    </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 text-xs block mb-1">{t('users.role')}</span>
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                roleColors[user.role]
                                            }`}
                                        >
                      {user.role === 'admin' ? t('users.roles.admin') : t('users.roles.staff')}
                    </span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-slate-500 text-xs block mb-1">{t('users.status')}</span>
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                statusColors[user.status]
                                            }`}
                                        >
                      {user.status === 'active' ? t('users.status.active') : t('users.status.inactive')}
                    </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                    <button
                                        onClick={() => handleViewUser(user)}
                                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                        title={t('common.view')}
                                    >
                                        <EyeIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleOpenModal(user)}
                                        className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                        title={t('common.edit')}
                                    >
                                        <EditIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.user_id)}
                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                        title={t('common.delete')}
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Add/Edit User Modal */}
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
                                    {selectedUser ? t('users.edit') : t('users.add')}
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
                                        {t('users.id')}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.user_id}
                                        disabled
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed font-mono"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">
                                        {t('common.auto_generated')}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        {t('users.full_name')}
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
                                        {t('users.email')}
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
                                        {t('users.phone')}
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
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('users.role')}
                                        </label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    role: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="admin">{t('users.roles.admin')}</option>
                                            <option value="staff">{t('users.roles.staff')}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('users.status')}
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
                                            <option value="active">{t('users.status.active')}</option>
                                            <option value="inactive">{t('users.status.inactive')}</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        {t('users.profile_image')}
                                    </label>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <div className="flex justify-center">
                                        {formData.user_image ? (
                                            <div className="relative">
                                                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                                                    <img
                                                        src={formData.user_image}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <XIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                            >
                                                <UploadIcon className="w-6 h-6 text-slate-400 mb-1" />
                                                <span className="text-xs text-slate-500">{t('common.upload')}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {!selectedUser && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            {t('users.password')}
                                        </label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    password: e.target.value,
                                                })
                                            }
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                )}
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

            {/* User Details View Modal */}
            {isViewModalOpen && viewUser && (
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
                                    {t('users.details')}
                                </h2>
                                <button
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                                >
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
                                <div className="flex flex-col items-center mb-6">
                                    <div
                                        className={`w-24 h-24 rounded-full flex items-center justify-center overflow-hidden mb-3 ${
                                            viewUser.role === 'admin'
                                                ? 'bg-blue-100 dark:bg-blue-900/30'
                                                : 'bg-emerald-100 dark:bg-emerald-900/30'
                                        }`}
                                    >
                                        {viewUser.user_image ? (
                                            <img
                                                src={viewUser.user_image}
                                                alt={viewUser.full_name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : viewUser.role === 'admin' ? (
                                            <ShieldIcon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                                        ) : (
                                            <UserIcon className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                                        )}
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                        {viewUser.full_name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                roleColors[viewUser.role]
                                            }`}
                                        >
                                            {viewUser.role === 'admin' ? t('users.roles.admin') : t('users.roles.staff')}
                                        </span>
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                statusColors[viewUser.status]
                                            }`}
                                        >
                                            {viewUser.status === 'active' ? t('users.status.active') : t('users.status.inactive')}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="flex items-start gap-3">
                                                <FingerprintIcon className="w-5 h-5 text-slate-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('users.id')}</p>
                                                    <p className="text-sm font-mono text-slate-900 dark:text-white">
                                                        {viewUser.user_id}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <MailIcon className="w-5 h-5 text-slate-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('users.email')}</p>
                                                    <p className="text-sm text-slate-900 dark:text-white">
                                                        {viewUser.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <PhoneIcon className="w-5 h-5 text-slate-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('users.phone')}</p>
                                                    <p className="text-sm text-slate-900 dark:text-white">
                                                        {viewUser.phone}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <CalendarIcon className="w-5 h-5 text-slate-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('users.member_since')}</p>
                                                    <p className="text-sm text-slate-900 dark:text-white">
                                                        {formatDate(viewUser.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <CalendarIcon className="w-5 h-5 text-slate-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('users.last_updated')}</p>
                                                    <p className="text-sm text-slate-900 dark:text-white">
                                                        {formatDate(viewUser.updatedAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setIsViewModalOpen(false);
                                                handleOpenModal(viewUser);
                                            }}
                                            className="flex-1 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center justify-center gap-2"
                                        >
                                            <EditIcon className="w-4 h-4" />
                                            {t('common.edit')}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsViewModalOpen(false);
                                                handleDelete(viewUser.user_id);
                                            }}
                                            className="flex-1 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors inline-flex items-center justify-center gap-2"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                            {t('common.delete')}
                                        </button>
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

export default UsersPage;