import { useCallback, useEffect, useRef, useState } from "react";

const limitar = (v, min, max) => Math.min(max, Math.max(min, v));

// Lógica de reprodução separada do visual. Tudo vem do HTMLMediaElement: nada de progresso simulado.
export function useMediaPlayer({ src, autoPlay = false, loop = false } = {}) {
  const videoRef = useRef(null);
  const [estado, setEstado] = useState({
    tocando: false, atual: 0, duracao: 0, volume: 1, mudo: false, carregando: Boolean(src), erro: null, terminou: false,
  });
  const mesclar = useCallback((p) => setEstado((e) => ({ ...e, ...p })), []);

  // Zera tudo ao trocar o vídeo.
  useEffect(() => {
    mesclar({ tocando: false, atual: 0, duracao: 0, carregando: Boolean(src), erro: null, terminou: false });
  }, [src, mesclar]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return undefined;
    const sync = () => mesclar({ atual: v.currentTime || 0, duracao: Number.isFinite(v.duration) ? v.duration : 0 });
    const on = {
      loadstart: () => mesclar({ carregando: Boolean(v.currentSrc), erro: null }),
      loadedmetadata: sync,
      durationchange: sync,
      timeupdate: sync,
      seeking: sync,
      seeked: sync,
      waiting: () => mesclar({ carregando: true }),
      canplay: () => mesclar({ carregando: false }),
      playing: () => mesclar({ carregando: false, tocando: true, terminou: false }),
      play: () => mesclar({ tocando: true, terminou: false }),
      pause: () => mesclar({ tocando: false }),
      ended: () => { sync(); mesclar({ tocando: false, terminou: true }); },
      volumechange: () => mesclar({ volume: v.volume, mudo: v.muted }),
      error: () => mesclar({ carregando: false, tocando: false, erro: "Não foi possível carregar este vídeo." }),
    };
    Object.entries(on).forEach(([n, f]) => v.addEventListener(n, f));
    mesclar({ volume: v.volume, mudo: v.muted });
    return () => Object.entries(on).forEach(([n, f]) => v.removeEventListener(n, f));
  }, [mesclar, src]); // o <video> é recriado quando o src muda, então os ouvintes são religados

  const tocar = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.currentSrc) return;
    if (v.ended) v.currentTime = 0;
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  }, []);
  const pausar = useCallback(() => videoRef.current?.pause(), []);
  const alternar = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || v.ended) tocar(); else pausar();
  }, [tocar, pausar]);
  const parar = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
    mesclar({ atual: 0, tocando: false, terminou: false });
  }, [mesclar]);
  const irPara = useCallback((segundos) => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration)) return;
    const t = limitar(segundos, 0, v.duration);
    v.currentTime = t;
    mesclar({ atual: t, terminou: false });
  }, [mesclar]);
  const pular = useCallback((delta) => {
    const v = videoRef.current;
    if (v) irPara((v.currentTime || 0) + delta);
  }, [irPara]);
  const definirVolume = useCallback((valor) => {
    const v = videoRef.current;
    if (!v) return;
    const n = limitar(valor, 0, 1);
    v.volume = n;
    v.muted = n === 0;
  }, []);
  const alternarMudo = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.muted || v.volume === 0) { v.muted = false; if (v.volume === 0) v.volume = 0.5; } else v.muted = true;
  }, []);

  return {
    videoRef, ...estado, autoPlay, loop,
    acoes: { tocar, pausar, alternar, parar, irPara, pular, definirVolume, alternarMudo },
  };
}

export function formatarTempo(s) {
  const t = Math.max(0, Math.floor(Number.isFinite(s) ? s : 0));
  const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), seg = t % 60;
  const dois = (n) => String(n).padStart(2, "0");
  return h ? `${h}:${dois(m)}:${dois(seg)}` : `${dois(m)}:${dois(seg)}`;
}
