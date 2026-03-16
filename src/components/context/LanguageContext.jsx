import React, { useEffect, useState, createContext, useContext } from 'react';
import { translations } from '../translations/translations';

export const languages = [
    {
        code: 'en',
        label: 'English',
        shortCode: 'EN',
    },
    {
        code: 'si',
        label: 'සිංහල',
        shortCode: 'SI',
    },
    {
        code: 'ta',
        label: 'தமிழ்',
        shortCode: 'TA',
    },
];

const LanguageContext = createContext(undefined);

export const LanguageProvider = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('app-language');
            if (saved && ['en', 'si', 'ta'].includes(saved)) {
                return saved;
            }
        }
        return 'en';
    });

    useEffect(() => {
        localStorage.setItem('app-language', currentLanguage);
    }, [currentLanguage]);

    const languageDetails =
        languages.find((l) => l.code === currentLanguage) || languages[0];

    // Translation function
    const t = (key) => {
        const keys = key.split('.');
        let value = translations[currentLanguage];

        // Simple flat key lookup since our translations object is flat
        if (value && value[key]) {
            return value[key];
        }

        // Fallback to English
        if (currentLanguage !== 'en' && translations['en'][key]) {
            return translations['en'][key];
        }

        return key; // Return key if translation not found
    };

    return (
        <LanguageContext.Provider
            value={{
                currentLanguage,
                setLanguage: setCurrentLanguage,
                languageDetails,
                t,
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export default LanguageContext;