import { useState, useEffect } from "react";
import { FaLeaf, FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { Link, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { getUser, logout as doLogout } from "../lib/auth";


export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Ferme le menu si on redimensionne en desktop
  useEffect(() => {
    function onResize() {
      if (window.innerWidth > 768) setOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // On détecte si on est sur la page "Marché"
  const isMarketplace = location.pathname === "/marche";
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    setUser(getUser());
  }, [location.pathname]);

  // Recherche liée à l'URL ?q= pour la page marché
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const updateQuery = (v) => {
    const next = new URLSearchParams(searchParams);
    if (v) next.set("q", v);
    else next.delete("q");
    setSearchParams(next, { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <FaLeaf className="logo-icon" />
        <span>FarmLink</span>
      </div>

      {/* Lien acheteur retiré */}

      {/* bouton mobile unique */}
      <button
        className="mobile-toggle"
        aria-label="Ouvrir le menu"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>

      {/* wrapper qui contient liens + boutons (déroulable) */}
      <div className={`nav-wrapper ${open ? "open" : ""}`}>
        <ul className="nav-links">
          <li>
            <Link
              to="/"
              onClick={() => setOpen(false)}
              style={isActive('/') ? { fontWeight: 700, textDecoration: 'none' } : undefined}
            >
              Accueil
            </Link>
          </li>
          <li>
            <Link
              to="/marche"
              onClick={() => setOpen(false)}
              style={isActive('/marche') ? { fontWeight: 700, textDecoration: 'none' } : undefined}
            >
              Marché
            </Link>
          </li>
          <li>
            <Link
              to="/apropos"
              onClick={() => setOpen(false)}
              style={isActive('/apropos') ? { fontWeight: 700, textDecoration: 'none' } : undefined}
            >
              À Propos
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              style={isActive('/contact') ? { fontWeight: 700, textDecoration: 'none' } : undefined}
            >
              Contact
            </Link>
          </li>
          {user && (
            <li>
              <Link
                to="/commandes"
                onClick={() => setOpen(false)}
                style={isActive('/commandes') ? { fontWeight: 700, textDecoration: 'underline' } : undefined}
              >
                Commandes
              </Link>
            </li>
          )}
          {user && user.role === 'acheteur' && (
            <li>
              <Link
                to="/client"
                onClick={() => setOpen(false)}
                style={isActive('/client') ? { fontWeight: 700, textDecoration: 'underline' } : undefined}
              >
                Mon compte
              </Link>
            </li>
          )}
        </ul>

        {isMarketplace && (
  <div className="marketplace-header" style={{ margin: 0 }}>
    <div className="marketplace-search">
      <FaSearch className="icon" />
      <input
        type="text"
        placeholder="Rechercher des produits..."
        value={query}
        onChange={(e) => updateQuery(e.target.value)}
      />
    </div>
    {user && (
      user.role === 'acheteur' ? (
        <Link to="/client" onClick={() => setOpen(false)} title={user.name}>
          <div
            className="marketplace-avatar"
            style={{ backgroundImage: `url(${user.avatar || "/images/avatar-placeholder.png"})` }}
          />
        </Link>
      ) : (
        <div
          className="marketplace-avatar"
          style={{ backgroundImage: `url(${user.avatar || "/images/avatar-placeholder.png"})` }}
          title={user.name}
        />
      )
    )}
  </div>
)}


        {/*  Boutons d'auth affichés uniquement si non connecté et pas sur /marche */}
        {!isMarketplace && !user && (
          <div className="nav-buttons">
            <Link to="/inscription" className="btn white" onClick={() => setOpen(false)}>
              S'inscrire
            </Link>
            <Link to="/login" className="btn outline" onClick={() => setOpen(false)}>
              Se connecter
            </Link>
          </div>
        )}
        {/* 👉 Bouton Déconnexion si connecté (et pas sur /marche) */}
        {!isMarketplace && user && (
          <div className="nav-buttons">
            <button
              className="btn outline"
              onClick={() => {
                doLogout();
                setUser(null);
                setOpen(false);
                navigate("/");
                try { window?.dispatchEvent(new Event('cart:add')); } catch {}
              }}
            >
              Se déconnecter
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
