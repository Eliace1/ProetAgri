import { useState, useEffect } from "react";
import { FaLeaf, FaBars, FaTimes } from "react-icons/fa";
import { Link, useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { getUser, logout as doLogout } from "../lib/auth";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(getUser());
  const location = useLocation();
  const navigate = useNavigate();

  // Ferme le menu sur resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Met à jour user quand location change
  useEffect(() => { setUser(getUser()); }, [location.pathname]);

  // Met à jour user quand auth change
  useEffect(() => {
    const onAuthChanged = () => setUser(getUser());
    window.addEventListener("auth:changed", onAuthChanged);
    return () => window.removeEventListener("auth:changed", onAuthChanged);
  }, []);

  const isActive = (path) => location.pathname === path;
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

      <button className="mobile-toggle" aria-label="Ouvrir le menu" onClick={() => setOpen(s => !s)}>
        {open ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`nav-wrapper ${open ? "open" : ""}`}>
        <ul className="nav-links">
          <li><Link to="/" style={isActive('/') ? { fontWeight: 700 } : undefined}>Accueil</Link></li>
          <li><Link to="/marche" style={isActive('/marche') ? { fontWeight: 700 } : undefined}>Marché</Link></li>
          <li><Link to="/apropos" style={isActive('/apropos') ? { fontWeight: 700 } : undefined}>À Propos</Link></li>
          <li><Link to="/contact" style={isActive('/contact') ? { fontWeight: 700 } : undefined}>Contact</Link></li>
          {user?.customer && (
            <li>
              <Link
                to="/commandes"
                style={isActive('/commandes') ? { fontWeight: 700 } : undefined}
              >
                Commandes
              </Link>
            </li>
          )}

          {user && (
            <li>
              <Link
                to={user.farmer ? "/agriculteur" : "/client"}
                style={isActive(user.farmer ? '/agriculteur' : '/client') ? { fontWeight: 700 } : undefined}
              >
                Mon Profil
              </Link>
            </li>
          )}

        </ul>

        {!user && (
          <div className="nav-buttons">
            <Link to="/inscription" className="btn white">S'inscrire</Link>
            <Link to="/login" className="btn outline">Se connecter</Link>
          </div>
        )}

        {user && (
          <div className="nav-buttons">
            <button
              className="btn outline"
              onClick={() => {
                doLogout();
                setUser(null);
                window.dispatchEvent(new Event("auth:changed"));
                navigate("/");
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
