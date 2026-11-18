// Prompt de comando decorativo: só a janela e o cursor piscando, sem comandos.
export default function AppPrompt() {
  return (
    <div className="app-prompt" tabIndex={0} role="group" aria-label="Prompt de comando, decorativo e sem comandos disponíveis">
      <p>Portfólio Miranda XP</p>
      <p>Inspirado no Windows XP</p>
      <p className="app-prompt-vazia">&nbsp;</p>
      <p>C:\&gt;</p>
      <p>C:\&gt;<span className="app-prompt-cursor" aria-hidden="true" /></p>
    </div>
  );
}
