export default function About() {
  return (
    <div className="about-page" style={{ padding: "2rem 1rem", maxWidth: 960, margin: "0 auto" }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 32, margin: 0 }}>À propos de FarmLink</h1>
        <p style={{ color: "#6b7280", marginTop: 8 }}>
          Mettre en relation les agriculteurs et les acheteurs pour des circuits courts, transparents et durables.
        </p>
      </header>

      <section style={{ display: "grid", gap: 24 }}>
        <article className="about-section" style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
          <h2 style={{ marginTop: 0 }}>Notre mission</h2>
          <p>
            Chez FarmLink, nous facilitons l'accès à des produits agricoles frais et locaux tout en soutenant l'économie des
            producteurs. Notre plateforme numérique simplifie l'achat, la vente et la logistique pour rapprocher consommateurs et fermes.
          </p>
        </article>

        <article className="about-section" style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
          <h2 style={{ marginTop: 0 }}>Nos valeurs</h2>
          <ul style={{ paddingLeft: 18, margin: 0, lineHeight: 1.8 }}>
            <li>Transparence des prix et de l'origine des produits</li>
            <li>Qualité et fraîcheur garanties</li>
            <li>Soutien aux producteurs locaux</li>
            <li>Durabilité et réduction du gaspillage</li>
          </ul>
        </article>

        <article className="about-section" style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
          <h2 style={{ marginTop: 0 }}>Comment ça marche ?</h2>
          <ol style={{ paddingLeft: 18, margin: 0, lineHeight: 1.8 }}>
            <li>Les agriculteurs publient leurs produits avec informations et stock.</li>
            <li>Les acheteurs découvrent, filtrent et commandent en quelques clics.</li>
            <li>La livraison ou le retrait est organisé selon les préférences locales.</li>
          </ol>
        </article>

        <article className="about-section" style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
          <h2 style={{ marginTop: 0 }}>Nous contacter</h2>
          <p>
            Une question, une suggestion, ou envie de rejoindre la plateforme ? Rendez-vous sur la page Contact
            ou écrivez-nous à <a href="mailto:contact@farmlink.local">contact@farmlink.local</a>.
          </p>
        </article>
      </section>
    </div>
  );
}
