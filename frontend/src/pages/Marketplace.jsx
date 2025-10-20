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
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get("q") || "");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const navigate = useNavigate();

  // Récupère les produits et les catégories depuis Laravel
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Erreur lors du chargement des produits :", error);
      }
    };

    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setAvailableCategories(data.map((cat) => cat.name));
      } catch (error) {
        console.error("Erreur lors du chargement des catégories :", error);
      }
    };

    loadProducts();
    loadCategories();
  }, []);

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

  // Fonction de normalisation pour éviter les erreurs de casse ou d'accent
  const normalize = (str) => str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  /*___________A RETENIR__________
    / Fonction de normalisation pour comparer des chaînes de texte sans être gêné par les accents ou les majuscules
const normalize = (str) => 
  str // prend une chaîne de caractères en entrée
    ?.normalize("NFD") // transforme les caractères accentués en leur forme décomposée (ex: "é" devient "e" + accent)
    .replace(/[\u0300-\u036f]/g, "") // supprime tous les caractères d'accent (diacritiques) grâce à une expression régulière
    .toLowerCase(); // convertit la chaîne en minuscules pour éviter les erreurs de casse
  
  */

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchText && !p.name.toLowerCase().includes(searchText.toLowerCase())) return false;

      if (
        selectedCategories.length &&
        (!p.category || !selectedCategories.some((cat) => normalize(cat) === normalize(p.category)))
      ) return false;

      if (
        selectedAvailability.length &&
        (!p.stock || !selectedAvailability.includes(p.stock))
      ) return false;

      if (p.price < priceRange.min || p.price > priceRange.max) return false;

      return true;
    });
  }, [searchText, selectedCategories, selectedAvailability, priceRange, products]);

  return (
    <>
      <div className="marketplace">
        <div className="marketplace-layout">
          <FiltersSidebar
            searchText={searchText}
            setSearchText={setSearchText}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedAvailability={selectedAvailability}
            setSelectedAvailability={setSelectedAvailability}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            maxPrice={maxPrice}
            availableCategories={availableCategories}
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