import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowLeft, Bell, Bookmark, Check, Ellipsis, Home, Newspaper, Signal, Wifi, BatteryFull } from "lucide-react";
import "@fontsource/urbanist/latin-400.css";
import "@fontsource/urbanist/latin-500.css";
import "@fontsource/urbanist/latin-600.css";
import "@fontsource/urbanist/latin-700.css";
import "@fontsource/inter/latin-700.css";

// Tela "Minha lista" do ANIMAE refeita em código, com os tokens do design system do app
// (Urbanist, neutros 0-100, laranja #ff5c02, raios 10/20/999). Os números são ilustrativos do layout.
const DESIGN = { width: 430, height: 932 };
const ITEMS = [
  { title: "Attack on Titan", thumb: "/assets/cases/animae-thumb-aot.webp", ep: 14, total: 25, last: "Último: E14 · há 2 dias" },
  { title: "Demon Slayer", thumb: "/assets/cases/animae-thumb-demon.webp", ep: 8, total: 26, last: "Último: E8 · há 5 dias" },
  { title: "One Piece", thumb: "/assets/cases/animae-thumb-onepiece.webp", ep: 1050, total: 1100, last: "Último: E1050 · há 1 dia" },
];

export default function AnimaeListaDemo() {
  const root = useRef(null);
  const screen = useRef(null);
  const state = useRef({ busy: false, interacted: false, visible: false, timers: [], tls: [] });

  // Escala a tela de 430 px para a largura do container.
  useLayoutEffect(() => {
    const el = root.current;
    const fit = () => screen.current?.style.setProperty("--ad-scale", String(el.clientWidth / DESIGN.width));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = root.current;
    const s = state.current;
    const q = (sel, ctx = el) => ctx.querySelector(sel);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const later = (fn, ms) => { const t = setTimeout(fn, ms); s.timers.push(t); };
    const pop = (node) => !reduced && gsap.fromTo(node, { scale: 1.4 }, { scale: 1, duration: 0.5, ease: "back.out(3)" });

    const reset = () => {
      ITEMS.forEach((item, i) => {
        const slot = q(`[data-slot="${i}"]`);
        gsap.set(slot, { clearProps: "height,paddingBottom,opacity,y" });
        gsap.set(q(`[data-bar="${i}"]`), { width: `${(item.ep / item.total) * 100}%` });
        q(`[data-ep="${i}"]`).textContent = `EP ${item.ep} de ${item.total}`;
        q(`[data-mark="${i}"]`).classList.remove("is-done");
        q(`[data-card="${i}"]`).classList.remove("is-zap");
      });
      q('[data-count="watching"]').textContent = "12";
      q('[data-count="done"]').textContent = "5";
      if (!reduced) gsap.fromTo(el.querySelectorAll("[data-slot]"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: "power2.out", clearProps: "opacity,y" });
    };

    const run = (i) => {
      if (s.busy) return;
      s.busy = true;
      const item = ITEMS[i];
      const slot = q(`[data-slot="${i}"]`);
      const mark = q(`[data-mark="${i}"]`);
      const bar = q(`[data-bar="${i}"]`);
      const epText = q(`[data-ep="${i}"]`);
      const counter = { n: item.ep };
      const tl = gsap.timeline({ onComplete: () => {
        later(() => { reset(); s.busy = false; if (!s.interacted && s.visible) later(() => run(0), 1600); }, 2200);
      } });
      if (reduced) tl.timeScale(40);
      s.tls.push(tl);
      tl.to(mark, { scale: 0.94, duration: 0.1, ease: "power2.out" })
        .to(mark, { scale: 1, duration: 0.3, ease: "back.out(3)" })
        .to(bar, { width: "100%", duration: 1.1, ease: "power2.inOut" }, "<")
        .to(counter, { n: item.total, duration: 1.1, ease: "power2.inOut", onUpdate: () => { epText.textContent = `EP ${Math.round(counter.n)} de ${item.total}`; } }, "<")
        .add(() => { mark.classList.add("is-done"); q(`[data-card="${i}"]`).classList.add("is-zap"); pop(q(`[data-check="${i}"]`)); }, "-=0.2")
        .add(() => { q(`[data-card="${i}"]`).classList.remove("is-zap"); }, "+=0.5")
        .to(slot, { opacity: 0, y: -24, duration: 0.35, ease: "power2.in" }, "+=0.2")
        .to(slot, { height: 0, paddingBottom: 0, duration: 0.55, ease: "power3.inOut" }, "-=0.05")
        .add(() => {
          q('[data-count="watching"]').textContent = "11";
          q('[data-count="done"]').textContent = "6";
          pop(q('[data-count="watching"]'));
          pop(q('[data-count="done"]'));
        }, "-=0.45");
    };

    const io = new IntersectionObserver(([entry]) => {
      s.visible = entry.isIntersecting;
      if (s.visible && !s.busy && !s.interacted && !reduced) later(() => { if (s.visible && !s.busy && !s.interacted) run(0); }, 1200);
    }, { threshold: 0.6 });
    io.observe(el);

    const onClick = (e) => {
      const btn = e.target.closest("[data-mark]");
      if (!btn) return;
      s.interacted = true;
      run(Number(btn.dataset.mark));
    };
    el.addEventListener("click", onClick);
    return () => {
      io.disconnect();
      el.removeEventListener("click", onClick);
      s.timers.forEach(clearTimeout);
      s.tls.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={root} className="ad-root" role="group" aria-label="Demonstração da tela Minha Lista do ANIMAE: marque o episódio e o anime vai para Concluídos">
      <div ref={screen} className="ad-screen" style={{ width: DESIGN.width, height: DESIGN.height }}>
        <div className="ad-status" aria-hidden="true">
          <span>9:41</span>
          <span className="ad-status-icons"><Signal className="ad-i18" /><Wifi className="ad-i18" /><BatteryFull className="ad-i18" /></span>
        </div>
        <div className="ad-flow">
          <header className="ad-header">
            <div className="ad-header-row">
              <span className="ad-round" aria-hidden="true"><ArrowLeft size={24} /></span>
              <span className="ad-round" aria-hidden="true"><Bell className="ad-i18" /></span>
            </div>
            <div className="ad-title">
              <p className="ad-h1">Minha Lista</p>
              <p className="ad-sub">47 animes · 890h</p>
            </div>
          </header>
          <div className="ad-tabs">
            <span className="ad-pill is-on">Assistindo <span className="ad-count" data-count="watching">12</span></span>
            <span className="ad-pill">Quero ver <span className="ad-count">28</span></span>
            <span className="ad-pill">Concluídos <span className="ad-count" data-count="done">5</span></span>
          </div>
          <div className="ad-list">
            {ITEMS.map((item, i) => (
              <div className="ad-slot" data-slot={i} key={item.title}>
                <div className="ad-card" data-card={i}>
                  <img className="ad-thumb" src={item.thumb} alt="" width="64" height="64" draggable="false" />
                  <div className="ad-body">
                    <div className="ad-top">
                    <div className="ad-line"><span className="ad-name">{item.title}</span><Ellipsis aria-hidden="true" className="ad-dots ad-i26" /></div>
                    <p className="ad-ep" data-ep={i}>{`EP ${item.ep} de ${item.total}`}</p>
                    </div>
                    <div className="ad-bottom">
                    <div className="ad-track"><span className="ad-fill" data-bar={i} style={{ width: `${(item.ep / item.total) * 100}%` }} /></div>
                    <div className="ad-foot">
                      <span className="ad-last">{item.last}</span>
                      <button type="button" className="ad-mark" data-mark={i} aria-label={`Marcar episódio de ${item.title}`}>
                        <span className="ad-mark-a">Marcar EP {item.ep + 1}</span>
                        <span className="ad-mark-b" data-check={i}><Check size={16} strokeWidth={3} aria-hidden="true" />Concluído</span>
                      </button>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <nav className="ad-nav" aria-hidden="true">
          <span className="ad-nav-item"><Home size={24} />Home</span>
          <span className="ad-nav-item"><Newspaper size={24} />Feed</span>
          <span className="ad-nav-item is-on"><Bookmark className="ad-i28" />Minha Lista</span>
          <span className="ad-nav-item"><img src="/assets/cases/animae-avatar.webp" alt="" width="28" height="28" className="ad-avatar" />Perfil</span>
        </nav>
      </div>
    </div>
  );
}
