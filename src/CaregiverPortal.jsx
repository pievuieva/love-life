import { useState, useEffect, useRef } from "react";
import { G } from "./design.js";
import { MY_SONGS } from "./songs.js";
import Dashboard from "./Dashboard.jsx";

// ── CaregiverPortal ───────────────────────────────────────────────────────────
// Bottom-sheet overlay. Four tabs: Daily Guide, Songs, Greeting, Summary.
// Opens as overlay on top of any screen — never replaces the main nav.
export default function CaregiverPortal({ onClose, onPlay }) {
  const [tab, setTab]             = useState("guide");
  const [sosActive, setSosActive] = useState(false);

  // Songs tab state
  const [songs, setSongs]     = useState(MY_SONGS);
  const [newSong, setNewSong] = useState({ title:"", artist:"", note:"" });

  // Greeting tab state
  const [greeting, setGreeting]         = useState("");
  const [greetingFrom, setGreetingFrom] = useState("");
  const [recording, setRecording]       = useState(false);
  const [recordSecs, setRecordSecs]     = useState(0);
  const [savedGreeting, setSavedGreeting] = useState(null);
  const recRef = useRef(null);

  const handleRecord = () => {
    if (recording) {
      clearInterval(recRef.current); setRecording(false);
      setSavedGreeting({ from:greetingFrom, text:greeting, secs:recordSecs });
    } else {
      setRecordSecs(0); setRecording(true);
      recRef.current = setInterval(() => {
        setRecordSecs(s => {
          if (s >= 10) { clearInterval(recRef.current); setRecording(false);
            setSavedGreeting({ from:greetingFrom, text:greeting, secs:10 }); return 10; }
          return s+1;
        });
      }, 1000);
    }
  };

  const addSong = () => {
    if (!newSong.title || !newSong.artist) return;
    setSongs(s => [...s, { id:Date.now(), ...newSong, year:1965, emoji:"🎵" }]);
    setNewSong({ title:"", artist:"", note:"" });
  };

  useEffect(() => () => { clearInterval(recRef.current); }, []);

  const PORTAL_TABS = [
    { id:"guide",    label:"📖 Daily Guide" },
    { id:"songs",    label:"🎵 Songs" },
    { id:"greeting", label:"🎙 Greeting" },
    { id:"summary",  label:"📋 Summary" },
  ];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)",
      zIndex:400, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div style={{ background:G.bg, borderRadius:"28px 28px 0 0",
        width:"100%", maxWidth:480, maxHeight:"92vh",
        overflow:"auto", padding:"24px 18px 40px" }}>

        {/* SOS Overlay */}
        {sosActive && (
          <div style={{ position:"fixed", inset:0, background:"rgba(10,20,10,0.96)",
            zIndex:500, display:"flex", flexDirection:"column", alignItems:"center",
            justifyContent:"center", padding:28, textAlign:"center" }}>
            <div style={{ fontSize:80, marginBottom:20 }}>🎵</div>
            <div style={{ fontFamily:"Georgia, serif", fontSize:28, fontWeight:700,
              color:G.accent, marginBottom:8 }}>{MY_SONGS[0].title}</div>
            <div style={{ fontSize:18, color:"#a8c8a4", marginBottom:32 }}>
              {MY_SONGS[0].artist} — playing now
            </div>
            <div style={{ background:"rgba(240,201,58,0.12)", border:`2px solid ${G.accent}44`,
              borderRadius:22, padding:"22px 24px", marginBottom:32, maxWidth:340 }}>
              <div style={{ fontFamily:"Georgia, serif", fontSize:20, fontWeight:700,
                color:"#fff", marginBottom:12 }}>A message for you 💛</div>
              <div style={{ fontSize:16, color:"#c8e8c4", lineHeight:1.8 }}>
                Take a breath.<br/>
                This is the condition, not the person.<br/>
                <strong style={{ color:G.accent }}>You are doing a great job.</strong>
              </div>
            </div>
            <button onClick={() => setSosActive(false)} style={{
              background:G.accent, border:"none", borderRadius:18,
              padding:"18px 40px", fontSize:18, fontWeight:700,
              color:G.primaryDark, cursor:"pointer",
            }}>✕  Close SOS</button>
          </div>
        )}

        {/* Portal header */}
        <div style={{ display:"flex", alignItems:"center",
          justifyContent:"space-between", marginBottom:16 }}>
          <div>
            <div style={{ fontFamily:"Georgia, serif", fontSize:22,
              fontWeight:700, color:G.text }}>👨‍👩‍👧 Caregiver Portal</div>
            <div style={{ fontSize:14, color:G.textSoft, marginTop:2 }}>
              Private area for family & carers
            </div>
          </div>
          <button onClick={onClose} style={{
            background:G.border, border:"none", borderRadius:50,
            width:40, height:40, fontSize:18, cursor:"pointer", color:G.text,
          }}>✕</button>
        </div>

        {/* SOS Button — always visible */}
        <button onClick={() => setSosActive(true)} style={{
          width:"100%", background:"#c0453a", border:"none", borderRadius:16,
          padding:"16px 20px", marginBottom:16, cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", gap:12,
          boxShadow:"0 4px 20px rgba(192,69,58,0.4)",
        }}>
          <span style={{ fontSize:28 }}>🆘</span>
          <div style={{ textAlign:"left" }}>
            <div style={{ fontFamily:"Georgia, serif", fontSize:18,
              fontWeight:700, color:"#fff" }}>SOS — Margaret is very agitated</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,0.8)" }}>
              Plays her #1 favourite song instantly
            </div>
          </div>
        </button>

        {/* Tabs */}
        <div style={{ display:"flex", background:"#e4f0e0", borderRadius:14,
          padding:3, marginBottom:20, gap:2 }}>
          {PORTAL_TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex:1, border:"none", borderRadius:11, padding:"10px 4px",
              fontSize:11, fontWeight:700, cursor:"pointer",
              background: tab===t.id ? G.primary : "transparent",
              color: tab===t.id ? "#fff" : G.textSoft, lineHeight:1.3,
            }}>{t.label}</button>
          ))}
        </div>

        {/* ── DAILY GUIDE ── */}
        {tab === "guide" && <Dashboard/>}

        {/* ── SONGS ── */}
        {tab === "songs" && (
          <div>
            <div style={{ fontFamily:"Georgia, serif", fontSize:20, fontWeight:700,
              color:G.text, marginBottom:4 }}>🎵 Margaret's Song Library</div>
            <div style={{ fontSize:14, color:G.textSoft, marginBottom:20, lineHeight:1.5 }}>
              Build her collection toward 16 deeply personal songs — the therapeutic core.
            </div>
            {/* Progress bar */}
            <div style={{ background:G.card, borderRadius:18, padding:"16px 18px",
              border:`2px solid ${G.border}`, marginBottom:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <div style={{ fontFamily:"Georgia, serif", fontSize:16, fontWeight:700, color:G.text }}>Progress</div>
                <div style={{ fontSize:14, fontWeight:700,
                  color:songs.length>=16?"#1a7a6a":G.textSoft }}>{songs.length} / 16 songs</div>
              </div>
              <div style={{ background:G.border, borderRadius:8, height:10, marginBottom:6 }}>
                <div style={{ width:`${Math.min(100,Math.round(songs.length/16*100))}%`,
                  height:"100%", borderRadius:8,
                  background:songs.length>=16?"#1a7a6a":G.accent,
                  transition:"width 0.5s" }}/>
              </div>
              <div style={{ fontSize:13, color:G.textSoft }}>
                {songs.length >= 16
                  ? "✅ Full collection! Margaret has 16 deeply personalised songs."
                  : `Add ${16-songs.length} more songs — 16 songs from her life can reach her even on the hardest days.`}
              </div>
            </div>
            {/* Song list */}
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
              {songs.map((s,i) => (
                <div key={s.id} style={{ background:G.card, borderRadius:16, padding:"14px 16px",
                  border:`2px solid ${G.border}`, display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:28, flexShrink:0 }}>{s.emoji}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:"Georgia, serif", fontSize:16, fontWeight:700,
                      color:G.text, overflow:"hidden", textOverflow:"ellipsis",
                      whiteSpace:"nowrap" }}>{s.title}</div>
                    <div style={{ fontSize:13, color:G.textSoft }}>{s.artist} · {s.year}</div>
                    {s.note && <div style={{ fontSize:12, color:"#8aaa86",
                      fontStyle:"italic", marginTop:2 }}>"{s.note}"</div>}
                  </div>
                  <div style={{ fontSize:12, color:G.textSoft, flexShrink:0 }}>#{i+1}</div>
                </div>
              ))}
            </div>
            {/* Add song form */}
            <div style={{ background:G.card, border:`2px solid ${G.border}`,
              borderRadius:20, padding:"18px 18px" }}>
              <div style={{ fontFamily:"Georgia, serif", fontSize:17, fontWeight:700,
                color:G.text, marginBottom:14 }}>➕ Add a new song</div>
              {[
                { key:"title",  placeholder:"Song title" },
                { key:"artist", placeholder:"Artist name" },
                { key:"note",   placeholder:"Why is this song meaningful? (optional)" },
              ].map(f => (
                <input key={f.key} value={newSong[f.key]}
                  onChange={e => setNewSong(s => ({...s, [f.key]:e.target.value}))}
                  placeholder={f.placeholder}
                  style={{ width:"100%", border:`2px solid ${G.border}`, borderRadius:12,
                    padding:"12px 14px", fontSize:15, marginBottom:10,
                    boxSizing:"border-box", fontFamily:"inherit", outline:"none" }}/>
              ))}
              <button onClick={addSong} style={{
                width:"100%", background:(newSong.title&&newSong.artist)?G.primary:G.border,
                border:"none", borderRadius:14, padding:"14px",
                fontSize:16, fontWeight:700, cursor:"pointer", color:"#fff",
              }}>Save song 💛</button>
            </div>
          </div>
        )}

        {/* ── GREETING ── */}
        {tab === "greeting" && (
          <div>
            <div style={{ fontFamily:"Georgia, serif", fontSize:20, fontWeight:700,
              color:G.text, marginBottom:4 }}>🎙 Record a Greeting</div>
            <div style={{ fontSize:14, color:G.textSoft, marginBottom:20, lineHeight:1.5 }}>
              A familiar voice before music is the most powerful wellbeing trigger in the app. Record a short greeting that plays before Margaret's favourite song.
            </div>
            {/* Suggested phrases */}
            <div style={{ background:"#f5f0ff", border:"2px solid #d8ccf0",
              borderRadius:20, padding:"18px", marginBottom:20 }}>
              <div style={{ fontFamily:"Georgia, serif", fontSize:16, fontWeight:700,
                color:"#4a2a7a", marginBottom:12 }}>Suggested phrases:</div>
              {[
                "Hi Mum, it's me. I love you. Your favourite song is coming right up.",
                "Hello Margaret. You're safe and loved. Let's listen to some music together.",
                "Hi Grandma! I'm thinking about you today. Here's Moon River just for you.",
              ].map((phrase, i) => (
                <div key={i} onClick={() => setGreeting(phrase)} style={{
                  background:"rgba(255,255,255,0.7)", border:"1px solid #d8ccf0",
                  borderRadius:12, padding:"10px 14px", marginBottom:8,
                  fontSize:14, color:"#4a2a7a", fontStyle:"italic",
                  lineHeight:1.5, cursor:"pointer",
                }}>"{phrase}"</div>
              ))}
            </div>
            <div style={{ background:G.card, border:`2px solid ${G.border}`,
              borderRadius:20, padding:"18px" }}>
              <input value={greetingFrom} onChange={e => setGreetingFrom(e.target.value)}
                placeholder="Your name (e.g. Sarah, daughter)"
                style={{ width:"100%", border:`2px solid ${G.border}`, borderRadius:12,
                  padding:"12px 14px", fontSize:15, marginBottom:10,
                  boxSizing:"border-box", fontFamily:"inherit", outline:"none" }}/>
              <textarea value={greeting} onChange={e => setGreeting(e.target.value)}
                placeholder="Write or choose a greeting above…" rows={3}
                style={{ width:"100%", border:`2px solid ${G.border}`, borderRadius:12,
                  padding:"12px 14px", fontSize:15, marginBottom:14,
                  boxSizing:"border-box", fontFamily:"inherit", resize:"none", outline:"none" }}/>
              <button onClick={handleRecord} style={{
                width:"100%", background:recording?"#c0453a":G.primary,
                border:"none", borderRadius:14, padding:"16px",
                fontSize:17, fontWeight:700, cursor:"pointer", color:"#fff",
                display:"flex", alignItems:"center", justifyContent:"center",
                gap:10, marginBottom:12,
              }}>
                {recording
                  ? <><div style={{ width:14,height:14,borderRadius:"50%",background:"#fff",animation:"blink 1s infinite"}}/>  Stop Recording ({recordSecs}s)</>
                  : "🎙️  Record Greeting"}
              </button>
              {savedGreeting && (
                <div style={{ background:"#eaf7ea", border:"2px solid #4a9a4a",
                  borderRadius:14, padding:"14px 16px", fontSize:14, color:"#1a5a1a" }}>
                  ✅ Greeting saved from <strong>{savedGreeting.from}</strong> ({savedGreeting.secs}s)
                </div>
              )}
            </div>
            <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
          </div>
        )}

        {/* ── SUMMARY ── */}
        {tab === "summary" && (
          <div>
            <div style={{ fontFamily:"Georgia, serif", fontSize:20, fontWeight:700,
              color:G.text, marginBottom:4 }}>📋 Care Summary</div>
            <div style={{ fontSize:14, color:G.textSoft, marginBottom:20, lineHeight:1.5 }}>
              Key facts at a glance — for handovers, care home staff and new carers.
            </div>
            {[
              { label:"Name",                  value:"Margaret",                                              icon:"👤" },
              { label:"Born",                  value:"1945 — Reminiscence music: 1960–1970",                  icon:"🎂" },
              { label:"Favourite song",        value:`${MY_SONGS[0].emoji} ${MY_SONGS[0].title} — ${MY_SONGS[0].artist}`, icon:"🎵" },
              { label:"Calming song",          value:`${MY_SONGS[2].emoji} ${MY_SONGS[2].title}`,             icon:"🌊" },
              { label:"Preferred nature sound",value:"🌧️ Gentle Rainfall",                                   icon:"🌿" },
              { label:"Sleep timer default",   value:"30 minutes",                                            icon:"😴" },
              { label:"Red flag songs",        value:"None recorded yet",                                     icon:"🚫" },
              { label:"Tinnitus",              value:"Not flagged",                                           icon:"👂" },
              { label:"Walking pace",          value:"Not yet calibrated",                                    icon:"🚶" },
            ].map((item, i) => (
              <div key={i} style={{ background:G.card, border:`2px solid ${G.border}`,
                borderRadius:16, padding:"14px 16px", marginBottom:10,
                display:"flex", gap:14, alignItems:"center" }}>
                <div style={{ width:40, height:40, borderRadius:12, background:"#e4f0e0",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:20, flexShrink:0 }}>{item.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, color:G.textSoft, fontWeight:700,
                    letterSpacing:0.5, textTransform:"uppercase", marginBottom:2 }}>{item.label}</div>
                  <div style={{ fontSize:15, fontWeight:600, color:G.text }}>{item.value}</div>
                </div>
              </div>
            ))}
            <button style={{
              width:"100%", background:G.primary, border:"none", borderRadius:16,
              padding:"16px", fontSize:16, fontWeight:700, color:"#fff",
              cursor:"pointer", marginTop:10,
              display:"flex", alignItems:"center", justifyContent:"center", gap:10,
            }}>📄 Download as PDF Care Plan</button>
            <div style={{ marginTop:14, background:G.accentLight, borderRadius:16,
              padding:"12px 16px", fontSize:13, color:"#5a5a3a", lineHeight:1.5 }}>
              💡 Share this summary with any new carer or care home staff so they can use the app effectively from day one.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
