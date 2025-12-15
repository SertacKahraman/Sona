import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';

const TABLET_BREAKPOINT = 768;

export default function NameScreen({ navigation }) {
  const { t } = useTranslation('onboarding');
  const { userName, setUserName, isEditingProfile } = useApp();
  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= TABLET_BREAKPOINT;

  // Dynamic sizes for tablet
  const headerTitleSize = isTablet ? 38 : 28;
  const headerSubtitleSize = isTablet ? 20 : 16;
  const mascotSize = isTablet ? 380 : 250;
  const inputFontSize = isTablet ? 22 : 16;
  const buttonTextSize = isTablet ? 20 : 16;
  const helperTextSize = isTablet ? 18 : 14;
  const contentMaxWidth = isTablet ? Math.min(screenWidth * 0.7, 700) : '100%';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#66D9A1', '#4CAF50']}
        style={[styles.headerGradient, isTablet && { paddingBottom: 50 }]}
      >
        <View style={styles.headerTopRow}>
          <View style={{ width: 40 }} />
          <View style={[styles.whiteBadge, isTablet && { paddingVertical: 8, paddingHorizontal: 20 }]}>
            <Text style={[styles.whiteBadgeText, isTablet && { fontSize: 14 }]}>{t('steps.step1')} {t('steps.firstStep')}</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
        <Text style={[styles.headerTitle, { fontSize: headerTitleSize }]}>{t('name.title')}</Text>
        <Text style={[styles.headerSubtitle, { fontSize: headerSubtitleSize }]}>{t('name.subtitle')}</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={[{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 30, paddingBottom: 20 }, isTablet && { alignItems: 'center', justifyContent: 'center' }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.mascotWithHearts, isTablet && { width: 350, height: 350 }]}>
              <Image
                source={require('../../../assets/merakli.png')}
                style={[styles.mascotImageLarge, { width: mascotSize, height: mascotSize }]}
                resizeMode="contain"
              />
            </View>

            <TextInput
              style={[styles.nameInputBox, { fontSize: inputFontSize }, isTablet && { padding: 18, maxWidth: 500, width: '100%' }]}
              value={userName}
              onChangeText={setUserName}
              placeholder={t('name.placeholder')}
              placeholderTextColor="rgba(150, 150, 150, 0.5)"
              returnKeyType="done"
              blurOnSubmit={true}
              maxLength={15}
            />

            <View style={[styles.welcomeMessageBox, isTablet && { padding: 24, maxWidth: 500, width: '100%' }]}>
              <Text style={[styles.welcomeMessageText, { fontSize: helperTextSize, lineHeight: helperTextSize + 8 }]}>
                {t('name.helper')}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.startButton, !userName.trim() && styles.startButtonDisabled, isTablet && { maxWidth: 400, width: '100%' }]}
              onPress={() => {
                if (userName.trim()) {
                  if (isEditingProfile) {
                    navigation.navigate('PersonalInfo');
                  } else {
                    navigation.navigate('RelationshipType');
                  }
                }
              }}
              disabled={!userName.trim()}
            >
              {userName.trim() ? (
                <LinearGradient
                  colors={['#66D9A1', '#4CAF50']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.gradientButton, isTablet && { paddingVertical: 24 }]}
                >
                  <Text style={[styles.startButtonText, { fontSize: buttonTextSize }]}>{t('common:buttons.continue')}</Text>
                </LinearGradient>
              ) : (
                <Text style={[styles.startButtonText, { fontSize: buttonTextSize }]}>{t('common:buttons.continue')}</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 42,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 5,
  },
  whiteBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  whiteBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  mascotWithHearts: {
    position: 'relative',
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  mascotImageLarge: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginLeft: -30,
  },
  nameInputBox: {
    width: '100%',
    backgroundColor: '#F0F9F0',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#E8F5E8',
    marginBottom: 20,
    textAlign: 'left',
  },
  welcomeMessageBox: {
    backgroundColor: '#E0F7EE',
    borderRadius: 30,
    padding: 20,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#66D9A1',
  },
  welcomeMessageText: {
    fontSize: 14,
    color: '#5A3A47',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  startButton: {
    width: '100%',
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#66D9A1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  startButtonDisabled: {
    backgroundColor: '#D0D0D0',
    paddingVertical: 15,
  },
  startButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  gradientButton: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

