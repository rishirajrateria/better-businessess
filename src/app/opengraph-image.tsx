import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg,#FBFAF7 0%,#F4F1EA 60%,#F7EFDC 100%)", fontFamily: "sans-serif", position: "relative" }}>
        <div style={{ position: "absolute", top: -200, right: -150, width: 600, height: 600, borderRadius: 9999, background: "rgba(193,154,62,0.18)", filter: "blur(40px)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 84, height: 84, borderRadius: 24, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 60px -20px rgba(10,10,10,0.25)" }}>
            <svg width="60" height="60" viewBox="0 0 64 64"><path d="M31 16h-9.5c-5 0-8.5 3.2-8.5 7.6 0 2.9 1.6 5.2 4 6.3-3 1-5 3.6-5 7 0 4.9 3.7 8.1 9 8.1H31V40h-8.4c-2.1 0-3.4-1.2-3.4-3s1.3-3 3.4-3H31v-5.2h-8c-2 0-3.1-1.1-3.1-2.8s1.1-2.8 3.1-2.8h8V16z" fill="#0A0A0A" /><path d="M33 16h9.5c5 0 8.5 3.2 8.5 7.6 0 2.9-1.6 5.2-4 6.3 3 1 5 3.6 5 7 0 4.9-3.7 8.1-9 8.1H33V40h8.4c2.1 0 3.4-1.2 3.4-3s-1.3-3-3.4-3H33v-5.2h8c2 0 3.1-1.1 3.1-2.8s-1.1-2.8-3.1-2.8h-8V16z" fill="#C19A3E" /></svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: 10, fontSize: 30, fontWeight: 700, letterSpacing: 4, color: "#0A0A0A" }}><span>BETTER</span><span style={{ color: "#C19A3E" }}>BUSINESSES</span></div>
            <div style={{ fontSize: 16, letterSpacing: 5, color: "#6b6b6b" }}>STRATEGY. GROWTH. RESULTS.</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.05, color: "#0A0A0A", letterSpacing: -2 }}>Lead Generation · SEO · Websites · Branding</div>
          <div style={{ display: "flex", fontSize: 30, color: "#3a3a3a" }}>Canada&apos;s digital growth agency. Get found on Google. Get recommended by AI.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#9A7628", fontWeight: 600 }}>
          <span>{site.domain}</span>
          <span>Serving every province and territory 🇨🇦</span>
        </div>
      </div>
    ),
    size,
  );
}
