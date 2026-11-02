const{chromium}=require('playwright'),assert=require('assert'),path=require('path');
(async()=>{const b=await chromium.launch({executablePath:process.env.FLOWR_CHROMIUM||'/tmp/flowr-chromium',args:['--no-sandbox','--disable-gpu']});try{
 const p=await b.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('file://'+path.resolve(__dirname,'../www/index.html'));
 await p.evaluate(async()=>{newProject('Smart brush',300,200,3);const c=document.createElement('canvas');c.width=300;c.height=200;const x=c.getContext('2d');x.fillStyle='#315f91';x.fillRect(0,0,300,200);x.fillStyle='#dca064';x.fillRect(40,25,105,150);x.fillRect(225,70,45,65);x.fillStyle='#315f91';x.fillRect(80,55,20,25);const image=new Image();await new Promise(r=>{image.onload=r;image.src=c.toDataURL()});mk('media',{el:image,name:'Connected subject + distractor'});closeAdd();setView('ed');commit();await openRotoscope()});
 assert.equal(await p.evaluate(()=>rotoEditor.tool),'fg');
 let r=await p.locator('#roto-marks').boundingBox();
 await p.mouse.move(r.x+r.width*70/300,r.y+r.height*105/200);await p.mouse.down();await p.mouse.move(r.x+r.width*70/300,r.y+r.height*145/200,{steps:5});
 await p.waitForFunction(()=>rotoEditor.previewAlpha?.length);assert.equal(await p.locator('[data-roto=apply]').isDisabled(),true);
 await p.screenshot({path:'/tmp/smart-roto-live.png'});await p.mouse.up();await p.waitForFunction(()=>rotoEditor.alpha&&!rotoEditor.refining,null,{timeout:60000});
 const sample=await p.evaluate(()=>{const st=rotoEditor,at=(x,y)=>st.alpha[Math.floor(y*st.height/200)*st.width+Math.floor(x*st.width/300)];return{fg:at(115,140),hole:at(90,65),other:at(245,95),bg:at(10,10),box:st.rect}});assert(sample.fg>240&&sample.hole<10&&sample.other<10&&sample.bg===0);assert.equal(sample.box,null);
 // Separate regions can be explicitly added. Alt temporarily subtracts with the same brush.
 r=await p.locator('#roto-marks').boundingBox();await p.mouse.click(r.x+r.width*245/300,r.y+r.height*95/200);await p.waitForFunction(()=>!rotoEditor.refining);assert(await p.evaluate(()=>rotoEditor.alpha[Math.floor(95*rotoEditor.height/200)*rotoEditor.width+Math.floor(245*rotoEditor.width/300)]>240));
 await p.keyboard.down('Alt');await p.mouse.click(r.x+r.width*245/300,r.y+r.height*95/200);await p.keyboard.up('Alt');await p.waitForFunction(()=>!rotoEditor.refining);assert.equal(await p.evaluate(()=>rotoEditor.alpha[Math.floor(95*rotoEditor.height/200)*rotoEditor.width+Math.floor(245*rotoEditor.width/300)]),0);
 await p.selectOption('#roto-view','cutout');await p.screenshot({path:'/tmp/smart-roto-cutout.png'});await p.click('[data-roto=apply]');await p.waitForFunction(()=>!rotoEditor);assert.equal(await p.evaluate(()=>cur().roto.settings.smart),true);
 await p.evaluate(async()=>{await openRotoscope();return null});assert.equal(await p.locator('#roto-mode').inputValue(),'smart');await p.click('[data-roto=cancel]');assert.deepEqual(errors,[]);
 console.log('PASS: default one-stroke Smart Brush, live region/boundary preview, no box/red setup, disconnected add, Alt subtract, worker result, Freeze and mode persistence');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
