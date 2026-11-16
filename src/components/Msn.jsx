import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BOAS_VINDAS, SUGESTOES, responder } from "../data/bot.js";
import { CONTATO } from "../data/perfil.js";
import { somAviso, somChamar, somEnviar, somMensagem } from "../lib/sons";

const FOTO = "/assets/xp/foto-thiago-rosto.webp";
const ROBO = "/assets/xp/msn/robo.svg";
const VISITANTE = "/assets/xp/figma/avatar.png";
const LOGO = "/assets/xp/msn/logo-32.png";
const LOGO_GRANDE = "/assets/xp/msn/logo-64.png";

// Contatos fictícios só de enfeite (como no MSN); só o ThiagoBot abre conversa.
const CONTATOS = [
  { nome: "ThiagoBot", status: "Thiago está disponível para conversar", online: true, bot: true },
  { nome: "Ana Lopes", status: "auto layout salvou meu dia", emoji: "👍", online: true },
  { nome: "Rafa Mendes", status: "handoff enviado, agora é com o dev", emoji: "😅", online: true },
  { nome: "Bia Torres", status: "raid às 21h, não me chama", emoji: "🎮", online: true, ocupado: true },
  { nome: "Léo Martins", status: "jantar", emoji: "🍽️", online: true, ausente: true },
  { nome: "Lucas Prado", status: "reiniciando o PC, 2 min", emoji: "💻", online: false },
  { nome: "Carla Nunes", status: "fui pra faculdade", online: false },
  { nome: "Pedro Alves", status: "", online: false },
  { nome: "Júlia Reis", status: "fotos da festa no orkut", emoji: "📸", online: false },
  { nome: "Duda Lima", status: "revisão de matemática", emoji: "😩", online: false },
];

export function Boneco({ online = true, ocupado, ausente, tamanho = 16 }) {
  return (
    <span className="msn-boneco" aria-hidden="true">
      <img src={online ? "/assets/xp/msn/online-32.png" : "/assets/xp/msn/offline-32.png"} alt="" width={tamanho} height={tamanho} />
      {(ocupado || ausente) && <i className={ocupado ? "is-ocupado" : "is-ausente"} />}
    </span>
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
      <div className="msn-topo">
        <p className="msn-marca">
          <img src={LOGO} alt="" width="16" height="16" /> Messenger
        </p>
        <div className="msn-perfil">
          <span className="msn-moldura">
            <img src={FOTO} alt="Foto de Thiago Miranda" width="56" height="56" />
          </span>
          <div className="msn-perfil-texto">
            <p className="msn-nome">
              <Boneco /> <strong>Thiago Miranda</strong> <span>(Disponível para trabalho)</span>
            </p>
            <p className="msn-frase">Precisa de um designer? Me chama 😎 💻</p>
          </div>
        </div>
        <div className="msn-atalhos">
          <a href={CONTATO.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn do Thiago" title="LinkedIn">
            <img src="/assets/xp/painel/linkedin.png" alt="" width="16" height="16" />
          </a>
          <a href={CONTATO.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp do Thiago" title="WhatsApp">
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="11" fill="#25d366" />
              <path d="M8.6 6.8c.3-.3.8-.3 1 .1l1.1 2c.2.3.1.7-.1 1l-.6.6c.5 1.2 1.4 2.2 2.6 2.8l.6-.6c.3-.3.7-.3 1-.1l2 1.1c.4.2.5.7.2 1l-.9 1c-.6.6-1.5.8-2.3.4-2.6-1.2-4.6-3.3-5.7-5.8-.3-.8-.1-1.7.5-2.3z" fill="#fff" />
            </svg>
          </a>
          <button type="button" className="msn-fale" onClick={aoConversar}>
            <img src="/assets/xp/figma/email.png" alt="" width="16" height="16" /> Fale comigo
          </button>
        </div>
      </div>
      <div className="msn-busca">
        <label className="sr-only" htmlFor="msn-busca">Procurar um contato</label>
        <input id="msn-busca" type="search" placeholder="Procurar um contato..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        <span className="msn-busca-icones" aria-hidden="true">
          <Boneco />
          <span className="msn-ordenar">⇅</span>
        </span>
      </div>
      <ul className="msn-lista">
        {grupos.map((g) => (
          <li key={g.id}>
            <button type="button" className="msn-grupo" aria-expanded={abertos[g.id]} onClick={() => setAbertos((a) => ({ ...a, [g.id]: !a[g.id] }))}>
              <span aria-hidden="true" className="msn-seta">{abertos[g.id] ? "▾" : "▸"}</span>
              {g.titulo} ({g.itens.length})
            </button>
            {abertos[g.id] && (
              <ul>
                {g.itens.map((c) => {
                  const conteudo = (
                    <>
                      <Boneco online={c.online} ocupado={c.ocupado} ausente={c.ausente} />
                      <strong>{c.nome}</strong>
                      {c.status && <span className="msn-st"> - {c.status}</span>}
                      {c.emoji && <span className="msn-emoji" aria-hidden="true">{c.emoji}</span>}
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
      <div className="msn-rodape">
        <button type="button" className="msn-banner" onClick={aoConversar}>
          <img src="/assets/xp/figma/bandeira.png" alt="" width="22" height="18" />
          <span>Portfólio Messenger</span>
          <img src={LOGO_GRANDE} alt="" width="40" height="40" />
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

function IconeBarra({ d, rotulo }) {
  return (
    <span className="msn-ico" title={rotulo} aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 20 20">
        <path d={d} fill="none" stroke="#7f9cbf" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function MsnConversa({ aoAbrir, ativa, aoChamar }) {
  const [msgs, setMsgs] = useState([]);
  const [texto, setTexto] = useState("");
  const [digitando, setDigitando] = useState(false);
  const [ultima, setUltima] = useState("");
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
          somMensagem();
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

  const enviar = (valor) => {
    const t = (valor ?? texto).trim();
    if (!t) return;
    somEnviar();
    setMsgs((m) => [...m, { de: "voce", texto: t }]);
    setTexto("");
    const r = responder(t);
    falarBot(r.respostas, { acao: r.acao, sugestoes: r.padrao });
  };

  const chamarAtencao = () => {
    somChamar();
    aoChamar?.();
    setMsgs((m) => [...m, { de: "sistema", texto: "Você chamou a atenção de ThiagoBot." }]);
    falarBot(["Opa! Não precisa chamar a atenção, eu já estou aqui. 😄"]);
  };

  const bloquear = () => falarBot(["Poxa, não me bloqueia! 😅 Se preferir, fale direto com o Thiago no LinkedIn."], { acao: { rotulo: "Abrir LinkedIn", link: CONTATO.linkedin } });

  return (
    <div className="msn-conversa">
      <div className="msn-abas">
        <span className="msn-aba">
          <Boneco /> ThiagoBot <span aria-hidden="true" className="msn-aba-x">×</span>
        </span>
      </div>
      <div className="msn-cab">
        <Boneco tamanho={20} />
        <div>
          <strong>ThiagoBot</strong>
          <span>Thiago está disponível para conversar</span>
        </div>
      </div>
      <div className="msn-barra">
        <IconeBarra rotulo="Convidar" d="M7 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 17c0-3 2.2-5 5-5s5 2 5 5M15 6v6M12 9h6" />
        <IconeBarra rotulo="Enviar arquivos" d="M5 2h7l4 4v12H5zM12 2v4h4M8 12h6M8 15h4" />
        <IconeBarra rotulo="Vídeo" d="M2 6h11v8H2zM13 9l5-3v8l-5-3" />
        <IconeBarra rotulo="Jogos" d="M3 7h14v7H3zM6 10.5h3M7.5 9v3M13 10h.1M15 11h.1" />
        <button type="button" className="msn-bloquear" onClick={bloquear}>
          <Boneco ocupado /> Bloquear
        </button>
      </div>
      <div className="msn-corpo">
        <div className="msn-chat">
          <div className="msn-mensagens" ref={rolagem} role="log" aria-live="polite" aria-label="Conversa">
            <p className="msn-info">
              <img src="/assets/xp/figma/informacao.png" alt="" width="16" height="16" /> Thiago está disponível para conversar
            </p>
            {msgs.map((m, i) =>
              m.de === "sistema" ? (
                <p key={i} className="msn-sistema">{m.texto}</p>
              ) : (
                <div key={i} className={`msn-msg ${m.de === "bot" ? "is-bot" : "is-voce"}`}>
                  {(i === 0 || msgs[i - 1].de !== m.de) && <p className="msn-diz">{m.de === "bot" ? "ThiagoBot diz:" : "Você diz:"}</p>}
                  <p>{m.texto}</p>
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
              <span title="Emoticons" aria-hidden="true">🙂▾</span>
              <span title="Piscadas" aria-hidden="true">😉▾</span>
              <button type="button" onClick={chamarAtencao} title="Chamar a atenção" aria-label="Chamar a atenção">
                🫨
              </button>
              <span title="Clipe de voz" aria-hidden="true">🎙️</span>
              <span title="Fonte" aria-hidden="true" className="msn-ab">AB</span>
            </div>
            <form
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
                <span className="msn-fonte" aria-hidden="true">A</span>
                <span className="msn-caneta" aria-hidden="true">✎</span>
                <button type="submit" className="msn-enviar" disabled={!texto.trim()}>
                  Enviar
                </button>
              </div>
            </form>
          </div>
          <p className="msn-status">
            {digitando ? "ThiagoBot está digitando uma mensagem..." : ultima ? `Última mensagem recebida em ${ultima}.` : " "}
          </p>
        </div>
        <div className="msn-avatares" aria-hidden="true">
          <div>
            <span className="msn-moldura grande">
              <img src={ROBO} alt="" width="96" height="96" />
            </span>
            <span className="msn-webcam">◉ ▾</span>
          </div>
          <span className="msn-moldura grande">
            <img src={VISITANTE} alt="" width="96" height="96" />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Aviso que sobe no canto ---------- */
export function MsnAviso({ aoAbrir, aoFechar }) {
  useEffect(() => {
    somAviso();
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
          <span>Oi, eu sou o ThiagoBot! Quer saber mais sobre o Thiago? Clique para conversar.</span>
        </span>
      </button>
      <button type="button" className="msn-aviso-link" onClick={aoFechar}>
        Bloquear ThiagoBot
      </button>
    </div>,
    document.body,
  );
}
