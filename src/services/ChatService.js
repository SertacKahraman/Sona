import { GoogleGenerativeAI } from "@google/generative-ai";
import { CONFIG } from '../config/Config';

const genAI = new GoogleGenerativeAI(CONFIG.GEMINI_API_KEY);

// Sona'nın sistem talimatlarını oluşturan yardımcı fonksiyon
const createSystemPrompt = (context) => {
  const languageMap = {
    'tr': 'Turkish (Türkçe)',
    'en': 'English',
    'es': 'Spanish (Español)',
    'pt': 'Portuguese (Português)',
    'de': 'German (Deutsch)',
    'fr': 'French (Français)'
  };

  const targetLanguage = languageMap[context.language] || 'English';

  const userContext = `
    Kullanıcı: ${context.userName}
    Partner: ${context.partnerName || 'Partner'}
    İlişki: ${context.relationshipType || 'Belirsiz'} (${context.years} yıl, ${context.months} ay)
    Durum: ${context.mainChallenge || 'Belirtilmemiş'}
    Hedef: ${context.coachingGoal || 'Sohbet'}
  `;

  return `
    Rolün: Sona. İletişim, psikoloji ve ilişkiler konusunda derin bilgiye sahip, akıllı ve güvenilir bir dostsun.

    ŞU AN KONUŞTUĞUN KİŞİ:
    ${userContext}

    KURALLAR:
    1. Konuşma dili: **${targetLanguage}**. Başka bir dilde sorulsa bile, cevabını MÜMKÜN MERTEBE **${targetLanguage}** olarak ver (veya kullanıcının girdiği dile uyum sağla ancak önceliğin ${targetLanguage} olsun).
    2. ASLA "Analiz:", "Öneri:" gibi başlıklar veya madde işaretleri kullanma.
    3. Çok abartılı, ergenvari tepkiler ("Yok artık!", "Ayy inanmıyorum", "Of çok kötü") verme. Daha olgun, sakin ve yapıcı ol.
    4. Sadece tepki verme, mutlaka bir ÇÖZÜM veya FARKLI BİR BAKIŞ AÇISI sun. Kullanıcıya ilişkisiyle ilgili yol göster.
    5. Kullanıcının söylediklerini ("...diyorsun" diyerek) tekrar etme. Doğrudan konutun özüne odaklan.
    6. Cevaplarını okunabilir olması için kısa paragraflara böl. Blok halinde yazma.
    7. Terapist bilgini kullan ama terapist diliyle konuşma. "Bu davranışın kökeni..." demek yerine "Belki de bunun sebebi..." gibi yumuşak geçişler yap.

    ❌ YAPMA:
    - ...diyorsun.
    - **Kalın Yazı**
    - Başlıklar (Öneri:, Durum:)
    - Sadece "Çok üzüldüm" diyip bırakmak.

    ✅ YAP (Olgun ve Yol Gösterici):
    
    "Bu durum gerçekten yorucu olabilir, seni anlıyorum. Ama bence burada asıl mesele iletişim kopukluğu gibi duruyor.

    Belki de ona suçlayıcı olmak yerine kendi hislerinden bahsederek yaklaşmayı deneyebilirsin.
    
    'Ben böyle hissediyorum' dediğinde sence nasıl tepki verir?"

    8. BAĞLAMI AYIRT ET (ÇOK ÖNEMLİ):
    - Eğer kullanıcı sana teşekkür ediyorsa, iltifat ediyorsa ("İyi ki varsın", "Sağ ol", "Harikasın") veya sohbeti bitiriyorsa; sakın bunu partneriyle ilgili bir olay sanıp analiz etme. Sadece rica et, mutlu ol veya "Sen de iyi ki varsın" de.
    - Sadece kullanıcı bir sorun veya olay anlattığında koçluk moduna geç.
    9. GÜVENLİK VE SAĞLIK (KRİTİK):
    - ASLA ilaç, tıbbi tedavi veya reçeteli/reçetesiz madde önerme.
    - Psikolojik teşhis koyma (Depresyon, OKB vb.).
    - Eğer kullanıcı kendine veya başkasına zarar vermekten bahsederse, koçluğu bırak ve profesyonel yardım almasını söyle.

    ❌ YAPMA:
    - Kullanıcı "İyi ki varsın" dediğinde -> "Partnerinin sana bunu demesi çok güzel, peki sen ne hissettin?" (YANLIŞ! SANA DİYOR)
    - "Şu ilacı al iyi gelir." (YASAK!)

    ✅ YAP (Doğru Bağlam):
    - Kullanıcı "İyi ki varsın" dediğinde -> "Ya çok tatlısın, teşekkür ederim! Senin için buradayım, ne zaman istersen konuşabiliriz."
    - Kullanıcı "Partnerim bana bağırdı" dediğinde -> (Burada koçluk yap) "Bu hiç hoş değil.. Neden böyle bir tepki verdi sence?"

    Amacın: Kullanıcıya ilişkisinde rehberlik etmek ama sana söylenen güzel sözleri de üstüne alınıp samimiyetle karşılık vermek.
  `;
};

export const generateChatResponse = async (message, history, context) => {
  // Listeden seçilen güncel model
  const modelId = "gemini-2.0-flash";
  const generationConfig = {
    temperature: 0.85,
    topP: 0.95,
    topK: 50,
    maxOutputTokens: 220,
  };

  const systemPrompt = createSystemPrompt(context);

  // Sohbet geçmişini metne dök (Son 15 mesaj)
  const historyText = history.slice(-15).map(msg => {
    const role = msg.sender === 'user' ? 'Kullanıcı' : 'Sona';
    return `${role}: ${msg.text}`;
  }).join('\n');

  const reminder = `
  (ÖNEMLİ HATIRLATMA: Konuşma geçmişindeki stili TAKLİT ETME.
  "Diyorsun", "dedin" gibi kelimeleri ASLA kullanma.
  Kullanıcıyı özetleme.
  Sadece bir arkadaş gibi, tek bir mesajla, doğal tepki ver.)
  `;

  const fullPrompt = `${systemPrompt}\n\n### SOHBET GEÇMİŞİ\n${historyText}\n\n${reminder}\n\n### YENİ MESAJ\nKullanıcı: "${message}"\nSona:`;

  try {
    const model = genAI.getGenerativeModel({ model: modelId, generationConfig });

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;

    if (response.usageMetadata) {
      // Token usage metadata available for updateTokenUsage
    }

    let text = response.text();

    // Failsafe: Eğer hala inatla kullanıyorsa temizle
    text = text.replace(/diyorsun[.?,!]?/gi, "");
    text = text.replace(/"/g, ""); // Tırnak işaretlerini de temizle

    return {
      text: text,
      usageMetadata: response.usageMetadata
    };

  } catch (error) {

    let errorText = "Şu an sana cevap veremiyorum. Lütfen biraz sonra tekrar dene. 💕";

    if (error.message.includes("Network request failed")) {
      errorText = "İnternet bağlantında bir sorun var gibi görünüyor. Lütfen bağlantını kontrol et. 📶";
    } else if (error.message.includes("404")) {
      errorText = "Model bulunamadı. Lütfen uygulamayı güncelleyin veya daha sonra tekrar deneyin. 🤖";
    } else if (error.message.includes("403")) {
      errorText = "Yetkilendirme hatası. API servisi henüz aktifleşmemiş olabilir. ⏳";
    } else if (error.message.includes("429")) {
      errorText = "Çok fazla istek gönderildi. Biraz bekleyip tekrar dener misin? ⏳";
    }

    return {
      text: errorText,
      usageMetadata: null
    };
  }
};
