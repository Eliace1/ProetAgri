import { FaAppleAlt, FaCarrot, FaSeedling } from "react-icons/fa";

export default function Categories() {
  return (
    <section className="categories">
      <h2>Découvrez Nos Catégories de Produits</h2>
      <div className="category-list">

        <div className="category-card">
          <div className="icon">
            <FaAppleAlt size={50} color="#16a34a" />
          </div>
          <h3>Fruits</h3>
          <p>Découvrez une variété de fruits frais de saison.</p>
        </div>

        <div className="category-card">
          <div className="icon">
            <FaCarrot size={50} color="#16a34a" />
          </div>
          <h3>Légumes</h3>
          <p>Trouvez des légumes biologiques et locaux pour vos repas.</p>
        </div>

        <div className="category-card">
          <div className="icon">
            <FaSeedling size={50} color="#16a34a" />
          </div>
          <h3>Céréales</h3>
          <p>Sélection de céréales et de grains entiers de qualité supérieure.</p>
        </div>

      </div>
    </section>
  );
}
