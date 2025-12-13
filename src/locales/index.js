import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Türkçe çeviri dosyaları
import commonTR from './tr/common.json';
import onboardingTR from './tr/onboarding.json';
import homeTR from './tr/home.json';
import chatTR from './tr/chat.json';
import profileTR from './tr/profile.json';
import allRelationshipsTR from './tr/allRelationships.json';
import lockTR from './tr/lock.json';
import documentsTR from './tr/documents.json';

// İngilizce çeviri dosyaları
import commonEN from './en/common.json';
import onboardingEN from './en/onboarding.json';
import homeEN from './en/home.json';
import chatEN from './en/chat.json';
import profileEN from './en/profile.json';
import allRelationshipsEN from './en/allRelationships.json';
import lockEN from './en/lock.json';
import documentsEN from './en/documents.json';

// İspanyolca çeviri dosyaları
import commonES from './es/common.json';
import onboardingES from './es/onboarding.json';
import homeES from './es/home.json';
import chatES from './es/chat.json';
import profileES from './es/profile.json';
import allRelationshipsES from './es/allRelationships.json';
import lockES from './es/lock.json';
import documentsES from './es/documents.json';

// Portekizce çeviri dosyaları
import commonPT from './pt/common.json';
import onboardingPT from './pt/onboarding.json';
import homePT from './pt/home.json';
import chatPT from './pt/chat.json';
import profilePT from './pt/profile.json';
import allRelationshipsPT from './pt/allRelationships.json';
import lockPT from './pt/lock.json';
import documentsPT from './pt/documents.json';

// Almanca çeviri dosyaları
import commonDE from './de/common.json';
import onboardingDE from './de/onboarding.json';
import homeDE from './de/home.json';
import chatDE from './de/chat.json';
import profileDE from './de/profile.json';
import allRelationshipsDE from './de/allRelationships.json';
import lockDE from './de/lock.json';
import documentsDE from './de/documents.json';

// Fransızca çeviri dosyaları
import commonFR from './fr/common.json';
import onboardingFR from './fr/onboarding.json';
import homeFR from './fr/home.json';
import chatFR from './fr/chat.json';
import profileFR from './fr/profile.json';
import allRelationshipsFR from './fr/allRelationships.json';
import lockFR from './fr/lock.json';
import documentsFR from './fr/documents.json';

const LANGUAGE_STORAGE_KEY = 'user_language';

/**
 * Cihaz dilini algıla
 */
const getDeviceLanguage = () => {
    try {
        const locales = Localization.getLocales();
        if (locales && locales.length > 0) {
            const primaryLocale = locales[0];
            return primaryLocale.languageCode;
        }
    } catch (error) {
        console.error('Dil algılama hatası:', error);
    }
    // Varsayılan: İngilizce
    return 'en';
};

/**
 * Kaydedilmiş dil tercihini al
 * Eğer kayıtlı yoksa cihaz dilini kullan
 */
const getStoredLanguage = async () => {
    try {
        const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        return stored || getDeviceLanguage();
    } catch (error) {
        console.error('Kaydedilmiş dil yüklenemedi:', error);
        return getDeviceLanguage();
    }
};

/**
 * Dil tercihini kaydet
 */
export const saveLanguagePreference = async (language) => {
    try {
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (error) {
        console.error('Dil tercihi kaydedilemedi:', error);
    }
};

// i18next yapılandırması
i18n
    .use(initReactI18next)
    .init({
        resources: {
            tr: {
                common: commonTR,
                onboarding: onboardingTR,
                home: homeTR,
                chat: chatTR,
                profile: profileTR,
                allRelationships: allRelationshipsTR,
                lock: lockTR,
                documents: documentsTR,
            },
            en: {
                common: commonEN,
                onboarding: onboardingEN,
                home: homeEN,
                chat: chatEN,
                profile: profileEN,
                allRelationships: allRelationshipsEN,
                lock: lockEN,
                documents: documentsEN,
            },
            es: {
                common: commonES,
                onboarding: onboardingES,
                home: homeES,
                chat: chatES,
                profile: profileES,
                allRelationships: allRelationshipsES,
                lock: lockES,
                documents: documentsES,
            },
            pt: {
                common: commonPT,
                onboarding: onboardingPT,
                home: homePT,
                chat: chatPT,
                profile: profilePT,
                allRelationships: allRelationshipsPT,
                lock: lockPT,
                documents: documentsPT,
            },
            de: {
                common: commonDE,
                onboarding: onboardingDE,
                home: homeDE,
                chat: chatDE,
                profile: profileDE,
                allRelationships: allRelationshipsDE,
                lock: lockDE,
                documents: documentsDE,
            },
            fr: {
                common: commonFR,
                onboarding: onboardingFR,
                home: homeFR,
                chat: chatFR,
                profile: profileFR,
                allRelationships: allRelationshipsFR,
                lock: lockFR,
                documents: documentsFR,
            },
        },
        lng: getDeviceLanguage(), // Başlangıç dili (cihaz diline göre)
        fallbackLng: 'en', // Çeviri bulunamazsa İngilizce kullan
        defaultNS: 'common', // Varsayılan namespace

        // Interpolation ayarları
        interpolation: {
            escapeValue: false, // React zaten XSS koruması yapıyor
        },

        // React entegrasyonu
        react: {
            useSuspense: false, // Async yükleme için suspense kullanma
        },

        // Debug modu (production'da kapalı)
        debug: __DEV__,
    });

// Kaydedilmiş dili yükle ve uygula
getStoredLanguage().then((lang) => {
    if (lang !== i18n.language) {
        i18n.changeLanguage(lang);
    }
});

export default i18n;
