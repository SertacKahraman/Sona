import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

export default function WelcomeScreen({ navigation }) {
  const { t } = useTranslation('onboarding');

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#66D9A1', '#4CAF50']}
        style={[styles.headerGradient, { flex: 1, justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }]}
      >
        <View style={styles.mascotContainer}>
          <Image
            source={require('../../../assets/selam.png')}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>

        <Text style={[styles.welcomeTitle, { color: '#FFF' }]}>{t('welcome.title')}</Text>
        <Text style={[styles.welcomeSubtitle, { color: 'rgba(255, 255, 255, 0.9)' }]}>{t('welcome.subtitle')}</Text>

        <View style={[styles.descriptionBox, { backgroundColor: 'rgba(255, 255, 255, 0.15)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)', shadowOpacity: 0 }]}>
          <Text style={[styles.welcomeText, { color: '#FFF' }]}>
            {t('welcome.description')}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.nextButton, { marginTop: 40, width: '100%', backgroundColor: '#FFF' }]}
          onPress={() => navigation.navigate('Name')}
        >
          <View style={styles.gradientButton}>
            <Text style={[styles.nextButtonText, { color: '#4CAF50' }]}>{t('common:buttons.continue')} ✨</Text>
          </View>
        </TouchableOpacity>
      </LinearGradient>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  animatedContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  mascotContainer: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  mascotImage: {
    width: '100%',
    height: '100%',
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#66D9A1',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 20,
    color: '#8B4A63',
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: '600',
  },
  descriptionBox: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 10,
    shadowColor: '#66D9A1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 17,
    color: '#5A3A47',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 12,
  },
  nextButton: {
    borderRadius: 30,
    shadowColor: '#66D9A1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  gradientButton: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 19,
    fontWeight: 'bold',
  },
});

