import { ABAS_PERFIL } from "../data/perfilSearch.js";

export default function ResultadosPerfil({ consulta, resultados, aoSelecionar }) {
  return (
    <section className="perfil-resultados" aria-labelledby="perfil-resultados-titulo">
      <h3 className="painel-titulo" id="perfil-resultados-titulo">Resultados da busca</h3>
      <p className="perfil-busca-status" role="status">
        {resultados.length} {resultados.length === 1 ? "item encontrado" : "itens encontrados"} para “{consulta.trim()}”.
      </p>
      {resultados.length ? (
        <ul className="perfil-resultados-lista">
          {resultados.map((item) => (
            <li key={item.id}>
              <button type="button" className="perfil-resultado" onClick={() => aoSelecionar(item)}>
                <span className="perfil-resultado-aba">{ABAS_PERFIL.find((a) => a.id === item.aba).nome}</span>
                <strong>{item.titulo}</strong>
                <span>{item.texto}</span>
                <span className="perfil-resultado-acao">Ver na aba →</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="perfil-busca-status">Tente outro termo, como Figma, Shopify, formação ou mentoria.</p>
      )}
    </section>
  );
}
