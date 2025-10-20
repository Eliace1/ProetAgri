import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../lib/auth";
import { getCart, clearCart } from "../lib/cart";
import { createOrder } from "../lib/api"; //  fonction API Laravel

export default function Checkout() {
  const navigate = useNavigate();
  const user = getUser();
  const [form, setForm] = useState({
    address: user?.companyName || "",
  });
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const total = useMemo(
    () => items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 1), 0),
    [items]
  );

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.address) {
      setError("Veuillez renseigner votre adresse de livraison.");
      return;
    }

    if (!items || items.length === 0) {
      navigate("/commandes");
      return;
    }

    try {
      await createOrder(user.id, form.address, items); // ✅ envoi vers Laravel
      sessionStorage.setItem("checkout_info", JSON.stringify(form));
      clearCart(); // vide le panier après commande
      navigate("/paiement");
    } catch (err) {
      console.error("Erreur lors de la commande :", err);
      setError("Impossible de valider la commande. Veuillez réessayer.");
    }
  };

  return (
    <div style={{ padding: "2rem 1rem", maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Adresse de livraison</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr .7fr', gap: 20 }}>
        {/* Colonne formulaire */}
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,.06)' }}>
          <label>
            Adresse
            <input name="address" value={form.address} onChange={onChange} className="form-input" required />
          </label>
          {error && <div style={{ color: '#dc2626' }}>{error}</div>}
          <div style={{ display:'flex', gap: 12, flexWrap: 'wrap' }}>
            <button type="button" onClick={() => navigate('/commandes')} className="btn" style={{ padding:'10px 16px', borderRadius:8 }}>
              Retour au panier
            </button>
            <button type="submit" className="btn" style={{ background:'#16a34a', color:'#fff', padding:'10px 16px', borderRadius:8 }}>
              Continuer vers paiement
            </button>
          </div>
        </form>

        {/* Colonne récapitulatif */}
        <aside style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,.06)', alignSelf: 'start' }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Votre commande</div>
          {(!items || items.length === 0) ? (
            <div style={{ color: '#6b7280' }}>Votre panier est vide.</div>
          ) : (
            <>
              <div style={{ display: 'grid', gap: 10 }}>
                {items.map((it) => (
                  <div key={it.id} style={{ display: 'grid', gridTemplateColumns: '56px 1fr auto', gap: 10, alignItems: 'center' }}>
                    <div style={{
                      width: 56,
                      height: 42,
                      borderRadius: 8,
                      background: `#f3f4f6 url(${it.image || it.img || ''}) center/cover`
                    }} />
                    <div>
                      <div style={{ fontWeight: 600 }}>{it.name}</div>
                      <div style={{ color: '#6b7280', fontSize: 13 }}>x{it.qty || 1}</div>
                    </div>
                    <div style={{ fontWeight: 600 }}>
                      {((Number(it.price)||0) * (Number(it.qty)||1)).toFixed(2)} €
                    </div>
                  </div>
                ))}
              </div>
              <hr style={{ margin: '12px 0', border: 0, borderTop: '1px solid #e5e7eb' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}