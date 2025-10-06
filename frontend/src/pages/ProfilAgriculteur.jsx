import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import {
  Mail, Phone, MapPin, Edit, Trash2, Home, Sprout, Lock, Bell,
  User, Camera, FileText, KeyRound, BarChart3, ArrowLeft
} from "lucide-react";
import { getUser, saveAuth, logout } from "../lib/auth";
import Footer from "../components/Footer";

/* ----- Formulaire Produit avec Upload Image ----- */
function ProductForm({ initial = {}, onSave, onCancel }) {
  const [p, setP] = useState({
    id: initial.id || null,
    name: initial.name || "",
    price: initial.price != null ? initial.price : "",
    stock: initial.stock || "En stock",
    image: initial.image || "",
    category: initial.category || "",
  });

  const handleChange = (e) => setP(s => ({ ...s, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setP(s => ({ ...s, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!p.name.trim()) return alert("Nom du produit requis");
    onSave({ ...p, price: Number(String(p.price).replace(",", ".") || 0) });
  };

  return (
    <form className="prod-form" onSubmit={submit}>
      <label>Nom</label>
      <input name="name" value={p.name} onChange={handleChange} />
      <label>Prix (€)</label>
      <input name="price" value={p.price} onChange={handleChange} />
      <label>Catégorie</label>
      <input name="category" value={p.category} onChange={handleChange} />
      <label>Disponibilité</label>
      <select name="stock" value={p.stock} onChange={handleChange}>
        <option>En stock</option>
        <option>Faible stock</option>
        <option>Rupture de stock</option>
      </select>
      <label>Image du produit</label>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {p.image && <img src={p.image} alt="Aperçu" style={{ width: 100, height: 100, marginTop: 10, borderRadius: 8 }} />}
      <div className="prod-form-actions">
        <button type="submit" className="btn btn-green">Enregistrer</button>
        <button type="button" className="btn btn-outline" onClick={onCancel}>Annuler</button>
      </div>
    </form>
  );
}

/* ----- Formulaire mot de passe ----- */
function ChangePasswordForm({ onSave, onCancel }) {
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!p1 || p1 !== p2) return alert("Les mots de passe ne correspondent pas");
    onSave(p1);
  };
  return (
    <form className="change-pass-form" onSubmit={submit}>
      <label>Nouveau mot de passe</label>
      <input type="password" value={p1} onChange={(e) => setP1(e.target.value)} />
      <label>Confirmer</label>
      <input type="password" value={p2} onChange={(e) => setP2(e.target.value)} />
      <div className="modal-actions">
        <button type="submit" className="btn btn-green">Valider</button>
        <button type="button" className="btn btn-outline" onClick={onCancel}>Annuler</button>
      </div>
    </form>
  );
}

/* ----- Composant ProfilAgriculteur ----- */
export default function ProfilAgriculteur() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getUser() || null);
  const [localUser, setLocalUser] = useState(user || {});
  const [products, setProducts] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showFarmModal, setShowFarmModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMyProducts, setShowMyProducts] = useState(false);

  const [salesData, setSalesData] = useState([]);

  /* --- clés locales (scopées par utilisateur) --- */
  const productsKey = useMemo(() => {
    const id = (user?.email || user?.name || "anon").replace(/\s+/g, "_");
    return `products_${id}`;
  }, [user]);

  const salesKey = useMemo(() => {
    const id = (user?.email || user?.name || "anon").replace(/\s+/g, "_");
    return `sales_${id}`;
  }, [user]);

  const notificationsKey = useMemo(() => {
    const id = (user?.email || user?.name || "anon").replace(/\s+/g, "_");
    return `notifications_${id}`;
  }, [user]);

  /* ----- Notifications (par utilisateur) ----- */
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    // charge notifications pour l'utilisateur courant
    try {
      const raw = localStorage.getItem(notificationsKey);
      setNotifications(raw ? JSON.parse(raw) : []);
    } catch {
      setNotifications([]);
    }
  }, [notificationsKey]);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const saveNotifications = (next) => {
    setNotifications(next);
    try { localStorage.setItem(notificationsKey, JSON.stringify(next)); } catch {}
    window.dispatchEvent(new Event("notifications:changed"));
  };

  const addNotification = (title) => {
    // si notifications désactivées explicitement => ne rien faire
    const enabled = (localUser?.notifications ?? true); // undefined -> true
    if (!enabled) return;
    const newNotif = { id: Date.now(), title, read: false };
    const next = [newNotif, ...notifications];
    saveNotifications(next);
  };

  const removeNotification = (id) => {
    const next = notifications.filter(n => n.id !== id);
    saveNotifications(next);
  };

  const markAllRead = () => {
    const next = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(next);
  };

  const clearAllNotifications = () => {
    saveNotifications([]);
  };

  /* ----- Sync user / produits / ventes ----- */
  useEffect(() => {
    // met à jour le user si un événement global auth:changed est dispatché (ex: logout / profile update)
    const onAuthChanged = () => {
      const fresh = getUser();
      setUser(fresh || null);
      setLocalUser(fresh || {});
    };
    window.addEventListener("auth:changed", onAuthChanged);
    return () => window.removeEventListener("auth:changed", onAuthChanged);
  }, []);

  useEffect(() => {
    // Redirige si pas connecté
    if (!user) {
      navigate("/login");
      return;
    }
    // charge produits et ventes pour l'utilisateur courant
    try {
      const raw = localStorage.getItem(productsKey);
      setProducts(raw ? JSON.parse(raw) : []);
    } catch { setProducts([]); }

    try {
      const salesRaw = localStorage.getItem(salesKey);
      setSalesData(salesRaw ? JSON.parse(salesRaw) : []);
    } catch { setSalesData([]); }

    // si localUser vierge, remplir
    setLocalUser(user);
  }, [user, navigate, productsKey, salesKey]);

  const saveUser = (next) => {
    setLocalUser(next);
    setUser(next);
    try { saveAuth(next, localStorage.getItem("farmlink_token") || ""); } catch {}
    window.dispatchEvent(new Event("auth:changed"));
  };

  const persistProducts = (next) => {
    setProducts(next);
    try { localStorage.setItem(productsKey, JSON.stringify(next)); } catch {}
    window.dispatchEvent(new Event("products:changed"));
  };

  const persistSales = (next) => {
    setSalesData(next);
    try { localStorage.setItem(salesKey, JSON.stringify(next)); } catch {}
  };

  /* ----- Produits: ajout / édition / suppression ----- */
  const handleAddProduct = (prod) => {
    const next = [...products, { ...prod, id: Date.now() }];
    persistProducts(next);
    setShowProductForm(false);
    setProductToEdit(null);
    addNotification(`Produit ajouté : "${prod.name}"`);
  };

  const handleEditProduct = (prod) => {
    const next = products.map(p => p.id === prod.id ? prod : p);
    persistProducts(next);
    setShowProductForm(false);
    setProductToEdit(null);
    addNotification(`Produit modifié : "${prod.name}"`);
  };

  const handleDeleteProduct = (id) => {
    if (!confirm("Supprimer ce produit ?")) return;
    const removed = products.find(p => p.id === id);
    const next = products.filter(p => p.id !== id);
    persistProducts(next);
    addNotification(`Produit supprimé : "${removed?.name || 'Produit'}"`);
  };

  /* ----- Avatar ----- */
  const handleAvatarChange = (file, onSaveCallback) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const next = { ...localUser, avatar: reader.result };
      setLocalUser(next);
      if (onSaveCallback) onSaveCallback(next);
      addNotification("Photo de profil mise à jour");
      // enregistre user
      saveUser(next);
    };
    reader.readAsDataURL(file);
  };

  /* ----- Toggle notifications (paramètre utilisateur) ----- */
  const toggleNotifications = () => {
    const next = { ...localUser, notifications: !localUser.notifications };
    saveUser(next);
    // si l'utilisateur désactive, on ne supprime pas l'historique mais on arrête d'ajouter des nouvelles notifs
  };

  /* ----- Supprimer compte ----- */
  const handleDeleteAccount = () => {
    if (!confirm("Confirmer la suppression de votre compte ?")) return;
    logout();
    try { localStorage.removeItem(productsKey); } catch {}
    try { localStorage.removeItem(notificationsKey); } catch {}
    window.dispatchEvent(new Event("auth:changed"));
    setUser(null);
    setLocalUser({});
    navigate("/");
    alert("Compte supprimé.");
  };

  const formatPrice = (v) => {
    const n = Number(v || 0);
    return n.toFixed(2).replace(".", ",") + "€";
  };

  const sampleMonths = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

  /* ----------------- Rendu ----------------- */
  return (
    <>
      <main className="profil-container">
        {!showMyProducts ? (
          <>
            <div className="profil-header">
              <div className="profil-left">
                <div
                  className="avatar-big"
                  style={{ backgroundImage: `url(${localUser.avatar || "/images/avatar-placeholder.png"})` }}
                  title={localUser.name}
                />
                <div className="profil-info">
                  <h1>{localUser.name || "Utilisateur"}</h1>
                  <p className="role-line"><Sprout size={14} /> {localUser.role || "Agriculteur"}</p>
                  <p className="email-line"><Mail size={14} /> {localUser.email}</p>
                </div>
              </div>

              <div className="profil-actions">
                <button className="btn btn-outline" onClick={() => setShowNotifications(true)}>
                  <Bell size={14} /> Notifications {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                </button>
                <button className="btn btn-green" onClick={() => setShowProfileModal(true)}>Modifier le profil</button>
              </div>
            </div>

            <section className="profil-grid">
              <div className="card info-card">
                <div className="card-title">
                  <h3><User size={18} /> Informations personnelles</h3>
                  <button className="small-edit" onClick={() => setShowProfileModal(true)}><Edit size={14} /></button>
                </div>
                <div className="info-list">
                  <p><strong><User size={14} /> Nom:</strong> {localUser.name || "-"}</p>
                  <p><strong><Mail size={14} /> Email:</strong> {localUser.email || "-"}</p>
                  <p><strong><Phone size={14} /> Tél:</strong> {localUser.phone || "-"}</p>
                  <p><strong><MapPin size={14} /> Adresse:</strong> {localUser.address || "-"}</p>
                </div>
              </div>

              <div className="card farm-card">
                <div className="card-title">
                  <h3><Home size={18} /> Ma Ferme</h3>
                  <button className="small-edit" onClick={() => setShowFarmModal(true)}><Edit size={14} /> </button>
                </div>
                <div className="farm-list">
                  <p><strong><Home size={14} /> Nom de la ferme:</strong> {localUser.farmName || "-"}</p>
                  <p><strong><MapPin size={14} /> Localisation:</strong> {localUser.location || localUser.address || "-"}</p>
                  <p><strong><FileText size={14} /> Description:</strong> {localUser.bio || "-"}</p>
                  <p><strong><Sprout size={14} /> Cultures principales:</strong> {localUser.crops || "-"}</p>
                </div>
              </div>

              <div className="card products-card">
                <div className="card-title"><h3><Sprout size={18} /> Mes Produits</h3></div>
                <div className="products-summary">
                  <div><strong>Total listés:</strong> {products.length}</div>
                  <div><strong>Actifs:</strong> {products.filter(p => p.stock === "En stock").length}</div>
                  <div><strong>Rupture:</strong> {products.filter(p => p.stock === "Rupture de stock").length}</div>
                </div>
                <div className="products-actions">
                  <button className="btn btn-green" onClick={() => { setProductToEdit(null); setShowProductForm(true); }}>Ajouter un produit</button>
                  <button className="btn btn-outline" onClick={() => setShowMyProducts(true)}>Voir mes produits</button>
                </div>
              </div>
            </section>
<section className="card stats-card">
  <h3><BarChart3 size={18} /> Statistiques de Vente</h3>
  <div style={{ width: "100%", height: 320 }}>
    <ResponsiveContainer width="100%" height="100%">
      {(() => {
        const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
        const chartData = months.map(mois => {
          const found = salesData.find(s => s.mois === mois) || {};
          return {
            mois,
            ventes: Number(found.ventes) || 0,
            revenus: Number(found.revenus) || 0,
          };
        });
        return (
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="mois" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => name === "revenus" ? `${value} €` : value} 
            />
            <Legend />
            <Line type="monotone" dataKey="ventes" stroke="#16a34a" strokeWidth={2} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="revenus" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 6 }} />
          </LineChart>
        );
      })()}
    </ResponsiveContainer>
  </div>
</section>


            <section className="card settings-card">
              <div className="card-title"><h3><Lock size={18} /> Paramètres du compte</h3></div>
              <ul className="settings-list">
                <li>
                  <button className="setting-row" onClick={() => setShowPasswordModal(true)}>
                    <KeyRound size={16} /> <span>Changer le mot de passe</span>
                  </button>
                </li>
                <li>
                  <button className="setting-row" onClick={toggleNotifications}>
                    <Bell size={16} /> <span>Activer les notifications</span>
                    <div className={"switch " + (localUser.notifications ? "on" : "off")}><div className="knob" /></div>
                  </button>
                </li>
                <li>
                  <button className="setting-row danger" onClick={handleDeleteAccount}>
                    <Trash2 size={16} /> <span>Supprimer le compte</span>
                  </button>
                </li>
              </ul>
            </section>
          </>
        ) : (
          <section className="card">
            <button className="btn btn-outline" onClick={() => setShowMyProducts(false)}>
              <ArrowLeft size={14} /> Retour
            </button>
            <h3>Mes Produits</h3>
            <ul className="products-list">
              {products.map(p => (
                <li key={p.id}>
                  <div className="p-left">
                    <img src={p.image || "/images/product-placeholder.png"} alt={p.name} />
                    <div>
                      <div className="p-name">{p.name}</div>
                      <div className="p-cat">{p.category}</div>
                    </div>
                  </div>
                  <div className="p-right">
                    <div className="p-price">{formatPrice(p.price)}</div>
                    <div className={"p-stock " + p.stock.replace(/\s+/g, "-").toLowerCase()}>{p.stock}</div>
                    <div className="p-actions">
                      <button className="btn small" onClick={() => { setProductToEdit(p); setShowProductForm(true); }}>Éditer</button>
                      <button className="btn small btn-red" onClick={() => handleDeleteProduct(p.id)}><Trash2 size={14} /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Modals */}
        {showProductForm && (
          <div className="modal-backdrop" onClick={() => { setShowProductForm(false); setProductToEdit(null); }}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h4>{productToEdit ? "Modifier le produit" : "Ajouter un produit"}</h4>
              <ProductForm
                initial={productToEdit || {}}
                onSave={(prod) => productToEdit ? handleEditProduct(prod) : handleAddProduct(prod)}
                onCancel={() => { setShowProductForm(false); setProductToEdit(null); }}
              />
            </div>
          </div>
        )}

        {showProfileModal && (
          <div className="modal-backdrop" onClick={() => setShowProfileModal(false)}>
            <div className="modal profile-modal" onClick={(e) => e.stopPropagation()}>
              <h4>Modifier le profil</h4>
              <div className="profile-edit-grid">
                <div className="avatar-edit">
                  <div className="avatar-preview-large" style={{ backgroundImage: `url(${localUser.avatar || "/images/avatar-placeholder.png"})` }} />
                  <label className="btn btn-outline file-label">
                    <Camera size={14} /> Changer la photo
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      handleAvatarChange(file, saveUser);
                    }} />
                  </label>
                </div>
                <form className="profile-edit-form" onSubmit={(e) => { e.preventDefault(); saveUser(localUser); setShowProfileModal(false); addNotification("Profil mis à jour"); }}>
                  <label>Nom</label>
                  <input value={localUser.name || ""} onChange={(e) => setLocalUser(s => ({ ...s, name: e.target.value }))} />
                  <label>Email</label>
                  <input value={localUser.email || ""} onChange={(e) => setLocalUser(s => ({ ...s, email: e.target.value }))} />
                  <label>Téléphone</label>
                  <input value={localUser.phone || ""} onChange={(e) => setLocalUser(s => ({ ...s, phone: e.target.value }))} />
                  <label>Adresse</label>
                  <input value={localUser.address || ""} onChange={(e) => setLocalUser(s => ({ ...s, address: e.target.value }))} />
                  <div className="modal-actions">
                    <button type="submit" className="btn btn-green">Sauvegarder</button>
                    <button type="button" className="btn btn-outline" onClick={() => setShowProfileModal(false)}>Annuler</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showFarmModal && (
          <div className="modal-backdrop" onClick={() => setShowFarmModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h4>Modifier les informations de la ferme</h4>
              <form onSubmit={(e) => { e.preventDefault(); saveUser(localUser); setShowFarmModal(false); addNotification("Informations de la ferme mises à jour"); }}>
                <label>Nom de la ferme</label>
                <input value={localUser.farmName || ""} onChange={(e) => setLocalUser(s => ({ ...s, farmName: e.target.value }))} />
                <label>Localisation</label>
                <input value={localUser.location || ""} onChange={(e) => setLocalUser(s => ({ ...s, location: e.target.value }))} />
                <label>Description (bio)</label>
                <textarea value={localUser.bio || ""} onChange={(e) => setLocalUser(s => ({ ...s, bio: e.target.value }))} />
                <label>Cultures principales</label>
                <input value={localUser.crops || ""} onChange={(e) => setLocalUser(s => ({ ...s, crops: e.target.value }))} />
                <div className="modal-actions">
                  <button type="submit" className="btn btn-green">Sauvegarder</button>
                  <button type="button" className="btn btn-outline" onClick={() => setShowFarmModal(false)}>Annuler</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showPasswordModal && (
          <div className="modal-backdrop" onClick={() => setShowPasswordModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h4>Changer le mot de passe</h4>
              <ChangePasswordForm
                onSave={(newPass) => { saveUser({ ...localUser, password: newPass }); alert("Mot de passe mis à jour."); setShowPasswordModal(false); addNotification("Mot de passe changé"); }}
                onCancel={() => setShowPasswordModal(false)}
              />
            </div>
          </div>
        )}

        {showNotifications && (
          <div className="modal-backdrop" onClick={() => setShowNotifications(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h4>Notifications</h4>
              <ul className="notif-list">
                {notifications.length === 0 ? <li>Aucune notification</li> :
                  notifications.map(n => (
                    <li key={n.id} className={n.read ? "read" : "unread"} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, marginRight: 8, cursor: "pointer" }} onClick={() => {
                        // toggle read state on click
                        const next = notifications.map(x => x.id === n.id ? { ...x, read: !x.read } : x);
                        saveNotifications(next);
                      }}>
                        {n.title}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button title="Supprimer" className="btn small btn-red" onClick={() => removeNotification(n.id)}><Trash2 size={14} /></button>
                      </div>
                    </li>
                  ))
                }
              </ul>
              <div className="modal-actions">
                <button className="btn btn-green" onClick={() => markAllRead()}>Tout lire</button>
                <button className="btn btn-red" onClick={() => clearAllNotifications()}>Tout supprimer</button>
                <button className="btn btn-outline" onClick={() => setShowNotifications(false)}>Fermer</button>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </>
  );
}
