import { REDES_SOCIAIS } from "../data/social.js";

export default function SocialLink({ rede, variante = "inline", onClick }) {
  const { nome, href, icone } = REDES_SOCIAIS[rede];
  const externo = href.startsWith("https://");
  const Tag = onClick ? "button" : href ? "a" : "span";
  const atributos = onClick
    ? { type: "button", onClick }
    : href
      ? { href, ...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {}) }
      : { "aria-disabled": true, title: "Link a configurar" };

  return (
    <Tag className={`social-link social-link--${variante}`} {...atributos}>
      <img className="social-link__icon" src={icone} alt="" width="24" height="24" draggable="false" />
      <span className="social-link__name">{nome}</span>
      {!href && !onClick && <span className="social-link__pending">a configurar</span>}
      {externo && !onClick && <span className="sr-only"> (abre em nova aba)</span>}
    </Tag>
  );
}
