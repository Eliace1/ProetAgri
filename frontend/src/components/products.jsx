import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { isLoggedIn } from '../lib/auth';
import { addToCart } from '../lib/cart';
import { useNavigate, useLocation } from 'react-router-dom';

function formatPrice(p) {
  const n = typeof p === 'number' ? p : parseFloat(String(p).replace(',', '.'));
  if (!Number.isFinite(n)) return String(p);
  return `${n.toFixed(2).replace('.', ',')} €`;
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Récupère les produits depuis Laravel
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products`);
        setProducts(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des produits :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const onAdd = useCallback((product) => {
    if (!isLoggedIn()) {
      navigate('/login', { replace: false, state: { from: location } });
      return;
    }
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
    try { window?.dispatchEvent(new CustomEvent('cart:add', { detail: { id: product.id } })); } catch {}
    alert('Produit ajouté au panier');
  }, [navigate, location]);

  if (loading) return <p>Chargement des produits...</p>;

  return (
    <section className="products">
      <h2>Nos Produits Populaires</h2>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={`${import.meta.env.VITE_BACKEND_URL.replace('/api', '')}/storage/${product.image}`} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="price">{formatPrice(product.price)}</p>
            <button onClick={() => onAdd(product)}>Ajouter au panier</button>
          </div>
        ))}
      </div>
    </section>
  );
}