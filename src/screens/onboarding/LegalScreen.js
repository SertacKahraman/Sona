import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

// Custom Checkbox Component
const CustomCheckbox = ({ value, onValueChange }) => {
  return (
    <TouchableOpacity
      style={[styles.checkbox, value && styles.checkboxChecked]}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.7}
    >
      {value && <Feather name="check" size={18} color="#FFF" />}
    </TouchableOpacity>
  );
};

export default function LegalScreen({ navigation, onAccept }) {
  const { t } = useTranslation('onboarding');
  const [accepted, setAccepted] = useState(false);

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
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <Feather name="shield" size={40} color="#FFF" />
          </View>
          <Text style={styles.headerTitle}>{t('legal.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('legal.subtitle')}</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mascot Section */}
        <View style={styles.mascotSection}>
          <Image
            source={require('../../../assets/merakli.png')}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>

        {/* Welcome Message */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>{t('legal.welcome')}</Text>
          <Text style={styles.welcomeText}>
            {t('legal.welcomeMessage')}
          </Text>
        </View>

        {/* Document Cards */}
        <View style={styles.documentsSection}>
          <Text style={styles.sectionTitle}>{t('legal.documents')}</Text>

          {/* Terms of Service Card */}
          <TouchableOpacity
            style={styles.documentCard}
            onPress={() => navigation.navigate('DocumentViewer', { documentType: 'terms' })}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#FFF', '#F8F9FA']}
              style={styles.documentGradient}
            >
              <View style={styles.documentIconBox}>
                <Feather name="file-text" size={24} color="#4CAF50" />
              </View>
              <View style={styles.documentContent}>
                <Text style={styles.documentTitle}>{t('legal.termsTitle')}</Text>
                <Text style={styles.documentSubtitle}>{t('legal.termsSubtitle')}</Text>
              </View>
              <View style={styles.documentArrow}>
                <Feather name="chevron-right" size={20} color="#66D9A1" />
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
              style={styles.documentGradient}
            >
              <View style={styles.documentIconBox}>
                <Feather name="lock" size={24} color="#4CAF50" />
              </View>
              <View style={styles.documentContent}>
                <Text style={styles.documentTitle}>{t('legal.privacyTitle')}</Text>
                <Text style={styles.documentSubtitle}>{t('legal.privacySubtitle')}</Text>
              </View>
              <View style={styles.documentArrow}>
                <Feather name="chevron-right" size={20} color="#66D9A1" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Security Features */}
        <View style={styles.featuresSection}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Feather name="lock" size={16} color="#4CAF50" />
            </View>
            <Text style={styles.featureText}>{t('legal.features.encrypted')}</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Feather name="shield" size={16} color="#4CAF50" />
            </View>
            <Text style={styles.featureText}>{t('legal.features.notShared')}</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Feather name="eye-off" size={16} color="#4CAF50" />
            </View>
            <Text style={styles.featureText}>{t('legal.features.protected')}</Text>
          </View>
        </View>

        {/* Acceptance Section */}
        <View style={styles.acceptanceSection}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAccepted(!accepted)}
            activeOpacity={0.7}
          >
            <CustomCheckbox value={accepted} onValueChange={setAccepted} />
            <Text style={styles.checkboxLabel}>
              {t('legal.accept')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.continueButton, !accepted && styles.continueButtonDisabled]}
          onPress={handleAccept}
          disabled={!accepted}
          activeOpacity={0.8}
        >
          {accepted ? (
            <LinearGradient
              colors={['#66D9A1', '#4CAF50']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <Text style={styles.continueButtonText}>{t('common:buttons.continue')}</Text>
              <Feather name="arrow-right" size={20} color="#FFF" />
            </LinearGradient>
          ) : (
            <View style={styles.disabledButton}>
              <Text style={styles.continueButtonTextDisabled}>{t('common:buttons.continue')}</Text>
              <Feather name="arrow-right" size={20} color="#999" />
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
