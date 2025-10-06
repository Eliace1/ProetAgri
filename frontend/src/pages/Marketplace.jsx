import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import FiltersSidebar from "../components/FiltersSidebar.jsx";
import ProductsGrid from "../components/ProductsGrid.jsx";
import Footer from "../components/Footer";
import { getUser } from "../lib/auth";
import { getCart } from "../lib/cart";
import { FaShoppingCart } from "react-icons/fa";

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get("q") || "");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Récupérer l'utilisateur courant
  useEffect(() => {
    setUser(getUser());
  }, []);

  // Gestion du panier
  useEffect(() => {
    const computeCount = () => {
      const items = getCart();
      const count = Array.isArray(items) ? items.reduce((s, it) => s + (it.qty || 1), 0) : 0;
      setCartCount(count);
    };
    computeCount();
    const onAdd = () => computeCount();
    const onStorage = (e) => {
      if (e.key === "farmlink_cart") computeCount();
    };
    window.addEventListener("cart:add", onAdd);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("cart:add", onAdd);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Fonction pour récupérer tous les produits depuis le localStorage
  const getAllProducts = () => {
    return Object.keys(localStorage)
      .filter((key) => key.startsWith("products_"))
      .flatMap((key) => {
        try {
          return JSON.parse(localStorage.getItem(key)) || [];
        } catch {
          return [];
        }
      });
  };

  // Initialisation des produits
  useEffect(() => {
    setProducts(getAllProducts());
  }, []);

  // Écoute les changements produits (ajout depuis le profil)
  useEffect(() => {
    const updateProducts = () => setProducts(getAllProducts());
    window.addEventListener("products:changed", updateProducts);
    return () => window.removeEventListener("products:changed", updateProducts);
  }, []);

  // Prix max dynamique
  const maxPrice = useMemo(() => {
    const max = Math.max(...products.map((p) => p.price));
    return Number.isFinite(max) ? Math.ceil(max) : 100;
  }, [products]);

  useEffect(() => {
    setPriceRange((r) => ({ min: 0, max: Math.max(r.max, maxPrice) }));
  }, [maxPrice]);

  // Filtrage texte depuis l'URL
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearchText(q);
  }, [searchParams]);

  // Filtrage combiné
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
          onClick={() => navigate("/commandes")}
          style={{
            position: "fixed",
            right: 20,
            bottom: 24,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            borderRadius: "9999px",
            background: "#2563eb",
            color: "#fff",
            border: 0,
            boxShadow: "0 6px 20px rgba(37,99,235,.35)",
            cursor: "pointer",
            zIndex: 50,
          }}
        >
          <FaShoppingCart size={22} />
          {cartCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -6,
                right: -6,
                minWidth: 20,
                height: 20,
                borderRadius: 10,
                background: "#ef4444",
                color: "#fff",
                fontSize: 12,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 6px",
                boxShadow: "0 2px 6px rgba(0,0,0,.25)",
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
