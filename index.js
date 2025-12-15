import { registerRootComponent } from 'expo';
import { LogBox } from 'react-native';

// Expo Go'da beklenen uyarıları bastır (en erken noktada)
LogBox.ignoreLogs([
    'expo-notifications: Android Push notifications',
    'expo-notifications',
    '`expo-notifications` functionality is not fully supported',
    'We recommend you instead use a development build',
    'SafeAreaView has been deprecated',
]);

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
