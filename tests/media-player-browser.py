import asyncio,json,pathlib,re,os,subprocess,tempfile
# Requer o Vite em execução, Playwright/Chromium e ffmpeg. Sem assets de teste no deploy.
artifact_dir=pathlib.Path(tempfile.mkdtemp(prefix="miranda-browser-"))
video_path=artifact_dir / "sample.mp4"
subprocess.run(["ffmpeg","-y","-f","lavfi","-i","testsrc2=size=640x360:rate=24","-f","lavfi","-i","sine=frequency=440:sample_rate=44100","-t","20","-c:v","libx264","-preset","ultrafast","-pix_fmt","yuv420p","-c:a","aac",str(video_path),"-loglevel","error"],check=True)
from playwright.async_api import async_playwright
BASE=os.environ.get('MIRANDA_QA_BASE_URL','http://127.0.0.1:5173')
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
  for width in [320,375,390,430,768,1440]:
   ctx=await b.new_context(viewport={'width':width,'height':900},is_mobile=width<1000,has_touch=width<1000,ignore_https_errors=True)
   async def video_response(route):
    data=video_path.read_bytes();rg=route.request.headers.get('range','')
    match=re.match(r'bytes=(\d+)-(\d*)',rg)
    if match:
     start=int(match[1]);end=int(match[2]) if match[2] else len(data)-1
     await route.fulfill(status=206,content_type='video/mp4',headers={'Accept-Ranges':'bytes','Content-Range':f'bytes {start}-{end}/{len(data)}'},body=data[start:end+1])
    else: await route.fulfill(content_type='video/mp4',headers={'Accept-Ranges':'bytes'},body=data)
   await ctx.route('**/qa.mp4*',video_response)
   page=await ctx.new_page();errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
   await page.goto(BASE+'/tests/fixtures/media-player.html');await page.wait_for_timeout(500)
   print('player',width,await page.evaluate('({body:document.body.scrollWidth,w:innerWidth,controls:[...document.querySelectorAll(".wmp-esfera")].map(e=>({w:e.clientWidth,h:e.clientHeight})),videos:document.querySelectorAll("video").length})'),errs,flush=True)
   assert await page.locator('video').count()==1
   assert await page.evaluate('document.body.scrollWidth<=innerWidth')
   if width<1000:
    assert await page.locator('.wmp-esfera').evaluate_all('(es)=>es.every(e=>e.getBoundingClientRect().width>=40 && e.getBoundingClientRect().height>=40)')
   await page.screenshot(path=str(artifact_dir / f'player-{width}.png'))
   if width==390:
    await page.get_by_role('button',name='Reproduzir',exact=True).click();await page.wait_for_timeout(900);assert await page.locator('video').evaluate('(v)=>!v.paused&&v.currentTime>0')
    await page.get_by_role('button',name='Pausar',exact=True).click();assert await page.locator('video').evaluate('(v)=>v.paused')
    await page.get_by_role('slider',name='Posição do vídeo').focus();await page.keyboard.press('Home');await page.keyboard.press('ArrowRight');await page.wait_for_timeout(200);assert await page.locator('video').evaluate('(v)=>v.currentTime>9')
    box=await page.get_by_role('slider',name='Posição do vídeo').bounding_box()
    await page.touchscreen.tap(box['x']+box['width']*.25,box['y']+box['height']/2);await page.wait_for_timeout(100)
    assert await page.locator('video').evaluate('(v)=>v.currentTime>3&&v.currentTime<7')
    touch=await ctx.new_cdp_session(page)
    await touch.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':box['x']+box['width']*.25,'y':box['y']+box['height']/2}]})
    await touch.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':box['x']+box['width']*.7,'y':box['y']+box['height']/2}]})
    await touch.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});await page.wait_for_timeout(100)
    assert await page.locator('video').evaluate('(v)=>v.currentTime>12&&v.currentTime<16')
    await page.get_by_role('button',name='Parar',exact=True).click();assert await page.locator('video').evaluate('(v)=>v.paused&&v.currentTime<.2')
    await page.get_by_role('slider',name='Volume',exact=True).focus();await page.keyboard.press('Home');await page.wait_for_timeout(100);assert await page.locator('video').evaluate('(v)=>v.muted&&v.volume==0')
    await page.get_by_role('button',name='Ativar som',exact=True).click();assert await page.locator('video').evaluate('(v)=>!v.muted')
    await page.get_by_role('button',name='Lista de vídeos',exact=True).click();await page.get_by_role('button',name='Segundo vídeo',exact=True).click();assert 'second' in await page.locator('video').get_attribute('src')
    before=await page.locator('video').element_handle()
    await page.set_viewport_size({'width':1440,'height':900});await page.wait_for_timeout(100)
    assert await before.evaluate('(v)=>v===document.querySelector("video")')
    await page.set_viewport_size({'width':390,'height':900})
    if await page.evaluate('document.fullscreenEnabled'):
     await page.get_by_role('button',name='Tela cheia',exact=True).click();await page.wait_for_timeout(100)
     assert await page.evaluate('Boolean(document.fullscreenElement)')
     await page.evaluate('document.exitFullscreen()')
    await page.get_by_role('button',name='Minimizar',exact=True).click();assert await page.evaluate('window.__minimized')
    await page.get_by_role('button',name='Fechar',exact=True).click();assert await page.evaluate('window.__closed')
    print('CONTROLS / RESIZE / FULLSCREEN PASS',flush=True)
   await page.goto(BASE+'/cases/animae');await page.locator('.case-frame.is-trio').first.scroll_into_view_if_needed();await page.wait_for_timeout(500)
   print('case',width,await page.evaluate('({viewport:innerWidth,body:document.body.scrollWidth,scroll:document.querySelector(".case-document-scroll").scrollWidth,client:document.querySelector(".case-document-scroll").clientWidth,images:[...document.querySelectorAll(".case-media.is-phone img")].slice(0,3).map(e=>({h:e.clientHeight,nw:e.naturalWidth,nh:e.naturalHeight,box:e.parentElement.clientHeight}))})'),errs,flush=True)
   await page.screenshot(path=str(artifact_dir / f'case-{width}.png'))
   if width==390:
    await page.locator('.case-frame.is-trio').first.scroll_into_view_if_needed();await page.screenshot(path=str(artifact_dir / 'phones-390.png'))
   assert not errs, errs
   assert await page.locator('.case-document-scroll').evaluate('(e)=>e.scrollWidth<=e.clientWidth+1')
   if width<1000:
    assert await page.locator('.case-media.is-phone .case-device-screen > img').evaluate_all('(es)=>es.slice(0,3).every(e=>e.naturalWidth>0 && Math.abs(e.clientWidth/e.clientHeight-e.naturalWidth/e.naturalHeight)<.02)')
   await ctx.close()
  ios=await b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile Safari/604.1')
  await ios.route('**/qa.mp4*',video_response)
  pg=await ios.new_page();await pg.goto(BASE+'/tests/fixtures/media-player.html');await pg.wait_for_timeout(200)
  assert await pg.get_by_role('slider',name='Volume',exact=True).get_attribute('aria-disabled')=='true'
  assert await pg.locator('.wmp-mobile-note').inner_text()=='Use os botões de volume do celular para ajustar o som.'
  await ios.close()
  await b.close()
asyncio.run(main())

print("Capturas:",artifact_dir)
