// Motor do DOOM (id Software) em WebAssembly: 640x400, shareware, só teclado e sem som.
// Compilado por Cornelius Diekmann (wasm-fizzbuzz), distribuído no pacote npm "wasm-doom" (GPL-2.0).
// Este carregador é nosso: ao contrário do pacote, ele sabe parar o jogo e soltar o teclado.
export const DOOM_W = 640;
export const DOOM_H = 400;
const WASM_URL = "/assets/doom/doom.wasm";

let modulo = null; // o arquivo é baixado uma vez só; reabrir o jogo reaproveita
const carregarModulo = () => (modulo ||= WebAssembly.compileStreaming(fetch(WASM_URL)).catch((e) => { modulo = null; throw e; }));

// Teclas do navegador -> códigos do DOOM
const CODIGOS = { 8: 127, 16: 182, 17: 157, 18: 184, 37: 172, 38: 173, 39: 174, 40: 175 };
const codigo = (k) => CODIGOS[k] ?? (k >= 65 && k <= 90 ? k + 32 : k >= 112 && k <= 123 ? k + 75 : k);

export async function iniciarDoom({ canvas, alvo }) {
  const compilado = await carregarModulo();
  const memoria = new WebAssembly.Memory({ initial: 108 });
  const ctx = canvas.getContext("2d");
  canvas.width = DOOM_W;
  canvas.height = DOOM_H;
  const instancia = await WebAssembly.instantiate(compilado, {
    js: {
      js_console_log: () => {}, js_stdout: () => {}, js_stderr: () => {},
      js_draw_screen: (p) => ctx.putImageData(new ImageData(new Uint8ClampedArray(memoria.buffer, p, DOOM_W * DOOM_H * 4).slice(), DOOM_W, DOOM_H), 0, 0),
      js_milliseconds_since_start: () => performance.now(),
    },
    env: { memory: memoria },
  });
  const ex = instancia.exports;
  const tecla = (tipo) => (e) => {
    if (tipo === 0 && e.repeat) { e.preventDefault(); e.stopPropagation(); return; }
    if (e.metaKey) return; // atalhos do sistema continuam funcionando
    ex.add_browser_event(tipo, codigo(e.keyCode));
    e.preventDefault(); e.stopPropagation();
  };
  const baixo = tecla(0), cima = tecla(1);
  alvo.addEventListener("keydown", baixo);
  alvo.addEventListener("keyup", cima);
  ex.main();
  let raf = 0, vivo = true;
  const passo = () => { if (!vivo) return; ex.doom_loop_step(); raf = requestAnimationFrame(passo); };
  raf = requestAnimationFrame(passo);
  return {
    // solta teclas presas (ex.: ao perder o foco)
    soltarTudo: () => [17, 16, 18, 32, 37, 38, 39, 40, 13, 27].forEach((k) => ex.add_browser_event(1, codigo(k))),
    parar: () => { vivo = false; cancelAnimationFrame(raf); alvo.removeEventListener("keydown", baixo); alvo.removeEventListener("keyup", cima); },
  };
}
