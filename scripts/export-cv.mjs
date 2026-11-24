// Requer Chromium e Python com Playwright/PyMuPDF. Sem serviços externos.
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CURRICULOS_TEXTO } from '../src/data/curriculos.js';
const root = fileURLToPath(new URL('../', import.meta.url));
const temp = mkdtempSync(join(tmpdir(), 'miranda-cv-'));
const font = (weight) => readFileSync(join(root, `node_modules/@fontsource/inter/files/inter-latin-${weight}-normal.woff2`)).toString('base64');
const esc = t => String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const jobs = list => list.map(([company,role,date,bullets])=>`<article><h3>${esc(company)}</h3><div class="job-meta"><span>${esc(role)}</span><time>${esc(date)}</time></div><ul>${bullets.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></article>`).join('');
for (const [lang,c] of Object.entries(CURRICULOS_TEXTO)) {
 const html = `<!doctype html><html lang="${c.lang}"><head><meta charset="utf-8"><title>${c.title}</title><style>
 @font-face{font-family:Inter;src:url(data:font/woff2;base64,${font(400)})} @font-face{font-family:Inter;src:url(data:font/woff2;base64,${font(700)});font-weight:700}
 @page{size:A4;margin:0} *{box-sizing:border-box} body{margin:0;color:#171717;font:9.2pt/1.38 Inter,Arial,sans-serif} .page{width:210mm;padding:10mm 10mm 9mm;display:grid;grid-template-columns:minmax(0,1fr) 53mm;gap:7mm} h1{font-size:27pt;line-height:1.12;letter-spacing:-.5pt;margin:0 0 2mm} .subtitle{font-size:11pt;margin:0 0 4mm} .summary{margin:0 0 4mm;text-wrap:pretty} h2{font-size:12pt;line-height:1.3;margin:4mm 0 2mm} h3{font-size:9.2pt;line-height:1.3;margin:0 0 .5mm} article{break-inside:avoid;margin-bottom:2.4mm} .job-meta{display:flex;justify-content:space-between;align-items:baseline;gap:2mm;font-size:8.5pt} time{white-space:nowrap} ul{margin:1mm 0 0;padding-left:3.5mm} li{padding-left:.3mm;margin:0 0 1mm;text-wrap:pretty} .nowrap{white-space:nowrap} aside{font-size:8.7pt;line-height:1.4} aside h2{margin-top:5mm} .contact p{margin:0 0 1.5mm;overflow-wrap:anywhere} .contact b{display:block} a{color:inherit;text-decoration:none} .side-group{margin:0 0 2.5mm;break-inside:avoid} .side-group b{display:block;margin-bottom:.5mm} .side-group p{margin:0} .contact{padding-top:.5mm}
 </style></head><body><div class="page"><main><header><h1>Thiago Miranda</h1><p class="subtitle">Product Designer · UI/UX · Design Systems</p><p class="summary">${c.summary}</p></header><section><h2>${c.experience}</h2>${jobs(c.jobs)}</section><section><h2>${c.projects}</h2>${jobs(c.awards)}</section></main><aside><div class="contact">${c.contact.map(([k,v,h])=>`<p><b>${esc(k)}:</b>${h?`<a href="${h}">${esc(v)}</a>`:esc(v)}</p>`).join('')}</div>${c.sidebar.map(([title,groups])=>`<section><h2>${title}</h2>${groups.map(([head,...lines])=>`<div class="side-group">${head?`<b>${esc(head)}</b>`:''}${lines.map(l=>`<p>${esc(l)}</p>`).join('')}</div>`).join('')}</section>`).join('')}</aside></div></body></html>`;
 const input=join(temp,`${lang}.html`);
 const pdf=join(root,`public/assets/cv/${lang==='pt'?'thiago-miranda-curriculo-pt':'thiago-miranda-resume-en'}.pdf`);
 writeFileSync(input,html);
 execFileSync('python', ['-c', `import asyncio,os,sys
from pathlib import Path
from playwright.async_api import async_playwright
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path=os.environ.get('CHROMIUM_BIN','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
  page=await browser.new_page()
  await page.set_content(Path(sys.argv[1]).read_text())
  await page.evaluate('document.fonts.ready')
  await page.pdf(path=sys.argv[2],format='A4',print_background=True,prefer_css_page_size=True,tagged=True)
  await browser.close()
asyncio.run(main())`, input, pdf], {stdio:'inherit',timeout:60000});
 execFileSync('python',['-c',`import fitz,sys\nd=fitz.open(sys.argv[1])\nassert len(d)==1, 'O currículo deve ter uma página'\nd[0].get_pixmap(matrix=fitz.Matrix(2,2)).pil_save(sys.argv[2],format='WEBP',quality=92)`,pdf,join(root,`public/assets/cv/cv-${lang}.webp`)],{stdio:'inherit'});
 console.log(`${lang}: PDF de uma página + prévia WebP`);
}
