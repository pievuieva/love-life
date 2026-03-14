import { useState, useEffect, useRef } from "react";
import { G } from "./design.js";
import { MY_SONGS, INSTRUMENT_ROUNDS } from "./songs.js";
import { DEMO_MESSAGES } from "./prompts.js";
import { BackBtn } from "./WaveAnim.jsx";

// ── TappingExercise ────────────────────────────────────────────────────────────
export function TappingExercise({ onBack }) {
  const [active, setActive]     = useState(false);
  const [pulse, setPulse]       = useState(false);
  const [tapped, setTapped]     = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const bpm = 72;
  const interval = (60 / bpm) * 1000;

  useEffect(() => {
    let t;
    if (active) t = setInterval(() => setPulse(p => !p), interval / 2);
    return () => clearInterval(t);
  }, [active, interval]);

  const handleTap = () => {
    if (!active) return;
    setTapped(true); setTapCount(c => c+1);
    setTimeout(() => setTapped(false), 400);
  };

  return (
    <div>
      <BackBtn onBack={onBack}/>
      <div style={{ background:"#3a7dc018", border:"2px solid #3a7dc044", borderRadius:22,
        padding:"20px", marginBottom:24, textAlign:"center" }}>
        <div style={{ fontSize:36, marginBottom:8 }}>🥁</div>
        <div style={{ fontFamily:"Georgia, serif", fontSize:24, fontWeight:700,
          color:"#1a3a6a", marginBottom:6 }}>Rhythm & Tap</div>
        <div style={{ fontSize:15, color:"#3a5a7a", lineHeight:1.5 }}>
          Tap the circle in time with the beat. Rhythmic tapping stimulates motor and memory regions that music keeps active.
        </div>
      </div>
      <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}>
        <div onClick={handleTap} style={{
          width:200, height:200, borderRadius:"50%",
          background: tapped ? "#3a7dc0" : (pulse && active ? "#2a5d90" : G.primary),
          border:`6px solid ${tapped ? G.accent : "#3a7dc0"}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor: active ? "pointer" : "default",
          transform: (pulse && active) || tapped ? "scale(1.08)" : "scale(1)",
          transition:"transform 0.15s ease, background 0.15s ease",
          boxShadow: tapped ? `0 0 50px rgba(240,201,58,0.6)` : `0 0 30px rgba(58,125,192,0.3)`,
          userSelect:"none",
        }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize:52 }}>{tapped ? "✨" : "🥁"}</div>
            {active && <div style={{ color:"#fff", fontSize:16, fontWeight:700, marginTop:6 }}>TAP!</div>}
          </div>
        </div>
      </div>
      {active && (
        <div style={{ textAlign:"center", marginBottom:16, fontSize:20, color:G.text }}>
          Taps: <strong style={{ color:G.primary, fontSize:24 }}>{tapCount}</strong>
          <div style={{ fontSize:14, color:G.textSoft, marginTop:4 }}>Great rhythm! Keep going. 🎶</div>
        </div>
      )}
      <button onClick={() => { setActive(a => !a); setTapCount(0); }} style={{
        width:"100%", background: active ? "#e4f0e0" : "#3a7dc0", border:"none",
        borderRadius:18, padding:"18px", fontSize:20, fontWeight:700,
        color: active ? G.primaryDark : "#fff", cursor:"pointer",
      }}>{active ? "⏹ Stop" : "▶ Start Rhythm"}</button>
      <div style={{ marginTop:16, background:G.accentLight, borderRadius:16,
        padding:"12px 16px", fontSize:14, color:"#5a5a3a", lineHeight:1.5, textAlign:"center" }}>
        💡 For carers: Try this during the late afternoon. Steady rhythm reduces agitation and helps with focus.
      </div>
    </div>
  );
}

// ── DanceSwayGame ──────────────────────────────────────────────────────────────
export function DanceSwayGame({ onBack }) {
  const [active, setActive]   = useState(false);
  const [sways, setSways]     = useState(0);
  const [beat, setBeat]       = useState(false);
  const beatRef = useRef(null);

  useEffect(() => {
    if (active) {
      beatRef.current = setInterval(() => {
        setBeat(b => !b);
        setSways(s => s + 1);
      }, 1000);
    } else clearInterval(beatRef.current);
    return () => clearInterval(beatRef.current);
  }, [active]);

  return (
    <div>
      <BackBtn onBack={onBack}/>
      <div style={{ background:"#8a1a5a18", border:"2px solid #8a1a5a44", borderRadius:22,
        padding:"18px 20px", marginBottom:20 }}>
        <div style={{ fontSize:34, marginBottom:6 }}>💃</div>
        <div style={{ fontFamily:"Georgia, serif", fontSize:23, fontWeight:700,
          color:"#5a0a3a", marginBottom:4 }}>Dance & Sway</div>
        <div style={{ fontSize:15, color:"#7a1a4a", lineHeight:1.5 }}>
          Move with the music — arms, shoulders, swaying side to side. Upper-body movement to familiar music activates deeply held motor memory.
        </div>
      </div>
      <div style={{ background:active ? "linear-gradient(135deg,#3a0a2a,#1a051a)" : G.primaryDark,
        borderRadius:24, height:260, marginBottom:20,
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        transition:"background 0.5s", position:"relative", overflow:"hidden" }}>
        {active && (
          <>
            {[...Array(5)].map((_,i) => (
              <div key={i} style={{ position:"absolute", fontSize:24, opacity:0.3,
                left:`${10+i*18}%`, top:`${20+i*12}%`,
                animation:`noteFloat ${1+i*0.3}s ease infinite alternate` }}>⭐</div>
            ))}
          </>
        )}
        <div style={{ fontSize:100,
          transform: active ? `translateX(${beat?"-18px":"18px"})` : "none",
          transition:"transform 0.5s ease-in-out" }}>💃</div>
        {active && (
          <div style={{ color:G.accent, fontFamily:"Georgia, serif",
            fontSize:18, fontWeight:700, marginTop:8 }}>
            Sways: {Math.floor(sways/2)} 🌟
          </div>
        )}
      </div>
      <button onClick={() => { setActive(a => !a); setSways(0); }} style={{
        width:"100%", background: active ? "#e4f0e0" : "#8a1a5a",
        border:"none", borderRadius:18, padding:"20px", fontSize:22, fontWeight:700,
        color: active ? G.primaryDark : "#fff", cursor:"pointer",
        fontFamily:"Georgia, serif", marginBottom:14,
      }}>{active ? "⏹ Stop Dancing" : "💃 Start Dancing"}</button>
      <div style={{ background:G.accentLight, borderRadius:16, padding:"12px 16px",
        fontSize:14, color:"#5a5a3a", lineHeight:1.6 }}>
        💡 <strong>For carers:</strong> Upper-body rhythmic movement is safe for those who cannot stand. Even seated swaying activates the same deeply ingrained motor memory circuits.
      </div>
      <style>{`@keyframes noteFloat{from{transform:translateY(0)}to{transform:translateY(-20px)}}`}</style>
    </div>
  );
}

// ── ConductorGame ──────────────────────────────────────────────────────────────
export function ConductorGame({ onBack }) {
  const [active, setActive]       = useState(false);
  const [speed, setSpeed]         = useState(50);
  const [waving, setWaving]       = useState(false);
  const [noteCount, setNoteCount] = useState(0);
  const [floaters, setFloaters]   = useState([]);
  const floatId   = useRef(0);
  const lastMove  = useRef(0);
  const bpmDisplay = Math.round(40 + speed * 0.8);

  const handleWave = e => {
    if (!active) return;
    const now = Date.now();
    if (now - lastMove.current < 80) return;
    lastMove.current = now;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const relY = 1 - (clientY - rect.top) / rect.height;
    setSpeed(Math.max(0, Math.min(100, Math.round(relY * 100))));
    setWaving(true); setTimeout(() => setWaving(false), 200);
    setNoteCount(c => c+1);
    const id = floatId.current++;
    const notes = ["🎵","🎶","♪","♫","🎼"];
    setFloaters(f => [...f, { id, note:notes[Math.floor(Math.random()*notes.length)], x:20+Math.random()*60 }]);
    setTimeout(() => setFloaters(f => f.filter(x => x.id !== id)), 1000);
  };

  const tempoLabel = speed<30?"Slowly and gently…":speed<60?"A lovely steady tempo":speed<85?"Lively and bright!":"What energy! 🎉";

  return (
    <div>
      <BackBtn onBack={onBack}/>
      <div style={{ background:"#2a6a2a18", border:"2px solid #2a6a2a44", borderRadius:22,
        padding:"18px 20px", marginBottom:20 }}>
        <div style={{ fontSize:34, marginBottom:6 }}>🎶</div>
        <div style={{ fontFamily:"Georgia, serif", fontSize:23, fontWeight:700,
          color:"#0a3a0a", marginBottom:4 }}>The Conductor</div>
        <div style={{ fontSize:15, color:"#2a5a2a", lineHeight:1.5 }}>
          You are in charge of the music! Move your hand up and down on the screen to make the music faster or slower.
        </div>
      </div>
      <div onMouseMove={handleWave} onTouchMove={handleWave} style={{
        background: active
          ? `linear-gradient(180deg, #0a2a0a ${100-speed}%, #1a5a1a ${100-speed}%, #2a6a2a 100%)`
          : G.primaryDark,
        borderRadius:24, height:260, marginBottom:20,
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        position:"relative", overflow:"hidden",
        cursor: active ? "ns-resize" : "default",
        border:`3px solid ${active?"#4a9a4a":"transparent"}`,
        userSelect:"none",
      }}>
        {floaters.map(f => (
          <div key={f.id} style={{ position:"absolute", left:`${f.x}%`, bottom:"30%",
            fontSize:28, animation:"noteFloat 1s ease forwards", pointerEvents:"none" }}>{f.note}</div>
        ))}
        <div style={{ fontSize:80,
          transform: active ? `rotate(${waving?-15:15}deg) translateY(${-speed*0.3}px)` : "none",
          transition:"transform 0.2s ease" }}>🎼</div>
        {active && (
          <>
            <div style={{ fontFamily:"Georgia, serif", fontSize:26, fontWeight:700,
              color:"#fff", marginTop:10 }}>{bpmDisplay} BPM</div>
            <div style={{ color:"rgba(255,255,255,0.7)", fontSize:16, marginTop:4 }}>{tempoLabel}</div>
            <div style={{ color:"rgba(255,255,255,0.4)", fontSize:13, marginTop:8 }}>
              Move your hand up = faster · down = slower
            </div>
          </>
        )}
        {!active && (
          <div style={{ color:"rgba(255,255,255,0.5)", fontSize:17, marginTop:12 }}>
            Press Start to conduct!
          </div>
        )}
      </div>
      {active && (
        <div style={{ background:G.card, borderRadius:18, padding:"16px 18px",
          border:`2px solid ${G.border}`, marginBottom:16 }}>
          <div style={{ fontSize:15, color:G.textSoft, marginBottom:8 }}>Or use the slider:</div>
          <input type="range" min={0} max={100} value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            style={{ width:"100%", accentColor:"#2a6a2a", height:10 }}/>
          <div style={{ display:"flex", justifyContent:"space-between",
            fontSize:13, color:G.textSoft, marginTop:4 }}>
            <span>🐢 Slower</span><span>🐇 Faster</span>
          </div>
        </div>
      )}
      {active && noteCount > 0 && (
        <div style={{ textAlign:"center", marginBottom:16,
          fontFamily:"Georgia, serif", fontSize:20, color:"#2a6a2a" }}>
          {noteCount<10?"You're conducting! 🎶":noteCount<30?"Wonderful performance! 🌟":"What a maestro! 🏆"}
        </div>
      )}
      <button onClick={() => { setActive(a => !a); setNoteCount(0); setSpeed(50); }} style={{
        width:"100%", background: active ? "#e4f0e0" : "#2a6a2a",
        border:"none", borderRadius:18, padding:"20px", fontSize:22, fontWeight:700,
        color: active ? G.primaryDark : "#fff", cursor:"pointer",
        fontFamily:"Georgia, serif", marginBottom:14,
      }}>{active ? "⏹ Stop" : "🎶 Start Conducting"}</button>
      <div style={{ background:G.accentLight, borderRadius:16, padding:"12px 16px",
        fontSize:14, color:"#5a5a3a", lineHeight:1.6 }}>
        💡 <strong>For carers:</strong> Giving someone with dementia control — even something as simple as the music tempo — measurably reduces anxiety and restores a sense of dignity and agency.
      </div>
      <style>{`@keyframes noteFloat{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-80px)}}`}</style>
    </div>
  );
}

// ── MessageFromHomeGame ────────────────────────────────────────────────────────
export function MessageFromHomeGame({ onBack }) {
  const [phase, setPhase]       = useState("inbox");
  const [selected, setSelected] = useState(null);
  const [progress, setProgress] = useState(0);
  const [newMsg, setNewMsg]     = useState("");
  const [newFrom, setNewFrom]   = useState("");
  const [messages, setMessages] = useState(DEMO_MESSAGES);
  const [recording, setRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const [showAdd, setShowAdd]   = useState(false);
  const progRef = useRef(null);
  const recRef  = useRef(null);

  const playMessage = msg => {
    setSelected(msg); setPhase("playing"); setProgress(0);
    progRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(progRef.current); setTimeout(() => setPhase("song"), 600); return 100; }
        return p + 1;
      });
    }, 80);
  };

  const handleRecord = () => {
    if (recording) { clearInterval(recRef.current); setRecording(false); }
    else {
      setRecordSecs(0); setRecording(true);
      recRef.current = setInterval(() => {
        setRecordSecs(s => { if (s >= 10) { clearInterval(recRef.current); setRecording(false); return 10; } return s+1; });
      }, 1000);
    }
  };

  const addMessage = () => {
    if (!newFrom.trim() || !newMsg.trim()) return;
    setMessages(m => [{ from:newFrom, emoji:"💛", text:newMsg }, ...m]);
    setNewFrom(""); setNewMsg(""); setShowAdd(false);
  };

  useEffect(() => () => { clearInterval(progRef.current); clearInterval(recRef.current); }, []);

  if (phase === "playing" && selected) return (
    <div style={{ minHeight:"60vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", padding:"24px 0" }}>
      <div style={{ background:G.primaryDark, borderRadius:28, padding:"36px 24px",
        width:"100%", textAlign:"center", marginBottom:24 }}>
        <div style={{ fontSize:18, color:"#a8c8a4", letterSpacing:1, marginBottom:16 }}>
          MESSAGE FROM {selected.from.toUpperCase()}
        </div>
        <div style={{ fontSize:56, marginBottom:16 }}>{selected.emoji}</div>
        <div style={{ fontFamily:"Georgia, serif", fontSize:22, color:"#fff",
          lineHeight:1.7, marginBottom:20, fontStyle:"italic" }}>"{selected.text}"</div>
        <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:8, height:8, marginBottom:8 }}>
          <div style={{ width:`${progress}%`, height:"100%", background:G.accent,
            borderRadius:8, transition:"width 0.08s linear" }}/>
        </div>
        <div style={{ color:"rgba(255,255,255,0.5)", fontSize:14 }}>
          {progress < 100 ? "Playing message…" : "✅ Message played"}
        </div>
      </div>
      {progress >= 100 && (
        <div style={{ textAlign:"center", animation:"popIn 0.4s ease" }}>
          <div style={{ fontSize:18, color:G.text, marginBottom:14, fontFamily:"Georgia, serif" }}>
            Now playing your favourite song 🎵
          </div>
          <div style={{ fontSize:40, marginBottom:6 }}>{MY_SONGS[0].emoji}</div>
          <div style={{ fontFamily:"Georgia, serif", fontSize:22, fontWeight:700, color:G.text }}>
            {MY_SONGS[0].title}
          </div>
          <div style={{ color:G.textSoft, marginBottom:20 }}>{MY_SONGS[0].artist}</div>
          <button onClick={() => { setPhase("inbox"); setSelected(null); }} style={{
            background:G.primary, border:"none", borderRadius:16,
            padding:"14px 32px", fontSize:17, fontWeight:700, color:"#fff", cursor:"pointer",
          }}>← Back to messages</button>
        </div>
      )}
      <style>{`@keyframes popIn{from{transform:scale(0.9);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
    </div>
  );

  return (
    <div>
      <BackBtn onBack={onBack}/>
      <div style={{ background:"#b05a1a18", border:"2px solid #b05a1a44", borderRadius:22,
        padding:"18px 20px", marginBottom:22 }}>
        <div style={{ fontSize:34, marginBottom:6 }}>💌</div>
        <div style={{ fontFamily:"Georgia, serif", fontSize:23, fontWeight:700,
          color:"#6a2a00", marginBottom:4 }}>Message from Home</div>
        <div style={{ fontSize:15, color:"#8a4a20", lineHeight:1.5 }}>
          Your family have left you a voice message. Listen, then your favourite song will play.
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ background:G.card, border:`2px solid ${G.border}`,
            borderRadius:20, padding:"18px 18px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
              <span style={{ fontSize:36 }}>{msg.emoji}</span>
              <div>
                <div style={{ fontFamily:"Georgia, serif", fontSize:18, fontWeight:700, color:G.text }}>
                  {msg.from}
                </div>
                <div style={{ fontSize:13, color:G.textSoft }}>Tap to hear their message</div>
              </div>
            </div>
            <div style={{ fontSize:15, color:G.textSoft, fontStyle:"italic",
              lineHeight:1.5, marginBottom:14, borderLeft:`3px solid ${G.border}`, paddingLeft:12 }}>
              "{msg.text.slice(0,60)}{msg.text.length>60?"…":""}"
            </div>
            <button onClick={() => playMessage(msg)} style={{
              width:"100%", background:"#b05a1a", border:"none", borderRadius:14,
              padding:"14px", fontSize:17, fontWeight:700, color:"#fff", cursor:"pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:10,
            }}><span>▶</span> Play message + favourite song</button>
          </div>
        ))}
      </div>
      <button onClick={() => setShowAdd(s => !s)} style={{
        width:"100%", background:G.bg, border:`2px dashed ${G.border}`,
        borderRadius:18, padding:"16px", fontSize:16, cursor:"pointer",
        color:G.textSoft, fontWeight:600, marginBottom: showAdd ? 12 : 0,
      }}>+ Add a new message from family</button>
      {showAdd && (
        <div style={{ background:G.card, border:`2px solid ${G.border}`,
          borderRadius:20, padding:"18px", marginBottom:16 }}>
          <input value={newFrom} onChange={e => setNewFrom(e.target.value)}
            placeholder="Your name (e.g. Sarah, daughter)"
            style={{ width:"100%", border:`2px solid ${G.border}`, borderRadius:12,
              padding:"12px 14px", fontSize:15, marginBottom:10,
              boxSizing:"border-box", fontFamily:"inherit", outline:"none" }}/>
          <textarea value={newMsg} onChange={e => setNewMsg(e.target.value)}
            placeholder="Write your message here…" rows={3}
            style={{ width:"100%", border:`2px solid ${G.border}`, borderRadius:12,
              padding:"12px 14px", fontSize:15, marginBottom:12,
              boxSizing:"border-box", fontFamily:"inherit", resize:"none", outline:"none" }}/>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={handleRecord} style={{
              flex:1, background:recording?"#c0453a":G.bg,
              border:`2px solid ${recording?"#c0453a":G.border}`,
              borderRadius:12, padding:"12px", fontSize:15, cursor:"pointer",
              color:recording?"#fff":G.textSoft, fontWeight:600,
            }}>{recording?`⏹ Stop (${recordSecs}s)`:"🎙 Record voice"}</button>
            <button onClick={addMessage} style={{
              flex:2, background:(newFrom&&newMsg)?G.primary:G.border,
              border:"none", borderRadius:12, padding:"12px",
              fontSize:15, fontWeight:700, cursor:"pointer", color:"#fff",
            }}>Save message 💛</button>
          </div>
        </div>
      )}
      <div style={{ marginTop:14, background:G.accentLight, borderRadius:16, padding:"12px 16px",
        fontSize:14, color:"#5a5a3a", lineHeight:1.6 }}>
        💡 A familiar voice followed immediately by a favourite song creates the most powerful wellbeing moment the app can deliver. Family members can add messages from anywhere.
      </div>
    </div>
  );
}
