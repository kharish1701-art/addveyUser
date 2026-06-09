
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LanguageContextType {
    selectedLanguages: string[];
    setLanguages: (langs: string[]) => void;
    loading: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
    selectedLanguages: ['en'], // Default to English
    setLanguages: () => { },
    loading: true,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['en']);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const storedLang = await AsyncStorage.getItem('appLanguage');
            if (storedLang) {
                // Check if it's a JSON array or legacy string
                try {
                    const parsed = JSON.parse(storedLang);
                    if (Array.isArray(parsed)) {
                        setSelectedLanguages(parsed);
                    } else {
                        setSelectedLanguages([storedLang]);
                    }
                } catch {
                    // Legacy support: if not JSON, treat as single string
                    setSelectedLanguages([storedLang]);
                }
            }
        } catch (error) {
            console.error('Failed to load language', error);
        } finally {
            setLoading(false);
        }
    };

    const setLanguages = async (langs: string[]) => {
        try {
            // Ensure all IDs are strings
            const langsStr = langs.map(String);
            setSelectedLanguages(langsStr);
            await AsyncStorage.setItem('appLanguage', JSON.stringify(langsStr));
        } catch (error) {
            console.error('Failed to save language', error);
        }
    };

    return (
        <LanguageContext.Provider value={{ selectedLanguages, setLanguages, loading }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
