import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, SafeAreaView, Modal, TextInput, Alert, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getRelationshipInfo } from '../../constants/relationships';
import { useTranslation } from 'react-i18next';

export default function HomeScreen({ navigation }) {
  const { t, i18n } = useTranslation('home');
  const {
    userName,
    relationships,
    specialDates,
    dailyMoods,
    coachingGoal,
    addSpecialDate,
    deleteSpecialDate,
    addDailyMood,
    deleteRelationship,
    setIsAddingNew,
    setRelationshipType,
    setRelationshipPartnerName,
    setPartnerAge,
    setPartnerGender,
    setPartnerNotes,
    setRelationshipYears,
    setRelationshipMonths,
    setMainChallenge,
    setEditingRelationshipId
  } = useApp();

  const [showDateModal, setShowDateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRelationshipForModal, setSelectedRelationshipForModal] = useState(null);

  // Yeni Özel Gün Ekleme State'leri
  const [newDateTitle, setNewDateTitle] = useState('');
  const [newDateDay, setNewDateDay] = useState('');
  const [newDateMonth, setNewDateMonth] = useState('');
  /* Helper to get current year dynamically */
  const currentYear = new Date().getFullYear();
  const [datePickerDate, setDatePickerDate] = useState(new Date(currentYear, new Date().getMonth(), new Date().getDate()));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      // Force year to current year
      const fixedDate = new Date(currentYear, selectedDate.getMonth(), selectedDate.getDate());
      setDatePickerDate(fixedDate);
      setNewDateDay(fixedDate.getDate().toString());
      setNewDateMonth((fixedDate.getMonth() + 1).toString());
    }
  };
  const [selectedRelId, setSelectedRelId] = useState(relationships[0]?.id || '');

  const formatModalDate = (date) => {
    const localeMap = {
      'tr': 'tr-TR',
      'es': 'es-ES',
      'pt': 'pt-BR',
      'de': 'de-DE',
      'fr': 'fr-FR',
      'en': 'en-US',
    };
    const locale = localeMap[i18n.language] || 'en-US';
    const dateString = date.toLocaleDateString(locale, { day: 'numeric', month: 'long' });
    // Capitalize first letter of each word
    return dateString.split(' ').map(word => word.charAt(0).toLocaleUpperCase(locale) + word.slice(1)).join(' ');
  };

  // Günün Tavsiyesi Mantığı
  const dailyTip = useMemo(() => {
    const tipKey = coachingGoal || 'default';
    const tips = t(`tips.${tipKey}`, { returnObjects: true });
    if (!tips || !Array.isArray(tips) || tips.length === 0) return "Sona";
    const randomIndex = Math.floor(Math.random() * tips.length);
    return tips[randomIndex];
  }, [i18n.language, coachingGoal, t]);

  // İlerleme Puanı Hesaplama (Tüm Zamanlar Ortalaması)
  const calculateProgress = () => {
    if (!dailyMoods || dailyMoods.length === 0) return { score: 0, trend: 'up' }; // Veri yoksa hafif yukarı

    const moodScores = {
      '😍': 100,
      '🙂': 80,
      '😐': 60,
      '😕': 40,
      '😡': 20,
    };

    // Tarihe göre sırala
    const sortedMoods = [...dailyMoods].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Tüm zamanların ortalaması
    const total = sortedMoods.reduce((acc, item) => acc + (moodScores[item.mood] || 50), 0);
    const currentScore = Math.round(total / sortedMoods.length);

    // Trend Hesaplama (Son mood vs Önceki mood)
    let trend = 'up'; // Varsayılan olarak hafif yukarı
    if (sortedMoods.length >= 2) {
      const lastMood = sortedMoods[sortedMoods.length - 1];
      const prevMood = sortedMoods[sortedMoods.length - 2];
      const lastScore = moodScores[lastMood.mood] || 50;
      const prevScore = moodScores[prevMood.mood] || 50;

      if (lastScore > prevScore) {
        trend = 'up';
      } else if (lastScore < prevScore) {
        trend = 'down';
      } else {
        // Eşitse, hafif yukarı göster (düz çizgi olmasın)
        trend = 'up';
      }
    }

    return { score: currentScore, trend };
  };

  const progress = useMemo(() => calculateProgress(), [dailyMoods]);

  // Seri Hesaplama
  const calculateStreak = () => {
    if (!dailyMoods || dailyMoods.length === 0) return 0;

    const uniqueDates = [...new Set(dailyMoods.map(m => m.date))];
    let streak = 0;
    let checkDate = new Date();

    // Bugün girilmemişse, düne bak. Dün de yoksa seri 0'dır.
    let dateStr = checkDate.toISOString().split('T')[0];
    if (!uniqueDates.includes(dateStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
      dateStr = checkDate.toISOString().split('T')[0];
      if (!uniqueDates.includes(dateStr)) {
        return 0;
      }
    }

    // Geriye doğru say
    while (true) {
      const dStr = checkDate.toISOString().split('T')[0];
      if (uniqueDates.includes(dStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = useMemo(() => calculateStreak(), [dailyMoods]);

  const handleAddDate = () => {
    if (!newDateTitle || !newDateDay || !newDateMonth) {
      Alert.alert(t('modal.addDate.missingInfo'), t('modal.addDate.fillAllFields'));
      return;
    }

    const day = parseInt(newDateDay);
    const month = parseInt(newDateMonth);

    // Basic validation
    if (isNaN(day) || isNaN(month) || month < 1 || month > 12 || day < 1) {
      Alert.alert(t('modal.addDate.error'), t('modal.addDate.invalidDate'));
      return;
    }

    // Days in month validation
    const daysInMonth = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (day > daysInMonth[month]) {
      Alert.alert(t('modal.addDate.error'), t('modal.addDate.invalidDate'));
      return;
    }

    addSpecialDate({
      title: newDateTitle,
      day,
      month,
      relationshipId: selectedRelId
    });

    setNewDateTitle('');
    setNewDateDay('');
    setNewDateMonth('');
    setShowDateModal(false);
    Alert.alert(t('modal.addDate.success'), t('modal.addDate.dateAdded'));
  };

  const handleDeleteDate = (id) => {
    Alert.alert(
      t('modal.deleteDate.title'),
      t('modal.deleteDate.message'),
      [
        { text: t('modal.deleteDate.cancel'), style: "cancel" },
        {
          text: t('modal.deleteDate.delete'),
          style: "destructive",
          onPress: () => deleteSpecialDate(id)
        }
      ]
    );
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
    if (years === 0 && months === 0) return t('relationships.new');
    const yearsText = years > 0 ? `${years} ${t('partnerInfo.duration.yearsShort', { ns: 'onboarding' })}` : '';
    const monthsText = months > 0 ? `${months} ${t('partnerInfo.duration.monthsShort', { ns: 'onboarding' })}` : '';
    return [yearsText, monthsText].filter(Boolean).join(' ');
  };

  const getFormattedDate = () => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const localeMap = {
      'tr': 'tr-TR',
      'es': 'es-ES',
      'pt': 'pt-BR',
      'de': 'de-DE',
      'fr': 'fr-FR',
      'en': 'en-US',
    };

    const locale = localeMap[i18n.language] || 'en-US';
    const dateString = new Date().toLocaleDateString(locale, options);

    // Capitalize first letter strictly
    return dateString.charAt(0).toUpperCase() + dateString.slice(1);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Gradient Header Background */}
      <LinearGradient
        colors={['#66D9A1', '#4CAF50', '#FFF']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>{t('greeting')}</Text>
                <Text style={styles.userName}>{userName}</Text>
                <Text style={styles.dateText}>
                  {getFormattedDate()}
                </Text>

              </View>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate('ProfileTab')}
              >
                <Feather name="user" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Quick Stats Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.statsScroll}
              contentContainerStyle={styles.statsContainer}
            >
              <View style={styles.statPill}>
                <Feather name="heart" size={18} color="#FF6B9D" />
                <Text style={styles.statPillValue}>{relationships.length}</Text>
                <Text style={styles.statPillLabel}>{t('stats.relationships')}</Text>
              </View>

              <View style={styles.statPill}>
                <Feather
                  name={progress.trend === 'up' ? "trending-up" : "trending-down"}
                  size={18}
                  color={progress.trend === 'up' ? "#4CAF50" : "#FF5252"}
                />
                <Text style={styles.statPillValue}>
                  %{progress.score}
                </Text>
                <Text style={styles.statPillLabel}>{t('stats.relationshipScore')}</Text>
              </View>

              <View style={styles.statPill}>
                <Feather name="zap" size={18} color="#FFD93D" />
                <Text style={styles.statPillValue}>{streak} {t('stats.streak')}</Text>
                <Text style={styles.statPillLabel}>{t('stats.streakLabel')}</Text>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mood Check-in Section */}
        <View style={styles.moodSection}>
          <Text style={styles.sectionTitle}>{t('mood.title')}</Text>
          <Text style={styles.sectionSubtitle}>{t('mood.subtitle')}</Text>
          <View style={styles.moodContainer}>
            {['😡', '😕', '😐', '🙂', '😍'].map((emoji, index) => {
              const today = new Date().toISOString().split('T')[0];
              const todayMood = dailyMoods.find(m => m.date === today);
              const isSelected = todayMood && todayMood.mood === emoji;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.moodButton,
                    isSelected && styles.moodButtonSelected
                  ]}
                  onPress={() => addDailyMood(emoji)}
                >
                  <Text style={styles.moodEmoji}>{emoji}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Relationships Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('relationships.title')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AllRelationships')}>
            <Text style={styles.seeAllText}>{t('relationships.seeAll')}</Text>
          </TouchableOpacity>
        </View>

        {relationships.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Feather name="heart" size={48} color="#66D9A1" />
            </View>
            <Text style={styles.emptyTitle}>{t('relationships.empty.title')}</Text>
            <Text style={styles.emptyText}>
              {t('relationships.empty.subtitle')}
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.cardsScroll}
            contentContainerStyle={styles.cardsContainer}
          >
            {[...relationships].reverse().map((rel) => {
              const relInfo = getRelationshipInfo(rel.type);

              return (
                <TouchableOpacity
                  key={rel.id}
                  style={styles.relationshipCard}
                  activeOpacity={0.9}
                  onPress={() => {
                    setSelectedRelationshipForModal(rel);
                    setShowDetailModal(true);
                  }}
                >
                  <LinearGradient
                    colors={relInfo.gradient}
                    style={styles.cardGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.cardEmoji}>{relInfo.emoji}</Text>
                    <Text style={styles.cardName}>{rel.partnerName || t('relationships.unnamed')}</Text>
                    <Text style={styles.cardType}>{t(`relationshipType.${rel.type}`, { ns: 'onboarding' })}</Text>

                    <View style={styles.cardFooter}>
                      <View style={styles.durationBadge}>
                        <Feather name="clock" size={12} color="#FFF" />
                        <Text style={styles.durationText}>{getDurationText(rel.years, rel.months)}</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )
        }

        {/* Special Dates Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { flex: 1 }]}>{t('specialDates.title')}</Text>
          <TouchableOpacity onPress={() => setShowDateModal(true)} style={{ marginLeft: 16 }}>
            <Text style={styles.seeAllText}>{t('specialDates.add')}</Text>
          </TouchableOpacity>
        </View>

        {
          specialDates.length === 0 ? (
            <View style={styles.emptyDateState}>
              <Text style={styles.emptyDateText}>{t('specialDates.empty')}</Text>
              <TouchableOpacity onPress={() => setShowDateModal(true)}>
                <Text style={styles.addDateLink}>{t('specialDates.addNow')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesScroll}>
              {specialDates.map((date) => (
                <View key={date.id} style={styles.dateCard}>
                  <View style={styles.dateIconBox}>
                    <Text style={styles.dateDay}>{date.day}</Text>
                    <Text style={styles.dateMonth}>{t('specialDates.months', { returnObjects: true })[date.month - 1]}</Text>
                  </View>
                  <View style={styles.dateInfo}>
                    <Text style={styles.dateTitle}>{date.title}</Text>
                    <Text style={styles.dateRelName}>
                      {relationships.find(r => r.id === date.relationshipId)?.partnerName || t('specialDates.general')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteDate(date.id)}
                    style={styles.deleteDateButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Feather name="trash-2" size={18} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )
        }

        {/* Daily Tip Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('dailyTip.title')}</Text>
        </View>

        <View style={styles.tipCard}>
          <LinearGradient
            colors={['#FFF9C4', '#FFF59D']}
            style={styles.tipGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.tipHeader}>
              <View style={styles.tipIconContainer}>
                <Feather name="sun" size={20} color="#F57F17" />
              </View>
              <Text style={styles.tipLabel}>{t('dailyTip.from')}</Text>
            </View>
            <Text style={styles.tipText}>"{dailyTip}"</Text>
            {relationships.length > 0 && relationships[0].mainChallenge ? (
              <View style={styles.tipContextBox}>
                <Feather name="target" size={14} color="#F9A825" style={{ marginTop: 2 }} />
                <Text style={styles.tipContext}>
                  {t('dailyTip.focus')}: {relationships[0].mainChallenge}
                </Text>
              </View>
            ) : null}
          </LinearGradient>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView >

      {/* Floating Action Button */}
      < TouchableOpacity
        style={styles.fab}
        onPress={handleAddNew}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#66D9A1', '#4CAF50']}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Feather name="plus" size={28} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity >

      <Modal
        visible={showDateModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDateModal(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t('modal.addDate.title')}</Text>

              <Text style={styles.inputLabel}>{t('modal.addDate.titleLabel')}</Text>
              <TextInput
                style={styles.modalInput}
                placeholder={t('modal.addDate.titlePlaceholder')}
                value={newDateTitle}
                onChangeText={setNewDateTitle}
                maxLength={25}
              />

              <Text style={styles.inputLabel}>{t('modal.addDate.selectDate')}</Text>

              {Platform.OS === 'android' && (
                <TouchableOpacity
                  style={styles.modalInput}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={{ color: newDateDay ? '#333' : '#999' }}>
                    {newDateDay ? formatModalDate(datePickerDate) : t('modal.addDate.datePlaceholder')}
                  </Text>
                </TouchableOpacity>
              )}

              {(showDatePicker || Platform.OS === 'ios') && (
                <View style={Platform.OS === 'ios' ? styles.iosDatePickerContainer : {}}>
                  {Platform.OS === 'ios' && (
                    <TouchableOpacity
                      style={styles.modalInput}
                      onPress={() => setShowDatePicker(!showDatePicker)}
                    >
                      <Text style={{ color: newDateDay ? '#333' : '#999' }}>
                        {newDateDay ? formatModalDate(datePickerDate) : t('modal.addDate.datePlaceholder')}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {showDatePicker && (
                    <View>
                      <DateTimePicker
                        value={datePickerDate}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={handleDateChange}
                        minimumDate={new Date(new Date().getFullYear(), 0, 1)}
                        maximumDate={new Date(new Date().getFullYear(), 11, 31)}
                        style={Platform.OS === 'ios' ? { height: 120, width: '100%', backgroundColor: 'white' } : {}}
                        themeVariant="light"
                        textColor="#000000"
                        accentColor="#4CAF50"
                        locale={{
                          'tr': 'tr-TR',
                          'es': 'es-ES',
                          'pt': 'pt-BR',
                          'de': 'de-DE',
                          'fr': 'fr-FR',
                          'en': 'en-US',
                        }[i18n.language] || 'en-US'}
                      />
                      {Platform.OS === 'ios' && (
                        <TouchableOpacity
                          style={styles.datePickerDoneButton}
                          onPress={() => setShowDatePicker(false)}
                        >
                          <Text style={styles.datePickerDoneText}>{t('modal.addDate.done')}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              )}

              <Text style={styles.inputLabel}>{t('modal.addDate.selectRelationship')}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }} keyboardShouldPersistTaps='handled'>
                {relationships.map(rel => (
                  <TouchableOpacity
                    key={rel.id}
                    style={[
                      styles.relSelectChip,
                      selectedRelId === rel.id && styles.relSelectChipActive
                    ]}
                    onPress={() => setSelectedRelId(rel.id)}
                  >
                    <Text style={[
                      styles.relSelectText,
                      selectedRelId === rel.id && styles.relSelectTextActive
                    ]}>{rel.partnerName}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowDateModal(false)}
                >
                  <Text style={styles.modalCancelText}>{t('modal.addDate.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalSaveButton}
                  onPress={handleAddDate}
                >
                  <Text style={styles.modalSaveText}>{t('modal.addDate.save')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
                      {t('modal.relationshipDetail.duration')}: <Text style={styles.detailRowValue}>{getDurationText(selectedRelationshipForModal.years, selectedRelationshipForModal.months)}</Text>
                    </Text>
                  </View>

                  {selectedRelationshipForModal.mainChallenge ? (
                    <View style={styles.detailChallengeBox}>
                      <Text style={styles.detailChallengeLabel}>{t('modal.relationshipDetail.focusLabel')}:</Text>
                      <Text style={styles.detailChallengeText}>"{selectedRelationshipForModal.mainChallenge}"</Text>
                    </View>
                  ) : null}
                </View>

                <View style={styles.detailActions}>
                  <TouchableOpacity
                    style={styles.actionButtonPrimary}
                    onPress={() => {
                      setShowDetailModal(false);
                      navigation.navigate('ChatTab', { initialRelationshipId: selectedRelationshipForModal.id });
                    }}
                  >
                    <LinearGradient
                      colors={['#66D9A1', '#4CAF50']}
                      style={styles.actionGradient}
                    >
                      <Feather name="message-circle" size={20} color="#FFF" />
                      <Text style={styles.actionTextPrimary}>{t('modal.relationshipDetail.chat')}</Text>
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
                      <Text style={styles.actionTextSecondary}>{t('modal.relationshipDetail.edit')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionButtonDelete}
                      onPress={() => {
                        setShowDetailModal(false);
                        deleteRelationship(selectedRelationshipForModal.id);
                      }}
                    >
                      <Feather name="trash-2" size={18} color="#FF6B6B" />
                      <Text style={styles.actionTextDelete}>{t('modal.relationshipDetail.delete')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerGradient: {
    paddingBottom: 30,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
    opacity: 0.9,
  },
  userName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    marginTop: 4,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#FFF',
    opacity: 0.8,
    fontWeight: '500',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  statsScroll: {
    marginTop: 10,
  },
  statsContainer: {
    paddingRight: 20,
    gap: 12,
  },
  statPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statPillValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 4,
  },
  statPillLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 10,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  seeAllText: {
    fontSize: 14,
    color: '#66D9A1',
    fontWeight: '600',
  },
  cardsScroll: {
    marginBottom: 20,
  },
  cardsContainer: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  relationshipCard: {
    width: 180,
    height: 220,
    marginRight: 16,
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
  cardEmoji: {
    fontSize: 48,
    marginTop: 10,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 8,
  },
  cardType: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  cardFooter: {
    marginTop: 12,
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
    marginHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E8F5E9',
    borderStyle: 'dashed',
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F9F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  moodSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    marginTop: 4,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  moodButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodButtonSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
    transform: [{ scale: 1.1 }],
  },
  moodEmoji: {
    fontSize: 24,
  },
  emptyDateState: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  emptyDateText: {
    color: '#999',
    marginBottom: 8,
  },
  addDateLink: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  datesScroll: {
    paddingLeft: 20,
    marginBottom: 10,
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 16,
    marginRight: 12,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dateIconBox: {
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 12,
  },
  dateDay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  dateMonth: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dateInfo: {
    flex: 1,
  },
  dateTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  dateRelName: {
    fontSize: 11,
    color: '#999',
  },
  deleteDateButton: {
    padding: 8,
  },
  tipCard: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#F9A825',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  tipGradient: {
    padding: 24,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  tipLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F57F17',
  },
  tipText: {
    fontSize: 16,
    color: '#424242',
    lineHeight: 24,
    fontStyle: 'italic',
  },
  tipContextBox: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipContext: {
    fontSize: 12,
    color: '#F9A825',
    flex: 1,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 80,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabGradient: {
    flex: 1,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginLeft: 4,
  },
  modalInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#2C3E50',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginBottom: 20,
  },
  dateRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  relSelectChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F0F2F5',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  relSelectChipActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  relSelectText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  relSelectTextActive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  modalCancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  modalSaveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
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
  iosDatePickerContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 10,
    overflow: 'hidden',
  },
  datePickerDoneButton: {
    backgroundColor: '#FFF',
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  datePickerDoneText: {
    color: '#FF5252',
    fontWeight: '600',
    fontSize: 16,
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
