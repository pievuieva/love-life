import { useState, useEffect, useRef } from "react";
import { G } from "./design.js";
import { MY_SONGS, ERA_STATIONS } from "./songs.js";
import { NATURE_DETAILS } from "./nature.js";
import { WaveAnim } from "./WaveAnim.jsx";
import { MusicTile } from "./SongCard.jsx";
import { CarerInsights } from "./HomeScreen.jsx";

const TIMER_OPTIONS = [15, 30, 45, 60];
const TARGET = 16;
const TABS = [
  { id:"memories", label:"🎵 Memory Lane" },
  { id:"era",      label:"📻 Era Radio" },
  { id:"nature",   label:"🌿 Nature" },
];

// ── MusicScreen ───────────────────────────────────────────────────────────────
// Three-tab music hub: Memory Lane, Era Radio, Nature Sounds + Sleep Timer.
export default function MusicScreen({ onPlay, songLog }) {
  const [tab, setTab]                   = useState("memories");
  const [playingStation, setPlayingStation] = useState(null);
  const [tuning, setTuning]             = useState(false);
  const [playingNature, setPlayingNature] = useState(null);
  const [sleepTimer, setSleepTimer]     = useState(30);
  const [timerActive, setTimerActive]   = useState(false);
  const [timerSecsLeft, setTimerSecsLeft] = useState(0);
  const [timerDone, setTimerDone]       = useState(false);
  const timerRef = useRef(null);

  const added = MY_SONGS.length;
  const pct   = Math.min(100, Math.round((added / TARGET) * 100));

  const startTimer = mins => {
    clearInterval(timerRef.current);
    setTimerSecsLeft(mins * 60); setTimerActive(true); setTimerDone(false);
  };
  const cancelTimer = () => {
    clearInterval(timerRef.current);
    setTimerActive(false); setTimerSecsLeft(0); setTimerDone(false);
  };
  const fmtTime = secs => `${Math.floor(secs/60)}:${String(secs%60).padStart(2,"0")}`;
  const timerPct = timerActive ? ((sleepTimer * 60 - timerSecsLeft) / (sleepTimer * 60)) * 100 : 0;

  useEffect(() => {
    if (timerActive && timerSecsLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimerSecsLeft(s => {
          if (s <= 1) { clearInterval(timerRef.current); setTimerActive(false); setPlayingNature(null); setTimerDone(true); return 0; }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive]);

  const handleStationPlay = st => {
    setTuning(true);
    setTimeout(() => { setPlayingStation(st.id); setTuning(false); }, 1400);
  };

  return (
    <div>
      {/* Tab strip */}
      <div style={{ display:"flex", background:G.bg, borderRadius:16, padding:3,
        marginBottom:22, border:`2px solid ${G.border}`, gap:2 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex:1, border:"none", borderRadius:12, padding:"11px 4px",
            fontSize:13, fontWeight:700, cursor:"pointer",
            background: tab===t.id ? G.primary : "transparent",
            color: tab===t.id ? "#fff" : G.textSoft, lineHeight:1.2,
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── MEMORY LANE ── */}
      {tab === "memories" && (
        <div>
          {/* Progress toward 16 songs */}
          <div style={{ background:G.card, borderRadius:18, padding:"16px 18px",
            border:`2px solid ${G.border}`, marginBottom:20 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <div style={{ fontFamily:"Georgia, serif", fontSize:16, fontWeight:700, color:G.text }}>
                Memory Lane
              </div>
              <div style={{ fontSize:14, fontWeight:700,
                color: added>=TARGET ? "#1a7a6a" : G.textSoft }}>{added} / {TARGET} songs</div>
            </div>
            <div style={{ background:G.border, borderRadius:8, height:10, marginBottom:6 }}>
              <div style={{ width:`${pct}%`, height:"100%", borderRadius:8,
                background: added>=TARGET ? "#1a7a6a" : G.accent,
                transition:"width 0.5s ease" }}/>
            </div>
            <div style={{ fontSize:13, color:G.textSoft }}>
              {added >= TARGET
                ? "✅ Great! You have a full collection of your most meaningful songs."
                : `Add ${TARGET - added} more songs — 16 of your most meaningful songs can reach you even on the hardest days.`}
            </div>
          </div>

          {/* Song grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
            {MY_SONGS.map(s => (
              <MusicTile key={s.id} song={s} onPlay={onPlay} tags={songLog[s.id]||[]}/>
            ))}
            {MY_SONGS.length < TARGET && (
              <div style={{ background:G.bg, border:`2px dashed ${G.border}`, borderRadius:20,
                aspectRatio:"1", display:"flex", flexDirection:"column",
                alignItems:"center", justifyContent:"center", gap:8,
                cursor:"pointer", color:G.textSoft }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=G.primary; e.currentTarget.style.background="#eaf3e8"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=G.border; e.currentTarget.style.background=G.bg; }}>
                <div style={{ fontSize:36 }}>＋</div>
                <div style={{ fontSize:13, fontWeight:700, textAlign:"center", padding:"0 8px" }}>Add a song</div>
              </div>
            )}
          </div>
          <CarerInsights songLog={songLog}/>
        </div>
      )}

      {/* ── ERA RADIO ── */}
      {tab === "era" && (
        <div>
          <div style={{ background:G.primaryDark, borderRadius:22, padding:"22px 20px",
            marginBottom:20, textAlign:"center", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", inset:0, opacity:0.07,
              backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.5) 2px,rgba(255,255,255,0.5) 3px)",
              backgroundSize:"100% 4px" }}/>
            <div style={{ position:"relative" }}>
              <div style={{ fontSize:44, marginBottom:8 }}>📻</div>
              <div style={{ fontFamily:"Georgia, serif", fontSize:24, fontWeight:700, color:"#fff", marginBottom:6 }}>Era Radio</div>
              <div style={{ fontSize:15, color:"#a8c8a4", lineHeight:1.5 }}>
                Music from your era — the songs that shaped a generation.
              </div>
            </div>
          </div>

          {tuning && (
            <div style={{ background:G.primaryDark, borderRadius:18, padding:"24px",
              marginBottom:16, textAlign:"center" }}>
              <div style={{ color:G.accent, fontFamily:"Georgia, serif", fontSize:20, marginBottom:12 }}>Tuning in…</div>
              <div style={{ display:"flex", justifyContent:"center", gap:4, alignItems:"flex-end", height:40 }}>
                {Array.from({length:20}).map((_,i) => (
                  <div key={i} style={{ width:5, borderRadius:3,
                    background: Math.random()>0.5 ? G.accent : "rgba(255,255,255,0.3)",
                    height: Math.floor(Math.random()*36)+4,
                    animation:`tuneBar ${0.3+Math.random()*0.4}s ease-in-out infinite alternate` }}/>
                ))}
              </div>
            </div>
          )}

          <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
            {ERA_STATIONS.map(st => (
              <div key={st.id} style={{
                background: playingStation===st.id ? `linear-gradient(135deg,${st.color},${st.color}cc)` : G.card,
                border:`2px solid ${playingStation===st.id ? st.color : G.border}`,
                borderRadius:20, padding:"18px 20px", display:"flex", alignItems:"center", gap:16,
                transition:"background 0.3s, border-color 0.3s",
              }}>
                <div style={{ fontSize:42, flexShrink:0 }}>{st.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"Georgia, serif", fontSize:22, fontWeight:700,
                    color: playingStation===st.id ? "#fff" : G.text }}>{st.label}</div>
                  <div style={{ fontSize:13, color: playingStation===st.id ? "rgba(255,255,255,0.7)" : G.textSoft,
                    marginTop:2 }}>{st.desc}</div>
                  {playingStation===st.id && (
                    <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:6 }}>
                      <WaveAnim playing={true} color={G.accent}/>
                      <span style={{ color:G.accent, fontSize:13, fontWeight:700 }}>Playing now</span>
                    </div>
                  )}
                </div>
                <button onClick={() => playingStation===st.id ? setPlayingStation(null) : handleStationPlay(st)}
                  style={{ background: playingStation===st.id ? "rgba(255,255,255,0.2)" : G.primary,
                    border:"none", borderRadius:50, width:52, height:52,
                    color: playingStation===st.id ? "#fff" : G.accent,
                    fontSize:20, cursor:"pointer", flexShrink:0,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {playingStation===st.id ? "⏹" : "▶"}
                </button>
              </div>
            ))}
          </div>

          <button onClick={() => handleStationPlay(ERA_STATIONS[2])} style={{
            width:"100%", background:G.accent, border:"none", borderRadius:20,
            padding:"22px", fontSize:22, fontWeight:700, color:G.primaryDark,
            cursor:"pointer", fontFamily:"Georgia, serif",
            boxShadow:`0 4px 20px rgba(240,201,58,0.35)`, marginBottom:14,
            display:"flex", alignItems:"center", justifyContent:"center", gap:12,
          }}><span>📻</span> Play My Era</button>

          <div style={{ background:G.accentLight, borderRadius:16, padding:"12px 16px",
            fontSize:14, color:"#5a5a3a", lineHeight:1.6 }}>
            💡 <strong>For carers:</strong> Era radio gives a sense of connection to the wider world — reducing the isolation that comes with dementia. It also works as gentle background during mealtimes.
          </div>
        </div>
      )}

      {/* ── NATURE SOUNDS ── */}
      {tab === "nature" && (
        <div>
          <div style={{ fontSize:15, color:G.textSoft, marginBottom:16, lineHeight:1.6,
            background:G.card, borderRadius:16, padding:"14px 16px", border:`2px solid ${G.border}` }}>
            🌿 <strong style={{ color:G.text }}>Sensory Grounding.</strong> Nature sounds reduce sundowning, ease anxiety without medication, and create a calm sensory environment — ideal for evenings, bedtime, and moments of distress.
          </div>

          {/* Sleep Timer */}
          <div style={{
            background: timerDone ? "#1a5a2a" : timerActive ? G.primaryDark : G.card,
            border:`2px solid ${timerActive||timerDone ? "rgba(255,255,255,0.15)" : G.border}`,
            borderRadius:22, padding:"18px 18px 16px", marginBottom:18,
            transition:"background 0.4s",
          }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:26 }}>😴</span>
                <div>
                  <div style={{ fontFamily:"Georgia, serif", fontSize:17, fontWeight:700,
                    color: timerActive||timerDone ? "#fff" : G.text }}>Sleep Timer</div>
                  <div style={{ fontSize:13, color: timerActive ? "#a8c8a4" : timerDone ? "#a8e0a8" : G.textSoft }}>
                    {timerDone ? "✅ Sound stopped automatically"
                      : timerActive ? `Stops in ${fmtTime(timerSecsLeft)}`
                      : "Auto-stop after they fall asleep"}
                  </div>
                </div>
              </div>
              {timerActive && (
                <button onClick={cancelTimer} style={{ background:"rgba(255,255,255,0.15)",
                  border:"none", borderRadius:10, padding:"6px 12px",
                  color:"#fff", fontSize:13, cursor:"pointer", fontWeight:600 }}>Cancel</button>
              )}
            </div>

            {timerActive && (
              <div style={{ marginBottom:14 }}>
                <div style={{ background:"rgba(255,255,255,0.1)", borderRadius:8, height:8, marginBottom:6 }}>
                  <div style={{ width:`${timerPct}%`, height:"100%",
                    background:`linear-gradient(90deg, ${G.accent}, #a8e0a8)`,
                    borderRadius:8, transition:"width 1s linear" }}/>
                </div>
                <div style={{ textAlign:"center", fontFamily:"Georgia, serif", fontSize:32,
                  fontWeight:700, color:G.accent, letterSpacing:2 }}>
                  {fmtTime(timerSecsLeft)}
                </div>
              </div>
            )}

            {!timerActive && !timerDone && (
              <>
                <div style={{ fontSize:13, color:G.textSoft, marginBottom:8 }}>Set duration:</div>
                <div style={{ display:"flex", gap:8, marginBottom:12 }}>
                  {TIMER_OPTIONS.map(mins => (
                    <button key={mins} onClick={() => setSleepTimer(mins)} style={{
                      flex:1, background: sleepTimer===mins ? G.primary : G.bg,
                      border:`2px solid ${sleepTimer===mins ? G.primary : G.border}`,
                      borderRadius:12, padding:"10px 4px", cursor:"pointer",
                      fontSize:14, fontWeight:700,
                      color: sleepTimer===mins ? "#fff" : G.textSoft,
                    }}>{mins}m</button>
                  ))}
                </div>
                <button onClick={() => { if (playingNature) startTimer(sleepTimer); }} style={{
                  width:"100%", background: playingNature ? G.accent : G.border,
                  border:"none", borderRadius:14, padding:"13px",
                  fontSize:16, fontWeight:700, cursor: playingNature ? "pointer" : "default",
                  color: playingNature ? G.primaryDark : "#aaa",
                }}>
                  {playingNature ? `⏱ Start ${sleepTimer}-min timer` : "Play a sound first, then set timer"}
                </button>
              </>
            )}

            {timerDone && (
              <button onClick={() => setTimerDone(false)} style={{
                width:"100%", background:"rgba(255,255,255,0.15)", border:"none",
                borderRadius:14, padding:"12px", fontSize:15, fontWeight:700,
                color:"#fff", cursor:"pointer", marginTop:4,
              }}>Set another timer</button>
            )}
          </div>

          {/* Nature sound cards */}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {NATURE_DETAILS.map(ns => {
              const isPlaying = playingNature === ns.id;
              return (
                <div key={ns.id} style={{
                  background: isPlaying ? ns.bg : G.card,
                  border:`2px solid ${isPlaying ? "rgba(255,255,255,0.2)" : G.border}`,
                  borderRadius:22, overflow:"hidden",
                  transition:"background 0.4s, border-color 0.3s",
                }}>
                  <div style={{ padding:"18px 18px 14px", display:"flex", alignItems:"center", gap:14 }}>
                    <div style={{ width:64, height:64, borderRadius:16, flexShrink:0,
                      background: isPlaying ? "rgba(255,255,255,0.15)" : G.bg,
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:34 }}>
                      {ns.emoji}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:"Georgia, serif", fontSize:20, fontWeight:700,
                        color: isPlaying ? "#fff" : G.text }}>{ns.label}</div>
                      <div style={{ fontSize:14, color: isPlaying ? ns.textColor : G.textSoft, marginTop:2 }}>
                        {ns.desc}
                      </div>
                      {isPlaying && (
                        <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:6 }}>
                          <WaveAnim playing={true} color={ns.textColor}/>
                          <span style={{ fontSize:13, fontWeight:700, color:ns.textColor }}>
                            {timerActive ? `Stops in ${fmtTime(timerSecsLeft)}` : "Looping now"}
                          </span>
                        </div>
                      )}
                    </div>
                    <button onClick={() => {
                      if (isPlaying) { setPlayingNature(null); cancelTimer(); }
                      else setPlayingNature(ns.id);
                    }} style={{
                      background: isPlaying ? "rgba(255,255,255,0.2)" : G.primary,
                      border:"none", borderRadius:50, width:54, height:54,
                      color: isPlaying ? "#fff" : G.accent, fontSize:20, cursor:"pointer", flexShrink:0,
                      display:"flex", alignItems:"center", justifyContent:"center",
                    }}>{isPlaying ? "⏹" : "▶"}</button>
                  </div>
                  {isPlaying && (
                    <div style={{ background:"rgba(255,255,255,0.1)",
                      borderTop:"1px solid rgba(255,255,255,0.15)",
                      padding:"10px 18px", fontSize:13, color:"rgba(255,255,255,0.8)", lineHeight:1.5 }}>
                      💡 {ns.why}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop:16, background:G.accentLight, borderRadius:16,
            padding:"12px 16px", fontSize:14, color:"#5a5a3a", lineHeight:1.6 }}>
            💡 <strong>Sundowning tip:</strong> Start Crackling Fire or Summer Evening at 4–5pm, before agitation begins. Prevention works better than intervention.
          </div>
        </div>
      )}
    </div>
  );
}
