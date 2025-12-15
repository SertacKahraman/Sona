import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../../context/AppContext';
import { RELATIONSHIP_TYPES } from '../../constants/relationships';
import { useTranslation } from 'react-i18next';

const TABLET_BREAKPOINT = 768;

export default function RelationshipTypeScreen({ navigation }) {
  const { t } = useTranslation('onboarding');
  const { width: screenWidth } = useWindowDimensions();
  const isTablet = screenWidth >= TABLET_BREAKPOINT;

  // Dynamic sizes for tablet
  const headerTitleSize = isTablet ? 38 : 28;
  const headerSubtitleSize = isTablet ? 20 : 16;
  const cardTitleSize = isTablet ? 22 : 17;
  const emojiSize = isTablet ? 36 : 26;
  const buttonTextSize = isTablet ? 20 : 17;
  const contentMaxWidth = isTablet ? Math.min(screenWidth * 0.7, 700) : '100%';

  const {
    relationshipType,
    setRelationshipType,
    editingRelationshipId,
    setEditingRelationshipId,
    isAddingNew
  } = useApp();

  const relationshipOptions = Object.values(RELATIONSHIP_TYPES).filter(type => type.id !== 'diger');

  const getRelationshipLabel = (typeId) => {
    const labels = {
      'romantic': t('relationshipType.romantic'),
      'family': t('relationshipType.family'),
      'parent_child': t('relationshipType.parent_child'),
      'friend': t('relationshipType.friend'),
      'professional': t('relationshipType.professional')
    };
    return labels[typeId] || typeId;
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
            onPress={() => {
              if (editingRelationshipId) {
                setEditingRelationshipId(null);
                navigation.navigate('Main');
              } else {
                if (isAddingNew) {
                  navigation.navigate('Main');
                } else {
                  navigation.navigate('Name');
                }
              }
            }}
          >
            <Text style={[styles.backIconWhite, isTablet && { fontSize: 28 }]}>‹</Text>
          </TouchableOpacity>
          <View style={[styles.whiteBadge, isTablet && { paddingVertical: 8, paddingHorizontal: 20 }]}>
            <Text style={[styles.whiteBadgeText, isTablet && { fontSize: 14 }]}>
              {editingRelationshipId ? `${t('steps.editing1')} ${t('steps.editing')}` : (isAddingNew ? `${t('steps.editing1')} ${t('steps.firstStep')}` : `${t('steps.step2')} ${t('steps.secondStep')}`)}
            </Text>
          </View>
          <View style={{ width: isTablet ? 48 : 40 }} />
        </View>
        <Text style={[styles.headerTitle, { fontSize: headerTitleSize }]}>{t('relationshipType.title')}</Text>
        <Text style={[styles.headerSubtitle, { fontSize: headerSubtitleSize }]}>{t('relationshipType.subtitle')}</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[{ padding: 24, paddingBottom: 40 }, isTablet && { alignItems: 'center', flexGrow: 1, justifyContent: 'center' }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.relationshipCards, isTablet && { maxWidth: contentMaxWidth, width: '100%' }]}>
            {relationshipOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.relationshipCard,
                  isTablet && { paddingVertical: 20, paddingHorizontal: 24 },
                  relationshipType === option.id && styles.relationshipCardSelected
                ]}
                onPress={() => setRelationshipType(option.id)}
              >
                <View style={[styles.cardIconWrapper, isTablet && { width: 60, height: 60, borderRadius: 30 }]}>
                  <Text style={[styles.cardEmojiSmall, { fontSize: emojiSize }]}>{option.emoji}</Text>
                </View>
                <Text style={[styles.cardTitleInline, { fontSize: cardTitleSize }]}>{getRelationshipLabel(option.id)}</Text>
                <View style={styles.checkWrapper}>
                  {relationshipType === option.id ? (
                    <View style={[styles.checkedCircle, isTablet && { width: 32, height: 32, borderRadius: 16 }]}>
                      <View style={[styles.checkmark, isTablet && { width: 16, height: 16, borderRadius: 8 }]} />
                    </View>
                  ) : (
                    <View style={[styles.uncheckedCircle, isTablet && { width: 32, height: 32, borderRadius: 16 }]} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.continueButton, !relationshipType && styles.continueButtonDisabled, isTablet && { maxWidth: 400, width: '100%' }]}
            onPress={() => {
              if (relationshipType) {
                navigation.navigate('RelationshipContext');
              }
            }}
            disabled={!relationshipType}
          >
            {relationshipType ? (
              <LinearGradient
                colors={['#66D9A1', '#4CAF50']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.gradientButton, isTablet && { paddingVertical: 24 }]}
              >
                <Text style={[styles.continueButtonText, { fontSize: buttonTextSize }]}>{t('common:buttons.continue')}</Text>
              </LinearGradient>
            ) : (
              <Text style={[styles.continueButtonText, { fontSize: buttonTextSize }]}>{t('common:buttons.continue')}</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
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
  relationshipCards: {
    width: '100%',
    gap: 16,
    marginBottom: 20,
  },
  relationshipCard: {
    backgroundColor: '#F0F9F0',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8F5E9',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  relationshipCardSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#81C784',
    shadowOpacity: 0.2,
    elevation: 4,
  },
  cardIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardEmojiSmall: {
    fontSize: 26,
  },
  cardTitleInline: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#2C3E50',
  },
  checkWrapper: {
    marginLeft: 10,
  },
  checkedCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uncheckedCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#A5D6A7',
    backgroundColor: 'transparent',
  },
  checkmark: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFF',
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

