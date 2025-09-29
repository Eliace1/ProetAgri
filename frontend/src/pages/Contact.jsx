import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setFeedback("");
    setSending(true);
    try {
      // Placeholder: envoi local pour le moment
      await new Promise((r) => setTimeout(r, 800));
      setFeedback("Message envoyé ! Nous vous répondrons rapidement.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setFeedback("Impossible d'envoyer le message. Réessayez.");
      setSending(false);
    }
  };

  return (
    <div
      className="contact-bg"
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/images/bg-contact.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      {/* Overlay sombre pour lisibilité */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
        }}
      />

      {/* Contenu */}
      <div className="contact-page" style={{ position: "relative", zIndex: 1, padding: "3rem 1rem", maxWidth: 960, margin: "0 auto" }}>
        <header style={{ marginBottom: 24, color: "#fff" }}>
          <h1 style={{ fontSize: 32, margin: 0 }}>Contact</h1>
          <p style={{ color: "#e5e7eb", marginTop: 8 }}>
            Une question ou un projet ? Écrivez-nous, nous sommes à votre écoute.
          </p>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
          <section style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,.12)" }}>
            <h2 style={{ marginTop: 0 }}>Formulaire de contact</h2>
            <form onSubmit={onSubmit} className="contact-form" style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "grid", gap: 8 }}>
                <label>Nom</label>
                <input name="name" value={form.name} onChange={onChange} placeholder="Votre nom" required />
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={onChange} placeholder="vous@example.com" required />
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                <label>Objet</label>
                <input name="subject" value={form.subject} onChange={onChange} placeholder="Sujet du message" />
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                <label>Message</label>
                <textarea name="message" value={form.message} onChange={onChange} placeholder="Votre message" rows={5} required />
              </div>

              {feedback && (
                <div role="status" style={{ color: feedback.includes("Impossible") ? "#dc2626" : "#16a34a" }}>{feedback}</div>
              )}

              <button type="submit" className="btn-submit" disabled={sending}>
                {sending ? "Envoi..." : "Envoyer"}
              </button>
            </form>
          </section>

          <section style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,.12)" }}>
            <h2 style={{ marginTop: 0 }}>Coordonnées</h2>
            <p>Email: <a href="mailto:contact@farmlink.local">contact@farmlink.local</a></p>
            <p>Téléphone: <a href="tel:+33123456789">+33 1 23 45 67 89</a></p>
            <p>Adresse: 10 rue des Fermes, 75000 Paris</p>
          </section>
        </div>
      </div>
    </div>
  );
}
