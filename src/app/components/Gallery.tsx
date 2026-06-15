import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const guitarSrc = new URL("../../assets/guitar.png", import.meta.url).href;
const micSrc = new URL("../../assets/mic.png", import.meta.url).href;
const gallery1Src = new URL("./ui/gallery1.jpg", import.meta.url).href;
const gallery2Src = new URL("./ui/gallery2.jpg", import.meta.url).href;

const photos = [
  {
    src: "https://images.unsplash.com/photo-1688981935353-07e2d0142648?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmRlcmdyb3VuZCUyMGNvbmNlcnQlMjByYXZlJTIwZGFyayUyMHN0YWdlfGVufDF8fHx8MTc3Nzk5NzI1NXww&ixlib=rb-4.1.0&q=80&w=1080",
    label: "VOID SIGNAL #6",
    span: "col-span-2",
  },
  {
    src: gallery1Src,
    label: "НУЛЕВОЙ УРОВЕНЬ #3",
    span: "",
  },
  {
    src: gallery2Src,
    label: "ГАЛЕРЕЯ #1",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1775442904577-9d3fa9f7525b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHx1bmRlcmdyb3VuZCUyMGNvbmNlcnQlMjByYXZlJTIwZGFyayUyMHN0YWdlfGVufDF8fHx8MTc3Nzk5NzI1NXww&ixlib=rb-4.1.0&q=80&w=1080",
    label: "STATIC NOISE #7",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1571900267799-debdb80d1617?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwY3Jvd2QlMjBuaWdodCUyMG11c2ljJTIwZmVzdGl2YWx8ZW58MXx8fHwxNzc3OTk3MjU1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    label: "SIGNAL LOST #2",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1629276299571-cc523d77bad5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjb25jZXJ0JTIwY3Jvd2QlMjBuaWdodCUyMG11c2ljJTIwZmVzdGl2YWx8ZW58MXx8fHwxNzc3OTk3MjU1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    label: "VOID SIGNAL #5",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1629276299414-a6f6d6403fd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxjb25jZXJ0JTIwY3Jvd2QlMjBuaWdodCUyMG11c2ljJTIwZmVzdGl2YWx8ZW58MXx8fHwxNzc3OTk3MjU1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    label: "STATIC NOISE #6",
    span: "",
  },
];

export function Gallery() {
  return (
    <section id="gallery" className="gallery-section" style={{ background: "#000", padding: "100px 0", position: "relative", overflow: "hidden" }}>
      <img
        src={micSrc}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          left: -64,
          bottom: 182,
          width: 260,
          maxWidth: "35vw",
          opacity: 0.16,
          pointerEvents: "none",
          userSelect: "none",
          transform: "rotate(-8deg)",
          filter: "brightness(1.1) drop-shadow(0 0 36px rgba(57,255,20,0.18))",
        }}
      />
      <img
        src={guitarSrc}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 12,
          right: -30,
          width: 480,
          maxWidth: "60vw",
          opacity: 0.18,
          pointerEvents: "none",
          userSelect: "none",
          transform: "rotate(10deg)",
          filter: "brightness(1.14) drop-shadow(0 0 48px rgba(57,255,20,0.22))",
        }}
      />
      <div className="responsive-container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 48 }}
        >
          <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 4, color: "#39FF14", marginBottom: 12 }}>
            // АРХИВ_ФОТО
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
            ГАЛЕРЕЯ
          </h2>
          <div style={{ width: 60, height: 3, background: "#39FF14" }} />
        </motion.div>

        <div
          className="gallery-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 4,
          }}
        >
          {photos.map((photo, i) => (
            <motion.div
              className={`group gallery-item ${photo.span ? "wide" : ""}`}
              key={i}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              style={{
                position: "relative",
                aspectRatio: photo.span ? "16/9" : "4/3",
                overflow: "hidden",
                gridColumn: photo.span === "col-span-2" ? "span 2" : "span 1",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector("img");
                if (img) img.style.transform = "scale(1.05)";
                const overlay = e.currentTarget.querySelector(".overlay") as HTMLElement;
                if (overlay) overlay.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector("img");
                if (img) img.style.transform = "scale(1)";
                const overlay = e.currentTarget.querySelector(".overlay") as HTMLElement;
                if (overlay) overlay.style.opacity = "0";
              }}
            >
              <ImageWithFallback
                src={photo.src}
                alt={photo.label}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "grayscale(50%)",
                  transition: "transform 0.5s",
                }}
              />
              <div
                className="overlay"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.6)",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: 20,
                  opacity: 0,
                  transition: "opacity 0.3s",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 11,
                    letterSpacing: 2,
                    color: "#39FF14",
                    textTransform: "uppercase",
                  }}
                >
                  {photo.label}
                </span>
              </div>
              {/* corner accent */}
              <div style={{ position: "absolute", top: 8, left: 8, width: 16, height: 16, borderTop: "1px solid rgba(57,255,20,0.4)", borderLeft: "1px solid rgba(57,255,20,0.4)", pointerEvents: "none" }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
