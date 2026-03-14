import { G } from "./design.js";
import { MOOD_TAGS } from "./prompts.js";

// ── SongCard ──────────────────────────────────────────────────────────────────
// Horizontal song row with play button. Used in Session Player and MemoryLane.
// Props: song, onPlay, tags (array of tag ids)
export function SongCard({ song, onPlay, tags }) {
  return (
    <div onClick={() => onPlay(song)} style={{
      background:G.card, borderRadius:18, padding:"14px 16px",
      display:"flex", alignItems:"center", gap:12,
      boxShadow:`0 2px 10px rgba(61,107,53,0.07)`,
      border:"2px solid transparent", cursor:"pointer", transition:"border-color 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = G.primary}
      onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}
    >
      <div style={{ width:56, height:56, borderRadius:14, background:"#e4f0e0",
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>
        {song.emoji}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontFamily:"Georgia, serif", fontSize:18, fontWeight:700,
          color:G.text, marginBottom:2 }}>{song.title}</div>
        <div style={{ fontSize:14, color:G.textSoft, marginBottom: tags?.length ? 5 : 0 }}>
          {song.artist}
        </div>
        {tags?.length > 0 && (
          <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
            {tags.map(tId => {
              const ti = MOOD_TAGS.find(x => x.id === tId);
              return ti ? (
                <span key={tId} style={{
                  background:ti.color+"22", color:ti.color,
                  border:`1px solid ${ti.color}44`, borderRadius:20,
                  padding:"1px 8px", fontSize:11, fontWeight:600,
                }}>{ti.emoji} {ti.label}</span>
              ) : null;
            })}
          </div>
        )}
      </div>
      <button style={{
        background:G.primary, border:"none", borderRadius:50,
        width:48, height:48, color:G.accent, fontSize:17,
        cursor:"pointer", display:"flex", alignItems:"center",
        justifyContent:"center", flexShrink:0,
      }}>▶</button>
    </div>
  );
}

// ── MusicTile ─────────────────────────────────────────────────────────────────
// Square album-art tile. Used in Memory Lane grid.
// Props: song, onPlay, tags (array of tag ids)
export function MusicTile({ song, onPlay, tags }) {
  const topTag = tags?.[0] ? MOOD_TAGS.find(t => t.id === tags[0]) : null;

  return (
    <div onClick={() => onPlay(song)} style={{
      background:G.card, borderRadius:20, overflow:"hidden",
      border:"2px solid transparent", cursor:"pointer",
      boxShadow:"0 3px 14px rgba(61,107,53,0.09)",
      transition:"border-color 0.2s, transform 0.1s, box-shadow 0.2s",
      display:"flex", flexDirection:"column",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor=G.primary; e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 6px 20px rgba(61,107,53,0.18)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor="transparent"; e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 3px 14px rgba(61,107,53,0.09)"; }}
    >
      {/* Album art area */}
      <div style={{
        aspectRatio:"1",
        background:`linear-gradient(135deg, ${G.primary}cc, ${G.primaryDark})`,
        display:"flex", flexDirection:"column", alignItems:"center",
        justifyContent:"center", gap:6, position:"relative",
      }}>
        <div style={{ fontSize:52 }}>{song.emoji}</div>
        {/* Play overlay */}
        <div style={{ position:"absolute", bottom:10, right:10, width:38, height:38,
          borderRadius:"50%", background:G.accent, display:"flex",
          alignItems:"center", justifyContent:"center", fontSize:16,
          boxShadow:"0 2px 10px rgba(0,0,0,0.3)" }}>▶</div>
        {/* Mood tag badge */}
        {topTag && (
          <div style={{ position:"absolute", top:8, left:8,
            background:"rgba(0,0,0,0.5)", borderRadius:20,
            padding:"3px 9px", fontSize:11, color:"#fff", fontWeight:600 }}>
            {topTag.emoji} {topTag.label}
          </div>
        )}
      </div>
      {/* Song info */}
      <div style={{ padding:"12px 12px 14px" }}>
        <div style={{ fontFamily:"Georgia, serif", fontSize:16, fontWeight:700,
          color:G.text, marginBottom:2, overflow:"hidden",
          textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{song.title}</div>
        <div style={{ fontSize:13, color:G.textSoft, marginBottom: song.note ? 4 : 0,
          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
          {song.artist}
        </div>
        {song.note && (
          <div style={{ fontSize:12, color:"#8aaa86", fontStyle:"italic",
            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            "{song.note}"
          </div>
        )}
      </div>
    </div>
  );
}
