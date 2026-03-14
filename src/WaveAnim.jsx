import { G } from "./design.js";

// ── WaveAnim ──────────────────────────────────────────────────────────────────
// Animated 5-bar wave. Used in Now Playing, Era Radio, Nature, RAS.
// Props:
//   playing (bool)  — animates when true
//   color   (str)   — bar colour (defaults to G.accent)
export function WaveAnim({ playing, color }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:28 }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{
          width:6, borderRadius:3,
          background: color || G.accent,
          animation: playing ? `wv${i} 1.${i}s ease-in-out infinite alternate` : "none",
          height: playing ? undefined : 5,
          minHeight:5, maxHeight:28,
        }}/>
      ))}
    </div>
  );
}

// ── BackBtn ───────────────────────────────────────────────────────────────────
// Standardised back button used in all game sub-screens.
// Props:
//   onBack (fn) — called when button is pressed
export function BackBtn({ onBack }) {
  return (
    <button onClick={onBack} style={{
      background:"transparent",
      border:`2px solid ${G.border}`,
      borderRadius:12,
      padding:"8px 16px",
      fontSize:15,
      color:G.textSoft,
      cursor:"pointer",
      marginBottom:18,
    }}>← Back</button>
  );
}
