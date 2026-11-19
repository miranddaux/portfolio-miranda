import { useEffect, useState } from "react";
import { ArrowLeft, Bell, Bookmark, Heart, Home, MessageCircleMore, Newspaper, Send, Signal, ThumbsUp, Wifi, BatteryFull, X } from "lucide-react";
import { DESIGN, useDemoTela } from "./useDemoTela.js";
import "@fontsource/urbanist/latin-400.css";
import "@fontsource/urbanist/latin-500.css";
import "@fontsource/urbanist/latin-600.css";
import "@fontsource/urbanist/latin-700.css";
import "@fontsource/inter/latin-700.css";

// Feed > Amigos do ANIMAE em código (tokens do app). Loop sem interação: a tela rola, o usuário curte,
// toca no ícone de comentário, a folha sobe, ele digita e envia, e fecha. Textos de exemplo, não são dados reais.
const AV = { marina: "/assets/cases/animae-av-marina.webp", lucas: "/assets/cases/animae-av-lucas.webp", ana: "/assets/cases/animae-av-ana.webp", nayara: "/assets/cases/animae-av-nayara.webp", eu: "/assets/cases/animae-avatar.webp" };
const AMIGOS = [["Marina", AV.marina], ["Lucas", AV.lucas], ["Ana", AV.ana], ["Nayara", AV.nayara], ["Pedro", AV.eu]];
const DIGITAR = "Esse final de temporada vai ser insano!";
const CICLO = 15200;

const TAGS_ACAO = [["Ação", "#ff9f2a"], ["História", "#3c7bff"]];
const TAGS_SLICE = [["Slice of Life", "#32d27f"], ["Drama", "#ff4f4f"]];

function Cartao({ art, autor, titulo, hora, ep, anime, tags, acoes }) {
  return (
    <article className="fd-card">
      <div className="fd-art">
        <img src={art} alt="" width="390" height="220" draggable="false" />
        <span className="fd-tags">{tags.map(([t, c]) => <span key={t} className="fd-tag" style={{ background: c }}>{t}</span>)}</span>
      </div>
      <span className="fd-autor-wrap"><img src={autor} alt="" width="48" height="48" draggable="false" /></span>
      <div className="fd-corpo">
        <p className="fd-titulo">{titulo}</p>
        <p className="fd-meta">{hora}<i className="fd-sep" />{ep}</p>
        <p className="fd-anime">{anime}</p>
      </div>
      <div className="fd-acoes">{acoes}</div>
    </article>
  );
}

function Coment({ nome, av, hora, texto, curtidas = 3, children }) {
  return (
    <div className="fd-c">
      <img className="fd-c-av" src={av} alt="" width="36" height="36" draggable="false" />
      <div className="fd-c-corpo">
        <p className="fd-c-nome"><b>{nome}</b><span>{hora}</span></p>
        <p className="fd-c-texto">{texto}</p>
        <p className="fd-c-acoes"><span><Heart className="fd-i16" />{curtidas}</span><span>Responder</span></p>
        {children && <div className="fd-rep">{children}</div>}
      </div>
    </div>
  );
}

export default function AnimaeFeedDemo() {
  const { root, screen, animar } = useDemoTela("--ad-scale");
  const [rolou, setRolou] = useState(false);
  const [curtiu, setCurtiu] = useState(false);
  const [tocaCom, setTocaCom] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [foco, setFoco] = useState(false);
  const [texto, setTexto] = useState("");
  const [pressSend, setPressSend] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [listaRola, setListaRola] = useState(false);
  const [pressX, setPressX] = useState(false);
  const [nCom, setNCom] = useState(2);

  useEffect(() => {
    const zera = () => { setRolou(false); setCurtiu(false); setTocaCom(false); setSheet(false); setFoco(false); setTexto(""); setPressSend(false); setEnviado(false); setListaRola(false); setPressX(false); setNCom(2); };
    if (!animar) { zera(); return undefined; }
    const ids = [];
    const at = (ms, fn) => ids.push(setTimeout(fn, ms));
    const volta = () => {
      zera();
      at(900, () => setRolou(true));
      at(3100, () => setRolou(false));
      at(4200, () => setCurtiu(true));
      at(5600, () => setTocaCom(true));
      at(5900, () => { setTocaCom(false); setSheet(true); });
      at(7200, () => setFoco(true));
      for (let i = 1; i <= DIGITAR.length; i++) at(7500 + i * 55, () => setTexto(DIGITAR.slice(0, i)));
      at(9900, () => setPressSend(true));
      at(10100, () => { setPressSend(false); setTexto(""); setFoco(false); setEnviado(true); });
      at(10700, () => setListaRola(true));
      at(12500, () => setPressX(true));
      at(12700, () => { setPressX(false); setSheet(false); setNCom(3); });
      at(CICLO, volta);
    };
    volta();
    return () => ids.forEach(clearTimeout);
  }, [animar]);

  return (
    <div ref={root} className="ad-root fd-root" role="img" aria-label="Demonstração animada da tela Feed de amigos do ANIMAE: a tela rola, o usuário curte, abre os comentários, digita e envia uma resposta">
      <div ref={screen} className="ad-screen" style={{ width: DESIGN.width, height: DESIGN.height }} aria-hidden="true">
        <div className="ad-status">
          <span>9:41</span>
          <span className="ad-status-icons"><Signal className="ad-i18" /><Wifi className="ad-i18" /><BatteryFull className="ad-i18" /></span>
        </div>
        <div className={`fd-scroll ${rolou ? "is-rolou" : ""}`}>
          <div className="fd-topo">
            <div className="ad-header-row"><span className="ad-round"><ArrowLeft size={24} /></span><span className="fd-sino"><Bell className="ad-i18" /></span></div>
            <p className="fd-h1">Feed</p>
          </div>
          <div className="fd-tabs"><span className="is-on">Amigos</span><span>Comunidade</span></div>
          <div className="ah-amigos fd-amigos">
            {AMIGOS.map(([nome, img]) => (
              <div className="ah-amigo" key={nome}><span className="ah-ring"><img src={img} alt="" width="60" height="60" draggable="false" /></span><span className="ah-nome">{nome}</span></div>
            ))}
          </div>
          <div className="fd-cards">
            <Cartao art="/assets/cases/animae-banner-aot.webp" autor={AV.marina} titulo="Marina concluiu AOT" hora="1h atrás" ep="EP 14" anime="Attack on Titan" tags={TAGS_ACAO}
              acoes={<>
                <span className={`fd-acao ${curtiu ? "is-on" : ""}`}><ThumbsUp size={16} /><b key={curtiu ? "s" : "n"} className={curtiu ? "is-pop" : ""}>{curtiu ? 6 : 5}</b></span>
                <span className={`fd-acao ${tocaCom ? "is-toque" : ""}`}><MessageCircleMore size={16} /><b key={nCom} className={nCom === 3 ? "is-pop" : ""}>{nCom}</b></span>
              </>} />
            <Cartao art="/assets/cases/animae-banner-chihiro.webp" autor={AV.nayara} titulo="Nayara adicionou Frieren à lista" hora="4h atrás" ep="Quero assistir" anime="Frieren" tags={TAGS_SLICE}
              acoes={<><span className="fd-acao"><ThumbsUp size={16} /><b>12</b></span><span className="fd-acao"><MessageCircleMore size={16} /><b>8</b></span></>} />
            <div className="fd-conv">
              <p className="fd-titulo">Você e Ana têm 8 animes em comum</p>
              <div className="fd-conv-linha">
                <span className="fd-conv-av"><img src={AV.ana} alt="" width="40" height="40" draggable="false" /><img src={AV.eu} alt="" width="40" height="40" draggable="false" /></span>
                <span className="fd-seguir">Seguir</span>
              </div>
            </div>
            <Cartao art="/assets/cases/animae-banner-naruto.webp" autor={AV.lucas} titulo="Lucas avaliou Vinland Saga" hora="2h atrás" ep="EP 14" anime="Vinland Saga" tags={TAGS_ACAO}
              acoes={<><span className="fd-acao"><ThumbsUp size={16} /><b>7</b></span><span className="fd-acao"><MessageCircleMore size={16} /><b>12</b></span></>} />
          </div>
        </div>
        <nav className="ad-nav">
          <span className="ad-nav-item"><Home size={24} />Home</span>
          <span className="ad-nav-item is-on"><Newspaper size={24} />Feed</span>
          <span className="ad-nav-item"><Bookmark className="ad-i28" />Minha Lista</span>
          <span className="ad-nav-item"><img src={AV.eu} alt="" width="28" height="28" className="ad-avatar" />Perfil</span>
        </nav>
        <div className={`fd-dim ${sheet ? "is-on" : ""}`} />
        <section className={`fd-sheet ${sheet ? "is-on" : ""}`}>
          <span className="fd-handle" />
          <div className="fd-sheet-topo"><p className="fd-sheet-h">Comentários · Attack on Titan</p><span className={`fd-x ${pressX ? "is-press" : ""}`}><X className="fd-i20" /></span></div>
          <div className="fd-janela"><div className={`fd-lista ${listaRola ? "is-rolou" : ""}`}>
            <Coment nome="Lucas" av={AV.lucas} hora="3h" texto="Esse episódio 14 me destruiu. Não esperava aquela virada.">
              <Coment nome="Ana" av={AV.ana} hora="2h" texto="Concordo! A animação nessa cena tá absurda.">
                <Coment nome="Lucas" av={AV.lucas} hora="1h" texto="O som também, arrepiei." />
              </Coment>
              <Coment nome="Thiago Miranda" av={AV.eu} hora="1h" texto="Melhor episódio da temporada!" />
            </Coment>
            <Coment nome="Nayara" av={AV.nayara} hora="1h" texto="Quem já leu o mangá sabe o que vem. Sem spoiler!" />
            {enviado && <div className="fd-novo"><Coment nome="Thiago Miranda" av={AV.eu} hora="agora" texto={DIGITAR} curtidas={0} /></div>}
          </div></div>
          <div className="fd-input">
            <img className="fd-input-av" src={AV.eu} alt="" width="32" height="32" draggable="false" />
            <span className={`fd-campo ${foco ? "is-foco" : ""}`}>
              {texto ? <span className="fd-digitado">{texto}<i className="fd-caret" /></span> : <span className="fd-ph">{foco && <i className="fd-caret" />}Escreva um comentário…</span>}
              <span className={`fd-send ${texto ? "is-on" : ""} ${pressSend ? "is-press" : ""}`}><Send className="fd-i16" /></span>
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
