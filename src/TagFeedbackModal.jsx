import { useState } from "react";
import { G } from "./design.js";
import { MOOD_TAGS } from "./prompts.js";

// ── TagFeedbackModal ──────────────────────────────────────────────────────────
// 6-mood post-song tagging overlay.
// Props:
//   song    (object)  — song that was just played
//   onClose (fn)
//   onSave  (fn)      — called with (songId, selectedTagIds[])
//   songLog (object)  — { [songId]: [tagId, ...] } — shows previously logged tags
export default function TagFeedbackModal({ song, onClose, onSave, songLog }) {
  const [selected, setSelected] = useState([]);
  const existing = songLog[song?.id] || [];

  const toggle = id =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(27,46,24,0.85)",
      display:"flex", alignItems:"center", justifyContent:"center", zIndex:300, padding:20 }}>
      <div style={{ background:G.card, borderRadius:28, padding:"28px 22px",
        width:"100%", maxWidth:400, boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>

        {/* Song heading */}
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <div style={{ fontSize:40, marginBottom:8 }}>{song?.emoji}</div>
          <div style={{ fontFamily:"Georgia, serif", fontSize:22, fontWeight:700,
            color:G.text }}>{song?.title}</div>
          <div style={{ fontSize:16, color:G.textSoft, marginTop:4 }}>
            How did this music make you feel?
          </div>
          <div style={{ fontSize:13, color:"#8aaa86", marginTop:4 }}>
            Your answer helps us choose better music — and your family can see what brings you joy.
          </div>
        </div>

        {/* Mood grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
          {MOOD_TAGS.map(t => {
            const isSel = selected.includes(t.id);
            const wasLogged = existing.includes(t.id);
            return (
              <button key={t.id} onClick={() => toggle(t.id)} style={{
                background: isSel ? t.color+"22" : G.bg,
                border:`2px solid ${isSel ? t.color : G.border}`,
                borderRadius:16, padding:"12px 10px", cursor:"pointer",
                display:"flex", alignItems:"center", gap:10, transition:"all 0.15s",
              }}>
                <span style={{ fontSize:26 }}>{t.emoji}</span>
                <div style={{ textAlign:"left" }}>
                  <div style={{ fontSize:15, fontWeight:700,
                    color: isSel ? t.color : G.text }}>{t.label}</div>
                  {wasLogged && (
                    <div style={{ fontSize:11, color:t.color }}>✓ before</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose} style={{
            flex:1, background:G.bg, border:`2px solid ${G.border}`,
            borderRadius:16, padding:"14px", fontSize:16,
            cursor:"pointer", color:G.textSoft,
          }}>Skip</button>
          <button onClick={() => onSave(song.id, selected)} style={{
            flex:2, background: selected.length ? G.accent : G.border,
            border:"none", borderRadius:16, padding:"14px",
            fontSize:16, fontWeight:700, cursor:"pointer", color:G.primaryDark,
          }}>Save {selected.length ? `(${selected.length})` : ""}</button>
        </div>
      </div>
    </div>
  );
}
