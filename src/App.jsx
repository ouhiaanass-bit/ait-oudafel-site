import { useState, useEffect, useRef } from "react";

// ══════════════════════════════════════════════
// ⚙️  CONFIGURATION — À MODIFIER
// ══════════════════════════════════════════════
const GOAL = 50000;
const ADMIN_PASSWORD = "aitoudafel2024"; // ← Changez ce mot de passe !
const EMAILJS_SERVICE_ID  = "VOTRE_SERVICE_ID";   // ← Depuis emailjs.com
const EMAILJS_TEMPLATE_ID = "VOTRE_TEMPLATE_ID";  // ← Depuis emailjs.com
const EMAILJS_PUBLIC_KEY  = "VOTRE_PUBLIC_KEY";   // ← Depuis emailjs.com
// ══════════════════════════════════════════════

const testimonials = [
  { name: "Fatima B.", location: "Ait Oudfel", text: "Grâce à votre soutien, ma famille a pu traverser une période très difficile. Merci du fond du cœur.", icon: "🌸" },
  { name: "Mohammed K.", location: "Ait Oudfel", text: "L'association m'a aidé à financer les études de mes enfants. Un acte de générosité qui change des vies.", icon: "📚" },
  { name: "Aicha L.", location: "Ait Oudfel", text: "J'ai reçu une aide alimentaire pendant les mois les plus durs. Je ne saurai jamais assez vous remercier.", icon: "🤲" },
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
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [trigger, target, duration]);
  return count;
}

function ImpactCard({ label, value, icon, trigger }) {
  const count = useCountUp(value, 1800, trigger);
  return (
    <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,210,140,0.2)", borderRadius: 16, padding: "28px 20px", textAlign: "center", backdropFilter: "blur(10px)", transition: "transform 0.3s", cursor: "default" }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-6px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 36, fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#FFD28C", marginBottom: 6 }}>{count.toLocaleString()}+</div>
      <div style={{ color: "#C9B99A", fontSize: 14, letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

function AdminPage({ onLogout }) {
  const [donations, setDonations] = useState([]);
  useEffect(() => { setDonations(JSON.parse(localStorage.getItem("donations") || "[]")); }, []);
  const total = donations.reduce((s, d) => s + d.amount, 0);

  const exportCSV = () => {
    const header = "Date,Nom,Email,Montant,Message\n";
    const rows = donations.map(d => `"${d.date}","${d.name}","${d.email}","${d.amount}DHM","${d.message || ""}"`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "dons-ait-oudafel.csv"; a.click();
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1a0f00 0%, #2d1a05 40%, #1a0f00 100%)", fontFamily: "'Lato', sans-serif", color: "#F5EDE0", padding: "40px 20px" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@300;400;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0;}`}</style>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: "#FFD28C" }}>🔐 Tableau de bord</h1>
            <p style={{ color: "#C9B99A", marginTop: 4 }}>Association Ait Oudafel Youngs</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={exportCSV} style={{ background: "rgba(255,210,140,0.15)", border: "1px solid rgba(255,210,140,0.4)", color: "#FFD28C", padding: "10px 20px", borderRadius: 50, cursor: "pointer", fontSize: 14 }}>📥 Exporter CSV</button>
            <button onClick={onLogout} style={{ background: "transparent", border: "1px solid rgba(255,100,100,0.4)", color: "#ff9999", padding: "10px 20px", borderRadius: 50, cursor: "pointer", fontSize: 14 }}>Déconnexion</button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 40 }}>
          {[{ label: "Total collecté", value: `${total.toLocaleString()}DHM`, icon: "💰" }, { label: "Nombre de dons", value: donations.length, icon: "📋" }, { label: "Don moyen", value: donations.length ? `${Math.round(total / donations.length)}DHM` : "—", icon: "📊" }].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,210,140,0.2)", borderRadius: 16, padding: "24px", textAlign: "center" }}>
              <div style={{ fontSize: 30, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 28, fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#FFD28C" }}>{s.value}</div>
              <div style={{ color: "#C9B99A", fontSize: 13, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,210,140,0.2)", borderRadius: 20, overflow: "hidden" }}>
          <div style={{ padding: "20px 28px", borderBottom: "1px solid rgba(255,210,140,0.15)" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#FFD28C" }}>Liste des donations</h2>
          </div>
          {donations.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center", color: "#C9B99A" }}><div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>Aucune donation enregistrée pour l'instant.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,210,140,0.08)" }}>
                  {["Date", "Nom", "Email", "Montant", "Message"].map(h => <th key={h} style={{ padding: "14px 20px", textAlign: "left", color: "#C9B99A", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, fontWeight: 400 }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {[...donations].reverse().map((d, i) => (
                  <tr key={i} style={{ borderTop: "1px solid rgba(255,210,140,0.08)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,210,140,0.05)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "14px 20px", color: "#C9B99A", fontSize: 13 }}>{d.date}</td>
                    <td style={{ padding: "14px 20px", color: "#F5EDE0", fontWeight: 700 }}>{d.name}</td>
                    <td style={{ padding: "14px 20px", color: "#C9B99A", fontSize: 13 }}>{d.email}</td>
                    <td style={{ padding: "14px 20px" }}><span style={{ background: "rgba(255,210,140,0.15)", color: "#FFD28C", padding: "4px 12px", borderRadius: 50, fontSize: 13, fontWeight: 700 }}>{d.amount}€</span></td>
                    <td style={{ padding: "14px 20px", color: "#C9B99A", fontSize: 13, fontStyle: d.message ? "normal" : "italic" }}>{d.message || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminLogin({ onLogin }) {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (pwd === ADMIN_PASSWORD) onLogin();
    else { setError(true); setTimeout(() => setError(false), 2000); }
  };
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1a0f00 0%, #2d1a05 40%, #1a0f00 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Lato', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@400;700&display=swap'); *{box-sizing:border-box;margin:0;padding:0;}`}</style>
      <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,210,140,0.2)", borderRadius: 24, padding: "48px 40px", width: "100%", maxWidth: 400, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: "#FFD28C", marginBottom: 8 }}>Espace Admin</h1>
        <p style={{ color: "#C9B99A", fontSize: 14, marginBottom: 32 }}>Société Ait Oudafel pour charité</p>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input type="password" placeholder="Mot de passe" value={pwd} onChange={e => setPwd(e.target.value)}
            style={{ background: "rgba(255,255,255,0.07)", border: `1px solid ${error ? "rgba(255,100,100,0.6)" : "rgba(255,210,140,0.25)"}`, borderRadius: 10, color: "#F5EDE0", padding: "13px 16px", fontSize: 15, outline: "none", textAlign: "center", letterSpacing: 4 }} />
          {error && <p style={{ color: "#ff9999", fontSize: 13 }}>Mot de passe incorrect</p>}
          <button type="submit" style={{ background: "linear-gradient(135deg, #D4892A, #FFD28C)", border: "none", color: "#1a0f00", padding: "14px", borderRadius: 50, fontWeight: 700, fontSize: 16, cursor: "pointer" }}>Accéder au tableau de bord</button>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [donated, setDonated] = useState(() => 300 + JSON.parse(localStorage.getItem("donations") || "[]").reduce((s, d) => s + d.amount, 0));
  const [donors, setDonors] = useState(() => 6 + JSON.parse(localStorage.getItem("donations") || "[]").length);
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [emailStatus, setEmailStatus] = useState("");
  const [impactVisible, setImpactVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [floatingDonations, setFloatingDonations] = useState([]);
  const impactRef = useRef(null);

  const presets = [10, 25, 50, 100, 250];
  const progress = Math.min((donated / GOAL) * 100, 100);
  const finalAmount = amount === "custom" ? parseFloat(customAmount) : parseFloat(amount);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setImpactVisible(true); }, { threshold: 0.3 });
    if (impactRef.current) obs.observe(impactRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const sendEmail = async (donation) => {
    if (EMAILJS_SERVICE_ID === "VOTRE_SERVICE_ID") return;
    try {
      setEmailStatus("sending");
      await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        donor_name: donation.name, donor_email: donation.email,
        amount: donation.amount, message: donation.message || "Aucun message", date: donation.date,
      }, EMAILJS_PUBLIC_KEY);
      setEmailStatus("sent");
    } catch { setEmailStatus("error"); }
  };

  const handleDonate = (e) => {
    e.preventDefault();
    if (!finalAmount || finalAmount <= 0 || !name || !email) return;
    const donation = { id: Date.now(), name, email, amount: finalAmount, message, date: new Date().toLocaleString("fr-FR") };
    const existing = JSON.parse(localStorage.getItem("donations") || "[]");
    localStorage.setItem("donations", JSON.stringify([...existing, donation]));
    sendEmail(donation);
    setDonated(p => p + finalAmount);
    setDonors(p => p + 1);
    const id = Date.now();
    setFloatingDonations(prev => [...prev, { id, amount: finalAmount, name }]);
    setTimeout(() => setFloatingDonations(prev => prev.filter(d => d.id !== id)), 3500);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setAmount(""); setCustomAmount(""); setName(""); setEmail(""); setMessage(""); }, 4000);
  };

  if (page === "admin-login") return <AdminLogin onLogin={() => setPage("admin")} />;
  if (page === "admin") return <AdminPage onLogout={() => setPage("home")} />;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1a0f00 0%, #2d1a05 40%, #1a0f00 100%)", fontFamily: "'Lato', sans-serif", color: "#F5EDE0", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::selection{background:rgba(255,210,140,0.3);}
        .preset-btn{background:transparent;border:1px solid rgba(255,210,140,0.4);color:#FFD28C;padding:10px 18px;border-radius:50px;cursor:pointer;font-family:'Lato',sans-serif;font-size:15px;transition:all 0.2s;letter-spacing:0.5px;}
        .preset-btn:hover,.preset-btn.active{background:#FFD28C;color:#1a0f00;border-color:#FFD28C;font-weight:700;}
        input,textarea{background:rgba(255,255,255,0.07);border:1px solid rgba(255,210,140,0.25);border-radius:10px;color:#F5EDE0;padding:13px 16px;font-family:'Lato',sans-serif;font-size:15px;width:100%;outline:none;transition:border-color 0.2s;}
        input:focus,textarea:focus{border-color:#FFD28C;}
        input::placeholder,textarea::placeholder{color:rgba(245,237,224,0.4);}
        .floating-notif{animation:floatUp 3.5s ease-out forwards;}
        @keyframes floatUp{0%{opacity:0;transform:translateY(20px);}15%{opacity:1;transform:translateY(0);}80%{opacity:1;}100%{opacity:0;transform:translateY(-30px);}}
        .hero-pattern{position:absolute;top:0;left:0;right:0;height:100%;background-image:radial-gradient(circle at 20% 50%,rgba(255,210,140,0.06) 0%,transparent 50%),radial-gradient(circle at 80% 20%,rgba(200,130,50,0.08) 0%,transparent 40%);pointer-events:none;}
        .donate-btn{background:linear-gradient(135deg,#D4892A,#FFD28C,#D4892A);background-size:200% 200%;border:none;color:#1a0f00;padding:16px 40px;border-radius:50px;font-family:'Playfair Display',serif;font-size:18px;font-weight:700;cursor:pointer;width:100%;letter-spacing:1px;transition:all 0.3s;animation:shimmer 3s infinite;}
        .donate-btn:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(212,137,42,0.5);}
        @keyframes shimmer{0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}
        .ornament{color:rgba(255,210,140,0.5);font-size:22px;letter-spacing:8px;}
        @media(max-width:600px){.grid-4{grid-template-columns:1fr 1fr !important;}}
      `}</style>

      {/* EmailJS script */}
      {EMAILJS_SERVICE_ID !== "VOTRE_SERVICE_ID" && (
        <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js" onLoad={() => window.emailjs.init(EMAILJS_PUBLIC_KEY)} />
      )}

      <div className="hero-pattern" />

      <div style={{ position: "fixed", bottom: 30, left: 30, zIndex: 1000, display: "flex", flexDirection: "column", gap: 10 }}>
        {floatingDonations.map(d => (
          <div key={d.id} className="floating-notif" style={{ background: "linear-gradient(135deg, #D4892A, #FFD28C)", color: "#1a0f00", padding: "12px 20px", borderRadius: 50, fontWeight: 700, fontSize: 14, boxShadow: "0 8px 30px rgba(212,137,42,0.5)" }}>
            🎉 {d.name} vient de donner {d.amount}€ !
          </div>
        ))}
      </div>

      <header style={{ borderBottom: "1px solid rgba(255,210,140,0.15)", padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", backdropFilter: "blur(5px)", position: "sticky", top: 0, zIndex: 100, background: "rgba(26,15,0,0.85)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, background: "linear-gradient(135deg, #D4892A, #FFD28C)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🤝</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: "#FFD28C", lineHeight: 1.1 }}>Société Ait Oudafel</div>
            <div style={{ fontSize: 11, color: "#C9B99A", letterSpacing: 2, textTransform: "uppercase" }}>pour charité</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={() => setPage("admin-login")} style={{ background: "transparent", border: "1px solid rgba(255,210,140,0.2)", color: "#C9B99A", padding: "8px 16px", borderRadius: 50, cursor: "pointer", fontSize: 12 }}>🔐 Admin</button>
          <a href="#donate" style={{ background: "linear-gradient(135deg, #D4892A, #FFD28C)", color: "#1a0f00", textDecoration: "none", padding: "9px 24px", borderRadius: 50, fontWeight: 700, fontSize: 14 }}>Faire un don</a>
        </div>
      </header>

      <section style={{ padding: "100px 20px 60px", textAlign: "center", maxWidth: 750, margin: "0 auto" }}>
        <div className="ornament">— ✦ —</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(38px, 7vw, 68px)", fontWeight: 700, lineHeight: 1.15, margin: "28px 0 22px", background: "linear-gradient(135deg, #F5EDE0, #FFD28C, #D4892A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Ensemble, <em>changeons</em><br />des vies
        </h1>
        <p style={{ color: "#C9B99A", fontSize: 18, lineHeight: 1.8, maxWidth: 560, margin: "0 auto" }}>
          Association Ait Oudafel œuvre pour soutenir les familles dans le besoin, financer l'éducation et apporter une aide humanitaire Pour la Tribu.
        </p>
        <div style={{ marginTop: 56, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,210,140,0.2)", borderRadius: 20, padding: "32px 36px", backdropFilter: "blur(10px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <div><span style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "#FFD28C" }}>{donated.toLocaleString()}€</span><span style={{ color: "#C9B99A", fontSize: 14, marginLeft: 8 }}>collectés</span></div>
            <div><span style={{ color: "#C9B99A", fontSize: 14 }}>Objectif </span><span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#F5EDE0" }}>{GOAL.toLocaleString()}€</span></div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 50, height: 14, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #D4892A, #FFD28C)", borderRadius: 50, transition: "width 1s ease", boxShadow: "0 0 20px rgba(255,210,140,0.4)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
            <span style={{ color: "#FFD28C", fontWeight: 700, fontSize: 15 }}>{progress.toFixed(1)}% atteint</span>
            <span style={{ color: "#C9B99A", fontSize: 14 }}>👥 {donors.toLocaleString()} donateurs</span>
          </div>
        </div>
      </section>

      <section ref={impactRef} style={{ padding: "60px 20px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="ornament">— ✦ —</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: "#FFD28C", marginTop: 16 }}>Notre Impact</h2>
        </div>
        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {impacts.map((item, i) => <ImpactCard key={i} {...item} trigger={impactVisible} />)}
        </div>
      </section>

      <section style={{ padding: "60px 20px", maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <div className="ornament">— ✦ —</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: "#FFD28C", margin: "16px 0 40px" }}>Ils témoignent</h2>
        <div style={{ position: "relative", minHeight: 220 }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ position: i === activeTestimonial ? "relative" : "absolute", top: 0, left: 0, right: 0, opacity: i === activeTestimonial ? 1 : 0, transform: `translateY(${i === activeTestimonial ? 0 : 20}px)`, transition: "all 0.6s ease", pointerEvents: i === activeTestimonial ? "auto" : "none", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,210,140,0.2)", borderRadius: 20, padding: "36px 40px", backdropFilter: "blur(10px)" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{t.icon}</div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 18, lineHeight: 1.8, color: "#F5EDE0", marginBottom: 20 }}>"{t.text}"</p>
              <div style={{ color: "#FFD28C", fontWeight: 700 }}>{t.name}</div>
              <div style={{ color: "#C9B99A", fontSize: 13 }}>{t.location}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
          {testimonials.map((_, i) => <button key={i} onClick={() => setActiveTestimonial(i)} style={{ width: i === activeTestimonial ? 24 : 8, height: 8, borderRadius: 50, background: i === activeTestimonial ? "#FFD28C" : "rgba(255,210,140,0.3)", border: "none", cursor: "pointer", transition: "all 0.3s" }} />)}
        </div>
      </section>

      <section id="donate" style={{ padding: "60px 20px 100px", maxWidth: 600, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div className="ornament">— ✦ —</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: "#FFD28C", marginTop: 16 }}>Faire un don</h2>
          <p style={{ color: "#C9B99A", marginTop: 10 }}>Chaque Dirham compte. Votre générosité change des destins.</p>
        </div>
        {submitted ? (
          <div style={{ background: "rgba(255,210,140,0.1)", border: "1px solid rgba(255,210,140,0.4)", borderRadius: 20, padding: "60px 40px", textAlign: "center" }}>
            <div style={{ fontSize: 60, marginBottom: 20 }}>✨</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#FFD28C", marginBottom: 12 }}>Merci pour votre don !</h3>
            <p style={{ color: "#C9B99A", fontSize: 16 }}>Votre contribution de <strong style={{ color: "#FFD28C" }}>{finalAmount}€</strong> va aider des familles dans le besoin.<br />Que Allah vous récompense.</p>
            {emailStatus === "sent" && <p style={{ color: "#90EE90", marginTop: 12, fontSize: 13 }}>✅ Email de confirmation envoyé</p>}
          </div>
        ) : (
          <form onSubmit={handleDonate} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,210,140,0.2)", borderRadius: 24, padding: "40px 36px", backdropFilter: "blur(10px)", display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ display: "block", marginBottom: 12, color: "#C9B99A", fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5 }}>Montant du don</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
                {presets.map(p => <button key={p} type="button" className={`preset-btn ${amount == p ? "active" : ""}`} onClick={() => { setAmount(String(p)); setCustomAmount(""); }}>{p}€</button>)}
                <button type="button" className={`preset-btn ${amount === "custom" ? "active" : ""}`} onClick={() => setAmount("custom")}>Autre</button>
              </div>
              {amount === "custom" && <input type="number" placeholder="Montant en euros" value={customAmount} onChange={e => setCustomAmount(e.target.value)} min="1" />}
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 8, color: "#C9B99A", fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5 }}>Votre nom</label>
              <input type="text" placeholder="Prénom et nom" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 8, color: "#C9B99A", fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5 }}>Email</label>
              <input type="email" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: 8, color: "#C9B99A", fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5 }}>Message (optionnel)</label>
              <textarea placeholder="Un mot pour l'association..." value={message} onChange={e => setMessage(e.target.value)} rows={3} style={{ resize: "vertical" }} />
            </div>
            <button type="submit" className="donate-btn">Donner {finalAmount > 0 && !isNaN(finalAmount) ? `${finalAmount}€` : "maintenant"} 🤲</button>
            <p style={{ textAlign: "center", color: "#C9B99A", fontSize: 12 }}>🔒 Paiement sécurisé · Vos données sont protégées</p>
          </form>
        )}
      </section>

      <footer style={{ borderTop: "1px solid rgba(255,210,140,0.15)", padding: "40px 20px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: "#FFD28C", marginBottom: 8 }}>Association Ait Oudafel Youngs</div>
        <p style={{ color: "#C9B99A", fontSize: 13 }}>Ensemble, bâtissons un avenir meilleur · contact@aitoudafel-charite.org</p>
        <div className="ornament" style={{ marginTop: 20 }}>✦</div>
      </footer>
    </div>
  );
}
