import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const MIN_L = 560;
const MIN_A = 384;
const BARRA = 30; // mesma altura de --barra-altura
const COMPACTO = 760;

const limitar = (v, min, max) => Math.max(min, Math.min(max, v));

// Janela estilo Windows XP (Figma: Control Panel 135:2065): pode ser movida pela
// barra de título, redimensionada pelas bordas/canto e maximizada.
export default function JanelaXP({
  id,
  titulo,
  icone,
  ativa = true,
  onFechar,
  onMinimizar,
  onFocar,
  statusDireita,
  statusEsquerda,
  largura = 1000,
  altura = 640,
  cascata = 0,
  oculta = false,
  minLargura = MIN_L,
  minAltura = MIN_A,
  alinhar = "centro",
  reserva = 304,
  centroVertical = false,
  topo = 32,
  semStatus = false,
  classe = "",
  children,
}) {
  const raiz = useRef(null);
  const [caixa, setCaixa] = useState(null);
  const [maximizada, setMaximizada] = useState(false);
  const [compacta, setCompacta] = useState(false);

  const area = useCallback(() => {
    const pai = raiz.current?.offsetParent || document.body;
    return { w: pai.clientWidth, h: window.innerHeight - BARRA };
  }, []);

  useLayoutEffect(() => {
    const { w, h } = area();
    const lar = limitar(Math.min(largura, w - (alinhar === "centro" ? reserva : 32)), minLargura, w);
    const alt = limitar(Math.min(altura, h - 64), minAltura, h);
    const desl = cascata * 32;
    const xBase =
      alinhar === "direita" ? w - lar - 24 : alinhar === "esquerda" ? 152 : Math.round((w - lar) / 2);
    setCaixa({
      x: limitar(xBase + desl, 0, Math.max(0, w - lar)),
      y: centroVertical ? Math.max(0, Math.round((window.innerHeight - alt) / 2)) : limitar(topo + desl, 0, Math.max(0, h - alt)),
      w: lar,
      h: alt,
    });
    setCompacta(w < COMPACTO);
  }, [area]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const ajustar = () => {
      const { w, h } = area();
      setCompacta(w < COMPACTO);
      setCaixa((c) => {
        if (!c) return c;
        const largura = Math.min(c.w, w);
        const altura = Math.min(c.h, h);
        return {
          w: largura,
          h: altura,
          x: limitar(c.x, 0, Math.max(0, w - largura)),
          y: limitar(c.y, 0, Math.max(0, h - altura)),
        };
      });
    };
    window.addEventListener("resize", ajustar);
    return () => window.removeEventListener("resize", ajustar);
  }, [area]);

  const arrastar = (e) => {
    if (maximizada || compacta || e.button !== 0) return;
    if (e.target.closest("button")) return;
    onFocar?.();
    const alvo = e.currentTarget;
    alvo.setPointerCapture(e.pointerId);
    const ini = { px: e.clientX, py: e.clientY, ...caixa };
    const mover = (ev) => {
      const { w, h } = area();
      setCaixa((c) => ({
        ...c,
        x: limitar(ini.x + ev.clientX - ini.px, -(c.w - 120), w - 120),
        y: limitar(ini.y + ev.clientY - ini.py, 0, h - 32),
      }));
    };
    const soltar = () => {
      alvo.removeEventListener("pointermove", mover);
      alvo.removeEventListener("pointerup", soltar);
      alvo.removeEventListener("pointercancel", soltar);
    };
    alvo.addEventListener("pointermove", mover);
    alvo.addEventListener("pointerup", soltar);
    alvo.addEventListener("pointercancel", soltar);
  };

  const redimensionar = (dir) => (e) => {
    if (maximizada || compacta || e.button !== 0) return;
    e.preventDefault();
    onFocar?.();
    const alvo = e.currentTarget;
    alvo.setPointerCapture(e.pointerId);
    const ini = { px: e.clientX, py: e.clientY, ...caixa };
    const mover = (ev) => {
      const { w: aw, h: ah } = area();
      const dx = ev.clientX - ini.px;
      const dy = ev.clientY - ini.py;
      let { x, y, w, h } = ini;
      if (dir.includes("e")) w = limitar(ini.w + dx, minLargura, aw - ini.x);
      if (dir.includes("s")) h = limitar(ini.h + dy, minAltura, ah - ini.y);
      if (dir.includes("w")) {
        w = limitar(ini.w - dx, minLargura, ini.x + ini.w);
        x = ini.x + ini.w - w;
      }
      if (dir.includes("n")) {
        h = limitar(ini.h - dy, minAltura, ini.y + ini.h);
        y = ini.y + ini.h - h;
      }
      setCaixa({ x, y, w, h });
    };
    const soltar = () => {
      alvo.removeEventListener("pointermove", mover);
      alvo.removeEventListener("pointerup", soltar);
      alvo.removeEventListener("pointercancel", soltar);
    };
    alvo.addEventListener("pointermove", mover);
    alvo.addEventListener("pointerup", soltar);
    alvo.addEventListener("pointercancel", soltar);
  };

  // Teclado: setas movem a janela (a partir da barra de título); Shift+setas redimensiona.
  const teclado = (e) => {
    if (maximizada || compacta) return;
    const passo = e.shiftKey ? 16 : 16;
    const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (!d) return;
    e.preventDefault();
    const { w: aw, h: ah } = area();
    setCaixa((c) =>
      e.shiftKey
        ? {
            ...c,
            w: limitar(c.w + d[0] * passo, minLargura, aw - c.x),
            h: limitar(c.h + d[1] * passo, minAltura, ah - c.y),
          }
        : {
            ...c,
            x: limitar(c.x + d[0] * passo, 0, aw - c.w),
            y: limitar(c.y + d[1] * passo, 0, ah - c.h),
          },
    );
  };

  const cheia = maximizada || compacta;
  const estilo = caixa
    ? cheia
      ? { left: 0, top: 0, width: "100%", height: `calc(100svh - ${BARRA}px)` }
      : { left: caixa.x, top: caixa.y, width: caixa.w, height: caixa.h }
    : { visibility: "hidden" };
  if (oculta) estilo.display = "none";

  return (
    <section
      ref={raiz}
      className={`janela-xp ${classe} ${ativa ? "is-ativa" : ""} ${cheia ? "is-cheia" : ""}`}
      style={estilo}
      aria-labelledby={`${id}-title`}
      onPointerDown={onFocar}
    >
      <div
        className="janela-xp-titulo"
        onPointerDown={arrastar}
        onDoubleClick={() => !compacta && setMaximizada((m) => !m)}
      >
        <div className="janela-xp-titulo-esq">
          <img src={icone} alt="" width="16" height="16" draggable="false" />
          <h2
            id={`${id}-title`}
            tabIndex={-1}
            onKeyDown={teclado}
            title="Setas movem a janela; Shift + setas mudam o tamanho"
          >
            {titulo}
          </h2>
        </div>
        <div className="janela-xp-controles">
          {onMinimizar && (
            <button
              type="button"
              className="janela-xp-btn"
              onClick={onMinimizar}
              aria-label={`Minimizar ${titulo}`}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
                <rect x="1" y="9" width="7" height="3" rx="1" fill="#fff" />
              </svg>
            </button>
          )}
          {!compacta && (
            <button
              type="button"
              className="janela-xp-btn"
              onClick={() => setMaximizada((m) => !m)}
              aria-label={`${maximizada ? "Restaurar" : "Maximizar"} ${titulo}`}
              aria-pressed={maximizada}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
                {maximizada ? (
                  <>
                    <rect x="3.5" y="1.5" width="8" height="7" fill="none" stroke="#fff" strokeWidth="1.5" />
                    <rect x="1.5" y="4.5" width="8" height="7" fill="#2a5bd7" stroke="#fff" strokeWidth="1.5" />
                  </>
                ) : (
                  <rect x="1.5" y="1.5" width="10" height="10" fill="none" stroke="#fff" strokeWidth="1.5" />
                )}
                {!maximizada && <rect x="1" y="1" width="11" height="3" fill="#fff" />}
              </svg>
            </button>
          )}
          {onFechar && (
            <button
              type="button"
              className="janela-xp-btn janela-xp-fechar"
              onClick={onFechar}
              aria-label={`Fechar ${titulo}`}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
                <path d="M2 2 L11 11 M11 2 L2 11" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="janela-xp-miolo">{children}</div>
      {!semStatus && (
        <div className="janela-xp-status">
          <span className="janela-xp-status-texto">{statusEsquerda}</span>
          {statusDireita}
        </div>
      )}
      {!cheia && (
        <>
          <span className="janela-xp-alca e" onPointerDown={redimensionar("e")} />
          <span className="janela-xp-alca w" onPointerDown={redimensionar("w")} />
          <span className="janela-xp-alca s" onPointerDown={redimensionar("s")} />
          <span className="janela-xp-alca n" onPointerDown={redimensionar("n")} />
          <span className="janela-xp-alca se" onPointerDown={redimensionar("se")} />
          <span className="janela-xp-alca sw" onPointerDown={redimensionar("sw")} />
          <span className="janela-xp-alca ne" onPointerDown={redimensionar("ne")} />
          <span className="janela-xp-alca nw" onPointerDown={redimensionar("nw")} />
        </>
      )}
    </section>
  );
}
