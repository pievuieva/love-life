import { useState, useEffect, useRef } from "react";
import { G } from "./design.js";
import { WaveAnim } from "./WaveAnim.jsx";

// ── NowPlaying Overlay ────────────────────────────────────────────────────────
// Full-screen player with photo slideshow, simulated progress, wave, mood prompt.
// Props:
//   song         (object)  — song to display
//   photos       (array)   — base64 photo strings for slideshow
//   onClose      (fn)
//   onTagRequest (fn)      — called when user wants to tag mood after song ends
export default function NowPlaying({ song, photos, onClose, onTagRequest }) {
  const [playing, setPlaying]     = useState(true);
  const [progress, setProgress]   = useState(0);
  const [done, setDone]           = useState(false);
  const [slideIdx, setSlideIdx]   = useState(0);
  const [showPhotos, setShowPhotos] = useState(photos.length > 0);
  const iv = useRef(null);
  const sv = useRef(null);

  useEffect(() => {
    if (playing && !done) {
      iv.current = setInterval(() => {
        setProgress(p => { if (p >= 100) { clearInterval(iv.current); setDone(true); return 100; } return p + 0.5; });
      }, 80);
    } else clearInterval(iv.current);
    return () => clearInterval(iv.current);
  }, [playing, done]);

  useEffect(() => {
    if (showPhotos && photos.length > 1) {
      sv.current = setInterval(() => setSlideIdx(i => (i + 1) % photos.length), 5000);
    } else clearInterval(sv.current);
    return () => clearInterval(sv.current);
  }, [showPhotos, photos]);

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(27,46,24,0.97)",
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", zIndex:100, padding:24 }}>

      {/* Photo slideshow or emoji disc */}
      {showPhotos && photos.length > 0 ? (
        <div style={{ width:200, height:200, borderRadius:22, overflow:"hidden",
          border:`5px solid ${G.accent}`, marginBottom:22, position:"relative",
          boxShadow:`0 0 50px rgba(240,201,58,0.35)` }}>
          <img key={slideIdx} src={photos[slideIdx]} alt=""
            style={{ width:"100%", height:"100%", objectFit:"cover", animation:"fpic 1.4s ease" }}/>
          <div style={{ position:"absolute", bottom:7, left:"50%", transform:"translateX(-50%)",
            display:"flex", gap:5 }}>
            {photos.map((_,i) => (
              <div key={i} style={{ width:7, height:7, borderRadius:"50%",
                background: i===slideIdx ? G.accent : "rgba(255,255,255,0.4)",
                transition:"background 0.4s" }}/>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ width:150, height:150, borderRadius:"50%", background:G.primary,
          border:`5px solid ${G.accent}`, display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:70, marginBottom:22,
          boxShadow: playing ? `0 0 55px rgba(240,201,58,0.4)` : "none",
          transition:"box-shadow 0.5s" }}>
          {song.emoji}
        </div>
      )}

      <div style={{ color:G.accent, fontSize:12, letterSpacing:2, marginBottom:5 }}>NOW PLAYING</div>
      <div style={{ color:"#fff", fontFamily:"Georgia, serif", fontSize:30, fontWeight:700,
        textAlign:"center", marginBottom:5, lineHeight:1.2 }}>{song.title}</div>
      <div style={{ color:"#a8c8a4", fontSize:19, marginBottom: song.note ? 10 : 16 }}>{song.artist}</div>

      {song.note && (
        <div style={{ background:"rgba(240,201,58,0.12)", border:"1px solid rgba(240,201,58,0.3)",
          borderRadius:12, padding:"8px 18px", color:G.accent, fontSize:15,
          fontStyle:"italic", textAlign:"center", marginBottom:16, maxWidth:320 }}>
          "{song.note}"
        </div>
      )}

      {photos.length > 0 && (
        <button onClick={() => setShowPhotos(s => !s)} style={{
          background: showPhotos ? G.accent : "rgba(255,255,255,0.1)",
          border:`2px solid ${showPhotos ? G.accent : "rgba(255,255,255,0.3)"}`,
          borderRadius:12, padding:"7px 18px",
          color: showPhotos ? G.primaryDark : "#fff",
          fontSize:14, fontWeight:700, cursor:"pointer", marginBottom:14,
        }}>
          {showPhotos ? "📷 Showing photos" : "📷 Show my photos"}
        </button>
      )}

      {/* Progress bar */}
      <div style={{ width:"100%", maxWidth:320, background:"rgba(255,255,255,0.1)",
        borderRadius:8, height:7, marginBottom:14 }}>
        <div style={{ width:`${progress}%`, height:"100%", background:G.accent,
          borderRadius:8, transition:"width 0.08s linear" }}/>
      </div>
      <WaveAnim playing={playing && !done}/>

      {/* Controls */}
      <div style={{ display:"flex", gap:16, marginTop:18, marginBottom:22 }}>
        <button onClick={() => setPlaying(p => !p)} style={{
          background:G.accent, border:"none", borderRadius:50,
          width:72, height:72, fontSize:28, cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:`0 4px 18px rgba(240,201,58,0.4)`,
        }}>{playing ? "⏸" : "▶️"}</button>
        <button onClick={() => { if (done) onTagRequest(); else onClose(); }} style={{
          background:"rgba(255,255,255,0.1)", border:"2px solid rgba(255,255,255,0.2)",
          borderRadius:50, width:72, height:72, fontSize:24, cursor:"pointer", color:"#fff",
        }}>✕</button>
      </div>

      {/* Post-song mood prompt */}
      {done && (
        <div style={{ textAlign:"center", animation:"fadeIn 0.5s ease" }}>
          <div style={{ color:"#fff", fontSize:20, fontFamily:"Georgia, serif", marginBottom:14 }}>
            How did that feel?
          </div>
          <button onClick={onTagRequest} style={{
            background:G.accent, border:"none", borderRadius:18,
            padding:"14px 32px", fontSize:18, fontWeight:700,
            color:G.primaryDark, cursor:"pointer", fontFamily:"Georgia, serif",
          }}>Share how I felt 💛</button>
        </div>
      )}
    </div>
  );
}
