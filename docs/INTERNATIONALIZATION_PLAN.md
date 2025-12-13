# 🌍 Sona - Çoklu Dil Desteği (i18n) Uygulama Planı

**Tarih:** 12 Aralık 2025  
**Hedef:** Türkçe ve İngilizce dil desteği eklemek  
**Otomatik Dil Seçimi:** Cihaz diline göre (TR → Türkçe, diğerleri → İngilizce)

---

## 📋 GENEL BAKIŞ

### Hedefler
- ✅ Türkçe ve İngilizce tam destek
- ✅ Otomatik dil algılama (cihaz diline göre)
- ✅ Kullanıcı manuel dil değiştirebilsin
- ✅ Tüm ekranlar çevrilsin
- ✅ AI yanıtları kullanıcının diline göre gelsin

### Kullanılacak Kütüphane
**i18next + react-i18next**
- React Native için en popüler i18n çözümü
- Async storage ile dil tercihi saklama
- Cihaz dilini otomatik algılama
- TypeScript desteği (opsiyonel)

---

## 🗂️ DOSYA YAPISI

```
src/
├── locales/
│   ├── index.js              # i18n yapılandırması
│   ├── tr/
│   │   ├── common.json       # Ortak metinler (butonlar, hatalar)
│   │   ├── onboarding.json   # Onboarding ekranları
│   │   ├── home.json         # Ana sayfa
│   │   ├── chat.json         # Sohbet ekranı
│   │   ├── profile.json      # Profil ekranı
│   │   └── legal.json        # Yasal metinler
│   └── en/
│       ├── common.json
│       ├── onboarding.json
│       ├── home.json
│       ├── chat.json
│       ├── profile.json
│       └── legal.json
```

---

## 📦 KURULUM ADIMLARI

### Adım 1: Kütüphaneleri Yükle
```bash
npm install i18next react-i18next
npm install @react-native-async-storage/async-storage  # Zaten mevcut
npm install expo-localization
```

### Adım 2: i18n Yapılandırması Oluştur
**Dosya:** `src/locales/index.js`

### Adım 3: Çeviri Dosyalarını Oluştur
**6 dosya x 2 dil = 12 JSON dosyası**

### Adım 4: AppContext'e Dil Yönetimi Ekle
- Dil tercihi state'i
- Dil değiştirme fonksiyonu
- AsyncStorage'da saklama

### Adım 5: Tüm Ekranları Güncelle
- Hardcoded metinleri `t('key')` ile değiştir
- 13 ekran dosyası güncellenecek

### Adım 6: AI Prompt'ları Güncelle
- ChatService'de kullanıcının diline göre prompt oluştur

---

## 🔤 ÇEVİRİ ANAHTARLARI YAPISI

### Örnek: `common.json`
```json
{
  "buttons": {
    "continue": "Devam Et",
    "back": "Geri",
    "save": "Kaydet",
    "cancel": "İptal",
    "delete": "Sil",
    "edit": "Düzenle",
    "logout": "Çıkış Yap"
  },
  "errors": {
    "network": "İnternet bağlantınızı kontrol edin",
    "required": "Bu alan zorunludur",
    "unknown": "Bir hata oluştu"
  },
  "loading": "Yükleniyor...",
  "success": "Başarılı!"
}
```

### Örnek: `onboarding.json`
```json
{
  "welcome": {
    "title": "Sona'ya Hoş Geldin! 👋",
    "subtitle": "Yapay Zeka Destekli İlişki Koçun",
    "description": "İlişkilerini güçlendir, iletişim becerilerini geliştir"
  },
  "legal": {
    "title": "Gizlilik & Güvenlik",
    "subtitle": "Verileriniz bizim için önemli",
    "accept": "Kullanıcı Sözleşmesi ve Gizlilik Politikası'nı okudum, anladım ve kabul ediyorum"
  }
}
```

---

## 🎯 UYGULAMA PLANI (ADIM ADIM)

### Faz 1: Altyapı Kurulumu (30 dk)
- [x] Plan dokümantasyonu oluştur
- [ ] Kütüphaneleri yükle
- [ ] i18n yapılandırması oluştur
- [ ] Klasör yapısını oluştur

### Faz 2: Çeviri Dosyaları (2 saat)
- [ ] `common.json` (TR + EN)
- [ ] `onboarding.json` (TR + EN)
- [ ] `home.json` (TR + EN)
- [ ] `chat.json` (TR + EN)
- [ ] `profile.json` (TR + EN)
- [ ] `legal.json` (TR + EN)

### Faz 3: AppContext Entegrasyonu (30 dk)
- [ ] Dil state'i ekle
- [ ] Dil değiştirme fonksiyonu
- [ ] AsyncStorage entegrasyonu
- [ ] Cihaz dili algılama

### Faz 4: Ekran Güncellemeleri (3 saat)
**Onboarding Ekranları (8 dosya):**
- [ ] LegalScreen.js
- [ ] WelcomeScreen.js
- [ ] NameScreen.js
- [ ] PersonalInfoScreen.js
- [ ] RelationshipTypeScreen.js
- [ ] PartnerInfoScreen.js
- [ ] RelationshipContextScreen.js
- [ ] DocumentViewerScreen.js

**Ana Ekranlar (4 dosya):**
- [ ] HomeScreen.js
- [ ] ChatScreen.js
- [ ] ProfileScreen.js
- [ ] AllRelationshipsScreen.js

**Diğer:**
- [ ] LockScreen.js

### Faz 5: AI Entegrasyonu (30 dk)
- [ ] ChatService.js - Dil bazlı prompt
- [ ] Türkçe/İngilizce AI yanıtları

### Faz 6: Test & Doğrulama (1 saat)
- [ ] Türkçe cihazda test
- [ ] İngilizce cihazda test
- [ ] Dil değiştirme testi
- [ ] Tüm ekranları kontrol

---

## 💻 KOD ÖRNEKLERİ

### 1. i18n Yapılandırması
```javascript
// src/locales/index.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Çeviri dosyaları
import commonTR from './tr/common.json';
import commonEN from './en/common.json';
import onboardingTR from './tr/onboarding.json';
import onboardingEN from './en/onboarding.json';
// ... diğer dosyalar

const LANGUAGE_STORAGE_KEY = 'user_language';

// Cihaz dilini al
const getDeviceLanguage = () => {
  const locale = Localization.locale; // "tr-TR", "en-US", vb.
  return locale.startsWith('tr') ? 'tr' : 'en';
};

// Kaydedilmiş dili al veya cihaz dilini kullan
const getStoredLanguage = async () => {
  try {
    const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored || getDeviceLanguage();
  } catch {
    return getDeviceLanguage();
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      tr: {
        common: commonTR,
        onboarding: onboardingTR,
        // ... diğer namespace'ler
      },
      en: {
        common: commonEN,
        onboarding: onboardingEN,
        // ... diğer namespace'ler
      }
    },
    lng: getDeviceLanguage(), // Başlangıç dili
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    }
  });

// Kaydedilmiş dili yükle
getStoredLanguage().then(lang => {
  i18n.changeLanguage(lang);
});

export default i18n;
```

### 2. AppContext'e Dil Desteği
```javascript
// src/context/AppContext.js
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const changeLanguage = async (lang) => {
    try {
      await i18n.changeLanguage(lang);
      await AsyncStorage.setItem('user_language', lang);
      setCurrentLanguage(lang);
    } catch (error) {
      console.error('Dil değiştirme hatası:', error);
    }
  };

  return (
    <AppContext.Provider value={{
      // ... mevcut değerler
      currentLanguage,
      changeLanguage
    }}>
      {children}
    </AppContext.Provider>
  );
};
```

### 3. Ekranlarda Kullanım
```javascript
// Örnek: WelcomeScreen.js
import { useTranslation } from 'react-i18next';

export default function WelcomeScreen({ navigation }) {
  const { t } = useTranslation('onboarding');

  return (
    <View>
      <Text style={styles.title}>{t('welcome.title')}</Text>
      <Text style={styles.subtitle}>{t('welcome.subtitle')}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Name')}>
        <Text>{t('common:buttons.continue')}</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### 4. AI Prompt Dil Desteği
```javascript
// src/services/ChatService.js
const createSystemPrompt = (context, language) => {
  const prompts = {
    tr: `
      ### KİMLİK VE ROL
      Senin adın **Sona**. Sen, kullanıcıların duygusal zekalarını geliştirmelerine...
    `,
    en: `
      ### IDENTITY AND ROLE
      Your name is **Sona**. You are a world-class **AI Relationship Coach** designed to help users...
    `
  };
  
  return prompts[language] || prompts.en;
};

export const generateChatResponse = async (message, history, context, language = 'tr') => {
  const systemPrompt = createSystemPrompt(context, language);
  // ... rest of the code
};
```

---

## 🌐 DİL DEĞİŞTİRME UI

### ProfileScreen'e Dil Seçeneği Ekle
```javascript
// ProfileScreen.js
<View style={styles.section}>
  <Text style={styles.sectionTitle}>{t('profile.language')}</Text>
  <View style={styles.infoCard}>
    <TouchableOpacity 
      style={styles.languageOption}
      onPress={() => changeLanguage('tr')}
    >
      <Text>🇹🇷 Türkçe</Text>
      {currentLanguage === 'tr' && <Feather name="check" />}
    </TouchableOpacity>
    
    <View style={styles.divider} />
    
    <TouchableOpacity 
      style={styles.languageOption}
      onPress={() => changeLanguage('en')}
    >
      <Text>🇬🇧 English</Text>
      {currentLanguage === 'en' && <Feather name="check" />}
    </TouchableOpacity>
  </View>
</View>
```

---

## 📝 ÇEVİRİ ÖNCELİKLERİ

### Yüksek Öncelik (Kullanıcı Her Zaman Görür)
1. **Onboarding** - İlk izlenim çok önemli
2. **Home Screen** - En çok kullanılan ekran
3. **Chat Screen** - Ana özellik
4. **Common** - Butonlar, hatalar

### Orta Öncelik
5. **Profile Screen** - Ayarlar ve bilgiler
6. **Legal** - Gizlilik ve kullanım koşulları

### Düşük Öncelik
7. **Error Messages** - Detaylı hata mesajları

---

## 🧪 TEST SENARYOLARI

### Test 1: Otomatik Dil Algılama
1. Uygulamayı ilk kez yükle
2. Cihaz dili TR → Uygulama Türkçe olmalı
3. Cihaz dili EN → Uygulama İngilizce olmalı

### Test 2: Manuel Dil Değiştirme
1. Profile → Dil Ayarları
2. İngilizce seç
3. Tüm ekranlar İngilizce'ye geçmeli
4. Uygulamayı kapat-aç → İngilizce kalmalı

### Test 3: AI Yanıtları
1. Türkçe modda sohbet → AI Türkçe yanıt vermeli
2. İngilizce'ye geç → AI İngilizce yanıt vermeli

### Test 4: Eksik Çeviri
1. Bir key çevrilmemişse → Fallback (EN) göstermeli
2. Console'da uyarı vermeli

---

## 📊 ÇALIŞMA TAHMİNİ

| Faz | Süre | Açıklama |
|-----|------|----------|
| Altyapı Kurulumu | 30 dk | Kütüphaneler, yapılandırma |
| Çeviri Dosyaları | 2 saat | 12 JSON dosyası oluşturma |
| AppContext | 30 dk | Dil yönetimi entegrasyonu |
| Ekran Güncellemeleri | 3 saat | 13 ekran dosyası |
| AI Entegrasyonu | 30 dk | ChatService güncelleme |
| Test & Doğrulama | 1 saat | Tüm senaryolar |
| **TOPLAM** | **~8 saat** | 1 iş günü |

---

## ⚠️ DİKKAT EDİLECEK NOKTALAR

### 1. Metin Uzunlukları
- İngilizce metinler genelde %30 daha uzun
- UI tasarımı esnek olmalı
- Buton genişlikleri dinamik

### 2. Tarih ve Sayı Formatları
```javascript
// Tarih formatı
const date = new Date();
date.toLocaleDateString(i18n.language === 'tr' ? 'tr-TR' : 'en-US');

// Sayı formatı
const number = 1234.56;
number.toLocaleString(i18n.language === 'tr' ? 'tr-TR' : 'en-US');
```

### 3. Çoğul Formlar
```json
{
  "messages": {
    "one": "{{count}} mesaj",
    "other": "{{count}} mesaj"
  }
}
```

### 4. Cinsiyet ve Kültürel Farklılıklar
- Türkçe'de "Sen/Siz" farkı
- İngilizce'de "You" tek form
- Kültürel referanslar dikkatli çevrilmeli

---

## 🚀 UYGULAMA BAŞLATMA

### Şimdi Başlayalım!
```bash
# 1. Kütüphaneleri yükle
npm install i18next react-i18next expo-localization

# 2. Klasör yapısını oluştur
mkdir -p src/locales/tr src/locales/en

# 3. Çeviri dosyalarını oluştur
# (Otomatik olarak yapılacak)

# 4. Ekranları güncelle
# (Adım adım yapılacak)
```

---

## 📈 BAŞARI KRİTERLERİ

- [ ] Türk kullanıcılar otomatik Türkçe görür
- [ ] Yabancı kullanıcılar otomatik İngilizce görür
- [ ] Kullanıcı manuel dil değiştirebilir
- [ ] Dil tercihi kalıcı saklanır
- [ ] AI yanıtları doğru dilde gelir
- [ ] Tüm ekranlar çevrilmiş
- [ ] Hiçbir hardcoded metin kalmamış
- [ ] App Store'da hem TR hem EN açıklama var

---

**Hazır mısınız? Hemen başlayalım! 🚀**
