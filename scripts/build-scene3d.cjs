require('./build-font-data.cjs');
const esbuild=require('esbuild'),path=require('path');esbuild.buildSync({entryPoints:[path.resolve(__dirname,'../src/scene3d-engine.js')],bundle:true,format:'iife',globalName:'Flowr3DEngine',target:'es2020',minify:true,legalComments:'eof',outfile:path.resolve(__dirname,'../www/vendor/3d/engine.js')});
