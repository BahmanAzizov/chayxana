/* Çayxana — Google hesabı ilə bulud yaddaş (Firebase Auth + Firestore).
   Hər oyunçunun irəliləyişi players/{uid} sənədində saxlanır.
   Profil pəncərəsi window.CLOUD obyektini oxuyur. */
(function () {
  var KEY = 'cayxana-proto-v2', COLL = 'players', BK = 'cayxana-backups', FORCE = 'cayxana-force-push';
  var $ = function (id) { return document.getElementById(id); };
  var C = window.CLOUD = { available: false, user: null, status: '', signIn: function () {}, signOut: function () {}, push: function () {}, pull: function () {} };
  function changed() { var sb = $('startSignIn'), ss = $('startCloud'); if (sb) sb.hidden = !C.available || !!C.user; if (ss) ss.textContent = C.user ? ('☁️ ' + (C.user.displayName || C.user.email || '') + ' · ' + C.status) : C.status; if (window.onCloudChange) try { window.onCloudChange(); } catch (e) {} }
  function status(t) { C.status = t; changed(); }
  function hm(ms) { var d = new Date(ms); return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  function local() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function parse(s) { try { return JSON.parse(s || '{}') || {}; } catch (e) { return {}; } }
  // irəliləyişin ölçüsü: əvvəl səviyyə, sonra XP, sonra oyun vaxtı. Qərar vaxta görə yox, buna görə verilir.
  function prog(d) { d = d || {}; return (d.level | 0) * 1e9 + Math.floor(d.xp || 0) * 1e3 + Math.min(999, Math.floor((d.elapsed || 0) / 60)); }
  function fresh(d) { return !d || ((d.level | 0) <= 1 && (d.elapsed || 0) < 600); }
  function backupLocal(reason) { try { var cur = localStorage.getItem(KEY); if (!cur) return; var list = JSON.parse(localStorage.getItem(BK) || '[]'); list.unshift({ t: Date.now(), reason: reason, save: cur }); localStorage.setItem(BK, JSON.stringify(list.slice(0, 6))); } catch (e) {} }

  var cfg = window.FIREBASE_CONFIG;
  if (!window.firebase || !cfg || !cfg.apiKey || /^BURAYA/.test(cfg.apiKey)) { console.warn('Çayxana: Google girişi üçün firebase-config.js faylına Firebase layihənin ayarlarını yaz (README → Firebase).'); status('Google ilə giriş hələ aktiv deyil. İrəliləyiş bu cihazda saxlanır.'); return; }

  firebase.initializeApp(cfg);
  var auth = firebase.auth(), db = firebase.firestore();
  db.enablePersistence({ synchronizeTabs: true }).catch(function () {});
  C.available = true;
  var dirty = false, lastPush = 0, busy = false, baseSavedAt = 0;
  function ref() { return db.collection(COLL).doc(C.user.uid); }
  function pubRef() { return db.collection('profiles').doc(C.user.uid); }
  // başqalarına görünən hissə: ad, avatar, səviyyə və statistika (e-poçt və irəliləyişin özü yox)
  function publicData(d) {
    var st = d.st || {}, biz = d.biz || {}, own = 0; for (var k in biz) if (biz[k] && biz[k].own) own++;
    var lv = d.level | 0, xp = Math.floor(d.xp || 0), av = d.avatar === undefined ? 0 : d.avatar;
    return { name: String(d.name || 'Oyunçu').slice(0, 16), avatar: av, photo: (av === 'google' && C.user.photoURL) ? C.user.photoURL : null,
      level: lv, xp: xp, score: lv * 100000 + xp, money: Math.floor(d.money || 0), served: d.served | 0, tea: st.tea | 0,
      biz: own, unlocked: d.unlocked | 0, toys: st.toys | 0, version: window.APP_VERSION || '', updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
  }

  C.signIn = function () {
    var p = new firebase.auth.GoogleAuthProvider(); p.setCustomParameters({ prompt: 'select_account' });
    if (window.navigator.standalone === true) { auth.signInWithRedirect(p); return; }
    auth.signInWithPopup(p).catch(function (e) {
      if (/popup-blocked|operation-not-supported|cancelled-popup|web-storage-unsupported/.test(e.code)) auth.signInWithRedirect(p);
      else if (e.code !== 'auth/popup-closed-by-user') status('Giriş alınmadı (' + e.code + ')');
    });
  };

  C.push = function (force) {
    if (!C.user || busy) return Promise.resolve(); var d = local(); if (!d) return Promise.resolve();
    busy = true; status('Buluda yazılır…');
    var data = { save: JSON.stringify(d), savedAt: d.savedAt || Date.now(), level: d.level | 0, money: Math.floor(d.money || 0),
      name: d.name || '', avatar: d.avatar === undefined ? null : d.avatar, version: window.APP_VERSION || '', updatedAt: firebase.firestore.FieldValue.serverTimestamp() };
    // buludda daha çox irəliləyiş varsa, az irəliləyiş heç vaxt onun üstünə yazılmır (yalnız oyunçu özü seçərsə)
    return db.runTransaction(function (tx) {
      return tx.get(ref()).then(function (snap) {
        var c = snap.exists ? snap.data() : null;
        if (c && prog(parse(c.save)) > prog(d)) {
          if (!force) { var err = new Error('conflict'); err.cloud = c; throw err; }
          tx.set(ref().collection('history').doc(String(c.savedAt || Date.now())), { save: c.save, savedAt: c.savedAt || 0, level: c.level | 0, money: c.money | 0, reason: 'overwrite', at: firebase.firestore.FieldValue.serverTimestamp() });
        }
        tx.set(ref(), data);
      });
    }).then(function () { baseSavedAt = data.savedAt; lastPush = Date.now(); dirty = false; status('Buluda yazıldı · ' + hm(lastPush)); return pubRef().set(publicData(d)).catch(function () {}); })
      .catch(function (e) { if (e && e.cloud) choose(e.cloud, local()); else status('Buluda yazmaq alınmadı (' + (e.code || e.message) + ')'); })
      .finally(function () { busy = false; });
  };

  function restore(save, why) { backupLocal(why || 'restore'); window.__cloudRestoring = true; localStorage.setItem(KEY, save); location.reload(); }

  function choose(cloud, loc) {
    var box = $('cloudChoice'); if (!box) return;
    var cd = {}; try { cd = JSON.parse(cloud.save || '{}'); } catch (e) {}
    function score(d) { d = d || {}; return (d.level | 0) * 1e9 + Math.floor(d.xp || 0) * 1e3 + Math.min(999, Math.floor((d.elapsed || 0) / 60)); }
    function mins(d) { var m = Math.floor(((d && d.elapsed) || 0) / 60); return m >= 60 ? Math.floor(m / 60) + ' saat ' + (m % 60) + ' dəq' : m + ' dəq'; }
    var cloudMore = score(cd) > score(loc), same = score(cd) === score(loc);
    $('ccCloud').textContent = 'Buludda: səviyyə ' + (cloud.level | 0) + ', ' + Math.floor(cloud.money || 0) + ' ₼, ' + mins(cd) + ' oyun' + (!same && cloudMore ? ' ⭐' : '');
    $('ccLocal').textContent = 'Bu cihazda: səviyyə ' + (loc ? (loc.level | 0) : 1) + ', ' + Math.floor(loc ? loc.money || 0 : 0) + ' ₼, ' + mins(loc) + ' oyun' + (!same && !cloudMore ? ' ⭐' : '');
    var bc = $('ccUseCloud'), bl = $('ccUseLocal'); bc.className = 'buy' + (cloudMore || same ? '' : ' quiet'); bl.className = 'buy' + (!cloudMore && !same ? '' : ' quiet');
    var hint = $('ccHint'); if (hint) hint.textContent = same ? 'İkisi eynidir, hansını seçsən fərq etməz.' : '⭐ işarəli tərəfdə daha çox irəliləyiş var.';
    box.hidden = false;
    $('ccUseCloud').onclick = function () { box.hidden = true; restore(cloud.save, 'cloud-load'); };
    $('ccUseLocal').onclick = function () { box.hidden = true; C.push(true); };
  }

  C.leaderboard = function (n) { return db.collection('profiles').orderBy('score', 'desc').limit(n || 50).get().then(function (s) { return s.docs.map(function (x) { var o = x.data(); o.uid = x.id; return o; }); }); };
  C.profile = function (uid) { return db.collection('profiles').doc(uid).get().then(function (s) { if (!s.exists) return null; var o = s.data(); o.uid = s.id; return o; }); };
  // ehtiyat nüsxələr: bu cihazda saxlananlar və buludda üstündən yazılanlar
  C.backups = function () {
    var out = []; try { JSON.parse(localStorage.getItem(BK) || '[]').forEach(function (b) { var d = parse(b.save); out.push({ src: 'Bu cihaz', t: b.t, level: d.level | 0, money: Math.floor(d.money || 0), elapsed: d.elapsed || 0, save: b.save }); }); } catch (e) {}
    if (!C.user) return Promise.resolve(out);
    return ref().collection('history').orderBy('savedAt', 'desc').limit(10).get().then(function (s) {
      s.docs.forEach(function (x) { var h = x.data(), d = parse(h.save); out.push({ src: 'Bulud', t: h.savedAt || 0, level: d.level | 0, money: Math.floor(d.money || 0), elapsed: d.elapsed || 0, save: h.save }); });
      return out.sort(function (a, b) { return b.t - a.t; });
    }).catch(function () { return out; });
  };
  C.restoreBackup = function (b) { localStorage.setItem(FORCE, '1'); restore(b.save, 'before-backup-restore'); };
  C.pull = function () { if (!C.user) return; ref().get().then(function (s) { if (s.exists) choose(s.data(), local()); else status('Buludda hələ yaddaş yoxdur'); }); };
  C.signOut = function () { (dirty ? C.push() : Promise.resolve()).then(function () { return auth.signOut(); }); };

  function syncOnLogin() {
    status('Bulud yoxlanılır…');
    return ref().get().then(function (snap) {
      var loc = local();
      if (localStorage.getItem(FORCE)) { localStorage.removeItem(FORCE); return C.push(true); }
      if (!snap.exists) return C.push();
      var c = snap.data(), pc = prog(parse(c.save)), pl = prog(loc);
      if (pc > pl) { if (fresh(loc)) restore(c.save, 'new-device'); else choose(c, loc); }   // yeni cihaz: buluddakı avtomatik gəlir
      else if (pl > pc) return C.push();                                                        // bu cihazda daha çox: buluda yazılır
      else status('Bulud ilə eynidir · ' + hm(c.savedAt || 0));
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
