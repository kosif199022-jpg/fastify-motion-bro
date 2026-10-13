#!/usr/bin/env python3
"""Render deterministic Canvas frames via Playwright+FFmpeg. No localhost needed."""
import argparse, base64, json, mimetypes, subprocess, sys
from pathlib import Path
from urllib.parse import urlsplit, unquote
ROOT=Path(__file__).resolve().parents[1]
def main():
    p=argparse.ArgumentParser()
    p.add_argument("--smoke",action="store_true")
    p.add_argument("--approved",action="store_true")
    p.add_argument("--seconds",type=float,default=None)
    p.add_argument("--height",type=int,default=1080)
    p.add_argument("--fps",type=int,default=30)
    p.add_argument("--output",default="output/final.mp4")
    p.add_argument("--audio",help="Optional licensed user-provided voice or soundtrack")
    args=p.parse_args()
    if args.approved==args.smoke: p.error("Choose exactly one: --smoke or --approved")
    if args.height<144 or args.height>3840 or args.height%2:p.error("height must be even between 144 and 3840")
    if args.fps<1 or args.fps>60:p.error("fps must be 1..60")
    path=ROOT/"project"/"storyboard.json"
    if not path.is_file(): p.error("Missing storyboard; run npm run plan")
    story=json.loads(path.read_text(encoding="utf-8"))
    duration=float(story.get("duration_seconds",0))
    if story.get("profile") == "viral-editorial-3d" and args.approved and story.get("approval",{}).get("final_render") is not True:
        p.error("Viral Editorial final render requires explicit user approval recorded in storyboard.json")
    if duration<0.1 or duration>600:p.error("invalid storyboard duration")
    if args.smoke: duration=min(duration,args.seconds or 2,12)
    elif args.seconds is not None: duration=min(duration,args.seconds)
    aspect=story.get("aspect","9:16")
    if aspect not in {"9:16","16:9","1:1"}:p.error("invalid aspect")
    w=round(args.height*(16/9 if aspect=="16:9" else 1 if aspect=="1:1" else 9/16))
    w=w+(w%2)
    h=args.height
    out=(ROOT/args.output).resolve() if not Path(args.output).is_absolute() else Path(args.output)
    out.parent.mkdir(parents=True,exist_ok=True)
    if args.audio and not Path(args.audio).is_file():p.error("audio does not exist")
    try:from playwright.sync_api import sync_playwright
    except ImportError:p.error("playwright missing: pip install -r requirements-render.txt")
    cmd=["ffmpeg","-hide_banner","-loglevel","error","-y","-f","image2pipe","-vcodec","png","-framerate",str(args.fps),"-i","pipe:0"]
    if args.audio:cmd+=["-i",args.audio,"-map","0:v","-map","1:a","-c:a","aac","-b:a","192k","-shortest"]
    else:cmd+=["-an"]
    cmd+=["-c:v","libx264","-pix_fmt","yuv420p","-preset","veryfast","-crf","19","-movflags","+faststart",str(out)]
    n=max(1,round(duration*args.fps))
    proc=None
    with sync_playwright() as pw:
        browser=pw.chromium.launch(headless=True,args=["--disable-gpu","--no-sandbox"])
        page=browser.new_page(viewport={"width":w,"height":h})
        page.add_init_script("window.__FMB_STORYBOARD__ = "+json.dumps(story,ensure_ascii=False)+";")
        def intercept(route):
            url=unquote(urlsplit(route.request.url).path)
            rel="web/index.html" if url=="/" else url.lstrip("/")
            full=(ROOT/rel).resolve()
            if not full.is_relative_to(ROOT) or not (rel.startswith(("web/","project/"))):
                route.fulfill(status=403,body="Forbidden")
            elif full.is_file():
                route.fulfill(status=200,body=full.read_bytes(),content_type=(mimetypes.guess_type(full.name)[0] or "application/octet-stream"))
            else:route.fulfill(status=404,body="Not found")
        page.route("http://fmb.local/**",intercept)
        page.goto("http://fmb.local/",wait_until="load")
        page.wait_for_function("window.fmbReady === true",timeout=10000)
        page.evaluate("""size => { let c=document.querySelector('#stage'); c.width=size[0]; c.height=size[1]; }""",[w,h])
        proc=subprocess.Popen(cmd,stdin=subprocess.PIPE,stderr=subprocess.PIPE)
        try:
            for i in range(n):
                png=page.evaluate("""t => { window.renderFrame(t); return document.querySelector('#stage').toDataURL('image/png').split(',')[1]; }""",i/args.fps)
                proc.stdin.write(base64.b64decode(png))
                if i%max(1,args.fps*5)==0:print(f"frame {i+1}/{n}",flush=True)
            proc.stdin.close()
            stderr=proc.stderr.read().decode(errors="replace");rc=proc.wait()
            if rc:raise RuntimeError("ffmpeg failed: "+stderr[:1500])
        except Exception:
            if proc.poll() is None:proc.kill()
            raise
        finally:browser.close()
    if not out.is_file() or not out.stat().st_size:raise RuntimeError("MP4 missing")
    print(json.dumps({"output":str(out),"frames":n,"width":w,"height":h,"fps":args.fps,"duration_target":n/args.fps},ensure_ascii=False))
if __name__=="__main__":main()
