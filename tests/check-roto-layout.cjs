const{chromium}=require('playwright'),assert=require('assert'),path=require('path');
(async()=>{const b=await chromium.launch({executablePath:process.env.FLOWR_CHROMIUM||'/tmp/flowr-chromium',args:['--no-sandbox','--disable-gpu']});try{
 const p=await b.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('file://'+path.resolve(__dirname,'../www/index.html'));
 await p.evaluate(async()=>{
  newProject('Roto layout',320,180,2);const c=document.createElement('canvas');c.width=240;c.height=360;const x=c.getContext('2d');x.fillStyle='#476da2';x.fillRect(0,0,240,360);x.fillStyle='#e9ae72';x.beginPath();x.ellipse(120,170,50,100,0,0,7);x.fill();
  const image=new Image();await new Promise(r=>{image.onload=r;image.src=c.toDataURL()});mk('media',{name:'Portrait character',el:image});closeAdd();setView('ed');commit();await openRotoscope();
 });
 for(const size of [{width:320,height:568},{width:390,height:844},{width:844,height:390},{width:1280,height:800}]){
  await p.setViewportSize(size);await p.evaluate(()=>paintRoto());
  const g=await p.evaluate(()=>{
   const panel=rotoPanel.getBoundingClientRect(),view=$('#roto-viewport').getBoundingClientRect(),source=$('#roto-surface').getBoundingClientRect(),apply=rotoPanel.querySelector('[data-roto=apply]').getBoundingClientRect(),bottom=rotoPanel.querySelector('.roto-bottom');
   return{panel:{x:panel.x,right:panel.right},apply:{right:apply.right,top:apply.top,bottom:apply.bottom},fit:source.width<=view.width-12&&source.height<=view.height-12,viewportHeight:view.height,bottomScrollable:bottom.scrollHeight>bottom.clientHeight,overflow:rotoPanel.scrollWidth>rotoPanel.clientWidth};
  });
  assert(g.panel.x>=-1&&g.panel.right<=size.width+1);assert(g.apply.top>=0&&g.apply.bottom<size.height&&g.apply.right<=g.panel.right);assert(g.fit);assert(g.viewportHeight>=70);assert(!g.overflow);
 }
 await p.setViewportSize({width:390,height:844});await p.evaluate(()=>paintRoto());
 await p.screenshot({path:'/tmp/flowr-roto-phone.png'});
 await p.selectOption('#roto-zoom','8');assert(await p.evaluate(()=>$('#roto-viewport').scrollHeight>$('#roto-viewport').clientHeight));
 await p.selectOption('#roto-zoom','1');await p.evaluate(async()=>{rotoEditor.rect={x:50,y:30,w:140,h:280};await refineRotoFrame();await applyRotoscope()});
 assert.equal(await p.locator('.roto-finish-grid').evaluate(el=>getComputedStyle(el).display),'grid');
 await p.screenshot({path:'/tmp/flowr-roto-frozen.png'});
 await p.click('[data-roto-finish=invert]');assert.equal(await p.evaluate(()=>cur().roto.invert),true);
 await p.click('[data-roto-bypass]');assert.equal(await p.evaluate(()=>cur().roto.enabled),false);
 await p.click('[data-roto-remove]');assert.equal(await p.evaluate(()=>!!cur().roto),false);
 await p.evaluate(()=>undo());assert.equal(await p.evaluate(()=>!!cur().roto),true);
 assert.deepEqual(errors,[]);console.log('PASS: phone/landscape/desktop bounds, portrait fit, zoom scrolling, finishing grid and UI invert/bypass/remove/Undo');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exit(1)});
