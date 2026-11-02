const{chromium}=require('playwright'),assert=require('assert'),path=require('path');
(async()=>{const b=await chromium.launch({executablePath:process.env.FLOWR_CHROMIUM||'/tmp/flowr-chromium',args:['--no-sandbox','--disable-gpu']});try{
 const p=await b.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('file://'+path.resolve(__dirname,'../www/index.html'));
 const result=await p.evaluate(async()=>{
  newProject('Roto render',160,120,3);
  const c=document.createElement('canvas');c.width=160;c.height=120;const x=c.getContext('2d');x.fillStyle='blue';x.fillRect(0,0,160,120);x.fillStyle='red';x.fillRect(50,40,60,40);x.fillStyle='rgb(128,0,127)';x.fillRect(49,40,1,40);
  const image=new Image();await new Promise(r=>{image.onload=r;image.src=c.toDataURL()});
  const parent=mk('null'),l=mk('media',{name:'Matte',el:image});closeAdd();setView('ed');
  const alpha=new Uint8Array(160*120);for(let y=40;y<80;y++)for(let xx=49;xx<110;xx++)alpha[y*160+xx]=xx===49?128:255;
  l.roto=await RotoStore.encode([{time:0,packed:RotoEngine.pack(alpha),bg:[[0,0,255]],manual:true}],{width:160,height:120,rate:30,still:true,layerStart:0,layerEnd:3,timeSpace:'source'});await prepareRotoAssets();
  const pixels=coords=>{exporting=true;draw();const a=coords.map(([xx,y])=>Array.from(MAIN.getImageData(xx,y,1,1).data));exporting=false;return a};
  const baseline=pixels([[80,60],[10,10],[49,60]]);l.roto.decontaminate=1;const cleaned=pixels([[49,60]])[0];
  l.roto.invert=true;const inverted=pixels([[80,60],[10,10],[49,60]]);l.roto.invert=false;
  setv(l,'rot',90);const rotated=pixels([[80,35],[110,60]]);setv(l,'rot',0);
  setv(l,'anchorX',20);const anchored=pixels([[35,60],[105,60]]);setv(l,'anchorX',0);
  setParent(l,parent.id);setv(parent,'x',100);const parented=pixels([[55,60],[125,60]]);setParent(l,'');
  const m=FlowrMasks.create(l);m.points=FlowrMasks.shape('rectangle',0,-60,80,60);const intersect=pixels([[60,60],[100,60]]);m.enabled=false;
  l.roto.postFeather=2;const feather=RotoStore.frame(l.roto,0).alpha[60*160+48];l.roto.postFeather=0;l.roto.postShift=3;const expanded=RotoStore.frame(l.roto,0).alpha[60*160+47];l.roto.postShift=-3;const eroded=RotoStore.frame(l.roto,0).alpha[60*160+51];l.roto.postShift=0;
  l.roto.enabled=false;const bypass=pixels([[10,10]])[0][3];l.roto.enabled=true;
  const map=FlowrEffectInputs.get(l.id,{id:-1,pc:0},160,120),mapAlpha=[[80,60],[10,10]].map(([xx,y])=>map.getContext('2d').getImageData(xx,y,1,1).data[3]);
  let exported;const old=deliver;deliver=async blob=>{const bitmap=await createImageBitmap(blob),can=document.createElement('canvas');can.width=bitmap.width;can.height=bitmap.height;const ctx=can.getContext('2d');ctx.drawImage(bitmap,0,0);exported=[[80,60],[10,10],[49,60]].map(([xx,y])=>Array.from(ctx.getImageData(xx,y,1,1).data));bitmap.close()};
  try{exportDialog();io.querySelector('#io-format').value='png';await runExport()}finally{deliver=old;ioClose()}
  const pre=createPrecomp([l.id],'Cutout precomp');const nested=pixels([[80,60],[10,10]]);
  // Seven independent mattes must coexist without an asynchronous cache eviction/redraw loop.
  const ids=[];for(let i=0;i<7;i++){const copy=mk('media',{el:image,vis:false});copy.roto={...l.roto,id:newId()};ids.push(copy.roto.id)}await prepareRotoAssets();const resident=ids.every(id=>RotoStore.bundles.has(id));
  // Invalid projects fail closed. Source pixels may never be shown while a matte cannot be decoded.
  activeComp=0;const bad=mk('media',{el:image});bad.roto={...l.roto,id:newId(),data:'AAAAAA==',codec:'rle'};let rejected=false;try{await RotoStore.ready(bad.roto)}catch{rejected=true}pre.vis=false;const corruptAlpha=pixels([[80,60]])[0][3];
  return{baseline,cleaned,inverted,rotated,anchored,parented,intersect,feather,expanded,eroded,bypass,mapAlpha,exported,nested,resident,rejected,corruptAlpha};
 });
 assert.deepEqual(result.baseline.map(x=>x[3]),[255,0,128]);assert(result.cleaned[0]>250&&result.cleaned[2]<4&&result.cleaned[3]===128);
 assert.deepEqual(result.inverted.map(x=>x[3]),[0,255,127]);
 for(const key of ['rotated','anchored','nested'])assert.deepEqual(result[key].map(x=>x[3]),[255,0],key);
 for(const key of ['parented','intersect'])assert.deepEqual(result[key].map(x=>x[3]),[0,255],key);
 assert(result.feather>0&&result.feather<128);assert(result.expanded>200&&result.eroded<30);
 assert.equal(result.bypass,255);assert.deepEqual(result.mapAlpha,[255,0]);assert.deepEqual(result.exported.map(x=>x[3]),[255,0,128]);
 assert(result.resident&&result.rejected);assert.equal(result.corruptAlpha,0);assert.deepEqual(errors,[]);
 console.log('PASS: alpha/invert/fringe/feather/shift, anchor/rotation/parent transforms, native-mask intersection, isolated effect inputs, exported PNG pixels, nested precomp, seven-layer cache and corrupt-data transparency');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
