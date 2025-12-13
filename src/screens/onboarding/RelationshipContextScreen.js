import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';

export default function RelationshipContextScreen({ navigation }) {
  const { t } = useTranslation('onboarding');
  const {
    relationshipYears,
    setRelationshipYears,
    relationshipMonths,
    setRelationshipMonths,
    mainChallenge,
    setMainChallenge,
    editingRelationshipId,
    isAddingNew
  } = useApp();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#66D9A1', '#4CAF50']}
        style={styles.headerGradient}
      >
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            style={styles.backButtonWhite}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIconWhite}>‹</Text>
          </TouchableOpacity>
          <View style={styles.whiteBadge}>
            <Text style={styles.whiteBadgeText}>
              {editingRelationshipId ? `${t('steps.editing2')} ${t('steps.editing')}` : (isAddingNew ? `${t('steps.editing2')} ${t('steps.secondStep')}` : `${t('steps.step3')} ${t('steps.thirdStep')}`)}
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.headerTitle}>{t('relationshipContext.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('relationshipContext.subtitle')}</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          extraScrollHeight={100}
        >
          <View style={styles.mascotSectionSmall}>
            <Image
              source={require('../../../assets/tarih.png')}
              style={styles.mascotImageSmall}
              resizeMode="contain"
            />
          </View>

          <View style={styles.durationSection}>
            <Text style={styles.sectionLabel}>{t('relationshipContext.durationLabel')}</Text>
            <View style={styles.wheelsRow}>
              <View style={styles.wheelBox}>
                <Text style={styles.wheelTitle}>{t('partnerInfo.duration.years')}</Text>
                <View style={styles.wheelCircle}>
                  <View style={styles.wheelTicksContainer}>
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
                      <View
                        key={angle}
                        style={{
                          position: 'absolute',
                          width: 110,
                          height: 110,
                          transform: [{ rotate: `${angle}deg` }],
                        }}
                      >
                        <View style={styles.wheelTickLine} />
                      </View>
                    ))}
                  </View>
                  <View style={{
                    position: 'absolute',
                    width: 110,
                    height: 110,
                    transform: [{ rotate: `${relationshipYears * 30}deg` }],
                  }}>
                    <View style={styles.wheelTopDot} />
                  </View>
                  <Text style={styles.wheelNumber}>{relationshipYears} {t('partnerInfo.duration.yearsShort')}</Text>
                </View>
                <View style={styles.wheelControls}>
                  <TouchableOpacity onPress={() => setRelationshipYears(Math.max(0, relationshipYears - 1))}>
                    <Text style={styles.controlButton}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setRelationshipYears(Math.min(48, relationshipYears + 1))}>
                    <Text style={styles.controlButton}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.wheelBox}>
                <Text style={styles.wheelTitle}>{t('partnerInfo.duration.months')}</Text>
                <View style={styles.wheelCircle}>
                  <View style={styles.wheelTicksContainer}>
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
                      <View
                        key={angle}
                        style={{
                          position: 'absolute',
                          width: 110,
                          height: 110,
                          transform: [{ rotate: `${angle}deg` }],
                        }}
                      >
                        <View style={styles.wheelTickLine} />
                      </View>
                    ))}
                  </View>
                  <View style={{
                    position: 'absolute',
                    width: 110,
                    height: 110,
                    transform: [{ rotate: `${relationshipMonths * 30}deg` }],
                  }}>
                    <View style={styles.wheelTopDot} />
                  </View>
                  <Text style={styles.wheelNumber}>{relationshipMonths} {t('partnerInfo.duration.monthsShort')}</Text>
                </View>
                <View style={styles.wheelControls}>
                  <TouchableOpacity onPress={() => setRelationshipMonths(Math.max(0, relationshipMonths - 1))}>
                    <Text style={styles.controlButton}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setRelationshipMonths(Math.min(11, relationshipMonths + 1))}>
                    <Text style={styles.controlButton}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.challengeSection}>
            <Text style={styles.sectionLabel}>{t('relationshipContext.challengeLabel')}</Text>
            <TextInput
              style={styles.challengeInput}
              value={mainChallenge}
              onChangeText={setMainChallenge}
              placeholder={t('relationshipContext.placeholder')}
              placeholderTextColor="#999"
              multiline
              returnKeyType="done"
              blurOnSubmit={true}
              maxLength={150}
            />
            <View style={styles.privacyNote}>
              <Text style={styles.lockIcon}>🔒</Text>
              <Text style={styles.privacyText}>{t('relationshipContext.encrypted')}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.continueButton, !mainChallenge.trim() && styles.continueButtonDisabled]}
            activeOpacity={0.8}
            onPress={() => {
              if (mainChallenge.trim()) {
                navigation.navigate('PartnerInfo');
              }
            }}
            disabled={!mainChallenge.trim()}
          >
            {mainChallenge.trim() ? (
              <LinearGradient
                colors={['#66D9A1', '#4CAF50']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              >
                <Text style={styles.continueButtonText}>{t('common:buttons.continue')}</Text>
              </LinearGradient>
            ) : (
              <Text style={styles.continueButtonText}>{t('common:buttons.continue')}</Text>
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
  mascotSectionSmall: {
    alignItems: 'center',
    marginBottom: 0,
    position: 'relative',
  },
  mascotImageSmall: {
    width: 180,
    height: 130,
  },
  durationSection: {
    marginBottom: 30,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  wheelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 15,
  },
  wheelBox: {
    alignItems: 'center',
  },
  wheelTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    fontWeight: '600',
  },
  wheelCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#66D9A1',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 10,
  },
  wheelTopDot: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -5,
    marginTop: -5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#66D9A1',
  },
  wheelTicksContainer: {
    position: 'absolute',
    width: 110,
    height: 110,
  },
  wheelTickLine: {
    position: 'absolute',
    top: 8,
    left: '50%',
    marginLeft: -1,
    width: 2,
    height: 12,
    backgroundColor: '#D0D0D0',
  },
  wheelNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  wheelControls: {
    flexDirection: 'row',
    gap: 20,
  },
  controlButton: {
    fontSize: 24,
    color: '#66D9A1',
    fontWeight: 'bold',
    paddingHorizontal: 15,
  },
  challengeSection: {
    marginBottom: 20,
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
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  lockIcon: {
    fontSize: 12,
  },
  privacyText: {
    fontSize: 12,
    color: '#999',
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

