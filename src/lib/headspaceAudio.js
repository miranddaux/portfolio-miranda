// Motor de áudio da Headspace: HTMLAudioElement -> equalizador de 10 bandas (BiquadFilterNode)
// -> analisador (visualizações) -> volume (GainNode) -> balance (StereoPannerNode) -> saída.
export const BANDAS = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
export const ROTULO_BANDAS = ["31", "62", "125", "250", "500", "1K", "2K", "4K", "8K", "16K"];

export function criarMotor(audio) {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  const ctx = new Ctx();
  const fonte = ctx.createMediaElementSource(audio);
  const filtros = BANDAS.map((f, i) => {
    const b = ctx.createBiquadFilter();
    b.type = i === 0 ? "lowshelf" : i === BANDAS.length - 1 ? "highshelf" : "peaking";
    b.frequency.value = f;
    b.Q.value = 1.1;
    b.gain.value = 0;
    return b;
  });
  let no = fonte;
  filtros.forEach((f) => { no.connect(f); no = f; });
  const analisador = ctx.createAnalyser();
  analisador.fftSize = 2048;
  analisador.smoothingTimeConstant = 0.78;
  const ganho = ctx.createGain();
  const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
  no.connect(analisador);
  analisador.connect(ganho);
  if (pan) { ganho.connect(pan); pan.connect(ctx.destination); } else ganho.connect(ctx.destination);
  return {
    ctx,
    analisador,
    retomar: () => (ctx.state === "suspended" ? ctx.resume() : Promise.resolve()),
    banda: (i, db) => { filtros[i].gain.value = db; },
    volume: (v) => { ganho.gain.value = v; },
    balance: (b) => { if (pan) pan.pan.value = b; },
    suportaBalance: Boolean(pan),
    fechar: () => ctx.close().catch(() => {}),
  };
}

// Faixa de demonstração gerada aqui mesmo (arpejo, baixo, bumbo e chimbal), para o player tocar sem baixar nada.
export function criarFaixaDemo() {
  const taxa = 22050, segundos = 32, n = taxa * segundos;
  const dados = new Float32Array(n);
  const acordes = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]; // Am, F, C, G
  const hz = (m) => 440 * 2 ** ((m - 69) / 12);
  const passo = 0.25; // colcheia a 120 bpm
  for (let s = 0; s < segundos / passo; s++) {
    const t0 = s * passo;
    const acorde = acordes[Math.floor(t0 / 2) % 4];
    const nota = acorde[s % 3] + (s % 6 >= 3 ? 12 : 0);
    const f = hz(nota);
    for (let i = 0; i < passo * taxa; i++) {
      const t = i / taxa, env = Math.exp(-t * 9);
      const q = (f * t) % 1;
      dados[Math.floor(t0 * taxa) + i] += (q < 0.5 ? 1 : -1) * 0.12 * env;
    }
    if (s % 2 === 0) { // baixo e bumbo nas batidas
      const fb = hz(acorde[0] - 12);
      for (let i = 0; i < 0.5 * taxa; i++) {
        const t = i / taxa;
        dados[Math.floor(t0 * taxa) + i] += Math.sin(2 * Math.PI * fb * t) * 0.22 * Math.exp(-t * 4);
        if (t < 0.18) dados[Math.floor(t0 * taxa) + i] += Math.sin(2 * Math.PI * (120 * t - 300 * t * t * 0.5) * 1.0 * 2) * 0.3 * Math.exp(-t * 18);
      }
    } else { // chimbal nas contratempos
      for (let i = 0; i < 0.08 * taxa; i++) dados[Math.floor(t0 * taxa) + i] += (Math.random() * 2 - 1) * 0.08 * Math.exp(-(i / taxa) * 60);
    }
  }
  const buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
  const txt = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  txt(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); txt(8, "WAVEfmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, taxa, true); v.setUint32(28, taxa * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); txt(36, "data"); v.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, dados[i])) * 32767, true);
  return URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
}

export const formatarTempo = (s) => {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};
