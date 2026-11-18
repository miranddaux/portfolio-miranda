// Sons no estilo do MSN, sintetizados no navegador (sem arquivo de áudio de terceiros).
let ctx;
function contexto() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = ctx || new AC();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

function tocar(notas, { tipo = "sine", volume = 0.16, duracao = 0.35 } = {}) {
  try {
    const c = contexto();
    if (!c) return;
    const t0 = c.currentTime + 0.02;
    notas.forEach(([freq, em, dur = duracao]) => {
      const osc = c.createOscillator();
      const ganho = c.createGain();
      osc.type = tipo;
      osc.frequency.value = freq;
      ganho.gain.setValueAtTime(0.0001, t0 + em);
      ganho.gain.exponentialRampToValueAtTime(volume, t0 + em + 0.015);
      ganho.gain.exponentialRampToValueAtTime(0.0001, t0 + em + dur);
      osc.connect(ganho).connect(c.destination);
      osc.start(t0 + em);
      osc.stop(t0 + em + dur + 0.05);
    });
  } catch {}
}

// Mensagem recebida: arquivo enviado pelo Thiago (public/assets/audio/msn-mensagem.mp3).
// Um toque por resposta (não sobrepõe). Se o navegador bloquear o áudio, usa o som sintetizado.
let audioMsg;
let ultimoToque = 0;
const somMensagemSintetizado = () =>
  tocar([
    [1046.5, 0, 0.18],
    [1568, 0.09, 0.3],
    [2093, 0.09, 0.3],
  ], { tipo: "triangle", volume: 0.12 });

// Carrega e decodifica o toque antes da primeira mensagem, para o navegador não travar a rolagem na hora de tocar.
export const prepararSomMensagem = () => {
  try {
    if (audioMsg) return;
    audioMsg = new Audio("/assets/audio/msn-mensagem.mp3");
    audioMsg.preload = "auto";
    audioMsg.load();
  } catch {}
};

export const somMensagem = () => {
  const agora = Date.now();
  if (agora - ultimoToque < 700) return;
  ultimoToque = agora;
  try {
    audioMsg = audioMsg || new Audio("/assets/audio/msn-mensagem.mp3");
    audioMsg.volume = 0.6;
    audioMsg.currentTime = 0;
    const p = audioMsg.play();
    if (p && p.catch) p.catch(somMensagemSintetizado);
  } catch {
    somMensagemSintetizado();
  }
};

// Mensagem enviada: clique suave.
export const somEnviar = () => tocar([[660, 0, 0.08]], { tipo: "sine", volume: 0.06 });

// Aviso / contato ficou online: três notas subindo.
export const somAviso = () =>
  tocar([
    [784, 0, 0.22],
    [988, 0.12, 0.22],
    [1318.5, 0.24, 0.4],
  ], { tipo: "triangle", volume: 0.12 });

// Chamar a atenção: som enviado pelo Thiago (public/assets/audio/msn-chamar.mp3).
let audioChamar;
export const somChamar = () => {
  try {
    audioChamar = audioChamar || new Audio("/assets/audio/msn-chamar.mp3");
    audioChamar.volume = 1;
    audioChamar.currentTime = 0;
    const p = audioChamar.play();
    if (p && p.catch) p.catch(somChamarSintetizado);
  } catch {
    somChamarSintetizado();
  }
};
const somChamarSintetizado = () =>
  tocar([
    [196, 0, 0.12],
    [220, 0.12, 0.12],
    [196, 0.24, 0.12],
    [220, 0.36, 0.12],
  ], { tipo: "square", volume: 0.05 });

// Desligar/reiniciar: se existir public/assets/audio/windows-xp-shutdown.mp3, toca o arquivo; senão, um acorde sintetizado simples.
let audioDesligar;
const somDesligarSintetizado = () =>
  tocar([
    [784, 0, 0.5],
    [659.25, 0.35, 0.5],
    [523.25, 0.7, 0.5],
    [392, 1.05, 0.9],
  ], { tipo: "sine", volume: 0.1 });
export const somDesligar = () => {
  let falhou = false;
  const sintetizar = () => { if (!falhou) { falhou = true; somDesligarSintetizado(); } };
  try {
    audioDesligar = audioDesligar || new Audio("/assets/audio/windows-xp-shutdown.mp3");
    audioDesligar.volume = 0.5;
    audioDesligar.currentTime = 0;
    audioDesligar.onerror = sintetizar;
    const p = audioDesligar.play();
    if (p && p.catch) p.catch(sintetizar);
  } catch {
    sintetizar();
  }
};
