import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, Animated, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import './src/locales'; // i18n yapılandırmasını yükle

// Expo Go'da beklenen uyarıları bastır (production build'de görünmezler)
LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications',
  'expo-notifications',
  '`expo-notifications` functionality is not fully supported',
  'SafeAreaView has been deprecated',
  'We recommend you instead use a development build',
]);

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loadingImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#66D9A1',
    fontWeight: '600',
  },
});
