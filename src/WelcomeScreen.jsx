import { useState, useEffect } from "react";
import { G } from "./design.js";

// ── WelcomeScreen ─────────────────────────────────────────────────────────────
// Shown on the very first launch of the app. Displays the Carer's Manifesto.
// After the carer taps "Begin", this screen is never shown again.
// Props:
//   onComplete — called when the carer taps the CTA; App.jsx sets hasSeenWelcome.

const MANIFESTO_PARAGRAPHS = [
  {
    text: "You are here because you are a bridge. You are the link between the world as it is and the world your loved one is navigating.",
  },
  {
    text: "We know that some days feel like a long walk uphill, and other days feel like a quiet blessing.",
  },
  {
    text: "This app isn't just a music player — it's your partner. It's here to help you pave the road for the hard tasks, to celebrate the small wins, and to give you a moment of peace when you need it most.",
  },
  {
    text: "You are doing a noble thing.",
    emphasis: true,
  },
];

export default function WelcomeScreen({ onComplete }) {
  const [visible, setVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  // Staggered entrance: screen fades in, then CTA appears after a beat
  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 80);
    const t2 = setTimeout(() => setCtaVisible(true), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 700,
      background: `linear-gradient(160deg, ${G.primaryDark} 0%, #1a3a14 55%, #0d2408 100%)`,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 28px 48px",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.6s ease",
    }}>

      {/* Decorative leaf motif */}
      <div style={{ fontSize: 52, marginBottom: 16, animation: "breathe 4s ease-in-out infinite" }}>
        🍋
      </div>

      {/* App name */}
      <div style={{
        fontFamily: "Georgia, serif", fontSize: 13, fontWeight: 700,
        color: G.accent, letterSpacing: 3, textTransform: "uppercase",
        marginBottom: 8, opacity: 0.9,
      }}>
        The Daily Flow
      </div>

      {/* Title */}
      <div style={{
        fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 700,
        color: "#ffffff", textAlign: "center", marginBottom: 32,
        lineHeight: 1.3,
      }}>
        Welcome to<br/>The Carer's Companion
      </div>

      {/* Divider */}
      <div style={{
        width: 48, height: 2, background: G.accent,
        borderRadius: 2, marginBottom: 32, opacity: 0.7,
      }} />

      {/* Manifesto body */}
      <div style={{
        maxWidth: 360, width: "100%",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(240,201,58,0.2)",
        borderRadius: 24, padding: "28px 26px",
        marginBottom: 36,
      }}>
        {MANIFESTO_PARAGRAPHS.map((p, i) => (
          <p key={i} style={{
            fontFamily: "Georgia, serif",
            fontSize: p.emphasis ? 20 : 16,
            fontWeight: p.emphasis ? 700 : 400,
            color: p.emphasis ? G.accent : "rgba(255,255,255,0.88)",
            lineHeight: 1.75,
            marginBottom: i < MANIFESTO_PARAGRAPHS.length - 1 ? 18 : 0,
            textAlign: p.emphasis ? "center" : "left",
          }}>
            {p.text}
          </p>
        ))}
      </div>

      {/* Sign-off line */}
      <div style={{
        fontFamily: "Georgia, serif", fontSize: 15, fontStyle: "italic",
        color: "rgba(255,255,255,0.6)", textAlign: "center",
        marginBottom: 40, lineHeight: 1.6,
      }}>
        Let's find the rhythm of today, together.
      </div>

      {/* CTA button */}
      <button
        onClick={onComplete}
        style={{
          background: G.accent, border: "none", borderRadius: 22,
          padding: "18px 48px", fontSize: 18, fontWeight: 700,
          color: G.primaryDark, cursor: "pointer", letterSpacing: 0.3,
          boxShadow: `0 6px 28px rgba(240,201,58,0.45)`,
          opacity: ctaVisible ? 1 : 0,
          transform: ctaVisible ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
          minWidth: 220,
        }}
      >
        Begin 💛
      </button>

      {/* Fine print */}
      <div style={{
        marginTop: 20, fontSize: 12,
        color: "rgba(255,255,255,0.3)", textAlign: "center",
      }}>
        This message will only appear once.
      </div>

      <style>{`@keyframes breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.12)} }`}</style>
    </div>
  );
}
