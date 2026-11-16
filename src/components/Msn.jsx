import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BOAS_VINDAS, SUGESTOES, responder } from "../data/bot.js";
import { EMOTICONS, partesComEmoticons } from "../data/emoticons.js";
import { CONTATO } from "../data/perfil.js";
import { somChamar, somEnviar, somMensagem } from "../lib/sons";

const FOTO = "/assets/xp/foto-thiago-rosto.webp";
const ROBO = "/assets/xp/msn/robo.svg";
const LOGO = "/assets/xp/msn/logo-32.png";
const LOGO_GRANDE = "/assets/xp/msn/logo-64.png";
const EMO = (n) => `/assets/xp/msn/emoticons/${n}.png`;
const BARRA = "/assets/xp/msn/barra";

// Imagens de exibição do visitante (Figma "MSN Assets"), como no "Minha imagem de exibição".
const FOTOS_VISITANTE = [
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

// Contatos fictícios só de enfeite (como no MSN); só o ThiagoBot abre conversa.
const CONTATOS = [
  { nome: "ThiagoBot", status: "Thiago está disponível para conversar", online: true, bot: true },
  { nome: "Ana Lopes", status: "auto layout salvou meu dia (*)", online: true },
  { nome: "Rafa Mendes", status: "handoff enviado, agora é com o dev :P", online: true },
  { nome: "Bia Torres", status: "raid às 21h, não me chama", online: true, ocupado: true },
  { nome: "Léo Martins", status: "jantar (D)", online: true, ausente: true },
  { nome: "Lucas Prado", status: "reiniciando o PC, 2 min", online: false },
  { nome: "Carla Nunes", status: "fui pra faculdade", online: false },
  { nome: "Pedro Alves", status: "", online: false },
  { nome: "Júlia Reis", status: "fotos da festa no orkut (L)", online: false },
  { nome: "Duda Lima", status: "revisão de matemática :(", online: false },
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
          <span className="msn-moldura">
            <img src={FOTO} alt="Foto de Thiago Miranda" width="56" height="56" />
          </span>
          <div className="msn-perfil-texto">
            <p className="msn-nome">
              <strong>Thiago Miranda</strong> <span>(Disponível para trabalho)</span> <span aria-hidden="true" className="msn-seta-menu">▾</span>
            </p>
            <p className="msn-frase">
              <ComEmoticons texto="Precisa de um designer? Me chama (H)" tamanho={16} />
            </p>
            <div className="msn-atalhos">
              <a href={CONTATO.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn do Thiago" title="LinkedIn">
                <img src="/assets/xp/painel/linkedin.png" alt="" width="16" height="16" /> LinkedIn
              </a>
              <a href={CONTATO.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp do Thiago" title="WhatsApp">
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="11" fill="#25d366" />
                  <path d="M8.6 6.8c.3-.3.8-.3 1 .1l1.1 2c.2.3.1.7-.1 1l-.6.6c.5 1.2 1.4 2.2 2.6 2.8l.6-.6c.3-.3.7-.3 1-.1l2 1.1c.4.2.5.7.2 1l-.9 1c-.6.6-1.5.8-2.3.4-2.6-1.2-4.6-3.3-5.7-5.8-.3-.8-.1-1.7.5-2.3z" fill="#fff" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="msn-meio">
        <div className="msn-abas-lat" aria-hidden="true">
          <span className="is-ativa"><img src="/assets/xp/msn/online-32.png" alt="" width="24" height="24" /></span>
          <span><img src={EMO(1)} alt="" width="24" height="24" /></span>
          <span><img src={EMO(31)} alt="" width="24" height="24" /></span>
          <span><img src={EMO(23)} alt="" width="24" height="24" /></span>
          <span><img src={EMO(40)} alt="" width="24" height="24" /></span>
        </div>
        <div className="msn-meio-lista">
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
      </div>
      <div className="msn-rodape">
        <button type="button" className="msn-banner" onClick={aoConversar}>
          <img src={LOGO_GRANDE} alt="" width="40" height="40" />
          <span className="msn-banner-txt">
            <span>
              <b>Portfólio</b> Messenger
            </span>
            <small>Converse com o ThiagoBot</small>
          </span>
        </button>
      </div>
    </div>
  );
}

/* ---------- Conversa ---------- */
const agora = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} às ${p(d.getHours())}:${p(d.getMinutes())}`;
};

function BotaoBarra({ img, rotulo, onClick }) {
  return (
    <button type="button" className="msn-ferramenta" onClick={onClick} title={rotulo}>
      <img src={`${BARRA}/${img}.png`} alt="" width="32" height="32" />
      <span>{rotulo}</span>
    </button>
  );
}

export function MsnConversa({ aoAbrir, ativa, aoChamar }) {
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
    falarBot(BOAS_VINDAS, { sugestoes: true });
    const filaAtual = fila.current;
    return () => filaAtual.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = rolagem.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, digitando]);

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
    setMsgs((m) => [...m, { de: "sistema", texto: "Você chamou a atenção de ThiagoBot." }]);
    falarBot(["Opa! Não precisa chamar a atenção, eu já estou aqui. :D"]);
  };

  const bloquear = () => falarBot(["Poxa, não me bloqueia! :'( Se preferir, fale direto com o Thiago no LinkedIn."], { acao: { rotulo: "Abrir LinkedIn", link: CONTATO.linkedin } });
  const chamada = () => falarBot(["Por aqui é só texto. :) Para uma conversa por vídeo ou voz, chame o Thiago no LinkedIn."], { acao: { rotulo: "Abrir LinkedIn", link: CONTATO.linkedin } });
  const jogos = () => falarBot(["Os jogos ainda estão sendo montados no Playground. (*) Enquanto isso, que tal ver os projetos?"], { acao: { rotulo: "Abrir Meus projetos", abrir: "cases" } });
  const atividades = () => falarBot(["Uma boa atividade: conhecer os 3 cases em destaque. (I)"], { acao: { rotulo: "Abrir Meus projetos", abrir: "cases" } });

  return (
    <div className="msn-conversa">
      <MenuJanela itens={["Arquivo", "Editar", "Ações", "Ferramentas", "Ajuda"]} />
      <div className="msn-barra">
        <BotaoBarra img="video" rotulo="Vídeo" onClick={chamada} />
        <BotaoBarra img="voz" rotulo="Voz" onClick={chamada} />
        <BotaoBarra img="atividades" rotulo="Atividades" onClick={atividades} />
        <BotaoBarra img="jogos" rotulo="Jogos" onClick={jogos} />
        <span className="msn-barra-sep" aria-hidden="true" />
        <BotaoBarra img="bloquear" rotulo="Bloquear" onClick={bloquear} />
        <img className="msn-barra-logo" src={LOGO} alt="" width="24" height="24" />
      </div>
      <div className="msn-corpo">
        <div className="msn-chat">
          <p className="msn-para">
            Para: <strong>ThiagoBot</strong> <span>&lt;assistente do portfólio&gt;</span>
          </p>
          <div className="msn-mensagens" ref={rolagem} role="log" aria-live="polite" aria-label="Conversa">
            <p className="msn-info">
              <img src="/assets/xp/figma/informacao.png" alt="" width="16" height="16" /> Thiago está disponível para conversar. As respostas são automáticas.
            </p>
            {msgs.map((m, i) =>
              m.de === "sistema" ? (
                <p key={i} className="msn-sistema">{m.texto}</p>
              ) : (
                <div key={i} className={`msn-msg ${m.de === "bot" ? "is-bot" : "is-voce"}`}>
                  {(i === 0 || msgs[i - 1].de !== m.de) && <p className="msn-diz">{m.de === "bot" ? "ThiagoBot diz:" : "Você diz:"}</p>}
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
              <span className="msn-fonte" aria-hidden="true" title="Fonte">A</span>
              <button
                type="button"
                className="msn-formatar-btn"
                aria-haspopup="dialog"
                aria-expanded={painel === "emoticons"}
                onClick={() => setPainel((p) => (p === "emoticons" ? null : "emoticons"))}
                title="Emoticons"
              >
                <img src={EMO(1)} alt="" width="20" height="20" />
                <span aria-hidden="true">▾</span>
                <span className="sr-only">Escolher um emoticon</span>
              </button>
              <button type="button" className="msn-formatar-btn" onClick={() => inserir(";)")} title="Enviar uma piscadela">
                <img src={EMO(3)} alt="" width="20" height="20" />
                <span className="sr-only">Piscadela</span>
              </button>
              <button type="button" className="msn-formatar-btn msn-chamar" onClick={chamarAtencao} title="Chamar a atenção">
                <span aria-hidden="true">((</span>
                <img src={EMO(18)} alt="" width="20" height="20" />
                <span aria-hidden="true">))</span>
                <span className="sr-only">Chamar a atenção</span>
              </button>
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
              <button type="submit" className="msn-enviar" disabled={!texto.trim()}>
                Enviar
              </button>
            </form>
          </div>
          <p className="msn-status">
            {digitando ? "ThiagoBot está digitando uma mensagem..." : ultima ? `Última mensagem recebida em ${ultima}.` : " "}
          </p>
        </div>
        <div className="msn-avatares">
          <div>
            <span className="msn-moldura grande">
              <img src={ROBO} alt="" width="96" height="96" />
            </span>
          </div>
          <div className="msn-minha-foto">
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
            <button
              type="button"
              className="msn-moldura grande msn-moldura-btn"
              aria-haspopup="dialog"
              aria-expanded={painel === "foto"}
              onClick={() => setPainel((p) => (p === "foto" ? null : "foto"))}
              title="Trocar minha imagem de exibição"
            >
              <img src={foto.src} alt={`Sua imagem: ${foto.nome}`} width="96" height="96" />
            </button>
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
        <span className="msn-moldura">
          <img src={ROBO} alt="" width="48" height="48" />
        </span>
        <span>
          <strong>ThiagoBot diz:</strong>
          <span>
            <ComEmoticons texto="Oi, eu sou o ThiagoBot! :) Quer saber mais sobre o Thiago? Clique para conversar." tamanho={16} />
          </span>
        </span>
      </button>
      <button type="button" className="msn-aviso-link" onClick={aoFechar}>
        Bloquear ThiagoBot
      </button>
    </div>,
    document.body,
  );
}
