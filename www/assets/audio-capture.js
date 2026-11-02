// Captures the editor's final stereo mix, never the microphone.
class FlowrCapture extends AudioWorkletProcessor {
 constructor(options){super();this.remaining=options.processorOptions.frames;this.left=new Float32Array(2048);this.right=new Float32Array(2048);this.used=0;this.done=false}
 flush(){if(!this.used)return;const left=this.left.slice(0,this.used),right=this.right.slice(0,this.used);this.port.postMessage({left,right},[left.buffer,right.buffer]);this.used=0}
 process(inputs,outputs){for(const output of outputs)for(const ch of output)ch.fill(0);if(this.done)return false;const input=inputs[0]||[],n=Math.min(128,this.remaining);for(let i=0;i<n;i++){this.left[this.used]=input[0]?.[i]||0;this.right[this.used]=input[1]?.[i]??input[0]?.[i]??0;if(++this.used===2048)this.flush()}this.remaining-=n;if(this.remaining<=0){this.flush();this.port.postMessage({done:true});this.done=true;return false}return true}
}
registerProcessor('flowr-capture',FlowrCapture);
