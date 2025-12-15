import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Image, ActivityIndicator, Keyboard, Alert, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { generateChatResponse } from '../../services/ChatService';
import { useApp } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';

const TABLET_BREAKPOINT = 768;

export default function ChatScreen({ route, navigation }) {
  const { t, i18n } = useTranslation('chat');
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isTablet = screenWidth >= TABLET_BREAKPOINT;

  // Navigation bar için responsive bottom padding
  // Tab bar yüksekliği (~70-85) + tab bar bottom offset + ekstra padding
  const tabBarHeight = isTablet ? 85 : 70;
  const tabBarBottomOffset = Platform.OS === 'android'
    ? (isTablet ? 15 : 10)
    : (isTablet ? 25 : 20);
  const navBarHeight = tabBarHeight + tabBarBottomOffset + 10;

  // Dynamic sizes for tablet
  const headerTitleSize = isTablet ? 24 : 20;
  const relChipPadding = isTablet ? { paddingHorizontal: 20, paddingVertical: 10 } : { paddingHorizontal: 16, paddingVertical: 8 };
  const messageFontSize = isTablet ? 17 : 15;
  const inputFontSize = isTablet ? 17 : 15;
  const sendButtonSize = isTablet ? 52 : 44;
  const avatarSize = isTablet ? 40 : 32;

  const { initialRelationshipId } = route.params || {};
  const { relationships, userName, coachingGoal, incrementMessageCount, saveAdvice, savedAdvice, removeAdvice, checkTokenLimit, updateTokenUsage, checkMinuteLimit, recordMessageTimestamp } = useApp();
  const [selectedRelId, setSelectedRelId] = useState(initialRelationshipId || relationships[0]?.id || 'general');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );
    const keyboardHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  // Seçili ilişkiyi bul
  const selectedRelationship = relationships.find(r => r.id === selectedRelId);

  // Mesajları yükle
  useEffect(() => {
    loadMessages(selectedRelId);
  }, [selectedRelId]);

  // Mesajlar değiştiğinde (yeni mesaj geldiğinde) en alta kaydır
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const loadMessages = async (relId) => {
    try {
      const storedMessages = await AsyncStorage.getItem(`chat_${relId}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        // İlk mesaj (Sona'dan)
        const initialMessage = {
          id: 'init',
          text: relId === 'general'
            ? t('initialMessages.general', { userName })
            : t('initialMessages.relationship', { partnerName: selectedRelationship?.partnerName }),
          sender: 'sona',
          timestamp: new Date().toISOString()
        };
        setMessages([initialMessage]);
      }

      // Sohbet açıldığında en alta kaydır
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 200);

    } catch (error) {
      // Mesajlar yüklenirken hata - sessizce devam et
    }
  };

  const saveMessages = async (relId, newMessages) => {
    try {
      await AsyncStorage.setItem(`chat_${relId}`, JSON.stringify(newMessages));
    } catch (error) {
      // Mesajlar kaydedilirken hata - sessizce devam et
    }
  };

  const handleClearChat = () => {
    Alert.alert(
      t('alerts.clearChat.title'),
      t('alerts.clearChat.message'),
      [
        { text: t('alerts.clearChat.cancel'), style: "cancel" },
        {
          text: t('alerts.clearChat.clear'),
          onPress: async () => {
            setMessages([]);
            await AsyncStorage.removeItem(`chat_${selectedRelId}`);
            // İsteğe bağlı: Temizledikten sonra tekrar 'Merhaba' dedirtebiliriz
            // loadMessages(selectedRelId); 
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    if (!checkTokenLimit()) {
      Alert.alert(
        "Günlük Limit Aşıldı",
        "Bugünlük Sona ile konuşma limitine ulaştın. Yarın tekrar görüşmek üzere! 👋",
        [{ text: "Tamam" }]
      );
      return;
    }

    if (!checkMinuteLimit()) {
      Alert.alert(
        "Çok Hızlısın! ⏱️",
        "Dakikada en fazla 10 mesaj gönderebilirsin. Lütfen biraz bekle.",
        [{ text: "Tamam" }]
      );
      return;
    }

    // Mesaj zaman damgasını kaydet
    recordMessageTimestamp();

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveMessages(selectedRelId, updatedMessages);
    incrementMessageCount(1); // Kullanıcı mesajı için artır
    setInputText('');
    setIsTyping(true);

    // Gemini API Çağrısı
    try {
      const context = {
        userName,
        partnerName: selectedRelationship?.partnerName,
        relationshipType: selectedRelationship?.type,
        years: selectedRelationship?.years,
        months: selectedRelationship?.months,
        mainChallenge: selectedRelationship?.mainChallenge,
        coachingGoal,
        language: i18n.language
      };

      const response = await generateChatResponse(userMessage.text, messages, context);

      // Token kullanımını güncelle
      if (response.usageMetadata) {
        updateTokenUsage(response.usageMetadata);
      }

      const sonaMessage = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'sona',
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...updatedMessages, sonaMessage];
      setMessages(finalMessages);
      saveMessages(selectedRelId, finalMessages);
      incrementMessageCount(1); // Sona mesajı için artır
    } catch (error) {
      // Cevap üretilirken hata - sessizce devam et
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    const isSaved = savedAdvice?.some(advice => advice.text === item.text);

    const handleSaveMessage = async () => {
      if (isSaved) {
        const adviceToRemove = savedAdvice.find(advice => advice.text === item.text);
        if (adviceToRemove) {
          await removeAdvice(adviceToRemove.id);
          // Optional: Show "Removed" toast/alert
        }
      } else {
        const success = await saveAdvice(item.text);
        if (success) {
          Alert.alert(t('alerts.saved.title', { defaultValue: 'Saved!' }), t('alerts.saved.message', { defaultValue: 'Message saved to your favorites.' }));
        }
      }
    };

    return (
      <View style={[
        styles.messageBubble,
        isUser ? styles.userBubble : styles.sonaBubble
      ]}>
        {!isUser && (
          <View style={[styles.avatarContainer, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}>
            <Image source={require('../../../assets/selam.png')} style={[styles.avatar, { width: avatarSize - 4, height: avatarSize - 4 }]} />
          </View>
        )}
        <View style={[
          styles.bubbleContent,
          isUser ? styles.userBubbleContent : styles.sonaBubbleContent,
          isTablet && { padding: 16, maxWidth: '75%' }
        ]}>
          <Text style={[
            styles.messageText,
            { fontSize: messageFontSize, lineHeight: messageFontSize + 7 },
            isUser ? styles.userMessageText : styles.sonaMessageText
          ]}>{item.text}</Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: isTablet ? 6 : 4 }}>
            <Text style={[
              styles.timestamp,
              isTablet && { fontSize: 11 },
              isUser ? styles.userTimestamp : styles.sonaTimestamp
            ]}>
              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>

            {!isUser && (
              <TouchableOpacity onPress={handleSaveMessage} style={{ marginLeft: 8, padding: 4 }}>
                <FontAwesome name={isSaved ? "bookmark" : "bookmark-o"} size={isTablet ? 18 : 16} color={isSaved ? "#FBC02D" : "#999"} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyStateContainer}>
      <Image
        source={require('../../../assets/selam.png')}
        style={styles.emptyStateImage}
        resizeMode="contain"
      />
      <Text style={styles.emptyStateTitle}>{t('emptyState.title')}</Text>
      <Text style={styles.emptyStateText}>
        {t('emptyState.text')}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient
        colors={['#66D9A1', '#4CAF50']}
        style={[styles.header, isTablet && { paddingBottom: 20 }]}
      >
        <View style={styles.headerTop}>
          <Text style={[styles.headerTitle, { fontSize: headerTitleSize }]}>{t('header.title')}</Text>
        </View>

        {/* İlişki Seçici */}
        <FlatList
          horizontal
          data={[{ id: 'general', partnerName: t('relationshipSelector.general') }, ...relationships]}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.relSelector, { flexGrow: 1, justifyContent: 'center' }]}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.relChip,
                relChipPadding,
                selectedRelId === item.id && styles.relChipActive
              ]}
              onPress={() => setSelectedRelId(item.id)}
            >
              <Text style={[
                styles.relChipText,
                isTablet && { fontSize: 15 },
                selectedRelId === item.id && styles.relChipTextActive
              ]}>{item.partnerName}</Text>
            </TouchableOpacity>
          )}
        />
      </LinearGradient>

      {/* Main Content Wrapper */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        style={styles.keyboardAvoidingView}
      >
        {/* Mesaj Listesi */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          ListFooterComponent={<View style={{ height: 20 }} />}
          style={{ flex: 1 }}
          ListEmptyComponent={renderEmptyList}
        />

        {/* Yazıyor Göstergesi */}
        {isTyping && (
          <View style={styles.typingContainer}>
            <ActivityIndicator size="small" color="#66D9A1" />
            <Text style={styles.typingText}>{t('typing')}</Text>
          </View>
        )}

        {/* Input Alanı */}
        <View style={[
          styles.inputContainer,
          { paddingBottom: isKeyboardVisible ? 10 : navBarHeight },
          isTablet && { padding: 14 }
        ]}>
          <TextInput
            style={[styles.input, { fontSize: inputFontSize }, isTablet && { paddingVertical: 14, paddingHorizontal: 18 }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder={t('placeholder')}
            placeholderTextColor="#999"
            multiline
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect={true}
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendButton, { width: sendButtonSize, height: sendButtonSize, borderRadius: sendButtonSize / 2 }, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <LinearGradient
              colors={inputText.trim() ? ['#66D9A1', '#4CAF50'] : ['#E0E0E0', '#BDBDBD']}
              style={styles.sendButtonGradient}
            >
              <Feather name="send" size={isTablet ? 24 : 20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Bottom Navigation Removed */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  relSelector: {
    paddingHorizontal: 15,
    paddingBottom: 5,
  },
  relChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  relChipActive: {
    backgroundColor: '#FFF',
    borderColor: '#FFF',
  },
  relChipText: {
    color: '#FFF',
    fontWeight: '600',
  },
  relChipTextActive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  messagesList: {
    padding: 20,
    // paddingBottom kaldırıldı, ListFooterComponent kullanılıyor
  },
  messageBubble: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userBubble: {
    justifyContent: 'flex-end',
  },
  sonaBubble: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    marginRight: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 28,
    height: 28,
  },
  bubbleContent: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 20,
  },
  userBubbleContent: {
    backgroundColor: '#66D9A1',
    borderBottomRightRadius: 4,
  },
  sonaBubbleContent: {
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFF',
  },
  sonaMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  sonaTimestamp: {
    color: '#999',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  typingText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
  },
  inputContainerKeyboardOpen: {
    paddingBottom: 10,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  input: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    marginRight: 10,
    fontSize: 15,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    opacity: 0.7,
  },
  emptyStateImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
    opacity: 0.8,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});
