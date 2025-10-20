import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, saveCart } from "../lib/cart";
import { addOrder } from "../api/orders";

export default function Payment() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [method, setMethod] = useState("card");
  const [info, setInfo] = useState(null);

  useEffect(() => {
    setItems(getCart());
    try {
      const raw = sessionStorage.getItem("checkout_info");
      setInfo(raw ? JSON.parse(raw) : null);
    } catch {}
  }, []);

  const total = useMemo(() => items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0), [items]);

  const pay = () => {
    console.log(items,info,method)
    // Mock paiement réussi – laisse l'état par défaut "En attente"
    addOrder({ items, total, info, method });
    saveCart([]);
    try { sessionStorage.removeItem("checkout_info"); } catch {}
    navigate("/client", { replace: true });
  };

  if (!items.length) {
    return (
      <div style={{ padding: "2rem 1rem", maxWidth: 900, margin: "0 auto" }}>
        <p>Votre panier est vide.</p>
        <button className="btn" onClick={() => navigate('/marche')}>Aller au marché</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem 1rem", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Paiement</h1>

      <section style={{ display:'grid', gap:16 }}>
        <div style={{ background:'#fff', padding:16, borderRadius:12, boxShadow:'0 1px 4px rgba(0,0,0,.06)' }}>
          <h3>Récapitulatif</h3>
          <ul style={{ paddingLeft: 18 }}>
            {items.map((it) => (
              <li key={it.id}>{it.name} × {it.qty || 1} — {((it.price || 0) * (it.qty || 1)).toFixed(2)} €</li>
            ))}
          </ul>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop: 8, fontWeight:600 }}>
            <span>Total</span>
            <span>{total.toFixed(2)} €</span>
          </div>
        </div>

        <div style={{ background:'#fff', padding:16, borderRadius:12, boxShadow:'0 1px 4px rgba(0,0,0,.06)' }}>
          <h3>Méthode de paiement</h3>
          <label style={{ display:'flex', gap:8, alignItems:'center' }}>
            <input type="radio" name="method" value="card" checked={method==='card'} onChange={(e)=>setMethod(e.target.value)} /> Carte bancaire
          </label>
          <label style={{ display:'flex', gap:8, alignItems:'center', marginTop:8 }}>
            <input type="radio" name="method" value="wallet" checked={method==='wallet'} onChange={(e)=>setMethod(e.target.value)} /> Portefeuille mobile
          </label>
          <div style={{ display:'flex', gap:12, marginTop:16 }}>
            <button className="btn" onClick={()=>navigate('/checkout')} style={{ padding:'10px 16px', borderRadius:8 }}>Retour</button>
            <button className="btn" onClick={pay} style={{ background:'#16a34a', color:'#fff', padding:'10px 16px', borderRadius:8 }}>Payer maintenant</button>
          </div>
        </div>
      </section>
    </div>
  );
}
