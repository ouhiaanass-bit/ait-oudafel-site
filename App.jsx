import { useState, useEffect, useRef } from "react";

const GOAL = 50000;

const testimonials = [
  {
    name: "Fatima B.",
    location: "Agadir",
    text: "Grâce à votre soutien, ma famille a pu traverser une période très difficile. Merci du fond du cœur.",
    icon: "🌸",
  },
  {
    name: "Mohammed K.",
    location: "Casablanca",
    text: "L'association m'a aidé à financer les études de mes enfants. Un acte de générosité qui change des vies.",
    icon: "📚",
  },
  {
    name: "Aicha L.",
    location: "Tiznit",
    text: "J'ai reçu une aide alimentaire pendant les mois les plus durs. Je ne saurai jamais assez vous remercier.",
    icon: "🤲",
  },
];

const impacts = [
  { label: "Familles aidées", value: 412, icon: "🏠" },
  { label: "Repas distribués", value: 8750, icon: "🍽️" },
  { label: "Bourses accordées", value: 93, icon: "🎓" },
  { label: "Villages touchés", value: 17, icon: "🌍" },
];

function useCountUp(target, duration = 1500, trigger = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [trigger, target, duration]);
  return count;
}

function ImpactCard({ label, value, icon, trigger }) {
  const count = useCountUp(value, 1800, trigger);
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,210,140,0.2)",
        borderRadius: 16,
        padding: "28px 20px",
        textAlign: "center",
        backdropFilter: "blur(10px)",
        transition: "transform 0.3s",
        cursor: "default",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-6px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={{ fontSize: 36, marginBottom: 10 }}>{icon}</div>
      <div
        style={{
          fontSize: 36,
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          color: "#FFD28C",
          marginBottom: 6,
        }}
      >
        {count.toLocaleString()}+
      </div>
      <div
        style={{
          color: "#C9B99A",
          fontSize: 14,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
}

export default function App() {
  const [donated, setDonated] = useState(27430);
  const [donors, setDonors] = useState(183);
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [impactVisible, setImpactVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [floatingDonations, setFloatingDonations] = useState([]);
  const impactRef = useRef(null);

  const presets = [10, 25, 50, 100, 250];
  const progress = Math.min((donated / GOAL) * 100, 100);
  const finalAmount =
    amount === "custom" ? parseFloat(customAmount) : parseFloat(amount);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setImpactVisible(true);
      },
      { threshold: 0.3 }
    );
    if (impactRef.current) obs.observe(impactRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((p) => (p + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleDonate = (e) => {
    e.preventDefault();
    if (!finalAmount || finalAmount <= 0 || !name || !email) return;

    // ─────────────────────────────────────────────────
    // TODO: Remplacez ce bloc par votre appel Stripe/PayPal
    // Exemple Stripe :
    //   const stripe = await loadStripe("pk_live_VOTRE_CLE");
    //   await stripe.redirectToCheckout({ lineItems: [...], mode: 'payment', ... });
    // ─────────────────────────────────────────────────

    setDonated((p) => p + finalAmount);
    setDonors((p) => p + 1);
    const id = Date.now();
    setFloatingDonations((prev) => [...prev, { id, amount: finalAmount, name }]);
    setTimeout(
      () => setFloatingDonations((prev) => prev.filter((d) => d.id !== id)),
      3500
    );
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setAmount("");
      setCustomAmount("");
      setName("");
      setEmail("");
      setMessage("");
    }, 4000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #1a0f00 0%, #2d1a05 40%, #1a0f00 100%)",
        fontFamily: "'Lato', sans-serif",
        color: "#F5EDE0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: rgba(255,210,140,0.3); }
        .preset-btn {
          background: transparent;
          border: 1px solid rgba(255,210,140,0.4);
          color: #FFD28C;
          padding: 10px 18px;
          border-radius: 50px;
          cursor: pointer;
          font-family: 'Lato', sans-serif;
          font-size: 15px;
          transition: all 0.2s;
          letter-spacing: 0.5px;
        }
        .preset-btn:hover, .preset-btn.active {
          background: #FFD28C;
          color: #1a0f00;
          border-color: #FFD28C;
          font-weight: 700;
        }
        input, textarea {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,210,140,0.25);
          border-radius: 10px;
          color: #F5EDE0;
          padding: 13px 16px;
          font-family: 'Lato', sans-serif;
          font-size: 15px;
          width: 100%;
          outline: none;
          transition: border-color 0.2s;
        }
        input:focus, textarea:focus { border-color: #FFD28C; }
        input::placeholder, textarea::placeholder { color: rgba(245,237,224,0.4); }
        .floating-notif { animation: floatUp 3.5s ease-out forwards; }
        @keyframes floatUp {
          0% { opacity: 0; transform: translateY(20px); }
          15% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-30px); }
        }
        .hero-pattern {
          position: absolute; top: 0; left: 0; right: 0; height: 100%;
          background-image:
            radial-gradient(circle at 20% 50%, rgba(255,210,140,0.06) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(200,130,50,0.08) 0%, transparent 40%);
          pointer-events: none;
        }
        .donate-btn {
          background: linear-gradient(135deg, #D4892A, #FFD28C, #D4892A);
          background-size: 200% 200%;
          border: none;
          color: #1a0f00;
          padding: 16px 40px;
          border-radius: 50px;
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          width: 100%;
          letter-spacing: 1px;
          transition: all 0.3s;
          animation: shimmer 3s infinite;
        }
        .donate-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(212,137,42,0.5);
        }
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .ornament { color: rgba(255,210,140,0.5); font-size: 22px; letter-spacing: 8px; }
        @media (max-width: 600px) {
          .grid-4 { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div className="hero-pattern" />

      {/* Floating notifications */}
      <div style={{ position: "fixed", bottom: 30, left: 30, zIndex: 1000, display: "flex", flexDirection: "column", gap: 10 }}>
        {floatingDonations.map((d) => (
          <div key={d.id} className="floating-notif" style={{
            background: "linear-gradient(135deg, #D4892A, #FFD28C)",
            color: "#1a0f00", padding: "12px 20px", borderRadius: 50,
            fontWeight: 700, fontSize: 14, boxShadow: "0 8px 30px rgba(212,137,42,0.5)",
          }}>
            🎉 {d.name} vient de donner {d.amount}€ !
          </div>
        ))}
      </div>

      {/* HEADER */}
      <header style={{
        borderBottom: "1px solid rgba(255,210,140,0.15)",
        padding: "20px 40px", display: "flex", alignItems: "center",
        justifyContent: "space-between", backdropFilter: "blur(5px)",
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(26,15,0,0.85)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 44, height: 44,
            background: "linear-gradient(135deg, #D4892A, #FFD28C)",
            borderRadius: "50%", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 20,
          }}>🤝</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: "#FFD28C", lineHeight: 1.1 }}>
              Société Ait Oudafel
            </div>
            <div style={{ fontSize: 11, color: "#C9B99A", letterSpacing: 2, textTransform: "uppercase" }}>pour charité</div>
          </div>
        </div>
        <a href="#donate" style={{
          background: "linear-gradient(135deg, #D4892A, #FFD28C)",
          color: "#1a0f00", textDecoration: "none", padding: "9px 24px",
          borderRadius: 50, fontWeight: 700, fontSize: 14, letterSpacing: 0.5,
        }}>
          Faire un don
        </a>
      </header>

      {/* HERO */}
      <section style={{ padding: "100px 20px 60px", textAlign: "center", maxWidth: 750, margin: "0 auto" }}>
        <div className="ornament">— ✦ —</div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(38px, 7vw, 68px)", fontWeight: 700,
          lineHeight: 1.15, margin: "28px 0 22px",
          background: "linear-gradient(135deg, #F5EDE0, #FFD28C, #D4892A)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Ensemble, <em>changeons</em><br />des vies
        </h1>
        <p style={{ color: "#C9B99A", fontSize: 18, lineHeight: 1.8, maxWidth: 560, margin: "0 auto" }}>
          La Société Ait Oudafel œuvre pour soutenir les familles dans le besoin,
          financer l'éducation et apporter une aide humanitaire dans les régions les plus vulnérables.
        </p>

        {/* Progress card */}
        <div style={{
          marginTop: 56, background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,210,140,0.2)", borderRadius: 20,
          padding: "32px 36px", backdropFilter: "blur(10px)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ textAlign: "left" }}>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "#FFD28C" }}>
                {donated.toLocaleString()}€
              </span>
              <span style={{ color: "#C9B99A", fontSize: 14, marginLeft: 8 }}>collectés</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ color: "#C9B99A", fontSize: 14 }}>Objectif </span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#F5EDE0" }}>
                {GOAL.toLocaleString()}€
              </span>
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 50, height: 14, overflow: "hidden" }}>
            <div style={{
              width: `${progress}%`, height: "100%",
              background: "linear-gradient(90deg, #D4892A, #FFD28C)",
              borderRadius: 50, transition: "width 1s ease",
              boxShadow: "0 0 20px rgba(255,210,140,0.4)",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
            <span style={{ color: "#FFD28C", fontWeight: 700, fontSize: 15 }}>{progress.toFixed(1)}% atteint</span>
            <span style={{ color: "#C9B99A", fontSize: 14 }}>👥 {donors.toLocaleString()} donateurs</span>
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section ref={impactRef} style={{ padding: "60px 20px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="ornament">— ✦ —</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: "#FFD28C", marginTop: 16 }}>
            Notre Impact
          </h2>
        </div>
        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {impacts.map((item, i) => (
            <ImpactCard key={i} {...item} trigger={impactVisible} />
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "60px 20px", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <div className="ornament">— ✦ —</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: "#FFD28C", margin: "16px 0 40px" }}>
          Ils témoignent
        </h2>
        <div style={{ position: "relative", minHeight: 220 }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{
              position: i === activeTestimonial ? "relative" : "absolute",
              top: 0, left: 0, right: 0,
              opacity: i === activeTestimonial ? 1 : 0,
              transform: `translateY(${i === activeTestimonial ? 0 : 20}px)`,
              transition: "all 0.6s ease",
              pointerEvents: i === activeTestimonial ? "auto" : "none",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,210,140,0.2)",
              borderRadius: 20, padding: "36px 40px", backdropFilter: "blur(10px)",
            }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{t.icon}</div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 18, lineHeight: 1.8, color: "#F5EDE0", marginBottom: 20 }}>
                "{t.text}"
              </p>
              <div style={{ color: "#FFD28C", fontWeight: 700 }}>{t.name}</div>
              <div style={{ color: "#C9B99A", fontSize: 13 }}>{t.location}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setActiveTestimonial(i)} style={{
              width: i === activeTestimonial ? 24 : 8, height: 8, borderRadius: 50,
              background: i === activeTestimonial ? "#FFD28C" : "rgba(255,210,140,0.3)",
              border: "none", cursor: "pointer", transition: "all 0.3s",
            }} />
          ))}
        </div>
      </section>

      {/* DONATION FORM */}
      <section id="donate" style={{ padding: "60px 20px 100px", maxWidth: 600, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="ornament">— ✦ —</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: "#FFD28C", marginTop: 16 }}>
            Faire un don
          </h2>
          <p style={{ color: "#C9B99A", marginTop: 10 }}>Chaque euro compte. Votre générosité change des destins.</p>
        </div>

        {submitted ? (
          <div style={{
            background: "rgba(255,210,140,0.1)", border: "1px solid rgba(255,210,140,0.4)",
            borderRadius: 20, padding: "60px 40px", textAlign: "center",
          }}>
            <div style={{ fontSize: 60, marginBottom: 20 }}>✨</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#FFD28C", marginBottom: 12 }}>
              Merci pour votre don !
            </h3>
            <p style={{ color: "#C9B99A", fontSize: 16 }}>
              Votre contribution de <strong style={{ color: "#FFD28C" }}>{finalAmount}€</strong> va aider des familles dans le besoin.<br />
              Que Dieu vous récompense.
            </p>
          </div>
        ) : (
          <form onSubmit={handleDonate} style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,210,140,0.2)",
            borderRadius: 24, padding: "40px 36px", backdropFilter: "blur(10px)",
            display: "flex", flexDirection: "column", gap: 20,
          }}>
            <div>
              <label style={{ display: "block", marginBottom: 12, color: "#C9B99A", fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5 }}>
                Montant du don
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                {presets.map((p) => (
                  <button key={p} type="button"
                    className={`preset-btn ${amount == p ? "active" : ""}`}
                    onClick={() => { setAmount(String(p)); setCustomAmount(""); }}>
                    {p}€
                  </button>
                ))}
                <button type="button"
                  className={`preset-btn ${amount === "custom" ? "active" : ""}`}
                  onClick={() => setAmount("custom")}>
                  Autre
                </button>
              </div>
              {amount === "custom" && (
                <input type="number" placeholder="Montant en euros"
                  value={customAmount} onChange={(e) => setCustomAmount(e.target.value)} min="1" />
              )}
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, color: "#C9B99A", fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5 }}>
                Votre nom
              </label>
              <input type="text" placeholder="Prénom et nom" value={name}
                onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, color: "#C9B99A", fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5 }}>
                Email
              </label>
              <input type="email" placeholder="votre@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, color: "#C9B99A", fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5 }}>
                Message (optionnel)
              </label>
              <textarea placeholder="Un mot pour l'association..." value={message}
                onChange={(e) => setMessage(e.target.value)} rows={3}
                style={{ resize: "vertical" }} />
            </div>

            <button type="submit" className="donate-btn">
              Donner {finalAmount > 0 && !isNaN(finalAmount) ? `${finalAmount}€` : "maintenant"} 🤲
            </button>

            <p style={{ textAlign: "center", color: "#C9B99A", fontSize: 12 }}>
              🔒 Paiement sécurisé · Vos données sont protégées
            </p>
          </form>
        )}
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,210,140,0.15)", padding: "40px 20px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#FFD28C", marginBottom: 8 }}>
          Société Ait Oudafel pour charité
        </div>
        <p style={{ color: "#C9B99A", fontSize: 13 }}>
          Ensemble, bâtissons un avenir meilleur · contact@aitoudafel-charite.org
        </p>
        <div className="ornament" style={{ marginTop: 20 }}>✦</div>
      </footer>
    </div>
  );
}
