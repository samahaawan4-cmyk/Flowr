import * as T from 'three';
const rad=Math.PI/180,limit=v=>Math.max(-80,Math.min(80,Number.isFinite(v)?v:0));
export function shearMatrix(x=0,y=0){const a=Math.tan(limit(x)*rad),b=Math.tan(limit(y)*rad);return new T.Matrix4().set(1+a*b,a,0,0,b,1,0,0,0,0,1,0,0,0,0,1)}
// Preserve shear in the actual local matrix instead of decomposing it into TRS.
export function matrixEffects(node,x=0,y=0,pose=null){node.userData.flowrShear=[x,y];node.userData.flowrPose=pose;node.updateMatrix=function(){this.matrix.compose(this.position,this.quaternion,this.scale);const [x,y]=this.userData.flowrShear||[0,0];if(x||y)this.matrix.multiply(shearMatrix(x,y));if(this.userData.flowrPose)this.matrix.premultiply(this.userData.flowrPose);this.matrixWorldNeedsUpdate=true};node.matrixAutoUpdate=true}
export function poseMatrix(v){return new T.Matrix4().compose(new T.Vector3(v.x??0,v.y??0,v.z??0),new T.Quaternion().setFromEuler(new T.Euler((v.rx??0)*rad,(v.ry??0)*rad,(v.rz??0)*rad)),new T.Vector3(Math.max(.001,(v.sx??100)/100),Math.max(.001,(v.sy??100)/100),Math.max(.001,(v.sz??100)/100))).multiply(shearMatrix(v.skewX??0,v.skewY??0))}
