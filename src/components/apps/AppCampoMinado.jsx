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
const Rosto = ({ tipo }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="10" fill="#ffe83a" stroke="#222" strokeWidth="1.2" />
    {tipo === "venceu" ? <path d="M4.500 10h15M6 9.500h5v3H6zM13 9.500h5v3h-5z" fill="#222" stroke="#222" strokeWidth="1" /> : tipo === "perdeu" ? <path d="M7 8l4 4M11 8l-4 4M13 8l4 4M17 8l-4 4" stroke="#222" strokeWidth="1.5" strokeLinecap="round" /> : <><circle cx="8.500" cy="10" r="1.400" fill="#222" /><circle cx="15.500" cy="10" r="1.400" fill="#222" /></>}
    {tipo === "perdeu" ? <path d="M8 17c1.500-2 6.500-2 8 0" fill="none" stroke="#222" strokeWidth="1.500" strokeLinecap="round" /> : tipo === "preso" ? <circle cx="12" cy="16" r="2" fill="#222" /> : <path d="M7.500 14.500c2 3 7 3 9 0" fill="none" stroke="#222" strokeWidth="1.500" strokeLinecap="round" />}
  </svg>
);
const led = (n) => String(Math.max(-99, Math.min(999, n))).padStart(3, "0");

export default function AppCampoMinado() {
  const [t, setT] = useState(vazio);
  const [estado, setEstado] = useState("pronto"); // pronto | jogando | venceu | perdeu
  const [tempo, setTempo] = useState(0);
  const [preso, setPreso] = useState(false);
  const segurou = useRef(false), pressao = useRef(null);
  const fim = estado === "venceu" || estado === "perdeu";
  useEffect(() => {
    if (estado !== "jogando") return undefined;
    const id = setInterval(() => setTempo((s) => Math.min(999, s + 1)), 1000);
    return () => clearInterval(id);
  }, [estado]);
  const reiniciar = () => { setT(vazio()); setEstado("pronto"); setTempo(0); };
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
  const status = estado === "venceu" ? "Você venceu!" : estado === "perdeu" ? "Fim de jogo. Tente de novo." : estado === "jogando" ? "Clique direito marca bandeira." : "Clique em uma casa para começar.";

  return (
    <div className="app-ms">
      <div className="app-ms-topo">
        <span className="app-ms-led" role="img" aria-label={`Minas restantes: ${MINAS - bandeiras}`}>{led(MINAS - bandeiras)}</span>
        <button type="button" className="app-ms-rosto" onClick={reiniciar} aria-label="Novo jogo">
          <Rosto tipo={estado === "venceu" ? "venceu" : estado === "perdeu" ? "perdeu" : preso ? "preso" : "normal"} />
        </button>
        <span className="app-ms-led" role="img" aria-label={`Tempo: ${tempo} segundos`}>{led(tempo)}</span>
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
              {c.aberta ? (c.mina ? "✹" : c.n || "") : c.bandeira ? "⚑" : ""}
            </button>
          );
        })}
      </div>
      <p className="app-ms-status" aria-live="polite">{status}</p>
    </div>
  );
}
