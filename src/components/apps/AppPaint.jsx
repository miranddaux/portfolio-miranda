import { useEffect, useRef, useState } from "react";

// Paint no layout do Paint do Windows 7: menu, caixa de ferramentas em 2 colunas, paleta no topo,
// área de desenho cinza e barra de status. Ferramentas sem versão pronta ficam desativadas e marcadas.
const L = 640, A = 400;
const LINHA1 = ["#000000", "#3c3c3c", "#787878", "#9b0c3b", "#ed1c24", "#ff7f27", "#ffc90e", "#fff200", "#a8e61d", "#22b14c", "#00b7ef", "#4d6df3", "#2f3192", "#6f3198"];
const LINHA2 = ["#ffffff", "#dcdcdc", "#b4b4b4", "#9c5a3c", "#ffa3b1", "#e5aa7a", "#f5e49c", "#fff9bd", "#d3f9bc", "#9dbb61", "#99d9ea", "#709ad1", "#546d8e", "#b5a5d5"];
const LARGURAS = [1, 2, 4, 6, 8];
const AJUDA = "Para obter Ajuda, clique em Tópicos da Ajuda no menu Ajuda.";

const P = ({ d, f, s, w = 1.2 }) => <path d={d} fill={f || "none"} stroke={s || "none"} strokeWidth={w} strokeLinejoin="round" strokeLinecap="round" />;
const ICONES = {
  livre: <><P d="M3 9c0-4 4-6 7-4s2 6-1 7-5-1-6-3z" s="#2a5db0" /><P d="M3 9l-1 5" s="#555" /></>,
  retsel: <P d="M3 3h10v10H3z" s="#2a5db0" />,
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
  ["livre", "Seleção livre", false], ["retsel", "Selecionar", false],
  ["borracha", "Borracha", true], ["balde", "Preencher com cor", true],
  ["gota", "Selecionar cor", true], ["lupa", "Ampliar", false],
  ["lapis", "Lápis", true], ["pincel", "Pincel", true],
  ["spray", "Aerógrafo", true], ["texto", "Texto", false],
  ["linha", "Linha", true], ["curva", "Curva", false],
  ["retangulo", "Retângulo", true], ["poligono", "Polígono", false],
  ["elipse", "Elipse", true], ["retredondo", "Retângulo arredondado", true],
];
const FORMAS = ["retangulo", "elipse", "retredondo"];

const hex = (r, g, b) => `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;

export default function AppPaint() {
  const tela = useRef(null), inicio = useRef(null), base = useRef(null), historico = useRef([]), botao = useRef(0);
  const [ferramenta, setFerramenta] = useState("retangulo");
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [largura, setLargura] = useState(0);
  const [preench, setPreench] = useState(0);
  const [menu, setMenu] = useState(null);
  const [status, setStatus] = useState(AJUDA);

  const ctx = () => tela.current.getContext("2d", { willReadFrequently: true });
  useEffect(() => { const c = ctx(); c.fillStyle = "#fff"; c.fillRect(0, 0, L, A); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!menu) return undefined;
    const fechar = () => setMenu(null);
    window.addEventListener("pointerdown", fechar);
    return () => window.removeEventListener("pointerdown", fechar);
  }, [menu]);

  const guardar = () => { historico.current.push(ctx().getImageData(0, 0, L, A)); if (historico.current.length > 20) historico.current.shift(); };
  const desfazer = () => { const h = historico.current.pop(); if (h) ctx().putImageData(h, 0, 0); };
  const limpar = () => { guardar(); const c = ctx(); c.fillStyle = "#fff"; c.fillRect(0, 0, L, A); };
  const salvar = () => tela.current.toBlob((b) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(b); a.download = "desenho-paint.png"; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  const ponto = (e) => {
    const r = tela.current.getBoundingClientRect();
    return { x: Math.round(((e.clientX - r.left) * L) / r.width), y: Math.round(((e.clientY - r.top) * A) / r.height) };
  };

  const preencher = (x, y, cor) => {
    const c = ctx(), img = c.getImageData(0, 0, L, A), d = img.data;
    const i0 = (y * L + x) * 4, alvo = [d[i0], d[i0 + 1], d[i0 + 2]];
    const n = parseInt(cor.slice(1), 16), nr = (n >> 16) & 255, ng = (n >> 8) & 255, nb = n & 255;
    if (alvo[0] === nr && alvo[1] === ng && alvo[2] === nb) return;
    const bate = (i) => d[i] === alvo[0] && d[i + 1] === alvo[1] && d[i + 2] === alvo[2];
    const pilha = [[x, y]];
    while (pilha.length) {
      const [px, py] = pilha.pop();
      let lx = px;
      while (lx >= 0 && bate((py * L + lx) * 4)) lx--;
      lx++;
      let acima = false, abaixo = false;
      for (let cx = lx; cx < L && bate((py * L + cx) * 4); cx++) {
        const i = (py * L + cx) * 4;
        d[i] = nr; d[i + 1] = ng; d[i + 2] = nb; d[i + 3] = 255;
        if (py > 0) { const b = bate(((py - 1) * L + cx) * 4); if (b && !acima) pilha.push([cx, py - 1]); acima = b; }
        if (py < A - 1) { const b = bate(((py + 1) * L + cx) * 4); if (b && !abaixo) pilha.push([cx, py + 1]); abaixo = b; }
      }
    }
    c.putImageData(img, 0, 0);
  };

  const traco = (de, para, cor) => {
    const c = ctx(), w = LARGURAS[largura];
    c.lineCap = "round"; c.lineJoin = "round";
    c.strokeStyle = ferramenta === "borracha" ? bg : cor;
    c.lineWidth = ferramenta === "lapis" ? 1 : ferramenta === "borracha" ? w * 3 + 2 : w;
    c.beginPath(); c.moveTo(de.x, de.y); c.lineTo(para.x + 0.01, para.y); c.stroke();
  };
  const spray = (p, cor) => {
    const c = ctx(), r = LARGURAS[largura] * 3 + 4;
    c.fillStyle = cor;
    for (let i = 0; i < 14; i++) {
      const a = Math.random() * 6.283, d = Math.random() * r;
      c.fillRect(Math.round(p.x + Math.cos(a) * d), Math.round(p.y + Math.sin(a) * d), 1, 1);
    }
  };
  const forma = (de, para, cor, corFundo) => {
    const c = ctx();
    c.putImageData(base.current, 0, 0);
    c.lineWidth = LARGURAS[largura]; c.lineJoin = "round"; c.lineCap = "round";
    c.strokeStyle = cor;
    c.beginPath();
    if (ferramenta === "linha") { c.moveTo(de.x, de.y); c.lineTo(para.x, para.y); c.stroke(); return; }
    const x = Math.min(de.x, para.x), y = Math.min(de.y, para.y), w = Math.abs(para.x - de.x), h = Math.abs(para.y - de.y);
    if (ferramenta === "elipse") c.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, 6.283);
    else if (ferramenta === "retredondo") c.roundRect(x, y, w, h, Math.min(16, w / 2, h / 2));
    else c.rect(x, y, w, h);
    if (preench === 1) { c.fillStyle = corFundo; c.fill(); c.stroke(); }
    else if (preench === 2) { c.fillStyle = cor; c.fill(); }
    else c.stroke();
  };

  const iniciar = (e) => {
    if (e.button > 2) return;
    const p = ponto(e);
    botao.current = e.button === 2 ? 2 : 0;
    const cor = botao.current === 2 ? bg : fg;
    if (ferramenta === "gota") {
      const d = ctx().getImageData(p.x, p.y, 1, 1).data, h = hex(d[0], d[1], d[2]);
      if (botao.current === 2) setBg(h); else setFg(h);
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    guardar();
    if (ferramenta === "balde") { preencher(Math.max(0, Math.min(L - 1, p.x)), Math.max(0, Math.min(A - 1, p.y)), cor); return; }
    inicio.current = p;
    if (FORMAS.includes(ferramenta) || ferramenta === "linha") base.current = ctx().getImageData(0, 0, L, A);
    else if (ferramenta === "spray") spray(p, cor);
    else traco(p, p, cor);
  };
  const mover = (e) => {
    const p = ponto(e);
    setStatus(p.x >= 0 && p.y >= 0 && p.x < L && p.y < A ? `${p.x}, ${p.y} px` : AJUDA);
    if (!inicio.current) return;
    const cor = botao.current === 2 ? bg : fg, corFundo = botao.current === 2 ? fg : bg;
    if (FORMAS.includes(ferramenta) || ferramenta === "linha") forma(inicio.current, p, cor, corFundo);
    else if (ferramenta === "spray") spray(p, cor);
    else { traco(inicio.current, p, cor); inicio.current = p; }
  };
  const parar = () => { inicio.current = null; base.current = null; };

  const pickCor = (e, c) => { if (e.button === 2) setBg(c); else setFg(c); };
  const mostraOpcoes = FORMAS.includes(ferramenta);

  return (
    <div className="app-paint">
      <div className="ap-menu" role="menubar" aria-label="Menu do Paint">
        {[["Arquivo", [["Novo", limpar], ["Salvar como PNG", salvar]]], ["Editar", [["Desfazer", desfazer], ["Limpar imagem", limpar]]], ["Exibir"], ["Imagem"], ["Cores"], ["Ajuda"]].map(([nome, itens]) => (
          <div key={nome} className="ap-menu-item">
            <button type="button" role="menuitem" aria-haspopup={itens ? "menu" : undefined} aria-expanded={itens ? menu === nome : undefined} disabled={!itens} title={itens ? undefined : "Indisponível nesta versão"}
              onPointerDown={(e) => e.stopPropagation()} onClick={() => itens && setMenu(menu === nome ? null : nome)}>{nome}</button>
            {itens && menu === nome && (
              <div className="ap-drop" role="menu" onPointerDown={(e) => e.stopPropagation()}>
                {itens.map(([rot, fn]) => <button key={rot} type="button" role="menuitem" onClick={() => { fn(); setMenu(null); }}>{rot}</button>)}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="ap-corpo">
        <div className="ap-lateral">
          <div className="ap-ferramentas" role="toolbar" aria-label="Ferramentas" aria-orientation="vertical">
            {FERRAMENTAS.map(([id, nome, ok]) => (
              <button key={id} type="button" aria-label={ok ? nome : `${nome} (indisponível)`} title={ok ? nome : `${nome} — indisponível nesta versão`} aria-pressed={ok ? ferramenta === id : undefined} disabled={!ok} onClick={() => setFerramenta(id)}>
                <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">{ICONES[id]}</svg>
              </button>
            ))}
          </div>
          <div className="ap-opcoes" role="group" aria-label="Opções da ferramenta">
            {mostraOpcoes ? (
              <div className="ap-preench">
                {["Contorno", "Contorno e preenchimento", "Preenchimento"].map((nome, i) => (
                  <button key={nome} type="button" aria-label={nome} title={nome} aria-pressed={preench === i} onClick={() => setPreench(i)}>
                    <i style={{ background: i === 0 ? "transparent" : i === 1 ? "#b4b4b4" : "#787878", borderColor: i === 2 ? "transparent" : "#000" }} />
                  </button>
                ))}
              </div>
            ) : <div className="ap-preench-vazio" />}
            <div className="ap-larguras">
              {LARGURAS.map((w, i) => (
                <button key={w} type="button" aria-label={`Espessura ${w}`} title={`Espessura ${w}`} aria-pressed={largura === i} onClick={() => setLargura(i)}><i style={{ height: w }} /></button>
              ))}
            </div>
          </div>
        </div>
        <div className="ap-principal">
          <div className="ap-paleta">
            <div className="ap-atual" role="img" aria-label={`Cor 1 ${fg}, cor 2 ${bg}`}>
              <span className="ap-bg" style={{ background: bg }} />
              <span className="ap-fg" style={{ background: fg }} />
            </div>
            <div className="ap-cores" role="group" aria-label="Cores: clique para a cor 1, botão direito para a cor 2" onContextMenu={(e) => e.preventDefault()}>
              {[...LINHA1, ...LINHA2].map((c) => <button key={c} type="button" style={{ background: c }} aria-label={`Cor ${c}`} onPointerDown={(e) => pickCor(e, c)} />)}
            </div>
          </div>
          <div className="ap-area" onContextMenu={(e) => e.preventDefault()}>
            <canvas ref={tela} width={L} height={A} aria-label="Área de desenho: use o mouse ou o toque" onPointerDown={iniciar} onPointerMove={mover} onPointerUp={parar} onPointerCancel={parar} onPointerLeave={() => setStatus(AJUDA)} />
          </div>
        </div>
      </div>
      <div className="ap-status" role="status">{status}</div>
    </div>
  );
}
