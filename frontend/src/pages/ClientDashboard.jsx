import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getUser } from "../lib/auth";
import { fetchUserOrders, cancelUserOrder } from "../lib/api";

export default function ClientDashboard() {
  const [user, setUser] = useState(getUser());
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", companyName: "", phone: "", profile: "" });
  const [saving, setSaving] = useState(false);
  const defaultAvatar =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" 0y2="1">
            <stop offset="0%" stop-color="#dbeafe"/>
            <stop offset="100%" stop-color="#bfdbfe"/>
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="32" fill="url(#g)"/>
        <circle cx="32" cy="24" r="10" fill="#ffffff"/>
        <path d="M12 56c4-12 16-16 20-16s16 4 20 16" fill="#ffffff"/>
      </svg>`
    );

  useEffect(() => {
    const u = getUser();
    setUser(u);
    setForm({
      name: u?.name || "",
      email: u?.email || "",
      companyName: u?.companyName || "",
      phone: u?.phone || "",
      profile: u?.profile || "",
    });
    (async () => {
  const data = await listMyOrders();
  setOrders(data);
})();
  }, []);

  const total_amountSpent = useMemo(() => orders.reduce((s, o) => s + (o.total_amount || 0), 0), [orders]);
  const ordersCount = orders.length;

  const monthly = useMemo(() => {
    const arr = Array.from({ length: 12 }, () => 0);
    const now = new Date();
    orders.forEach(o => {
      const d = new Date(o.created_at);
      const diff = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
      if (diff >= 0 && diff < 12) arr[11 - diff] += Number(o.total_amount || 0);
    });
    return arr;
  }, [orders]);

  const ordersDeltaText = useMemo(() => {
    const now = new Date();
    const curY = now.getFullYear();
    const curM = now.getMonth();
    const prevM = curM === 0 ? 11 : curM - 1;
    const prevY = curM === 0 ? curY - 1 : curY;
    let cur = 0, prev = 0;
    orders.forEach(o => {
      const d = new Date(o.created_at);
      const y = d.getFullYear();
      const m = d.getMonth();
      if (y === curY && m === curM) cur += 1;
      else if (y === prevY && m === prevM) prev += 1;
    });
    if (prev === 0 && cur === 0) return "0% vs mois dernier";
    if (prev === 0 && cur > 0) return "+100% vs mois dernier";
    const pct = Math.round(((cur - prev) / prev) * 100);
    const sign = pct > 0 ? "+" : "";
    return `${sign}${pct}% vs mois dernier`;
  }, [orders]);

  const topProducts = useMemo(() => {
    const map = new Map();
    orders.forEach((o) => {
      if (!Array.isArray(o.products)) return;
      o.products.forEach((it) => {
        const key = it.name || `#${it.id || "?"}`;
        const prev = map.get(key) || { name: key, qty: 0, total_amount: 0 };
        prev.qty += Number(it.qty || 1);
        prev.total_amount += Number(it.price || 0) * Number(it.qty || 1);
        map.set(key, prev);
      });
    });
    return Array.from(map.values()).sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [orders]);

  const categories = useMemo(() => {
    const allCategories = ['Fruits', 'Légumes', 'Céréales', 'Produits Laitiers', 'Viandes', 'Autres'];
    const map = new Map();
    orders.forEach(o => {
      (o.items || []).forEach(it => {
        const cat = it.category || it.cat || 'Autres';
        const prev = map.get(cat) || 0;
        map.set(cat, prev + Number(it.price || 0) * Number(it.qty || 1));
      });
    });
    const arr = allCategories.map((name) => ({ name, total: map.get(name) || 0 }));
    const sum = arr.reduce((s, a) => s + a.total, 0);
    return { arr, sum };
  }, [orders]);

  const badge = (status) => {
    const map = {
      "En attente": { bg: "#fef9c3", color: "#854d0e" },
      "En préparation": { bg: "#dbeafe", color: "#1e40af" },
      "Livrée": { bg: "#dcfce7", color: "#166534" },
      "Annulée": { bg: "#fee2e2", color: "#991b1b" },
    };
    const s = map[status] || { bg: "#e5e7eb", color: "#111827" };
    return <span style={{ padding: '2px 8px', borderRadius: 999, background: s.bg, color: s.color, fontSize: 12 }}>{status}</span>;
  };

  const onCancelOrder = async (id) => {
    try {
      await cancelUserOrder(id);
      const updated = await fetchUserOrders(user.id);
      setOrders(updated);
    } catch (err) {
      console.error("Erreur annulation commande :", err);
    }
  };

  const onAvatarChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, profile: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const onCancelOrder = (id) => {
    const upcreated_atd = cancelOrder(id);
    if (upcreated_atd) setOrders(listMyOrders());
  };

  // Dimensions du chart
  const width = 520, height = 220, pad = 28; // plus de place pour les labels
  const maxY = Math.max(100, ...monthly);
  const points = monthly.map((v, i) => {
    const x = pad + (i * (width - pad * 2)) / (monthly.length - 1 || 1);
    const y = height - pad - (v / maxY) * (height - pad * 2);
    return `${x},${y}`;
  }).join(' ');

  const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
  const monthLabels = useMemo(() => {
    const labels = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(monthNames[d.getMonth()]);
    }
    return labels;
  }, []);

  // Catégories: somme des total_amounts par item.category | 'Autres'
  const categories = useMemo(() => {
    const allCategories = ['Fruits', 'Légumes', 'Céréales', 'Produits Laitiers', 'Viandes', 'Autres'];
    const map = new Map();
    orders.forEach(o => {
      (o.products || []).forEach(it => {
        const cat = it.categorie.name || it.cat || 'Autres';
        const prev = map.get(cat) || 0;
        const montantProduits = Number(it.pivot.quantite || 1)*Number(it.price || 0);
        map.set(cat, prev + montantProduits);
        console.log(it.name, it.qte, it.price, montantProduits);
      });
    });
    // Assure que toutes les catégories existent, même à 0
    const arr = allCategories.map((name) => ({ name, total_amount: map.get(name) || 0 }));
    const sum = arr.reduce((s, a) => s + a.total_amount, 0);
    return { arr, sum, allCategories };
  }, [orders]);

  return (
    <div className="client-dashboard" style={{ padding: 24, background: '#f9fafb' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <img src={user.profile} alt="Avatar" width={56} height={56} />


          <div>
            <h1 style={{ margin: 0 }}>Tableau de bord Acheteur</h1>
            <p style={{ margin: 0, opacity: .7 }}>{user?.name}</p>
          </div>
        </div>
        <Link to="/profil" className="btn" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #2563eb', color: '#2563eb', background: '#fff', textDecoration: 'none' }}>
          Gérer mon profil
        </Link>
      </header>

            {/* Statistiques */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={card()}>
          <div style={cardTitle()}>Total Dépensé</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{total_amountSpent.toFixed(2)} €</div>
          <div style={{ fontSize: 12, opacity: .7, marginTop: 6 }}>vs mois dernier</div>
        </div>
        <div style={card()}>
          <div style={cardTitle()}>Commandes Passées</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{ordersCount}</div>
          <div style={{ fontSize: 12, opacity: .7, marginTop: 6 }}>{ordersDeltaText}</div>
        </div>
        <div style={card()}>
          <div style={cardTitle()}>Top produits commandés</div>
          {topProducts.length === 0 ? (
            <div style={{ color: '#6b7280' }}>Aucune donnée</div>
          ) : (
            <ol style={{ margin: 0, paddingLeft: 18 }}>
              {topProducts.map((p, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span>{p.name}</span>
                  <span style={{ fontWeight: 700 }}>{p.qty}</span>
                </li>
              ))}
            </ol>
          )}
          <div style={{ fontSize: 12, opacity: .7, marginTop: 6 }}>Top 5 par quantité</div>
        </div>
      </section>

      {/* Graphiques */}
      <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={card()}>
          <div style={cardTitle()}>Dépenses Mensuelles</div>
          <svg width={width} height={height} style={{ width: '100%', height }}>
            <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="#e5e7eb" />
            {[...Array(5)].map((_, i) => {
              const value = (maxY / 4) * i;
              const y = height - pad - (value / maxY) * (height - pad * 2);
              return (
                <g key={i}>
                  <line x1={pad} y1={y} x2={width - pad} y2={y} stroke="#f1f5f9" />
                  <text x={pad - 8} y={y + 3} textAnchor="end" fontSize="10" fill="#94a3b8">{value.toFixed(0)}€</text>
                </g>
              );
            })}
            <polyline fill="none" stroke="#16a34a" strokeWidth="3" points={points} />
            {points.split(' ').map((p, i) => {
              const [x, y] = p.split(',').map(Number);
              return <circle key={i} cx={x} cy={y} r="3" fill="#16a34a" />;
            })}
            {monthLabels.map((m, i) => {
              const x = pad + (i * (width - pad * 2)) / (monthLabels.length - 1 || 1);
              return (
                <g key={i}>
                  <line x1={x} y1={height - pad} x2={x} y2={height - pad + 4} stroke="#9ca3af" />
                  <text x={x} y={height - pad + 16} textAnchor="middle" fontSize="10" fill="#6b7280">{m}</text>
                </g>
              );
            })}
          </svg>
        </div>

        <div style={card()}>
          <div style={cardTitle()}>Dépenses par Catégorie</div>
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12, alignItems: 'center' }}>
            <Donut data={categories.arr} sum={categories.sum} />
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 14 }}>
              {categories.arr.map((c, i) => {
                const pct = categories.sum > 0 ? Math.round((c.total_amount / categories.sum) * 100) : 0;
                return (
                  <li key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: palette[i % palette.length] }} />
                    <span style={{ flex: 1 }}>{c.name}</span>
                    <span style={{ color: '#6b7280', minWidth: 70, textAlign: 'right' }}>{c.total_amount.toFixed(2)} €</span>
                    <strong style={{ minWidth: 36, textAlign: 'right' }}>{pct}%</strong>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Commandes récentes */}
      <section style={card()}>
        <div style={cardTitle()}>Historique d'Achats Récent</div>
        {orders.length === 0 ? (
          <p style={{ color: '#6b7280' }}>Aucune commande pour le moment.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#6b7280', fontSize: 12, background: '#f8fafc' }}>
                  <th style={thTd()}>ID</th>
                  <th style={thTd()}>Produit</th>
                  <th style={thTd('right')}>Quantité</th>
                  <th style={thTd('right')}>Total</th>
                  <th style={thTd()}>Date</th>
                  <th style={thTd()}>Statut</th>
                  <th style={thTd('right')}></th>
                </tr>
              </thead>
              <tbody>
                {orders.slice().reverse().slice(0, 8).map((o, idx) => {
                  const first = Array.isArray(o.products) && o.products[0] ? o.products[0] : null;
                  const qty = Array.isArray(o.products) ? o.products.reduce((s, it) => s + (it.qty || 1), 0) : 0;
                  return (
                    <tr key={o.id} style={{ background: idx % 2 ? '#ffffff' : '#f9fafb' }}>
                      <td style={thTd(true)}>FL-{o.id}</td>
                      <td style={thTd(true)}>
                        {(o.products || [])
                          .map(it => `${it.name} ${it.qty || 1}`)
                          .join(', ')}
                      </td>
                      <td style={thTd(true)}>{qty}</td>
                      <td style={thTd(true, 'right')}>{Number(o.total_amount).toFixed(2)} €</td>
                      <td style={thTd(true)}>{new Date(o.created_at).toLocaleDateString()}</td>
                      <td style={thTd(true)}>{badge(o.status)}</td>
                      <td style={thTd(true, 'right')}>
                        {o.status === 'En attente' && (
                          <button onClick={() => onCancelOrder(o.id)} className="btn" style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #ef4444', color: '#ef4444', background: '#fff' }}>
                            Annuler
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Lien vers la page profil */}
      <section style={{ marginTop: 24 }}>
        <div style={card()}>
          <div style={cardTitle()}>Profil</div>
          <p style={{ color: '#6b7280', marginTop: 0 }}>Modifiez vos informations personnelles, photo de profil, mot de passe ou supprimez votre compte.</p>
          <Link to="/profil" className="btn" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #2563eb', color: '#2563eb', background: '#fff', textDecoration: 'none', width: 'fit-content', display: 'inline-block' }}>
            Ouvrir les paramètres du profil
          </Link>
        </div>
      </section>
    </div>
  );
}

function card() {
  return {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 1px 4px rgba(0,0,0,.04)'
  };
}

function cardTitle() {
  return {
    fontWeight: 700,
    marginBottom: 10
  };
}

function thTd(isBody = false, align = 'left') {
  return { padding: isBody ? '12px 10px' : '10px', borderBottom: '1px solid #f3f4f6', textAlign: align };
}

// Palette simple réutilisable
const palette = ["#22c55e", "#16a34a", "#86efac", "#34d399", "#10b981", "#065f46"];

function polarToCartesian(cx, cy, r, angle) {
  const rad = (angle - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return [
    "M", start.x, start.y,
    "A", r, r, 0, largeArc, 0, end.x, end.y
  ].join(" ");
}

function Donut({ data, sum }) {
  const size = 140; const cx = size / 2; const cy = size / 2; const r = 45; const inner = 28;
  let angle = 0;
  const segments = data.map((d, i) => {
    const pct = (d.total_amount / sum) * 360;
    const start = angle; const end = angle + pct;
    angle = end;
    return { start, end, color: palette[i % palette.length] };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g>
        {segments.map((s, i) => (
          <path key={i} d={arcPath(cx, cy, r, s.start, s.end)} stroke={s.color} strokeWidth={r - inner} fill="none" />
        ))}
        <circle cx={cx} cy={cy} r={inner} fill="#fff" />
      </g>
    </svg>
  );
}
