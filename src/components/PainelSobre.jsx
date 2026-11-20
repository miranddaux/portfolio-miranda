import { useEffect, useRef, useState } from "react";
import ProjectsExplorer from "./ProjectsExplorer.jsx";
import FotoXP from "./FotoXP.jsx";
import SocialLink from "./SocialLink.jsx";
import ResultadosPerfil from "./ResultadosPerfil.jsx";
import { ABAS_PERFIL as ABAS, abaVizinha, buscarNoPerfil } from "../data/perfilSearch.js";
import { REDES_PRINCIPAIS } from "../data/social.js";
import { ADICIONAL, CERTIFICACOES, CONTATO, DESENVOLVIMENTO, EDUCACAO, EXPERIENCIAS, FERRAMENTAS, HABILIDADES, LINGUAS } from "../data/perfil.js";

const P = "/assets/xp/painel";
const FOTO = "/assets/xp/foto-thiago.webp";

const LISTA_HABILIDADES = HABILIDADES.map((h) => h.nome);
const LINKS_SOCIAIS = [...REDES_PRINCIPAIS, "medium"];

function Tags({ titulo, itens, id }) {
  return (
    <section className="painel-tags-sec" id={id} tabIndex={-1}>
      <h4 className="painel-subtitulo">{titulo}</h4>
      <ul className="painel-tags">
        {itens.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </section>
  );
}

function ListaExp({ itens, prefixo }) {
  return (
    <div className="painel-exp">
      {itens.map((x, i) => (
        <article key={x.cargo + x.empresa} className="painel-exp-item" id={`perfil-${prefixo}-${i}`} tabIndex={-1}>
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

function Linhas({ itens, prefixo }) {
  return (
    <ul className="painel-linhas">
      {itens.map((x, i) => (
        <li key={x.periodo + x.curso} id={`perfil-${prefixo}-${i}`} tabIndex={-1}>
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

function BotaoBarra({ icone, rotulo, desativado, aoClicar, seta, nomeAcessivel, ...atributos }) {
  return (
    <button type="button" className="painel-botao" disabled={desativado} onClick={aoClicar} aria-label={nomeAcessivel || rotulo} title={nomeAcessivel || rotulo} {...atributos}>
      <img src={`${P}/${icone}.png`} alt="" width="24" height="24" draggable="false" />
      {rotulo && <span>{rotulo}</span>}
      {seta && <i aria-hidden="true" className="painel-seta" />}
    </button>
  );
}

const SITE_DISCO = "https://www.agenciadisco.com/";
const SITE_SHOPIFY = "https://www.shopify.com/br";

// Conteúdo da janela "Sobre mim" no layout do Painel de Controle (Figma 135:2065).
export default function PainelSobre({ aoAbrir, onNavigate, abaPedida }) {
  const [aba, setAba] = useState("sobre");
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [consulta, setConsulta] = useState("");
  const [alvoBusca, setAlvoBusca] = useState(null);
  const buscaRef = useRef(null);
  const rolagemRef = useRef(null);
  const [secoes, setSecoes] = useState({ hab: true, soft: true, social: true });
  const [semFoto, setSemFoto] = useState(false);
  const abasRef = useRef([]);

  const ir = (id) => {
    if (!ABAS.some((item) => item.id === id)) return;
    setAba(id);
    setConsulta("");
    setAlvoBusca(null);
    if (rolagemRef.current) rolagemRef.current.scrollTop = 0;
  };
  useEffect(() => {
    if (abaPedida?.aba) ir(abaPedida.aba);
  }, [abaPedida?.n]); // eslint-disable-line react-hooks/exhaustive-deps
  const fecharBusca = () => {
    setBuscaAberta(false);
    setConsulta("");
    requestAnimationFrame(() => document.getElementById("perfil-botao-buscar")?.focus());
  };
  const selecionarResultado = (item) => {
    ir(item.aba);
    setBuscaAberta(false);
    setAlvoBusca(item.id);
  };
  useEffect(() => {
    if (buscaAberta) buscaRef.current?.focus();
  }, [buscaAberta]);
  useEffect(() => {
    if (!alvoBusca) return;
    const quadro = requestAnimationFrame(() => {
      const item = document.getElementById(alvoBusca);
      const scroller = rolagemRef.current;
      if (item && scroller) scroller.scrollTo?.({ top: item.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 24, behavior: "auto" });
      item?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(quadro);
  }, [alvoBusca]);
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
  const indiceAba = ABAS.indexOf(atual);
  const buscando = buscaAberta && Boolean(consulta.trim());
  const resultados = buscando ? buscarNoPerfil(consulta) : [];

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
              <select id="painel-endereco" value={aba} onChange={(e) => ir(e.target.value)}>
                {ABAS.map((a) => <option key={a.id} value={a.id}>{a.endereco}</option>)}
              </select>
            </div>
            <button type="button" className="painel-ok" onClick={() => document.getElementById(`aba-${aba}`)?.focus()}>
              <img src={`${P}/avancar.png`} alt="" width="20" height="20" draggable="false" />
              OK
            </button>
          </div>
          <span className="painel-adesivo"><img src={`${P}/adesivo.png`} alt="" width="36" height="18" draggable="false" /></span>
        </div>
        <div className="painel-linha painel-ferramentas" role="toolbar" aria-label="Navegação">
          <BotaoBarra icone="voltar" rotulo="Voltar" nomeAcessivel="Voltar para a aba anterior" desativado={indiceAba === 0} aoClicar={() => ir(abaVizinha(aba, -1))} seta />
          <BotaoBarra icone="avancar" nomeAcessivel="Próxima aba" desativado={indiceAba === ABAS.length - 1} aoClicar={() => ir(abaVizinha(aba, 1))} seta />
          <BotaoBarra icone="acima" nomeAcessivel="Ir para Sobre" aoClicar={() => ir("sobre")} />
          <span className="painel-sep alto" aria-hidden="true" />
          <BotaoBarra icone="busca" rotulo="Buscar" id="perfil-botao-buscar" aria-expanded={buscaAberta} aria-controls="perfil-busca" aoClicar={() => buscaAberta ? fecharBusca() : setBuscaAberta(true)} />
          <BotaoBarra icone="pastas" rotulo="Projetos" aoClicar={() => aoAbrir("cases")} />
        </div>
      </div>

      {buscaAberta && (
        <form className="perfil-busca" id="perfil-busca" role="search" aria-label="Buscar no perfil" onSubmit={(e) => e.preventDefault()} onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            fecharBusca();
          }
        }}>
          <label htmlFor="perfil-consulta">Buscar no perfil</label>
          <input ref={buscaRef} id="perfil-consulta" type="search" value={consulta} onChange={(e) => setConsulta(e.target.value)} placeholder="Ex.: Figma, Shopify ou SouJunior" aria-describedby="perfil-busca-ajuda" />
          <button type="button" className="xp-button" onClick={() => { setConsulta(""); buscaRef.current?.focus(); }} disabled={!consulta}>Limpar</button>
          <button type="button" className="xp-button" onClick={fecharBusca}>Fechar busca</button>
          <p id="perfil-busca-ajuda">Pesquise em todas as abas. Selecione um resultado para ir até o item.</p>
        </form>
      )}

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
          <div className={`painel-rolagem ${aba === "projetos" && !buscando ? "is-projects" : ""}`} ref={rolagemRef}>
            <div className="painel-limite" id="painel-conteudo" role="tabpanel" aria-labelledby={buscando ? "perfil-resultados-titulo" : `aba-${aba}`}>
              {buscando ? <ResultadosPerfil consulta={consulta} resultados={resultados} aoSelecionar={selecionarResultado} /> : <>
              {aba !== "projetos" && <h3 className="painel-titulo">{atual.endereco}</h3>}

              {aba === "sobre" && (
                <div className="painel-cartao painel-perfil" id="perfil-sobre" tabIndex={-1}>
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
                      Sou Product Designer morando em São José do Rio Preto. De dia desenho e-commerces na <a className="sobre-link" href={SITE_SHOPIFY} target="_blank" rel="noopener noreferrer">Shopify<span className="sr-only"> (abre em nova aba)</span></a> pela <a className="sobre-link" href={SITE_DISCO} target="_blank" rel="noopener noreferrer">Agência Disco<span className="sr-only"> (abre em nova aba)</span></a>. À noite, crio pequenos projetos inusitados na interseção entre tecnologia e design.
                    </p>
                  </div>
                </div>
              )}

              {aba === "experiencia" && (
                <>
                  <ListaExp itens={EXPERIENCIAS} prefixo="experiencia" />
                  <h4 className="painel-subtitulo">Adicional</h4>
                  <ListaExp itens={ADICIONAL} prefixo="adicional" />
                </>
              )}

              {aba === "educacao" && (
                <>
                  <Linhas itens={EDUCACAO} prefixo="educacao" />
                  <h4 className="painel-subtitulo">Certificações</h4>
                  <Linhas itens={CERTIFICACOES} prefixo="certificacao" />
                </>
              )}

              {aba === "habilidades" && (
                <>
                  <ul className="painel-mosaico">
                    {HABILIDADES.map((h, i) => (
                      <li key={h.nome} className="painel-item" id={`perfil-habilidade-${i}`} tabIndex={-1}>
                        <img src={`${P}/${h.icone}.png`} alt="" width="40" height="40" draggable="false" />
                        <strong>{h.nome}</strong>
                      </li>
                    ))}
                  </ul>
                  <Tags titulo="Ferramentas" itens={FERRAMENTAS} id="perfil-ferramentas" />
                  <Tags titulo="Línguas" itens={LINGUAS} id="perfil-linguas" />
                </>
              )}

              {aba === "desenvolvimento" && (
                <>
                  <p className="painel-selo-linha"><span className="painel-selo">{DESENVOLVIMENTO.selo}</span></p>
                  <Tags titulo="Tecnologias" itens={DESENVOLVIMENTO.itens} id="perfil-desenvolvimento" />
                </>
              )}

              {aba === "projetos" && (
                <div className="perfil-projects" id="perfil-projetos" tabIndex={-1}>
                  <ProjectsExplorer onNavigate={onNavigate} embedded />
                </div>
              )}

              {aba === "contato" && <ContatoConteudo aoEscrever={() => aoAbrir("contato")} />}
              </>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContatoConteudo({ aoEscrever }) {
  return (
    <div className="painel-contato" id="perfil-contato" tabIndex={-1}>
      <ul className="painel-redes painel-redes--social">
        {["linkedin", "email", "whatsapp", "dribbble", "behance"].map((rede) => (
          <li key={rede}>
            <SocialLink rede={rede} variante="tile" onClick={rede === "email" ? aoEscrever : undefined} />
          </li>
        ))}
      </ul>
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
