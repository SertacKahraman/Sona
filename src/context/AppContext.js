import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { saveLanguagePreference } from '../locales';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  // Çoklu ilişki yönetimi
  const [relationships, setRelationships] = useState([]);

  // Yeni ilişki ekleme için geçici state'ler
  const [relationshipType, setRelationshipType] = useState('');
  const [relationshipPartnerName, setRelationshipPartnerName] = useState('');
  const [relationshipYears, setRelationshipYears] = useState(0);
  const [relationshipMonths, setRelationshipMonths] = useState(0);
  const [mainChallenge, setMainChallenge] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editingRelationshipId, setEditingRelationshipId] = useState(null);

  // Yeni Özellikler: Özel Günler ve Mod Takibi
  const [specialDates, setSpecialDates] = useState([]);
  const [dailyMoods, setDailyMoods] = useState([]);
  const [savedAdvice, setSavedAdvice] = useState([]); // New state for saved messages
  const [totalMessageCount, setTotalMessageCount] = useState(0);

  const [userAge, setUserAge] = useState('');
  const [userGender, setUserGender] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('');
  const [coachingGoal, setCoachingGoal] = useState('');
  const [registrationDate, setRegistrationDate] = useState(null);
  const [partnerAge, setPartnerAge] = useState('');
  const [partnerGender, setPartnerGender] = useState('');
  const [partnerNotes, setPartnerNotes] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync();
    checkOnboardingStatus();

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    // Foreground listener
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
  }

  const checkOnboardingStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      const relationshipsData = await AsyncStorage.getItem('relationships');

      if (userData) {
        const data = JSON.parse(userData);
        setUserName(data.userName || '');
        setUserAge(data.userAge || '');
        setUserGender(data.userGender || '');
        setRelationshipStatus(data.relationshipStatus || '');
        setCoachingGoal(data.coachingGoal || '');
        setRegistrationDate(data.registrationDate || new Date().toISOString());
      } else {
        // İlk kez açılıyorsa veya veri yoksa bugünü kayıt tarihi yap
        const today = new Date().toISOString();
        setRegistrationDate(today);
      }

      if (relationshipsData) {
        const rels = JSON.parse(relationshipsData);
        setRelationships(rels);

        const datesData = await AsyncStorage.getItem('specialDates');
        if (datesData) setSpecialDates(JSON.parse(datesData));

        const moodsData = await AsyncStorage.getItem('dailyMoods');
        if (moodsData) setDailyMoods(JSON.parse(moodsData));

        const msgCount = await AsyncStorage.getItem('totalMessageCount');
        if (msgCount) setTotalMessageCount(parseInt(msgCount, 10));

        const savedAdviceData = await AsyncStorage.getItem('savedAdvice');
        if (savedAdviceData) setSavedAdvice(JSON.parse(savedAdviceData));
      }
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserData = async () => {
    try {
      const userData = {
        userName,
        userAge,
        userGender,
        relationshipStatus,
        coachingGoal,
        registrationDate: registrationDate || new Date().toISOString(),
      };
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      if (!isEditingProfile) {
        // Validation
        if (!relationshipPartnerName?.trim()) throw new Error('Partner ismi zorunludur.');
        if (!relationshipType) throw new Error('İlişki tipi zorunludur.');

        const newRelationship = {
          id: Date.now().toString(),
          type: relationshipType,
          partnerName: relationshipPartnerName,
          partnerAge: partnerAge,
          partnerGender: partnerGender,
          partnerNotes: partnerNotes,
          years: relationshipYears,
          months: relationshipMonths,
          mainChallenge: mainChallenge,
          createdAt: new Date().toISOString(),
          chatHistory: [],
        };

        const updatedRelationships = [...relationships, newRelationship];
        setRelationships(updatedRelationships);

        await AsyncStorage.setItem('relationships', JSON.stringify(updatedRelationships));
      }
    } catch (error) {
      console.error('Veri kaydedilirken hata:', error);
      throw error;
    }
  };

  const addNewRelationship = async (relationshipData) => {
    // Validation
    if (!relationshipData.partnerName?.trim()) throw new Error('Partner ismi zorunludur.');
    if (!relationshipData.type) throw new Error('İlişki tipi zorunludur.');

    try {
      const newRelationship = {
        id: Date.now().toString(),
        ...relationshipData,
        partnerAge: partnerAge,
        partnerGender: partnerGender,
        partnerNotes: partnerNotes,
        createdAt: new Date().toISOString(),
        chatHistory: [],
      };

      const updatedRelationships = [...relationships, newRelationship];
      setRelationships(updatedRelationships);

      await AsyncStorage.setItem('relationships', JSON.stringify(updatedRelationships));

      setIsAddingNew(false);
    } catch (error) {
      console.error('Yeni ilişki eklenirken hata:', error);
      throw error;
    }
  };

  const updateRelationship = async (id, updatedData) => {
    // Validation
    if (updatedData.partnerName !== undefined && !updatedData.partnerName?.trim()) throw new Error('Partner ismi boş olamaz.');
    if (updatedData.type !== undefined && !updatedData.type) throw new Error('İlişki tipi boş olamaz.');

    try {
      const updatedRelationships = relationships.map(rel =>
        rel.id === id ? { ...rel, ...updatedData } : rel
      );
      setRelationships(updatedRelationships);
      await AsyncStorage.setItem('relationships', JSON.stringify(updatedRelationships));

      setEditingRelationshipId(null);
    } catch (error) {
      console.error('İlişki güncellenirken hata:', error);
      throw error;
    }
  };

  const deleteRelationship = async (id) => {
    try {
      const updatedRelationships = relationships.filter(rel => rel.id !== id);
      setRelationships(updatedRelationships);
      await AsyncStorage.setItem('relationships', JSON.stringify(updatedRelationships));
    } catch (error) {
      console.error('İlişki silinirken hata:', error);
    }
  };

  const addSpecialDate = async (dateData) => {
    try {
      const rel = relationships.find(r => r.id === dateData.relationshipId);
      const partnerName = rel ? rel.partnerName : "";
      const notificationBody = partnerName
        ? `Hatırlatma: Bugün ${partnerName} için "${dateData.title}"! 🎉 Güzel bir sürpriz yapmaya ne dersin? ❤️`
        : `Hatırlatma: Bugün "${dateData.title}"! 🎉 Güzel bir sürpriz yapmaya ne dersin? ❤️`;

      let notificationId = null;
      try {
        // Calculate next occurrence
        const now = new Date();
        const targetMonth = Number(dateData.month) - 1; // 0-indexed
        const targetDay = Number(dateData.day);

        // Create date for this year
        let triggerDate = new Date(now.getFullYear(), targetMonth, targetDay, 9, 0, 0);

        // If this date is in the past, move to next year
        if (triggerDate <= now) {
          triggerDate.setFullYear(now.getFullYear() + 1);
        }

        notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: "Sona: Bugün Özel Bir Gün! ✨",
            body: notificationBody,
            sound: true,
            channelId: 'default',
          },
          trigger: triggerDate, // Pass the Date object directly
        });
      } catch (notifError) {
        // Bildirim planlanamadı - sessizce devam et
      }

      const newDate = {
        id: Date.now().toString(),
        ...dateData,
        notificationId
      };
      const updatedDates = [...specialDates, newDate];
      setSpecialDates(updatedDates);
      await AsyncStorage.setItem('specialDates', JSON.stringify(updatedDates));
    } catch (error) {
      console.error('Özel gün eklenirken hata:', error);
    }
  };

  const deleteSpecialDate = async (dateId) => {
    try {
      const dateToDelete = specialDates.find(d => d.id === dateId);
      if (dateToDelete && dateToDelete.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(dateToDelete.notificationId);
      }

      const updatedDates = specialDates.filter(date => date.id !== dateId);
      setSpecialDates(updatedDates);
      await AsyncStorage.setItem('specialDates', JSON.stringify(updatedDates));
    } catch (error) {
      console.error('Özel gün silinirken hata:', error);
    }
  };

  const addDailyMood = async (mood) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const newMood = {
        id: Date.now().toString(),
        date: today,
        mood,
        timestamp: new Date().toISOString()
      };
      const filteredMoods = dailyMoods.filter(m => m.date !== today);
      const updatedMoods = [...filteredMoods, newMood];

      setDailyMoods(updatedMoods);
      await AsyncStorage.setItem('dailyMoods', JSON.stringify(updatedMoods));
    } catch (error) {
      console.error('Mod eklenirken hata:', error);
    }
  };

  const incrementMessageCount = async (amount = 1) => {
    try {
      const newCount = totalMessageCount + amount;
      setTotalMessageCount(newCount);
      await AsyncStorage.setItem('totalMessageCount', newCount.toString());
    } catch (error) {
      console.error('Mesaj sayısı güncellenirken hata:', error);
    }
  };

  const saveAdvice = async (messageText) => {
    try {
      // Check for duplicates
      if (savedAdvice.some(advice => advice.text === messageText)) {
        return false; // Already saved
      }

      const newAdvice = {
        id: Date.now().toString(),
        text: messageText,
        date: new Date().toISOString()
      };

      const updatedAdvice = [newAdvice, ...savedAdvice];
      setSavedAdvice(updatedAdvice);
      await AsyncStorage.setItem('savedAdvice', JSON.stringify(updatedAdvice));
      return true;
    } catch (error) {
      console.error('Tavsiye kaydedilirken hata:', error);
      return false;
    }
  };

  const removeAdvice = async (id) => {
    try {
      const updatedAdvice = savedAdvice.filter(item => item.id !== id);
      setSavedAdvice(updatedAdvice);
      await AsyncStorage.setItem('savedAdvice', JSON.stringify(updatedAdvice));
    } catch (error) {
      console.error('Tavsiye silinirken hata:', error);
    }
  };

  const logout = async () => {
    try {
      // Clear all AsyncStorage data
      await AsyncStorage.clear();

      // Reset all state variables
      setRelationships([]);
      setUserName('');
      setUserAge('');
      setUserGender('');
      setRelationshipStatus('');
      setCoachingGoal('');
      setRelationshipType('');
      setRelationshipPartnerName('');
      setRelationshipYears(0);
      setRelationshipMonths(0);
      setMainChallenge('');
      setPartnerAge('');
      setPartnerGender('');
      setPartnerNotes('');
      setSpecialDates([]);
      setSpecialDates([]);
      setDailyMoods([]);
      setSavedAdvice([]);
      setTotalMessageCount(0);
      setIsAddingNew(false);
      setIsEditingProfile(false);
      setEditingRelationshipId(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const changeLanguage = async (lang) => {
    try {
      await i18n.changeLanguage(lang);
      await saveLanguagePreference(lang);
      setCurrentLanguage(lang);
    } catch (error) {
      console.error('Dil değiştirme hatası:', error);
    }
  };

  return (
    <AppContext.Provider value={{
      isLoading,
      userName, setUserName,
      relationships, setRelationships,
      relationshipType, setRelationshipType,
      relationshipPartnerName, setRelationshipPartnerName,
      relationshipYears, setRelationshipYears,
      relationshipMonths, setRelationshipMonths,
      mainChallenge, setMainChallenge,
      isAddingNew, setIsAddingNew,
      isEditingProfile, setIsEditingProfile,
      editingRelationshipId, setEditingRelationshipId,
      specialDates, setSpecialDates,
      dailyMoods, setDailyMoods,
      totalMessageCount,
      userAge, setUserAge,
      userGender, setUserGender,
      relationshipStatus, setRelationshipStatus,
      coachingGoal, setCoachingGoal,
      registrationDate,
      partnerAge, setPartnerAge,
      partnerGender, setPartnerGender,
      partnerNotes, setPartnerNotes,
      saveUserData,
      addNewRelationship,
      updateRelationship,
      deleteRelationship,
      addSpecialDate,
      deleteSpecialDate,
      addDailyMood,
      addDailyMood,
      incrementMessageCount,
      savedAdvice,
      saveAdvice,
      removeAdvice,
      logout,
      currentLanguage,
      changeLanguage
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
