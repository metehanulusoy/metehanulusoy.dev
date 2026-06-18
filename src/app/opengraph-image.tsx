import { ImageResponse } from "next/og";

export const alt = "Metehan Ulusoy — Computer Engineering student & builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          backgroundColor: "#0c0b16",
          backgroundImage:
            "radial-gradient(60% 55% at 18% 12%, rgba(124,111,240,0.45), transparent 60%), radial-gradient(55% 50% at 88% 85%, rgba(126,224,217,0.30), transparent 60%), radial-gradient(45% 45% at 60% 30%, rgba(239,123,192,0.20), transparent 60%)",
        }}
      >
        <div
          style={{ display: "flex", fontSize: 28, color: "#a9a3c2", letterSpacing: 1 }}
        >
          metehanulusoy.dev
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              fontSize: 88,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: -2,
            }}
          >
            Metehan Ulusoy
          </div>
          <div style={{ display: "flex", fontSize: 36, color: "#c3bee0" }}>
            Computer Engineering · AI, automation &amp; full-stack
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 26,
            color: "#9b95ba",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              backgroundColor: "#7ee0d9",
            }}
          />
          Available for Summer 2026 internships
        </div>
      </div>
    ),
    size,
  );
}
