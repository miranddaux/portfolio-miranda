import { useEffect, useState } from "react";

// Relógio da bandeja, no horário de São Paulo.
export default function Relogio() {
  const [agora, setAgora] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setAgora(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
  return (
    <time dateTime={agora.toISOString()} title="Horário em São Paulo">
      {agora.toLocaleTimeString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        hour: "2-digit",
        minute: "2-digit",
      })}
    </time>
  );
}
