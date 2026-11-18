import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, Bell, Bookmark, Check, Ellipsis, Home, Newspaper, Signal, Wifi, BatteryFull } from "lucide-react";
import "@fontsource/urbanist/latin-400.css";
import "@fontsource/urbanist/latin-500.css";
import "@fontsource/urbanist/latin-600.css";
import "@fontsource/urbanist/latin-700.css";
import "@fontsource/inter/latin-700.css";

// Tela "Minha lista" do ANIMAE refeita em código, com os tokens do design system do app
// (Urbanist, neutros 0-100, laranja #ff5c02, raios 10/20/999). Os números são ilustrativos do layout.
// A animação é só React + CSS, em looping (sem interação): marca o episódio, a barra enche e o anime vai para Concluídos.
const DESIGN = { width: 430, height: 932 };
const ITEMS = [
  { title: "Attack on Titan", thumb: "/assets/cases/animae-thumb-aot.webp", ep: 14, total: 25, last: "Último: E14 · há 2 dias" },
  { title: "Demon Slayer", thumb: "/assets/cases/animae-thumb-demon.webp", ep: 8, total: 26, last: "Último: E8 · há 5 dias" },
  { title: "One Piece", thumb: "/assets/cases/animae-thumb-onepiece.webp", ep: 1050, total: 1100, last: "Último: E1050 · há 1 dia" },
];

export default function AnimaeListaDemo() {
  const root = useRef(null);
  const screen = useRef(null);
  const [fase, setFase] = useState(0); // 0 parado, 1 toque, 2 barra enchendo, 3 concluído, 4 saindo da lista
  const [ep, setEp] = useState(ITEMS[0].ep);
  const [ciclo, setCiclo] = useState(0);
  const [visivel, setVisivel] = useState(false);

  // Escala a tela de 430 px para a largura do container.
  useLayoutEffect(() => {
    const el = root.current;
    const fit = () => {
      const largura = el.clientWidth || el.getBoundingClientRect().width;
      if (largura > 0) screen.current?.style.setProperty("--ad-scale", String(largura / DESIGN.width));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    window.addEventListener("load", fit);
    return () => { ro.disconnect(); window.removeEventListener("load", fit); };
  }, []);

  // O looping só corre enquanto a tela está visível.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting), { threshold: 0.4 });
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visivel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const ids = [];
    const at = (ms, fn) => ids.push(setTimeout(fn, ms));
    const item = ITEMS[0];
    const volta = () => {
      setCiclo((c) => c + 1); setFase(0); setEp(item.ep);
      at(1200, () => setFase(1));
      at(1400, () => {
        setFase(2);
        const t0 = performance.now();
        const iv = setInterval(() => {
          const k = Math.min(1, (performance.now() - t0) / 1100);
          setEp(Math.round(item.ep + (item.total - item.ep) * k));
          if (k >= 1) clearInterval(iv);
        }, 50);
        ids.push(iv);
      });
      at(2600, () => setFase(3));
      at(3400, () => setFase(4));
      at(6200, volta);
    };
    volta();
    return () => ids.forEach((id) => { clearTimeout(id); clearInterval(id); });
  }, [visivel]);

  const fora = fase >= 4;
  return (
    <div ref={root} className="ad-root" role="img" aria-label="Demonstração animada da tela Minha Lista do ANIMAE: ao marcar o episódio, a barra enche e o anime vai para Concluídos">
      <div ref={screen} className="ad-screen" style={{ width: DESIGN.width, height: DESIGN.height }} aria-hidden="true">
        <div className="ad-status">
          <span>9:41</span>
          <span className="ad-status-icons"><Signal className="ad-i18" /><Wifi className="ad-i18" /><BatteryFull className="ad-i18" /></span>
        </div>
        <div className="ad-flow">
          <header className="ad-header">
            <div className="ad-header-row">
              <span className="ad-round"><ArrowLeft size={24} /></span>
              <span className="ad-round"><Bell className="ad-i18" /></span>
            </div>
            <div className="ad-title">
              <p className="ad-h1">Minha Lista</p>
              <p className="ad-sub">47 animes · 890h</p>
            </div>
          </header>
          <div className="ad-tabs">
            <span className="ad-pill is-on">Assistindo <span key={fora ? "a" : "b"} className={`ad-count ${fora ? "is-pop" : ""}`}>{fora ? 11 : 12}</span></span>
            <span className="ad-pill">Quero ver <span className="ad-count">28</span></span>
            <span className="ad-pill">Concluídos <span key={fora ? "c" : "d"} className={`ad-count ${fora ? "is-pop" : ""}`}>{fora ? 6 : 5}</span></span>
          </div>
          <div className="ad-list">
            {ITEMS.map((item, i) => {
              const anima = i === 0;
              const largura = anima && fase >= 2 ? 100 : (item.ep / item.total) * 100;
              return (
                <div className={`ad-slot ${anima && fora ? "is-out" : ""}`} key={`${item.title}-${anima ? ciclo : 0}`}>
                  <div className="ad-slot-in">
                    <div className={`ad-card ${anima && fase === 3 ? "is-zap" : ""}`}>
                      <img className="ad-thumb" src={item.thumb} alt="" width="64" height="64" draggable="false" />
                      <div className="ad-body">
                        <div className="ad-top">
                          <div className="ad-line"><span className="ad-name">{item.title}</span><Ellipsis className="ad-dots ad-i26" /></div>
                          <p className="ad-ep">{`EP ${anima ? ep : item.ep} de ${item.total}`}</p>
                        </div>
                        <div className="ad-bottom">
                          <div className="ad-track"><span className="ad-fill" style={{ width: `${largura}%` }} /></div>
                          <div className="ad-foot">
                            <span className="ad-last">{item.last}</span>
                            <span className={`ad-mark ${anima && fase === 1 ? "is-press" : ""} ${anima && fase >= 3 ? "is-done" : ""}`}>
                              <span className="ad-mark-a">Marcar EP {item.ep + 1}</span>
                              <span className="ad-mark-b"><Check size={16} strokeWidth={3} />Concluído</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <nav className="ad-nav">
          <span className="ad-nav-item"><Home size={24} />Home</span>
          <span className="ad-nav-item"><Newspaper size={24} />Feed</span>
          <span className="ad-nav-item is-on"><Bookmark className="ad-i28" />Minha Lista</span>
          <span className="ad-nav-item"><img src="/assets/cases/animae-avatar.webp" alt="" width="28" height="28" className="ad-avatar" />Perfil</span>
        </nav>
      </div>
    </div>
  );
}
