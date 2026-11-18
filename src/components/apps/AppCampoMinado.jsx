import { useEffect, useRef, useState } from "react";

// Campo Minado 9 x 9 com 10 minas (nível iniciante). A primeira abertura nunca cai em uma mina.
// Clique abre, clique direito (ou segurar no toque, ou tecla F) marca bandeira.
const LINHAS = 9, COLUNAS = 9, MINAS = 10;
const vizinhos = (i) => {
  const r = Math.floor(i / COLUNAS), c = i % COLUNAS, lista = [];
  for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
    const nr = r + dr, nc = c + dc;
    if ((dr || dc) && nr >= 0 && nr < LINHAS && nc >= 0 && nc < COLUNAS) lista.push(nr * COLUNAS + nc);
  }
  return lista;
};
const vazio = () => Array.from({ length: LINHAS * COLUNAS }, () => ({ mina: false, aberta: false, bandeira: false, n: 0 }));
function semear(seguro) {
  const t = vazio();
  const livres = t.map((_, i) => i).filter((i) => i !== seguro);
  for (let k = 0; k < MINAS; k++) t[livres.splice(Math.floor(Math.random() * livres.length), 1)[0]].mina = true;
  t.forEach((c, i) => { c.n = vizinhos(i).filter((v) => t[v].mina).length; });
  return t;
}
function abrir(t, inicio) {
  const novo = t.map((c) => ({ ...c })), fila = [inicio];
  while (fila.length) {
    const i = fila.pop(), c = novo[i];
    if (c.aberta || c.bandeira) continue;
    c.aberta = true;
    if (c.n === 0 && !c.mina) fila.push(...vizinhos(i));
  }
  return novo;
}
// Rosto do botão: amarelo com contorno preto, como no Campo Minado clássico (desenhado aqui, em SVG).
const Rosto = ({ tipo }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="10.500" fill="#ffff00" stroke="#000" strokeWidth="1.200" />
    {tipo === "venceu" ? <path d="M3.500 10h17M5.500 9.500h6v3.500h-6zM12.500 9.500h6v3.500h-6z" fill="#000" stroke="#000" strokeWidth="1" /> : tipo === "perdeu" ? <path d="M6.500 7.500l3.500 3.500M10 7.500l-3.500 3.500M14 7.500l3.500 3.500M17.500 7.500L14 11" stroke="#000" strokeWidth="1.600" strokeLinecap="round" /> : <><circle cx="8.500" cy="9.500" r="1.500" fill="#000" /><circle cx="15.500" cy="9.500" r="1.500" fill="#000" /></>}
    {tipo === "perdeu" ? <path d="M7.500 17.500c1.500-2.500 7.500-2.500 9 0" fill="none" stroke="#000" strokeWidth="1.600" strokeLinecap="round" /> : tipo === "preso" ? <ellipse cx="12" cy="16" rx="2.200" ry="2.600" fill="#000" /> : <path d="M7 14.500c2.500 3.500 7.500 3.500 10 0" fill="none" stroke="#000" strokeWidth="1.600" strokeLinecap="round" />}
  </svg>
);
const Mina = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
    <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19" stroke="#000" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="12" r="6.500" fill="#000" />
    <rect x="8.500" y="8.500" width="3" height="3" fill="#fff" />
  </svg>
);
const Bandeira = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
    <path d="M13 3L5 7l8 4z" fill="#f00" />
    <path d="M13 3v14" stroke="#000" strokeWidth="2" />
    <path d="M7 19h12v2H7zM10 17h6v2h-6z" fill="#000" />
  </svg>
);
// Contador de três dígitos em sete segmentos, vermelho sobre preto.
const SEG = { a: "2,1 11,1 9,3 4,3", b: "12,2 12,10 10,9 10,4", c: "12,12 12,20 10,18 10,13", d: "2,21 11,21 9,19 4,19", e: "1,12 1,20 3,18 3,13", f: "1,2 1,10 3,9 3,4", g: "2,11 11,11 9,10 4,10.800 4,12 9,12" };
const LIGA = { 0: "abcdef", 1: "bc", 2: "abdeg", 3: "abcdg", 4: "bcfg", 5: "acdfg", 6: "acdefg", 7: "abc", 8: "abcdefg", 9: "abcdfg", "-": "g" };
const Digito = ({ d }) => (
  <svg viewBox="0 0 13 22" width="16" height="32" aria-hidden="true" focusable="false">
    {Object.entries(SEG).map(([k, pts]) => <polygon key={k} points={pts} fill={LIGA[d].includes(k) ? "#ff0000" : "#4a0000"} />)}
  </svg>
);
const Led = ({ valor, rotulo }) => (
  <span className="app-ms-led" role="img" aria-label={rotulo}>
    {String(Math.max(-99, Math.min(999, valor))).padStart(3, "0").split("").map((d, i) => <Digito key={i} d={d} />)}
  </span>
);

export default function AppCampoMinado() {
  const [t, setT] = useState(vazio);
  const [estado, setEstado] = useState("pronto"); // pronto | jogando | venceu | perdeu
  const [tempo, setTempo] = useState(0);
  const [preso, setPreso] = useState(false);
  const [menu, setMenu] = useState(null); // "jogo" | "ajuda" | null
  const [dica, setDica] = useState(false);
  const segurou = useRef(false), pressao = useRef(null);
  const fim = estado === "venceu" || estado === "perdeu";
  useEffect(() => {
    if (estado !== "jogando") return undefined;
    const id = setInterval(() => setTempo((s) => Math.min(999, s + 1)), 1000);
    return () => clearInterval(id);
  }, [estado]);
  const reiniciar = () => { setT(vazio()); setEstado("pronto"); setTempo(0); setMenu(null); setDica(false); };
  const bandeiras = t.filter((c) => c.bandeira).length;

  const abrirCasa = (i) => {
    if (fim || t[i].bandeira || t[i].aberta) return;
    let base = t;
    if (estado === "pronto") { base = semear(i); setEstado("jogando"); }
    if (base[i].mina) {
      setT(base.map((c, k) => (c.mina ? { ...c, aberta: true, explodiu: k === i } : c)));
      setEstado("perdeu");
      return;
    }
    const novo = abrir(base, i);
    setT(novo);
    if (novo.every((c) => c.mina || c.aberta)) {
      setT(novo.map((c) => (c.mina ? { ...c, bandeira: true } : c)));
      setEstado("venceu");
    }
  };
  const marcar = (i) => {
    if (fim || estado === "pronto" || t[i].aberta) return;
    setT((a) => a.map((c, k) => (k === i ? { ...c, bandeira: !c.bandeira } : c)));
  };
  const status = dica ? "Clique abre. Botão direito ou F marca bandeira." : estado === "venceu" ? "Você venceu!" : estado === "perdeu" ? "Fim de jogo." : estado === "jogando" ? "Jogando" : "Pronto";

  return (
    <div className="app-ms" onKeyDown={(e) => { if (e.key === "F2") { e.preventDefault(); reiniciar(); } if (e.key === "Escape") setMenu(null); }}>
      <div className="app-ms-menu" role="menubar" aria-label="Campo minado">
        {[["jogo", "Jogo"], ["ajuda", "Ajuda"]].map(([id, rotulo]) => (
          <span className="app-ms-menu-item" key={id}>
            <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded={menu === id} className={menu === id ? "is-aberto" : ""} onClick={() => setMenu(menu === id ? null : id)} onMouseEnter={() => menu && setMenu(id)}>{rotulo}</button>
            {menu === id && (
              <span className="app-ms-menu-lista" role="menu">
                {id === "jogo"
                  ? <button type="button" role="menuitem" onClick={reiniciar}>Novo jogo<kbd>F2</kbd></button>
                  : <button type="button" role="menuitem" onClick={() => { setDica(true); setMenu(null); }}>Como jogar</button>}
              </span>
            )}
          </span>
        ))}
      </div>
      <div className="app-ms-corpo" onClick={() => menu && setMenu(null)}>
        <div className="app-ms-topo">
          <Led valor={MINAS - bandeiras} rotulo={`Minas restantes: ${MINAS - bandeiras}`} />
          <button type="button" className="app-ms-rosto" onClick={reiniciar} aria-label="Novo jogo">
            <Rosto tipo={estado === "venceu" ? "venceu" : estado === "perdeu" ? "perdeu" : preso ? "preso" : "normal"} />
          </button>
          <Led valor={tempo} rotulo={`Tempo: ${tempo} segundos`} />
        </div>
        <div className="app-ms-tabuleiro" role="grid" aria-label="Campo minado" onContextMenu={(e) => e.preventDefault()}>
          {t.map((c, i) => {
            const r = Math.floor(i / COLUNAS) + 1, col = (i % COLUNAS) + 1;
            const rotulo = c.aberta ? (c.mina ? "mina" : c.n ? `${c.n} minas ao redor` : "vazia") : c.bandeira ? "bandeira" : "fechada";
            return (
              <button
                key={i}
                type="button"
                role="gridcell"
                aria-label={`Linha ${r}, coluna ${col}: ${rotulo}`}
                className={`app-ms-casa ${c.aberta ? "is-aberta" : ""} ${c.explodiu ? "is-explodiu" : ""} ${c.n ? `n${c.n}` : ""}`}
                onClick={() => { if (segurou.current) { segurou.current = false; return; } abrirCasa(i); }}
                onContextMenu={(e) => { e.preventDefault(); marcar(i); }}
                onKeyDown={(e) => { if (e.key === "f" || e.key === "F") { e.preventDefault(); marcar(i); } }}
                onPointerDown={(e) => {
                  setPreso(!fim);
                  if (e.pointerType === "touch") pressao.current = setTimeout(() => { segurou.current = true; marcar(i); }, 450);
                }}
                onPointerUp={() => { setPreso(false); clearTimeout(pressao.current); }}
                onPointerLeave={() => { setPreso(false); clearTimeout(pressao.current); }}
              >
                {c.aberta ? (c.mina ? <Mina /> : c.n || "") : c.bandeira ? <Bandeira /> : ""}
              </button>
            );
          })}
        </div>
      </div>
      <p className="app-ms-status" aria-live="polite">{status}</p>
    </div>
  );
}
