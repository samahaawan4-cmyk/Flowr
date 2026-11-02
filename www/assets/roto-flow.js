/* Bounded RGB patch motion for roto mattes. No DOM; usable in the analysis worker. */
function createRotoFlow(){
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function track({previous,current,width:W,height:H,alpha,search=24,hint}){
  const scale=Math.min(1,256/Math.max(W,H)),w=Math.max(8,Math.round(W*scale)),h=Math.max(8,Math.round(H*scale)),A=new Uint8Array(w*h*3),B=new Uint8Array(A.length),mask=new Uint8Array(w*h);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x,j=Math.min(H-1,Math.floor(y/scale))*W+Math.min(W-1,Math.floor(x/scale));for(let c=0;c<3;c++){A[i*3+c]=previous[j*4+c];B[i*3+c]=current[j*4+c]}mask[i]=alpha[j]}
  let x0=w,y0=h,x1=0,y1=0;for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(mask[y*w+x]>96){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}if(x1<=x0||y1<=y0)return{ok:false,reason:'The foreground is too small to track.'};
  const samples=[],stride=Math.max(2,Math.floor(Math.max(x1-x0,y1-y0)/24));for(let y=Math.max(2,y0-3);y<=Math.min(h-3,y1+3);y+=stride)for(let x=Math.max(2,x0-3);x<=Math.min(w-3,x1+3);x+=stride)if(mask[y*w+x]>96||mask[(clamp(y,y0,y1))*w+clamp(x,x0,x1)]>96)samples.push([x,y]);
  const get=(im,x,y,c)=>im[(clamp(Math.round(y),0,h-1)*w+clamp(Math.round(x),0,w-1))*3+c];
  const globalCost=M=>{let error=0,n=0;for(const[x,y]of samples){const xx=M.a*x-M.b*y+M.x,yy=M.b*x+M.a*y+M.y;if(xx<1||yy<1||xx>w-2||yy>h-2){error+=90;n++;continue}for(let c=0;c<3;c++)error+=Math.min(70,Math.abs(get(A,x,y,c)-get(B,xx,yy,c)))/3;n++}return error/Math.max(1,n)};
  let M=hint?{a:hint.a,b:hint.b,x:hint.x*scale,y:hint.y*scale}:{a:1,b:0,x:0,y:0};let best=globalCost(M);const range=Math.max(4,Math.min(80,Math.ceil(search*scale))),coarse=Math.max(2,Math.round(range/6));
  for(let dy=-range;dy<=range;dy+=coarse)for(let dx=-range;dx<=range;dx+=coarse){const m={a:1,b:0,x:dx,y:dy},cost=globalCost(m);if(cost<best){best=cost;M=m}}
  const center={...M};for(let dy=-coarse;dy<=coarse;dy++)for(let dx=-coarse;dx<=coarse;dx++){const m={...center,x:center.x+dx,y:center.y+dy},cost=globalCost(m);if(cost<best){best=cost;M=m}}
  if(best>34)return{ok:false,reason:'The image changed too much to track reliably.'};
  const spacing=6,cols=Math.ceil((w-1)/spacing)+1,rows=Math.ceil((h-1)/spacing)+1,dx=new Float32Array(cols*rows),dy=new Float32Array(dx.length),quality=new Float32Array(dx.length),localRange=Math.min(12,Math.max(4,Math.ceil(range*.4)));
  function patch(P,Q,x,y,xx,yy){if(xx<3||yy<3||xx>w-4||yy>h-4)return 1e6;let cost=0;for(let v=-3;v<=3;v+=2)for(let u=-3;u<=3;u+=2)for(let c=0;c<3;c++)cost+=Math.min(60,Math.abs(get(P,x+u,y+v,c)-get(Q,xx+u,yy+v,c)));return cost/48}
  function match(P,Q,x,y,px,py,r){let result={x:px,y:py,cost:patch(P,Q,x,y,px,py),score:Infinity};result.score=result.cost;for(let v=-r;v<=r;v+=2)for(let u=-r;u<=r;u+=2){const xx=px+u,yy=py+v,cost=patch(P,Q,x,y,xx,yy),score=cost+.035*(Math.abs(u)+Math.abs(v));if(score<result.score)result={x:xx,y:yy,cost,score}}const mid={...result};for(let v=-1;v<=1;v++)for(let u=-1;u<=1;u++){const xx=mid.x+u,yy=mid.y+v,cost=patch(P,Q,x,y,xx,yy),score=cost+.035*(Math.abs(xx-px)+Math.abs(yy-py));if(score<result.score)result={x:xx,y:yy,cost,score}}return result}
  let good=0,relevant=0;for(let gy=0;gy<rows;gy++)for(let gx=0;gx<cols;gx++){const x=Math.min(w-1,gx*spacing),y=Math.min(h-1,gy*spacing),i=gy*cols+gx,px=M.a*x-M.b*y+M.x,py=M.b*x+M.a*y+M.y;dx[i]=px-x;dy[i]=py-y;quality[i]=.3;if(x<4||y<4||x>w-5||y>h-5)continue;let near=false;for(let v=-5;v<=5;v+=5)for(let u=-5;u<=5;u+=5)if(mask[clamp(y+v,0,h-1)*w+clamp(x+u,0,w-1)]>64)near=true;if(!near)continue;relevant++;const q=match(A,B,x,y,px,py,localRange),back=match(B,A,q.x,q.y,x,y,4),fb=Math.hypot(back.x-x,back.y-y);if(q.cost<25&&fb<2.5){dx[i]=q.x-x;dy[i]=q.y-y;quality[i]=Math.max(.35,(1-q.cost/35)*(1-fb/4));good++}else quality[i]=.08}
  const confidence=Math.min(1,(1-best/45)*.55+good/Math.max(1,relevant)*.45);if(confidence<.3)return{ok:false,reason:'Local motion lost foreground agreement.'};
  // Fill rejected local samples from reliable neighbors, retaining the global estimate where unsupported.
  const X=dx.slice(),Y=dy.slice();for(let gy=0;gy<rows;gy++)for(let gx=0;gx<cols;gx++){const i=gy*cols+gx;if(quality[i]>=.35)continue;let sx=0,sy=0,weight=0;for(let v=-2;v<=2;v++)for(let u=-2;u<=2;u++){const xx=gx+u,yy=gy+v;if(xx<0||yy<0||xx>=cols||yy>=rows)continue;const j=yy*cols+xx;if(quality[j]<.35)continue;const wt=quality[j]/(1+u*u+v*v);sx+=X[j]*wt;sy+=Y[j]*wt;weight+=wt}if(weight){dx[i]=sx/weight;dy[i]=sy/weight}}
  return{ok:true,M:{...M,x:M.x/scale,y:M.y/scale},dx,dy,quality,cols,rows,spacing:spacing/scale,scale,confidence,error:best};
 }
 return{track};
}
const RotoFlow=createRotoFlow();
function rotoFlowMotion(result){const sample=(field,x,y)=>{x=Math.max(0,Math.min(result.cols-1.001,x/result.spacing));y=Math.max(0,Math.min(result.rows-1.001,y/result.spacing));const xx=Math.floor(x),yy=Math.floor(y),u=x-xx,v=y-yy,i=yy*result.cols+xx;return(field[i]*(1-u)*(1-v)+field[i+1]*u*(1-v)+field[i+result.cols]*(1-u)*v+field[i+result.cols+1]*u*v)/result.scale};return{ok:true,M:result.M,confidence:result.confidence,deform:p=>[p[0]+sample(result.dx,...p),p[1]+sample(result.dy,...p)],quality:p=>sample(result.quality,...p)*result.scale}}
