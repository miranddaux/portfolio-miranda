import { useEffect, useRef, useState } from "react";
import { Download, Eraser, Paintbrush, Pencil, Trash2 } from "lucide-react";

const CORES = ["#000000", "#808080", "#800000", "#808000", "#008000", "#008080", "#000080", "#800080", "#808040", "#004040", "#0080ff", "#004080", "#4000ff", "#804000",
  "#ffffff", "#c0c0c0", "#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#ff00ff", "#ffff80", "#00ff80", "#80ffff", "#8080ff", "#ff0080", "#ff8040"];
const FERRAMENTAS = [
  { id: "lapis", nome: "Lápis", Icone: Pencil, base: 2 },
  { id: "pincel", nome: "Pincel", Icone: Paintbrush, base: 0 },
  { id: "borracha", nome: "Borracha", Icone: Eraser, base: 0 },
];
const TAMANHOS = [4, 8, 16, 24];
const L = 640, A = 400;

// Paint simples: lápis, pincel, borracha, 28 cores e 4 tamanhos. Salva o desenho como PNG.
export default function AppPaint() {
  const tela = useRef(null), ultimo = useRef(null);
  const [ferramenta, setFerramenta] = useState("lapis");
  const [cor, setCor] = useState("#000000");
  const [tamanho, setTamanho] = useState(8);
  useEffect(() => { ctx(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const ctx = () => {
    const c = tela.current.getContext("2d");
    if (!c.__pronto) { c.fillStyle = "#fff"; c.fillRect(0, 0, L, A); c.__pronto = true; }
    return c;
  };
  const ponto = (e) => {
    const r = tela.current.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * L) / r.width, y: ((e.clientY - r.top) * A) / r.height };
  };
  const tracar = (de, para) => {
    const c = ctx();
    c.lineCap = "round"; c.lineJoin = "round";
    c.strokeStyle = ferramenta === "borracha" ? "#fff" : cor;
    c.lineWidth = ferramenta === "lapis" ? 2 : ferramenta === "borracha" ? tamanho * 2 : tamanho;
    c.beginPath(); c.moveTo(de.x, de.y); c.lineTo(para.x + 0.01, para.y); c.stroke();
  };
  const iniciar = (e) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    ultimo.current = ponto(e);
    tracar(ultimo.current, ultimo.current);
  };
  const mover = (e) => {
    if (!ultimo.current) return;
    const p = ponto(e);
    tracar(ultimo.current, p);
    ultimo.current = p;
  };
  const parar = () => { ultimo.current = null; };
  const limpar = () => { const c = tela.current.getContext("2d"); c.fillStyle = "#fff"; c.fillRect(0, 0, L, A); c.__pronto = true; };
  const salvar = () => tela.current.toBlob((b) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(b); a.download = "desenho-paint.png"; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  return (
    <div className="app-paint">
      <div className="app-paint-corpo">
        <div className="app-paint-ferramentas" role="toolbar" aria-label="Ferramentas" aria-orientation="vertical">
          {FERRAMENTAS.map(({ id, nome, Icone }) => (
            <button key={id} type="button" aria-label={nome} title={nome} aria-pressed={ferramenta === id} onClick={() => setFerramenta(id)}><Icone size={16} aria-hidden="true" /></button>
          ))}
          <button type="button" aria-label="Limpar tudo" title="Limpar tudo" onClick={limpar}><Trash2 size={16} aria-hidden="true" /></button>
          <button type="button" aria-label="Salvar como PNG" title="Salvar como PNG" onClick={salvar}><Download size={16} aria-hidden="true" /></button>
          <div className="app-paint-tamanhos" role="group" aria-label="Espessura do traço">
            {TAMANHOS.map((t) => (
              <button key={t} type="button" aria-label={`Espessura ${t}`} aria-pressed={tamanho === t} onClick={() => setTamanho(t)}><i style={{ height: Math.max(2, t / 4) }} /></button>
            ))}
          </div>
        </div>
        <div className="app-paint-area">
          <canvas ref={tela} width={L} height={A} aria-label="Área de desenho: use o mouse ou o toque" onPointerDown={iniciar} onPointerMove={mover} onPointerUp={parar} onPointerCancel={parar} />
        </div>
      </div>
      <div className="app-paint-paleta">
        <span className="app-paint-atual" style={{ background: cor }} role="img" aria-label={`Cor atual ${cor}`} />
        <div className="app-paint-cores" role="group" aria-label="Cores">
          {CORES.map((c) => <button key={c} type="button" style={{ background: c }} aria-label={`Cor ${c}`} aria-pressed={cor === c} onClick={() => setCor(c)} />)}
        </div>
      </div>
    </div>
  );
}
