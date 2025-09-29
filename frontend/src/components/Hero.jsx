import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Connecter agriculteurs et acheteurs</h1>
        <p>
          La plateforme qui rapproche les producteurs locaux de votre table.
          <br />
          Fraîcheur,  qualité, proximité, bien-être et soutien aux agriculteurs.
        </p>
        <div className="hero-buttons">
          <button className="btn green">S'inscrire</button>
          {/* 🔹 Redirection vers /login */}
          <Link to="/login" className="btn gray">Se connecter</Link>
        </div>
      </div>
      <img
        src="/images/hero.jpg"
        alt="Champs agricoles"
        className="hero-img"
      />
    </section>
  );
}

