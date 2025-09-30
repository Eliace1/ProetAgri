import { FaFacebookF, FaInstagram, FaTwitter, FaLeaf } from "react-icons/fa";


export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h3 className="logo">
            <FaLeaf className="logo-icon" /> FarmLink
          </h3>
          <p>Connecter producteurs et consommateurs.</p>
          <div className="socials">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
          </div>
        </div>
        <div>
          <h4>À Propos</h4>
          <ul>
            <li>Notre Histoire</li>
            <li>Carrières</li>
            <li>Blog</li>
          </ul>
        </div>
        <div>
          <h4>Ressources</h4>
          <ul>
            <li>Centre d'aide</li>
            <li>Tarification</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div>
          <h4>Légal</h4>
          <ul>
            <li>Conditions d'utilisation</li>
            <li>Politique de confidentialité</li>
          </ul>
        </div>
        <div>
          <h4>Contactez-nous</h4>
          <ul>
            <li>Support</li>
            <li>Ventes</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
