import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import { saveAuth } from "../lib/auth";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState(""); // email ou téléphone
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta?.env?.VITE_API_URL || "http://127.0.0.1:8000"; // adapte si besoin

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
        credentials: "include", // si le backend pose un cookie, sinon enlever
      });

      if (!res.ok) {
        // Fallback: accepte toute connexion tant que le backend n'est pas prêt
        const fakeUser = { name: identifier || "Utilisateur", email: identifier || "user@example.com" };
        saveAuth(fakeUser, "dev-token");
      } else {
        const data = await res.json().catch(() => ({}));
        if (data?.user || data?.token) {
          saveAuth(data.user || null, data.token || "");
        } else {
          const fakeUser = { name: identifier || "Utilisateur", email: identifier || "user@example.com" };
          saveAuth(fakeUser, "dev-token");
        }
      }

      // Redirige vers la page d'origine si présente, sinon accueil
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err) {
      // Fallback total si erreur réseau: accepter quand même
      const fakeUser = { name: identifier || "Utilisateur", email: identifier || "user@example.com" };
      saveAuth(fakeUser, "dev-token");
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-page">
        <div className="login-container">
          <h2>Se connecter</h2>
          <p className="subtitle">
            Entrez vos informations pour accéder à votre compte FarmLink.
          </p>

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

      {/* Footer ajouté ici */}
      <Footer />
    </>
  );
}
