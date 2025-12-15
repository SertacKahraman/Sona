import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

const TABLET_BREAKPOINT = 768;

export default function DocumentViewerScreen({ route, navigation }) {
    const { documentType } = route.params; // 'terms' or 'privacy'
    const { t } = useTranslation('documents');
    const { width: screenWidth } = useWindowDimensions();
    const isTablet = screenWidth >= TABLET_BREAKPOINT;
    const isTerms = documentType === 'terms';

    // Dynamic sizes for tablet
    const headerTitleSize = isTablet ? 24 : 18;
    const headerButtonSize = isTablet ? 52 : 40;
    const headerIconSize = isTablet ? 28 : 24;
    const contentMaxWidth = isTablet ? Math.min(screenWidth * 0.7, 700) : '100%';

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={['#66D9A1', '#4CAF50']}
                style={[styles.headerGradient, isTablet && { paddingBottom: 30 }]}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        style={[styles.backButton, isTablet && { width: headerButtonSize, height: headerButtonSize, borderRadius: headerButtonSize / 2 }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Feather name="arrow-left" size={headerIconSize} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { fontSize: headerTitleSize }]}>
                        {t(isTerms ? 'terms.title' : 'privacy.title')}
                    </Text>
                    <View style={{ width: headerButtonSize }} />
                </View>
            </LinearGradient>

            {/* Document Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContent, isTablet && { alignItems: 'center', paddingHorizontal: 40 }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={isTablet ? { maxWidth: contentMaxWidth, width: '100%' } : {}}>
                    {isTerms ? <TermsContent t={t} isTablet={isTablet} /> : <PrivacyContent t={t} isTablet={isTablet} />}
                </View>

                <View style={styles.bottomSpacer} />
            </ScrollView>
            <StatusBar style="light" />
        </View>
    );
}

// Kullanıcı Sözleşmesi İçeriği
const TermsContent = ({ t, isTablet }) => (
    <View>
        <Text style={[styles.sectionTitle, isTablet && { fontSize: 30 }]}>{t('terms.title')}</Text>
        <Text style={[styles.lastUpdated, isTablet && { fontSize: 14 }]}>{t('terms.lastUpdated')}</Text>

        <Text style={[styles.paragraph, isTablet && { fontSize: 18, lineHeight: 30 }]}>
            {t('terms.intro')}
        </Text>

        <Text style={[styles.heading, isTablet && { fontSize: 22 }]}>{t('terms.sections.service.title')}</Text>
        <Text style={[styles.paragraph, isTablet && { fontSize: 18, lineHeight: 30 }]}>
            {t('terms.sections.service.content')}
        </Text>

        <Text style={[styles.heading, isTablet && { fontSize: 22 }]}>{t('terms.sections.responsibilities.title')}</Text>
        <Text style={[styles.paragraph, isTablet && { fontSize: 18, lineHeight: 30 }]}>
            {t('terms.sections.responsibilities.content')}
        </Text>

        <Text style={[styles.heading, isTablet && { fontSize: 22 }]}>{t('terms.sections.scope.title')}</Text>
        <Text style={[styles.paragraph, isTablet && { fontSize: 18, lineHeight: 30 }]}>
            {t('terms.sections.scope.content')}
        </Text>

        <Text style={[styles.heading, isTablet && { fontSize: 22 }]}>{t('terms.sections.intellectual.title')}</Text>
        <Text style={[styles.paragraph, isTablet && { fontSize: 18, lineHeight: 30 }]}>
            {t('terms.sections.intellectual.content')}
        </Text>

        <Text style={[styles.heading, isTablet && { fontSize: 22 }]}>{t('terms.sections.disclaimer.title')}</Text>
        <Text style={[styles.paragraph, isTablet && { fontSize: 18, lineHeight: 30 }]}>
            {t('terms.sections.disclaimer.content')}
        </Text>

        <Text style={[styles.heading, isTablet && { fontSize: 22 }]}>{t('terms.sections.deletion.title')}</Text>
        <Text style={[styles.paragraph, isTablet && { fontSize: 18, lineHeight: 30 }]}>
            {t('terms.sections.deletion.content')}
        </Text>

        <Text style={[styles.heading, isTablet && { fontSize: 22 }]}>{t('terms.sections.changes.title')}</Text>
        <Text style={[styles.paragraph, isTablet && { fontSize: 18, lineHeight: 30 }]}>
            {t('terms.sections.changes.content')}
        </Text>

        <Text style={[styles.heading, isTablet && { fontSize: 22 }]}>{t('terms.sections.contact.title')}</Text>
        <Text style={[styles.paragraph, isTablet && { fontSize: 18, lineHeight: 30 }]}>
            {t('terms.sections.contact.content')}
        </Text>
    </View>
);

// Gizlilik Politikası İçeriği
const PrivacyContent = ({ t, isTablet }) => (
    <View>
        <Text style={[styles.sectionTitle, isTablet && { fontSize: 30 }]}>{t('privacy.title')}</Text>
        <Text style={[styles.lastUpdated, isTablet && { fontSize: 14 }]}>{t('privacy.lastUpdated')}</Text>

        <Text style={[styles.paragraph, isTablet && { fontSize: 18, lineHeight: 30 }]}>
            {t('privacy.intro')}
        </Text>

        <Text style={[styles.heading, isTablet && { fontSize: 22 }]}>{t('privacy.sections.collected.title')}</Text>
        <Text style={[styles.paragraph, isTablet && { fontSize: 18, lineHeight: 30 }]}>
            <Text style={styles.bold}>{t('privacy.sections.collected.personal')}</Text>{'\n'}
            {t('privacy.sections.collected.personalList')}
        </Text>
        <Text style={[styles.paragraph, isTablet && { fontSize: 18, lineHeight: 30 }]}>
            <Text style={styles.bold}>{t('privacy.sections.collected.relationship')}</Text>{'\n'}
            {t('privacy.sections.collected.relationshipList')}
        </Text>

        <Text style={[styles.heading, isTablet && { fontSize: 22 }]}>{t('privacy.sections.usage.title')}</Text>
        <Text style={[styles.paragraph, isTablet && { fontSize: 18, lineHeight: 30 }]}>
            {t('privacy.sections.usage.content')}
        </Text>

        <Text style={[styles.heading, isTablet && { fontSize: 22 }]}>{t('privacy.sections.security.title')}</Text>
        <Text style={[styles.paragraph, isTablet && { fontSize: 18, lineHeight: 30 }]}>
            <Text style={styles.bold}>{t('privacy.sections.security.encryption')}</Text> {t('privacy.sections.security.encryptionText')}{'\n\n'}
            <Text style={styles.bold}>{t('privacy.sections.security.local')}</Text> {t('privacy.sections.security.localText')}{'\n\n'}
            <Text style={styles.bold}>{t('privacy.sections.security.thirdParty')}</Text> {t('privacy.sections.security.thirdPartyText')}
        </Text>

        <Text style={[styles.heading, isTablet && { fontSize: 22 }]}>{t('privacy.sections.ai.title')}</Text>
        <Text style={[styles.paragraph, isTablet && { fontSize: 18, lineHeight: 30 }]}>
            {t('privacy.sections.ai.content')}
        </Text>

        <Text style={[styles.heading, isTablet && { fontSize: 22 }]}>{t('privacy.sections.cookies.title')}</Text>
        <Text style={[styles.paragraph, isTablet && { fontSize: 18, lineHeight: 30 }]}>
            {t('privacy.sections.cookies.content')}
        </Text>

        <Text style={[styles.heading, isTablet && { fontSize: 22 }]}>{t('privacy.sections.rights.title')}</Text>
        <Text style={[styles.paragraph, isTablet && { fontSize: 18, lineHeight: 30 }]}>
            {t('privacy.sections.rights.content')}
        </Text>

        <Text style={[styles.heading, isTablet && { fontSize: 22 }]}>{t('privacy.sections.children.title')}</Text>
        <Text style={[styles.paragraph, isTablet && { fontSize: 18, lineHeight: 30 }]}>
            {t('privacy.sections.children.content')}
        </Text>

        <Text style={[styles.heading, isTablet && { fontSize: 22 }]}>{t('privacy.sections.policyChanges.title')}</Text>
        <Text style={[styles.paragraph, isTablet && { fontSize: 18, lineHeight: 30 }]}>
            {t('privacy.sections.policyChanges.content')}
        </Text>

        <Text style={[styles.heading, isTablet && { fontSize: 22 }]}>{t('privacy.sections.privacyContact.title')}</Text>
        <Text style={[styles.paragraph, isTablet && { fontSize: 18, lineHeight: 30 }]}>
            {t('privacy.sections.privacyContact.content')}
        </Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    headerGradient: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
        flex: 1,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 8,
    },
    lastUpdated: {
        fontSize: 12,
        color: '#999',
        marginBottom: 20,
        fontStyle: 'italic',
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginTop: 20,
        marginBottom: 12,
    },
    paragraph: {
        fontSize: 15,
        color: '#5A3A47',
        lineHeight: 24,
        marginBottom: 12,
    },
    bold: {
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    bottomSpacer: {
        height: 40,
    },
});
