import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import LockScreen from '../screens/LockScreen';

// Main Screens
import HomeScreen from '../screens/main/HomeScreen';
import ChatScreen from '../screens/main/ChatScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import AllRelationshipsScreen from '../screens/main/AllRelationshipsScreen';
import SavedAdviceScreen from '../screens/main/SavedAdviceScreen';

// Onboarding Screens
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import LegalScreen from '../screens/onboarding/LegalScreen';
import NameScreen from '../screens/onboarding/NameScreen';
import RelationshipTypeScreen from '../screens/onboarding/RelationshipTypeScreen';
import RelationshipContextScreen from '../screens/onboarding/RelationshipContextScreen';
import PartnerInfoScreen from '../screens/onboarding/PartnerInfoScreen';
import PersonalInfoScreen from '../screens/onboarding/PersonalInfoScreen';
import DocumentViewerScreen from '../screens/onboarding/DocumentViewerScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const { t } = useTranslation('common');

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 10,
          backgroundColor: '#ffffff',
          borderRadius: 30,
          height: 70,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
          paddingBottom: 0,
          paddingTop: 0,
          borderTopWidth: 0,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 5,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') iconName = 'home';
          else if (route.name === 'ChatTab') iconName = 'message-circle';
          else if (route.name === 'ProfileTab') iconName = 'user';
          return <Feather name={iconName} size={24} color={focused ? '#66D9A1' : '#B0B0B0'} />;
        },
        tabBarActiveTintColor: '#66D9A1',
        tabBarInactiveTintColor: '#B0B0B0',
        tabBarLabelStyle: { fontSize: 10, fontWeight: 'bold' },
        tabBarLabel: ({ focused }) => {
          let label;
          if (route.name === 'HomeTab') label = t('navigation.home');
          else if (route.name === 'ChatTab') label = t('navigation.chat');
          else if (route.name === 'ProfileTab') label = t('navigation.profile');
          return <Text style={{ fontSize: 10, fontWeight: focused ? 'bold' : '500', color: focused ? '#66D9A1' : '#B0B0B0', marginTop: 4 }}>{label}</Text>;
        }
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} />
      <Tab.Screen name="ChatTab" component={ChatScreen} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Helper function to determine onboarding completion status
function getOnboardingStatus(userData) {
  const { relationships, userName, userAge, userGender, relationshipStatus, coachingGoal } = userData;

  // Check if user has completed full onboarding
  const hasRelationships = relationships && relationships.length > 0;
  const hasUserName = userName && userName.trim().length > 0;
  const hasPersonalInfo = userAge && userGender && relationshipStatus && coachingGoal;

  // Determine the appropriate screen
  if (hasRelationships && hasUserName && hasPersonalInfo) {
    return 'Main'; // Fully onboarded
  }

  if (hasUserName && hasPersonalInfo) {
    // User has personal info but no relationships - might have deleted all
    return 'Main'; // Let them access the app, they can add relationships later
  }

  if (hasUserName) {
    // User started onboarding but didn't finish
    return 'RelationshipType'; // Resume from relationship selection
  }

  // Brand new user
  return 'Legal';
}

export default function AppNavigator() {
  const {
    relationships,
    userName,
    userAge,
    userGender,
    relationshipStatus,
    coachingGoal,
    isLoading
  } = useApp();
  const [isLocked, setIsLocked] = useState(true);
  const [isCheckingLock, setIsCheckingLock] = useState(true);

  useEffect(() => {
    checkLockStatus();
  }, []);

  const checkLockStatus = async () => {
    try {
      const lockEnabled = await AsyncStorage.getItem('privacyLockEnabled');
      if (lockEnabled === 'true') {
        setIsLocked(true);
      } else {
        setIsLocked(false);
      }
    } catch (e) {
      console.error('Error checking lock status:', e);
      setIsLocked(false);
    } finally {
      setIsCheckingLock(false);
    }
  };

  const handleUnlock = () => {
    setIsLocked(false);
  };

  // Show loading screen while checking lock or loading data
  if (isCheckingLock || isLoading) {
    return null; // or a loading screen
  }

  if (isLocked) {
    return <LockScreen onUnlock={handleUnlock} />;
  }

  // Determine initial route based on onboarding status
  const initialRouteName = getOnboardingStatus({
    relationships,
    userName,
    userAge,
    userGender,
    relationshipStatus,
    coachingGoal
  });

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          // Prevent going back to onboarding screens once in Main
          gestureEnabled: true
        }}
      >
        {/* Onboarding Flow */}
        <Stack.Screen
          name="Legal"
          component={LegalScreen}
          options={{ gestureEnabled: false }} // Can't swipe back from legal screen
        />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Name" component={NameScreen} />
        <Stack.Screen name="RelationshipType" component={RelationshipTypeScreen} />
        <Stack.Screen name="RelationshipContext" component={RelationshipContextScreen} />
        <Stack.Screen name="PartnerInfo" component={PartnerInfoScreen} />
        <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
        <Stack.Screen name="DocumentViewer" component={DocumentViewerScreen} />

        {/* Main App Screens */}
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{
            gestureEnabled: false, // Can't swipe back to onboarding from main app
            headerShown: false
          }}
        />
        <Stack.Screen name="AllRelationships" component={AllRelationshipsScreen} />
        <Stack.Screen name="SavedAdvice" component={SavedAdviceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
