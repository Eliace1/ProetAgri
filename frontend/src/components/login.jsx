import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import { saveAuth } from "../lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // rôle choisi (agriculteur ou acheteur)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Utilise le proxy Vite: appels relatifs "/api/..." => http://localhost:8000
  const API_URL = "";

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // Envoie aussi le rôle sélectionné; si le backend l'ignore, côté front on l'utilise pour router
      body: JSON.stringify({ identifier, password, role }),
      // credentials retiré pour éviter CORS strict tant que le backend n'est pas configuré
    });

    if (!res.ok) {
      // fallback dev
      const fakeUser = { name: identifier || "Utilisateur", email: identifier || "user@example.com" };
      const userToSave = { ...fakeUser, role: role || "acheteur" };
      saveAuth(userToSave, "dev-token");
    } else {
      const data = await res.json().catch(() => ({}));
      if (data?.user || data?.token) {
        const userToSave = { ...(data.user || {}), role: role || (data.user?.role || "acheteur") };
        saveAuth(userToSave, data.token || "");
      } else {
        const fakeUser = { name: identifier || "Utilisateur", email: identifier || "user@example.com" };
        const userToSave = { ...fakeUser, role: role || "acheteur" };
        saveAuth(userToSave, "dev-token");
      }
    }

    // 🚀 Redirection: renvoie d'abord vers l'accueil; l'accès au dashboard se fait via la Navbar
    if (!role) {
      setError("Veuillez sélectionner un rôle avant de continuer.");
    }
    navigate("/", { replace: true });

  } catch (err) {
    // fallback total
    const fakeUser = { name: identifier || "Utilisateur", email: identifier || "user@example.com" };
    const userToSave = { ...fakeUser, role: role || "acheteur" };
    saveAuth(userToSave, "dev-token");
    navigate("/", { replace: true });
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <div className="login-page">
        <div className="login-container">
          <h2>Se connecter</h2>
          <p className="subtitle">Entrez vos informations pour accéder à votre compte FarmLink.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label>Adresse e-mail ou numéro de téléphone</label>
            <input
              type="text"
              placeholder="Ex: jean.dupont@example.com ou 06XXXXXXXX"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />

            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Boutons radio */}
            <div className="role-selection">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="agriculteur"
                  checked={role === "agriculteur"}
                  onChange={(e) => setRole(e.target.value)}
                  required
                />{" "}
                Agriculteur
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="acheteur"
                  checked={role === "acheteur"}
                  onChange={(e) => setRole(e.target.value)}
                  required
                />{" "}
                Acheteur
              </label>
            </div>

            <a href="#" className="forgot">Mot de passe oublié ?</a>

            {error && (
              <div className="error" role="alert" style={{ color: "#dc2626", fontSize: 14 }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>

            <p className="signup">
              Pas encore de compte ? <a href="/inscription">S'inscrire</a>
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
