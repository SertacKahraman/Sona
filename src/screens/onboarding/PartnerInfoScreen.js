import React, { useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Platform, useWindowDimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';

const TABLET_BREAKPOINT = 768;

export default function PartnerInfoScreen({ navigation }) {
  const { t } = useTranslation('onboarding');
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isTablet = screenWidth >= TABLET_BREAKPOINT;

  // iOS için responsive keyboard offset (ekran yüksekliğinin %2'si - minimal boşluk)
  const keyboardOffset = Platform.OS === 'ios' ? Math.round(screenHeight * 0.02) : 0;

  // Dynamic sizes for tablet
  const headerTitleSize = isTablet ? 38 : 28;
  const headerSubtitleSize = isTablet ? 20 : 16;
  const questionLabelSize = isTablet ? 20 : 16;
  const pillTextSize = isTablet ? 14 : 10;
  const inputFontSize = isTablet ? 20 : 16;
  const buttonTextSize = isTablet ? 20 : 17;
  const contentMaxWidth = isTablet ? Math.min(screenWidth * 0.7, 700) : '100%';

  const {
    relationshipPartnerName,
    setRelationshipPartnerName,
    partnerAge,
    setPartnerAge,
    partnerGender,
    setPartnerGender,
    partnerNotes,
    setPartnerNotes,
    editingRelationshipId,
    isAddingNew,
    relationshipType,
    relationshipYears,
    relationshipMonths,
    mainChallenge,
    updateRelationship,
    addNewRelationship
  } = useApp();

  const ageOptions = [
    { id: '18-24', label: '18-24' },
    { id: '25-34', label: '25-34' },
    { id: '35-44', label: '35-44' },
    { id: '45-54', label: '45-54' },
    { id: '55+', label: '55+' }
  ];

  const genderOptions = [
    { id: 'female', label: t('partnerInfo.gender.female') },
    { id: 'male', label: t('partnerInfo.gender.male') },
    { id: 'other', label: t('partnerInfo.gender.other'), isLong: true }
  ];

  const isFormComplete = relationshipPartnerName.trim() && partnerAge && partnerGender;

  const scrollViewRef = useRef(null);

  // Input'a tıklandığında sayfanın en altına (devam butonuna) kaydır
  const handleInputFocus = () => {
    if (scrollViewRef.current) {
      // Klavyenin açılmasını bekle, sonra en alta kaydır
      // Android'de daha fazla gecikme - klavye animasyonu tamamlansın
      const scrollDelay = Platform.OS === 'ios' ? 100 : 350;
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }, scrollDelay);
    }
  };

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
            <Text style={[styles.whiteBadgeText, isTablet && { fontSize: 14 }]}>
              {editingRelationshipId ? `${t('steps.editing3')} ${t('steps.lastStep')}` : (isAddingNew ? `${t('steps.editing3')} ${t('steps.lastStep')}` : `${t('steps.step4')} ${t('steps.fourthStep')}`)}
            </Text>
          </View>
          <View style={{ width: isTablet ? 48 : 40 }} />
        </View>
        <Text style={[styles.headerTitle, { fontSize: headerTitleSize }]}>{t('partnerInfo.title')}</Text>
        <Text style={[styles.headerSubtitle, { fontSize: headerSubtitleSize }]}>
          {t('partnerInfo.subtitle', {
            partnerType: relationshipType ? t(`relationshipType.${relationshipType}`) : ''
          })}
        </Text>
      </LinearGradient>

      <KeyboardAwareScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={[{ padding: 24, paddingBottom: 20 }, isTablet && { alignItems: 'center', flexGrow: 1, justifyContent: 'center' }]}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={keyboardOffset}
        extraHeight={keyboardOffset}
        enableAutomaticScroll={true}
        enableResetScrollToCoords={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* İsim */}
        <View style={[styles.questionContainer, isTablet && { maxWidth: contentMaxWidth, width: '100%', padding: 28 }]}>
          <Text style={[styles.questionLabel, { fontSize: questionLabelSize }]}>{t('partnerInfo.name.label')}</Text>
          <TextInput
            style={[styles.nameInputBox, { fontSize: inputFontSize }, isTablet && { padding: 20 }]}
            value={relationshipPartnerName}
            onChangeText={setRelationshipPartnerName}
            placeholder={t('partnerInfo.name.placeholder')}
            placeholderTextColor="rgba(150, 150, 150, 0.5)"
            maxLength={15}
            returnKeyType="done"
            blurOnSubmit={true}
          />
        </View>

        {/* Yaş Grubu */}
        <View style={[styles.questionContainer, isTablet && { maxWidth: contentMaxWidth, width: '100%', padding: 28 }]}>
          <Text style={[styles.questionLabel, { fontSize: questionLabelSize }]}>{t('partnerInfo.age.label')}</Text>
          <View style={styles.pillOptionsRow}>
            {ageOptions.map(option => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.pillOption,
                  isTablet && { paddingVertical: 12 },
                  partnerAge === option.id && styles.pillOptionSelected
                ]}
                onPress={() => setPartnerAge(option.id)}
              >
                <Text style={[
                  styles.pillOptionText,
                  { fontSize: pillTextSize },
                  partnerAge === option.id && styles.pillOptionTextSelected
                ]}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cinsiyet */}
        <View style={[styles.questionContainer, isTablet && { maxWidth: contentMaxWidth, width: '100%', padding: 28 }]}>
          <Text style={[styles.questionLabel, { fontSize: questionLabelSize }]}>{t('partnerInfo.gender.label')}</Text>
          <View style={styles.pillOptionsRow}>
            {genderOptions.map(option => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.pillOption,
                  option.isLong && styles.pillOptionLong,
                  isTablet && { paddingVertical: 12 },
                  partnerGender === option.id && styles.pillOptionSelected
                ]}
                onPress={() => setPartnerGender(option.id)}
              >
                <Text style={[
                  styles.pillOptionText,
                  { fontSize: pillTextSize },
                  partnerGender === option.id && styles.pillOptionTextSelected
                ]}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notlar */}
        <View style={[styles.questionContainer, isTablet && { maxWidth: contentMaxWidth, width: '100%', padding: 28 }]}>
          <Text style={[styles.questionLabel, { fontSize: questionLabelSize }]}>{t('partnerInfo.notes.label')}</Text>
          <TextInput
            style={[styles.challengeInput, { minHeight: isTablet ? 100 : 60, fontSize: isTablet ? 18 : 14 }]}
            value={partnerNotes}
            onChangeText={setPartnerNotes}
            placeholder={t('partnerInfo.notes.placeholder')}
            placeholderTextColor="#999"
            multiline
            returnKeyType="done"
            blurOnSubmit={true}
            onFocus={handleInputFocus}
          />
        </View>

        <TouchableOpacity
          style={[styles.continueButton, !isFormComplete && styles.continueButtonDisabled, isTablet && { maxWidth: 500, width: '100%' }]}
          onPress={async () => {
            if (isFormComplete) {
              try {
                if (editingRelationshipId) {
                  await updateRelationship(editingRelationshipId, {
                    type: relationshipType,
                    partnerName: relationshipPartnerName,
                    partnerAge: partnerAge,
                    partnerGender: partnerGender,
                    partnerNotes: partnerNotes,
                    years: relationshipYears,
                    months: relationshipMonths,
                    mainChallenge: mainChallenge
                  });
                  navigation.navigate('Main');
                } else if (isAddingNew) {
                  await addNewRelationship({
                    type: relationshipType,
                    partnerName: relationshipPartnerName,
                    years: relationshipYears,
                    months: relationshipMonths,
                    mainChallenge: mainChallenge,
                    partnerAge: partnerAge,
                    partnerGender: partnerGender,
                    partnerNotes: partnerNotes
                  });
                  navigation.navigate('Main');
                } else {
                  navigation.navigate('PersonalInfo');
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
              <Text style={[styles.continueButtonText, { fontSize: buttonTextSize }]}>{(isAddingNew || editingRelationshipId) ? t('common:buttons.save') : t('common:buttons.continue')}</Text>
            </LinearGradient>
          ) : (
            <Text style={[styles.continueButtonText, { fontSize: buttonTextSize }]}>{(isAddingNew || editingRelationshipId) ? t('common:buttons.save') : t('common:buttons.continue')}</Text>
          )}
        </TouchableOpacity>
      </KeyboardAwareScrollView>
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
  nameInputBox: {
    width: '100%',
    backgroundColor: '#F0F9F0',
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#E8F5E9',
    marginBottom: 20,
    textAlign: 'left',
  },
  pillOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 4,
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
  challengeInput: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    fontSize: 14,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 2,
    borderColor: '#E8F5E9',
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

