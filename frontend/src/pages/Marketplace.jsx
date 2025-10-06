import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import FiltersSidebar from "../components/FiltersSidebar.jsx";
import ProductsGrid from "../components/ProductsGrid.jsx";
import Footer from "../components/Footer";
import { getUser } from "../lib/auth";
import { getCart } from "../lib/cart";
import { FaShoppingCart } from "react-icons/fa";
import { fetchProducts, fetchCategories } from "../lib/api";

export default function Marketplace() {
  const [searchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get("q") || "");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [products, setProducts] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [prod, cats] = await Promise.all([fetchProducts(), fetchCategories()]);
        setProducts(prod);
        setAvailableCategories(cats.map(c => c.name));
      } catch (err) {
        console.error("Erreur chargement marketplace :", err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const items = getCart();
    const count = Array.isArray(items) ? items.reduce((s, it) => s + (it.qty || 1), 0) : 0;
    setCartCount(count);
  }, []);

  const normalize = (str) =>
    str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchText && !normalize(p.name).includes(normalize(searchText))) return false;
      if (selectedCategories.length && !selectedCategories.includes(p.category)) return false;
      if (p.price < priceRange.min || p.price > priceRange.max) return false;
      return true;
    });
  }, [searchText, selectedCategories, priceRange, products]);

  return (
    <>
      <div className="marketplace">
        <div className="marketplace-layout">
          <FiltersSidebar
            searchText={searchText}
            setSearchText={setSearchText}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            maxPrice={Math.max(...products.map(p => p.price))}
            availableCategories={availableCategories}
          />
          <ProductsGrid products={filteredProducts} />
        </div>
     
        <button
          aria-label="Voir le panier / commandes"
          onClick={() => navigate('/commandes')}
          style={{
            position: 'fixed',
            right: 20,
            bottom: 24,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            borderRadius: '9999px',
            background: '#2563eb',
            color: '#fff',
            border: 0,
            boxShadow: '0 6px 20px rgba(37,99,235,.35)',
            cursor: 'pointer',
            zIndex: 50,
          }}
        >
          <FaShoppingCart size={22} />
          {cartCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -6,
                right: -6,
                minWidth: 20,
                height: 20,
                borderRadius: 10,
                background: '#ef4444',
                color: '#fff',
                fontSize: 12,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 6px',
                boxShadow: '0 2px 6px rgba(0,0,0,.25)'
              }}
            >
              {cartCount}
            </span>
          )}
        </button>

      </div>
      <Footer />
    </>
  );
}