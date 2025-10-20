import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import FiltersSidebar from "../components/FiltersSidebar.jsx";
import ProductsGrid from "../components/ProductsGrid.jsx";
import Footer from "../components/Footer";
import { getUser } from "../lib/auth";
import { getCart } from "../lib/cart";
import { FaShoppingCart } from "react-icons/fa";

export default function Marketplace() {
  // === états filtres ===
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get("q") || "");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getUser());
  }, []);

  // initialise et synchronise le compteur du panier
  useEffect(() => {
    const computeCount = () => {
      const items = getCart();
      const count = Array.isArray(items) ? items.reduce((s, it) => s + (it.qty || 1), 0) : 0;
      setCartCount(count);
    };
    computeCount();
    const onAdd = () => computeCount();
    const onStorage = (e) => {
      if (e.key === 'farmlink_cart') computeCount();
    };
    window.addEventListener('cart:add', onAdd);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('cart:add', onAdd);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // === Tes vrais produits ===
  const products = [
    { id: 1, name: "Tomates Bio", price: 3.5, stock: "En stock", category: "Légumes", image: "/images/tomates.jpg", farmName: "Ferme des Collines" },
    { id: 2, name: "Pommes de terre nouvelles", price: 2.75, stock: "Faible stock", category: "Légumes", image: "/images/pommes-de-terre.jpg", farmName: "Ferme du Val" },
    { id: 3, name: "Blé Tendre", price: 1.2, stock: "En stock", category: "Céréales", image: "/images/ble.jpg", farmName: "Domaine des Champs" },
    { id: 4, name: "Fromage de chèvre artisanal", price: 8.99, stock: "En stock", category: "Produits laitiers", image: "/images/fromage.jpg", farmName: "La Chèvrerie du Bois" },
    { id: 5, name: "Œufs Fermiers (12)", price: 4.99, stock: "Faible stock", category: "Produits laitiers", image: "/images/oeufs.jpg", farmName: "Ferme des Amandiers" },
    { id: 6, name: "Bœuf Limousin (500g)", price: 12.5, stock: "En stock", category: "Viande", image: "/images/boeuf.jpg", farmName: "Ferme Limougeaude" },
    { id: 7, name: "Carottes Bio", price: 2.1, stock: "En stock", category: "Légumes", image: "/images/carottes.jpg", farmName: "Jardin de Louise" },
    { id: 8, name: "Asperges Vertes", price: 5.75, stock: "Rupture de stock", category: "Légumes", image: "/images/asperges.jpg", farmName: "Les Aspergeraies" },
    { id: 9, name: "Mélange de Baies Fraîches", price: 6.8, stock: "En stock", category: "Fruits", image: "/images/baies.jpg", farmName: "Verger du Lac" },
  ];

  // bornes dynamiques du prix selon les produits
  const maxPrice = useMemo(() => {
    const max = Math.max(...products.map((p) => p.price));
    return Number.isFinite(max) ? Math.ceil(max) : 100;
  }, [products]);

  useEffect(() => {
    // initialise la plage avec borne sup dynamique
    setPriceRange((r) => ({ min: 0, max: Math.max(r.max, maxPrice) }));
  }, [maxPrice]);

  // écoute l'URL ?q= (saisie depuis la navbar)
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearchText(q);
  }, [searchParams]);

  // === filtrage combiné ===
  const filteredProducts = useMemo(() => {
    const knownCategories = ["Fruits", "Légumes", "Céréales", "Produits laitiers", "Viande"];
    const wantsAutres = selectedCategories.includes("Autres");
    return products.filter((p) => {
      if (searchText && !p.name.toLowerCase().includes(searchText.toLowerCase())) return false;
      if (selectedCategories.length) {
        const isKnown = knownCategories.includes(p.category);
        const matchKnown = selectedCategories.includes(p.category);
        const matchAutres = wantsAutres && !isKnown;
        if (!(matchKnown || matchAutres)) return false;
      }
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
            maxPrice={maxPrice}
          />
          <ProductsGrid products={filteredProducts} />
        </div>
        {/* Bouton panier flottant */}
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
