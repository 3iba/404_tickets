import { Instagram, Send, Youtube, Mail } from "lucide-react";

export function Footer() {
    const links = [
    { label: "МЕРОПРИЯТИЯ", href: "#events" },
    { label: "О НАС", href: "#about" },
    { label: "ГАЛЕРЕЯ", href: "#gallery" },
    { label: "КОНТАКТЫ", href: "#contacts" },
  ];
  return (
    <footer id="contacts" className="footer-section" style={{ background: "#000", borderTop: "1px solid rgba(57,255,20,0.12)", padding: "64px 0 32px" }}>
      <div className="responsive-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Top */}
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 48,
            marginBottom: 64,
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily: "'Unbounded', monospace",
                fontSize: 48,
                fontWeight: 900,
                color: "#39FF14",
                lineHeight: 1,
                textShadow: "0 0 30px rgba(57,255,20,0.4)",
                marginBottom: 16,
              }}
            >
              404
            </div>
            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 14,
                color: "rgba(255,255,255,0.4)",
                lineHeight: 1.7,
                maxWidth: 220,
              }}
            >
              Андеграундная концертная организация. Казахстан.
            </p>
            <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
              {[
                { icon: <Instagram size={18} />, href: "https://www.instagram.com/404_studio_astana/" },
                { icon: <Send size={18} />, href: "https://t.me/tickets404bot" }
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  style={{
                    width: 36,
                    height: 36,
                    border: "1px solid rgba(57,255,20,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.4)",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "#39FF14";
                    el.style.color = "#39FF14";
                    el.style.boxShadow = "0 0 12px rgba(57,255,20,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(57,255,20,0.2)";
                    el.style.color = "rgba(255,255,255,0.4)";
                    el.style.boxShadow = "none";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 3, color: "#39FF14", marginBottom: 20 }}>
              НАВИГАЦИЯ
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {links.map((l) => (
                <a
                  href={l.href}
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 14,
                    color: "rgba(255,255,255,0.4)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                    letterSpacing: 1,
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#39FF14"; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "rgba(255,255,255,0.4)"; }}
                >{l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 3, color: "#39FF14", marginBottom: 20 }}>
              КОНТАКТЫ
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 2, color: "rgba(57,255,20,0.6)", marginBottom: 4 }}>EMAIL</p>
                <a
                  href="mailto:void@404.kz"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.6)", textDecoration: "none" }}
                >
                  void@404.kz
                </a>
              </div>
              <div>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 2, color: "rgba(57,255,20,0.6)", marginBottom: 4 }}>БУККИНГ</p>
                <a
                  href="mailto:booking@404.kz"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.6)", textDecoration: "none" }}
                >
                  booking@404.kz
                </a>
              </div>
              <div>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 2, color: "rgba(57,255,20,0.6)", marginBottom: 4 }}>TELEGRAM</p>
                <a
                  href="#"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.6)", textDecoration: "none" }}
                >
                  @tickets404bot
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="footer-bottom"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: 1 }}>
            © 2026 404 ORG — ВСЕ ПРАВА НЕ ЗАЩИЩЕНЫ
          </p>
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "rgba(57,255,20,0.3)", letterSpacing: 1 }}>
            KZ_UNDERGROUND_SCENE
          </p>
        </div>
      </div>
    </footer>
  );
}
