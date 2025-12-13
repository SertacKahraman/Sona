import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, AppState, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { useTranslation } from 'react-i18next';

export default function LockScreen({ onUnlock }) {
    const { t } = useTranslation('lock');
    const [attemptCount, setAttemptCount] = useState(0);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const appState = useRef(AppState.currentState);
    const MAX_ATTEMPTS = 5;

    useEffect(() => {
        // Uygulama arka plana alınıp geri getirildiğinde tekrar kilitle
        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);

    const handleAppStateChange = (nextAppState) => {
        // Uygulama arka plandan ön plana geldiğinde tekrar kimlik doğrulama iste
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
            // Arka plandan dönünce otomatik başlat
            authenticate();
        }
        appState.current = nextAppState;
    };

    const authenticate = async () => {
        // Eğer zaten doğrulama yapılıyorsa, tekrar başlatma
        if (isAuthenticating) {
            return;
        }

        // Maksimum deneme sayısı aşıldıysa
        if (attemptCount >= MAX_ATTEMPTS) {
            Alert.alert(
                t('alerts.tooManyAttempts.title'),
                t('alerts.tooManyAttempts.messageLogout'),
                [
                    {
                        text: t('alerts.tooManyAttempts.ok'),
                        onPress: () => {
                            // Uygulamadan çık (production'da logout yapılabilir)
                        },
                    },
                ]
            );
            return;
        }

        setIsAuthenticating(true);

        try {
            // Önce cihaz yeteneklerini kontrol et
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            if (!hasHardware) {
                handleNoHardware();
                setIsAuthenticating(false);
                return;
            }

            const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (!isEnrolled) {
                handleNotEnrolled();
                setIsAuthenticating(false);
                return;
            }

            // Kimlik doğrulama yap
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: t('biometric.promptMessage'),
                fallbackLabel: Platform.OS === 'ios' ? t('biometric.fallbackLabelIOS') : t('biometric.fallbackLabelAndroid'),
                cancelLabel: t('biometric.cancelLabel'),
                disableDeviceFallback: false,
            });
            if (result.success) {
                setAttemptCount(0); // Başarılı olunca sayacı sıfırla
                onUnlock();
            } else {
                handleFailedAttempt(result);
            }
        } catch (error) {
            handleAuthError(error);
        } finally {
            setIsAuthenticating(false);
        }
    };

    const handleNoHardware = () => {
        Alert.alert(
            t('alerts.noHardware.title'),
            t('alerts.noHardware.message'),
            [
                {
                    text: t('alerts.noHardware.understood'),
                    onPress: () => {
                        // Kilidi otomatik kapat
                        onUnlock(); // Kullanıcıyı içeri al
                    },
                },
            ]
        );
    };

    const handleNotEnrolled = () => {
        Alert.alert(
            t('alerts.notEnrolled.title'),
            t('alerts.notEnrolled.message'),
            [
                {
                    text: t('alerts.notEnrolled.goToSettings'),
                    onPress: () => {
                        // iOS ve Android için ayarlar sayfasını açma önerisi
                    },
                },
                {
                    text: t('alerts.notEnrolled.disableLock'),
                    style: 'destructive',
                    onPress: () => {
                        onUnlock();
                    },
                },
            ]
        );
    };

    const handleFailedAttempt = (result) => {
        const newAttemptCount = attemptCount + 1;
        setAttemptCount(newAttemptCount);

        const remainingAttempts = MAX_ATTEMPTS - newAttemptCount;

        if (remainingAttempts > 0) {
            Alert.alert(
                t('alerts.authFailed.title'),
                t('alerts.authFailed.message', { count: remainingAttempts }),
                [
                    {
                        text: t('alerts.authFailed.retry'),
                        onPress: () => authenticate(),
                    },
                    {
                        text: t('alerts.authFailed.cancel'),
                        style: 'cancel',
                    },
                ]
            );
        } else {
            // Maksimum deneme sayısı aşıldı
            Alert.alert(
                t('alerts.tooManyAttempts.title'),
                t('alerts.tooManyAttempts.messageLockDisabled'),
                [
                    {
                        text: t('alerts.tooManyAttempts.ok'),
                        onPress: () => {
                            setAttemptCount(0);
                            onUnlock(); // Kilidi kapat ve kullanıcıyı içeri al
                        },
                    },
                ]
            );
        }
    };

    const handleAuthError = (error) => {
        Alert.alert(
            t('alerts.authError.title'),
            t('alerts.authError.message'),
            [
                {
                    text: t('alerts.authError.retry'),
                    onPress: () => authenticate(),
                },
                {
                    text: t('alerts.authError.cancel'),
                    style: 'cancel',
                },
            ]
        );
    };

    return (
        <LinearGradient
            colors={['#66D9A1', '#4CAF50']}
            style={styles.container}
        >
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Feather name="lock" size={80} color="#FFF" />
                </View>

                <Text style={styles.title}>{t('title')}</Text>
                <Text style={styles.subtitle}>{t('subtitle')}</Text>

                <Text style={styles.description}>
                    {t('description')}
                </Text>

                {attemptCount > 0 && (
                    <View style={styles.warningBox}>
                        <Feather name="alert-triangle" size={20} color="#FF5252" />
                        <Text style={styles.warningText}>
                            {t('remainingAttempts', { count: MAX_ATTEMPTS - attemptCount })}
                        </Text>
                    </View>
                )}

                <TouchableOpacity
                    style={[styles.unlockButton, isAuthenticating && styles.unlockButtonDisabled]}
                    onPress={authenticate}
                    activeOpacity={0.8}
                    disabled={isAuthenticating}
                >
                    <View style={styles.buttonContent}>
                        {isAuthenticating ? (
                            <>
                                <Feather name="loader" size={24} color="#4CAF50" />
                                <Text style={styles.buttonText}>{t('authenticating')}</Text>
                            </>
                        ) : (
                            <>
                                <Feather name="unlock" size={24} color="#4CAF50" />
                                <Text style={styles.buttonText}>{t('unlock')}</Text>
                            </>
                        )}
                    </View>
                </TouchableOpacity>

                <Text style={styles.hint}>
                    {Platform.OS === 'ios' ? t('hintIOS') : t('hintAndroid')}
                </Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    iconContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 20,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 20,
        fontWeight: '600',
    },
    description: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 24,
    },
    warningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 82, 82, 0.2)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 20,
        gap: 10,
    },
    warningText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    unlockButton: {
        backgroundColor: '#FFF',
        borderRadius: 25,
        paddingVertical: 16,
        paddingHorizontal: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 20,
    },
    unlockButtonDisabled: {
        opacity: 0.7,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    hint: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});
