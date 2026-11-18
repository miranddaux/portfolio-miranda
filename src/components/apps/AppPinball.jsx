import { useCallback, useEffect, useRef, useState } from "react";

// Pinball próprio, desenhado em canvas (sem jogo de terceiros).
// Teclas: Z ou ← (flipper esquerdo), / ou → (flipper direito), Espaço (segurar e soltar para lançar).
const W = 400;
const H = 600;
const R = 8; // raio da bola
const SUB = 4; // passos de física por quadro
const GRAVIDADE = 0.1;
const VMAX = 14;
const REPOUSO = 0.5; // ângulo do flipper em repouso (rad, para baixo)
const ATIVO = -0.45; // ângulo do flipper erguido
const VEL_FLIPPER = 0.2; // rad por quadro
const COMP_FLIPPER = 62;
const LANCE = { x: 366, y: 552 };

const FLIPPERS = [
  { id: "esq", px: 112, py: 536, lado: 1 },
  { id: "dir", px: 258, py: 536, lado: -1 },
];

// Contorno da mesa: arco no topo + paredes laterais + guias inclinadas + trilho do lançador.
function montarParedes() {
  const p = [];
  const arco = [];
  for (let a = Math.PI; a <= 2 * Math.PI + 0.001; a += Math.PI / 24) arco.push([200 + 180 * Math.cos(a), 200 + 180 * Math.sin(a)]);
  for (let i = 0; i < arco.length - 1; i++) p.push([arco[i], arco[i + 1]]);
  p.push([[20, 200], [20, 470]]);
  p.push([[380, 200], [380, 590]]);
  p.push([[20, 470], [96, 530]]);
  p.push([[348, 470], [274, 530]]);
  p.push([[348, 190], [348, 590]]); // guia do trilho do lançador
  p.push([[348, 590], [380, 590]]);
  return p;
}
const PAREDES = montarParedes();
const BUMPERS = [
  { x: 145, y: 230, r: 22 },
  { x: 255, y: 230, r: 22 },
  { x: 200, y: 320, r: 22 },
];

const ponto = (px, py, ax, ay, bx, by) => {
  const dx = bx - ax, dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return [ax + t * dx, ay + t * dy];
};

function novoEstado() {
  return {
    bola: { x: LANCE.x, y: LANCE.y, vx: 0, vy: 0 },
    flip: { esq: REPOUSO, dir: REPOUSO },
    omega: { esq: 0, dir: 0 },
    teclas: { esq: false, dir: false },
    carga: 0,
    carregando: false,
    fase: "pronto", // pronto | jogando | fim
    pontos: 0,
    bolas: 3,
    brilho: [0, 0, 0],
  };
}

export default function AppPinball() {
  const raiz = useRef(null);
  const canvas = useRef(null);
  const e = useRef(novoEstado());
  const [hud, setHud] = useState({ pontos: 0, bolas: 3, fase: "pronto" });

  const sincronizar = useCallback(() => {
    const s = e.current;
    setHud((h) => (h.pontos === s.pontos && h.bolas === s.bolas && h.fase === s.fase ? h : { pontos: s.pontos, bolas: s.bolas, fase: s.fase }));
  }, []);

  const lancar = useCallback(() => {
    const s = e.current;
    if (s.fase === "fim") { Object.assign(s, novoEstado()); sincronizar(); return; }
    if (s.fase === "pronto" && s.carregando) {
      s.bola.vy = -(7 + s.carga * 4.6);
      s.bola.vx = 0;
      s.fase = "jogando";
      sincronizar();
    }
    s.carregando = false;
    s.carga = 0;
  }, [sincronizar]);

  const tecla = useCallback((ev, abaixo) => {
    const s = e.current;
    const k = ev.key;
    let tratou = true;
    if (k === "z" || k === "Z" || k === "ArrowLeft") s.teclas.esq = abaixo;
    else if (k === "/" || k === "." || k === "ArrowRight") s.teclas.dir = abaixo;
    else if (k === " " || k === "Spacebar") {
      if (abaixo) { if (!ev.repeat) { if (s.fase === "fim") lancar(); else if (s.fase === "pronto") s.carregando = true; } }
      else lancar();
    } else tratou = false;
    if (tratou) ev.preventDefault();
  }, [lancar]);

  // Teclado: vale enquanto a janela do Pinball é a janela ativa (não depende de o foco estar no jogo).
  useEffect(() => {
    const ativa = () => raiz.current?.closest(".janela-xp")?.classList.contains("is-ativa");
    const aoBaixo = (ev) => { if (ativa()) tecla(ev, true); };
    const aoCima = (ev) => { if (ativa()) tecla(ev, false); };
    window.addEventListener("keydown", aoBaixo);
    window.addEventListener("keyup", aoCima);
    const t = setTimeout(() => raiz.current?.focus(), 150);
    return () => { window.removeEventListener("keydown", aoBaixo); window.removeEventListener("keyup", aoCima); clearTimeout(t); };
  }, [tecla]);

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.scale(dpr, dpr);
    let raf = 0;

    const colidir = (b, ax, ay, bx, by, rest, vs = [0, 0]) => {
      const [cx, cy] = ponto(b.x, b.y, ax, ay, bx, by);
      let nx = b.x - cx, ny = b.y - cy;
      const d = Math.hypot(nx, ny);
      if (d >= R || d === 0) return false;
      nx /= d; ny /= d;
      b.x += nx * (R - d); b.y += ny * (R - d);
      const vn = (b.vx - vs[0]) * nx + (b.vy - vs[1]) * ny;
      if (vn < 0) { b.vx -= (1 + rest) * vn * nx; b.vy -= (1 + rest) * vn * ny; }
      return true;
    };

    const ponta = (f, ang) => [f.px + f.lado * Math.cos(ang) * COMP_FLIPPER, f.py + Math.sin(ang) * COMP_FLIPPER];

    const passo = () => {
      const s = e.current;
      // flippers
      FLIPPERS.forEach((f) => {
        const alvo = s.teclas[f.id] ? ATIVO : REPOUSO;
        const ang = s.flip[f.id];
        const novo = ang + Math.sign(alvo - ang) * Math.min(VEL_FLIPPER, Math.abs(alvo - ang));
        s.omega[f.id] = novo - ang;
        s.flip[f.id] = novo;
      });
      if (s.carregando) s.carga = Math.min(1, s.carga + 0.02);
      s.brilho = s.brilho.map((v) => Math.max(0, v - 0.05));
      const b = s.bola;
      if (s.fase === "pronto") { b.x = LANCE.x; b.y = LANCE.y + s.carga * 22; b.vx = b.vy = 0; return; }
      if (s.fase !== "jogando") return;
      for (let i = 0; i < SUB; i++) {
        b.vy += GRAVIDADE / SUB;
        b.x += b.vx / SUB; b.y += b.vy / SUB;
        PAREDES.forEach(([[ax, ay], [bx, by]]) => colidir(b, ax, ay, bx, by, 0.45));
        BUMPERS.forEach((m, n) => {
          const dx = b.x - m.x, dy = b.y - m.y, d = Math.hypot(dx, dy);
          if (d < R + m.r && d > 0) {
            const nx = dx / d, ny = dy / d;
            b.x = m.x + nx * (R + m.r); b.y = m.y + ny * (R + m.r);
            const vn = b.vx * nx + b.vy * ny;
            if (vn < 0) { b.vx -= 2 * vn * nx; b.vy -= 2 * vn * ny; }
            b.vx += nx * 2.2; b.vy += ny * 2.2;
            s.pontos += 100; s.brilho[n] = 1; sincronizar();
          }
        });
        FLIPPERS.forEach((f) => {
          const ang = s.flip[f.id];
          const [tx, ty] = ponta(f, ang);
          const [cx, cy] = ponto(b.x, b.y, f.px, f.py, tx, ty);
          const w = s.omega[f.id] * -f.lado; // sentido do giro no plano
          const vs = [-w * (cy - f.py) * -1, w * (cx - f.px) * -1];
          colidir(b, f.px, f.py, tx, ty, 0.25, [vs[0], vs[1]]);
        });
        const v = Math.hypot(b.vx, b.vy);
        if (v > VMAX) { b.vx = (b.vx / v) * VMAX; b.vy = (b.vy / v) * VMAX; }
      }
      if (b.y > H + 20) {
        s.bolas -= 1;
        if (s.bolas <= 0) s.fase = "fim";
        else { s.fase = "pronto"; b.x = LANCE.x; b.y = LANCE.y; b.vx = b.vy = 0; }
        sincronizar();
      }
    };

    const desenhar = () => {
      const s = e.current;
      ctx.clearRect(0, 0, W, H);
      const fundo = ctx.createLinearGradient(0, 0, 0, H);
      fundo.addColorStop(0, "#0a1a4a"); fundo.addColorStop(1, "#050a24");
      ctx.fillStyle = fundo; ctx.fillRect(0, 0, W, H);
      // paredes
      ctx.strokeStyle = "#5aa9ff"; ctx.lineWidth = 3; ctx.lineCap = "round";
      PAREDES.forEach(([[ax, ay], [bx, by]]) => { ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); });
      // bumpers
      BUMPERS.forEach((m, n) => {
        ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fillStyle = s.brilho[n] > 0 ? "#fff3a6" : "#ffcc33"; ctx.fill();
        ctx.lineWidth = 4; ctx.strokeStyle = "#ff8a00"; ctx.stroke();
        ctx.beginPath(); ctx.arc(m.x, m.y, m.r - 10, 0, Math.PI * 2); ctx.fillStyle = "#ff5c02"; ctx.fill();
      });
      // flippers
      FLIPPERS.forEach((f) => {
        const [tx, ty] = ponta(f, s.flip[f.id]);
        ctx.strokeStyle = s.teclas[f.id] ? "#ffe066" : "#f5f7fb"; ctx.lineWidth = 12; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(f.px, f.py); ctx.lineTo(tx, ty); ctx.stroke();
      });
      // lançador
      ctx.fillStyle = "#8ea3c7"; ctx.fillRect(354, LANCE.y + R + s.carga * 22, 24, 6);
      ctx.strokeStyle = "#8ea3c7"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(366, LANCE.y + R + s.carga * 22 + 6); ctx.lineTo(366, 588); ctx.stroke();
      // bola
      if (s.fase !== "fim") {
        const b = s.bola;
        const g = ctx.createRadialGradient(b.x - 3, b.y - 3, 1, b.x, b.y, R);
        g.addColorStop(0, "#ffffff"); g.addColorStop(0.5, "#9fb4d6"); g.addColorStop(1, "#33466b");
        ctx.beginPath(); ctx.arc(b.x, b.y, R, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
      }
      // dados para teste e leitores de tela
      const el = raiz.current;
      if (el) {
        el.dataset.fase = s.fase;
        el.dataset.bolaY = String(Math.round(s.bola.y));
        el.dataset.bolaX = String(Math.round(s.bola.x));
        el.dataset.esq = s.teclas.esq ? "1" : "0";
        el.dataset.dir = s.teclas.dir ? "1" : "0";
        el.dataset.angEsq = s.flip.esq.toFixed(2);
      }
    };

    const loop = () => { passo(); desenhar(); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [sincronizar]);

  const segurar = (id) => ({
    onPointerDown: (ev) => { ev.preventDefault(); e.current.teclas[id] = true; },
    onPointerUp: () => { e.current.teclas[id] = false; },
    onPointerLeave: () => { e.current.teclas[id] = false; },
  });
  const mensagem = hud.fase === "fim" ? "Fim de jogo. Pressione Espaço para jogar de novo." : hud.fase === "pronto" ? "Segure Espaço e solte para lançar a bola." : "Use Z e / para os flippers.";

  return (
    <div
      ref={raiz}
      className="app-pinball"
      tabIndex={0}
      role="application"
      aria-label="Pinball. Z ou seta esquerda: flipper esquerdo. Barra ou seta direita: flipper direito. Espaço: lançar."
      onPointerDown={() => raiz.current?.focus()}
    >
      <div className="app-pinball-hud">
        <span>Pontos: <strong>{hud.pontos}</strong></span>
        <span>Bolas: <strong>{hud.bolas}</strong></span>
      </div>
      <canvas ref={canvas} className="app-pinball-mesa" style={{ aspectRatio: `${W} / ${H}` }} />
      <div className="app-pinball-controles">
        <button type="button" className="xp-button" {...segurar("esq")}>Z</button>
        <button type="button" className="xp-button" onPointerDown={(ev) => { ev.preventDefault(); if (e.current.fase === "pronto") e.current.carregando = true; else if (e.current.fase === "fim") lancar(); }} onPointerUp={lancar}>Espaço</button>
        <button type="button" className="xp-button" {...segurar("dir")}>/</button>
      </div>
      <p className="app-pinball-msg" aria-live="polite">{mensagem}</p>
    </div>
  );
}
