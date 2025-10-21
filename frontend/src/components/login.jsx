import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import { saveAuth } from "../lib/auth";
import axios from "axios";


export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(""); // email ou téléphone
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // rôle choisi (agriculteur ou acheteur)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Utilise le proxy Vite: appels relatifs "/api/..." => http://localhost:8000
  const API_URL = "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(email !== "" && password !== ""){
      setLoading(true);

      try{
             const res = await axios
        .post('http://127.0.0.1:8000/api/login',{
          email,
          password
        })
        .then((res) => {
          if(res.data.status !==200){
            setError("Mot de passe ou email incorrect");
          }else{
            saveAuth(res.data.user,res.data.token)
            localStorage.setItem('user_token',res.data.token)
            if(res.data.user.farmer){
              navigate("/agriculteur");
            }else{
              navigate("/client");
            }
          }
        })
        .catch((err)=>{
          console.error(err);
          setError("Mot de Passe ou addresse email incorrect")
        })
      }catch(err){
          console.error(err);
          setError("Erreur serveur")
      }finally{
        setLoading(false);
      }
     
    }else{
      alert("champs invalide");
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
            <label>Adresse e-mail</label>
            <input
              type="email"
              placeholder="Ex: jean.dupont@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

      <Footer />
    </>
  );
}
