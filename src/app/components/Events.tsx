import { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Calendar, Clock, Ticket } from "lucide-react";

const events = [
  {
    id: 1,
    date: "14 ИЮНЯ",
    year: "2026",
    day: "ВСК",
    title: "VOID SIGNAL",
    subtitle: "Techno / Industrial",
    venue: "Подземный Клуб «База»",
    city: "АЛМАТЫ",
    time: "23:00",
    price: "3 000 ₸",
    status: "СКОРО",
    highlight: true,
    acts: ["KZRV", "NULL PTR", "МРАК"],
  },
  {
    id: 2,
    date: "21 ИЮНЯ",
    year: "2026",
    day: "СБТ",
    title: "STATIC NOISE #8",
    subtitle: "Noise / Post-punk",
    venue: "Арт-пространство «ПУСТОТА»",
    city: "АСТАНА",
    time: "22:00",
    price: "2 500 ₸",
    status: "СКОРО",
    highlight: false,
    acts: ["СЕРЫЙ ШУМ", "Deadzone", "404 CREW"],
  },
  {
    id: 3,
    date: "5 ИЮЛЯ",
    year: "2026",
    day: "ВСК",
    title: "НУЛЕВОЙ УРОВЕНЬ",
    subtitle: "Experimental / Ambient",
    venue: "Заброшенный завод «ЛИТ»",
    city: "ШЫМКЕНТ",
    time: "00:00",
    price: "2 000 ₸",
    status: "АНОНС",
    highlight: false,
    acts: ["???", "???", "???"],
  },
  {
    id: 4,
    date: "19 ИЮЛЯ",
    year: "2026",
    day: "ВСК",
    title: "SIGNAL LOST",
    subtitle: "Dark Techno / EBM",
    venue: "Секретная локация",
    city: "АЛМАТЫ",
    time: "23:00",
    price: "TBA",
    status: "АНОНС",
    highlight: false,
    acts: ["TBA", "TBA"],
  },
];

export function Events() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="events" style={{ background: "#000", padding: "100px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 64 }}
        >
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 4, color: "#39FF14", marginBottom: 12 }}>
            // БЛИЖАЙШИЕ_МЕРОПРИЯТИЯ
          </p>
          <h2
            style={{
              fontFamily: "'Unbounded', monospace",
              fontSize: "clamp(28px, 5vw, 52px)",
              fontWeight: 900,
              color: "white",
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            СОБЫТИЯ
          </h2>
          <div style={{ width: 60, height: 3, background: "#39FF14" }} />
        </motion.div>

        {/* Events list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onMouseEnter={() => setHovered(event.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr auto",
                gap: 24,
                alignItems: "center",
                padding: "28px 32px",
                border: `1px solid ${hovered === event.id ? "rgba(57,255,20,0.4)" : event.highlight ? "rgba(57,255,20,0.2)" : "rgba(255,255,255,0.08)"}`,
                background: hovered === event.id ? "rgba(57,255,20,0.04)" : event.highlight ? "rgba(57,255,20,0.02)" : "transparent",
                transition: "all 0.2s",
                cursor: "pointer",
                position: "relative",
              }}
            >
              {/* Left: date */}
              <div>
                <div
                  style={{
                    fontFamily: "'Unbounded', monospace",
                    fontSize: 28,
                    fontWeight: 900,
                    color: event.highlight ? "#39FF14" : "white",
                    lineHeight: 1,
                  }}
                >
                  {event.date.split(" ")[0]}
                </div>
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 11,
                    color: event.highlight ? "#39FF14" : "rgba(255,255,255,0.4)",
                    letterSpacing: 1,
                    marginTop: 4,
                  }}
                >
                  {event.date.split(" ")[1]} / {event.day}
                </div>
              </div>

              {/* Middle: info */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 9,
                      letterSpacing: 2,
                      padding: "3px 8px",
                      border: `1px solid ${event.status === "СКОРО" ? "#39FF14" : "rgba(255,255,255,0.3)"}`,
                      color: event.status === "СКОРО" ? "#39FF14" : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {event.status}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: 9,
                      letterSpacing: 2,
                      color: "rgba(255,255,255,0.35)",
                    }}
                  >
                    {event.subtitle}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "'Unbounded', monospace",
                    fontSize: "clamp(16px, 2.5vw, 24px)",
                    fontWeight: 700,
                    color: "white",
                    marginBottom: 10,
                    lineHeight: 1.2,
                  }}
                >
                  {event.title}
                </h3>

                <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 6 }}>
                    <MapPin size={12} color="#39FF14" />
                    {event.venue}, {event.city}
                  </span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center", gap: 6 }}>
                    <Clock size={12} color="#39FF14" />
                    {event.time}
                  </span>
                </div>

                <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {event.acts.map((act, j) => (
                    <span
                      key={j}
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 10,
                        letterSpacing: 1,
                        padding: "2px 8px",
                        background: "rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.5)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {act}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: price + ticket */}
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontFamily: "'Unbounded', monospace",
                    fontSize: 18,
                    fontWeight: 700,
                    color: event.highlight ? "#39FF14" : "white",
                    marginBottom: 12,
                  }}
                >
                  {event.price}
                </div>
                <button
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 10,
                    letterSpacing: 2,
                    padding: "10px 20px",
                    background: event.status === "СКОРО" ? (hovered === event.id ? "#39FF14" : "transparent") : "transparent",
                    border: `1px solid ${event.status === "СКОРО" ? "#39FF14" : "rgba(255,255,255,0.2)"}`,
                    color: event.status === "СКОРО" ? (hovered === event.id ? "#000" : "#39FF14") : "rgba(255,255,255,0.3)",
                    cursor: event.status === "СКОРО" ? "pointer" : "default",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.2s",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Ticket size={12} />
                  {event.status === "СКОРО" ? "КУПИТЬ" : "СКОРО"}
                </button>
              </div>

              {/* Highlight accent line */}
              {event.highlight && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    background: "#39FF14",
                    boxShadow: "0 0 12px rgba(57,255,20,0.6)",
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginTop: 40, textAlign: "center" }}
        >
          <a
            href="#"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              letterSpacing: 3,
              color: "rgba(255,255,255,0.4)",
              textDecoration: "none",
              borderBottom: "1px solid rgba(255,255,255,0.15)",
              paddingBottom: 4,
            }}
          >
            СМОТРЕТЬ ВСЕ АРХИВЫ →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
