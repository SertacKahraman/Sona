import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';

export default function NameScreen({ navigation }) {
  const { t } = useTranslation('onboarding');
  const { userName, setUserName, isEditingProfile } = useApp();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#66D9A1', '#4CAF50']}
        style={styles.headerGradient}
      >
        <View style={styles.headerTopRow}>
          <View style={{ width: 40 }} />
          <View style={styles.whiteBadge}>
            <Text style={styles.whiteBadgeText}>{t('steps.step1')} {t('steps.firstStep')}</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.headerTitle}>{t('name.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('name.subtitle')}</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 30, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.mascotWithHearts}>
              <Image
                source={require('../../../assets/merakli.png')}
                style={styles.mascotImageLarge}
                resizeMode="contain"
              />
            </View>

            <TextInput
              style={styles.nameInputBox}
              value={userName}
              onChangeText={setUserName}
              placeholder={t('name.placeholder')}
              placeholderTextColor="rgba(150, 150, 150, 0.5)"
              returnKeyType="done"
              blurOnSubmit={true}
              maxLength={15}
            />

            <View style={styles.welcomeMessageBox}>
              <Text style={styles.welcomeMessageText}>
                {t('name.helper')}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.startButton, !userName.trim() && styles.startButtonDisabled]}
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
                  style={styles.gradientButton}
                >
                  <Text style={styles.startButtonText}>{t('common:buttons.continue')}</Text>
                </LinearGradient>
              ) : (
                <Text style={styles.startButtonText}>{t('common:buttons.continue')}</Text>
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
    borderColor: '#E8F5E9',
    marginBottom: 20,
    textAlign: 'center',
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

