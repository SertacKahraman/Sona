# 📱 App Store Yayınlama Öncesi Detaylı Kontrol Listesi

**Uygulama:** Sona - Kişisel İlişki Asistanı  
**Analiz Tarihi:** 12 Aralık 2025  
**Hedef Platformlar:** iOS App Store & Google Play Store

---

## 🔴 KRİTİK ÖNEME SAHİP DEĞIŞIKLIKLER (ZORUNLU)

### 1. ⚠️ API Anahtarı Güvenliği
**Durum:** ❌ KRİTİK SORUN  
**Sorun:** API anahtarı `.env` dosyasında ancak production build için EAS Secrets kullanılmalı

**Yapılması Gerekenler:**
```bash
# EAS Secrets ile API anahtarını ekle
eas secret:create --scope project --name EXPO_PUBLIC_GEMINI_API_KEY --value "YOUR_ACTUAL_API_KEY"

# Doğrula
eas secret:list
```

**Dosyalar:**
- ✅ `.gitignore` - `.env` dosyası zaten ignore edilmiş
- ⚠️ `eas.json` - API anahtarı boş string olarak ayarlanmış (doğru)
- ⚠️ Production build öncesi EAS Secrets mutlaka yapılandırılmalı

---

### 2. 📧 İletişim Bilgileri Eksik
**Durum:** ❌ KRİTİK SORUN  
**Sorun:** Gizlilik Politikası ve Kullanım Koşullarında placeholder metinler var

**Değiştirilmesi Gereken Dosyalar:**

#### `docs/PRIVACY_POLICY.md`
- **Satır 84:** `[email adresiniz]` → Gerçek e-posta adresi
- **Satır 85:** `[web siteniz]` → Gerçek web sitesi veya destek URL'i

#### `docs/TERMS_OF_SERVICE.md`
- **Satır 93:** `[email adresiniz]` → Gerçek e-posta adresi
- **Satır 94:** `[web siteniz]` → Gerçek web sitesi veya destek URL'i

**Önerilen Değerler:**
```markdown
- Email: sertackahraman2@gmail.com
- Web: https://sona-app.com (veya bir destek sayfası oluştur)
```

---

### 3. 🍎 Apple Developer Bilgileri
**Durum:** ❌ KRİTİK SORUN  
**Sorun:** `eas.json` dosyasında placeholder değerler var

**Değiştirilmesi Gereken:** `eas.json` (Satır 36-38)
```json
"ios": {
  "appleId": "sertackahraman2@gmail.com",  // Gerçek Apple ID
  "ascAppId": "1234567890",                 // App Store Connect'ten al
  "appleTeamId": "ABCD123456"               // Apple Developer Team ID
}
```

**Nasıl Bulunur:**
- **Apple ID:** Apple Developer hesabınızın e-postası
- **ASC App ID:** App Store Connect → My Apps → App Information → Apple ID
- **Team ID:** developer.apple.com → Membership → Team ID

---

### 4. 🤖 Android Service Account
**Durum:** ⚠️ GOOGLE PLAY İÇİN GEREKLİ  
**Sorun:** Google Play yayınlama için service account key eksik

**Yapılması Gereken:**
1. Google Play Console → Setup → API Access → Create Service Account
2. JSON key dosyasını indir
3. `eas.json` dosyasını güncelle:
```json
"android": {
  "serviceAccountKeyPath": "./google-play-service-account.json",
  "track": "internal"  // veya "alpha", "beta", "production"
}
```
4. **ÖNEMLİ:** JSON dosyasını `.gitignore`'a ekle!

---

### 5. 🐛 Debug Console Logları
**Durum:** ⚠️ ORTA ÖNCELİK  
**Sorun:** Production'da console.log çıktıları olmamalı

**Temizlenmesi Gereken Dosyalar:**

#### `src/services/ChatService.js`
- Satır 65: `console.log(\`Model deneniyor: ${modelId}\`);` → Kaldır
- Satır 80-86: Debug logları → Kaldır veya `__DEV__` ile koru

#### `src/context/AppContext.js`
- Satır 219: `console.log('Bildirim planlanamadı:', notifError);` → Kaldır
- Satır 306: `console.log('Logout successful - all data cleared');` → Kaldır

**Önerilen Çözüm:**
```javascript
// Debug modda çalışan log wrapper
const debugLog = (...args) => {
  if (__DEV__) {
    console.log(...args);
  }
};
```

---

## 🟡 ÖNEMLİ İYİLEŞTİRMELER (ÖNERİLEN)

### 6. 📱 App Store Metadata
**Durum:** ⚠️ EKSİK  
**Gerekli Materyaller:**

#### App Store Connect'e Yüklenecekler:
- [ ] **App İkonu** (1024x1024 PNG, şeffaflık yok)
  - Mevcut: `assets/icon.png` (1036100 bytes) ✅
  - Kontrol edilmeli: Boyut ve format doğru mu?

- [ ] **Ekran Görüntüleri** (Her cihaz boyutu için)
  - iPhone 6.7" (1290x2796) - 3-10 adet
  - iPhone 6.5" (1242x2688) - 3-10 adet
  - iPhone 5.5" (1242x2208) - 3-10 adet
  - iPad Pro 12.9" (2048x2732) - 3-10 adet

- [ ] **Uygulama Açıklaması** (Türkçe & İngilizce)
  ```
  Kısa Açıklama (30 karakter):
  "Yapay Zeka İlişki Koçu"
  
  Uzun Açıklama (4000 karakter):
  [Mevcut README.md'den uyarlanabilir]
  ```

- [ ] **Anahtar Kelimeler** (100 karakter, virgülle ayrılmış)
  ```
  ilişki,koçluk,yapay zeka,iletişim,duygusal zeka,terapi,psikoloji,partner,evlilik,aile
  ```

- [ ] **Destek URL'i**
  - Örnek: `https://sona-app.com/support`

- [ ] **Pazarlama URL'i** (Opsiyonel)
  - Örnek: `https://sona-app.com`

- [ ] **Gizlilik Politikası URL'i** (ZORUNLU)
  - Bir web sitesinde yayınlanmalı
  - Örnek: `https://sona-app.com/privacy`

---

### 7. 🔒 Güvenlik İyileştirmeleri

#### a) SSL Pinning (Gelecek için)
**Öncelik:** Düşük  
**Açıklama:** API istekleri için SSL pinning eklenebilir (şu an gerekli değil)

#### b) Kod Obfuscation
**Öncelik:** Orta  
**Açıklama:** React Native için ProGuard/R8 (Android) ve bitcode (iOS) kullanılabilir

#### c) Jailbreak/Root Detection
**Öncelik:** Düşük  
**Açıklama:** Hassas veriler cihazda saklandığı için opsiyonel

---

### 8. 📊 Analytics & Crash Reporting
**Durum:** ❌ EKSİK  
**Öneri:** Production'da hata takibi için analytics ekle

**Önerilen Servisler:**
- **Sentry** (Crash reporting) - Ücretsiz tier yeterli
- **Firebase Analytics** (Kullanıcı davranışı)
- **Expo Analytics** (Built-in)

**Kurulum:**
```bash
npx expo install @sentry/react-native
```

---

### 9. 🌐 Çoklu Dil Desteği
**Durum:** ⚠️ SADECE TÜRKÇE  
**Öneri:** İngilizce desteği ekle (App Store'da daha geniş kitle)

**Yapılacaklar:**
- [ ] `i18n` kütüphanesi ekle
- [ ] Tüm metinleri çevir
- [ ] Gizlilik Politikası ve Kullanım Koşullarını İngilizce'ye çevir

---

### 10. ♿ Erişilebilirlik (Accessibility)
**Durum:** ⚠️ TEMEL SEVİYE  
**İyileştirmeler:**

```javascript
// Örnek: TouchableOpacity'lere accessibilityLabel ekle
<TouchableOpacity
  accessibilityLabel="Profili düzenle"
  accessibilityHint="Profil bilgilerinizi güncellemek için dokunun"
  accessibilityRole="button"
>
  <Feather name="edit-2" size={20} color="#FFF" />
</TouchableOpacity>
```

**Kontrol Edilecekler:**
- [ ] Tüm butonlarda `accessibilityLabel`
- [ ] Tüm inputlarda `accessibilityLabel` ve `accessibilityHint`
- [ ] Renk kontrastı (WCAG 2.1 AA standardı)
- [ ] Ekran okuyucu testi (iOS VoiceOver, Android TalkBack)

---

## 🟢 İYİ UYGULAMALAR (MEVCUT)

### ✅ Güvenlik
- [x] Veriler cihazda şifreli (SecureStore)
- [x] Biyometrik kimlik doğrulama
- [x] Gereksiz izinler engellenmiş
- [x] GDPR/KVKK uyumlu gizlilik politikası

### ✅ Kullanıcı Deneyimi
- [x] Modern ve kullanıcı dostu arayüz
- [x] Onboarding akışı
- [x] Hata yönetimi (try-catch blokları)
- [x] Loading states

### ✅ Kod Kalitesi
- [x] Temiz kod yapısı
- [x] Context API ile state yönetimi
- [x] Modüler dosya yapısı

---

## 📋 YAYINLAMA ADIM ADIM KONTROL LİSTESİ

### Ön Hazırlık (1-2 Gün)
- [ ] 1. API anahtarını EAS Secrets'a ekle
- [ ] 2. İletişim bilgilerini güncelle (email, web)
- [ ] 3. Apple Developer bilgilerini `eas.json`'a ekle
- [ ] 4. Google Play Service Account oluştur
- [ ] 5. Console.log'ları temizle veya `__DEV__` ile koru
- [ ] 6. Gizlilik Politikası ve Kullanım Koşullarını web'de yayınla

### App Store Hazırlık (1 Gün)
- [ ] 7. App ikonu kontrolü (1024x1024)
- [ ] 8. Ekran görüntüleri hazırla (tüm cihaz boyutları)
- [ ] 9. Uygulama açıklaması yaz (TR + EN)
- [ ] 10. Anahtar kelimeleri belirle
- [ ] 11. Destek ve pazarlama URL'lerini hazırla

### Build & Test (1-2 Gün)
- [ ] 12. Production build oluştur: `eas build --platform ios --profile production`
- [ ] 13. TestFlight'ta internal test
- [ ] 14. Gerçek cihazda test (iPhone + iPad)
- [ ] 15. Tüm özellikleri test et (biyometrik, bildirimler, vb.)
- [ ] 16. Crash ve hata kontrolü

### Yayınlama (1 Gün)
- [ ] 17. App Store Connect'e yükle: `eas submit --platform ios`
- [ ] 18. Metadata'yı doldur
- [ ] 19. Review için gönder
- [ ] 20. Apple'ın review sürecini bekle (1-3 gün)

### Google Play (Paralel)
- [ ] 21. Android build: `eas build --platform android --profile production`
- [ ] 22. Google Play Console'a yükle
- [ ] 23. Store listing'i doldur
- [ ] 24. Internal test track'e yükle
- [ ] 25. Production'a yükselt

---

## ⚠️ APPLE REVIEW REDDİNİ ÖNLEME

### Sık Red Nedenleri ve Çözümler:

#### 1. Gizlilik Politikası
- ✅ Mevcut ve kapsamlı
- ⚠️ Web'de yayınlanmalı (şu an sadece docs/ klasöründe)

#### 2. Kullanım Koşulları
- ✅ Mevcut ve kapsamlı
- ⚠️ Web'de yayınlanmalı

#### 3. Biyometrik İzin Açıklaması
- ✅ `app.json`'da mevcut:
  ```json
  "NSFaceIDUsageDescription": "Uygulamanızı güvenli bir şekilde açmak için Face ID kullanılır."
  ```

#### 4. Sağlık/Tıbbi İçerik Uyarısı
- ✅ Kullanım Koşullarında açıkça belirtilmiş:
  - "Sona bir terapist, psikolog veya doktor DEĞİLDİR"
  - Acil durum hatları verilmiş

#### 5. Çocuk Gizliliği
- ✅ 13 yaş sınırı belirtilmiş
- ⚠️ App Store Connect'te yaş sınırını 17+ yapmanız önerilir (ilişki koçluğu içeriği nedeniyle)

---

## 🚀 YAYINLAMA SONRASI

### İlk Hafta
- [ ] Kullanıcı geri bildirimlerini takip et
- [ ] Crash raporlarını kontrol et
- [ ] App Store yorumlarına yanıt ver
- [ ] Analytics'i izle

### İlk Ay
- [ ] Kullanıcı davranışını analiz et
- [ ] A/B testleri planla
- [ ] Güncelleme planı oluştur

---

## 📞 DESTEK KANALLARI

### Yayınlama Sırasında Yardım Alınabilecek Yerler:
- **Expo Discord:** https://chat.expo.dev/
- **Apple Developer Forums:** https://developer.apple.com/forums/
- **Google Play Console Help:** https://support.google.com/googleplay/android-developer

---

## 🎯 ÖNCELİK SIRASI

### 🔴 Hemen Yapılmalı (Yayınlama Engelleyici)
1. API anahtarını EAS Secrets'a ekle
2. İletişim bilgilerini güncelle
3. Apple Developer bilgilerini ekle
4. Gizlilik Politikası ve Kullanım Koşullarını web'de yayınla

### 🟡 Yayınlamadan Önce (Önerilen)
5. Console.log'ları temizle
6. Ekran görüntüleri hazırla
7. Uygulama açıklaması yaz
8. TestFlight'ta test et

### 🟢 Yayınladıktan Sonra (İyileştirme)
9. Analytics ekle
10. Çoklu dil desteği
11. Erişilebilirlik iyileştirmeleri

---

**Son Kontrol:** Bu listeyi tamamladıktan sonra `RELEASE_CHECKLIST.md` dosyasındaki tüm maddeleri tekrar gözden geçirin.

**Başarılar! 🎉**
