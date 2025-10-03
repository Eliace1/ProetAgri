import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../lib/auth";

export default function Checkout() {
  const navigate = useNavigate();
  const user = getUser();
  const [form, setForm] = useState({
    address: user?.companyName || "",
  });
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.address) {
      setError("Veuillez renseigner votre adresse de livraison.");
      return;
    }
    try {
      sessionStorage.setItem("checkout_info", JSON.stringify(form));
    } catch {}
    navigate("/paiement");
  };

  return (
    <div style={{ padding: "2rem 1rem", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Adresse de livraison</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
        <label>
          Adresse
          <input name="address" value={form.address} onChange={onChange} className="form-input" required />
        </label>
        {error && <div style={{ color: '#dc2626' }}>{error}</div>}
        <div style={{ display:'flex', gap: 12 }}>
          <button type="button" onClick={() => navigate('/commandes')} className="btn" style={{ padding:'10px 16px', borderRadius:8 }}>
            Retour au panier
          </button>
          <button type="submit" className="btn" style={{ background:'#16a34a', color:'#fff', padding:'10px 16px', borderRadius:8 }}>
            Continuer vers paiement
          </button>
        </div>
      </form>
    </div>
  );
}
