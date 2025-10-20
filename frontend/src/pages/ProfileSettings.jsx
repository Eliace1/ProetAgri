import { useEffect, useState } from "react";
import { getUser, saveAuth, logout } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function ProfileSettings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", address: "", phone: "", profile: "" , first_name: ""});
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });

  useEffect(() => {
    const u = getUser();
    setUser(u);
    setForm({
      name: u?.name || "",
      email: u?.email || "",
      address: u?.address || "",
      phone: u?.phone || "",
      profile: u?.profile || "",
      first_name: u?.first_name || "",
    });
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

   const onAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, profile: file }));
  };

  const onSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
   try {
     
      const formData = new FormData();
      formData.append('first_name', form.first_name);
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('address', form.address);
      
      
      // Ajouter le fichier si il existe
      if (form.profile instanceof File) {
        formData.append('profile', form.profile);
      }
       console.log("bonsoir");
      const res = await axios.post('http://127.0.0.1:8000/api/user/update', formData, {
        headers: {  
          Authorization:`Bearer ${localStorage.getItem("farmlink_token")}`,
          'Content-Type': 'multipart/form-data' }
      });

       if(res.data.status===200){
          const updatedUser = res.data.user;
         saveAuth(updatedUser, "");
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
      setSaving(false);
    }
  };

  const onChangePassword = (e) => {
    e.preventDefault();
    if (!passwords.next || passwords.next !== passwords.confirm) {
      alert("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    // Placeholder: appel API à implémenter côté backend.
    setPasswords({ current: "", next: "", confirm: "" });
    alert("Mot de passe mis à jour (exemple)");
  };

  const onDeleteAccount = () => {
    const ok = confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.");
    if (!ok) return;
    // Placeholder: requête backend pour supprimer réellement le compte.
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div style={{ padding: 24, background: "#f9fafb", minHeight: "80vh" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <div style={{ width: 64, height: 64, borderRadius: 9999, backgroundSize: "cover", backgroundPosition: "center", backgroundImage: `url(${form.profile || "/images/profile-placeholder.png"})` }} />
        <div>
          <h1 style={{ margin: 0 }}>Paramètres du profil</h1>
          <p style={{ margin: 0, opacity: .7 }}>{user?.name}</p>
        </div>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
        <div style={card()}>
          <div style={title()}>Mes informations</div>
          <form onSubmit={onSaveProfile} style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
            <label>
              Photo de profil
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
                <div style={{ width: 56, height: 56, borderRadius: 9999, backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url(${form.profile || "/images/profile-placeholder.png"})` }} />
                <input type="file" accept="image/*" onChange={onAvatarChange} />
                {(form.profile) && (
                  <button type="button" onClick={() => setForm((f) => ({ ...f, profile: "" }))} className="btn" style={{ padding: '6px 10px' }}>
                    Retirer
                  </button>
                )}
              </div>
            </label>
            <label>
              Nom
              <input type="text" name="name" value={form.name} onChange={onChange} className="form-input" />
            </label>
            <label>
              Prenom
              <input type="text" name="first_name" value={form.first_name} onChange={onChange} className="form-input" />
            </label>
            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={onChange} className="form-input" />
            </label>
            <label>
              Adresse de livraison
              <input type="text" name="address" value={form.address} onChange={onChange} className="form-input" />
            </label>
            <label>
              Téléphone
              <input type="tel" name="phone" value={form.phone} onChange={onChange} className="form-input" />
            </label>
            <button type="submit" className="btn" disabled={saving} style={{ width: 'fit-content' }}>
              {saving ? 'Sauvegarde...' : 'Enregistrer'}
            </button>
          </form>
        </div>

        <div style={card()}>
          <div style={title()}>Sécurité</div>
          <form onSubmit={onChangePassword} style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
            <label>
              Mot de passe actuel
              <input type="password" name="current" value={passwords.current} onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))} className="form-input" />
            </label>
            <label>
              Nouveau mot de passe
              <input type="password" name="next" value={passwords.next} onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))} className="form-input" />
            </label>
            <label>
              Confirmer le mot de passe
              <input type="password" name="confirm" value={passwords.confirm} onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))} className="form-input" />
            </label>
            <button type="submit" className="btn" style={{ width: 'fit-content' }}>
              Mettre à jour le mot de passe
            </button>
          </form>
        </div>

        <div style={card({ borderColor: '#fee2e2' })}>
          <div style={title({ color: '#991b1b' })}>Danger zone</div>
          <p style={{ color: '#6b7280', marginTop: 0 }}>Supprimer définitivement votre compte et toutes les données associées.</p>
          <button onClick={onDeleteAccount} className="btn" style={{ padding: '8px 12px', border: '1px solid #ef4444', color: '#ef4444', background: '#fff', borderRadius: 8 }}>
            Supprimer mon compte
          </button>
        </div>
      </section>
    </div>
  );
}

function card(extra) {
  return { background: '#fff', border: `1px solid ${extra?.borderColor || '#e5e7eb'}`, borderRadius: 16, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,.04)' };
}
function title(extra) {
  return { fontWeight: 700, marginBottom: 10, color: extra?.color || '#111827' };
}
