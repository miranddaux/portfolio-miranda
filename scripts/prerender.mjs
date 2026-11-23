// Pós-build: gera HTML estático por rota (título, descrição, canonical, OG/Twitter, texto real do case),
// robots.txt e sitemap.xml. O React substitui o conteúdo estático ao carregar; crawlers e leitores sem JS veem o texto.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { PAGES, SITE_URL, SITE_NAME, absolute } from "../src/data/seo.js";
import { getCaseStudy } from "../src/data/caseStudies.js";
import { ANIMAE_COPY, ANIMAE_WEB_URL } from "../src/data/animaeCase.js";
import { ADICIONAL, CONTATO, EXPERIENCIAS } from "../src/data/perfil.js";
import { BIO_PERFIL } from "../src/data/perfilSearch.js";

const dist = new URL("../dist/", import.meta.url);
const template = readFileSync(new URL("index.html", dist), "utf8");
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const rich = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

function head(page) {
  const url = absolute(page.path);
  const image = page.image ? `${SITE_URL}${page.image}` : null;
  const tags = [
    `<link rel="canonical" href="${url}" />`,
    `<meta name="robots" content="index, follow" />`,
    `<meta property="og:type" content="${page.ogType}" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    ...(image ? [`<meta property="og:image" content="${image}" />`, `<meta property="og:image:alt" content="${esc(page.imageAlt || "")}" />`] : []),
    `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`,
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    ...(image ? [`<meta name="twitter:image" content="${image}" />`] : []),
  ];
  return tags.join("\n    ");
}

function blocksHtml(blocks) {
  return blocks.map((b) => {
    switch (b.type) {
      case "h3": return `<h3>${esc(b.text)}</h3>`;
      case "p": return `<p>${rich(b.text)}</p>`;
      case "ul": return `<ul>${b.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
      case "ol": return `<ol>${b.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ol>`;
      case "trio": return b.images.map((m) => `<img src="${m.src}" alt="${esc(m.alt)}" width="${m.width}" height="${m.height}" loading="lazy" />`).join("");
      case "journey": return `<ol>${b.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ol>`;
      case "facts": case "kpis": return `<ul>${b.items.map(([k, v]) => `<li><strong>${esc(k)}:</strong> ${esc(v)}</li>`).join("")}</ul>`;
      case "decision": return `<h3>${esc(b.h3)}</h3>${blocksHtml(b.blocks)}${(b.images || []).map((m) => `<img src="${m.src}" alt="${esc(m.alt)}" width="${m.width}" height="${m.height}" loading="lazy" />`).join("")}`;
      case "item": case "flow": return `<h3>${esc(b.h3)}</h3>${blocksHtml(b.blocks)}${b.images.map((m) => `<img src="${m.src}" alt="${esc(m.alt)}" width="${m.width}" height="${m.height}" loading="lazy" />`).join("")}`;
      default: return "";
    }
  }).join("\n");
}

function animaeBody() {
  const c = ANIMAE_COPY;
  return `<main><article>
<h1>${esc(c.h1)}</h1>
<p><strong>${esc(c.tagline)}</strong></p>
<p>${esc(c.intro)}</p>
<p><a href="${ANIMAE_WEB_URL}" target="_blank" rel="noopener noreferrer">${esc(c.ctaWeb)}</a> · <a href="${esc(getCaseStudy("animae").links.prototype)}" target="_blank" rel="noopener noreferrer">${esc(c.ctaPrototype)}</a></p>
${c.overview.map(([l, list]) => `<p><strong>${esc(l)}:</strong> ${esc(list.join(", "))}</p>`).join("\n")}
<p><strong>Período:</strong> ${esc(c.period)}</p>
<p><strong>Status:</strong> ${esc(c.status)}</p>
${c.sections.map((s) => `<section><h2>${esc(s.title)}</h2>\n${blocksHtml(s.blocks)}</section>`).join("\n")}
<p><a href="/">Portfólio de Thiago Miranda</a></p>
</article></main>`;
}

function homeBody() {
  const person = { '@context': 'https://schema.org', '@type': 'Person', name: 'Thiago Miranda', jobTitle: 'Product Designer', url: SITE_URL, email: CONTATO.email, address: { '@type': 'PostalAddress', addressLocality: 'São José do Rio Preto', addressRegion: 'SP', addressCountry: 'BR' }, sameAs: [CONTATO.linkedin, CONTATO.behance, CONTATO.dribbble] };
  return `<main><h1>Thiago Miranda — Product Designer pleno</h1><section><h2>Sobre mim</h2><p>${esc(BIO_PERFIL)}</p></section>
<section><h2>Experiência</h2>${EXPERIENCIAS.map(x => `<article><h3>${esc(x.cargo)} · ${esc(x.empresa)}</h3><p>${esc(x.periodo)}</p><p>${esc(x.texto)}</p></article>`).join('')}</section>
<section><h2>Projetos e prêmios</h2><p><a href="/cases/animae">Case ANIMAE — Aplicativo social de anime</a></p>${ADICIONAL.map(x => `<article><h3>${esc(x.cargo)}</h3><p>${esc(x.texto)}</p></article>`).join('')}</section>
<section><h2>Contato e currículo</h2><p><a href="mailto:${CONTATO.email}">${esc(CONTATO.email)}</a> · <a href="${CONTATO.linkedin}">LinkedIn</a></p><p><a href="/assets/cv/thiago-miranda-curriculo-pt.pdf">Currículo em português</a> · <a href="/assets/cv/thiago-miranda-resume-en.pdf">Resume in English</a></p></section></main><script type="application/ld+json">${JSON.stringify(person).replace(/</g, '\\u003c')}</script>`;
}

for (const page of PAGES) {
  let html = template
    .replace(/<title>.*?<\/title>/s, `<title>${esc(page.title)}</title>`)
    .replace(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${esc(page.description)}" />`)
    .replace("</head>", `  ${head(page)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${page.path === "/" ? homeBody() : animaeBody()}</div>`);
  const dir = new URL(page.path === "/" ? "./" : `.${page.path}/`, dist);
  mkdirSync(dir, { recursive: true });
  writeFileSync(new URL("index.html", dir), html);
}

writeFileSync(new URL("robots.txt", dist), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
const today = new Date().toISOString().slice(0, 10);
writeFileSync(new URL("sitemap.xml", dist), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PAGES.map((p) => `  <url><loc>${absolute(p.path)}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`);
console.log("prerender: " + PAGES.map((p) => p.path).join(", ") + " + robots.txt + sitemap.xml");
