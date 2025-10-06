import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../lib/auth";
import { addToCart } from "../lib/cart";
import { fetchProducts } from "../lib/api";

function formatPrice(p) {
  const n = typeof p === 'number' ? p : parseFloat(String(p).replace(',', '.'));
  return Number.isFinite(n) ? `${n.toFixed(2).replace('.', ',')} €` : String(p);
}

export default function ProductsGrid({ products: override }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error("Erreur chargement produits :", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const items = override?.length ? override : products;

  const onAdd = useCallback((product) => {
    if (!isLoggedIn()) {
      navigate('/login', { state: { from: location } });
      return;
    }
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
    window.dispatchEvent(new CustomEvent('cart:add', { detail: { id: product.id } }));
    alert("Produit ajouté au panier");
  }, [navigate, location]);

  if (loading) return <p>Chargement...</p>;

  return (
    <section className="products-grid">
      {items.map(p => (
        <div key={p.id} className="product-card">
          <img src={p.image} alt={p.name} />
          {/* <img src={`http://localhost:8000/storage/${p.image}`} alt={p.name} /> */}
          <h4>{p.name}</h4>
          <p>{formatPrice(p.price)}</p>
          {/* <span>Quantité : {p.qte}</span> */}
          <button onClick={() => onAdd(p)}>Ajouter au panier</button>
        </div>
      ))}
    </section>
  );
}