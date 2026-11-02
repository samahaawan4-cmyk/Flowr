"""Deterministic articulated RGB fixture; requires Pillow and ffmpeg."""
from PIL import Image, ImageDraw
from pathlib import Path
import tempfile,subprocess,math
out=Path(__file__).resolve().parents[1]/'tests/fixtures/roto-articulated.webm'
with tempfile.TemporaryDirectory() as tmp:
 for n in range(36):
  u=min(1,n/30);dx=round(70*u);v=round(25*math.sin(u*math.pi*2))
  im=Image.new('RGB',(320,180));p=im.load()
  for y in range(180):
   for x in range(320):p[x,y]=(25+(x+round(12*u))%11,65+y%7,115)
  d=ImageDraw.Draw(im);d.rectangle((62+dx,52,100+dx,130),fill=(175,72,55));d.polygon([(96+dx,56),(133+dx,56+v),(133+dx,69+v),(96+dx,72)],fill=(175,72,55));d.ellipse((62+dx,17,98+dx,53),fill=(215,163,111))
  # Repeating surface texture and facial features supply genuine local correspondences.
  for y in range(58,128,8):
   for x in range(65+dx,98+dx,8):d.rectangle((x,y,x+2,y+2),fill=(199,96,79))
  d.ellipse((71+dx,31,74+dx,34),fill=(35,25,20));d.ellipse((86+dx,31,89+dx,34),fill=(35,25,20));d.line((74+dx,43,86+dx,43),fill=(40,27,20),width=2)
  im.save(Path(tmp)/f'{n:03}.png')
 subprocess.run(['ffmpeg','-v','error','-y','-framerate','30','-i',str(Path(tmp)/'%03d.png'),'-c:v','libvpx-vp9','-lossless','1','-pix_fmt','yuv420p',str(out)],check=True)
print(out)
