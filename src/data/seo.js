// Fonte única de SEO. Troque SITE_URL quando o domínio próprio entrar no ar.
export const SITE_URL = "https://portfolio-miranda-tawny.vercel.app";
export const SITE_NAME = "Thiago Miranda · Product Designer";
export const OG_IMAGE = "/assets/cases/animae-home.webp";

export const PAGES = [
  {
    path: "/",
    title: "Thiago Miranda · Product Designer pleno",
    description: "Portfólio de Thiago Miranda: UI craft, UX e design systems do Figma ao código.",
    ogType: "website",
  },
  {
    path: "/cases/animae",
    title: "ANIMAE — Case de Product Design e UX/UI | Thiago Miranda",
    description: "Do streaming ao app social de anime: conheça o case do ANIMAE, com pesquisa, UX/UI, Design System, gamificação e desenvolvimento em React Native.",
    ogType: "article",
    image: "/assets/cases/animae-home.webp",
    imageAlt: "Tela inicial do ANIMAE com destaque, botão de adicionar e amigos online",
  },
];

export const pageFor = (path) => PAGES.find((p) => p.path === path);
export const absolute = (path) => `${SITE_URL}${path === "/" ? "/" : path}`;

// Aplica title, description, canonical, Open Graph e Twitter no <head> (navegação dentro do app).
export function applySeo(page) {
  if (typeof document === "undefined" || !page) return;
  document.title = page.title;
  const set = (selector, attr, value, make) => {
    let el = document.head.querySelector(selector);
    if (!el) { el = document.createElement(make.tag); for (const [k, v] of Object.entries(make.attrs)) el.setAttribute(k, v); document.head.appendChild(el); }
    el.setAttribute(attr, value);
  };
  const url = absolute(page.path);
  const image = page.image ? `${SITE_URL}${page.image}` : null;
  set('meta[name="description"]', "content", page.description, { tag: "meta", attrs: { name: "description" } });
  set('link[rel="canonical"]', "href", url, { tag: "link", attrs: { rel: "canonical" } });
  const og = { "og:title": page.title, "og:description": page.description, "og:url": url, "og:type": page.ogType, "og:site_name": SITE_NAME, "og:locale": "pt_BR", ...(image ? { "og:image": image } : {}) };
  for (const [p, v] of Object.entries(og)) set(`meta[property="${p}"]`, "content", v, { tag: "meta", attrs: { property: p } });
  const tw = { "twitter:card": image ? "summary_large_image" : "summary", "twitter:title": page.title, "twitter:description": page.description, ...(image ? { "twitter:image": image } : {}) };
  for (const [n, v] of Object.entries(tw)) set(`meta[name="${n}"]`, "content", v, { tag: "meta", attrs: { name: n } });
}
