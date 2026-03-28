import { useState, useRef, useEffect } from "react";

const inputStyle = {
  width: "100%",
  background: "#ffffff0a",
  border: "1px solid #ffffff18",
  borderRadius: 12,
  padding: "12px 14px",
  color: "#fff",
  fontSize: 14,
  marginBottom: 12,
  boxSizing: "border-box",
  outline: "none",
};

// ─── CLAUDE API ───────────────────────────────────────────────────────────────
async function askClaude(prompt) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await response.json();
  return data.content?.[0]?.text || "Bir hata oluştu.";
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ ad: "", email: "", sifre: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = () => {
    if (!form.email || !form.sifre) { setError("Lütfen tüm alanları doldurun."); return; }
    if (mode === "register" && !form.ad) { setError("İsim gerekli."); return; }
    setLoading(true); setError("");
    setTimeout(() => { setLoading(false); onLogin(form.ad || form.email.split("@")[0]); }, 1200);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontSize: 52 }}>🚗</div>
        <div style={{ fontSize: 30, fontWeight: 900, color: "#fff", marginTop: 8 }}>VitesApp</div>
        <div style={{ fontSize: 12, color: "#ff6b35", fontWeight: 700, letterSpacing: 2, marginTop: 4 }}>ARAÇ TAKİP SİSTEMİ</div>
      </div>
      <div style={{ width: "100%", maxWidth: 360, background: "#ffffff08", border: "1px solid #ffffff15", borderRadius: 20, padding: 28 }}>
        <div style={{ display: "flex", background: "#ffffff08", borderRadius: 12, padding: 4, marginBottom: 24 }}>
          {["login", "register"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }} style={{ flex: 1, background: mode === m ? "#ff6b35" : "transparent", border: "none", borderRadius: 9, padding: "9px 0", color: mode === m ? "#fff" : "#888", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
              {m === "login" ? "Giriş Yap" : "Kayıt Ol"}
            </button>
          ))}
        </div>
        {mode === "register" && <input placeholder="Adınız" value={form.ad} onChange={e => setForm({ ...form, ad: e.target.value })} style={inputStyle} />}
        <input placeholder="E-posta" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
        <input placeholder="Şifre" type="password" value={form.sifre} onChange={e => setForm({ ...form, sifre: e.target.value })} style={inputStyle} />
        {error && <div style={{ color: "#ff6b35", fontSize: 12, marginBottom: 12, textAlign: "center" }}>{error}</div>}
        <button onClick={handle} disabled={loading} style={{ width: "100%", background: loading ? "#ff6b3560" : "#ff6b35", border: "none", borderRadius: 12, padding: "14px 0", color: "#fff", fontWeight: 800, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", marginTop: 4 }}>
          {loading ? "⏳ Yükleniyor..." : mode === "login" ? "Giriş Yap →" : "Hesap Oluştur →"}
        </button>
      </div>
    </div>
  );
}

// ─── PRICING ──────────────────────────────────────────────────────────────────
const PLANS = [
  { id: "free", name: "Ücretsiz", price: "0₺", period: "sonsuza kadar", color: "#888", icon: "🆓", features: ["1 araç", "Bakım hatırlatıcı", "Yakıt takibi"], locked: ["AI Arıza Tahmini", "Tamirciye Sor", "Belge saklama"] },
  { id: "standart", name: "Standart", price: "49₺", period: "/ ay", color: "#6c63ff", icon: "🥈", popular: true, features: ["3 araç", "Bakım & yakıt takibi", "Belge saklama", "🤖 AI Arıza Tahmini", "🔧 Tamirciye Sor"], locked: ["Aile paylaşımı"] },
  { id: "premium", name: "Premium", price: "150₺", period: "/ ay", color: "#ffd700", icon: "🥇", features: ["Sınırsız araç", "Tüm özellikler", "🤖 AI Arıza Tahmini", "🔧 Tamirciye Sor", "👨‍👩‍👧 Aile paylaşımı", "Öncelikli destek"], locked: [] },
];

function PricingScreen({ kullanici, onSelect }) {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const choose = (plan) => {
    setSelected(plan.id);
    setLoading(true);
    setTimeout(() => { setLoading(false); onSelect(plan); }, plan.id === "free" ? 900 : 1400);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e8e8f0", fontFamily: "'DM Sans','Segoe UI',sans-serif", padding: "28px 16px 40px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 13, color: "#ff6b35", fontWeight: 700, letterSpacing: 2 }}>VİTES APP</div>
        <div style={{ fontSize: 22, fontWeight: 900, marginTop: 6 }}>Planını Seç</div>
        <div style={{ fontSize: 13, color: "#888", marginTop: 6 }}>Merhaba {kullanici} 👋</div>
      </div>
      {PLANS.map(plan => (
        <div key={plan.id} style={{ background: selected === plan.id ? `${plan.color}12` : "#ffffff07", border: `2px solid ${selected === plan.id ? plan.color : plan.popular ? `${plan.color}40` : "#ffffff12"}`, borderRadius: 20, padding: 20, marginBottom: 16, position: "relative" }}>
          {plan.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#6c63ff", borderRadius: 20, padding: "4px 14px", fontSize: 11, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>⭐ EN POPÜLER</div>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 13, color: plan.color, fontWeight: 700 }}>{plan.icon} {plan.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{plan.price}</span>
                <span style={{ fontSize: 13, color: "#888" }}>{plan.period}</span>
              </div>
            </div>
            <button onClick={() => choose(plan)} disabled={loading && selected === plan.id} style={{ background: plan.id === "free" ? "#ffffff12" : plan.color, border: "none", borderRadius: 12, padding: "10px 18px", color: plan.id === "free" ? "#ccc" : "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer", minWidth: 90 }}>
              {loading && selected === plan.id ? "⏳..." : plan.id === "free" ? "Başla" : "Satın Al"}
            </button>
          </div>
          {plan.features.map(f => <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 13 }}><span style={{ color: plan.color }}>✓</span>{f}</div>)}
          {plan.locked.map(f => <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 13, opacity: 0.3 }}><span>✗</span><span style={{ textDecoration: "line-through" }}>{f}</span></div>)}
        </div>
      ))}
    </div>
  );
}

// ─── PAYMENT ──────────────────────────────────────────────────────────────────
function PaymentScreen({ plan, kullanici, onSuccess, onBack }) {
  const [form, setForm] = useState({ kart: "", isim: "", tarih: "", cvv: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const formatKart = v => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatTarih = v => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d; };

  const pay = () => {
    if (!form.kart || !form.isim || !form.tarih || !form.cvv) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); setTimeout(onSuccess, 1800); }, 2000);
  };

  if (success) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <div style={{ fontSize: 64 }}>🎉</div>
      <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginTop: 16 }}>Ödeme Başarılı!</div>
      <div style={{ fontSize: 14, color: "#888", marginTop: 8 }}>{plan.name} planı aktif edildi</div>
      <div style={{ fontSize: 13, color: "#00d4aa", marginTop: 12, fontWeight: 700 }}>VitesApp'e hoş geldin! 🚗</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e8e8f0", fontFamily: "'DM Sans','Segoe UI',sans-serif", padding: "28px 16px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#888", fontSize: 14, cursor: "pointer", marginBottom: 20 }}>← Geri dön</button>
      <div style={{ background: `${plan.color}12`, border: `1px solid ${plan.color}30`, borderRadius: 16, padding: 16, marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><div style={{ fontSize: 12, color: "#888" }}>Seçilen plan</div><div style={{ fontSize: 18, fontWeight: 800 }}>{plan.icon} {plan.name}</div></div>
        <div style={{ textAlign: "right" }}><div style={{ fontSize: 24, fontWeight: 900, color: plan.color }}>{plan.price}</div><div style={{ fontSize: 11, color: "#888" }}>/ ay</div></div>
      </div>
      <div style={{ background: `linear-gradient(135deg, ${plan.color}40, #1a1a2e)`, borderRadius: 16, padding: "20px 20px 16px", marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: "#ffffff60", marginBottom: 12 }}>KREDİ / BANKA KARTI</div>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 3, marginBottom: 16, color: "#fff" }}>{form.kart || "•••• •••• •••• ••••"}</div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div><div style={{ fontSize: 10, color: "#ffffff50" }}>KART SAHİBİ</div><div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{form.isim || "AD SOYAD"}</div></div>
          <div><div style={{ fontSize: 10, color: "#ffffff50" }}>SON KULLANIM</div><div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{form.tarih || "AA/YY"}</div></div>
        </div>
      </div>
      <input placeholder="Kart numarası" value={form.kart} onChange={e => setForm({ ...form, kart: formatKart(e.target.value) })} style={inputStyle} maxLength={19} />
      <input placeholder="Kart üzerindeki isim" value={form.isim} onChange={e => setForm({ ...form, isim: e.target.value.toUpperCase() })} style={inputStyle} />
      <div style={{ display: "flex", gap: 12 }}>
        <input placeholder="AA/YY" value={form.tarih} onChange={e => setForm({ ...form, tarih: formatTarih(e.target.value) })} style={{ ...inputStyle, flex: 1 }} maxLength={5} />
        <input placeholder="CVV" value={form.cvv} onChange={e => setForm({ ...form, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })} style={{ ...inputStyle, flex: 1 }} maxLength={3} />
      </div>
      <button onClick={pay} disabled={loading} style={{ width: "100%", background: loading ? "#ff6b3560" : plan.color, border: "none", borderRadius: 14, padding: "16px 0", color: "#fff", fontWeight: 800, fontSize: 16, cursor: loading ? "not-allowed" : "pointer" }}>
        {loading ? "⏳ İşleniyor..." : `${plan.price}/ay Öde →`}
      </button>
    </div>
  );
}

// ─── AI ARIZA TAHMİNİ ─────────────────────────────────────────────────────────
function AIRiskPanel({ carData }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    const prompt = `Sen bir uzman araba tamircisisin. Aşağıdaki araç verilerine göre Türkçe olarak kısa ve net bir risk analizi yap. Hangi parçalar yakında sorun çıkarabilir, nelere dikkat etmeli? Maksimum 4 madde, emoji kullan, samimi ve anlaşılır yaz.

Araç: ${carData.model}
Güncel KM: ${carData.km}
Son yağ değişimi: ${carData.sonYag} km önce
Son lastik rotasyonu: ${carData.sonLastik} km önce
Bekleyen bakımlar: ${carData.bekleyenBakim}
Toplam masraf bu yıl: ₺${carData.masraf}`;

    const cevap = await askClaude(prompt);
    setResult(cevap);
    setLoading(false);
  };

  return (
    <div style={{ background: "#6c63ff12", border: "1px solid #6c63ff40", borderRadius: 16, padding: 18, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800 }}>🤖 AI Arıza Tahmini</div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Aracın risklerini analiz et</div>
        </div>
        <button onClick={analyze} disabled={loading} style={{ background: "#6c63ff", border: "none", borderRadius: 10, padding: "9px 16px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
          {loading ? "⏳ Analiz..." : "Analiz Et"}
        </button>
      </div>
      {loading && (
        <div style={{ textAlign: "center", padding: "20px 0", color: "#6c63ff" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
          <div style={{ fontSize: 13 }}>AI aracını inceliyor...</div>
        </div>
      )}
      {result && !loading && (
        <div style={{ background: "#ffffff08", borderRadius: 12, padding: 14, fontSize: 14, lineHeight: 1.7, color: "#e0e0f0", whiteSpace: "pre-wrap" }}>
          {result}
        </div>
      )}
    </div>
  );
}

// ─── TAMİRCİYE SOR ────────────────────────────────────────────────────────────
function MechanicChat({ carData }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: `Merhaba! Ben VitesApp AI Tamircisi 🔧\n${carData.model} araçların için buradayım. Ne soracaksın?` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    const prompt = `Sen VitesApp'in AI araba tamircisisin. Türkçe konuş, samimi ve anlaşılır ol. Teknik terimleri basitçe açıkla.

Kullanıcının aracı: ${carData.model}, ${carData.km} km
Kullanıcının sorusu: ${userMsg}

Kısa ve pratik cevap ver. Gerekirse tamirciye gitmesini söyle ama panikletme.`;

    const cevap = await askClaude(prompt);
    setMessages(prev => [...prev, { role: "ai", text: cevap }]);
    setLoading(false);
  };

  return (
    <div style={{ background: "#ff6b3510", border: "1px solid #ff6b3540", borderRadius: 16, padding: 16, marginBottom: 16 }}>
      <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>🔧 Tamirciye Sor</div>
      <div style={{ maxHeight: 280, overflowY: "auto", marginBottom: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "82%", background: m.role === "user" ? "#ff6b35" : "#ffffff12", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", padding: "10px 13px", fontSize: 13, lineHeight: 1.6, color: "#fff", whiteSpace: "pre-wrap" }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ background: "#ffffff12", borderRadius: "14px 14px 14px 4px", padding: "10px 14px", fontSize: 13, color: "#888" }}>⏳ Düşünüyor...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          placeholder="Aracınla ilgili bir şey sor..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
        />
        <button onClick={send} disabled={loading} style={{ background: "#ff6b35", border: "none", borderRadius: 12, padding: "0 16px", color: "#fff", fontWeight: 700, fontSize: 16, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
          →
        </button>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

const YILLAR = Array.from({length: 30}, (_, i) => new Date().getFullYear() - i);

function PlakaSetup({ plaka, onSave, onClose }) {
  const [model, setModel] = useState("Toyota Corolla");
  const [yil, setYil] = useState("2020");
  const [km, setKm] = useState("");
  const [renk, setRenk] = useState("");
  const RENKLER = ["Beyaz", "Siyah", "Gri", "Kırmızı", "Mavi", "Gümüş", "Lacivert", "Diğer"];

  const save = () => {
    if (!km) return;
    onSave({ model, yil, km: parseInt(km), renk });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000cc", zIndex: 100, display: "flex", alignItems: "flex-end", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <div style={{ width: "100%", background: "#13131f", borderRadius: "20px 20px 0 0", padding: 24, border: "1px solid #ffffff15" }}>
        {/* Plaka görseli */}
        <div style={{ background: "#fff", borderRadius: 8, padding: "10px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, maxWidth: 200, margin: "0 auto 20px" }}>
          <div style={{ background: "#003DA5", borderRadius: 4, padding: "2px 6px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 7, color: "#FFD700", fontWeight: 900 }}>TR</div>
            <div style={{ fontSize: 8, color: "#fff" }}>⭐</div>
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 3, color: "#111", flex: 1, textAlign: "center" }}>{plaka}</div>
        </div>

        <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 4, textAlign: "center" }}>Araç Bilgilerini Tamamla</div>
        <div style={{ fontSize: 12, color: "#888", marginBottom: 20, textAlign: "center" }}>Bir kere gir, uygulama hatırlar</div>

        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <select value={model} onChange={e => setModel(e.target.value)} style={{ flex: 2, background: "#ffffff0a", border: "1px solid #ffffff18", borderRadius: 12, padding: "11px 12px", color: "#fff", fontSize: 13 }}>
            {Object.entries(CARS_BY_BRAND).map(([brand, models]) => (
              <optgroup key={brand} label={brand} style={{ background: "#1a1a2e", color: "#ff6b35" }}>
                {models.map(m => <option key={brand+m} value={brand+" "+m} style={{ background: "#1a1a2e", color: "#fff" }}>{m}</option>)}
              </optgroup>
            ))}
          </select>
          <select value={yil} onChange={e => setYil(e.target.value)} style={{ flex: 1, background: "#ffffff0a", border: "1px solid #ffffff18", borderRadius: 12, padding: "11px 12px", color: "#fff", fontSize: 13 }}>
            {YILLAR.map(y => <option key={y} value={y} style={{ background: "#1a1a2e" }}>{y}</option>)}
          </select>
        </div>

        <input placeholder="Güncel kilometre (örn: 85000)" type="number" value={km} onChange={e => setKm(e.target.value)} style={{ ...inputStyle, marginBottom: 12 }} />

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {RENKLER.map(r => (
            <div key={r} onClick={() => setRenk(r)} style={{ background: renk === r ? "#ff6b3530" : "#ffffff08", border: `1px solid ${renk === r ? "#ff6b35" : "#ffffff15"}`, borderRadius: 20, padding: "5px 12px", fontSize: 12, color: renk === r ? "#ff6b35" : "#888", cursor: "pointer", fontWeight: renk === r ? 700 : 400 }}>
              {r}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, background: "#ffffff10", border: "none", borderRadius: 12, padding: 14, color: "#888", fontWeight: 700, cursor: "pointer" }}>İptal</button>
          <button onClick={save} disabled={!km} style={{ flex: 2, background: km ? "#ff6b35" : "#ff6b3540", border: "none", borderRadius: 12, padding: 14, color: "#fff", fontWeight: 800, fontSize: 15, cursor: km ? "pointer" : "not-allowed" }}>Kaydet ✓</button>
        </div>
      </div>
    </div>
  );
}

const CARS_BY_BRAND = {
  "Toyota": ["Corolla", "Yaris", "Camry", "RAV4", "C-HR", "Hilux", "Land Cruiser", "Prius", "Auris", "Verso"],
  "Volkswagen": ["Passat", "Golf", "Polo", "Tiguan", "T-Roc", "Touareg", "Caddy", "Transporter", "Jetta", "Arteon"],
  "Renault": ["Megane", "Clio", "Symbol", "Kadjar", "Captur", "Duster", "Talisman", "Zoe", "Fluence", "Kangoo"],
  "Ford": ["Focus", "Fiesta", "Kuga", "Puma", "Mustang", "Ranger", "Transit", "EcoSport", "Mondeo", "Edge"],
  "Fiat": ["Egea", "500", "Doblo", "Tipo", "Panda", "Punto", "Bravo", "Ducato", "Fiorino", "Linea"],
  "Hyundai": ["i20", "i30", "Tucson", "Elantra", "Santa Fe", "Kona", "i10", "Accent", "Sonata", "ix35"],
  "Honda": ["Civic", "CR-V", "HR-V", "Jazz", "Accord", "City", "FR-V"],
  "BMW": ["3 Serisi", "5 Serisi", "1 Serisi", "X3", "X5", "X1", "7 Serisi", "2 Serisi", "4 Serisi", "X6"],
  "Mercedes": ["C Serisi", "E Serisi", "A Serisi", "GLC", "GLE", "S Serisi", "B Serisi", "CLA", "GLA", "Vito"],
  "Audi": ["A3", "A4", "A6", "Q3", "Q5", "Q7", "A1", "A5", "TT", "Q2"],
  "Opel": ["Astra", "Corsa", "Insignia", "Crossland", "Grandland", "Mokka", "Zafira", "Combo", "Vivaro"],
  "Peugeot": ["301", "308", "508", "2008", "3008", "5008", "208", "Partner", "Rifter", "Traveller"],
  "Citroen": ["C3", "C4", "C5 Aircross", "Berlingo", "Jumpy", "SpaceTourer", "C3 Aircross"],
  "Skoda": ["Octavia", "Fabia", "Superb", "Kodiaq", "Karoq", "Rapid", "Kamiq", "Scala"],
  "Dacia": ["Duster", "Sandero", "Logan", "Spring", "Jogger", "Lodgy"],
  "Nissan": ["Qashqai", "Juke", "X-Trail", "Micra", "Navara", "Leaf", "Note", "Pulsar"],
  "Seat": ["Leon", "Ibiza", "Ateca", "Arona", "Tarraco", "Toledo"],
  "Kia": ["Sportage", "Ceed", "Picanto", "Stonic", "Sorento", "Niro", "Rio", "XCeed"],
  "Mazda": ["CX-5", "Mazda3", "CX-3", "CX-30", "Mazda6", "MX-5"],
  "Mitsubishi": ["Outlander", "ASX", "Eclipse Cross", "L200", "Colt"],
  "Suzuki": ["Swift", "Vitara", "S-Cross", "Jimny", "Baleno", "Ignis"],
  "Volvo": ["XC60", "XC40", "V40", "S60", "XC90", "V60", "S90"],
  "Land Rover": ["Discovery", "Defender", "Range Rover", "Freelander", "Discovery Sport"],
  "Jeep": ["Renegade", "Compass", "Cherokee", "Wrangler", "Grand Cherokee"],
  "Alfa Romeo": ["Giulietta", "Giulia", "Stelvio", "MiTo", "Tonale"],
  "Subaru": ["Forester", "Outback", "XV", "Impreza", "Legacy"],
  "Porsche": ["Cayenne", "Macan", "Panamera", "911", "Taycan"],
  "TOGG": ["T10X", "T10F"],
};
const CARS = Object.entries(CARS_BY_BRAND).flatMap(([brand, models]) => models.map(m => brand + " " + m));
const initialReminders = [
  { id: 1, type: "Yağ Değişimi", date: "2025-04-15", km: 15000, done: false, icon: "🛢️" },
  { id: 2, type: "Lastik Rotasyonu", date: "2025-05-01", km: 20000, done: false, icon: "🔄" },
  { id: 3, type: "Fren Kontrolü", date: "2025-06-10", km: 25000, done: true, icon: "🛑" },
];
const initialFuel = [
  { id: 1, date: "2025-03-01", litre: 40, fiyat: 1200, km: 12400 },
  { id: 2, date: "2025-03-10", litre: 35, fiyat: 1050, km: 12900 },
  { id: 3, date: "2025-03-20", litre: 42, fiyat: 1260, km: 13450 },
];
const initialExpenses = [
  { id: 1, tarih: "2025-02-15", tur: "Tamirci", aciklama: "Ön amortisör değişimi", tutar: 3500 },
  { id: 2, tarih: "2025-01-10", tur: "Sigorta", aciklama: "Kasko yenileme", tutar: 12000 },
  { id: 3, tarih: "2025-03-05", tur: "Muayene", aciklama: "Araç muayenesi", tutar: 650 },
];
const initialDocs = [
  { id: 1, ad: "Ruhsat", tarih: "2027-08-15", tur: "📋" },
  { id: 2, ad: "Kasko", tarih: "2026-01-10", tur: "🛡️" },
  { id: 3, ad: "Trafik Sigortası", tarih: "2025-12-31", tur: "📄" },
];

function MainApp({ kullanici, plan, onLogout }) {
  const [tab, setTab] = useState("panel");
  const [car, setCar] = useState("Toyota Corolla");
  const [plaka, setPlaka] = useState("");
  const [plakaEdit, setPlakaEdit] = useState(false);
  const [plakaSetup, setPlakaSetup] = useState(false);
  const [tempPlaka, setTempPlaka] = useState("");
  const [tracking, setTracking] = useState(false);
  const [trackingKm, setTrackingKm] = useState(0);
  const lastPos = useRef(null);
  const watchId = useRef(null);
  const [km, setKm] = useState(13450);
  const [reminders, setReminders] = useState(initialReminders);
  const [fuel, setFuel] = useState(initialFuel);
  const [expenses] = useState(initialExpenses);
  const [docs] = useState(initialDocs);
  const [showAddFuel, setShowAddFuel] = useState(false);
  const [newFuel, setNewFuel] = useState({ litre: "", fiyat: "", km: "" });

  const totalFuelCost = fuel.reduce((s, f) => s + f.fiyat, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.tutar, 0);
  const kmPerLitre = fuel.length > 1 ? ((fuel[fuel.length - 1].km - fuel[0].km) / fuel.reduce((s, f) => s + f.litre, 0)).toFixed(1) : "—";
  const upcoming = reminders.filter(r => !r.done);
  const daysUntil = d => Math.ceil((new Date(d) - new Date()) / (1000 * 60 * 60 * 24));

  const hasAI = plan.id === "standart" || plan.id === "premium";

  const carData = {
    model: car,
    plaka,
    km,
    sonYag: km - 12000,
    sonLastik: km - 8000,
    bekleyenBakim: upcoming.map(r => r.type).join(", ") || "Yok",
    masraf: totalExpense,
  };

  const addFuel = () => {
    if (!newFuel.litre || !newFuel.fiyat || !newFuel.km) return;
    setFuel([...fuel, { id: Date.now(), date: new Date().toISOString().split("T")[0], litre: parseFloat(newFuel.litre), fiyat: parseFloat(newFuel.fiyat), km: parseFloat(newFuel.km) }]);
    setKm(parseFloat(newFuel.km));
    setNewFuel({ litre: "", fiyat: "", km: "" });
    setShowAddFuel(false);
  };

  const startTracking = () => {
    if (!navigator.geolocation) { alert("Cihazınız konum desteklemiyor."); return; }
    setTracking(true);
    lastPos.current = null;
    setTrackingKm(0);
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (lastPos.current) {
          const R = 6371;
          const dLat = (latitude - lastPos.current.lat) * Math.PI / 180;
          const dLon = (longitude - lastPos.current.lon) * Math.PI / 180;
          const a = Math.sin(dLat/2)**2 + Math.cos(lastPos.current.lat * Math.PI/180) * Math.cos(latitude * Math.PI/180) * Math.sin(dLon/2)**2;
          const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          if (dist > 0.05) {
            setKm(prev => Math.round(prev + dist));
            setTrackingKm(prev => Math.round((prev + dist) * 10) / 10);
          }
        }
        lastPos.current = { lat: latitude, lon: longitude };
      },
      (err) => { console.log(err); setTracking(false); },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
  };

  const stopTracking = () => {
    if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    setTracking(false);
    lastPos.current = null;
  };

  const tabs = [
    { id: "panel", label: "Panel", icon: "🏠" },
    { id: "bakim", label: "Bakım", icon: "🔧" },
    { id: "yakit", label: "Yakıt", icon: "⛽" },
    { id: "harcama", label: "Masraf", icon: "💸" },
    { id: "ai", label: "AI", icon: "🤖" },
    { id: "servis", label: "Servis", icon: "📍" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e8e8f0", fontFamily: "'DM Sans','Segoe UI',sans-serif", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)", padding: "20px 24px 16px", borderBottom: "1px solid #ffffff15" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: "#ff6b35", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>VİTES APP</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>VitesApp 🚗</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#aaa" }}>Merhaba, {kullanici} 👋</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#ff6b35" }}>{km.toLocaleString()} km</div>
              <button onClick={tracking ? stopTracking : startTracking} style={{ background: tracking ? "#00d4aa20" : "#ffffff10", border: `1px solid ${tracking ? "#00d4aa50" : "#ffffff20"}`, borderRadius: 8, padding: "3px 8px", fontSize: 10, fontWeight: 700, color: tracking ? "#00d4aa" : "#888", cursor: "pointer" }}>
                {tracking ? "🟢 Takip" : "⚫ Takip"}
              </button>
            </div>
            {tracking && trackingKm > 0 && (
              <div style={{ fontSize: 11, color: "#00d4aa", marginTop: 2 }}>+{trackingKm} km eklendi 📍</div>
            )}
            <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", marginTop: 2, alignItems: "center" }}>
              <span style={{ fontSize: 10, background: `${plan.color}20`, border: `1px solid ${plan.color}40`, color: plan.color, borderRadius: 6, padding: "2px 6px", fontWeight: 700 }}>{plan.icon} {plan.name}</span>
              <span onClick={onLogout} style={{ fontSize: 10, color: "#555", cursor: "pointer" }}>Çıkış</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={car} onChange={e => setCar(e.target.value)} style={{ flex: 1, background: "#ffffff10", border: "1px solid #ffffff20", borderRadius: 10, padding: "8px 12px", color: "#fff", fontSize: 14, fontWeight: 600 }}>
            {Object.entries(CARS_BY_BRAND).map(([brand, models]) => (
              <optgroup key={brand} label={brand} style={{ background: "#1a1a2e", color: "#ff6b35" }}>
                {models.map(m => <option key={brand+m} value={brand+" "+m} style={{ background: "#1a1a2e", color: "#fff" }}>{m}</option>)}
              </optgroup>
            ))}
          </select>
          {plakaEdit ? (
            <input
              autoFocus
              placeholder="34 ABC 12"
              value={tempPlaka}
              onChange={e => setTempPlaka(e.target.value.toUpperCase().slice(0, 10))}
              onBlur={() => { if(tempPlaka.length >= 5) { setPlaka(tempPlaka); setPlakaSetup(true); } setPlakaEdit(false); }}
              onKeyDown={e => { if(e.key === "Enter" && tempPlaka.length >= 5) { setPlaka(tempPlaka); setPlakaEdit(false); setPlakaSetup(true); } }}
              style={{ width: 100, background: "#ffffff10", border: "1px solid #ff6b3560", borderRadius: 10, padding: "8px 10px", color: "#fff", fontSize: 13, fontWeight: 700, outline: "none", textAlign: "center", letterSpacing: 1 }}
            />
          ) : (
            <div onClick={() => { setTempPlaka(plaka); setPlakaEdit(true); }} style={{ width: 100, background: plaka ? "#ff6b3520" : "#ffffff08", border: `1px solid ${plaka ? "#ff6b3560" : "#ffffff20"}`, borderRadius: 10, padding: "8px 10px", color: plaka ? "#ff6b35" : "#666", fontSize: 12, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 1, textAlign: "center" }}>
              {plaka || "🚗 Plaka"}
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1, padding: "20px 16px", overflowY: "auto" }}>

        {tab === "panel" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[
                { label: "Toplam Masraf", value: `₺${(totalFuelCost + totalExpense).toLocaleString()}`, color: "#ff6b35", icon: "💰" },
                { label: "Km/Litre", value: `${kmPerLitre} km/lt`, color: "#00d4aa", icon: "⚡" },
                { label: "Yakıt Harcaması", value: `₺${totalFuelCost.toLocaleString()}`, color: "#6c63ff", icon: "⛽" },
                { label: "Bekleyen Bakım", value: `${upcoming.length} adet`, color: "#ffd700", icon: "🔧" },
              ].map(s => (
                <div key={s.label} style={{ background: "#ffffff08", border: "1px solid #ffffff12", borderRadius: 14, padding: "14px 16px" }}>
                  <div style={{ fontSize: 20 }}>{s.icon}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: s.color, marginTop: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#888", marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" }}>Yaklaşan Bakımlar</div>
            {upcoming.map(r => {
              const days = daysUntil(r.date); const urgent = days < 14;
              return (
                <div key={r.id} style={{ background: urgent ? "#ff6b3510" : "#ffffff08", border: `1px solid ${urgent ? "#ff6b3540" : "#ffffff12"}`, borderRadius: 12, padding: "12px 14px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ fontSize: 22 }}>{r.icon}</div>
                    <div><div style={{ fontWeight: 700, fontSize: 14 }}>{r.type}</div><div style={{ fontSize: 12, color: "#888" }}>{r.km.toLocaleString()} km'de</div></div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: urgent ? "#ff6b35" : "#00d4aa" }}>{days} gün</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{r.date}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "bakim" && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#888", marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>Bakım Takviminiz</div>
            {reminders.map(r => (
              <div key={r.id} style={{ background: r.done ? "#ffffff05" : "#ffffff08", border: `1px solid ${r.done ? "#ffffff08" : "#ffffff15"}`, borderRadius: 14, padding: "14px 16px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: r.done ? 0.5 : 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 24 }}>{r.icon}</div>
                  <div><div style={{ fontWeight: 700 }}>{r.type}</div><div style={{ fontSize: 12, color: "#888" }}>{r.date} • {r.km.toLocaleString()} km</div></div>
                </div>
                <button onClick={() => setReminders(reminders.map(x => x.id === r.id ? { ...x, done: !x.done } : x))} style={{ background: r.done ? "#ffffff10" : "#00d4aa20", border: `1px solid ${r.done ? "#ffffff20" : "#00d4aa50"}`, color: r.done ? "#888" : "#00d4aa", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  {r.done ? "Geri al" : "✓ Yapıldı"}
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === "yakit" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#888", letterSpacing: 1, textTransform: "uppercase" }}>Yakıt Geçmişi</div>
              <button onClick={() => setShowAddFuel(!showAddFuel)} style={{ background: "#ff6b35", border: "none", borderRadius: 10, padding: "8px 14px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>+ Ekle</button>
            </div>
            {showAddFuel && (
              <div style={{ background: "#ffffff08", border: "1px solid #ffffff15", borderRadius: 14, padding: 16, marginBottom: 16 }}>
                {[{ key: "litre", placeholder: "Litre" }, { key: "fiyat", placeholder: "Tutar ₺" }, { key: "km", placeholder: "Güncel KM" }].map(f => (
                  <input key={f.key} type="number" placeholder={f.placeholder} value={newFuel[f.key]} onChange={e => setNewFuel({ ...newFuel, [f.key]: e.target.value })} style={inputStyle} />
                ))}
                <button onClick={addFuel} style={{ width: "100%", background: "#ff6b35", border: "none", borderRadius: 10, padding: 12, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Kaydet</button>
              </div>
            )}
            <div style={{ background: "#00d4aa15", border: "1px solid #00d4aa30", borderRadius: 14, padding: 14, marginBottom: 16, display: "flex", justifyContent: "space-around" }}>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 800, color: "#00d4aa" }}>{kmPerLitre}</div><div style={{ fontSize: 11, color: "#888" }}>km/litre</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 800, color: "#6c63ff" }}>₺{totalFuelCost.toLocaleString()}</div><div style={{ fontSize: 11, color: "#888" }}>toplam</div></div>
              <div style={{ textAlign: "center" }}><div style={{ fontSize: 18, fontWeight: 800, color: "#ff6b35" }}>{fuel.length}</div><div style={{ fontSize: 11, color: "#888" }}>kayıt</div></div>
            </div>
            {[...fuel].reverse().map(f => (
              <div key={f.id} style={{ background: "#ffffff08", border: "1px solid #ffffff12", borderRadius: 12, padding: "12px 14px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><div style={{ fontWeight: 700 }}>⛽ {f.litre} litre</div><div style={{ fontSize: 12, color: "#888" }}>{f.date} • {f.km.toLocaleString()} km</div></div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#ff6b35" }}>₺{f.fiyat.toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "harcama" && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#888", marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>Harcama Geçmişi</div>
            <div style={{ background: "#ff6b3515", border: "1px solid #ff6b3530", borderRadius: 14, padding: 14, marginBottom: 16, textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#888" }}>Toplam Araç Masrafı</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#ff6b35" }}>₺{(totalFuelCost + totalExpense).toLocaleString()}</div>
            </div>
            {expenses.map(e => {
              const colors = { Tamirci: "#ff6b35", Sigorta: "#6c63ff", Muayene: "#00d4aa" };
              return (
                <div key={e.id} style={{ background: "#ffffff08", border: "1px solid #ffffff12", borderRadius: 12, padding: "12px 14px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ background: `${colors[e.tur]}20`, border: `1px solid ${colors[e.tur]}40`, borderRadius: 8, padding: "4px 8px", fontSize: 11, fontWeight: 700, color: colors[e.tur] }}>{e.tur}</div>
                    <div><div style={{ fontWeight: 600, fontSize: 13 }}>{e.aciklama}</div><div style={{ fontSize: 11, color: "#888" }}>{e.tarih}</div></div>
                  </div>
                  <div style={{ fontWeight: 800, color: "#ff6b35" }}>₺{e.tutar.toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "servis" && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#888", marginBottom: 16, letterSpacing: 1, textTransform: "uppercase" }}>En Yakın Yetkili Servis</div>

            {/* Araç & konum bilgisi */}
            <div style={{ background: "#ffffff08", border: "1px solid #ffffff12", borderRadius: 16, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>Seçili araç</div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>🚗 {car}</div>
            </div>

            {/* Servis butonları */}
            {[
              { label: "Yetkili Servis Bul", icon: "🔧", query: `${car.split(" ")[0]} yetkili servisi`, color: "#ff6b35", desc: "En yakın yetkili tamirci" },
              { label: "Lastikçi Bul", icon: "🔄", query: "lastikçi yakınımda", color: "#6c63ff", desc: "En yakın lastik servisi" },
              { label: "Oto Yıkama Bul", icon: "🚿", query: "oto yıkama yakınımda", color: "#00d4aa", desc: "En yakın oto yıkama" },
              { label: "Akaryakıt İstasyonu", icon: "⛽", query: "benzin istasyonu yakınımda", color: "#ffd700", desc: "En yakın benzin istasyonu" },
            ].map(s => (
              <a
                key={s.label}
                href={`https://www.google.com/maps/search/${encodeURIComponent(s.query)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <div style={{ background: `${s.color}10`, border: `1px solid ${s.color}30`, borderRadius: 14, padding: "14px 16px", marginBottom: 12, display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
                  <div style={{ fontSize: 28 }}>{s.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{s.desc}</div>
                  </div>
                  <div style={{ fontSize: 18, color: s.color }}>→</div>
                </div>
              </a>
            ))}

            <div style={{ background: "#ffffff05", border: "1px dashed #ffffff15", borderRadius: 14, padding: 14, marginTop: 8, textAlign: "center" }}>
              <div style={{ fontSize: 20 }}>📍</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 6, lineHeight: 1.6 }}>
                Google Maps'te konumuna en yakın servisleri gösterir.<br/>Konum iznini açık tutmayı unutma!
              </div>
            </div>
          </div>
        )}

        {tab === "ai" && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#888", marginBottom: 16, letterSpacing: 1, textTransform: "uppercase" }}>🤖 AI Asistan</div>
            {hasAI ? (
              <>
                <AIRiskPanel carData={carData} />
                <MechanicChat carData={carData} />
              </>
            ) : (
              <div style={{ background: "#ffffff08", border: "2px dashed #ffffff20", borderRadius: 16, padding: 28, textAlign: "center" }}>
                <div style={{ fontSize: 40 }}>🔒</div>
                <div style={{ fontSize: 16, fontWeight: 800, marginTop: 12 }}>AI Özellikler Kilitli</div>
                <div style={{ fontSize: 13, color: "#888", marginTop: 8, lineHeight: 1.6 }}>AI Arıza Tahmini ve Tamirciye Sor özellikleri Standart ve Premium planlarda mevcut.</div>
                <div style={{ marginTop: 16, fontSize: 20, fontWeight: 900, color: "#6c63ff" }}>49₺/ay</div>
                <div style={{ fontSize: 12, color: "#888" }}>ile başla</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ background: "#12121f", borderTop: "1px solid #ffffff15", display: "flex", padding: "8px 0 16px" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, background: "none", border: "none", color: tab === t.id ? "#ff6b35" : "#666", fontSize: 10, fontWeight: tab === t.id ? 700 : 400, cursor: "pointer", padding: "6px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 20 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* PLAKA SETUP MODAL */}
      {plakaSetup && <PlakaSetup plaka={plaka} onSave={(data) => { setCar(data.model); setKm(data.km); setPlakaSetup(false); }} onClose={() => setPlakaSetup(false)} />}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("auth");
  const [kullanici, setKullanici] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleLogin = ad => { setKullanici(ad); setScreen("pricing"); };
  const handlePlanSelect = plan => { setSelectedPlan(plan); setScreen(plan.id === "free" ? "app" : "payment"); };
  const handlePaySuccess = () => setScreen("app");
  const handleLogout = () => { setKullanici(null); setSelectedPlan(null); setScreen("auth"); };

  if (screen === "auth") return <AuthScreen onLogin={handleLogin} />;
  if (screen === "pricing") return <PricingScreen kullanici={kullanici} onSelect={handlePlanSelect} />;
  if (screen === "payment") return <PaymentScreen plan={selectedPlan} kullanici={kullanici} onSuccess={handlePaySuccess} onBack={() => setScreen("pricing")} />;
  return <MainApp kullanici={kullanici} plan={selectedPlan} onLogout={handleLogout} />;
}
