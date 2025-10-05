import { useState } from "react";
import { Link } from "react-router-dom";
//import axios from "axios";
import { saveAuth } from "../lib/auth";
import { registerUser } from "../api/auth";

export default function Register() {
  const [role, setRole] = useState("agriculteur"); // "agriculteur" | "acheteur"
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    farmName: "",
    farmAddress: "",
    companyName: "", // utilisé pour l'adresse acheteur (compat backend)
    avatar: "",
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    // clear field error on change
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const onAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    const emailRe = /.+@.+\..+/;
    // Champs de base
    if (!form.firstName?.trim()) e.firstName = "Le prénom est obligatoire.";
    if (!form.lastName?.trim()) e.lastName = "Le nom est obligatoire.";
    if (!form.email?.trim()) e.email = "L'email est obligatoire.";
    else if (!emailRe.test(form.email)) e.email = "Format d'email invalide.";
    if (!form.phone?.trim()) e.phone = "Le téléphone est obligatoire.";
    // Mot de passe
    if (!form.password) e.password = "Le mot de passe est obligatoire.";
    else if (form.password.length < 6) e.password = "Minimum 6 caractères.";
    if (!form.confirmPassword) e.confirmPassword = "Veuillez confirmer le mot de passe.";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Les mots de passe ne correspondent pas.";
    // Champs selon rôle
    if (role === "acheteur" && (!form.companyName || !form.companyName.trim())) {
      e.companyName = "L'adresse de livraison est obligatoire.";
    }
    if (role === "agriculteur" && (!form.farmAddress || !form.farmAddress.trim())) {
      e.farmAddress = "L'adresse de la ferme est obligatoire.";
    }
    return e;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        role,
        name: `${form.firstName?.trim() || ""} ${form.lastName?.trim() || ""}`.trim(),
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        password_confirmation: form.confirmPassword,
        avatar: form.avatar, // data URL (base64)
        ...(role === "agriculteur" ? { farmName: form.farmName, farmAddress: form.farmAddress } : {}),
        ...(role === "acheteur" ? { companyName: form.companyName, address: form.companyName } : {}),
      };

      const resp = await registerUser(payload, false);
      const { user, token } = resp || {};

      // Enrichit l'utilisateur sauvegardé si le backend n'envoie pas ces champs
      const fallbackUser = {
        name: `${form.firstName?.trim() || ""} ${form.lastName?.trim() || ""}`.trim(),
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        role,
        avatar: form.avatar,
        ...(role === "agriculteur" ? { farmName: form.farmName, farm_address: form.farmAddress } : {}),
        ...(role === "acheteur" ? { companyName: form.companyName } : {}),
      };
      const userToSave = user ? {
        ...user,
        ...(form.avatar && !user.avatar ? { avatar: form.avatar } : {}),
        ...(role === "agriculteur" && !user.farmName && !user.farm_name ? { farmName: form.farmName } : {}),
        ...(role === "agriculteur" && !user.farm_address ? { farm_address: form.farmAddress } : {}),
        ...(role === "acheteur" && !user.companyName && !user.company_name ? { companyName: form.companyName } : {}),
      } : fallbackUser;
      saveAuth(userToSave, token || "");
      // Optionnel: toast/redirect; on garde le flow actuel
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      console.error("Register error:", { status, data, err });
      let message = "Une erreur est survenue. Réessayez.";
      if (data) {
        if (typeof data === 'object') {
          if (data.errors && typeof data.errors === 'object') {
            // Mappe les erreurs backend sur les champs
            const mapped = {};
            Object.entries(data.errors).forEach(([k, v]) => {
              const msg = Array.isArray(v) ? v.join(' ') : String(v);
              if (k === 'password' || k === 'password_confirmation') {
                mapped.confirmPassword = msg;
              } else if (k === 'email') {
                mapped.email = msg;
              } else if (k === 'name' || k === 'first_name' || k === 'last_name') {
                // si l'API renvoie une erreur de nom, l'afficher côté lastName par défaut
                mapped.lastName = msg;
              } else if (k === 'phone') {
                mapped.phone = msg;
              } else if (k === 'farmAddress' || k === 'farm_address') {
                mapped.farmAddress = msg;
              } else if (k === 'companyName' || k === 'company_name' || k === 'address') {
                mapped.companyName = msg;
              } else {
                mapped.server = (mapped.server ? mapped.server + '\n' : '') + msg;
              }
            });
            setErrors(mapped);
            message = data.message || message;
          } else {
            message = data.message || message;
          }
        } else if (typeof data === 'string') {
          message = `Erreur ${status || ''}`.trim() + `\n` + data.slice(0, 300);
        }
      } else if (err?.message) {
        message = err.message;
      }
      if (!data?.errors) alert(message);
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
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Entrez votre prénom"
                className="form-input"
              />
              {errors.firstName && (<div className="field-error">{errors.firstName}</div>)}
            </div>
            <div className="form-field">
              <label className="form-label">Nom</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Entrez votre nom"
                className="form-input"
              />
              {errors.lastName && (<div className="field-error">{errors.lastName}</div>)}
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
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Ressaisissez votre mot de passe"
                className="form-input"
              />
              <button type="button" onClick={() => setShowConfirm(s => !s)} className="btn-toggle" aria-label="Afficher/masquer la confirmation" style={{ minWidth: 90 }}>
                {showConfirm ? 'Masquer' : 'Afficher'}
              </button>
            </div>
            {errors.confirmPassword && (<div className="field-error">{errors.confirmPassword}</div>)}
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
                name="farmName"
                value={form.farmName}
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
                name="farmAddress"
                value={form.farmAddress}
                onChange={handleChange}
                placeholder="Entrez l'adresse de votre ferme"
                className="form-input"
              />
              {errors.farmAddress && (<div className="field-error">{errors.farmAddress}</div>)}
            </div>
          )}

          {role === "acheteur" && (
            <div className="form-field">
              <label className="form-label">Adresse de livraison</label>
              <input
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Entrez votre adresse"
                className="form-input"
              />
              {errors.companyName && (<div className="field-error">{errors.companyName}</div>)}
            </div>
          )}

          {/* Avatar */}
          <div className="form-field">
            <label className="form-label">Photo de profil</label>
            <div className="avatar-row">
              <div className="avatar-preview" style={{ backgroundImage: `url(${form.avatar || ''})` }} />
              <input type="file" accept="image/*" onChange={onAvatarChange} />
              {form.avatar && (
                <button type="button" className="btn-toggle" onClick={() => setForm((f)=>({ ...f, avatar: '' }))}>Retirer</button>
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
