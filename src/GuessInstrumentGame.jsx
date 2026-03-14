import { useState } from "react";
import { G } from "./design.js";
import { INSTRUMENT_ROUNDS } from "./songs.js";
import { BackBtn } from "./WaveAnim.jsx";

// ── GuessInstrumentGame ───────────────────────────────────────────────────────
// Timbre Recognition — pick which instrument you can hear.
export default function GuessInstrumentGame({ onBack }) {
  const [idx, setIdx]         = useState(0);
  const [chosen, setChosen]   = useState(null);
  const [score, setScore]     = useState({ correct:0, total:0 });
  const round = INSTRUMENT_ROUNDS[idx % INSTRUMENT_ROUNDS.length];

  const handleAnswer = opt => {
    const correct = opt === round.name;
    setChosen(opt);
    setScore(s => ({ correct:s.correct+(correct?1:0), total:s.total+1 }));
    setTimeout(() => {
      setChosen(null);
      setIdx(i => i+1);
    }, 1600);
  };

  return (
    <div>
      <BackBtn onBack={onBack}/>
      <div style={{ background:"#1a5a7a18", border:"2px solid #1a5a7a44", borderRadius:22,
        padding:"18px 20px", marginBottom:22 }}>
        <div style={{ fontSize:34, marginBottom:6 }}>🎷</div>
        <div style={{ fontFamily:"Georgia, serif", fontSize:23, fontWeight:700,
          color:"#0a3a5a", marginBottom:4 }}>Guess the Sound</div>
        <div style={{ fontSize:15, color:"#2a5a7a", lineHeight:1.5 }}>
          Listen to the hint, then choose which instrument you think is playing. There are no wrong answers — just wonderful listening.
        </div>
      </div>

      {/* Score strip */}
      <div style={{ display:"flex", justifyContent:"center", gap:24, marginBottom:20 }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontFamily:"Georgia, serif", fontSize:28, fontWeight:700, color:"#1a5a7a" }}>
            {score.correct}
          </div>
          <div style={{ fontSize:13, color:G.textSoft }}>Got it!</div>
        </div>
        <div style={{ width:1, background:G.border }}/>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontFamily:"Georgia, serif", fontSize:28, fontWeight:700, color:G.text }}>
            {score.total}
          </div>
          <div style={{ fontSize:13, color:G.textSoft }}>Tried</div>
        </div>
        <div style={{ width:1, background:G.border }}/>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:24 }}>{round.emoji}</div>
          <div style={{ fontSize:13, color:G.textSoft }}>Round {(idx%INSTRUMENT_ROUNDS.length)+1}</div>
        </div>
      </div>

      {/* Instrument card */}
      <div style={{ background:G.primaryDark, borderRadius:24, padding:"36px 24px",
        marginBottom:24, textAlign:"center" }}>
        <div style={{ fontSize:72, marginBottom:16 }}>{round.emoji}</div>
        <div style={{ fontSize:14, color:"rgba(255,255,255,0.5)", marginBottom:8 }}>🎵 Clue</div>
        <div style={{ fontFamily:"Georgia, serif", fontSize:20, color:"#fff",
          fontStyle:"italic", lineHeight:1.6 }}>"{round.hint}"</div>
      </div>

      {/* Answer buttons */}
      <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
        {round.options.map(opt => {
          const isCorrect = opt === round.name;
          const isChosen  = opt === chosen;
          let bg = G.card;
          if (chosen) { bg = isCorrect ? "#1a7a6a" : isChosen ? "#c0453a22" : G.card; }
          return (
            <button key={opt} onClick={() => !chosen && handleAnswer(opt)} style={{
              background:bg, border:`2px solid ${chosen ? (isCorrect?"#1a7a6a":isChosen?"#c0453a":G.border) : "#1a5a7a33"}`,
              borderRadius:18, padding:"18px 20px", cursor: chosen ? "default" : "pointer",
              display:"flex", alignItems:"center", gap:14,
              fontSize:20, fontWeight:700, color:chosen&&isCorrect?"#fff":G.text,
              transition:"background 0.3s, border-color 0.3s",
            }}>
              <span style={{ fontSize:30 }}>{INSTRUMENT_ROUNDS.find(r=>r.name===opt)?.emoji||"🎵"}</span>
              <span style={{ fontFamily:"Georgia, serif" }}>{opt}</span>
              {chosen && isCorrect && <span style={{ marginLeft:"auto", fontSize:22 }}>✅</span>}
              {chosen && isChosen && !isCorrect && <span style={{ marginLeft:"auto", fontSize:22 }}>💛</span>}
            </button>
          );
        })}
      </div>

      {chosen && (
        <div style={{ textAlign:"center", fontSize:20, fontWeight:700,
          color:chosen===round.name?"#1a7a6a":G.wake,
          animation:"popIn 0.3s ease", marginBottom:16 }}>
          {chosen === round.name ? "🎉 Wonderful!" : `💛 It was the ${round.name}!`}
        </div>
      )}

      <div style={{ background:G.accentLight, borderRadius:16, padding:"12px 16px",
        fontSize:14, color:"#5a5a3a", lineHeight:1.6 }}>
        💡 <strong>For carers:</strong> Picking out specific sounds uses auditory discrimination pathways that respond well to musical stimulation. Every guess is worth celebrating.
      </div>
      <style>{`@keyframes popIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}
