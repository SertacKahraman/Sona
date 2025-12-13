import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';

export default function SavedAdviceScreen({ navigation }) {
    const { t } = useTranslation('profile'); // Assuming we can use profile translations or common
    const { savedAdvice, removeAdvice } = useApp();

    const handleDelete = (id) => {
        Alert.alert(
            t('saved.deleteTitle', { defaultValue: 'Tavsiyeyi Sil' }),
            t('saved.deleteMessage', { defaultValue: 'Bu tavsiyeyi favorilerinden çıkarmak istediğine emin misin?' }),
            [
                { text: t('saved.cancel', { defaultValue: 'İptal' }), style: "cancel" },
                {
                    text: t('saved.confirm', { defaultValue: 'Sil' }),
                    onPress: () => removeAdvice(id),
                    style: "destructive"
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                    <Feather name="bookmark" size={20} color="#FBC02D" />
                </View>
                <Text style={styles.dateText}>
                    {new Date(item.date).toLocaleDateString()}
                </Text>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                    <Feather name="trash-2" size={18} color="#FF5252" />
                </TouchableOpacity>
            </View>
            <Text style={styles.cardText}>{item.text}</Text>
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
                <Feather name="bookmark" size={48} color="#E0E0E0" />
            </View>
            <Text style={styles.emptyTitle}>{t('saved.emptyTitle', { defaultValue: 'Henüz Kaydedilmiş Tavsiye Yok' })}</Text>
            <Text style={styles.emptyText}>
                {t('saved.emptyText', { defaultValue: 'Sohbet sırasında beğendiğin tavsiyeleri buraya kaydedebilirsin.' })}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('saved.title', { defaultValue: 'Favori Tavsiyelerim' })}</Text>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                data={savedAdvice}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmpty}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    listContent: {
        padding: 20,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFF9C4',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    dateText: {
        fontSize: 12,
        color: '#999',
        flex: 1,
    },
    deleteButton: {
        padding: 8,
    },
    cardText: {
        fontSize: 16,
        color: '#424242',
        lineHeight: 24,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
        paddingHorizontal: 40,
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        lineHeight: 20,
    },
});
