import { G } from "./design.js";
import { MY_SONGS } from "./songs.js";
import { MOOD_TAGS } from "./prompts.js";
import { SongCard } from "./SongCard.jsx";

// ── HomeScreen ────────────────────────────────────────────────────────────────
// Three large full-width buttons: Calm Down, Wake Up, My Life.
// Implements the Iso-Principle entry point — carers see the two mood modes clearly.
export function HomeScreen({ onCalmDown, onWakeUp, onMyLife }) {
  const btn = (onClick, bg, border, emoji, label, sub, textColor, subColor, shadow) => (
    <button onClick={onClick} style={{
      width:"100%", background:bg, border:`3px solid ${border}`, borderRadius:28,
      padding:"32px 20px", marginBottom:16, cursor:"pointer",
      display:"flex", flexDirection:"column", alignItems:"center", gap:10,
      boxShadow:shadow, transition:"transform 0.1s, box-shadow 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform="scale(1.02)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; }}
    >
      <span style={{ fontSize:64 }}>{emoji}</span>
      <div style={{ fontFamily:"Georgia, serif", fontSize:34, fontWeight:700,
        color:textColor, letterSpacing:1, textTransform:"uppercase" }}>{label}</div>
      <div style={{ fontSize:18, color:subColor, textAlign:"center", maxWidth:260,
        fontWeight:600 }} dangerouslySetInnerHTML={{ __html: sub }}/>
    </button>
  );

  return (
    <div>
      {btn(onCalmDown, G.calmLight, G.calm, "🌊", "CALM DOWN",
        "Feeling worried or unsettled?<br/>Let music bring you peace.",
        G.calm, "#4a6a8a", `0 4px 24px rgba(58,125,192,0.18)`)}
      {btn(onWakeUp, G.wakeLight, G.wake, "☀️", "WAKE UP",
        "Need a little energy?<br/>Your favourite songs will lift you up.",
        G.wake, "#7a5a10", `0 4px 24px rgba(212,130,10,0.18)`)}
      {btn(onMyLife, "#f5f0ff", "#8a6abd", "💛", "MY LIFE",
        "Your photos, your memories,<br/>your story.",
        "#6a4a9a", "#5a3a8a", `0 4px 24px rgba(138,106,189,0.18)`)}
    </div>
  );
}

// ── SessionPlayer ─────────────────────────────────────────────────────────────
// Calm or Wake playlist with Iso-Principle context panel.
export function SessionPlayer({ mode, onPlay, onBack }) {
  const isCalm = mode === "calm";
  const songs = isCalm
    ? [MY_SONGS[0], MY_SONGS[2], MY_SONGS[4]]
    : [MY_SONGS[1], MY_SONGS[3], MY_SONGS[5]];

  return (
    <div>
      <button onClick={onBack} style={{
        background:"transparent", border:`2px solid ${G.border}`, borderRadius:12,
        padding:"8px 16px", fontSize:15, color:G.textSoft, cursor:"pointer", marginBottom:16,
      }}>← Back</button>

      {/* Mode header */}
      <div style={{
        background: isCalm ? G.calmLight : G.wakeLight,
        border:`2px solid ${isCalm ? G.calm : G.wake}`,
        borderRadius:22, padding:"22px", marginBottom:20,
        display:"flex", alignItems:"center", gap:16,
      }}>
        <span style={{ fontSize:52 }}>{isCalm ? "🌊" : "☀️"}</span>
        <div>
          <div style={{ fontFamily:"Georgia, serif", fontSize:26, fontWeight:700,
            color: isCalm ? G.calm : G.wake }}>
            {isCalm ? "Calm Down" : "Wake Up"}
          </div>
          <div style={{ fontSize:15, color: isCalm ? "#4a6a8a" : "#7a5a10",
            marginTop:4, lineHeight:1.5 }}>
            {isCalm
              ? "Starting with comforting music, then gently slowing to help you relax."
              : "Starting with your upbeat favourites to bring energy and joy."}
          </div>
        </div>
      </div>

      {/* Iso-Principle explainer */}
      <div style={{ background:G.card, borderRadius:16, padding:"14px 16px",
        marginBottom:18, border:`2px solid ${G.border}`,
        display:"flex", alignItems:"center", gap:12 }}>
        <span style={{ fontSize:22 }}>🎼</span>
        <div style={{ fontSize:14, color:G.textSoft, flex:1 }}>
          <strong style={{ color:G.text }}>How this works: </strong>
          {isCalm
            ? "Music matches your mood, then gradually slows your heart rate to ~60 BPM."
            : "Upbeat familiar songs activate your brain and gently build energy."}
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:11, marginBottom:20 }}>
        {songs.map(s => <SongCard key={s.id} song={s} onPlay={onPlay} tags={[]}/>)}
      </div>

      <button onClick={() => onPlay(songs[0])} style={{
        width:"100%", background: isCalm ? G.calm : G.wake,
        border:"none", borderRadius:18, padding:"20px",
        fontSize:22, fontWeight:700, color:"#fff", cursor:"pointer",
        fontFamily:"Georgia, serif",
        boxShadow:`0 4px 20px ${(isCalm ? G.calm : G.wake)}44`,
      }}>▶  Start Session</button>
    </div>
  );
}

// ── CarerInsights ─────────────────────────────────────────────────────────────
// Mood tag analytics panel — shown below Memory Lane.
// Helps carers and family see patterns in what music works best.
export function CarerInsights({ songLog }) {
  const entries = Object.entries(songLog);
  if (!entries.length) return (
    <div style={{ background:G.bg, borderRadius:16, padding:"18px",
      textAlign:"center", color:G.textSoft, fontSize:15 }}>
      No feedback recorded yet. After playing a song, you can share how it made you feel.
    </div>
  );

  const tagCounts = {};
  entries.forEach(([,tags]) => tags.forEach(t => { tagCounts[t] = (tagCounts[t]||0)+1; }));
  const topTag     = Object.entries(tagCounts).sort((a,b) => b[1]-a[1])[0];
  const topTagInfo = MOOD_TAGS.find(t => t.id === topTag?.[0]);

  return (
    <div style={{ background:G.card, borderRadius:20, padding:"18px",
      border:`2px solid ${G.border}` }}>
      <div style={{ fontFamily:"Georgia, serif", fontSize:17, fontWeight:700,
        color:G.text, marginBottom:4 }}>💡 Insights for family & carers</div>
      {topTagInfo && (
        <div style={{ background:topTagInfo.color+"15",
          border:`1px solid ${topTagInfo.color}44`,
          borderRadius:12, padding:"10px 14px", marginBottom:14,
          fontSize:15, color:G.text }}>
          Margaret most often feels{" "}
          <strong style={{ color:topTagInfo.color }}>
            {topTagInfo.emoji} {topTagInfo.label}
          </strong>{" "}
          after listening. Try starting sessions with this type of music.
        </div>
      )}
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {entries.map(([songId, tags]) => {
          const s = MY_SONGS.find(x => x.id === Number(songId));
          if (!s || !tags.length) return null;
          return (
            <div key={songId} style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:22 }}>{s.emoji}</span>
              <span style={{ fontSize:14, color:G.text, flex:1 }}>{s.title}</span>
              <div style={{ display:"flex", gap:4, flexWrap:"wrap", justifyContent:"flex-end" }}>
                {tags.map(tId => {
                  const ti = MOOD_TAGS.find(x => x.id === tId);
                  return ti ? (
                    <span key={tId} style={{
                      background:ti.color+"22", color:ti.color,
                      border:`1px solid ${ti.color}44`,
                      borderRadius:20, padding:"2px 8px",
                      fontSize:11, fontWeight:600,
                    }}>{ti.emoji} {ti.label}</span>
                  ) : null;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
