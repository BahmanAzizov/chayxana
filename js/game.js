/* Çayxana — oyunun əsas kodu (Three.js r128) */
(function(){
'use strict';
var $ = function(id){ return document.getElementById(id); };
if(!window.THREE){ $('start').querySelector('p').textContent='Oyun kitabxanası yüklənmədi. Səhifəni yenilə.'; $('play').style.display='none'; return; }
var T = THREE;

// ---------- config ----------
var CFG = {
  teaPrice:2, paxPrice:6, coldAfter:40, samovarTime:[2.5,2.0,1.6,1.3,1.1,0.95], samovarCap:8,
  paxTime:4, paxCap:6, padnosCap:[8,12,16,20,24,28], waiterMul:[1,1.12,1.24,1.36,1.48,1.6], baseSpeed:10,
  pileCap:1e12, patience:25, waitMax:4, waitPatience:20, drinkTime:5,
  spawnBase:5, spawnMin:2.2, workerSpeed:3.2, workerCap:5, customerSpeed:3.4,
  counterZ:-4.4, pickZ:-3.3, backZ:-6.0,
  unlocks:[
    {id:'samovar2', name:'İkinci samovar',  price:25,   x:-1.6, z:-2.8},
    {id:'table',    name:'Yeni masa',       price:40,   x:-5.0, z:2.2},
    {id:'waiter',   name:'Ofisiant',        price:70,   x:3.0,  z:-2.8},
    {id:'table',    name:'Yeni masa',       price:100,  x:-1.2, z:2.2},
    {id:'pax',      name:'Şirniyyat',       price:140,  x:0.6,  z:-2.8},
    {id:'nerd',     name:'Nərd masası',     price:200,  x:2.8,  z:2.6},
    {id:'kassir',   name:'Kassir',          price:280,  x:6.2,  z:-0.6},
    {id:'domino',   name:'Domino masası',   price:360,  x:2.6,  z:-1.0},
    {id:'terrace',  name:'Bağ terrası',     price:450,  x:0,    z:5.4},
    {id:'waiter',   name:'İkinci ofisiant', price:700,  x:5.6,  z:15.1},
    {id:'domino',   name:'Domino masası',   price:900,  x:-4.0, z:13.4},
    {id:'music',    name:'Musiqiçi',        price:1200, x:5.4,  z:12.6},
    {id:'domino',   name:'Domino masası',   price:1500, x:0.5,  z:13.4},
    {id:'variety',  t:'teaL', sx:-5.8, name:'Limonlu çay', price:1500, x:-5.8, z:-3.0},
    {id:'samovar3', sx:2.6, name:'Üçüncü samovar', price:1800, x:2.6, z:-3.0},
    {id:'variety',  t:'teaK', sx:-3.1, name:'Kəklikotulu çay', price:2200, x:-3.1, z:-3.0},
    {id:'roof',     name:'İkinci mərtəbə (eyvan)', price:3000, x:7.0, z:-1.9},
    {id:'variety',  t:'teaM', sx:-0.5, name:'Mürəbbəli çay', price:2600, x:-0.5, z:-3.0},
    {id:'rooftable',k:2, name:'Eyvan masası', price:1500, x:1.2, z:-10.25},
    {id:'bigsam',   sx:4.4, name:'Böyük qazan samovar', price:4000, x:4.4, z:-3.0},
    {id:'rooftable',k:3, name:'Eyvan masası', price:1800, x:4.8, z:-10.25},
    {id:'waiter',   name:'Eyvan ofisiantı', price:2500, x:-0.6, z:-8.6},
    {id:'sweet',    t:'sek', name:'Şəkərbura', price:3000, x:-10.35, z:-1.5},
    {id:'usta',     sx:-2.3, name:'İkinci çayçı', price:2500, x:-2.3, z:-3.0},
    {id:'sweet',    t:'bad', name:'Badambura', price:3500, x:-10.35, z:1.0},
    {id:'usta',     sx:3.5, name:'Üçüncü çayçı', price:3500, x:3.5, z:-3.0},
    {id:'sweet',    t:'qog', name:'Qoğal', price:4000, x:-10.35, z:3.5},
    {id:'table',    name:'Terras masası', price:3000, x:-0.4, z:16.2},
    {id:'table',    name:'Terras masası', price:3500, x:3.2, z:16.2},
    {id:'table',    name:'Künc masası', price:3500, x:-8.9, z:-1.2, axis:'z'},
    {id:'table',    name:'Künc masası', price:4000, x:-8.9, z:3.4, axis:'z'},
    {id:'hall',     name:'3-cü mərtəbə: Qonaqlar üçün', price:6000, x:-7.0, z:-8.4},
    {id:'sky',      name:'4-cü mərtəbə: Səma çayxanası', price:8000, x:7.4, z:-10.9},
    {id:'taxt',     k:2, name:'Taxt', price:2500, x:-6, z:-16.5},
    {id:'skysam',   sx:-5, name:'İkinci səma samovarı', price:3000, x:-5, z:-19.0},
    {id:'taxt',     k:3, name:'Taxt', price:3000, x:-2, z:-16.5},
    {id:'skywt',    k:1, name:'Səma ofisiantı', price:3200, x:4, z:-14.4},
    {id:'skyvar',   t:'pax', sx:-1, name:'Paxlava xonçası', price:2800, x:-1, z:-19.0},
    {id:'taxt',     k:4, name:'Taxt', price:3400, x:2, z:-16.5},
    {id:'skyusta',  sx:2, name:'İkinci səma çayçısı', price:3000, x:2.6, z:-19.0},
    {id:'skyvar',   t:'teaM', sx:3, name:'Mürəbbə xonçası', price:3200, x:4.2, z:-19.0},
    {id:'taxt',     k:5, name:'Taxt', price:3800, x:6, z:-16.5},
    {id:'skywt',    k:2, name:'Üçüncü səma ofisiantı', price:3600, x:-4, z:-14.4}
  ],
  ups:{
    padnos:{ name:'Padnos tutumu', prices:[40,100,220,400,650], label:function(l){ return CFG.padnosCap[l]+' stəkan'; } },
    speed:{ name:'Ofisiant sürəti', prices:[60,150,320,550,850], label:function(l){ return Math.round(CFG.waiterMul[l]*100)+'%'; } },
    samovar:{ name:'Samovar sürəti', prices:[60,150,320,550,850], label:function(l){ return CFG.samovarTime[l].toFixed(2).replace('.',',')+' s/stəkan'; } },
    price:{ name:'Çay qiyməti', prices:[200,450,800,1300,2000], label:function(l){ return '+'+(15*l)+'%'; } },
    patience:{ name:'Müştəri səbri', prices:[150,350,700,1200], label:function(l){ return '+'+(15*l)+'%'; } },
    waiters:{ name:'Əlavə ofisiant', prices:[400,900,1600,2600,3600,4800,6200,8000], label:function(l){ return '+'+l+' ofisiant'; } },
    vspeed:{ name:'Şirniyyat və çeşid sürəti', prices:[180,400,750,1200], label:function(l){ return '+'+(25*l)+'%'; } }
  }
};
var SAVE_KEY = 'cayxana-proto-v2';
var CARRY = {x:0, y:1.226, z:0.42};
var PAY = {x:6.2, z:2.1};
var ENDS = [[9.4,-7.5],[9.4,17.5]];
var WAIT_SLOTS = [[6.4,4.6],[7.5,4.6],[8.9,4.6],[9.6,5.8]];

var S = { money:0, unlocked:0, up:{padnos:0,speed:0,samovar:0,price:0,patience:0,waiters:0,vspeed:0}, elapsed:0, session:0, unlockTimes:[], muted:false,
  level:1, xp:0, zoom:1, name:'Bahman', st:{}, mis:null, timeScale:1, zen:false, showFps:false, tod:0.35, biz:null, snd2:null, vol:0.8, boostUntil:0, offerAt:330, offerShown:false, tut:0, started:false, toyNext:360, nextSpawn:2, patienceMul:1, lost:0, served:0, delivered:0 };
var paused = false;

// ---------- three setup ----------
var SKY = 0xa9ddf3;
var scene = new T.Scene();
scene.background = new T.Color(SKY);
scene.fog = new T.Fog(SKY, 40, 80);
var renderer = new T.WebGLRenderer({antialias:true, powerPreference:'high-performance'});
var COARSE = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, COARSE?1.5:2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = T.PCFSoftShadowMap;
renderer.outputEncoding = T.sRGBEncoding;
$('game').appendChild(renderer.domElement);
var cam = new T.OrthographicCamera(-10, 10, 10, -10, 0.1, 600), CAMK=5;
var camOff = new T.Vector3(13.4, 15, 13.4);
var camFwd = {x:-camOff.x/Math.hypot(camOff.x,camOff.z), z:-camOff.z/Math.hypot(camOff.x,camOff.z)};
var camTarget = new T.Vector3(-2, 0, -2);
var camPan = null;
function resize(){ var w=window.innerWidth, h=window.innerHeight, a=w/h; renderer.setSize(w,h,false); var half = a<1 ? 11 : 7.5; cam.left=-half*a; cam.right=half*a; cam.top=half; cam.bottom=-half; cam.updateProjectionMatrix(); }
window.addEventListener('resize', resize); resize();

var hemi=new T.HemisphereLight(0xfff6e8, 0x9aa08a, 0.95); scene.add(hemi);
var sun = new T.DirectionalLight(0xffe7c4, 0.9);
sun.position.set(-10, 24, 14); sun.castShadow = true;
var smap = window.innerWidth<700 ? 1024 : 2048;
sun.shadow.mapSize.set(smap, smap);
sun.shadow.camera.left = -28; sun.shadow.camera.right = 28; sun.shadow.camera.top = 28; sun.shadow.camera.bottom = -28;
sun.shadow.camera.near = 1; sun.shadow.camera.far = 90; sun.shadow.camera.updateProjectionMatrix();
sun.shadow.bias = -0.0006;
scene.add(sun); scene.add(sun.target);

// ---------- helpers ----------
var matCache = {};
function M(c){ if(!matCache[c]){ var col=new T.Color(c).convertSRGBToLinear(); matCache[c]=new T.MeshPhongMaterial({color:col, specular:0x1c1c1c, shininess:22}); } return matCache[c]; }
function TM(tex){ return new T.MeshLambertMaterial({map:tex}); }
function box(w,h,d,c,x,y,z,shadow){ var m=new T.Mesh(new T.BoxGeometry(w,h,d), M(c)); m.position.set(x||0,y||0,z||0); m.castShadow = shadow!==false; m.receiveShadow=true; return m; }
function cyl(rt,rb,h,c,x,y,z,seg){ var m=new T.Mesh(new T.CylinderGeometry(rt,rb,h,seg||14), M(c)); m.position.set(x||0,y||0,z||0); m.castShadow=true; m.receiveShadow=true; return m; }
function sph(r,c,x,y,z){ var m=new T.Mesh(new T.SphereGeometry(r,22,16), M(c)); m.position.set(x||0,y||0,z||0); m.castShadow=true; return m; }
function lathe(pts,c,seg){ var m=new T.Mesh(new T.LatheGeometry(pts.map(function(p){ return new T.Vector2(p[0],p[1]); }), seg||18), M(c)); m.castShadow=true; m.receiveShadow=true; return m; }
function plane(w,h,tex,x,y,z,rx){ var m=new T.Mesh(new T.PlaneGeometry(w,h), TM(tex)); m.position.set(x,y,z); if(rx!==undefined) m.rotation.x=rx; m.receiveShadow=true; return m; }
function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
function fmt(s){ s=Math.max(0,Math.floor(s)); return Math.floor(s/60)+':'+('0'+(s%60)).slice(-2); }
function dist(a,b){ return Math.hypot(a.x-b.x, a.z-b.z); }
function easeOutBack(k){ var c1=1.70158, c3=c1+1; return 1+c3*Math.pow(k-1,3)+c1*Math.pow(k-1,2); }

// ---------- canvas textures ----------
function roundRect(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
function archRect(ctx,x,y,w,h){ ctx.beginPath(); ctx.moveTo(x,y+h); ctx.lineTo(x,y+w/2); ctx.arc(x+w/2,y+w/2,w/2,Math.PI,0); ctx.lineTo(x+w,y+h); ctx.closePath(); }
function makeCanvas(w,h,draw){ var c=document.createElement('canvas'); c.width=w; c.height=h; draw(c.getContext('2d'),w,h); return c; }
function texFrom(canvas,rx,ry){ var t=new T.CanvasTexture(canvas); t.encoding=T.sRGBEncoding; if(rx){ t.wrapS=t.wrapT=T.RepeatWrapping; t.repeat.set(rx,ry||1); } t.anisotropy=4; return t; }
function canvasTex(w,h,draw,rx,ry){ return texFrom(makeCanvas(w,h,draw),rx,ry); }
function drawSign(text){ return function(ctx,w,h){ ctx.clearRect(0,0,w,h); ctx.fillStyle='#fff6e6'; roundRect(ctx,5,5,w-10,h-10,20); ctx.fill(); ctx.lineWidth=7; ctx.strokeStyle='#8a5a2b'; ctx.stroke(); ctx.fillStyle='#b8352f'; ctx.font='900 '+Math.round(h*0.52)+'px Nunito, "Segoe UI", Arial, sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(text, w/2, h/2+3); }; }
var TEX = {
  stone: canvasTex(256,256,function(ctx,w,h){ ctx.fillStyle='#b39f78'; ctx.fillRect(0,0,w,h); var cols=['#e6d6ad','#dfcda3','#d9c59b','#ead9b6','#d4bf95'];
    for(var y=0;y<4;y++){ for(var x=0;x<4;x++){ var off=(y%2)?32:0; var px=x*64+off, py=y*64; ctx.fillStyle=cols[(x*3+y*5)%cols.length]; [px,px-w].forEach(function(xx){ roundRect(ctx,xx+4,py+4,56,56,12); ctx.fill(); }); } } }, 8, 7),
  grass: canvasTex(128,128,function(ctx,w,h){ ctx.fillStyle='#79c268'; ctx.fillRect(0,0,w,h); var cols=['#6fb75f','#86cf74','#64aa56','#8ed27c']; for(var i=0;i<220;i++){ ctx.fillStyle=cols[i%4]; ctx.fillRect(Math.random()*w,Math.random()*h,3,6); } }, 6, 4),
  pave: canvasTex(128,128,function(ctx,w,h){ ctx.fillStyle='#bdb3a3'; ctx.fillRect(0,0,w,h); var cols=['#d8cfbf','#d2c8b7','#dcd3c4','#cfc5b3']; for(var y=0;y<2;y++) for(var x=0;x<2;x++){ ctx.fillStyle=cols[x+y*2]; ctx.fillRect(x*64+3,y*64+3,58,58); } }, 50, 50),
  wood: canvasTex(256,256,function(ctx,w,h){ var cols=['#cfa875','#c69d6b','#d6b283','#c29868']; for(var i=0;i<8;i++){ ctx.fillStyle=cols[i%4]; ctx.fillRect(0,i*32,w,32); ctx.fillStyle='#9a7247'; ctx.fillRect(0,i*32,w,2); ctx.fillStyle='rgba(0,0,0,0.08)'; ctx.fillRect((i*97)%w,i*32,2,32); } }, 4, 3),
  woodSmall: canvasTex(256,256,function(ctx,w,h){ var cols=['#b98f5e','#b08657','#c29868','#a97f52']; for(var i=0;i<8;i++){ ctx.fillStyle=cols[i%4]; ctx.fillRect(0,i*32,w,32); ctx.fillStyle='#8a6440'; ctx.fillRect(0,i*32,w,2); } }, 2, 1),
  carpet: canvasTex(192,128,function(ctx,w,h){ ctx.fillStyle='#b8352f'; ctx.fillRect(0,0,w,h); ctx.strokeStyle='#e3b95b'; ctx.lineWidth=8; ctx.strokeRect(8,8,w-16,h-16);
    for(var i=0;i<3;i++){ var cx=48+i*48, cy=h/2; ctx.fillStyle='#f1e6c8'; ctx.beginPath(); ctx.moveTo(cx,cy-22); ctx.lineTo(cx+22,cy); ctx.lineTo(cx,cy+22); ctx.lineTo(cx-22,cy); ctx.closePath(); ctx.fill(); ctx.fillStyle='#2b4c7e'; ctx.beginPath(); ctx.moveTo(cx,cy-9); ctx.lineTo(cx+9,cy); ctx.lineTo(cx,cy+9); ctx.lineTo(cx-9,cy); ctx.closePath(); ctx.fill(); } }),
  kilim: canvasTex(256,64,function(ctx,w,h){ ctx.fillStyle='#b8352f'; ctx.fillRect(0,0,w,h); ctx.fillStyle='#e3b95b'; ctx.fillRect(0,0,w,8); ctx.fillRect(0,h-8,w,8); ctx.fillStyle='#f1e6c8'; for(var i=0;i<8;i++){ var x=i*32+16; ctx.beginPath(); ctx.moveTo(x,16); ctx.lineTo(x+12,32); ctx.lineTo(x,48); ctx.lineTo(x-12,32); ctx.closePath(); ctx.fill(); } }, 3, 1),
  cloth: canvasTex(64,64,function(ctx,w,h){ ctx.fillStyle='#f6efe2'; ctx.fillRect(0,0,w,h); ctx.strokeStyle='#b8352f'; ctx.lineWidth=4; ctx.strokeRect(5,5,w-10,h-10); ctx.fillStyle='#b8352f'; ctx.beginPath(); ctx.moveTo(32,20); ctx.lineTo(44,32); ctx.lineTo(32,44); ctx.lineTo(20,32); ctx.closePath(); ctx.fill(); }),
  board: canvasTex(256,192,function(ctx,w,h){ ctx.fillStyle='#8a5a2b'; ctx.fillRect(0,0,w,h); ctx.fillStyle='#d8b87a'; ctx.fillRect(8,8,w-16,h-16); ctx.fillStyle='#5a3a1e'; ctx.fillRect(w/2-4,8,8,h-16);
    for(var i=0;i<12;i++){ var x=10+i*19+(i>=6?10:0); ctx.fillStyle = i%2?'#2b1b10':'#b8352f'; ctx.beginPath(); ctx.moveTo(x,8); ctx.lineTo(x+17,8); ctx.lineTo(x+8.5,h/2-6); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(x,h-8); ctx.lineTo(x+17,h-8); ctx.lineTo(x+8.5,h/2+6); ctx.closePath(); ctx.fill(); } }),
  roadV: canvasTex(64,128,function(ctx,w,h){ ctx.fillStyle='#5d636b'; ctx.fillRect(0,0,w,h); ctx.fillStyle='#f2efe6'; ctx.fillRect(30,0,4,64); ctx.fillStyle='#4f555c'; ctx.fillRect(0,0,3,h); ctx.fillRect(w-3,0,3,h); }, 1, 22),
  roadH: canvasTex(64,128,function(ctx,w,h){ ctx.fillStyle='#5d636b'; ctx.fillRect(0,0,w,h); ctx.fillStyle='#f2efe6'; ctx.fillRect(30,0,4,64); ctx.fillStyle='#4f555c'; ctx.fillRect(0,0,3,h); ctx.fillRect(w-3,0,3,h); }, 1, 12),
  sign: canvasTex(320,112,drawSign('Çayxana')),
  cay: canvasTex(192,96,drawSign('Çay')),
  kassa: canvasTex(192,96,drawSign('Kassa'))
};
TEX.boardRot=(function(){ var t=texFrom(TEX.board.image); t.center.set(0.5,0.5); t.rotation=Math.PI/2; return t; })();
var shushCanvas = makeCanvas(128,64,function(ctx,w,h){ ctx.fillStyle='#6b4426'; ctx.fillRect(0,0,w,h); for(var i=0;i<4;i++) for(var j=0;j<2;j++){ ctx.fillStyle = (i+j)%2 ? '#b7d3e2' : '#c9e0ea'; ctx.fillRect(6+i*30,6+j*28,24,22); } ctx.fillStyle='#8a5a32'; ctx.fillRect(0,0,w,4); });
var facadeCache = {};
function facadeCanvas(wall, upper){ var key=wall+(upper?'u':''); if(facadeCache[key]) return facadeCache[key];
  var c=makeCanvas(128, upper?256:128, function(ctx,w,h){ ctx.fillStyle=wall; ctx.fillRect(0,0,w,h);
    ctx.fillStyle='rgba(0,0,0,0.07)'; ctx.fillRect(0,120,w,8);
    ctx.fillStyle='#7a5230'; archRect(ctx,34,18,60,86); ctx.fill();
    ctx.fillStyle='#9fc0d4'; archRect(ctx,40,24,48,74); ctx.fill();
    ctx.fillStyle='#7a5230'; ctx.fillRect(62,24,4,74); ctx.fillRect(40,62,48,4);
    ctx.fillStyle='rgba(255,255,255,0.35)'; ctx.fillRect(44,66,10,28);
    ctx.fillStyle='rgba(0,0,0,0.12)'; ctx.fillRect(30,104,68,7);
    if(upper){ ctx.fillStyle='rgba(0,0,0,0.06)'; ctx.fillRect(0,250,w,6); } });
  facadeCache[key]=c; return c; }
if(document.fonts && document.fonts.ready){ document.fonts.ready.then(function(){ [[TEX.sign,'Çayxana'],[TEX.cay,'Çay'],[TEX.kassa,'Kassa']].forEach(function(p){ var c=p[0].image; drawSign(p[1])(c.getContext('2d'),c.width,c.height); p[0].needsUpdate=true; }); }); }

// ---------- static batching (fewer draw calls) ----------
function mergeGeos(geos){ var total=0; geos.forEach(function(g){ total+=g.attributes.position.count; });
  var pos=new Float32Array(total*3), nor=new Float32Array(total*3), uv=new Float32Array(total*2), o=0;
  geos.forEach(function(g){ pos.set(g.attributes.position.array, o*3); nor.set(g.attributes.normal.array, o*3); if(g.attributes.uv) uv.set(g.attributes.uv.array, o*2); o+=g.attributes.position.count; });
  var r=new T.BufferGeometry(); r.setAttribute('position',new T.BufferAttribute(pos,3)); r.setAttribute('normal',new T.BufferAttribute(nor,3)); r.setAttribute('uv',new T.BufferAttribute(uv,2)); r.computeBoundingSphere(); return r; }
function bakeMeshes(group, list, rel){ if(list.length<2) return; var buckets={}, order=[];
  list.forEach(function(o){ var geo=o.geometry.index? o.geometry.toNonIndexed() : o.geometry.clone(); geo.applyMatrix4(rel(o)); var key=o.material.uuid;
    if(!buckets[key]){ buckets[key]={mat:o.material, cast:false, geos:[]}; order.push(key); } if(o.castShadow) buckets[key].cast=true; buckets[key].geos.push(geo); });
  list.forEach(function(o){ if(o.parent) o.parent.remove(o); o.geometry.dispose(); });
  order.forEach(function(k){ var b=buckets[k], mg=mergeGeos(b.geos); b.geos.forEach(function(g){ g.dispose(); }); var m=new T.Mesh(mg,b.mat); m.castShadow=b.cast; m.receiveShadow=true; group.add(m); }); }
function bakeable(o){ return o.isMesh && !o.userData.keep && !Array.isArray(o.material); }
function bakeAll(group){ group.updateMatrixWorld(true); var inv=new T.Matrix4().copy(group.matrixWorld).invert(), list=[], mats={};
  group.traverse(function(o){ if(o!==group && bakeable(o)){ list.push(o); mats[o.uuid]=new T.Matrix4().multiplyMatrices(inv,o.matrixWorld); } });
  bakeMeshes(group, list, function(o){ return mats[o.uuid]; }); }
function bakeDirect(group){ var list=group.children.filter(function(o){ return bakeable(o) && o.children.length===0; }); list.forEach(function(o){ o.updateMatrix(); }); bakeMeshes(group, list, function(o){ return o.matrix; }); }
function disposeTree(obj){ obj.traverse(function(o){ if(o.isMesh && o.geometry && !o.geometry.userData.shared) o.geometry.dispose(); }); }

// ---------- items (armudu glass with brewed tea, paxlava on a plate) ----------
var ITEM_MAT = new T.MeshPhongMaterial({vertexColors:true, specular:0x6a6a6a, shininess:80});
function lin(hex){ return new T.Color(hex).convertSRGBToLinear(); }
function colored(geo,hex){ geo=geo.index? geo.toNonIndexed() : geo; if(!geo.attributes.color){ var c=lin(hex), n=geo.attributes.position.count, a=new Float32Array(n*3); for(var i=0;i<n;i++){ a[i*3]=c.r; a[i*3+1]=c.g; a[i*3+2]=c.b; } geo.setAttribute('color',new T.BufferAttribute(a,3)); } return geo; }
function colorLathe(prof,seg){ var geo=new T.LatheGeometry(prof.map(function(p){ return new T.Vector2(p[0],p[1]); }), seg), n=geo.attributes.position.count, np=prof.length, a=new Float32Array(n*3);
  for(var i=0;i<n;i++){ var c=lin(prof[i%np][2]); a[i*3]=c.r; a[i*3+1]=c.g; a[i*3+2]=c.b; } geo.setAttribute('color',new T.BufferAttribute(a,3)); return colored(geo); }
function mergeColored(geos){ var total=0; geos.forEach(function(g){ total+=g.attributes.position.count; });
  var pos=new Float32Array(total*3), nor=new Float32Array(total*3), col=new Float32Array(total*3), o=0;
  geos.forEach(function(g){ pos.set(g.attributes.position.array,o*3); nor.set(g.attributes.normal.array,o*3); col.set(g.attributes.color.array,o*3); o+=g.attributes.position.count; });
  var r=new T.BufferGeometry(); r.setAttribute('position',new T.BufferAttribute(pos,3)); r.setAttribute('normal',new T.BufferAttribute(nor,3)); r.setAttribute('color',new T.BufferAttribute(col,3)); r.computeBoundingSphere(); r.userData.shared=true; return r; }
var GLASS_C=0xdfe8ea, GOLD_C=0xd4a640, TEA_D=0x4e1307, TEA_C=0x6e1f0b, TEA_L=0x8a2e12, TEA_S=0x3e0f05;
var glassGeo = (function(){
  var saucer=colored(new T.CylinderGeometry(0.062,0.055,0.008,18),0xf2ede4); saucer.translate(0,0.004,0);
  var body=colorLathe([[0,0.008,GLASS_C],[0.026,0.008,GLASS_C],[0.031,0.014,TEA_D],[0.038,0.026,TEA_D],[0.04,0.04,TEA_C],[0.034,0.055,TEA_C],[0.025,0.068,TEA_C],[0.027,0.08,TEA_C],[0.033,0.09,TEA_L],[0.038,0.098,GLASS_C],[0.043,0.108,GOLD_C],[0.041,0.111,GOLD_C],[0.036,0.104,TEA_S],[0,0.104,TEA_S]],18);
  return mergeColored([saucer,body]); })();
var paxGeo = (function(){
  var parts=[], plate=colored(new T.CylinderGeometry(0.05,0.045,0.005,18),0xf2ede4); plate.translate(0,0.0025,0); parts.push(plate);
  function rh(h,y,col,sc){ var g=new T.BoxGeometry(0.0247*sc,h,0.0247*sc); g.rotateY(Math.PI/4); g.scale(1.7,1,1); g.translate(0,y+h/2,0); return colored(g,col); }
  [-1,1].forEach(function(sg){ var layers=[rh(0.005,0.005,0xe0aa52,1),rh(0.0035,0.010,0x6e4220,0.97),rh(0.0045,0.0135,0xe6b863,1),rh(0.003,0.018,0x6e4220,0.97),rh(0.0035,0.021,0xa8461b,1)];
    var nut=colored(new T.SphereGeometry(0.0055,8,6),0x8a5a32); nut.scale(1.3,0.6,1); nut.translate(0,0.0255,0); layers.push(nut);
    layers.forEach(function(g){ g.rotateY(sg*0.5); g.translate(sg*0.019,0,sg*0.008); parts.push(g); }); });
  return mergeColored(parts); })();
var coinGeo = new T.CylinderGeometry(0.13,0.13,0.05,12); coinGeo.userData.shared=true;
function makeItem(type){ var m=new T.Mesh(type==='tea'?glassGeo : type==='pax'?paxGeo : (TEA_VAR_GEOS[type]||SWEET_GEOS[type]||DISH_GEOS[type]||glassGeo), ITEM_MAT); m.castShadow=false; return {type:type, mesh:m, t:0, base:0}; }
var TRAY_SLOTS=(function(){ var a=[]; for(var x=-2;x<=2;x++) for(var z=-2;z<=2;z++){ var px=x*0.1, pz=z*0.1; if(Math.hypot(px,pz)<=0.235) a.push([px,pz]); } a.sort(function(p,q){ return Math.hypot(p[0],p[1])-Math.hypot(q[0],q[1]); }); return a; })();
function takeLast(items, type){ for(var i=items.length-1;i>=0;i--){ if(!type||items[i].type===type) return items.splice(i,1)[0]; } return null; }
function hasType(items, type){ for(var i=0;i<items.length;i++) if(items[i].type===type) return true; return false; }
var COUNTER_SLOTS=[[-0.18,-0.07],[-0.06,-0.07],[0.06,-0.07],[0.18,-0.07],[-0.18,0.07],[-0.06,0.07],[0.06,0.07],[0.18,0.07]];
function layStack(items, parent, o){ var slots=o.slots||TRAY_SLOTS, bs=o.bslots||BIG_SLOTS, n=slots.length, m=bs.length, ns=0, si=0, bi=0, i;
  for(i=0;i<items.length;i++) if(!ITEM_BIG[items[i].type]) ns++; var base= ns ? Math.ceil(ns/n)*0.125 : 0;
  for(i=0;i<items.length;i++){ var it=items[i]; if(it.mesh.parent!==parent) parent.add(it.mesh);
    if(ITEM_BIG[it.type]){ var b=bs[bi%m]; it.mesh.position.set(o.x+b[0], o.y+base+Math.floor(bi/m)*0.055, o.z+b[1]); bi++; }
    else { var q=slots[si%n]; it.mesh.position.set(o.x+q[0], o.y+Math.floor(si/n)*0.125, o.z+q[1]); si++; } } }

// ---------- tea varieties ----------
var CAY_TYPES=['tea','pax','teaL','teaK','teaM','sek','bad','qog'];
var CAY_PRICE={tea:2, pax:6, teaL:4, teaK:4, teaM:5, sek:6, bad:7, qog:5};
var CAY_ICON={teaL:'🍋', teaK:'🌿', teaM:'🍒', sek:'🥟', bad:'🥐', qog:'🥯'};
var COUNTER_SLOTS16=[]; for(var ci=0;ci<8;ci++){ COUNTER_SLOTS16.push([-0.42+ci*0.12,-0.07]); } for(var cj=0;cj<8;cj++){ COUNTER_SLOTS16.push([-0.42+cj*0.12,0.07]); }
function teaGlassParts(body, surface){ var saucer=colored(new T.CylinderGeometry(0.066,0.058,0.008,18),0xf2ede4); saucer.translate(0,0.004,0);
  var g=colorLathe([[0,0.008,GLASS_C],[0.026,0.008,GLASS_C],[0.031,0.014,body[0]],[0.038,0.026,body[0]],[0.04,0.04,body[1]],[0.034,0.055,body[1]],[0.025,0.068,body[1]],[0.027,0.08,body[1]],[0.033,0.09,body[2]],[0.038,0.098,GLASS_C],[0.043,0.108,GOLD_C],[0.041,0.111,GOLD_C],[0.036,0.104,surface],[0,0.104,surface]],18);
  return [saucer,g]; }
var TEA_VAR_GEOS={
  teaL:(function(){ var a=teaGlassParts([0x5a1a08,0x8a3412,0xa84a1c],0x6a2208); var sl=new T.CylinderGeometry(0.022,0.022,0.006,14); sl.translate(0.046,0.011,0.03); a.push(colored(sl,0xf2d64a)); var rind=new T.TorusGeometry(0.022,0.003,4,14); rind.rotateX(Math.PI/2); rind.translate(0.046,0.012,0.03); a.push(colored(rind,0xe0b020)); return mergeColored(a); })(),
  teaK:(function(){ var a=teaGlassParts([0x6a3008,0xa0581a,0xb8702a],0x7a3a0c); for(var i=0;i<4;i++){ var l=new T.SphereGeometry(0.007,6,4); l.scale(1,0.6,2.2); l.rotateY(i*0.6); l.translate(0.042+i*0.004,0.012,0.03-i*0.012); a.push(colored(l,0x5c8a3a)); } var st=new T.CylinderGeometry(0.002,0.002,0.06,4); st.rotateZ(Math.PI/2); st.rotateY(0.5); st.translate(0.044,0.011,0.012); a.push(colored(st,0x4a6a2a)); return mergeColored(a); })(),
  teaM:(function(){ var a=teaGlassParts([0x4e1307,0x6e1f0b,0x8a2e12],0x3e0f05); var bowl=new T.CylinderGeometry(0.02,0.015,0.016,12); bowl.translate(0.05,0.016,0.03); a.push(colored(bowl,0xf6f2ea)); var jam=new T.CylinderGeometry(0.017,0.017,0.004,12); jam.translate(0.05,0.025,0.03); a.push(colored(jam,0x8a1a2a)); var ch=new T.SphereGeometry(0.006,6,4); ch.translate(0.052,0.028,0.026); a.push(colored(ch,0x5a0a14)); return mergeColored(a); })()
};

// ---------- more sweets: şəkərbura, badambura, qoğal from a sweets kiosk on the terrace ----------
var SWEET_GEOS={
  sek:(function(){ var a=[plateG(0.06)]; [-1,1].forEach(function(sg){ var h=new T.CylinderGeometry(0.034,0.034,0.016,14,1,false,0,Math.PI); h.scale(1,1,0.75); h.rotateY(sg>0?0:Math.PI); h.translate(0.0,0.016,sg*0.012); a.push(colored(h,0xe8c27a));
      for(var r=0;r<3;r++){ var rid=new T.BoxGeometry(0.004,0.003,0.022); rid.rotateY(-0.6+r*0.6); rid.translate((r-1)*0.016,0.025,sg*0.03); a.push(colored(rid,0xb8843a)); } }); return mergeColored(a); })(),
  bad:(function(){ var a=[plateG(0.06)]; [-0.018,0.018].forEach(function(z){ var c=new T.CylinderGeometry(0.017,0.017,0.06,12); c.rotateZ(Math.PI/2); c.translate(0,0.022,z); a.push(colored(c,0xd9a95a)); [-0.031,0.031].forEach(function(x){ var e=new T.TorusGeometry(0.009,0.003,4,10); e.rotateY(Math.PI/2); e.translate(x,0.022,z); a.push(colored(e,0x9a6a3e)); }); }); return mergeColored(a); })(),
  qog:(function(){ var a=[plateG(0.06)]; var b=new T.CylinderGeometry(0.034,0.038,0.022,16); b.translate(0,0.017,0); a.push(colored(b,0xc98a3a)); var t=new T.SphereGeometry(0.034,14,6,0,Math.PI*2,0,Math.PI/2); t.scale(1,0.25,1); t.translate(0,0.028,0); a.push(colored(t,0xb0702a));
    for(var i=0;i<8;i++){ var s2=new T.SphereGeometry(0.003,4,3); var ang=i/8*Math.PI*2; s2.translate(Math.cos(ang)*0.018,0.035,Math.sin(ang)*0.018); a.push(colored(s2,0xf6efe2)); } return mergeColored(a); })()
};

// ---------- entities ----------
var samovars=[], tables=[], customers=[], waiters=[], cars=[], waitQ=[], coins=[], labels=[], pops=[];
var pile=null, paxSt=null, kassir=null, tile=null, upTable=null, terrace=null, southGate=null, musician=null, player=null, usta=null;
var B = {xmin:-40, xmax:53.5, zmin:-47, zmax:53};
var labelsEl = $('labels');

function lbl(cls, html){ var el=document.createElement('div'); el.className='lbl '+cls; el.innerHTML=html; labelsEl.appendChild(el); return el; }
function addLabel(el, pos, get){ var L={el:el, pos:pos, get:get}; labels.push(L); return L; }
function floatText(pos, text, big){ var el=lbl('float'+(big?' big':''), text); labels.push({el:el, pos:new T.Vector3(pos.x, (pos.y||0)+2.1, pos.z), ttl:0.85}); }

// ---------- obstacles, collision, pathfinding ----------
var OBST=[], gateObst=null, gridDirty=true, gridVer=0;
function addObst(x0,x1,z0,z1){ var o={x0:x0,x1:x1,z0:z0,z1:z1}; OBST.push(o); gridDirty=true; return o; }
function removeObst(o){ var i=OBST.indexOf(o); if(i>=0){ OBST.splice(i,1); gridDirty=true; } }
function collide(e){ var R=0.3; for(var k=0;k<OBST.length;k++){ var o=OBST[k], x0=o.x0-R, x1=o.x1+R, z0=o.z0-R, z1=o.z1+R, px=e.pos.x, pz=e.pos.z;
  if(px>x0&&px<x1&&pz>z0&&pz<z1){ var a=px-x0, b=x1-px, c=pz-z0, d=z1-pz, m=Math.min(a,b,c,d); if(m===a) e.pos.x=x0; else if(m===b) e.pos.x=x1; else if(m===c) e.pos.z=z0; else e.pos.z=z1; } } }
var GX0=-42, GZ0=-49, CS=0.5, GW=196, GH=210, grid=new Uint8Array(GW*GH);
function buildGrid(){ grid.fill(0); var mg=0.38;
  for(var k=0;k<OBST.length;k++){ var o=OBST[k];
    var i0=Math.max(0,Math.floor((o.x0-mg-GX0)/CS)), i1=Math.min(GW-1,Math.floor((o.x1+mg-GX0)/CS)), j0=Math.max(0,Math.floor((o.z0-mg-GZ0)/CS)), j1=Math.min(GH-1,Math.floor((o.z1+mg-GZ0)/CS));
    for(var j=j0;j<=j1;j++) for(var i=i0;i<=i1;i++){ var cx=GX0+(i+0.5)*CS, cz=GZ0+(j+0.5)*CS; if(cx>o.x0-mg&&cx<o.x1+mg&&cz>o.z0-mg&&cz<o.z1+mg) grid[i+j*GW]=1; } }
  markUnreachable(); gridDirty=false; gridVer++; }
var REACH=new Uint8Array(GW*GH), RQ=new Int32Array(GW*GH);
function markUnreachable(){ REACH.fill(0); var qh=0, qt=0;
  [[0.25,0.25],[9.4,0],[9.4,-7.5]].forEach(function(p){ var c=cellOf(p[0],p[1]); if(c>=0 && !grid[c] && !REACH[c]){ REACH[c]=1; RQ[qt++]=c; } });
  while(qh<qt){ var c=RQ[qh++], x=c%GW, z=Math.floor(c/GW);
    if(x>0 && !grid[c-1] && !REACH[c-1]){ REACH[c-1]=1; RQ[qt++]=c-1; } if(x<GW-1 && !grid[c+1] && !REACH[c+1]){ REACH[c+1]=1; RQ[qt++]=c+1; }
    if(z>0 && !grid[c-GW] && !REACH[c-GW]){ REACH[c-GW]=1; RQ[qt++]=c-GW; } if(z<GH-1 && !grid[c+GW] && !REACH[c+GW]){ REACH[c+GW]=1; RQ[qt++]=c+GW; } }
  for(var i=0;i<GW*GH;i++) if(!grid[i] && !REACH[i]) grid[i]=2; }
function cellOf(x,z){ var i=Math.floor((x-GX0)/CS), j=Math.floor((z-GZ0)/CS); return (i<0||j<0||i>=GW||j>=GH) ? -1 : i+j*GW; }
function cellCenter(c){ return [GX0+(c%GW+0.5)*CS, GZ0+(Math.floor(c/GW)+0.5)*CS]; }
function nearestFree(c){ if(!grid[c]) return c; var cx=c%GW, cz=Math.floor(c/GW);
  for(var r=1;r<40;r++){ var best=-1, bd=1e9; for(var dz=-r;dz<=r;dz++) for(var dx=-r;dx<=r;dx++){ if(Math.max(Math.abs(dx),Math.abs(dz))!==r) continue; var x=cx+dx, z=cz+dz; if(x<0||z<0||x>=GW||z>=GH) continue; var i=x+z*GW; if(!grid[i]){ var d=dx*dx+dz*dz; if(d<bd){ bd=d; best=i; } } } if(best>=0) return best; }
  return -1; }
var PATH_R=0.36;
function segClear(ax,az,bx,bz,r){ var dx=bx-ax, dz=bz-az, mnx=Math.min(ax,bx)-r, mxx=Math.max(ax,bx)+r, mnz=Math.min(az,bz)-r, mxz=Math.max(az,bz)+r;
  for(var k=0;k<OBST.length;k++){ var o=OBST[k]; if(o.x1<mnx||o.x0>mxx||o.z1<mnz||o.z0>mxz) continue; var x0=o.x0-r, x1=o.x1+r, z0=o.z0-r, z1=o.z1+r;
    if((ax>x0&&ax<x1&&az>z0&&az<z1) || (bx>x0&&bx<x1&&bz>z0&&bz<z1)) continue;
    var t0=0, t1=1, P=[-dx,dx,-dz,dz], Q=[ax-x0,x1-ax,az-z0,z1-az], hit=true;
    for(var i=0;i<4;i++){ if(P[i]===0){ if(Q[i]<0){ hit=false; break; } } else { var t=Q[i]/P[i]; if(P[i]<0){ if(t>t1){ hit=false; break; } if(t>t0) t0=t; } else { if(t<t0){ hit=false; break; } if(t<t1) t1=t; } } }
    if(hit && t0<=t1) return false; }
  return true; }
function losFree(ax,az,bx,bz,ia,ib){ var dx=bx-ax, dz=bz-az, n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/0.2));
  for(var k=1;k<n;k++){ var c=cellOf(ax+dx*k/n, az+dz*k/n); if(c<0) return false; if(grid[c] && c!==ia && c!==ib) return false; } return true; }
var AS_G=new Float32Array(GW*GH), AS_F=new Float32Array(GW*GH), AS_FROM=new Int32Array(GW*GH), AS_DONE=new Uint8Array(GW*GH), AS_HEAP=[];
function astar(si,ti){
  var N=GW*GH, g=AS_G.fill(1e9), f=AS_F, from=AS_FROM.fill(-1), done=AS_DONE.fill(0), heap=AS_HEAP; heap.length=0;
  var tx=ti%GW, tz=Math.floor(ti/GW);
  function h(i){ var dx=Math.abs(i%GW-tx), dz=Math.abs(Math.floor(i/GW)-tz); return 1.25*(dx+dz-0.5858*Math.min(dx,dz)); }
  function push(i){ heap.push(i); var k=heap.length-1; while(k>0){ var p=(k-1)>>1; if(f[heap[p]]<=f[heap[k]]) break; var t=heap[p]; heap[p]=heap[k]; heap[k]=t; k=p; } }
  function pop(){ var top=heap[0], last=heap.pop(); if(heap.length){ heap[0]=last; var k=0, n=heap.length; for(;;){ var l=2*k+1, r=l+1, m=k; if(l<n&&f[heap[l]]<f[heap[m]]) m=l; if(r<n&&f[heap[r]]<f[heap[m]]) m=r; if(m===k) break; var t=heap[m]; heap[m]=heap[k]; heap[k]=t; k=m; } } return top; }
  var DX=[1,-1,0,0,1,1,-1,-1], DZ=[0,0,1,-1,1,-1,1,-1];
  g[si]=0; f[si]=h(si); push(si);
  while(heap.length){ var cur=pop(); if(cur===ti) break; if(done[cur]) continue; done[cur]=1;
    var cx=cur%GW, cz=Math.floor(cur/GW);
    for(var d=0;d<8;d++){ var nx=cx+DX[d], nz=cz+DZ[d]; if(nx<0||nz<0||nx>=GW||nz>=GH) continue; var ni=nx+nz*GW; if(grid[ni]||done[ni]) continue;
      if(d>=4 && (grid[nx+cz*GW] || grid[cx+nz*GW])) continue;
      var ng=g[cur]+(d<4?1:1.4142); if(ng<g[ni]){ g[ni]=ng; f[ni]=ng+h(ni); from[ni]=cur; push(ni); } } }
  if(si!==ti && from[ti]<0) return null;
  var cells=[], k=ti, guard=0; while(k!==si){ cells.push(k); k=from[k]; if(k<0 || ++guard>N) return null; } cells.push(si); cells.reverse(); return cells; }
function findPath(sx,sz,tx,tz){
  if(gridDirty) buildGrid();
  var si=cellOf(sx,sz), ti=cellOf(tx,tz); if(si<0||ti<0) return [[tx,tz]];
  if(grid[ti]!==2 && segClear(sx,sz,tx,tz,PATH_R) && losFree(sx,sz,tx,tz,si,ti)) return [[tx,tz]];
  var fs=nearestFree(si), ft=nearestFree(ti); if(fs<0||ft<0) return [[tx,tz]];
  var cells=astar(fs,ft); if(!cells) return [[tx,tz]];
  var pts=cells.map(cellCenter); pts.push([tx,tz]);
  var out=[], ax=sx, az=sz, i=0;
  var last=0; for(var q=1;q<pts.length;q++){ if(!(losFree(ax,az,pts[q][0],pts[q][1],si,ti) && segClear(ax,az,pts[q][0],pts[q][1],PATH_R))){ var w=pts[Math.max(last,q-1)]; out.push(w); ax=w[0]; az=w[1]; last=q; } }
  out.push(pts[pts.length-1]);
  return out; }
function nav(e,x,z,sp,dt){
  if(gridDirty) buildGrid();
  if(!e.dest || Math.abs(e.dest.x-x)>0.01 || Math.abs(e.dest.z-z)>0.01 || e.navVer!==gridVer){ e.dest={x:x,z:z}; e.navVer=gridVer; e.path=findPath(e.pos.x,e.pos.z,x,z); }
  if(e.path.length>1){ var p=e.path[0]; if(moveTo(e,p[0],p[1],sp,dt)) e.path.shift(); return false; }
  return moveTo(e,x,z,sp,dt); }

// ---------- scenery ----------
function tree(x,z,parent){ var g=new T.Group(); g.add(cyl(0.18,0.26,1.2,0x8b5a2b,0,0.6,0,10));
  var c1=sph(0.95,0x4fa643,0,2.0,0); c1.scale.set(1,0.9,1); g.add(c1); g.add(sph(0.7,0x62bb55,-0.55,2.45,0.1)); g.add(sph(0.7,0x5db04c,0.55,2.4,-0.1)); g.add(sph(0.55,0x7ccc6c,0,2.95,0));
  g.position.set(x,0,z); (parent||scene).add(g); return g; }
function bush(x,z,parent){ var m=sph(0.5,0x5db04c,x,0.35,z); m.scale.set(1.2,0.8,1); (parent||scene).add(m); return m; }
function flower(x,z,c,parent){ var g=new T.Group(); g.add(cyl(0.02,0.02,0.26,0x4fa643,0,0.13,0,5)); var h=sph(0.09,c,0,0.3,0); h.castShadow=false; g.add(h); g.position.set(x,0,z); (parent||scene).add(g); }
function fenceSide(ax,az,bx,bz,side,gaps,parent){
  parent=parent||scene; var horiz=(az===bz); var from=horiz?ax:az, to=horiz?bx:bz;
  var cuts=gaps.filter(function(g){ return g.side===side; }).sort(function(a,b){ return a.from-b.from; });
  var ivs=[], cur=from; cuts.forEach(function(g){ if(g.from>cur) ivs.push([cur,g.from]); cur=Math.max(cur,g.to); }); if(cur<to) ivs.push([cur,to]);
  ivs.forEach(function(iv){ var a=iv[0], b=iv[1], len=b-a, mid=(a+b)/2; var x=horiz?mid:ax, z=horiz?az:mid;
    [0.32,0.68].forEach(function(y){ parent.add(horiz? box(len,0.09,0.07,0xb07a44,x,y,z) : box(0.07,0.09,len,0xb07a44,x,y,z)); });
    var n=Math.max(1,Math.round(len/1.5)); for(var i=0;i<=n;i++){ var t=a+(b-a)*i/n; parent.add(cyl(0.09,0.1,1.0,0x8b5a2b, horiz?t:ax, 0.5, horiz?az:t, 8)); parent.add(sph(0.11,0x6b4a2b, horiz?t:ax, 1.02, horiz?az:t)); } });
}
function balcony(face, x, z, y, len){
  var g=new T.Group(), longM=new T.MeshLambertMaterial({map:texFrom(shushCanvas, Math.max(1,Math.round(len/1.4)), 1)}), endM=new T.MeshLambertMaterial({map:texFrom(shushCanvas,1,1)}), wood=M(0x6b4426);
  var m;
  if(face==='+x'){ m=new T.Mesh(new T.BoxGeometry(0.8,2.0,len), [longM,longM,wood,wood,endM,endM]); m.position.set(x+0.4,y+1.0,z); g.add(box(1.0,0.14,len+0.2,0x5a3a1e,x+0.45,y+2.07,z)); g.add(box(0.9,0.12,len+0.1,0x5a3a1e,x+0.45,y-0.06,z)); }
  else { m=new T.Mesh(new T.BoxGeometry(len,2.0,0.8), [endM,endM,wood,wood,longM,longM]); m.position.set(x,y+1.0,z+0.4); g.add(box(len+0.2,0.14,1.0,0x5a3a1e,x,y+2.07,z+0.45)); g.add(box(len+0.1,0.12,0.9,0x5a3a1e,x,y-0.06,z+0.45)); }
  m.castShadow=true; m.receiveShadow=true; g.add(m); g.userData.balcony=true; scene.add(g); }
// ---------- characters ----------
var SKINS=[0xf0c8a4,0xe2b28a,0xcd9a72,0xab7b57];
var HAIRS=[0x2a1d16,0x3b2a1e,0x5a3f2b,0x1b1714,0x7d6a58];
function meshG(geo,c){ var m=new T.Mesh(geo,M(c)); m.castShadow=true; m.receiveShadow=true; return m; }
function tiny(m){ m.castShadow=false; return m; }
function makeChar(o){
  var g=new T.Group(), root=new T.Group(); g.add(root);
  var shirt=o.shirt||0x6d8fb3, pants=o.pants||0x2f3e5c, skin=o.skin||pick(SKINS), hair=o.hair||pick(HAIRS), shoe=o.shoe||0x2b2420, fem=!!o.female;
  var legs=[-0.095,0.095].map(function(x){ var hip=new T.Group(); hip.position.set(x,0.9,0);
    hip.add(cyl(0.085,0.068,0.46,pants,0,-0.23,0,10));
    var knee=new T.Group(); knee.position.set(0,-0.45,0); knee.add(cyl(0.064,0.05,0.4,pants,0,-0.2,0,10)); knee.add(box(0.1,0.07,0.24,shoe,0,-0.42,0.05)); hip.add(knee); hip.userData.knee=knee; root.add(hip); return hip; });
  var pelvis=cyl(0.165,0.155,0.2,pants,0,0.95,0,14); pelvis.scale.z=0.68; root.add(pelvis);
  var torso=cyl(fem?0.18:0.21,o.old?0.2:0.165,0.56,shirt,0,1.3,0,16); torso.scale.z=0.62; root.add(torso);
  [-1,1].forEach(function(sg){ var s=sph(0.075,shirt,sg*(fem?0.18:0.205),1.53,0); s.scale.set(1,0.8,0.9); root.add(s); });
  var belt=cyl(0.168,0.168,0.045,0x2b2420,0,1.03,0,14); belt.scale.z=0.66; root.add(belt);
  if(o.vest){ var v=new T.Mesh(new T.CylinderGeometry(fem?0.185:0.216,0.17,0.48,16,1,true,0.42,Math.PI*2-0.84), M(o.vest)); v.scale.z=0.64; v.position.y=1.29; v.castShadow=true; root.add(v); }
  if(o.apron){ root.add(box(0.3,0.62,0.02,o.apron,0,0.86,0.12)); }
  if(o.tie){ root.add(tiny(box(0.04,0.22,0.02,o.tie,0,1.42,0.112))); }
  if(o.bow){ root.add(tiny(box(0.09,0.035,0.02,0x1b1b1b,0,1.53,0.112))); }
  root.add(cyl(0.048,0.055,0.12,skin,0,1.6,0,10));
  var head=new T.Group(); head.position.set(0,o.old?1.715:1.74,o.old?0.035:0); if(o.old) head.rotation.x=0.15; root.add(head);
  var hd=sph(0.115,skin,0,0,0); hd.scale.set(0.9,1.08,1.0); head.add(hd);
  [-1,1].forEach(function(sg){ var ear=tiny(sph(0.028,skin,sg*0.1,0,0)); ear.scale.set(0.55,1,0.8); head.add(ear);
    head.add(tiny(sph(0.013,0x231a14,sg*0.038,0.018,0.104)));
    head.add(tiny(box(0.042,0.01,0.012,hair,sg*0.04,0.048,0.1))); });
  var nose=tiny(sph(0.022,skin,0,-0.01,0.112)); nose.scale.set(0.8,1.1,1.0); head.add(nose);
  head.add(tiny(box(0.04,0.008,0.01,0x9a5c50,0,-0.055,0.102)));
  if(o.must) head.add(tiny(box(o.old?0.095:0.075,o.old?0.024:0.016,0.018,o.mustColor||hair,0,-0.036,0.108)));
  if(o.hat!=='scarf'){
    if(o.hairStyle!=='bald'){ var cap=meshG(new T.SphereGeometry(0.122,18,12,0,Math.PI*2,0,1.35),hair); cap.position.set(0,0.012,-0.012); cap.rotation.x=-0.45; head.add(cap); }
    if(o.hairStyle==='long') head.add(box(0.2,0.28,0.06,hair,0,-0.1,-0.085));
    if(o.hairStyle==='bun') head.add(sph(0.05,hair,0,0.07,-0.115));
  }
  if(o.hat==='papaq'){ head.add(cyl(0.122,0.118,0.15,o.hatColor||0x3a3a3a,0,0.12,-0.005,16)); }
  else if(o.hat==='kepka'){ var kp=cyl(0.155,0.125,0.06,o.hatColor||0x4a4a4a,0,0.115,0.02,18); kp.scale.z=1.08; head.add(kp); head.add(box(0.15,0.014,0.09,o.hatColor||0x4a4a4a,0,0.088,0.13)); }
  else if(o.hat==='chef'){ head.add(cyl(0.12,0.115,0.09,0xffffff,0,0.1,0,14)); var pf=sph(0.15,0xffffff,0,0.2,0); pf.scale.set(1,0.75,1); head.add(pf); }
  else if(o.hat==='scarf'){ var sc=meshG(new T.SphereGeometry(0.132,18,12,Math.PI/2+0.8,Math.PI*2-1.6,0,Math.PI*0.62),o.hatColor||0xb85c5c); sc.position.set(0,0.004,-0.006); head.add(sc); head.add(box(0.2,0.24,0.05,o.hatColor||0xb85c5c,0,-0.13,-0.075)); }
  var arms=[-1,1].map(function(sg){ var sh=new T.Group(); sh.position.set(sg*(fem?0.215:0.245),1.5,0); sh.add(cyl(0.052,0.046,0.3,shirt,0,-0.15,0,8));
    var el=new T.Group(); el.position.set(0,-0.3,0); el.add(cyl(0.044,0.038,0.26,o.shortSleeve?skin:shirt,0,-0.13,0,8)); el.add(sph(0.042,skin,0,-0.29,0.005)); sh.add(el); sh.userData.elbow=el; sh.rotation.z=sg*0.07; root.add(sh); return sh; });
  if(o.tray){ var tr=new T.Group(); tr.position.set(0,1.2,0.42); tr.add(cyl(0.3,0.28,0.025,0xd6ad4e,0,0.0125,0,28)); var rim=new T.Mesh(new T.TorusGeometry(0.295,0.016,8,28), M(0xb8862a)); rim.rotation.x=Math.PI/2; rim.position.y=0.025; rim.castShadow=true; tr.add(rim); root.add(tr); g.userData.tray=tr; }
  bakeDirect(root); bakeDirect(head); legs.forEach(function(h){ bakeDirect(h); bakeDirect(h.userData.knee); }); arms.forEach(function(a){ bakeDirect(a.userData.elbow); });
  g.userData.legs=legs; g.userData.arms=arms; g.userData.root=root; g.userData.head=head;
  scene.add(g); return g;
}
function randomLook(type, seatKind){
  if(seatKind==='domino'){ var hr=Math.random(); return {shirt:pick([0x6d8fb3,0x8c8f94,0x7a8c6e,0x5b4a3a,0xd9d4c7,0x4f5d75]), pants:pick([0x2b2b2b,0x3a3a3a,0x2f3e5c,0x5c6168]), hair:pick([0x2a1d16,0x5a3f2b,0x9a9a96,0xbdbab4]), hat: hr<0.45?'kepka': hr<0.6?'papaq':null, hatColor:pick([0x4a4a4a,0x5b4a3a,0x3d4450]), must:Math.random()<0.6, mustColor:pick([0x2a1d16,0x9a9a96]), vest: Math.random()<0.3?0x3d3a36:null, shortSleeve:Math.random()<0.3}; }
  var nerdSeat = seatKind==='nerd';
  if(nerdSeat) return {shirt:pick([0x6b6f73,0x7a6a58,0x4f5560]), pants:pick([0x2b2b2b,0x3a3a3a]), hair:0x9a9a96, hat:'papaq', hatColor:pick([0x3a3a3a,0x5a5550]), must:true, mustColor:0xbdbab4, vest:pick([0x2b2b2b,0x3d3a36])};
  var fem=Math.random()<0.4, look={female:fem, hair:pick(HAIRS), shirt:pick(fem?[0xb5546a,0x8a6f9e,0xd9a066,0x6aa39a,0xc9c1b4,0x7e9cc2]:[0x6d8fb3,0xd9d4c7,0x7a8c6e,0xa65d4f,0x4f5d75,0xc9a46b,0x8c8f94]), pants:pick([0x2f3e5c,0x2b2b2b,0x5c6168,0x9c8a6b,0x3d4a3a])};
  if(fem){ if(Math.random()<0.35){ look.hat='scarf'; look.hatColor=pick([0xb85c5c,0x6a7fa8,0xd8c7a0,0x7b5e8a,0x4f7a68]); } else look.hairStyle=pick(['long','bun','long']); }
  else { var hr=Math.random(); if(hr<0.2){ look.hat='kepka'; look.hatColor=pick([0x4a4a4a,0x5b4a3a,0x3d4450]); } else if(hr<0.3) look.hairStyle='bald'; look.must=Math.random()<0.45; look.shortSleeve=Math.random()<0.25; }
  if(type==='vip'){ look={shirt:0x2e3440, pants:0x2e3440, tie:0x8a2b2b, hat:'papaq', hatColor:0x2b2b2b, must:true}; }
  if(type==='toy'){ if(fem) look.shirt=pick([0xd98aa8,0xe6c27a]); else { look.shirt=0x2e3440; look.pants=0x2e3440; look.tie=0xd98aa8; look.shortSleeve=false; } }
  return look;
}

// ---------- stations ----------
function makeSamovar(x,big){
  var z=CFG.backZ, g=new T.Group();
  g.add(box(1.0,0.55,0.9,0x6b4a2b,0,0.275,0));
  var s=new T.Group(); s.position.y=0.55;
  s.add(lathe([[0,0.1],[0.3,0.1],[0.34,0.14],[0.26,0.18],[0.22,0.24],[0.3,0.32],[0.4,0.5],[0.42,0.7],[0.38,0.88],[0.3,1.0],[0.2,1.06],[0.2,1.14],[0.3,1.18],[0.22,1.22],[0.12,1.26],[0,1.26]],0xc9962d,20));
  [-0.46,0.46].forEach(function(dx){ var h=new T.Mesh(new T.TorusGeometry(0.11,0.035,8,14), M(0x2b1b10)); h.position.set(dx,0.72,0); h.rotation.y=Math.PI/2; h.castShadow=true; s.add(h); });
  var tap=cyl(0.045,0.045,0.34,0xb8810f,0,0.42,0.52,8); tap.rotation.x=Math.PI/2; s.add(tap); s.add(sph(0.07,0x2b1b10,0,0.56,0.6));
  var pot=sph(0.19,0xf1ebe0,0,1.44,0); pot.scale.set(1,0.8,1); s.add(pot); s.add(cyl(0.05,0.05,0.26,0xf1ebe0,0.22,1.46,0,6)); s.add(sph(0.05,0x2b4c7e,0,1.62,0));
  g.add(s);
  var steam=new T.Mesh(new T.SphereGeometry(0.14,8,6), new T.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:0.5})); steam.position.set(0,2.3,0); steam.userData.keep=true; g.add(steam);
  if(big){ g.scale.set(1.5,1.5,1.5); var rim=new T.Mesh(new T.TorusGeometry(0.45,0.04,8,20), M(0xb8810f)); rim.rotation.x=Math.PI/2; rim.position.y=1.2; g.add(rim); }
  g.position.set(x,0,z); scene.add(g); bakeAll(g);
  return {grp:g, big:!!big, cap: big?16:CFG.samovarCap, pos:new T.Vector3(x,0,z), out:{x:x, y:0.95, z:CFG.counterZ, slots: big?COUNTER_SLOTS16:COUNTER_SLOTS}, pick:new T.Vector3(x,0,CFG.counterZ), items:[], ready:0, timer:0, steam:steam, t:Math.random()*3};
}
function makePax(x){
  var z=CFG.backZ, g=new T.Group(); var oven=box(1.0,1.0,0.9,0x8d8f93,0,0.5,0); g.add(oven); g.add(box(0.62,0.42,0.04,0x2b1b10,0,0.45,0.46,false));
  var glow=new T.Mesh(new T.PlaneGeometry(0.5,0.3), new T.MeshBasicMaterial({color:0xffa23a})); glow.position.set(0,0.45,0.485); g.add(glow);
  g.add(cyl(0.1,0.1,0.7,0x5a5a5a,0.3,1.35,-0.2,8));
  g.position.set(x,0,z); scene.add(g); bakeAll(g);
  return {grp:g, pos:new T.Vector3(x,0,z), out:{x:x, y:0.95, z:CFG.counterZ, slots:COUNTER_SLOTS}, pick:new T.Vector3(x,0,CFG.counterZ), items:[], timer:0};
}
function makeKassa(x,z){
  var g=new T.Group(); g.add(box(0.1,0.8,0.8,0x8b5a2b,-0.65,0.4,0)); g.add(box(0.1,0.8,0.8,0x8b5a2b,0.65,0.4,0)); g.add(box(1.4,0.8,0.08,0x8b5a2b,0,0.4,0.36)); g.add(box(1.5,0.08,0.9,0x6b4a2b,0,0.84,0));
  g.add(box(0.45,0.32,0.42,0x3d5466,0.45,1.04,-0.1)); g.add(box(0.32,0.14,0.04,0x9fd3a9,0.45,1.12,0.12,false));
  var ms=[]; for(var i=0;i<24;i++){ var col=i%6, lvl=Math.floor(i/6); var m=box(0.25,0.07,0.13,0x2e7d43,(col%3)*0.27-0.56,0.92+lvl*0.075,Math.floor(col/3)*0.17-0.085); m.add(box(0.045,0.072,0.132,0xcfdcbf,0,0,0,false)); m.visible=false; m.userData.keep=true; g.add(m); ms.push(m); }
  g.position.set(x,0,z); scene.add(g); bakeAll(g); addObst(x-0.75,x+0.75,z-0.45,z+0.45);
  var el=lbl('tile warn','Dolub!'); el.style.display='none';
  pile={grp:g, pos:new T.Vector3(x,0,z), amount:0, ms:ms, el:el, fullT:0};
  addLabel(el, new T.Vector3(x,1.3,z+0.5));
  g.add(plane(0.9,0.45,TEX.kassa,0,0.42,0.405));
}
function updatePileMeshes(){ var n=Math.min(24,Math.ceil(pile.amount/12)); for(var i=0;i<24;i++) pile.ms[i].visible=i<n; }
function chair(g, cx, cz, dx, dz){ g.add(box(0.5,0.08,0.5,0x9c6b3c,cx,0.45,cz)); [[-0.2,-0.2],[0.2,-0.2],[-0.2,0.2],[0.2,0.2]].forEach(function(p){ g.add(cyl(0.04,0.04,0.45,0x6b4a2b,cx+p[0],0.225,cz+p[1],6)); });
  if(dx) g.add(box(0.08,0.55,0.5,0x9c6b3c,cx+dx*0.24,0.75,cz)); else g.add(box(0.5,0.55,0.08,0x9c6b3c,cx,0.75,cz+dz*0.24)); }
function makeTable(x,z,kind,list,axis){
  if(kind===true) kind='nerd'; if(!kind) kind='normal';
  var nerd=kind==='nerd', domino=kind==='domino', g=new T.Group(), top, dirs;
  if(nerd){ g.add(cyl(0.1,0.16,0.7,0x6b4a2b,0,0.35,0)); g.add(cyl(0.85,0.85,0.1,0x8b5a2b,0,0.74,0,20)); var wd=M(0x6b4426), brd=new T.Mesh(new T.BoxGeometry(0.62,0.035,0.8),[wd,wd,TM(TEX.boardRot),wd,wd,wd]); brd.position.set(0,0.8075,0); brd.castShadow=true; brd.receiveShadow=true; g.add(brd);
    [[0.25,-0.33,0],[0.195,-0.33,0],[0.25,0.07,0],[0.25,0.2,0],[0.195,0.2,0],[-0.25,0.33,1],[-0.195,0.33,1],[-0.25,-0.07,1],[-0.25,-0.2,1],[-0.195,-0.2,1]].forEach(function(c){ g.add(cyl(0.026,0.026,0.012,c[2]?0x3a1f12:0xf1e6c8,c[0],0.831,c[1],14)); });
    var d1=box(0.024,0.024,0.024,0xffffff,0.04,0.837,0.1); d1.rotation.y=0.4; g.add(d1); var d2=box(0.024,0.024,0.024,0xffffff,-0.01,0.837,0.15); d2.rotation.y=-0.3; g.add(d2); top=0.79; dirs=[[-1,0],[1,0]]; }
  else if(domino){ g.add(box(1.18,0.05,1.18,0x6b4426,0,0.715,0)); g.add(box(1.08,0.012,1.08,0x2f5d46,0,0.745,0)); [[-0.5,-0.5],[0.5,-0.5],[-0.5,0.5],[0.5,0.5]].forEach(function(p){ g.add(cyl(0.045,0.045,0.7,0x5a3a1e,p[0],0.35,p[1],6)); }); top=0.751; dirs=[[-1,0],[1,0],[0,-1],[0,1]]; }
  else { var az=axis==='z'; g.add(az? box(1.0,0.08,1.1,0x8b5a2b,0,0.58,0) : box(1.1,0.08,1.0,0x8b5a2b,0,0.58,0)); [[-0.45,-0.4],[0.45,-0.4],[-0.45,0.4],[0.45,0.4]].forEach(function(p){ g.add(cyl(0.05,0.05,0.56,0x6b4a2b,az?p[1]:p[0],0.28,az?p[0]:p[1],6)); }); g.add(plane(az?0.84:0.92,az?0.92:0.84,TEX.cloth,0,0.623,0,-Math.PI/2)); top=0.63; dirs= az ? [[0,-1],[0,1]] : [[-1,0],[1,0]]; }
  var sd = nerd?1.05:0.95;
  dirs.forEach(function(d){ chair(g, d[0]*sd, d[1]*sd, d[0], d[1]); });
  g.position.set(x,hAt(x,z),z); scene.add(g);
  var hw = nerd?1.45:1.3, hd = nerd?0.85: domino?1.3:0.6; if(axis==='z' && !nerd && !domino){ hw=0.6; hd=1.3; } addObst(x-hw,x+hw,z-hd,z+hd);
  var t={grp:g, pos:new T.Vector3(x,0,z), kind:kind, nerd:nerd, domino:domino, games:nerd||domino, top:top+g.position.y, reach: nerd?1.95: domino?2.0:1.75,
    drop: domino ? {x:x+0.95, z:z+hd+0.45} : (axis==='z' ? {x:x+hw+0.45, z:z} : {x:x, z:z+hd+0.45}), seats:[]};
  dirs.forEach(function(d){ t.seats.push({t:t, dx:d[0], dz:d[1], x:x+d[0]*sd, z:z+d[1]*sd, ax:x+d[0]*(hw+0.45), az:z+d[1]*(hd+0.45), rot:Math.atan2(-d[0],-d[1]), c:null}); });
  bakeAll(g);
  if(domino) initDomino(t);
  (list||tables).push(t); return t;
}
// ---------- dominoes ----------
var domTex = canvasTex(64,32,function(ctx,w,h){ ctx.fillStyle='#f4f1ea'; ctx.fillRect(0,0,w,h); ctx.fillStyle='#1b1b1b'; ctx.fillRect(31,3,2,h-6);
  [[8,8],[24,24],[16,16]].forEach(function(p){ ctx.beginPath(); ctx.arc(p[0],p[1],3,0,Math.PI*2); ctx.fill(); });
  [[40,8],[56,8],[40,24],[56,24],[48,16],[48,8]].slice(0,5).forEach(function(p){ ctx.beginPath(); ctx.arc(p[0],p[1],3,0,Math.PI*2); ctx.fill(); }); });
var DOM_MAT = new T.MeshLambertMaterial({map:domTex});
var TILE_GEO = new T.BoxGeometry(0.1,0.014,0.05).toNonIndexed();
var HAND_GEO = (function(){ var a=[]; for(var i=0;i<4;i++){ var gg=new T.BoxGeometry(0.05,0.1,0.014).toNonIndexed(); gg.rotateX(-0.25); gg.translate(i*0.056-0.084,0.05,0); a.push(gg); } var m=mergeGeos(a); m.userData.shared=true; return m; })();
function initDomino(t){ var d={tiles:[], turn:0, timer:1.5, chain:new T.Mesh(new T.BufferGeometry(), DOM_MAT), hands:[], resetT:0};
  d.chain.castShadow=false; d.chain.receiveShadow=true; scene.add(d.chain);
  t.seats.forEach(function(s){ var m=new T.Mesh(HAND_GEO, DOM_MAT); m.position.set(t.pos.x+s.dx*0.42, t.top, t.pos.z+s.dz*0.42); m.rotation.y=Math.atan2(s.dx,s.dz); m.visible=false; m.castShadow=false; scene.add(m); d.hands.push(m); });
  t.dom=d; }
function buildChain(t){ var d=t.dom, geos=[];
  d.tiles.forEach(function(k,i){ var idx = i===0 ? 0 : (i%2 ? -1 : 1)*Math.ceil(i/2), g=TILE_GEO.clone(); if(k.cross) g.rotateY(Math.PI/2); g.rotateY(k.jit); g.translate(t.pos.x+idx*0.105, t.top+0.007, t.pos.z+k.dz); geos.push(g); });
  d.chain.geometry.dispose(); d.chain.geometry = geos.length ? mergeGeos(geos) : new T.BufferGeometry(); geos.forEach(function(g){ g.dispose(); }); }
function clack(t, loud){ if(player && dist(player.pos,t.pos)<7) SFX.clack(); }
function updateDomino(t, dt){ var d=t.dom, players=[];
  t.seats.forEach(function(s,i){ var c=s.c, on = !!(c && c.seated && c.domino && (c.state==='sit'||c.state==='drink')); d.hands[i].visible=on; if(on){ players.push(i); if(c.playT>0) c.playT=Math.max(0,c.playT-dt); } });
  if(d.resetT>0){ d.resetT-=dt; if(d.resetT<=0){ d.tiles=[]; buildChain(t); } return; }
  if(players.length<2){ if(!players.length && d.tiles.length){ d.tiles=[]; buildChain(t); } return; }
  d.timer-=dt; if(d.timer>0) return;
  d.timer=1.3+Math.random()*0.7;
  for(var n=0;n<4;n++){ d.turn=(d.turn+1)%t.seats.length; var c=t.seats[d.turn].c; if(c && c.seated && c.domino && c.state==='sit' || c && c.seated && c.domino && c.state==='drink' && Math.random()<0.3) break; }
  var pc=t.seats[d.turn].c; if(!pc || !pc.domino) return;
  pc.playT=0.5;
  setTimeout(function(){ if(!t.dom) return; d.tiles.push({cross:Math.random()<0.2, jit:(Math.random()-0.5)*0.12, dz:(Math.random()-0.5)*0.03}); buildChain(t); clack(t, d.tiles.length>=9);
    if(d.tiles.length>=9){ d.resetT=1.4; if(Math.random()<0.5) floatText(t.pos,'Balıq!',true); } }, 250);
}
function makeUpTable(x,z){
  var g=new T.Group(); g.add(box(1.4,0.75,0.9,0x5f7e96,0,0.375,0)); g.add(box(1.6,0.1,1.1,0x3d5466,0,0.8,0));
  var gear=new T.Mesh(new T.TorusGeometry(0.22,0.08,8,8), M(0xf6c453)); gear.position.set(0,0.95,0); gear.rotation.x=Math.PI/2; gear.castShadow=true; g.add(gear);
  g.position.set(x,0,z); scene.add(g); bakeAll(g); pops.push({obj:g,t:0}); g.scale.set(0.01,0.01,0.01);
  addObst(x-0.8,x+0.8,z-0.55,z+0.55);
  var el=lbl('tile','Təkmilləşdirmə'); addLabel(el, new T.Vector3(x,1.8,z));
  return {grp:g, pos:new T.Vector3(x,0,z)};
}
function makeWaiter(x,z){ var g=makeChar({shirt:0xf4f1ea, pants:0x2b2b2b, vest:0x1b1b1b, bow:true, hair:pick(HAIRS.slice(0,3)), tray:true}); g.position.set(x,0,z);
  var w={grp:g, pos:g.position, items:[], state:'idle', job:null, home:{x:x,z:z}, actT:0, waitT:0, t:0, moving:false, path:[], dest:null}; waiters.push(w); return w; }
function makeKassir(x,z){ addObst(x-0.35,x+0.35,z-0.35,z+0.3); var ch=new T.Group(); chair(ch,0,0,0,-1); ch.position.set(x,0,z); scene.add(ch); bakeAll(ch);
  var g=makeChar({shirt:0xd9d4c7, pants:0x4a4f57, vest:0x5b4a3a, hat:'kepka', hatColor:0x4a4a4a, must:true}); g.position.set(x,0,z); g.rotation.y=0; return {grp:g, pos:g.position, timer:1.5, t:0, moving:false, seated:true, state:'sit', kassir:true, chair:ch}; }
function makeMusician(x,z){ x=BAND_POS.tar[0]; z=BAND_POS.tar[1]; var mob=addObst(x-0.45,x+0.45,z-0.45,z+0.45); var g=makeChar({shirt:0x2e3440, pants:0x2b2b2b, vest:0x8d2f3b, hat:'papaq', hatColor:0x1a1a1a, must:true}); g.position.set(x,0,z); g.rotation.y=BAND_ROT; var tstool=makeStool(x,z);
  var tar=new T.Group(); tar.add(box(0.26,0.34,0.1,0x8b5a2b,0,0,0)); tar.add(cyl(0.02,0.02,0.55,0x5a3a1e,0,0.42,0,6)); tar.position.set(0.02,1.12,0.3); tar.rotation.z=-0.75; g.userData.root.add(tar);
  scene.add(plane(1.4,1.0,TEX.carpet,x,0.02,z,-Math.PI/2)); return {grp:g, pos:g.position, t:0, obst:mob, stool:tstool}; }
function makeTerraceDecor(){
  var g=new T.Group(); g.add(plane(16,11.4,TEX.wood,0,0.016,12.3,-Math.PI/2));
  [[-6.2,8.6],[2.7,8.6],[-6.2,11.4],[2.7,11.4]].forEach(function(p){ g.add(cyl(0.1,0.12,2.8,0x8b5a2b,p[0],1.4,p[1],8)); });
  [8.6,11.4].forEach(function(z){ g.add(box(9.2,0.14,0.14,0x8b5a2b,-1.75,2.85,z)); });
  for(var i=0;i<8;i++){ g.add(box(0.1,0.08,3.1,0x8b5a2b,-6.0+i*1.25,2.96,10.0)); }
  for(var j=0;j<15;j++){ g.add(sph(0.3, j%2?0x5db04c:0x4fa643, -6.1+j*0.62, 3.05+(j%3)*0.1, 8.6+(j%2)*2.8)); }
  tree(-6.6,16.6,g); tree(6.4,16.6,g); bush(-2,17.2,g); bush(6.8,8.0,g); bush(-6.9,7.6,g);
  [[-3.2,17.4],[1.2,17.4],[4.6,17.4],[-7.4,12],[7.4,12.4],[7.3,14.2]].forEach(function(p,i){ flower(p[0],p[1],[0xf4a3a3,0xf6c453,0xffffff,0xe57373,0x9575cd,0xf4a3a3][i],g); });
  return g; }
function terraceObst(){
  [[-6.2,8.6],[2.7,8.6],[-6.2,11.4],[2.7,11.4]].forEach(function(p){ addObst(p[0]-0.15,p[0]+0.15,p[1]-0.15,p[1]+0.15); });
  [[-6.6,16.6],[6.4,16.6]].forEach(function(p){ addObst(p[0]-0.8,p[0]+0.8,p[1]-0.8,p[1]+0.8); });
  [[-2,17.2],[6.8,8.0],[-6.9,7.6]].forEach(function(p){ addObst(p[0]-0.55,p[0]+0.55,p[1]-0.45,p[1]+0.45); }); }

function buildWorld(){
  var firstChild=scene.children.length;
  buildCity();
  // yard, garden lot, behind-counter floor
  scene.add(plane(16,14.2,TEX.stone,0,0.01,-0.5,-Math.PI/2));
  scene.add(plane(16,11.4,TEX.grass,0,0.012,12.3,-Math.PI/2));
  scene.add(plane(8.2,2.8,TEX.woodSmall,-2.5,0.013,-6.2,-Math.PI/2));
  // fences
  var gaps=[{side:'e', from:3.2, to:5.8},{side:'s', from:-1.3, to:1.3},{side:'w', from:-3.5, to:6.5}];
  fenceSide(-8,6.5,8,6.5,'s',gaps); fenceSide(-8,-7.5,-8,6.5,'w',gaps); fenceSide(8,-7.5,8,6.5,'e',gaps);
  fenceSide(-8,6.6,-8,18,'w',[]); fenceSide(8,6.6,8,18,'e',[]); fenceSide(-8,18,8,18,'s',[]);
  southGate=box(2.5,0.9,0.1,0xc27a3e,0,0.47,6.5); scene.add(southGate);
  addObst(-8.1,-7.9,-7.6,-3.5); addObst(-13,-8.0,-3.75,-3.5); addObst(-13,-8.0,6.5,6.75); addObst(7.9,8.1,-7.6,3.2); addObst(7.9,8.1,5.8,6.6); addObst(-8,-1.3,6.4,6.6); addObst(1.3,8,6.4,6.6); gateObst=addObst(-1.3,1.3,6.4,6.6);
  terrWestObst=addObst(-8.1,-7.9,6.6,18.1); addObst(7.9,8.1,6.6,18.1); addObst(-8,8,17.9,18.1);
  // entrance arch
  scene.add(cyl(0.1,0.12,2.9,0x5a3a1e,8,1.45,3.0,8)); scene.add(cyl(0.1,0.12,2.9,0x5a3a1e,8,1.45,6.0,8));
  var sg=plane(3.0,1.05,TEX.sign,8.08,2.55,4.5); sg.rotation.y=Math.PI/2; scene.add(sg);
  // çayxana building and neighbours
  cayBld=building(-8.4,8.4,-13,-7.6,2,'#efdcb5',{upper:true, balc:[['+z',4.6,-7.6,2.8,3.6]]});
  scene.add(plane(2.6,1.0,TEX.carpet,-2.5,1.45,-7.57));
  scene.add(plane(2.4,0.84,TEX.sign,-2.5,2.45,-7.56));
  var door=box(1.1,1.9,0.12,0x5a3a1e,4.6,0.95,-7.55); door.add(sph(0.06,0xd9ab3c,0.35,0,0.08)); scene.add(door);
  // counter (piştaxta) with samovars behind
  scene.add(box(8,0.85,0.9,0xb5773c,-2.5,0.425,CFG.counterZ)); scene.add(box(8.3,0.1,1.1,0x7a4f2a,-2.5,0.9,CFG.counterZ));
  scene.add(plane(7.6,0.56,TEX.kilim,-2.5,0.46,CFG.counterZ+0.455));
  scene.add(box(0.2,0.9,3.3,0x9c6b3c,-6.5,0.45,-5.95)); eastPanel=box(0.2,0.9,3.3,0x9c6b3c,1.5,0.45,-5.95); scene.add(eastPanel);
  scene.add(cyl(0.035,0.035,0.75,0x5a3a1e,-5.9,1.3,CFG.counterZ+0.35,6)); scene.add(plane(0.95,0.48,TEX.cay,-5.9,1.75,CFG.counterZ+0.38));
  addObst(-6.6,1.6,-4.85,-3.95); addObst(-6.6,-6.4,-7.6,-3.95); eastPanelObst=addObst(1.4,1.6,-7.6,-3.95); addObst(-7.95,-6.6,-7.6,-3.95);
  usta=makeUsta(-4.6,true);
  samovars.push(makeSamovar(-4.6));
  makeKassa(6.2,1.0);
  makeTable(-5.0,-1.0,false); makeTable(-1.2,-1.0,false);
  var loose=scene.children.slice(firstChild).filter(function(o){ return o.isMesh && o!==southGate && o!==eastPanel && !Array.isArray(o.material); }), stat=new T.Group(); loose.forEach(function(o){ scene.remove(o); stat.add(o); }); scene.add(stat); bakeAll(stat);
  scene.children.slice(firstChild).forEach(function(o){ if(o.isGroup && o.userData.balcony) bakeAll(o); });
  terrace=makeTerraceDecor(); terrace.visible=false; scene.add(terrace); bakeAll(terrace);
  var g=makeChar({shirt:0xf4f1ea, pants:0x2b2b2b, vest:0x7a2a24, hat:'papaq', hatColor:0x2b2b2b, must:true, hair:0x2a1d16, skin:0xe2b28a, tray:true}); g.position.set(-2.6,0,-2.7);
  player={grp:g, pos:g.position, items:[], pickT:0, dropT:0, collectT:0, coinT:0, moving:false, t:0, anim:1.7};
}

// ---------- audio & haptics ----------
var AC=null;
function audio(){ if(!AC){ try{ AC=new (window.AudioContext||window.webkitAudioContext)(); buildGraph(); applyLoops(); }catch(e){} } if(AC&&AC.state==='suspended') AC.resume(); }
function tone(f0,f1,dur,type,gain){ if(S.muted||!AC) return; try{ var o=AC.createOscillator(), g=AC.createGain(), t=AC.currentTime; o.type=type; o.frequency.setValueAtTime(f0,t); o.frequency.exponentialRampToValueAtTime(f1,t+dur); g.gain.setValueAtTime(gain,t); g.gain.exponentialRampToValueAtTime(0.0001,t+dur); o.connect(g); g.connect(out()); o.start(t); o.stop(t+dur); }catch(e){} }
var SFX={ pour:function(){ play('pour'); }, sizzle:function(){ play('sizzle'); }, clink:function(){ play('clink'); }, coin:function(){ play('coin'); }, pop:function(){ play('pop'); }, sad:function(){ play('sad'); }, unlock:function(){ play('unlock'); }, level:function(){ play('level'); }, mission:function(){ play('mission'); }, clack:function(){ play('clack'); }, horn:function(){ play('horn'); }, wash:function(){ play('wash'); } };
function buzz(p){ try{ if(navigator.vibrate) navigator.vibrate(p); }catch(e){} }

// ---------- input ----------
var cv=renderer.domElement;
var input={x:0,y:0};
var keys={};
var ptrs={}, gesture=null, camFree=false;
var groundPlane=new T.Plane(new T.Vector3(0,1,0),0), roofPlane=new T.Plane(new T.Vector3(0,1,0),-5.5), hallPlane=new T.Plane(new T.Vector3(0,1,0),-8.1), skyPlane=new T.Plane(new T.Vector3(0,1,0),-10.7), ray=new T.Raycaster(), ndc=new T.Vector2(), hitP=new T.Vector3();
var COS_EL = Math.hypot(camOff.x,camOff.z)/camOff.length(), SIN_EL = camOff.y/camOff.length();
function ptrCount(){ return Object.keys(ptrs).length; }
function pinchDist(){ var k=Object.keys(ptrs), a=ptrs[k[0]], b=ptrs[k[1]]; return Math.hypot(a.x-b.x,a.y-b.y); }
function setZoom(z){ S.zoom=Math.min(2.2,Math.max(0.25,z)); cam.zoom=S.zoom; cam.updateProjectionMatrix(); var iz=1/S.zoom; scene.fog.near=30+30*iz+(CAMK-1)*camOff.length(); scene.fog.far=scene.fog.near+40*iz;
  var sh=Math.min(90,28*iz), sc=sun.shadow.camera; sc.left=-sh; sc.right=sh; sc.top=sh; sc.bottom=-sh; sc.far=60+60*iz; sc.updateProjectionMatrix(); labelsEl.classList.toggle('far', S.zoom<0.42); }
function clampCam(){ camTarget.x=Math.min(53,Math.max(-40,camTarget.x)); camTarget.z=Math.min(53,Math.max(-47,camTarget.z)); }
function panBy(dx,dy){ var upp=(cam.top-cam.bottom)/cam.zoom/window.innerHeight, rx=-camFwd.z, rz=camFwd.x, f=upp/SIN_EL;
  camTarget.x += -rx*dx*upp + camFwd.x*dy*f; camTarget.z += -rz*dx*upp + camFwd.z*dy*f; clampCam(); camFree=true; }
function tapAt(sx,sy){ ndc.set(sx/window.innerWidth*2-1, -(sy/window.innerHeight)*2+1); ray.setFromCamera(ndc, cam); var hit=ray.ray.intersectPlane(groundPlane, hitP); var hallHit=false; if(skyOpen){ var skh=new T.Vector3(); if(ray.ray.intersectPlane(skyPlane, skh) && skh.x>SKY.x0-1&&skh.x<SKY.x1+1&&skh.z>SKY.z0-9&&skh.z<SKY.z1-0.1){ skh.x=Math.min(SKY.x1-0.4,Math.max(SKY.x0+0.4,skh.x)); skh.z=Math.max(SKY.z0+0.9,skh.z); hitP.copy(skh); hit=true; hallHit=true; } } if(hallOpen && !hallHit){ var hh=new T.Vector3(); if(ray.ray.intersectPlane(hallPlane, hh) && hh.x>-15.8&&hh.x<-8.5&&hh.z>-12.8&&hh.z<-3.7){ hitP.copy(hh); hit=true; hallHit=true; } } if(cafeOpen && !hallHit){ var ch2=new T.Vector3(); if(ray.ray.intersectPlane(roofPlane, ch2) && ch2.x>-15.9&&ch2.x<-8.5&&ch2.z>6.7&&ch2.z<18.2){ hitP.copy(ch2); hit=true; hallHit=true; } } if(roofOpen && !hallHit){ var rhp=new T.Vector3(); if(ray.ray.intersectPlane(roofPlane, rhp) && rhp.x>-8.25&&rhp.x<8.25&&rhp.z>-12.85&&rhp.z<-7.7){ hitP.copy(rhp); hit=true; } }
  var kas=kassaAt(sx,sy, hit?hitP.x:null, hit?hitP.z:null); if(kas){ audio(); remoteCollect(kas); return; }
  var spot=spotAt(sx,sy, hit?hitP.x:null, hit?hitP.z:null); if(spot){ audio(); SFX.pop(); openBuy(spot); return; } if(hit) setPlayerDest(hitP.x, hitP.z); }
cv.addEventListener('pointerdown', function(e){ audio(); try{ cv.setPointerCapture(e.pointerId); }catch(err){} ptrs[e.pointerId]={x:e.clientX,y:e.clientY};
  if(ptrCount()>=2) gesture={type:'pinch', d0:pinchDist()||1, z0:S.zoom};
  else gesture={type:'pending', id:e.pointerId, sx:e.clientX, sy:e.clientY, lx:e.clientX, ly:e.clientY, t0:performance.now()}; });
cv.addEventListener('pointermove', function(e){ var p=ptrs[e.pointerId]; if(!p) return; p.x=e.clientX; p.y=e.clientY; if(!gesture) return;
  if(gesture.type==='pinch'){ if(ptrCount()>=2) setZoom(gesture.z0*pinchDist()/gesture.d0); return; }
  if(e.pointerId!==gesture.id) return;
  if(gesture.type==='pending' && Math.hypot(e.clientX-gesture.sx, e.clientY-gesture.sy)>9) gesture.type='pan';
  if(gesture.type==='pan'){ panBy(e.clientX-gesture.lx, e.clientY-gesture.ly); }
  gesture.lx=e.clientX; gesture.ly=e.clientY; });
function endPtr(e){ if(!ptrs[e.pointerId]) return; delete ptrs[e.pointerId];
  if(gesture && gesture.type==='pending' && gesture.id===e.pointerId && performance.now()-gesture.t0<600 && e.type==='pointerup') tapAt(e.clientX, e.clientY);
  if(gesture && gesture.type==='pinch'){ if(ptrCount()<2){ gesture={type:'done'}; save(); } }
  if(!ptrCount()) gesture=null; }
cv.addEventListener('pointerup', endPtr); cv.addEventListener('pointercancel', endPtr); cv.addEventListener('lostpointercapture', endPtr);
cv.addEventListener('wheel', function(e){ e.preventDefault(); setZoom(S.zoom*(e.deltaY<0?1.1:1/1.1)); }, {passive:false});
$('zin').addEventListener('click', function(){ setZoom(S.zoom*1.2); save(); });
$('zout').addEventListener('click', function(){ setZoom(S.zoom/1.2); save(); });
$('zme').addEventListener('click', function(){ camFree=false; });
window.addEventListener('keydown', function(e){ if(e.target && e.target.tagName==='INPUT') return; keys[e.key.toLowerCase()]=true; });
window.addEventListener('keyup', function(e){ keys[e.key.toLowerCase()]=false; });

// ---------- movement ----------
function moveTo(e,x,z,sp,dt){ var dx=x-e.pos.x, dz=z-e.pos.z, d=Math.hypot(dx,dz); if(d<0.06){ e.moving=false; return true; } var step=Math.min(d, sp*dt); e.pos.x+=dx/d*step; e.pos.z+=dz/d*step; e.grp.rotation.y=Math.atan2(dx,dz); e.moving=true; return d-step<0.06; }
function collideAxis(e,axis,d){ var R=0.3; for(var k=0;k<OBST.length;k++){ var o=OBST[k], x0=o.x0-R, x1=o.x1+R, z0=o.z0-R, z1=o.z1+R;
  if(e.pos.x>x0&&e.pos.x<x1&&e.pos.z>z0&&e.pos.z<z1){ if(axis==='x') e.pos.x = d>0 ? x0 : x1; else e.pos.z = d>0 ? z0 : z1; } } }
function movePlayer(e,dx,dz){ var n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/0.2));
  for(var i=0;i<n;i++){ if(dx){ applyMove(e,e.pos.x+dx/n,e.pos.z); collideAxis(e,'x',dx); } if(dz){ applyMove(e,e.pos.x,e.pos.z+dz/n); collideAxis(e,'z',dz); } }
  collide(e); }
function applyMove(e,nx,nz){ nx=Math.min(B.xmax,Math.max(B.xmin,nx)); nz=Math.min(B.zmax,Math.max(B.zmin,nz)); if(((e.pos.z<6.5)!==(nz<6.5)) && Math.abs(nx)>1.05 && Math.abs(nx)<8.2) nz=e.pos.z; e.pos.x=nx; e.pos.z=nz; }
function bobChar(e,dt){ e.t+=dt*(e.anim||1); e.grp.position.y=hAt(e.grp.position.x,e.grp.position.z); var ud=e.grp.userData, root=ud.root, L=ud.legs, A=ud.arms;
  if(e.seated){ root.position.y=-0.4+((e.seat && e.seat.lift)||0); var flr=e.seat && e.seat.floor; L.forEach(function(h){ h.rotation.x=-Math.PI/2; h.userData.knee.rotation.x=flr?0.15:Math.PI/2; });
    A[0].rotation.x=0.05; A[0].userData.elbow.rotation.x=-1.45;
    if(e.state==='drink'){ var k=0.5+0.5*Math.sin(e.t*2.5); A[1].rotation.x=-0.3-0.7*k; A[1].userData.elbow.rotation.x=-1.5-0.5*k; }
    else if(e.kassir){ A[0].rotation.x=-0.35; A[0].userData.elbow.rotation.x=-1.2; A[1].rotation.x=-0.4+(e.count>0?Math.sin(e.t*14)*0.2:0); A[1].userData.elbow.rotation.x=-1.15; }
    else if(e.domino){ A[0].rotation.x=-0.45; A[0].userData.elbow.rotation.x=-1.15; if(e.playT>0){ var kp=Math.sin(Math.PI*(1-e.playT/0.5)); A[1].rotation.x=-0.35-0.75*kp; A[1].userData.elbow.rotation.x=-1.25+0.95*kp; } else { A[1].rotation.x=-0.35; A[1].userData.elbow.rotation.x=-1.25; } }
    else if(e.nerd){ A[1].rotation.x=-0.2+Math.sin(e.t*6)*0.12; A[1].userData.elbow.rotation.x=-1.35; }
    else { A[1].rotation.x=0.05; A[1].userData.elbow.rotation.x=-1.45; }
    if(e.cheer>0){ e.cheer-=dt; var cw=Math.sin(e.t*14)*0.25; A[0].rotation.x=-2.7+cw; A[1].rotation.x=-2.7-cw; A[0].userData.elbow.rotation.x=-0.25; A[1].userData.elbow.rotation.x=-0.25; }
    return; }
  var mv=e.moving, ph=e.t*10, sw = mv ? Math.sin(ph)*0.6 : 0;
  root.position.y = mv ? Math.abs(Math.cos(ph))*0.035 : 0;
  L[0].rotation.x=sw; L[1].rotation.x=-sw; L[0].userData.knee.rotation.x = sw>0 ? sw*1.2 : 0.05; L[1].userData.knee.rotation.x = sw<0 ? -sw*1.2 : 0.05;
  if((ud.tray && ud.tray.visible) || (e.items && e.items.length)){ A.forEach(function(a){ a.rotation.x=-0.35; a.userData.elbow.rotation.x=-1.25; }); }
  else { A[0].rotation.x=-sw*0.7; A[1].rotation.x=sw*0.7; A[0].userData.elbow.rotation.x=-0.25; A[1].userData.elbow.rotation.x=-0.25; } }
function boostMul(){ return S.boostUntil>S.elapsed ? 2 : 1; }

function flyCoins(from, to, n, cb){ for(var i=0;i<n;i++){ var m=new T.Mesh(coinGeo, M(0xf2c14e)); var a=new T.Vector3(from.x,1,from.z); m.position.copy(a); scene.add(m); coins.push({m:m, a:a, b:new T.Vector3(to.x,0.9,to.z), t:-i*0.07, dur:0.45, cb: i===n-1?cb:null}); } }
function updateCoins(dt){ for(var i=coins.length-1;i>=0;i--){ var c=coins[i]; c.t+=dt; if(c.t<0) continue; var k=Math.min(1,c.t/c.dur); c.m.position.lerpVectors(c.a,c.b,k); c.m.position.y+=Math.sin(k*Math.PI)*1.4; c.m.rotation.y+=dt*12; if(k>=1){ scene.remove(c.m); coins.splice(i,1); if(c.cb) c.cb(); } } }
function addToPile(amount, from){ var room=CFG.pileCap-pile.amount, add=Math.min(room, amount); pile.amount+=add; if(add<amount){ pile.fullT=2; S.lost+=amount-add; } flyCoins(from, pile.pos, Math.min(5, 1+Math.floor(amount/8))); updatePileMeshes(); }
function bumpMoney(){ $('moneyv').textContent=Math.floor(S.money); var el=$('money'); el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
function showBanner(text, ms){ var b=$('banner'); b.textContent=text; b.classList.add('show'); clearTimeout(showBanner.h); showBanner.h=setTimeout(function(){ b.classList.remove('show'); }, ms||2000); }
var tmpV=new T.Vector3();
function confetti(worldPos){ var v=tmpV.set(worldPos.x,0.5,worldPos.z).project(cam); var x=(v.x+1)/2*window.innerWidth, y=(1-v.y)/2*window.innerHeight; var cols=['#f6c453','#e2574c','#4cc26b','#5aa9e6','#ffffff'];
  for(var i=0;i<26;i++){ var s=document.createElement('span'); s.className='confetti'; s.style.left=x+'px'; s.style.top=y+'px'; s.style.background=cols[i%5]; var a=Math.random()*Math.PI*2, r=60+Math.random()*90; s.style.setProperty('--dx',(Math.cos(a)*r)+'px'); s.style.setProperty('--dy',(Math.sin(a)*r-60)+'px'); labelsEl.appendChild(s); (function(el){ setTimeout(function(){ el.remove(); },980); })(s); } }

// ---------- customers ----------
function freeSeats(){ var a=[], lock=resvLocked(); tables.forEach(function(t){ if(lock && t.hall) return; t.seats.forEach(function(s){ if(!s.c) a.push(s); }); }); return a; }
function alive(c){ return customers.indexOf(c)>=0; }
function needs(c,type){ return c.state==='sit' && c.got[type]<c.need[type]; }
function spawnCustomer(forceType, forcedSeat){
  var seats=(forceType==='toy' && hallOpen) ? hallSeats().filter(function(s){ return !s.c; }) : freeSeats(), seat=(forcedSeat && !forcedSeat.c) ? forcedSeat : (seats.length? pick(seats) : null);
  if(!seat && waitQ.length>=CFG.waitMax) return null;
  var type=forceType||'normal';
  if(!forceType){ var r=Math.random(); if(S.elapsed>180 && r<0.05) type='vip'; else if(paxSt && r<0.45) type='sweet'; }
  var look=randomLook(type, (seat && seat.t.games && type!=='toy' && type!=='vip') ? seat.t.kind : null);
  var g=(type==='normal'||type==='sweet') && !(seat && seat.t.nerd) ? takeChar() : makeChar(look), end=pick(ENDS); g.position.set(end[0],0,end[1]);
  var c={grp:g, pos:g.position, type:type, nerd:false, seat:null, need:{tea:0,pax:0}, got:{tea:0,pax:0}, claimed:{tea:0,pax:0}, rounds:1, pay:0, glasses:[],
    state:'wait', patience:CFG.waitPatience, maxP:CFG.waitPatience, drinkT:0, hold:0, t:Math.random()*10, happy:0, angry:0, moving:false, seated:false, html:'', path:[], dest:null, exit:pick(ENDS)};
  var el=lbl('bubble'+(type==='vip'?' vip':''), ''); el.style.display='none'; c.el=el;
  c.L=addLabel(el, null, function(v){ return v.set(c.pos.x, c.pos.y+(c.seated?1.9:2.3), c.pos.z); }); c.L.bub=true;
  customers.push(c);
  if(seat) takeSeat(c,seat); else waitQ.push(c);
  return c;
}
function takeSeat(c,seat){ seat.c=c; c.seat=seat; c.state='toSeat'; c.dest=null; var i=waitQ.indexOf(c); if(i>=0) waitQ.splice(i,1); }
function fillFromWait(){ for(var i=0;i<waitQ.length;){ var c=waitQ[i], seats=freeSeats(); if(c.type==='toy' && hallOpen) seats=hallSeats().filter(function(s){ return !s.c; }); else if(c.type!=='toy') seats=seats.filter(function(s){ return !s.t.hall || !resvLocked(); }); if(!seats.length){ i++; if(!freeSeats().length) return; continue; } var n=waitQ.length; takeSeat(c, pick(seats)); if(waitQ.length===n) i++; } }
function order(c){ var t=c.type; c.need={}; c.got={}; c.claimed={}; CAY_TYPES.forEach(function(k){ c.need[k]=0; c.got[k]=0; c.claimed[k]=0; });
  if(c.nerd) c.need.tea=1;
  else if(t==='normal') c.need.tea=1+Math.floor(Math.random()*3);
  else if(t==='sweet'){ c.need.tea=1+Math.floor(Math.random()*2); var sw=sweetsOn(); if(sw.length) c.need[pick(sw)]++; }
  else if(t==='vip'){ c.need.tea=2; var sw2=sweetsOn(); if(sw2.length) c.need[pick(sw2)]++; else c.need.tea=3; }
  else if(t==='toy'){ c.need.tea=2; var swt=sweetsOn(); if(swt.length && Math.random()<0.6) c.need[pick(swt)]++; }
  var vars=Object.keys(varSt); if(vars.length && !c.nerd){ var nt=c.need.tea; for(var i=0;i<nt;i++){ if(Math.random()<0.5){ var vt=pick(vars); c.need.tea--; c.need[vt]++; } } }
  if(c.seat && c.seat.t.zone==='sky'){ var tot=0; CAY_TYPES.forEach(function(k){ tot+=c.need[k]; c.need[k]=0; }); c.need.tea=Math.max(1,Math.min(3,tot)); if(skyVar.pax && Math.random()<0.5) c.need.pax=1; if(skyVar.teaM && Math.random()<0.45){ c.need.teaM=1; if(c.need.tea>1) c.need.tea--; } }
  c.maxP = (c.nerd?40 : t==='vip'?14 : t==='toy'?(c.toyRes?70:30) : CFG.patience)*(1+0.15*S.up.patience); c.patience=c.maxP; c.state='sit'; }
function sitDown(c){ var s=c.seat; c.pos.set(s.x,0,s.z); c.grp.rotation.y=s.rot; c.seated=true; c.moving=false; c.path=[]; c.dest=null;
  if(s.t.games && c.type!=='toy' && c.type!=='vip'){ c.nerd=true; c.domino=s.t.domino; c.rounds=3; c.playT=0; } order(c); }
function clearGlasses(c){ c.glasses.forEach(function(m){ scene.remove(m); }); c.glasses=[]; }
function standUp(c){ var s=c.seat; clearGlasses(c); c.seated=false; c.grp.position.y=0; if(s){ s.c=null; if(c.state==='sit'||c.state==='drink') c.pos.set(s.ax,0,s.az); } c.seat=null; c.dest=null; fillFromWait(); }
function leaveAngry(c){ S.st.streak=0; if(c.seat) standUp(c); var i=waitQ.indexOf(c); if(i>=0) waitQ.splice(i,1); c.state='out'; c.dest=null; c.angry=1.6; S.lost++; SFX.sad(); }
function payCustomer(c){ addXP(c.type==='vip'?6:c.nerd?4:c.type==='toy'?3:2); var mult=(c.type==='toy'?1.5:c.type==='vip'?5:c.nerd?2:1)*boostMul()*levelMul(); var amount=Math.max(1,Math.round(c.pay*mult));
  addToPile(amount, c.pos); floatText(c.pos, '+'+amount, mult>1); SFX.coin(); c.happy=0.9; S.served++;
  var st=S.st; st.served=(st.served||0)+1; st.streak=(st.streak||0)+1; if(c.type==='toy') st.toy=(st.toy||0)+1; if(c.type==='vip') st.vip=(st.vip||0)+1; }
function give(c,it,byWaiter){ var type=it.type; c.got[type]++; if(byWaiter) c.claimed[type]=Math.max(0,c.claimed[type]-1);
  var st=S.st; if(!byWaiter) st[type]=(st[type]||0)+1; if(type==='tea'){ if(c.domino) st.domino=(st.domino||0)+1; else if(c.nerd) st.nerd=(st.nerd||0)+1; }
  var base=CAY_PRICE[type]||2; if(type!=='pax' && S.elapsed-it.t>CFG.coldAfter) base=Math.max(1,Math.floor(base/2)); c.pay += base*(1+0.15*S.up.price);
  var t=c.seat.t, k=c.glasses.length; scene.add(it.mesh); var sd=c.seat, rr=(t.nerd?0.45:t.domino?0.36:0.3)-0.11*Math.floor(k/3), off=-0.14+0.14*(k%3); if(t.domino) off=0.18+0.1*(k%3); if(t.long){ it.mesh.position.set(sd.x-0.18+0.18*(k%3), t.top, t.pos.z+sd.dz*(0.3-0.1*Math.floor(k/3))); } else it.mesh.position.set(t.pos.x+sd.dx*rr-sd.dz*off, t.top, t.pos.z+sd.dz*rr+sd.dx*off); c.glasses.push(it.mesh);
  SFX.clink();
  if(CAY_TYPES.every(function(k){ return c.got[k]>=c.need[k]; })){ c.state='drink'; c.drinkT=CFG.drinkTime; } }
function despawn(c){ dropChar(c.grp); c.L.dead=true; var i=customers.indexOf(c); if(i>=0) customers.splice(i,1); var j=waitQ.indexOf(c); if(j>=0) waitQ.splice(j,1); }
function bubbleHTML(c){
  if(c.seated && (c.state==='sit'||c.state==='drink') && !(c.happy>0) && !(c.angry>0)) return '';
  if(c.happy>0) return '<span class="face">😊</span>';
  if(c.angry>0) return '<span class="face">😠</span>';
  if(c.state==='drink') return '<span class="face">😌</span>';
  if(c.state==='sit' || (c.state==='wait' && !c.moving)){ var r=c.patience/c.maxP, face=r>0.5?'🙂':r>0.2?'😐':'😠', s='';
    if(c.state==='sit'){ CAY_TYPES.forEach(function(k){ var r=c.need[k]-c.got[k]; if(r>0) s+=(k==='tea'?'<span class="ico ico-tea"></span>' : k==='pax'?'<span class="ico ico-pax"></span>' : '<span class="emo">'+CAY_ICON[k]+'</span>')+r; }); }
    return s+'<span class="face">'+face+'</span>'; }
  return ''; }
function updateCustomer(c,dt){
  var sp=CFG.customerSpeed;
  if(c.happy>0) c.happy-=dt; if(c.angry>0) c.angry-=dt;
  if(c.hold>0){ c.hold-=dt; c.moving=false; }
  else if(c.state==='wait'){ var i=waitQ.indexOf(c), sl=WAIT_SLOTS[Math.min(Math.max(i,0),WAIT_SLOTS.length-1)];
    if(nav(c,sl[0],sl[1],sp,dt)){ c.grp.rotation.y=-Math.PI/2; if(!S.zen) c.patience-=dt/S.patienceMul; if(c.patience<=0) leaveAngry(c); } }
  else if(c.state==='toSeat'){ if(nav(c,c.seat.ax,c.seat.az,sp,dt)) sitDown(c); }
  else if(c.state==='sit'){ if(!S.zen) c.patience-=dt/S.patienceMul; if(c.patience<=0) leaveAngry(c); }
  else if(c.state==='drink'){ c.drinkT-=dt; if(c.drinkT<=0){ if(c.nerd && c.rounds>1){ c.rounds--; clearGlasses(c); order(c); } else { standUp(c); c.state='toPay'; } } }
  else if(c.state==='toPay'){ if(nav(c,PAY.x,PAY.z,sp,dt)){ c.grp.rotation.y=Math.PI; payCustomer(c); c.state='out'; c.dest=null; } }
  else { if(nav(c,c.exit[0],c.exit[1],sp,dt)){ despawn(c); return; } }
  bobChar(c,dt);
  var html=bubbleHTML(c);
  if(html!==c.html){ c.html=html; c.el.innerHTML=html; c.el.style.display = html?'flex':'none'; c.L.dirty=true; }
}

// ---------- waiters ----------
function countType(items,type){ var n=0; items.forEach(function(it){ if(it.type===type) n++; }); return n; }
var EXTRA_HOMES=[[-3.0,4.6],[1.6,4.6],[-6.6,-2.6],[-4.8,15.4],[-4.2,-8.6],[-1.5,-8.4],[-10.25,-2.6],[3.0,-8.4],[-12.0,-8.4]];
function extraWaiter(i,silent){ var h=EXTRA_HOMES[i]||EXTRA_HOMES[0]; if((h[1]>6.5 && S.unlocked<9) || (h[1]<-7.6 && !roofOpen) || (h[0]<-8.4 && h[1]<-3.5 && !hallOpen)) h=[-3.0+(i%5)*0.8,4.6+Math.floor(i/5)*0.8]; var w=makeWaiter(h[0],h[1]); if(!silent){ w.grp.scale.set(0.01,0.01,0.01); pops.push({obj:w.grp,t:0}); showBanner('Yeni ofisiant işə başladı'); } }
function sweetsOn(){ var a=paxSt?['pax']:[]; return a.concat(Object.keys(sweetSt)); }
function spread(list,minD){ for(var a=0;a<list.length;a++) for(var b=a+1;b<list.length;b++){ if(list[a].moving || list[b].moving) continue; var p1=list[a].pos, p2=list[b].pos; if(Math.abs(p1.y-p2.y)>1) continue; var dx=p2.x-p1.x, dz=p2.z-p1.z, d=Math.hypot(dx,dz); if(d<minD){ if(d<0.001){ dx=0.01; dz=0; d=0.01; } var k=(minD-d)/2/d; p1.x-=dx*k; p1.z-=dz*k; p2.x+=dx*k; p2.z+=dz*k; } } }
function srcAvail(k,w){ if(w && w.zone==='sky') return k==='tea' ? skySam.length>0 : !!skyVar[k]; return k==='tea' ? samovars.length>0 : k==='pax' ? !!paxSt : !!(varSt[k]||sweetSt[k]); }
function sameZone(c,w){ return ((c.seat && c.seat.t.zone)||'')===((w && w.zone)||''); }
function findJob(w){ var best=null, bu=1e9;
  customers.forEach(function(c){ if(c.state!=='sit' || !sameZone(c,w)) return; if(CAY_TYPES.some(function(k){ return srcAvail(k,w) && c.need[k]-c.got[k]-c.claimed[k]>0; })){ var u=c.patience/c.maxP; if(u<bu){ bu=u; best=c; } } });
  if(!best) return null; var want={}, cap=CFG.workerCap;
  CAY_TYPES.forEach(function(k){ if(!srcAvail(k,w) || cap<=0) return; var r=Math.max(0,best.need[k]-best.got[k]-best.claimed[k]), n=Math.min(r,cap); if(n>0){ want[k]=n; cap-=n; best.claimed[k]+=n; } });
  return {c:best, want:want}; }
function wantedType(c,items){ for(var i=0;i<items.length;i++){ if(needs(c,items[i].type)) return items[i].type; } return null; }
function sourceFor(type, w){ if(w && w.zone==='sky'){ if(type==='tea'){ var bs=null; skySam.forEach(function(s){ if(!bs || s.items.length>bs.items.length) bs=s; }); return bs; } return skyVar[type]||null; } if(type==='pax') return paxSt; if(varSt[type]) return varSt[type]; if(sweetSt[type]) return sweetSt[type]; var best=null; samovars.forEach(function(s){ if(!best || s.items.length>best.items.length || (s.items.length===best.items.length && Math.abs(s.pick.x-w.pos.x)<Math.abs(best.pick.x-w.pos.x))) best=s; }); return best; }
function deliverTarget(w){
  if(w.job && alive(w.job.c) && wantedType(w.job.c,w.items)) return w.job.c;
  var best=null, bu=1e9; customers.forEach(function(c){ if(c.state!=='sit' || !sameZone(c,w)) return; if(wantedType(c,w.items)){ var u=c.patience/c.maxP; if(u<bu){ bu=u; best=c; } } }); return best; }
function updateWaiter(w,dt){ var wm=CFG.waiterMul[S.up.speed]||1, sp=CFG.workerSpeed*wm; w.anim=wm; w.actT-=dt;
  if(w.state==='idle'){
    if(w.items.length){ if(deliverTarget(w)){ w.state='deliver'; w.holdT=0; } else { w.holdT=(w.holdT||0)+dt; if(w.holdT>4){ returnItems(w.items); w.items=[]; w.holdT=0; } else nav(w,w.home.x,w.home.z,sp,dt); } }
    else { w.job=findJob(w); if(w.job){ w.state='collect'; w.waitT=0; } else nav(w,w.home.x,w.home.z,sp,dt); }
  } else if(w.state==='collect'){
    var j=w.job;
    if(!j || !alive(j.c) || j.c.state!=='sit'){ w.state = w.items.length?'deliver':'idle'; if(!w.items.length) w.job=null; }
    else { var nt=null; for(var wk in j.want){ if(countType(w.items,wk)<j.want[wk]){ nt=wk; break; } }
      if(!nt){ w.state='deliver'; }
      else { if(w.cur!==nt){ w.cur=nt; w.waitT=0; }
        var src=sourceFor(nt,w);
        if(!src){ j.want[nt]=countType(w.items,nt); }
        else if(src.axis==='x' ? nav(w,src.wx,src.pick.z+((waiters.indexOf(w)%3)-1)*0.42,sp,dt) : nav(w,src.pick.x+((waiters.indexOf(w)%3)-1)*0.42,src.wz!==undefined?src.wz:CFG.pickZ,sp,dt)){ w.grp.rotation.y=src.axis==='x'?-Math.PI/2:(src.side<0?0:Math.PI); w.waitT+=dt;
          if(src.items.length){ if(w.actT<=0){ var it=src.items.pop(); layStack(src.items,scene,src.out); w.items.push(it); layStack(w.items,w.grp.userData.root,CARRY); w.actT=0.15; } }
          else if(w.waitT>5){ var have=countType(w.items,nt); j.c.claimed[nt]=Math.max(0,j.c.claimed[nt]-(j.want[nt]-have)); j.want[nt]=have; } } } }
  } else {
    if(!w.items.length){ w.state='idle'; w.job=null; }
    else { var c=deliverTarget(w);
      if(!c){ w.state='idle'; }
      else { if(!w.job || w.job.c!==c) w.job={c:c, type:w.items[0].type, n:0};
        var t=c.seat.t; if(nav(w,t.drop.x,t.drop.z,sp,dt)){ w.grp.rotation.y=Math.PI;
          if(w.actT<=0){ var tp = wantedType(c,w.items);
            if(tp){ var it2=takeLast(w.items,tp); layStack(w.items,w.grp.userData.root,CARRY); give(c,it2,true); w.actT=0.15; } } } } }
  }
  bobChar(w,dt);
}

// ---------- level ----------
function xpNeed(L){ return 15+15*(L-1); }
function levelMul(){ return 1+0.1*(S.level-1); }
function updateLevelHud(){ $('lvlv').textContent=S.level; $('xpfill').style.width=Math.min(100,100*S.xp/xpNeed(S.level))+'%'; if(typeof renderHudProfile==='function'){ renderHudProfile(); renderProfile(); } }
function addXP(n){ S.xp+=n; var up=false;
  while(S.xp>=xpNeed(S.level)){ S.xp-=xpNeed(S.level); S.level++; up=true; var reward=40*S.level; S.money+=reward; bumpMoney();
    showBanner('Səviyyə '+S.level+'! +'+reward+' ₼, qiymətlər və müştəri axını artdı', 2800); confetti(player.pos); SFX.level(); buzz([30,40,60]); }
  updateLevelHud(); if(up) save(); }
// ---------- usta (old tea master behind the counter) ----------
var USTA_Z=-5.1;
function placeTea(s){ var it=makeItem('tea'); it.t=S.elapsed; s.items.push(it); layStack(s.items,scene,s.out); }
var zoneT=0;
function ustaZones(){ zoneGroup(samovars, ustas.filter(function(u){ return !u.sky; }), -6.0, counterExt?5.0:1.0); zoneGroup(skySam, ustas.filter(function(u){ return u.sky; }), -12, 6); }
function zoneGroup(src,uu,lo,hi){ var sams=src.slice().sort(function(a,b){ return a.pos.x-b.pos.x; }), us=uu.slice().sort(function(a,b){ return a.lane-b.lane; }), n=us.length, m=sams.length; if(!n) return;
  us.forEach(function(u){ u.sams=[]; }); sams.forEach(function(sm,j){ us[Math.min(n-1,Math.floor(j*n/Math.max(m,1)))].sams.push(sm); });
  us.forEach(function(u,i){ if(u.sams.length){ u.home=(u.sams[0].pos.x+u.sams[u.sams.length-1].pos.x)/2; } else { u.home=lo+(hi-lo)*(i+0.5)/n; } }); }
function updateUsta(dt){ zoneT-=dt; if(zoneT<=0){ zoneT=1; ustaZones(); } for(var ui=0;ui<ustas.length;ui++) updateOneUsta(ustas[ui],dt);
  for(var a=0;a<ustas.length;a++) for(var b=a+1;b<ustas.length;b++){ var A2=ustas[a], B2=ustas[b], d=B2.pos.x-A2.pos.x; if(!!A2.sky!==!!B2.sky) continue; if(Math.abs(d)<0.7){ var push=(0.7-Math.abs(d))/2*(d>=0?1:-1); if(A2.state==='idle' && B2.state==='idle' && !A2.moving && !B2.moving){ A2.pos.x-=push; B2.pos.x+=push; } } } }
function updateOneUsta(u,dt){ var A=u.grp.userData.arms, r=A[1], l=A[0], re=r.userData.elbow, le=l.userData.elbow; u.t+=dt;
  if(u.state==='idle'){ var best=null, bd=1e9; (u.sams||samovars).forEach(function(s){ if(!((s.ready||0)>0)) return; if(ustas.some(function(o){ return o!==u && o.target===s && o.state!=='idle'; })) return; var sc=-s.ready*10+Math.abs(s.pos.x-u.pos.x); if(sc<bd){ bd=sc; best=s; } }); if(best){ u.target=best; u.state='walk'; } }
  if(u.state==='walk'){ if(moveTo(u, u.target.pos.x, u.z!==undefined?u.z:USTA_Z, u.speed||2.4, dt)){ u.moving=false; u.state='reach'; u.ph=0; } }
  else if(u.state==='reach'){ u.ph+=dt; u.grp.rotation.y=Math.PI; if(u.ph>0.35){ if((u.target.ready||0)>0){ u.target.ready--; u.hold.visible=true; u.state='turn'; } else u.state='idle'; u.ph=0; } }
  else if(u.state==='turn'){ u.ph+=dt; var k=Math.min(1,u.ph/0.3); u.grp.rotation.y=Math.PI*(1-k); if(k>=1){ u.state='place'; u.ph=0; } }
  else if(u.state==='place'){ u.ph+=dt; u.grp.rotation.y=0; if(u.ph>0.3){ u.hold.visible=false; placeTea(u.target); u.state='idle'; u.ph=0; } }
  bobChar(u,dt);
  if(u.state==='reach'){ var k2=Math.min(1,u.ph/0.25); r.rotation.x=-0.3-0.6*k2; re.rotation.x=-0.3; l.rotation.x=-0.15; le.rotation.x=-0.3; }
  else if(u.state==='turn'){ r.rotation.x=-0.6; re.rotation.x=-1.0; l.rotation.x=-0.15; le.rotation.x=-0.3; }
  else if(u.state==='place'){ var k3=Math.min(1,u.ph/0.2); r.rotation.x=-0.6-0.45*k3; re.rotation.x=-1.0+0.75*k3; l.rotation.x=-0.15; le.rotation.x=-0.3; }
  if(u.state==='idle' && u.home!==undefined && Math.abs(u.pos.x-u.home)>0.3){ moveTo(u,u.home,u.z!==undefined?u.z:USTA_Z,u.speed||2.4,dt); } else if(u.state==='idle'){ u.moving=false; u.grp.rotation.y=0; }
  if(u.state==='idle' && u.moving){ }
  else if(u.state==='idle'){ r.rotation.x=-0.45+Math.sin(u.t*1.4)*0.06; re.rotation.x=-0.95; l.rotation.x=-0.45; le.rotation.x=-0.95; }
  u.hold.rotation.x=-(r.rotation.x+re.rotation.x); }
// ---------- kassir ----------
function updateKassir(dt){ kassir.timer-=dt; if(kassir.count>0) kassir.count-=dt; bobChar(kassir,dt); if(pile.amount>0 && kassir.timer<=0) kassir.count=1.2; if(kassir.timer<=0){ kassir.timer=1.5; if(pile.amount>0){ var a=pile.amount; pile.amount=0; updatePileMeshes(); S.st.coins=(S.st.coins||0)+a; flyCoins(pile.pos, kassir.pos, Math.min(6,1+Math.floor(a/15)), function(){ S.money+=a; bumpMoney(); }); } } }

// ---------- unlock tiles ----------
var CAY_LVL=[1,1,2,2,3,3,4,5,6,7,8,9,10,11,11,12,12,13,13,14,14,15,15,15,16,17,17,17,18,18,19,19,19,19,20,20,20,21,21,21,22,22,22];
function showTile(i){
  var def=CFG.unlocks[i]; if(!def){ tile=null; return; }
  var g=new T.Group(); var base=box(1.9,0.1,1.9,0xf6c453,0,0.05,0); var fill=box(1.7,0.06,1.7,0xfff0bf,0,0.11,0,false); fill.scale.x=0.001; g.add(base); g.add(fill);
  [[-0.85,-0.85],[0.85,-0.85],[-0.85,0.85],[0.85,0.85]].forEach(function(p){ g.add(cyl(0.06,0.06,0.5,0x8b5a2b,p[0],0.25,p[1],6)); });
  g.position.set(def.x,hAt(def.x,def.z),def.z); scene.add(g);
  def.lvl=CAY_LVL[i]||1; var locked=S.level<def.lvl; var el=lbl('tile'+(locked?' locked':''), def.name+'<b>'+(locked?'Səviyyə '+def.lvl+' lazımdır':def.price)+'</b>');
  tile={def:def, i:i, grp:g, fill:fill, remaining:def.price, el:el, locked:locked, L:addLabel(el, new T.Vector3(def.x,0.8+hAt(def.x,def.z),def.z))};
}
function openTerrace(silent){ terrace.visible=true; scene.remove(southGate); removeObst(gateObst); terraceObst();
  var a=makeTable(-4.0,9.8,false), b=makeTable(0.5,9.8,false); fillFromWait();
  if(!silent){ [a,b].forEach(function(t){ t.grp.scale.set(0.01,0.01,0.01); pops.push({obj:t.grp,t:0}); }); camPan={pos:new T.Vector3(-1.5,0,11), until:S.session+2.2}; } }
function applyUnlock(def, silent){
  var obj=null;
  if(def.id==='samovar2'){ var s=makeSamovar(def.x); samovars.push(s); obj=s.grp; }
  else if(def.id==='table'){ var t=makeTable(def.x,def.z,false,null,def.axis); obj=t.grp; fillFromWait(); }
  else if(def.id==='waiter'){ var w=makeWaiter(def.x,def.z); obj=w.grp; }
  else if(def.id==='pax'){ paxSt=makePax(def.x); obj=paxSt.grp; upTable=makeUpTable(-6.2,5.0); }
  else if(def.id==='nerd'){ var tn=makeTable(def.x,def.z,'nerd'); obj=tn.grp; fillFromWait(); }
  else if(def.id==='domino'){ var td=makeTable(def.x,def.z,'domino'); obj=td.grp; fillFromWait(); }
  else if(def.id==='kassir'){ kassir=makeKassir(6.2,0.25); obj=kassir.grp; }
  else if(def.id==='terrace'){ openTerrace(silent); }
  else if(def.id==='sweet'){ obj=makeSweet(def.t).grp; }
  else if(def.id==='usta'){ var nu=makeUsta(Math.min(4.4,def.sx),false); obj=nu.grp; }
  else if(def.id==='hall'){ buildHall(silent); }
  else if(def.id==='sky'){ buildSky(silent); var ta=makeTaxt(0), tb=makeTaxt(1); makeSkySamovar(-9); makeSkyUsta(-9); makeSkyWaiter(0); fillFromWait(); if(!silent){ [ta,tb].forEach(function(t){ t.grp.scale.set(0.01,0.01,0.01); pops.push({obj:t.grp,t:0}); }); } }
  else if(def.id==='taxt'){ obj=makeTaxt(def.k).grp; fillFromWait(); }
  else if(def.id==='skysam'){ obj=makeSkySamovar(def.sx).grp; }
  else if(def.id==='skyvar'){ obj=makeSkyVar(def.t,def.sx).grp; }
  else if(def.id==='skyusta'){ obj=makeSkyUsta(def.sx).grp; }
  else if(def.id==='skywt'){ obj=makeSkyWaiter(def.k).grp; }
  else if(def.id==='variety'){ obj=makeVariety(def.t, def.sx).grp; }
  else if(def.id==='samovar3'){ extendCounter(); var s3=makeSamovar(def.sx); samovars.push(s3); obj=s3.grp; }
  else if(def.id==='bigsam'){ extendCounter(); var sb=makeSamovar(def.sx,true); samovars.push(sb); obj=sb.grp; }
  else if(def.id==='roof'){ buildRoof(silent); var r1=makeTable(ROOF_TABLES[0][0],ROOF_TABLES[0][1],'normal'), r2=makeTable(ROOF_TABLES[1][0],ROOF_TABLES[1][1],'normal'); fillFromWait(); if(!silent){ [r1,r2].forEach(function(t){ t.grp.scale.set(0.01,0.01,0.01); pops.push({obj:t.grp,t:0}); }); } }
  else if(def.id==='rooftable'){ var rt=makeTable(ROOF_TABLES[def.k][0],ROOF_TABLES[def.k][1],'normal'); obj=rt.grp; fillFromWait(); }
  else if(def.id==='music'){ musician=makeMusician(def.x,def.z); obj=musician.grp; S.patienceMul=1.5; }
  if(obj && !silent){ obj.scale.set(0.01,0.01,0.01); pops.push({obj:obj,t:0}); }
}
function doUnlock(){ if(!tile) return;
  var i=tile.i, def=tile.def;
  scene.remove(tile.grp); tile.L.dead=true; tile=null;
  applyUnlock(def,false); S.unlocked=i+1; S.unlockTimes[i]=Math.round(S.elapsed); S.money=Math.round(S.money); setTimeout(function(){ addXP(5); }, 2200);
  SFX.unlock(); buzz([20,30,40]); confetti(def); showBanner(def.name+' açıldı');
  if(i+1<CFG.unlocks.length) showTile(i+1); else setTimeout(function(){ showBanner('Prototipin sonu — təşəkkürlər!', 4000); }, 2300);
  save();
}

// ---------- tutorial ----------
var TUT=[
  {text:'Çayı götür', get:function(v){ return v.set(samovars[0].out.x,1.5,samovars[0].out.z); }, done:function(){ return player.items.length>0; }},
  {text:'Masaya apar', get:function(v){ var t=null; for(var i=0;i<customers.length;i++){ if(customers[i].state==='sit'){ t=customers[i].seat.t; break; } } t=t||tables[0]; return v.set(t.pos.x,1.5,t.pos.z); }, done:function(){ return S.delivered>0; }},
  {text:'Pulu yığ', get:function(v){ return v.set(pile.pos.x,1.6,pile.pos.z); }, done:function(){ return S.money>0; }},
  {text:'Samovar aç', get:function(v){ return tile? v.set(tile.def.x,1.2,tile.def.z) : v.set(0,0,0); }, done:function(){ return S.unlocked>=1; }}
];
var tutL=null;
function updateTutorial(){
  if(S.tut>=TUT.length){ if(tutL){ tutL.dead=true; tutL=null; } return; }
  var step=TUT[S.tut];
  if(!tutL){ var el=lbl('tut','<div class="hint"></div><div class="arrow"></div>'); tutL=addLabel(el,null,null); }
  tutL.get=step.get; var hint=tutL.el.firstChild; if(hint.textContent!==step.text) hint.textContent=step.text;
  if(step.done()){ S.tut++; }
}

// ---------- upgrades panel ----------
var panelKey=null, panelT=0;
function renderPanel(){
  var ups=$('ups'); ups.innerHTML='';
  Object.keys(CFG.ups).forEach(function(k){ var u=CFG.ups[k], l=S.up[k], max=l>=u.prices.length, price=max?0:u.prices[l];
    var row=document.createElement('div'); row.className='up';
    var d=document.createElement('div'); d.textContent=u.name; var sm=document.createElement('small'); sm.textContent=u.label(l)+(max?'':' → '+u.label(l+1)); d.appendChild(sm); row.appendChild(d);
    var b=document.createElement('button'); b.className='buy'; b.textContent= max?'Maks':String(price); b.disabled = max || S.money<price;
    if(!max) b.addEventListener('click', function(){ if(S.money>=price){ S.money-=price; S.up[k]++; if(k==='waiters') extraWaiter(S.up.waiters-1,false); SFX.pop(); buzz(15); bumpMoney(); save(); renderPanel(); } });
    row.appendChild(b); ups.appendChild(row); });
}

var destMarker=(function(){ var m=new T.Mesh(new T.RingGeometry(0.22,0.34,28), new T.MeshBasicMaterial({color:0xf6c453, transparent:true, opacity:0.9, depthWrite:false})); m.rotation.x=-Math.PI/2; m.position.y=0.03; m.visible=false; scene.add(m); return m; })();
function counterSnap(x,z){ var ex=counterExt?5.7:1.6;
  if(skyOpen && x>-12.9 && x<6.9 && z>-20.95 && z<-19.85) return [Math.min(6.4,Math.max(-12.4,x)), -19.4];
  if(skyOpen && z<-20.95 && z>-24 && x>-17 && x<8.4) return [Math.min(7.75,Math.max(-12.25,x)), -21.75];
  if(x>-6.6 && x<ex && z>-7.65 && z<-3.95 && !(roofOpen && z<-7.6)) return [Math.min(ex-0.4,Math.max(-6.2,x)), -3.3];
  if(kioskBuilt && x>-13.2 && x<KIOSK.x+0.4 && z>KIOSK.z0-0.3 && z<KIOSK.z1+0.3) return [KIOSK.wx, Math.min(KIOSK.z1-0.3,Math.max(KIOSK.z0+0.3,z))];
  if(MK && z>MKZ.shelf0-0.1 && z<MKZ.shelf1+0.1){ var hit=null; MK.faces.forEach(function(f){ if(f && Math.abs(x-(f.x-f.side*0.3))<0.45) hit=f; }); if(hit){ var near=null, bd=1e9; MK.faces.forEach(function(f){ if(f && Math.abs(f.x-f.side*0.3-(hit.x-hit.side*0.3))<0.01){ var dd=Math.abs(x-f.sx); if(dd<bd){ bd=dd; near=f; } } }); return [near.sx, Math.min(MKZ.shelf1-0.4,Math.max(MKZ.shelf0+0.4,z))]; } }
  if(MK && z>MKZ.pal-0.5 && z<MKZ.z1 && x>17 && x<38){ return [x, MKZ.pal-0.95]; }
  if(VEN.sadliq && x>17.5 && x<20.6 && z>-6.7 && z<16.7) return [21.2, Math.min(16.0,Math.max(-6.0,z))];
  if(VEN.kofe && x>-15.95 && x<-12.9 && z>7.4 && z<17.5) return [-12.25, Math.min(17.0,Math.max(7.9,z))];
  if(VEN.restoran && x>17.8 && x<30.2 && z>-45 && z<-41.95) return [Math.min(29.6,Math.max(18.4,x)), -41.3];
  if(VEN.pub && x>-36 && x<-32.95 && z>8.8 && z<19.2) return [-32.3, Math.min(18.6,Math.max(9.4,z))];
  return null; }
function setPlayerDest(x,z){ x=Math.min(B.xmax,Math.max(B.xmin,x)); z=Math.min(B.zmax,Math.max(B.zmin,z));
  var snap=counterSnap(x,z); if(snap){ x=snap[0]; z=snap[1]; }
  if(gridDirty) buildGrid();
  var c=cellOf(x,z); if(c>=0 && grid[c]){ var cx=c%GW, cz=Math.floor(c/GW), best=null, bd=1e9;
    for(var r=1;r<40 && !best;r++){ for(var dz=-r;dz<=r;dz++) for(var dx=-r;dx<=r;dx++){ if(Math.max(Math.abs(dx),Math.abs(dz))!==r) continue; var ix=cx+dx, iz=cz+dz; if(ix<0||iz<0||ix>=GW||iz>=GH) continue; var i=ix+iz*GW; if(grid[i]) continue;
      var cc=cellCenter(i); if(cc[0]<B.xmin||cc[0]>B.xmax||cc[1]<B.zmin||cc[1]>B.zmax) continue; var d=dx*dx+dz*dz; if(d<bd){ bd=d; best=cc; } } }
    if(best){ x=best[0]; z=best[1]; } }
  else if(c>=0){ for(var k=0;k<OBST.length;k++){ var o=OBST[k]; if(x>o.x0-0.32&&x<o.x1+0.32&&z>o.z0-0.32&&z<o.z1+0.32){ var cc2=cellCenter(c); x=cc2[0]; z=cc2[1]; break; } } }
  player.path=findPath(player.pos.x,player.pos.z,x,z); player.dest={x:x,z:z}; player.repathed=false; player.stuckT=0; destMarker.position.set(x,0.03,z); destMarker.visible=true; destMarker.userData.t=0; }
function stepPlayer(dt){ var p=player, mx=0, my=0;
  if(keys['arrowleft']||keys['a']) mx-=1; if(keys['arrowright']||keys['d']) mx+=1; if(keys['arrowup']||keys['w']) my-=1; if(keys['arrowdown']||keys['s']) my+=1;
  var sp=CFG.baseSpeed, l=Math.hypot(mx,my);
  if(l>0.01){ mx/=l; my/=l; p.path=null; destMarker.visible=false; var wx=mx*(-camFwd.z)-my*camFwd.x, wz=mx*camFwd.x-my*camFwd.z; movePlayer(p, wx*sp*dt, wz*sp*dt); p.grp.rotation.y=Math.atan2(wx,wz); p.moving=true; return; }
  if(p.path && p.path.length){ var wp=p.path[0], dx=wp[0]-p.pos.x, dz=wp[1]-p.pos.z, d=Math.hypot(dx,dz);
    if(d<0.08){ p.path.shift(); if(!p.path.length){ p.path=null; destMarker.visible=false; p.moving=false; } return; }
    var step=Math.min(d, sp*dt), bx=p.pos.x, bz=p.pos.z; movePlayer(p, dx/d*step, dz/d*step); p.grp.rotation.y=Math.atan2(dx,dz); p.moving=true;
    if(Math.hypot(p.pos.x-bx,p.pos.z-bz)<step*0.3){ p.stuckT=(p.stuckT||0)+dt; if(p.stuckT>0.3){ p.stuckT=0; if(!p.repathed && p.dest){ p.repathed=true; p.path=findPath(p.pos.x,p.pos.z,p.dest.x,p.dest.z); } else { p.path=null; destMarker.visible=false; p.moving=false; } } } else p.stuckT=0;
    return; }
  p.moving=false; }
// ---------- player ----------
function updatePlayer(dt){
  var p=player; stepPlayer(dt); updateZone();
  p.pickT-=dt; p.dropT-=dt; p.collectT-=dt; p.coinT-=dt;
  var cap=CFG.padnosCap[S.up.padnos];
  if(p.pickT<=0 && p.items.length<cap){
    var srcs=samovars.concat(skySam).concat(Object.keys(skyVar).map(function(k){ return skyVar[k]; })).concat(paxSt?[paxSt]:[]).concat(Object.keys(varSt).map(function(k){ return varSt[k]; })).concat(Object.keys(sweetSt).map(function(k){ return sweetSt[k]; }));
    for(var i=0;i<srcs.length;i++){ var s=srcs[i]; var ax=s.axis==='x', fz=(ax ? p.pos.x-s.pick.x : p.pos.z-s.pick.z)*(s.side||1), lat=ax ? Math.abs(p.pos.z-s.pick.z) : Math.abs(p.pos.x-s.pick.x); if(s.items.length && lat<0.68 && ((fz>0 && fz<1.7) || (s.sky && fz<0 && fz>-1.7)) && Math.abs(p.pos.y-(s.out.y-0.95))<1){ var it=s.items.pop(); layStack(s.items,scene,s.out); p.items.push(it); layStack(p.items,p.grp.userData.root,CARRY); p.pickT=0.1; SFX.clink(); break; } }
  }
  if(p.dropT<=0 && p.items.length){
    outer: for(var ti=0;ti<tables.length;ti++){ var t=tables[ti]; if(dist(p.pos,t.pos) > t.reach+0.65) continue;
      for(var si=0;si<t.seats.length;si++){ var c=t.seats[si].c; if(!c || c.state!=='sit') continue;
        var tp = wantedType(c,p.items);
        if(tp){ var d=takeLast(p.items,tp); layStack(p.items,p.grp.userData.root,CARRY); give(c,d,false); p.dropT=0.12; S.delivered++; break outer; } } }
  }
  if(p.collectT<=0 && pile.amount>0 && dist(p.pos,pile.pos)<1.35){ var a=pile.amount; pile.amount=0; updatePileMeshes(); S.money+=a; S.st.coins=(S.st.coins||0)+a; bumpMoney(); flyCoins(pile.pos, p.pos, Math.min(8,1+Math.floor(a/10))); floatText(pile.pos,'+'+a,true); SFX.coin(); buzz(10); p.collectT=0.4; }
  if(tile) pourInto(tile, p, dt, doUnlock);
  for(var bi=bizTiles.length-1;bi>=0;bi--){ var btl=bizTiles[bi]; pourInto(btl, p, dt, function(){ buyBiz(btl); }); }
  collectBiz(p,dt); vPlayer(p,dt); cwPlayer(p,dt); mkPlayer(p,dt);
  var nb=bizNear(p), key = (upTable && dist(p.pos, upTable.pos)<1.4) ? 'tea' : nb ? nb.id : null;
  if(key!==panelKey){ panelKey=key; if(key){ if(key==='tea'){ $('panelTitle').textContent='Təkmilləşdirmə'; renderPanel(); } else renderBizPanel(nb); $('panel').style.display='block'; } else $('panel').style.display='none'; }
  if(panelKey){ panelT-=dt; if(panelT<=0){ panelT=0.6; if(panelKey==='tea') renderPanel(); else if(nb) renderBizPanel(nb); } }
  bobChar(p,dt);
}

// ---------- stations ----------
function updateStations(dt){
  samovars.concat(skySam).forEach(function(s){ s.t+=dt; while(s.ready>2){ s.ready--; placeTea(s); } if(s.items.length+s.ready<(s.cap||CFG.samovarCap)){ s.timer+=dt; var need=CFG.samovarTime[S.up.samovar]*(s.big?0.55:1); if(s.timer>=need){ s.timer-=need; s.ready++; } s.steam.visible=true; var k=(s.t*0.7)%1; s.steam.position.y=2.3+k*0.6; s.steam.material.opacity=0.5*(1-k); } else s.steam.visible=false; });
  Object.keys(sweetSt).forEach(function(k){ var ss=sweetSt[k]; if(ss.items.length<6){ ss.timer+=dt*(1+0.25*S.up.vspeed); if(ss.timer>=5){ ss.timer=0; var si=makeItem(k); si.t=S.elapsed; ss.items.push(si); layStack(ss.items,scene,ss.out); } } });
  Object.keys(skyVar).forEach(function(k){ var vs=skyVar[k]; if(vs.items.length<6){ vs.timer+=dt*(1+0.25*S.up.vspeed); if(vs.timer>=4.5){ vs.timer=0; var vi=makeItem(k); vi.t=S.elapsed; vs.items.push(vi); layStack(vs.items,scene,vs.out); } } });
  Object.keys(varSt).forEach(function(k){ var vs=varSt[k]; if(vs.items.length<6){ vs.timer+=dt*(1+0.25*S.up.vspeed); if(vs.timer>=4.5){ vs.timer=0; var vi=makeItem(k); vi.t=S.elapsed; vs.items.push(vi); layStack(vs.items,scene,vs.out); } } });
  if(paxSt && paxSt.items.length<CFG.paxCap){ paxSt.timer+=dt*(1+0.25*S.up.vspeed); if(paxSt.timer>=CFG.paxTime){ paxSt.timer-=CFG.paxTime; var ip=makeItem('pax'); paxSt.items.push(ip); layStack(paxSt.items,scene,paxSt.out); } }
  if(pile.fullT>0){ pile.fullT-=dt; pile.el.style.display='block'; } else pile.el.style.display='none';
}

// ---------- events ----------
var lastClock='';
function updateEvents(dt){
  S.nextSpawn-=dt; if(S.nextSpawn<=0){ S.nextSpawn=Math.max(CFG.spawnMin, (CFG.spawnBase-0.35*S.unlocked)*Math.max(0.6,1-0.04*(S.level-1))); spawnCustomer(null); }
  if(S.elapsed>=S.toyNext){ S.toyNext+=180; if(!VEN.sadliq && hallOpen) triggerToy(); }
  updateSkyScreen(dt);
  updateResv(dt);
  updateToyMarks(dt); updateTableBubbles(dt);
  if(!S.offerShown && S.elapsed>=S.offerAt && S.boostUntil<S.elapsed){ S.offerShown=true; $('offer').style.display='block'; }
  var boost=$('boost'); if(S.boostUntil>S.elapsed){ boost.style.display='block'; $('boostv').textContent=Math.ceil(S.boostUntil-S.elapsed); } else boost.style.display='none';
  var ck=todText(); if(ck!==lastClock){ lastClock=ck; $('clock').textContent=ck; }
  if(tile && tile.locked && S.level>=tile.def.lvl){ tile.locked=false; tile.el.classList.remove('locked'); tile.el.innerHTML=tile.def.name+'<b>'+Math.ceil(tile.remaining-0.001)+'</b>'; }
}
var lastMoney=-1, saveT=5;
function updateHud(dt){ var m=Math.floor(S.money); if(m!==lastMoney){ lastMoney=m; $('moneyv').textContent=m; } saveT-=dt; if(saveT<=0){ saveT=5; save(); } }
function updatePops(dt){ for(var i=pops.length-1;i>=0;i--){ var p=pops[i]; p.t+=dt; var k=Math.min(1,p.t/0.4); var s=0.01+(easeOutBack(k))*0.99; p.obj.scale.set(s,s,s); if(k>=1){ p.obj.scale.set(1,1,1); pops.splice(i,1); } } }
function updateLabels(dt){
  var w=window.innerWidth, h=window.innerHeight;
  for(var i=labels.length-1;i>=0;i--){ var L=labels[i];
    if(L.ttl!==undefined){ L.ttl-=dt; if(L.ttl<=0){ L.el.remove(); labels.splice(i,1); continue; } }
    if(L.dead){ L.el.remove(); labels.splice(i,1); continue; }
    var p = L.get ? L.get(tmpV) : tmpV.copy(L.pos); p.project(cam);
    var x=(p.x+1)/2*w, y=(1-p.y)/2*h, off = x<-120||x>w+120||y<-60||y>h+120; if(off!==L.off){ L.off=off; L.el.style.visibility=off?'hidden':''; } if(off) continue;
    if(L.bub && L.el.style.display!=='none'){ L.sx=x; L.sy=y; bubList.push(L); continue; }
    var tr='translate('+x.toFixed(0)+'px,'+y.toFixed(0)+'px) translate(-50%,-100%)'; if(tr!==L.tr){ L.tr=tr; L.el.style.transform=tr; } }
  declutter(); bubList.length=0;
}
function updateCamera(dt){
  if(camPan && S.session>camPan.until) camPan=null;
  if(camPan){ var k=1-Math.exp(-6*dt); camTarget.x+=(camPan.pos.x-camTarget.x)*k; camTarget.z+=(camPan.pos.z-camTarget.z)*k; }
  else if(!camFree){ var k2=1-Math.exp(-8*dt); camTarget.x+=(player.pos.x-camTarget.x)*k2; camTarget.z+=(player.pos.z-camTarget.z)*k2; }
  else if(player.moving && !(gesture && gesture.type==='pan')){ var v=tmpV.set(player.pos.x,player.pos.y+1,player.pos.z).project(cam); if(Math.abs(v.x)>0.55 || v.y>0.5 || v.y<-0.65){ var k3=1-Math.exp(-3.5*dt); camTarget.x+=(player.pos.x-camTarget.x)*k3; camTarget.z+=(player.pos.z-camTarget.z)*k3; } }
  var ty = camPan ? hAt(camPan.pos.x,camPan.pos.z) : (!camFree || player.moving) ? player.pos.y : camTarget.y; camTarget.y+=(ty-camTarget.y)*(1-Math.exp(-5*dt));
  cam.position.set(camTarget.x+camOff.x*CAMK, camTarget.y+camOff.y*CAMK, camTarget.z+camOff.z*CAMK); cam.lookAt(camTarget); cam.updateMatrixWorld();
  sun.position.set(camTarget.x-10, 24, camTarget.z+14); sun.target.position.set(camTarget.x,0,camTarget.z); sun.target.updateMatrixWorld();
  if(player) updateOcclusion();
}
var crowdT=0;
function updateCrowd(dt){ crowdT-=dt; if(crowdT>0) return; crowdT=0.25; var z=player? zoneAt(player.pos) : ZONES[0], c=zoneCount(z);
  $('crowdName').textContent=c.name; $('crowdv').textContent=c.inside; $('seatv').textContent=c.seats+(c.unit||''); $('waitv').textContent = c.wait ? ' · növbədə '+c.wait : ''; }
function updateAmbient(dt){
  if(destMarker.visible){ destMarker.userData.t=(destMarker.userData.t||0)+dt; var sc=1+0.15*Math.sin(destMarker.userData.t*8); destMarker.scale.set(sc,sc,sc); }
  updateUsta(dt);
  updateBand(dt);
  if(musician){ musician.t+=dt; musician.grp.position.y=band.y; var mr=musician.grp.userData.root; mr.position.y=-0.4+Math.abs(Math.sin(musician.t*4))*0.015; musician.grp.userData.legs.forEach(function(h){ h.rotation.x=-Math.PI/2; h.userData.knee.rotation.x=Math.PI/2; }); var ar=musician.grp.userData.arms; ar[0].rotation.x=-0.9; ar[0].userData.elbow.rotation.x=-0.7; ar[1].rotation.x=-0.5+Math.sin(musician.t*8)*0.12; ar[1].userData.elbow.rotation.x=-1.2; }
}

function update(dt){
  S.elapsed+=dt; S.session+=dt;
  updatePlayer(dt); updateStations(dt);
  for(var i=customers.length-1;i>=0;i--) updateCustomer(customers[i],dt);
  waiters.forEach(function(w){ updateWaiter(w,dt); }); spread(waiters,0.62);
  if(kassir) updateKassir(dt);
  updateAmbient(dt); updateDayNight(dt); updateTwinkle(); updateCars(dt); updateBiz(dt); updateMarket(dt); VEN_LIST.forEach(function(v){ vUpdate(v,dt); }); if(CW) cwUpdate(dt); tables.forEach(function(t){ if(t.domino) updateDomino(t,dt); }); updateCrowd(dt); updateMissions(dt);
  updateCoins(dt); updatePops(dt); updateTutorial(); updateEvents(dt); updateHud(dt);
}

// ---------- save ----------
function save(){ if(window.__cloudRestoring) return; try{ localStorage.setItem(SAVE_KEY, JSON.stringify({money:S.money, unlocked:S.unlocked, up:S.up, elapsed:S.elapsed, unlockTimes:S.unlockTimes, muted:S.muted, lost:S.lost, served:S.served, delivered:S.delivered, level:S.level, xp:S.xp, zoom:S.zoom, name:S.name, st:S.st, mis:S.mis, tod:S.tod, biz:S.biz, snd2:S.snd2, vol:S.vol, avatar:S.avatar, savedAt:Date.now()})); }catch(e){} if(window.cloudOnSave) window.cloudOnSave(); }
window.gameSave=save;
function load(){ try{ var d=JSON.parse(localStorage.getItem(SAVE_KEY)||'null'); if(d){ S.money=+d.money||0; S.unlocked=Math.min(d.unlocked|0, CFG.unlocks.length); if(d.up){ Object.keys(S.up).forEach(function(k){ S.up[k]=Math.min((d.up[k]|0), CFG.ups[k].prices.length); }); } S.elapsed=+d.elapsed||0; S.unlockTimes=d.unlockTimes||[]; S.muted=!!d.muted; S.lost=d.lost|0; S.served=d.served|0; S.delivered=d.delivered|0;
    if(d.xp===undefined){ var xp=(d.served|0)*2+(d.unlocked|0)*5, L=1; while(xp>=xpNeed(L)){ xp-=xpNeed(L); L++; } S.level=L; S.xp=xp; } else { S.level=Math.max(1,d.level|0); S.xp=+d.xp||0; }
    S.zoom=+d.zoom||1; if(typeof d.name==='string') S.name=d.name.slice(0,16); if(d.st && typeof d.st==='object') S.st=d.st; if(d.mis && d.mis.active) S.mis=d.mis; if(d.tod!==undefined) S.tod=+d.tod; if(d.biz) S.biz=d.biz; if(d.snd2) S.snd2=d.snd2; if(d.avatar!==undefined) S.avatar=d.avatar; if(d.vol!==undefined) S.vol=+d.vol; } }catch(e){} }

// ---------- ui ----------
$('mute').addEventListener('click', function(){ S.muted=!S.muted; $('mute').textContent=S.muted?'🔇':'🔊'; save(); });
$('info').addEventListener('click', function(){
  var rows=[]; CFG.unlocks.forEach(function(u,i){ rows.push([(i+1)+'. '+u.name, S.unlockTimes[i]!=null? fmt(S.unlockTimes[i]) : '—']); });
  rows.push(['Ümumi vaxt', fmt(S.elapsed)]); rows.push(['Pul', String(Math.floor(S.money))]); rows.push(['Xidmət olunan / itirilən', S.served+' / '+S.lost]);
  rows.push(['Səviyyə', S.level+' ('+Math.floor(S.xp)+' / '+xpNeed(S.level)+' XP)']);
  rows.push(['Padnos / ofisiant / samovar', S.up.padnos+' / '+S.up.speed+' / '+S.up.samovar]);
  var t=$('stattable'); t.innerHTML=''; rows.forEach(function(r){ var tr=document.createElement('tr'); r.forEach(function(x){ var td=document.createElement('td'); td.textContent=x; tr.appendChild(td); }); t.appendChild(tr); });
  paused=true; $('stats').style.display='flex';
});
$('close').addEventListener('click', function(){ $('stats').style.display='none'; paused=false; });
$('offer').addEventListener('click', function(){
  $('offer').style.display='none'; paused=true; var ov=$('adov'); ov.style.display='flex'; var n=3; $('adcount').textContent=n;
  var iv=setInterval(function(){ n--; $('adcount').textContent=n; if(n<=0){ clearInterval(iv); ov.style.display='none'; paused=false; S.boostUntil=S.elapsed+60; S.offerShown=false; S.offerAt=S.elapsed+240; showBanner('x2 gəlir — 60 saniyə'); } }, 1000);
});

document.addEventListener('visibilitychange', function(){ if(document.visibilityState==='hidden') save(); });
window.addEventListener('pagehide', save);
var nameEl=lbl('pname',''); addLabel(nameEl,null,function(v){ return v.set(player.pos.x, player.pos.y+2.22, player.pos.z); });
function setName(n){ n=(n||'').trim().slice(0,16); S.name = n || 'Oyunçu'; nameEl.textContent=S.name; if(typeof renderHudProfile==='function') renderHudProfile(); }
function startGame(){ audio(); setName($('pname').value); save(); $('start').style.display='none'; S.started=true; last=performance.now(); }
$('play').addEventListener('click', startGame);
$('pname').addEventListener('keydown', function(e){ if(e.key==='Enter') startGame(); });

// ---------- day & night ----------
var DAY_LEN=720, litMats=[], bldgMeshes=[], occFaded=[], occRay=new T.Raycaster(), occDir=new T.Vector3(13.4,15,13.4).normalize();
function updateOcclusion(){ for(var i=0;i<occFaded.length;i++){ occFaded[i].material.forEach(function(mt){ mt.opacity=1; mt.transparent=false; }); } occFaded.length=0;
  occRay.set(tmpV.set(player.pos.x,player.pos.y+1.0,player.pos.z), occDir); occRay.far=90; var hits=occRay.intersectObjects(bldgMeshes,false);
  for(var j=0;j<hits.length;j++){ var m=hits[j].object; if(occFaded.indexOf(m)<0){ occFaded.push(m); m.material.forEach(function(mt){ mt.transparent=true; mt.opacity=0.25; }); } } }
var glowTex=canvasTex(128,128,function(ctx,w,h){ var g=ctx.createRadialGradient(64,64,4,64,64,62); g.addColorStop(0,'rgba(255,225,150,0.8)'); g.addColorStop(0.45,'rgba(255,215,130,0.28)'); g.addColorStop(1,'rgba(255,200,100,0)'); ctx.fillStyle=g; ctx.fillRect(0,0,w,h); });
var poolMat=new T.MeshBasicMaterial({map:glowTex, transparent:true, opacity:0, depthWrite:false, blending:T.AdditiveBlending});
function lightPool(x,z,r,parent,keep){ var m=new T.Mesh(new T.PlaneGeometry(r*2,r*2), poolMat); m.rotation.x=-Math.PI/2; m.position.set(x,0.035,z); if(keep) m.userData.keep=true; (parent||scene).add(m); return m; }
var SKY_DAY=new T.Color(0xa9ddf3), SKY_DUSK=new T.Color(0xf0a070), SKY_NIGHT=new T.Color(0x141d33), skyCol=new T.Color();
function smoothstep(a,b,x){ var t=Math.max(0,Math.min(1,(x-a)/(b-a))); return t*t*(3-2*t); }
function daylight(){ var el=Math.sin((S.tod-0.25)*Math.PI*2); return smoothstep(-0.3,0.45,el); }
function updateDayNight(dt){ S.tod=(S.tod+dt/DAY_LEN)%1; var d=daylight(), el=Math.sin((S.tod-0.25)*Math.PI*2), dusk=1-smoothstep(0,0.4,Math.abs(el));
  skyCol.copy(SKY_NIGHT).lerp(SKY_DAY,d).lerp(SKY_DUSK,dusk*0.55); scene.background.copy(skyCol); scene.fog.color.copy(skyCol);
  sun.intensity=0.12+0.8*d; sun.color.setHex(dusk>0.5?0xffb07a:0xffe7c4); hemi.intensity=0.28+0.68*d; hemi.color.setHex(d>0.5?0xfff6e8:0x9fb4d6);
  var n=1-d; poolMat.opacity=smoothstep(0.2,0.8,n); for(var i=0;i<litMats.length;i++){ var lm=litMats[i], off=lm.userData.off||0; lm.emissiveIntensity=smoothstep(off,off+0.3,n)*0.95; } }
function todText(){ var h=S.tod*24, hh=Math.floor(h), mm=Math.floor((h-hh)*60); return (daylight()>0.5?'☀ ':'🌙 ')+('0'+hh).slice(-2)+':'+('0'+mm).slice(-2); }
var facadeLitCache={};
function facadeLitCanvas(upper){ var key=upper?'u':'n'; if(facadeLitCache[key]) return facadeLitCache[key];
  var c=makeCanvas(128, upper?256:128, function(ctx,w,h){ ctx.fillStyle='#000'; ctx.fillRect(0,0,w,h); ctx.fillStyle='#ffd27a'; archRect(ctx,40,24,48,74); ctx.fill(); ctx.fillStyle='#2a1a08'; ctx.fillRect(62,24,4,74); ctx.fillRect(40,62,48,4); });
  facadeLitCache[key]=c; return c; }
function sideMat(canvas, len, rep, lit){ var rx=Math.max(1,Math.round(len/2.4)), m=new T.MeshLambertMaterial({map:texFrom(canvas,rx,rep)});
  if(lit){ m.emissiveMap=texFrom(lit,rx,rep); m.emissive=new T.Color(0xffc870); m.emissiveIntensity=0; m.userData.off=0.15+Math.random()*0.45; litMats.push(m); } return m; }
function building(x0,x1,z0,z1,floors,wall,opts){ opts=opts||{}; var w=x1-x0, d=z1-z0, h=floors*2.6+0.3, cx=(x0+x1)/2, cz=(z0+z1)/2;
  var cv=facadeCanvas(wall, opts.upper), lit=facadeLitCanvas(opts.upper), rep=opts.upper? floors/2 : floors;
  var mx=sideMat(cv,d,rep,lit), mz=sideMat(cv,w,rep,lit), roof=new T.MeshLambertMaterial({color:lin(opts.roof||0xb9a37e)});
  var m=new T.Mesh(new T.BoxGeometry(w,h,d), [mx,mx,roof,roof,mz,mz]); m.position.set(cx,h/2,cz); m.castShadow=true; m.receiveShadow=true; scene.add(m); bldgMeshes.push(m);
  var pc=opts.trim||0xcdb48c;
  scene.add(box(w+0.2,0.35,0.2,pc,cx,h+0.17,z0)); scene.add(box(w+0.2,0.35,0.2,pc,cx,h+0.17,z1)); scene.add(box(0.2,0.35,d,pc,x0,h+0.17,cz)); scene.add(box(0.2,0.35,d,pc,x1,h+0.17,cz));
  scene.add(box(w+0.08,0.4,d+0.08,0xa8957a,cx,0.2,cz,false));
  (opts.balc||[]).forEach(function(b){ balcony(b[0], b[1], b[2], b[3], b[4]); });
  m.userData.obst=addObst(x0,x1,z0,z1); return m; }
function lamp(x,z,dir){ dir=dir||-1; scene.add(cyl(0.08,0.1,3.0,0x3a3f44,x,1.5,z,8)); scene.add(box(0.5,0.08,0.08,0x3a3f44,x+dir*0.2,2.95,z)); var hd=new T.Mesh(new T.SphereGeometry(0.2,12,8), new T.MeshBasicMaterial({color:0xffe9b0})); hd.position.set(x+dir*0.42,2.82,z); scene.add(hd); lightPool(x+dir*0.42,z,2.8); addObst(x-0.15,x+0.15,z-0.15,z+0.15); }
function signTex(text,bg,fg,asp){ return canvasTex(Math.round(112*Math.max(1.6,asp||2.86)),112,function(ctx,w,h){ ctx.fillStyle=bg; roundRect(ctx,4,4,w-8,h-8,18); ctx.fill(); ctx.lineWidth=5; ctx.strokeStyle='rgba(0,0,0,0.25)'; ctx.stroke(); ctx.fillStyle=fg; var fs=Math.round(h*0.52), FF='px Nunito, "Segoe UI", Arial, sans-serif'; ctx.font='900 '+fs+FF; var mw=ctx.measureText(text).width; if(mw>w-36){ fs=Math.floor(fs*(w-36)/mw); ctx.font='900 '+fs+FF; } ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(text,w/2,h/2+3); }); }
function bizSign(text,bg,fg,w,h,x,y,z,ry){ var m=new T.Mesh(new T.PlaneGeometry(w,h), new T.MeshBasicMaterial({map:signTex(text,bg,fg,w/h)})); m.position.set(x,y,z); if(ry) m.rotation.y=ry; m.userData.keep=true; scene.add(m); return m; }

// ---------- roads & filler city ----------
function roadV(x,z0,z1){ var len=z1-z0, m=new T.Mesh(new T.PlaneGeometry(4,len), new T.MeshLambertMaterial({map:texFrom(TEX.roadV.image,1,len/4)})); m.rotation.x=-Math.PI/2; m.position.set(x,0.012,(z0+z1)/2); m.receiveShadow=true; scene.add(m); }
function roadH(z,x0,x1){ var len=x1-x0, m=new T.Mesh(new T.PlaneGeometry(4,len), new T.MeshLambertMaterial({map:texFrom(TEX.roadV.image,1,len/4)})); m.rotation.set(-Math.PI/2,0,Math.PI/2); m.position.set((x0+x1)/2,0.011,z); m.receiveShadow=true; scene.add(m); }
function crosswalk(x,z,vertical){ for(var i=0;i<7;i++){ scene.add(vertical? box(0.4,0.02,2.6,0xf2efe6,x-1.5+i*0.5,0.025,z,false) : box(2.6,0.02,0.4,0xf2efe6,x,0.025,z-1.5+i*0.5,false)); } }
function buildCity(){
  scene.add(plane(240,240,TEX.pave,0,0,0,-Math.PI/2));
  roadV(12.5,-70,70); roadV(-20,-70,70); roadH(22.3,-70,70); roadH(-28,-70,70);
  [[12.5,-23.4],[12.5,17.7],[-20,-23.4],[-20,17.7]].forEach(function(p){ crosswalk(p[0],p[1],true); });
  [[7.9,22.3],[-15.4,22.3],[7.9,-28],[-15.4,-28]].forEach(function(p){ crosswalk(p[0],p[1],false); });
  // çayxana block neighbours
  w1Bld=building(-16,-8.4,-13,-3.5,3,'#e6cfa0',{balc:[['+x',-8.4,-8.5,2.8,3.2]]});
  building(-17,-13,-3.5,6.6,2,'#d8b98c');
  w3Bld=building(-16,-8.4,6.6,18.3,2,'#ead8b4');
  n1Bld=building(-17,8.4,-24,-13,4,'#dcc39a');
  // other blocks
  building(17,31,-24,-11,3,'#e2c79c'); buildSadliqShell(); buildParking(); 
  building(-36,-24,-24,-11,3,'#e3cda4'); building(-36,-24,27,41,2,'#dcc29a');
  building(4,8.5,-45,-32,1,'#d8c6a0');
  buildPark();
  // lamps
  [-6,0,6,12,18].forEach(function(z){ lamp(10.3,z,-1); }); [-14,-2,10,30,38].forEach(function(z){ lamp(14.7,z,1); });
  [-6,0,6].forEach(function(x){ lamp(x,19.9,-1); }); [-30,-12,4,18,28].forEach(function(x){ lamp(x,24.7,1); });
  [-20,-8,4,16,30].forEach(function(z){ lamp(-17.6,z,-1); }); [-26,-14,-2,10].forEach(function(x){ lamp(x,-25.6,1); });
  initCars();
}

// ---------- car traffic ----------
var CAR_KINDS=['sedan','hatch','suv','pickup','taxi','van','bus'], CAR_COLORS=[0xffffff,0x1b1b1b,0x8a8f94,0xb22222,0x1f3a93,0x2e7d32,0xc0c0c0,0x6d4c41,0xe0a020];
var hlMat=new T.MeshBasicMaterial({color:0xfff4c8}), tlMat=new T.MeshBasicMaterial({color:0xff3b3b}), bulbMat=new T.MeshBasicMaterial({color:0xffd27a});
var LOOP_PTS=[[12.5,-28],[12.5,22.3],[-20,22.3],[-20,-28]], CAR_LOOPS=[];
function laneLoop(cw, off){ var pts = cw? LOOP_PTS : LOOP_PTS.slice().reverse(), n=pts.length, out=[];
  for(var i=0;i<n;i++){ var p=pts[i], a=pts[(i-1+n)%n], b=pts[(i+1)%n]; var f1=[p[0]-a[0],p[1]-a[1]], f2=[b[0]-p[0],b[1]-p[1]], l1=Math.hypot(f1[0],f1[1]), l2=Math.hypot(f2[0],f2[1]); f1=[f1[0]/l1,f1[1]/l1]; f2=[f2[0]/l2,f2[1]/l2];
    var r1=[-f1[1],f1[0]], r2=[-f2[1],f2[0]]; out.push([p[0]+(r1[0]+r2[0])*off, p[1]+(r1[1]+r2[1])*off]); }
  var len=[], cum=[], tot=0; for(var j=0;j<n;j++){ var q=out[(j+1)%n]; cum.push(tot); len.push(Math.hypot(q[0]-out[j][0],q[1]-out[j][1])); tot+=len[j]; }
  return {pts:out, len:len, cum:cum, total:tot, cars:[]}; }
function initCars(){ CAR_LOOPS.push(laneLoop(true,1.0)); CAR_LOOPS.push(laneLoop(false,1.0));
  CAR_LOOPS.forEach(function(lp,li){ for(var i=0;i<5;i++){ var kind=CAR_KINDS[(i*2+li)%CAR_KINDS.length], c={grp:carModel(kind, pick(CAR_COLORS)), seg:i%4, t:(i*0.37+li*0.2)%1, v:4, vmax:4.5+Math.random()*3, dist:0}; lp.cars.push(c); } }); }
function placeCar(lp,c){ var A=lp.pts[c.seg], Bp=lp.pts[(c.seg+1)%lp.pts.length]; c.grp.position.set(A[0]+(Bp[0]-A[0])*c.t, 0, A[1]+(Bp[1]-A[1])*c.t); c.grp.rotation.y=Math.atan2(Bp[0]-A[0], Bp[1]-A[1]); }
function updateCars(dt){ CAR_LOOPS.forEach(function(lp){ var cs=lp.cars, n=lp.pts.length; cs.forEach(function(c){ c.dist=lp.cum[c.seg]+c.t*lp.len[c.seg]; });
  cs.forEach(function(c){ var gap=1e9; cs.forEach(function(o){ if(o===c) return; var d=(o.dist-c.dist+lp.total)%lp.total; if(d<gap) gap=d; });
    var tgt = gap<7 ? Math.max(0, c.vmax*(gap-3)/4) : c.vmax; c.v+=(tgt-c.v)*Math.min(1,dt*2.5); var rem=c.v*dt;
    while(rem>0){ var left=(1-c.t)*lp.len[c.seg]; if(rem<left){ c.t+=rem/lp.len[c.seg]; rem=0; } else { rem-=left; c.seg=(c.seg+1)%n; c.t=0; } }
    placeCar(lp,c); if(player && Math.random()<dt*0.05 && dist(c.grp.position,player.pos)<9) SFX.horn(); }); }); }

// ---------- businesses ----------
var BIZ=[
  {id:'moyka',   name:'Moyka',           type:'carwash', price:900,  lvl:3,  x0:-36,x1:-24,z0:-8,z1:6,    door:[-24,-1],  front:[-22.8,-1],   stand:[-22.8,3.5],   board:[-22.8,-5.5],  spawns:[[-22.8,-13],[-22.8,11]],  income:30, every:9},
  {id:'pub',     name:'Pub',             type:'pub',     price:1800, lvl:5,  x0:-36,x1:-24,z0:8,z1:20,    door:[-24,14],  front:[-22.8,14],   stand:[-22.8,18],    board:[-22.8,10],    spawns:[[-22.8,3],[-22.8,25]],    income:25, every:8},
  {id:'restoran',name:'Restoran',        type:'rest',    price:3200, lvl:8,  x0:17,x1:31,z0:-45,z1:-32,   door:[24,-32],  front:[24,-30.8],   stand:[28.5,-30.8],  board:[19.5,-30.8],  spawns:[[15.3,-30.8],[33,-30.8]], income:45, every:9},
  {id:'paltar',  name:'Paltar dükanı',   type:'shop',    price:5000, lvl:10, x0:-14,x1:2,z0:-45,z1:-32,   door:[-6,-32],  front:[-6,-30.8],   stand:[-1.5,-30.8],  board:[-10.5,-30.8], spawns:[[-17,-30.8],[5,-30.8]],   income:60, every:10},
  {id:'market',  name:'Supermarket',     type:'market',  price:6000, lvl:9,  x0:17,x1:24.5,z0:27,z1:41, door:[20.8,27], front:[20.8,25.6], stand:[20.8,25.6], board:[16.0,26.0], spawns:[[15.6,25.4],[33.0,25.4]], income:10, every:9},
  {id:'sadliq',  name:'Şadlıq evi',      type:'hall',    price:12000, lvl:15, x0:17.5,x1:30.5,z0:-7.5,z1:17.5, door:[25.8,17.5], front:[21.6,19.2], stand:[21.6,19.2], board:[19.0,19.2], spawns:[[15.6,19.2],[33.0,19.2]], income:0, every:9, sale:[22.2,4.2,17.85,0]},
  {id:'kofe',    name:'Coffee shop',     type:'cafe',    price:7000, lvl:14, need:9, x0:-16,x1:-8.4,z0:6.6,z1:18.3, door:[-7.3,14.6], front:[-7.0,15.2], stand:[-7.0,15.2], board:[-5.6,16.0], spawns:[[9.4,-7.5],[9.4,17.5]], income:50, every:9},
  {id:'eylence', name:'Əyləncə mərkəzi', type:'fun',     price:9000, lvl:13, x0:-38,x1:-24,z0:-45,z1:-32, door:[-31,-32], front:[-31,-30.8],  stand:[-26.5,-30.8], board:[-35.5,-30.8], spawns:[[-41,-30.8],[-23,-30.8]], income:80, every:10}
];
var BIZ_UPS=[{name:'Gəlir', desc:'hər səviyyə +40%', base:150},{name:'Müştəri axını', desc:'hər səviyyə +35%', base:200}];
var bizTiles=[], bizDecor=[];
function bizState(id){ if(!S.biz) S.biz={}; if(!S.biz[id]) S.biz[id]={own:0, lv:[0,0,0], cash:0}; return S.biz[id]; }
function bizCap(st){ return Infinity; }
function bizIncome(b,st){ return Math.round(b.income*(1+0.4*st.lv[0])*levelMul()); }
function bizEvery(b,st){ return b.every/(1+0.35*st.lv[1]); }
function makeLot(b){ if(b.type==='cafe'||b.type==='hall'){ makeCafeLot(b); return; } var cx=(b.x0+b.x1)/2, cz=(b.z0+b.z1)/2;
  scene.add(plane(b.x1-b.x0, b.z1-b.z0, TEX.woodSmall, cx, 0.012, cz, -Math.PI/2));
  b.lotGrp=new T.Group(); b.lotGrp.add(box(b.x1-b.x0-0.4,0.3,0.4,0x9a9ca0,cx,0.15,b.z0+0.2)); b.lotGrp.add(box(b.x1-b.x0-0.4,0.3,0.4,0x9a9ca0,cx,0.15,b.z1-0.2)); b.lotGrp.add(box(0.4,0.3,b.z1-b.z0-0.4,0x9a9ca0,b.x0+0.2,0.15,cz)); b.lotGrp.add(box(0.4,0.3,b.z1-b.z0-0.4,0x9a9ca0,b.x1-0.2,0.15,cz));
  var sx=b.door[0], sz=b.door[1], vert = Math.abs(b.door[0]-b.x0)<0.01 || Math.abs(b.door[0]-b.x1)<0.01;
  b.lotGrp.add(cyl(0.08,0.1,2.4,0x5a3a1e, vert? sx+0.6 : sx, 1.2, vert? sz : sz+0.6, 8));
  var sg=new T.Mesh(new T.PlaneGeometry(2.4,0.9), new T.MeshBasicMaterial({map:signTex('Satılır','#e2574c','#fff6e6')})); sg.position.set(vert? sx+0.62 : sx, 2.0, vert? sz : sz+0.62); if(vert) sg.rotation.y=Math.PI/2; sg.userData.keep=true; b.lotGrp.add(sg);
  scene.add(b.lotGrp); bakeAll(b.lotGrp); b.lotObst=addObst(b.x0,b.x1,b.z0,b.z1);
  var g=new T.Group(); var base=box(1.9,0.1,1.9,0xf6c453,0,0.05,0); var fill=box(1.7,0.06,1.7,0xfff0bf,0,0.11,0,false); fill.scale.x=0.001; g.add(base); g.add(fill);
  [[-0.85,-0.85],[0.85,-0.85],[-0.85,0.85],[0.85,0.85]].forEach(function(p){ g.add(cyl(0.06,0.06,0.5,0x8b5a2b,p[0],0.25,p[1],6)); });
  g.position.set(b.front[0],0,b.front[1]); scene.add(g);
  var el=lbl('tile',''); var tl={def:b, biz:true, grp:g, fill:fill, remaining:b.price, el:el, L:addLabel(el, new T.Vector3(b.front[0],0.9,b.front[1])), locked:true};
  bizTiles.push(tl); refreshBizTile(tl); }
function refreshBizTile(tl){ var b=tl.def, lvOk=S.level>=b.lvl, needOk=!b.need || S.unlocked>=b.need, ok=lvOk&&needOk; tl.locked=!ok; tl.el.innerHTML = b.name+'<b>'+(ok? Math.ceil(tl.remaining-0.001) : !lvOk ? 'Səviyyə '+b.lvl+' lazımdır' : 'Əvvəlcə terrası aç')+'</b>'; tl.el.classList.toggle('locked', !ok); }
function pourInto(tl, p, dt, done){ if(tl.done || tl.locked || tl.remaining<=0 || S.money<=0.5 || dist(p.pos,tl.grp.position)>1.2) return;
  var rate=Math.max(40, tl.def.price*0.8), take=Math.min(S.money, tl.remaining, rate*dt); S.money-=take; tl.remaining-=take;
  tl.fill.scale.x=Math.max(0.001, 1-tl.remaining/tl.def.price); if(tl.biz) refreshBizTile(tl); else tl.el.querySelector('b').textContent=Math.ceil(tl.remaining-0.001);
  if(p.coinT<=0){ flyCoins(p.pos, tl.grp.position, 1); p.coinT=0.08; }
  if(tl.remaining<=0.001){ tl.done=true; done(); } }
function buyBiz(tl){ var b=tl.def, st=bizState(b.id); st.own=1; scene.remove(tl.grp); tl.L.dead=true; var i=bizTiles.indexOf(tl); if(i>=0) bizTiles.splice(i,1);
  S.money=Math.round(S.money); buildBiz(b,false); S.st.bizown=(S.st.bizown||0)+1; SFX.unlock(); buzz([20,30,40]); confetti({x:b.front[0],z:b.front[1]}); showBanner(b.name+' sənindir!', 2600); setTimeout(function(){ addXP(20); }, 2200); save(); }
function decorChar(look,x,z,rot,seated){ var g=makeChar(look); g.position.set(x,0,z); g.rotation.y=rot; var e={grp:g,pos:g.position,t:Math.random()*5,moving:false,seated:!!seated,state:'sit'}; bizDecor.push(e); return e; }
function bizTable(x,z,cloth,parent){ var g=parent||scene; g.add(cyl(0.08,0.12,0.7,0x6b4a2b,x,0.35,z)); g.add(cyl(0.55,0.55,0.06,cloth?0xf6efe2:0x8b5a2b,x,0.72,z,16)); [[-0.9,0],[0.9,0]].forEach(function(d){ g.add(box(0.46,0.07,0.46,0x9c6b3c,x+d[0],0.45,z+d[1])); g.add(cyl(0.04,0.04,0.45,0x6b4a2b,x+d[0],0.22,z+d[1],6)); }); }
function buildBiz(b, silent){ var st=bizState(b.id), cx=(b.x0+b.x1)/2, cz=(b.z0+b.z1)/2;
  if(b.lotGrp){ scene.remove(b.lotGrp); disposeTree(b.lotGrp); b.lotGrp=null; } if(b.lotObst){ removeObst(b.lotObst); b.lotObst=null; }
  if(b.type==='carwash'){ b.stand=null; buildCarWash(b,silent); return; } if(b.type==='market'){ b.stand=null; buildMarket(b,silent); return; } if(b.type==='pub'||b.type==='rest'||b.type==='cafe'||b.type==='hall'){ b.stand=null; if(b.lotGrp===null && b.type==='cafe'){} buildVenue(b,silent); return; }
  var G=new T.Group(); b.grp=G;
  if(b.type==='carwash'){
    G.add(plane(12,14,TEX.pave,cx,0.013,cz,-Math.PI/2));
    [[-33,-5],[-27,-5],[-33,3],[-27,3]].forEach(function(p){ G.add(cyl(0.14,0.16,3.4,0x3a4a5a,p[0],1.7,p[1],8)); });
    G.add(box(8.4,0.25,10,0x3b6fb6,-30,3.5,-1)); G.add(box(8.6,0.5,0.3,0x2a5a9a,-30,3.85,-6.1)); G.add(box(8.6,0.5,0.3,0x2a5a9a,-30,3.85,4.1));
    G.add(cyl(1.0,1.0,2.2,0x5d8fd1,-34.5,1.1,-6.5,14)); G.add(box(0.6,0.8,0.6,0xe2574c,-25.5,0.4,5.3)); G.add(box(0.6,0.8,0.6,0xe2574c,-34.5,0.4,5.3));
    b.brushes=[cyl(0.55,0.55,1.7,0x2f6fd0,-30,1.3,-3.3,14), cyl(0.55,0.55,1.7,0x2f6fd0,-30,1.3,-0.7,14)]; b.brushes.forEach(function(m){ m.userData.keep=true; G.add(m); });
    b.foam=new T.Group(); for(var i=0;i<14;i++){ var f=sph(0.22+Math.random()*0.18,0xffffff,-31.5+Math.random()*3,0.6+Math.random()*1.2,-2.9+Math.random()*1.8); f.castShadow=false; f.userData.keep=true; b.foam.add(f); } b.foam.visible=false; b.foam.userData.keep=true; G.add(b.foam);
    bizSign('Moyka','#2a5a9a','#ffffff',5,1.6,-25.75,4.6,-1,Math.PI/2);
    b.carPath=[[-21,-24],[-22.6,-7],[-30,-2],[-30,2.2],[-23.6,4],[-19,-3],[-19,-42]]; b.cars=[];
  } else if(b.type==='pub'){
    building(b.x0,b.x0+9,b.z0,b.z1,2,'#8b5a3c'); G.add(box(1.2,2.0,0.14,0x3a2718,b.x0+9.04,1.0,14)); bizSign('Pub','#1f5a3c','#f6c453',4.2,1.5,b.x0+9.09,4.3,14,Math.PI/2);
    G.add(plane(3,12,TEX.stone,b.x1-1.5,0.013,14,-Math.PI/2)); [[b.x1-1.5,10],[b.x1-1.5,14],[b.x1-1.5,18]].forEach(function(p){ bizTable(p[0],p[1],false,G); });
    [[b.x1-0.2,8.2],[b.x1-0.2,19.8]].forEach(function(p){ G.add(cyl(0.06,0.08,3.2,0x3a3f44,p[0],1.6,p[1],6)); });
    for(var k=0;k<12;k++){ var bl=new T.Mesh(new T.SphereGeometry(0.09,8,6), bulbMat); bl.position.set(b.x1-0.2, 3.1-Math.sin(k/11*Math.PI)*0.35, 8.2+k*(11.6/11)); bl.userData.keep=true; G.add(bl); }
    if(!silent || true){ [[b.x1-2.4,10],[b.x1-0.6,14],[b.x1-2.4,18]].forEach(function(p,i){ var d=decorChar(randomLook('normal'),p[0],p[1],p[0]<b.x1-1.5?Math.PI/2:-Math.PI/2,true); d.drink=true; }); }
  } else if(b.type==='rest'){
    building(b.x0,b.x1,b.z0,b.z1-4,2,'#efdcb5'); G.add(box(1.3,2.1,0.14,0x5a3a1e,24,1.05,b.z1-3.96));
    var aw=new T.Mesh(new T.BoxGeometry(12,0.18,4.2), new T.MeshLambertMaterial({map:texFrom(makeCanvas(64,64,function(ctx,w,h){ for(var i=0;i<4;i++){ ctx.fillStyle=i%2?'#b8352f':'#f6efe2'; ctx.fillRect(i*16,0,16,h); } }),6,1)})); aw.position.set(24,3.1,b.z1-2); aw.rotation.x=0.18; aw.castShadow=true; G.add(aw);
    [[19,b.z1-2.2],[29,b.z1-2.2]].forEach(function(p){ G.add(cyl(0.06,0.08,3.0,0x3a3f44,p[0],1.5,p[1],6)); });
    G.add(plane(13,4,TEX.stone,24,0.013,b.z1-2,-Math.PI/2));
    [[19.5,b.z1-1.8],[23,b.z1-1.8],[26.5,b.z1-1.8],[30,b.z1-1.8]].forEach(function(p){ bizTable(p[0],p[1],true,G); });
    bizSign('Restoran','#b8352f','#fff6e6',5.6,1.5,24,4.3,b.z1-3.9,0);
    decorChar(randomLook('normal'),19.5-0.9,b.z1-1.8,Math.PI/2,true); decorChar(randomLook('normal'),26.5+0.9,b.z1-1.8,-Math.PI/2,true); decorChar(randomLook('normal'),30-0.9,b.z1-1.8,Math.PI/2,true);
    var wg=makeChar({shirt:0xf4f1ea, pants:0x2b2b2b, vest:0x1b1b1b, bow:true, hair:0x2a1d16, tray:true}); wg.position.set(21,0,b.z1-0.6); b.waiter={grp:wg,pos:wg.position,items:[],t:0,moving:false,path:[],dest:null,wp:0,pts:[[21,b.z1-0.6],[25,b.z1-0.6],[28.5,b.z1-0.6],[25,b.z1-0.6]]};
  } else if(b.type==='shop'){
    building(b.x0,b.x1,b.z0,b.z1-3,2,'#d9c8e8'); G.add(plane(13,3.2,TEX.pave,-6,0.013,b.z1-1.5,-Math.PI/2));
    var win=new T.Mesh(new T.BoxGeometry(12,3.0,0.12), new T.MeshPhongMaterial({color:lin(0x9fc0d4), transparent:true, opacity:0.45, shininess:90})); win.position.set(-6,1.55,b.z1-1.4); win.userData.keep=true; G.add(win);
    G.add(box(12.4,0.35,3.2,0x5a4a6a,-6,0.17,b.z1-1.5)); G.add(box(12.4,0.25,0.25,0x5a4a6a,-6,3.15,b.z1-1.4)); [[-12,b.z1-1.4],[0,b.z1-1.4]].forEach(function(p){ G.add(box(0.25,3.1,0.25,0x5a4a6a,p[0],1.55,p[1])); });
    G.add(box(1.3,2.1,0.14,0x3a2a4a,-6,1.05,b.z1-2.96));
    bizSign('Paltar','#7b5e8a','#fff6e6',5,1.4,-6,4.3,b.z1-2.9,0);
    [[-10,b.z1-2.2,0x6aa39a],[-7.5,b.z1-2.2,0xb5546a],[-4.5,b.z1-2.2,0xd9a066],[-2,b.z1-2.2,0x4f5d75]].forEach(function(p,i){ var d=decorChar({shirt:p[2], pants:i%2?0x2b2b2b:0xf6efe2, hair:0xe9e2d6, skin:0xe9e2d6, female:i%2===1, hairStyle:i%2?'long':'bald'},p[0],p[1],0,false); d.grp.position.y=0.35; d.grp.userData.arms[0].rotation.z=0.35; d.grp.userData.arms[1].rotation.z=-0.35; d.mann=true; });
  } else if(b.type==='fun'){
    building(b.x0,b.x0+8,b.z0,b.z1-4,2,'#5b4bb5',{roof:0x4a3ba0, trim:0x7f6fe0}); G.add(plane(14,4,TEX.pave,-31,0.013,b.z1-2,-Math.PI/2)); G.add(plane(6,9,TEX.pave,-27,0.013,b.z1-8.5,-Math.PI/2));
    G.add(box(1.4,2.2,0.14,0x2a2250,-34,1.1,b.z1-3.96)); bizSign('Əyləncə','#ff5fa2','#ffffff',6,1.6,-34,4.6,b.z1-3.9,0);
    var wheel=new T.Group(); var rim=new T.Mesh(new T.TorusGeometry(3.6,0.12,8,36), M(0xffb347)); rim.castShadow=true; wheel.add(rim);
    for(var s=0;s<8;s++){ var a=s/8*Math.PI*2, sp=box(0.1,7.2,0.1,0xffb347,0,0,0); sp.rotation.z=a; wheel.add(sp); wheel.add(box(0.9,0.8,0.8,[0xe2574c,0x4cc26b,0x5aa9e6,0xf6c453][s%4],Math.cos(a)*3.6,Math.sin(a)*3.6,0)); }
    wheel.position.set(-26.5,4.2,b.z1-8.5); scene.add(wheel); bakeAll(wheel); b.wheel=wheel;
    [[-28,b.z1-9.4],[-25,b.z1-9.4],[-28,b.z1-7.6],[-25,b.z1-7.6]].forEach(function(p){ G.add(cyl(0.12,0.14,4.4,0x8a7fd0,p[0],2.2,p[1],8)); });
  }
  G.add(box(0.9,0.9,0.6,0x8b5a2b,b.stand[0],0.45,b.stand[1])); G.add(box(0.45,0.3,0.4,0x3d5466,b.stand[0]+0.15,1.05,b.stand[1]-0.05)); addObst(b.stand[0]-0.45,b.stand[0]+0.45,b.stand[1]-0.3,b.stand[1]+0.3);
  G.add(cyl(0.06,0.08,1.6,0x3d5466,b.board[0],0.8,b.board[1],8)); var gear=new T.Mesh(new T.TorusGeometry(0.22,0.08,8,8), M(0xf6c453)); gear.position.set(b.board[0],1.75,b.board[1]); gear.castShadow=true; G.add(gear); addObst(b.board[0]-0.2,b.board[0]+0.2,b.board[1]-0.2,b.board[1]+0.2);
  scene.add(G); bakeAll(G);
  if(!silent){ G.scale.set(0.01,0.01,0.01); pops.push({obj:G,t:0}); }
  b.cashEl=lbl('tile',''); addLabel(b.cashEl, new T.Vector3(b.stand[0],1.9,b.stand[1])); b.vis=[]; b.t=2; refreshCash(b);
}
function refreshCash(b){ var st=bizState(b.id); b.cashEl.innerHTML='Kassa<b>'+Math.floor(st.cash)+(st.cash>=bizCap(st)?' (dolub)':'')+'</b>'; }
function spawnVisitor(b){ var st=bizState(b.id);
  if(b.type==='carwash'){ if(b.cars.length>=2) return; var c={grp:carModel(CAR_KINDS[Math.floor(Math.random()*5)], pick(CAR_COLORS)), i:0, t:0, state:'in', wash:0}; c.grp.position.set(b.carPath[0][0],0,b.carPath[0][1]); b.cars.push(c); return; }
  if(b.vis.length>=3) return; var g=takeChar(); var sp=pick(b.spawns); g.position.set(sp[0],0,sp[1]);
  var v={grp:g,pos:g.position,t:Math.random()*5,moving:false,state:'in',timer:0,exit:b.spawns[0]===sp? b.spawns[1] : b.spawns[0], bag:null}; b.vis.push(v); }
function updateBiz(dt){
  bizTiles.forEach(function(tl){ if(tl.locked && S.level>=tl.def.lvl && (!tl.def.need || S.unlocked>=tl.def.need)){ refreshBizTile(tl); showBanner('Satışa çıxdı: '+tl.def.name, 2600); SFX.mission(); } });
  BIZ.forEach(function(b){ var st=bizState(b.id); if(!st.own || b.type==='carwash'||b.type==='pub'||b.type==='rest'||b.type==='cafe'||b.type==='hall'||b.type==='market') return;
    b.t-=dt; if(b.t<=0){ b.t=bizEvery(b,st); spawnVisitor(b); }
    if(b.type==='carwash'){ for(var i=b.cars.length-1;i>=0;i--){ var c=b.cars[i], tp=b.carPath[c.i+1];
        if(c.state==='wash'){ c.wash-=dt; b.brushes.forEach(function(m){ m.rotation.y+=dt*9; }); b.foam.visible=true; if(c.wash<=0){ c.state='in'; b.foam.visible=false; st.cash=Math.min(bizCap(st), st.cash+bizIncome(b,st)); S.st.wash=(S.st.wash||0)+1; refreshCash(b); floatText({x:-30,z:-2},'+'+bizIncome(b,st),false); } continue; }
        var e={pos:c.grp.position, grp:c.grp}; if(moveTo(e, tp[0], tp[1], c.i===1||c.i===2?3:6, dt)){ c.i++; if(c.i===2){ c.state='wash'; c.wash=4; if(player && dist(c.grp.position,player.pos)<14) SFX.wash(); } if(c.i>=b.carPath.length-1){ scene.remove(c.grp); disposeTree(c.grp); b.cars.splice(i,1); } } } }
    for(var j=b.vis.length-1;j>=0;j--){ var v=b.vis[j];
      if(v.state==='in'){ if(moveTo(v,b.front[0],b.front[1],2.8,dt)){ v.state='inside'; v.timer=5+Math.random()*4; v.grp.visible=false; } }
      else if(v.state==='inside'){ v.timer-=dt; if(v.timer<=0){ v.state='out'; v.grp.visible=true; st.cash=Math.min(bizCap(st), st.cash+bizIncome(b,st)); refreshCash(b); floatText(b.front,'+'+bizIncome(b,st),false);
          if(b.type==='shop'){ var bag=box(0.22,0.26,0.12,[0xe2574c,0xf6c453,0x4cc26b][j%3],0,-0.33,0.05); v.grp.userData.arms[1].userData.elbow.add(bag); v.grp.userData.extra=bag; } } }
      else { if(moveTo(v,v.exit[0],v.exit[1],2.8,dt)){ dropChar(v.grp); b.vis.splice(j,1); continue; } }
      bobChar(v,dt); }
    if(b.wheel) b.wheel.rotation.z+=dt*0.35;
    if(b.waiter){ var w=b.waiter, p=w.pts[w.wp]; if(moveTo(w,p[0],p[1],1.6,dt)){ w.wait=(w.wait||0)+dt; if(w.wait>1.5){ w.wait=0; w.wp=(w.wp+1)%w.pts.length; } } bobChar(w,dt); }
  });
  bizDecor.forEach(function(d){ if(d.mann) return; d.t+=dt; if(d.drink && Math.sin(d.t*0.7)>0.6) d.state='drink'; else d.state='sit'; bobChar(d,dt); });
}
function collectBiz(p,dt){ BIZ.forEach(function(b){ var st=bizState(b.id); if(!st.own || !b.stand || st.cash<1 || p.collectT>0 || dist(p.pos,{x:b.stand[0],z:b.stand[1]})>1.5) return;
  var a=Math.floor(st.cash); st.cash=0; S.money+=a; S.st.coins=(S.st.coins||0)+a; S.st.bizcash=(S.st.bizcash||0)+a; bumpMoney(); flyCoins({x:b.stand[0],z:b.stand[1]}, p.pos, Math.min(8,1+Math.floor(a/20))); floatText({x:b.stand[0],z:b.stand[1]},'+'+a,true); SFX.coin(); buzz(10); p.collectT=0.4; refreshCash(b); }); }
function bizNear(p){ for(var i=0;i<BIZ.length;i++){ var b=BIZ[i]; if(bizState(b.id).own && dist(p.pos,{x:b.board[0],z:b.board[1]})<1.5) return b; } return null; }
function renderBizPanel(b){ var st=bizState(b.id), ups=$('ups'); ups.innerHTML=''; $('panelTitle').textContent=b.name+' — gəlir '+bizIncome(b,st)+' / müştəri, hər '+bizEvery(b,st).toFixed(1).replace('.',',')+' s';
  BIZ_UPS.forEach(function(u,k){ var l=st.lv[k], max=l>=5, price=max?0:Math.round(u.base*Math.pow(l+1,1.7)/10)*10;
    var row=document.createElement('div'); row.className='up'; var d=document.createElement('div'); d.textContent=u.name+' '+l+'/5'; var sm=document.createElement('small'); sm.textContent=u.desc; d.appendChild(sm); row.appendChild(d);
    var btn=document.createElement('button'); btn.className='buy'; btn.textContent= max?'Maks':String(price); btn.disabled = max || S.money<price;
    if(!max) btn.addEventListener('click', function(){ if(S.money>=price){ S.money-=price; st.lv[k]++; S.st.bizup=(S.st.bizup||0)+1; SFX.pop(); buzz(15); bumpMoney(); save(); renderBizPanel(b); refreshCash(b); } });
    row.appendChild(btn); ups.appendChild(row); }); }
function initBiz(){ BIZ.forEach(function(b){ var st=bizState(b.id); if(st.own) buildBiz(b,true); else makeLot(b); }); }

// ---------- sound library ----------
var master=null, revIn=null, NOISE=null, ksCache={}, sndLast={};
function out(){ return master||AC.destination; }
function buildGraph(){ master=AC.createGain(); master.gain.value=(S.vol===undefined?0.8:S.vol); var comp=AC.createDynamicsCompressor(); comp.threshold.value=-14; comp.ratio.value=4; master.connect(comp); comp.connect(AC.destination);
  var conv=AC.createConvolver(), n=Math.floor(AC.sampleRate*1.6), ir=AC.createBuffer(2,n,AC.sampleRate); for(var c=0;c<2;c++){ var d=ir.getChannelData(c); for(var i=0;i<n;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/n,3); } conv.buffer=ir; revIn=AC.createGain(); revIn.gain.value=0.35; revIn.connect(conv); conv.connect(master);
  NOISE=AC.createBuffer(1,AC.sampleRate,AC.sampleRate); var nd=NOISE.getChannelData(0); for(var j=0;j<nd.length;j++) nd[j]=Math.random()*2-1; }
function now(){ return AC.currentTime+0.005; }
function vgain(peak,t,a,d,wet){ var g=AC.createGain(); g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(Math.max(0.0002,peak),t+a); g.gain.exponentialRampToValueAtTime(0.0001,t+a+d); g.connect(master); if(wet){ var s=AC.createGain(); s.gain.value=wet; g.connect(s); s.connect(revIn); } return g; }
function sine(f,t,a,d,peak,wet,type,f2){ var o=AC.createOscillator(); o.type=type||'sine'; o.frequency.setValueAtTime(f,t); if(f2) o.frequency.exponentialRampToValueAtTime(f2,t+a+d); o.connect(vgain(peak,t,a,d,wet)); o.start(t); o.stop(t+a+d+0.05); }
function ping(f,ratios,t,peak,d,wet){ ratios.forEach(function(r){ sine(f*r[0],t,0.002,d*r[2],peak*r[1],wet); }); }
function hiss(t,d,peak,type,freq,q,wet,rate){ var s=AC.createBufferSource(); s.buffer=NOISE; s.loop=true; s.playbackRate.value=rate||1; var f=AC.createBiquadFilter(); f.type=type||'bandpass'; f.frequency.value=freq||1000; f.Q.value=q||1; s.connect(f); f.connect(vgain(peak,t,0.005,d,wet)); s.start(t, Math.random()*0.5); s.stop(t+d+0.1); return f; }
function ksBuf(f,dur){ var key=Math.round(f*10)+'_'+dur; if(ksCache[key]) return ksCache[key]; var sr=AC.sampleRate, n=Math.floor(sr*dur), N=Math.max(2,Math.round(sr/f)), buf=AC.createBuffer(1,n,sr), d=buf.getChannelData(0), line=new Float32Array(N);
  for(var i=0;i<N;i++) line[i]=Math.random()*2-1; var idx=0; for(var j=0;j<n;j++){ var a=line[idx], b=line[(idx+1)%N]; d[j]=a; line[idx]=0.4985*(a+b); idx=(idx+1)%N; } ksCache[key]=buf; return buf; }
function pluck(f,t,peak,dur,wet){ var s=AC.createBufferSource(); s.buffer=ksBuf(f,dur||1.8); var g=AC.createGain(); g.gain.value=peak; var lp=AC.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=Math.min(9000,f*8); s.connect(lp); lp.connect(g); g.connect(master); if(wet){ var w=AC.createGain(); w.gain.value=wet; g.connect(w); w.connect(revIn); } s.start(t); }
var SUR=[293.66,329.63,349.23,392,440,466.16,523.25,587.33,659.25,698.46], SEG=[311.13,349.23,392,415.3,466.16,523.25,554.37,622.25];
function S_glass(){ var t=now(); ping(2950,[[1,1,1],[2.32,0.55,0.7],[4.07,0.3,0.45],[5.9,0.15,0.3]],t,0.09,0.45,0.2); hiss(t,0.02,0.05,'highpass',6000,0.7); }
function S_saucer(){ var t=now(); ping(1850,[[1,1,1],[2.6,0.5,0.6],[4.4,0.25,0.4]],t,0.08,0.25,0.15); hiss(t,0.04,0.08,'bandpass',2500,1.2); }
function S_spoon(){ var t=now(); ping(4200,[[1,1,1],[2.76,0.45,0.8],[5.4,0.25,0.5]],t,0.06,0.8,0.25); ping(4200,[[1,0.6,1]],t+0.09,0.04,0.6,0.25); }
function S_soft(){ var t=now(); ping(1400,[[1,1,1],[2.0,0.3,0.5]],t,0.07,0.18,0.1); }
function S_coins(){ var t=now(); for(var i=0;i<4;i++){ var f=3200+Math.random()*1400; ping(f,[[1,1,1],[2.42,0.4,0.6]],t+i*0.045,0.05,0.22,0.2); } hiss(t,0.12,0.04,'highpass',7000,0.8); }
function S_register(){ var t=now(); ping(2093,[[1,1,1],[2.0,0.35,0.9],[3.01,0.2,0.7]],t,0.08,1.2,0.3); hiss(t+0.12,0.18,0.08,'bandpass',700,0.8); sine(180,t+0.12,0.005,0.12,0.12,0,'sine',90); }
function S_purse(){ var t=now(); for(var i=0;i<6;i++) hiss(t+i*0.03+Math.random()*0.02,0.05,0.06,'bandpass',5000+Math.random()*3000,3); }
function S_crystal(){ var t=now(); ping(2637,[[1,1,1.4],[1.5,0.5,1.2],[2.0,0.4,1]],t,0.05,1.4,0.45); }
function S_arp(){ var t=now(); [0,2,4,7].forEach(function(k,i){ pluck(SUR[k],t+i*0.09,0.5,1.6,0.3); }); }
function S_strum(){ var t=now(); [0,2,4,7].forEach(function(k,i){ pluck(SUR[k]/2,t+i*0.025,0.45,2.2,0.3); }); }
function S_bell(){ var t=now(); ping(880,[[1,1,1.5],[2.0,0.5,1.2],[2.76,0.35,1],[5.4,0.15,0.6]],t,0.09,1.6,0.4); }
function S_drum(){ var t=now(); [0,0.18,0.3].forEach(function(dt2,i){ sine(i===2?90:130,t+dt2,0.003,0.25,0.35,0.1,'sine',55); hiss(t+dt2,0.06,0.05,'lowpass',800,0.5); }); }
function S_victory(){ var t=now(); [0,2,4,7,9].forEach(function(k,i){ pluck(SUR[k],t+i*0.08,0.5,1.8,0.3); }); ping(1760,[[1,1,1],[2,0.4,1]],t+0.42,0.05,1.2,0.4); }
function S_tambourine(){ var t=now(); for(var i=0;i<6;i++) hiss(t+i*0.11,0.09,0.09,'highpass',6500,0.8); sine(110,t,0.003,0.3,0.3,0.1,'sine',60); sine(110,t+0.44,0.003,0.3,0.3,0.1,'sine',60); }
function S_twoNote(){ var t=now(); pluck(SUR[4],t,0.5,1.4,0.3); pluck(SUR[7],t+0.12,0.5,1.6,0.3); }
function S_ding(){ var t=now(); ping(1568,[[1,1,1],[2.0,0.3,0.8]],t,0.07,0.7,0.3); ping(2093,[[1,1,1],[2.0,0.3,0.8]],t+0.12,0.07,0.9,0.3); }
function S_click(){ var t=now(); hiss(t,0.03,0.12,'bandpass',2200,2); }
function S_sigh(){ var t=now(); var f=hiss(t,0.5,0.06,'bandpass',900,6); f.frequency.setValueAtTime(900,t); f.frequency.exponentialRampToValueAtTime(400,t+0.5); sine(320,t,0.02,0.45,0.04,0.1,'triangle',190); }
function S_whistle(){ var t=now(); sine(1400,t,0.02,0.4,0.05,0.15,'sine',700); }
function S_thud(){ var t=now(); sine(120,t,0.003,0.18,0.2,0,'sine',60); hiss(t,0.1,0.06,'lowpass',500,0.7); }
function S_tile(){ var t=now(); hiss(t,0.025,0.1,'bandpass',3200,4); hiss(t+0.03,0.02,0.06,'bandpass',2600,4); }
function S_woodknock(){ var t=now(); hiss(t,0.05,0.12,'bandpass',900,5); sine(220,t,0.002,0.08,0.1); }
function S_softpop(){ var t=now(); sine(300,t,0.005,0.15,0.18,0.05,'sine',700); }
function hornPair(fs,cut,dur,peak){ var t=now(); fs.forEach(function(f){ var o=AC.createOscillator(); o.type='sawtooth'; o.frequency.value=f; var lp=AC.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=cut; o.connect(lp); lp.connect(vgain(peak,t,0.02,dur,0.1)); o.start(t); o.stop(t+dur+0.1); }); }
function S_hornCar(){ hornPair([415,523],1400,0.32,0.03); }
function S_hornDouble(){ S_hornCar(); setTimeout(S_hornCar,220); }
function S_hornBus(){ hornPair([233,294],900,0.6,0.035); }
function S_spray(){ hiss(now(),2.2,0.07,'bandpass',1800,0.5,0.1); }
function S_bubbles(){ var t=now(); for(var i=0;i<12;i++){ var f=700+Math.random()*900; sine(f,t+i*0.08+Math.random()*0.04,0.005,0.06,0.03,0.1,'sine',f*1.6); } hiss(t,1.2,0.03,'bandpass',1200,0.6); }
function S_pour(){ var t=now(); hiss(t,1.0,0.06,'lowpass',900,1,0.1); for(var i=0;i<8;i++) sine(200+Math.random()*150,t+i*0.11,0.01,0.07,0.03,0,'sine',120); }
function S_sizzle(){ var t=now(); hiss(t,0.9,0.035,'highpass',4500,0.7); for(var i=0;i<10;i++) hiss(t+Math.random()*0.8,0.015,0.05,'bandpass',3000+Math.random()*3000,3); }
var mugIdx=4;
var SND={
  clink:[['Armudu stəkan',S_glass],['Nəlbəki',S_saucer],['Qaşıq zəngi',S_spoon],['Yumşaq',S_soft],['Səssiz',null]],
  coin:[['Kassa aparatı',S_register],['Sikkələr',S_coins],['Pul kisəsi',S_purse],['Kristal',S_crystal],['Səssiz',null]],
  unlock:[['Tar arpeciosu',S_arp],['Saz akkordu',S_strum],['Zəng',S_bell],['Nağara',S_drum],['Səssiz',null]],
  level:[['Zəfər',S_victory],['Qaval',S_tambourine],['Zəng',S_bell],['Saz akkordu',S_strum],['Səssiz',null]],
  mission:[['İki not',S_twoNote],['Ding-dong',S_ding],['Zəng',S_bell],['Səssiz',null]],
  sad:[['Ah',S_sigh],['Fit',S_whistle],['Döyüntü',S_thud],['Səssiz',null]],
  clack:[['Domino daşı',S_tile],['Taxta',S_woodknock],['Səssiz',null]],
  pop:[['Yumşaq pop',S_softpop],['Klik',S_click],['Ding',S_ding],['Səssiz',null]],
  horn:[['Minik',S_hornCar],['İkiqat',S_hornDouble],['Avtobus',S_hornBus],['Səssiz',null]],
  wash:[['Su şırıltısı',S_spray],['Köpük',S_bubbles],['Səssiz',null]],
  pour:[['Pivə süzmə',S_pour],['Səssiz',null]],
  sizzle:[['Cızıltı',S_sizzle],['Səssiz',null]],
  ambient:[['Çayxana söhbəti',{every:700, tick:function(){ var t=now(); hiss(t,1.3,0.018+Math.random()*0.02,'bandpass',450+Math.random()*450,1.4,0.15); if(Math.random()<0.1) ping(2950,[[1,1,1],[2.32,0.5,0.6]],t+Math.random()*0.5,0.02,0.3,0.3); }}],
           ['Şəhər küçəsi',{every:1200, tick:function(){ var t=now(); hiss(t,1.8,0.03,'lowpass',260,0.7,0.1); if(Math.random()<0.06) hornPair([415,523],900,0.25,0.008); }}],
           ['Quşlar',{every:900, tick:function(){ if(Math.random()<0.55){ var t=now(), f=2400+Math.random()*1600; sine(f,t,0.005,0.08,0.025,0.3,'sine',f*1.35); sine(f*1.1,t+0.12,0.005,0.07,0.02,0.3,'sine',f*1.5); } }}],['Səssiz',null]],
  music:[['Muğam (tar)',{every:380, tick:function(){ var t=now(); if(Math.random()<0.75){ mugIdx=Math.max(0,Math.min(SUR.length-1,mugIdx+[-2,-1,-1,0,1,1,2][Math.floor(Math.random()*7)])); pluck(SUR[mugIdx],t,0.32,1.6,0.35); if(Math.random()<0.25) pluck(SUR[mugIdx],t+0.09,0.18,1.0,0.35); } if(Math.random()<0.08){ pluck(146.83,t,0.3,2.8,0.3); pluck(220,t+0.02,0.2,2.6,0.3); } }}],
         ['Saz havası',{every:260, tick:function(){ var t=now(), k=Math.floor(Math.random()*SEG.length); if(Math.random()<0.8) pluck(SEG[k],t,0.28,1.0,0.25); if(Math.random()<0.2) pluck(155.56,t,0.25,1.6,0.25); }}],
         ['Lounge',{every:2600, tick:function(){ var t=now(), r=Math.floor(Math.random()*4); [SUR[r],SUR[r+2],SUR[r+4]].forEach(function(f){ sine(f,t,0.6,2.2,0.022,0.4,'triangle'); sine(f*2,t,0.6,1.6,0.008,0.4); }); }}],['Səssiz',null]]
};
var SND_NAMES={clink:'Çay götürüb-qoyma', coin:'Pul', unlock:'Açılış və alış', level:'Səviyyə qalxması', mission:'Tapşırıq hazır', sad:'Əsəbi müştəri', clack:'Domino daşı', pop:'Düymə və təkmilləşdirmə', horn:'Maşın siqnalı', wash:'Moyka', pour:'Pivə süzmə', sizzle:'Manqal və qazan', ambient:'Fon səsi (davamlı)', music:'Musiqi (davamlı)'};
var SND_DEFAULT={clink:0, coin:0, unlock:0, level:0, mission:0, sad:0, clack:0, pop:0, horn:0, wash:0, pour:0, sizzle:0, ambient:0, music:3};
function sndOpt(id){ var o=SND[id], i=(S.snd2 && S.snd2[id]!==undefined)? S.snd2[id] : SND_DEFAULT[id]; return o[Math.min(i,o.length-1)]; }
function play(id){ if(S.muted || !AC || !master) return; var gap={pour:2.5, sizzle:2.5, wash:1.5, horn:1.0}[id]; if(gap){ var tnow=performance.now()/1000; if(sndLast[id] && tnow-sndLast[id]<gap) return; sndLast[id]=tnow; } var opt=sndOpt(id); if(opt && typeof opt[1]==='function'){ try{ opt[1](); }catch(e){} } }
var loops={};
function applyLoops(){ ['ambient','music'].forEach(function(id){ if(loops[id]){ clearInterval(loops[id]); loops[id]=null; } var opt=sndOpt(id); if(opt && opt[1] && opt[1].tick){ var spec=opt[1]; loops[id]=setInterval(function(){ if(AC && master && S.started && !paused && !S.muted){ try{ spec.tick(); }catch(e){} } }, spec.every); } }); }
function setVolume(v){ S.vol=Math.max(0,Math.min(1,v)); if(master) master.gain.value=S.vol; }
function renderSnd(){ var body=$('sndBody'); body.innerHTML='';
  var vr=document.createElement('div'); vr.className='up'; var vl=document.createElement('div'); vl.textContent='Ümumi səs'; vr.appendChild(vl); var sl=document.createElement('input'); sl.type='range'; sl.min=0; sl.max=100; sl.value=Math.round((S.vol===undefined?0.8:S.vol)*100); sl.setAttribute('aria-label','Ümumi səs'); sl.addEventListener('input', function(){ audio(); setVolume(sl.value/100); save(); }); vr.appendChild(sl); body.appendChild(vr);
  Object.keys(SND).forEach(function(id){ var row=document.createElement('div'); row.className='up'; var d=document.createElement('div'); d.textContent=SND_NAMES[id]; row.appendChild(d);
    var ctl=document.createElement('div'); ctl.className='sctl'; var sel=document.createElement('select'); sel.setAttribute('aria-label',SND_NAMES[id]); SND[id].forEach(function(o,i){ var op=document.createElement('option'); op.value=i; op.textContent=o[0]; sel.appendChild(op); }); sel.value=(S.snd2 && S.snd2[id]!==undefined)? S.snd2[id] : SND_DEFAULT[id];
    sel.addEventListener('change', function(){ if(!S.snd2) S.snd2={}; S.snd2[id]=+sel.value; audio(); save(); if(id==='ambient'||id==='music') applyLoops(); else preview(id,+sel.value); });
    var pb=document.createElement('button'); pb.className='buy'; pb.textContent='▶'; pb.setAttribute('aria-label','Dinlə'); pb.addEventListener('click', function(){ audio(); preview(id,+sel.value); });
    ctl.appendChild(sel); ctl.appendChild(pb); row.appendChild(ctl); body.appendChild(row); }); }
function preview(id,i){ if(!AC || !master) return; var opt=SND[id][i]; if(!opt || !opt[1]) return; try{ if(opt[1].tick){ opt[1].tick(); setTimeout(opt[1].tick, opt[1].every); setTimeout(opt[1].tick, opt[1].every*2); } else opt[1](); }catch(e){} }
$('sndBtn').addEventListener('click', function(){ $('stats').style.display='none'; renderSnd(); openModal('snd'); });
$('sndClose').addEventListener('click', function(){ closeModal('snd'); });


// ---------- dishes & drinks ----------
function plateG(r){ var p=colored(new T.CylinderGeometry(r,r*0.86,0.012,20),0xf6f2ea); p.translate(0,0.006,0); return p; }
function bitG(geo,col,x,y,z,sx,sy,sz){ if(sx) geo.scale(sx,sy,sz); geo.translate(x,y,z); return colored(geo,col); }
var DISH_GEOS = {
  plov: (function(){ var a=[plateG(0.075)], r=new T.SphereGeometry(0.056,14,8,0,Math.PI*2,0,Math.PI/2); r.scale(1,0.5,1); r.translate(0,0.012,0); a.push(colored(r,0xf0cf72));
    [[0.02,0.033,0.012],[-0.024,0.03,-0.008],[0.004,0.037,-0.024],[-0.01,0.036,0.022]].forEach(function(q){ a.push(bitG(new T.BoxGeometry(0.017,0.012,0.015),0x7a3b1e,q[0],q[1],q[2])); });
    a.push(bitG(new T.SphereGeometry(0.007,6,4),0xd9672a,0.03,0.035,-0.018)); a.push(bitG(new T.SphereGeometry(0.006,6,4),0x2a1a12,-0.028,0.034,0.016)); return mergeColored(a); })(),
  kabab: (function(){ var a=[plateG(0.082)]; [-0.022,0.022].forEach(function(z){ var sk=new T.CylinderGeometry(0.003,0.003,0.16,5); sk.rotateZ(Math.PI/2); a.push(bitG(sk,0xc8c8c8,0,0.026,z));
      for(var i=0;i<4;i++) a.push(bitG(new T.SphereGeometry(0.014,8,6),i%2?0x6b3a1e:0x8a4a24,-0.045+i*0.03,0.026,z,1.25,0.85,1)); });
    a.push(bitG(new T.SphereGeometry(0.015,8,6),0xd8382a,0.052,0.02,-0.05)); var on=new T.TorusGeometry(0.012,0.004,5,10); on.rotateX(Math.PI/2); a.push(bitG(on,0xf0e0ec,-0.05,0.014,0.052));
    a.push(bitG(new T.BoxGeometry(0.05,0.003,0.03),0x4f8a3a,0.0,0.014,0.055)); return mergeColored(a); })(),
  dolma: (function(){ var a=[plateG(0.075)]; [[0,0],[0.026,0.02],[-0.026,0.02],[0.026,-0.02],[-0.026,-0.02]].forEach(function(q){ var c=new T.CylinderGeometry(0.011,0.011,0.036,8); c.rotateZ(Math.PI/2); a.push(bitG(c,0x5c7a2e,q[0],0.022,q[1])); });
    var y=new T.SphereGeometry(0.02,8,5,0,Math.PI*2,0,Math.PI/2); y.scale(1,0.5,1); a.push(bitG(y,0xf8f4ec,0.05,0.012,0.045)); return mergeColored(a); })(),
  salat: (function(){ var a=[plateG(0.07)], b=new T.CylinderGeometry(0.055,0.035,0.035,16); b.translate(0,0.03,0); a.push(colored(b,0xf6f2ea));
    [[0,0,0x4f9a3a],[0.022,0.012,0xd8382a],[-0.02,0.015,0x6fb04a],[0.012,-0.022,0xd8382a],[-0.018,-0.018,0xf0d070],[0.028,-0.006,0x4f9a3a]].forEach(function(q){ a.push(bitG(new T.SphereGeometry(0.015,7,5),q[2],q[0],0.05,q[1],1,0.6,1)); }); return mergeColored(a); })(),
  beer: (function(){ var a=[colorLathe([[0,0,0xe2e8ea],[0.03,0,0xe2e8ea],[0.032,0.006,0xb8761a],[0.034,0.05,0xc98a1e],[0.035,0.088,0xd99a28],[0.036,0.094,0xf6f2e6],[0.037,0.113,0xfbf8f1],[0.03,0.116,0xfbf8f1],[0,0.116,0xfbf8f1]],14)];
    var h=new T.TorusGeometry(0.022,0.006,6,10,Math.PI); h.rotateZ(-Math.PI/2); a.push(bitG(h,0xe2e8ea,0.036,0.058,0)); return mergeColored(a); })(),
  meze: (function(){ var a=[plateG(0.066)]; for(var i=0;i<7;i++){ var ang=i/7*Math.PI*2; a.push(bitG(new T.SphereGeometry(0.016,7,4),0xe8b84a,Math.cos(ang)*0.03,0.016,Math.sin(ang)*0.03,1.3,0.25,1)); }
    for(var j=0;j<6;j++){ var g2=j/6*Math.PI*2+0.3; a.push(bitG(new T.SphereGeometry(0.008,6,4),0x9a6a3e,Math.cos(g2)*0.012,0.022,Math.sin(g2)*0.012)); } return mergeColored(a); })(),
  balik: (function(){ var a=[plateG(0.078)]; a.push(bitG(new T.SphereGeometry(0.05,12,8),0xb08a50,0,0.02,0,1,0.22,0.32)); var t=new T.ConeGeometry(0.018,0.03,6); t.rotateZ(Math.PI/2); a.push(bitG(t,0x9a7442,-0.062,0.02,0));
    a.push(bitG(new T.CylinderGeometry(0.016,0.016,0.006,10),0xf2d64a,0.045,0.016,0.04)); return mergeColored(a); })()
};
var ITEM_BIG={plov:1,kabab:1,dolma:1,salat:1,meze:1,balik:1};
var ITEM_ICON={plov:'🍛',kabab:'🍢',dolma:'🫑',salat:'🥗',beer:'🍺',meze:'🥨',balik:'🐟'};
var BIG_SLOTS=[[0,0],[0.15,0],[-0.15,0],[0.075,0.13],[-0.075,0.13],[0.075,-0.13],[-0.075,-0.13]];
var COUNTER_BIG=[[-0.27,-0.1],[-0.09,-0.1],[0.09,-0.1],[0.27,-0.1],[-0.27,0.1],[-0.09,0.1],[0.09,0.1],[0.27,0.1]];

// ---------- venue definitions ----------
var VDEFS={
  restoran:{ rot:0, ox:17, oz:-45, W:14, D:13, floor:'tile', wall:'#efdcb5', back:[17,31,-49,-45], sign:['Restoran','#b8352f',24,3.1,-44.94,0],
    fences:[[17,-45,17,-32,'w'],[31,-45,31,-32,'e'],[17,-32,31,-32,'s'],[31,-45,39,-45,'gn'],[39,-45,39,-32,'ge'],[31,-32,39,-32,'gs']], gaps:[{side:'s',from:22.5,to:25.5},{side:'e',from:-38.6,to:-36.6}], gate:[31,-38.6,-36.6],
    stations:[{type:'plov',u:3.5},{type:'kabab',u:6.5},{type:'dolma',u:9.5},{type:'salat',u:12}],
    tables:[[3,5.6],[7,5.6],[11,5.6],[3,9.2],[7,9.2],[11,9.2],[16.5,2.5,'z'],[19.8,2.5,'z'],[16.5,6.2,'z'],[19.8,6.2,'z'],[16.5,9.9,'z'],[19.8,9.9,'z']], taxis:'x', kassa:[12.3,11.6], pay:[12.3,10.4], board:[1.3,11.6], whome:[4.5,7.4], spawns:[[15.3,-30.8],[33,-30.8]],
    staff:{shirt:0xf4f1ea, pants:0x3a3a3a, apron:0xefe8d8, hat:'chef', must:true}, startSt:1, startTb:2, prices:{plov:8,kabab:10,dolma:9,salat:5}, first:null,
    unl:[['st',1,'Kabab manqalı',350,8],['tb',2,'Yeni masa',300,8],['wt',0,'Ofisiant',500,9],['st',2,'Dolma qazanı',700,9],['tb',3,'Yeni masa',600,10],['st',3,'Salat masası',800,10],['tb',4,'Yeni masa',900,11],['wt',1,'İkinci ofisiant',1200,12],['tb',5,'Yeni masa',1300,13],['gd',0,'Bağ yeri',1500,12],['tb',8,'Bağ masası',700,12],['tb',9,'Bağ masası',800,13],['wt',2,'Bağ ofisiantı',1200,13],['tb',10,'Bağ masası',900,14],['tb',11,'Bağ masası',1000,14]] },
  sadliq:{ rot:1, ox:17.5, oz:-7.5, W:25, D:19.5, floor:'none', wall:null, back:null, shell:buildSadliqInterior, sign:null, fences:[], gaps:[], eventOnly:true,
    stations:[{type:'plov',u:2.5},{type:'salat',u:5.0},{type:'kabab',u:7.5},{type:'dolma',u:10.0},{type:'meyve',u:12.5},{type:'pax',u:15.0}], rateMul:0.5, startWt:2,
    tables:[[9.1,5.9,'round',6],[9.1,10.7,'round',6],[13.6,5.9,'round',6],[13.6,10.7,'round',6],[18.1,5.9,'round',6],[18.1,10.7,'round',6],[22.5,5.9,'round',6],[22.5,10.7,'round',6],[9.1,15.5,'round',6],[13.6,15.5,'round',6],[18.1,15.5,'round',6],[22.5,15.5,'round',6]], taxis:'z',
    kassa:[24.4,4.0], pay:[23.6,3.9], board:[26.7,1.5], whome:[1.5,3.9], spawns:[[15.6,19.2],[33.0,19.2]],
    staff:{shirt:0xf4f1ea, pants:0x3a3a3a, apron:0xefe8d8, vest:0x7a1f2b, hat:'kepka', hatColor:0x3a3a3a, must:true}, startSt:2, startTb:4, prices:{plov:12,salat:8,kabab:14,dolma:12,meyve:10,pax:9}, first:null,
    order:function(c){ var m=(R.menu&&R.menu.length)?R.menu.slice():vMenu(c.v); c.need={}; c.got={}; c.claimed={}; var n=(m.length>1 && Math.random()<0.5)?2:1; for(var i=0;i<n;i++){ var k=m.splice(Math.floor(Math.random()*m.length),1)[0]; c.need[k]=1; } c.patience=c.maxP=90; c.state='sit'; },
    unl:[['st',2,'Kabab manqalı',1500,15],['tb',4,'Böyük masa',1500,15],['wt',2,'Üçüncü ofisiant',2000,16],['st',3,'Dolma qazanı',1800,16],['tb',5,'Böyük masa',1800,17],['st',4,'Meyvə süfrəsi',2000,17],['tb',6,'Böyük masa',2200,18],['wt',3,'Dördüncü ofisiant',2600,18],['st',5,'Şirniyyat süfrəsi',2400,19],['tb',7,'Böyük masa',2600,19],['band',0,'Musiqiçilər səhnəsi',3000,16],['tb',8,'Böyük masa',2800,16],['tb',9,'Böyük masa',3000,17],['wt',4,'Beşinci ofisiant',3000,17],['tb',10,'Böyük masa',3200,18],['tb',11,'Böyük masa',3400,18],['wt',5,'Altıncı ofisiant',3600,19]] },
  kofe:{ rot:1, ox:-15.95, oz:6.65, W:11.6, D:7.5, y0:5.5, floor:'wood', wall:null, back:null, shell:buildCafeShell, sign:['Coffee Shop','#5a3a2a',-8.36,4.25,12.4,Math.PI/2], fences:[], gaps:[],
    stations:[{type:'espresso',u:1.6},{type:'americano',u:3.2},{type:'cappuccino',u:4.8},{type:'latte',u:6.4},{type:'turk',u:8.0},{type:'iced',u:9.6}],
    tables:[[5.3,6.7,'bz',5],[9.85,6.7,'bz',3],[0.35,5.25,'bx',3]], taxis:'z', kassa:[10.9,3.95], pay:[10.05,3.95], board:[9.35,10.35], whome:[5.3,4.4], spawns:[[9.4,-7.5],[9.4,17.5]],
    staff:{shirt:0xf4f1ea, pants:0x2b2b2b, apron:0x6b4426, hat:'kepka', hatColor:0x3a2416, hair:0x2a1d16}, startSt:2, startTb:1, prices:{espresso:5,americano:5,cappuccino:7,latte:7,turk:6,iced:8}, first:'espresso',
    unl:[['st',2,'Kapuçino aparatı',600,14],['tb',1,'Pəncərə barı',500,14],['wt',0,'Ofisiant',800,15],['st',3,'Latte aparatı',900,15],['st',4,'Türk qəhvəsi (qum üstündə)',1100,16],['tb',2,'Künc barı',900,16],['st',5,'Soyuq kofe',1300,17],['wt',1,'İkinci ofisiant',1500,17]] },
  pub:{ rot:1, ox:-36, oz:8, W:12, D:12, floor:'dark', wall:'#8b5a3c', back:[-40,-36,8,20], sign:['Pub','#1f5a3c',-35.94,3.1,14,Math.PI/2],
    fences:[[-36,8,-24,8,'n'],[-36,20,-24,20,'s'],[-24,8,-24,20,'e']], gaps:[{side:'e',from:12.5,to:15.5}],
    stations:[{type:'beer',u:2.5},{type:'meze',u:5.2},{type:'balik',u:7.9},{type:'beer',u:10.2}],
    tables:[[2.6,5.2],[6.2,5.2],[9.8,5.2],[2.6,8.6],[6.2,8.6],[9.8,8.6]], taxis:'z', kassa:[1.0,11], pay:[2.2,11], board:[11,11], whome:[4.4,7], spawns:[[-22.8,3],[-22.8,25]],
    staff:{shirt:0xf4f1ea, pants:0x2b2b2b, vest:0x1f5a3c, bow:true, must:true}, startSt:1, startTb:2, prices:{beer:6,meze:4,balik:7}, first:'beer',
    unl:[['st',1,'Meze rəfi',250,5],['tb',2,'Yeni masa',250,5],['wt',0,'Ofisiant',400,6],['st',2,'Quru balıq',500,6],['tb',3,'Yeni masa',500,7],['st',3,'İkinci pivə kranı',700,8],['tb',4,'Yeni masa',800,9],['wt',1,'İkinci ofisiant',1000,10],['tb',5,'Yeni masa',1100,11]] }
};
var VEN={}, VEN_LIST=[];
function VW(d,u,v){ return d.rot ? [d.ox+v, d.oz+u] : [d.ox+u, d.oz+v]; }
function VR(d,u0,u1,v0,v1){ return d.rot ? [d.ox+v0, d.ox+v1, d.oz+u0, d.oz+u1] : [d.ox+u0, d.ox+u1, d.oz+v0, d.oz+v1]; }
function rbox(g,r,y0,h,col){ var b=box(r[1]-r[0],h,r[3]-r[2],col,(r[0]+r[1])/2,y0+h/2,(r[2]+r[3])/2); g.add(b); return b; }
var TEXV={ tile: canvasTex(128,128,function(ctx,w,h){ for(var y=0;y<4;y++) for(var x=0;x<4;x++){ ctx.fillStyle=(x+y)%2?'#efe4cf':'#b8623a'; ctx.fillRect(x*32,y*32,32,32); } ctx.strokeStyle='rgba(0,0,0,0.12)'; ctx.lineWidth=2; for(var i=0;i<=4;i++){ ctx.beginPath(); ctx.moveTo(i*32,0); ctx.lineTo(i*32,h); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0,i*32); ctx.lineTo(w,i*32); ctx.stroke(); } }, 7, 7),
  dark: canvasTex(256,256,function(ctx,w,h){ var c=['#5a3a24','#4f3320','#62402a','#4a301e']; for(var i=0;i<8;i++){ ctx.fillStyle=c[i%4]; ctx.fillRect(0,i*32,w,32); ctx.fillStyle='#3a2516'; ctx.fillRect(0,i*32,w,2); } }, 4, 4) };
function stationModel(g,type,x,z,rot){ var p=new T.Group(); p.position.set(x,hAt(x,z),z); p.rotation.y=rot; g.add(p); var fx=null; if(COFFEE_T[type]){ coffeeModel(p,type); return p; } if(g===scene && SAD_T[type] && x>17 && x<31 && z>-8 && z<18){ if(type==='meyve'){ p.add(box(1.0,0.85,0.8,0x8b5a2b,0,0.425,0)); p.add(box(1.04,0.05,0.84,0x6b4426,0,0.875,0)); sadMeyveModel(p); } else sadStationModel(p,type); return p; }
  if(type==='plov'||type==='dolma'){ p.add(box(1.0,0.5,0.9,0x4a4a4a,0,0.25,0)); var r=type==='plov'?0.42:0.3, col=type==='plov'?0x2b2b2b:0xb87333;
    var pot=lathe([[0,0.5],[r*0.7,0.5],[r,0.62],[r,0.95],[r*1.05,0.98],[0,0.98]],col,18); p.add(pot); var lid=new T.Mesh(new T.SphereGeometry(r*0.95,16,8,0,Math.PI*2,0,Math.PI/2), M(col)); lid.scale.set(1,0.35,1); lid.position.y=0.98; lid.castShadow=true; p.add(lid); p.add(sph(0.05,0x8a6a3a,0,1.12,0));
    var fire=new T.Mesh(new T.PlaneGeometry(0.7,0.12), new T.MeshBasicMaterial({color:0xff7a2a})); fire.position.set(0,0.3,0.46); fire.userData.keep=true; p.add(fire); }
  else if(type==='kabab'){ p.add(box(1.3,0.08,0.5,0x2b2b2b,0,0.85,0)); p.add(box(1.3,0.3,0.06,0x2b2b2b,0,0.72,0.22)); p.add(box(1.3,0.3,0.06,0x2b2b2b,0,0.72,-0.22)); [[-0.55,-0.2],[0.55,-0.2],[-0.55,0.2],[0.55,0.2]].forEach(function(q){ p.add(cyl(0.03,0.03,0.6,0x2b2b2b,q[0],0.3,q[1],6)); });
    var coals=new T.Mesh(new T.PlaneGeometry(1.2,0.4), new T.MeshBasicMaterial({color:0xff5a1a})); coals.rotation.x=-Math.PI/2; coals.position.y=0.9; coals.userData.keep=true; p.add(coals);
    for(var i=0;i<5;i++){ var sk=cyl(0.008,0.008,0.6,0xc8c8c8,-0.48+i*0.24,0.97,0,5); sk.rotation.x=Math.PI/2; p.add(sk); for(var j=0;j<4;j++) p.add(sph(0.035,0x7a3b1e,-0.48+i*0.24,0.97,-0.18+j*0.12)); } }
  else if(type==='salat'){ p.add(box(1.1,0.85,0.7,0xd9d4c7,0,0.425,0)); p.add(box(0.5,0.03,0.3,0x8b5a2b,-0.2,0.865,0)); [[0.3,0.1,0x4f9a3a],[0.3,-0.15,0xd8382a],[-0.35,0.2,0xf0d070]].forEach(function(q){ p.add(cyl(0.12,0.08,0.1,0xf6f2ea,q[0],0.9,q[1],12)); p.add(sph(0.08,q[2],q[0],0.95,q[1])); }); }
  else if(type==='beer'){ var keg=lathe([[0,0],[0.3,0],[0.34,0.1],[0.34,0.75],[0.3,0.85],[0,0.85]],0xa8adb2,16); p.add(keg); [0.2,0.6].forEach(function(y){ var rg=new T.Mesh(new T.TorusGeometry(0.34,0.02,6,18), M(0x6a6f74)); rg.rotation.x=Math.PI/2; rg.position.y=y; p.add(rg); }); }
  else if(type==='meze'){ p.add(box(1.1,1.4,0.35,0x6b4426,0,0.7,-0.1)); [0.45,0.85,1.25].forEach(function(y,k){ for(var i=0;i<4;i++) p.add(cyl(0.07,0.07,0.18,[0xe8b84a,0x9a6a3e,0xd8382a,0xe0d8b0][(i+k)%4],-0.39+i*0.26,y+0.1,0,10)); }); }
  else if(type==='balik'){ p.add(box(1.2,0.06,0.06,0x6b4426,0,1.6,0)); [[-0.55],[0.55]].forEach(function(q){ p.add(cyl(0.04,0.04,1.6,0x6b4426,q[0],0.8,0,6)); }); for(var i=0;i<6;i++){ var f=sph(0.09,0xb08a50,-0.45+i*0.18,1.35,0); f.scale.set(0.35,1.4,0.18); p.add(f); } }
  return p; }
function vCounter(v){ var d=v.def, g=v.grp, cv=d.counterV||2.6, r=VR(d,0.9,d.W-0.9,cv-0.45,cv+0.45);
  rbox(g,r,0,0.85,d.rot?0x4a2f1c:0xb5773c); rbox(g,VR(d,0.85,d.W-0.85,cv-0.55,cv+0.55),0.85,0.1,d.rot?0x2e1d12:0x7a4f2a);
  rbox(g,VR(d,0.8,1.0,0,cv-0.45),0,0.9,0x6b4426); rbox(g,VR(d,d.W-1.0,d.W-0.8,0,cv-0.45),0,0.9,0x6b4426);
  addObst.apply(null,r); addObst.apply(null,VR(d,0.8,1.0,0,cv)); addObst.apply(null,VR(d,d.W-1.0,d.W-0.8,0,cv)); }
function vFences(v){ var d=v.def; d.fences.forEach(function(f){ fenceSide(f[0],f[1],f[2],f[3],f[4],d.gaps);
    var horiz=f[1]===f[3], from=horiz?f[0]:f[1], to=horiz?f[2]:f[3], cuts=d.gaps.filter(function(gp){ return gp.side===f[4]; }), cur=from;
    cuts.concat([{from:to,to:to}]).forEach(function(gp){ if(gp.from>cur){ if(horiz) addObst(cur,gp.from,f[1]-0.1,f[1]+0.1); else addObst(f[0]-0.1,f[0]+0.1,cur,gp.from); } cur=Math.max(cur,gp.to); }); }); }
function makeVKassa(v,x,z){ var g=new T.Group(); g.add(box(1.4,0.8,0.8,0x8b5a2b,0,0.4,0)); g.add(box(1.5,0.08,0.9,0x6b4a2b,0,0.84,0)); g.add(box(0.45,0.32,0.42,0x3d5466,0.45,1.04,-0.1)); g.add(plane(0.9,0.45,TEX.kassa,0,0.42,0.405));
  var ms=[]; for(var i=0;i<12;i++){ var col=i%6, lvl=Math.floor(i/6), m=box(0.25,0.07,0.13,0x2e7d43,(col%3)*0.27-0.56,0.92+lvl*0.075,Math.floor(col/3)*0.17-0.085); m.userData.keep=true; m.visible=false; g.add(m); ms.push(m); }
  var hy=hAt(x,z); g.position.set(x,hy,z); scene.add(g); bakeAll(g); addObst(x-0.75,x+0.75,z-0.45,z+0.45);
  var el=lbl('tile',''); addLabel(el, new T.Vector3(x,1.7+hy,z)); return {grp:g, pos:new T.Vector3(x,0,z), ms:ms, el:el}; }
function vRefreshKassa(v){ var st=v.st, k=v.kassa, n=Math.min(12,Math.ceil(st.cash/25)); k.ms.forEach(function(m,i){ m.visible=i<n; }); k.el.innerHTML='Kassa<b>'+Math.floor(st.cash)+(st.cash>=bizCap(st)?' (dolub)':'')+'</b>'; }
function vAddCash(v,amount,from){ var st=v.st, cap=bizCap(st), add=Math.min(Math.max(0,cap-st.cash),amount); st.cash+=add; flyCoins(from, v.kassa.pos, Math.min(5,1+Math.floor(amount/10))); vRefreshKassa(v); }
function vMakeStation(v,k){ var d=v.def, sd=d.stations[k], p=VW(d,sd.u,1.2), o=VW(d,sd.u,d.counterV||2.6);
  var s={v:v, type:sd.type, pos:new T.Vector3(p[0],0,p[1]), out:{x:o[0], y:0.95+hAt(o[0],o[1]), z:o[1], slots:COUNTER_SLOTS, bslots:COUNTER_BIG}, pick:new T.Vector3(o[0],0,o[1]), items:[], timer:0, cap:(d.rateMul?8:6), rate:(d.rateMul||1)*({plov:5,kabab:6,dolma:5.5,salat:4,beer:3,meze:4,balik:5,tea:2.2,pax:4,sek:4.5,bad:4.5,meyve:4,espresso:3,americano:3.5,cappuccino:4.5,latte:4.5,turk:5,iced:4}[sd.type]||5)};
  var m=stationModel(scene,sd.type,p[0],p[1],d.rot?Math.PI/2:0); bakeAll(m);
  if(sd.type==='beer'){ var t=new T.Group(); t.add(cyl(0.05,0.05,0.4,0xc8ccd0,0,1.15,0,10)); t.add(box(0.3,0.06,0.06,0xc8ccd0,0,1.35,0)); [-0.1,0.1].forEach(function(dx){ t.add(cyl(0.02,0.02,0.18,0x1b1b1b,dx,1.48,0,6)); }); var tp=VW(d,sd.u-0.45,d.counterV||2.6); t.position.set(tp[0],0,tp[1]); t.rotation.y=d.rot?Math.PI/2:0; scene.add(t); bakeAll(t); s.extra=t; }
  s.grp=m; v.stations.push(s); return s; }
function vMakeTable(v,k){ var d=v.def, p=VW(d,d.tables[k][0],d.tables[k][1]); if(d.tables[k][2]==='round'){ var rt=makeRoundTable(p[0],p[1],d.tables[k][3],v.tables); rt.v=v; return rt; } if(d.tables[k][2]==='bz'||d.tables[k][2]==='bx'){ var bt=makeBarTable(p[0],p[1],d.tables[k][2],d.tables[k][3],v.tables); bt.v=v; return bt; } var t=makeTable(p[0],p[1],'normal',v.tables, d.tables[k][2]||d.taxis); t.v=v; return t; }
function vMakeWaiter(v,k){ var p=VW(v.def,v.def.whome[0]+k*1.5,v.def.whome[1]); var g=makeChar({shirt:0xf4f1ea, pants:0x2b2b2b, vest:v.def.rot?0x1f5a3c:0x1b1b1b, bow:true, hair:pick(HAIRS.slice(0,3)), tray:true}); g.position.set(p[0],0,p[1]);
  var w={grp:g, pos:g.position, items:[], state:'idle', job:null, home:{x:p[0],z:p[1]}, actT:0, waitT:0, t:0, moving:false, path:[], dest:null, v:v}; v.waiters.push(w); return w; }
function vApply(v,u,silent){ var obj=null; if(u[0]==='band'){ buildSadBand(silent); return; } if(u[0]==='gd'){ buildGarden(v,silent); var t1=vMakeTable(v,6), t2=vMakeTable(v,7); if(!silent){ [t1,t2].forEach(function(t){ t.grp.scale.set(0.01,0.01,0.01); pops.push({obj:t.grp,t:0}); }); } return; } if(u[0]==='st') obj=vMakeStation(v,u[1]).grp; else if(u[0]==='tb') obj=vMakeTable(v,u[1]).grp; else if(u[0]==='wt') obj=vMakeWaiter(v,u[1]).grp;
  if(obj && !silent){ obj.scale.set(0.01,0.01,0.01); pops.push({obj:obj,t:0}); } }
function vTilePos(v,u){ var d=v.def; if(u[0]==='band') return VW(d,6.4,14.0); if(u[0]==='gd') return VW(d,13.0,7.6); if(u[0]==='st') return VW(d,d.stations[u[1]].u,(d.counterV||2.6)+1.15); if(u[0]==='tb') return VW(d,d.tables[u[1]][0],d.tables[u[1]][1]); return VW(d,d.whome[0]+u[1]*1.5,d.whome[1]); }
function vShowTile(v){ var d=v.def, i=v.st.unl||0; if(i>=d.unl.length){ v.tile=null; return; } var u=d.unl[i], p=vTilePos(v,u);
  var g=new T.Group(); var base=box(1.9,0.1,1.9,0xf6c453,0,0.05,0), fill=box(1.7,0.06,1.7,0xfff0bf,0,0.11,0,false); fill.scale.x=0.001; g.add(base); g.add(fill); g.position.set(p[0],hAt(p[0],p[1]),p[1]); scene.add(g);
  var el=lbl('tile',''); var tl={def:{name:u[2], price:u[3], lvl:u[4]}, biz:true, grp:g, fill:fill, remaining:u[3], el:el, L:addLabel(el,new T.Vector3(p[0],0.9+hAt(p[0],p[1]),p[1])), locked:true, u:u};
  v.tile=tl; refreshBizTile(tl); }
function vUnlockDone(v){ var tl=v.tile; scene.remove(tl.grp); tl.L.dead=true; v.tile=null; vApply(v,tl.u,false); v.st.unl=(v.st.unl||0)+1; S.money=Math.round(S.money);
  SFX.unlock(); buzz([20,30,40]); confetti({x:tl.grp.position.x,z:tl.grp.position.z}); showBanner(v.b.name+': '+tl.def.name+' açıldı'); setTimeout(function(){ addXP(5); }, 2200); vShowTile(v); save(); }
function buildVenue(b,silent){ var d=VDEFS[b.id], st=bizState(b.id); if(st.unl===undefined) st.unl=0;
  var v={id:b.id, b:b, def:d, st:st, grp:new T.Group(), stations:[], tables:[], customers:[], waiters:[], tile:null, spawnT:3, staffT:0}; VEN[b.id]=v; VEN_LIST.push(v);
  var fr=VR(d,0,d.W,0,d.D); var fl=plane(fr[1]-fr[0],fr[3]-fr[2],TEXV[d.floor]||TEX.wood,(fr[0]+fr[1])/2,0.013,(fr[2]+fr[3])/2,-Math.PI/2); v.grp.add(fl);
  if(d.floor==='none') v.grp.remove(fl); v.grp.position.y=d.y0||0; scene.add(v.grp); if(d.back) building(d.back[0],d.back[1],d.back[2],d.back[3],2,d.wall,{upper:true}); if(d.shell) d.shell(v); if(d.sign) bizSign(d.sign[0],d.sign[1],'#fff6e6',4.6,1.4,d.sign[2],d.sign[3],d.sign[4],d.sign[5]);
  vFences(v); vCounter(v);
  for(var i=0;i<d.tables.length;i++){ if(d.tables[i][2]) continue; var tp=VW(d,d.tables[i][0],d.tables[i][1]); lightPool(tp[0],tp[1],2.0,v.grp); }
  if(d.gate){ var gt=new T.Group(); gt.add(box(0.08,0.75,2.0,0xc27a3e,d.gate[0],0.45,(d.gate[1]+d.gate[2])/2)); gt.add(box(0.08,0.08,2.0,0x8b5a2b,d.gate[0],0.85,(d.gate[1]+d.gate[2])/2)); scene.add(gt); v.gate=gt; v.gateObst=addObst(d.gate[0]-0.1,d.gate[0]+0.1,d.gate[1],d.gate[2]); }
  bakeAll(v.grp);
  var kp=VW(d,d.kassa[0],d.kassa[1]); v.kassa=makeVKassa(v,kp[0],kp[1]); var pp=VW(d,d.pay[0],d.pay[1]); v.pay={x:pp[0],z:pp[1]};
  var bp=VW(d,d.board[0],d.board[1]); b.board=bp; var bd=new T.Group(); bd.add(cyl(0.06,0.08,1.6,0x3d5466,bp[0],0.8,bp[1],8)); var gear=new T.Mesh(new T.TorusGeometry(0.22,0.08,8,8), M(0xf6c453)); gear.position.set(bp[0],1.75,bp[1]); bd.add(gear); scene.add(bd); bakeAll(bd); addObst(bp[0]-0.2,bp[0]+0.2,bp[1]-0.2,bp[1]+0.2);
  var sp=VW(d,d.stations[0].u,1.95); v.staff={grp:makeChar(d.staff), t:0, moving:false, tx:sp[0], tz:sp[1]}; v.staff.pos=v.staff.grp.position; v.staff.grp.position.set(sp[0],0,sp[1]); v.staff.grp.rotation.y=d.rot?Math.PI/2:0;
  for(var s=0;s<d.startSt;s++) vMakeStation(v,s); for(var t=0;t<d.startTb;t++) vMakeTable(v,t); for(var w0=0;w0<(d.startWt||0);w0++) vMakeWaiter(v,w0);
  for(var u=0;u<st.unl && u<d.unl.length;u++) vApply(v,d.unl[u],true);
  vShowTile(v); vRefreshKassa(v);
  if(!silent){ v.grp.scale.set(0.01,1,0.01); pops.push({obj:v.grp,t:0}); }
}
// venue customers
function vSpawn(v){ var seats=[]; v.tables.forEach(function(t){ t.seats.forEach(function(s){ if(!s.c) seats.push(s); }); }); if(!seats.length) return; var seat=pick(seats), sp=pick(v.def.spawns);
  var g=takeChar(); g.position.set(sp[0],0,sp[1]);
  var c={grp:g, pos:g.position, v:v, type:'normal', seat:seat, need:{}, got:{}, claimed:{}, pay:0, glasses:[], state:'toSeat', patience:35, maxP:35, drinkT:0, t:Math.random()*10, happy:0, angry:0, moving:false, seated:false, html:'', path:[], dest:null, exit:sp===v.def.spawns[0]?v.def.spawns[1]:v.def.spawns[0], hold:0};
  seat.c=c; c.el=lbl('bubble',''); c.el.style.display='none'; c.L=addLabel(c.el,null,function(vv){ return vv.set(c.pos.x, c.pos.y+(c.seated?1.9:2.3), c.pos.z); }); c.L.bub=true; v.customers.push(c); }
function vMenu(v){ var m=[]; v.stations.forEach(function(s){ if(m.indexOf(s.type)<0) m.push(s.type); }); return m; }
function vOrder(c){ if(c.v.def.order){ c.v.def.order(c); return; } var menu=vMenu(c.v), n=1+(Math.random()<0.5?1:0); c.need={}; c.got={}; c.claimed={};
  for(var i=0;i<n;i++){ var t = (i===0 && c.v.def.first && menu.indexOf(c.v.def.first)>=0) ? c.v.def.first : pick(menu); c.need[t]=(c.need[t]||0)+1; }
  c.patience=c.maxP=35; c.state='sit'; }
function vNeeds(c,t){ return c.state==='sit' && (c.got[t]||0)<(c.need[t]||0); }
function vDone(c){ for(var k in c.need) if((c.got[k]||0)<c.need[k]) return false; return true; }
function vGive(c,it,byWaiter){ var tp=it.type; c.got[tp]=(c.got[tp]||0)+1; if(byWaiter) c.claimed[tp]=Math.max(0,(c.claimed[tp]||0)-1); c.pay+=c.v.def.prices[tp]||5;
  if(!byWaiter){ S.st.vdish=(S.st.vdish||0)+1; if(tp==='beer') S.st.beer=(S.st.beer||0)+1; }
  var t=c.seat.t, k=c.glasses.length, sd=c.seat, rr=0.3-0.12*Math.floor(k/2), off=-0.12+0.24*(k%2); scene.add(it.mesh); if(t.round){ var rr2=k<2?0.45:0.32, of2=-0.1+0.2*(k%2); it.mesh.position.set(sd.x-sd.dx*rr2-sd.dz*of2, t.top, sd.z-sd.dz*rr2+sd.dx*of2); } else if(t.bar){ it.mesh.position.set(sd.x+sd.dx*0.55+(sd.dz?off:0), t.top, sd.z+sd.dz*0.55+(sd.dx?off:0)); } else if(t.long){ it.mesh.position.set(sd.x-0.15+0.3*(k%2), t.top, t.pos.z+sd.dz*0.3); } else it.mesh.position.set(t.pos.x+sd.dx*rr-sd.dz*off, t.top, t.pos.z+sd.dz*rr+sd.dx*off); c.glasses.push(it.mesh);
  SFX.clink(); if(vDone(c)){ c.state='drink'; c.drinkT=7; } }
function vStandUp(c){ var s=c.seat; c.glasses.forEach(function(m){ scene.remove(m); }); c.glasses=[]; c.seated=false; if(s){ s.c=null; c.pos.set(s.ax,0,s.az); } c.seat=null; c.dest=null; }
function vBubble(c){ if(c.seated && (c.state==='sit'||c.state==='drink') && !(c.happy>0) && !(c.angry>0)) return ''; if(c.happy>0) return '<span class="face">😊</span>'; if(c.angry>0) return '<span class="face">😠</span>'; if(c.state==='drink') return '<span class="face">😋</span>';
  if(c.state==='sit'){ var r=c.patience/c.maxP, s=''; for(var k in c.need){ var left=c.need[k]-(c.got[k]||0); if(left>0) s+='<span class="emo">'+ITEM_ICON[k]+'</span>'+left; } return s+'<span class="face">'+(r>0.5?'🙂':r>0.2?'😐':'😠')+'</span>'; } return ''; }
function vUpdateCustomer(c,dt){ if(c.toyRes){ updateToyGuest(c,dt); return; } var v=c.v, sp=CFG.customerSpeed; if(c.happy>0) c.happy-=dt; if(c.angry>0) c.angry-=dt;
  if(c.state==='toSeat'){ if(nav(c,c.seat.ax,c.seat.az,sp,dt)){ var s=c.seat; c.pos.set(s.x,0,s.z); c.grp.rotation.y=s.rot; c.seated=true; c.moving=false; c.path=[]; c.dest=null; vOrder(c); } }
  else if(c.state==='sit'){ if(!S.zen) c.patience-=dt/S.patienceMul; if(c.patience<=0){ vStandUp(c); c.state='out'; c.angry=1.6; S.lost++; S.st.streak=0; SFX.sad(); } }
  else if(c.state==='drink'){ c.drinkT-=dt; if(c.drinkT<=0){ vStandUp(c); c.state='toPay'; } }
  else if(c.state==='toPay'){ if(nav(c,v.pay.x,v.pay.z,sp,dt)){ var amt=Math.max(1,Math.round(c.pay*(c.toyRes?1.5:1)*(1+0.4*v.st.lv[0])*levelMul()*boostMul())); vAddCash(v,amt,c.pos); floatText(c.pos,'+'+amt,false); SFX.coin(); c.happy=0.9; c.state='out'; c.dest=null; S.served++; S.st.served=(S.st.served||0)+1; S.st.streak=(S.st.streak||0)+1; addXP(2); } }
  else { if(nav(c,c.exit[0],c.exit[1],sp,dt)){ dropChar(c.grp); c.L.dead=true; v.customers.splice(v.customers.indexOf(c),1); return; } }
  bobChar(c,dt); var html=vBubble(c); if(html!==c.html){ c.html=html; c.el.innerHTML=html; c.el.style.display=html?'flex':'none'; c.L.dirty=true; } }
// venue waiters
function vFindJob(v){ var best=null, bu=1e9, menu=vMenu(v);
  v.customers.forEach(function(c){ if(c.state!=='sit') return; var any=false; for(var k in c.need){ if(c.need[k]-(c.got[k]||0)-(c.claimed[k]||0)>0) any=true; } if(any){ var u=c.patience/c.maxP; if(u<bu){ bu=u; best=c; } } });
  if(!best) return null; var want={}, cap=4; for(var k in best.need){ var r=Math.max(0,best.need[k]-(best.got[k]||0)-(best.claimed[k]||0)), n=Math.min(r,cap); if(n>0){ want[k]=n; cap-=n; best.claimed[k]=(best.claimed[k]||0)+n; } }
  return {c:best, want:want}; }
function vSource(v,type,w){ var best=null; v.stations.forEach(function(s){ if(s.type!==type) return; if(!best || s.items.length>best.items.length) best=s; }); return best; }
function vTarget(v,w){ var types={}; w.items.forEach(function(it){ types[it.type]=1; });
  if(w.job && v.customers.indexOf(w.job.c)>=0){ for(var t in types) if(vNeeds(w.job.c,t)) return w.job.c; }
  var best=null, bu=1e9; v.customers.forEach(function(c){ if(c.state!=='sit') return; for(var t in types) if(vNeeds(c,t)){ var u=c.patience/c.maxP; if(u<bu){ bu=u; best=c; } } }); return best; }
function vUpdateWaiter(w,dt){ var v=w.v, wm=CFG.waiterMul[S.up.speed]||1, sp=CFG.workerSpeed*wm; w.anim=wm; w.actT-=dt;
  if(w.state==='idle'){ if(w.items.length){ if(vTarget(v,w)){ w.state='deliver'; w.holdT=0; } else { w.holdT=(w.holdT||0)+dt; if(w.holdT>4){ w.items.forEach(function(it){ var vs=vSource(v,it.type,w); if(vs && vs.items.length<8){ vs.items.push(it); layStack(vs.items,scene,vs.out); } else if(it.mesh.parent) it.mesh.parent.remove(it.mesh); }); w.items=[]; w.holdT=0; } else nav(w,w.home.x,w.home.z,sp,dt); } } else { w.job=vFindJob(v); if(w.job){ w.state='collect'; w.waitT=0; } else nav(w,w.home.x,w.home.z,sp,dt); } }
  else if(w.state==='collect'){ var j=w.job; if(!j || v.customers.indexOf(j.c)<0 || j.c.state!=='sit'){ w.state=w.items.length?'deliver':'idle'; if(!w.items.length) w.job=null; }
    else { var nt=null; for(var k in j.want){ if(countType(w.items,k)<j.want[k]){ nt=k; break; } }
      if(!nt) w.state='deliver'; else { if(w.cur!==nt){ w.cur=nt; w.waitT=0; } var src=vSource(v,nt,w); if(!src){ j.want[nt]=countType(w.items,nt); src=v.stations[0]; } var fz=src.pick, d=v.def, off=d.rot? [0.85,0] : [0,0.85];
        if(nav(w,fz.x+off[0],fz.z+off[1],sp,dt)){ w.grp.rotation.y=d.rot?-Math.PI/2:Math.PI; w.waitT+=dt; if(src.items.length){ if(w.actT<=0){ var it=src.items.pop(); layStack(src.items,scene,src.out); w.items.push(it); layStack(w.items,w.grp.userData.root,CARRY); w.actT=0.15; } } else if(w.waitT>6){ var have=countType(w.items,nt); j.c.claimed[nt]=Math.max(0,(j.c.claimed[nt]||0)-(j.want[nt]-have)); j.want[nt]=have; } } } } }
  else { if(!w.items.length){ w.state='idle'; w.job=null; } else { var c=vTarget(v,w); if(!c) w.state='idle'; else { if(!w.job || w.job.c!==c) w.job={c:c, want:{}}; var t=c.seat.t;
        if(nav(w,t.drop.x,t.drop.z,sp,dt) && w.actT<=0){ var tp=null; w.items.forEach(function(it){ if(!tp && vNeeds(c,it.type)) tp=it.type; }); if(tp){ var it2=takeLast(w.items,tp); layStack(w.items,w.grp.userData.root,CARRY); vGive(c,it2,true); w.actT=0.15; } } } } }
  bobChar(w,dt); }
function vUpdate(v,dt){ var st=v.st, d=v.def, spd=1+0.25*st.lv[1];
  v.stations.forEach(function(s){ if(s.items.length<s.cap){ s.timer+=dt*spd; if(s.timer>=s.rate){ s.timer=0; var it=makeItem(s.type); s.items.push(it); layStack(s.items,scene,s.out); if(player && dist(player.pos,s.pos)<8) SFX[(s.type==='beer'||COFFEE_T[s.type])?'pour':'sizzle'](); } } });
  if(!d.eventOnly){ v.spawnT-=dt; if(v.spawnT<=0){ v.spawnT=6/(1+0.35*st.lv[1]); vSpawn(v); } }
  for(var i=v.customers.length-1;i>=0;i--) vUpdateCustomer(v.customers[i],dt);
  v.waiters.forEach(function(w){ vUpdateWaiter(w,dt); }); spread(v.waiters,0.62);
  var sf=v.staff; sf.t+=dt; v.staffT-=dt; if(v.staffT<=0){ v.staffT=3+Math.random()*3; var s2=pick(v.stations); sf.tx = d.rot ? s2.pos.x+0.75 : s2.pos.x; sf.tz = d.rot ? s2.pos.z : s2.pos.z+0.75; }
  if(moveTo(sf,sf.tx,sf.tz,1.6,dt)) sf.grp.rotation.y = d.rot? -Math.PI/2 : Math.PI;
  bobChar(sf,dt); if(!sf.moving){ var A=sf.grp.userData.arms; A[1].rotation.x=-0.9+Math.sin(sf.t*5)*0.25; A[1].userData.elbow.rotation.x=-0.6; A[0].rotation.x=-0.5; A[0].userData.elbow.rotation.x=-0.8; }
  if(v.tile && v.tile.locked && S.level>=v.tile.def.lvl) refreshBizTile(v.tile); }
function vPlayer(p,dt){ VEN_LIST.forEach(function(v){
    if(p.pickT<=0 && p.items.length<CFG.padnosCap[S.up.padnos]){ for(var i=0;i<v.stations.length;i++){ var s=v.stations[i], vf=v.def.rot ? p.pos.x-s.pick.x : p.pos.z-s.pick.z, vl=v.def.rot ? Math.abs(p.pos.z-s.pick.z) : Math.abs(p.pos.x-s.pick.x); if(s.items.length && vf>0 && vf<1.9 && vl<0.75 && Math.abs(p.pos.y-(s.out.y-0.95))<1){ var it=s.items.pop(); layStack(s.items,scene,s.out); p.items.push(it); layStack(p.items,p.grp.userData.root,CARRY); p.pickT=0.1; SFX.clink(); break; } } }
    if(p.dropT<=0 && p.items.length){ outer: for(var ti=0;ti<v.tables.length;ti++){ var t=v.tables[ti]; if(dist(p.pos,t.pos)>t.reach+0.65) continue; for(var si=0;si<t.seats.length;si++){ var c=t.seats[si].c; if(!c || c.state!=='sit') continue;
          var tp=null; p.items.forEach(function(it){ if(!tp && vNeeds(c,it.type)) tp=it.type; }); if(tp){ var d2=takeLast(p.items,tp); layStack(p.items,p.grp.userData.root,CARRY); vGive(c,d2,false); p.dropT=0.12; break outer; } } } }
    if(p.collectT<=0 && v.st.cash>=1 && dist(p.pos,v.kassa.pos)<1.4){ var a=Math.floor(v.st.cash); v.st.cash=0; S.money+=a; S.st.coins=(S.st.coins||0)+a; S.st.bizcash=(S.st.bizcash||0)+a; bumpMoney(); flyCoins(v.kassa.pos,p.pos,Math.min(8,1+Math.floor(a/20))); floatText(v.kassa.pos,'+'+a,true); SFX.coin(); buzz(10); p.collectT=0.4; vRefreshKassa(v); }
    if(v.tile){ var tl=v.tile; pourInto(tl,p,dt,function(){ vUnlockDone(v); }); } }); }

// ---------- car wash ----------
var CWD={ ox:-36, x1:-24, z0:-8, z1:6, bays:[-4.6,-0.6,3.4], bayX:-30.5, kassa:[-25.5,-7.3], board:[-25.5,5.3], laneIn:-22.6, laneOut:-23.4, spawnZ:-15,
  unl:[['wk',0,'Yuyucu',300,3],['bay',1,'İkinci boks',450,4],['wk',1,'İkinci yuyucu',500,5],['foam',0,'Köpük generatoru',650,6],['bay',2,'Üçüncü boks',900,7],['wk',2,'Üçüncü yuyucu',900,8],['dry',0,'Quruducu',1200,9]] };
var CW=null;
var dotTex=canvasTex(64,64,function(ctx,w,h){ var g=ctx.createRadialGradient(32,32,2,32,32,30); g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(0.6,'rgba(255,255,255,0.8)'); g.addColorStop(1,'rgba(255,255,255,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(32,32,30,0,Math.PI*2); ctx.fill(); });
function makePoints(n,color,size,opacity){ var g=new T.BufferGeometry(), a=new Float32Array(n*3); g.setAttribute('position',new T.BufferAttribute(a,3)); var m=new T.Points(g,new T.PointsMaterial({color:color,size:size,map:dotTex,transparent:true,opacity:opacity,depthWrite:false})); m.frustumCulled=false; m.visible=false; scene.add(m); return m; }
function cwMakeBay(k){ var z=CWD.bays[k], x=CWD.bayX, g=new T.Group();
  g.add(plane(7,2.8,TEX.pave,x,0.016,z,-Math.PI/2));
  var gan=new T.Group(); [-1.35,1.35].forEach(function(dz){ gan.add(box(0.18,2.8,0.18,0x2f6fd0,0,1.4,dz)); }); gan.add(box(0.3,0.3,3.0,0x2f6fd0,0,2.8,0)); var br=[cyl(0.32,0.32,1.9,0x5aa9e6,0,1.15,-1.05,12), cyl(0.32,0.32,1.9,0x5aa9e6,0,1.15,1.05,12)]; br.forEach(function(m){ gan.add(m); });
  gan.position.set(x,0,z); scene.add(gan);
  var dr=box(0.05,0.05,0.05,0,0,0,0); g.add(dr);
  scene.add(g); bakeAll(g); addObst(x-3.2,x+3.2,z-1.45,z+1.45);
  var bay={k:k, z:z, gan:gan, brushes:br, car:null, water:makePoints(70,0x8fd0ff,0.12,0.8), foam:makePoints(150,0xffffff,0.3,1.0), ctrl:{x:x, z:z+1.95}, worker:null};
  bay.foamSeed=[]; for(var i=0;i<150;i++){ if(i%5<3) bay.foamSeed.push([(Math.random()-0.5)*3.8, 1.0+Math.random()*0.6, (Math.random()-0.5)*1.6]); else bay.foamSeed.push([(Math.random()-0.5)*4.0, 0.45+Math.random()*0.6, (i%2?1:-1)*(0.98+Math.random()*0.08)]); }
  CW.bays.push(bay); return gan; }
function cwMakeWorker(k){ var bay=CW.bays[k]; if(!bay) return null; var g=makeChar({shirt:0x2a5a9a, pants:0x2b2b2b, hat:'kepka', hatColor:0x2a5a9a, must:Math.random()<0.5}); g.position.set(bay.ctrl.x,0,bay.ctrl.z+0.3); g.rotation.y=Math.PI;
  var hose=cyl(0.03,0.03,0.5,0x1b1b1b,0,-0.3,0.18,6); hose.rotation.x=Math.PI/2; g.userData.arms[1].userData.elbow.add(hose); bay.worker={grp:g,pos:g.position,t:0,moving:false}; return g; }
function cwApply(u,silent){ var obj=null; if(u[0]==='bay') obj=cwMakeBay(u[1]); else if(u[0]==='wk') obj=cwMakeWorker(u[1]); else if(u[0]==='foam') CW.foamUp=true; else if(u[0]==='dry') CW.dryUp=true;
  if(obj && !silent){ obj.scale.set(0.01,0.01,0.01); pops.push({obj:obj,t:0}); } }
function cwTilePos(u){ if(u[0]==='bay') return [-26.6, CWD.bays[u[1]]]; if(u[0]==='wk') return [CWD.bayX, CWD.bays[u[1]]+1.95]; if(u[0]==='foam') return [-28.5,-7.0]; return [-28.5,5.2]; }
function cwShowTile(){ var i=CW.st.unl||0; if(i>=CWD.unl.length){ CW.tile=null; return; } var u=CWD.unl[i], p=cwTilePos(u);
  if(u[0]==='wk' && !CW.bays[u[1]]){ CW.tile=null; return; }
  var g=new T.Group(); var base=box(1.9,0.1,1.9,0xf6c453,0,0.05,0), fill=box(1.7,0.06,1.7,0xfff0bf,0,0.11,0,false); fill.scale.x=0.001; g.add(base); g.add(fill); g.position.set(p[0],0,p[1]); scene.add(g);
  var el=lbl('tile',''); CW.tile={def:{name:u[2], price:u[3], lvl:u[4]}, biz:true, grp:g, fill:fill, remaining:u[3], el:el, L:addLabel(el,new T.Vector3(p[0],0.9,p[1])), locked:true, u:u}; refreshBizTile(CW.tile); }
function cwUnlockDone(){ var tl=CW.tile; scene.remove(tl.grp); tl.L.dead=true; CW.tile=null; cwApply(tl.u,false); CW.st.unl=(CW.st.unl||0)+1; S.money=Math.round(S.money);
  SFX.unlock(); buzz([20,30,40]); confetti({x:tl.grp.position.x,z:tl.grp.position.z}); showBanner('Moyka: '+tl.def.name+' açıldı'); setTimeout(function(){ addXP(5); }, 2200); cwShowTile(); save(); }
function buildCarWash(b,silent){ var st=bizState(b.id); if(st.unl===undefined) st.unl=0;
  CW={b:b, st:st, bays:[], cars:[], tile:null, spawnT:2, foamUp:false, dryUp:false}; var g=new T.Group();
  g.add(plane(12,14,TEX.pave,-30,0.013,-1,-Math.PI/2));
  [[-34.2,-7.4],[-26.8,-7.4],[-34.2,5.6],[-26.8,5.6]].forEach(function(p){ g.add(cyl(0.14,0.16,3.6,0x3a4a5a,p[0],1.8,p[1],8)); }); [-34.2,-26.8].forEach(function(x){ g.add(box(0.3,0.3,13.6,0x3b6fb6,x,3.7,-1)); }); [-7.6,-2.6,1.4,5.8].forEach(function(z){ g.add(box(7.6,0.22,0.22,0x3b6fb6,-30.5,3.7,z)); }); g.add(box(8.6,0.45,0.3,0x2a5a9a,-30.5,4.0,-7.85)); g.add(box(8.6,0.45,0.3,0x2a5a9a,-30.5,4.0,5.85));
  g.add(cyl(0.9,0.9,2.2,0x5d8fd1,-35,1.1,-6.9,14)); g.add(box(0.6,0.8,0.6,0xe2574c,-35,0.4,5.3));
  fenceSide(-36,-8,-24,-8,'n',[]); fenceSide(-36,6,-24,6,'s',[]); addObst(-36,-24,-8.1,-7.9); addObst(-36,-24,5.9,6.1);
  scene.add(g); bakeAll(g);
  building(-40,-36,-8,6,1,'#cfd8e0',{roof:0x8fa0b0}); bizSign('Moyka','#2a5a9a','#ffffff',5,1.5,-35.94,2.0,-1,Math.PI/2); bizSign('Moyka','#2a5a9a','#ffffff',6,1.7,-26.55,4.75,-1,Math.PI/2); bizSign('Moyka','#2a5a9a','#ffffff',4.6,1.4,-30.5,4.6,6.0,0);
  var kp=CWD.kassa; CW.kassa=makeVKassa(CW,kp[0],kp[1]); b.board=CWD.board; var bd=new T.Group(); bd.add(cyl(0.06,0.08,1.6,0x3d5466,CWD.board[0],0.8,CWD.board[1],8)); var gear=new T.Mesh(new T.TorusGeometry(0.22,0.08,8,8), M(0xf6c453)); gear.position.set(CWD.board[0],1.75,CWD.board[1]); bd.add(gear); scene.add(bd); bakeAll(bd); addObst(CWD.board[0]-0.2,CWD.board[0]+0.2,CWD.board[1]-0.2,CWD.board[1]+0.2);
  cwMakeBay(0); for(var u=0;u<st.unl && u<CWD.unl.length;u++) cwApply(CWD.unl[u],true);
  cwShowTile(); vRefreshKassa(CW);
  if(!silent){ g.scale.set(0.01,1,0.01); pops.push({obj:g,t:0}); } }
function cwSpawn(){ var free=CW.bays.filter(function(b){ return !b.car; }); if(!free.length) return; if(CW.cars.some(function(c){ return c.state==='in' && c.i<1; })) return;
  var bay=free[0], g=takeCar(); g.position.set(CWD.laneIn,0,CWD.spawnZ);
  var c={grp:g, pos:g.position, bay:bay, i:0, state:'in', prog:0, wait:30, path:[[CWD.laneIn,bay.z],[CWD.bayX,bay.z]]}; bay.car=c; CW.cars.push(c); }
function cwPrice(){ return Math.round(30*(1+0.4*CW.st.lv[0])*(CW.foamUp?1.3:1)*levelMul()*boostMul()); }
function cwUpdate(dt){ var st=CW.st; CW.spawnT-=dt; if(CW.spawnT<=0){ CW.spawnT=7/(1+0.35*st.lv[1]); cwSpawn(); }
  for(var i=CW.cars.length-1;i>=0;i--){ var c=CW.cars[i], bay=c.bay, e={pos:c.grp.position, grp:c.grp};
    if(c.state==='in'||c.state==='out'){ var tp=c.path[c.i]; if(moveTo(e,tp[0],tp[1],c.state==='in'&&c.i===1?2.5:5,dt)){ c.i++; if(c.i>=c.path.length){ if(c.state==='in'){ c.state='wait'; c.grp.rotation.y=-Math.PI/2; } else { dropCar(c.grp); CW.cars.splice(i,1); continue; } } }
      if(c.state==='out' || c.i<2) { if(c.i===1 && c.state==='in') c.grp.rotation.y=-Math.PI/2; } }
    else if(c.state==='wait'||c.state==='wash'){ var op = bay.worker || (player && dist(player.pos,bay.ctrl)<1.4);
      if(op){ c.state='wash'; var rate=(1/7)*(1+0.35*st.lv[1])*(CW.dryUp?1.4:1); c.prog+=dt*rate; if(!c.sounded && player && dist(player.pos,{x:CWD.bayX,z:bay.z})<14){ c.sounded=true; SFX.wash(); }
        if(c.prog>=1){ var amt=cwPrice(); vAddCash(CW,amt,c.grp.position); floatText(c.grp.position,'+'+amt,true); SFX.coin(); S.st.wash=(S.st.wash||0)+1; S.served++; addXP(2); c.state='out'; c.i=0; c.path=[[CWD.laneOut,bay.z],[CWD.laneOut,CWD.spawnZ]]; bay.car=null; bay.water.visible=false; bay.foam.visible=false; c.grp.rotation.y=Math.PI/2; } }
      else { c.wait-=dt; if(c.wait<=0){ SFX.horn(); c.state='out'; c.i=0; c.path=[[CWD.laneOut,bay.z],[CWD.laneOut,CWD.spawnZ]]; bay.car=null; bay.water.visible=false; bay.foam.visible=false; S.lost++; } } } }
  var ppu=renderer.getPixelRatio()*window.innerHeight*cam.zoom/(cam.top-cam.bottom);
  CW.bays.forEach(function(bay){ var c=bay.car, washing = c && c.state==='wash', p=washing? c.prog : 0; bay.water.material.size=0.1*ppu;
    var gx = washing ? CWD.bayX + Math.sin(p*Math.PI*4)*1.6 : CWD.bayX; bay.gan.position.x += (gx-bay.gan.position.x)*Math.min(1,dt*4);
    if(washing){ bay.brushes.forEach(function(m){ m.rotation.y+=dt*10; }); }
    var water = washing && (p<0.3 || (p>0.62 && p<0.9)), foamA = washing ? (p<0.3?0 : p<0.62? Math.min(1,(p-0.3)/0.12) : Math.max(0,1-(p-0.62)/0.2)) : 0;
    bay.water.visible=water; if(water){ var a=bay.water.geometry.attributes.position.array; for(var i=0;i<70;i++){ var y=a[i*3+1]; if(!bay.wInit || y<0.55){ a[i*3]=bay.gan.position.x+(Math.random()-0.5)*0.5; a[i*3+1]=2.6+Math.random()*0.2; a[i*3+2]=bay.z+(Math.random()-0.5)*2.2; } else a[i*3+1]-=dt*(3.5+((i*7)%5)); } bay.wInit=true; bay.water.geometry.attributes.position.needsUpdate=true; }
    bay.foam.visible=foamA>0.02; if(bay.foam.visible){ var fa=bay.foam.geometry.attributes.position.array, n=Math.floor(150*foamA); for(var j=0;j<150;j++){ var s=bay.foamSeed[j]; if(j<n){ fa[j*3]=CWD.bayX+s[0]; fa[j*3+1]=s[1]+Math.sin(S.elapsed*3+j)*0.02; fa[j*3+2]=bay.z+s[2]; } else { fa[j*3+1]=-5; } } bay.foam.material.size=(0.3+0.2*foamA)*ppu; bay.foam.geometry.attributes.position.needsUpdate=true; }
    if(bay.worker){ var w=bay.worker; w.t+=dt; bobChar(w,dt); var A=w.grp.userData.arms; if(washing){ A[1].rotation.x=-1.0+Math.sin(w.t*4)*0.25; A[1].userData.elbow.rotation.x=-0.3; } } });
  if(CW.tile && CW.tile.locked && S.level>=CW.tile.def.lvl) refreshBizTile(CW.tile); }
function cwPlayer(p,dt){ if(!CW) return;
  if(p.collectT<=0 && CW.st.cash>=1 && dist(p.pos,CW.kassa.pos)<1.4){ var a=Math.floor(CW.st.cash); CW.st.cash=0; S.money+=a; S.st.coins=(S.st.coins||0)+a; S.st.bizcash=(S.st.bizcash||0)+a; bumpMoney(); flyCoins(CW.kassa.pos,p.pos,Math.min(8,1+Math.floor(a/20))); floatText(CW.kassa.pos,'+'+a,true); SFX.coin(); buzz(10); p.collectT=0.4; vRefreshKassa(CW); }
  if(CW.tile) pourInto(CW.tile,p,dt,cwUnlockDone);
  CW.bays.forEach(function(bay){ if(bay.car && !bay.worker && dist(p.pos,bay.ctrl)<1.4){ p.grp.rotation.y=Math.PI; } }); }

// ---------- realistic car bodies ----------
function shapeOf(pts){ var s=new T.Shape(); s.moveTo(pts[0][0],pts[0][1]); for(var i=1;i<pts.length;i++) s.lineTo(pts[i][0],pts[i][1]); s.closePath(); return s; }
function extrudeSide(pts,width,bevel){ var g=new T.ExtrudeGeometry(shapeOf(pts),{depth:Math.max(0.01,width-2*bevel), bevelEnabled:bevel>0, bevelThickness:bevel, bevelSize:bevel, bevelSegments:3, curveSegments:6}); g.translate(0,0,-(width-2*bevel)/2); g.rotateY(-Math.PI/2); return g; }
var CAR_SHAPES={
  sedan:{L:4.2, W:1.76, r:0.33, wx:1.35, body:[[-2.1,0.3],[2.1,0.3],[2.12,0.66],[1.95,0.84],[1.1,0.94],[-1.3,0.95],[-2.0,0.9],[-2.12,0.72]], cab:[[-1.3,0.92],[1.05,0.92],[0.55,1.36],[-0.8,1.36],[-1.2,0.98]], roof:[[-0.78,1.34],[0.53,1.34],[0.5,1.41],[-0.75,1.41]]},
  hatch:{L:3.7, W:1.7, r:0.31, wx:1.15, body:[[-1.85,0.3],[1.85,0.3],[1.87,0.66],[1.7,0.84],[0.9,0.95],[-1.8,0.98],[-1.88,0.8]], cab:[[-1.78,0.95],[0.88,0.95],[0.42,1.42],[-1.62,1.42],[-1.78,1.05]], roof:[[-1.6,1.4],[0.4,1.4],[0.38,1.47],[-1.57,1.47]]},
  suv:{L:4.6, W:1.9, r:0.4, wx:1.5, body:[[-2.3,0.42],[2.3,0.42],[2.32,0.92],[2.15,1.08],[1.3,1.16],[-2.25,1.2],[-2.32,1.0]], cab:[[-2.2,1.16],[1.25,1.14],[0.85,1.72],[-2.08,1.72],[-2.22,1.25]], roof:[[-2.06,1.7],[0.83,1.7],[0.8,1.78],[-2.03,1.78]]},
  pickup:{L:5.0, W:1.86, r:0.38, wx:1.6, body:[[-2.5,0.4],[2.5,0.4],[2.52,0.9],[2.35,1.03],[1.5,1.08],[-2.5,1.08]], cab:[[-0.4,1.06],[1.45,1.06],[1.0,1.64],[-0.34,1.64]], roof:[[-0.32,1.62],[0.98,1.62],[0.96,1.69],[-0.3,1.69]], bed:true},
  taxi:{L:4.2, W:1.76, r:0.33, wx:1.35, body:[[-2.1,0.3],[2.1,0.3],[2.12,0.66],[1.95,0.84],[1.1,0.94],[-1.3,0.95],[-2.0,0.9],[-2.12,0.72]], cab:[[-1.3,0.92],[1.05,0.92],[0.55,1.36],[-0.8,1.36],[-1.2,0.98]], roof:[[-0.78,1.34],[0.53,1.34],[0.5,1.41],[-0.75,1.41]], taxi:true},
  van:{L:5.0, W:1.95, r:0.38, wx:1.65, body:[[-2.5,0.38],[2.5,0.38],[2.52,0.95],[2.2,1.3],[1.6,2.08],[-2.45,2.12],[-2.52,1.95]], band:[[-2.2,1.38],[1.95,1.38],[1.62,1.98],[-2.2,1.98]]},
  bus:{L:9.0, W:2.4, r:0.45, wx:3.0, wx2:0, body:[[-4.5,0.42],[4.5,0.42],[4.52,2.85],[4.3,3.05],[-4.3,3.05],[-4.52,2.85]], band:[[-4.25,1.55],[4.45,1.55],[4.48,2.6],[-4.25,2.6]]}
};
function carModel(kind,color){ var D=CAR_SHAPES[kind]||CAR_SHAPES.sedan, g=new T.Group(); if(D.taxi) color=0xf6c453;
  var body=new T.Mesh(extrudeSide(D.body,D.W,0.07), M(color)); body.castShadow=true; g.add(body);
  var glass=M(0x2c3a46);
  if(D.cab){ var cab=new T.Mesh(extrudeSide(D.cab,D.W-0.16,0.05), glass); g.add(cab); var rf=new T.Mesh(extrudeSide(D.roof,D.W-0.14,0.04), M(color)); rf.castShadow=true; g.add(rf); }
  if(D.band){ var bd=new T.Mesh(extrudeSide(D.band,D.W+0.02,0.02), glass); g.add(bd); }
  if(D.bed){ [-1,1].forEach(function(s){ g.add(box(0.06,0.32,1.95,color,s*(D.W/2-0.06),1.22,-1.45)); }); g.add(box(D.W-0.1,0.32,0.06,color,0,1.22,-2.42)); g.add(box(D.W-0.14,0.03,1.95,0x2b2b2b,0,1.09,-1.45)); }
  if(D.taxi){ g.add(box(0.55,0.16,0.26,0xffffff,0,1.5,-0.1)); }
  var xs=[-D.wx, D.wx]; if(kind==='bus') xs=[-3.0,3.0];
  xs.forEach(function(zw){ [-1,1].forEach(function(s){ var w=cyl(D.r,D.r,0.24,0x1b1b1b,s*(D.W/2-0.1),D.r,zw,14); w.rotation.z=Math.PI/2; g.add(w); var h=cyl(D.r*0.55,D.r*0.55,0.02,0xc8ccd0,s*(D.W/2+0.03),D.r,zw,12); h.rotation.z=Math.PI/2; g.add(h); }); });
  g.add(box(D.W-0.1,0.16,0.12,0x2b2b2b,0,D.r*0.9+0.05,D.L/2+0.02)); g.add(box(D.W-0.1,0.16,0.12,0x2b2b2b,0,D.r*0.9+0.05,-D.L/2-0.02));
  var hy=kind==='bus'?0.95: D.body[2][1]-0.12;
  [-1,1].forEach(function(s){ var hl=new T.Mesh(new T.BoxGeometry(0.26,0.12,0.05), hlMat); hl.position.set(s*(D.W/2-0.28),hy,D.L/2+0.07); g.add(hl); var tl=new T.Mesh(new T.BoxGeometry(0.26,0.12,0.05), tlMat); tl.position.set(s*(D.W/2-0.28),hy,-D.L/2-0.07); g.add(tl);
    if(D.cab){ var mr=box(0.12,0.08,0.1,color,s*(D.W/2+0.06),D.cab[0][1]+0.1,D.cab[1][0]-0.25); g.add(mr); } });
  bakeAll(g); lightPool(0, D.L/2+2.0, 2.2, g, true); g.userData.L=D.L; scene.add(g); return g; }

// ---------- restaurant garden & string lights ----------
var twinkle=[];
function stringLights(posts,h,sag,perSeg,parent){ var groups=[[],[],[],[]], wire=[], k=0;
  for(var i=0;i<posts.length-1;i++){ var a=posts[i], b=posts[i+1];
    for(var j=0;j<=perSeg;j++){ var t=j/perSeg, x=a[0]+(b[0]-a[0])*t, z=a[1]+(b[1]-a[1])*t, y=h-sag*Math.sin(Math.PI*t); wire.push(new T.Vector3(x,y+0.06,z));
      if(j>0 && j<perSeg){ var g=new T.SphereGeometry(0.075,8,6); g.translate(x,y,z); groups[k%4].push(g); k++; } } }
  var line=new T.Line(new T.BufferGeometry().setFromPoints(wire), new T.LineBasicMaterial({color:0x2a2a2a})); parent.add(line);
  groups.forEach(function(gs,gi){ if(!gs.length) return; var mat=new T.MeshBasicMaterial({color:0x8a7f6a}); var m=new T.Mesh(mergeGeos(gs.map(function(g){ return g.toNonIndexed(); })), mat); parent.add(m); twinkle.push({mat:mat, ph:gi*1.7+Math.random(), sp:1.6+gi*0.45}); }); }
var BULB_DAY=new T.Color(0x9a8f78), BULB_NIGHT=new T.Color(0xffd98a), BULB_PEAK=new T.Color(0xfff6d8), tw=new T.Color();
function updateTwinkle(){ if(!twinkle.length) return; var n=1-daylight(), t=S.elapsed;
  twinkle.forEach(function(w){ var s=0.5+0.5*Math.sin(t*w.sp+w.ph), k=smoothstep(0.15,0.7,n); tw.copy(BULB_DAY).lerp(BULB_NIGHT,k); if(k>0.3) tw.lerp(BULB_PEAK, s*0.6*k); else tw.multiplyScalar(1); w.mat.color.copy(tw); }); }
function buildGarden(v,silent){ if(v.garden) return; var g=new T.Group(); v.garden=g;
  g.add(plane(8,13,TEX.grass,35,0.014,-38.5,-Math.PI/2)); g.add(plane(2.2,13,TEX.stone,31.9,0.016,-38.5,-Math.PI/2));
  [[38.3,-44.2],[38.3,-32.9]].forEach(function(p){ tree(p[0],p[1],g); addObst(p[0]-0.8,p[0]+0.8,p[1]-0.8,p[1]+0.8); });
  [[38.5,-40.5],[38.5,-37.2]].forEach(function(p){ bush(p[0],p[1],g); addObst(p[0]-0.45,p[0]+0.45,p[1]-0.4,p[1]+0.4); });
  [[33.0,-44.6],[35.2,-44.6],[33.0,-32.4],[35.2,-32.4],[37.0,-44.6],[37.0,-32.4]].forEach(function(p,i){ flower(p[0],p[1],[0xf4a3a3,0xf6c453,0xffffff,0xe57373,0x9575cd,0xf4a3a3][i],g); });
  var posts=[[31.6,-44.6],[38.6,-44.6],[38.6,-32.4],[31.6,-32.4],[31.6,-44.6]];
  posts.slice(0,4).forEach(function(p){ g.add(cyl(0.06,0.08,3.0,0x3a3f44,p[0],1.5,p[1],6)); });
  [[31.6,-39.6],[38.6,-39.6]].forEach(function(p){ g.add(cyl(0.06,0.08,3.0,0x3a3f44,p[0],1.5,p[1],6)); });
  scene.add(g); bakeAll(g);
  var L=new T.Group(); stringLights(posts,2.9,0.45,14,L); stringLights([[31.6,-39.6],[38.6,-39.6]],2.9,0.4,12,L); stringLights([[35.1,-44.6],[35.1,-32.4]],3.0,0.55,18,L); scene.add(L);
  [[33.5,-42.5],[36.8,-42.5],[33.5,-38.8],[36.8,-38.8],[33.5,-35.1],[36.8,-35.1]].forEach(function(p){ lightPool(p[0],p[1],2.2,scene); });
  if(v.gate){ scene.remove(v.gate); removeObst(v.gateObst); v.gate=null; }
  if(!silent){ g.scale.set(0.01,1,0.01); pops.push({obj:g,t:0}); } }
// ---------- zones: what the player is inside ----------
var ZONES=[{id:'market',name:'Supermarket',r:[17,38,27,41],tray:true},{id:'sadliq',name:'Şadlıq evi',r:[17.5,30.5,-7.5,17.5],tray:true},{id:'kofe',name:'Coffee shop',r:[-16,-8.45,6.65,18.3],tray:true},{id:'cay',name:'Çayxana',r:[-17,8.4,-24,18],tray:true},{id:'restoran',name:'Restoran',r:[17,39,-45,-32],tray:true},{id:'pub',name:'Pub',r:[-36,-24,8,20],tray:true},{id:'moyka',name:'Moyka',r:[-36,-24,-8,6]},{id:'paltar',name:'Paltar dükanı',r:[-14,2,-45,-30.8]},{id:'eylence',name:'Əyləncə mərkəzi',r:[-38,-24,-45,-30.8]}];
function zoneAt(p){ for(var i=0;i<ZONES.length;i++){ var z=ZONES[i], r=z.r; if(p.x>=r[0]-0.4 && p.x<=r[1]+0.4 && p.z>=r[2]-0.4 && p.z<=r[3]+0.4){ if(z.id==='cay' || bizState(z.id).own) return z; } } return null; }
var curZone=null;
function updateZone(){ var z=zoneAt(player.pos), tray=player.grp.userData.tray, inTray=!!(z && z.tray);
  if(tray.visible!==inTray){ tray.visible=inTray; if(!inTray && player.items.length){ player.items.forEach(function(it){ if(it.mesh.parent) it.mesh.parent.remove(it.mesh); }); player.items=[]; } }
  curZone=z; }
function zoneCount(z){ var inside=0, seats=0; if(z && z.id==='market' && MK) return {name:MK_STAGES[MK.stage].name, inside:MK.shoppers.filter(function(c){ return c.state!=='in'&&c.state!=='leave'; }).length, seats:4+MK.desks.length*3+MK.faces.filter(Boolean).length, unit:' alıcı'};
  if(!z){ tables.forEach(function(t){ seats+=t.seats.length; t.seats.forEach(function(s){ if(s.c) inside++; }); }); VEN_LIST.forEach(function(v){ v.tables.forEach(function(t){ seats+=t.seats.length; t.seats.forEach(function(s){ if(s.c) inside++; }); }); }); if(CW){ seats+=CW.bays.length; inside+=CW.bays.filter(function(b){ return b.car; }).length; } return {name:'Şəhər', inside:inside, seats:seats}; }
  if(z.id==='cay'){ tables.forEach(function(t){ seats+=t.seats.length; t.seats.forEach(function(s){ if(s.c) inside++; }); }); return {name:'Çayxana', inside:inside, seats:seats, wait:waitQ.length}; }
  if(VEN[z.id]){ var v=VEN[z.id]; v.tables.forEach(function(t){ seats+=t.seats.length; t.seats.forEach(function(s){ if(s.c) inside++; }); }); return {name:z.name, inside:inside, seats:seats}; }
  if(z.id==='moyka' && CW) return {name:'Moyka', inside:CW.bays.filter(function(b){ return b.car; }).length, seats:CW.bays.length, unit:' boks'};
  var b=BIZ.filter(function(x){ return x.id===z.id; })[0]; return {name:z.name, inside:b && b.vis ? b.vis.length : 0, seats:3}; }

// ---------- tap a purchase spot to buy it from anywhere ----------
function buySpots(){ var a=[];
  if(tile) a.push({tl:tile, name:tile.def.name, buy:function(){ tile.remaining=0; doUnlock(); }});
  VEN_LIST.forEach(function(v){ if(v.tile) a.push({tl:v.tile, name:v.b.name+': '+v.tile.def.name, buy:function(){ vUnlockDone(v); }}); });
  if(CW && CW.tile) a.push({tl:CW.tile, name:'Moyka: '+CW.tile.def.name, buy:cwUnlockDone});
  if(MK && MK.tile) a.push({tl:MK.tile, name:MK_STAGES[MK.stage].name+': '+MK.tile.def.name, buy:mkUnlockDone});
  bizTiles.forEach(function(tl){ a.push({tl:tl, name:tl.def.name+' (biznes)', buy:function(){ buyBiz(tl); }}); });
  return a; }
var spotV=new T.Vector3();
function spotAt(sx,sy,gx,gz){ var best=null, bd=1e9;
  buySpots().forEach(function(s){ var p=s.tl.grp.position, dg = gx===null ? 1e9 : Math.hypot(p.x-gx,p.z-gz);
    spotV.set(p.x,p.y+0.85,p.z).project(cam); var lx=(spotV.x+1)/2*window.innerWidth, ly=(1-spotV.y)/2*window.innerHeight, onLabel = Math.abs(sx-lx)<85 && sy>ly-58 && sy<ly+6;
    var score = onLabel ? 0 : (dg<1.3 ? dg : 1e9); if(score<bd){ bd=score; best=s; } });
  return bd<1e9 ? best : null; }
var buyCur=null;
function openBuy(s){ var tl=s.tl, price=Math.ceil(tl.remaining-0.001), lvl=tl.def.lvl||1, lockedLvl=S.level<lvl, poor=S.money<price;
  buyCur=s; $('buyTitle').textContent=s.name; var info=$('buyInfo');
  info.textContent = lockedLvl ? 'Bunun üçün səviyyə '+lvl+' lazımdır. Sənin səviyyən: '+S.level+'.' : poor ? 'Qiymət: '+price+' ₼. Balansın: '+Math.floor(S.money)+' ₼. Daha '+(price-Math.floor(S.money))+' ₼ lazımdır.' : 'Qiymət: '+price+' ₼. Alanda balansdan çıxılacaq.';
  var y=$('buyYes'); y.textContent = lockedLvl ? 'Səviyyə '+lvl : 'Al — '+price+' ₼'; y.disabled = lockedLvl || poor; openModal('buy'); }
$('buyYes').addEventListener('click', function(){ var s=buyCur; if(!s) return; var tl=s.tl, price=Math.ceil(tl.remaining-0.001);
  if(S.level<(tl.def.lvl||1) || S.money<price || tl.done) return; S.money-=price; tl.remaining=0; tl.done=true; closeModal('buy'); buyCur=null; s.buy(); bumpMoney(); save(); });
$('buyNo').addEventListener('click', function(){ buyCur=null; closeModal('buy'); });

// ---------- çayxana expansion: variety stations, longer counter, big samovar, rooftop eyvan ----------
var varSt={};
function makeVariety(type,x){ var z=CFG.backZ, g=new T.Group();
  g.add(box(0.9,0.85,0.8,0x8b5a2b,0,0.425,0)); g.add(box(0.95,0.06,0.85,0x6b4426,0,0.88,0));
  if(type==='teaL'){ g.add(cyl(0.2,0.14,0.1,0xf6f2ea,-0.15,0.96,0,14)); [[-0.2,0.02],[-0.1,-0.04],[-0.15,0.07]].forEach(function(q){ var l=sph(0.06,0xf2d64a,q[0],1.03,q[1]); l.scale.set(1,0.85,1.2); g.add(l); }); g.add(box(0.28,0.02,0.18,0xc8a070,0.2,0.92,0)); g.add(cyl(0.045,0.045,0.012,0xf2d64a,0.2,0.94,0,10)); }
  else if(type==='teaK'){ var pot=sph(0.17,0xf1ebe0,-0.1,1.06,0); pot.scale.set(1,0.85,1); g.add(pot); g.add(cyl(0.03,0.03,0.18,0xf1ebe0,0.1,1.08,0,6)); g.add(sph(0.04,0x2b4c7e,-0.1,1.21,0)); for(var i=0;i<5;i++){ var h=sph(0.05,0x5c8a3a,0.22+(i%2)*0.07,0.98+i*0.02,-0.12+i*0.06); h.scale.set(0.6,1.2,0.6); g.add(h); } }
  else { [-0.28,-0.08,0.12,0.32].forEach(function(xx,i){ g.add(cyl(0.07,0.07,0.16,0xf2ede4,xx,0.99,0,10)); g.add(cyl(0.062,0.062,0.13,[0x8a1a2a,0xd8582a,0x6a2a5a,0xb8352f][i],xx,0.99,0,10)); g.add(cyl(0.075,0.075,0.03,0xd9ab3c,xx,1.085,0,10)); }); }
  g.position.set(x,0,z); scene.add(g); bakeAll(g);
  var s={type:type, grp:g, pos:new T.Vector3(x,0,z), out:{x:x, y:0.95, z:CFG.counterZ, slots:COUNTER_SLOTS}, pick:new T.Vector3(x,0,CFG.counterZ), items:[], timer:0}; varSt[type]=s; return s; }
var eastPanel=null, eastPanelObst=null, counterExt=false;
function extendCounter(){ if(counterExt) return; counterExt=true; if(eastPanel){ scene.remove(eastPanel); removeObst(eastPanelObst); }
  var g=new T.Group(); g.add(box(4.1,0.85,0.9,0xb5773c,3.5,0.425,CFG.counterZ)); g.add(box(4.2,0.1,1.1,0x7a4f2a,3.55,0.9,CFG.counterZ)); g.add(plane(3.9,0.56,TEX.kilim,3.5,0.46,CFG.counterZ+0.455));
  g.add(box(0.2,0.9,3.3,0x9c6b3c,5.6,0.45,-5.95)); g.add(plane(4.0,2.8,TEX.woodSmall,3.6,0.013,-6.2,-Math.PI/2));
  scene.add(g); bakeAll(g); addObst(1.4,5.6,-4.85,-3.95); addObst(5.5,5.7,-7.6,-3.95); addObst(5.7,6.35,-7.6,-3.95); }
var roofOpen=false, cayBld=null, ROOF_Y=5.5, ROOF_TABLES=[[-6.0,-10.25],[-2.4,-10.25],[1.2,-10.25],[4.8,-10.25]];
function hAt(x,z){ var ch=cafeH(x,z); if(ch>=0) return ch; if(!roofOpen) return 0; var sh=skyH(x,z); if(sh>=0) return sh;
  if(hallOpen){ if(x>-8.35&&x<-5.75&&z>-9.0&&z<-7.8) return ROOF_Y+HALL_DY*Math.max(0,Math.min(1,(-5.75-x)/2.6)); if(x>-15.95&&x<=-8.35&&z>-12.95&&z<-3.55) return ROOF_Y+HALL_DY; } if(x>-8.35&&x<8.35&&z>-12.95&&z<-7.62) return ROOF_Y; if(x>6.5&&x<7.9&&z>=-7.62&&z<-3.2) return ROOF_Y*Math.max(0,Math.min(1,(-3.2-z)/4.42)); return 0; }
function buildRoof(silent){ if(roofOpen) return; roofOpen=true; if(cayBld && cayBld.userData.obst) removeObst(cayBld.userData.obst);
  eyvanNorthObst=addObst(-8.5,8.5,-13.1,-12.9); addObst(-8.5,-8.3,-13,-9.0); addObst(-8.5,-8.3,-7.8,-7.6); eyvanGateObst=addObst(-8.5,-8.3,-9.0,-7.8); addObst(8.3,8.5,-13,-7.6); addObst(-8.4,6.55,-7.75,-7.55); addObst(7.85,8.4,-7.75,-7.55); addObst(6.35,6.55,-7.6,-3.2);
  var g=new T.Group(); g.add(plane(16.6,5.3,TEX.wood,0,ROOF_Y+0.03,-10.3,-Math.PI/2));
  var rg=new T.Group(); rg.position.y=ROOF_Y; fenceSide(-8.3,-12.9,8.3,-12.9,'n',[],rg); fenceSide(-8.3,-12.9,-8.3,-7.65,'w',[{side:'w',from:-9.0,to:-7.8}],rg); if(!hallOpen){ eyvanGate=box(0.08,0.75,1.2,0xc27a3e,-8.3,ROOF_Y+0.45,-8.4); scene.add(eyvanGate); } else { removeObst(eyvanGateObst); } fenceSide(8.3,-12.9,8.3,-7.65,'e',[],rg); fenceSide(-8.3,-7.65,8.3,-7.65,'f',[{side:'f',from:6.55,to:7.85}],rg); g.add(rg);
  for(var i=0;i<16;i++){ var y=(i+1)*ROOF_Y/16; g.add(box(1.25,0.12,0.32,0x8b5a2b,7.2,y-0.06,-3.35-i*(4.27/16))); g.add(box(1.25,y-0.12,0.06,0x6b4426,7.2,(y-0.12)/2,-3.2-i*(4.27/16))); }
  [-3.3,-5.4,-7.4].forEach(function(z){ var y=hAt(7.2,z); g.add(cyl(0.05,0.05,1.0,0x5a3a1e,6.55,y+0.5,z,6)); });
  var rl=box(0.08,0.08,5.6,0x5a3a1e,6.55,ROOF_Y/2+1.0,-5.42); rl.rotation.x=Math.atan2(ROOF_Y,4.42); g.add(rl);
  [[-8.1,-12.7],[8.1,-12.7],[-8.1,-7.85],[8.1,-7.85]].forEach(function(p){ g.add(cyl(0.05,0.07,2.7,0x3a3f44,p[0],ROOF_Y+1.35,p[1],6)); });
  scene.add(g); bakeAll(g);
  var L=new T.Group(); stringLights([[-8.1,-12.7],[8.1,-12.7],[8.1,-7.85],[-8.1,-7.85],[-8.1,-12.7]],ROOF_Y+2.6,0.4,20,L); scene.add(L);
  ROOF_TABLES.forEach(function(p){ var pl=lightPool(p[0],p[1],2.0,scene); pl.position.y=ROOF_Y+0.05; });
  if(!silent){ camPan={pos:new T.Vector3(0,0,-8), until:S.session+2.2}; } }

// ---------- object pools: build people and cars ahead of time, reuse them ----------
var charPool=[], carPool=[], poolTick=0;
function poolChar(){ var g=makeChar(randomLook('normal')); g.visible=false; g.userData.pooled=true; charPool.push(g); }
function takeChar(){ var g=charPool.length ? charPool.splice(Math.floor(Math.random()*charPool.length),1)[0] : null; if(!g){ g=makeChar(randomLook('normal')); g.userData.pooled=true; }
  g.visible=true; g.rotation.set(0,0,0); g.position.set(0,0,0); g.scale.set(1,1,1); g.userData.root.position.y=0; return g; }
function dropChar(g){ if(!g.userData.pooled){ scene.remove(g); disposeTree(g); return; } if(g.userData.extra){ if(g.userData.extra.parent) g.userData.extra.parent.remove(g.userData.extra); g.userData.extra=null; } g.visible=false; charPool.push(g); }
function takeCar(){ var g=carPool.length? carPool.pop() : carModel(CAR_KINDS[Math.floor(Math.random()*5)], pick(CAR_COLORS)); g.visible=true; return g; }
function dropCar(g){ g.visible=false; carPool.push(g); }
function poolWarm(){ poolTick++; var want = S.started ? 6 : 26; if(charPool.length<want && (!S.started || poolTick%20===0)) poolChar(); if(carPool.length<2 && CW && poolTick%40===0){ var c=carModel(CAR_KINDS[Math.floor(Math.random()*5)], pick(CAR_COLORS)); c.visible=false; carPool.push(c); } }

// ---------- music band that grows with the player's level ----------
var BAND_TIERS=[{lvl:10,id:'singer',name:'Xanəndə qavalla'},{lvl:12,id:'kaman',name:'Kamança ifaçısı'},{lvl:14,id:'stage',name:'Səhnə'},{lvl:16,id:'drum',name:'Nağaraçı'},{lvl:18,id:'lights',name:'Səhnə işıqları'},{lvl:20,id:'balaban',name:'Balabançı'}];
var band={tier:0, members:[], stage:false, y:0, lights:[], obst:[]};
var BAND_ROT=-Math.PI/2;
var BAND_POS={singer:[4.2,12.6], tar:[5.5,11.3], kaman:[5.5,13.9], drum:[6.7,12.0], balaban:[6.7,13.3]}, MIC=[3.72,12.6];
function makeStool(x,z){ var st=new T.Group(); st.add(box(0.45,0.06,0.45,0x8b5a2b,0,0.43,0)); [[-0.17,-0.17],[0.17,-0.17],[-0.17,0.17],[0.17,0.17]].forEach(function(q2){ st.add(cyl(0.03,0.03,0.42,0x5a3a1e,q2[0],0.21,q2[1],6)); }); st.position.set(x,band.y,z); scene.add(st); bakeAll(st); return st; }
function makeMic(){ var g=new T.Group(); g.add(cyl(0.18,0.2,0.03,0x2b2b2b,0,0.015,0,14)); g.add(cyl(0.015,0.015,1.45,0x8a8f94,0,0.74,0,6)); var arm=cyl(0.012,0.012,0.3,0x8a8f94,0.08,1.5,0,6); arm.rotation.z=1.0; g.add(arm); g.add(sph(0.045,0x1b1b1b,0.2,1.58,0)); g.position.set(MIC[0],band.y,MIC[1]); scene.add(g); bakeAll(g); return g; }
function bandLook(kind){ var looks={singer:{shirt:0x7a2a24, pants:0x2b2b2b, vest:0x1b1b1b, hat:'papaq', hatColor:0x1a1a1a, must:true}, kaman:{shirt:0x2e3440, pants:0x2b2b2b, vest:0x5b4a3a, hat:'papaq', hatColor:0x3a3a3a, must:true, mustColor:0xbdbab4}, drum:{shirt:0xd9d4c7, pants:0x2b2b2b, vest:0x8d2f3b, hair:0x2a1d16, must:true}, balaban:{shirt:0x4f5d75, pants:0x2b2b2b, vest:0x1b1b1b, hat:'kepka', hatColor:0x2b2b2b, must:true}}; return looks[kind]; }
function addMember(kind,silent){ var p=BAND_POS[kind], g=makeChar(bandLook(kind)); g.position.set(p[0],band.y,p[1]); g.rotation.y=BAND_ROT; var A=g.userData.arms, root=g.userData.root, m={grp:g, kind:kind, t:Math.random()*3};
  if(kind==='singer'){ var q=new T.Group(); var rim=new T.Mesh(new T.TorusGeometry(0.17,0.025,6,18), M(0x8b5a2b)); q.add(rim); var skin=new T.Mesh(new T.CircleGeometry(0.16,18), new T.MeshLambertMaterial({color:lin(0xe8d9b0), side:T.DoubleSide})); q.add(skin); for(var i=0;i<6;i++){ var a=i/6*Math.PI*2; q.add(cyl(0.03,0.03,0.012,0xd9ab3c,Math.cos(a)*0.17,Math.sin(a)*0.17,0,8)); } q.position.set(0,-0.36,0.06); A[0].userData.elbow.add(q); }
  if(kind!=='singer'){ m.seated=true; m.extra=makeStool(p[0],p[1]); } else { m.mic=makeMic(); }
  if(kind==='kaman'){
    var k=new T.Group(); var body=sph(0.13,0x6b3a1e,0,0,0); body.scale.set(1,1.1,0.8); k.add(body); k.add(cyl(0.02,0.025,0.55,0x3a2416,0,0.38,0,6)); k.add(cyl(0.008,0.008,0.25,0xc8c8c8,0,-0.24,0,4)); k.position.set(0,0.62,0.32); root.add(k); m.inst=k;
    var bow=cyl(0.006,0.006,0.6,0x8b5a2b,0,-0.3,0.12,4); bow.rotation.z=Math.PI/2; A[1].userData.elbow.add(bow); }
  else if(kind==='drum'){ var d=new T.Group(); var dr=cyl(0.2,0.2,0.32,0x8d2f3b,0,0,0,18); dr.rotation.x=Math.PI/2; d.add(dr); [-0.165,0.165].forEach(function(z){ var c=cyl(0.205,0.205,0.02,0xe8d9b0,0,0,z,18); c.rotation.x=Math.PI/2; d.add(c); }); d.position.set(0,1.05,0.32); d.rotation.y=Math.PI/2; root.add(d); }
  else if(kind==='balaban'){ var pipe=cyl(0.022,0.03,0.32,0x3a2416,0,-0.02,0.24,8); pipe.rotation.x=Math.PI/2.4; g.userData.head.add(pipe); }
  band.members.push(m); if(!band.stage) band.obst.push(addObst(p[0]-0.45,p[0]+0.45,p[1]-0.45,p[1]+0.45));
  if(!silent){ g.scale.set(0.01,0.01,0.01); pops.push({obj:g,t:0}); } return m; }
function buildStage(silent){ band.stage=true; band.y=0.32; band.obst.forEach(removeObst); band.obst=[]; if(musician && musician.obst) { removeObst(musician.obst); musician.obst=null; }
  var g=new T.Group(); g.add(box(4.2,0.3,3.9,0x6b4426,5.5,0.15,12.55)); g.add(plane(3.8,3.4,TEX.carpet,5.5,0.31,12.6,-Math.PI/2));
  for(var i=0;i<3;i++) g.add(box(0.9,0.1,0.35,0x8b5a2b,3.2,0.05+i*0.1,12.55));
  scene.add(g); bakeAll(g); band.stageGrp=g; band.obst.push(addObst(3.4,7.6,10.55,14.5));
  if(musician){ musician.grp.position.y=band.y; if(musician.stool) musician.stool.position.y=band.y; }
  band.members.forEach(function(m){ m.grp.position.y=band.y; if(m.extra) m.extra.position.y=band.y; });
  if(!silent){ g.scale.set(0.01,1,0.01); pops.push({obj:g,t:0}); } }
function buildBandLights(){ var L=new T.Group(); stringLights([[3.5,10.6],[3.5,14.4],[7.5,14.4],[7.5,10.6]],3.2,0.35,10,L); scene.add(L);
  [[3.6,14.3],[7.4,14.3]].forEach(function(p){ var g=new T.Group(); g.add(cyl(0.05,0.07,3.2,0x2b2b2b,p[0],1.6,p[1],6)); var hd=new T.Mesh(new T.CylinderGeometry(0.12,0.2,0.3,10), new T.MeshBasicMaterial({color:0xfff2c0})); hd.position.set(p[0],3.2,p[1]); g.add(hd); scene.add(g); });
  ['#ff6fb0','#ffd27a','#7fd0ff'].forEach(function(c,i){ var m=new T.Mesh(new T.PlaneGeometry(2.2,2.2), new T.MeshBasicMaterial({map:glowTex, color:new T.Color(c), transparent:true, opacity:0.5, depthWrite:false, blending:T.AdditiveBlending})); m.rotation.x=-Math.PI/2; m.position.set(4.6+i*0.9,band.y+0.04,12.0+(i%2)*1.2); scene.add(m); band.lights.push(m); }); }
function applyTier(t,silent){ var tr=BAND_TIERS[t]; if(tr.id==='stage') buildStage(silent); else if(tr.id==='lights') buildBandLights(); else addMember(tr.id,silent); if(!silent){ showBanner('Musiqi qrupu böyüdü: '+tr.name, 2800); SFX.level(); } }
var bandT=0;
function updateBand(dt){ if(!musician) return; bandT-=dt; if(bandT<=0){ bandT=1; var want=BAND_TIERS.filter(function(t){ return S.level>=t.lvl; }).length; while(band.tier<want){ applyTier(band.tier, bandT<0? true : band.loading); band.tier++; } S.patienceMul=1.5+0.1*band.tier; }
  band.members.forEach(function(m){ if(m.mic) m.mic.position.y=band.y; });
  band.members.forEach(function(m){ m.t+=dt; var g=m.grp, A=g.userData.arms, root=g.userData.root, k=m.t;
    if(m.seated){ root.position.y=-0.4; g.userData.legs.forEach(function(h){ h.rotation.x=-Math.PI/2; h.userData.knee.rotation.x=Math.PI/2; }); }
    if(m.kind==='singer'){ A[0].rotation.x=-2.3+Math.sin(k*3)*0.08; A[0].userData.elbow.rotation.x=-0.5; A[1].rotation.x=-1.0+Math.sin(k*8)*0.25; A[1].userData.elbow.rotation.x=-1.0; g.userData.head.rotation.x=0.05+Math.sin(k*1.5)*0.08; g.userData.head.rotation.z=Math.sin(k*1.1)*0.06; }
    else if(m.kind==='kaman'){ A[0].rotation.x=-0.9; A[0].userData.elbow.rotation.x=-1.1; A[1].rotation.x=-0.75; A[1].userData.elbow.rotation.x=-1.0+Math.sin(k*5)*0.35; }
    else if(m.kind==='drum'){ A[0].rotation.x=-0.6+Math.max(0,Math.sin(k*9))*0.35; A[0].userData.elbow.rotation.x=-1.3; A[1].rotation.x=-0.6+Math.max(0,Math.sin(k*9+Math.PI))*0.35; A[1].userData.elbow.rotation.x=-1.3; root.position.y=Math.abs(Math.sin(k*4.5))*0.02; }
    else if(m.kind==='balaban'){ A[0].rotation.x=-1.25; A[0].userData.elbow.rotation.x=-1.45+Math.sin(k*6)*0.06; A[1].rotation.x=-1.15; A[1].userData.elbow.rotation.x=-1.5+Math.sin(k*6+1)*0.06; g.rotation.y=BAND_ROT+Math.sin(k*0.9)*0.12; } });
  if(band.lights.length){ var tt=S.elapsed; band.lights.forEach(function(m,i){ m.material.opacity=0.25+0.3*(0.5+0.5*Math.sin(tt*(1.3+i*0.4)+i*2)); }); } }

var sweetSt={}, kioskBuilt=false, KIOSK={x:-11.5, z0:-2.8, z1:4.8, wx:-10.35};
var COUNTER_SLOTS_Z=COUNTER_SLOTS.map(function(q){ return [q[1],q[0]]; });
function buildKiosk(){ if(kioskBuilt) return; kioskBuilt=true; var g=new T.Group(), k=KIOSK, L=k.z1-k.z0, cz=(k.z0+k.z1)/2;
  g.add(box(0.8,0.85,L,0xb5773c,k.x,0.425,cz)); g.add(box(1.0,0.1,L+0.2,0x7a4f2a,k.x,0.9,cz)); var kl=plane(L-0.4,0.56,TEX.kilim,k.x+0.405,0.46,cz); kl.rotation.y=Math.PI/2; g.add(kl);
  g.add(box(1.6,0.9,0.2,0x9c6b3c,k.x-0.4,0.45,k.z0-0.1)); g.add(box(1.6,0.9,0.2,0x9c6b3c,k.x-0.4,0.45,k.z1+0.1));
  g.add(cyl(0.05,0.06,2.6,0x5a3a1e,k.x+0.35,1.3,k.z0+0.1,6)); g.add(cyl(0.05,0.06,2.6,0x5a3a1e,k.x+0.35,1.3,k.z1-0.1,6));
  var aw=new T.Mesh(new T.BoxGeometry(1.8,0.12,L+0.4), new T.MeshLambertMaterial({map:texFrom(makeCanvas(64,64,function(ctx,cw,ch){ for(var i=0;i<4;i++){ ctx.fillStyle=i%2?'#2a7a5a':'#f6efe2'; ctx.fillRect(0,i*16,cw,16); } }),1,5)})); aw.position.set(k.x-0.3,2.6,cz); aw.rotation.z=0.15; aw.castShadow=true; g.add(aw);
  g.add(plane(5,10.1,TEX.stone,-10.5,0.011,1.55,-Math.PI/2));
  scene.add(g); bakeAll(g); bizSign('Şirniyyat','#2a7a5a','#fff6e6',3.2,0.9,k.x+0.62,2.95,cz,Math.PI/2);
  addObst(k.x-1.5,k.x+0.4,k.z0-0.2,k.z1+0.2); }
var SWEET_Z={sek:-1.5, bad:1.0, qog:3.5};
function makeSweet(type){ buildKiosk(); var z=SWEET_Z[type], x=KIOSK.x-1.0, g=new T.Group();
  g.add(box(0.6,0.75,0.95,0xd9d4c7,0,0.375,0)); var glass=new T.Mesh(new T.BoxGeometry(0.55,0.4,0.9), new T.MeshPhongMaterial({color:lin(0xcfe3ec), transparent:true, opacity:0.35, shininess:90})); glass.position.y=0.95; glass.userData.keep=true; g.add(glass);
  var col={sek:0xe8c27a, bad:0xd9a95a, qog:0xc98a3a}[type]; for(var i=0;i<6;i++){ g.add(box(0.09,0.05,0.12,col,-0.12+Math.floor(i/3)*0.24,0.8,-0.3+(i%3)*0.3)); }
  g.position.set(x,0,z); scene.add(g); bakeAll(g);
  var s={type:type, grp:g, axis:'x', side:1, wx:KIOSK.wx, pos:new T.Vector3(x,0,z), out:{x:KIOSK.x, y:0.95, z:z, slots:COUNTER_SLOTS_Z}, pick:new T.Vector3(KIOSK.x,0,z), items:[], timer:0}; sweetSt[type]=s; return s; }
// extra tea makers behind the counter
var ustas=[];
function makeUsta(x,old){ var look = old ? {shirt:0xf4f1ea, pants:0x3a3a3a, apron:0xefe8d8, vest:0x4a3b30, hat:'papaq', hatColor:0x8f8b86, must:true, mustColor:0xeceae4, hair:0xd9d6cf, skin:0xd9a882, old:true}
    : {shirt:0xf4f1ea, pants:0x2b2b2b, apron:0xefe8d8, hat:'kepka', hatColor:pick([0x4a4a4a,0x5b4a3a]), must:true, hair:0x2a1d16};
  var ug=makeChar(look); ug.position.set(x,0,USTA_Z); ug.rotation.y=0; var hold=new T.Mesh(glassGeo, ITEM_MAT); hold.visible=false; hold.position.set(0,-0.31,0.03); ug.userData.arms[1].userData.elbow.add(hold);
  var u={grp:ug, pos:ug.position, t:Math.random()*3, moving:false, state:'idle', target:null, ph:0, hold:hold, anim:old?0.8:1.1, speed:old?2.4:3.2, lane:x}; ustas.push(u); zoneT=0; return u; }

function returnItems(items){ items.forEach(function(it){ var src=sourceFor(it.type,{pos:{x:0}}); if(src && src.items.length<(src.cap||8)){ src.items.push(it); layStack(src.items,scene,src.out); } else if(it.mesh.parent) it.mesh.parent.remove(it.mesh); }); }
// ---------- wedding guests: they get their own decorated table(s), marked so you can see where they go ----------
function pickToySeats(n){ if(hallOpen){ return hallSeats().filter(function(s){ return !s.c; }).slice(0,n); } var free=tables.filter(function(t){ return !t.nerd && !t.hall && t.seats.every(function(s){ return !s.c; }); });
  var four=free.filter(function(t){ return t.seats.length>=4; }); if(four.length){ var t4=pick(four); return t4.seats.slice(0,n); }
  var out=[]; free.sort(function(a,b){ return a.pos.z-b.pos.z || a.pos.x-b.pos.x; });
  for(var i=0;i<free.length && out.length<n;i++){ free[i].seats.forEach(function(s){ if(out.length<n) out.push(s); }); }
  if(out.length<n){ freeSeats().forEach(function(s){ if(out.length<n && out.indexOf(s)<0 && !s.t.nerd) out.push(s); }); }
  return out; }
function markToy(t){ if(t.toyMark) return; var g=new T.Group(), sq=t.seats.length>=4, w=sq?1.1:0.95, d=sq?1.1:0.86, y=t.top+0.006;
  var cloth=new T.Mesh(new T.PlaneGeometry(w,d), new T.MeshLambertMaterial({color:lin(0xfdfaf4)})); cloth.rotation.x=-Math.PI/2; cloth.position.set(t.pos.x,y,t.pos.z); g.add(cloth);
  g.add(cyl(0.05,0.04,0.14,0xd8e8f0,t.pos.x,y+0.07,t.pos.z,10)); [[0,0.19,0,0xd94f7a],[0.04,0.17,0.03,0xffffff],[-0.04,0.17,-0.02,0xffffff],[0.02,0.18,-0.04,0xe2574c]].forEach(function(f){ g.add(sph(0.035,f[3],t.pos.x+f[0],y+f[1],t.pos.z+f[2])); });
  var ox=sq?0.6:0.5, oz=sq?0.6:0.45;
  [[ox,oz,0xd94f7a],[-ox,-oz,0xffffff]].forEach(function(b){ var bx=t.pos.x+b[0], bz=t.pos.z+b[1]; var ln=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(bx,y,bz), new T.Vector3(bx,y+1.15,bz)]), new T.LineBasicMaterial({color:0x888888})); g.add(ln); var bl=sph(0.13,b[2],bx,y+1.25,bz); bl.scale.set(1,1.2,1); g.add(bl); });
  scene.add(g); var el=lbl('toylbl','💍 Toy qonaqları buraya gəlir'); t.toyMark={grp:g, el:el, L:addLabel(el,new T.Vector3(t.pos.x,t.top+2.4,t.pos.z)), seated:false}; }
function unmarkToy(t){ var m=t.toyMark; if(!m) return; scene.remove(m.grp); m.L.dead=true; t.toyMark=null; }
var toyT=0;
function updateToyMarks(dt){ toyT-=dt; if(toyT>0) return; toyT=0.4;
  tables.forEach(function(t){ var m=t.toyMark; if(!m) return; var g=customers.filter(function(c){ return c.toyT===t && (c.state==='toSeat'||c.state==='sit'||c.state==='drink'||c.state==='wait'); });
    if(!g.length){ if(t.hall && resvLocked()) return; unmarkToy(t); return; } var sat=g.some(function(c){ return c.seated; }); if(sat!==m.seated){ m.seated=sat; m.el.textContent = sat ? '💍 Toy qonaqları' : '💍 Toy qonaqları buraya gəlir'; m.el.classList.toggle('here',!sat); } }); }
function triggerToy(){ var seats=pickToySeats(4), tabs=[];
  for(var i=0;i<4;i++){ var st=seats[i]||null, c=spawnCustomer('toy', st); if(c){ c.hold=i*0.6; c.toyT = st ? st.t : null; if(st && tabs.indexOf(st.t)<0) tabs.push(st.t); } }
  tabs.forEach(markToy);
  showBanner(tabs.length ? 'Toy qonaqları gəlir! Masaları işarələndi 💍' : 'Toy qonaqları gəlir! Boş masa yoxdur, növbədə gözləyəcəklər', 3000);
  if(tabs.length && player && curZone && curZone.id==='cay'){ camPan={pos:new T.Vector3(tabs[0].pos.x,0,tabs[0].pos.z), until:S.session+2.2}; } }

// ---------- 3rd floor: wedding hall on the neighbouring building, reservations ----------
var hallOpen=false, w1Bld=null, roofWestObst=null, eyvanGate=null, eyvanGateObst=null, HALL_DY=2.6, hallTables=[];
function makeLongTable(x,z){ var g=new T.Group(), y=hAt(x,z), L=5.2;
  g.add(box(L,0.07,1.05,0x8b5a2b,0,0.74,0)); [-2.4,0,2.4].forEach(function(lx){ [-0.4,0.4].forEach(function(lz){ g.add(cyl(0.045,0.045,0.72,0x5a3a1e,lx,0.36,lz,6)); }); });
  var cl=new T.Mesh(new T.PlaneGeometry(L-0.1,1.0), new T.MeshLambertMaterial({color:lin(0xfbf7ee)})); cl.rotation.x=-Math.PI/2; cl.position.y=0.778; g.add(cl);
  g.add(box(L-0.2,0.004,0.2,0xd94f7a,0,0.782,0,false));
  [-1.8,0,1.8].forEach(function(cx){ g.add(cyl(0.05,0.04,0.12,0xd8e8f0,cx,0.84,0,10)); g.add(sph(0.05,0xd94f7a,cx,0.95,0)); g.add(sph(0.04,0xffffff,cx+0.05,0.93,0.03)); });
  for(var i=0;i<5;i++){ var ox=-2.0+i*1.0; [-1,1].forEach(function(sg){ chair(g,ox,sg*0.95,0,sg); }); }
  g.position.set(x,y,z); scene.add(g); bakeAll(g); addObst(x-L/2-0.1,x+L/2+0.1,z-1.3,z+1.3);
  var t={grp:g, pos:new T.Vector3(x,0,z), kind:'long', long:true, hall:true, nerd:false, domino:false, games:false, top:0.78+y, reach:3.4, drop:{x:x, z:z+1.75}, seats:[]};
  for(var j=0;j<5;j++){ var ox2=-2.0+j*1.0; [-1,1].forEach(function(sg){ t.seats.push({t:t, dx:0, dz:sg, x:x+ox2, z:z+sg*0.95, ax:x+ox2, az:z+sg*1.75, rot:Math.atan2(0,-sg), c:null}); }); }
  tables.push(t); hallTables.push(t); return t; }
function buildHall(silent){ if(hallOpen) return; hallOpen=true; var HY=ROOF_Y+HALL_DY;
  if(w1Bld && w1Bld.userData.obst) removeObst(w1Bld.userData.obst);
  if(eyvanGate){ scene.remove(eyvanGate); removeObst(eyvanGateObst); eyvanGate=null; }
  addObst(-16.2,-15.8,-13,-3.5); addObst(-16,-8.3,-13.15,-12.85); addObst(-16,-8.0,-3.8,-3.5); addObst(-8.6,-8.35,-7.6,-3.5);
  addObst(-8.35,-5.75,-9.15,-9.0); addObst(-8.35,-5.75,-7.8,-7.65);
  var g=new T.Group(); g.add(plane(7.6,9.4,TEX.wood,-12.2,HY+0.03,-8.25,-Math.PI/2));
  var rg=new T.Group(); rg.position.y=HY; fenceSide(-15.9,-12.9,-8.45,-12.9,'n',[],rg); fenceSide(-15.9,-12.9,-15.9,-3.6,'w',[],rg); fenceSide(-15.9,-3.6,-8.45,-3.6,'s',[],rg); fenceSide(-8.45,-12.9,-8.45,-3.6,'e',[{side:'e',from:-9.0,to:-7.8}],rg); g.add(rg);
  for(var i=0;i<10;i++){ var x=-5.75-(i+0.5)*0.26, y=ROOF_Y+HALL_DY*((i+1)/10); g.add(box(0.28,0.1,1.2,0x8b5a2b,x,y-0.05,-8.4)); g.add(box(0.26,y-ROOF_Y-0.1,1.16,0x6b4426,x,ROOF_Y+(y-ROOF_Y-0.1)/2,-8.4)); }
  [-9.07,-7.73].forEach(function(z){ var rl=box(2.95,0.07,0.07,0x5a3a1e,-7.05,ROOF_Y+HALL_DY/2+0.95,z); rl.rotation.z=Math.atan2(HALL_DY,2.6); g.add(rl); [-5.85,-7.05,-8.2].forEach(function(px){ var yy=ROOF_Y+HALL_DY*Math.max(0,Math.min(1,(-5.75-px)/2.6)); g.add(cyl(0.035,0.035,0.95,0x5a3a1e,px,yy+0.47,z,6)); }); });
  [[-15.7,-12.7],[-8.7,-12.7],[-15.7,-3.8],[-8.7,-3.8]].forEach(function(p){ g.add(cyl(0.05,0.07,2.8,0x3a3f44,p[0],HY+1.4,p[1],6)); });
  scene.add(g); bakeAll(g); bizSign('Qonaqlar üçün','#d94f7a','#ffffff',4.4,1.0,-12.2,HY+2.6,-3.55,0);
  var L2=new T.Group(); stringLights([[-15.7,-12.7],[-8.7,-12.7],[-8.7,-3.8],[-15.7,-3.8],[-15.7,-12.7]],HY+2.7,0.45,22,L2); stringLights([[-15.7,-8.4],[-8.7,-8.4]],HY+2.8,0.5,16,L2); scene.add(L2);
  [[-13.0,-10.6],[-13.0,-6.2]].forEach(function(p){ var pl=lightPool(p[0],p[1],3.4,scene); pl.position.y=HY+0.05; });
  makeLongTable(-13.0,-10.6); makeLongTable(-13.0,-6.2); fillFromWait();
  R.state='none'; R.t=45; if(!silent){ camPan={pos:new T.Vector3(-11,0,-8.5), until:S.session+2.4}; } }
// reservations
var R={state:'none', t:60, guests:0, left:0, sp:0, family:'', bonus:0};
var FAMILIES=['Məmmədovlar','Əliyevlər','Həsənovlar','Quliyevlər','Hüseynovlar','Rzayevlər','Abbasovlar','Cəfərovlar','İsmayılovlar'];
function hallSeats(){ var a=[]; hallTables.forEach(function(t){ t.seats.forEach(function(s){ a.push(s); }); }); return a; }
function resvShow(text,btns){ var el=$('resv'); el.style.display='block'; $('resvText').textContent=text; $('resvBtns').style.display=btns?'flex':'none'; }
function resvHide(){ $('resv').style.display='none'; }
function declineResv(){ if(R.state!=='offer') return; R.state='none'; R.t=180; resvHide(); }
function famGen(w){ return w+(/lar$/.test(w)?'ın':'in'); }
function fmtT(t){ t=Math.max(0,Math.ceil(t)); return Math.floor(t/60)+':'+('0'+(t%60)).slice(-2); }
$('resvYes').addEventListener('click', acceptResv); $('resvNo').addEventListener('click', declineResv);

// ---------- order bubbles: one per table, and bubbles never sit on top of each other ----------
function tbIcon(k){ if(k==='tea') return '<span class="ico ico-tea"></span>'; if(k==='pax') return '<span class="ico ico-pax"></span>'; return '<span class="emo">'+(CAY_ICON[k]||ITEM_ICON[k]||'•')+'</span>'; }
function tableBubble(t){ var need={}, worst=1, sitting=0, drinking=0;
  t.seats.forEach(function(s){ var c=s.c; if(!c || !c.seated) return; if(c.state==='sit'){ sitting++; var r=c.patience/c.maxP; if(r<worst) worst=r; for(var k in c.need){ var left=c.need[k]-(c.got[k]||0); if(left>0) need[k]=(need[k]||0)+left; } } else if(c.state==='drink') drinking++; });
  if(!sitting){ var st={}; t.seats.forEach(function(s){ if(s.c && s.c.seated) st[s.c.state]=1; }); return drinking ? '<span class="face">😋</span>' : st.waitAll ? '<span class="face">⏳</span>' : st.done ? '<span class="face">😌</span>' : ''; }
  var s=''; Object.keys(need).forEach(function(k){ s+=tbIcon(k)+need[k]; }); return s+'<span class="face">'+(worst>0.5?'🙂':worst>0.2?'😐':'😠')+'</span>'; }
var tbT=0;
function updateTableBubbles(dt){ tbT-=dt; if(tbT>0) return; tbT=0.2; var all=tables.slice(); VEN_LIST.forEach(function(v){ all=all.concat(v.tables); });
  all.forEach(function(t){ if(!t.bubL){ t.bubEl=lbl('bubble',''); t.bubEl.style.display='none'; t.bubL=addLabel(t.bubEl,null,function(v){ return v.set(t.pos.x, t.top+0.95, t.pos.z); }); t.bubL.bub=true; }
    var h=tableBubble(t); if(h!==t.bubH){ t.bubH=h; t.bubEl.innerHTML=h; t.bubEl.style.display=h?'flex':'none'; t.bubL.dirty=true; } }); }
var bubList=[], placedR=[];
function declutter(){ bubList.sort(function(a,b){ return b.sy-a.sy; }); placedR.length=0;
  for(var i=0;i<bubList.length;i++){ var L=bubList[i]; if(L.dirty || !L.bw){ L.bw=L.el.offsetWidth||40; L.bh=L.el.offsetHeight||24; L.dirty=false; }
    var x0=L.sx-L.bw/2, x1=L.sx+L.bw/2, y1=L.sy, shift=0;
    for(var tries=0;tries<5;tries++){ var hit=null; for(var j=0;j<placedR.length;j++){ var q=placedR[j]; if(x0<q.x1 && x1>q.x0 && (y1-shift-L.bh)<q.y1 && (y1-shift)>q.y0){ hit=q; break; } } if(!hit) break; shift=y1-hit.y0+2; }
    placedR.push({x0:x0,x1:x1,y0:y1-shift-L.bh,y1:y1-shift});
    var tr='translate('+L.sx.toFixed(0)+'px,'+(L.sy-shift).toFixed(0)+'px) translate(-50%,-100%)'; if(tr!==L.tr){ L.tr=tr; L.el.style.transform=tr; } } }
// ---------- coffee shop on the 2nd floor of the building next to the sweets ----------
var cafeOpen=false, w3Bld=null, terrWestObst=null;
var COFFEE_T={espresso:1,americano:1,cappuccino:1,latte:1,turk:1,iced:1};
function cupIcon(c,tall){ return '<i class="cup'+(tall?' tall':'')+'" style="--c:'+c+'"></i>'; }
ITEM_ICON.espresso=cupIcon('#3b2214'); ITEM_ICON.americano=cupIcon('#7a4a2a'); ITEM_ICON.cappuccino=cupIcon('#d9b48a'); ITEM_ICON.latte=cupIcon('#ead6b8',true); ITEM_ICON.turk=cupIcon('#1e0f07')+'<b class="tk">T</b>'; ITEM_ICON.iced=cupIcon('#9fd0e6',true);
function cupParts(r,h,surface,foam){ var a=[]; var sc=colored(new T.CylinderGeometry(r*1.9,r*1.65,0.008,18),0xf6f2ea); sc.translate(0,0.004,0); a.push(sc);
  a.push(colorLathe([[0,0.008,0xf6f2ea],[r*0.7,0.008,0xf6f2ea],[r*0.95,0.02,0xf6f2ea],[r,h*0.6,0xf6f2ea],[r*1.06,h,0xf6f2ea],[r*0.98,h,surface],[0,h-0.004,surface]],16));
  var hd=new T.TorusGeometry(r*0.42,r*0.12,5,10,Math.PI); hd.rotateZ(-Math.PI/2); hd.translate(r*1.05,h*0.55,0); a.push(colored(hd,0xf6f2ea));
  if(foam){ var f=new T.CylinderGeometry(r*0.45,r*0.45,0.003,12); f.translate(0,h+0.001,0); a.push(colored(f,foam)); } return a; }
var COFFEE_GEOS={
  espresso:mergeColored(cupParts(0.024,0.034,0x8a5a2a)),
  americano:mergeColored(cupParts(0.032,0.058,0x3b2214)),
  cappuccino:mergeColored(cupParts(0.036,0.048,0xf2e6d0,0xb07a4a)),
  latte:(function(){ var a=[]; var sc=colored(new T.CylinderGeometry(0.05,0.044,0.008,18),0xf6f2ea); sc.translate(0,0.004,0); a.push(sc);
    a.push(colorLathe([[0,0.008,0xd8cfc0],[0.026,0.008,0xd8cfc0],[0.028,0.03,0xb88a5a],[0.03,0.07,0xd9b48a],[0.031,0.1,0xf3ead8],[0.032,0.112,0xe8f0f4],[0,0.106,0xf6efe4]],16)); return mergeColored(a); })(),
  turk:(function(){ var a=cupParts(0.022,0.036,0x1e0f07); var rim=new T.TorusGeometry(0.023,0.0025,4,14); rim.rotateX(Math.PI/2); rim.translate(0,0.036,0); a.push(colored(rim,0xd9ab3c));
    var wg=new T.CylinderGeometry(0.014,0.012,0.045,10); wg.translate(0.045,0.026,0.012); a.push(colored(wg,0xcfe3ec)); var lk=new T.BoxGeometry(0.014,0.012,0.014); lk.translate(-0.04,0.014,0.02); a.push(colored(lk,0xf2a7c3)); return mergeColored(a); })(),
  iced:(function(){ var a=[]; a.push(colorLathe([[0,0,0xcfe3ec],[0.03,0,0xcfe3ec],[0.031,0.06,0x6b4426],[0.033,0.1,0xb88a5a],[0.034,0.12,0xd8e8f0],[0,0.112,0xd8e8f0]],16));
    for(var i=0;i<3;i++){ var c=new T.BoxGeometry(0.016,0.016,0.016); c.rotateY(i); c.translate(-0.012+i*0.012,0.108,(i%2)*0.01-0.005); a.push(colored(c,0xffffff)); }
    var st=new T.CylinderGeometry(0.003,0.003,0.1,5); st.rotateZ(0.25); st.translate(0.012,0.14,0); a.push(colored(st,0x2a9a5a)); return mergeColored(a); })()
};
Object.keys(COFFEE_GEOS).forEach(function(k){ DISH_GEOS[k]=COFFEE_GEOS[k]; });
function coffeeModel(p,type){ var steel=0xc8ccd0;
  p.add(box(1.0,0.85,0.75,0x3a2a20,0,0.425,0)); p.add(box(1.04,0.05,0.8,0x2b1d14,0,0.875,0));
  if(type==='espresso'||type==='cappuccino'||type==='latte'){ var col={espresso:0xb8352f, cappuccino:steel, latte:0x2e3440}[type];
    p.add(box(0.8,0.45,0.45,col,0,1.13,-0.08)); p.add(box(0.82,0.06,0.47,steel,0,1.38,-0.08)); p.add(box(0.7,0.03,0.12,steel,0,0.92,0.14));
    var groups = type==='espresso'?[0]:[-0.18,0.18]; groups.forEach(function(gx){ p.add(cyl(0.06,0.06,0.08,steel,gx,1.0,0.17,10)); var h=box(0.04,0.03,0.2,0x1b1b1b,gx,0.97,0.3); p.add(h); });
    var w=cyl(0.012,0.012,0.22,steel,0.34,1.0,0.16,6); w.rotation.z=0.3; p.add(w);
    if(type!=='espresso'){ var jug=lathe([[0,0],[0.06,0],[0.07,0.14],[0.065,0.15],[0,0.15]],steel,12); jug.position.set(0.32,1.41,-0.1); p.add(jug); }
    for(var i=0;i<3;i++) p.add(cyl(0.035,0.03,0.05,0xf6f2ea,-0.25+i*0.12,1.43,-0.12,10)); }
  else if(type==='americano'){ p.add(box(0.5,0.6,0.4,0x1b1b1b,-0.15,1.2,-0.1)); p.add(box(0.5,0.08,0.45,0x1b1b1b,-0.15,1.46,-0.08)); var car=lathe([[0,0],[0.1,0],[0.12,0.08],[0.09,0.18],[0.05,0.2],[0,0.2]],0x5a3a1e,14); car.position.set(-0.15,0.9,0.08); p.add(car); p.add(box(0.3,0.5,0.3,0x8b5a2b,0.3,1.15,-0.1)); }
  else if(type==='turk'){ var tray=box(0.85,0.08,0.55,0xb87333,0,0.93,0); p.add(tray); var sand=box(0.78,0.03,0.48,0xe0c088,0,0.985,0); p.add(sand);
    [-0.22,0.05,0.28].forEach(function(cx,i){ var cz=lathe([[0,0],[0.05,0],[0.055,0.03],[0.04,0.1],[0.05,0.12],[0,0.12]],0xb87333,12); cz.position.set(cx,0.97,(i%2)*0.1-0.05); p.add(cz); var hd=box(0.18,0.015,0.02,0x5a3a1e,cx+0.13,1.06,(i%2)*0.1-0.05); p.add(hd); }); }
  else if(type==='iced'){ [-0.25,0.0,0.25].forEach(function(cx){ p.add(cyl(0.08,0.08,0.55,0xcfe3ec,cx,1.2,-0.1,12)); p.add(cyl(0.07,0.07,0.3,0x4a2a16,cx,1.08,-0.1,12)); }); p.add(box(0.8,0.05,0.2,0x5a3a1e,0,1.5,-0.1)); var ib=cyl(0.14,0.12,0.16,steel,0.3,0.98,0.15,12); p.add(ib); for(var j=0;j<5;j++) p.add(box(0.05,0.05,0.05,0xffffff,0.24+(j%3)*0.05,1.07,0.1+Math.floor(j/3)*0.07)); } }
function makeBarTable(x,z,kind,n,list){ var g=new T.Group(), y=hAt(x,z), len=n*1.0, along=kind==='bz';
  if(along){ g.add(box(0.5,0.06,len,0x6b4426,0,1.05,0)); g.add(box(0.12,1.02,len-0.1,0x4a2f1c,0.12,0.51,0)); } else { g.add(box(len,0.06,0.5,0x6b4426,0,1.05,0)); g.add(box(len-0.1,1.02,0.12,0x4a2f1c,0,0.51,-0.12)); }
  var t={grp:g, pos:new T.Vector3(x,0,z), kind:'bar', bar:true, nerd:false, domino:false, games:false, top:1.08+y, reach:len/2+1.0, drop: along?{x:x-1.5,z:z}:{x:x,z:z+1.5}, seats:[]};
  for(var i=0;i<n;i++){ var off=-len/2+0.5+i, sx=along?-0.7:off, sz=along?off:0.7;
    g.add(cyl(0.19,0.19,0.06,0x2b2b2b,sx,0.75,sz,14)); g.add(cyl(0.03,0.03,0.72,0x8a8f94,sx,0.37,sz,6)); g.add(cyl(0.15,0.17,0.03,0x8a8f94,sx,0.015,sz,12)); var rim=new T.Mesh(new T.TorusGeometry(0.12,0.012,5,14), M(0x8a8f94)); rim.rotation.x=Math.PI/2; rim.position.set(sx,0.3,sz); g.add(rim);
    t.seats.push({t:t, dx:along?1:0, dz:along?0:-1, x:x+sx, z:z+sz, ax:along?x-1.5:x+off, az:along?z+off:z+1.5, rot:along?Math.PI/2:Math.PI, lift:0.3, c:null}); }
  g.position.set(x,y,z); scene.add(g); bakeAll(g);
  if(along) addObst(x-1.0,x+0.3,z-len/2,z+len/2); else addObst(x-len/2,x+len/2,z-0.3,z+1.0);
  list.push(t); return t; }
function cafeH(x,z){ if(!cafeOpen) return -1; if(x>-7.85&&x<-6.75&&z>9.2&&z<14.2) return 5.5*Math.max(0,Math.min(1,(14.2-z)/5.0)); if(x>-8.45&&x<-6.75&&z>=8.0&&z<=9.2) return 5.5; if(x>-15.95&&x<=-8.45&&z>6.65&&z<18.25) return 5.5; return -1; }
function buildCafeShell(v){ cafeOpen=true; var Y=5.5;
  if(w3Bld && w3Bld.userData.obst) removeObst(w3Bld.userData.obst);
  if(terrWestObst){ removeObst(terrWestObst); terrWestObst=null; addObst(-8.1,-7.9,6.6,8.0); addObst(-8.1,-7.9,9.2,18.1); }
  addObst(-16,-8.4,6.5,6.7); addObst(-16,-8.4,18.2,18.4); addObst(-16.1,-15.9,6.6,18.3); addObst(-8.6,-8.4,6.6,8.0); addObst(-8.6,-8.4,9.2,18.3);
  addObst(-6.75,-6.55,8.0,14.2); addObst(-8.45,-6.55,7.85,8.0);
  var g=new T.Group();
  var rg=new T.Group(); rg.position.y=Y; fenceSide(-15.95,6.7,-8.45,6.7,'n',[],rg); fenceSide(-15.95,18.25,-8.45,18.25,'s',[],rg); fenceSide(-15.95,6.7,-15.95,18.25,'w',[],rg); fenceSide(-8.45,6.7,-8.45,18.25,'e',[{side:'e',from:8.0,to:9.2}],rg); fenceSide(-8.45,8.0,-6.75,8.0,'ln',[],rg); g.add(rg);
  g.add(box(1.7,0.16,1.2,0x8b5a2b,-7.6,Y-0.08,8.6)); [[-6.85,8.1],[-6.85,9.1]].forEach(function(q){ g.add(cyl(0.06,0.06,Y,0x5a3a1e,q[0],Y/2,q[1],6)); });
  for(var i=0;i<16;i++){ var z=14.2-(i+0.5)*(5.0/16), y=Y*((i+1)/16); g.add(box(1.05,0.1,0.32,0x8b5a2b,-7.3,y-0.05,z)); g.add(box(1.0,y-0.1,0.06,0x6b4426,-7.3,(y-0.1)/2,z+0.13)); }
  var rl=box(0.07,0.07,6.9,0x5a3a1e,-6.7,Y/2+0.95,11.7); rl.rotation.x=-Math.atan2(Y,5.0); g.add(rl); [13.9,12.2,10.5,9.4].forEach(function(z){ var yy=cafeH(-7.3,z); g.add(cyl(0.035,0.035,0.95,0x5a3a1e,-6.7,yy+0.47,z,6)); });
  [[-15.75,6.85],[-8.65,6.85],[-15.75,18.05],[-8.65,18.05]].forEach(function(q){ g.add(cyl(0.05,0.07,2.7,0x3a3f44,q[0],Y+1.35,q[1],6)); });
  scene.add(g); bakeAll(g);
  var L=new T.Group(); stringLights([[-15.75,6.85],[-8.65,6.85],[-8.65,18.05],[-15.75,18.05],[-15.75,6.85]],Y+2.6,0.4,24,L); scene.add(L);
  [[-9.6,11.95],[-9.6,16.5],[-10.7,7.6]].forEach(function(q){ var pl=lightPool(q[0],q[1],2.4,scene); pl.position.y=Y+0.05; }); }
function makeCafeLot(b){ var g=new T.Group(); var base=box(1.9,0.1,1.9,0xf6c453,0,0.05,0); var fill=box(1.7,0.06,1.7,0xfff0bf,0,0.11,0,false); fill.scale.x=0.001; g.add(base); g.add(fill); g.position.set(b.front[0],0,b.front[1]); scene.add(g);
  b.lotGrp=new T.Group(); var sg=new T.Mesh(new T.PlaneGeometry(2.6,0.9), new T.MeshBasicMaterial({map:signTex('Satılır','#e2574c','#fff6e6',2.9)})); var sl=b.sale||[-8.37,4.2,12.4,Math.PI/2]; sg.position.set(sl[0],sl[1],sl[2]); sg.rotation.y=sl[3]; sg.userData.keep=true; b.lotGrp.add(sg); scene.add(b.lotGrp);
  var el=lbl('tile',''); var tl={def:b, biz:true, grp:g, fill:fill, remaining:b.price, el:el, L:addLabel(el, new T.Vector3(b.front[0],0.9,b.front[1])), locked:true}; bizTiles.push(tl); refreshBizTile(tl); }

// ---------- Şadlıq evi: the building across from the çayxana becomes a wedding palace ----------
var SAD={x0:17.5,x1:37.0,z0:-7.5,z1:17.5,h:7.0,d0:24.6,d1:27.0,ax:25.8}, sadGate=null, sadGateObst=null;
var marbleTex=canvasTex(128,128,function(ctx,w,h){ for(var y=0;y<2;y++) for(var x=0;x<2;x++){ ctx.fillStyle=(x+y)%2?'#efe6d6':'#f8f3ea'; ctx.fillRect(x*64,y*64,64,64); } ctx.strokeStyle='rgba(201,160,80,0.55)'; ctx.lineWidth=2; ctx.strokeRect(1,1,126,126); ctx.beginPath(); ctx.moveTo(64,0); ctx.lineTo(64,128); ctx.moveTo(0,64); ctx.lineTo(128,64); ctx.stroke(); ctx.strokeStyle='rgba(180,170,150,0.25)'; for(var i=0;i<6;i++){ ctx.beginPath(); ctx.moveTo(Math.random()*128,Math.random()*128); ctx.bezierCurveTo(Math.random()*128,Math.random()*128,Math.random()*128,Math.random()*128,Math.random()*128,Math.random()*128); ctx.stroke(); } },6,12);
var archWinTex=canvasTex(64,128,function(ctx,w,h){ ctx.clearRect(0,0,w,h); ctx.fillStyle='#d9ab3c'; ctx.beginPath(); ctx.moveTo(4,h-4); ctx.lineTo(4,34); ctx.arc(32,34,28,Math.PI,0); ctx.lineTo(60,h-4); ctx.closePath(); ctx.fill(); ctx.fillStyle='#6aa8c8'; ctx.beginPath(); ctx.moveTo(10,h-10); ctx.lineTo(10,36); ctx.arc(32,36,22,Math.PI,0); ctx.lineTo(54,h-10); ctx.closePath(); ctx.fill(); ctx.strokeStyle='#d9ab3c'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(32,14); ctx.lineTo(32,h-10); ctx.moveTo(10,70); ctx.lineTo(54,70); ctx.stroke(); });
function bulbRing(x,y,z,r,n,parent){ var gs=[]; for(var i=0;i<n;i++){ var a=i/n*Math.PI*2, g=new T.SphereGeometry(0.07,8,6); g.translate(x+Math.cos(a)*r,y,z+Math.sin(a)*r); gs.push(g.toNonIndexed()); } var mat=new T.MeshBasicMaterial({color:0x9a8f78}); var m=new T.Mesh(mergeGeos(gs),mat); parent.add(m); twinkle.push({mat:mat, ph:Math.random()*6, sp:1.2+Math.random()}); }
function sadColumn(g,x,z,low){ g.add(box(0.7,0.3,0.7,0xe8dcc4,x,0.15,z)); if(low){ g.add(cyl(0.18,0.22,2.9,0xf3e6cc,x,1.75,z,12)); g.add(box(0.5,0.16,0.5,0xd9ab3c,x,3.25,z)); g.add(sph(0.16,0xd9ab3c,x,3.48,z)); return; } g.add(cyl(0.24,0.29,5.7,0xf3e6cc,x,3.15,z,14)); g.add(box(0.72,0.24,0.72,0xd9ab3c,x,6.1,z)); }
function sadArch(g,x,z,r,alongX){ var a=new T.Mesh(new T.TorusGeometry(r,0.12,6,18,Math.PI), M(0xf3e6cc)); a.position.set(x,6.0-r*0.15,z); a.scale.y=0.55; if(!alongX) a.rotation.y=Math.PI/2; a.castShadow=true; g.add(a); }
function buildSadliqShell(){ var s=SAD, g=new T.Group(), cx=(s.x0+s.x1)/2, cz=(s.z0+s.z1)/2, L=s.z1-s.z0, W=s.x1-s.x0, cream=0xf3e6cc, gold=0xd9ab3c;
  g.add(plane(W,L,marbleTex,cx,0.014,cz,-Math.PI/2));
  g.add(box(W+0.8,s.h+0.6,0.4,cream,cx,(s.h+0.6)/2,s.z0-0.2)); g.add(box(0.4,s.h+0.6,L+0.8,cream,s.x0-0.2,(s.h+0.6)/2,cz));
  for(var i=0;i<Math.floor((W-1)/2.5);i++){ var wx=s.x0+1.6+i*2.5; var w=plane(1.3,2.8,archWinTex,wx,3.0,s.z0+0.01); g.add(w); g.add(box(0.3,s.h,0.12,gold,wx+1.25,s.h/2,s.z0+0.06)); }
  for(var j=0;j<9;j++){ var wz=s.z0+1.6+j*2.6; var w2=plane(1.3,2.8,archWinTex,s.x0+0.01,3.0,wz); w2.rotation.y=Math.PI/2; g.add(w2); }
  var zs=[]; for(var z=s.z0; z<=s.z1+0.01; z+=2.5) zs.push(z); zs.forEach(function(z,k){ sadColumn(g,s.x1,z,z<s.z1-0.1); });
  var xs=[s.x0,19.8,22.2,s.d0,s.d1,29.6,32.2,34.6,s.x1]; xs.forEach(function(x,k){ sadColumn(g,x,s.z1); if(k>0 && !(xs[k-1]===s.d0)) sadArch(g,(x+xs[k-1])/2,s.z1,(x-xs[k-1])/2-0.3,true); });
  var big=new T.Mesh(new T.TorusGeometry(1.25,0.16,8,20,Math.PI), M(gold)); big.position.set(s.ax,5.0,s.z1+0.05); big.castShadow=true; g.add(big);
  g.add(box(W+0.8,0.9,0.8,cream,cx,6.65,s.z1)); g.add(box(W+0.84,0.12,0.84,gold,cx,6.25,s.z1)); g.add(box(W+0.84,0.1,0.84,gold,cx,7.12,s.z1));
  var ped=new T.Shape(); ped.moveTo(-2.6,0); ped.lineTo(2.6,0); ped.lineTo(0,1.4); ped.lineTo(-2.6,0); var pg=new T.ExtrudeGeometry(ped,{depth:0.5,bevelEnabled:false}); var pm=new T.Mesh(pg,M(cream)); pm.position.set(s.ax,7.1,s.z1-0.25); pm.castShadow=true; g.add(pm);
  var pt=new T.Mesh(new T.ExtrudeGeometry((function(){ var sh=new T.Shape(); sh.moveTo(-2.8,0); sh.lineTo(2.8,0); sh.lineTo(0,1.55); sh.lineTo(-2.8,0); var ho=new T.Path(); ho.moveTo(-2.45,0.12); ho.lineTo(2.45,0.12); ho.lineTo(0,1.32); ho.lineTo(-2.45,0.12); sh.holes.push(ho); return sh; })(),{depth:0.56,bevelEnabled:false}), M(gold)); pt.position.set(s.ax,7.05,s.z1-0.28); g.add(pt);
  g.add(box(0.25,1.0,L,cream,s.x1,0.5,cz)); g.add(box(s.d0-s.x0,1.0,0.25,cream,(s.x0+s.d0)/2,0.5,s.z1)); g.add(box(s.x1-s.d1,1.0,0.25,cream,(s.d1+s.x1)/2,0.5,s.z1));
  [[s.x0,s.z1],[s.x1,s.z1]].forEach(function(p){ g.add(cyl(0.95,1.0,8.2,cream,p[0],4.1,p[1],16)); g.add(box(2.1,0.15,2.1,gold,p[0],8.25,p[1])); var dm=new T.Mesh(new T.SphereGeometry(0.98,18,10,0,Math.PI*2,0,Math.PI/2), M(gold)); dm.position.set(p[0],8.3,p[1]); dm.castShadow=true; g.add(dm); g.add(sph(0.14,gold,p[0],9.4,p[1])); g.add(cyl(0.02,0.05,0.5,gold,p[0],9.75,p[1],6)); });
  g.add(plane(2.0,2.7,TEX.carpet,s.ax,0.02,s.z1+1.3,-Math.PI/2)); g.add(plane(2.0,s.z1-(-0.4),TEX.carpet,s.ax,0.02,(s.z1-0.4)/2,-Math.PI/2));
  scene.add(g); bakeAll(g);
  var gm=new T.MeshPhongMaterial({color:lin(0xcfe8f2), transparent:true, opacity:0.12, shininess:120, depthWrite:false, side:T.DoubleSide});
  var roof=new T.Mesh(new T.PlaneGeometry(W,L), gm); roof.rotation.x=-Math.PI/2; roof.position.set(cx,s.h,cz); scene.add(roof);
  var cup=new T.Group(); cup.add(box(4.0,1.2,1.4,cream,s.ax,s.h+0.6,s.z0-0.3)); var cd=new T.Mesh(new T.SphereGeometry(1.5,20,10,0,Math.PI*2,0,Math.PI/2), M(gold)); cd.position.set(s.ax,s.h+1.2,s.z0-0.3); cd.castShadow=true; cup.add(cd); cup.add(sph(0.2,gold,s.ax,s.h+2.8,s.z0-0.3)); cup.add(cyl(0.03,0.07,0.7,gold,s.ax,s.h+3.3,s.z0-0.3,6)); scene.add(cup); bakeAll(cup);
  bizSign('Şadlıq evi','#7a1f2b','#f6d27a',4.6,1.1,s.ax,7.62,s.z1+0.3,0);
  var Lg=new T.Group(); stringLights([[s.x0-0.4,s.z1+0.45],[s.x1+0.45,s.z1+0.45]],7.2,0.25,26,Lg); var ep=[]; zs.forEach(function(z){ if(z<s.z1-0.1) ep.push([s.x1,z]); }); ep.reverse(); stringLights(ep,3.45,0.3,6,Lg);
  [4.0,9.0,13.6].forEach(function(z){ var rg2=new T.Mesh(new T.TorusGeometry(0.7,0.05,6,24), M(gold)); rg2.rotation.x=Math.PI/2; rg2.position.set(s.ax,5.3,z); Lg.add(rg2); bulbRing(s.ax,5.25,z,0.7,10,Lg); var ch=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(s.ax,5.3,z),new T.Vector3(s.ax,s.h,z)]), new T.LineBasicMaterial({color:0xb08a3a})); Lg.add(ch); }); scene.add(Lg);
  addObst(s.x0-0.4,s.x1+0.4,s.z0-0.4,s.z0); addObst(s.x0-0.4,s.x0,s.z0-0.4,s.z1+0.4); addObst(s.x1-0.25,s.x1+0.45,s.z0,s.z1+0.45); addObst(s.x0-0.4,s.d0,s.z1-0.25,s.z1+0.45); addObst(s.d1,s.x1+0.45,s.z1-0.25,s.z1+0.45); addObst(s.x0-1.0,s.x0+1.0,s.z1-1.0,s.z1+1.0); addObst(s.x1-1.0,s.x1+1.0,s.z1-1.0,s.z1+1.0);
  sadGate=new T.Group(); for(var b=0;b<8;b++) sadGate.add(cyl(0.035,0.035,2.2,gold,s.d0+0.15+b*0.3,1.1,s.z1,6)); sadGate.add(box(2.4,0.08,0.08,gold,s.ax,2.15,s.z1)); sadGate.add(box(2.4,0.08,0.08,gold,s.ax,0.4,s.z1)); scene.add(sadGate); sadGateObst=addObst(s.d0,s.d1,s.z1-0.25,s.z1+0.4); }
function makeRoundTable(x,z,n,list){ var g=new T.Group(), y=hAt(x,z);
  g.add(cyl(0.7,0.7,0.06,0x8b5a2b,0,0.74,0,24)); g.add(cyl(0.08,0.12,0.72,0x5a3a1e,0,0.36,0,8)); var cl=new T.Mesh(new T.CylinderGeometry(0.76,0.82,0.3,24,1,true), new T.MeshLambertMaterial({color:lin(0xfbf7ee), side:T.DoubleSide})); cl.position.y=0.63; g.add(cl); g.add(cyl(0.74,0.74,0.012,0xfbf7ee,0,0.776,0,24));
  g.add(cyl(0.06,0.05,0.12,0xd8e8f0,0,0.84,0,10)); g.add(sph(0.06,0xd94f7a,0,0.95,0)); g.add(sph(0.05,0xffffff,0.05,0.93,0.03)); g.add(sph(0.045,0xf6c453,-0.04,0.93,-0.03));
  var t={grp:g, pos:new T.Vector3(x,0,z), kind:'round', round:true, nerd:false, domino:false, games:false, top:0.78+y, reach:2.2, drop:{x:x,z:z+1.75}, seats:[]};
  for(var i=0;i<n;i++){ var a=(i+0.5)/n*Math.PI*2, dx=Math.cos(a), dz=Math.sin(a); var ch=new T.Group(); chair(ch,0,0,0,1); ch.position.set(dx*1.0,0,dz*1.0); ch.rotation.y=Math.atan2(dx,dz); g.add(ch);
    t.seats.push({t:t, dx:dx, dz:dz, x:x+dx*0.95, z:z+dz*0.95, ax:x+dx*1.75, az:z+dz*1.75, rot:Math.atan2(-dx,-dz), c:null}); }
  g.position.set(x,y,z); scene.add(g); bakeAll(g); addObst(x-1.3,x+1.3,z-1.3,z+1.3); list.push(t); return t; }
function sadStationModel(p,type){ p.add(box(1.0,0.85,0.8,0x8b5a2b,0,0.425,0)); p.add(box(1.04,0.05,0.84,0x6b4426,0,0.875,0));
  if(type==='tea'){ var tray=cyl(0.36,0.4,0.05,0xd9ab3c,0,0.92,0,16); p.add(tray); p.add(cyl(0.2,0.24,0.12,0xb8810f,0,1.0,0,12)); var bd=lathe([[0,0],[0.22,0],[0.28,0.12],[0.3,0.32],[0.22,0.5],[0.12,0.56],[0,0.56]],0xc8931a,18); bd.position.y=1.06; p.add(bd); p.add(cyl(0.06,0.08,0.2,0x2b2b2b,0,1.72,0,8)); var tp=sph(0.12,0xf1ebe0,0,1.86,0); tp.scale.set(1,0.8,1); p.add(tp); var tap=cyl(0.02,0.02,0.18,0xb8810f,0,1.2,0.3,6); tap.rotation.x=Math.PI/2; p.add(tap); }
  else if(type==='pax'){ var tr=cyl(0.4,0.4,0.04,0xb87333,0,0.92,0,20); p.add(tr); for(var i=0;i<12;i++){ var d=box(0.12,0.04,0.12,0xd9a95a,-0.25+(i%4)*0.16,0.96,-0.12+Math.floor(i/4)*0.12); d.rotation.y=Math.PI/4; p.add(d); } }
  else { p.add(box(0.95,0.5,0.7,0xd9d4c7,0,1.15,0)); var col=type==='sek'?0xe8c27a:0xd9a95a; for(var j=0;j<6;j++) p.add(box(0.14,0.05,0.12,col,-0.3+(j%3)*0.3,1.43,-0.12+Math.floor(j/3)*0.24)); var gl=new T.Mesh(new T.BoxGeometry(0.9,0.35,0.65), new T.MeshPhongMaterial({color:lin(0xcfe3ec), transparent:true, opacity:0.3})); gl.position.y=1.58; gl.userData.keep=true; p.add(gl); } }
var sadPodium=null;
function buildSadliqInterior(v){ if(sadGate){ scene.remove(sadGate); removeObst(sadGateObst); sadGate=null; }
  var g=new T.Group(), s=SAD; var dfl=new T.Mesh(new T.PlaneGeometry(7.4,3.9), new T.MeshLambertMaterial({map:texFrom(TEX.wood.image,4,2), color:lin(0xd9b88a)})); dfl.rotation.x=-Math.PI/2; dfl.position.set(s.ax,0.022,-2.45); dfl.receiveShadow=true; g.add(dfl);
  [[s.ax,-4.4,7.6,0.1],[s.ax,-0.5,7.6,0.1]].forEach(function(b){ g.add(box(b[2],0.03,b[3],0xd9ab3c,b[0],0.03,b[1])); }); [s.ax-3.75,s.ax+3.75].forEach(function(x){ g.add(box(0.1,0.03,3.95,0xd9ab3c,x,0.03,-2.45)); });
  g.add(box(4.4,0.35,2.6,0x7a1f2b,s.ax,0.175,-5.85)); g.add(plane(4.2,2.4,TEX.carpet,s.ax,0.36,-5.85,-Math.PI/2)); g.add(box(1.0,0.18,0.6,0x7a1f2b,s.ax,0.09,-4.3));
  g.add(box(2.0,0.06,0.7,0xfbf7ee,s.ax,0.35+0.76,-6.0)); [-0.8,0.8].forEach(function(dx){ g.add(cyl(0.04,0.04,0.74,0xd9ab3c,s.ax+dx,0.35+0.37,-6.0,6)); });
  [-0.45,0.45].forEach(function(dx){ var ch=new T.Group(); chair(ch,0,0,0,-1); ch.position.set(s.ax+dx,0.35,-6.6); ch.scale.set(1.15,1.25,1.15); g.add(ch); });
  var arch=new T.Mesh(new T.TorusGeometry(1.7,0.07,6,24,Math.PI), M(0xffffff)); arch.position.set(s.ax,0.35,-7.0); g.add(arch); for(var i=0;i<16;i++){ var a=i/15*Math.PI; g.add(sph(0.13,[0xd94f7a,0xffffff,0xf4a3a3][i%3],s.ax+Math.cos(a)*1.7,0.35+Math.sin(a)*1.7,-7.0)); }
  scene.add(g); bakeAll(g); addObst(s.ax-2.2,s.ax+2.2,-7.15,-4.55); sadPodium={x:s.ax, z:-6.6, y:0.35};
  ['#ff6fb0','#ffd27a','#7fd0ff','#b48cff'].forEach(function(c,i){ var m=new T.Mesh(new T.PlaneGeometry(2.6,2.6), new T.MeshBasicMaterial({map:glowTex, color:new T.Color(c), transparent:true, opacity:0, depthWrite:false, blending:T.AdditiveBlending})); m.rotation.x=-Math.PI/2; m.position.set(s.ax-2.4+i*1.6,0.05,-2.45+((i%2)?0.7:-0.7)); scene.add(m); dancePools.push(m); }); }
var SAD_T={tea:1,pax:1,sek:1,bad:1};
// ---------- wedding ceremonies in the Şadlıq evi ----------
function sadV(){ return VEN.sadliq||null; }
function sadSeats(){ var v=sadV(), a=[]; if(v) v.tables.forEach(function(t){ t.seats.forEach(function(s){ a.push(s); }); }); return a; }
var cer={couple:[], dancers:[], car:null, lbl:null, conf:0};
function vSpawnGuest(v,car){ var free=sadSeats().filter(function(s){ return !s.c; }); if(!free.length) return null; var seat=free[0], sp=car?guestCarSpot(car):pick(v.def.spawns);
  var g=takeChar(); g.position.set(sp[0],0,sp[1]);
  var c={grp:g, pos:g.position, v:v, type:'toy', toyRes:true, seat:seat, need:{}, got:{}, claimed:{}, pay:0, glasses:[], state:'toSeat', patience:80, maxP:80, drinkT:0, t:Math.random()*10, happy:0, angry:0, moving:false, seated:false, html:'', path:[], dest:null, exit:car?guestCarSpot(car):(sp===v.def.spawns[0]?v.def.spawns[1]:v.def.spawns[0]), hold:0, car:car||null};
  seat.c=c; c.el=lbl('bubble',''); c.el.style.display='none'; c.L=addLabel(c.el,null,function(vv){ return vv.set(c.pos.x, c.pos.y+(c.seated?1.9:2.3), c.pos.z); }); c.L.bub=true; v.customers.push(c); return c; }
function startCeremony(v){ var s=SAD, sp=v.def.spawns[0];
  var groom=makeChar({shirt:0xffffff, pants:0x1b1b1b, vest:0x1b1b1b, bow:true, hair:0x2a1d16}); var bride=makeChar({female:true, shirt:0xffffff, pants:0xffffff, hair:0x3a2416, hairStyle:'bun', shoe:0xffffff});
  var veil=new T.Mesh(new T.ConeGeometry(0.28,0.75,14,1,true), new T.MeshLambertMaterial({color:lin(0xffffff), transparent:true, opacity:0.75, side:T.DoubleSide})); veil.position.set(0,-0.1,-0.06); bride.userData.head.add(veil);
  var slot=freeSlot('near'), wc=slot?carArrive(slot,'sedan',0xffffff,true):null; cer.car=wc;
  [[groom,s.ax-0.45],[bride,s.ax+0.45]].forEach(function(q,i){ q[0].visible=false; var m={grp:q[0], pos:q[0].position, t:0, moving:false, path:[], dest:null, seatX:q[1], state:'wait', hold:0, car:wc}; cer.couple.push(m);
    var drop=function(car){ var sp2=car?guestCarSpot(car):sp; m.pos.set(sp2[0]+i*0.5,0,sp2[1]); q[0].visible=true; m.state='in'; if(car) car.riders++; };
    if(wc){ (wc.unload=wc.unload||[]).push(drop); } else drop(null); });
  cer.lbl=lbl('toylbl','💍 '+famGen(R.family)+' toyu'); cer.L=addLabel(cer.lbl,new T.Vector3(s.ax,3.4,-6.0)); }
function bobDanceLegs(m){ m.grp.userData.legs.forEach(function(h,j){ h.rotation.x=Math.sin(m.t*2+j*Math.PI)*0.2; h.userData.knee.rotation.x=0.1; }); }
function endCeremony(){ cer.couple.forEach(function(m){ m.state='out'; m.grp.userData.root.position.y=0; m.seated=false; m.seat=null; m.pos.set(SAD.ax,0,-4.0); });
  cer.dancers.forEach(function(d){ scene.remove(d.grp); disposeTree(d.grp); }); cer.dancers=[]; dancePools.forEach(function(m){ m.userData.on=false; m.material.opacity=0; });
  if(cer.L){ cer.L.dead=true; cer.L=null; } }
function updateCeremony(dt){ var s=SAD;
  for(var i=cer.couple.length-1;i>=0;i--){ var m=cer.couple[i]; m.t+=dt; if(m.hold>0){ m.hold-=dt; continue; }
    if(m.state==='in'){ if(nav(m,m.seatX,-4.0,2.6,dt)){ m.state='sit'; m.pos.set(m.seatX,0,-6.6); m.grp.rotation.y=0; m.seated=true; m.seat={lift:0.35}; } }
    else if(m.state==='sit' && R.state==='active' && R.activeT<40 && !m.danced){ m.danced=true; m.state='toDance'; m.seated=false; m.seat=null; m.grp.userData.root.position.y=0; m.pos.set(m.seatX,0,-4.2); }
    else if(m.state==='toDance'){ if(moveTo(m,s.ax+(i?0.35:-0.35),-2.45,1.6,dt)){ m.state='dance'; m.ang=i?0:Math.PI; } }
    else if(m.state==='dance'){ m.ang+=dt*0.7; var rr=0.55+Math.sin(m.t*0.8)*0.2; m.pos.set(s.ax+Math.cos(m.ang)*rr,0,-2.45+Math.sin(m.ang)*rr*0.8); m.grp.rotation.y=Math.atan2(s.ax-m.pos.x,-2.45-m.pos.z); var A2=m.grp.userData.arms, w2=Math.sin(m.t*1.4);
      if(i===0){ A2[0].rotation.x=-0.2; A2[1].rotation.x=-0.2; A2[0].rotation.z=-1.35-Math.max(0,w2)*0.6; A2[1].rotation.z=1.35+Math.max(0,-w2)*0.6; A2[0].userData.elbow.rotation.x=-0.1; A2[1].userData.elbow.rotation.x=-0.1; }
      else { A2[0].rotation.x=-1.8+w2*0.4; A2[0].rotation.z=-0.6; A2[0].userData.elbow.rotation.x=-0.7; A2[1].rotation.x=-0.9-w2*0.4; A2[1].rotation.z=0.9; A2[1].userData.elbow.rotation.x=-0.5; }
      m.grp.userData.root.position.y=Math.abs(Math.sin(m.t*(i?3:6)))*0.03; if(R.activeT>50){ m.state='back'; } legsStep(m,m.t*(i?3:6),i?0.15:0.3); continue; }
    else if(m.state==='back'){ if(moveTo(m,m.seatX,-4.2,1.6,dt)){ m.state='sit'; m.pos.set(m.seatX,0,-6.6); m.grp.rotation.y=0; m.seated=true; m.seat={lift:0.35}; } }
    else if(m.state==='wait'){ continue; }
    else if(m.state==='out'){ var ex=m.car&&m.car.slot?guestCarSpot(m.car):[33,19.2]; if(nav(m,ex[0],ex[1],2.8,dt)){ if(m.car) m.car.boarded++; scene.remove(m.grp); disposeTree(m.grp); cer.couple.splice(i,1); continue; } }
    bobChar(m,dt); if(m.seated){ var A=m.grp.userData.arms; A[0].rotation.x=-0.35; A[1].rotation.x=-0.35+Math.sin(m.t*1.3)*0.1; } }
  cer.dancers.forEach(function(d){ placeDancer(d,dt); });
  if(dancePools.length && dancePools[0].userData.on){ var tt=S.elapsed; dancePools.forEach(function(m,i){ m.material.opacity=0.22+0.22*(0.5+0.5*Math.sin(tt*(1.6+i*0.5)+i*1.7)); }); }
  if(R.state==='active'){ cer.conf-=dt; if(cer.conf<=0){ cer.conf=5; if(player && dist(player.pos,{x:s.ax,z:2})<16) confetti({x:s.ax,z:-3}); } }
  updateParkCars(dt); updateSadBand(dt); updateTea(); updatePark(dt); }
function resvLocked(){ return !!R.teaLock; }
function offerResv(){ var v=sadV(); if(!v) return; R.state='offer'; R.t=30; R.family=pick(FAMILIES); R.guests=sadSeats().length; R.bonus=250+60*S.level; R.menu=toyMenuOffer(v); R.tea = hallOpen ? Math.min(hallSeats().length, 8+Math.floor(Math.random()*9)) : 0; var avg=R.menu.reduce(function(a,k){ return a+(v.def.prices[k]||10); },0)/R.menu.length; R.est=Math.round(R.guests*avg*1.5*1.5*(1+0.4*v.st.lv[0])*levelMul()); SFX.mission(); buzz([20,40,20]); }
function acceptResv(){ if(R.state!=='offer') return; R.state='waiting'; R.t=45; SFX.pop(); showBanner('Rezerv qəbul olundu: '+famGen(R.family)+' toyu şadlıq evində', 2800); }
function updateResv(dt){ var v=sadV(); updateCeremony(dt); if(!v) return; R.t-=dt;
  if(R.state==='none'){ resvHide(); if(R.t<=0) offerResv(); }
  else if(R.state==='offer'){ resvShow('💍 '+R.family+' şadlıq evində toy istəyir: '+R.guests+' qonaq. Seçdikləri menyu: '+menuText(R.menu)+'. Yeməklərə təxminən '+R.est+' ₼, üstəgəl '+R.bonus+' ₼ bonus.'+(R.tea?' Toydan sonra '+R.tea+' qonaq çayxananın 3-cü mərtəbəsində («Qonaqlar üçün») çay içəcək, ora da rezerv olunur.':'')+' Cavab ver: '+fmtT(R.t), true); if(R.t<=0){ R.state='none'; R.t=150; } }
  else if(R.state==='waiting'){ resvShow('💍 '+famGen(R.family)+' toyu '+fmtT(R.t)+' sonra · şadlıq evi hazırlanır', false);
    if(R.t<=0){ R.state='arriving'; R.left=R.guests; R.sp=0; startCeremony(v); showBanner('Toy başlayır! Qonaqlar şadlıq evinə gəlir 💍', 2800); SFX.level(); if(player) camPan={pos:new T.Vector3(SAD.ax,0,8), until:S.session+2.4}; } }
  else if(R.state==='arriving'){ R.sp-=dt; if(R.sp<=0 && R.left>0){ var sl=freeSlot(); if(sl){ var n=Math.min(R.left,3+Math.floor(Math.random()*2)), car=carArrive(sl); car.unload=[]; for(var q=0;q<n;q++) car.unload.push(function(cc){ var gc=vSpawnGuest(v,cc); if(gc) cc.riders++; }); R.left-=n; R.sp=0.8; } else { var wg=vSpawnGuest(v); if(wg) R.left--; else R.left=0; R.sp=0.4; } }
    var gs=v.customers.filter(function(c){ return c.toyRes; }), sat=gs.filter(function(c){ return c.state==='waitAll'; }).length; resvShow('💍 Toy qonaqları gəlir: '+sat+' / '+R.guests+' əyləşib', false);
    if(R.left<=0 && sat===gs.length && !pcars.some(function(c){ return (c.unload && c.unload.length) || c.state==='arrive'; }) && gs.length){ R.state='active'; startTeaLock(); R.activeT=0; startDancing(); showBanner('Hamı əyləşdi! Ofisiantlar yeməkləri gətirir 🍽', 2600); } }
  else if(R.state==='active'){ R.activeT+=dt; var gs2=v.customers.filter(function(c){ return c.toyRes; }), fed=gs2.filter(function(c){ return c.state==='done'; }).length; resvShow('💍 '+famGen(R.family)+' toyu: '+fed+' / '+gs2.length+' qonaq yeməyini yeyib', false);
    if(!gs2.length || fed===gs2.length || R.activeT>300) finishCeremony(v); }
  else if(R.state==='leaving'){ var left2=v.customers.filter(function(c){ return c.toyRes; }).length; resvShow('💍 Qonaqlar birlikdə yola düşür: '+left2, false); if(!left2){ R.state='none'; R.t=150; } } }

// ---------- wedding v2: menu chosen in advance, guests come and go together, hall waiters serve ----------
var DISH_NAME={plov:'Plov', kabab:'Kabab', dolma:'Dolma', salat:'Salat', meyve:'Meyvə', pax:'Şirniyyat'};
ITEM_ICON.meyve='🍇'; ITEM_ICON.pax='🍯'; ITEM_BIG.meyve=1; SAD_T.meyve=1;
DISH_GEOS.meyve=(function(){ var a=[plateG(0.08)]; for(var i=0;i<9;i++){ a.push(bitG(new T.SphereGeometry(0.011,6,4),0x6a2a5a,-0.03+(i%3)*0.012,0.02+Math.floor(i/3)*0.01,-0.02+(i%2)*0.008)); }
  a.push(bitG(new T.SphereGeometry(0.022,10,8),0xd8382a,0.03,0.022,0.02)); a.push(bitG(new T.SphereGeometry(0.02,10,8),0xc0392b,0.035,0.022,-0.025)); var sl=new T.CylinderGeometry(0.02,0.02,0.01,10,1,false,0,Math.PI); a.push(bitG(sl,0xf2e6b0,-0.01,0.014,0.04)); return mergeColored(a); })();
var dancePools=[];
function sadMeyveModel(p){ var t=cyl(0.38,0.4,0.05,0xd9ab3c,0,0.92,0,18); p.add(t); for(var i=0;i<14;i++) p.add(sph(0.05,0x6a2a5a,-0.2+(i%5)*0.05,0.98+Math.floor(i/5)*0.04,-0.1+(i%3)*0.05)); [[0.18,0.08,0xd8382a],[0.22,-0.1,0xc0392b],[0.08,-0.15,0xf2c14e],[-0.05,0.15,0x7cb342]].forEach(function(q){ p.add(sph(0.07,q[2],q[0],0.99,q[1])); }); }
function toyMenuOffer(v){ var m=vMenu(v).slice(); for(var i=m.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)), t=m[i]; m[i]=m[j]; m[j]=t; } var n=Math.min(m.length, 2+Math.floor(Math.random()*Math.max(1,m.length-1))); return m.slice(0,Math.max(1,n)); }
function menuText(m){ return m.map(function(k){ return ITEM_ICON[k]+' '+DISH_NAME[k]; }).join(', '); }
function updateToyGuest(c,dt){ var v=c.v, sp=CFG.customerSpeed; if(c.angry>0) c.angry-=dt;
  if(c.state==='toSeat'){ if(nav(c,c.seat.ax,c.seat.az,sp,dt)){ var s=c.seat; c.pos.set(s.x,0,s.z); c.grp.rotation.y=s.rot; c.seated=true; c.moving=false; c.path=[]; c.dest=null; c.state='waitAll'; } }
  else if(c.state==='waitAll'){ if(R.state==='active') v.def.order(c); }
  else if(c.state==='sit'){ if(!S.zen) c.patience-=dt/S.patienceMul; if(c.patience<=0){ c.state='done'; c.angry=2.5; c.unhappy=true; S.lost++; SFX.sad(); for(var k in c.claimed) c.claimed[k]=0; } }
  else if(c.state==='drink'){ c.drinkT-=dt; if(c.drinkT<=0){ c.state='done'; c.glasses.forEach(function(m){ scene.remove(m); }); c.glasses=[]; } }
  else if(c.state==='out'){ if(c.hold>0) c.hold-=dt; else if(nav(c,c.exit[0],c.exit[1],sp,dt)){ if(c.car) c.car.boarded++; dropChar(c.grp); c.L.dead=true; v.customers.splice(v.customers.indexOf(c),1); return; } }
  bobChar(c,dt); var html = c.angry>0 ? '<span class="face">😠</span>' : ''; if(html!==c.html){ c.html=html; c.el.innerHTML=html; c.el.style.display=html?'flex':'none'; c.L.dirty=true; } }
function finishCeremony(v){ var g=v.customers.filter(function(c){ return c.toyRes; }), sum=0, ok=0;
  g.forEach(function(c){ if(!c.unhappy){ sum+=c.pay; ok++; } });
  var total=Math.round(sum*1.5*(1+0.4*v.st.lv[0])*levelMul()*boostMul()), share=g.length? ok/g.length : 1, bonus=Math.round(R.bonus*share);
  if(total>0) vAddCash(v,total,{x:SAD.ax,z:6}); S.money+=bonus; bumpMoney(); S.served+=ok; S.st.served=(S.st.served||0)+ok;
  showBanner('Toy bitdi! Yeməklər: +'+total+' ₼ (kassada), bonus: +'+bonus+' ₼'+(ok<g.length?' · '+(g.length-ok)+' narazı qonaq':'')+' 💍', 3600); SFX.level(); addXP(20); S.st.toys=(S.st.toys||0)+1;
  g.sort(function(a,b){ return b.seat ? (b.seat.z - (a.seat?a.seat.z:0)) : 0; }).forEach(function(c,i){ c.glasses.forEach(function(m){ scene.remove(m); }); c.glasses=[]; var st=c.seat; if(st){ st.c=null; c.pos.set(st.ax,0,st.az); } c.seat=null; c.seated=false; c.state='out'; c.hold=i*0.12; c.dest=null; c.path=[]; c.grp.userData.root.position.y=0; });
  var teaList=g.filter(function(c){ return !c.unhappy; }).slice(0,R.tea||0); sendTeaGuests(v,teaList);
  endCeremony(); R.state='leaving'; }

// ---------- realistic wedding dancing: yallı line, men's and women's solo dances ----------
function makeDancer(style,i){ var fem = style==='solo_f' || (style==='yalli' && i%2===1);
  var look = fem ? {female:true, shirt:pick([0xd94f7a,0x8a6f9e,0x2a9a8a,0xe0a020,0xb5546a,0x3f7fbf]), pants:pick([0x7a1f2b,0x2b2b2b,0x4a3060,0x1f4a6a]), hair:pick(HAIRS), hairStyle:pick(['long','bun'])}
               : {shirt:0xffffff, pants:0x1b1b1b, vest:pick([0x1b1b1b,0x7a1f2b,0x2e3440]), hair:pick(HAIRS.slice(0,3)), must:Math.random()<0.5};
  var g=makeChar(look); g.scale.set(0.01,0.01,0.01); pops.push({obj:g,t:0}); return {grp:g, pos:g.position, style:style, i:i, fem:fem, t:Math.random()*3, spinT:0, nextSpin:3+Math.random()*4}; }
function startDancing(){ var s=SAD, cx=s.ax, cz=-2.45; dancePools.forEach(function(m){ m.userData.on=true; });
  for(var i=0;i<5;i++){ var d=makeDancer('yalli',i); d.base=Math.PI*0.15; cer.dancers.push(d); }
  var m1=makeDancer('solo_m',0); m1.ox=cx-2.3; m1.oz=cz+0.9; cer.dancers.push(m1); var m2=makeDancer('solo_m',1); m2.ox=cx+2.6; m2.oz=cz-0.6; cer.dancers.push(m2);
  var f1=makeDancer('solo_f',0); f1.ox=cx+2.2; f1.oz=cz+1.0; cer.dancers.push(f1); var f2=makeDancer('solo_f',1); f2.ox=cx-2.6; f2.oz=cz-0.7; cer.dancers.push(f2);
  cer.dancers.forEach(function(d){ placeDancer(d,0); }); }
function legsStep(d,ph,amp){ d.grp.userData.legs.forEach(function(h,j){ var s2=Math.sin(ph+j*Math.PI); h.rotation.x=s2*amp; h.userData.knee.rotation.x=Math.max(0,-s2)*amp*1.4; }); }
function placeDancer(d,dt){ var cx=SAD.ax, cz=-2.45, g=d.grp, A=g.userData.arms, root=g.userData.root, head=g.userData.head; d.t+=dt; var k=d.t;
  if(d.style==='yalli'){ d.base+=dt*0.22; var ph=S.elapsed*3.4, ang=d.base+d.i*0.45, r=2.5; d.pos.set(cx+Math.cos(ang)*r*1.25,0,cz+Math.sin(ang)*r*0.62);
    g.rotation.y=Math.atan2(cx-d.pos.x,cz-d.pos.z); var up=(S.elapsed%9)>7.2;
    A[0].rotation.z=-0.55; A[1].rotation.z=0.55; A[0].rotation.x=up?-2.4:-0.25+Math.sin(ph)*0.18; A[1].rotation.x=up?-2.4:-0.25+Math.sin(ph)*0.18; A[0].userData.elbow.rotation.x=up?-0.2:-0.25; A[1].userData.elbow.rotation.x=up?-0.2:-0.25;
    legsStep(d,ph,0.45); root.position.y=Math.abs(Math.sin(ph))*0.06; if(head) head.rotation.z=Math.sin(ph*0.5)*0.08; }
  else if(d.style==='solo_m'){ var a=k*1.1+d.i*2; d.pos.set(d.ox+Math.cos(a)*0.75,0,d.oz+Math.sin(a)*0.5);
    d.nextSpin-=dt; if(d.nextSpin<=0 && d.spinT<=0){ d.spinT=0.7; d.nextSpin=4+Math.random()*3; }
    if(d.spinT>0){ d.spinT-=dt; g.rotation.y+=dt*9; } else g.rotation.y=Math.atan2(-Math.sin(a),Math.cos(a))+Math.PI/2+Math.sin(k*2)*0.3;
    var lift=Math.max(0,Math.sin(k*1.6)); A[0].rotation.x=-0.2; A[1].rotation.x=-0.2; A[0].rotation.z=-1.35-lift*0.7; A[1].rotation.z=1.35+(1-lift)*0.5; A[0].userData.elbow.rotation.x=-0.15; A[1].userData.elbow.rotation.x=-0.15;
    legsStep(d,k*9,0.35); root.position.y=Math.abs(Math.sin(k*9))*0.05; root.rotation.x=-0.06; }
  else { var b=k*0.55+d.i*3; d.pos.set(d.ox+Math.cos(b)*0.9,0,d.oz+Math.sin(b)*0.45);
    g.rotation.y=Math.atan2(-Math.sin(b)*0.9,Math.cos(b)*0.45)+Math.sin(k*0.7)*0.4; var w=Math.sin(k*1.3);
    A[0].rotation.x=-1.9+w*0.45; A[0].rotation.z=-0.7; A[0].userData.elbow.rotation.x=-0.7+w*0.2; A[1].rotation.x=-0.8-w*0.45; A[1].rotation.z=1.0; A[1].userData.elbow.rotation.x=-0.5-w*0.2;
    legsStep(d,k*4.5,0.15); root.position.y=Math.abs(Math.sin(k*4.5))*0.02; if(head){ head.rotation.z=w*0.12; head.rotation.x=0.05; } } }

// ---------- Şadlıq evi band ----------
var sadBand=[];
function sadMusician(kind,x,z){ var looks={singer:{shirt:0x7a1f2b, pants:0x1b1b1b, vest:0x1b1b1b, hair:0x2a1d16, must:true}, tar:{shirt:0x2e3440, pants:0x2b2b2b, vest:0x8d2f3b, hat:'papaq', hatColor:0x1a1a1a, must:true}, kaman:{shirt:0x2e3440, pants:0x2b2b2b, vest:0x5b4a3a, hair:0x9a9a96, must:true}, drum:{shirt:0xd9d4c7, pants:0x2b2b2b, vest:0x8d2f3b, hair:0x2a1d16}, qarmon:{shirt:0xf4f1ea, pants:0x1b1b1b, vest:0x1f3a5a, hair:0x5a3f2b, must:true}, klarnet:{shirt:0x4f5d75, pants:0x2b2b2b, vest:0x1b1b1b, hair:0x2a1d16}};
  var g=makeChar(looks[kind]), y=0.3, A=g.userData.arms, root=g.userData.root, m={grp:g, kind:kind, t:Math.random()*4, seated:kind!=='singer'};
  g.position.set(x,y,z); g.rotation.y=Math.atan2(SAD.ax-x,-2.45-z);
  if(m.seated) m.stool=(function(){ var st=new T.Group(); st.add(box(0.45,0.06,0.45,0x8b5a2b,0,0.43,0)); [[-0.17,-0.17],[0.17,-0.17],[-0.17,0.17],[0.17,0.17]].forEach(function(q){ st.add(cyl(0.03,0.03,0.42,0x5a3a1e,q[0],0.21,q[1],6)); }); st.position.set(x,y,z); scene.add(st); bakeAll(st); return st; })();
  if(kind==='singer'){ var mic=new T.Group(); mic.add(cyl(0.18,0.2,0.03,0x2b2b2b,0,0.015,0,14)); mic.add(cyl(0.015,0.015,1.45,0x8a8f94,0,0.74,0,6)); mic.add(sph(0.045,0x1b1b1b,0,1.5,0)); var dx=SAD.ax-x, dz=-2.45-z, L=Math.hypot(dx,dz); mic.position.set(x+dx/L*0.45,y,z+dz/L*0.45); scene.add(mic); bakeAll(mic); }
  else if(kind==='tar'){ var tar=new T.Group(); tar.add(box(0.26,0.34,0.1,0x8b5a2b,0,0,0)); tar.add(cyl(0.02,0.02,0.55,0x5a3a1e,0,0.42,0,6)); tar.position.set(0.02,1.12,0.3); tar.rotation.z=-0.75; root.add(tar); }
  else if(kind==='kaman'){ var k2=new T.Group(); var body=sph(0.13,0x6b3a1e,0,0,0); body.scale.set(1,1.1,0.8); k2.add(body); k2.add(cyl(0.02,0.025,0.55,0x3a2416,0,0.38,0,6)); k2.position.set(0,0.62,0.32); root.add(k2); var bow=cyl(0.006,0.006,0.6,0x8b5a2b,0,-0.3,0.12,4); bow.rotation.z=Math.PI/2; A[1].userData.elbow.add(bow); }
  else if(kind==='drum'){ var d=new T.Group(); var dr=cyl(0.2,0.2,0.32,0x8d2f3b,0,0,0,18); dr.rotation.x=Math.PI/2; d.add(dr); d.position.set(0,1.05,0.32); d.rotation.y=Math.PI/2; root.add(d); }
  else if(kind==='qarmon'){ var q=new T.Group(); q.add(box(0.12,0.26,0.2,0xb8352f,-0.16,0,0)); q.add(box(0.12,0.26,0.2,0xb8352f,0.16,0,0)); for(var i=0;i<4;i++) q.add(box(0.035,0.25,0.21,i%2?0x1b1b1b:0xf6f2ea,-0.07+i*0.047,0,0)); q.position.set(0,1.05,0.3); root.add(q); }
  else if(kind==='klarnet'){ var p2=cyl(0.018,0.035,0.45,0x1b1b1b,0,-0.05,0.25,8); p2.rotation.x=Math.PI/2.6; g.userData.head.add(p2); }
  sadBand.push(m); return m; }
function buildSadBand(silent){ if(sadBand.length) return; var g=new T.Group(); g.add(box(5.6,0.3,4.6,0x6b4426,33.9,0.15,-4.55)); g.add(plane(5.2,4.2,TEX.carpet,33.9,0.31,-4.55,-Math.PI/2)); scene.add(g); bakeAll(g); addObst(31.1,36.7,-6.85,-2.25);
  [['singer',31.9,-3.0],['tar',33.3,-5.4],['kaman',34.6,-5.6],['qarmon',33.0,-3.9],['drum',35.8,-4.3],['klarnet',35.2,-3.0]].forEach(function(q){ var m=sadMusician(q[0],q[1],q[2]); if(!silent){ m.grp.scale.set(0.01,0.01,0.01); pops.push({obj:m.grp,t:0}); } }); }
function updateSadBand(dt){ var playing=R.state==='active'||R.state==='arriving';
  sadBand.forEach(function(m){ m.t+=dt; var A=m.grp.userData.arms, root=m.grp.userData.root, k=m.t, amp=playing?1:0.25;
    if(m.seated){ root.position.y=-0.4; m.grp.userData.legs.forEach(function(h){ h.rotation.x=-Math.PI/2; h.userData.knee.rotation.x=Math.PI/2; }); }
    if(m.kind==='singer'){ A[0].rotation.x=-1.0; A[0].rotation.z=-0.3+Math.sin(k*1.2)*0.4*amp; A[1].rotation.x=-1.2+Math.sin(k*1.6)*0.3*amp; A[1].userData.elbow.rotation.x=-0.8; m.grp.userData.head.rotation.x=0.05+Math.sin(k*1.5)*0.06*amp; }
    else if(m.kind==='tar'){ A[0].rotation.x=-0.7; A[0].userData.elbow.rotation.x=-1.1; A[1].rotation.x=-0.6+Math.sin(k*10)*0.12*amp; A[1].userData.elbow.rotation.x=-1.0; }
    else if(m.kind==='kaman'){ A[0].rotation.x=-0.9; A[0].userData.elbow.rotation.x=-1.1; A[1].rotation.x=-0.75; A[1].userData.elbow.rotation.x=-1.0+Math.sin(k*5)*0.35*amp; }
    else if(m.kind==='drum'){ A[0].rotation.x=-0.6+Math.max(0,Math.sin(k*9))*0.35*amp; A[0].userData.elbow.rotation.x=-1.3; A[1].rotation.x=-0.6+Math.max(0,Math.sin(k*9+Math.PI))*0.35*amp; A[1].userData.elbow.rotation.x=-1.3; }
    else if(m.kind==='qarmon'){ var sq=Math.sin(k*2.2)*amp; A[0].rotation.x=-0.75; A[0].rotation.z=-0.35-sq*0.25; A[0].userData.elbow.rotation.x=-1.2; A[1].rotation.x=-0.75; A[1].rotation.z=0.35+sq*0.25; A[1].userData.elbow.rotation.x=-1.2; }
    else if(m.kind==='klarnet'){ A[0].rotation.x=-1.25; A[0].userData.elbow.rotation.x=-1.45+Math.sin(k*6)*0.05*amp; A[1].rotation.x=-1.15; A[1].userData.elbow.rotation.x=-1.5+Math.sin(k*6+1)*0.05*amp; m.grp.rotation.y+=Math.sin(k*0.9)*0.002*amp; } }); }
// ---------- parking: wedding guests come by car and leave by car ----------
var PARK={x0:39.0,x1:50.8,z0:-16.2,z1:18.6, ax:44.65, wx:41.3, ex:48.0, slots:[]}, pcars=[];
(function(){ for(var k=0;k<14;k++){ var z=-14.7+k*2.45; PARK.slots.push({x:PARK.wx, z:z, side:-1, car:null}); PARK.slots.push({x:PARK.ex, z:z, side:1, car:null}); } })();
function buildParking(){ var p=PARK, g=new T.Group(), cx=(p.x0+p.x1)/2, cz=(p.z0+p.z1)/2;
  var asph=new T.Mesh(new T.PlaneGeometry(p.x1-p.x0,p.z1-p.z0+1.7), new T.MeshLambertMaterial({color:lin(0x4a4d52)})); asph.rotation.x=-Math.PI/2; asph.position.set(cx,0.013,cz+0.85); asph.receiveShadow=true; g.add(asph);
  p.slots.forEach(function(s){ [-1.2,1.2].forEach(function(dz){ g.add(box(4.0,0.01,0.08,0xf2efe6,s.x,0.022,s.z+dz,false)); }); });
  g.add(box(0.12,0.01,p.z1-p.z0,0xf6c453,p.ax-1.25,0.022,cz,false)); g.add(box(0.12,0.01,p.z1-p.z0,0xf6c453,p.ax+1.25,0.022,cz,false));
  [[p.x0,cz,0.3,p.z1-p.z0],[p.x1,cz,0.3,p.z1-p.z0],[(p.x0+p.ax-1.25)/2,p.z0,p.ax-1.25-p.x0,0.3],[(p.ax+1.25+p.x1)/2,p.z0,p.x1-p.ax-1.25,0.3]].forEach(function(b){ g.add(box(b[2],0.18,b[3],0xb8b4aa,b[0],0.09,b[1])); });
  scene.add(g); bakeAll(g);
  var sg=new T.Group(); sg.add(cyl(0.06,0.06,2.6,0x3a3f44,p.ax+1.6,1.3,p.z1+0.6,8)); scene.add(sg); bakeAll(sg); bizSign('P','#1f5a9a','#ffffff',0.9,0.9,p.ax+1.6,2.85,p.z1+0.62,0); bizSign('Parkinq','#1f5a9a','#ffffff',2.4,0.6,p.ax+1.6,2.05,p.z1+0.62,0);
  [p.z0+4,p.z0+13,p.z0+22,p.z1-2].forEach(function(z){ lamp(p.x1+0.3,z,1); });
  addObst(p.x0-0.2,p.ax-1.25,p.z0,p.z1-0.1); addObst(p.ax+1.25,p.x1+0.2,p.z0,p.z1-0.1); addObst(p.x0-0.2,p.ax-1.25,p.z0-0.3,p.z0); addObst(p.ax+1.25,p.x1+0.2,p.z0-0.3,p.z0); }
function freeSlot(pref){ var fs=PARK.slots.filter(function(s){ return !s.car; }); if(!fs.length) return null; if(pref==='near') fs.sort(function(a,b){ return Math.abs(a.z-18)-Math.abs(b.z-18); }); return fs[pref==='near'?0:Math.floor(Math.random()*Math.min(fs.length,4))]; }
function carArrive(slot,kind,color,deco){ var g=deco?carModel('sedan',0xffffff):takeCar(); if(deco){ [[-0.5],[0.5]].forEach(function(r){ g.add(box(0.06,0.04,2.6,0xd94f7a,r[0],1.02,0.0)); }); g.add(sph(0.22,0xffffff,0,1.0,1.3)); g.add(sph(0.12,0xd94f7a,0.15,1.08,1.35)); scene.add(g); }
  var p=PARK; g.position.set(62,0,21.3); g.visible=true; var c={grp:g, deco:!!deco, slot:slot, state:'arrive', path:[[p.ax,21.3],[p.ax,slot.z],[slot.x,slot.z]], i:0, sp:7, riders:0, boarded:0, guests:[]}; slot.car=c; pcars.push(c); return c; }
function carLeave(c){ var p=PARK; c.state='leave'; c.path=[[p.ax,c.slot.z],[p.ax,23.3],[64,23.3]]; c.i=0; c.slot.car=null; }
function updateParkCars(dt){ for(var i=pcars.length-1;i>=0;i--){ var c=pcars[i], g=c.grp;
    if(c.state==='arrive'||c.state==='leave'){ var tp=c.path[c.i], dx=tp[0]-g.position.x, dz=tp[1]-g.position.z, d=Math.hypot(dx,dz), st=c.sp*dt*(c.i===c.path.length-1?0.5:1);
      if(d>0.01){ var want=Math.atan2(dx,dz); if(c.state==='arrive' && c.i===c.path.length-1) want=c.slot.side<0?-Math.PI/2:Math.PI/2; if(c.state==='leave' && c.i===0) want=c.slot.side<0?-Math.PI/2:Math.PI/2; var da=want-g.rotation.y; while(da>Math.PI) da-=Math.PI*2; while(da<-Math.PI) da+=Math.PI*2; g.rotation.y+=da*Math.min(1,dt*6); }
      if(d<=st){ g.position.set(tp[0],0,tp[1]); c.i++; if(c.i>=c.path.length){ if(c.state==='arrive'){ c.state='parked'; c.unloadT=0.4; } else { if(c.deco){ scene.remove(g); disposeTree(g); } else dropCar(g); pcars.splice(i,1); continue; } } }
      else { g.position.x+=dx/d*st; g.position.z+=dz/d*st; } }
    else if(c.state==='parked'){ if(c.unload && c.unload.length){ c.unloadT-=dt; if(c.unloadT<=0){ c.unloadT=0.35; c.unload.shift()(c); } }
      if(c.boarded>=c.riders && !(c.unload&&c.unload.length) && (c.riders>0 || (c.idleT=(c.idleT||0)+dt)>2)){ c.waitT=(c.waitT||0)+dt; if(c.waitT>0.8) carLeave(c); } } } }
function guestCarSpot(c){ return [PARK.ax, c.slot.z+(c.slot.side<0?-0.2:0.2)]; }
// ---------- after the wedding some guests go for tea on the çayxana 3rd floor (reserved in the offer) ----------
function startTeaLock(){ if(!R.tea || !hallOpen) return; R.teaLock=true; R.teaPhase='lock'; hallTables.forEach(markToy); }
function sendTeaGuests(v,list){ if(!R.tea || !hallOpen){ R.teaLock=false; return; } var seats=hallSeats().filter(function(s){ return !s.c; }), n=Math.min(R.tea,list.length,seats.length);
  for(var i=0;i<n;i++){ var g=list[i], seat=seats[i]; if(g.car) g.car.riders=Math.max(0,g.car.riders-1); dropChar(g.grp); g.L.dead=true; v.customers.splice(v.customers.indexOf(g),1);
    var c=spawnCustomer('toy', seat); if(c){ c.pos.set(g.pos.x,0,g.pos.z); c.afterTea=true; c.toyT=seat.t; c.hold=i*0.35; } }
  R.teaPhase='coming'; R.teaN=n; if(n) showBanner(n+' toy qonağı çayxanaya, 3-cü mərtəbəyə çay içməyə gedir ☕', 3000); else R.teaLock=false; }
function updateTea(){ if(R.teaPhase==='coming'){ var left=customers.filter(function(c){ return c.afterTea; }).length; if(!left){ R.teaPhase='none'; R.teaLock=false; hallTables.forEach(unmarkToy); } } }

// ---------- the big park south of the çayxana ----------
var PK={x0:-17.5,x1:10,z0:25.5,z1:52,cx:-3.75,cz:38.75}, parkPeople=[], parkKids=[], swings=[], seesaw=null, fountainsP=[], parkBenches=[];
function parkFence(ax,az,bx,bz,gaps,g){ var horiz=az===bz, len=horiz?Math.abs(bx-ax):Math.abs(bz-az), dir=horiz?Math.sign(bx-ax):Math.sign(bz-az), cur=0, segs=[];
  var cuts=gaps.slice().sort(function(a,b){ return a[0]-b[0]; }); var start=horiz?Math.min(ax,bx):Math.min(az,bz), end=horiz?Math.max(ax,bx):Math.max(az,bz), c0=start;
  cuts.concat([[end,end]]).forEach(function(gp){ if(gp[0]>c0) segs.push([c0,gp[0]]); c0=Math.max(c0,gp[1]); });
  segs.forEach(function(sg){ var L=sg[1]-sg[0], mid=(sg[0]+sg[1])/2; if(horiz){ g.add(box(L,0.06,0.06,0x1f3d2b,mid,1.05,az)); g.add(box(L,0.06,0.06,0x1f3d2b,mid,0.35,az)); g.add(box(L,0.3,0.12,0xb8b4aa,mid,0.15,az)); for(var x=sg[0];x<=sg[1]+0.01;x+=0.32) g.add(box(0.035,1.0,0.035,0x1f3d2b,x,0.75,az)); for(var x2=sg[0];x2<=sg[1]+0.01;x2+=2.56) g.add(box(0.12,1.3,0.12,0x1f3d2b,x2,0.65,az)); addObst(sg[0],sg[1],az-0.12,az+0.12); }
    else { g.add(box(0.06,0.06,L,0x1f3d2b,ax,1.05,mid)); g.add(box(0.06,0.06,L,0x1f3d2b,ax,0.35,mid)); g.add(box(0.12,0.3,L,0xb8b4aa,ax,0.15,mid)); for(var z=sg[0];z<=sg[1]+0.01;z+=0.32) g.add(box(0.035,1.0,0.035,0x1f3d2b,ax,0.75,z)); for(var z2=sg[0];z2<=sg[1]+0.01;z2+=2.56) g.add(box(0.12,1.3,0.12,0x1f3d2b,ax,0.65,z2)); addObst(ax-0.12,ax+0.12,sg[0],sg[1]); } }); }
function parkBench(x,z,face,g){ var b=new T.Group(); b.add(box(1.6,0.08,0.45,0x8b5a2b,0,0.48,0)); b.add(box(1.6,0.4,0.07,0x8b5a2b,0,0.75,-0.22)); [[-0.65],[0.65]].forEach(function(q){ b.add(box(0.06,0.48,0.45,0x2b2b2b,q[0],0.24,0)); });
  b.position.set(x,0,z); b.rotation.y=face; g.add(b); var fx=Math.sin(face), fz=Math.cos(face); addObst(x-0.85,x+0.85,z-0.85,z+0.85); parkBenches.push({x:x+fx*0.05, z:z+fz*0.05, rot:face, ax:x+fx*1.15, az:z+fz*1.15, used:null}); }
function parkStatue(x,z,g){ g.add(box(1.4,0.3,1.4,0xb8b4aa,x,0.15,z)); g.add(box(1.0,1.3,1.0,0xd8d4cc,x,0.95,z)); g.add(box(1.15,0.1,1.15,0xb8b4aa,x,1.65,z)); addObst(x-0.8,x+0.8,z-0.8,z+0.8);
  var st=makeChar({shirt:0xa6aaa8, pants:0xa6aaa8, skin:0xb0b4b2, hair:0xa6aaa8, shoe:0x9a9e9c, vest:0x9a9e9c, must:true, mustColor:0xa0a4a2}); st.position.set(x,1.7,z); st.rotation.y=Math.PI*0.25; st.scale.set(1.3,1.3,1.3); var A=st.userData.arms; A[0].rotation.x=-2.2; A[0].rotation.z=-0.3; A[1].rotation.x=-0.6; A[1].userData.elbow.rotation.x=-1.0; var bk=box(0.2,0.26,0.05,0x9a9e9c,0,-0.32,0.05); A[1].userData.elbow.add(bk); }
function parkFountain(x,z,r,g){ g.add(cyl(r+0.2,r+0.25,0.55,0xd8d4cc,x,0.27,z,32)); var w=new T.Mesh(new T.CylinderGeometry(r,r,0.05,32), new T.MeshPhongMaterial({color:lin(0x5fa8d3), shininess:120, transparent:true, opacity:0.85})); w.position.set(x,0.5,z); w.userData.keep=true; g.add(w);
  g.add(cyl(0.22,0.3,1.3,0xd8d4cc,x,0.9,z,14)); g.add(cyl(r*0.4,r*0.3,0.15,0xd8d4cc,x,1.55,z,24)); var w2=new T.Mesh(new T.CylinderGeometry(r*0.36,r*0.36,0.04,24), w.material); w2.position.set(x,1.62,z); w2.userData.keep=true; g.add(w2); g.add(cyl(0.08,0.1,0.5,0xd8d4cc,x,1.85,z,10));
  addObst(x-r-0.3,x+r+0.3,z-r-0.3,z+r+0.3); var pts=makePoints(90,0xdaf0ff,0.1,0.8); pts.visible=true; fountainsP.push({x:x,z:z,r:r,pts:pts,seed:Math.random()*10}); }
function swingSet(x,z,g){ [-1.3,1.3].forEach(function(dx){ [-0.5,0.5].forEach(function(dz){ var p=cyl(0.05,0.05,2.4,0xd8382a,x+dx,1.15,z+dz*0.9,8); p.rotation.x=dz*0.35; g.add(p); }); }); var bar=cyl(0.05,0.05,2.8,0xf6c453,x,2.25,z,8); bar.rotation.z=Math.PI/2; g.add(bar);
  addObst(x-1.5,x+1.5,z-0.6,z+0.6);
  [-0.6,0.6].forEach(function(dx,i){ var piv=new T.Group(); piv.position.set(x+dx,2.2,z); var seat=box(0.45,0.05,0.25,0x2a7ab8,0,-1.6,0); piv.add(seat); [-0.2,0.2].forEach(function(cx){ piv.add(new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(cx,0,0),new T.Vector3(cx,-1.6,0)]), new T.LineBasicMaterial({color:0x666666}))); }); scene.add(piv); swings.push({piv:piv, t:Math.random()*5+i, kid:null}); }); }
function buildPark(){ var p=PK, g=new T.Group(), W=p.x1-p.x0, L=p.z1-p.z0;
  g.add(plane(W,L,TEX.grass,p.cx,0.012,(p.z0+p.z1)/2,-Math.PI/2));
  g.add(plane(2.4,L,TEX.stone,p.cx,0.016,(p.z0+p.z1)/2,-Math.PI/2)); g.add(plane(W,2.4,TEX.stone,p.cx,0.017,p.cz,-Math.PI/2));
  var ring=new T.Mesh(new T.RingGeometry(3.3,5.0,40), new T.MeshLambertMaterial({map:texFrom(TEX.stone.image,3,3)})); ring.rotation.x=-Math.PI/2; ring.position.set(p.cx,0.018,p.cz); ring.receiveShadow=true; g.add(ring);
  var sand=new T.Mesh(new T.PlaneGeometry(8.6,9.0), new T.MeshLambertMaterial({color:lin(0xe8d39a)})); sand.rotation.x=-Math.PI/2; sand.position.set(-12.2,0.02,46.6); sand.receiveShadow=true; g.add(sand);
  parkFence(p.x0,p.z0,p.x1,p.z0,[[p.cx-1.3,p.cx+1.3],[6.6,9.2],[-16.6,-14.2]],g); parkFence(p.x0,p.z1,p.x1,p.z1,[],g); parkFence(p.x0,p.z0,p.x0,p.z1,[[p.cz-1.3,p.cz+1.3]],g); parkFence(p.x1,p.z0,p.x1,p.z1,[[p.cz-1.3,p.cz+1.3]],g);
  [p.cx-1.4,p.cx+1.4].forEach(function(x){ g.add(box(0.3,3.0,0.3,0x1f3d2b,x,1.5,p.z0)); }); g.add(box(3.1,0.2,0.3,0x1f3d2b,p.cx,3.0,p.z0));
  parkFountain(p.cx,p.cz,2.4,g); parkFountain(4.5,46.5,1.5,g);
  parkStatue(-11.5,31.0,g); parkStatue(4.5,31.0,g);
  [[p.cx-2.1,29.3,Math.PI/2],[p.cx+2.1,29.3,-Math.PI/2],[p.cx-2.1,33.2,Math.PI/2],[p.cx+2.1,33.2,-Math.PI/2],[p.cx-2.1,44.5,Math.PI/2],[p.cx+2.1,44.5,-Math.PI/2],[p.cx+2.1,49.0,-Math.PI/2],
   [-14.5,p.cz-2.1,0],[-9.5,p.cz-2.1,0],[1.5,p.cz-2.1,0],[6.5,p.cz-2.1,0],[1.5,p.cz+2.1,Math.PI],[6.5,p.cz+2.1,Math.PI],[-9.5,p.cz+2.1,Math.PI],
   [p.cx-5.6,p.cz,Math.PI/2],[p.cx+5.6,p.cz,-Math.PI/2]].forEach(function(b){ parkBench(b[0],b[1],b[2],g); });
  [[-16,27.2],[-13.5,27],[-8.5,27.4],[0.8,27.3],[3.5,27],[8.6,28.5],[8.7,33.5],[-16.2,33.5],[-16.3,30.2],[8.5,43.5],[8.6,50.5],[1,51],[-2,50.8],[-6.3,50.6],[-16.3,36],[0.5,42.8],[-7.6,42.3],[7.2,35.5],[-14.8,40.6],[-7.7,35.3],[0.2,35.2],[-16.4,51]].forEach(function(q){ tree(q[0],q[1],g); addObst(q[0]-0.75,q[0]+0.75,q[1]-0.75,q[1]+0.75); });
  [[-12.5,35.6],[-6.6,29.2],[-0.9,29.2],[6.6,41.8],[2.5,49.6]].forEach(function(q){ bush(q[0],q[1],g); });
  for(var f=0;f<26;f++){ var a=f/26*Math.PI*2; flower(p.cx+Math.cos(a)*5.4,p.cz+Math.sin(a)*5.4,[0xf4a3a3,0xf6c453,0xffffff,0xe57373,0x9575cd][f%5],g); }
  swingSet(-14.2,44.0,g); swingSet(-14.2,48.6,g);
  var sl=new T.Group(); sl.add(box(1.0,0.08,1.0,0x2a9a5a,0,1.6,0)); [[-0.45,-0.45],[0.45,-0.45],[-0.45,0.45],[0.45,0.45]].forEach(function(q){ sl.add(cyl(0.05,0.05,1.6,0xd8382a,q[0],0.8,q[1],6)); }); for(var r2=0;r2<5;r2++) sl.add(box(0.8,0.05,0.06,0xf6c453,0,0.3+r2*0.3,-0.55-r2*0.0)); var ramp=box(0.8,0.06,2.4,0xf6c453,0,0.85,1.5); ramp.rotation.x=0.72; sl.add(ramp); sl.position.set(-9.4,0,43.4); g.add(sl); addObst(-10.0,-8.8,42.8,45.6);
  var sb=new T.Group(); [[0,-1],[0,1],[-1,0],[1,0]].forEach(function(q){ sb.add(box(q[0]?0.15:2.2,0.25,q[0]?2.2:0.15,0x8b5a2b,q[0]*1.05,0.12,q[1]*1.05)); }); sb.position.set(-10.0,0,49.4); g.add(sb);
  scene.add(g); bakeAll(g);
  var ss=new T.Group(); ss.position.set(-12.0,0,46.5); ss.add(box(0.25,0.4,0.25,0x8b5a2b,0,0.2,0)); var plank=new T.Group(); plank.position.y=0.45; plank.add(box(2.8,0.08,0.3,0xd8382a,0,0,0)); [-1.25,1.25].forEach(function(x){ plank.add(box(0.06,0.3,0.06,0xf6c453,x,0.18,0)); }); ss.add(plank); scene.add(ss); seesaw={plank:plank, t:0}; addObst(-13.5,-10.5,46.3,46.7);
  [[p.cx+1.6,30],[p.cx-1.6,36],[p.cx+1.6,46],[-12,p.cz+1.6],[3,p.cz-1.6],[7.5,p.cz+1.6]].forEach(function(q){ lamp(q[0],q[1],1); });
  spawnParkLife(); }
var PARK_WP=[[-3.75,26.5],[-3.75,31],[-3.75,44],[-3.75,50.5],[-16,38.75],[-11,38.75],[3,38.75],[9,38.75],[0.5,35],[-8,35],[-8,42.5],[0.5,42.5],[7.9,26.5],[-15.4,26.5],[-6.5,47],[2,46.5]];
function spawnParkLife(){
  for(var i=0;i<9;i++){ var w=pick(PARK_WP), g=takeChar(); g.position.set(w[0],0,w[1]); parkPeople.push({grp:g, pos:g.position, t:Math.random()*5, state:'walk', target:pick(PARK_WP), path:[], dest:null, moving:false, wait:0, anim:1.9/CFG.customerSpeed}); }
  swings.forEach(function(s,i){ var k=makeChar({shirt:pick([0xe2574c,0x4cc26b,0x3f7fbf,0xf6c453,0xd94f7a]), pants:pick([0x2f3e5c,0x5c6168]), hair:pick(HAIRS), female:i%2===1, scale:0.62}); scene.remove(k); s.piv.add(k); k.scale.set(0.6,0.6,0.6); k.position.set(0,-1.6-0.25,0.0); k.rotation.y=0; s.kid=k; var root=k.userData.root; root.position.y=-0.4; k.userData.legs.forEach(function(h){ h.rotation.x=-Math.PI/2; h.userData.knee.rotation.x=Math.PI/2; }); k.userData.arms.forEach(function(a){ a.rotation.x=-2.6; }); });
  [-1.15,1.15].forEach(function(x,i){ var k=makeChar({shirt:pick([0xe2574c,0x4cc26b,0x3f7fbf,0xf6c453]), pants:0x2f3e5c, hair:pick(HAIRS), female:i===0, scale:0.62}); scene.remove(k); seesaw.plank.add(k); k.scale.set(0.6,0.6,0.6); k.position.set(x,-0.2,0); k.rotation.y=x<0?Math.PI/2:-Math.PI/2; k.userData.root.position.y=-0.4; k.userData.legs.forEach(function(h){ h.rotation.x=-Math.PI/2; h.userData.knee.rotation.x=Math.PI/2; }); k.userData.arms.forEach(function(a){ a.rotation.x=-0.9; }); });
  for(var j=0;j<4;j++){ var k2=makeChar({shirt:pick([0xe2574c,0x4cc26b,0x3f7fbf,0xf6c453,0xd94f7a]), pants:pick([0x2f3e5c,0x5c6168,0x9c8a6b]), hair:pick(HAIRS), female:j%2===0, scale:0.62}); k2.scale.set(0.6,0.6,0.6); parkKids.push({grp:k2, pos:k2.position, t:j*1.3, ang:j*1.57, r:2.2+j*0.3, cx:-11.6, cz:46.6+(j%2?1.8:-1.6), anim:1.4}); k2.position.set(-11.6,0,46.6); }
  [[-7.4,45.5,-Math.PI/2],[-7.4,48.2,-Math.PI/2]].forEach(function(q){ var g=takeChar(); g.position.set(q[0],0,q[1]); g.rotation.y=q[2]; parkPeople.push({grp:g, pos:g.position, t:0, state:'watch', moving:false}); }); }
function updatePark(dt){ var tt=S.elapsed;
  fountainsP.forEach(function(f){ var a=f.pts.geometry.attributes.position.array, n=a.length/3, h=f.r>2?2.1:1.5; for(var i=0;i<n;i++){ var ph=((tt*0.6+i/n+f.seed)%1), ang=i*2.399, rr=ph*f.r*0.85; a[i*3]=f.x+Math.cos(ang)*rr; a[i*3+1]=h+0.2+ph*1.6-ph*ph*(h+1.4); a[i*3+2]=f.z+Math.sin(ang)*rr; } f.pts.geometry.attributes.position.needsUpdate=true; if(player){ var ppu=window.innerHeight/(cam.top-cam.bottom)*cam.zoom; f.pts.material.size=0.12*ppu; } });
  swings.forEach(function(s){ s.t+=dt; s.piv.rotation.x=Math.sin(s.t*2.1)*0.55; });
  if(seesaw){ seesaw.t+=dt; seesaw.plank.rotation.z=Math.sin(seesaw.t*1.6)*0.28; }
  parkKids.forEach(function(k){ k.t+=dt; var w=0.75+0.15*Math.sin(k.t*0.7); k.ang+=dt*w; k.anim=(w*k.r*0.85/CFG.customerSpeed)/0.6; k.pos.set(k.cx+Math.cos(k.ang)*k.r, 0, k.cz+Math.sin(k.ang)*k.r*0.6); k.grp.rotation.y=Math.atan2(-Math.sin(k.ang)*k.r, Math.cos(k.ang)*k.r*0.6); k.moving=true; bobChar(k,dt); });
  parkPeople.forEach(function(m){ m.t+=dt;
    if(m.state==='walk'){ if(nav(m,m.target[0],m.target[1],1.9,dt)){ if(Math.random()<0.45){ var fb=parkBenches.filter(function(b){ return !b.used; }); if(fb.length){ m.bench=pick(fb); m.bench.used=m; m.state='toBench'; return; } } m.target=pick(PARK_WP); } }
    else if(m.state==='toBench'){ if(nav(m,m.bench.ax,m.bench.az,1.9,dt)){ m.state='sit'; m.wait=8+Math.random()*10; m.pos.set(m.bench.x,0,m.bench.z); m.grp.rotation.y=m.bench.rot; m.seated=true; m.seat={lift:0.05}; m.moving=false; } }
    else if(m.state==='sit'){ m.wait-=dt; if(m.wait<=0){ m.seated=false; m.seat=null; m.grp.userData.root.position.y=0; m.pos.set(m.bench.ax,0,m.bench.az); m.bench.used=null; m.bench=null; m.state='walk'; m.target=pick(PARK_WP); } }
    else if(m.state==='watch'){ m.moving=false; }
    bobChar(m,dt); }); }

// ---------- Supermarket: starts as a mini market and grows ----------
var MK_CATS=[{id:'bread',name:'Çörək',ic:'🍞',col:0xd9a95a,price:2},{id:'milk',name:'Süd',ic:'🥛',col:0xf2f2f2,price:2},{id:'cheese',name:'Pendir',ic:'🧀',col:0xf2d06a,price:4},{id:'fruit',name:'Meyvə',ic:'🍎',col:0xd8382a,price:3},
  {id:'veg',name:'Tərəvəz',ic:'🥕',col:0xe8822a,price:2},{id:'juice',name:'İçki',ic:'🧃',col:0x7cb342,price:3},{id:'water',name:'Su',ic:'💧',col:0x6ab0e0,price:1},{id:'choc',name:'Şirniyyat',ic:'🍫',col:0x6b3a1e,price:3},
  {id:'can',name:'Konserv',ic:'🥫',col:0xb8352f,price:3},{id:'meat',name:'Ət',ic:'🍗',col:0xc0574a,price:6},{id:'tea',name:'Çay-kofe',ic:'☕',col:0x3a2416,price:4},{id:'clean',name:'Təmizlik',ic:'🧴',col:0x3f7fbf,price:4}];
var MK_STAGES=[{x1:24.5,name:'Mini market',units:[20.0,22.8],desks:[18.4],doors:[[20.0,21.6]]},{x1:31,name:'Market',units:[25.6,28.4],desks:[26.4],doors:[[29.0,30.6]]},{x1:38,name:'Supermarket',units:[31.4,34.4],desks:[32.4,35.4],doors:[[36.0,37.6]]}];
var MK_UNL=[['cat',2,'Pendir rəfi',300,9],['cat',3,'Meyvə rəfi',400,9],['stk',0,'Yükləyici',500,10],['stage',1,'Mağazanı genişləndir: Market',1500,10],['cat',4,'Tərəvəz rəfi',600,11],['desk',1,'İkinci kassa',800,11],['cat',5,'İçki rəfi',700,11],['cat',6,'Su rəfi',700,12],['stk',1,'İkinci yükləyici',900,12],
  ['stage',2,'Mağazanı genişləndir: Supermarket',3000,13],['cat',7,'Şirniyyat rəfi',900,13],['desk',2,'Üçüncü kassa',1200,13],['cat',8,'Konserv rəfi',1000,14],['cat',9,'Ət rəfi',1400,14],['desk',3,'Dördüncü kassa',1600,15],['cat',10,'Çay-kofe rəfi',1300,15],['cat',11,'Təmizlik rəfi',1300,16],['stk',2,'Üçüncü yükləyici',1500,16]];
// ---------- product shapes per category ----------
function pg(geo,col,x,y,z){ geo.translate(x,y,z); return colored(geo,col); }
function mkProdGeo(i){ var a=[], id=MK_CATS[i].id, j;
  if(id==='bread'){ for(j=0;j<3;j++){ var l=new T.SphereGeometry(0.1,12,8); l.scale(0.75,0.55,1.6); a.push(pg(l,0xc98a3a,0,0.06,-0.26+j*0.26)); for(var k=0;k<3;k++){ var c=new T.BoxGeometry(0.1,0.008,0.012); c.rotateY(0.5); a.push(pg(c,0x8a5420,0,0.115,-0.32+j*0.26+k*0.05)); } } }
  else if(id==='milk'){ for(j=0;j<4;j++){ var zz=-0.3+j*0.2; a.push(pg(new T.BoxGeometry(0.1,0.18,0.1),0xf6f6f2,0,0.09,zz)); a.push(pg(new T.BoxGeometry(0.102,0.05,0.102),0x3f7fbf,0,0.07,zz)); var t=new T.CylinderGeometry(0.0,0.072,0.05,4); t.rotateY(Math.PI/4); a.push(pg(t,0xf6f6f2,0,0.205,zz)); a.push(pg(new T.CylinderGeometry(0.015,0.015,0.02,8),0x3f7fbf,0.02,0.22,zz)); } }
  else if(id==='cheese'){ [-0.22,0.12].forEach(function(z){ a.push(pg(new T.CylinderGeometry(0.11,0.11,0.08,18),0xf2c84a,0,0.04,z)); a.push(pg(new T.CylinderGeometry(0.112,0.112,0.015,18),0xd8382a,0,0.075,z)); }); var w=new T.CylinderGeometry(0.1,0.1,0.07,10,1,false,0,Math.PI/3); a.push(pg(w,0xf6d86a,0,0.035,0.34)); }
  else if(id==='fruit'||id==='veg'){ a.push(pg(new T.BoxGeometry(0.24,0.06,0.78),0x8b5a2b,0,0.03,0)); for(j=0;j<8;j++){ var zz2=-0.3+(j>>1)*0.2, xx=(j%2?0.055:-0.055);
      if(id==='fruit') a.push(pg(new T.SphereGeometry(0.055,10,8),[0xd8382a,0x7cb342,0xf2c14e,0xd8382a][j%4],xx,0.1,zz2));
      else if(j%3===0) a.push(pg(new T.SphereGeometry(0.07,10,8),0x7cb342,xx,0.11,zz2)); else { var cr=new T.ConeGeometry(0.025,0.16,8); cr.rotateZ(Math.PI/2); a.push(pg(cr,0xe8822a,xx,0.08,zz2)); a.push(pg(new T.ConeGeometry(0.02,0.05,5),0x4f9a3a,xx-0.09,0.08,zz2)); } } }
  else if(id==='juice'){ for(j=0;j<4;j++){ var zz3=-0.3+j*0.2, col=[0xf2a23a,0x7cb342,0xd8382a,0xf2a23a][j]; a.push(pg(new T.BoxGeometry(0.08,0.15,0.06),col,0,0.075,zz3)); a.push(pg(new T.BoxGeometry(0.082,0.04,0.062),0xffffff,0,0.1,zz3)); a.push(pg(new T.CylinderGeometry(0.005,0.005,0.06,4),0xffffff,0.02,0.17,zz3)); } }
  else if(id==='water'){ for(j=0;j<4;j++){ var zz4=-0.3+j*0.2; a.push(pg(new T.CylinderGeometry(0.04,0.04,0.18,10),0x9fd0ec,0,0.09,zz4)); a.push(pg(new T.CylinderGeometry(0.028,0.04,0.04,10),0x9fd0ec,0,0.2,zz4)); a.push(pg(new T.CylinderGeometry(0.018,0.018,0.025,8),0x1f5a9a,0,0.23,zz4)); a.push(pg(new T.CylinderGeometry(0.041,0.041,0.05,10),0x1f5a9a,0,0.09,zz4)); } }
  else if(id==='choc'){ for(j=0;j<6;j++){ var zz5=-0.25+(j%3)*0.25; a.push(pg(new T.BoxGeometry(0.11,0.022,0.2),[0x6b3a1e,0x7a1f2b,0x1f3a93][j%3],0,0.012+Math.floor(j/3)*0.024,zz5)); a.push(pg(new T.BoxGeometry(0.112,0.024,0.04),0xf2d06a,0,0.012+Math.floor(j/3)*0.024,zz5)); } }
  else if(id==='can'){ for(j=0;j<6;j++){ var zz6=-0.27+(j%3)*0.27, yy=Math.floor(j/3)*0.11; a.push(pg(new T.CylinderGeometry(0.045,0.045,0.1,12),0xb8352f,0,0.05+yy,zz6)); a.push(pg(new T.CylinderGeometry(0.046,0.046,0.04,12),0xf6f2ea,0,0.05+yy,zz6)); a.push(pg(new T.CylinderGeometry(0.044,0.044,0.006,12),0xc8ccd0,0,0.103+yy,zz6)); } }
  else if(id==='meat'){ [-0.2,0.2].forEach(function(z){ a.push(pg(new T.BoxGeometry(0.2,0.03,0.3),0xf6f6f2,0,0.015,z)); var m=new T.SphereGeometry(0.07,10,8); m.scale(1,0.5,1.4); a.push(pg(m,0xc0574a,0,0.045,z)); var d=new T.SphereGeometry(0.035,8,6); a.push(pg(d,0xd88a6a,0.04,0.05,z+0.08)); a.push(pg(new T.BoxGeometry(0.202,0.002,0.302),0xd8eef6,0,0.08,z)); }); }
  else if(id==='tea'){ a.push(pg(new T.BoxGeometry(0.1,0.16,0.14),0x7a1f2b,0,0.08,-0.26)); a.push(pg(new T.BoxGeometry(0.102,0.04,0.142),0xd9ab3c,0,0.12,-0.26)); a.push(pg(new T.BoxGeometry(0.1,0.16,0.14),0x2a7a5a,0,0.08,-0.05)); a.push(pg(new T.CylinderGeometry(0.055,0.055,0.15,12),0x3a2416,0,0.075,0.18)); a.push(pg(new T.CylinderGeometry(0.058,0.058,0.03,12),0xd9ab3c,0,0.16,0.18)); a.push(pg(new T.CylinderGeometry(0.05,0.05,0.12,12),0x1b1b1b,0,0.06,0.34)); }
  else { for(j=0;j<3;j++){ var zz7=-0.25+j*0.22; a.push(pg(new T.CylinderGeometry(0.04,0.045,0.18,10),[0x3f7fbf,0x7cb342,0xd94f7a][j],0,0.09,zz7)); a.push(pg(new T.BoxGeometry(0.03,0.05,0.03),0xf6f6f2,0,0.205,zz7)); a.push(pg(new T.BoxGeometry(0.02,0.02,0.05),0xf6f6f2,0,0.22,zz7+0.03)); } a.push(pg(new T.BoxGeometry(0.12,0.16,0.1),0xf2a23a,0,0.08,0.35)); }
  return mergeColored(a); }
var MK_PROD=MK_CATS.map(function(c,i){ return mkProdGeo(i); });
MK_CATS.forEach(function(c,i){ DISH_GEOS['mk'+i]=(function(){ var a=[]; var b=new T.BoxGeometry(0.18,0.07,0.14); b.translate(0,0.035,0); a.push(colored(b,0x8b5a2b)); var pr=MK_PROD[i].clone(); pr.scale(0.36,0.36,0.17); pr.translate(0,0.07,0); a.push(pr); return mergeColored(a); })(); });
var MK=null, MKZ={z0:27,z1:41,shelf0:31.2,shelf1:35.2,pal:39.3,deskZ:28.6};
function mkUnitX(i){ var k=Math.floor(i/2), all=[]; MK_STAGES.forEach(function(s){ all=all.concat(s.units); }); return all[k]; }
function mkFace(i){ var ux=mkUnitX(i), side=i%2?1:-1; return {cat:i, x:ux+side*0.3, side:side, sx:ux+side*0.85, z:(MKZ.shelf0+MKZ.shelf1)/2, stock:6, cap:12, boxes:[]}; }
function mkPalX(i){ return 17.9+i*1.68; }
function mkShell(){ var M_=MK, s=MK_STAGES[M_.stage], x0=17, x1=s.x1, z0=MKZ.z0, z1=MKZ.z1, W=x1-x0, L=z1-z0, cx=(x0+x1)/2, cz=(z0+z1)/2;
  if(M_.shell){ scene.remove(M_.shell); M_.shellObst.forEach(removeObst); if(M_.roof){ scene.remove(M_.roof); } if(M_.signs) M_.signs.forEach(function(m){ scene.remove(m); }); }
  var g=new T.Group(), ob=[]; M_.shell=g; M_.shellObst=ob;
  g.add(plane(W,L,TEXV.tile,cx,0.014,cz,-Math.PI/2));
  var doors=[]; for(var k=0;k<=M_.stage;k++) doors=doors.concat(MK_STAGES[k].doors); doors.sort(function(a,b){ return a[0]-b[0]; });
  var cur=x0; doors.concat([[x1,x1]]).forEach(function(d){ if(d[0]>cur){ var w=d[0]-cur; g.add(box(w,3.4,0.2,0xf2f2f2,cur+w/2,1.7,z0)); g.add(box(w-0.1,1.9,0.05,0x9fd0e6,cur+w/2,1.6,z0-0.11)); ob.push(addObst(cur,d[0],z0-0.15,z0+0.15)); } cur=Math.max(cur,d[1]); });
  doors.forEach(function(d){ g.add(box(d[1]-d[0]+0.2,0.4,0.25,0xf2f2f2,(d[0]+d[1])/2,3.2,z0)); var mat=box(d[1]-d[0],0.02,1.2,0x3a3f44,(d[0]+d[1])/2,0.02,z0-0.6,false); g.add(mat); });
  g.add(box(W+0.4,0.35,1.6,0xd8382a,cx,3.55,z0-0.6));
  g.add(box(0.2,3.4,L,0xf2f2f2,x0,1.7,cz)); ob.push(addObst(x0-0.15,x0+0.15,z0,z1));
  g.add(box(W,1.2,0.2,0xf2f2f2,cx,0.6,z1)); ob.push(addObst(x0,x1,z1-0.15,z1+0.15));
  g.add(box(0.2,1.2,L,0xf2f2f2,x1,0.6,cz)); ob.push(addObst(x1-0.15,x1+0.15,z0,z1));
  scene.add(g); bakeAll(g);
  var roof=new T.Mesh(new T.PlaneGeometry(W,L), new T.MeshPhongMaterial({color:lin(0xd8eef6), transparent:true, opacity:0.12, depthWrite:false, side:T.DoubleSide})); roof.rotation.x=-Math.PI/2; roof.position.set(cx,3.4,cz); scene.add(roof); M_.roof=roof;
  M_.signs=[bizSign(s.name,'#d8382a','#ffffff',Math.min(W-0.6,6),1.0,cx,4.3,z0-0.15,Math.PI), bizSign(s.name,'#d8382a','#ffffff',4.2,0.9,x1+0.12,1.0,cz,Math.PI/2)];
  M_.signs[0].rotation.y=0; M_.signs[0].position.z=z0-1.42; }
function mkBuildUnit(k){ var x=MK_STAGES.reduce(function(a,s){ return a.concat(s.units); },[])[k], g=new T.Group(), L=MKZ.shelf1-MKZ.shelf0, cz=(MKZ.shelf0+MKZ.shelf1)/2;
  g.add(box(0.6,0.1,L,0x8a8f94,0,0.05,0)); g.add(box(0.08,1.7,L,0xd9d4c7,0,0.85,0)); [0.45,0.95,1.45].forEach(function(y){ g.add(box(0.6,0.04,L,0xc8ccd0,0,y,0)); }); g.add(box(0.62,0.3,L+0.1,0x2a7a5a,0,1.85,0));
  g.position.set(x,0,cz); scene.add(g); bakeAll(g); addObst(x-0.32,x+0.32,MKZ.shelf0,MKZ.shelf1); }
function mkFaceBoxes(f){ var c=MK_CATS[f.cat]; for(var j=0;j<6;j++){ var lv=Math.floor(j/2), slot=j%2, z=MKZ.shelf0+1.0+slot*((MKZ.shelf1-MKZ.shelf0)-2.0); var m=new T.Mesh(MK_PROD[f.cat], ITEM_MAT); m.position.set(f.x+f.side*0.16,0.47+lv*0.5,z); m.scale.set(1.15,1.15,1.6); m.castShadow=true; scene.add(m); f.boxes.push(m); }
  var lb=lbl('shelf',c.ic+' '+c.name); f.L=addLabel(lb,new T.Vector3(f.x+f.side*0.2,2.25,(MKZ.shelf0+MKZ.shelf1)/2)); f.el=lb; mkFaceRefresh(f); }
function mkFaceRefresh(f){ f.boxes.forEach(function(m,j){ m.visible=j*2<f.stock; }); if(f.el) f.el.classList.toggle('empty', f.stock<=0); }
function mkPallet(i){ var c=MK_CATS[i], x=mkPalX(i), g=new T.Group(); g.add(box(1.1,0.14,0.9,0x8b5a2b,0,0.07,0)); [-0.26,0.26].forEach(function(cx2){ g.add(box(0.5,0.28,0.84,0xb08a5a,cx2,0.28,0)); g.add(box(0.52,0.04,0.86,0x8b5a2b,cx2,0.42,0)); var pm=new T.Mesh(MK_PROD[i], ITEM_MAT); pm.position.set(cx2,0.44,0); pm.scale.set(1.9,1.3,1.05); pm.userData.keep=true; pm.castShadow=true; g.add(pm); }); g.position.set(x,0,MKZ.pal); scene.add(g); bakeAll(g); addObst(x-0.55,x+0.55,MKZ.pal-0.45,MKZ.pal+0.45);
  MK.pallets[i]={x:x, z:MKZ.pal-0.95, cat:i}; }
function mkDesk(k){ var dx=MK_STAGES.reduce(function(a,s){ return a.concat(s.desks); },[])[k], g=new T.Group(), z=MKZ.deskZ; g.add(box(0.7,0.85,1.5,0x3a3f44,0,0.425,0)); g.add(box(0.72,0.04,1.52,0x1b1b1b,0,0.87,0)); g.add(box(0.3,0.25,0.3,0x1b1b1b,0,1.02,-0.45)); g.add(box(0.12,0.9,0.12,0xd8382a,0.25,1.3,0.6)); g.add(sph(0.08,0xffffff,0.25,1.8,0.6));
  g.position.set(dx,0,z); scene.add(g); bakeAll(g); addObst(dx-0.36,dx+0.36,z-0.76,z+0.76);
  var cg=makeChar({female:k%2===0, shirt:0xd8382a, pants:0x2b2b2b, hair:pick(HAIRS), apron:0xd8382a}); var ch=new T.Group(); chair(ch,0,0,-1,0); ch.position.set(dx-0.75,0,z); scene.add(ch); bakeAll(ch); cg.position.set(dx-0.75,0,z); cg.rotation.y=Math.PI/2;
  addObst(dx-1.05,dx-0.4,z-0.4,z+0.4); MK.desks.push({x:dx, z:z, pay:{x:dx+0.8,z:z}, queue:[], cashier:{grp:cg, pos:cg.position, t:0, seated:true, state:'sit', kassir:true, count:0}, t:0}); }
function mkStocker(k){ var g=makeChar({shirt:0x2a7a5a, pants:0x2b2b2b, hat:'kepka', hatColor:0x2a7a5a, hair:pick(HAIRS.slice(0,3)), tray:true}); g.position.set(18.5+k,0,37.5); MK.stockers.push({grp:g, pos:g.position, items:[], state:'idle', t:0, path:[], dest:null, moving:false, target:null}); }
function mkApply(u,silent){ var M_=MK; if(u[0]==='cat'){ var f=mkFace(u[1]); M_.faces[u[1]]=f; if(M_.units<=Math.floor(u[1]/2)){ mkBuildUnit(Math.floor(u[1]/2)); M_.units=Math.floor(u[1]/2)+1; } mkFaceBoxes(f); mkPallet(u[1]); }
  else if(u[0]==='stage'){ M_.stage=u[1]; mkShell(); }
  else if(u[0]==='desk') mkDesk(u[1]); else if(u[0]==='stk') mkStocker(u[1]);
  if(!silent){ SFX.unlock(); showBanner(M_.b.name+': '+u[2]+' açıldı'); } }
function mkTilePos(u){ if(u[0]==='cat'){ var f=mkFace(u[1]); return [f.sx,(MKZ.shelf0+MKZ.shelf1)/2]; } if(u[0]==='stage'){ return [MK_STAGES[u[1]].x1-1.6, 30.2]; } if(u[0]==='desk'){ var dx=MK_STAGES.reduce(function(a,s){ return a.concat(s.desks); },[])[u[1]]; return [dx+0.9,29.9]; } return [19+u[1]*1.4,37.4]; }
function mkShowTile(){ var i=MK.st.unl||0; if(i>=MK_UNL.length){ MK.tile=null; return; } var u=MK_UNL[i], p=mkTilePos(u);
  var g=new T.Group(); var base=box(1.9,0.1,1.9,0xf6c453,0,0.05,0), fill=box(1.7,0.06,1.7,0xfff0bf,0,0.11,0,false); fill.scale.x=0.001; g.add(base); g.add(fill); g.position.set(p[0],0,p[1]); scene.add(g);
  var el=lbl('tile',''); var tl={def:{name:u[2], price:u[3], lvl:u[4]}, biz:true, grp:g, fill:fill, remaining:u[3], el:el, L:addLabel(el,new T.Vector3(p[0],0.9,p[1])), locked:true, u:u}; MK.tile=tl; refreshBizTile(tl); }
function mkUnlockDone(){ var tl=MK.tile; scene.remove(tl.grp); tl.L.dead=true; MK.tile=null; mkApply(tl.u,false); MK.st.unl=(MK.st.unl||0)+1; buzz([20,30,40]); confetti({x:tl.grp.position.x,z:tl.grp.position.z}); setTimeout(function(){ addXP(5); },2200); mkShowTile(); save(); }
function buildMarket(b,silent){ var st=bizState(b.id); if(st.unl===undefined) st.unl=0;
  MK={b:b, st:st, stage:0, units:0, faces:[], pallets:[], desks:[], stockers:[], shoppers:[], tile:null, spawnT:2, shell:null, shellObst:[]}; mkShell();
  [0,1].forEach(function(i){ var f=mkFace(i); MK.faces[i]=f; }); mkBuildUnit(0); MK.units=1; mkFaceBoxes(MK.faces[0]); mkFaceBoxes(MK.faces[1]); mkPallet(0); mkPallet(1); mkDesk(0);
  MK.kassa=makeVKassa(MK,23.4,27.65); vRefreshKassa(MK);
  b.board=[16.0,26.0]; var bd=new T.Group(); bd.add(cyl(0.06,0.08,1.6,0x3d5466,16.0,0.8,26.0,8)); var gear=new T.Mesh(new T.TorusGeometry(0.22,0.08,8,8), M(0xf6c453)); gear.position.set(16.0,1.75,26.0); bd.add(gear); scene.add(bd); bakeAll(bd);
  for(var u=0;u<st.unl && u<MK_UNL.length;u++) mkApply(MK_UNL[u],true);
  mkShowTile(); gridDirty=true; }
function mkShopperSpawn(){ var avail=MK.faces.map(function(f,i){ return f?i:-1; }).filter(function(i){ return i>=0; }); if(!avail.length) return;
  var n=1+Math.floor(Math.random()*Math.min(3,avail.length)), want=[]; while(want.length<n){ var c=pick(avail); if(want.indexOf(c)<0) want.push(c); }
  var sp=pick(MK.b.spawns), g=takeChar(); g.position.set(sp[0],0,sp[1]); var doors=[]; for(var k=0;k<=MK.stage;k++) doors=doors.concat(MK_STAGES[k].doors); var d=pick(doors), door=[(d[0]+d[1])/2, MKZ.z0];
  var c2={grp:g, pos:g.position, want:want, got:[], state:'in', door:door, exit:sp===MK.b.spawns[0]?MK.b.spawns[1]:MK.b.spawns[0], t:0, wait:0, path:[], dest:null, moving:false, html:'', pay:0, unhappy:false};
  c2.el=lbl('bubble',''); c2.el.style.display='none'; c2.L=addLabel(c2.el,null,function(v){ return v.set(c2.pos.x, 2.3, c2.pos.z); }); c2.L.bub=true; MK.shoppers.push(c2); }
function mkUpdateShopper(c,dt){ var sp=CFG.customerSpeed, f;
  if(c.state==='in'){ if(nav(c,c.door[0],c.door[1]+0.8,sp,dt)) c.state='shop'; }
  else if(c.state==='shop'){ if(!c.want.length){ var desks=MK.desks.slice().sort(function(a,b){ return a.queue.length-b.queue.length; }); c.desk=desks[0]; c.desk.queue.push(c); c.state='queue'; } else { f=MK.faces[c.want[0]]; if(!c.fz) c.fz=MKZ.shelf0+0.6+Math.random()*(MKZ.shelf1-MKZ.shelf0-1.2); if(nav(c,f.sx,c.fz,sp,dt)){ c.grp.rotation.y=f.side>0?-Math.PI/2:Math.PI/2; c.wait+=dt; if(f.stock>0 && c.wait>0.6){ f.stock--; mkFaceRefresh(f); c.got.push(c.want.shift()); c.pay+=MK_CATS[f.cat].price; c.wait=0; c.fz=0; } else if(f.stock<=0 && c.wait>7){ c.want.shift(); c.unhappy=true; c.wait=0; c.fz=0; } } } }
  else if(c.state==='queue'){ var qi=c.desk.queue.indexOf(c), tp=c.desk.pay; if(nav(c,tp.x,tp.z+qi*0.8,sp,dt)){ c.grp.rotation.y=-Math.PI/2; } }
  else if(c.state==='out'){ if(nav(c,c.door[0],c.door[1]-0.9,sp,dt)){ c.state='leave'; } }
  else if(c.state==='leave'){ if(nav(c,c.exit[0],c.exit[1],sp,dt)){ dropChar(c.grp); c.L.dead=true; MK.shoppers.splice(MK.shoppers.indexOf(c),1); return; } }
  bobChar(c,dt); var html=''; if(c.state==='shop'&&c.want.length){ html=c.want.map(function(i){ return '<span class="emo">'+MK_CATS[i].ic+'</span>'; }).join('')+'<span class="face">'+(c.unhappy?'😐':'🙂')+'</span>'; } else if(c.state==='queue') html='<span class="emo">🛒</span>'+c.got.length; else if(c.state==='out' && c.paid) html='<span class="face">😊</span>';
  if(html!==c.html){ c.html=html; c.el.innerHTML=html; c.el.style.display=html?'flex':'none'; c.L.dirty=true; } }
function mkUpdateDesk(d,dt){ var c=d.queue[0], cs=d.cashier; bobChar(cs,dt); if(!c) return; if(dist(c.pos,d.pay)>0.4) return; d.t+=dt; cs.count=1; if(d.t>=0.8+0.5*c.got.length){ d.t=0; d.queue.shift();
    if(c.got.length){ var st=MK.st, amt=Math.max(1,Math.round(c.pay*(1+0.4*st.lv[0])*levelMul()*boostMul())); vAddCash(MK,amt,c.pos); floatText(c.pos,'+'+amt+' ₼',false); SFX.coin(); S.served++; S.st.served=(S.st.served||0)+1; addXP(1); c.paid=true; } c.state='out'; cs.count=0; } }
function mkUpdateStocker(w,dt){ var sp=CFG.workerSpeed*(CFG.waiterMul[S.up.speed]||1); w.t+=dt;
  if(w.state==='idle'){ var best=null, br=0.6; MK.faces.forEach(function(f){ if(!f) return; var r=f.stock/f.cap; if(r<br && !MK.stockers.some(function(o){ return o!==w && o.target===f; })){ br=r; best=f; } }); if(best){ w.target=best; w.state='fetch'; } else nav(w,18.6+MK.stockers.indexOf(w)*2.0,37.4,sp,dt); }
  else if(w.state==='fetch'){ var pl=MK.pallets[w.target.cat]; if(nav(w,pl.x,pl.z,sp,dt)){ w.grp.rotation.y=0; w.actT=(w.actT||0)+dt; if(w.actT>0.25 && w.items.length<3){ w.actT=0; var it=makeItem('mk'+w.target.cat); w.items.push(it); layStack(w.items,w.grp.userData.root,CARRY); } if(w.items.length>=3) w.state='fill'; } }
  else if(w.state==='fill'){ var f=w.target; if(nav(w,f.sx,(MKZ.shelf0+MKZ.shelf1)/2,sp,dt)){ w.grp.rotation.y=f.side>0?-Math.PI/2:Math.PI/2; w.actT=(w.actT||0)+dt; if(w.actT>0.35){ w.actT=0; if(w.items.length && f.stock<f.cap){ var it2=w.items.pop(); if(it2.mesh.parent) it2.mesh.parent.remove(it2.mesh); f.stock=Math.min(f.cap,f.stock+4); mkFaceRefresh(f); } else { w.items.forEach(function(it3){ if(it3.mesh.parent) it3.mesh.parent.remove(it3.mesh); }); w.items=[]; w.target=null; w.state='idle'; } } } }
  bobChar(w,dt); }
function mkPlayer(p,dt){ if(!MK) return;
  if(p.pickT<=0 && p.items.length<CFG.padnosCap[S.up.padnos]){ MK.pallets.forEach(function(pl){ if(pl && p.pickT<=0 && Math.abs(p.pos.x-pl.x)<0.75 && Math.abs(p.pos.z-pl.z)<0.9){ var it=makeItem('mk'+pl.cat); p.items.push(it); layStack(p.items,p.grp.userData.root,CARRY); p.pickT=0.15; SFX.clink(); } }); }
  if(p.dropT<=0 && p.items.length){ MK.faces.forEach(function(f){ if(!f || p.dropT>0) return; if(Math.abs(p.pos.x-f.sx)<0.75 && p.pos.z>MKZ.shelf0-0.3 && p.pos.z<MKZ.shelf1+0.3 && f.stock<f.cap){ var tp='mk'+f.cat; if(hasType(p.items,tp)){ var it=takeLast(p.items,tp); if(it.mesh.parent) it.mesh.parent.remove(it.mesh); layStack(p.items,p.grp.userData.root,CARRY); f.stock=Math.min(f.cap,f.stock+4); mkFaceRefresh(f); p.dropT=0.15; SFX.pop(); S.st.mkfill=(S.st.mkfill||0)+1; } } }); }
  if(p.collectT<=0 && MK.st.cash>=1 && dist(p.pos,MK.kassa.pos)<1.4){ var a=Math.floor(MK.st.cash); MK.st.cash=0; S.money+=a; S.st.coins=(S.st.coins||0)+a; S.st.bizcash=(S.st.bizcash||0)+a; bumpMoney(); flyCoins(MK.kassa.pos,p.pos,Math.min(8,1+Math.floor(a/20))); floatText(MK.kassa.pos,'+'+a+' ₼',true); SFX.coin(); p.collectT=0.4; vRefreshKassa(MK); }
  if(MK.tile) pourInto(MK.tile,p,dt,mkUnlockDone); }
function updateMarket(dt){ if(!MK) return; var st=MK.st; MK.spawnT-=dt; var cap=4+MK.desks.length*3+MK.faces.filter(Boolean).length; if(MK.spawnT<=0){ MK.spawnT=5/(1+0.35*st.lv[1])/(1+0.3*MK.stage); if(MK.shoppers.length<cap) mkShopperSpawn(); }
  for(var i=MK.shoppers.length-1;i>=0;i--) mkUpdateShopper(MK.shoppers[i],dt);
  MK.desks.forEach(function(d){ mkUpdateDesk(d,dt); }); MK.stockers.forEach(function(w){ mkUpdateStocker(w,dt); }); spread(MK.stockers,0.6);
  if(MK.tile && MK.tile.locked && S.level>=MK.tile.def.lvl) refreshBizTile(MK.tile); }

// ---------- 4th floor: "Səma çayxanası" — taxt platforms, its own samovars, çayçılar and waiters ----------
var skyOpen=false, n1Bld=null, eyvanNorthObst=null, SKY_DY=5.2, SKY={x0:-16.95,x1:8.35,z0:-23.95,z1:-12.95, cz:-20.4, uz:-21.75, pz:-19.3, sz:-23.0}, skySam=[], skyVar={}, SKY_TAXT=[[-14,-16.5],[-10,-16.5],[-6,-16.5],[-2,-16.5],[2,-16.5],[6,-16.5]];
function skyH(x,z){ if(!skyOpen) return -1; if(z>-12.85&&z<-11.65){ if(x>1.9&&x<7.0) return ROOF_Y+SKY_DY*Math.max(0,Math.min(1,(7.0-x)/5.1)); if(x>0.2&&x<=1.9) return ROOF_Y+SKY_DY; } if(x>SKY.x0&&x<SKY.x1&&z>SKY.z0&&z<=SKY.z1) return ROOF_Y+SKY_DY; return -1; }
function buildSky(silent){ if(skyOpen) return; skyOpen=true; var Y=ROOF_Y+SKY_DY, s=SKY, cx=(s.x0+s.x1)/2, cz=(s.z0+s.z1)/2, W=s.x1-s.x0, L=s.z1-s.z0;
  if(n1Bld && n1Bld.userData.obst) removeObst(n1Bld.userData.obst);
  if(eyvanNorthObst){ removeObst(eyvanNorthObst); eyvanNorthObst=null; addObst(-8.5,0.2,-13.1,-12.9); addObst(1.9,8.5,-13.1,-12.9); }
  addObst(-17.1,-16.85,-24,-12.9); addObst(-17,8.45,-24.15,-23.85); addObst(8.3,8.5,-24,-12.9); addObst(1.9,7.0,-11.65,-11.5); addObst(0.2,1.9,-11.65,-11.5); addObst(0.05,0.2,-12.9,-11.5);
  var g=new T.Group(); g.add(plane(W,L,TEX.wood,cx,Y+0.03,cz,-Math.PI/2));
  [[-12,-16.5,7,4.6],[0,-16.5,9,4.6],[ -5,-14.0,24,1.6]].forEach(function(k){ g.add(plane(k[2],k[3],TEX.kilim,k[0],Y+0.035,k[1],-Math.PI/2)); });
  var rg=new T.Group(); rg.position.y=Y; fenceSide(s.x0+0.05,s.z0+0.1,s.x1-0.05,s.z0+0.1,'n',[],rg); fenceSide(s.x0+0.05,s.z0+0.1,s.x0+0.05,s.z1-0.05,'w',[],rg); fenceSide(s.x1-0.05,s.z0+0.1,s.x1-0.05,s.z1-0.05,'e',[],rg); fenceSide(s.x0+0.05,s.z1-0.05,s.x1-0.05,s.z1-0.05,'s',[{side:'s',from:0.2,to:1.9}],rg); g.add(rg);
  // stairs from the eyvan (2nd floor) up to the 4th floor
  for(var i=0;i<20;i++){ var x=7.0-(i+0.5)*(5.1/20), y=ROOF_Y+SKY_DY*((i+1)/20); g.add(box(0.29,0.1,1.15,0x8b5a2b,x,y-0.05,-12.25)); g.add(box(0.27,y-ROOF_Y-0.1,1.1,0x6b4426,x,ROOF_Y+(y-ROOF_Y-0.1)/2,-12.25)); }
  g.add(box(1.75,0.16,1.2,0x8b5a2b,1.05,Y-0.08,-12.25)); var hr=box(5.6,0.07,0.07,0x5a3a1e,4.45,ROOF_Y+SKY_DY/2+0.95,-11.6); hr.rotation.z=Math.atan2(SKY_DY,5.1); g.add(hr); [6.6,4.3,2.0].forEach(function(px){ var yy=skyH(px,-12.25); g.add(cyl(0.035,0.035,0.95,0x5a3a1e,px,yy+0.47,-11.6,6)); });
  // çay ocağı: brick back wall, tiled stove, counter
  g.add(box(W-0.6,2.2,0.5,0xa0522d,cx,Y+1.1,s.z0+0.45)); for(var b=0;b<10;b++) g.add(box(W-0.62,0.03,0.52,0x8a4423,cx,Y+0.2+b*0.21,s.z0+0.45));
  g.add(box(3.2,1.1,1.4,0x2a6f8f,-14.2,Y+0.55,-22.6)); g.add(box(3.3,0.1,1.5,0xd9ab3c,-14.2,Y+1.12,-22.6)); g.add(cyl(0.25,0.3,3.2,0x8a4423,-14.9,Y+2.6,-23.2,10)); g.add(box(0.8,0.5,0.1,0xff7a2a,-14.2,Y+0.5,-21.88));
  g.add(box(19.6,0.85,0.9,0xb5773c,-3.0,Y+0.425,s.cz)); g.add(box(19.8,0.1,1.1,0x7a4f2a,-3.0,Y+0.9,s.cz)); var kl=plane(19.2,0.56,TEX.kilim,-3.0,Y+0.46,s.cz+0.455); g.add(kl); g.add(box(0.2,0.9,3.3,0x9c6b3c,-12.9,Y+0.45,-22.1)); g.add(box(0.2,0.9,3.3,0x9c6b3c,6.9,Y+0.45,-22.1));
  // pergola with vines over the taxts, lanterns
  [-16.6,-8,0,7.9].forEach(function(x){ g.add(cyl(0.06,0.08,3.4,0x3a3f44,x,Y+1.7,-13.4,6)); });
  [[-16.6,-14.2],[-16.6,-18.6],[8.0,-14.2],[8.0,-18.6]].forEach(function(q){ g.add(cyl(0.06,0.08,3.4,0x3a3f44,q[0],Y+1.7,q[1],6)); });
  [[-15.5,-19.4],[-15.8,-13.6],[7.6,-13.6]].forEach(function(q){ g.add(cyl(0.25,0.3,0.6,0x8b5a2b,q[0],Y+0.3,q[1],10)); g.add(sph(0.5,0x5db04c,q[0],Y+0.95,q[1])); });
  addObst(-12.9,6.9,s.cz-0.45,s.cz+0.45); addObst(-16.9,8.3,s.z0,s.z0+0.75); addObst(-16.9,-12.5,-23.4,-20.8);
  [[-15.5,-19.4],[-15.8,-13.6],[7.6,-13.6]].forEach(function(q){ addObst(q[0]-0.35,q[0]+0.35,q[1]-0.35,q[1]+0.35); });
  scene.add(g); bakeAll(g); bizSign('Səma çayxanası','#2a6f8f','#fff6e6',5.0,0.9,-3.0,Y+2.45,s.z0+0.75,0);
  var Lg=new T.Group(); stringLights([[-16.6,-13.4],[-8,-13.4],[0,-13.4],[7.9,-13.4]],Y+3.3,0.3,14,Lg); stringLights([[-16.6,-14.2],[-16.6,-18.6]],Y+3.3,0.3,10,Lg); stringLights([[8.0,-14.2],[8.0,-18.6]],Y+3.3,0.3,10,Lg); scene.add(Lg); buildSkyScreen();
  SKY_TAXT.forEach(function(q){ var pl=lightPool(q[0],q[1],2.6,scene); pl.position.y=Y+0.06; });
  if(!silent) camPan={pos:new T.Vector3(-4,0,-17), until:S.session+2.4}; }
function makeTaxt(k){ var q=SKY_TAXT[k], x=q[0], z=q[1], y=hAt(x,z), g=new T.Group();
  g.add(box(2.3,0.42,2.3,0x8b5a2b,0,0.21,0)); g.add(box(2.36,0.05,2.36,0x6b4426,0,0.44,0)); var cp=plane(2.1,2.1,TEX.carpet,0,0.47,0,-Math.PI/2); g.add(cp);
  [[1,0],[-1,0],[0,1],[0,-1]].forEach(function(d){ var cu=cyl(0.13,0.13,0.62,[0xb8352f,0x2a6f8f,0xd9ab3c,0x5a7a3a][(d[0]+2*d[1]+3)%4],d[0]*1.0,0.6,d[1]*1.0,10); cu.rotation.set(d[1]?0:0,0,0); if(d[0]) cu.rotation.x=Math.PI/2; else cu.rotation.z=Math.PI/2; g.add(cu); });
  g.add(cyl(0.45,0.45,0.05,0x6b4426,0,0.74,0,20)); g.add(cyl(0.1,0.14,0.27,0x5a3a1e,0,0.6,0,8)); g.add(cyl(0.18,0.18,0.03,0xd9ab3c,0,0.775,0,16)); var sug=sph(0.05,0xf6f2ea,0.08,0.82,0.03); g.add(sug);
  g.position.set(x,y,z); scene.add(g); bakeAll(g); addObst(x-1.15,x+1.15,z-1.15,z+1.15);
  var t={grp:g, pos:new T.Vector3(x,0,z), kind:'taxt', zone:'sky', nerd:false, domino:false, games:false, top:0.78+y, reach:2.2, drop:{x:x, z:z+1.75}, seats:[]};
  [[1,0],[-1,0],[0,1],[0,-1]].forEach(function(d){ t.seats.push({t:t, dx:d[0], dz:d[1], x:x+d[0]*0.75, z:z+d[1]*0.75, ax:x+d[0]*1.75, az:z+d[1]*1.75, rot:Math.atan2(-d[0],-d[1]), lift:0.07, floor:true, c:null}); });
  tables.push(t); return t; }
function makeSkySamovar(x){ addObst(x-0.55,x+0.55,SKY.sz-0.5,SKY.sz+0.5); var s=makeSamovar(x), Y=ROOF_Y+SKY_DY; s.grp.position.set(x,Y,SKY.sz); s.pos.set(x,0,SKY.sz); s.out={x:x, y:0.95+Y, z:SKY.cz, slots:COUNTER_SLOTS}; s.pick=new T.Vector3(x,0,SKY.cz); s.wz=SKY.pz; s.sky=true; skySam.push(s); return s; }
function makeSkyVar(type,x){ addObst(x-0.5,x+0.5,SKY.sz-0.45,SKY.sz+0.45); var Y=ROOF_Y+SKY_DY, g=new T.Group(); g.add(box(0.9,0.85,0.8,0x8b5a2b,0,0.425,0)); g.add(box(0.95,0.06,0.85,0x6b4426,0,0.88,0));
  if(type==='pax'){ g.add(cyl(0.38,0.38,0.04,0xb87333,0,0.93,0,20)); for(var i=0;i<10;i++){ var d=box(0.12,0.04,0.12,0xd9a95a,-0.24+(i%4)*0.16,0.97,-0.12+Math.floor(i/4)*0.12); d.rotation.y=Math.PI/4; g.add(d); } }
  else { [-0.28,-0.08,0.12,0.32].forEach(function(xx,i){ g.add(cyl(0.07,0.07,0.16,0xf2ede4,xx,0.99,0,10)); g.add(cyl(0.062,0.062,0.13,[0x8a1a2a,0xd8582a,0x6a2a5a,0xb8352f][i],xx,0.99,0,10)); g.add(cyl(0.075,0.075,0.03,0xd9ab3c,xx,1.085,0,10)); }); }
  g.position.set(x,Y,SKY.sz); scene.add(g); bakeAll(g);
  var s={type:type, grp:g, pos:new T.Vector3(x,0,SKY.sz), out:{x:x, y:0.95+Y, z:SKY.cz, slots:COUNTER_SLOTS}, pick:new T.Vector3(x,0,SKY.cz), wz:SKY.pz, items:[], timer:0, sky:true}; skyVar[type]=s; return s; }
function makeSkyUsta(x){ var u=makeUsta(x,false); u.sky=true; u.z=SKY.uz; u.pos.set(x,0,SKY.uz); u.lane=x; return u; }
function makeSkyWaiter(i){ var h=[[-12,-14.4],[4,-14.4],[-4,-14.4]][i%3]; var w=makeWaiter(h[0],h[1]); w.zone='sky'; w.grp.userData.root.children.forEach(function(){}); return w; }
// tap any cash box to collect it from anywhere
function kassaSpots(){ var a=[]; if(pile) a.push({pos:pile.pos, y:1.4, amt:function(){ return pile.amount; }, take:function(){ var v=pile.amount; pile.amount=0; updatePileMeshes(); return v; }});
  BIZ.forEach(function(b){ var st=bizState(b.id); if(st.own && b.stand) a.push({pos:{x:b.stand[0],z:b.stand[1]}, y:1.6, amt:function(){ return st.cash; }, take:function(){ var v=Math.floor(st.cash); st.cash=0; refreshCash(b); return v; }, biz:true}); });
  VEN_LIST.concat(CW?[CW]:[]).concat(MK?[MK]:[]).forEach(function(v){ if(v.kassa) a.push({pos:v.kassa.pos, y:1.7+(v.kassa.grp?v.kassa.grp.position.y:0), amt:function(){ return v.st.cash; }, take:function(){ var m=Math.floor(v.st.cash); v.st.cash=0; vRefreshKassa(v); return m; }, biz:true}); });
  return a; }
var kv=new T.Vector3();
function kassaAt(sx,sy,gx,gz){ var best=null, bd=1e9; kassaSpots().forEach(function(k){ kv.set(k.pos.x,k.y,k.pos.z).project(cam); var lx=(kv.x+1)/2*window.innerWidth, ly=(1-kv.y)/2*window.innerHeight, onL=Math.abs(sx-lx)<60 && sy>ly-52 && sy<ly+8, dg=gx===null?1e9:Math.hypot(k.pos.x-gx,k.pos.z-gz), sc=onL?0:(dg<1.0?dg:1e9); if(sc<bd){ bd=sc; best=k; } }); return bd<1e9?best:null; }
function remoteCollect(k){ var a=k.amt(); if(a<1){ floatText(k.pos,'Boşdur',false); return; } var v=k.take(); S.money+=v; S.st.coins=(S.st.coins||0)+v; if(k.biz) S.st.bizcash=(S.st.bizcash||0)+v; bumpMoney(); flyCoins(k.pos, player.pos, Math.min(8,1+Math.floor(v/20))); floatText(k.pos,'+'+v+' ₼',true); SFX.coin(); buzz(10); save(); }

// ---------- big projector screen on the Səma çayxanası: football and films ----------
var skyScreen=null;
function buildSkyScreen(){ var Y=ROOF_Y+SKY_DY, g=new T.Group(), x=-3.0, z=SKY.z0+0.3;
  [x-3.4,x+3.4].forEach(function(px){ g.add(box(0.18,7.0,0.18,0x2b2b2b,px,Y+3.5,z)); }); g.add(box(7.0,3.9,0.12,0x111111,x,Y+5.0,z-0.05)); g.add(box(7.0,0.14,0.2,0x2b2b2b,x,Y+7.05,z));
  scene.add(g); bakeAll(g);
  var pj=new T.Group(); pj.add(box(0.5,0.25,0.4,0x2b2b2b,0,0,0)); pj.add(cyl(0.09,0.09,0.12,0x111111,0,0,-0.25,10)).rotation; pj.position.set(x,Y+3.4,-15.2); scene.add(pj); bakeAll(pj);
  var cvs=document.createElement('canvas'); cvs.width=384; cvs.height=216; var tex=new T.CanvasTexture(cvs); tex.minFilter=T.LinearFilter;
  var scr=new T.Mesh(new T.PlaneGeometry(6.6,3.6), new T.MeshBasicMaterial({map:tex})); scr.position.set(x,Y+5.0,z+0.03); scr.userData.keep=true; scene.add(scr);
  var beam=new T.Mesh(new T.CylinderGeometry(0.05,1.6,8.0,12,1,true), new T.MeshBasicMaterial({color:0xfff2c0, transparent:true, opacity:0.06, depthWrite:false, side:T.DoubleSide, blending:T.AdditiveBlending})); beam.rotation.x=Math.PI/2; beam.position.set(x,Y+4.4,-19.2); beam.rotation.z=0; scene.add(beam);
  skyScreen={cvs:cvs, ctx:cvs.getContext('2d'), tex:tex, t:0, prog:'foot', progT:0, score:[0,0], players:[], ball:{x:192,y:108,vx:60,vy:20}, gol:0, beam:beam, drawT:0};
  for(var i=0;i<14;i++) skyScreen.players.push({x:40+Math.random()*300, y:30+Math.random()*150, team:i%2, hx:0, hy:0}); }
function drawFootball(s,dt){ var c=s.ctx, W=384, H=216; c.fillStyle='#2f8f3a'; c.fillRect(0,0,W,H); for(var i=0;i<8;i++){ c.fillStyle=i%2?'#2a8434':'#33983f'; c.fillRect(i*48,22,48,H-22); }
  c.strokeStyle='rgba(255,255,255,.85)'; c.lineWidth=2; c.strokeRect(12,30,W-24,H-42); c.beginPath(); c.moveTo(W/2,30); c.lineTo(W/2,H-12); c.stroke(); c.beginPath(); c.arc(W/2,(H+18)/2,22,0,Math.PI*2); c.stroke(); c.strokeRect(12,(H+18)/2-30,36,60); c.strokeRect(W-48,(H+18)/2-30,36,60);
  var b=s.ball; b.x+=b.vx*dt; b.y+=b.vy*dt; if(b.y<36||b.y>H-18){ b.vy*=-1; } var midY=(H+18)/2;
  if(b.x<16||b.x>W-16){ if(Math.abs(b.y-midY)<26){ var team=b.x<16?1:0; s.score[team]++; s.gol=2.5; skyCheer(); } b.x=W/2; b.y=midY; b.vx=(Math.random()<0.5?-1:1)*(50+Math.random()*40); b.vy=(Math.random()-0.5)*60; }
  if(Math.random()<dt*0.8){ b.vx+=(Math.random()-0.5)*80; b.vy+=(Math.random()-0.5)*60; b.vx=Math.max(-110,Math.min(110,b.vx)); }
  s.players.forEach(function(p){ var tx=b.x+(p.team?30:-30)+Math.sin(s.t+p.x)*20, ty=b.y+Math.cos(s.t*0.7+p.y)*40; p.x+=(tx-p.x)*dt*0.6; p.y+=(ty-p.y)*dt*0.6; c.fillStyle=p.team?'#2a6fd8':'#d8382a'; c.beginPath(); c.arc(p.x,p.y,5,0,Math.PI*2); c.fill(); c.fillStyle='#fff'; c.fillRect(p.x-1,p.y-7,2,2); });
  c.fillStyle='#fff'; c.beginPath(); c.arc(b.x,b.y,3.2,0,Math.PI*2); c.fill();
  c.fillStyle='rgba(0,0,0,.65)'; c.fillRect(0,0,W,22); c.fillStyle='#fff'; c.font='bold 14px sans-serif'; c.textAlign='left'; c.fillText('Şəhər FK  '+s.score[0]+' : '+s.score[1]+'  Dəniz FK',10,16); c.textAlign='right'; c.fillStyle='#f6d27a'; var mm=Math.floor(s.progT/90*90); c.fillText('CANLI · '+mm+"'",W-10,16);
  if(s.gol>0){ s.gol-=dt; c.fillStyle='rgba(0,0,0,.45)'; c.fillRect(0,H/2-26,W,52); c.fillStyle='#f6d27a'; c.font='bold 40px sans-serif'; c.textAlign='center'; c.fillText('QOL!',W/2,H/2+14); } }
function drawFilm(s,dt){ var c=s.ctx, W=384, H=216, t=s.t; var g=c.createLinearGradient(0,0,0,H); g.addColorStop(0,'#1b2a52'); g.addColorStop(0.7,'#e0805a'); g.addColorStop(1,'#3a2a3a'); c.fillStyle=g; c.fillRect(0,0,W,H);
  c.fillStyle='#ffe9b0'; c.beginPath(); c.arc(300,60,22,0,Math.PI*2); c.fill(); c.fillStyle='#2a1d2e'; c.beginPath(); c.moveTo(0,160); for(var x=0;x<=W;x+=16) c.lineTo(x,150-Math.sin(x*0.02+1)*18); c.lineTo(W,H); c.lineTo(0,H); c.fill();
  var cx=((t*40)%(W+80))-40; c.fillStyle='#111'; c.fillRect(cx,168,46,12); c.fillRect(cx+8,160,26,9); c.fillStyle='#ffd27a'; c.fillRect(cx+44,171,4,4); c.beginPath(); c.arc(cx+10,181,5,0,Math.PI*2); c.arc(cx+36,181,5,0,Math.PI*2); c.fill();
  c.fillStyle='#000'; c.fillRect(0,0,W,16); c.fillRect(0,H-26,W,26); c.fillStyle='#fff'; c.font='13px sans-serif'; c.textAlign='center'; var subs=['— Bu şəhərdə hər şey çayla başlayır...','— Gecə uzundur, çay da isti.','— Sabah yenə görüşərik.']; c.fillText(subs[Math.floor(t/5)%subs.length],W/2,H-9); c.textAlign='left'; c.fillStyle='#f6d27a'; c.font='bold 11px sans-serif'; c.fillText('KİNO GECƏSİ',8,12); }
function skyCheer(){ if(!player || dist(player.pos,{x:-3,z:-17})>22) { return; } SFX.level(); confetti({x:-3,z:-17}); tables.forEach(function(t){ if(t.zone!=='sky') return; t.seats.forEach(function(st){ if(st.c && st.c.seated) st.c.cheer=1.6; }); }); }
function updateSkyScreen(dt){ var s=skyScreen; if(!s) return; s.t+=dt; s.progT+=dt; if(s.progT>(s.prog==='foot'?90:60)){ s.progT=0; s.prog=s.prog==='foot'?'film':'foot'; if(s.prog==='foot') s.score=[0,0]; }
  s.drawT-=dt; if(s.drawT>0) return; s.drawT=1/15; if(s.prog==='foot') drawFootball(s,1/15); else drawFilm(s,1/15); s.tex.needsUpdate=true; s.beam.material.opacity=0.04+0.03*(1-daylight()); }

// ---------- player profile: avatar, level/XP, stats, Google account ----------
var AVATARS=[['🧔','#8a3a20'],['👨','#2a6f8f'],['👩','#d94f7a'],['👴','#6b4426'],['👵','#7a5aa0'],['🧕','#2a7a5a'],['👳','#b8810f'],['👨‍🍳','#3a3f44'],['👩‍🍳','#c0574a'],['🧑‍💼','#1f5a9a'],['🤵','#1b1b1b'],['🫖','#a0522d']];
function cloudUser(){ return window.CLOUD && window.CLOUD.user ? window.CLOUD.user : null; }
function avatarHTML(){ var u=cloudUser(); if(S.avatar==='google' && u && u.photoURL) return '<img src="'+u.photoURL.replace(/"/g,'')+'" alt="" referrerpolicy="no-referrer">';
  var a=AVATARS[(S.avatar|0)%AVATARS.length]; return '<span class="avE" style="background:'+a[1]+'">'+a[0]+'</span>'; }
function fmtDur(sec){ sec=Math.floor(sec||0); var h=Math.floor(sec/3600), m=Math.floor(sec%3600/60); return h? h+' saat '+m+' dəq' : m+' dəq'; }
function renderHudProfile(){ var av=$('hudAv'); if(!av) return; av.innerHTML=avatarHTML()+(cloudUser()?'<i class="gdot">G</i>':''); $('hudName').textContent=S.name||'Oyunçu'; }
function renderProfile(){ if($('profile').style.display!=='flex') return; var u=cloudUser(), C=window.CLOUD;
  $('pfAv').innerHTML=avatarHTML(); $('pfName').value=S.name||''; $('pfLvl').textContent=S.level; var need=xpNeed(S.level); $('pfXpFill').style.width=Math.min(100,100*S.xp/need)+'%'; $('pfXpTxt').textContent=Math.floor(S.xp)+' / '+need+' XP';
  var own=BIZ.filter(function(b){ return bizState(b.id).own; }).length, st=S.st||{};
  var rows=[['☕','Paylanan çay',st.tea||0],['🙂','Xidmət olunan müştəri',S.served||0],['₼','Ümumi yığılan pul',Math.floor(st.coins||0)+' ₼'],['🏪','Bizneslər',own+' / '+BIZ.length],['🔓','Çayxana açılışları',S.unlocked+' / '+CFG.unlocks.length],['💍','Keçirilən toylar',st.toys||0],['⏱','Oyun vaxtı',fmtDur(S.elapsed)]];
  $('pfStats').innerHTML=rows.map(function(r){ return '<div class="pfStat"><span class="pfIc">'+r[0]+'</span><span class="pfLb">'+r[1]+'</span><b>'+r[2]+'</b></div>'; }).join('');
  var g=$('pfGoogle');
  if(!C){ g.innerHTML='<div class="pfgHead"><span class="gmark">G</span> Google hesabı</div><p class="pfNote">Google ilə giriş və bulud yaddaş telefona quraşdırılan tətbiq versiyasında işləyir. Burada irəliləyiş bu brauzerdə saxlanır.</p>'; }
  else if(!C.available){ g.innerHTML='<div class="pfgHead"><span class="gmark">G</span> Google hesabı</div><p class="pfNote">'+(C.status||'Bulud yaddaş qurulmayıb')+'</p>'; }
  else if(!u){ g.innerHTML='<div class="pfgHead"><span class="gmark">G</span> Google hesabı</div><p class="pfNote">Hesabını Google-a bağla ki, telefonu dəyişsən də irəliləyişin itməsin.</p><button class="buy gbtn" id="pfSignIn"><span class="g">G</span> Google ilə bağla</button><p class="pfStatus">'+(C.status||'')+'</p>'; $('pfSignIn').onclick=function(){ C.signIn(); }; }
  else { g.innerHTML='<div class="pfgHead"><span class="gmark">G</span> Google hesabı <span class="pfOk">bağlıdır</span></div><div class="pfAcc">'+(u.photoURL?'<img src="'+u.photoURL.replace(/"/g,'')+'" alt="" referrerpolicy="no-referrer">':'<span class="avE" style="background:#4285f4">'+((u.displayName||u.email||'G')[0]||'G')+'</span>')+'<div><b>'+escapeHTML(u.displayName||'Google hesabı')+'</b><span>'+escapeHTML(u.email||'')+'</span></div></div><p class="pfStatus">☁️ '+escapeHTML(C.status||'')+'</p><div class="pfBtns"><button class="buy quiet" id="pfPush">İndi buluda yaz</button><button class="buy quiet" id="pfPull">Buluddan yüklə</button><button class="buy quiet" id="pfOut">Çıxış</button></div>';
    $('pfPush').onclick=function(){ save(); C.push(); }; $('pfPull').onclick=function(){ C.pull(); }; $('pfOut').onclick=function(){ C.signOut(); }; }
  var grid=$('pfAvGrid'); grid.innerHTML=AVATARS.map(function(a,i){ return '<button class="pfAvOpt'+((S.avatar|0)===i && S.avatar!=='google'?' on':'')+'" data-i="'+i+'" style="background:'+a[1]+'" aria-label="Avatar '+(i+1)+'">'+a[0]+'</button>'; }).join('')+(u&&u.photoURL?'<button class="pfAvOpt gopt'+(S.avatar==='google'?' on':'')+'" data-i="google" aria-label="Google şəkli"><img src="'+u.photoURL.replace(/"/g,'')+'" alt="" referrerpolicy="no-referrer"></button>':'');
  grid.querySelectorAll('.pfAvOpt').forEach(function(b){ b.onclick=function(){ var i=b.getAttribute('data-i'); S.avatar = i==='google' ? 'google' : (+i); save(); renderProfile(); renderHudProfile(); SFX.pop(); }; }); }
function escapeHTML(t){ return String(t).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function openProfile(){ openModal('profile'); $('pfAvGrid').hidden=true; renderProfile(); }
$('lvl').addEventListener('click', openProfile); $('lvl').addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openProfile(); } });
$('pfClose').addEventListener('click', function(){ closeModal('profile'); });
$('pfAvEdit').addEventListener('click', function(){ var g=$('pfAvGrid'); g.hidden=!g.hidden; });
$('pfName').addEventListener('change', function(){ setName(this.value); this.value=S.name; save(); });
window.onCloudChange=function(){ var u=cloudUser(); if(u && S.avatar===undefined && u.photoURL){ S.avatar='google'; } if(u && (!S.name || S.name==='Oyunçu') && u.displayName){ setName(u.displayName.split(' ')[0]); } renderHudProfile(); renderProfile(); };

// ---------- missions ----------
var MDEFS=[
  {k:'tea',     n:5,   txt:'{n} stəkan çay payla',                          m:30,  xp:6},
  {k:'served',  n:5,   txt:'{n} müştəri yola sal',                          m:40,  xp:8},
  {k:'coins',   n:100, txt:'Kassadan {n} ₼ yığ',                          m:40,  xp:8},
  {k:'carry',   n:6,   txt:'Padnosda bir dəfəyə {n} stəkan daşı',           m:50,  xp:8,  abs:true},
  {k:'unlock',  n:2,   txt:'{n} yeni şey aç',                               m:60,  xp:10},
  {k:'tea',     n:15,  txt:'{n} stəkan çay payla',                          m:60,  xp:10},
  {k:'pax',     n:3,   txt:'{n} paxlava payla',                             m:70,  xp:10, req:'pax'},
  {k:'upgrade', n:1,   txt:'{n} təkmilləşdirmə al',                          m:60,  xp:10, req:'up'},
  {k:'level',   n:1,   txt:'Səviyyə {n}-ə çat',                             m:80,  xp:0,  abs:true},
  {k:'nerd',    n:4,   txt:'Nərdçilərə {n} stəkan çay ver',                 m:90,  xp:12, req:'nerd'},
  {k:'streak',  n:8,   txt:'Heç kimi əsəbiləşdirmədən {n} müştəri yola sal', m:120, xp:15, abs:true},
  {k:'domino',  n:6,   txt:'Domino oyunçularına {n} stəkan çay ver',        m:120, xp:15, req:'domino'},
  {k:'vip',     n:1,   txt:'{n} hörmətli qonağı yola sal',                   m:100, xp:12, req:'vip'},
  {k:'toy',     n:4,   txt:'{n} toy qonağını yola sal',                      m:120, xp:15, req:'toy'},
  {k:'served',  n:25,  txt:'{n} müştəri yola sal',                          m:150, xp:20},
  {k:'coins',   n:600, txt:'Kassadan {n} ₼ yığ',                          m:150, xp:20},
  {k:'carry',   n:12,  txt:'Padnosda bir dəfəyə {n} stəkan daşı',           m:120, xp:15, abs:true, req:'padnos12'},
  {k:'pax',     n:10,  txt:'{n} paxlava payla',                             m:150, xp:20, req:'pax'},
  {k:'bizown',  n:1,   txt:'Şəhərdə {n} biznes al',                          m:300, xp:40, req:'lvl3'},
  {k:'bizcash', n:400, txt:'Bizneslərdən {n} ₼ yığ',                       m:200, xp:25, req:'biz'},
  {k:'wash',    n:5,   txt:'Moykada {n} maşın yu',                           m:150, xp:20, req:'moyka'},
  {k:'vdish',   n:8,   txt:'Restoran və pubda {n} sifariş payla',           m:200, xp:25, req:'venue'},
  {k:'beer',    n:6,   txt:'Pubda {n} pivə payla',                           m:180, xp:22, req:'pub'},
  {k:'bizup',   n:3,   txt:'Bizneslərdə {n} təkmilləşdirmə al',              m:250, xp:30, req:'biz'}
];
function misReq(r){ if(!r) return true; if(r==='pax') return !!paxSt; if(r==='up') return !!upTable; if(r==='nerd') return tables.some(function(t){ return t.nerd; });
  if(r==='domino') return tables.some(function(t){ return t.domino; }); if(r==='vip') return S.elapsed>180; if(r==='toy') return S.elapsed>300; if(r==='padnos12') return CFG.padnosCap[S.up.padnos]>=12; if(r==='lvl3') return S.level>=3; if(r==='biz') return BIZ.some(function(b){ return bizState(b.id).own; }); if(r==='venue') return VEN_LIST.length>0; if(r==='pub') return !!VEN.pub; if(r==='moyka') return !!bizState('moyka').own; return true; }
function misStat(k){ var st=S.st; if(k==='bizown') return BIZ.filter(function(b){ return bizState(b.id).own; }).length; if(k==='unlock') return S.unlocked; if(k==='upgrade') return Object.keys(S.up).reduce(function(a,k2){ return a+S.up[k2]; },0); return st[k]||0; }
function misTarget(m){ var d=MDEFS[m.d]; return m.n; }
function misProgress(m){ var d=MDEFS[m.d]; if(m.forced) return m.n;
  if(d.k==='level') return S.level; if(d.k==='streak') return S.st.streak||0; if(d.k==='carry') return Math.max(m.peak||0, player? player.items.length : 0);
  return misStat(d.k)-m.start; }
function misText(m){ return MDEFS[m.d].txt.replace('{n}', m.n); }
function misReward(m){ var d=MDEFS[m.d], f=1+0.5*m.tier; return {money:Math.round(d.m*f*(1+0.1*(S.level-1))), xp:Math.round(d.xp*f)}; }
function newMission(){ var M=S.mis;
  for(var guard=0; guard<2; guard++){
    for(var i=0;i<M.queue.length;i++){ var di=M.queue[i], d=MDEFS[di]; if(!misReq(d.req)) continue; if(M.active.some(function(a){ return a.d===di; })) continue;
      var n = d.k==='level' ? S.level+1 : Math.round(d.n*(1+0.6*M.tier)); if(d.k==='carry') n=Math.min(n, CFG.padnosCap[S.up.padnos]);
      if(d.k==='unlock' && S.unlocked+n>CFG.unlocks.length) continue; if(d.k==='upgrade' && misStat('upgrade')+n>Object.keys(CFG.ups).reduce(function(a,k2){ return a+CFG.ups[k2].prices.length; },0)) continue;
      M.queue.splice(i,1);
      var m={d:di, n:n, tier:M.tier, start:misStat(d.k), peak:0, done:false}; if(d.k==='streak') S.st.streak=0; return m; }
    if(!M.queue.length){ M.tier++; M.queue=MDEFS.map(function(_,i){ return i; }); } else return null; }
  return null; }
function fillMissions(){ var M=S.mis; while(M.active.length<3){ var m=newMission(); if(!m) break; M.active.push(m); } }
function initMissions(){ if(!S.mis || !S.mis.active){ S.mis={active:[], queue:MDEFS.map(function(_,i){ return i; }), tier:0}; } fillMissions(); updateMisHud(); }
var misT=0;
function updateMissions(dt){ misT-=dt; if(misT>0) return; misT=0.3; var M=S.mis, changed=false;
  if(M.active.length<3){ var before=M.active.length; fillMissions(); if(M.active.length!==before) changed=true; }
  M.active.forEach(function(m){ if(MDEFS[m.d].k==='carry') m.peak=Math.max(m.peak||0, player.items.length);
    if(!m.done && misProgress(m)>=m.n){ m.done=true; changed=true; showBanner('Tapşırıq hazırdır: '+misText(m), 2400); SFX.mission(); buzz(20); } });
  if(changed){ updateMisHud(); save(); } }
function updateMisHud(){ var n=S.mis.active.filter(function(m){ return m.done; }).length, b=$('misBadge'); b.textContent=n; b.classList.toggle('on', n>0); $('misBtn').classList.toggle('ready', n>0); }
function claimMission(i){ var M=S.mis, m=M.active[i]; if(!m || !m.done) return; var r=misReward(m); M.active.splice(i,1);
  S.money+=r.money; bumpMoney(); floatText(player.pos,'+'+r.money,true); SFX.unlock(); if(r.xp) addXP(r.xp); fillMissions(); updateMisHud(); save(); renderMissions(); }
function renderMissions(){ var L=$('misList'); L.innerHTML='';
  if(!S.mis.active.length){ var e=document.createElement('p'); e.className='mempty'; e.textContent='Yeni tapşırıq üçün oyuna davam et.'; L.appendChild(e); return; }
  S.mis.active.forEach(function(m,i){ var row=document.createElement('div'), p=Math.min(m.n, Math.max(0, Math.floor(misProgress(m)))), r=misReward(m); row.className='mrow'+(m.done?' done':'');
    var t=document.createElement('div'); t.className='mtxt'; t.textContent=misText(m); row.appendChild(t);
    var bar=document.createElement('div'); bar.className='mbar'; var fill=document.createElement('i'); fill.style.width=(100*p/m.n)+'%'; bar.appendChild(fill); row.appendChild(bar);
    var foot=document.createElement('div'); foot.className='mfoot'; var info=document.createElement('span'); info.textContent=p+' / '+m.n+'  ·  +'+r.money+' ₼'+(r.xp?', +'+r.xp+' XP':''); foot.appendChild(info);
    var btn=document.createElement('button'); btn.className='buy'; btn.textContent= m.done ? 'Al' : 'Davam'; btn.disabled=!m.done; btn.addEventListener('click', function(){ claimMission(i); }); foot.appendChild(btn);
    row.appendChild(foot); L.appendChild(row); }); }
function openModal(id){ paused=true; $(id).style.display='flex'; }
function closeModal(id){ $(id).style.display='none'; paused=false; last=performance.now(); }
$('misBtn').addEventListener('click', function(){ renderMissions(); openModal('mis'); });
$('misClose').addEventListener('click', function(){ closeModal('mis'); });

// ---------- admin panel (testing) ----------
var fpsN=0, fpsT=0;
function updateFps(raw){ if(!S.showFps) return; fpsN++; fpsT+=raw; if(fpsT>=0.5){ $('fps').textContent=Math.round(fpsN/fpsT)+' FPS · '+renderer.info.render.calls+' çəkiliş'; fpsN=0; fpsT=0; } }

// ---------- boot ----------
buildWorld(); load();
for(var u=0;u<S.unlocked;u++) applyUnlock(CFG.unlocks[u], true);
showTile(S.unlocked);
if(S.unlocked>0) S.tut=TUT.length;
if(S.elapsed>=S.offerAt) S.offerAt=S.elapsed+60;
while(S.toyNext<=S.elapsed) S.toyNext+=180;
$('mute').textContent=S.muted?'🔇':'🔊';
setZoom(S.zoom||1); updateLevelHud(); $('pname').value=S.name; setName(S.name); updateCrowd(0); initMissions(); initBiz(); band.loading=true; updateBand(0.01); band.loading=false; for(var ew=0;ew<S.up.waiters;ew++) extraWaiter(ew,true); updateDayNight(0);
camTarget.set(player.pos.x, 0, player.pos.z);
var last=performance.now();
var dtS=1/60;
var shadowTick=0; renderer.shadowMap.autoUpdate=false;
function frame(now){ requestAnimationFrame(frame); var raw=(now-last)/1000; last=now; if(raw>0.25) raw=0.25; if(raw<0) raw=0; dtS+=(raw-dtS)*0.3; var dt=Math.min(dtS,0.1); updateFps(raw); poolWarm(); if(S.started && !paused){ var ts=S.timeScale||1; if(ts>1){ for(var q=0;q<ts;q++) update(dt); } else update(dt); } updateCamera(dt); updateLabels(dt); shadowTick=(shadowTick+1)%2; renderer.shadowMap.needsUpdate = shadowTick===0; renderer.render(scene,cam); }
requestAnimationFrame(frame);
})();
