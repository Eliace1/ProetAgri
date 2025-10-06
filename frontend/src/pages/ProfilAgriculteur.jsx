import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail, Phone, MapPin, Edit, Trash2, Home, Sprout, Lock, Bell,
  User, Camera, FileText, KeyRound, BarChart3, ArrowLeft
} from "lucide-react";
import Footer from "../components/Footer";
import { getUser, saveAuth, logout } from "../lib/auth";
import {
  fetchUserProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../lib/api";

function ProductForm({ initial = {}, onSave, onCancel }) {
  const [p, setP] = useState({
    id: initial.id || null,
    name: initial.name || "",
    price: initial.price != null ? initial.price : "",
    qte: initial.qte || 0,
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
    onSave({ ...p, price: Number(String(p.price).replace(",", ".")), qte: Number(p.qte) });
  };

  return (
    <form className="prod-form" onSubmit={submit}>
      <label>Nom</label>
      <input name="name" value={p.name} onChange={handleChange} />
      <label>Prix (€)</label>
      <input name="price" value={p.price} onChange={handleChange} />
      <label>Quantité</label>
      <input name="qte" type="number" value={p.qte} onChange={handleChange} />
      <label>Catégorie</label>
      <input name="category" value={p.category} onChange={handleChange} />
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

export default function ProfilAgriculteur() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getUser() || null);
  const [localUser, setLocalUser] = useState(user || {});
  const [products, setProducts] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [showMyProducts, setShowMyProducts] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const loadProducts = async () => {
      try {
        const data = await fetchUserProducts(user.id);
        setProducts(data);
      } catch (error) {
        console.error("Erreur chargement produits :", error);
      }
    };
    loadProducts();
  }, [user, navigate]);

  const handleAddProduct = async (prod) => {
    try {
      const formData = new FormData();
      formData.append("name", prod.name);
      formData.append("price", prod.price);
      formData.append("qte", prod.qte);
      formData.append("category", prod.category);
      if (prod.image && prod.image.startsWith("data:image")) {
        const blob = await (await fetch(prod.image)).blob();
        formData.append("image", blob, "product.jpg");
      }
      await createProduct(formData);
      setShowProductForm(false);
      setProductToEdit(null);
      const updated = await fetchUserProducts(user.id);
      setProducts(updated);
    } catch (error) {
      console.error("Erreur ajout produit :", error);
    }
  };

  const handleEditProduct = async (prod) => {
    try {
      const formData = new FormData();
      formData.append("name", prod.name);
      formData.append("price", prod.price);
      formData.append("qte", prod.qte);
      formData.append("category", prod.category);
      if (prod.image && prod.image.startsWith("data:image")) {
        const blob = await (await fetch(prod.image)).blob();
        formData.append("image", blob, "product.jpg");
      }
      await updateProduct(prod.id, formData);
      setShowProductForm(false);
      setProductToEdit(null);
      const updated = await fetchUserProducts(user.id);
      setProducts(updated);
    } catch (error) {
      console.error("Erreur modification produit :", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Supprimer ce produit ?")) return;
    try {
      await deleteProduct(id);
      const updated = await fetchUserProducts(user.id);
      setProducts(updated);
    } catch (error) {
      console.error("Erreur suppression produit :", error);
    }
  };

  const formatPrice = (v) => {
    const n = Number(v || 0);
    return n.toFixed(2).replace(".", ",") + "€";
  };

  return (
    <>
      <main className="profil-container">
        {!showMyProducts ? (
          <section className="card products-card">
            <div className="card-title"><h3><Sprout size={18} /> Mes Produits</h3></div>
            <div className="products-summary">
              <div><strong>Total listés:</strong> {products.length}</div>
              <div><strong>Quantité totale:</strong> {products.reduce((s, p) => s + Number(p.qte || 0), 0)}</div>
            </div>
            <div className="products-actions">
              <button className="btn btn-green" onClick={() => { setProductToEdit(null); setShowProductForm(true); }}>Ajouter un produit</button>
              <button className="btn btn-outline" onClick={() => setShowMyProducts(true)}>Voir mes produits</button>
            </div>
          </section>
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
                    <img src={`http://localhost:8000/storage/${p.image}`} alt={p.name} />
                    <div>
                      <div className="p-name">{p.name}</div>
                      <div className="p-cat">{p.category}</div>
                    </div>
                  </div>
                  <div className="p-right">
                    <div className="p-price">{formatPrice(p.price)}</div>
                    <div className="p-qte">Quantité : {p.qte}</div>
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
      </main>
      <Footer />
    </>
  );
}