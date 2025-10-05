import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getCart, saveCart } from "../lib/cart";

export default function Orders() {
  const [items, setItems] = useState([]);

  // Charger le panier depuis le stockage
  useEffect(() => {
    setItems(getCart());
  }, []);

  // Total calculé
  const total = useMemo(() => items.reduce((s, it) => s + (it.price || 0) * (it.qty || 1), 0), [items]);

  const updateAndPersist = useCallback((next) => {
    setItems(next);
    saveCart(next);
    try { window?.dispatchEvent(new Event('cart:add')); } catch {}
  }, []);

  const inc = (id) => {
    const next = items.map((it) => it.id === id ? { ...it, qty: (it.qty || 1) + 1 } : it);
    updateAndPersist(next);
  };
  const dec = (id) => {
    const next = items
      .map((it) => it.id === id ? { ...it, qty: Math.max(1, (it.qty || 1) - 1) } : it);
    updateAndPersist(next);
  };
  const changeQty = (id, v) => {
    const n = Math.max(1, Number.isFinite(+v) ? Math.floor(+v) : 1);
    const next = items.map((it) => it.id === id ? { ...it, qty: n } : it);
    updateAndPersist(next);
  };
  const removeItem = (id) => {
    const next = items.filter((it) => it.id !== id);
    updateAndPersist(next);
  };

  return (
    <div style={{ padding: "2rem 1rem", maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Votre Panier</h1>

      <section style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,.06)", marginBottom: 24 }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#6b7280' }}>
            <p style={{ margin: '16px 0' }}>Votre panier est vide.</p>
            <Link to="/marche" className="btn" style={{ background: '#2563eb', color: '#fff', padding: '10px 16px', borderRadius: 8, textDecoration: 'none' }}>
              Découvrir des produits
            </Link>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gap: 12 }}>
              {items.map((it) => (
                <div key={it.id} style={{ display: "grid", gridTemplateColumns: "64px 1fr auto", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 64, height: 48, borderRadius: 8, background: `#f3f4f6 url(${it.image || it.img || ''}) center/cover` }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{it.name}</div>
                    <div style={{ color: "#6b7280", fontSize: 14 }}>{(it.price || 0).toFixed(2)} €</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                      <button onClick={() => dec(it.id)} aria-label="Diminuer" style={btnQty()}>-</button>
                      <input
                        type="number"
                        min={1}
                        value={it.qty || 1}
                        onChange={(e) => changeQty(it.id, e.target.value)}
                        style={{ width: 56, textAlign: 'center', padding: '6px 8px', border: '1px solid #e5e7eb', borderRadius: 8 }}
                      />
                      <button onClick={() => inc(it.id)} aria-label="Augmenter" style={btnQty()}>+</button>
                      <button onClick={() => removeItem(it.id)} aria-label="Retirer" style={btnRemove()}>Retirer</button>
                    </div>
                  </div>
                  <div style={{ fontWeight: 600 }}>{((it.price || 0) * (it.qty || 1)).toFixed(2)} €</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontWeight: 600 }}>
              <span>Total:</span>
              <span>{total.toFixed(2)} €</span>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
              <Link to="/marche" className="btn" style={{ background: '#2563eb', color: '#fff', padding: '10px 16px', borderRadius: 8, textDecoration: 'none' }}>
                Continuer mes achats
              </Link>
              <Link to="/checkout" className="btn" style={{ background: '#16a34a', color: '#fff', padding: '10px 16px', borderRadius: 8, textDecoration: 'none' }}>
                Passer la commande
              </Link>
              <button
                onClick={() => updateAndPersist([])}
                className="btn"
                style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #ef4444', color: '#ef4444', background: '#fff' }}
              >
                Vider le panier
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function btnQty() {
  return { width: 36, height: 36, borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer' };
}
function btnRemove() {
  return { padding: '6px 10px', borderRadius: 8, border: '1px solid #ef4444', color: '#ef4444', background: '#fff', cursor: 'pointer' };
}
