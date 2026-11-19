import { useEffect, useState } from "react";
import { ArrowRight, Bell, Bookmark, BookmarkPlus, Check, Home, Newspaper, PenLine, Search, Signal, Star, Users, Wifi, BatteryFull } from "lucide-react";
import { DESIGN, useDemoTela } from "./useDemoTela.js";
import "@fontsource/urbanist/latin-400.css";
import "@fontsource/urbanist/latin-500.css";
import "@fontsource/urbanist/latin-600.css";
import "@fontsource/urbanist/latin-700.css";
import "@fontsource/inter/latin-700.css";

// Tela Home do ANIMAE em código (tokens do app). Loop sem interação: o banner troca sozinho,
// o botão Adicionar é tocado, a tela rola até Amigos Online / Continue assistindo e volta.
const BANNERS = [
  { id: "dbz", art: "/assets/cases/animae-banner-dbz.webp", meta: ["Luta", "291 episódios", "9 temporadas", "12+"], desc: "Goku e seus amigos enfrentam ameaças intergalácticas em batalhas épicas que\nmarcaram a história dos animes" },
  { id: "naruto", art: "/assets/cases/animae-banner-naruto.webp", meta: ["Shounnen", "220 episódios", "9 temporadas", "12+"], desc: "Naruto sonha em se tornar Hokage enquanto enfrenta inimigos perigosos e descobre o poder dos laços que o fortalecem" },
  { id: "deathnote", art: "/assets/cases/animae-banner-deathnote.webp", meta: ["Thriller Psicológico", "37 episódios", "1 temporada", "14+"], desc: "Um estudante encontra um caderno capaz de matar e entra em um duelo de inteligência contra o maior detetive do mundo" },
  { id: "chihiro", art: "/assets/cases/animae-banner-chihiro.webp", meta: ["Fantasia", "2h 05m", "10+"], desc: "Chihiro fica presa em um mundo mágico cheio de espíritos e precisa encontrar coragem para salvar seus pais e voltar para casa" },
];
const AMIGOS = [
  { nome: "Marina", img: "/assets/cases/animae-av-marina.webp" },
  { nome: "Lucas", img: "/assets/cases/animae-av-lucas.webp" },
  { nome: "Ana", img: "/assets/cases/animae-av-ana.webp" },
  { nome: "Nayara", img: "/assets/cases/animae-av-nayara.webp" },
  { nome: "Pedro", img: "/assets/cases/animae-avatar.webp" },
];
const CONTINUE = [
  { title: "Attack on Titan", img: "/assets/cases/animae-banner-aot.webp", ep: 7, total: 25, pct: 28, prox: 8 },
  { title: "One Piece", img: "/assets/cases/animae-thumb-onepiece.webp", ep: 7, total: 1100, pct: 1, prox: 8 },
];
const EM_ALTA = [
  { nome: "Death Note", img: "/assets/cases/animae-banner-deathnote.webp", nota: "8.4", review: true },
  { nome: "Mob Psycho 100", img: "/assets/cases/animae-poster-mobpsycho.webp", nota: "8.4", review: false },
];
const CICLO = 23500;

export default function AnimaeHomeDemo() {
  const { root, screen, animar } = useDemoTela("--ad-scale");
  const [banner, setBanner] = useState(0);
  const [toque, setToque] = useState(false); // dedo no botão
  const [na, setNa] = useState(false); // anime adicionado
  const [rolou, setRolou] = useState(false);

  useEffect(() => {
    if (!animar) { setBanner(0); setToque(false); setNa(false); setRolou(false); return undefined; }
    const ids = [];
    const at = (ms, fn) => ids.push(setTimeout(fn, ms));
    const volta = () => {
      setBanner(0); setNa(false); setRolou(false); setToque(false);
      at(1200, () => setToque(true));
      at(1450, () => { setToque(false); setNa(true); });
      at(4400, () => { setBanner(1); setNa(false); });
      at(8000, () => setBanner(2));
      at(11600, () => setBanner(3));
      at(14200, () => setRolou(true));
      at(18400, () => setRolou(false));
      at(20000, () => { setBanner(0); setNa(false); });
      at(CICLO, volta);
    };
    volta();
    return () => ids.forEach(clearTimeout);
  }, [animar]);

  const b = BANNERS[banner];
  return (
    <div ref={root} className="ad-root ah-root" role="img" aria-label="Demonstração animada da tela Home do ANIMAE: o banner troca sozinho, o anime é adicionado à lista e a tela rola até Amigos Online">
      <div ref={screen} className="ad-screen" style={{ width: DESIGN.width, height: DESIGN.height }} aria-hidden="true">
        <div className="ad-status">
          <span>9:41</span>
          <span className="ad-status-icons"><Signal className="ad-i18" /><Wifi className="ad-i18" /><BatteryFull className="ad-i18" /></span>
        </div>
        <header className="ah-header">
          <img className="ah-logo" src="/assets/cases/animae-logo-app.webp" alt="" width="144" height="41" draggable="false" />
          <span className="ah-icons"><Search className="ad-i28" strokeWidth={1.75} /><Bell className="ad-i28" strokeWidth={1.75} /></span>
        </header>
        <div className={`ah-scroll ${rolou ? "is-rolou" : ""}`}>
          <section className="ah-hero">
            <div className="ah-slides">
              {BANNERS.map((s, i) => (
                <div key={s.id} className={`ah-slide ${i === banner ? "is-on" : ""}`}>
                  <div className="ah-art"><img src={s.art} alt="" width="430" height="290" draggable="false" /><span className="ah-fade" />{s.titulo && <span className="ah-titulo">{s.titulo}</span>}</div>
                  <p className="ah-meta">{s.meta.map((m, k) => <span key={m}>{k > 0 && <i className="ah-sep" />}{m}</span>)}</p>
                  <p className="ah-desc">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="ah-botoes">
              <span className={`ah-add ${toque ? "is-press" : ""} ${na ? "is-on" : ""}`}>
                <span className="ah-add-a"><BookmarkPlus size={24} />Adicionar</span>
                <span className="ah-add-b"><Check className="ah-check" strokeWidth={2.5} />Na lista</span>
              </span>
              <span className="ah-onde">Onde assistir</span>
            </div>
            <div className="ah-dots">{BANNERS.map((s, i) => <span key={s.id} className={i === banner ? "is-on" : ""} />)}</div>
          </section>
          <div className="ah-conteudo">
            <section className="ah-secao">
              <div className="ah-secao-topo"><p className="ah-h2">Amigos Online</p><span className="ah-link">Ver feed</span></div>
              <div className="ah-amigos">
                {AMIGOS.map((a, i) => (
                  <div className="ah-amigo" key={a.nome}>
                    <span className={`ah-ring ${i === 0 ? "is-live" : ""}`}><img src={a.img} alt="" width="60" height="60" draggable="false" /></span>
                    <span className="ah-nome">{a.nome}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className="ah-secao">
              <div className="ah-secao-topo"><p className="ah-h2">Continue de onde parou</p><span className="ah-link">Ver todos</span></div>
              <div className="ah-fila">
                {CONTINUE.map((c) => (
                  <div className="ah-cont" key={c.title}>
                    <div className="ah-cont-media"><img src={c.img} alt="" width="320" height="124" draggable="false" /><p className="ah-cont-titulo">{c.title}</p></div>
                    <div className="ah-cont-corpo">
                      <div className="ah-cont-prog">
                        <div className="ah-cont-lab"><span>{`EP ${c.ep} de ${c.total}`}</span><span>{c.pct}%</span></div>
                        <div className="ah-cont-barra"><i style={{ width: 81 }} /></div>
                      </div>
                      <span className="ah-cont-btn">{`Ver EP ${c.prox}`}<ArrowRight className="fd-i20" /></span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section className="ah-secao">
              <div className="ah-secao-topo"><p className="ah-h2">Em alta entre amigos</p><span className="ah-link">Ver todos</span></div>
              <div className="ah-fila">
                {EM_ALTA.map((c) => (
                  <div className="ah-poster" key={c.nome}>
                    <div className="ah-poster-img"><img src={c.img} alt="" width="160" height="232" draggable="false" /><span className="ah-nota"><Star />{c.nota}</span></div>
                    <p className="ah-poster-nome">{c.nome}</p>
                    <p className="ah-poster-info"><Users />1 amigo adicionou</p>
                    {c.review && <p className="ah-poster-info is-rev"><PenLine />1 fez review</p>}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
        <nav className="ad-nav">
          <span className="ad-nav-item is-on"><Home size={24} />Home</span>
          <span className="ad-nav-item"><Newspaper size={24} />Feed</span>
          <span className="ad-nav-item"><Bookmark className="ad-i28" />Minha Lista</span>
          <span className="ad-nav-item"><img src="/assets/cases/animae-avatar.webp" alt="" width="28" height="28" className="ad-avatar" />Perfil</span>
        </nav>
      </div>
    </div>
  );
}
