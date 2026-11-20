import { useState } from "react";
import { CONTATO } from "../data/perfil.js";
import SocialLink from "./SocialLink.jsx";

function Icone({ tipo }) {
  const s = { width: 24, height: 24, viewBox: "0 0 24 24", "aria-hidden": true };
  if (tipo === "enviar")
    return (
      <svg {...s}>
        <rect x="2" y="6" width="15" height="12" rx="1.5" fill="#fff" stroke="#3a6fc4" strokeWidth="1.5" />
        <path d="M2.8 7l6.7 5 6.7-5" fill="none" stroke="#3a6fc4" strokeWidth="1.5" />
        <path d="M14 15h8m-3-3 3 3-3 3" fill="none" stroke="#2e9a12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (tipo === "nova")
    return (
      <svg {...s}>
        <path d="M5 2h10l4 4v16H5z" fill="#fff" stroke="#7d8da6" strokeWidth="1.5" />
        <path d="M15 2v4h4" fill="none" stroke="#7d8da6" strokeWidth="1.5" />
        <circle cx="17" cy="17" r="4.5" fill="#f5c542" stroke="#b8860b" />
      </svg>
    );
  if (tipo === "recortar")
    return (
      <svg {...s}>
        <circle cx="7" cy="18" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17" cy="18" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9 16 17 3M15 16 7 3" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  if (tipo === "copiar")
    return (
      <svg {...s}>
        <rect x="4" y="3" width="11" height="14" fill="#fff" stroke="currentColor" strokeWidth="1.5" />
        <rect x="9" y="7" width="11" height="14" fill="#fff" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  return (
    <svg {...s}>
      <rect x="5" y="4" width="14" height="18" rx="1.5" fill="#f0d9a8" stroke="currentColor" strokeWidth="1.5" />
      <rect x="8" y="2" width="8" height="4" rx="1" fill="#fff" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

// Janela "Entre em contato comigo", no estilo de um programa de e-mail do XP.
// Não há servidor: "Enviar mensagem" abre o programa de e-mail da pessoa com tudo preenchido.
export default function JanelaEmail() {
  const [de, setDe] = useState("");
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [status, setStatus] = useState("Pronto");
  const pronto = mensagem.trim().length > 0;

  const enviar = () => {
    if (!pronto) {
      setStatus("Escreva sua mensagem antes de enviar.");
      return;
    }
    const corpo = de.trim() ? `${mensagem}\n\n— ${de.trim()}` : mensagem;
    const url = `mailto:${CONTATO.email}?subject=${encodeURIComponent(assunto || "Contato pelo portfólio")}&body=${encodeURIComponent(corpo)}`;
    window.location.href = url;
    setStatus("Abrindo seu programa de e-mail...");
  };
  const limpar = () => {
    setDe("");
    setAssunto("");
    setMensagem("");
    setStatus("Pronto");
  };

  return (
    <div className="email-xp">
      <div className="painel-barras">
        <div className="painel-linha">
          <div className="painel-menu" role="menubar" aria-label="Menu">
            <span role="menuitem">Arquivo</span>
            <span role="menuitem" className="is-desativado" aria-disabled="true">Editar</span>
            <span role="menuitem">Visualizar</span>
            <span role="menuitem" className="is-desativado" aria-disabled="true">Ferramentas</span>
            <span role="menuitem" className="is-desativado" aria-disabled="true">Ajuda</span>
          </div>
        </div>
        <div className="painel-linha painel-ferramentas" role="toolbar" aria-label="Mensagem">
          <button type="button" className="painel-botao" onClick={enviar} disabled={!pronto}>
            <Icone tipo="enviar" />
            <span>Enviar mensagem</span>
          </button>
          <button type="button" className="painel-botao" onClick={limpar}>
            <Icone tipo="nova" />
            <span>Nova mensagem</span>
          </button>
          <span className="painel-sep alto" aria-hidden="true" />
          {["recortar", "copiar", "colar"].map((t) => (
            <button key={t} type="button" className="painel-botao email-xp-cinza" disabled aria-label={t}>
              <Icone tipo={t} />
            </button>
          ))}
          <span className="painel-sep alto" aria-hidden="true" />
          <SocialLink rede="whatsapp" />
          <SocialLink rede="linkedin" />
        </div>
      </div>
      <form
        className="email-xp-form"
        onSubmit={(e) => {
          e.preventDefault();
          enviar();
        }}
      >
        <label htmlFor="email-para">Para:</label>
        <input id="email-para" readOnly value={`Thiago Miranda <${CONTATO.email}>`} className="is-fixo" />
        <label htmlFor="email-de">De:</label>
        <input id="email-de" type="email" placeholder="Seu e-mail" value={de} onChange={(e) => setDe(e.target.value)} />
        <label htmlFor="email-assunto">Assunto:</label>
        <input id="email-assunto" placeholder="Assunto da mensagem" value={assunto} onChange={(e) => setAssunto(e.target.value)} />
        <label htmlFor="email-msg" className="sr-only">Mensagem</label>
        <textarea id="email-msg" placeholder="Escreva sua mensagem aqui" value={mensagem} onChange={(e) => setMensagem(e.target.value)} />
      </form>
      <p className="email-xp-status" role="status">{status}</p>
    </div>
  );
}
