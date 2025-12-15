import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Alert, Switch, Platform, Modal, FlatList, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as LocalAuthentication from 'expo-local-authentication';
import { useApp } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';

const TABLET_BREAKPOINT = 768;

export default function ProfileScreen({ navigation }) {
  const { t, i18n } = useTranslation('profile');
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isTablet = screenWidth >= TABLET_BREAKPOINT;

  // Bottom offset - responsive olarak (navigation bar ile aynı)
  const bottomSafeArea = Platform.OS === 'android'
    ? (isTablet ? 15 : 10)
    : (isTablet ? 25 : 20);

  // Tab bar yüksekliği + bottom offset
  const tabBarHeight = isTablet ? 85 : 70;
  const bottomPadding = tabBarHeight + bottomSafeArea + 20;

  // Dynamic sizes for tablet
  const headerTitleSize = isTablet ? 24 : 20;
  const avatarContainerSize = isTablet ? 120 : 100;
  const userNameSize = isTablet ? 28 : 24;
  const sectionTitleSize = isTablet ? 20 : 18;
  const statNumberSize = isTablet ? 24 : 20;
  const infoIconSize = isTablet ? 48 : 40;
  const infoValueSize = isTablet ? 18 : 16;

  const {
    userName,
    userAge,
    userGender,
    relationshipStatus,
    coachingGoal,
    relationships,
    logout,
    setIsEditingProfile,
    registrationDate,
    totalMessageCount,
    changeLanguage,
    savedAdvice
  } = useApp();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privacyLockEnabled, setPrivacyLockEnabled] = useState(false);
  const [daysCount, setDaysCount] = useState(0);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);

  useEffect(() => {
    loadSettings();
    calculateStats();
  }, [relationships]);

  const loadSettings = async () => {
    try {
      // AsyncStorage'dan kullanıcı tercihlerini oku
      const notifPreference = await AsyncStorage.getItem('notificationsEnabled');
      const privacy = await AsyncStorage.getItem('privacyLockEnabled');

      // Gerçek telefon bildirim iznini kontrol et (with error handling for Expo Go)
      let status = 'undetermined';
      try {
        const result = await Notifications.getPermissionsAsync();
        status = result.status;
      } catch (notifError) {
        // Notifications not available in Expo Go SDK 53+
      }

      // Bildirim durumunu belirle:
      // - Telefon izni VARSA ve kullanıcı tercihi açıksa → Açık
      // - Diğer durumlarda → Kapalı
      if (status === 'granted' && notifPreference === 'true') {
        setNotificationsEnabled(true);
      } else {
        setNotificationsEnabled(false);
        // Eğer telefon izni yoksa, AsyncStorage'ı da güncelle
        if (status !== 'granted' && notifPreference === 'true') {
          await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(false));
        }
      }

      // Privacy lock ayarını yükle
      setPrivacyLockEnabled(privacy === 'true');
    } catch (e) {
      // Error handling
    }
  };

  const calculateStats = () => {
    // Calculate days since first login
    if (registrationDate) {
      const start = new Date(registrationDate);
      const now = new Date();

      // Tarihleri sadece gün bazında karşılaştır (saat bilgisini sıfırla)
      start.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);

      const diffTime = now - start;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      setDaysCount(diffDays);
    } else {
      setDaysCount(0);
    }
  };


  const toggleNotifications = async (value) => {
    try {
      if (value) {
        // Kullanıcı bildirimleri açmak istiyor
        let status = 'denied';
        try {
          const result = await Notifications.requestPermissionsAsync();
          status = result.status;
        } catch (notifError) {
          // Notifications not available in Expo Go SDK 53+
          Alert.alert(
            t('notifications.notAvailable', { ns: 'profile', defaultValue: 'Not Available' }),
            t('notifications.notAvailableMessage', { ns: 'profile', defaultValue: 'Push notifications are not available in Expo Go. Please use a development build.' })
          );
          setNotificationsEnabled(false);
          return;
        }

        if (status === 'granted') {
          // İzin verildi
          setNotificationsEnabled(true);
          await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(true));
          Alert.alert(t('notifications.enabled', { ns: 'profile' }), t('notifications.enabled', { ns: 'profile' }));
        } else {
          // İzin verilmedi
          setNotificationsEnabled(false);
          await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(false));
          Alert.alert(
            t('notifications.permissionTitle', { ns: 'profile' }),
            t('notifications.permissionMessage', { ns: 'profile' }),
            [
              { text: t('buttons.confirm', { ns: 'common' }), style: 'default' }
            ]
          );
        }
      } else {
        // Kullanıcı bildirimleri kapatmak istiyor
        setNotificationsEnabled(false);
        await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(false));
        Alert.alert(t('notifications.disabled', { ns: 'profile' }), t('notifications.disabled', { ns: 'profile' }));
      }
    } catch (e) {
      Alert.alert(t('errors.unknown', { ns: 'common' }), t('notifications.error', { ns: 'profile' }));
      // Hata durumunda eski değere geri dön
      setNotificationsEnabled(!value);
    }
  };


  const togglePrivacyLock = async (value) => {
    try {
      if (value) {
        // Kullanıcı kilidi açmak istiyor - önce cihaz desteğini kontrol et
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        if (!hasHardware) {
          Alert.alert(
            t('appLock.notSupported', { ns: 'profile' }),
            t('appLock.notSupportedMessage', { ns: 'profile' }),
            [{ text: t('buttons.confirm', { ns: 'common' }) }]
          );
          return;
        }

        // Desteklenen kimlik doğrulama tiplerini kontrol et
        const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (!isEnrolled) {
          const authTypeText = Platform.OS === 'ios'
            ? t('appLock.faceId', { ns: 'profile' })
            : t('appLock.fingerprintAuth', { ns: 'profile' });

          Alert.alert(
            t('appLock.notEnrolled', { ns: 'profile' }),
            t('appLock.notEnrolledMessage', { ns: 'profile', authType: authTypeText }),
            [
              {
                text: t('buttons.confirm', { ns: 'common' }),
                onPress: () => {
                  // iOS: Settings > Face ID & Passcode
                  // Android: Settings > Security > Fingerprint
                },
              },
              {
                text: t('buttons.cancel', { ns: 'common' }),
                style: 'cancel',
              },
            ]
          );
          return;
        }

        // Biyometrik doğrulama yap
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: t('appLock.promptEnable', { ns: 'profile' }),
          fallbackLabel: Platform.OS === 'ios' ? t('buttons.confirm', { ns: 'common' }) : t('buttons.confirm', { ns: 'common' }),
          cancelLabel: t('buttons.cancel', { ns: 'common' }),
          disableDeviceFallback: false,
        });
        if (result.success) {
          // Doğrulama başarılı
          setPrivacyLockEnabled(true);
          await AsyncStorage.setItem('privacyLockEnabled', JSON.stringify(true));

          const authMethod = Platform.OS === 'ios'
            ? t('appLock.faceIdTouchId', { ns: 'profile' })
            : t('appLock.fingerprint', { ns: 'profile' });

          Alert.alert(
            t('appLock.enabled', { ns: 'profile' }),
            t('appLock.enabledMessage', { ns: 'profile', method: authMethod })
          );
        } else {
          // Doğrulama başarısız veya iptal edildi
          setPrivacyLockEnabled(false);

          if (result.error === 'user_cancel') {
            Alert.alert(t('appLock.cancelled', { ns: 'profile' }), t('appLock.cancelledMessage', { ns: 'profile' }));
          } else {
            Alert.alert(t('appLock.authFailed', { ns: 'profile' }), t('appLock.authFailedMessage', { ns: 'profile' }));
          }
        }
      } else {
        // Kullanıcı kilidi kapatmak istiyor - güvenlik için doğrulama iste
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: t('appLock.promptDisable', { ns: 'profile' }),
          fallbackLabel: Platform.OS === 'ios' ? t('buttons.confirm', { ns: 'common' }) : t('buttons.confirm', { ns: 'common' }),
          cancelLabel: t('buttons.cancel', { ns: 'common' }),
          disableDeviceFallback: false,
        });

        if (result.success) {
          setPrivacyLockEnabled(false);
          await AsyncStorage.setItem('privacyLockEnabled', JSON.stringify(false));
          Alert.alert(t('appLock.disabled', { ns: 'profile' }), t('appLock.disabledMessage', { ns: 'profile' }));
        } else {
          // İptal edildi, switch'i eski haline döndür
          setPrivacyLockEnabled(true);
        }
      }
    } catch (e) {
      Alert.alert(
        t('errors.unknown', { ns: 'common' }),
        t('appLock.error', { ns: 'profile' })
      );
      setPrivacyLockEnabled(!value);
    }
  };

  const showLanguageOptions = () => {
    setIsLanguageModalVisible(true);
  };

  const LANGUAGES = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷', message: 'Uygulama dili Türkçe olarak ayarlandı.' },
    { code: 'en', name: 'English', flag: '🇬🇧', message: 'App language has been set to English.' },
    { code: 'es', name: 'Español', flag: '🇪🇸', message: 'El idioma de la aplicación se ha configurado a Español.' },
    { code: 'pt', name: 'Português', flag: '🇵🇹', message: 'O idioma do aplicativo foi definido para Português.' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', message: 'App-Sprache wurde auf Deutsch eingestellt.' },
    { code: 'fr', name: 'Français', flag: '🇫🇷', message: 'La langue de l\'application a été réglée sur le français.' }
  ];

  const handleLanguageChange = async (languageCode) => {
    try {
      if (languageCode === i18n.language) {
        setIsLanguageModalVisible(false);
        return;
      }

      await changeLanguage(languageCode);
      setIsLanguageModalVisible(false);

      const selectedLang = LANGUAGES.find(lang => lang.code === languageCode);
      const title = t('language.changed', { defaultValue: 'Language Changed' });
      const message = selectedLang ? selectedLang.message : 'Language updated successfully.';

      Alert.alert(title, message);
    } catch (error) {
      setIsLanguageModalVisible(false);
      Alert.alert('Error', 'Could not change language. Please try again.');
    }
  };


  const handleLogout = () => {
    Alert.alert(
      t('logout.confirmTitle'),
      t('logout.confirmMessage'),
      [
        { text: t('logout.cancel'), style: "cancel" },
        {
          text: t('logout.confirm'),
          onPress: async () => {
            await logout();
            // Reset navigation to Legal screen (start of onboarding)
            navigation.reset({
              index: 0,
              routes: [{ name: 'Legal' }],
            });
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    navigation.navigate('Name');
  };

  const getGenderLabel = (id) => {
    return t(`personalInfo.gender.${id}`, { ns: 'onboarding', defaultValue: id });
  };

  const getStatusLabel = (id) => {
    return t(`personalInfo.status.${id}`, { ns: 'onboarding', defaultValue: id });
  };

  const getGoalLabel = (id) => {
    return t(`personalInfo.goal.${id}`, { ns: 'onboarding', defaultValue: id });
  };

  const currentLanguage = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES.find(l => l.code === 'en');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient
        colors={['#66D9A1', '#4CAF50']}
        style={[styles.headerGradient, isTablet && { paddingBottom: 30 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.headerContent, { paddingHorizontal: 20, paddingTop: insets.top + 10 }]}>
          <View style={styles.headerTop}>
            <Text style={[styles.headerTitle, { fontSize: headerTitleSize }]}>{t('header.title')}</Text>
            <TouchableOpacity
              style={[styles.editButton, isTablet && { padding: 12 }]}
              onPress={handleEditProfile}
            >
              <Feather name="edit-2" size={isTablet ? 26 : 20} color="#FFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.profileCard}>
            <View style={[styles.avatarContainer, { width: avatarContainerSize, height: avatarContainerSize, borderRadius: avatarContainerSize / 2 }]}>
              <Image
                source={require('../../../assets/selam.png')}
                style={styles.avatar}
                resizeMode="contain"
              />
            </View>
            <Text style={[styles.userName, { fontSize: userNameSize }]}>{userName}</Text>
            <Text style={[styles.userStatus, isTablet && { fontSize: 16 }]}>{getStatusLabel(relationshipStatus)}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Statistics Section */}
        <View style={[styles.statsRow, isTablet && { padding: 28 }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { fontSize: statNumberSize }]}>{daysCount}</Text>
            <Text style={[styles.statLabel, isTablet && { fontSize: 14 }]}>{t('stats.days')}</Text>
          </View>
          <View style={[styles.statDivider, isTablet && { height: 40 }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { fontSize: statNumberSize }]}>{totalMessageCount}</Text>
            <Text style={[styles.statLabel, isTablet && { fontSize: 14 }]}>{t('stats.messages')}</Text>
          </View>
          <View style={[styles.statDivider, isTablet && { height: 40 }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { fontSize: statNumberSize }]}>{relationships?.length || 0}</Text>
            <Text style={[styles.statLabel, isTablet && { fontSize: 14 }]}>{t('stats.relationships')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: sectionTitleSize }]}>{t('sections.personalInfo')}</Text>

          <View style={[styles.infoCard, isTablet && { padding: 24 }]}>
            <View style={[styles.infoRow, isTablet && { paddingVertical: 12 }]}>
              <View style={[styles.infoIcon, { width: infoIconSize, height: infoIconSize, borderRadius: infoIconSize / 2 }]}>
                <Feather name="user" size={isTablet ? 24 : 20} color="#66D9A1" />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, isTablet && { fontSize: 14 }]}>{t('personalInfo.ageGroup')}</Text>
                <Text style={[styles.infoValue, { fontSize: infoValueSize }]}>{userAge}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={[styles.infoRow, isTablet && { paddingVertical: 12 }]}>
              <View style={[styles.infoIcon, { width: infoIconSize, height: infoIconSize, borderRadius: infoIconSize / 2 }]}>
                <Feather name="users" size={isTablet ? 24 : 20} color="#66D9A1" />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, isTablet && { fontSize: 14 }]}>{t('personalInfo.gender')}</Text>
                <Text style={[styles.infoValue, { fontSize: infoValueSize }]}>{getGenderLabel(userGender)}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={[styles.infoRow, isTablet && { paddingVertical: 12 }]}>
              <View style={[styles.infoIcon, { width: infoIconSize, height: infoIconSize, borderRadius: infoIconSize / 2 }]}>
                <Feather name="heart" size={isTablet ? 24 : 20} color="#66D9A1" />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, isTablet && { fontSize: 14 }]}>{t('personalInfo.status')}</Text>
                <Text style={[styles.infoValue, { fontSize: infoValueSize }]}>{getStatusLabel(relationshipStatus)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: sectionTitleSize }]}>{t('sections.goals')}</Text>
          <View style={[styles.infoCard, isTablet && { padding: 24 }]}>
            <View style={[styles.infoRow, isTablet && { paddingVertical: 12 }]}>
              <View style={[styles.infoIcon, { width: infoIconSize, height: infoIconSize, borderRadius: infoIconSize / 2 }]}>
                <Feather name="target" size={isTablet ? 24 : 20} color="#FFD93D" />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, isTablet && { fontSize: 14 }]}>{t('goals.coachingGoal')}</Text>
                <Text style={[styles.infoValue, { fontSize: infoValueSize }]}>{getGoalLabel(coachingGoal)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Saved Advice Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: sectionTitleSize }]}>{t('sections.saved')}</Text>
          <TouchableOpacity
            style={styles.savedAdviceCard}
            onPress={() => navigation.navigate('SavedAdvice')}
          >
            <LinearGradient
              colors={['#FFF', '#F8F9FA']}
              style={[styles.savedAdviceGradient, isTablet && { padding: 20 }]}
            >
              <View style={[styles.savedIconBox, isTablet && { width: 56, height: 56, borderRadius: 28 }]}>
                <Feather name="bookmark" size={isTablet ? 28 : 24} color="#66D9A1" />
              </View>
              <View style={styles.savedContent}>
                <Text style={[styles.savedTitle, isTablet && { fontSize: 18 }]}>{t('saved.title')}</Text>
                <Text style={[styles.savedSubtitle, isTablet && { fontSize: 14 }]}>{t('saved.count', { count: savedAdvice?.length || 0 })}</Text>
              </View>
              <Feather name="chevron-right" size={isTablet ? 24 : 20} color="#CCC" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: sectionTitleSize }]}>{t('settings.title')}</Text>
          <View style={[styles.infoCard, isTablet && { padding: 24 }]}>
            {/* Language Selector */}
            <TouchableOpacity
              style={[styles.settingRow, isTablet && { paddingVertical: 12 }]}
              onPress={showLanguageOptions}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.infoIcon, { backgroundColor: '#E8F5E9', width: infoIconSize, height: infoIconSize, borderRadius: infoIconSize / 2 }]}>
                  <Feather name="globe" size={isTablet ? 24 : 20} color="#4CAF50" />
                </View>
                <View style={styles.languageInfo}>
                  <Text style={[styles.settingLabel, isTablet && { fontSize: 18 }]}>{t('settings.language.title')}</Text>
                  <Text style={[styles.languageValue, isTablet && { fontSize: 16 }]}>
                    {currentLanguage.flag} {currentLanguage.name}
                  </Text>
                </View>
              </View>
              <Feather name="chevron-right" size={isTablet ? 24 : 20} color="#CCC" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={[styles.settingRow, isTablet && { paddingVertical: 12 }]}>
              <View style={styles.settingLeft}>
                <View style={[styles.infoIcon, { backgroundColor: '#E3F2FD', width: infoIconSize, height: infoIconSize, borderRadius: infoIconSize / 2 }]}>
                  <Feather name="bell" size={isTablet ? 24 : 20} color="#2196F3" />
                </View>
                <Text style={[styles.settingLabel, isTablet && { fontSize: 18 }]}>{t('settings.notifications')}</Text>
              </View>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={notificationsEnabled ? "#2196F3" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleNotifications}
                value={notificationsEnabled}
                style={isTablet ? { transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] } : {}}
              />
            </View>

            <View style={styles.divider} />

            <View style={[styles.settingRow, isTablet && { paddingVertical: 12 }]}>
              <View style={styles.settingLeft}>
                <View style={[styles.infoIcon, { backgroundColor: '#FFEBEE', width: infoIconSize, height: infoIconSize, borderRadius: infoIconSize / 2 }]}>
                  <Feather name="lock" size={isTablet ? 24 : 20} color="#FF5252" />
                </View>
                <Text style={[styles.settingLabel, isTablet && { fontSize: 18 }]}>{t('settings.appLock')}</Text>
              </View>
              <Switch
                trackColor={{ false: "#767577", true: "#ffcdd2" }}
                thumbColor={privacyLockEnabled ? "#FF5252" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={togglePrivacyLock}
                value={privacyLockEnabled}
                style={isTablet ? { transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] } : {}}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontSize: sectionTitleSize }]}>{t('sections.account')}</Text>
          <TouchableOpacity style={[styles.logoutButton, isTablet && { padding: 20 }]} onPress={handleLogout}>
            <Feather name="log-out" size={isTablet ? 24 : 20} color="#FF6B6B" />
            <Text style={[styles.logoutText, isTablet && { fontSize: 18 }]}>{t('logout.button')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>



      {/* Custom Language Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isLanguageModalVisible}
        onRequestClose={() => setIsLanguageModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsLanguageModalVisible(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('settings.language.title')}</Text>
              <TouchableOpacity onPress={() => setIsLanguageModalVisible(false)}>
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={LANGUAGES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.languageListItem,
                    i18n.language === item.code && styles.languageListItemActive
                  ]}
                  onPress={() => handleLanguageChange(item.code)}
                >
                  <View style={styles.languageOptionContent}>
                    <Text style={styles.languageFlag}>{item.flag}</Text>
                    <Text style={[
                      styles.languageOptionText,
                      i18n.language === item.code && styles.languageOptionTextActive
                    ]}>{item.name}</Text>
                  </View>
                  {i18n.language === item.code && (
                    <Feather name="check-circle" size={24} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
              contentContainerStyle={styles.languageListContainer}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Bottom Navigation Removed */}
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerGradient: {
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
    paddingTop: 10,
    width: '100%',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    marginBottom: 20,
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  editButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  profileCard: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF',
    padding: 5,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    marginTop: 10,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#F0F0F0',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
    marginLeft: 4,
  },
  savedAdviceCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  savedAdviceGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
  },
  savedIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F7EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  savedContent: {
    flex: 1,
  },
  savedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  savedSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F9F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 8,
    marginLeft: 56,
  },
  logoutButton: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFEBEE',
    gap: 10,
  },
  logoutText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
  },
  languageInfo: {
    flex: 1,
  },
  languageValue: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 4,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%', // Increased height
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  languageListContainer: {
    paddingHorizontal: 20,
  },
  languageListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 10,
  },
  languageListItemActive: {
    backgroundColor: '#F9F9F9',
  },
  listSeparator: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  languageOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  languageFlag: {
    fontSize: 28,
  },
  languageOptionText: {
    fontSize: 17,
    color: '#333',
    fontWeight: '500',
  },
  languageOptionTextActive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 40,
  },
});
