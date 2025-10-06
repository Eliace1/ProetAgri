import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isLoggedIn } from '../lib/auth';
import { addToCart } from '../lib/cart';

const fallbackProducts = [

];

function formatPrice(p) {
  const n = typeof p === 'number' ? p : parseFloat(String(p).replace(',', '.'));
  if (!Number.isFinite(n)) return String(p);
  return `${n.toFixed(2).replace('.', ',')} €`;
}

export default function ProductsGrid({ products: overrideProducts }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error("Erreur lors du chargement des produits :", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const items = Array.isArray(overrideProducts) && overrideProducts.length
    ? overrideProducts
    : products.length ? products : [];

  const onAdd = useCallback((product) => {
    if (!isLoggedIn()) {
      navigate('/login', { replace: false, state: { from: location } });
      return;
    }
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
    // feedback simple
    try { window?.dispatchEvent(new CustomEvent('cart:add', { detail: { id: product.id } })); } catch {}
  }, [navigate, location]);

  if (loading) return <p>Chargement des produits...</p>;

  const getFarmName = (p) => {
    return (
      p?.farmName ||
      p?.farm_name ||
      p?.farm ||
      p?.producerName ||
      p?.producer ||
      p?.agriculteurNom ||
      p?.agriculteur?.nom ||
      ""
    );
  };

  return (
    <section className="products-grid">
      {items.map((product) => (
        <div key={product.id} className="product-card">
          <img src={product.image} alt={product.name} />
          <h4>{product.name}</h4>
          <p className="price">{formatPrice(product.price)}</p>
          {getFarmName(product) && (
            <span className="farm-name">{getFarmName(product)}</span>
          )}
          <button onClick={() => onAdd(product)}>Ajouter au panier</button>
        </div>
      ))}
    </section>
  );
}