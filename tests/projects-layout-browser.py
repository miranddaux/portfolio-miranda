"""QA do grid de projetos e da exibição imediata das telas do case.
Requer Vite, Python Playwright e Chromium; não adiciona assets ao deploy.
"""
import asyncio
import os
from pathlib import Path
import tempfile
from playwright.async_api import async_playwright

BASE = os.environ.get('MIRANDA_QA_BASE_URL', 'http://127.0.0.1:5173')
OUT = Path(tempfile.mkdtemp(prefix='miranda-projects-'))

async def check_grid(scope, expected_columns):
    grid = scope.locator('.projects-folders')
    values = await grid.evaluate('''e => {
      const root = e.closest('.projects-explorer');
      const title = root.querySelector('.projects-embedded-heading h3');
      const r = e.getBoundingClientRect();
      return {columns: getComputedStyle(e).gridTemplateColumns.split(' ').length,
        width: e.clientWidth, scroll: e.scrollWidth,
        titleOffset: title ? title.getBoundingClientRect().left - r.left : 0,
        items: [...e.children].map(x => x.getBoundingClientRect().width)};
    }''')
    assert values['columns'] == expected_columns, values
    assert values['scroll'] <= values['width'] + 1, values
    assert abs(values['titleOffset']) < 1, values
    assert max(values['items']) - min(values['items']) < 1, values
    return values

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path='/usr/bin/chromium', headless=True, args=['--no-sandbox'])
        for width in [320, 390, 768, 1440]:
            context = await browser.new_context(viewport={'width': width, 'height': 1000}, is_mobile=width<1000, has_touch=width<1000, ignore_https_errors=True)
            page = await context.new_page()
            errors = []
            page.on('pageerror', lambda e: errors.append(str(e)))
            await page.goto(BASE + '/?entrada=1')
            await page.locator('.xp-entry-profile').click()
            await page.get_by_role('tab', name='Projetos', exact=True).click()
            embedded = page.locator('.projects-explorer.is-embedded')
            expected = 2 if await embedded.evaluate('(e)=>e.clientWidth') <= 560 else 3
            print('embedded', width, await check_grid(embedded, expected), flush=True)
            assert await embedded.locator('.project-folder').count() == 3
            if await embedded.get_by_label('Exibir', exact=True).is_visible():
                await embedded.get_by_label('Exibir', exact=True).select_option('disponiveis')
                assert await embedded.locator('.project-folder').count() == 1
                await check_grid(embedded, expected)
                await embedded.get_by_label('Exibir', exact=True).select_option('todos')
            await page.screenshot(path=str(OUT / f'projects-{width}.png'))
            if width == 1440:
                # A janela menor deve reagir ao seu próprio conteúdo, sem mudar o viewport.
                window = page.locator('[aria-labelledby="sobre-title"]')
                await window.evaluate('(e)=>e.style.width="520px"')
                await page.wait_for_timeout(100)
                await check_grid(embedded, 2)
                await window.evaluate('(e)=>e.style.width="1000px"')
                await page.locator('#shortcut-cases').click()
                standalone = page.locator('[aria-labelledby="cases-title"]')
                await check_grid(standalone, 3)
                await standalone.evaluate('(e)=>e.style.width="480px"')
                await page.wait_for_timeout(100)
                await check_grid(standalone, 2)
                await standalone.locator('button[aria-label^="Fechar"]').click()
            await page.goto(BASE + '/cases/animae')
            # Capturas prontas antes da primeira rolagem: sem placeholders tardios.
            assert await page.locator('.case-media .case-device-screen > img, .case-flow-shot img').evaluate_all('(es)=>es.length>0 && es.every(e=>e.complete && e.naturalWidth>0)')
            assert await page.locator('.ad-slot').first.evaluate('(e)=>getComputedStyle(e).animationName') == 'none'
            assert await page.locator('.case-stage,.case-frame,.case-media,.case-device').evaluate_all('(es)=>es.every(e=>getComputedStyle(e).animationName==="none")')
            if width == 1440:
                assert await page.locator('.case-draco-banner img').evaluate('(e)=>getComputedStyle(e).animationName') == 'draco-subir'
            await page.evaluate('window.__bannerInitial=document.querySelector(".ah-root .ah-slide.is-on")')
            await page.wait_for_function('document.querySelector(".ah-root .ah-slide.is-on")!==window.__bannerInitial', timeout=6500)
            assert await page.locator('.case-demo-toggle').count() == 0
            assert not errors, errors
            print('immediate screens / hero / internal demo', width, 'PASS', flush=True)
            await context.close()
        await browser.close()

asyncio.run(main())
print('Capturas:', OUT)
