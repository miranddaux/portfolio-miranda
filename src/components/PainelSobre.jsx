import { useRef, useState } from "react";
import FotoXP from "./FotoXP.jsx";
import SocialLink from "./SocialLink.jsx";
import { REDES_PRINCIPAIS } from "../data/social.js";
import { ADICIONAL, CERTIFICACOES, CONTATO, EDUCACAO, EXPERIENCIAS, FERRAMENTAS, HABILIDADES, LINGUAS } from "../data/perfil.js";

const P = "/assets/xp/painel";
const FOTO = "/assets/xp/foto-thiago.webp";

const ABAS = [
  { id: "sobre", nome: "Sobre", endereco: "Sobre mim" },
  { id: "experiencia", nome: "Experiência", endereco: "Experiência" },
  { id: "educacao", nome: "Educação", endereco: "Educação" },
  { id: "habilidades", nome: "Habilidades", endereco: "Habilidades" },
  { id: "projetos", nome: "Projetos", endereco: "Projetos e playground" },
  { id: "contato", nome: "Contato", endereco: "Entre em contato" },
];

const LISTA_HABILIDADES = HABILIDADES.map((h) => h.nome);
const LINKS_SOCIAIS = [...REDES_PRINCIPAIS, "medium"];

function Tags({ titulo, itens }) {
  return (
    <section className="painel-tags-sec">
      <h4 className="painel-subtitulo">{titulo}</h4>
      <ul className="painel-tags">
        {itens.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </section>
  );
}

function ListaExp({ itens }) {
  return (
    <div className="painel-exp">
      {itens.map((x) => (
        <article key={x.cargo + x.empresa} className="painel-exp-item">
          <h4>{x.cargo}</h4>
          <p className="painel-exp-meta">
            {x.empresa} · {x.periodo}
          </p>
          <p>{x.texto}</p>
        </article>
      ))}
    </div>
  );
}

function Linhas({ itens }) {
  return (
    <ul className="painel-linhas">
      {itens.map((x) => (
        <li key={x.periodo + x.curso}>
          <span className="painel-data">{x.periodo}</span>
          <div>
            <strong>{x.instituicao}</strong>
            <span>{x.curso}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Expansor({ aberto, aoAlternar, rotulo, primario }) {
  return (
    <button
      type="button"
      className={`painel-expansor ${primario ? "is-primario" : ""}`}
      aria-expanded={aberto}
      aria-label={rotulo}
      onClick={aoAlternar}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" style={{ transform: aberto ? "none" : "rotate(180deg)" }}>
        <path d="M1.5 5 L5 1.8 L8.5 5 M1.5 9 L5 5.8 L8.5 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function BotaoBarra({ icone, rotulo, desativado, aoClicar, seta }) {
  return (
    <button type="button" className="painel-botao" disabled={desativado} onClick={aoClicar}>
      <img src={`${P}/${icone}.png`} alt="" width="24" height="24" draggable="false" />
      {rotulo && <span>{rotulo}</span>}
      {seta && <i aria-hidden="true" className="painel-seta" />}
    </button>
  );
}

// Conteúdo da janela "Sobre mim" no layout do Painel de Controle (Figma 135:2065).
export default function PainelSobre({ aoAbrir }) {
  const [aba, setAba] = useState("sobre");
  const [historico, setHistorico] = useState([]);
  const [futuro, setFuturo] = useState([]);
  const [secoes, setSecoes] = useState({ hab: true, soft: true, social: true });
  const [semFoto, setSemFoto] = useState(false);
  const abasRef = useRef([]);

  const ir = (id) => {
    if (id === aba) return;
    setHistorico((h) => [...h, aba]);
    setFuturo([]);
    setAba(id);
  };
  const voltar = () => {
    if (!historico.length) return;
    setFuturo((f) => [aba, ...f]);
    setAba(historico[historico.length - 1]);
    setHistorico((h) => h.slice(0, -1));
  };
  const avancar = () => {
    if (!futuro.length) return;
    setHistorico((h) => [...h, aba]);
    setAba(futuro[0]);
    setFuturo((f) => f.slice(1));
  };
  const teclasAbas = (e) => {
    const i = ABAS.findIndex((a) => a.id === aba);
    const novo = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: ABAS.length - 1 }[e.key];
    if (novo === undefined) return;
    e.preventDefault();
    const alvo = ABAS[(novo + ABAS.length) % ABAS.length];
    ir(alvo.id);
    requestAnimationFrame(() => abasRef.current[ABAS.indexOf(alvo)]?.focus());
  };
  const atual = ABAS.find((a) => a.id === aba);

  return (
    <div className="painel">
      <div className="painel-barras">
        <div className="painel-linha">
          <div className="painel-menu" role="menubar" aria-label="Menu">
            {["Arquivo", "Editar", "Exibir", "Favoritos", "Ferramentas", "?"].map((m) => (
              <span key={m} role="menuitem">{m}</span>
            ))}
          </div>
          <div className="painel-endereco">
            <span className="painel-sep" aria-hidden="true" />
            <label htmlFor="painel-endereco">Endereço</label>
            <div className="painel-combo">
              <img src={`${P}/painel-icone.png`} alt="" width="16" height="16" />
              <input id="painel-endereco" readOnly value={atual.endereco} />
              <span className="painel-drop" aria-hidden="true" />
            </div>
            <button type="button" className="painel-ok" onClick={() => document.getElementById(`aba-${aba}`)?.focus()}>
              <img src={`${P}/avancar.png`} alt="" width="20" height="20" draggable="false" />
              OK
            </button>
          </div>
          <span className="painel-adesivo"><img src={`${P}/adesivo.png`} alt="" width="36" height="18" draggable="false" /></span>
        </div>
        <div className="painel-linha painel-ferramentas" role="toolbar" aria-label="Navegação">
          <BotaoBarra icone="voltar" rotulo="Voltar" desativado={!historico.length} aoClicar={voltar} seta />
          <BotaoBarra icone="avancar" desativado={!futuro.length} aoClicar={avancar} seta />
          <BotaoBarra icone="acima" aoClicar={() => ir("sobre")} />
          <span className="painel-sep alto" aria-hidden="true" />
          <BotaoBarra icone="busca" rotulo="Buscar" aoClicar={() => ir("habilidades")} />
          <BotaoBarra icone="pastas" rotulo="Projetos" aoClicar={() => aoAbrir("cases")} />
        </div>
      </div>

      <div className="painel-principal">
        <aside className="painel-lateral" aria-label="Resumo">
          <section>
            <header className="painel-cab">
              <h3>Habilidades</h3>
              <Expansor aberto={secoes.hab} rotulo="Recolher ou expandir Habilidades" aoAlternar={() => setSecoes((s) => ({ ...s, hab: !s.hab }))} />
            </header>
            {secoes.hab && (
              <ul className="painel-corpo-sec painel-lista-sec">
                {LISTA_HABILIDADES.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <header className="painel-cab">
              <h3>Ferramentas</h3>
              <Expansor aberto={secoes.soft} rotulo="Recolher ou expandir Ferramentas" aoAlternar={() => setSecoes((s) => ({ ...s, soft: !s.soft }))} />
            </header>
            {secoes.soft && (
              <ul className="painel-corpo-sec painel-lista-sec">
                {FERRAMENTAS.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <header className="painel-cab">
              <h3>Links sociais</h3>
              <Expansor aberto={secoes.social} rotulo="Recolher ou expandir Links sociais" aoAlternar={() => setSecoes((s) => ({ ...s, social: !s.social }))} />
            </header>
            {secoes.social && (
              <ul className="painel-corpo-sec painel-lista-sec painel-social-lista">
                {LINKS_SOCIAIS.map((rede) => (
                  <li key={rede}><SocialLink rede={rede} /></li>
                ))}
              </ul>
            )}
          </section>
        </aside>

        <div className="painel-exibicao">
          <div className="painel-abas" role="tablist" aria-label="Seções do perfil" onKeyDown={teclasAbas}>
            {ABAS.map((a, i) => (
              <button
                key={a.id}
                id={`aba-${a.id}`}
                ref={(el) => (abasRef.current[i] = el)}
                type="button"
                role="tab"
                aria-selected={aba === a.id}
                aria-controls="painel-conteudo"
                tabIndex={aba === a.id ? 0 : -1}
                className={aba === a.id ? "is-ativa" : ""}
                onClick={() => ir(a.id)}
              >
                {a.nome}
              </button>
            ))}
          </div>
          <div className="painel-rolagem">
            <div className="painel-limite" id="painel-conteudo" role="tabpanel" aria-labelledby={`aba-${aba}`}>
              <h3 className="painel-titulo">{atual.endereco}</h3>

              {aba === "sobre" && (
                <div className="painel-cartao painel-perfil">
                  <div className="painel-foto">
                    {semFoto ? (
                      <span aria-hidden="true">TM</span>
                    ) : (
                      <FotoXP src={FOTO} alt="Retrato de Thiago Miranda" largura="160" altura="160" aoErro={() => setSemFoto(true)} />
                    )}
                  </div>
                  <div className="painel-texto">
                    <h4 className="painel-nome">Thiago Miranda</h4>
                    <p className="painel-cargo">Product Designer pleno</p>
                    <p className="painel-destaque">São José do Rio Preto, SP</p>
                    <p>
                      Sou Product Designer em São José do Rio Preto. De dia, desenho e-commerces na Shopify pela <strong>Agência Disco</strong>. À noite, crio pequenos projetos na interseção entre design e código.
                    </p>
                  </div>
                </div>
              )}

              {aba === "experiencia" && (
                <>
                  <ListaExp itens={EXPERIENCIAS} />
                  <h4 className="painel-subtitulo">Adicional</h4>
                  <ListaExp itens={ADICIONAL} />
                </>
              )}

              {aba === "educacao" && (
                <>
                  <Linhas itens={EDUCACAO} />
                  <h4 className="painel-subtitulo">Certificações</h4>
                  <Linhas itens={CERTIFICACOES} />
                </>
              )}

              {aba === "habilidades" && (
                <>
                  <ul className="painel-mosaico">
                    {HABILIDADES.map((h) => (
                      <li key={h.nome} className="painel-item">
                        <img src={`${P}/${h.icone}.png`} alt="" width="40" height="40" draggable="false" />
                        <strong>{h.nome}</strong>
                      </li>
                    ))}
                  </ul>
                  <Tags titulo="Ferramentas" itens={FERRAMENTAS} />
                  <Tags titulo="Línguas" itens={LINGUAS} />
                </>
              )}

              {aba === "projetos" && (
                <div className="painel-cartao">
                  <p>Cases de e-commerce, apps e design systems, com contexto, decisões e resultado. No playground ficam experimentos entre design e código.</p>
                  <div className="painel-acoes">
                    <button type="button" className="xp-button" onClick={() => aoAbrir("cases")}>Abrir projetos</button>
                    <button type="button" className="xp-button" onClick={() => aoAbrir("playground")}>Abrir playground</button>
                  </div>
                </div>
              )}

              {aba === "contato" && <ContatoConteudo aoEscrever={() => aoAbrir("contato")} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContatoConteudo({ aoEscrever }) {
  return (
    <div className="painel-contato">
      <ul className="painel-redes painel-redes--social">
        {["linkedin", "email", "whatsapp", "dribbble", "behance"].map((rede) => (
          <li key={rede}>
            <SocialLink rede={rede} variante="tile" onClick={rede === "email" ? aoEscrever : undefined} />
          </li>
        ))}
      </ul>
      <p className="painel-local">{CONTATO.local}</p>
      <h4 className="painel-subtitulo">Adicione-me ao</h4>
      <ul className="painel-redes">
        <li>
          <span className="painel-rede is-saudade" title="Brincadeira: essa rede não existe mais">
            <span className="painel-rede-orkut">orkut</span>
          </span>
        </li>
        <li>
          <span className="painel-rede is-saudade" title="Brincadeira: essa rede não existe mais">
            <img src="/assets/xp/msn/logo-32.png" alt="" width="24" height="24" />
            MSN
          </span>
        </li>
      </ul>
      <p className="painel-nota">Orkut e MSN bem que podiam voltar. Mas, para falar comigo de verdade, é só usar os botões lá de cima.</p>
    </div>
  );
}
