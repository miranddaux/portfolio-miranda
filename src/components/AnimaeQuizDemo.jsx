import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, Heart, Zap } from "lucide-react";
import "@fontsource/urbanist/latin-400.css";
import "@fontsource/urbanist/latin-600.css";
import "@fontsource/urbanist/latin-700.css";

// Quiz do Draco do ANIMAE refeito em código para o portfólio, com as regras do app:
// 15 s por pergunta, 3 vidas, +2 XP por acerto (máx. 20), o Draco reage a cada resposta.
// No app são 10 perguntas geradas no servidor a partir do catálogo; aqui são 3 perguntas de exemplo.
const DESIGN = { width: 430, height: 932 };
const SEGUNDOS = 15;
const VIDAS = 3;
const XP_ACERTO = 2;
const FEEDBACK_MS = 1300;
const PERGUNTAS = [
  { q: "Qual destes animes tem mais episódios?", opcoes: ["Demon Slayer", "One Piece", "Attack on Titan", "Death Note"], certa: 1 },
  { q: "Tanjiro Kamado é o protagonista de qual anime?", opcoes: ["Naruto", "Bleach", "Demon Slayer", "Jujutsu Kaisen"], certa: 2 },
  { q: "Qual destes foi lançado primeiro?", opcoes: ["Attack on Titan", "Naruto", "Demon Slayer", "Dragon Ball Z"], certa: 3 },
];
const A = "/assets/cases";
const DRACO = { cabeca: `${A}/animae-draco-head.webp`, ace: `${A}/animae-draco-ace.webp`, good: `${A}/animae-draco-good.webp`, low: `${A}/animae-draco-low.webp` };

function patente(acertos) {
  const pct = (acertos / PERGUNTAS.length) * 100;
  if (pct >= 80) return { titulo: "Sensei do Anime", frase: "Nem o Draco te segura. Que aula!", img: DRACO.ace };
  if (pct >= 60) return { titulo: "Otaku Veterano", frase: "Você manda bem. Falta pouco pro topo.", img: DRACO.good };
  return { titulo: "Calouro", frase: "Todo mestre começou assim. Tenta de novo!", img: DRACO.low };
}

export default function AnimaeQuizDemo() {
  const root = useRef(null);
  const tela = useRef(null);
  const timer = useRef(null);
  const [i, setI] = useState(0);
  const [escolha, setEscolha] = useState(null); // índice, ou -1 se acabou o tempo
  const [acertos, setAcertos] = useState(0);
  const [vidas, setVidas] = useState(VIDAS);
  const [seq, setSeq] = useState(0);
  const [melhor, setMelhor] = useState(0);
  const [tempo, setTempo] = useState(SEGUNDOS);
  const [fim, setFim] = useState(false);

  useLayoutEffect(() => {
    const el = root.current;
    const ajustar = () => {
      const largura = el.clientWidth || el.getBoundingClientRect().width;
      if (largura > 0) tela.current?.style.setProperty("--qd-scale", String(largura / DESIGN.width));
    };
    ajustar();
    const ro = new ResizeObserver(ajustar);
    ro.observe(el);
    window.addEventListener("load", ajustar);
    return () => { ro.disconnect(); window.removeEventListener("load", ajustar); };
  }, []);

  const respondida = escolha !== null;
  const xp = Math.min(acertos * XP_ACERTO, PERGUNTAS.length * XP_ACERTO);

  const responder = useCallback((opcao) => {
    if (escolha !== null || fim) return;
    const p = PERGUNTAS[i];
    const acertou = opcao === p.certa;
    let novosAcertos = acertos, novasVidas = vidas;
    setEscolha(opcao);
    if (acertou) { novosAcertos = acertos + 1; setAcertos(novosAcertos); setSeq((s) => { const n = s + 1; setMelhor((m) => Math.max(m, n)); return n; }); }
    else { novasVidas = vidas - 1; setVidas(novasVidas); setSeq(0); }
    timer.current = setTimeout(() => {
      if (novasVidas <= 0 || i + 1 >= PERGUNTAS.length) setFim(true);
      else { setI(i + 1); setEscolha(null); setTempo(SEGUNDOS); }
    }, FEEDBACK_MS);
  }, [escolha, fim, i, acertos, vidas]);

  // Cronômetro: só corre enquanto a tela está visível e a pergunta está aberta.
  const visivel = useRef(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { visivel.current = e.isIntersecting; }, { threshold: 0.3 });
    io.observe(root.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (fim || respondida) return undefined;
    const id = setInterval(() => { if (visivel.current) setTempo((t) => Math.max(0, +(t - 0.1).toFixed(1))); }, 100);
    return () => clearInterval(id);
  }, [fim, respondida, i]);
  useEffect(() => { if (!fim && !respondida && tempo <= 0) responder(-1); }, [tempo, fim, respondida, responder]);
  useEffect(() => () => clearTimeout(timer.current), []);

  const jogarDeNovo = () => { setI(0); setEscolha(null); setAcertos(0); setVidas(VIDAS); setSeq(0); setMelhor(0); setTempo(SEGUNDOS); setFim(false); };

  const p = PERGUNTAS[i];
  const urgente = tempo <= 5 && !respondida;
  const reacao = !respondida ? DRACO.cabeca : escolha === p.certa ? DRACO.ace : DRACO.low;
  const rank = patente(acertos);

  return (
    <div ref={root} className="qd-root" role="group" aria-label="Demonstração do Quiz do Draco do ANIMAE: responda as perguntas para ganhar XP">
      <div ref={tela} className="qd-screen" style={{ width: DESIGN.width, height: DESIGN.height }}>
        <div className="qd-status" aria-hidden="true"><span>9:41</span></div>
        {!fim ? (
          <div className="qd-body">
            <div className="qd-top">
              <span className="qd-round" aria-hidden="true"><ArrowLeft size={24} /></span>
              <span className="qd-hearts" aria-label={`${vidas} vidas`}>
                {Array.from({ length: VIDAS }).map((_, n) => <Heart key={n} size={24} className={n < vidas ? "is-on" : "is-off"} fill={n < vidas ? "currentColor" : "none"} aria-hidden="true" />)}
              </span>
              <span className="qd-grow" />
              <span className="qd-xp"><span className="qd-xp-row"><Zap size={24} fill="currentColor" aria-hidden="true" />{xp} XP</span><span className="qd-meta">Quiz do dia · {i + 1}/{PERGUNTAS.length}</span></span>
            </div>
            <div className="qd-time">
              <span className="qd-bar"><span className={`qd-bar-fill ${urgente ? "is-urgent" : ""}`} style={{ width: `${(tempo / SEGUNDOS) * 100}%` }} /></span>
              <span className="qd-time-row"><span className={urgente ? "is-urgent" : ""}>{Math.ceil(tempo)}s</span>{seq >= 2 && <strong>{seq} acertos seguidos</strong>}</span>
            </div>
            <div className="qd-ask">
              <img src={reacao} alt="" width="160" height="180" draggable="false" />
              <p>{p.q}</p>
            </div>
            <p className={`qd-result ${respondida ? (escolha === p.certa ? "is-ok" : "is-bad") : ""}`} aria-live="polite">
              {respondida ? (escolha === p.certa ? `Acertou! +${XP_ACERTO} XP` : escolha === -1 ? "Acabou o tempo!" : "Errou! A certa está destacada.") : " "}
            </p>
            <div className="qd-options">
              {p.opcoes.map((o, n) => {
                const estado = respondida ? (n === p.certa ? "is-correct" : n === escolha ? "is-wrong" : "") : "";
                return <button key={o} type="button" className={`qd-option ${estado}`} disabled={respondida} onClick={() => responder(n)}>{o}</button>;
              })}
            </div>
          </div>
        ) : (
          <div className="qd-end">
            <img src={rank.img} alt="" className="qd-end-draco" draggable="false" />
            <span className="qd-kicker">{vidas <= 0 ? "FIM DE JOGO" : "QUIZ CONCLUÍDO"}</span>
            <h3>{rank.titulo}</h3>
            <p>{rank.frase}</p>
            <div className="qd-stats">
              {[["Acertos", `${acertos}/${PERGUNTAS.length}`], ["XP ganho", `+${xp}`], ["Melhor sequência", String(melhor)]].map(([l, v]) => <div key={l}><strong>{v}</strong><span>{l}</span></div>)}
            </div>
            <span className="qd-pill"><Zap size={24} fill="currentColor" aria-hidden="true" />{xp > 0 ? `+${xp} XP somados ao seu perfil` : "Acerte perguntas pra ganhar XP"}</span>
            <button type="button" className="qd-cta" onClick={jogarDeNovo}>Jogar de novo</button>
          </div>
        )}
      </div>
    </div>
  );
}
