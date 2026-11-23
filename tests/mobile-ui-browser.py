import asyncio,json,os,tempfile
from pathlib import Path
from playwright.async_api import async_playwright
# Requer Vite, Python Playwright e Chromium.
BASE=os.environ.get('MIRANDA_QA_BASE_URL','http://127.0.0.1:5173')
OUT=Path(tempfile.mkdtemp(prefix='miranda-mobile-'))
async def enter(page):
 await page.goto(BASE+'/?entrada=1');await page.locator('.xp-entry-profile').click();await page.wait_for_timeout(2600)
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
  for w in [320,390,430]:
   c=await b.new_context(viewport={'width':w,'height':844},is_mobile=True,has_touch=True,ignore_https_errors=True);page=await c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   await enter(page)
   assert await page.locator('.painel-foto').evaluate('(e)=>e.getBoundingClientRect().width===128')
   header=await page.locator('.janela-xp-titulo').bounding_box();body=await page.locator('.janela-xp-miolo').bounding_box();assert body['y']>=header['y']+header['height']
   assert await page.locator('.janela-xp-btn').evaluate_all('(es)=>es.every(e=>e.getBoundingClientRect().width===40 && e.getBoundingClientRect().height===40)')
   await page.get_by_role('tab',name='Contato',exact=True).click()
   rect=await page.locator('.painel-redes--social').evaluate('(e)=>{let a=e.getBoundingClientRect(),b=e.closest(".painel-rolagem").getBoundingClientRect();return [a.x-b.x,b.right-a.right]}');assert rect==[16,16],rect
   boxes=await page.locator('.painel-redes--social li').evaluate_all('(es)=>es.map(e=>({x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y}))');assert (boxes[0]['y']==boxes[1]['y'] and boxes[2]['y']==boxes[3]['y'] and boxes[4]['y']>boxes[2]['y']) if w<=380 else (boxes[0]['y']==boxes[2]['y'] and boxes[3]['y']==boxes[4]['y'] and boxes[3]['y']>boxes[0]['y'])
   assert await page.locator('.painel-redes:not(.painel-redes--social)').evaluate('(e)=>e.children[0].getBoundingClientRect().y===e.children[1].getBoundingClientRect().y')
   assert await page.locator('.painel-redes--social .social-link').evaluate_all('(es)=>es.every(e=>{const r=e.getBoundingClientRect(),i=e.querySelector(".social-link__icon-frame").getBoundingClientRect(),t=e.querySelector(".social-link__name").getBoundingClientRect();return r.height<=48 && i.right<=t.left && Math.abs(i.y+i.height/2-t.y-t.height/2)<1 && t.right<=r.right})')
   await page.screenshot(path=str(OUT/f'contact-{w}.png'))
   await page.get_by_role('tab',name='Habilidades',exact=True).click();await page.locator('#perfil-desenvolvimento').scroll_into_view_if_needed()
   tags=await page.locator('.painel-tags li').evaluate_all('(es)=>es.map(e=>[getComputedStyle(e).backgroundColor,getComputedStyle(e).borderColor])');assert all(x==tags[0] for x in tags)
   assert await page.locator('.painel-tags').first.evaluate('(e)=>getComputedStyle(e).scrollbarWidth')=='none'
   await page.locator('[aria-labelledby="sobre-title"] button[aria-label^="Minimizar"]').click()
   center=await page.locator('.desktop-shortcut').evaluate_all('(es)=>{let a=es[0].getBoundingClientRect(),b=es.at(-1).getBoundingClientRect();return (a.top+b.bottom)/2}');assert abs(center-(844-30)/2)<2,center
   await page.screenshot(path=str(OUT/f'home-{w}.png'))
   await page.locator('.botao-iniciar').click();hs=page.get_by_role('menuitem',name='Headspace',exact=False);assert await hs.get_attribute('aria-disabled')=='true';assert await page.locator('.mi-avatar').evaluate('(e)=>e.getBoundingClientRect().width')==56
   await hs.click(force=True);assert await page.locator('.janela-headspace').count()==0
   assert await page.get_by_role('menuitem',name='Purble Place',exact=False).count()==0
   await page.get_by_role('button',name='Todos os programas',exact=True).click();assert 'Purble Place' not in await page.locator('#menu-iniciar').inner_text()
   await page.locator('.botao-iniciar').click();await page.locator('#shortcut-contato').click();await page.locator('[aria-labelledby="sobre-title"] button[aria-label^="Minimizar"]').click()
   await page.locator('.botao-iniciar').click();await page.get_by_role('menuitem',name='Messenger',exact=True).click();await page.screenshot(path=str(OUT/f'msn-{w}.png'))
   assert await page.evaluate('document.body.scrollWidth<=innerWidth');assert not errors,errors
   await c.close();print('mobile',w,'PASS',flush=True)
  # As demos iniciam antes da rolagem; não dependem de clique ou área visível mínima.
  for width,mobile in [(390,True),(1440,False)]:
   c=await b.new_context(viewport={'width':width,'height':1000},is_mobile=mobile,has_touch=mobile,ignore_https_errors=True);page=await c.new_page();await page.goto(BASE+'/cases/animae')
   home=page.locator('.ah-root').first
   await home.wait_for();assert await home.evaluate('(e)=>e.getBoundingClientRect().top>innerHeight')
   await page.evaluate('window.__firstBanner=document.querySelector(".ah-root .ah-slide.is-on")')
   await page.wait_for_function('document.querySelector(".ah-root .ah-slide.is-on")!==window.__firstBanner',timeout=6500)
   assert await page.locator('.case-demo-toggle').count()==0
   assert await page.locator('.case-document a:has(img)').count()==0
   assert await page.locator('.case-document a[aria-label^="Ampliar"]').count()==0
   banner=page.locator('.case-draco-banner');await banner.scroll_into_view_if_needed()
   assert await banner.evaluate('(e)=>{const r=e.getBoundingClientRect(),i=e.querySelector("img").getBoundingClientRect();return i.top>=r.top && i.bottom<=r.bottom && i.left>=r.left && i.right<=r.right}')
   assert await banner.locator('img').evaluate('(e)=>getComputedStyle(e).maskImage')=='none'
   await page.screenshot(path=str(OUT/f'banner-{width}.png'))
   await home.scroll_into_view_if_needed();await page.screenshot(path=str(OUT/f'animation-{width}.png'))
   await c.close();print('autoplay before scroll / no image links / full banner',width,'PASS',flush=True)
  c=await b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,reduced_motion='reduce',ignore_https_errors=True);page=await c.new_page();await page.goto(BASE+'/cases/animae');screen=page.locator('.case-device-screen.has-demo').first;await screen.scroll_into_view_if_needed();await page.wait_for_timeout(500);assert await screen.locator('.ad-root').count()==0;assert await screen.locator('img').get_attribute('alt');await c.close();print('reduced-motion PASS',flush=True)
  await b.close()
asyncio.run(main())

print("Capturas:", OUT)
