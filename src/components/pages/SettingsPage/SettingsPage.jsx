import React, { useState, useRef } from 'react';
import {
    SaveIcon,
    UploadIcon,
    BuildingIcon,
    CreditCardIcon,
    FileTextIcon,
    XIcon,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const SettingsPage = () => {
    const { t } = useLanguage();
    const fileInputRef = useRef(null);
    const [settings, setSettings] = useState({
        business_name: 'My Business Store',
        contact_number: '+1234567890',
        email: 'contact@mybusiness.com',
        address: '123 Business Street, City, State 12345',
        bank_name: 'First National Bank',
        account_name: 'My Business LLC',
        account_number: '****4567',
        routing_number: '****8901',
        invoice_footer: 'Thank you for your business! Returns accepted within 30 days.',
        logo_url: '',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [logoError, setLogoError] = useState('');

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSaving(false);
        alert(t('common.save') + '!');
    };

    const handleLogoUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        setLogoError('');

        if (!file) return;

        const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
            setLogoError('Please upload a PNG or JPG file');
            return;
        }

        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        if (file.size > maxSize) {
            setLogoError('File size must be less than 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result;
            setSettings({
                ...settings,
                logo_url: result,
            });
        };
        reader.onerror = () => {
            setLogoError('Failed to read file');
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const handleRemoveLogo = () => {
        setSettings({
            ...settings,
            logo_url: '',
        });
        setLogoError('');
    };

    return (
        <div className="space-y-6 max-w">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {t('settings.business_information')}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            {t('settings.update_details')}
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        <BuildingIcon className="w-6 h-6 text-slate-400" />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                            {settings.logo_url ? (
                                <img
                                    src={settings.logo_url}
                                    alt="Business Logo"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <BuildingIcon className="w-12 h-12 text-slate-400" />
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleLogoUpload}
                                    className="inline-flex items-center px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    <UploadIcon className="w-4 h-4 mr-2" />
                                    {t('settings.upload_logo')}
                                </button>
                                {settings.logo_url && (
                                    <button
                                        onClick={handleRemoveLogo}
                                        className="inline-flex items-center px-3 py-1.5 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <XIcon className="w-4 h-4 mr-2" />
                                        {t('settings.remove')}
                                    </button>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/jpg"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <p className="text-sm text-slate-500 mt-2">
                                {t('settings.logo_size_limit')}
                            </p>
                            {logoError && (
                                <p className="text-sm text-red-500 mt-1">{logoError}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                {t('settings.business_name')}
                            </label>
                            <input
                                type="text"
                                value={settings.business_name}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        business_name: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                {t('settings.contact_number')}
                            </label>
                            <input
                                type="text"
                                value={settings.contact_number}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        contact_number: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                {t('common.email')}
                            </label>
                            <input
                                type="email"
                                value={settings.email}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        email: e.target.value,
                                    })
                                }
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            {t('common.address')}
                        </label>
                        <textarea
                            value={settings.address}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    address: e.target.value,
                                })
                            }
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {t('settings.bank_account_details')}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            {t('settings.for_receiving_payments')}
                        </p>
                    </div>
                    <CreditCardIcon className="w-6 h-6 text-slate-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            {t('settings.bank_name')}
                        </label>
                        <input
                            type="text"
                            value={settings.bank_name}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    bank_name: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            {t('settings.account_name')}
                        </label>
                        <input
                            type="text"
                            value={settings.account_name}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    account_name: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            {t('settings.account_number')}
                        </label>
                        <input
                            type="text"
                            value={settings.account_number}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    account_number: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            {t('settings.routing_number')}
                        </label>
                        <input
                            type="text"
                            value={settings.routing_number}
                            onChange={(e) =>
                                setSettings({
                                    ...settings,
                                    routing_number: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {t('settings.invoice_settings')}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            {t('settings.customize_invoice')}
                        </p>
                    </div>
                    <FileTextIcon className="w-6 h-6 text-slate-400" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        {t('settings.invoice_footer_note')}
                    </label>
                    <textarea
                        value={settings.invoice_footer}
                        onChange={(e) =>
                            setSettings({
                                ...settings,
                                invoice_footer: e.target.value,
                            })
                        }
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                        {t('settings.footer_note_description')}
                    </p>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isSaving ? (
                        <svg
                            className="animate-spin -ml-1 mr-2 h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    ) : (
                        <SaveIcon className="w-5 h-5 mr-2" />
                    )}
                    {t('settings.save_settings')}
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;