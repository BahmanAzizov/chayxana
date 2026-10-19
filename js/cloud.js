/* Çayxana — Google hesabı ilə bulud yaddaş (Firebase Auth + Firestore).
   Hər oyunçunun irəliləyişi players/{uid} sənədində saxlanır.
   Profil pəncərəsi window.CLOUD obyektini oxuyur. */
(function () {
  var KEY = 'cayxana-proto-v2', COLL = 'players';
  var $ = function (id) { return document.getElementById(id); };
  var C = window.CLOUD = { available: false, user: null, status: '', signIn: function () {}, signOut: function () {}, push: function () {}, pull: function () {} };
  function changed() { var sb = $('startSignIn'), ss = $('startCloud'); if (sb) sb.hidden = !C.available || !!C.user; if (ss) ss.textContent = C.user ? ('☁️ ' + (C.user.displayName || C.user.email || '') + ' · ' + C.status) : C.status; if (window.onCloudChange) try { window.onCloudChange(); } catch (e) {} }
  function status(t) { C.status = t; changed(); }
  function hm(ms) { var d = new Date(ms); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function local() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }

  var cfg = window.FIREBASE_CONFIG;
  if (!window.firebase || !cfg || !cfg.apiKey || /^BURAYA/.test(cfg.apiKey)) { status('Bulud yaddaş qurulmayıb: firebase-config.js faylını doldur'); return; }

  firebase.initializeApp(cfg);
  var auth = firebase.auth(), db = firebase.firestore();
  db.enablePersistence({ synchronizeTabs: true }).catch(function () {});
  C.available = true;
  var dirty = false, lastPush = 0, busy = false, baseSavedAt = 0;
  function ref() { return db.collection(COLL).doc(C.user.uid); }

  C.signIn = function () {
    var p = new firebase.auth.GoogleAuthProvider(); p.setCustomParameters({ prompt: 'select_account' });
    if (window.navigator.standalone === true) { auth.signInWithRedirect(p); return; }
    auth.signInWithPopup(p).catch(function (e) {
      if (/popup-blocked|operation-not-supported|cancelled-popup|web-storage-unsupported/.test(e.code)) auth.signInWithRedirect(p);
      else if (e.code !== 'auth/popup-closed-by-user') status('Giriş alınmadı (' + e.code + ')');
    });
  };

  C.push = function () {
    if (!C.user || busy) return Promise.resolve(); var d = local(); if (!d) return Promise.resolve();
    busy = true; status('Buluda yazılır…');
    var data = { save: JSON.stringify(d), savedAt: d.savedAt || Date.now(), level: d.level | 0, money: Math.floor(d.money || 0),
      name: d.name || '', avatar: d.avatar === undefined ? null : d.avatar, version: window.APP_VERSION || '', updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
    // başqa cihaz bu arada daha yeni irəliləyiş yazıbsa, onun üstündən yazmırıq — oyunçu seçir
    return db.runTransaction(function (tx) {
      return tx.get(ref()).then(function (snap) {
        var c = snap.exists ? snap.data() : null;
        if (c && (c.savedAt || 0) > baseSavedAt + 1000 && (c.savedAt || 0) > data.savedAt) { var err = new Error('conflict'); err.cloud = c; throw err; }
        tx.set(ref(), data);
      });
    }).then(function () { baseSavedAt = data.savedAt; lastPush = Date.now(); dirty = false; status('Buluda yazıldı · ' + hm(lastPush)); })
      .catch(function (e) { if (e && e.cloud) choose(e.cloud, local()); else status('Buluda yazmaq alınmadı (' + (e.code || e.message) + ')'); })
      .finally(function () { busy = false; });
  };

  function restore(save) { window.__cloudRestoring = true; localStorage.setItem(KEY, save); location.reload(); }

  function choose(cloud, loc) {
    var box = $('cloudChoice'); if (!box) return;
    $('ccCloud').textContent = 'Buludda: səviyyə ' + (cloud.level | 0) + ', ' + Math.floor(cloud.money || 0) + ' ₼ (' + hm(cloud.savedAt || 0) + ')';
    $('ccLocal').textContent = 'Bu cihazda: səviyyə ' + (loc ? (loc.level | 0) : 1) + ', ' + Math.floor(loc ? loc.money || 0 : 0) + ' ₼';
    box.hidden = false;
    $('ccUseCloud').onclick = function () { box.hidden = true; restore(cloud.save); };
    $('ccUseLocal').onclick = function () { box.hidden = true; baseSavedAt = cloud.savedAt || 0; C.push(); };
  }

  C.pull = function () { if (!C.user) return; ref().get().then(function (s) { if (s.exists) choose(s.data(), local()); else status('Buludda hələ yaddaş yoxdur'); }); };
  C.signOut = function () { (dirty ? C.push() : Promise.resolve()).then(function () { return auth.signOut(); }); };

  function syncOnLogin() {
    status('Bulud yoxlanılır…');
    return ref().get().then(function (snap) {
      var loc = local();
      if (!snap.exists) return C.push();
      var c = snap.data(), cs = c.savedAt || 0, ls = (loc && loc.savedAt) || 0; baseSavedAt = Math.min(cs, ls || cs);
      if (cs > ls + 5000) choose(c, loc);
      else if (ls > cs + 5000) return C.push();
      else { baseSavedAt = cs; status('Bulud ilə eynidir · ' + hm(cs)); }
    }).catch(function (e) { status('Bulud oxunmadı (' + (e.code || e.message) + ')'); });
  }

  window.cloudOnSave = function () { dirty = true; };
  setInterval(function () { if (C.user && dirty && Date.now() - lastPush > 20000) C.push(); }, 5000);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden' && C.user && dirty) C.push(); });
  var sb = $('startSignIn'); if (sb) sb.addEventListener('click', function () { C.signIn(); });

  auth.getRedirectResult().catch(function (e) { status('Giriş alınmadı (' + e.code + ')'); });
  auth.onAuthStateChanged(function (u) {
    C.user = u ? { uid: u.uid, displayName: u.displayName, email: u.email, photoURL: u.photoURL } : null;
    if (u) syncOnLogin(); else status('Google ilə daxil ol ki, irəliləyişin itməsin');
  });
  status('Google hesabı yoxlanılır…');
})();
