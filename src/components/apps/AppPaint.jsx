import { useEffect, useLayoutEffect, useRef, useState } from "react";

// Paint no estilo clássico do Windows XP: menu, caixa de ferramentas (16 ferramentas), área de desenho
// com alças de tamanho, paleta embaixo e barra de status. Todas as ferramentas e menus funcionam.
const L0 = 640, A0 = 400;
// No celular o desenho nasce do tamanho da tela, para não precisar rolar de lado.
const tamanhoInicial = () => {
  const w = typeof window === "undefined" ? L0 : window.innerWidth;
  return w <= 760 ? { w: Math.max(240, Math.min(L0, w - 96)), h: 360 } : { w: L0, h: A0 };
};
const LINHA1 = ["#000000", "#808080", "#800000", "#808000", "#008000", "#008080", "#000080", "#800080", "#808040", "#004040", "#0080ff", "#004080", "#8000ff", "#804000"];
const LINHA2 = ["#ffffff", "#c0c0c0", "#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#ff00ff", "#ffff80", "#00ff80", "#80ffff", "#8080ff", "#ff0080", "#ff8040"];
const LARGURAS = [1, 2, 3, 4, 5];
const ZOOMS = [1, 2, 4, 6, 8];
const FONTES = ["Arial", "Courier New", "Times New Roman", "Verdana", "Tahoma", "Comic Sans MS", "Impact"];
const TAM_FONTE = [8, 10, 12, 14, 18, 24, 36, 48];
const AJUDA = "Para obter Ajuda, clique em Tópicos da Ajuda no menu Ajuda.";

const P = ({ d, f, s, w = 1.2 }) => <path d={d} fill={f || "none"} stroke={s || "none"} strokeWidth={w} strokeLinejoin="round" strokeLinecap="round" />;
const ICONES = {
  livre: <><P d="M3 9c0-4 4-6 7-4s2 6-1 7-5-1-6-3z" s="#2a5db0" /><P d="M3 9l-1 5" s="#555" /></>,
  retsel: <rect x="2.5" y="3.5" width="11" height="9" fill="none" stroke="#2a5db0" strokeWidth="1.2" strokeDasharray="2 1.5" />,
  borracha: <><P d="M3 10l6-6 5 4-5 5H6z" f="#e86a5a" s="#7a2a20" /><P d="M7 14h8" s="#555" /></>,
  balde: <><P d="M3 8l5-5 5 5-4 4z" f="#cfd8e8" s="#33527e" /><P d="M13 10c1 2 2 3 2 4a1.5 1.5 0 01-3 0c0-1 1-2 1-4z" f="#2a8be0" /></>,
  gota: <><P d="M10 3l3 3-1 1-3-3z" f="#9fb4d6" s="#33527e" /><P d="M9 5l-6 6-1 3 3-1 6-6" f="#fff" s="#33527e" /></>,
  lupa: <><P d="M7 3a4 4 0 100 8 4 4 0 000-8z" f="#eaf3ff" s="#33527e" w="1.4" /><P d="M10 10l4 4" s="#6a4a24" w="2" /></>,
  lapis: <><P d="M3 13l1-3 7-7 2 2-7 7z" f="#f2c14e" s="#7a5a10" /><P d="M3 13l1-3 2 2z" f="#333" /></>,
  pincel: <><P d="M13 2c1 0 1 1 0 2L9 8 7 6z" f="#7a4a20" /><P d="M7 6l2 2c0 3-3 5-6 5 1-1 1-3 1-4z" f="#2aa845" s="#145a24" /></>,
  spray: <><P d="M3 7h5v7H3z" f="#5aa0e8" s="#24508a" /><P d="M4 7V5h3v2" f="#d8d8d8" s="#555" /><circle cx="11" cy="4" r=".7" fill="#555" /><circle cx="13" cy="6" r=".7" fill="#555" /><circle cx="12" cy="8" r=".7" fill="#555" /></>,
  texto: <text x="8" y="13" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="14" fill="#1f4fa8">A</text>,
  linha: <P d="M3 13L13 3" s="#111" w="1.4" />,
  curva: <P d="M4 3c6 1 0 7 6 10" s="#1f4fa8" w="1.4" />,
  retangulo: <P d="M3 4h10v8H3z" f="#bcd3f2" s="#2a5db0" />,
  poligono: <P d="M3 12l2-8 8 2-3 7z" f="#bcd3f2" s="#2a5db0" />,
  elipse: <ellipse cx="8" cy="8" rx="6" ry="4.5" fill="#bcd3f2" stroke="#2a5db0" strokeWidth="1.2" />,
  retredondo: <rect x="2.5" y="4" width="11" height="8" rx="3" fill="#bcd3f2" stroke="#2a5db0" strokeWidth="1.2" />,
};
const FERRAMENTAS = [
  ["livre", "Seleção livre"], ["retsel", "Selecionar"],
  ["borracha", "Borracha"], ["balde", "Preencher com cor"],
  ["gota", "Selecionar cor"], ["lupa", "Ampliar"],
  ["lapis", "Lápis"], ["pincel", "Pincel"],
  ["spray", "Aerógrafo"], ["texto", "Texto"],
  ["linha", "Linha"], ["curva", "Curva"],
  ["retangulo", "Retângulo"], ["poligono", "Polígono"],
  ["elipse", "Elipse"], ["retredondo", "Retângulo arredondado"],
];
const COM_PREENCH = ["retangulo", "elipse", "retredondo", "poligono"];
const COM_LARGURA = ["linha", "curva", "retangulo", "elipse", "retredondo", "poligono", "pincel", "borracha", "spray"];

// ---------- utilitários ----------
const novoCanvas = (w, h) => { const c = document.createElement("canvas"); c.width = Math.max(1, w); c.height = Math.max(1, h); return c; };
const copiar = (src) => { const c = novoCanvas(src.width, src.height); c.getContext("2d").drawImage(src, 0, 0); return c; };
const limita = (v, a, b) => Math.max(a, Math.min(b, v));
const hex = (r, g, b) => `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
const dentro = (s, p) => p.x >= s.x && p.y >= s.y && p.x < s.x + s.w && p.y < s.y + s.h;

function riscar(c, a, b, tam, cor) {
  c.fillStyle = cor;
  const dx = b.x - a.x, dy = b.y - a.y, n = Math.max(Math.abs(dx), Math.abs(dy), 1), o = Math.floor(tam / 2);
  for (let i = 0; i <= n; i++) c.fillRect(Math.round(a.x + (dx * i) / n) - o, Math.round(a.y + (dy * i) / n) - o, tam, tam);
}
function acabar(c, o) {
  if (o.modo === 1) { c.fillStyle = o.bg; c.fill(); c.stroke(); }
  else if (o.modo === 2) { c.fillStyle = o.fg; c.fill(); }
  else c.stroke();
}
function estilo(c, o) {
  c.lineWidth = o.lw; c.lineJoin = "round"; c.lineCap = "round"; c.strokeStyle = o.fg;
  if (o.lw % 2 === 1) c.translate(0.5, 0.5);
}
function desenharForma(c, id, a, b, o) {
  let { x: x0, y: y0 } = a, { x: x1, y: y1 } = b;
  if (o.shift) {
    if (id === "linha") {
      const dx = x1 - x0, dy = y1 - y0, ang = Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) * (Math.PI / 4), d = Math.hypot(dx, dy);
      x1 = x0 + Math.round(Math.cos(ang) * d); y1 = y0 + Math.round(Math.sin(ang) * d);
    } else {
      const s = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
      x1 = x0 + (x1 >= x0 ? 1 : -1) * s; y1 = y0 + (y1 >= y0 ? 1 : -1) * s;
    }
  }
  c.save(); estilo(c, o); c.beginPath();
  if (id === "linha") { c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); c.restore(); return; }
  const x = Math.min(x0, x1), y = Math.min(y0, y1), w = Math.abs(x1 - x0), h = Math.abs(y1 - y0);
  if (id === "elipse") c.ellipse(x + w / 2, y + h / 2, Math.max(w / 2, 0.01), Math.max(h / 2, 0.01), 0, 0, Math.PI * 2);
  else if (id === "retredondo" && c.roundRect) c.roundRect(x, y, w, h, Math.min(14, w / 2, h / 2));
  else c.rect(x, y, w, h);
  acabar(c, o); c.restore();
}
function desenharPoli(c, pts, fechado, o) {
  if (pts.length < 2) return;
  c.save(); estilo(c, o); c.beginPath(); c.moveTo(pts[0].x, pts[0].y);
  pts.slice(1).forEach((q) => c.lineTo(q.x, q.y));
  if (fechado && pts.length > 2) { c.closePath(); acabar(c, o); } else c.stroke();
  c.restore();
}
function desenharCurva(c, k, o) {
  c.save(); estilo(c, o); c.beginPath(); c.moveTo(k.p0.x, k.p0.y);
  if (k.c1) c.bezierCurveTo(k.c1.x, k.c1.y, (k.c2 || k.c1).x, (k.c2 || k.c1).y, k.p1.x, k.p1.y);
  else c.lineTo(k.p1.x, k.p1.y);
  c.stroke(); c.restore();
}
function linhasDe(c, txt, larg) {
  const out = [];
  for (const par of txt.split("\n")) {
    let atual = "";
    for (const palavra of par.split(" ")) {
      const teste = atual ? `${atual} ${palavra}` : palavra;
      if (c.measureText(teste).width > larg && atual) { out.push(atual); atual = palavra; } else atual = teste;
    }
    out.push(atual);
  }
  return out;
}
const fonteCss = (f) => `${f.i ? "italic " : ""}${f.n ? "bold " : ""}${f.tam}px "${f.fam}"`;
function escreverTexto(c, t, f, cor, corF) {
  c.save(); c.beginPath(); c.rect(t.x, t.y, t.w, t.h); c.clip();
  if (f.opaco) { c.fillStyle = corF; c.fillRect(t.x, t.y, t.w, t.h); }
  c.fillStyle = cor; c.textBaseline = "top"; c.font = fonteCss(f);
  const lh = Math.round(f.tam * 1.25);
  linhasDe(c, t.v, t.w - 4).forEach((ln, i) => {
    const y = t.y + 1 + i * lh;
    c.fillText(ln, t.x + 2, y);
    if (f.s) c.fillRect(t.x + 2, y + Math.round(f.tam * 1.05), c.measureText(ln).width, Math.max(1, Math.round(f.tam / 14)));
  });
  c.restore();
}
const girar = (src, graus) => {
  const sw = src.width, sh = src.height, tr = graus !== 180, d = novoCanvas(tr ? sh : sw, tr ? sw : sh), c = d.getContext("2d");
  c.translate(d.width / 2, d.height / 2); c.rotate((graus * Math.PI) / 180); c.drawImage(src, -sw / 2, -sh / 2); return d;
};
const inverterEixo = (src, horiz) => {
  const d = novoCanvas(src.width, src.height), c = d.getContext("2d");
  c.scale(horiz ? -1 : 1, horiz ? 1 : -1); c.drawImage(src, horiz ? -src.width : 0, horiz ? 0 : -src.height); return d;
};
const negativo = (src) => {
  const d = copiar(src), c = d.getContext("2d"), img = c.getImageData(0, 0, d.width, d.height), p = img.data;
  for (let i = 0; i < p.length; i += 4) { p[i] = 255 - p[i]; p[i + 1] = 255 - p[i + 1]; p[i + 2] = 255 - p[i + 2]; }
  c.putImageData(img, 0, 0); return d;
};

export default function AppPaint() {
  const raiz = useRef(null), tela = useRef(null), ov = useRef(null), taRef = useRef(null), corInput = useRef(null), arquivo = useRef(null);
  const ia = useRef(null), sel = useRef(null), previa = useRef(null), poli = useRef(null), curva = useRef(null);
  const undo = useRef([]), redo = useRef([]), clip = useRef(null), pend = useRef(null), alvoCor = useRef("fg");
  const anterior = useRef("lapis"), textoRef = useRef(null), cfg = useRef({});

  const [ferramenta, setFerramenta] = useState("lapis");
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [largura, setLargura] = useState(0);
  const [preench, setPreench] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [tam, setTam] = useState(tamanhoInicial);
  const [menu, setMenu] = useState(null);
  const [dialogo, setDialogo] = useState(null);
  const [ajuda, setAjuda] = useState(AJUDA);
  const [pos, setPos] = useState("");
  const [tamSel, setTamSel] = useState("");
  const [mostra, setMostra] = useState({ ferr: true, paleta: true, status: true, grade: false });
  const [texto, setTexto] = useState(null);
  const [fonte, setFonte] = useState({ fam: "Arial", tam: 14, n: false, i: false, s: false, opaco: false });
  const [guia, setGuia] = useState(null);
  const [attr, setAttr] = useState(tamanhoInicial);
  const [, bump] = useState(0);
  const tick = () => bump((n) => n + 1);

  cfg.current = { ferramenta, fg, bg, largura, preench, zoom, fonte, tam };
  const ctx = () => tela.current.getContext("2d", { willReadFrequently: true });
  const defTexto = (v) => { textoRef.current = v; setTexto(v); };

  // ---------- sobreposição (seleção e pré-visualizações) ----------
  const retraco = (c, x, y, w, h) => {
    c.save(); c.lineWidth = 1; c.strokeStyle = "#fff"; c.setLineDash([]); c.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    c.strokeStyle = "#000"; c.setLineDash([4, 4]); c.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); c.restore();
  };
  const redesenhar = () => {
    const o = ov.current; if (!o) return;
    const c = o.getContext("2d"); c.clearRect(0, 0, o.width, o.height);
    const s = sel.current;
    if (s) { if (s.lifted) c.drawImage(s.cv, s.x, s.y); retraco(c, s.x, s.y, s.w, s.h); }
    previa.current?.(c);
  };

  // tamanho do desenho (reinicia o canvas, por isso o conteúdo é redesenhado depois)
  const aplicarTam = (w, h, fonteCv) => {
    const novo = novoCanvas(w, h), c = novo.getContext("2d");
    c.fillStyle = cfg.current.bg; c.fillRect(0, 0, w, h); c.drawImage(fonteCv, 0, 0);
    pend.current = novo; setTam({ w, h }); setAttr({ w, h });
  };
  useLayoutEffect(() => {
    const c = ctx();
    if (pend.current) { c.drawImage(pend.current, 0, 0); pend.current = null; }
    else { c.fillStyle = "#fff"; c.fillRect(0, 0, tela.current.width, tela.current.height); }
    redesenhar();
  }, [tam]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!menu) return undefined;
    const fechar = () => setMenu(null);
    window.addEventListener("pointerdown", fechar);
    return () => window.removeEventListener("pointerdown", fechar);
  }, [menu]);
  useEffect(() => { if (texto) taRef.current?.focus(); }, [!!texto]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => clearInterval(ia.current?.timer), []);

  // ---------- histórico ----------
  const pushUndo = () => { undo.current.push(copiar(tela.current)); if (undo.current.length > 40) undo.current.shift(); redo.current = []; tick(); };
  const restaurar = (cv) => {
    sel.current = null; previa.current = null; poli.current = null; curva.current = null; setTamSel("");
    if (cv.width === tela.current.width && cv.height === tela.current.height) { ctx().drawImage(cv, 0, 0); redesenhar(); }
    else aplicarTam(cv.width, cv.height, cv);
  };

  // ---------- seleção ----------
  const apagarOrigem = (s) => {
    const t = novoCanvas(s.w, s.h), tc = t.getContext("2d");
    tc.fillStyle = cfg.current.bg; tc.fillRect(0, 0, s.w, s.h); tc.globalCompositeOperation = "destination-in"; tc.drawImage(s.cv, 0, 0);
    ctx().drawImage(t, s.ox, s.oy);
  };
  const levantar = () => { const s = sel.current; if (!s || s.lifted) return; pushUndo(); apagarOrigem(s); s.lifted = true; };
  const commitSel = () => {
    const s = sel.current; if (!s) return;
    if (s.lifted) ctx().drawImage(s.cv, s.x, s.y);
    sel.current = null; setTamSel(""); redesenhar(); tick();
  };
  const criarSel = (x, y, w, h, pts) => {
    x = limita(x, 0, tela.current.width); y = limita(y, 0, tela.current.height);
    w = Math.min(w, tela.current.width - x); h = Math.min(h, tela.current.height - y);
    if (w < 1 || h < 1) { previa.current = null; redesenhar(); return; }
    const cv = novoCanvas(w, h), c = cv.getContext("2d");
    if (pts) { c.beginPath(); pts.forEach((q, i) => (i ? c.lineTo(q.x - x, q.y - y) : c.moveTo(q.x - x, q.y - y))); c.closePath(); c.clip(); }
    c.drawImage(tela.current, -x, -y);
    sel.current = { x, y, w, h, ox: x, oy: y, cv, lifted: false };
    previa.current = null; setTamSel(`${w}×${h}`); redesenhar(); tick();
  };

  // ---------- texto, curva e polígono pendentes ----------
  const commitTexto = () => {
    const t = textoRef.current; if (!t) return;
    defTexto(null);
    if (!t.v.trim()) return;
    pushUndo();
    escreverTexto(ctx(), t, cfg.current.fonte, cfg.current.fg, cfg.current.bg);
  };
  const opcoes = (cor, corF) => ({ fg: cor, bg: corF, lw: LARGURAS[cfg.current.largura], modo: cfg.current.preench });
  const fecharPoli = () => {
    const P = poli.current; if (!P) return;
    poli.current = null; previa.current = null;
    const pts = P.pts.slice(0, -1).filter((q, i, a) => i === 0 || q.x !== a[i - 1].x || q.y !== a[i - 1].y);
    if (pts.length >= 2) { pushUndo(); desenharPoli(ctx(), pts, true, opcoes(P.cor, P.corF)); }
    redesenhar();
  };
  const fecharCurva = () => {
    const k = curva.current; if (!k) return;
    curva.current = null; previa.current = null;
    if (k.p0.x !== k.p1.x || k.p0.y !== k.p1.y) { pushUndo(); desenharCurva(ctx(), k, opcoes(k.cor)); }
    redesenhar();
  };
  const finalizar = () => { commitSel(); commitTexto(); if (poli.current) fecharPoli(); if (curva.current) fecharCurva(); };
  const cancelar = () => {
    if (ia.current?.timer) clearInterval(ia.current.timer);
    ia.current = null; previa.current = null; poli.current = null; curva.current = null;
    if (textoRef.current) defTexto(null);
    commitSel(); redesenhar();
  };

  // ---------- ações de menu ----------
  const desfazer = () => {
    if (textoRef.current) { defTexto(null); return; }
    finalizar();
    const cv = undo.current.pop(); if (!cv) return;
    redo.current.push(copiar(tela.current)); restaurar(cv); tick();
  };
  const refazer = () => {
    finalizar();
    const cv = redo.current.pop(); if (!cv) return;
    undo.current.push(copiar(tela.current)); restaurar(cv); tick();
  };
  const copiarSel = () => {
    const s = sel.current; if (!s) return;
    clip.current = copiar(s.cv);
    try { s.cv.toBlob((b) => b && navigator.clipboard?.write?.([new ClipboardItem({ "image/png": b })]).catch(() => {})); } catch { /* sem área de transferência do sistema */ }
    tick();
  };
  const excluirSel = () => {
    const s = sel.current; if (!s) return;
    if (!s.lifted) { pushUndo(); apagarOrigem(s); }
    sel.current = null; setTamSel(""); redesenhar(); tick();
  };
  const recortarSel = () => { if (!sel.current) return; copiarSel(); excluirSel(); };
  const colarCv = (cv) => {
    finalizar(); pushUndo();
    const w = Math.max(tela.current.width, cv.width), h = Math.max(tela.current.height, cv.height);
    if (w !== tela.current.width || h !== tela.current.height) aplicarTam(w, h, copiar(tela.current));
    setFerramenta("retsel");
    sel.current = { x: 0, y: 0, w: cv.width, h: cv.height, ox: 0, oy: 0, cv: copiar(cv), lifted: true };
    setTamSel(`${cv.width}×${cv.height}`); redesenhar(); tick();
  };
  const colar = () => { if (clip.current) colarCv(clip.current); };
  const selecionarTudo = () => { finalizar(); setFerramenta("retsel"); criarSel(0, 0, tela.current.width, tela.current.height); };
  const limparImagem = () => { finalizar(); pushUndo(); const c = ctx(); c.fillStyle = cfg.current.bg; c.fillRect(0, 0, tela.current.width, tela.current.height); };
  const novo = () => {
    finalizar(); pushUndo();
    const { w, h } = tamanhoInicial();
    if (tela.current.width !== w || tela.current.height !== h) aplicarTam(w, h, novoCanvas(1, 1));
    const c = ctx(); c.fillStyle = "#fff"; c.fillRect(0, 0, w, h); setBg("#ffffff");
  };
  const transformar = (fn) => {
    const s = sel.current;
    if (s) { levantar(); const out = fn(s.cv); s.cv = out; s.w = out.width; s.h = out.height; setTamSel(`${out.width}×${out.height}`); redesenhar(); tick(); return; }
    finalizar(); pushUndo();
    const out = fn(copiar(tela.current));
    if (out.width !== tela.current.width || out.height !== tela.current.height) aplicarTam(out.width, out.height, out);
    else ctx().drawImage(out, 0, 0);
  };
  const recortarImagem = () => {
    const s = sel.current; if (!s) return;
    const cv = copiar(s.cv); sel.current = null; setTamSel(""); pushUndo(); aplicarTam(cv.width, cv.height, cv);
  };
  const salvar = (tipo) => {
    finalizar();
    const ext = tipo === "image/jpeg" ? "jpg" : "png";
    tela.current.toBlob((b) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(b); a.download = `sem-titulo.${ext}`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }, tipo, 0.92);
  };
  const carregarArquivo = (file, comoColagem) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => {
      const cv = novoCanvas(img.width, img.height); cv.getContext("2d").drawImage(img, 0, 0); URL.revokeObjectURL(url);
      if (comoColagem) { colarCv(cv); return; }
      finalizar(); pushUndo(); const w = Math.min(img.width, 2000), h = Math.min(img.height, 2000);
      aplicarTam(w, h, cv); setZoom(1);
    };
    img.src = url;
  };
  const editarCor = (alvo) => { alvoCor.current = alvo; if (corInput.current) { corInput.current.value = alvo === "fg" ? fg : bg; corInput.current.click(); } };
  const mudarZoom = (z) => setZoom(z);
  const passoZoom = (d) => setZoom((z) => ZOOMS[limita(ZOOMS.indexOf(z) + d, 0, ZOOMS.length - 1)]);
  const alternar = (k) => setMostra((m) => ({ ...m, [k]: !m[k] }));
  const escolher = (id) => { finalizar(); if (id === "gota") anterior.current = cfg.current.ferramenta === "gota" ? anterior.current : cfg.current.ferramenta; setFerramenta(id); };

  const sobSel = !!sel.current;
  const MENUS = {
    Arquivo: [
      { r: "Novo", f: novo },
      { r: "Abrir…", a: "Ctrl+O", f: () => arquivo.current?.click() },
      { sep: true },
      { r: "Salvar como PNG", a: "Ctrl+S", f: () => salvar("image/png") },
      { r: "Salvar como JPEG", f: () => salvar("image/jpeg") },
    ],
    Editar: [
      { r: "Desfazer", a: "Ctrl+Z", f: desfazer, off: !undo.current.length && !textoRef.current },
      { r: "Refazer", a: "Ctrl+Y", f: refazer, off: !redo.current.length },
      { sep: true },
      { r: "Recortar", a: "Ctrl+X", f: recortarSel, off: !sobSel },
      { r: "Copiar", a: "Ctrl+C", f: copiarSel, off: !sobSel },
      { r: "Colar", a: "Ctrl+V", f: colar, off: !clip.current },
      { r: "Limpar seleção", a: "Del", f: excluirSel, off: !sobSel },
      { r: "Selecionar tudo", a: "Ctrl+A", f: selecionarTudo },
    ],
    Exibir: [
      { r: "Caixa de ferramentas", ck: mostra.ferr, f: () => alternar("ferr") },
      { r: "Caixa de cores", ck: mostra.paleta, f: () => alternar("paleta") },
      { r: "Barra de status", ck: mostra.status, f: () => alternar("status") },
      { sep: true },
      { r: "Ampliar", f: () => passoZoom(1), off: zoom === 8 },
      { r: "Reduzir", f: () => passoZoom(-1), off: zoom === 1 },
      { r: "Zoom normal (100%)", ck: zoom === 1, f: () => mudarZoom(1) },
      { r: "Zoom 200%", ck: zoom === 2, f: () => mudarZoom(2) },
      { r: "Zoom 400%", ck: zoom === 4, f: () => mudarZoom(4) },
      { r: "Zoom 800%", ck: zoom === 8, f: () => mudarZoom(8) },
      { sep: true },
      { r: "Mostrar grade", ck: mostra.grade, f: () => alternar("grade"), off: zoom < 4 },
    ],
    Imagem: [
      { r: "Recortar para a seleção", f: recortarImagem, off: !sobSel },
      { sep: true },
      { r: "Girar 90° à direita", f: () => transformar((s) => girar(s, 90)) },
      { r: "Girar 90° à esquerda", f: () => transformar((s) => girar(s, 270)) },
      { r: "Girar 180°", f: () => transformar((s) => girar(s, 180)) },
      { r: "Inverter horizontalmente", f: () => transformar((s) => inverterEixo(s, true)) },
      { r: "Inverter verticalmente", f: () => transformar((s) => inverterEixo(s, false)) },
      { r: "Inverter cores", f: () => transformar(negativo) },
      { sep: true },
      { r: "Atributos…", f: () => { finalizar(); setAttr({ w: tam.w, h: tam.h }); setDialogo("atributos"); } },
      { r: "Limpar imagem", f: limparImagem },
    ],
    Cores: [
      { r: "Editar cor 1…", f: () => editarCor("fg") },
      { r: "Editar cor 2…", f: () => editarCor("bg") },
      { r: "Trocar cor 1 e cor 2", f: () => { setFg(bg); setBg(fg); } },
    ],
    Ajuda: [
      { r: "Tópicos da Ajuda", f: () => setDialogo("ajuda") },
      { sep: true },
      { r: "Sobre o Paint", f: () => setDialogo("sobre") },
    ],
  };

  // ---------- desenho ----------
  const ponto = (e) => {
    const r = ov.current.getBoundingClientRect(), k = r.width / cfg.current.tam.w;
    return { x: Math.floor((e.clientX - r.left) / k), y: Math.floor((e.clientY - r.top) / k) };
  };
  const traco = (a, b, st) => {
    const c = ctx(), L = LARGURAS[cfg.current.largura];
    if (st.tool === "lapis") riscar(c, a, b, 1, st.cor);
    else if (st.tool === "borracha") riscar(c, a, b, L * 3 + 3, cfg.current.bg);
    else { c.lineCap = "round"; c.lineJoin = "round"; c.strokeStyle = st.cor; c.lineWidth = L * 2; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x + 0.01, b.y); c.stroke(); }
  };
  const borrifar = (p, cor) => {
    const c = ctx(), r = LARGURAS[cfg.current.largura] * 4 + 4;
    c.fillStyle = cor;
    for (let i = 0; i < 14; i++) { const a = Math.random() * 6.283, d = Math.sqrt(Math.random()) * r; c.fillRect(Math.round(p.x + Math.cos(a) * d), Math.round(p.y + Math.sin(a) * d), 1, 1); }
  };
  const preencher = (p, cor) => {
    const W = tela.current.width, H = tela.current.height;
    if (p.x < 0 || p.y < 0 || p.x >= W || p.y >= H) return;
    const c = ctx(), img = c.getImageData(0, 0, W, H), d = img.data, i0 = (p.y * W + p.x) * 4, alvo = [d[i0], d[i0 + 1], d[i0 + 2]];
    const n = parseInt(cor.slice(1), 16), nr = (n >> 16) & 255, ng = (n >> 8) & 255, nb = n & 255;
    if (alvo[0] === nr && alvo[1] === ng && alvo[2] === nb) return;
    const bate = (i) => d[i] === alvo[0] && d[i + 1] === alvo[1] && d[i + 2] === alvo[2];
    const pilha = [[p.x, p.y]];
    while (pilha.length) {
      const [px, py] = pilha.pop();
      let lx = px;
      while (lx >= 0 && bate((py * W + lx) * 4)) lx--;
      lx++;
      let acima = false, abaixo = false;
      for (let cx = lx; cx < W && bate((py * W + cx) * 4); cx++) {
        const i = (py * W + cx) * 4;
        d[i] = nr; d[i + 1] = ng; d[i + 2] = nb; d[i + 3] = 255;
        if (py > 0) { const b = bate(((py - 1) * W + cx) * 4); if (b && !acima) pilha.push([cx, py - 1]); acima = b; }
        if (py < H - 1) { const b = bate(((py + 1) * W + cx) * 4); if (b && !abaixo) pilha.push([cx, py + 1]); abaixo = b; }
      }
    }
    c.putImageData(img, 0, 0);
  };

  const iniciar = (e) => {
    if (e.button !== 0 && e.button !== 2) return;
    raiz.current?.focus({ preventScroll: true });
    const cf = cfg.current, f = cf.ferramenta, p = ponto(e), dir = e.button === 2;
    const cor = dir ? cf.bg : cf.fg, corF = dir ? cf.fg : cf.bg;
    const selTool = f === "retsel" || f === "livre";
    if (textoRef.current) commitTexto();
    if (sel.current && !(selTool && dentro(sel.current, p))) commitSel();
    if (poli.current && f !== "poligono") fecharPoli();
    if (curva.current && f !== "curva") fecharCurva();
    e.currentTarget.setPointerCapture(e.pointerId);

    if (selTool) {
      if (sel.current) { ia.current = { tipo: "mover", p0: p, x0: sel.current.x, y0: sel.current.y, copia: e.ctrlKey || e.shiftKey, moveu: false }; return; }
      ia.current = { tipo: f === "livre" ? "livre" : "ret", p0: p, p1: p, pts: [p] };
      previa.current = (c) => {
        const a = ia.current; if (!a) return;
        if (a.tipo === "livre") {
          c.save(); c.setLineDash([3, 3]); c.strokeStyle = "#000"; c.lineWidth = 1; c.beginPath();
          a.pts.forEach((q, i) => (i ? c.lineTo(q.x + 0.5, q.y + 0.5) : c.moveTo(q.x + 0.5, q.y + 0.5))); c.stroke(); c.restore();
        } else { const x = Math.min(a.p0.x, a.p1.x), y = Math.min(a.p0.y, a.p1.y); retraco(c, x, y, Math.abs(a.p1.x - a.p0.x) + 1, Math.abs(a.p1.y - a.p0.y) + 1); }
      };
      return;
    }
    if (f === "lapis" || f === "pincel" || f === "borracha") {
      pushUndo(); ia.current = { tipo: "traco", last: p, cor, tool: f }; traco(p, p, ia.current); return;
    }
    if (f === "spray") {
      pushUndo(); borrifar(p, cor);
      const st = { tipo: "spray", p, cor };
      st.timer = setInterval(() => borrifar(st.p, st.cor), 30); ia.current = st; return;
    }
    if (f === "balde") { pushUndo(); preencher(p, cor); return; }
    if (f === "gota") {
      const W = tela.current.width, H = tela.current.height;
      if (p.x >= 0 && p.y >= 0 && p.x < W && p.y < H) {
        const d = ctx().getImageData(p.x, p.y, 1, 1).data, h = hex(d[0], d[1], d[2]);
        if (dir) setBg(h); else setFg(h);
        setFerramenta(anterior.current || "lapis");
      }
      return;
    }
    if (f === "lupa") { passoZoom(dir ? -1 : 1); return; }
    if (f === "texto") {
      ia.current = { tipo: "caixa", p0: p, p1: p };
      previa.current = (c) => { const a = ia.current; if (a) retraco(c, Math.min(a.p0.x, a.p1.x), Math.min(a.p0.y, a.p1.y), Math.abs(a.p1.x - a.p0.x) + 1, Math.abs(a.p1.y - a.p0.y) + 1); };
      return;
    }
    if (f === "linha" || f === "retangulo" || f === "elipse" || f === "retredondo") {
      ia.current = { tipo: "forma", id: f, p0: p, p1: p, cor, corF, shift: e.shiftKey };
      previa.current = (c) => { const a = ia.current; if (a) desenharForma(c, a.id, a.p0, a.p1, { ...opcoes(a.cor, a.corF), shift: a.shift }); };
      redesenhar(); return;
    }
    if (f === "curva") {
      if (!curva.current) {
        curva.current = { etapa: 0, p0: p, p1: p, c1: null, c2: null, cor };
        previa.current = (c) => { const k = curva.current; if (k) desenharCurva(c, k, opcoes(k.cor)); };
      }
      ia.current = { tipo: "curva" }; return;
    }
    if (f === "poligono") {
      const Pg = poli.current;
      if (!Pg) {
        poli.current = { pts: [p, p], cor, corF };
        previa.current = (c) => { const g = poli.current; if (g) desenharPoli(c, g.pts, false, opcoes(g.cor, g.corF)); };
      } else if (Pg.pts.length > 2 && Math.hypot(p.x - Pg.pts[0].x, p.y - Pg.pts[0].y) <= 5) { fecharPoli(); return; }
      else { Pg.pts[Pg.pts.length - 1] = p; Pg.pts.push(p); }
      ia.current = { tipo: "poli" }; redesenhar();
    }
  };

  const mover = (e) => {
    const p = ponto(e), a = ia.current, cf = cfg.current;
    const W = cf.tam.w, H = cf.tam.h, noCanvas = p.x >= 0 && p.y >= 0 && p.x < W && p.y < H;
    setPos(noCanvas ? `${p.x}, ${p.y}` : "");
    if (!a) {
      const s = sel.current;
      e.currentTarget.style.cursor = (cf.ferramenta === "retsel" || cf.ferramenta === "livre") && s && dentro(s, p) ? "move" : cf.ferramenta === "lupa" ? "zoom-in" : "crosshair";
      if (poli.current) { const g = poli.current; g.pts[g.pts.length - 1] = p; redesenhar(); }
      return;
    }
    switch (a.tipo) {
      case "traco": traco(a.last, p, a); a.last = p; break;
      case "spray": a.p = p; break;
      case "forma": a.p1 = p; a.shift = e.shiftKey; setTamSel(`${Math.abs(p.x - a.p0.x)}×${Math.abs(p.y - a.p0.y)}`); redesenhar(); break;
      case "ret": a.p1 = { x: limita(p.x, 0, W - 1), y: limita(p.y, 0, H - 1) }; redesenhar(); break;
      case "livre": a.pts.push({ x: limita(p.x, 0, W - 1), y: limita(p.y, 0, H - 1) }); redesenhar(); break;
      case "caixa": a.p1 = p; redesenhar(); break;
      case "mover": {
        const s = sel.current, dx = p.x - a.p0.x, dy = p.y - a.p0.y;
        if (!a.moveu && (dx || dy)) { a.moveu = true; if (a.copia) { pushUndo(); s.lifted = true; } else levantar(); }
        s.x = a.x0 + dx; s.y = a.y0 + dy; redesenhar(); break;
      }
      case "curva": {
        const k = curva.current; if (!k) break;
        if (k.etapa === 0) k.p1 = p; else if (k.etapa === 1) k.c1 = p; else k.c2 = p;
        redesenhar(); break;
      }
      case "poli": { const g = poli.current; if (g) { g.pts[g.pts.length - 1] = p; redesenhar(); } break; }
      default: break;
    }
  };

  const parar = (e) => {
    const a = ia.current; if (!a) return;
    ia.current = null;
    const cf = cfg.current;
    if (a.timer) clearInterval(a.timer);
    if (a.tipo === "forma") {
      previa.current = null; setTamSel("");
      pushUndo(); desenharForma(ctx(), a.id, a.p0, a.p1, { ...opcoes(a.cor, a.corF), shift: a.shift });
      redesenhar();
    } else if (a.tipo === "ret") {
      previa.current = null;
      criarSel(Math.min(a.p0.x, a.p1.x), Math.min(a.p0.y, a.p1.y), Math.abs(a.p1.x - a.p0.x) + 1, Math.abs(a.p1.y - a.p0.y) + 1);
    } else if (a.tipo === "livre") {
      previa.current = null;
      const xs = a.pts.map((q) => q.x), ys = a.pts.map((q) => q.y), x = Math.min(...xs), y = Math.min(...ys);
      if (a.pts.length > 2) criarSel(x, y, Math.max(...xs) - x + 1, Math.max(...ys) - y + 1, a.pts); else redesenhar();
    } else if (a.tipo === "caixa") {
      previa.current = null;
      const x = Math.min(a.p0.x, a.p1.x), y = Math.min(a.p0.y, a.p1.y);
      let w = Math.abs(a.p1.x - a.p0.x), h = Math.abs(a.p1.y - a.p0.y);
      if (w < 12 || h < 12) { w = Math.max(w, 140); h = Math.max(h, Math.round(cf.fonte.tam * 1.25) + 6); }
      defTexto({ x, y, w, h, v: "" }); redesenhar();
    } else if (a.tipo === "mover") {
      redesenhar();
    } else if (a.tipo === "curva") {
      const k = curva.current; if (!k) return;
      if (k.etapa === 0) { if (k.p0.x === k.p1.x && k.p0.y === k.p1.y) { curva.current = null; previa.current = null; redesenhar(); } else k.etapa = 1; }
      else if (k.etapa === 1) { k.etapa = 2; k.c2 = k.c1; }
      else fecharCurva();
    }
    e?.currentTarget?.releasePointerCapture?.(e.pointerId);
  };

  const teclar = (e) => {
    const tag = e.target.tagName, campo = tag === "TEXTAREA" || tag === "INPUT" || tag === "SELECT";
    const ctrl = e.ctrlKey || e.metaKey, k = e.key.toLowerCase();
    if (e.key === "Escape") { e.preventDefault(); cancelar(); return; }
    if (campo) return;
    if (ctrl && k === "z") { e.preventDefault(); if (e.shiftKey) refazer(); else desfazer(); }
    else if (ctrl && k === "y") { e.preventDefault(); refazer(); }
    else if (ctrl && k === "c") { e.preventDefault(); copiarSel(); }
    else if (ctrl && k === "x") { e.preventDefault(); recortarSel(); }
    else if (ctrl && k === "v" && clip.current) { e.preventDefault(); colar(); }
    else if (ctrl && k === "a") { e.preventDefault(); selecionarTudo(); }
    else if (ctrl && k === "s") { e.preventDefault(); salvar("image/png"); }
    else if (ctrl && k === "o") { e.preventDefault(); arquivo.current?.click(); }
    else if ((e.key === "Delete" || e.key === "Backspace") && sel.current) { e.preventDefault(); excluirSel(); }
    else if (e.key === "Enter") { if (poli.current) fecharPoli(); else if (curva.current) fecharCurva(); }
  };
  const colarEvento = (e) => {
    const item = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith("image/"));
    if (item) { e.preventDefault(); carregarArquivo(item.getAsFile(), true); }
  };

  // alças de tamanho do desenho
  const redimensionar = (dx, dy) => (e) => {
    if (e.button !== 0) return;
    e.preventDefault(); e.stopPropagation(); finalizar();
    const alvo = e.currentTarget, ini = { x: e.clientX, y: e.clientY, w: tam.w, h: tam.h };
    alvo.setPointerCapture(e.pointerId);
    const calc = (ev) => ({ w: limita(Math.round(ini.w + (dx ? (ev.clientX - ini.x) / zoom : 0)), 1, 2000), h: limita(Math.round(ini.h + (dy ? (ev.clientY - ini.y) / zoom : 0)), 1, 2000) });
    const mv = (ev) => { const n = calc(ev); setGuia(n); setTamSel(`${n.w}×${n.h}`); };
    const fim = (ev) => {
      alvo.removeEventListener("pointermove", mv); alvo.removeEventListener("pointerup", fim); alvo.removeEventListener("pointercancel", fim);
      const n = calc(ev); setGuia(null); setTamSel("");
      if (n.w !== ini.w || n.h !== ini.h) { pushUndo(); aplicarTam(n.w, n.h, copiar(tela.current)); }
    };
    alvo.addEventListener("pointermove", mv); alvo.addEventListener("pointerup", fim); alvo.addEventListener("pointercancel", fim);
  };

  const pickCor = (e, c) => { if (e.button === 2) setBg(c); else setFg(c); };
  const opcaoZoom = ferramenta === "lupa";
  const mostraPreench = COM_PREENCH.includes(ferramenta);
  const mostraLargura = COM_LARGURA.includes(ferramenta);
  const mostraTexto = ferramenta === "texto";

  return (
    <div className="app-paint" ref={raiz} tabIndex={0} onKeyDown={teclar} onPaste={colarEvento}>
      <div className="ap-menu" role="menubar" aria-label="Menu do Paint">
        {Object.keys(MENUS).map((nome) => (
          <div key={nome} className="ap-menu-item">
            <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded={menu === nome}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerEnter={() => menu && setMenu(nome)}
              onClick={() => { if (menu !== nome) finalizar(); setMenu(menu === nome ? null : nome); }}>{nome}</button>
            {menu === nome && (
              <div className="ap-drop" role="menu" onPointerDown={(e) => e.stopPropagation()}>
                {MENUS[nome].map((it, i) => it.sep
                  ? <hr key={i} />
                  : (
                    <button key={it.r} type="button" role={it.ck !== undefined ? "menuitemcheckbox" : "menuitem"} aria-checked={it.ck} disabled={it.off}
                      onClick={() => { setMenu(null); it.f(); raiz.current?.focus({ preventScroll: true }); }}>
                      <span className="ap-ck">{it.ck ? "✓" : ""}</span><span className="ap-rot">{it.r}</span><span className="ap-atalho">{it.a}</span>
                    </button>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="ap-corpo">
        {mostra.ferr && (
          <div className="ap-lateral">
            <div className="ap-ferramentas" role="toolbar" aria-label="Ferramentas" aria-orientation="vertical">
              {FERRAMENTAS.map(([id, nome]) => (
                <button key={id} type="button" aria-label={nome} title={nome} aria-pressed={ferramenta === id}
                  onMouseEnter={() => setAjuda(nome)} onMouseLeave={() => setAjuda(AJUDA)} onClick={() => escolher(id)}>
                  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">{ICONES[id]}</svg>
                </button>
              ))}
            </div>
            <div className="ap-opcoes" role="group" aria-label="Opções da ferramenta">
              {opcaoZoom && (
                <div className="ap-lista">{ZOOMS.map((z) => <button key={z} type="button" aria-pressed={zoom === z} onClick={() => setZoom(z)}>{z}x</button>)}</div>
              )}
              {mostraPreench && (
                <div className="ap-preench">
                  {["Contorno", "Contorno e preenchimento", "Preenchimento"].map((nome, i) => (
                    <button key={nome} type="button" aria-label={nome} title={nome} aria-pressed={preench === i} onClick={() => setPreench(i)}>
                      <i style={{ background: i === 0 ? "transparent" : i === 1 ? "#b4b4b4" : "#555", borderColor: i === 2 ? "transparent" : "#000" }} />
                    </button>
                  ))}
                </div>
              )}
              {mostraTexto && (
                <div className="ap-preench">
                  {[["Opaco", true], ["Transparente", false]].map(([nome, v]) => (
                    <button key={nome} type="button" className="ap-txt-op" aria-pressed={fonte.opaco === v} onClick={() => setFonte((f) => ({ ...f, opaco: v }))}>{nome}</button>
                  ))}
                </div>
              )}
              {mostraLargura && (
                <div className="ap-larguras">
                  {LARGURAS.map((w, i) => (
                    <button key={w} type="button" aria-label={`Espessura ${w}`} title={`Espessura ${w}`} aria-pressed={largura === i} onClick={() => setLargura(i)}><i style={{ height: w }} /></button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="ap-principal">
          {mostraTexto && (
            <div className="ap-fontes" role="toolbar" aria-label="Fonte do texto">
              <select aria-label="Fonte" value={fonte.fam} onChange={(e) => setFonte((f) => ({ ...f, fam: e.target.value }))}>{FONTES.map((n) => <option key={n}>{n}</option>)}</select>
              <select aria-label="Tamanho" value={fonte.tam} onChange={(e) => setFonte((f) => ({ ...f, tam: +e.target.value }))}>{TAM_FONTE.map((n) => <option key={n}>{n}</option>)}</select>
              <button type="button" aria-pressed={fonte.n} aria-label="Negrito" onClick={() => setFonte((f) => ({ ...f, n: !f.n }))}><b>N</b></button>
              <button type="button" aria-pressed={fonte.i} aria-label="Itálico" onClick={() => setFonte((f) => ({ ...f, i: !f.i }))}><i>I</i></button>
              <button type="button" aria-pressed={fonte.s} aria-label="Sublinhado" onClick={() => setFonte((f) => ({ ...f, s: !f.s }))}><u>S</u></button>
            </div>
          )}
          <div className="ap-area" onContextMenu={(e) => e.preventDefault()}>
            <div className={`ap-tela ${mostra.grade && zoom >= 4 ? "tem-grade" : ""}`} style={{ width: tam.w * zoom, height: tam.h * zoom, "--z": `${zoom}px` }}>
              <canvas ref={tela} width={tam.w} height={tam.h} className="ap-cv" aria-hidden="true" />
              <canvas ref={ov} width={tam.w} height={tam.h} className="ap-cv ap-ov" aria-label="Área de desenho: use o mouse ou o toque"
                onPointerDown={iniciar} onPointerMove={mover} onPointerUp={parar} onPointerCancel={parar} onPointerLeave={() => setPos("")}
                onDoubleClick={() => { if (poli.current) fecharPoli(); }} />
              {texto && (
                <textarea ref={taRef} className="ap-texto" aria-label="Texto" value={texto.v} spellCheck={false}
                  onChange={(e) => defTexto({ ...texto, v: e.target.value })}
                  style={{
                    left: texto.x * zoom, top: texto.y * zoom, width: texto.w * zoom, height: texto.h * zoom,
                    font: fonteCss({ ...fonte, tam: fonte.tam * zoom }), lineHeight: 1.25, color: fg, background: fonte.opaco ? bg : "transparent",
                    textDecoration: fonte.s ? "underline" : "none",
                  }} />
              )}
              {guia && <div className="ap-guia" style={{ width: guia.w * zoom, height: guia.h * zoom }} />}
              <span className="ap-alca e" onPointerDown={redimensionar(true, false)} />
              <span className="ap-alca s" onPointerDown={redimensionar(false, true)} />
              <span className="ap-alca se" onPointerDown={redimensionar(true, true)} />
            </div>
          </div>
        </div>
      </div>

      {mostra.paleta && (
        <div className="ap-paleta">
          <div className="ap-atual" role="img" aria-label={`Cor 1 ${fg}, cor 2 ${bg}`}>
            <span className="ap-bg" style={{ background: bg }} />
            <span className="ap-fg" style={{ background: fg }} />
          </div>
          <div className="ap-cores" role="group" aria-label="Cores: clique para a cor 1, botão direito para a cor 2" onContextMenu={(e) => e.preventDefault()}>
            {[...LINHA1, ...LINHA2].map((c, i) => <button key={c + i} type="button" style={{ background: c }} aria-label={`Cor ${c}`} title="Clique: cor 1 · Botão direito: cor 2" onPointerDown={(e) => pickCor(e, c)} onKeyDown={(e) => { if (e.key === "Enter") setFg(c); }} />)}
          </div>
          <button type="button" className="ap-editar" onClick={() => editarCor("fg")} title="Editar cor 1">Editar cores…</button>
        </div>
      )}
      <input ref={corInput} type="color" className="ap-oculto" aria-hidden="true" tabIndex={-1}
        onChange={(e) => (alvoCor.current === "fg" ? setFg(e.target.value) : setBg(e.target.value))} />
      <input ref={arquivo} type="file" accept="image/*" className="ap-oculto" aria-hidden="true" tabIndex={-1}
        onChange={(e) => { carregarArquivo(e.target.files?.[0], false); e.target.value = ""; }} />

      {mostra.status && (
        <div className="ap-status" role="status">
          <span className="ap-st-ajuda">{ajuda}</span>
          <span className="ap-st-seg">{pos}</span>
          <span className="ap-st-seg">{tamSel || `${tam.w}×${tam.h}${zoom > 1 ? ` · ${zoom * 100}%` : ""}`}</span>
        </div>
      )}

      {dialogo && (
        <div className="ap-veu" onPointerDown={(e) => e.stopPropagation()}>
          <div className="ap-dialogo" role="dialog" aria-modal="true" aria-label={dialogo === "atributos" ? "Atributos" : dialogo === "ajuda" ? "Ajuda do Paint" : "Sobre o Paint"}>
            <div className="ap-dlg-titulo">{dialogo === "atributos" ? "Atributos" : dialogo === "ajuda" ? "Ajuda do Paint" : "Sobre o Paint"}</div>
            <div className="ap-dlg-corpo">
              {dialogo === "atributos" && (
                <>
                  <label>Largura: <input type="number" min="1" max="2000" value={attr.w} onChange={(e) => setAttr((a) => ({ ...a, w: +e.target.value }))} /> pixels</label>
                  <label>Altura: <input type="number" min="1" max="2000" value={attr.h} onChange={(e) => setAttr((a) => ({ ...a, h: +e.target.value }))} /> pixels</label>
                </>
              )}
              {dialogo === "ajuda" && (
                <ul>
                  <li>Clique numa cor para a cor 1 (desenho) e use o botão direito para a cor 2 (fundo).</li>
                  <li>Seleção livre e Selecionar: arraste para marcar; arraste a seleção para mover (Ctrl copia). Ctrl+C, Ctrl+X, Ctrl+V e Del funcionam.</li>
                  <li>Linha, Elipse e Retângulo: segure Shift para linhas retas em 45° e formas perfeitas.</li>
                  <li>Curva: arraste a reta, depois arraste duas vezes para curvar. Polígono: clique em cada ponto e dê duplo clique para fechar.</li>
                  <li>Texto: arraste uma caixa e digite; clique fora para aplicar. Ampliar: clique para aproximar, botão direito para afastar.</li>
                  <li>Ctrl+Z desfaz, Ctrl+Y refaz. Esc cancela. Arraste as alças azuis para mudar o tamanho do desenho.</li>
                </ul>
              )}
              {dialogo === "sobre" && <p>Paint do portfólio de Thiago Miranda — uma recriação do Paint clássico do Windows XP feita em React e Canvas.</p>}
            </div>
            <div className="ap-dlg-botoes">
              {dialogo === "atributos" && (
                <button type="button" onClick={() => {
                  const w = limita(Math.round(attr.w) || tam.w, 1, 2000), h = limita(Math.round(attr.h) || tam.h, 1, 2000);
                  setDialogo(null);
                  if (w !== tam.w || h !== tam.h) { pushUndo(); aplicarTam(w, h, copiar(tela.current)); }
                }}>OK</button>
              )}
              <button type="button" onClick={() => setDialogo(null)}>{dialogo === "atributos" ? "Cancelar" : "Fechar"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
