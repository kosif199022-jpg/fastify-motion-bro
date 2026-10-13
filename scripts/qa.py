#!/usr/bin/env python3
"""Basic technical QA via ffprobe. Manual content/audio QA remains required."""
import json,sys,subprocess
from pathlib import Path
def main():
 if len(sys.argv)<2:sys.exit("Usage: python scripts/qa.py output/final.mp4")
 f=Path(sys.argv[1]);report=Path("output/qa_report.json");report.parent.mkdir(exist_ok=True)
 if not f.is_file():sys.exit("file not found: "+str(f))
 p=subprocess.run(["ffprobe","-v","error","-show_entries","format=duration,size:stream=codec_name,codec_type,width,height,r_frame_rate","-of","json",str(f)],capture_output=True,text=True)
 if p.returncode:sys.exit("ffprobe error: "+p.stderr[:500])
 d=json.loads(p.stdout);videos=[s for s in d.get("streams",[]) if s.get("codec_type")=="video"]
 video=videos[0] if videos else {}
 ok=bool(videos) and video.get("codec_name")=="h264" and int(video.get("width",0))%2==0 and int(video.get("height",0))%2==0 and float(d.get("format",{}).get("duration",0))>0
 doc={"ok":ok,"file":str(f),"duration":float(d.get("format",{}).get("duration",0)),"video":video,"bytes":f.stat().st_size,"manual_visual_review":"NOT_DONE","audio_word_alignment":"NOT_VERIFIED"}
 report.write_text(json.dumps(doc,ensure_ascii=False,indent=2),encoding="utf-8")
 print(json.dumps(doc,ensure_ascii=False,indent=2))
 if not ok:sys.exit(1)
if __name__=="__main__":main()
