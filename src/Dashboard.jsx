import { useState, useEffect, useRef } from "react";
import { G } from "./design.js";
import { MY_SONGS } from "./songs.js";
import RitualPlaylistPlayer from "./RitualPlaylistPlayer.jsx";

// ── Breathing steps for 5-Minute Reset ───────────────────────────────────────
const BREATH_STEPS = [
  { label:"Breathe in slowly…",  dur:4000, color:"#3a7dc0", bg:"#eef3fc", icon:"🌬️" },
  { label:"Hold gently…",        dur:2000, color:"#6a4a9a", bg:"#f0ebff", icon:"🤲" },
  { label:"Breathe out slowly…", dur:6000, color:"#3d6b35", bg:"#f0f7ee", icon:"😮‍💨" },
  { label:"Hold gently…",        dur:2000, color:"#6a4a9a", bg:"#f0ebff", icon:"🤲" },
];

// ── Daily rituals ─────────────────────────────────────────────────────────────
const RITUALS = [
  {
    emoji:"🧼", situation:"Bathing",    ritual:"Bath Time",
    music:"Upbeat & Familiar", bpm:"100–120 BPM",
    color:"#1a5a7a", bg:"#eef6fc",
    why:"Distracts from the scary sensory experience of water. Upbeat tempo shifts focus from fear to rhythm.",
    songs: MY_SONGS.filter(s => s.year >= 1960 && s.year <= 1970).slice(0,2),
  },
  {
    emoji:"👕", situation:"Dressing",   ritual:"Getting Ready",
    music:"Strong 4/4 Beat", bpm:"80–100 BPM",
    color:"#8a5a00", bg:"#fff8ec",
    why:"Rhythmic cues help the brain sequence tasks — procedural memory is activated by beat.",
    songs: MY_SONGS.filter(s => s.year >= 1955 && s.year <= 1969).slice(0,2),
  },
  {
    emoji:"🍲", situation:"Mealtime",   ritual:"Mealtime",
    music:"Soft Instrumental", bpm:"60–75 BPM",
    color:"#2a6a3a", bg:"#eef7ee",
    why:"No lyrics — the brain can't eat, chew and follow words simultaneously. Soft melody aids swallowing.",
    songs: [MY_SONGS[0], MY_SONGS[2]],
  },
  {
    emoji:"🚪", situation:"Sundowning", ritual:"Night Journey",
    music:"Ambient Travel Sounds", bpm:"60 BPM",
    color:"#2a2a6a", bg:"#eeeeff",
    why:"Satisfies the 'I need to go home' urge safely. Travel sounds ground a sense of movement and purpose.",
    songs: [MY_SONGS[0], MY_SONGS[5]],
  },
];

// ── Event types for Transition Planner ───────────────────────────────────────
const EVENT_TYPES = [
  { id:"medication",  label:"Medication",  emoji:"💊", ritual: RITUALS[1] },
  { id:"appointment", label:"Appointment", emoji:"🏥", ritual: RITUALS[0] },
  { id:"bath",        label:"Bath / Wash", emoji:"🧼", ritual: RITUALS[0] },
  { id:"meal",        label:"Meal",        emoji:"🍽️", ritual: RITUALS[2] },
  { id:"visitor",     label:"Visitor",     emoji:"🤝", ritual: RITUALS[1] },
  { id:"bedtime",     label:"Bedtime",     emoji:"🌙", ritual: RITUALS[3] },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function parseTimeToday(timeStr) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}
function minsUntil(date) {
  if (!date) return null;
  return Math.round((date - Date.now()) / 60000);
}

// ── Dashboard V2 — Carer-First ────────────────────────────────────────────────
export default function Dashboard() {
  const [activeRitual, setActiveRitual]     = useState(null);
  const [resetActive, setResetActive]       = useState(false);
  const [resetStep, setResetStep]           = useState(0);
  const resetRef = useRef(null);

  // Transition Planner
  const [events, setEvents]                 = useState([]);
  const [newType, setNewType]               = useState(EVENT_TYPES[0]);
  const [newTime, setNewTime]               = useState("");
  const [plannerOpen, setPlannerOpen]       = useState(false);

  // Nudge state — recalculated every 30 s
  const [nudges, setNudges]                 = useState([]);
  const [dismissedNudges, setDismissedNudges] = useState(new Set());

  useEffect(() => {
    const evaluate = () => {
      setNudges(events.filter(ev => {
        const t = parseTimeToday(ev.time);
        if (!t) return false;
        const mins = Math.round((t - Date.now()) / 60000);
        return mins >= 0 && mins <= 30;
      }));
    };
    evaluate();
    const tick = setInterval(evaluate, 30000);
    return () => clearInterval(tick);
  }, [events]);

  // 5-Minute Reset cycle
  const startReset = () => { setResetActive(true); setResetStep(0); };
  const stopReset  = () => { setResetActive(false); setResetStep(0); clearTimeout(resetRef.current); };

  useEffect(() => {
    if (!resetActive) return;
    resetRef.current = setTimeout(() => {
      setResetStep(s => (s + 1) % BREATH_STEPS.length);
    }, BREATH_STEPS[resetStep].dur);
    return () => clearTimeout(resetRef.current);
  }, [resetActive, resetStep]);

  useEffect(() => () => clearTimeout(resetRef.current), []);

  const curBreath = BREATH_STEPS[resetStep];

  const addEvent = () => {
    if (!newTime) return;
    setEvents(prev => [...prev, {
      id: Date.now(), type: newType.id, label: newType.label,
      emoji: newType.emoji, time: newTime, ritual: newType.ritual,
    }]);
    setNewTime("");
    setPlannerOpen(false);
  };

  const removeEvent = id => setEvents(prev => prev.filter(e => e.id !== id));
  const visibleNudges = nudges.filter(n => !dismissedNudges.has(n.id));

  return (
    <div>
      {activeRitual && (
        <RitualPlaylistPlayer ritual={activeRitual} onClose={() => setActiveRitual(null)}/>
      )}

      {/* Header */}
      <div style={{ fontFamily:"Georgia, serif", fontSize:20, fontWeight:700,
        color:G.text, marginBottom:4 }}>Your Daily Co-Pilot 🧭</div>
      <div style={{ fontSize:14, color:G.textSoft, marginBottom:22, lineHeight:1.6 }}>
        You are Margaret's guide today. Here is everything you need — moment by moment.
        You've got this. 💛
      </div>

      {/* ── NUDGE CARDS ── */}
      {visibleNudges.map(nudge => {
        const mins = minsUntil(parseTimeToday(nudge.time));
        return (
          <div key={nudge.id} style={{
            background:"linear-gradient(135deg,#2b1a00,#4a3000)",
            border:`2px solid ${G.accent}`,
            borderRadius:20, padding:"18px 18px 14px", marginBottom:16,
            boxShadow:`0 4px 24px rgba(240,201,58,0.25)`,
            animation:"fadeIn 0.4s ease",
          }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
              <div style={{ fontSize:36, flexShrink:0, lineHeight:1 }}>{nudge.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, color:G.accent, fontWeight:700,
                  letterSpacing:1.5, textTransform:"uppercase", marginBottom:3 }}>
                  ⏰ Coming up in {mins} minute{mins !== 1 ? "s" : ""}
                </div>
                <div style={{ fontFamily:"Georgia, serif", fontSize:18,
                  fontWeight:700, color:"#fff", marginBottom:6 }}>
                  Margaret has {nudge.label} at {nudge.time}
                </div>
                <div style={{ fontSize:14, color:"rgba(255,255,255,0.75)",
                  lineHeight:1.6, marginBottom:12 }}>
                  Should we start the{" "}
                  <strong style={{ color:G.accent }}>"{nudge.ritual.ritual}"</strong>{" "}
                  Calm Ritual now? Starting 10 minutes early makes a real difference.
                </div>
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={() => setActiveRitual(nudge.ritual)} style={{
                    flex:1, background:G.accent, border:"none", borderRadius:12,
                    padding:"11px 0", fontSize:14, fontWeight:700,
                    color:G.primaryDark, cursor:"pointer",
                  }}>▶ Yes, Start Ritual</button>
                  <button onClick={() => setDismissedNudges(s => new Set([...s, nudge.id]))} style={{
                    background:"rgba(255,255,255,0.1)",
                    border:"1px solid rgba(255,255,255,0.25)",
                    borderRadius:12, padding:"11px 14px", fontSize:14,
                    color:"rgba(255,255,255,0.7)", cursor:"pointer",
                  }}>Not now</button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* ── PART 1: Time of Day ── */}
      <SectionDivider color={G.primaryDark} textColor={G.accent} label="🕒 PART 1 — TIME OF DAY"/>
      {[
        { time:"☀️ Morning",   label:"Wake Up & Connect",  color:"#c07a10", bg:"#fff4e0", icon:"🧩",
          where:"Music Games → Famous Faces",
          why:"Morning clarity is highest. Use this window for Brain Play — recognition and speech." },
        { time:"🚶 Afternoon", label:"Active Energy",      color:"#8a1a5a", bg:"#fdf0f8", icon:"💃",
          where:"Music Games → Rhythm Walk",
          why:"Burn off restlessness now. Afternoon movement prevents sundowning later." },
        { time:"🌆 Evening",   label:"The Golden Hour",    color:"#3d6b35", bg:"#f0f7ee", icon:"🎵",
          where:"Music → Memory Lane — no games",
          why:"Familiarity is a security blanket as confusion rises. Stick to the Personal 16." },
        { time:"🌙 Night",     label:"Wind Down",          color:"#1a3a6a", bg:"#eef3fc", icon:"😴",
          where:"Music → Nature Sounds + 30-min Sleep Timer",
          why:"No lyrics, no voices. A sensory cocoon. Remove all stimulation." },
      ].map((item, i) => (
        <div key={i} style={{ background:item.bg, border:`2px solid ${item.color}33`,
          borderRadius:18, padding:"14px 16px", marginBottom:12,
          display:"flex", gap:14, alignItems:"flex-start" }}>
          <div style={{ width:48, height:48, borderRadius:14, flexShrink:0,
            background:item.color+"22", display:"flex",
            alignItems:"center", justifyContent:"center", fontSize:22 }}>{item.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:item.color, fontWeight:700,
              letterSpacing:1, textTransform:"uppercase", marginBottom:2 }}>{item.time}</div>
            <div style={{ fontFamily:"Georgia, serif", fontSize:17,
              fontWeight:700, color:G.text, marginBottom:6 }}>{item.label}</div>
            <div style={{ background:"rgba(255,255,255,0.85)", borderRadius:10,
              padding:"8px 12px", marginBottom:6, border:`1px solid ${item.color}22` }}>
              <div style={{ fontSize:11, color:item.color, fontWeight:700,
                marginBottom:2, letterSpacing:0.5 }}>WHAT TO PRESS</div>
              <div style={{ fontSize:14, color:G.text, fontWeight:600 }}>{item.where}</div>
            </div>
            <div style={{ fontSize:12, color:G.textSoft, lineHeight:1.6,
              borderLeft:`3px solid ${item.color}`, paddingLeft:8 }}>{item.why}</div>
          </div>
        </div>
      ))}

      {/* ── PART 2: Daily Rituals ── */}
      <SectionDivider color="#5a3a8a" label="🛀 PART 2 — DAILY RITUALS"/>
      <div style={{ background:"#f5f0ff", border:"2px solid #d8ccf0", borderRadius:18,
        padding:"14px 16px", marginBottom:16, fontSize:14, color:"#4a2a7a", lineHeight:1.6 }}>
        These are <strong>task-based transitions</strong> — the "danger zones" for agitation in dementia care.
        The right music, matched to the moment, makes the task feel safe and familiar.
      </div>
      {RITUALS.map((item, i) => (
        <div key={i} style={{ background:item.bg, border:`2px solid ${item.color}33`,
          borderRadius:18, padding:"14px 16px", marginBottom:12 }}>
          <div style={{ display:"flex", gap:12, alignItems:"flex-start", marginBottom:10 }}>
            <div style={{ width:50, height:50, borderRadius:14, flexShrink:0,
              background:item.color+"18", display:"flex",
              alignItems:"center", justifyContent:"center", fontSize:26 }}>{item.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, color:item.color, fontWeight:700,
                letterSpacing:1, textTransform:"uppercase", marginBottom:2 }}>
                SITUATION: {item.situation}</div>
              <div style={{ fontFamily:"Georgia, serif", fontSize:17,
                fontWeight:700, color:G.text }}>"{item.ritual}"</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8, marginBottom:10 }}>
            <div style={{ background:"rgba(255,255,255,0.9)", borderRadius:10,
              padding:"7px 12px", border:`1px solid ${item.color}22`, flex:1 }}>
              <div style={{ fontSize:10, color:item.color, fontWeight:700, letterSpacing:0.5 }}>MUSIC TYPE</div>
              <div style={{ fontSize:13, fontWeight:700, color:G.text }}>{item.music}</div>
            </div>
            <div style={{ background:"rgba(255,255,255,0.9)", borderRadius:10,
              padding:"7px 12px", border:`1px solid ${item.color}22` }}>
              <div style={{ fontSize:10, color:item.color, fontWeight:700, letterSpacing:0.5 }}>BPM</div>
              <div style={{ fontSize:13, fontWeight:700, color:G.text }}>{item.bpm}</div>
            </div>
          </div>
          {item.songs.length > 0 && (
            <div style={{ background:"rgba(255,255,255,0.7)", borderRadius:10,
              padding:"8px 12px", marginBottom:8, border:`1px solid ${item.color}22` }}>
              <div style={{ fontSize:10, color:item.color, fontWeight:700,
                letterSpacing:0.5, marginBottom:5 }}>FROM MARGARET'S LIBRARY</div>
              {item.songs.map((s, si) => (
                <div key={si} style={{ display:"flex", alignItems:"center", gap:8,
                  paddingTop: si > 0 ? 4 : 0 }}>
                  <span style={{ fontSize:16 }}>{s.emoji}</span>
                  <span style={{ fontSize:13, color:G.text, fontWeight:600 }}>{s.title}</span>
                  <span style={{ fontSize:12, color:G.textSoft }}>· {s.artist}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ fontSize:12, color:G.textSoft, lineHeight:1.6,
            borderLeft:`3px solid ${item.color}`, paddingLeft:8, marginBottom:12 }}>{item.why}</div>
          <button onClick={() => setActiveRitual(item)} style={{
            width:"100%", background:item.color, border:"none",
            borderRadius:14, padding:"13px 16px",
            display:"flex", alignItems:"center", justifyContent:"center",
            gap:10, cursor:"pointer", boxShadow:`0 3px 14px ${item.color}44`,
          }}>
            <span style={{ fontSize:18 }}>▶</span>
            <span style={{ fontFamily:"Georgia, serif", fontSize:15,
              fontWeight:700, color:"#fff" }}>Start 30-min Playlist</span>
            <span style={{ fontSize:13, color:"rgba(255,255,255,0.7)", marginLeft:"auto" }}>
              {Math.min(9, MY_SONGS.length)} songs · ~30 min
            </span>
          </button>
        </div>
      ))}

      {/* ── PART 3: Transition Planner ── */}
      <SectionDivider color="#8a1a5a" textColor="#fff" label="📅 PART 3 — TRANSITION PLANNER"/>
      <div style={{ background:"#fdf0f8", border:"2px solid #e8c0d8", borderRadius:18,
        padding:"14px 16px", marginBottom:16, fontSize:14, color:"#5a1a3a", lineHeight:1.6 }}>
        Add Margaret's medications, appointments, or daily routines below.
        We'll remind you <strong>30 minutes before</strong> to start a Calm Ritual —
        so the transition feels smooth, not sudden.
      </div>

      {events.length > 0 && (
        <div style={{ marginBottom:14 }}>
          {events.map(ev => {
            const mins = minsUntil(parseTimeToday(ev.time));
            const isPast = mins !== null && mins < 0;
            const isSoon = mins !== null && mins >= 0 && mins <= 30;
            return (
              <div key={ev.id} style={{
                background: isSoon ? "#fff9e8" : isPast ? "#f5f5f5" : G.card,
                border:`2px solid ${isSoon ? G.accent : G.border}`,
                borderRadius:16, padding:"12px 14px", marginBottom:8,
                display:"flex", alignItems:"center", gap:12,
                opacity: isPast ? 0.55 : 1,
              }}>
                <span style={{ fontSize:26, flexShrink:0 }}>{ev.emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"Georgia, serif", fontSize:15,
                    fontWeight:700, color:G.text }}>{ev.label}</div>
                  <div style={{ fontSize:13, color:G.textSoft }}>
                    {ev.time}
                    {isSoon && <span style={{ color:"#c07a10", fontWeight:700,
                      marginLeft:8 }}>· in {mins} min</span>}
                    {isPast && <span style={{ marginLeft:8 }}>· passed</span>}
                  </div>
                </div>
                <button onClick={() => removeEvent(ev.id)} style={{
                  background:"transparent", border:"none", fontSize:18,
                  cursor:"pointer", color:G.textSoft, padding:"4px 8px",
                }}>×</button>
              </div>
            );
          })}
        </div>
      )}

      {!plannerOpen ? (
        <button onClick={() => setPlannerOpen(true)} style={{
          width:"100%", background:G.card, border:`2px dashed ${G.border}`,
          borderRadius:16, padding:"14px", fontSize:15, fontWeight:600,
          color:G.textSoft, cursor:"pointer", marginBottom:16,
          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
        }}>
          <span style={{ fontSize:20 }}>＋</span> Add event or medication time
        </button>
      ) : (
        <div style={{ background:G.card, border:`2px solid ${G.border}`,
          borderRadius:20, padding:"18px", marginBottom:16 }}>
          <div style={{ fontFamily:"Georgia, serif", fontSize:16, fontWeight:700,
            color:G.text, marginBottom:14 }}>Add a new event</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:14 }}>
            {EVENT_TYPES.map(et => (
              <button key={et.id} onClick={() => setNewType(et)} style={{
                border:`2px solid ${newType.id === et.id ? G.primary : G.border}`,
                background: newType.id === et.id ? "#e4f0e0" : G.card,
                borderRadius:12, padding:"8px 12px", fontSize:13, fontWeight:600,
                cursor:"pointer", color: newType.id === et.id ? G.primary : G.textSoft,
                display:"flex", alignItems:"center", gap:6,
              }}>
                <span>{et.emoji}</span>{et.label}
              </button>
            ))}
          </div>
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:12, color:G.textSoft, fontWeight:700,
              letterSpacing:0.5, marginBottom:6 }}>TIME</div>
            <input type="time" value={newTime}
              onChange={e => setNewTime(e.target.value)}
              style={{ width:"100%", border:`2px solid ${G.border}`, borderRadius:12,
                padding:"12px 14px", fontSize:16, fontFamily:"inherit",
                boxSizing:"border-box", outline:"none", color:G.text, background:G.bg }}
            />
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={addEvent} style={{
              flex:1, background: newTime ? G.primary : G.border,
              border:"none", borderRadius:14, padding:"13px",
              fontSize:15, fontWeight:700, color:"#fff",
              cursor: newTime ? "pointer" : "default",
            }}>Save Event 💛</button>
            <button onClick={() => setPlannerOpen(false)} style={{
              background:G.card, border:`2px solid ${G.border}`,
              borderRadius:14, padding:"13px 18px",
              fontSize:15, color:G.textSoft, cursor:"pointer",
            }}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── PART 4: Support for You ── */}
      <SectionDivider color="#c0453a" label="💖 PART 4 — SUPPORT FOR YOU"/>
      <div style={{ background:"#fff0f0", border:"2px solid #f0cccc", borderRadius:18,
        padding:"14px 16px", marginBottom:16, fontSize:14, color:"#6a1a1a", lineHeight:1.6 }}>
        You can't pour from an empty cup. These tools are built for <strong>you</strong>.
        Your wellbeing matters deeply — and so does the care you give.
      </div>

      {/* 5-Minute Reset */}
      <div style={{
        background: resetActive ? curBreath.bg : G.card,
        border:`2px solid ${resetActive ? curBreath.color + "66" : G.border}`,
        borderRadius:20, padding:"18px", marginBottom:14,
        transition:"background 0.8s, border-color 0.5s",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12,
          marginBottom: resetActive ? 16 : 12 }}>
          <div style={{ width:48, height:48, borderRadius:14, flexShrink:0,
            background: resetActive ? curBreath.color + "22" : "#f0ebff",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:26, transition:"background 0.5s" }}>
            {resetActive ? curBreath.icon : "🫁"}
          </div>
          <div>
            <div style={{ fontFamily:"Georgia, serif", fontSize:17,
              fontWeight:700, color:G.text }}>The 5-Minute Reset</div>
            <div style={{ fontSize:13, color:G.textSoft, marginTop:2 }}>
              A guided breathing exercise — just for you.
            </div>
          </div>
        </div>
        {resetActive && (
          <div style={{ textAlign:"center", marginBottom:16 }}>
            <div style={{ fontFamily:"Georgia, serif", fontSize:26, fontWeight:700,
              color:curBreath.color, marginBottom:4, transition:"color 0.5s" }}>
              {curBreath.label}
            </div>
            <div style={{ display:"flex", justifyContent:"center", gap:6 }}>
              {BREATH_STEPS.map((_, bi) => (
                <div key={bi} style={{
                  width: bi === resetStep ? 24 : 8, height:8, borderRadius:4,
                  background: bi === resetStep ? curBreath.color : G.border,
                  transition:"width 0.3s, background 0.3s",
                }}/>
              ))}
            </div>
          </div>
        )}
        <button onClick={resetActive ? stopReset : startReset} style={{
          width:"100%", background: resetActive ? "#fdf0f8" : "#8a6abd",
          border:"none", borderRadius:14, padding:"14px",
          fontSize:16, fontWeight:700, cursor:"pointer",
          color: resetActive ? "#8a1a5a" : "#fff",
        }}>
          {resetActive ? "⏹ Stop" : "💜 Start 5-Minute Reset"}
        </button>
      </div>

      {/* 3 Quick Reminders */}
      <div style={{ background:G.primaryDark, borderRadius:20, padding:"18px", marginBottom:16 }}>
        <div style={{ fontFamily:"Georgia, serif", fontSize:16, fontWeight:700,
          color:G.accent, marginBottom:14 }}>💡 3 Quick Reminders</div>
        {[
          { n:"1", title:"Don't Correct",
            tip:"If she calls Elvis 'Frank Sinatra', let it go. Joy over accuracy — always." },
          { n:"2", title:"Watch the Volume",
            tip:"Start low and adjust slowly. Sudden loud sounds startle and disorient." },
          { n:"3", title:"Overstimulation Signs",
            tip:"Rubbing forehead, looking away, tension — stop immediately, switch to Rain sounds." },
        ].map(tip => (
          <div key={tip.n} style={{ display:"flex", gap:12,
            marginBottom:12, alignItems:"flex-start" }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:G.primary,
              flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:13, fontWeight:700, color:"#fff" }}>{tip.n}</div>
            <div>
              <div style={{ fontFamily:"Georgia, serif", fontSize:16,
                fontWeight:700, color:"#fff", marginBottom:2 }}>{tip.title}</div>
              <div style={{ fontSize:14, color:"rgba(255,255,255,0.75)",
                lineHeight:1.5 }}>{tip.tip}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SectionDivider ────────────────────────────────────────────────────────────
function SectionDivider({ color, textColor, label }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, margin:"24px 0 14px" }}>
      <div style={{ height:2, flex:1, background:G.border }}/>
      <div style={{ background:color, borderRadius:20, padding:"5px 14px",
        fontSize:12, fontWeight:700, color: textColor || "#fff",
        letterSpacing:1, whiteSpace:"nowrap" }}>{label}</div>
      <div style={{ height:2, flex:1, background:G.border }}/>
    </div>
  );
}
