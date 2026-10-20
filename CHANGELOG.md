# Dəyişikliklər

Versiya `version.js` faylındadır. Hər yeni buraxılışda oranı artır və buraya bir sətir yaz.

## 1.4.3
- Qayıdan oyunçuya başlanğıcda ad xanası və izah yox, qısa "Xoş gəldin" kartı göstərilir: avatar, ad, səviyyə, pul və "Davam et". Ad profildə dəyişdirilir.

## 1.4.2
- Oyundan çıxıb girəndə və yeni versiyadan sonra masalarda oturan müştərilər öz sifarişləri ilə yerində qalır (çayxana, restoran, pub, coffee shop).
- Çayxana kassasındakı yığılmamış pul da yadda saxlanır.
- Oyun hər 15 saniyədən bir özü yadda saxlayır.

## 1.4.1
- Yeni oyunçulara "Bahman" adı göstərilmir: ad boş gəlir, Google ilə girəndə oyunçunun öz adı avtomatik yazılır.
- Oyunçu adını özü yazıbsa, Google adı onu dəyişmir.

## 1.4.0
- Bulud sinxronizasiyası artıq vaxta görə yox, irəliləyişin həcminə görə qərar verir: az irəliləyiş heç vaxt avtomatik olaraq çox irəliləyişin üstünə yazılmır.
- Yeni cihazda Google ilə girəndə buluddakı irəliləyiş avtomatik yüklənir.
- Ehtiyat nüsxələr: üstündən yazılan irəliləyiş həm cihazda, həm buludda (`players/{uid}/history`) saxlanır, profildən bərpa olunur.
- Firestore qaydalarına `history` əlavə olundu.

## 1.3.1
- "Hansı irəliləyiş qalsın?" pəncərəsi hansı tərəfdə daha çox irəliləyiş olduğunu ⭐ ilə göstərir, oyun vaxtını da yazır.
- Firestore qaydaları sadələşdirildi (oxuma və yazma ayrıca).

## 1.3.0
- Oyunçular: Google ilə girənlər səviyyəyə görə sıralanmış siyahını və hər oyunçunun profilini görür.
- Firestore-a açıq profil (`profiles`) əlavə olundu, qaydalar yeniləndi.

## 1.2.2
- Telefonda profil kartına toxunanda profil açılmırdı, düzəldildi.
- Firebase qurulmayanda profildə oyunçuya aydın yazı göstərilir.

## 1.2.1
- Oyunçular üçün admin panel və "Sıfırla" çıxarıldı.

## 1.2.0
- Profil: avatar, ad, səviyyə və XP, statistika, Google hesabı bölməsi.

## 1.1.0
- Google ilə giriş və Firebase-də bulud yaddaş.

## 1.0.0
- İlk PWA buraxılışı: quraşdırma, internetsiz işləmə, versiya yenilənməsi.
