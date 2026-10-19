/* Versiyanı göstərir, quraşdırma düyməsi, service worker və yeni versiya bildirişi */
(function(){
  var V=window.APP_VERSION||'?';
  document.querySelectorAll('.appVer').forEach(function(el){ el.textContent=V; });
  var deferred=null, ib=document.getElementById('installBtn');
  window.addEventListener('beforeinstallprompt', function(e){ e.preventDefault(); deferred=e; ib.hidden=false; });
  ib.addEventListener('click', function(){ if(!deferred) return; deferred.prompt(); deferred.userChoice.finally(function(){ deferred=null; ib.hidden=true; }); });
  window.addEventListener('appinstalled', function(){ ib.hidden=true; });
  if(!('serviceWorker' in navigator)) return;
  var upd=document.getElementById('upd'), waitingSW=null;
  function offer(sw){ waitingSW=sw; var ch=new MessageChannel(); ch.port1.onmessage=function(m){ document.getElementById('updVer').textContent=m.data; }; try{ sw.postMessage({type:'GET_VERSION'},[ch.port2]); }catch(e){} upd.hidden=false; }
  document.getElementById('updBtn').addEventListener('click', function(){ try{ if(window.gameSave) window.gameSave(); }catch(e){} if(waitingSW) waitingSW.postMessage({type:'SKIP_WAITING'}); });
  var reloading=false; navigator.serviceWorker.addEventListener('controllerchange', function(){ if(reloading) return; reloading=true; location.reload(); });
  window.addEventListener('load', function(){
    navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).then(function(reg){
      if(reg.waiting && navigator.serviceWorker.controller) offer(reg.waiting);
      reg.addEventListener('updatefound', function(){ var nw=reg.installing; if(!nw) return; nw.addEventListener('statechange', function(){ if(nw.state==='installed' && navigator.serviceWorker.controller) offer(nw); }); });
      document.addEventListener('visibilitychange', function(){ if(document.visibilityState==='visible') reg.update(); });
      setInterval(function(){ reg.update(); }, 30*60*1000);
    }).catch(function(err){ console.warn('SW qeydiyyatı alınmadı:', err); });
  });
})();
