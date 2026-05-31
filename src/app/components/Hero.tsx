import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  const glitchRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const chars = "!@#$%^&*()_+-=[]{}|;':,./<>?АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯabcdefghijklmnopqrstuvwxyz0123456789";
    const original = "404 ORG";

    const glitch = () => {
      if (!glitchRef.current) return;
      let count = 0;
      interval = setInterval(() => {
        if (!glitchRef.current) return;
        if (count >= 8) {
          glitchRef.current.textContent = original;
          clearInterval(interval);
          return;
        }
        glitchRef.current.textContent = original
          .split("")
          .map((c, i) => (i < count ? c : chars[Math.floor(Math.random() * chars.length)]))
          .join("");
        count++;
      }, 60);
    };

    const outerInterval = setInterval(glitch, 3000);
    return () => {
      clearInterval(outerInterval);
      clearInterval(interval);
    };
  }, []);

  return (
    <section
      className="hero-section"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#000",
      }}
    >
      {/* Background image */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1750700381231-9c9f32f7c47a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx1bmRlcmdyb3VuZCUyMGNvbmNlcnQlMjByYXZlJTIwZGFyayUyMHN0YWdlfGVufDF8fHx8MTc3Nzk5NzI1NXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Underground concert"
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.35, filter: "grayscale(40%)" }}
        />
        {/* Gradient overlays */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.9) 100%)" }} />
        {/* Scanlines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)",
            backgroundSize: "100% 2px",
          }}
        />
        {/* Grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(57,255,20,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Content */}
      <div className="hero-content" style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p
            className="hero-eyebrow"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              letterSpacing: 6,
              color: "#39FF14",
              marginBottom: 24,
              textTransform: "uppercase",
            }}
          >
            АЛМАТЫ / АСТАНА / ШЫМКЕНТ
          </p>

          <h1
            style={{
              fontFamily: "'Unbounded', monospace",
              fontSize: "clamp(56px, 12vw, 140px)",
              fontWeight: 900,
              lineHeight: 1,
              color: "white",
              marginBottom: 8,
              textShadow: "0 0 60px rgba(57,255,20,0.2)",
            }}
          >
            <span ref={glitchRef} style={{ display: "inline-block" }}>404 ORG</span>
          </h1>

          <div
            style={{
              width: "100%",
              maxWidth: 600,
              margin: "0 auto 24px",
              height: 1,
              background: "linear-gradient(90deg, transparent, #39FF14, transparent)",
            }}
          />

          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(14px, 2vw, 18px)",
              color: "rgba(255,255,255,0.6)",
              maxWidth: 520,
              margin: "0 auto 48px",
              lineHeight: 1.7,
            }}
          >
            Андеграундная сцена Казахстана. Мы организовываем концерты, которые не найти ни в каком гиде.
          </p>

          <div className="hero-actions" style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="#events"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                letterSpacing: 2,
                padding: "14px 36px",
                background: "#39FF14",
                color: "#000",
                textDecoration: "none",
                textTransform: "uppercase",
                fontWeight: 700,
                transition: "box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(57,255,20,0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              БЛИЖАЙШИЕ СОБЫТИЯ
            </a>
            <a
              href="#about"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                letterSpacing: 2,
                padding: "14px 36px",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "rgba(255,255,255,0.7)",
                textDecoration: "none",
                textTransform: "uppercase",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "#39FF14";
                el.style.color = "#39FF14";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(255,255,255,0.3)";
                el.style.color = "rgba(255,255,255,0.7)";
              }}
            >
              О НАС
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
          color: "rgba(57,255,20,0.6)",
        }}
      >
        <ChevronDown size={24} />
      </motion.div>

      {/* Error code decoration */}
      <div
        className="hero-code"
        style={{
          position: "absolute",
          bottom: 80,
          right: 32,
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          letterSpacing: 2,
          color: "rgba(57,255,20,0.25)",
          textAlign: "right",
          zIndex: 1,
        }}
      >
        <div>ERR_NOT_FOUND</div>
        <div>STATUS: 404</div>
        <div>SIGNAL: ACTIVE</div>
      </div>
    </section>
  );
}
