import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';

const TABLET_BREAKPOINT = 768;

export default function PersonalInfoScreen({ navigation }) {
  const { t } = useTranslation('onboarding');
  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= TABLET_BREAKPOINT;

  // Dynamic sizes for tablet
  const headerTitleSize = isTablet ? 38 : 28;
  const headerSubtitleSize = isTablet ? 20 : 16;
  const questionLabelSize = isTablet ? 20 : 16;
  const pillTextSize = isTablet ? 14 : 10;
  const buttonTextSize = isTablet ? 20 : 17;
  const contentMaxWidth = isTablet ? Math.min(screenWidth * 0.7, 700) : '100%';

  const {
    userAge,
    setUserAge,
    userGender,
    setUserGender,
    relationshipStatus,
    setRelationshipStatus,
    coachingGoal,
    setCoachingGoal,
    isEditingProfile,
    saveUserData,
    setIsEditingProfile
  } = useApp();

  const ageOptions = [
    { id: '18-24', label: '18-24' },
    { id: '25-34', label: '25-34' },
    { id: '35-44', label: '35-44' },
    { id: '45-54', label: '45-54' },
    { id: '55+', label: '55+' }
  ];

  const genderOptions = [
    { id: 'female', label: t('personalInfo.gender.female') },
    { id: 'male', label: t('personalInfo.gender.male') },
    { id: 'other', label: t('personalInfo.gender.other'), isLong: true }
  ];

  const statusOptions = [
    { id: 'single', label: t('personalInfo.status.single') },
    { id: 'dating', label: t('personalInfo.status.dating') },
    { id: 'relationship', label: t('personalInfo.status.relationship') },
    { id: 'married', label: t('personalInfo.status.married') },
    { id: 'complicated', label: t('personalInfo.status.complicated') }
  ];

  const goalOptions = [
    { id: 'improve', label: t('personalInfo.goal.improve') },
    { id: 'solve', label: t('personalInfo.goal.solve') },
    { id: 'understand', label: t('personalInfo.goal.understand') },
    { id: 'find', label: t('personalInfo.goal.find') }
  ];

  const isFormComplete = userAge && userGender && relationshipStatus && coachingGoal;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#66D9A1', '#4CAF50']}
        style={[styles.headerGradient, isTablet && { paddingBottom: 40 }]}
      >
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={[styles.backButtonWhite, isTablet && { width: 48, height: 48, borderRadius: 24 }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backIconWhite, isTablet && { fontSize: 28 }]}>‹</Text>
          </TouchableOpacity>
          <View style={[styles.whiteBadge, isTablet && { paddingVertical: 8, paddingHorizontal: 20 }]}>
            <Text style={[styles.whiteBadgeText, isTablet && { fontSize: 14 }]}>{t('steps.step5')} {t('steps.lastStep')}</Text>
          </View>
          <View style={{ width: isTablet ? 48 : 40 }} />
        </View>
        <Text style={[styles.headerTitle, { fontSize: headerTitleSize }]}>{t('personalInfo.title')}</Text>
        <Text style={[styles.headerSubtitle, { fontSize: headerSubtitleSize }]}>{t('personalInfo.subtitle')}</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[{ padding: 28, paddingBottom: 40 }, isTablet && { alignItems: 'center', flexGrow: 1, justifyContent: 'center' }]}
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          extraScrollHeight={100}
          keyboardShouldPersistTaps="handled"
        >
          {/* Yaş Grubu */}
          <View style={[styles.questionContainer, isTablet && { maxWidth: contentMaxWidth, width: '100%', padding: 28 }]}>
            <Text style={[styles.questionLabel, { fontSize: questionLabelSize }]}>{t('personalInfo.age.label')}</Text>
            <View style={styles.pillOptionsRow}>
              {ageOptions.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.pillOption,
                    isTablet && { paddingVertical: 14 },
                    userAge === option.id && styles.pillOptionSelected
                  ]}
                  onPress={() => setUserAge(option.id)}
                >
                  <Text style={[
                    styles.pillOptionText,
                    { fontSize: pillTextSize },
                    userAge === option.id && styles.pillOptionTextSelected
                  ]}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Cinsiyet */}
          <View style={[styles.questionContainer, isTablet && { maxWidth: contentMaxWidth, width: '100%', padding: 28 }]}>
            <Text style={[styles.questionLabel, { fontSize: questionLabelSize }]}>{t('personalInfo.gender.label')}</Text>
            <View style={styles.pillOptionsRow}>
              {genderOptions.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.pillOption,
                    option.isLong && styles.pillOptionLong,
                    isTablet && { paddingVertical: 14 },
                    userGender === option.id && styles.pillOptionSelected
                  ]}
                  onPress={() => setUserGender(option.id)}
                >
                  <Text style={[
                    styles.pillOptionText,
                    { fontSize: pillTextSize },
                    userGender === option.id && styles.pillOptionTextSelected
                  ]}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* İlişki Durumu */}
          <View style={[styles.questionContainer, isTablet && { maxWidth: contentMaxWidth, width: '100%', padding: 28 }]}>
            <Text style={[styles.questionLabel, { fontSize: questionLabelSize }]}>{t('personalInfo.status.label')}</Text>
            <View style={styles.pillOptionsWrap}>
              {statusOptions.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.pillOption,
                    styles.pillOptionHalf,
                    isTablet && { paddingVertical: 14, minWidth: 120 },
                    relationshipStatus === option.id && styles.pillOptionSelected
                  ]}
                  onPress={() => setRelationshipStatus(option.id)}
                >
                  <Text style={[
                    styles.pillOptionText,
                    { fontSize: pillTextSize },
                    relationshipStatus === option.id && styles.pillOptionTextSelected
                  ]}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Koçluk Hedefi */}
          <View style={[styles.questionContainer, isTablet && { maxWidth: contentMaxWidth, width: '100%', padding: 28 }]}>
            <Text style={[styles.questionLabel, { fontSize: questionLabelSize }]}>{t('personalInfo.goal.label')}</Text>
            <View style={styles.pillOptionsWrap}>
              {goalOptions.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.pillOption,
                    styles.pillOptionHalf,
                    isTablet && { paddingVertical: 14, minWidth: 120 },
                    coachingGoal === option.id && styles.pillOptionSelected
                  ]}
                  onPress={() => setCoachingGoal(option.id)}
                >
                  <Text style={[
                    styles.pillOptionText,
                    { fontSize: pillTextSize },
                    coachingGoal === option.id && styles.pillOptionTextSelected
                  ]}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.continueButton,
              !isFormComplete && styles.continueButtonDisabled,
              isTablet && { maxWidth: 500, width: '100%' }
            ]}
            onPress={async () => {
              if (isFormComplete) {
                try {
                  await saveUserData(); // Verileri kaydet
                  if (isEditingProfile) {
                    setIsEditingProfile(false);
                    navigation.navigate('Main');
                  } else {
                    navigation.navigate('Main');
                  }
                } catch (error) {
                  alert(error.message);
                }
              }
            }}
            disabled={!isFormComplete}
          >
            {isFormComplete ? (
              <LinearGradient
                colors={['#66D9A1', '#4CAF50']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.gradientButton, isTablet && { paddingVertical: 24 }]}
              >
                <Text style={[styles.continueButtonText, { fontSize: buttonTextSize }]}>{isEditingProfile ? t('common:buttons.save') : t('common:buttons.continue')}</Text>
              </LinearGradient>
            ) : (
              <Text style={[styles.continueButtonText, { fontSize: buttonTextSize }]}>{isEditingProfile ? t('common:buttons.save') : t('common:buttons.continue')}</Text>
            )}
          </TouchableOpacity>
        </KeyboardAwareScrollView>
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
    paddingBottom: 30,
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
  backButtonWhite: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIconWhite: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
    marginTop: -2,
  },
  questionContainer: {
    backgroundColor: '#F0F9F0',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#E8F5E9',
  },
  questionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 14,
  },
  pillOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 4,
  },
  pillOptionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pillOptionHalf: {
    flex: 0,
    width: '48.5%',
    minWidth: 0,
  },
  pillOption: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  pillOptionLong: {
    flex: 2,
  },
  pillOptionSelected: {
    backgroundColor: '#66D9A1',
    borderColor: '#66D9A1',
    shadowColor: '#66D9A1',
    shadowOpacity: 0.2,
    elevation: 2,
  },
  pillOptionText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },
  pillOptionTextSelected: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  continueButton: {
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#66D9A1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  continueButtonDisabled: {
    backgroundColor: '#D0D0D0',
    shadowOpacity: 0.1,
    paddingVertical: 18,
  },
  continueButtonText: {
    fontSize: 17,
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

