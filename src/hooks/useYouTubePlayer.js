import { useCallback, useEffect, useRef, useState } from "react";

const limitar = (v, min, max) => Math.min(max, Math.max(min, v));

// Extrai o ID de links do YouTube (watch, youtu.be, embed, shorts). Devolve null se não for YouTube.
export function idDoYouTube(url) {
  if (!url || typeof url !== "string") return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

// Carrega a API oficial de iframe do YouTube uma única vez.
let promessaApi;
function carregarApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!promessaApi) {
    promessaApi = new Promise((resolve, reject) => {
      const anterior = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { anterior?.(); resolve(window.YT); };
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.async = true;
      s.onerror = () => { promessaApi = null; reject(new Error("api")); };
      document.head.appendChild(s);
    });
  }
  return promessaApi;
}

const ERROS = {
  2: "Este vídeo não pôde ser carregado.",
  5: "O navegador não conseguiu reproduzir este vídeo.",
  100: "Este vídeo não está mais disponível.",
  101: "O dono do vídeo não permite exibi-lo aqui.",
  150: "O dono do vídeo não permite exibi-lo aqui.",
};

// Mesma interface do useMediaPlayer, mas controlando um vídeo do YouTube pela API oficial.
// Os controles do YouTube ficam desligados: quem controla é a moldura do Windows Media Player.
export function useYouTubePlayer({ videoId, autoPlay = false }) {
  const caixa = useRef(null);
  const player = useRef(null);
  const pronto = useRef(false);
  const quer = useRef({ autoPlay });
  const [estado, setEstado] = useState({ tocando: false, atual: 0, duracao: 0, volume: 1, mudo: false, carregando: Boolean(videoId), erro: null, terminou: false, titulo: "" });
  const mesclar = useCallback((p) => setEstado((e) => ({ ...e, ...p })), []);
  quer.current.autoPlay = autoPlay;

  // Cria o player uma vez por vídeo ativo (o <div> alvo é criado à mão para o React não brigar com o iframe).
  useEffect(() => {
    if (!videoId || !caixa.current) return undefined;
    let vivo = true;
    let timer;
    pronto.current = false;
    mesclar({ tocando: false, atual: 0, duracao: 0, carregando: true, erro: null, terminou: false, titulo: "" });
    const alvo = document.createElement("div");
    caixa.current.replaceChildren(alvo);

    const ler = () => {
      const p = player.current;
      if (!p || !pronto.current) return;
      try {
        const dur = p.getDuration?.() || 0;
        mesclar({
          atual: p.getCurrentTime?.() || 0,
          duracao: Number.isFinite(dur) ? dur : 0,
          volume: (p.getVolume?.() ?? 100) / 100,
          mudo: Boolean(p.isMuted?.()),
          titulo: p.getVideoData?.().title || "",
        });
      } catch { /* o player pode estar sendo recriado */ }
    };

    carregarApi().then((YT) => {
      if (!vivo) return;
      player.current = new YT.Player(alvo, {
        videoId,
        host: "https://www.youtube-nocookie.com",
        playerVars: { controls: 0, disablekb: 1, fs: 0, rel: 0, modestbranding: 1, playsinline: 1, iv_load_policy: 3, autoplay: quer.current.autoPlay ? 1 : 0, origin: window.location.origin },
        events: {
          onReady: (e) => {
            pronto.current = true;
            ler();
            mesclar({ carregando: false });
            if (quer.current.autoPlay) e.target.playVideo();
          },
          onStateChange: (e) => {
            const s = e.data; // -1 não iniciado, 0 fim, 1 tocando, 2 pausado, 3 carregando, 5 pronto
            ler();
            if (s === 1) mesclar({ tocando: true, carregando: false, terminou: false });
            else if (s === 2) mesclar({ tocando: false });
            else if (s === 3) mesclar({ carregando: true });
            else if (s === 0) mesclar({ tocando: false, terminou: true });
            else if (s === 5 || s === -1) mesclar({ tocando: false, carregando: false });
          },
          onError: (e) => mesclar({ carregando: false, tocando: false, erro: ERROS[e.data] || ERROS[2] }),
        },
      });
    }).catch(() => vivo && mesclar({ carregando: false, erro: "Não foi possível carregar o player do YouTube." }));

    timer = setInterval(ler, 250);
    return () => {
      vivo = false;
      clearInterval(timer);
      try { player.current?.destroy?.(); } catch { /* ignorado */ }
      player.current = null;
      pronto.current = false;
    };
  }, [videoId, mesclar]);

  const com = (fn) => { const p = player.current; if (p && pronto.current) fn(p); };
  const tocar = useCallback(() => com((p) => p.playVideo()), []);
  const pausar = useCallback(() => com((p) => p.pauseVideo()), []);
  const alternar = useCallback(() => com((p) => (p.getPlayerState() === 1 ? p.pauseVideo() : p.playVideo())), []);
  const parar = useCallback(() => com((p) => { p.seekTo(0, true); p.pauseVideo(); mesclar({ atual: 0, tocando: false, terminou: false }); }), [mesclar]);
  const irPara = useCallback((s) => com((p) => {
    const dur = p.getDuration() || 0;
    const t = limitar(s, 0, dur || s);
    p.seekTo(t, true);
    mesclar({ atual: t, terminou: false });
  }), [mesclar]);
  const pular = useCallback((d) => com((p) => irPara((p.getCurrentTime() || 0) + d)), [irPara]);
  const definirVolume = useCallback((v) => com((p) => {
    const n = limitar(v, 0, 1);
    p.setVolume(Math.round(n * 100));
    if (n === 0) p.mute(); else p.unMute();
    mesclar({ volume: n, mudo: n === 0 });
  }), [mesclar]);
  const alternarMudo = useCallback(() => com((p) => {
    if (p.isMuted() || p.getVolume() === 0) { p.unMute(); if (p.getVolume() === 0) p.setVolume(50); } else p.mute();
    mesclar({ mudo: p.isMuted() });
  }), [mesclar]);

  return { caixa, ...estado, acoes: { tocar, pausar, alternar, parar, irPara, pular, definirVolume, alternarMudo } };
}
