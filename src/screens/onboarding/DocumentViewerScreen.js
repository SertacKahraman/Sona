import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

export default function DocumentViewerScreen({ route, navigation }) {
    const { documentType } = route.params; // 'terms' or 'privacy'
    const { t } = useTranslation('documents');
    const isTerms = documentType === 'terms';

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={['#66D9A1', '#4CAF50']}
                style={styles.headerGradient}
            >
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Feather name="arrow-left" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        {t(isTerms ? 'terms.title' : 'privacy.title')}
                    </Text>
                    <View style={{ width: 40 }} />
                </View>
            </LinearGradient>

            {/* Document Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {isTerms ? <TermsContent t={t} /> : <PrivacyContent t={t} />}

                <View style={styles.bottomSpacer} />
            </ScrollView>
            <StatusBar style="light" />
        </View>
    );
}

// Kullanıcı Sözleşmesi İçeriği
const TermsContent = ({ t }) => (
    <View>
        <Text style={styles.sectionTitle}>{t('terms.title')}</Text>
        <Text style={styles.lastUpdated}>{t('terms.lastUpdated')}</Text>

        <Text style={styles.paragraph}>
            {t('terms.intro')}
        </Text>

        <Text style={styles.heading}>{t('terms.sections.service.title')}</Text>
        <Text style={styles.paragraph}>
            {t('terms.sections.service.content')}
        </Text>

        <Text style={styles.heading}>{t('terms.sections.responsibilities.title')}</Text>
        <Text style={styles.paragraph}>
            {t('terms.sections.responsibilities.content')}
        </Text>

        <Text style={styles.heading}>{t('terms.sections.scope.title')}</Text>
        <Text style={styles.paragraph}>
            {t('terms.sections.scope.content')}
        </Text>

        <Text style={styles.heading}>{t('terms.sections.intellectual.title')}</Text>
        <Text style={styles.paragraph}>
            {t('terms.sections.intellectual.content')}
        </Text>

        <Text style={styles.heading}>{t('terms.sections.disclaimer.title')}</Text>
        <Text style={styles.paragraph}>
            {t('terms.sections.disclaimer.content')}
        </Text>

        <Text style={styles.heading}>{t('terms.sections.deletion.title')}</Text>
        <Text style={styles.paragraph}>
            {t('terms.sections.deletion.content')}
        </Text>

        <Text style={styles.heading}>{t('terms.sections.changes.title')}</Text>
        <Text style={styles.paragraph}>
            {t('terms.sections.changes.content')}
        </Text>

        <Text style={styles.heading}>{t('terms.sections.contact.title')}</Text>
        <Text style={styles.paragraph}>
            {t('terms.sections.contact.content')}
        </Text>
    </View>
);

// Gizlilik Politikası İçeriği
const PrivacyContent = ({ t }) => (
    <View>
        <Text style={styles.sectionTitle}>{t('privacy.title')}</Text>
        <Text style={styles.lastUpdated}>{t('privacy.lastUpdated')}</Text>

        <Text style={styles.paragraph}>
            {t('privacy.intro')}
        </Text>

        <Text style={styles.heading}>{t('privacy.sections.collected.title')}</Text>
        <Text style={styles.paragraph}>
            <Text style={styles.bold}>{t('privacy.sections.collected.personal')}</Text>{'\n'}
            {t('privacy.sections.collected.personalList')}
        </Text>
        <Text style={styles.paragraph}>
            <Text style={styles.bold}>{t('privacy.sections.collected.relationship')}</Text>{'\n'}
            {t('privacy.sections.collected.relationshipList')}
        </Text>

        <Text style={styles.heading}>{t('privacy.sections.usage.title')}</Text>
        <Text style={styles.paragraph}>
            {t('privacy.sections.usage.content')}
        </Text>

        <Text style={styles.heading}>{t('privacy.sections.security.title')}</Text>
        <Text style={styles.paragraph}>
            <Text style={styles.bold}>{t('privacy.sections.security.encryption')}</Text> {t('privacy.sections.security.encryptionText')}{'\n\n'}
            <Text style={styles.bold}>{t('privacy.sections.security.local')}</Text> {t('privacy.sections.security.localText')}{'\n\n'}
            <Text style={styles.bold}>{t('privacy.sections.security.thirdParty')}</Text> {t('privacy.sections.security.thirdPartyText')}
        </Text>

        <Text style={styles.heading}>{t('privacy.sections.ai.title')}</Text>
        <Text style={styles.paragraph}>
            {t('privacy.sections.ai.content')}
        </Text>

        <Text style={styles.heading}>{t('privacy.sections.cookies.title')}</Text>
        <Text style={styles.paragraph}>
            {t('privacy.sections.cookies.content')}
        </Text>

        <Text style={styles.heading}>{t('privacy.sections.rights.title')}</Text>
        <Text style={styles.paragraph}>
            {t('privacy.sections.rights.content')}
        </Text>

        <Text style={styles.heading}>{t('privacy.sections.children.title')}</Text>
        <Text style={styles.paragraph}>
            {t('privacy.sections.children.content')}
        </Text>

        <Text style={styles.heading}>{t('privacy.sections.policyChanges.title')}</Text>
        <Text style={styles.paragraph}>
            {t('privacy.sections.policyChanges.content')}
        </Text>

        <Text style={styles.heading}>{t('privacy.sections.privacyContact.title')}</Text>
        <Text style={styles.paragraph}>
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
