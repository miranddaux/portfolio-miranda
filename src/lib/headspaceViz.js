// Visualizações da Headspace. Todas leem as frequências e a onda reais do AnalyserNode.
export const MODOS = ["Barras de espectro", "Ondas circulares", "MilkDrop retrô", "Osciloscópio"];

const media = (dados, de, ate) => {
  let s = 0;
  for (let i = de; i < ate; i++) s += dados[i];
  return s / Math.max(1, ate - de) / 255;
};
// Agrupa as frequências em N faixas com escala quase logarítmica (graves ocupam menos espaço que na escala linear).
const faixas = (dados, n) => {
  const max = 640, out = new Array(n);
  for (let i = 0; i < n; i++) {
    const a = Math.floor(2 + (max - 2) * ((i / n) ** 1.8)), b = Math.max(a + 1, Math.floor(2 + (max - 2) * (((i + 1) / n) ** 1.8)));
    out[i] = media(dados, a, b);
  }
  return out;
};

export function criarVisualizador() {
  const picos = new Array(48).fill(0);
  let giro = 0, tom = 120;
  return function desenhar(modo, ctx, w, h, freq, onda) {
    if (modo === 0) {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#2b0d00"); g.addColorStop(1, "#050100");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      const n = 40, b = faixas(freq, n), largura = w / n;
      const cor = ctx.createLinearGradient(0, h, 0, 0);
      cor.addColorStop(0, "#8a2c00"); cor.addColorStop(0.55, "#ff8a00"); cor.addColorStop(1, "#ffe45c");
      for (let i = 0; i < n; i++) {
        const alt = Math.max(2, b[i] * h * 0.95);
        picos[i] = Math.max(alt, picos[i] - h * 0.006);
        ctx.fillStyle = cor;
        ctx.fillRect(i * largura + 1, h - alt, largura - 2, alt);
        ctx.fillStyle = "#ffe9a0";
        ctx.fillRect(i * largura + 1, h - picos[i] - 2, largura - 2, 2);
      }
    } else if (modo === 1) {
      ctx.fillStyle = "#031503"; ctx.fillRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2, base = Math.min(w, h) * 0.5, graves = media(freq, 1, 12), medios = media(freq, 12, 120);
      giro += 0.004 + graves * 0.03;
      ctx.lineCap = "round"; ctx.shadowColor = "#37ff6a"; ctx.shadowBlur = 8;
      const raios = 56, b = faixas(freq, raios);
      for (let i = 0; i < raios; i++) {
        const a = giro + (i / raios) * Math.PI * 2, r0 = base * 0.22, r1 = r0 + b[i] * base * 0.78;
        ctx.strokeStyle = `rgba(80, 255, 120, ${0.35 + b[i] * 0.65})`; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); ctx.stroke();
      }
      [0.3, 0.52, 0.78].forEach((k, j) => {
        ctx.strokeStyle = `rgba(120, 255, 150, ${0.4 + medios * 0.6})`; ctx.lineWidth = 1 + graves * 3;
        ctx.beginPath(); ctx.arc(cx, cy, base * k * (1 + (j === 0 ? graves : medios) * 0.25), 0, Math.PI * 2); ctx.stroke();
      });
      ctx.shadowBlur = 0;
    } else if (modo === 2) {
      const cx = w / 2, cy = h / 2, graves = media(freq, 1, 10), agudos = media(freq, 80, 300);
      ctx.save();
      ctx.globalAlpha = 0.92; ctx.translate(cx, cy); ctx.rotate(0.012 + graves * 0.03); ctx.scale(1.012 + graves * 0.03, 1.012 + graves * 0.03);
      ctx.drawImage(ctx.canvas, -cx, -cy, w, h);
      ctx.restore();
      ctx.fillStyle = "rgba(0, 0, 12, 0.06)"; ctx.fillRect(0, 0, w, h);
      tom = (tom + 0.6 + agudos * 8) % 360;
      ctx.globalCompositeOperation = "lighter"; ctx.lineWidth = 2; ctx.lineCap = "round";
      ctx.strokeStyle = `hsla(${tom}, 100%, 60%, 0.9)`;
      ctx.beginPath();
      for (let i = 0; i < onda.length; i += 8) {
        const x = (i / onda.length) * w, y = cy + ((onda[i] - 128) / 128) * h * 0.4;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.strokeStyle = `hsla(${(tom + 140) % 360}, 100%, 60%, ${0.3 + graves})`; ctx.lineWidth = 1 + graves * 4;
      ctx.beginPath(); ctx.arc(cx, cy, 8 + graves * Math.min(w, h) * 0.4, 0, Math.PI * 2); ctx.stroke();
      ctx.globalCompositeOperation = "source-over";
    } else {
      ctx.fillStyle = "#00110a"; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(60, 255, 130, 0.14)"; ctx.lineWidth = 1;
      for (let x = 0; x <= w; x += w / 10) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y <= h; y += h / 6) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      ctx.shadowColor = "#37ff6a"; ctx.shadowBlur = 10; ctx.lineWidth = 2; ctx.strokeStyle = "#7dffa6";
      ctx.beginPath();
      for (let i = 0; i < onda.length; i += 2) {
        const x = (i / onda.length) * w, y = h / 2 + ((onda[i] - 128) / 128) * h * 0.45;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.strokeStyle = "rgba(160, 200, 255, 0.55)"; ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < onda.length; i += 4) {
        const j = (i + 120) % onda.length, x = (i / onda.length) * w, y = h / 2 - ((onda[j] - 128) / 128) * h * 0.3;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke(); ctx.shadowBlur = 0;
    }
  };
}
