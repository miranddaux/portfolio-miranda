export default function MsnBanner({ aoConversar }) {
  return (
    <button type="button" className="msn-banner" onClick={aoConversar} aria-label="Portfólio Thiago Live Messenger — conversar com Thiago Bot">
      <span className="msn-banner-moldura">
        <img className="msn-banner-windows" src="/assets/xp/figma/bandeira.png" width="32" height="32" alt="" draggable="false" />
        <span className="msn-banner-texto">Portfólio Thiago Live Messenger</span>
        <img className="msn-banner-pessoas" src="/assets/xp/msn/logo-128.png" width="80" height="80" alt="" draggable="false" />
      </span>
    </button>
  );
}
