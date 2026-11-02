/* Authored editable tracks; each group uses the layer's native property keyframes. */
const AdvancedTextPresets=(()=>{const entries=[],make=(id,name,type,tracks,options={})=>entries.push({id:'atx-'+id,name,category:'Text Animation',kind:'text',advancedText:true,animationType:type,description:type+' · '+(options.based==='words'?'Words':options.based==='lines'?'Lines':'Letters')+' · editable stagger and keyframes',duration:options.duration||1.6,spread:options.spread??.55,order:options.order||'forward',based:options.based||'chars',tracks,color:options.color,step:options.step,repeat:!!options.repeat,sample:options.based==='words'?'MAKE IT MOVE':options.based==='lines'?'MAKE\nIT MOVE':'FLOWR'}),pair=(a,b)=>[[0,a],[1,b]],fade=pair(0,100),out=pair(100,0),cycle=(...v)=>v.map((x,i)=>[i/(v.length-1),x]);
make('fade-cascade','Fade Cascade','Entrances',{opacity:fade});
make('typewriter','Typewriter','Entrances',{opacity:fade},{spread:.88,step:true});
make('soft-rise','Soft Rise','Entrances',{y:pair(1.1,0),opacity:fade});
make('soft-drop','Soft Drop','Entrances',{y:pair(-1.1,0),opacity:fade});
make('slide-left','Slide From Left','Entrances',{x:pair(-1.8,0),opacity:fade});
make('slide-right','Slide From Right','Entrances',{x:pair(1.8,0),opacity:fade},{order:'reverse'});
make('diagonal-float','Diagonal Float','Entrances',{x:pair(-.8,0),y:pair(.8,0),opacity:fade});
make('zoom-in','Zoom From Small','Entrances',{scale:pair(5,100),opacity:fade});
make('zoom-overshoot','Zoom Overshoot','Entrances',{scale:[[0,0],[.65,128],[.85,94],[1,100]],opacity:fade});
make('rubber-pop','Rubber Pop','Entrances',{scale:cycle(20,136,82,108,100),opacity:fade},{spread:.4});
make('rotate-clockwise','Clockwise Settle','Entrances',{rot:cycle(-100,12,0),opacity:fade});
make('rotate-counter','Counterclockwise Settle','Entrances',{rot:cycle(100,-12,0),opacity:fade},{order:'reverse'});
make('spiral-in','Spiral In','Entrances',{rot:pair(180,0),scale:pair(0,100),opacity:fade});
make('tumble-up','Tumble Up','Entrances',{y:pair(1.5,0),rot:pair(-115,0),opacity:fade});
make('focus-reveal','Focus Reveal','Entrances',{blur:pair(.3,0),opacity:fade},{spread:.65});
make('tracking-expand','Tracking Expand','Entrances',{track:pair(-.24,0),opacity:fade},{spread:.3});
make('tracking-contract','Tracking Contract','Entrances',{track:pair(.65,0),opacity:fade},{spread:.25});
make('center-bloom','Center Bloom','Entrances',{scale:pair(0,100),y:pair(.35,0),opacity:fade},{order:'center'});
make('edge-gather','Edge Gather','Entrances',{scale:pair(155,100),blur:pair(.15,0),opacity:fade},{order:'edges'});
make('random-assemble','Random Assemble','Entrances',{x:pair(.8,0),y:pair(-.7,0),rot:pair(45,0),opacity:fade},{order:'random',spread:.7});
make('elastic-rise','Elastic Rise','Entrances',{y:cycle(1.3,-.25,.08,0),opacity:fade},{duration:1.9,spread:.4});
make('whip-right','Whip Right','Entrances',{x:cycle(-2.7,.18,0),rot:pair(-14,0),blur:pair(.12,0),opacity:fade},{duration:1.1});
make('focus-pop','Focus Pop','Entrances',{scale:pair(150,100),blur:pair(.3,0),opacity:fade},{order:'center'});
make('letter-roll','Letter Roll','Entrances',{rot:pair(-360,0),y:pair(.5,0),opacity:fade},{duration:1.9});
make('fade-out','Fade Cascade Out','Exits',{opacity:out});
make('rise-out','Rise Out','Exits',{y:pair(0,-1.3),opacity:out});
make('drop-out','Drop Out','Exits',{y:pair(0,1.3),opacity:out});
make('left-out','Slide Left Out','Exits',{x:pair(0,-2),opacity:out},{order:'reverse'});
make('right-out','Slide Right Out','Exits',{x:pair(0,2),opacity:out});
make('zoom-away','Zoom Away','Exits',{scale:pair(100,0),opacity:out});
make('punch-out','Punch Out','Exits',{scale:pair(100,180),opacity:out},{order:'center'});
make('blur-out','Blur Dissolve','Exits',{blur:pair(0,.35),opacity:out});
make('tracking-scatter','Tracking Scatter','Exits',{track:pair(0,.75),opacity:out},{spread:.35});
make('spin-out','Spin Out','Exits',{rot:pair(0,210),scale:pair(100,25),opacity:out});
make('random-vanish','Random Vanish','Exits',{scale:pair(100,0),opacity:out},{order:'random',spread:.8});
make('center-collapse','Center Collapse','Exits',{scale:pair(100,0),rot:pair(0,90),opacity:out},{order:'center'});
make('sine-wave','Sine Wave','Loops',{y:cycle(0,-.3,0,.3,0)},{spread:.8,duration:2});
make('scale-ripple','Scale Ripple','Loops',{scale:cycle(100,135,100,80,100)},{spread:.85});
make('pendulum','Pendulum','Loops',{rot:cycle(0,-22,0,22,0)},{spread:.6,duration:2});
make('orbit','Letter Orbit','Loops',{x:cycle(0,.22,0,-.22,0),y:cycle(-.22,0,.22,0,-.22)},{spread:.8,duration:2.4});
make('breathing','Breathing','Loops',{scale:cycle(100,116,100)},{spread:0,duration:2.4});
make('tracking-pulse','Tracking Pulse','Loops',{track:cycle(0,.18,0)},{spread:.3,duration:2});
make('cyan-shimmer','Cyan Shimmer','Loops',{colorMix:cycle(0,100,0)},{spread:.9,color:'#3eeaff',duration:2.2});
make('neon-flicker','Neon Flicker','Loops',{opacity:[[0,100],[.14,100],[.16,30],[.22,100],[.5,100],[.54,55],[.58,100],[1,100]]},{spread:.4,duration:1.8});
make('violet-sweep','Violet Sweep','Loops',{colorMix:cycle(0,100,0)},{spread:.9,color:'#b26bff',order:'reverse',duration:2.2});
make('blur-pulse','Blur Pulse','Loops',{blur:cycle(0,.09,0),opacity:cycle(100,75,100)},{spread:.65,duration:2});
make('spring-bounce','Spring Bounce','Loops',{y:cycle(0,-.35,0,-.12,0)},{spread:.8,duration:1.8});
make('dance','Letter Dance','Loops',{rot:cycle(0,-12,0,12,0),scale:cycle(100,113,100,92,100)},{spread:.7});
make('heartbeat','Heartbeat','Loops',{scale:[[0,100],[.15,100],[.25,112],[.35,96],[.46,120],[.62,100],[1,100]]},{spread:.15,duration:1.5});
make('jitter','Electric Jitter','Loops',{x:cycle(0,.04,-.05,.03,-.02,0),y:cycle(0,-.04,.03,-.05,.02,0),rot:cycle(0,2,-3,1,-2,0)},{spread:.8,duration:.65,order:'random'});
make('ellipse','Elliptic Float','Loops',{x:cycle(-.25,0,.25,0,-.25),y:cycle(0,-.12,0,.12,0)},{spread:.6,duration:2.6,order:'center'});
make('soft-blink','Soft Blink','Loops',{opacity:cycle(100,35,100)},{spread:.75,duration:2.2,order:'edges'});
make('word-rise','Word Rise','Words & Lines',{y:pair(.9,0),opacity:fade},{based:'words',spread:.65});
make('word-slide','Word Slide','Words & Lines',{x:pair(-1.6,0),opacity:fade},{based:'words',spread:.65});
make('word-pop','Word Pop','Words & Lines',{scale:cycle(0,120,100),opacity:fade},{based:'words',spread:.6});
make('word-spin','Word Spin','Words & Lines',{rot:pair(-65,0),scale:pair(65,100),opacity:fade},{based:'words',spread:.6});
make('word-focus','Word Focus','Words & Lines',{blur:pair(.22,0),opacity:fade},{based:'words',spread:.7});
make('word-exit','Word Cascade Out','Words & Lines',{y:pair(0,-.6),opacity:out},{based:'words',spread:.7,order:'reverse'});
make('line-rise','Line Rise','Words & Lines',{y:pair(1.2,0),opacity:fade},{based:'lines',spread:.6});
make('line-slide','Line Slide','Words & Lines',{x:pair(2,0),opacity:fade},{based:'lines',spread:.65,order:'reverse'});
make('line-fade','Line Fade','Words & Lines',{opacity:fade},{based:'lines',spread:.8,duration:2});
make('line-tilt','Line Tilt','Words & Lines',{rot:pair(-18,0),y:pair(.4,0),opacity:fade},{based:'lines',spread:.65});
make('line-wave','Line Wave','Words & Lines',{y:cycle(0,-.18,0,.18,0)},{based:'lines',spread:.7,repeat:true,duration:2.2});
make('line-pulse','Line Scale Pulse','Words & Lines',{scale:cycle(100,112,100)},{based:'lines',spread:.7,repeat:true,duration:2.4});
make('out-elastic-drop','Elastic Drop Out','Exits',{y:cycle(0,-.12,.2,1.5),opacity:out},{spread:.45});
make('out-tumble','Tumble Down Out','Exits',{y:pair(0,1.5),rot:pair(0,150),opacity:out});
make('out-focus-punch','Focus Punch Out','Exits',{scale:pair(100,175),blur:pair(0,.25),opacity:out},{order:'center'});
make('out-edge-shrink','Edges Shrink Out','Exits',{scale:pair(100,0),y:pair(0,.5),opacity:out},{order:'edges'});
make('out-random-scatter','Random Scatter Out','Exits',{x:pair(0,.9),y:pair(0,-1),rot:pair(0,-70),opacity:out},{order:'random',spread:.7});
make('out-whip-left','Whip Left Out','Exits',{x:cycle(0,.1,-3),blur:pair(0,.1),opacity:out},{duration:1.1,spread:.4});
make('out-whip-right','Whip Right Out','Exits',{x:cycle(0,-.1,3),rot:pair(0,12),opacity:out},{duration:1.1,spread:.4,order:'reverse'});
make('out-roll','Rolling Exit','Exits',{rot:pair(0,360),y:pair(0,.7),opacity:out},{duration:1.8});
make('out-defocus','Defocus Away','Exits',{scale:pair(100,70),blur:pair(0,.4),opacity:out},{spread:.35});
make('out-tracking-close','Tracking Close Out','Exits',{track:pair(0,-.22),scale:pair(100,85),opacity:out},{spread:.25});
make('out-diagonal','Diagonal Exit','Exits',{x:pair(0,1.2),y:pair(0,-1.2),opacity:out},{order:'reverse'});
make('out-word-drop','Word Drop Out','Words & Lines',{y:pair(0,1.3),rot:pair(0,18),opacity:out},{based:'words',spread:.65});
make('kinetic-stack-in','Kinetic Stack In','Entrances',{y:[[0,1.4],[.58,-.12],[.82,.035],[1,0]],scale:[[0,75],[.6,108],[1,100]],opacity:[[0,0],[.3,100],[1,100]]},{based:'words',spread:.38,duration:2,sample:'MAKE IT MOVE'});
make('editorial-tracking-in','Editorial Tracking In','Entrances',{track:pair(.65,0),blur:[[0,.12],[.65,0],[1,0]],opacity:fade},{spread:.22,duration:2});
make('domino-type-in','Domino Type In','Entrances',{rot:[[0,-80],[.68,8],[1,0]],y:pair(.45,0),opacity:fade},{spread:.62,duration:1.9});
make('rubber-stamp-in','Rubber Stamp In','Entrances',{scale:[[0,180],[.52,92],[.76,103],[1,100]],rot:[[0,-9],[.65,1],[1,0]],opacity:[[0,0],[.25,100],[1,100]]},{based:'words',spread:.25,duration:1.8});
make('ribbon-lines-in','Ribbon Lines In','Entrances',{x:[[0,-2.2],[.7,.06],[1,0]],rot:pair(-12,0),opacity:fade},{based:'lines',spread:.4,duration:2.2});
make('magnet-type-in','Magnet Type In','Entrances',{track:[[0,.9],[.65,-.055],[1,0]],scale:pair(60,100),opacity:fade},{order:'center',spread:.3,duration:2});
make('cinema-title-in','Cinema Title In','Entrances',{scale:pair(120,100),track:pair(.28,0),blur:pair(.16,0),opacity:fade},{spread:.12,duration:2.6});
make('kinetic-stack-out','Kinetic Stack Out','Exits',{y:[[0,0],[.2,-.09],[1,-1.5]],scale:pair(100,80),opacity:out},{based:'words',spread:.38,duration:2,order:'reverse'});
make('editorial-tracking-out','Editorial Tracking Out','Exits',{track:pair(0,.7),blur:pair(0,.16),opacity:out},{spread:.22,duration:2});
make('domino-type-out','Domino Type Out','Exits',{rot:[[0,0],[.2,-5],[1,85]],y:pair(0,.55),opacity:out},{spread:.62,duration:1.9});
make('rubber-stamp-out','Rubber Stamp Out','Exits',{scale:[[0,100],[.25,93],[1,190]],rot:pair(0,10),opacity:out},{based:'words',spread:.25,duration:1.8});
make('ribbon-lines-out','Ribbon Lines Out','Exits',{x:[[0,0],[.2,-.06],[1,2.2]],rot:pair(0,12),opacity:out},{based:'lines',spread:.4,duration:2.2});
make('magnet-type-out','Magnet Type Out','Exits',{track:[[0,0],[.2,-.05],[1,.9]],scale:pair(100,60),opacity:out},{order:'edges',spread:.3,duration:2});
make('cinema-title-out','Cinema Title Out','Exits',{scale:pair(100,120),track:pair(0,.28),blur:pair(0,.16),opacity:out},{spread:.12,duration:2.6});
make('kinetic-conveyor','Kinetic Conveyor','Loops',{x:cycle(0,.22,0,-.22,0),y:cycle(-.09,0,.09,0,-.09),rot:cycle(0,3,0,-3,0)},{based:'words',spread:.7,duration:3});
make('accordion-type','Accordion Type','Loops',{track:cycle(0,.18,0,-.055,0),scale:cycle(100,104,100,96,100)},{spread:.35,duration:3.2});
for(const entry of entries){entry.direction=entry.animationType==='Loops'||entry.repeat?'loop':entry.animationType==='Exits'||(entry.tracks.opacity?.[0][1]===100&&entry.tracks.opacity?.at(-1)[1]===0)?'out':'in';entry.description=entry.direction.toUpperCase()+' · '+({chars:'Letters',words:'Words',lines:'Lines'})[entry.based]+' · editable keyframes'}
return entries})();
function smoothTextPresetKeys(keys,loop=false){
 if(keys.length<2||keys.some(k=>k.hold))return keys;
 const n=keys.length,sec=(a,b)=>(b.v-a.v)/(b.t-a.t),harmonic=(a,b)=>a*b<=0?0:2*a*b/(a+b),slopes=keys.map((k,i)=>i===0||i===n-1?0:harmonic(sec(keys[i-1],k),sec(k,keys[i+1])));
 if(loop&&n>2&&keys[0].v===keys[n-1].v)slopes[0]=slopes[n-1]=harmonic(sec(keys[n-2],keys[n-1]),sec(keys[0],keys[1]));
 for(let i=0;i<n-1;i++){const a=keys[i],b=keys[i+1],dv=b.v-a.v,dt=b.t-a.t;a.ko=[1/3,dv?slopes[i]*dt/(3*dv):0];b.ki=[2/3,dv?1-slopes[i+1]*dt/(3*dv):1]}
 if(n===2&&!loop){keys[0].ko=[.22,0];keys[1].ki=[.18,1]}
 return keys;
}
function upgradeTextPresetEasing(l){for(const a of l.ta||[]){if(a.easingVersion>=1||!a.presetId)continue;for(const prop of a.props||[]){const keys=l.kf?.['n'+a.id+'_'+(prop==='color'?'colorMix':prop)];if(keys?.length&&keys.every(k=>(!k.ko||JSON.stringify(k.ko)==='[0.2,0]'||JSON.stringify(k.ko)==='[0,0]')&&(!k.ki||JSON.stringify(k.ki)==='[0.35,1]'||JSON.stringify(k.ki)==='[1,1]')))smoothTextPresetKeys(keys,a.repeat)}a.easingVersion=1}}
function applyAdvancedTextPreset(l,spec,start){const available=spec.direction==='out'?l.end-l.start:l.end-start;if(available<.05)throw Error('Move the playhead before the layer end');l.advancedPresetGroups=(l.advancedPresetGroups||[]).filter(id=>l.ta?.some(a=>a.id===id));for(const id of l.advancedPresetGroups){const old=l.ta.find(a=>a.id===id);if(old&&!old.presetId)old.presetId=l.advancedTextPreset;}const copies=(l.ta||[]).filter(a=>a.presetId===spec.id).length;const repeat=spec.direction==='loop',duration=Math.min(spec.duration,repeat?available:available*.4);if(spec.direction==='out')start=l.end-duration;const spread=duration*spec.spread,a=addAnimator(l,[]),size=TX(l).size||120;a.name=spec.name+(copies?' '+(copies+1):'');a.presetId=spec.id;a.direction=spec.direction;a.timingVersion=2;a.easingVersion=1;a.based=spec.based;a.temporal=true;a.stagger=spread;a.delayOrder=spec.order;a.seed=37;a.repeat=!!repeat;a.cycle=duration;a.origin=start;a.rangeOpen=false;a.open=true;a.advancedOpen=false;for(const[prop,points]of Object.entries(spec.tracks)){addAnProp(l,a,prop==='colorMix'?'color':prop);if(prop==='colorMix')a.color=spec.color||'#8b5cf6';const pixels=['x','y','track','blur'].includes(prop),limit=ANP[prop],span=repeat?duration:Math.max(.02,duration-spread);l.kf['n'+a.id+'_'+prop]=smoothTextPresetKeys(points.map(([u,value],i)=>({t:start+u*span,v:Math.max(limit[0],Math.min(limit[1],value*(pixels?size:1))),ko:[.2,0],ki:[.35,1],...(spec.step&&i<points.length-1?{hold:true}:{})})),repeat)}l.advancedPresetGroups.push(a.id);l.advancedTextPreset=spec.id;l.xo=true;l.xn=true;l.xt=false;return a}
function textPresetSampleTime(l,a,index,count,time){const times=a.props.flatMap(p=>(l.kf['n'+a.id+'_'+(p==='color'?'colorMix':p)]||[]).map(k=>k.t)),origin=times.length?Math.min(...times):a.origin??l.start;if(time<origin)return null;let phase=count>1?index/(count-1):0;if(a.delayOrder==='reverse')phase=1-phase;else if(a.delayOrder==='center')phase=Math.abs(phase*2-1);else if(a.delayOrder==='edges')phase=1-Math.abs(phase*2-1);else if(a.delayOrder==='random')phase=count>1?rp(count,a.seed||37)[index]/(count-1):0;if(count===1)phase=0;const delay=(a.stagger||0)*phase;if(a.repeat){const period=Math.max(.05,a.cycle||1);return origin+(((time-origin+delay)%period)+period)%period}return time-delay}
function textPresetIdentity(prop){return prop==='opacity'||prop==='scale'?100:0}
// Move old generated exits that were incorrectly placed at layer start to the tail.
function upgradeTextPresetTiming(l){if(l.type!=='text')return;upgradeTextPresetEasing(l);const identify=a=>AdvancedTextPresets.find(p=>p.id===(a.presetId||((l.advancedPresetGroups||[]).includes(a.id)?l.advancedTextPreset:null)))||(['fade-in','rise-in'].includes(a.presetId)?{id:a.presetId,direction:'in',duration:1}:null),oldExit=(l.ta||[]).some(a=>a.timingVersion!==2&&identify(a)?.direction==='out'&&Math.abs((a.origin??l.start)-l.start)<.02);for(const a of l.ta||[]){if(a.timingVersion>=2)continue;const spec=identify(a);if(!spec)continue;const keys=Object.entries(l.kf||{}).filter(([k])=>k.startsWith('n'+a.id+'_')&&!/_(?:start|end|off)$/.test(k)),times=keys.flatMap(([,ks])=>ks.map(k=>k.t));a.presetId=spec.id;a.direction=spec.direction;a.origin??=times.length?Math.min(...times):l.start;const duration=Math.max(.05,a.cycle||((times.length?Math.max(...times):a.origin)-a.origin+(a.stagger||0))||spec.duration),atStart=Math.abs(a.origin-l.start)<.02,authored=times.length&&Math.abs(Math.min(...times)-a.origin)<.02&&Math.abs(Math.max(...times)-a.origin+(a.stagger||0)-duration)<.03&&(a.cycle||duration<=spec.duration+.03),retime=atStart&&authored&&(spec.direction==='out'||oldExit&&spec.direction==='in'&&duration>(l.end-l.start)*.4);if(retime){const targetDuration=Math.min(duration,(l.end-l.start)*.4),ratio=targetDuration/duration,newOrigin=spec.direction==='out'?l.end-targetDuration:l.start;for(const[,points]of keys)for(const point of points)point.t=newOrigin+(point.t-a.origin)*ratio;a.stagger=(a.stagger||0)*ratio;a.cycle=targetDuration;a.origin=newOrigin;}a.temporal=true;a.timingVersion=2}}

function applySimpleTextMotion(l,id,start,end){const base=id==='fade-in'?'Fade In':'Rise In',copies=(l.ta||[]).filter(a=>a.presetId===id).length,a=addAnimator(l,id==='fade-in'?['opacity']:['y','opacity']);a.name=base+(copies?' '+(copies+1):'');a.presetId=id;a.temporal=true;a.origin=start;a.direction='in';a.timingVersion=2;a.stagger=0;presetKeys(l,'n'+a.id+'_opacity',start,end,0,100);if(id==='rise-in')presetKeys(l,'n'+a.id+'_y',start,end,C.h*.15,0);for(const prop of a.props)smoothTextPresetKeys(l.kf['n'+a.id+'_'+prop]||[]);a.easingVersion=1;l.advancedPresetGroups=(l.advancedPresetGroups||[]).filter(key=>l.ta.some(a=>a.id===key));l.advancedPresetGroups.push(a.id);l.advancedTextPreset=id;l.xo=true;l.xn=true;l.xt=false;return a}
