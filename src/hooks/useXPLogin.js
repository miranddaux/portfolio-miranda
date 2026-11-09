import { useCallback, useEffect, useRef, useState } from "react";

const LOGON_SOUND = "/assets/audio/windows-xp-logon.mp3";
export const WELCOME_DURATION = 2400;

function readSoundPreference() {
  try {
    return localStorage.getItem("miranda-sound") !== "off";
  } catch {
    return true;
  }
}

export default function useXPLogin(shouldShowEntry) {
  const [phase, setPhase] = useState(() =>
    shouldShowEntry() ? "profile" : "portfolio",
  );
  const [soundEnabled, setSoundEnabled] = useState(readSoundPreference);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const phaseRef = useRef(phase);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  function getAudio() {
    if (!audioRef.current && typeof Audio !== "undefined") {
      const audio = new Audio(LOGON_SOUND);
      audio.preload = "auto";
      audio.volume = 0.35;
      audioRef.current = audio;
    }
    return audioRef.current;
  }

  useEffect(() => {
    // Preload only on the entry screen; loading never starts playback.
    if (phase === "profile") getAudio()?.load();
  }, [phase]);

  useEffect(
    () => () => {
      clearTimeout(timerRef.current);
      audioRef.current?.pause();
    },
    [],
  );

  const finish = useCallback(() => {
    if (phaseRef.current !== "welcome") return;
    clearTimeout(timerRef.current);
    phaseRef.current = "portfolio";
    setPhase("portfolio");
    try {
      sessionStorage.setItem("miranda-entered", "true");
    } catch {}
    requestAnimationFrame(() => {
      const main = document.getElementById("conteudo");
      main?.setAttribute("tabindex", "-1");
      main?.focus({ preventScroll: true });
    });
  }, []);

  useEffect(() => {
    if (phase !== "welcome") return;
    timerRef.current = setTimeout(finish, WELCOME_DURATION);
    return () => clearTimeout(timerRef.current);
  }, [phase, finish]);

  function playLogonSound() {
    if (!soundEnabled) return;
    setAudioBlocked(false);
    try {
      const audio = getAudio();
      if (!audio) {
        setAudioBlocked(true);
        return;
      }
      audio.muted = false;
      audio.currentTime = 0;
      // Called directly by a click/keyboard activation, before any await.
      const playing = audio.play();
      playing?.catch(() => {
        if (phaseRef.current === "welcome") setAudioBlocked(true);
      });
    } catch {
      setAudioBlocked(true);
    }
  }

  function start() {
    if (phaseRef.current !== "profile") return;
    phaseRef.current = "welcome";
    setPhase("welcome");
    playLogonSound();
  }

  function reset() {
    clearTimeout(timerRef.current);
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    phaseRef.current = "profile";
    setPhase("profile");
    setAudioBlocked(false);
    try {
      sessionStorage.removeItem("miranda-entered");
    } catch {}
    requestAnimationFrame(() =>
      document.querySelector(".xp-entry-profile")?.focus(),
    );
  }

  function toggleSound() {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (audioRef.current) audioRef.current.muted = !next;
    if (!next) setAudioBlocked(false);
    try {
      localStorage.setItem("miranda-sound", next ? "on" : "off");
    } catch {}
  }

  return {
    phase,
    soundEnabled,
    audioBlocked,
    start,
    finish,
    reset,
    toggleSound,
    playLogonSound,
  };
}
