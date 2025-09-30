export default function Products() {
  return (
    <section className="products">
      <h2>Nos Produits Populaires</h2>
      <div className="product-list">

        {/* Tomates */}
        <div className="product-card">
          <img src="/images/tomates.jpg" alt="Tomates fraîches" />
          <h3>Tomates Fraîches (5 Kg)</h3>
          <p className="price">12,50€</p>
          <button>Ajouter au panier</button>
        </div>

        {/* Œufs */}
        <div className="product-card">
          <img src="/images/oeufs.jpg" alt="Œufs biologiques" />
          <h3>Œufs Biologiques (Douzaine)</h3>
          <p className="price">4,99€</p>
          <button>Ajouter au panier</button>
        </div>

        {/* Lait */}
        <div className="product-card">
          <img src="/images/lait.jpg" alt="Lait frais de ferme" />
          <h3>Lait Frais De Ferme (1L)</h3>
          <p className="price">2,80€</p>
          <button>Ajouter au panier</button>
        </div>

        {/* Pain */}
        <div className="product-card">
          <img src="/images/pain.jpg" alt="Pain artisanal" />
          <h3>Pain Artisanal (Une Miche)</h3>
          <p className="price">3,50€</p>
          <button>Ajouter au panier</button>
        </div>

      </div>
    </section>
  );
}
