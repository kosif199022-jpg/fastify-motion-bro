#!/usr/bin/env python3
"""Chromium integration QA: captions must change real Canvas pixels, not just JSON/DOM."""
import json
import mimetypes
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]

def main():
    from playwright.sync_api import sync_playwright
    story = json.loads((ROOT / 'project' / 'storyboard.json').read_text(encoding='utf-8'))
    captions = story.get('captions', [])
    assert captions, 'No captions attached to storyboard'
    assert story.get('duration_seconds', 0) >= captions[0]['end'], 'First caption out of bounds'
    errors = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True, args=['--disable-gpu', '--no-sandbox'])
        try:
            page = browser.new_page(viewport={'width': 360, 'height': 640})
            page.on('pageerror', lambda exc: errors.append(str(exc)))
            page.add_init_script('window.__FMB_STORYBOARD__ = ' +
                                 json.dumps(story, ensure_ascii=False) + ';')
            def intercept(route):
                path = unquote(urlsplit(route.request.url).path)
                rel = 'web/index.html' if path == '/' else path.lstrip('/')
                full = (ROOT / rel).resolve()
                if not full.is_relative_to(ROOT) or not rel.startswith(('web/', 'project/')):
                    return route.fulfill(status=403, body='Forbidden')
                if not full.is_file():
                    return route.fulfill(status=404, body='Not found')
                return route.fulfill(status=200, body=full.read_bytes(),
                                     content_type=mimetypes.guess_type(full.name)[0] or 'application/octet-stream')
            page.route('http://fmb.local/**', intercept)
            page.goto('http://fmb.local/', wait_until='load')
            page.wait_for_function('window.fmbReady === true', timeout=10000)
            # Re-render the same timestamp, first with captions and then without.
            # The only changed variable is the optional caption track.
            result = page.evaluate("""() => {
              const story=window.__FMB_STORYBOARD__;
              const canvas=document.querySelector('#stage');
              const ctx=canvas.getContext('2d',{willReadFrequently:true});
              const t=Math.max(story.captions[0].start+0.3,0.3);
              function digest(){
                const pixels=ctx.getImageData(0,Math.floor(canvas.height*.72),canvas.width,
                  Math.floor(canvas.height*.26)).data;
                let hash=2166136261;
                for(let i=0;i<pixels.length;i+=4) {
                  hash=Math.imul(hash^pixels[i],16777619)>>>0;
                  hash=Math.imul(hash^pixels[i+1],16777619)>>>0;
                  hash=Math.imul(hash^pixels[i+2],16777619)>>>0;
                }
                return hash;
              }
              window.renderFrame(t);
              const withCaptions=digest();
              const copy=story.captions;
              story.captions=[];
              window.renderFrame(t);
              const withoutCaptions=digest();
              story.captions=copy;
              return {withCaptions,withoutCaptions,number:copy.length,
                canvasWidth:canvas.width,canvasHeight:canvas.height};
            }""")
            assert not errors, 'Browser JS errors: ' + ' | '.join(errors)
            assert result['withCaptions'] != result['withoutCaptions'], (
                'Caption overlay did not change the frame pixels')
            # Also verify the optional keyframed native hero moves in a real browser.
            # Temporarily select generic native mode on the same fixture; Viral Editorial
            # uses a separate renderer and must remain untouched in the repository.
            keyed = page.evaluate("""() => {
              const s=window.__FMB_STORYBOARD__,first=s.scenes[0],c=document.querySelector('#stage');
              const oldProfile=s.profile,oldCaptions=s.captions,oldMotion=first.motion;
              function digest(){
                const data=c.getContext('2d').getImageData(0,0,c.width,Math.floor(c.height*.58)).data;
                let hash=2166136261;
                for(let i=0;i<data.length;i+=8)hash=Math.imul(hash^data[i],16777619)>>>0;
                return hash;
              }
              s.profile='generic';s.captions=[];
              first.motion={tracks:{x:[{time:0,value:-.25},{time:2,value:.25}]}};
              window.renderFrame(1);const withKeyframes=digest();
              if(oldMotion===undefined)delete first.motion;else first.motion=oldMotion;
              window.renderFrame(1);const withoutKeyframes=digest();
              s.profile=oldProfile;s.captions=oldCaptions;
              return {withKeyframes,withoutKeyframes};
            }""")
            assert keyed['withKeyframes'] != keyed['withoutKeyframes'], (
                'Native keyframe motion did not change real Canvas pixels')
            print(json.dumps({'ok': True, 'test': 'caption-overlaid-and-visible',
                              **result, **keyed, 'human_typography_review': 'NOT_DONE'}, ensure_ascii=False))
        finally:
            browser.close()

if __name__ == '__main__':
    main()
