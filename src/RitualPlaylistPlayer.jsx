import { useState, useEffect, useRef } from "react";
import { G } from "./design.js";
import { MY_SONGS } from "./songs.js";
import { WaveAnim } from "./WaveAnim.jsx";

const RITUAL_SONG_DURATION = 210; // 3.5 min per song; 9 songs ≈ 31.5 min

// Builds a deduplicated ~9-song playlist filtered to the ritual's preferred era.
export function buildRitualPlaylist(ritual) {
  let pool = [...MY_SONGS];
  if (ritual.situation === "Bathing")    pool = [...MY_SONGS.filter(s => s.year >= 1960 && s.year <= 1975), ...MY_SONGS];
  if (ritual.situation === "Dressing")   pool = [...MY_SONGS.filter(s => s.year >= 1955 && s.year <= 1970), ...MY_SONGS];
  if (ritual.situation === "Mealtime")   pool = [...MY_SONGS.filter(s => [1,2,3].includes(s.id)), ...MY_SONGS];
  if (ritual.situation === "Sundowning") pool = [...MY_SONGS.filter(s => s.year <= 1970), ...MY_SONGS];
  const seen = new Set();
  const playlist = [];
  for (const s of pool) {
    if (!seen.has(s.id)) { seen.add(s.id); playlist.push(s); }
    if (playlist.length >= 9) break;
  }
  return playlist;
}

// ── RitualPlaylistPlayer ──────────────────────────────────────────────────────
// Full-screen 30-min ritual session player overlay.
// Props:
//   ritual  (object) — ritual object from Daily Guide
//   onClose (fn)
export default function RitualPlaylistPlayer({ ritual, onClose }) {
  const playlist = buildRitualPlaylist(ritual);
  const TOTAL_SECS = playlist.length * RITUAL_SONG_DURATION;

  const [trackIdx, setTrackIdx]   = useState(0);
  const [trackSecs, setTrackSecs] = useState(0);
  const [playing, setPlaying]     = useState(true);
  const [finished, setFinished]   = useState(false);
  const ivRef = useRef(null);

  const totalElapsed = trackIdx * RITUAL_SONG_DURATION + trackSecs;
  const overallPct   = Math.min(100, Math.round((totalElapsed / TOTAL_SECS) * 100));
  const trackPct     = Math.round((trackSecs / RITUAL_SONG_DURATION) * 100);
  const minsLeft     = Math.ceil((TOTAL_SECS - totalElapsed) / 60);

  useEffect(() => {
    if (playing && !finished) {
      ivRef.current = setInterval(() => {
        setTrackSecs(s => {
          if (s >= RITUAL_SONG_DURATION - 1) {
            setTrackIdx(idx => {
              const next = idx + 1;
              if (next >= playlist.length) { setFinished(true); setPlaying(false); return idx; }
              return next;
            });
            return 0;
          }
          return s + 1;
        });
      }, 1000);
    } else {
      clearInterval(ivRef.current);
    }
    return () => clearInterval(ivRef.current);
  }, [playing, finished, playlist.length]);

  const skipNext = () => { if (trackIdx < playlist.length - 1) { setTrackIdx(i => i + 1); setTrackSecs(0); } };
  const skipPrev = () => { if (trackSecs > 4) setTrackSecs(0); else if (trackIdx > 0) { setTrackIdx(i => i - 1); setTrackSecs(0); } };
  const fmtMins  = secs => `${Math.floor(secs/60)}:${String(secs%60).padStart(2,"0")}`;
  const currentSong = playlist[trackIdx];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)",
      display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:500 }}>
      <div style={{ background:G.primaryDark, borderRadius:"28px 28px 0 0",
        width:"100%", maxWidth:480, maxHeight:"92vh", overflowY:"auto",
        padding:"28px 20px 40px" }}>

        {/* Ritual badge + close */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:44, height:44, borderRadius:14, background:ritual.color+"33",
              border:`2px solid ${ritual.color}66`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>
              {ritual.emoji}
            </div>
            <div>
              <div style={{ fontSize:11, color:ritual.color, fontWeight:700,
                letterSpacing:1, textTransform:"uppercase" }}>30-MIN RITUAL PLAYLIST</div>
              <div style={{ fontFamily:"Georgia, serif", fontSize:18, fontWeight:700, color:"#fff" }}>
                {ritual.ritual}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background:"rgba(255,255,255,0.1)", border:"none", borderRadius:50,
            width:38, height:38, fontSize:17, cursor:"pointer", color:"#fff",
          }}>✕</button>
        </div>

        {/* Overall progress bar */}
        <div style={{ marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.6)" }}>Overall session</div>
            <div style={{ fontSize:13, color: minsLeft <= 5 ? G.accent : "rgba(255,255,255,0.6)", fontWeight:700 }}>
              {finished ? "✅ Session complete" : `~${minsLeft} min left`}
            </div>
          </div>
          <div style={{ background:"rgba(255,255,255,0.1)", borderRadius:8, height:8 }}>
            <div style={{ width:`${overallPct}%`, height:"100%", borderRadius:8,
              background:`linear-gradient(90deg, ${ritual.color}, ${G.accent})`,
              transition:"width 1s linear" }}/>
          </div>
        </div>

        {finished ? (
          <div style={{ textAlign:"center", padding:"40px 20px" }}>
            <div style={{ fontSize:60, marginBottom:16 }}>🌟</div>
            <div style={{ fontFamily:"Georgia, serif", fontSize:26, fontWeight:700,
              color:G.accent, marginBottom:8 }}>Session Complete!</div>
            <div style={{ fontSize:16, color:"rgba(255,255,255,0.75)", marginBottom:28, lineHeight:1.6 }}>
              You made it through the whole session together. That's wonderful care. 💛
            </div>
            <button onClick={onClose} style={{
              background:G.accent, border:"none", borderRadius:18,
              padding:"16px 40px", fontSize:18, fontWeight:700,
              color:G.primaryDark, cursor:"pointer",
            }}>Close</button>
          </div>
        ) : (
          <>
            {/* Now Playing card */}
            <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:22,
              padding:"20px", marginBottom:16 }}>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", letterSpacing:2,
                marginBottom:10, textTransform:"uppercase" }}>Now Playing</div>
              <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
                <div style={{ fontSize:42 }}>{currentSong.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"Georgia, serif", fontSize:20, fontWeight:700,
                    color:"#fff" }}>{currentSong.title}</div>
                  <div style={{ fontSize:14, color:"#a8c8a4" }}>
                    {currentSong.artist} · {currentSong.year}
                  </div>
                  {currentSong.note && (
                    <div style={{ fontSize:13, color:G.accent, fontStyle:"italic", marginTop:4 }}>
                      "{currentSong.note}"
                    </div>
                  )}
                </div>
              </div>
              <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:6, height:5, marginBottom:5 }}>
                <div style={{ width:`${trackPct}%`, height:"100%", background:G.accent,
                  borderRadius:6, transition:"width 1s linear" }}/>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:12,
                color:"rgba(255,255,255,0.4)" }}>
                <span>{fmtMins(trackSecs)}</span>
                <WaveAnim playing={playing} color={G.accent}/>
                <span>{fmtMins(RITUAL_SONG_DURATION)}</span>
              </div>
            </div>

            {/* Controls */}
            <div style={{ display:"flex", justifyContent:"center", gap:20, marginBottom:20 }}>
              <button onClick={skipPrev} style={{ background:"rgba(255,255,255,0.1)", border:"none",
                borderRadius:50, width:52, height:52, fontSize:20, cursor:"pointer", color:"#fff" }}>⏮</button>
              <button onClick={() => setPlaying(p => !p)} style={{ background:G.accent, border:"none",
                borderRadius:50, width:64, height:64, fontSize:26, cursor:"pointer",
                color:G.primaryDark, boxShadow:`0 4px 18px rgba(240,201,58,0.4)` }}>
                {playing ? "⏸" : "▶"}
              </button>
              <button onClick={skipNext} style={{ background:"rgba(255,255,255,0.1)", border:"none",
                borderRadius:50, width:52, height:52, fontSize:20, cursor:"pointer", color:"#fff" }}>⏭</button>
            </div>

            {/* Up Next queue */}
            {playlist.slice(trackIdx + 1, trackIdx + 4).length > 0 && (
              <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:16,
                padding:"14px 16px", marginBottom:16 }}>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", letterSpacing:2,
                  marginBottom:10, textTransform:"uppercase" }}>Up Next</div>
                {playlist.slice(trackIdx + 1, trackIdx + 4).map((s, i) => (
                  <div key={s.id} style={{ display:"flex", alignItems:"center", gap:10,
                    padding:"6px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                    <span style={{ fontSize:22 }}>{s.emoji}</span>
                    <span style={{ fontSize:14, color:"rgba(255,255,255,0.65)", flex:1 }}>{s.title}</span>
                    <span style={{ fontSize:12, color:"rgba(255,255,255,0.3)" }}>
                      +{(i+1) * Math.round(RITUAL_SONG_DURATION/60)} min
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Clinical tip */}
            <div style={{ background:"rgba(240,201,58,0.08)", border:`1px solid ${G.accent}33`,
              borderRadius:14, padding:"12px 16px", fontSize:13,
              color:"rgba(255,255,255,0.65)", lineHeight:1.6 }}>
              💡 {ritual.why}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
