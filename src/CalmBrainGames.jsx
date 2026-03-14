import { useState, useEffect } from "react";
import { G } from "./design.js";
import { MY_SONGS, LYRIC_ROUNDS, LYRICS_LINES, ERA_ICONS, INSTRUMENT_ROUNDS } from "./songs.js";
import { MOOD_CHOICES } from "./prompts.js";
import { BackBtn } from "./WaveAnim.jsx";

// ── KaraokeExercise ────────────────────────────────────────────────────────────
export function KaraokeExercise({ onBack }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [active, setActive]   = useState(false);
  const [charIdx, setCharIdx] = useState(0);
  const line = LYRICS_LINES[lineIdx];

  useState(() => {
    let t;
    if (active) {
      if (charIdx < line.length) t = setTimeout(() => setCharIdx(c => c+1), 80);
      else t = setTimeout(() => { setLineIdx(i => (i+1)%LYRICS_LINES.length); setCharIdx(0); }, 1800);
    }
    return () => clearTimeout(t);
  });

  return (
    <div>
      <BackBtn onBack={onBack}/>
      <div style={{ background:"#c0453a18", border:"2px solid #c0453a44", borderRadius:22,
        padding:"20px", marginBottom:20, textAlign:"center" }}>
        <div style={{ fontSize:36, marginBottom:8 }}>🎤</div>
        <div style={{ fontFamily:"Georgia, serif", fontSize:24, fontWeight:700,
          color:"#8a1a1a", marginBottom:6 }}>Sing Along</div>
        <div style={{ fontSize:15, color:"#7a3a3a", lineHeight:1.5 }}>
          Words highlight as they should be sung. Singing — even humming — keeps language strong.
        </div>
      </div>
      <div style={{ background:G.primaryDark, borderRadius:20, padding:"28px 20px",
        marginBottom:20, textAlign:"center", minHeight:100,
        display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
        <div style={{ color:"#7aaa76", fontSize:14, marginBottom:10 }}>Moon River · Andy Williams</div>
        <div style={{ fontFamily:"Georgia, serif", fontSize:28, fontWeight:700, lineHeight:1.5 }}>
          {active ? (
            <><span style={{ color:"#c0453a" }}>{line.slice(0,charIdx)}</span>
            <span style={{ color:"rgba(255,255,255,0.4)" }}>{line.slice(charIdx)}</span></>
          ) : <span style={{ color:"rgba(255,255,255,0.5)" }}>Press Start to begin</span>}
        </div>
        {active && charIdx >= line.length && (
          <div style={{ color:G.accent, fontSize:18, marginTop:12, fontWeight:700 }}>🎵 Sing it!</div>
        )}
      </div>
      <button onClick={() => { setActive(a => !a); setCharIdx(0); setLineIdx(0); }} style={{
        width:"100%", background: active ? "#e4f0e0" : "#c0453a", border:"none",
        borderRadius:18, padding:"18px", fontSize:20, fontWeight:700,
        color: active ? G.primaryDark : "#fff", cursor:"pointer",
      }}>{active ? "⏹ Stop" : "▶ Start Singing"}</button>
    </div>
  );
}

// ── HummingExercise ────────────────────────────────────────────────────────────
export function HummingExercise({ onBack, onPlay }) {
  const steps = [
    { emoji:"🌬️", title:"Breathe in...",   dur:3000, color:"#4a9e6e" },
    { emoji:"🎵",  title:"Hum quietly...", dur:4000, color:G.primary },
    { emoji:"😌",  title:"Feel it...",     dur:2000, color:"#6a5aad" },
  ];
  const [step, setStep]     = useState(0);
  const [active, setActive] = useState(false);
  const cur = steps[step];

  useState(() => {
    let t;
    if (active) t = setTimeout(() => setStep(s => (s+1)%steps.length), steps[step].dur);
    return () => clearTimeout(t);
  });

  return (
    <div>
      <BackBtn onBack={onBack}/>
      <div style={{ background:"#4a9e6e18", border:"2px solid #4a9e6e44", borderRadius:22,
        padding:"20px", marginBottom:22, textAlign:"center" }}>
        <div style={{ fontSize:36, marginBottom:8 }}>🎵</div>
        <div style={{ fontFamily:"Georgia, serif", fontSize:24, fontWeight:700,
          color:"#1a5a3a", marginBottom:6 }}>Hum Along</div>
        <div style={{ fontSize:15, color:"#3a7a56", lineHeight:1.5 }}>
          No words needed — just follow the breathing guide and hum the melody. Activates the vagus nerve and calms the nervous system.
        </div>
      </div>
      <div style={{ background:cur.color+"18", border:`2px solid ${cur.color}44`,
        borderRadius:24, padding:"40px 20px", marginBottom:20, textAlign:"center",
        transition:"background 0.8s, border-color 0.8s" }}>
        <div style={{ fontSize:72, marginBottom:12,
          animation: active ? "breathe 3s ease-in-out infinite" : "" }}>{cur.emoji}</div>
        <div style={{ fontFamily:"Georgia, serif", fontSize:30, fontWeight:700, color:cur.color }}>
          {active ? cur.title : "Ready to hum?"}
        </div>
      </div>
      <button onClick={() => { setActive(a => !a); setStep(0); }} style={{
        width:"100%", background: active ? "#e4f0e0" : "#4a9e6e",
        border:"none", borderRadius:18, padding:"18px",
        fontSize:20, fontWeight:700, color: active ? G.primaryDark : "#fff",
        cursor:"pointer", marginBottom:12,
      }}>{active ? "⏹ Stop" : "▶ Begin Humming"}</button>
      <button onClick={() => onPlay(MY_SONGS[0])} style={{
        width:"100%", background:G.card, border:`2px solid ${G.primary}`,
        borderRadius:18, padding:"15px", fontSize:17, fontWeight:700,
        cursor:"pointer", color:G.primary,
      }}>🎵 Play a song to hum along to</button>
      <style>{`@keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}`}</style>
    </div>
  );
}

// ── FinishLyricExercise ────────────────────────────────────────────────────────
export function FinishLyricExercise({ onBack }) {
  const [idx, setIdx]           = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore]       = useState({ correct:0, total:0 });
  const [reaction, setReaction] = useState(null);
  const round = LYRIC_ROUNDS[idx];

  const handleReaction = type => {
    setReaction(type);
    setScore(s => ({ correct:s.correct+(type==="yes"?1:0), total:s.total+1 }));
    setTimeout(() => { setReaction(null); setRevealed(false); setIdx(i => (i+1)%LYRIC_ROUNDS.length); }, 1400);
  };

  return (
    <div>
      <BackBtn onBack={onBack}/>
      <div style={{ background:"#1a7a6a18", border:"2px solid #1a7a6a44", borderRadius:22,
        padding:"18px 20px", marginBottom:22 }}>
        <div style={{ fontSize:34, marginBottom:6 }}>🎼</div>
        <div style={{ fontFamily:"Georgia, serif", fontSize:23, fontWeight:700,
          color:"#0a4a3a", marginBottom:4 }}>Finish the Song</div>
        <div style={{ fontSize:15, color:"#2a5a50", lineHeight:1.5 }}>
          Listen to the line, then say or sing the missing word. There are no wrong answers — just enjoy the music.
        </div>
      </div>
      <div style={{ display:"flex", justifyContent:"center", gap:24, marginBottom:20 }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontFamily:"Georgia, serif", fontSize:28, fontWeight:700, color:"#1a7a6a" }}>{score.correct}</div>
          <div style={{ fontSize:13, color:G.textSoft }}>Got it!</div>
        </div>
        <div style={{ width:1, background:G.border }}/>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontFamily:"Georgia, serif", fontSize:28, fontWeight:700, color:G.text }}>{score.total}</div>
          <div style={{ fontSize:13, color:G.textSoft }}>Tried</div>
        </div>
        <div style={{ width:1, background:G.border }}/>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:24 }}>{round.emoji}</div>
          <div style={{ fontSize:13, color:G.textSoft }}>Round {idx+1}/{LYRIC_ROUNDS.length}</div>
        </div>
      </div>
      <div style={{ textAlign:"center", marginBottom:8 }}>
        <div style={{ fontSize:14, color:G.textSoft }}>{round.song} · {round.artist}</div>
      </div>
      <div style={{ background: reaction==="yes"?"#1a7a6a":reaction==="almost"?G.wakeLight:G.primaryDark,
        borderRadius:24, padding:"36px 24px", marginBottom:20, textAlign:"center",
        minHeight:160, display:"flex", flexDirection:"column", alignItems:"center",
        justifyContent:"center", transition:"background 0.3s" }}>
        <div style={{ fontFamily:"Georgia, serif", fontSize:26, fontWeight:700,
          color:"#fff", lineHeight:1.6, marginBottom:16 }}>"{round.line}"</div>
        {!revealed ? (
          <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center",
            background:"rgba(255,255,255,0.15)", border:"3px dashed rgba(255,255,255,0.5)",
            borderRadius:16, minWidth:160, padding:"14px 24px",
            fontFamily:"Georgia, serif", fontSize:32, fontWeight:700,
            color:"rgba(255,255,255,0.4)", letterSpacing:8 }}>_ _ _ _ _</div>
        ) : (
          <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center",
            background:G.accent, borderRadius:16, padding:"14px 28px",
            fontFamily:"Georgia, serif", fontSize:42, fontWeight:700,
            color:G.primaryDark, animation:"popIn 0.3s ease",
            boxShadow:`0 4px 20px rgba(240,201,58,0.5)` }}>{round.answer}</div>
        )}
      </div>
      {revealed && !reaction && (
        <div style={{ marginBottom:16 }}>
          <div style={{ textAlign:"center", fontSize:17, color:G.text,
            marginBottom:12, fontFamily:"Georgia, serif" }}>Did they get it?</div>
          <div style={{ display:"flex", gap:12 }}>
            <button onClick={() => handleReaction("yes")} style={{ flex:1, background:"#1a7a6a",
              border:"none", borderRadius:18, padding:"18px", fontSize:20,
              fontWeight:700, color:"#fff", cursor:"pointer" }}>✅ Yes!</button>
            <button onClick={() => handleReaction("almost")} style={{ flex:1, background:G.wakeLight,
              border:`2px solid ${G.wake}`, borderRadius:18, padding:"18px",
              fontSize:20, fontWeight:700, color:G.wake, cursor:"pointer" }}>💛 Almost</button>
          </div>
        </div>
      )}
      {reaction && (
        <div style={{ textAlign:"center", fontSize:26, fontWeight:700,
          color:reaction==="yes"?"#1a7a6a":G.wake, animation:"popIn 0.3s ease", marginBottom:16 }}>
          {reaction==="yes" ? "🎉 Wonderful!" : "💛 Good try!"}
        </div>
      )}
      {!revealed && (
        <button onClick={() => setRevealed(true)} style={{ width:"100%", background:"#1a7a6a",
          border:"none", borderRadius:18, padding:"20px", fontSize:22, fontWeight:700,
          color:"#fff", cursor:"pointer", marginBottom:12 }}>Reveal the word 👁</button>
      )}
      <button onClick={() => { setRevealed(false); setIdx(i => (i+1)%LYRIC_ROUNDS.length); }} style={{
        width:"100%", background:G.bg, border:`2px solid ${G.border}`,
        borderRadius:16, padding:"14px", fontSize:16, cursor:"pointer", color:G.textSoft,
      }}>Skip to next →</button>
      <div style={{ marginTop:14, background:G.accentLight, borderRadius:16, padding:"12px 16px",
        fontSize:14, color:"#5a5a3a", lineHeight:1.6 }}>
        💡 <strong>For carers:</strong> This uses the "Cloze Procedure" — one of the most reliable ways to activate language. Celebrate every attempt, no matter the result.
      </div>
      <style>{`@keyframes popIn{from{transform:scale(0.7);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}

// ── FamousFacesExercise ────────────────────────────────────────────────────────
export function FamousFacesExercise({ onBack }) {
  const [idx, setIdx]         = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showSongs, setShowSongs] = useState(false);
  const face = ERA_ICONS[idx];
  const next = () => { setIdx(i => (i+1)%ERA_ICONS.length); setFlipped(false); setShowSongs(false); };
  const prev = () => { setIdx(i => (i-1+ERA_ICONS.length)%ERA_ICONS.length); setFlipped(false); setShowSongs(false); };

  return (
    <div>
      <BackBtn onBack={onBack}/>
      <div style={{ background:"#8a4a9a18", border:"2px solid #8a4a9a44", borderRadius:22,
        padding:"18px 20px", marginBottom:22 }}>
        <div style={{ fontSize:34, marginBottom:6 }}>🌟</div>
        <div style={{ fontFamily:"Georgia, serif", fontSize:23, fontWeight:700,
          color:"#4a1a6a", marginBottom:4 }}>Famous Faces</div>
        <div style={{ fontSize:15, color:"#5a2a7a", lineHeight:1.5 }}>
          Recognise faces from the era that shaped you. There are no wrong answers — just wonderful memories.
        </div>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
        <button onClick={prev} style={{ background:G.bg, border:`2px solid ${G.border}`,
          borderRadius:12, padding:"8px 18px", cursor:"pointer",
          fontSize:18, color:G.textSoft }}>‹</button>
        <div style={{ fontSize:14, color:G.textSoft }}>
          {idx+1} of {ERA_ICONS.length}
        </div>
        <button onClick={next} style={{ background:G.bg, border:`2px solid ${G.border}`,
          borderRadius:12, padding:"8px 18px", cursor:"pointer",
          fontSize:18, color:G.textSoft }}>›</button>
      </div>
      <div onClick={() => setFlipped(f => !f)} style={{
        background: flipped ? face.bg : `linear-gradient(135deg, ${G.primary}, ${G.primaryDark})`,
        borderRadius:28, padding:"40px 24px", textAlign:"center",
        marginBottom:20, cursor:"pointer", minHeight:260,
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        transition:"background 0.4s",
        boxShadow:`0 8px 32px rgba(0,0,0,0.2)`,
      }}>
        <div style={{ fontSize:80, marginBottom:16 }}>{face.emoji}</div>
        {!flipped ? (
          <>
            <div style={{ fontFamily:"Georgia, serif", fontSize:28, fontWeight:700,
              color:"#fff", marginBottom:6 }}>Who is this?</div>
            <div style={{ fontSize:14, color:"rgba(255,255,255,0.6)" }}>Tap to reveal</div>
          </>
        ) : (
          <>
            <div style={{ fontFamily:"Georgia, serif", fontSize:30, fontWeight:700,
              color:"#fff", marginBottom:4 }}>{face.name}</div>
            <div style={{ fontSize:14, color:"rgba(255,255,255,0.7)", marginBottom:12 }}>{face.years}</div>
            <div style={{ fontSize:15, color:"rgba(255,255,255,0.85)", lineHeight:1.6,
              maxWidth:280, textAlign:"center" }}>{face.desc}</div>
          </>
        )}
      </div>
      {flipped && (
        <div style={{ background:G.card, borderRadius:18, padding:"16px 18px",
          border:`2px solid ${G.border}`, marginBottom:12 }}>
          <div style={{ fontSize:13, color:G.textSoft, fontWeight:700,
            marginBottom:8, letterSpacing:0.5 }}>FAMOUS SONGS</div>
          {face.songs.map((s, i) => (
            <div key={i} style={{ fontSize:15, color:G.text, padding:"6px 0",
              borderBottom: i < face.songs.length-1 ? `1px solid ${G.border}` : "none" }}>
              🎵 {s}
            </div>
          ))}
        </div>
      )}
      <div style={{ background:G.accentLight, borderRadius:16, padding:"12px 16px",
        fontSize:14, color:"#5a5a3a", lineHeight:1.6 }}>
        💡 <strong>For carers:</strong> A familiar face can trigger an immediate emotional spark — even in advanced stages. Enjoy the memories together, and let them guide the conversation.
      </div>
    </div>
  );
}

// ── MoodPainterGame ────────────────────────────────────────────────────────────
export function MoodPainterGame({ onBack }) {
  const [chosen, setChosen]     = useState(null);
  const [history, setHistory]   = useState([]);
  const [songIdx, setSongIdx]   = useState(0);
  const song = MY_SONGS[songIdx % MY_SONGS.length];

  const handleMood = m => {
    setChosen(m);
    setHistory(h => [{ mood:m, song:song.title }, ...h.slice(0,9)]);
    setTimeout(() => { setChosen(null); setSongIdx(i => i+1); }, 2000);
  };

  return (
    <div>
      <BackBtn onBack={onBack}/>
      <div style={{ background:"#c07a1018", border:"2px solid #c07a1044", borderRadius:22,
        padding:"18px 20px", marginBottom:20 }}>
        <div style={{ fontSize:34, marginBottom:6 }}>🎨</div>
        <div style={{ fontFamily:"Georgia, serif", fontSize:23, fontWeight:700,
          color:"#6a3a00", marginBottom:4 }}>Music Mood</div>
        <div style={{ fontSize:15, color:"#7a4a10", lineHeight:1.5 }}>
          Tell us how the music makes you feel. Every answer is right.
        </div>
      </div>
      <div style={{ background: chosen ? chosen.color+"22" : G.primaryDark,
        borderRadius:24, padding:"28px 20px", marginBottom:20, textAlign:"center",
        minHeight:160, display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center", transition:"background 0.4s" }}>
        {chosen ? (
          <>
            <div style={{ fontSize:64, marginBottom:10, animation:"popIn 0.3s ease" }}>{chosen.emoji}</div>
            <div style={{ fontFamily:"Georgia, serif", fontSize:26, fontWeight:700,
              color:chosen.color, animation:"popIn 0.3s ease" }}>
              {chosen.label}!
            </div>
            <div style={{ fontSize:15, color:G.textSoft, marginTop:6 }}>
              Thank you for sharing. 💛
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize:48, marginBottom:10 }}>{song.emoji}</div>
            <div style={{ fontFamily:"Georgia, serif", fontSize:24, fontWeight:700,
              color:"#fff", marginBottom:4 }}>{song.title}</div>
            <div style={{ color:"#a8c8a4", fontSize:16, marginBottom:16 }}>{song.artist}</div>
            <div style={{ color:"rgba(255,255,255,0.6)", fontSize:16 }}>
              How does this music make you feel?
            </div>
          </>
        )}
      </div>
      {!chosen && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
          {MOOD_CHOICES.map(m => (
            <button key={m.label} onClick={() => handleMood(m)} style={{
              background:G.card, border:`3px solid ${m.color}44`, borderRadius:22,
              padding:"22px 12px", cursor:"pointer",
              display:"flex", flexDirection:"column", alignItems:"center", gap:8,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=m.color; e.currentTarget.style.transform="scale(1.03)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=`${m.color}44`; e.currentTarget.style.transform="scale(1)"; }}>
              <span style={{ fontSize:56 }}>{m.emoji}</span>
              <span style={{ fontFamily:"Georgia, serif", fontSize:20,
                fontWeight:700, color:m.color }}>{m.label}</span>
            </button>
          ))}
        </div>
      )}
      {history.length > 0 && (
        <div style={{ background:G.card, borderRadius:18, padding:"14px 16px",
          border:`2px solid ${G.border}`, marginBottom:16 }}>
          <div style={{ fontSize:14, fontWeight:700, color:G.text, marginBottom:10 }}>
            💡 Today's mood log — for carers & family:
          </div>
          {history.map((h, i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10,
              padding:"6px 0", borderBottom: i < history.length-1 ? `1px solid ${G.border}` : "none" }}>
              <span style={{ fontSize:22 }}>{h.mood.emoji}</span>
              <span style={{ fontSize:15, color:G.text }}>{h.song}</span>
              <span style={{ marginLeft:"auto", fontSize:14, color:G.textSoft }}>{h.mood.label}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ background:G.accentLight, borderRadius:16, padding:"12px 16px",
        fontSize:14, color:"#5a5a3a", lineHeight:1.6 }}>
        💡 <strong>For carers:</strong> This helps people who have lost their words communicate how they feel. The mood log can be shared with family and healthcare professionals.
      </div>
      <style>{`@keyframes popIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}
