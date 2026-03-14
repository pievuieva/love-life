import { useState } from "react";
import { G, GLOBAL_ANIMATIONS } from "./design.js";
import { MOOD_TAGS } from "./prompts.js";
import { MY_SONGS } from "./songs.js";

// Screens
import WelcomeScreen from "./WelcomeScreen.jsx";
import { HomeScreen, SessionPlayer } from "./HomeScreen.jsx";
import MusicScreen from "./MusicScreen.jsx";
import MyLifeScreen from "./MyLifeScreen.jsx";
import ExercisesScreen from "./ExercisesScreen.jsx";

// Overlays
import NowPlaying from "./NowPlaying.jsx";
import TagFeedbackModal from "./TagFeedbackModal.jsx";
import CaregiverPortal from "./CaregiverPortal.jsx";

const NAV_ITEMS = [
  { id:"home",      icon:"🏠", label:"Home" },
  { id:"songs",     icon:"🎵", label:"Music" },
  { id:"exercises", icon:"🧩", label:"Games" },
  { id:"life",      icon:"💛", label:"My Life" },
  { id:"carers",    icon:"👨‍👩‍👧", label:"Carers" },
];

// ── App Root ────────────────────────────────────────────────────────────────
// All global state lives here and is passed down as props.
// No external state library required for v1.
export default function App() {
  // First-launch welcome screen — persisted so it never shows again after dismissal
  const [hasSeenWelcome, setHasSeenWelcome] = useState(
    () => localStorage.getItem("lovelife_welcomed") === "true"
  );
  const handleWelcomeComplete = () => {
    localStorage.setItem("lovelife_welcomed", "true");
    setHasSeenWelcome(true);
  };

  // Navigation
  const [screen, setScreen]           = useState("home");
  const [sessionMode, setSessionMode] = useState(null); // "calm" | "wake"

  // Overlays
  const [nowPlaying, setNowPlaying]   = useState(null);
  const [tagTarget, setTagTarget]     = useState(null);
  const [showPortal, setShowPortal]   = useState(false);

  // Shared state
  const [songLog, setSongLog]         = useState({});
  const [photos, setPhotos]           = useState([]);
  const [toast, setToast]             = useState(null);

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 3200); };

  const handlePlay = song => setNowPlaying(song);
  const handleTagRequest = () => { setTagTarget(nowPlaying); setNowPlaying(null); };
  const handleTagSave = (songId, tags) => {
    setSongLog(prev => ({ ...prev, [songId]: tags }));
    setTagTarget(null);
    const topTag = MOOD_TAGS.find(t => t.id === tags[0]);
    showToast(topTag ? `Thank you! We noted: ${topTag.emoji} ${topTag.label} 💛` : "Thank you for sharing 💛");
  };

  const handleCalmDown = () => { setSessionMode("calm"); setScreen("session"); };
  const handleWakeUp   = () => { setSessionMode("wake"); setScreen("session"); };
  const handleMyLife   = () => setScreen("life");
  const handlePlayWithPhotos = () => setNowPlaying({ ...MY_SONGS[0], withPhotos: true });

  return (
    <div style={{ minHeight:"100vh", background:G.bg,
      fontFamily:"'Segoe UI', Tahoma, sans-serif", display:"flex", justifyContent:"center" }}>
      <style>{GLOBAL_ANIMATIONS}</style>

      <div style={{ width:"100%", maxWidth:480, minHeight:"100vh",
        display:"flex", flexDirection:"column", background:G.bg, position:"relative" }}>

        {/* ── Content area ── */}
        <div style={{ flex:1, padding:"20px 16px 94px", overflowY:"auto" }}>
          {screen === "home"      && <HomeScreen onCalmDown={handleCalmDown} onWakeUp={handleWakeUp} onMyLife={handleMyLife}/>}
          {screen === "songs"     && <MusicScreen onPlay={handlePlay} songLog={songLog}/>}
          {screen === "session"   && <SessionPlayer mode={sessionMode} onPlay={handlePlay} onBack={() => setScreen("home")}/>}
          {screen === "exercises" && <ExercisesScreen onPlay={handlePlay}/>}
          {screen === "life"      && <MyLifeScreen photos={photos} onPhotosChange={setPhotos} onPlayWithPhotos={handlePlayWithPhotos}/>}
        </div>

        {/* ── Bottom navigation ── */}
        <div style={{
          position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
          width:"100%", maxWidth:480, background:"#fff",
          borderTop:`2px solid ${G.border}`, display:"flex",
          boxShadow:`0 -4px 16px rgba(61,107,53,0.1)`,
        }}>
          {NAV_ITEMS.map(n => {
            const isActive = screen === n.id || (screen === "session" && n.id === "home");
            return (
              <button key={n.id} onClick={() => {
                if (n.id === "carers") setShowPortal(true);
                else setScreen(n.id);
              }} style={{
                flex:1, padding:"12px 4px 8px", border:"none",
                background: isActive ? "#e4f0e0" : "transparent",
                cursor:"pointer", display:"flex", flexDirection:"column",
                alignItems:"center", gap:2, transition:"background 0.2s",
              }}>
                <span style={{ fontSize:22 }}>{n.icon}</span>
                <span style={{ fontSize:11, color:isActive ? G.primary : "#8aaa86",
                  fontWeight:isActive ? 700 : 400 }}>{n.label}</span>
                {isActive && n.id !== "carers" && (
                  <div style={{ width:20, height:3, background:G.accent, borderRadius:2 }}/>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Overlays ── */}

        {/* First-launch Carer's Manifesto — shown once, never again */}
        {!hasSeenWelcome && (
          <WelcomeScreen onComplete={handleWelcomeComplete} />
        )}

        {/* Now Playing full-screen player */}
        {nowPlaying && (
          <NowPlaying
            song={nowPlaying}
            photos={nowPlaying.withPhotos ? photos : []}
            onClose={() => setNowPlaying(null)}
            onTagRequest={handleTagRequest}
          />
        )}

        {/* Post-song mood tagging */}
        {tagTarget && (
          <TagFeedbackModal
            song={tagTarget}
            existingTags={songLog[tagTarget.id] || []}
            onSave={handleTagSave}
            onClose={() => setTagTarget(null)}
          />
        )}

        {/* Caregiver Portal bottom-sheet */}
        {showPortal && (
          <CaregiverPortal
            onClose={() => setShowPortal(false)}
            onPlay={handlePlay}
          />
        )}

        {/* Toast notification */}
        {toast && (
          <div style={{
            position:"fixed", bottom:90, left:"50%", transform:"translateX(-50%)",
            background:G.primary, color:"#fff", borderRadius:20,
            padding:"14px 24px", fontSize:15, fontWeight:600,
            boxShadow:"0 4px 20px rgba(61,107,53,0.35)",
            zIndex:600, maxWidth:340, textAlign:"center",
            animation:"fadeInUp 0.3s ease",
            whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
          }}>
            {toast}
          </div>
        )}

      </div>
    </div>
  );
}
