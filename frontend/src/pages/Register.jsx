import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { saveAuth } from "../lib/auth";
import { registerUser } from "../api/auth";

export default function Register() {
  const [role, setRole] = useState("agriculteur"); // "agriculteur" | "acheteur"
  const [form, setForm] = useState({
    first_name: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
    address: "",
    address:"",
    company_name: "", // utilisé pour l'adresse acheteur (compat backend)
    profile: "",
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    // clear field error on change
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const onAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, profile: file }));
  };


  const validate = () => {
    const e = {};
    const emailRe = /.+@.+\..+/;
    // Champs de base
    if (!form.first_name?.trim()) e.first_name = "Le prénom est obligatoire.";
    if (!form.name?.trim()) e.name = "Le nom est obligatoire.";
    if (!form.email?.trim()) e.email = "L'email est obligatoire.";
    else if (!emailRe.test(form.email)) e.email = "Format d'email invalide.";
    if (!form.phone?.trim()) e.phone = "Le téléphone est obligatoire.";
    // Mot de passe
    if (!form.password) e.password = "Le mot de passe est obligatoire.";
    else if (form.password.length < 6) e.password = "Minimum 6 caractères.";
    if (!form.password_confirmation) e.password_confirmation = "Veuillez confirmer le mot de passe.";
    else if (form.password !== form.password_confirmation) e.password_confirmation = "Les mots de passe ne correspondent pas.";
    // Champs selon rôle
    if (role === "acheteur" && (!form.company_name || !form.company_name.trim())) {
      e.company_name = "L'adresse de livraison est obligatoire.";
    }
    if (role === "agriculteur" && (!form.address || !form.address.trim())) {
      e.address = "L'adresse de la ferme est obligatoire.";
    }
    return e;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('first_name', form.first_name);
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('password', form.password);
      formData.append('password_confirmation', form.password_confirmation);
      formData.append('address', form.address);
      formData.append('company_name', form.company_name);
      formData.append('farmer', role === "agriculteur" ? 1 : 0);
      formData.append('customer', role === "acheteur" ? 1 : 0);


      // Ajouter le fichier si il existe
      if (form.profile instanceof File) {
        formData.append('profile', form.profile);
      }

      const res = await axios.post('http://127.0.0.1:8000/api/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.status === 201) {
        navigate('/login');
      }

    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const mapped = {};
        Object.entries(data.errors).forEach(([k, v]) => {
          mapped[k] = Array.isArray(v) ? v.join(' ') : v;
        });
        setErrors(mapped);
      } else {
        setErrors({ server: data?.message || "Erreur serveur" });
      }
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-title">Inscription {role === "agriculteur" ? "Agriculteur" : "Acheteur"}</h1>
        <p className="register-subtitle">
          Rejoignez FarmLink pour connecter {role === "agriculteur" ? "votre ferme" : "vos achats"} au réseau.
        </p>

        <form onSubmit={onSubmit} className="register-form">
          <div className="row-2">
            <div className="form-field">
              <label className="form-label">Prénom</label>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                placeholder="Entrez votre prénom"
                className="form-input"
              />
              {errors.first_name && (<div className="field-error">{errors.first_name}</div>)}
            </div>
            <div className="form-field">
              <label className="form-label">Nom</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Entrez votre nom"
                className="form-input"
              />
              {errors.name && (<div className="field-error">{errors.name}</div>)}
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Entrez votre email"
              className="form-input"
            />
            {errors.email && (<div className="field-error">{errors.email}</div>)}
          </div>

          <div className="row-2">
            <div className="form-field">
              <label className="form-label">Téléphone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Entrez votre numéro de téléphone"
                className="form-input"
              />
              {errors.phone && (<div className="field-error">{errors.phone}</div>)}
            </div>
            <div className="form-field">
              <label className="form-label">Mot de passe</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Créez un mot de passe sécurisé"
                  className="form-input"
                />
                <button type="button" onClick={() => setShowPassword(s => !s)} className="btn-toggle" aria-label="Afficher/masquer le mot de passe" style={{ minWidth: 90 }}>
                  {showPassword ? 'Masquer' : 'Afficher'}
                </button>
              </div>
              {errors.password && (<div className="field-error">{errors.password}</div>)}
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Confirmer le mot de passe</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type={showConfirm ? "text" : "password"}
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                placeholder="Ressaisissez votre mot de passe"
                className="form-input"
              />
              <button type="button" onClick={() => setShowConfirm(s => !s)} className="btn-toggle" aria-label="Afficher/masquer la confirmation" style={{ minWidth: 90 }}>
                {showConfirm ? 'Masquer' : 'Afficher'}
              </button>
            </div>
            {errors.password_confirmation && (<div className="field-error">{errors.password_confirmation}</div>)}
          </div>

          <div className="form-field">
            <label className="form-label">Role</label>
            <div className="role-toggle">
              <button
                type="button"
                onClick={() => setRole("acheteur")}
                className={`toggle-btn ${role === "acheteur" ? "active buyer" : ""}`}
              >
                Acheteur
              </button>
              <button
                type="button"
                onClick={() => setRole("agriculteur")}
                className={`toggle-btn ${role === "agriculteur" ? "active farmer" : ""}`}
              >
                Agriculteur
              </button>
            </div>
          </div>

          {role === "agriculteur" && (
            <div className="form-field">
              <label className="form-label">Nom de la Ferme</label>
              <input
                type="text"
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                placeholder="Entrez le nom de votre ferme"
                className="form-input"
              />
            </div>
          )}

          {role === "agriculteur" && (
            <div className="form-field">
              <label className="form-label">Adresse de la Ferme</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Entrez l'adresse de votre ferme"
                className="form-input"
              />
              {errors.address && (<div className="field-error">{errors.address}</div>)}
            </div>
          )}

          {role === "acheteur" && (
            <div className="form-field">
              <label className="form-label">Adresse de livraison</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Entrez votre adresse"
                className="form-input"
              />
              {errors.addresse && (<div className="field-error">{errors.address}</div>)}
            </div>
          )}

          {/* Avatar */}
          <div className="form-field">
            <label className="form-label">Photo de profil</label>
            <div className="profile-row">
              <div className="profile-preview" style={{ backgroundImage: `url(${form.profile || ''})` }} />
              <input type="file" accept="image/*" onChange={onAvatarChange} />
              {form.profile && (
                <button type="button" className="btn-toggle" onClick={() => setForm((f)=>({ ...f, profile: '' }))}>Retirer</button>
              )}
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-submit">
            {submitting ? "En cours..." : "S'inscrire"}
          </button>

          {errors.server && <div className="field-error">{errors.server}</div>}

          <p className="aftertext">
            Déjà un compte ? <Link to="/login">Se connecter</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
