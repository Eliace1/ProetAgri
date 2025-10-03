import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isLoggedIn } from '../lib/auth';
import { addToCart } from '../lib/cart';

const fallbackProducts = [
  { id: 1, name: "Tomates Bio", price: 3.5, stock: "En stock", image: "/images/tomates.jpg" },
  { id: 2, name: "Pommes de terre nouvelles", price: 2.75, stock: "Faible stock", image: "/images/pommes-de-terre.jpg" },
  { id: 3, name: "Blé Tendre", price: 1.2, stock: "En stock", image: "/images/ble.jpg" },
  { id: 4, name: "Fromage de chèvre artisanal", price: 8.99, stock: "En stock", image: "/images/fromage.jpg" },
  { id: 5, name: "Œufs Fermiers (12)", price: 4.99, stock: "Faible stock", image: "/images/oeufs.jpg" },
  { id: 6, name: "Bœuf Limousin (500g)", price: 12.5, stock: "En stock", image: "/images/boeuf.jpg" },
  { id: 7, name: "Carottes Bio", price: 2.1, stock: "En stock", image: "/images/carottes.jpg" },
  { id: 8, name: "Asperges Vertes", price: 5.75, stock: "Rupture de stock", image: "/images/asperges.jpg" },
  { id: 9, name: "Mélange de Baies Fraîches", price: 6.8, stock: "En stock", image: "/images/baies.jpg" },
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
    // feedback non bloquant via event (utilisé par le compteur panier)
    try { window?.dispatchEvent(new CustomEvent('cart:add', { detail: { id: product.id } })); } catch {}
  }, [navigate, location]);

  return (
    <section className="products-grid">
      {items.map((product) => (
        <div key={product.id} className="product-card">
          <img src={product.image} alt={product.name} />
          <h4>{product.name}</h4>
          <p className="price">{formatPrice(product.price)}</p>
          <p className="farm">Ferme: <strong>{product.farmName || "Ferme locale"}</strong></p>
          {isLoggedIn() && (product.farmAddress || product.farm_address) && (
            <p className="farm-address">Adresse: {product.farmAddress || product.farm_address}</p>
          )}
          <button onClick={() => onAdd(product)}>Ajouter au panier</button>
        </div>
      ))}
    </section>
  );
}
