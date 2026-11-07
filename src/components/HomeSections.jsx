import { ArrowUpRight, ExternalLink, Mail, Folder } from "lucide-react";
export default function HomeSections() {
  return (
    <>
      {" "}
      <section id="playground" className="playground section-width">
        <div className="playground-inner">
          <div className="playground-sticker">✦</div>
          <div>
            <span className="eyebrow">/ EXPERIMENTOS & CURIOSIDADE</span>
            <h2>
              O laboratório está <em>aberto.</em>
            </h2>
            <p>
              Um espaço para protótipos, design systems, interfaces de games e
              experiências que misturam design e código. Conteúdo em evolução.
            </p>
          </div>
          <div className="playground-tile">
            <span className="pixel-icon">▣</span>
            <span>PLAYGROUND.EXE</span>
            <strong>Em construção</strong>
            <span className="progress-track">
              <i />
            </span>
          </div>
        </div>
      </section>
      <section className="about-section" id="sobre">
        <div className="section-width about-grid">
          <div>
            <span className="eyebrow eyebrow-accent">// PLAYER PROFILE</span>
            <h2>
              Prazer, sou o <em>Thiago.</em>
            </h2>
            <p>
              Trabalho com design de interfaces e produtos digitais. Gosto de
              transformar problemas confusos em experiências claras, com
              personalidade e cuidado nos detalhes.
            </p>
            <p>
              Na Disco, atuo com e-commerce e jornadas de compra. No ANIMAE,
              experimento a construção de um produto próprio — da estratégia e
              UI ao design system e ao código, com apoio de IA.
            </p>
            <a className="btn btn-outline" href="#contato">
              Vamos conversar <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="profile-card">
            <div className="profile-top">
              <Folder size={21} />
              <span>perfil-do-jogador.txt</span>
              <span>✳</span>
            </div>
            <div className="profile-body">
              <div className="avatar-box">
                TM<span>✧</span>
              </div>
              <h3>THIAGO MIRANDA</h3>
              <span className="role-label">PRODUCT DESIGNER · PLENO</span>
              <div className="profile-divider" />
              <div className="stat-row">
                <span>Especialidade</span>
                <strong>UI / Design System</strong>
              </div>
              <div className="stat-row">
                <span>Abordagem</span>
                <strong>Design → Código</strong>
              </div>
              <div className="stat-row">
                <span>Local</span>
                <strong>Interior de SP</strong>
              </div>
              <div className="stat-row">
                <span>Interesses</span>
                <strong>Cinema, anime, leitura</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="contact-section section-width" id="contato">
        <div className="contact-card">
          <div>
            <span className="eyebrow">// NEW MESSAGE</span>
            <h2>
              Tem um projeto ou
              <br />
              <em>uma oportunidade?</em>
            </h2>
            <p>
              Estou aberto a conversar sobre vagas remotas de Product Designer
              pleno, produtos digitais e boas ideias.
            </p>
          </div>
          <div className="contact-buttons">
            <button
              className="btn btn-dark"
              disabled
              title="URL do perfil ainda nao configurada"
            >
              LinkedIn a configurar <ExternalLink size={16} />
            </button>
            <button
              className="btn btn-outline"
              disabled
              title="E-mail profissional ainda não configurado"
            >
              E-mail a configurar <Mail size={16} />
            </button>
            <p className="contact-note">
              Os links definitivos de e-mail e currículo serão conectados antes
              da publicação.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
