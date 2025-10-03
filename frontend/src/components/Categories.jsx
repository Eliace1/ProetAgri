import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaAppleAlt,
  FaCarrot,
  FaSeedling,
  FaFish,
  FaDrumstickBite,
  FaBoxOpen,
} from "react-icons/fa";

const iconMap = {
  Fruits: <FaAppleAlt size={50} color="#16a34a" />,
  Légumes: <FaCarrot size={50} color="#16a34a" />,
  Céréales: <FaSeedling size={50} color="#16a34a" />,
  Poisson: <FaFish size={50} color="#16a34a" />,
  Viande: <FaDrumstickBite size={50} color="#16a34a" />,
  Autres: <FaBoxOpen size={50} color="#16a34a" />,
};

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Erreur chargement des catégories :", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement des catégories...</p>;

  return (
    <section className="categories">
      <h2>Découvrez Nos Catégories de Produits</h2>
      <div className="category-list">
        {categories.map((cat) => (
          <div key={cat.id} className="category-card">
            <div className="icon">
              {iconMap[cat.name] || <FaBoxOpen size={50} color="#16a34a" />}
            </div>
            <h3>{cat.name}</h3>
            <p>{cat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}