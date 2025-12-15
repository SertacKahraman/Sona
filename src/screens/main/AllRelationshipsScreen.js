import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform, Modal, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { getRelationshipInfo } from '../../constants/relationships';
import { useApp } from '../../context/AppContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const TABLET_BREAKPOINT = 768;

export default function AllRelationshipsScreen({ navigation }) {
    const { t } = useTranslation(['allRelationships', 'home', 'onboarding']);
    const { width: screenWidth } = useWindowDimensions();
    const isTablet = screenWidth >= TABLET_BREAKPOINT;

    // Dynamic sizes for tablet
    const headerTitleSize = isTablet ? 26 : 20;
    const headerSubtitleSize = isTablet ? 14 : 12;
    const headerButtonSize = isTablet ? 52 : 40;
    const headerIconSize = isTablet ? 28 : 24;
    const cardHeight = isTablet ? 240 : 200;
    const cardEmojiSize = isTablet ? 56 : 48;
    const cardNameSize = isTablet ? 24 : 20;

    const {
        relationships,
        setEditingRelationshipId,
        setRelationshipType,
        setRelationshipPartnerName,
        setPartnerAge,
        setPartnerGender,
        setPartnerNotes,
        setRelationshipYears,
        setRelationshipMonths,
        setMainChallenge,
        deleteRelationship,
        setIsAddingNew
    } = useApp();

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedRelationshipForModal, setSelectedRelationshipForModal] = useState(null);

    const handleAddNew = () => {
        setIsAddingNew(true);
        setRelationshipType('');
        setRelationshipPartnerName('');
        setPartnerAge('');
        setPartnerGender('');
        setPartnerNotes('');
        setRelationshipYears(0);
        setRelationshipMonths(0);
        setMainChallenge('');
        navigation.navigate('RelationshipType');
    };

    const getDurationText = (years, months) => {
        if (years === 0 && months === 0) return t('new');
        const yearsText = years > 0 ? `${years} ${t('partnerInfo.duration.yearsShort', { ns: 'onboarding' })}` : '';
        const monthsText = months > 0 ? `${months} ${t('partnerInfo.duration.monthsShort', { ns: 'onboarding' })}` : '';
        return [yearsText, monthsText].filter(Boolean).join(' ');
    };

    const handleEditRelationship = (relationshipId) => {
        const rel = relationships.find(r => r.id === relationshipId);
        if (rel) {
            setEditingRelationshipId(relationshipId);
            setRelationshipType(rel.type);
            setRelationshipPartnerName(rel.partnerName);
            setPartnerAge(rel.partnerAge || '');
            setPartnerGender(rel.partnerGender || '');
            setPartnerNotes(rel.partnerNotes || '');
            setRelationshipYears(rel.years);
            setRelationshipMonths(rel.months);
            setMainChallenge(rel.mainChallenge);
            navigation.navigate('RelationshipType');
        }
    };

    const handleSelectRelationship = (relationshipId) => {
        const rel = relationships.find(r => r.id === relationshipId);
        setSelectedRelationshipForModal(rel);
        setShowDetailModal(true);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Gradient Header */}
            <LinearGradient
                colors={['#66D9A1', '#4CAF50']}
                style={[styles.headerGradient, isTablet && { paddingBottom: 30 }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <SafeAreaView>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, isTablet && { width: headerButtonSize, height: headerButtonSize, borderRadius: headerButtonSize / 2 }]}>
                            <Feather name="arrow-left" size={headerIconSize} color="#FFF" />
                        </TouchableOpacity>
                        <View style={styles.headerTextContainer}>
                            <Text style={[styles.headerTitle, { fontSize: headerTitleSize }]}>{t('title')}</Text>
                            <Text style={[styles.headerSubtitle, { fontSize: headerSubtitleSize }]}>{t('relationshipCount', { count: relationships.length })}</Text>
                        </View>
                        <TouchableOpacity onPress={handleAddNew} style={[styles.backButton, isTablet && { width: headerButtonSize, height: headerButtonSize, borderRadius: headerButtonSize / 2 }]}>
                            <Feather name="plus" size={headerIconSize} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {relationships.map((rel) => {
                    const relInfo = getRelationshipInfo(rel.type);

                    return (
                        <TouchableOpacity
                            key={rel.id}
                            style={[styles.relationshipCard, { height: cardHeight }]}
                            onPress={() => handleSelectRelationship(rel.id)}
                            activeOpacity={0.9}
                        >
                            <LinearGradient
                                colors={relInfo.gradient}
                                style={[styles.cardGradient, isTablet && { padding: 24 }]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <View style={styles.cardContent}>
                                    <Text style={[styles.cardEmoji, { fontSize: cardEmojiSize }]}>{relInfo.emoji}</Text>
                                    <Text style={[styles.cardName, { fontSize: cardNameSize }]}>{rel.partnerName || t('unnamed')}</Text>
                                    <Text style={[styles.cardType, isTablet && { fontSize: 15 }]}>{t(`relationshipType.${rel.type}`, { ns: 'onboarding' })}</Text>

                                    <View style={styles.cardFooter}>
                                        <View style={[styles.durationBadge, isTablet && { paddingHorizontal: 14, paddingVertical: 8 }]}>
                                            <Feather name="clock" size={isTablet ? 14 : 12} color="#FFF" />
                                            <Text style={[styles.durationText, isTablet && { fontSize: 13 }]}>{getDurationText(rel.years, rel.months)}</Text>
                                        </View>
                                    </View>

                                    {rel.mainChallenge && (
                                        <View style={[styles.challengeBadge, isTablet && { paddingHorizontal: 10, paddingVertical: 6 }]}>
                                            <Feather name="alert-circle" size={isTablet ? 12 : 10} color="rgba(255,255,255,0.9)" />
                                            <Text style={[styles.challengeText, isTablet && { fontSize: 12 }]} numberOfLines={1}>{rel.mainChallenge}</Text>
                                        </View>
                                    )}
                                </View>

                                <View style={styles.cardActions}>
                                    <TouchableOpacity
                                        style={styles.cardActionButton}
                                        onPress={() => handleEditRelationship(rel.id)}
                                    >
                                        <Feather name="edit-3" size={16} color="#FFF" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.cardActionButton}
                                        onPress={() => deleteRelationship(rel.id)}
                                    >
                                        <Feather name="trash-2" size={16} color="#FFF" />
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
            <Modal
                visible={showDetailModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowDetailModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.detailModalContent}>
                        {selectedRelationshipForModal && (
                            <>
                                <View style={styles.detailHeader}>
                                    <LinearGradient
                                        colors={getRelationshipInfo(selectedRelationshipForModal.type).gradient}
                                        style={styles.detailIconContainer}
                                    >
                                        <Text style={styles.detailEmoji}>{getRelationshipInfo(selectedRelationshipForModal.type).emoji}</Text>
                                    </LinearGradient>
                                    <View style={styles.detailHeaderText}>
                                        <Text style={styles.detailName}>{selectedRelationshipForModal.partnerName}</Text>
                                        <Text style={styles.detailType}>{t(`relationshipType.${selectedRelationshipForModal.type}`, { ns: 'onboarding' })}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.closeDetailButton}
                                        onPress={() => setShowDetailModal(false)}
                                    >
                                        <Feather name="x" size={24} color="#999" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.detailBody}>
                                    <View style={styles.detailRow}>
                                        <Feather name="clock" size={18} color="#666" />
                                        <Text style={styles.detailRowText}>
                                            {t('modal.relationshipDetail.duration', { ns: 'home' })}: <Text style={styles.detailRowValue}>{getDurationText(selectedRelationshipForModal.years, selectedRelationshipForModal.months)}</Text>
                                        </Text>
                                    </View>

                                    {selectedRelationshipForModal.mainChallenge ? (
                                        <View style={styles.detailChallengeBox}>
                                            <Text style={styles.detailChallengeLabel}>{t('modal.relationshipDetail.focusLabel', { ns: 'home' })}:</Text>
                                            <Text style={styles.detailChallengeText}>"{selectedRelationshipForModal.mainChallenge}"</Text>
                                        </View>
                                    ) : null}
                                </View>

                                <View style={styles.detailActions}>
                                    <TouchableOpacity
                                        style={styles.actionButtonPrimary}
                                        onPress={() => {
                                            setShowDetailModal(false);
                                            navigation.navigate('Main', {
                                                screen: 'ChatTab',
                                                params: { initialRelationshipId: selectedRelationshipForModal.id }
                                            });
                                        }}
                                    >
                                        <LinearGradient
                                            colors={['#66D9A1', '#4CAF50']}
                                            style={styles.actionGradient}
                                        >
                                            <Feather name="message-circle" size={20} color="#FFF" />
                                            <Text style={styles.actionTextPrimary}>{t('modal.relationshipDetail.chat', { ns: 'home' })}</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>

                                    <View style={styles.actionRowSecondary}>
                                        <TouchableOpacity
                                            style={styles.actionButtonSecondary}
                                            onPress={() => {
                                                setShowDetailModal(false);
                                                handleEditRelationship(selectedRelationshipForModal.id);
                                            }}
                                        >
                                            <Feather name="edit-2" size={18} color="#666" />
                                            <Text style={styles.actionTextSecondary}>{t('modal.relationshipDetail.edit', { ns: 'home' })}</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.actionButtonDelete}
                                            onPress={() => {
                                                setShowDetailModal(false);
                                                deleteRelationship(selectedRelationshipForModal.id);
                                            }}
                                        >
                                            <Feather name="trash-2" size={18} color="#FF6B6B" />
                                            <Text style={styles.actionTextDelete}>{t('modal.relationshipDetail.delete', { ns: 'home' })}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    headerGradient: {
        paddingTop: Platform.OS === 'android' ? 35 : 0,
        paddingBottom: 20,
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 0,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTextContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    headerSubtitle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 2,
        fontWeight: '500',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingTop: 10,
    },
    relationshipCard: {
        height: 200,
        marginBottom: 16,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    cardGradient: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    activeBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    activeBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    cardContent: {
        flex: 1,
    },
    cardEmoji: {
        fontSize: 48,
        marginBottom: 8,
    },
    cardName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    cardType: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: '600',
    },
    cardFooter: {
        marginTop: 8,
    },
    durationBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        alignSelf: 'flex-start',
    },
    durationText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: 'bold',
    },
    challengeBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 8,
    },
    challengeText: {
        color: 'rgba(255, 255, 255, 0.95)',
        fontSize: 10,
        fontWeight: '500',
        flex: 1,
    },
    cardActions: {
        flexDirection: 'row',
        gap: 10,
        position: 'absolute',
        top: 16,
        right: 16,
    },
    cardActionButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    detailModalContent: {
        backgroundColor: '#FFF',
        borderRadius: 30,
        width: '100%',
        maxWidth: 340,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    detailHeader: {
        alignItems: 'center',
        padding: 24,
        paddingBottom: 30,
        backgroundColor: '#F8F9FA',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    detailIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    detailEmoji: {
        fontSize: 40,
    },
    detailHeaderText: {
        alignItems: 'center',
    },
    detailName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 4,
    },
    detailType: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    closeDetailButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    detailBody: {
        padding: 24,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#F8F9FA',
        padding: 16,
        borderRadius: 16,
    },
    detailRowText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 12,
        flex: 1,
    },
    detailRowValue: {
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    detailChallengeBox: {
        backgroundColor: '#FFF8E1',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FFE082',
    },
    detailChallengeLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#F57F17',
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    detailChallengeText: {
        fontSize: 14,
        color: '#424242',
        lineHeight: 20,
        fontStyle: 'italic',
    },
    detailActions: {
        padding: 24,
        paddingTop: 0,
        gap: 12,
    },
    actionButtonPrimary: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    actionGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        gap: 10,
    },
    actionTextPrimary: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    actionRowSecondary: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButtonSecondary: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#F5F5F5',
        gap: 8,
    },
    actionTextSecondary: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    actionButtonDelete: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#FFEBEE',
        gap: 8,
    },
    actionTextDelete: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FF5252',
    },
});

