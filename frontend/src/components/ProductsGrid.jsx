import { useCallback } from 'react';
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

export default function ProductsGrid({ products = fallbackProducts }) {
  const navigate = useNavigate();
  const location = useLocation();
  const items = Array.isArray(products) && products.length ? products : fallbackProducts;

  const onAdd = useCallback((product) => {
    if (!isLoggedIn()) {
      // redirige vers login et mémorise la page d'origine
      navigate('/login', { replace: false, state: { from: location } });
      return;
    }
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
    // feedback simple
    try { window?.dispatchEvent(new CustomEvent('cart:add', { detail: { id: product.id } })); } catch {}
    alert('Produit ajouté au panier');
  }, [navigate, location]);

  return (
    <section className="products-grid">
      {items.map((product) => (
        <div key={product.id} className="product-card">
          <img src={product.image} alt={product.name} />
          <h4>{product.name}</h4>
          <p className="price">{formatPrice(product.price)}</p>
          <span className={`stock ${String(product.stock).replace(/\s+/g, "-").toLowerCase()}`}>
          
            {product.stock}
          </span>
          <button onClick={() => onAdd(product)}>Ajouter au panier</button>
        </div>
      ))}
    </section>
  );
}
