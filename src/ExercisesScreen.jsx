import { useState } from "react";
import { G } from "./design.js";
import { KaraokeExercise, HummingExercise, FinishLyricExercise, FamousFacesExercise, MoodPainterGame } from "./CalmBrainGames.jsx";
import { TappingExercise, DanceSwayGame, ConductorGame, MessageFromHomeGame } from "./ActiveGames.jsx";
import RASExercise from "./RASExercise.jsx";
import GuessInstrumentGame from "./GuessInstrumentGame.jsx";

// Game definitions — metadata only, no JSX logic here
const EXERCISES = [
  { id:"karaoke",       emoji:"🎤", title:"Sing Along",          subtitle:"Singing keeps language alive",              color:"#c0453a" },
  { id:"tapping",       emoji:"🥁", title:"Rhythm & Tap",        subtitle:"Tap in time with the beat",                 color:"#3a7dc0" },
  { id:"humming",       emoji:"🎵", title:"Hum Along",           subtitle:"Just the melody, no words needed",          color:"#4a9e6e" },
  { id:"ras",           emoji:"🚶", title:"Rhythm Walk (RAS)",   subtitle:"Improve gait & reduce fall risk",           color:"#b05a1a" },
  { id:"finishlyric",   emoji:"🎼", title:"Finish the Song",     subtitle:"Complete the missing word",                 color:"#1a7a6a" },
  { id:"famousfaces",   emoji:"🌟", title:"Famous Faces",        subtitle:"Recognise singers from your era",           color:"#8a4a9a" },
  { id:"guessinstrument",emoji:"🎷",title:"Guess the Sound",     subtitle:"Which instrument can you hear?",            color:"#1a5a7a" },
  { id:"dancesway",     emoji:"💃", title:"Dance & Sway",        subtitle:"Move to the music",                         color:"#8a1a5a" },
  { id:"moodpainter",   emoji:"🎨", title:"Music Mood",          subtitle:"Tell us how the music feels",               color:"#c07a10" },
  { id:"conductor",     emoji:"🎶", title:"The Conductor",       subtitle:"You are in control",                        color:"#2a6a2a" },
  { id:"messagehome",   emoji:"💌", title:"Message from Home",   subtitle:"A voice from someone who loves you",        color:"#b05a1a" },
];

const GROUPS = [
  { id:"calm",   label:"🌿 Calm Play",   color:"#3a7dc0",
    desc:"Gentle, soothing activities — perfect for any time of day",
    games:["humming","moodpainter","finishlyric"] },
  { id:"active", label:"💃 Active Play", color:"#8a1a5a",
    desc:"Movement and rhythm — great for mornings or after a meal",
    games:["ras","tapping","dancesway","conductor"] },
  { id:"brain",  label:"🧩 Brain Play",  color:"#6a5aad",
    desc:"Memory, recognition and language — fun mental engagement",
    games:["karaoke","finishlyric","famousfaces","guessinstrument"] },
  { id:"social", label:"💛 Social Play", color:"#b05a1a",
    desc:"Connection with family and the people you love",
    games:["messagehome"] },
];

// ── ExercisesScreen ───────────────────────────────────────────────────────────
// Hub/router for all 11 therapeutic games.
export default function ExercisesScreen({ onPlay }) {
  const [active, setActive] = useState(null);
  const back = () => setActive(null);

  if (active === "karaoke")         return <KaraokeExercise onBack={back} onPlay={onPlay}/>;
  if (active === "tapping")         return <TappingExercise onBack={back}/>;
  if (active === "humming")         return <HummingExercise onBack={back} onPlay={onPlay}/>;
  if (active === "ras")             return <RASExercise onBack={back}/>;
  if (active === "finishlyric")     return <FinishLyricExercise onBack={back}/>;
  if (active === "famousfaces")     return <FamousFacesExercise onBack={back}/>;
  if (active === "guessinstrument") return <GuessInstrumentGame onBack={back}/>;
  if (active === "dancesway")       return <DanceSwayGame onBack={back}/>;
  if (active === "moodpainter")     return <MoodPainterGame onBack={back}/>;
  if (active === "conductor")       return <ConductorGame onBack={back}/>;
  if (active === "messagehome")     return <MessageFromHomeGame onBack={back}/>;

  return (
    <div>
      <div style={{ fontFamily:"Georgia, serif", fontSize:26, fontWeight:700,
        color:G.text, marginBottom:4 }}>🧩 Music Games</div>
      <div style={{ fontSize:16, color:G.textSoft, marginBottom:22, lineHeight:1.5 }}>
        Choose by how you're feeling right now.
      </div>

      {GROUPS.map(group => {
        const games = EXERCISES.filter(e => group.games.includes(e.id));
        return (
          <div key={group.id} style={{ marginBottom:26 }}>
            {/* Group header */}
            <div style={{ background:`${group.color}18`,
              border:`2px solid ${group.color}33`,
              borderRadius:18, padding:"14px 16px", marginBottom:12 }}>
              <div style={{ fontFamily:"Georgia, serif", fontSize:20,
                fontWeight:700, color:group.color }}>{group.label}</div>
              <div style={{ fontSize:14, color:G.textSoft, marginTop:2 }}>{group.desc}</div>
            </div>

            {/* Games in group */}
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {games.map(ex => (
                <button key={ex.id} onClick={() => setActive(ex.id)} style={{
                  background:G.card, border:`2px solid ${ex.color}33`,
                  borderRadius:18, padding:"16px 16px", cursor:"pointer",
                  textAlign:"left", display:"flex", gap:14, alignItems:"center",
                  boxShadow:`0 2px 10px ${ex.color}12`,
                  transition:"transform 0.1s, box-shadow 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateX(4px)"; e.currentTarget.style.boxShadow=`0 4px 18px ${ex.color}28`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow=`0 2px 10px ${ex.color}12`; }}>
                  <div style={{ width:56, height:56, borderRadius:16,
                    background:ex.color+"18", display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:30, flexShrink:0 }}>
                    {ex.emoji}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"Georgia, serif", fontSize:19,
                      fontWeight:700, color:G.text }}>{ex.title}</div>
                    <div style={{ fontSize:13, color:ex.color, fontWeight:600 }}>
                      {ex.subtitle}
                    </div>
                  </div>
                  <span style={{ color:ex.color, fontSize:20, flexShrink:0 }}>›</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
