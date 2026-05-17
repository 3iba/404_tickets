import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "МЕРОПРИЯТИЯ", href: "#events" },
    { label: "О НАС", href: "#about" },
    { label: "ГАЛЕРЕЯ", href: "#gallery" },
    { label: "КОНТАКТЫ", href: "#contacts" },
  ];

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: "background 0.3s",
        background: scrolled ? "rgba(0,0,0,0.95)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(57,255,20,0.15)" : "none",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          {/* Logo */}
          <a href="#" style={{ textDecoration: "none" }}>
            <span
              style={{
                fontFamily: "'Unbounded', monospace",
                fontSize: 28,
                fontWeight: 900,
                color: "#39FF14",
                letterSpacing: "-1px",
                textShadow: "0 0 20px rgba(57,255,20,0.6), 0 0 40px rgba(57,255,20,0.3)",
              }}
            >
              404
            </span>
          </a>

          {/* Desktop nav */}
          <nav style={{ display: "flex", gap: 32 }} className="hidden md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  letterSpacing: 2,
                  color: "rgba(255,255,255,0.6)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = "#39FF14";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <a
            href="#events"
            className="hidden md:block"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              letterSpacing: 2,
              padding: "8px 20px",
              border: "1px solid #39FF14",
              color: "#39FF14",
              textDecoration: "none",
              textTransform: "uppercase",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              const el = e.target as HTMLElement;
              el.style.background = "#39FF14";
              el.style.color = "#000";
            }}
            onMouseLeave={(e) => {
              const el = e.target as HTMLElement;
              el.style.background = "transparent";
              el.style.color = "#39FF14";
            }}
          >
            БИЛЕТЫ
          </a>

          {/* Mobile burger */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#39FF14" }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              background: "rgba(0,0,0,0.98)",
              borderTop: "1px solid rgba(57,255,20,0.2)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 13,
                  letterSpacing: 2,
                  color: "white",
                  textDecoration: "none",
                }}
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
