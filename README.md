# 🔐 Sona - Güvenli İlişki Koçu Uygulaması

<p align="center">
  <img src="https://github.com/user-attachments/assets/17e13db6-cd72-449e-9d45-47af54455cc1" width="200" alt="onboarding" />
  <img src="https://github.com/user-attachments/assets/a8bd5700-040b-41bb-a544-ab6754795748" width="200" alt="anasayfa" />
  <img src="https://github.com/user-attachments/assets/dc896056-5c73-4be1-a5b6-28ea0c02b9af" width="200" alt="chat" />
  <img src="https://github.com/user-attachments/assets/d42fab48-2f3f-421e-81c6-3b2a18e908c7" width="200" alt="profil" />
</p>

## 📱 Uygulama Hakkında

Sona, yapay zeka destekli kişisel ilişki koçunuzdur. İlişkilerinizi güçlendirin, iletişim becerilerinizi geliştirin ve duygusal zekânızı artırın.

### ✨ Özellikler
- 🤖 Google Gemini AI ile kişiselleştirilmiş koçluk
- 💕 Çoklu ilişki yönetimi (romantik, aile, arkadaş, iş)
- 📅 Özel gün hatırlatıcıları
- 📊 İlerleme takibi ve istatistikler
- 🔒 Biyometrik güvenlik kilidi
- 🎨 Modern ve kullanıcı dostu arayüz

---

## 🔐 GÜVENLİK ÖNCELİĞİMİZ

### Verileriniz Tamamen Güvende
- ✅ **Tüm veriler cihazınızda** saklanır
- ✅ **iOS Keychain** ve **Android Keystore** ile şifrelenir
- ✅ **Sunucularımızda veri saklanmaz**
- ✅ **API anahtarları gizli** (environment variables)
- ✅ **Gereksiz izinler yok** (konum, kamera, mikrofon)

### Yasal Uyumluluk
- ✅ GDPR uyumlu
- ✅ KVKK uyumlu
- ✅ Gizlilik Politikası: [PRIVACY_POLICY.md](./PRIVACY_POLICY.md)
- ✅ Kullanım Koşulları: [TERMS_OF_SERVICE.md](./TERMS_OF_SERVICE.md)

---

## 🚀 Kurulum (Geliştirici)

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Expo CLI
- iOS Simulator veya Android Emulator

### Adımlar

1. **Projeyi klonla**
\`\`\`bash
git clone https://github.com/SertacKahraman/Sona.git
cd Sona
\`\`\`

2. **Bağımlılıkları yükle**
\`\`\`bash
npm install
\`\`\`

3. **Environment variables ayarla**
\`\`\`bash
# .env dosyası oluştur
cp .env.example .env

# .env dosyasını düzenle ve API anahtarını ekle
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here
\`\`\`

4. **Uygulamayı çalıştır**
\`\`\`bash
npx expo start
\`\`\`

---

## 📦 Production Build

### EAS Build ile

1. **EAS CLI kur**
\`\`\`bash
npm install -g eas-cli
\`\`\`

2. **EAS'a giriş yap**
\`\`\`bash
eas login
\`\`\`

3. **Build yap**
\`\`\`bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
\`\`\`

4. **Store'a gönder**
\`\`\`bash
# iOS
eas submit --platform ios

# Android
eas submit --platform android
\`\`\`

---

## 🔧 Teknoloji Stack

- **Framework**: React Native (Expo SDK 54)
- **Navigation**: React Navigation
- **State**: Context API
- **Storage**: Expo SecureStore + AsyncStorage
- **AI**: Google Gemini AI
- **UI**: Expo Linear Gradient, Feather Icons
- **Notifications**: Expo Notifications
- **Auth**: Expo Local Authentication

---

## 📁 Proje Yapısı

\`\`\`
expo-app/
├── src/
│   ├── config/
│   │   └── Config.js              # Yapılandırma (API keys)
│   ├── constants/
│   │   └── relationships.js       # İlişki tipleri
│   ├── context/
│   │   └── AppContext.js          # Global state management
│   ├── navigation/
│   │   └── AppNavigator.js        # Navigation yapısı
│   ├── screens/
│   │   ├── main/
│   │   │   ├── HomeScreen.js      # Ana sayfa
│   │   │   ├── ChatScreen.js      # AI sohbet
│   │   │   ├── ProfileScreen.js   # Profil
│   │   │   └── AllRelationshipsScreen.js
│   │   └── onboarding/
│   │       ├── WelcomeScreen.js
│   │       ├── NameScreen.js
│   │       ├── PersonalInfoScreen.js
│   │       ├── RelationshipTypeScreen.js
│   │       ├── PartnerInfoScreen.js
│   │       └── RelationshipContextScreen.js
│   └── services/
│       ├── ChatService.js         # AI servisi
│       └── SecureStorage.js       # Güvenli depolama
├── assets/                        # Görseller
├── docs/                          # Dokümantasyon
│   ├── PRIVACY_POLICY.md
│   └── TERMS_OF_SERVICE.md
├── .env                           # Environment variables (GİZLİ!)
├── .env.example                   # Environment şablonu
├── app.json                       # Expo yapılandırması
├── eas.json                       # EAS Build yapılandırması
└── README.md                      # Bu dosya
\`\`\`

---

## 🛡️ Güvenlik

### Hassas Veri Yönetimi
- Kullanıcı bilgileri → **SecureStore** (şifreli)
- İlişki verileri → **SecureStore** (şifreli)
- Sohbet geçmişi → **SecureStore** (şifreli)
- Ayarlar → AsyncStorage (hassas değil)

### API Güvenliği
- API anahtarları `.env` dosyasında
- `.env` dosyası `.gitignore`'da
- Production'da EAS Secrets kullanılır

---

## 📄 Lisans

Bu proje özel mülkiyettir. Tüm hakları saklıdır.

---

## 📞 İletişim

- **Geliştirici**: Sertaç Kahraman
- **GitHub**: [SertacKahraman](https://github.com/SertacKahraman)
- **Email**: sertackahraman2@gmail.com

---

## ⚠️ Önemli Uyarılar

### Kullanıcılar İçin
- ⚠️ Sona bir terapist, psikolog veya doktor DEĞİLDİR
- ⚠️ Acil durumlarda profesyonel yardım alın
- ⚠️ Türkiye Acil Hatlar: 182 (Psikolojik Destek), 183 (Şiddet Hattı)

### Geliştiriciler İçin
- ⚠️ API anahtarını ASLA GitHub'a push etme
- ⚠️ Production build öncesi güvenlik kontrol listesini gözden geçir
- ⚠️ Gizlilik politikasını bir avukata göster

---


**Sona ile ilişkilerinizi güçlendirin! 💕**
