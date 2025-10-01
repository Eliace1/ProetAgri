import { useEffect, useState } from 'react';
import axios from 'axios';

export default function FiltersSidebar({
  searchText,
  setSearchText,
  selectedCategories,
  setSelectedCategories,
  selectedAvailability,
  setSelectedAvailability,
  priceRange,
  setPriceRange,
  maxPrice = 100,
}) {
  const [allCategories, setAllCategories] = useState([]);
  const [allStocks, setAllStocks] = useState([]);

  // 🔄 Récupère les produits pour extraire les filtres dynamiques
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products`);
        const products = response.data;

        const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
        const stocks = [...new Set(products.map(p => p.stock).filter(Boolean))];

        setAllCategories(categories);
        setAllStocks(stocks);
      } catch (error) {
        console.error("Erreur lors du chargement des filtres :", error);
      }
    };

    fetchFilters();
  }, []);

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleStockChange = (stock) => {
    if (selectedAvailability.includes(stock)) {
      setSelectedAvailability(selectedAvailability.filter((s) => s !== stock));
    } else {
      setSelectedAvailability([...selectedAvailability, stock]);
    }
  };

  return (
    <aside className="filters-sidebar">
      <style>{`
        .dual-range { position: relative; height: 36px; }
        .dual-range .track { position: absolute; top: 50%; left: 0; right: 0; transform: translateY(-50%); height: 6px; border-radius: 9999px; background: #e5e7eb; }
        .dual-range input[type="range"] { position: absolute; left: 0; right: 0; top: 0; bottom: 0; width: 100%; height: 36px; margin: 0; background: transparent; pointer-events: none; -webkit-appearance: none; appearance: none; }
        .dual-range input[type="range"]::-webkit-slider-runnable-track { background: transparent; height: 6px; }
        .dual-range input[type="range"]::-moz-range-track { background: transparent; height: 6px; }
        .dual-range input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; height: 16px; width: 16px; border-radius: 9999px; background: #2563eb; border: 0; cursor: pointer; pointer-events: all; position: relative; }
        .dual-range input[type="range"]::-moz-range-thumb { height: 16px; width: 16px; border-radius: 9999px; background: #2563eb; border: 0; cursor: pointer; pointer-events: all; position: relative; }
      `}</style>

      {/* Prix */}
      <div className="filter-block filter-price">
        <h4>Prix</h4>
        {(() => {
          const min = Math.max(0, Math.min(priceRange.min, maxPrice));
          const max = Math.max(0, Math.min(priceRange.max, maxPrice));
          const minPercent = (min / maxPrice) * 100;
          const maxPercent = (max / maxPrice) * 100;
          return (
            <div className="dual-range" aria-label="Plage de prix">
              <div
                className="track"
                style={{
                  background: `linear-gradient(to right, #e5e7eb ${minPercent}%, #2563eb ${minPercent}%, #2563eb ${maxPercent}%, #e5e7eb ${maxPercent}%)`,
                }}
              />
              <input
                type="range"
                min={0}
                max={maxPrice}
                step={1}
                value={min}
                aria-label="Prix minimum"
                onChange={(e) => {
                  const v = Number(e.target.value);
                  const clamped = Math.max(0, Math.min(v, maxPrice));
                  setPriceRange({ ...priceRange, min: Math.min(clamped, priceRange.max) });
                }}
                style={{ zIndex: min < max ? 3 : 4 }}
              />
              <input
                type="range"
                min={0}
                max={maxPrice}
                step={1}
                value={max}
                aria-label="Prix maximum"
                onChange={(e) => {
                  const v = Number(e.target.value);
                  const clamped = Math.max(0, Math.min(v, maxPrice));
                  setPriceRange({ ...priceRange, max: Math.max(clamped, priceRange.min) });
                }}
                style={{ zIndex: 4 }}
              />
            </div>
          );
        })()}
        <div className="price-values">
          <span>{priceRange.min}€</span>
          <span>{priceRange.max}€</span>
        </div>
      </div>

      {/* Catégories dynamiques */}
      <div className="filter-block filter-categories">
        <h4>Catégorie</h4>
        <ul>
          {allCategories.map((cat) => (
            <li key={cat}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                />{" "}
                {cat}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Disponibilité dynamique */}
      <div className="filter-block filter-stock">
        <h4>Disponibilité</h4>
        {allStocks.map((stock) => (
          <label key={stock}>
            <input
              type="checkbox"
              checked={selectedAvailability.includes(stock)}
              onChange={() => handleStockChange(stock)}
            />{" "}
            {stock}
          </label>
        ))}
      </div>
    </aside>
  );
}