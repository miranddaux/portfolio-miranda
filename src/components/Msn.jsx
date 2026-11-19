import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BOAS_VINDAS, SUGESTOES, responder } from "../data/bot.js";
import { EMOTICONS, partesComEmoticons } from "../data/emoticons.js";
import { CONTATO } from "../data/perfil.js";
import SocialLink from "./SocialLink.jsx";
import MsnBanner from "./MsnBanner.jsx";
import { REDES_PRINCIPAIS } from "../data/social.js";
import { prepararSomMensagem, somChamar, somEnviar, somMensagem } from "../lib/sons";

export const NOME_BOT = "Thiago Bot";
const FOTO = "/assets/xp/foto-thiago-rosto.webp";
const FOTO_BOT = "/assets/xp/msn/thiago-bot.webp";
const LOGO = "/assets/xp/msn/logo-32.png";
const EMO = (n) => `/assets/xp/msn/emoticons/${n}.png`;

// Imagens de exibição do visitante (Figma "MSN Assets"), como no "Minha imagem de exibição".
const FOTOS_VISITANTE = [
  { id: "thiago", nome: "Thiago Miranda", src: "/assets/xp/msn/fotos/thiago-retro.webp" },
  { id: "pato", nome: "Patinho", src: "/assets/xp/msn/fotos/pato.webp" },
  { id: "flor", nome: "Flor laranja", src: "/assets/xp/msn/fotos/flor.webp" },
  { id: "cachorro", nome: "Cachorro amigo", src: "/assets/xp/msn/fotos/cachorro.webp" },
  { id: "aviao", nome: "Avião", src: "/assets/xp/figma/avatar.png" },
];
const lerFoto = () => {
  try {
    return FOTOS_VISITANTE.find((f) => f.id === localStorage.getItem("msn-foto")) || FOTOS_VISITANTE[0];
  } catch {
    return FOTOS_VISITANTE[0];
  }
};

// Contatos fictícios só de enfeite (como no MSN); só o Thiago Bot abre conversa.
// As frases usam os emoticons do pack do Figma (códigos em src/data/emoticons.js).
const CONTATOS = [
  { nome: NOME_BOT, status: "pergunte qualquer coisa sobre o Thiago (I)", online: true, bot: true },
  { nome: "Ana Lopes", status: "auto layout salvou meu dia (*) (H)", online: true },
  { nome: "Rafa Mendes", status: "handoff enviado, agora é com o dev :D (B)", online: true },
  { nome: "Bia Torres", status: "raid às 21h, não me chama :@", online: true, ocupado: true },
  { nome: "Léo Martins", status: "jantar (D) volto já", online: true, ausente: true },
  { nome: "Lucas Prado", status: "reiniciando o PC, 2 min |-)", online: false },
  { nome: "Carla Nunes", status: "fui pra faculdade (8)", online: false },
  { nome: "Pedro Alves", status: "(S) boa noite, galera", online: false },
  { nome: "Júlia Reis", status: "fotos da festa no orkut (L) <:o)", online: false },
  { nome: "Duda Lima", status: "revisão de matemática :'(", online: false },
];

// Texto com emoticons do MSN no lugar dos códigos (:) ;) (L) ...).
export function ComEmoticons({ texto, tamanho = 19 }) {
  return partesComEmoticons(texto).map((p, i) =>
    p.emoticon ? (
      <img key={i} className="msn-emo" src={p.emoticon.src} alt={p.emoticon.codigo} title={p.emoticon.nome} width={tamanho} height={tamanho} />
    ) : (
      <span key={i}>{p.texto}</span>
    ),
  );
}

export function Boneco({ online = true, ocupado, ausente, tamanho = 16 }) {
  if (ausente) {
    return (
      <span className="msn-boneco" aria-hidden="true">
        <img src="/assets/xp/msn/status-ausente.png" alt="" width={tamanho} height={tamanho} />
      </span>
    );
  }
  return (
    <span className="msn-boneco" aria-hidden="true">
      <img src={online ? "/assets/xp/msn/online-32.png" : "/assets/xp/msn/offline-32.png"} alt="" width={tamanho} height={tamanho} />
      {ocupado && <i className="is-ocupado" />}
    </span>
  );
}

// Moldura da imagem de exibição (arquivo enviado pelo Thiago: public/assets/xp/msn/moldura.png).
function Moldura({ src, alt = "", tamanho = 120, className = "", ...resto }) {
  const Tag = resto.onClick ? "button" : "span";
  return (
    <Tag className={`msn-quadro ${className}`} style={{ "--quadro": `${tamanho}px` }} {...(Tag === "button" ? { type: "button" } : {})} {...resto}>
      <img src={src} alt={alt} width={tamanho} height={tamanho} />
    </Tag>
  );
}

function MenuJanela({ itens }) {
  return (
    <div className="painel-menu msn-menu" aria-hidden="true">
      {itens.map((i) => (
        <span key={i}>
          <u>{i[0]}</u>
          {i.slice(1)}
        </span>
      ))}
    </div>
  );
}

/* Ícones da barra da conversa, desenhados no estilo do MSN (traço azul-acinzentado). */
const ICONES = {
  convidar: (
    <>
      <circle cx="9" cy="7" r="3.5" />
      <path d="M2.5 19c.5-4 3-6 6.5-6s6 2 6.5 6" />
      <path d="M18 6v6M15 9h6" />
    </>
  ),
  arquivos: (
    <>
      <path d="M3 7h6l2 2h8v9H3z" />
      <path d="M8 13h8M12 11v5" />
    </>
  ),
  voz: (
    <>
      <path d="M6 3l3 4-2 2c1 2 3 4 5 5l2-2 4 3-2 3c-6 0-13-7-13-13z" />
    </>
  ),
  video: (
    <>
      <rect x="2.5" y="6" width="12" height="11" rx="1.5" />
      <path d="M14.5 10l6-3.5v10l-6-3.5" />
    </>
  ),
  pincel: (
    <>
      <path d="M20 3c-4 3-7 6-9 9l2 2c3-2 6-5 9-9z" />
      <path d="M10 13c-3 0-4 2-4 4s-2 3-3 3c3 1 8 0 8-4z" />
    </>
  ),
  pesquisar: (
    <>
      <circle cx="10" cy="10" r="5.5" />
      <path d="M14 14l6 6" />
    </>
  ),
  caneta: <path d="M4 20l1-4L16 5l3 3L8 19zM14 7l3 3" />,
};
function Icone({ nome, tamanho = 24 }) {
  return (
    <svg className="msn-svg" width={tamanho} height={tamanho} viewBox="0 0 24 24" aria-hidden="true">
      {ICONES[nome]}
    </svg>
  );
}

/* ---------- Lista de contatos ---------- */
export function MsnContatos({ aoConversar }) {
  const [busca, setBusca] = useState("");
  const [abertos, setAbertos] = useState({ on: true, off: true });
  const filtro = (c) => c.nome.toLowerCase().includes(busca.trim().toLowerCase());
  const grupos = [
    { id: "on", titulo: "Online", itens: CONTATOS.filter((c) => c.online && filtro(c)) },
    { id: "off", titulo: "Offline", itens: CONTATOS.filter((c) => !c.online && filtro(c)) },
  ];

  return (
    <div className="msn">
      <MenuJanela itens={["Arquivo", "Contatos", "Ações", "Ferramentas", "Ajuda"]} />
      <div className="msn-topo">
        <p className="msn-marca">
          <img src={LOGO} alt="" width="16" height="16" /> <b>Portfólio</b> Messenger
        </p>
        <div className="msn-perfil">
          <Moldura src={FOTO} alt="Foto de Thiago Miranda" tamanho={64} />
          <div className="msn-perfil-texto">
            <p className="msn-nome">
              <strong>Thiago Miranda</strong> <span>(Disponível para trabalho)</span> <span aria-hidden="true" className="msn-seta-menu">▾</span>
            </p>
            <p className="msn-frase">
              <ComEmoticons texto="Precisa de um designer? Me chama (H)" tamanho={16} />
            </p>
            <nav className="msn-atalhos" aria-label="Redes sociais de Thiago Miranda">
              {REDES_PRINCIPAIS.map((rede) => <SocialLink key={rede} rede={rede} />)}
            </nav>
          </div>
        </div>
      </div>

      <div className="msn-meio">
        <a className="msn-adicionar" href={CONTATO.linkedin} target="_blank" rel="noreferrer" title="Adicionar o Thiago no LinkedIn">
          <span aria-hidden="true" className="msn-mais">+</span> Adicionar um contato
        </a>
        <div className="msn-busca">
          <label className="sr-only" htmlFor="msn-busca">Procurar um contato</label>
          <input id="msn-busca" type="search" placeholder="Procurar um contato..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
        <ul className="msn-lista">
          {grupos.map((g) => (
            <li key={g.id}>
              <button type="button" className="msn-grupo" aria-expanded={abertos[g.id]} onClick={() => setAbertos((a) => ({ ...a, [g.id]: !a[g.id] }))}>
                <span aria-hidden="true" className="msn-caixa">{abertos[g.id] ? "−" : "+"}</span>
                <strong>{g.titulo} ({g.itens.length})</strong>
              </button>
              {abertos[g.id] && (
                <ul>
                  {g.itens.map((c) => {
                    const conteudo = (
                      <>
                        <Boneco online={c.online} ocupado={c.ocupado} ausente={c.ausente} />
                        <strong>{c.nome}</strong>
                        {(c.ocupado || c.ausente || c.status) && (
                          <span className="msn-st">
                            {(c.ocupado || c.ausente) && ` (${c.ocupado ? "Ocupado" : "Ausente"})`}
                            {c.status && (
                              <>
                                {" "}- <ComEmoticons texto={c.status} tamanho={16} />
                              </>
                            )}
                          </span>
                        )}
                      </>
                    );
                    return (
                      <li key={c.nome}>
                        {c.bot ? (
                          <button type="button" className="msn-contato is-bot" onClick={aoConversar}>
                            {conteudo}
                          </button>
                        ) : (
                          <span className={`msn-contato ${c.online ? "" : "is-off"}`} title="Contato de enfeite">
                            {conteudo}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="msn-rodape">
        <MsnBanner aoConversar={aoConversar} />
      </div>
    </div>
  );
}

/* ---------- Conversa (layout da referência MitchBot + benchmark MSN) ---------- */
const agora = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} às ${p(d.getHours())}:${p(d.getMinutes())}`;
};

const BARRA = "/assets/xp/msn/barra";
function BotaoIcone({ icone, img, rotulo, onClick, children }) {
  return (
    <button type="button" className="msn-ferramenta" onClick={onClick} title={rotulo} aria-label={rotulo}>
      {img ? <img src={`${BARRA}/${img}.png`} alt="" width="28" height="28" /> : <Icone nome={icone} />}
      {children}
    </button>
  );
}

export function MsnConversa({ aoAbrir, ativa, aoChamar, aoFechar }) {
  const [msgs, setMsgs] = useState([]);
  const [texto, setTexto] = useState("");
  const [digitando, setDigitando] = useState(false);
  const [ultima, setUltima] = useState("");
  const [painel, setPainel] = useState(null); // "emoticons" | "foto" | null
  const [foto, setFoto] = useState(lerFoto);
  const fila = useRef([]);
  const rolagem = useRef(null);
  const campo = useRef(null);

  const falarBot = (linhas, extra = {}) => {
    setDigitando(true);
    linhas.forEach((l, i) => {
      const fim = i === linhas.length - 1;
      fila.current.push(
        setTimeout(() => {
          setMsgs((m) => [...m, { de: "bot", texto: l, acao: fim ? extra.acao : null, sugestoes: fim ? extra.sugestoes : false }]);
          setUltima(agora());
          setDigitando(!fim);
          if (i === 0) somMensagem();
        }, 800 + i * 1000),
      );
    });
  };

  useEffect(() => {
    prepararSomMensagem();
    falarBot(BOAS_VINDAS, { sugestoes: true });
    const filaAtual = fila.current;
    return () => filaAtual.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Rolagem suave até a última mensagem, sem pular nem travar.
  const rolarAoFim = () => {
    const el = rolagem.current;
    if (!el) return;
    const reduzido = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ top: el.scrollHeight, behavior: reduzido ? "auto" : "smooth" });
  };
  useEffect(() => {
    const id = requestAnimationFrame(rolarAoFim);
    return () => cancelAnimationFrame(id);
  }, [msgs]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (ativa) campo.current?.focus({ preventScroll: true });
  }, [ativa]);

  useEffect(() => {
    if (!painel) return;
    const fechar = (e) => {
      if (e.key === "Escape") setPainel(null);
    };
    window.addEventListener("keydown", fechar);
    return () => window.removeEventListener("keydown", fechar);
  }, [painel]);

  const enviar = (valor) => {
    const t = (valor ?? texto).trim();
    if (!t) return;
    somEnviar();
    setMsgs((m) => [...m, { de: "voce", texto: t }]);
    setTexto("");
    setPainel(null);
    const r = responder(t);
    falarBot(r.respostas, { acao: r.acao, sugestoes: r.padrao });
  };

  const inserir = (codigo) => {
    setTexto((t) => (t && !t.endsWith(" ") ? `${t} ${codigo} ` : `${t}${codigo} `));
    setPainel(null);
    campo.current?.focus({ preventScroll: true });
  };

  const escolherFoto = (f) => {
    setFoto(f);
    setPainel(null);
    try {
      localStorage.setItem("msn-foto", f.id);
    } catch {}
  };

  const chamarAtencao = () => {
    somChamar();
    aoChamar?.();
    setMsgs((m) => [...m, { de: "sistema", texto: `Você chamou a atenção de ${NOME_BOT}.` }]);
    falarBot(["Opa! Não precisa chamar a atenção, eu já estou aqui. :D"]);
  };

  const bloquear = () => falarBot(["Poxa, não me bloqueia! :'( Se preferir, fale direto com o Thiago no LinkedIn."], { acao: { rotulo: "Abrir LinkedIn", link: CONTATO.linkedin } });
  const chamada = () => falarBot(["Por aqui é só texto. :) Para uma conversa por vídeo ou voz, chame o Thiago no LinkedIn."], { acao: { rotulo: "Abrir LinkedIn", link: CONTATO.linkedin } });
  const arquivos = () => falarBot(["O arquivo mais útil daqui é o currículo do Thiago, em português e inglês. (I)"], { acao: { rotulo: "Abrir Meu currículo", abrir: "curriculo" } });
  const convidar = () => falarBot(["Quer chamar alguém do seu time? Mande um e-mail para o Thiago e ele responde todo mundo. ({)(})"], { acao: { rotulo: "Abrir Contato", abrir: "contato" } });
  const atividades = () => falarBot(["Uma boa atividade: conhecer o case do ANIMAE. (I)"], { acao: { rotulo: "Abrir Meus projetos", abrir: "cases" } });
  const tema = () => falarBot(["O visual desta janela é uma homenagem ao MSN. (H) O design system do portfólio está nos projetos."], { acao: { rotulo: "Abrir Meus projetos", abrir: "cases" } });

  return (
    <div className="msn-conversa">
      <div className="msn-abas" role="presentation">
        <span className="msn-aba is-ativa">
          <Boneco /> {NOME_BOT}
          {aoFechar ? (
            <button type="button" className="msn-aba-x" onClick={aoFechar} aria-label="Fechar conversa">×</button>
          ) : (
            <span aria-hidden="true" className="msn-aba-x">×</span>
          )}
        </span>
      </div>
      <div className="msn-cab">
        <Boneco tamanho={20} />
        <div>
          <strong>{NOME_BOT}</strong>
          <span>Thiago está disponível para projetos</span>
        </div>
      </div>
      <div className="msn-barra">
        <BotaoIcone img="convidar" rotulo="Convidar alguém para a conversa" onClick={convidar} />
        <BotaoIcone img="arquivos" rotulo="Enviar arquivos" onClick={arquivos} />
        <BotaoIcone img="voz" rotulo="Chamada de voz" onClick={chamada} />
        <BotaoIcone img="video" rotulo="Chamada de vídeo" onClick={chamada} />
        <BotaoIcone img="midia" rotulo="Atividades e mídia" onClick={atividades} />
        <button type="button" className="msn-bloquear" onClick={bloquear}>
          <img src={`${BARRA}/bloquear.png`} alt="" width="24" height="24" /> Bloquear
        </button>
        <span className="msn-barra-dir">
          <BotaoIcone icone="pincel" rotulo="Tema da janela" onClick={tema} />
        </span>
      </div>
      <div className="msn-corpo">
        <div className="msn-chat">
          <div className="msn-mensagens" ref={rolagem} onLoadCapture={rolarAoFim} role="log" aria-live="polite" aria-label="Conversa">
            <p className="msn-info">
              <img src="/assets/xp/figma/informacao.png" alt="" width="16" height="16" /> Thiago está disponível para projetos
            </p>
            {msgs.map((m, i) =>
              m.de === "sistema" ? (
                <p key={i} className="msn-sistema">{m.texto}</p>
              ) : (
                <div key={i} className={`msn-msg ${m.de === "bot" ? "is-bot" : "is-voce"}`}>
                  {(i === 0 || msgs[i - 1].de !== m.de) && <p className="msn-diz">{m.de === "bot" ? `${NOME_BOT} diz:` : "Você diz:"}</p>}
                  <p className="msn-texto">
                    <ComEmoticons texto={m.texto} />
                  </p>
                  {m.sugestoes && (
                    <p className="msn-links">
                      {SUGESTOES.map((s) => (
                        <button key={s.rotulo} type="button" onClick={() => enviar(s.pergunta)}>
                          {s.rotulo}
                        </button>
                      ))}
                    </p>
                  )}
                  {m.acao &&
                    (m.acao.link ? (
                      <a className="msn-acao" href={m.acao.link} target="_blank" rel="noreferrer">{m.acao.rotulo}</a>
                    ) : (
                      <button type="button" className="msn-acao" onClick={() => aoAbrir(m.acao.abrir)}>
                        {m.acao.rotulo}
                      </button>
                    ))}
                </div>
              ),
            )}
          </div>
          <div className="msn-divisor" aria-hidden="true" />
          <div className="msn-escrever">
            <div className="msn-formatar">
              <button
                type="button"
                className="msn-formatar-btn"
                aria-haspopup="dialog"
                aria-expanded={painel === "emoticons"}
                onClick={() => setPainel((p) => (p === "emoticons" ? null : "emoticons"))}
                title="Emoticons"
              >
                <img src={EMO(1)} alt="" width="20" height="20" />
                <span aria-hidden="true" className="msn-seta-mini">▾</span>
                <span className="sr-only">Escolher um emoticon</span>
              </button>
              <button type="button" className="msn-formatar-btn" onClick={() => inserir(";)")} title="Enviar uma piscadela">
                <img src={EMO(3)} alt="" width="20" height="20" />
                <span aria-hidden="true" className="msn-seta-mini">▾</span>
                <span className="sr-only">Piscadela</span>
              </button>
              <button type="button" className="msn-formatar-btn msn-chamar" onClick={chamarAtencao} title="Chamar a atenção">
                <span aria-hidden="true">((</span>
                <img src={EMO(18)} alt="" width="20" height="20" />
                <span aria-hidden="true">))</span>
                <span className="sr-only">Chamar a atenção</span>
              </button>
              <button type="button" className="msn-formatar-btn" onClick={chamada} title="Clipe de voz">
                <img src={`${BARRA}/voz.png`} alt="" width="20" height="20" />
                <span className="sr-only">Clipe de voz</span>
              </button>
              <span className="msn-ab" aria-hidden="true">AB</span>
              {painel === "emoticons" && (
                <div className="msn-popup msn-emoticons" role="dialog" aria-label="Emoticons">
                  <p className="msn-popup-titulo">Seus emoticons</p>
                  <div className="msn-emo-grade">
                    {EMOTICONS.map((e) => (
                      <button key={e.n} type="button" onClick={() => inserir(e.codigo)} title={`${e.nome}  ${e.codigo}`}>
                        <img src={e.src} alt={e.nome} width="24" height="24" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <form
              className="msn-form"
              onSubmit={(e) => {
                e.preventDefault();
                enviar();
              }}
            >
              <label className="sr-only" htmlFor="msn-texto">Digite sua mensagem</label>
              <textarea
                id="msn-texto"
                ref={campo}
                value={texto}
                placeholder="Digite sua mensagem aqui..."
                onChange={(e) => setTexto(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    enviar();
                  }
                }}
              />
              <div className="msn-escrever-rodape">
                <span className="msn-fonte is-ativa" aria-hidden="true">A</span>
                <span className="msn-caneta" aria-hidden="true">
                  <Icone nome="caneta" tamanho={16} />
                </span>
                <button type="submit" className="msn-enviar" disabled={!texto.trim()}>
                  Enviar
                </button>
                <span className="msn-pesquisar" aria-hidden="true">
                  <Icone nome="pesquisar" tamanho={16} />
                </span>
              </div>
            </form>
          </div>
          <p className="msn-status">
            {digitando ? `${NOME_BOT} está digitando uma mensagem...` : ultima ? `Última mensagem recebida em ${ultima}.` : " "}
          </p>
        </div>
        <div className="msn-avatares">
          <div className="msn-avatar-bloco">
            <Moldura src={FOTO_BOT} alt={`Imagem de exibição do ${NOME_BOT}`} tamanho={112} />
            <span className="msn-sob-foto" aria-hidden="true">
              <img src="/assets/xp/msn/online-32.png" alt="" width="16" height="16" />
              <span>▾</span>
            </span>
          </div>
          <div className="msn-avatar-bloco msn-minha-foto">
            {painel === "foto" && (
              <div className="msn-popup msn-fotos" role="dialog" aria-label="Minha imagem de exibição">
                <p className="msn-popup-titulo">Minha imagem de exibição</p>
                <ul>
                  {FOTOS_VISITANTE.map((f) => (
                    <li key={f.id}>
                      <button type="button" aria-pressed={foto.id === f.id} onClick={() => escolherFoto(f)}>
                        <img src={f.src} alt="" width="32" height="32" /> {f.nome}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Moldura
              src={foto.src}
              alt={`Sua imagem: ${foto.nome}`}
              tamanho={112}
              className="msn-quadro-btn"
              aria-haspopup="dialog"
              aria-expanded={painel === "foto"}
              onClick={() => setPainel((p) => (p === "foto" ? null : "foto"))}
              title="Trocar minha imagem de exibição"
            />
            <span className="msn-sob-foto" aria-hidden="true">
              <span>▾</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Aviso que sobe no canto ---------- */
export function MsnAviso({ aoAbrir, aoFechar }) {
  useEffect(() => {
    somMensagem();
    const t = setTimeout(aoFechar, 12000);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return createPortal(
    <div className="msn-aviso" role="status">
      <div className="msn-aviso-topo">
        <img src={LOGO} alt="" width="16" height="16" />
        <span>Messenger</span>
        <button type="button" onClick={aoFechar} aria-label="Fechar aviso do Messenger">×</button>
      </div>
      <button type="button" className="msn-aviso-corpo" onClick={aoAbrir}>
        <Moldura src={FOTO_BOT} alt="" tamanho={48} />
        <span>
          <strong>{NOME_BOT} diz:</strong>
          <span>
            <ComEmoticons texto={`Oi, eu sou o ${NOME_BOT}! :) Quer saber mais sobre o Thiago? Clique para conversar.`} tamanho={16} />
          </span>
        </span>
      </button>
      <button type="button" className="msn-aviso-link" onClick={aoFechar}>
        Bloquear {NOME_BOT}
      </button>
    </div>,
    document.body,
  );
}
