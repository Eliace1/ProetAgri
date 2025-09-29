import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { saveAuth } from "../lib/auth";
import { registerUser } from "../api/auth";

export default function Register() {
  const [role, setRole] = useState("agriculteur"); // "agriculteur" | "acheteur"
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    farmName: "",
    companyName: "",
    documents: [],
    avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFiles = (files) => {
    const fileList = Array.from(files || []);
    setForm((f) => ({ ...f, documents: fileList }));
  };

  const handleAvatar = (file) => {
    if (!file) return;
    setForm((f) => ({ ...f, avatar: file }));
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result?.toString() || "");
    reader.readAsDataURL(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        role,
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        ...(role === "agriculteur" ? { farmName: form.farmName } : {}),
        ...(role === "acheteur" ? { companyName: form.companyName } : {}),
      };

      const data = new FormData();
      Object.entries({
        role,
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        farmName: form.farmName,
        companyName: form.companyName,
      }).forEach(([k, v]) => v != null && v !== "" && data.append(k, v));
      if (form.avatar) data.append("avatar", form.avatar);
      form.documents.forEach((f) => data.append("documents[]", f));

      const hasFiles = !!form.avatar || (form.documents && form.documents.length > 0);
      const resp = await registerUser(hasFiles ? data : payload, hasFiles);
      const { user, token } = resp || {};
      saveAuth(user || { name: form.name, email: form.email, role, avatar: avatarPreview }, token || "");
      alert("Inscription réussie !");
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      console.error("Register error:", { status, data, err });
      let message = "Une erreur est survenue. Réessayez.";
      if (data) {
        if (typeof data === 'object') {
          message = data.message || (data.errors ? Object.values(data.errors).flat().join('\n') : message);
        } else if (typeof data === 'string') {
          message = `Erreur ${status || ''}`.trim() + `\n` + data.slice(0, 300);
        }
      } else if (err?.message) {
        message = err.message;
      }
      alert(message);
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
          {/* Photo de profil (optionnelle) */}
          <div className="form-field">
            <label className="form-label">Photo de profil (optionnel)</label>
            <div className="avatar-row">
              <div className="avatar-preview" style={{ backgroundImage: `url(${avatarPreview || "/images/avatar-placeholder.png"})` }} />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleAvatar(e.target.files?.[0])}
              />
            </div>
          </div>
          <div className="row-2">
            <div className="form-field">
              <label className="form-label">Nom</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Entrez votre nom"
                required
                className="form-input"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Entrez votre email"
                required
                className="form-input"
              />
            </div>
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
                required
                className="form-input"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Créez un mot de passe sécurisé"
                required
                className="form-input"
              />
            </div>
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

          {role === "acheteur" && (
            <div className="form-field">
              <label className="form-label">Nom de l'entreprise (optionnel)</label>
              <input
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="Entrez le nom de votre entreprise"
                className="form-input"
              />
            </div>
          )}

          {role === "agriculteur" && (
            <div className="form-field">
              <label className="form-label">Documents de Vérification d'identité</label>
              <div
                className="dropzone"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={onDrop}
              >
                <input
                  id="docs"
                  type="file"
                  multiple
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden-input"
                />
                <label htmlFor="docs" className="dropzone-label">
                  Glissez-déposez vos documents ici ou cliquez pour sélectionner
                  <span className="hint">(Permis de conduire, carte d'identité, etc.)</span>
                </label>
                {form.documents?.length > 0 && (
                  <div className="files-preview">
                    {form.documents.map((f, idx) => (
                      <div key={idx}>{f.name}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <button type="submit" disabled={submitting} className="btn-submit">
            {submitting ? "En cours..." : "S'inscrire"}
          </button>

          <p className="aftertext">
            Déjà un compte ? <Link to="/login">Se connecter</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
