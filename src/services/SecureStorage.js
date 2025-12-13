import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/**
 * Güvenli Veri Depolama Servisi
 * 
 * iOS/Android: Keychain/Keystore kullanır (şifreli)
 * Web: AsyncStorage fallback (şifreleme yok ama en iyisi)
 */

// Hassas veriler için SecureStore kullan
export const SecureStorage = {
    // Veri kaydet (şifreli)
    async setItem(key, value) {
        try {
            if (Platform.OS === 'web') {
                // Web'de SecureStore yok, AsyncStorage kullan
                await AsyncStorage.setItem(key, value);
            } else {
                // iOS/Android'de şifreli depolama
                await SecureStore.setItemAsync(key, value);
            }
        } catch (error) {
            console.error('SecureStorage setItem error:', error);
            throw error;
        }
    },

    // Veri oku (şifreli)
    async getItem(key) {
        try {
            if (Platform.OS === 'web') {
                return await AsyncStorage.getItem(key);
            } else {
                return await SecureStore.getItemAsync(key);
            }
        } catch (error) {
            console.error('SecureStorage getItem error:', error);
            return null;
        }
    },

    // Veri sil
    async removeItem(key) {
        try {
            if (Platform.OS === 'web') {
                await AsyncStorage.removeItem(key);
            } else {
                await SecureStore.deleteItemAsync(key);
            }
        } catch (error) {
            console.error('SecureStorage removeItem error:', error);
        }
    },

    // Tüm verileri sil
    async clear() {
        try {
            if (Platform.OS === 'web') {
                await AsyncStorage.clear();
            } else {
                // SecureStore'da clear yok, manuel silmek gerekir
                // Ama logout'ta zaten tüm key'leri biliyoruz
                const keys = ['userData', 'relationships', 'specialDates', 'dailyMoods', 'totalMessageCount'];
                for (const key of keys) {
                    await SecureStore.deleteItemAsync(key);
                }
            }
        } catch (error) {
            console.error('SecureStorage clear error:', error);
        }
    }
};

// Hassas olmayan veriler için normal AsyncStorage
export const LocalStorage = {
    async setItem(key, value) {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.error('LocalStorage setItem error:', error);
        }
    },

    async getItem(key) {
        try {
            return await AsyncStorage.getItem(key);
        } catch (error) {
            console.error('LocalStorage getItem error:', error);
            return null;
        }
    },

    async removeItem(key) {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error('LocalStorage removeItem error:', error);
        }
    },

    async clear() {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.error('LocalStorage clear error:', error);
        }
    }
};

/**
 * Veri Şifreleme Yardımcıları (Opsiyonel - Ekstra Güvenlik)
 * 
 * Not: SecureStore zaten şifreliyor ama ekstra katman istersen
 * crypto-js gibi bir kütüphane ekleyebilirsin
 */

// Basit obfuscation (gerçek şifreleme değil, sadece gizleme)
export const obfuscate = (text) => {
    return Buffer.from(text).toString('base64');
};

export const deobfuscate = (encoded) => {
    return Buffer.from(encoded, 'base64').toString('utf-8');
};
