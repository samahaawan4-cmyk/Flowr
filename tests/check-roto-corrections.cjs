const {chromium}=require('playwright'),assert=require('assert'),path=require('path'),fs=require('fs');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.FLOWR_CHROMIUM||'/tmp/flowr-chromium',args:['--no-sandbox','--disable-gpu']});
 try {
  const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve(__dirname,'../www/index.html'));
  await page.evaluate(async()=>{
   newProject('Brush corrections',240,160,2);
   const c=document.createElement('canvas');c.width=240;c.height=160;const x=c.getContext('2d');
   x.fillStyle='#14508c';x.fillRect(0,0,240,160);x.fillStyle='#d28241';x.fillRect(65,20,110,120);
   const image=new Image();await new Promise(r=>{image.onload=r;image.src=c.toDataURL()});
   mk('media',{el:image,name:'Brush subject'});closeAdd();commit();await openRotoscope();
   rotoEditor.rect={x:45,y:10,w:150,h:140};await refineRotoFrame();
  });
  assert.equal(await page.evaluate(()=>rotoEditor.alpha[80*240+120]),255);
  await page.click('[data-roto-tool=bg]');
  const box=await page.locator('#roto-marks').boundingBox();
  await page.mouse.click(box.x+box.width*.5,box.y+box.height*.5);
  await page.waitForFunction(()=>rotoEditor&&!rotoEditor.refining);
  assert.equal(await page.evaluate(()=>rotoEditor.alpha[80*240+120]),0);
  assert.equal(await page.evaluate(()=>RotoEngine.unpack([...rotoEditor.records.values()][0].packed,240*160)[80*240+120]),0);
  await page.click('[data-roto=undo]');
  assert.equal(await page.evaluate(()=>rotoEditor.alpha[80*240+120]),255);
  assert.equal(await page.evaluate(()=>RotoEngine.unpack([...rotoEditor.records.values()][0].packed,240*160)[80*240+120]),255);
  const canceled=await page.evaluate(async()=>{
   const before=getState(),old=[...rotoEditor.records.values()][0].packed.slice();
   const running=refineRotoFrame();rotoPanel.querySelector('[data-roto=stop]').click();await running;
   return {before,after:getState(),same:old.every((v,i)=>v===[...rotoEditor.records.values()][0].packed[i]),idle:!rotoEditor.refining};
  });
  assert(canceled.same&&canceled.idle);assert.equal(canceled.before,canceled.after);
  await page.click('[data-roto=cancel]');assert.equal(await page.evaluate(()=>!!cur().roto),false);
  // A corrected propagated frame becomes a manual anchor; stale samples on either side are discarded.
  const bytes=fs.readFileSync(path.join(__dirname,'fixtures/mask-motion.webm')).toString('base64');
  await page.evaluate(async bytes=>{
   newProject('Video corrections',320,180,1.1);
   const file=new File([Uint8Array.from(atob(bytes),c=>c.charCodeAt(0))],'motion.webm',{type:'video/webm'}),media=await decodeMedia(file,'video'),l=mk('media',{...media,end:1.1}),m=FlowrMasks.create(l);
   m.points=FlowrMasks.shape('rectangle',-90,-50,-20,40);closeAdd();commit();await openRotoscope(m.id);await refineRotoFrame();
   $('#roto-rate').value='5';$('#roto-end').value='1';await propagateRoto();await rotoGo(.4);
   rotoSnapshot();rotoEditor.tool='bg';$('#roto-brush').value='8';rotoBrush(rotoEditor,{x:Math.round(112*rotoEditor.width/320),y:Math.round(85*rotoEditor.height/180)});await refineRotoFrame();
  },bytes);
  const correction=await page.evaluate(()=>({times:[...rotoEditor.records.values()].map(f=>f.time).sort(),manual:rotoEditor.records.get('0.4000').manual,hole:rotoEditor.alpha[Math.round(85*rotoEditor.height/180)*rotoEditor.width+Math.round(112*rotoEditor.width/320)]}));
  assert.deepEqual(correction.times,[0,.4]);assert(correction.manual);assert.equal(correction.hole,0);
  await page.evaluate(async()=>{$('#roto-end').value='.8';await propagateRoto()});
  const followed=await page.evaluate(()=>{
   const st=rotoEditor,record=st.records.get('0.8000');if(!record)return{reason:st.reason};
   const a=RotoEngine.unpack(record.packed,st.width*st.height),labels=RotoEngine.unpack(record.labels,a.length),red=[];
   for(let i=0;i<labels.length;i++)if(labels[i]===2)red.push(i);
   return{reason:st.reason,count:st.records.size,red:red.length,redX:red.reduce((n,i)=>n+i%st.width,0)/red.length,holes:red.every(i=>a[i]===0)};
  });
  console.log(followed);assert(!followed.reason);assert.equal(followed.count,4);assert(followed.red>10&&followed.redX>95&&followed.holes);
  // Backward propagation uses the same corrected constraint and preserves the later manual anchor.
  await page.evaluate(async()=>{await rotoGo(.4);$('#roto-direction').value='-1';$('#roto-end').value='0';await propagateRoto()});
  assert.equal(await page.evaluate(()=>rotoEditor.records.get('0.4000').manual),true);
  assert.equal(await page.evaluate(()=>rotoEditor.records.size),5);
  await page.click('[data-roto=cancel]');assert.equal(await page.evaluate(()=>!!cur().roto),false);
  assert.deepEqual(errors,[]);
  console.log('PASS: pointer brush correction, exact matte/record Undo, worker Stop, draft Cancel, bidirectional stale-frame invalidation, manual anchors and propagated correction constraints');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
