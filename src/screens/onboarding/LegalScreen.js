import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Platform, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

const TABLET_BREAKPOINT = 768;

// Custom Checkbox Component
const CustomCheckbox = ({ value, onValueChange, isTablet }) => {
  return (
    <TouchableOpacity
      style={[styles.checkbox, value && styles.checkboxChecked, isTablet && { width: 32, height: 32 }]}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.7}
    >
      {value && <Feather name="check" size={isTablet ? 22 : 18} color="#FFF" />}
    </TouchableOpacity>
  );
};

export default function LegalScreen({ navigation, onAccept }) {
  const { t } = useTranslation('onboarding');
  const [accepted, setAccepted] = useState(false);
  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= TABLET_BREAKPOINT;

  // Dynamic sizes for tablet
  const headerTitleSize = isTablet ? 38 : 28;
  const headerSubtitleSize = isTablet ? 20 : 16;
  const sectionTitleSize = isTablet ? 22 : 18;
  const documentTitleSize = isTablet ? 20 : 16;
  const buttonTextSize = isTablet ? 20 : 17;
  const contentMaxWidth = isTablet ? Math.min(screenWidth * 0.7, 700) : '100%';

  const handleAccept = () => {
    if (accepted) {
      if (onAccept) onAccept();
      navigation.navigate('Welcome');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#66D9A1', '#4CAF50']}
        style={[styles.headerGradient, isTablet && { paddingBottom: 40 }]}
      >
        <View style={styles.headerContent}>
          <View style={[styles.iconContainer, isTablet && { width: 100, height: 100, borderRadius: 50 }]}>
            <Feather name="shield" size={isTablet ? 50 : 40} color="#FFF" />
          </View>
          <Text style={[styles.headerTitle, { fontSize: headerTitleSize }]}>{t('legal.title')}</Text>
          <Text style={[styles.headerSubtitle, { fontSize: headerSubtitleSize }]}>{t('legal.subtitle')}</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, isTablet && { alignItems: 'center', flexGrow: 1, justifyContent: 'center' }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Mascot Section */}
        <View style={[styles.mascotSection, isTablet && { maxWidth: contentMaxWidth, width: '100%' }]}>
          <Image
            source={require('../../../assets/merakli.png')}
            style={[styles.mascotImage, isTablet && { width: 180, height: 180 }]}
            resizeMode="contain"
          />
        </View>

        {/* Welcome Message */}
        <View style={[styles.welcomeCard, isTablet && { maxWidth: contentMaxWidth, width: '100%', padding: 24 }]}>
          <Text style={[styles.welcomeTitle, isTablet && { fontSize: 22 }]}>{t('legal.welcome')}</Text>
          <Text style={[styles.welcomeText, isTablet && { fontSize: 16, lineHeight: 24 }]}>
            {t('legal.welcomeMessage')}
          </Text>
        </View>

        {/* Document Cards */}
        <View style={[styles.documentsSection, isTablet && { maxWidth: contentMaxWidth, width: '100%' }]}>
          <Text style={[styles.sectionTitle, { fontSize: sectionTitleSize }]}>{t('legal.documents')}</Text>

          {/* Terms of Service Card */}
          <TouchableOpacity
            style={styles.documentCard}
            onPress={() => navigation.navigate('DocumentViewer', { documentType: 'terms' })}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FFF', '#F8F9FA']}
              style={[styles.documentGradient, isTablet && { padding: 20 }]}
            >
              <View style={[styles.documentIconBox, isTablet && { width: 60, height: 60, borderRadius: 30 }]}>
                <Feather name="file-text" size={isTablet ? 28 : 24} color="#4CAF50" />
              </View>
              <View style={styles.documentContent}>
                <Text style={[styles.documentTitle, { fontSize: documentTitleSize }]}>{t('legal.termsTitle')}</Text>
                <Text style={[styles.documentSubtitle, isTablet && { fontSize: 15 }]}>{t('legal.termsSubtitle')}</Text>
              </View>
              <View style={styles.documentArrow}>
                <Feather name="chevron-right" size={isTablet ? 24 : 20} color="#66D9A1" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Privacy Policy Card */}
          <TouchableOpacity
            style={styles.documentCard}
            onPress={() => navigation.navigate('DocumentViewer', { documentType: 'privacy' })}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FFF', '#F8F9FA']}
              style={[styles.documentGradient, isTablet && { padding: 20 }]}
            >
              <View style={[styles.documentIconBox, isTablet && { width: 60, height: 60, borderRadius: 30 }]}>
                <Feather name="lock" size={isTablet ? 28 : 24} color="#4CAF50" />
              </View>
              <View style={styles.documentContent}>
                <Text style={[styles.documentTitle, { fontSize: documentTitleSize }]}>{t('legal.privacyTitle')}</Text>
                <Text style={[styles.documentSubtitle, isTablet && { fontSize: 15 }]}>{t('legal.privacySubtitle')}</Text>
              </View>
              <View style={styles.documentArrow}>
                <Feather name="chevron-right" size={isTablet ? 24 : 20} color="#66D9A1" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Security Features */}
        <View style={[styles.featuresSection, isTablet && { maxWidth: contentMaxWidth, width: '100%', padding: 24 }]}>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, isTablet && { width: 40, height: 40, borderRadius: 20 }]}>
              <Feather name="lock" size={isTablet ? 20 : 16} color="#4CAF50" />
            </View>
            <Text style={[styles.featureText, isTablet && { fontSize: 16 }]}>{t('legal.features.encrypted')}</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, isTablet && { width: 40, height: 40, borderRadius: 20 }]}>
              <Feather name="shield" size={isTablet ? 20 : 16} color="#4CAF50" />
            </View>
            <Text style={[styles.featureText, isTablet && { fontSize: 16 }]}>{t('legal.features.notShared')}</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, isTablet && { width: 40, height: 40, borderRadius: 20 }]}>
              <Feather name="eye-off" size={isTablet ? 20 : 16} color="#4CAF50" />
            </View>
            <Text style={[styles.featureText, isTablet && { fontSize: 16 }]}>{t('legal.features.protected')}</Text>
          </View>
        </View>

        {/* Acceptance Section */}
        <View style={[styles.acceptanceSection, isTablet && { maxWidth: contentMaxWidth, width: '100%', padding: 24 }]}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAccepted(!accepted)}
            activeOpacity={0.7}
          >
            <CustomCheckbox value={accepted} onValueChange={setAccepted} isTablet={isTablet} />
            <Text style={[styles.checkboxLabel, isTablet && { fontSize: 16, lineHeight: 24 }]}>
              {t('legal.accept')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.continueButton, !accepted && styles.continueButtonDisabled, isTablet && { maxWidth: 400, width: '100%' }]}
          onPress={handleAccept}
          disabled={!accepted}
          activeOpacity={0.8}
        >
          {accepted ? (
            <LinearGradient
              colors={['#66D9A1', '#4CAF50']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.gradientButton, isTablet && { paddingVertical: 22 }]}
            >
              <Text style={[styles.continueButtonText, { fontSize: buttonTextSize }]}>{t('common:buttons.continue')}</Text>
              <Feather name="arrow-right" size={isTablet ? 24 : 20} color="#FFF" />
            </LinearGradient>
          ) : (
            <View style={[styles.disabledButton, isTablet && { paddingVertical: 22 }]}>
              <Text style={[styles.continueButtonTextDisabled, { fontSize: buttonTextSize }]}>{t('common:buttons.continue')}</Text>
              <Feather name="arrow-right" size={isTablet ? 24 : 20} color="#999" />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
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
  headerContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  mascotSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mascotImage: {
    width: 150,
    height: 150,
  },
  welcomeCard: {
    backgroundColor: '#E0F7EE',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#66D9A1',
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 15,
    color: '#5A3A47',
    lineHeight: 22,
  },
  documentsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
    marginLeft: 4,
  },
  documentCard: {
    marginBottom: 12,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  documentGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  documentIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0F7EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  documentContent: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  documentSubtitle: {
    fontSize: 13,
    color: '#999',
  },
  documentArrow: {
    marginLeft: 8,
  },
  featuresSection: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0F7EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#5A3A47',
    flex: 1,
  },
  acceptanceSection: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#E8F5E9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
  },
  continueButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#66D9A1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButtonDisabled: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 8,
  },
  disabledButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    backgroundColor: '#E0E0E0',
    gap: 8,
  },
  continueButtonText: {
    fontSize: 17,
    color: '#FFF',
    fontWeight: 'bold',
  },
  continueButtonTextDisabled: {
    fontSize: 17,
    color: '#999',
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 20,
  },
});
