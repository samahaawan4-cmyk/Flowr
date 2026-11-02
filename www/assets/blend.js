/* Original 8-bit RGBA compositor. Standard mode equations follow the PDF/W3C
   compositing model. Classic compatibility modes and Luminescent Premul are
   explicitly approximate; no Adobe project/HDR compatibility is implied. */
const FlowrBlend=(()=>{
const groups=[
 ['Normal',[['source-over','Normal'],['dissolve','Dissolve'],['dancing-dissolve','Dancing Dissolve']]],
 ['Darken',[['darken','Darken'],['multiply','Multiply'],['color-burn','Color Burn'],['classic-color-burn','Classic Color Burn',true],['linear-burn','Linear Burn'],['darker-color','Darker Color']]],
 ['Lighten',[['add','Add'],['lighten','Lighten'],['screen','Screen'],['color-dodge','Color Dodge'],['classic-color-dodge','Classic Color Dodge',true],['linear-dodge','Linear Dodge'],['lighter-color','Lighter Color']]],
 ['Contrast',[['overlay','Overlay'],['soft-light','Soft Light'],['hard-light','Hard Light'],['linear-light','Linear Light'],['vivid-light','Vivid Light'],['pin-light','Pin Light'],['hard-mix','Hard Mix']]],
 ['Difference',[['difference','Difference'],['classic-difference','Classic Difference',true],['exclusion','Exclusion'],['subtract','Subtract'],['divide','Divide']]],
 ['Color',[['hue','Hue'],['saturation','Saturation'],['color','Color'],['luminosity','Luminosity']]],
 ['Matte',[['stencil-alpha','Stencil Alpha'],['stencil-luma','Stencil Luma'],['silhouette-alpha','Silhouette Alpha'],['silhouette-luma','Silhouette Luma']]],
 ['Utility',[['alpha-add','Alpha Add'],['luminescent-premul','Luminescent Premul',true]]]
];
const modes=groups.flatMap(([group,entries])=>entries.map(([key,label,approx])=>({key,label,group,approx:!!approx}))),lookup=new Map(modes.map(m=>[m.key,m]));
const clamp=x=>Math.max(0,Math.min(1,x)),lum=c=>.3*c[0]+.59*c[1]+.11*c[2],sat=c=>Math.max(...c)-Math.min(...c);
const aliases={normal:'source-over',lighter:'add','destination-in':'stencil-alpha','destination-out':'silhouette-alpha'};
const key=m=>lookup.has(m)?m:aliases[m]||'source-over';
const nativeNames=new Set(['source-over','darken','multiply','color-burn','lighten','screen','color-dodge','overlay','soft-light','hard-light','difference','exclusion','hue','saturation','color','luminosity']);
let probe;const support=new Map();
function native(m){m=key(m);if(!nativeNames.has(m))return null;if(!support.has(m)){probe=probe||document.createElement('canvas').getContext('2d');probe.globalCompositeOperation='source-over';probe.globalCompositeOperation=m;support.set(m,probe.globalCompositeOperation===m)}return support.get(m)?m:null}
function clipColor(c){const l=lum(c),lo=Math.min(...c),hi=Math.max(...c);if(lo<0)for(let i=0;i<3;i++)c[i]=l+(c[i]-l)*l/(l-lo||1);if(hi>1)for(let i=0;i<3;i++)c[i]=l+(c[i]-l)*(1-l)/(hi-l||1);return c.map(clamp)}
function setLum(c,l){const d=l-lum(c);return clipColor(c.map(v=>v+d))}
function setSat(c,s){const order=[0,1,2].sort((a,b)=>c[a]-c[b]),out=[0,0,0],[lo,mid,hi]=order;if(c[hi]>c[lo]){out[mid]=(c[mid]-c[lo])*s/(c[hi]-c[lo]);out[hi]=s}return out}
const burn=(b,s)=>b>=1?1:s<=0?0:1-Math.min(1,(1-b)/s),dodge=(b,s)=>b<=0?0:s>=1?1:Math.min(1,b/(1-s));
function channel(m,b,s){switch(m){case'darken':return Math.min(b,s);case'multiply':return b*s;case'color-burn':case'classic-color-burn':return burn(b,s);case'linear-burn':return clamp(b+s-1);case'add':case'linear-dodge':return clamp(b+s);case'lighten':return Math.max(b,s);case'screen':return b+s-b*s;case'color-dodge':case'classic-color-dodge':return dodge(b,s);case'overlay':return b<=.5?2*b*s:1-2*(1-b)*(1-s);case'hard-light':return s<=.5?2*b*s:1-2*(1-b)*(1-s);case'soft-light':return s<=.5?b-(1-2*s)*b*(1-b):b+(2*s-1)*((b<=.25?((16*b-12)*b+4)*b:Math.sqrt(b))-b);case'linear-light':return clamp(b+2*s-1);case'vivid-light':return s<=.5?burn(b,2*s):dodge(b,2*s-1);case'pin-light':return s<=.5?Math.min(b,2*s):Math.max(b,2*s-1);case'hard-mix':return channel('vivid-light',b,s)<.5?0:1;case'difference':case'classic-difference':return Math.abs(b-s);case'exclusion':return b+s-2*b*s;case'subtract':return clamp(b-s);case'divide':return s<=0?(b<=0?0:1):clamp(b/s);default:return s}}
function blend(m,b,s,out){switch(m){case'darker-color':return b[0]+b[1]+b[2]<=s[0]+s[1]+s[2]?b:s;case'lighter-color':return b[0]+b[1]+b[2]>=s[0]+s[1]+s[2]?b:s;case'hue':return setLum(setSat(s,sat(b)),lum(b));case'saturation':return setLum(setSat(b,sat(s)),lum(b));case'color':return setLum(s,lum(b));case'luminosity':return setLum(b,lum(s));default:for(let i=0;i<3;i++)out[i]=channel(m,b[i],s[i]);return out}}
function random(x,y,seed,frame){let v=Math.imul(x+17,374761393)^Math.imul(y+29,668265263)^Math.imul(seed+1,1274126177)^Math.imul(frame+11,1597334677);v=Math.imul(v^(v>>>13),1274126177);return((v^(v>>>16))>>>0)/4294967296}
// Public buffer API supports deterministic tests without a browser compositor.
function pixels(back,source,mode,opacity=1,{time=0,fps=30,seed=1,width=1,adjustment=false}={}){const m=key(mode),out=new Uint8ClampedArray(back.length),op=clamp(opacity),frame=m==='dancing-dissolve'?Math.floor(time*fps):0,matte=m.startsWith('stencil-')||m.startsWith('silhouette-'),dissolve=m==='dissolve'||m==='dancing-dissolve',b=[0,0,0],s=[0,0,0],colorBuffer=[0,0,0],prem=[0,0,0];
for(let i=0;i<back.length;i+=4){for(let ch=0;ch<3;ch++){b[ch]=back[i+ch]/255;s[ch]=source[i+ch]/255}const ab=back[i+3]/255,rawAs=source[i+3]/255;if(!adjustment&&!matte&&(!rawAs||!op)){for(let ch=0;ch<4;ch++)out[i+ch]=back[i+ch];continue}let as=rawAs*(adjustment?1:op),a,c;
if(matte){const mask=as*(m.endsWith('luma')?lum(s):1),factor=m.startsWith('stencil-')?mask:1-mask;a=ab*factor;c=b}
else if(m==='alpha-add'){a=clamp(ab+as);const weight=ab+as;c=prem;for(let ch=0;ch<3;ch++)c[ch]=weight?(b[ch]*ab+s[ch]*as)/weight:0}
else if(m==='luminescent-premul'){a=as+ab*(1-as);c=prem;for(let ch=0;ch<3;ch++)c[ch]=a?clamp((s[ch]*(adjustment?1:op)+b[ch]*ab*(1-as))/a):0}
else{if(dissolve){const p=i/4;as=random(p%width,Math.floor(p/width),seed,frame)<as?1:0}const color=blend(dissolve?'source-over':m,b,s,colorBuffer);if(adjustment&&!dissolve){a=rawAs;c=color}else{a=as+ab*(1-as);c=prem;for(let ch=0;ch<3;ch++)c[ch]=a?((1-as)*ab*b[ch]+as*(1-ab)*s[ch]+as*ab*color[ch])/a:0}}
if(adjustment){const targetAlpha=a;a=ab*(1-op)+targetAlpha*op;for(let ch=0;ch<3;ch++)prem[ch]=a?(b[ch]*ab*(1-op)+c[ch]*targetAlpha*op)/a:0;c=prem}
for(let ch=0;ch<3;ch++)out[i+ch]=a?clamp(c[ch])*255:0;out[i+3]=a*255}
return out}
let filterCanvas;
function sourceFor(source,filter){if(!filter||filter==='none')return source;filterCanvas=filterCanvas||document.createElement('canvas');if(filterCanvas.width!==source.width||filterCanvas.height!==source.height){filterCanvas.width=source.width;filterCanvas.height=source.height}const x=filterCanvas.getContext('2d');x.setTransform(1,0,0,1,0,0);x.globalAlpha=1;x.globalCompositeOperation='source-over';x.clearRect(0,0,source.width,source.height);x.filter=filter;x.drawImage(source,0,0);x.filter='none';return filterCanvas}
function draw(ctx,source,{mode='source-over',opacity=1,time=0,fps=30,seed=1,filter='none',adjustment=false}={}){const m=key(mode),operation=!adjustment&&native(m);if(operation){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalCompositeOperation=operation;ctx.globalAlpha=clamp(opacity);ctx.filter=filter;ctx.drawImage(source,0,0);ctx.restore();return}const S=sourceFor(source,filter),w=S.width,h=S.height,s=S.getContext('2d').getImageData(0,0,w,h),back=ctx.getImageData(0,0,w,h),data=pixels(back.data,s.data,m,opacity,{time,fps,seed,width:w,adjustment});back.data.set(data);ctx.putImageData(back,0,0)}
return{groups,modes,key,info:m=>lookup.get(key(m)),native,needsBuffer:m=>!native(m),pixels,draw};
})();
