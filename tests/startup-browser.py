"""Verifica o primeiro carregamento do build, não o servidor de desenvolvimento.
Rodar npm run build e npm run preview antes. Requer Playwright e Chromium.
"""
import asyncio
import json
import os
from pathlib import Path
import tempfile
from playwright.async_api import async_playwright

# A barra final faz o Vite preview servir o HTML pré-renderizado do case.
BASE = os.environ.get('MIRANDA_QA_BASE_URL', 'http://127.0.0.1:4173')
OUT = Path(tempfile.mkdtemp(prefix='miranda-startup-'))
PROBE = '''
window.__rawFrames = 0;
const checkRaw = () => {
  const raw = document.querySelector('#root > main:not([class])');
  if (raw && getComputedStyle(raw).display !== 'none') window.__rawFrames++;
  requestAnimationFrame(checkRaw);
};
requestAnimationFrame(checkRaw);
'''

async def pending(page, name):
    await page.locator('#static-fallback').wait_for(state='attached')
    await page.wait_for_timeout(700)
    assert await page.locator('#root').evaluate('(e)=>e.childElementCount') == 0
    assert await page.locator('#root').evaluate('(e)=>getComputedStyle(e).backgroundColor') == 'rgb(0, 38, 151)'
    assert await page.locator('body').inner_text() == ''
    assert await page.locator('main').count() == 0
    assert await page.evaluate('window.__rawFrames') == 0
    await page.screenshot(path=str(OUT / f'{name}.png'))

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
        for width in [390, 1440]:
            for path, label in [('/', 'home'), ('/cases/animae/', 'case')]:
                ctx = await browser.new_context(viewport={'width': width, 'height': 1000}, is_mobile=width<760, has_touch=width<760, ignore_https_errors=True)
                await ctx.add_init_script(PROBE)
                gate = asyncio.Event()
                async def hold(route):
                    await gate.wait()
                    await route.continue_()
                await ctx.route('**/assets/index-*.js', hold)
                page = await ctx.new_page()
                errors = []
                page.on('pageerror', lambda e: errors.append(str(e)))
                await page.goto(BASE + path, wait_until='commit')
                await pending(page, f'{label}-{width}-before-js')
                gate.set()
                if label == 'home':
                    await page.locator('.xp-entry-profile').wait_for()
                    assert await page.evaluate('document.documentElement.dataset.screen') == 'welcome'
                    await page.locator('.xp-entry-profile').click()
                    await page.locator('#sobre-title').wait_for(state='visible')
                    # Mesmo com o script novamente atrasado, refresh não pinta o fallback.
                    gate.clear()
                    await page.reload(wait_until='commit')
                    await pending(page, f'home-{width}-reload')
                    gate.set()
                    await page.locator('#sobre-title').wait_for(state='visible')
                    assert await page.get_by_role('tab', name='Sobre', exact=True).get_attribute('aria-selected') == 'true'
                else:
                    await page.locator('.case-document h1').wait_for(state='visible')
                    assert 'ANIMAE' in await page.locator('.case-document h1').inner_text()
                assert await page.evaluate('window.__rawFrames') == 0
                assert await page.evaluate('document.documentElement.dataset.layout') == 'desktop'
                assert not errors, errors
                await page.screenshot(path=str(OUT / f'{label}-{width}-ready.png'))
                await ctx.close()
                print('slow JS / no HTML flash / interface ready', label, width, 'PASS', flush=True)
        # Bloquear o CSS também não expõe texto: o fundo inicial é crítico e inline.
        ctx = await browser.new_context(viewport={'width':390,'height':844}, ignore_https_errors=True)
        await ctx.add_init_script(PROBE)
        await ctx.route('**/assets/index-*.js', lambda r: r.abort())
        await ctx.route('**/assets/index-*.css', lambda r: r.abort())
        page = await ctx.new_page()
        await page.goto(BASE, wait_until='domcontentloaded')
        await pending(page, 'no-external-assets')
        await ctx.close()
        print('critical background without external CSS/JS PASS', flush=True)
        for path, label in [('/', 'home'), ('/cases/animae/', 'case')]:
            ctx = await browser.new_context(java_script_enabled=False, ignore_https_errors=True)
            page = await ctx.new_page()
            await page.goto(BASE + path)
            assert not await page.locator('#root').is_visible()
            heading = page.locator('#static-fallback h1')
            assert await heading.is_visible()
            assert ('Thiago Miranda' if label == 'home' else 'ANIMAE') in await heading.inner_text()
            assert await page.locator('link[rel="canonical"]').get_attribute('href')
            if label == 'home':
                person = json.loads(await page.locator('head script[type="application/ld+json"]').text_content())
                assert person['@type'] == 'Person' and person['name'] == 'Thiago Miranda'
                assert await page.get_by_role('link', name='Currículo em português', exact=True).count() == 1
            await ctx.close()
            print('no-JS fallback / metadata', label, 'PASS', flush=True)
        await browser.close()

asyncio.run(main())
print('Capturas:', OUT)
