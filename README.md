# Çayxana 🫖

Brauzerdə işləyən 3D mobil oyun: çay payla, çayxananı böyüt, şəhərdə biznes qur. Telefona tətbiq kimi quraşdırılır (PWA) və internetsiz də açılır.

**Oyna:** `https://İSTİFADƏÇİ-ADI.github.io/cayxana/` *(yayımlayandan sonra öz ünvanını yaz)*

## Qovluq quruluşu

```
cayxana/
├── index.html              Oyunun səhifəsi
├── css/style.css           Bütün üslublar
├── js/
│   ├── game.js             Oyunun əsas kodu
│   ├── cloud.js            Google girişi və bulud yaddaş (Firebase)
│   └── pwa.js              Service worker, quraşdırma, yeni versiya bildirişi
├── vendor/
│   ├── three.min.js        Three.js r128
│   └── firebase/           Firebase SDK 10.12.2 (compat)
├── icons/                  Tətbiq ikonları
├── version.js              ⬅ Versiya buradadır
├── sw.js                   Service worker
├── manifest.webmanifest    Tətbiqin adı, rəngləri, ikonları
├── firebase-config.js      ⬅ Firebase ayarların
├── firestore.rules         Firestore təhlükəsizlik qaydaları
├── firebase.json           Firebase Hosting ayarları (istəsən)
├── .github/workflows/pages.yml   GitHub Pages-ə avtomatik yayım
└── CHANGELOG.md            Versiyaların siyahısı
```

Heç bir quraşdırma və ya build addımı yoxdur, fayllar olduğu kimi işləyir.

## Kompüterdə işə salmaq

```bash
python3 -m http.server 8080
```
Sonra brauzerdə `http://localhost:8080` aç. Faylı birbaşa iki dəfə klikləyib açanda service worker işləmir, server lazımdır.

## GitHub-a yükləmək və yayımlamaq

1. GitHub-da yeni repo yarat, məsələn `cayxana`.
2. Bu qovluğun içindəkiləri repoya yüklə:
   ```bash
   git init
   git add .
   git commit -m "Çayxana 1.2.1"
   git branch -M main
   git remote add origin https://github.com/İSTİFADƏÇİ-ADI/cayxana.git
   git push -u origin main
   ```
   Komanda sətri istifadə etmirsənsə, GitHub-da **Add file → Upload files** ilə faylları sürüşdürüb yükləyə bilərsən. `.github` qovluğunu da yüklə.
3. Repoda **Settings → Pages → Build and deployment → Source: GitHub Actions** seç.
4. Bundan sonra `main` budağına hər push-da oyun avtomatik yayımlanır. Ünvan: `https://İSTİFADƏÇİ-ADI.github.io/cayxana/`.

## Yeni versiya buraxmaq

1. Kodu dəyiş.
2. `version.js`-də rəqəmi artır, məsələn `1.2.1` → `1.2.2`.
3. `CHANGELOG.md`-yə bir sətir yaz.
4. Commit və push et.

Oyunçular oyunu açanda **"Yeni versiya hazırdır — Yenilə"** yazısını görür. İrəliləyişləri qalır.

## Google girişi və bulud yaddaş (Firebase)

1. [Firebase Console](https://console.firebase.google.com) → yeni layihə.
2. **Authentication → Sign-in method → Google** → Enable.
3. **Firestore Database** → Create database.
4. **Project settings → Your apps → Web** → app əlavə et, `firebaseConfig` dəyərlərini `firebase-config.js`-ə köçür.
5. **Authentication → Settings → Authorized domains** bölməsinə `İSTİFADƏÇİ-ADI.github.io` əlavə et.
6. `firestore.rules` məzmununu **Firestore → Rules** bölməsinə yapışdır və **Publish** bas.

`firebase-config.js`-dəki açarlar gizli deyil, repoda açıq durması normaldır. Məlumatı `firestore.rules` qoruyur:
- `players/{uid}`: oyunçunun bütün irəliləyişi. Yalnız özü oxuyub yaza bilir.
- `players/{uid}/history`: üstündən yazılan köhnə irəliləyişlər (ehtiyat nüsxələr). Yalnız sahibi görür.
- `profiles/{uid}`: açıq profil (ad, avatar, səviyyə, statistika; e-poçt yox). Google ilə girən hər kəs görə bilir, yalnız sahibi dəyişə bilir. **Oyunçular** siyahısı buradan gəlir.

`firestore.rules` dəyişəndə onu Firebase Console → Firestore → Rules bölməsinə yenidən yapışdırıb **Publish** etmək lazımdır.

`firebase-config.js` doldurulmayıbsa, oyun irəliləyişi yalnız telefonda saxlayır.

> GitHub Pages-də Google girişi pəncərə (popup) ilə işləyir. iPhone-da əsas ekrandan açılan tətbiqdə giriş problem yaradarsa, oyunu Firebase Hosting-də yayımla (`firebase deploy`). `firebase.json` buna hazırdır.

## Lisenziya

Lisenziya hələ seçilməyib. Kodun başqaları tərəfindən necə istifadə ediləcəyini müəyyən etmək istəsən, repoya `LICENSE` faylı əlavə et.
