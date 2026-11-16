import { CONTATO } from "./perfil.js";

// Mesmos nomes, destinos e marcas no MSN, no resumo e na aba Contato.
export const REDES_SOCIAIS = {
  linkedin: { nome: "LinkedIn", href: CONTATO.linkedin, icone: "/assets/social/linkedin.png" },
  whatsapp: { nome: "WhatsApp", href: CONTATO.whatsapp, icone: "/assets/social/whatsapp.svg" },
  dribbble: { nome: "Dribbble", href: CONTATO.dribbble, icone: "/assets/xp/painel/dribbble.png" },
  behance: { nome: "Behance", href: CONTATO.behance, icone: "/assets/xp/painel/behance.png" },
  email: { nome: "E-mail", href: `mailto:${CONTATO.email}`, icone: "/assets/xp/figma/email.png" },
  medium: { nome: "Medium", href: "", icone: "/assets/xp/painel/medium.png" },
};

export const REDES_PRINCIPAIS = ["linkedin", "whatsapp", "dribbble", "behance"];
