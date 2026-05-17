import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const stats = [
  { value: "47", label: "СОБЫТИЙ" },
  { value: "3", label: "ГОРОДА" },
  { value: "12K+", label: "ГОСТЕЙ" },
  { value: "2021", label: "С ГОДА" },
];

export function About() {
  return (
    <section id="about" style={{ background: "#080808", padding: "100px 0", position: "relative", overflow: "hidden" }}>
      {/* BG grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(rgba(57,255,20,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,0.02) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
          className="grid-cols-1 md:grid-cols-2"
        >
          {/* Left: image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ position: "relative" }}
          >
            <div style={{ position: "relative", aspectRatio: "4/5" }}>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1589869088623-d5ead6c32944?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx1bmRlcmdyb3VuZCUyMGNvbmNlcnQlMjByYXZlJTIwZGFyayUyMHN0YWdlfGVufDF8fHx8MTc3Nzk5NzI1NXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Underground show"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "grayscale(60%) contrast(1.1)",
                }}
              />
              {/* overlay lines */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.8) 100%)",
                }}
              />
              {/* corner accents */}
              <div style={{ position: "absolute", top: -2, left: -2, width: 30, height: 30, borderTop: "2px solid #39FF14", borderLeft: "2px solid #39FF14" }} />
              <div style={{ position: "absolute", bottom: -2, right: -2, width: 30, height: 30, borderBottom: "2px solid #39FF14", borderRight: "2px solid #39FF14" }} />
            </div>

            {/* Floating tag */}
            <div
              style={{
                position: "absolute",
                bottom: 32,
                left: 32,
                background: "rgba(0,0,0,0.9)",
                border: "1px solid rgba(57,255,20,0.3)",
                padding: "12px 20px",
              }}
            >
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, color: "#39FF14", marginBottom: 4 }}>ПОСЛЕДНЕЕ СОБЫТИЕ</p>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, color: "white" }}>STATIC NOISE #7 — Алматы</p>
            </div>
          </motion.div>

          {/* Right: text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 4, color: "#39FF14", marginBottom: 16 }}>
              // О_НАС
            </p>
            <h2
              style={{
                fontFamily: "'Unbounded', monospace",
                fontSize: "clamp(24px, 4vw, 44px)",
                fontWeight: 900,
                color: "white",
                lineHeight: 1.1,
                marginBottom: 32,
              }}
            >
              МЫ — ЭТО<br />
              <span style={{ color: "#39FF14" }}>ТЕ, КТО НЕ</span><br />
              НАШЁЛСЯ
            </h2>

            <div
              style={{
                width: 60,
                height: 3,
                background: "#39FF14",
                marginBottom: 32,
                boxShadow: "0 0 10px rgba(57,255,20,0.4)",
              }}
            />

            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 16,
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.8,
                marginBottom: 20,
              }}
            >
              404 — это андеграундный концертный коллектив из Казахстана, основанный в 2021 году. Мы организуем события на нестандартных площадках: заброшенных заводах, подвалах, пустых складах.
            </p>
            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 16,
                color: "rgba(255,255,255,0.6)",
                lineHeight: 1.8,
                marginBottom: 40,
              }}
            >
              Наша цель — создать сцену для тех, кто не вписывается в мейнстрим. Мы работаем с локальными артистами и приглашаем международных гостей.
            </p>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div
                    style={{
                      fontFamily: "'Unbounded', monospace",
                      fontSize: 28,
                      fontWeight: 900,
                      color: "#39FF14",
                      textShadow: "0 0 20px rgba(57,255,20,0.4)",
                      marginBottom: 4,
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 9,
                      letterSpacing: 2,
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
