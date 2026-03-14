import { useState, useEffect, useRef } from "react";
import { G } from "./design.js";
import { MY_SONGS } from "./songs.js";
import { LIFE_PROMPTS, SELF_REASSURANCE_PROMPTS, DEMO_MESSAGES } from "./prompts.js";

const TABS = [
  { id:"photos",   label:"📷 My Photos" },
  { id:"story",    label:"📖 My Story" },
  { id:"messages", label:"💌 Messages" },
];

// ── MyLifeScreen ──────────────────────────────────────────────────────────────
// Three-tab screen: My Photos, My Story (Q&A + self-reassurance), Voice Messages.
export default function MyLifeScreen({ photos, onPhotosChange, onPlayWithPhotos }) {
  const [tab, setTab]               = useState("photos");
  const [viewing, setViewing]       = useState(null);
  const fileRef                     = useRef(null);

  // My Story state
  const [expanded, setExpanded]     = useState(null);
  const [storyTab, setStoryTab]     = useState("questions");
  const [recording, setRecording]   = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const [savedPhrase, setSavedPhrase] = useState(null);
  const [chosenPhrase, setChosenPhrase] = useState(SELF_REASSURANCE_PROMPTS[0]);
  const recRef = useRef(null);

  // Messages state
  const [messages, setMessages]     = useState(DEMO_MESSAGES);
  const [playingMsg, setPlayingMsg] = useState(null);
  const [msgProgress, setMsgProgress] = useState(0);
  const [showAddMsg, setShowAddMsg] = useState(false);
  const [newFrom, setNewFrom]       = useState("");
  const [newMsg, setNewMsg]         = useState("");
  const [msgRecording, setMsgRecording] = useState(false);
  const [msgRecordSecs, setMsgRecordSecs] = useState(0);
  const msgProgRef = useRef(null);
  const msgRecRef  = useRef(null);

  const handleUpload = e => {
    Array.from(e.target.files).forEach(f => {
      const r = new FileReader();
      r.onload = ev => onPhotosChange(p => [...p, ev.target.result]);
      r.readAsDataURL(f);
    });
    e.target.value = "";
  };

  const handleSelfRecord = () => {
    if (recording) {
      clearInterval(recRef.current); setRecording(false);
      setSavedPhrase({ text:chosenPhrase, secs:recordSecs });
    } else {
      setRecordSecs(0); setRecording(true);
      recRef.current = setInterval(() => {
        setRecordSecs(s => {
          if (s >= 15) { clearInterval(recRef.current); setRecording(false);
            setSavedPhrase({ text:chosenPhrase, secs:15 }); return 15; }
          return s + 1;
        });
      }, 1000);
    }
  };

  const playMessage = msg => {
    setPlayingMsg(msg); setMsgProgress(0);
    clearInterval(msgProgRef.current);
    msgProgRef.current = setInterval(() => {
      setMsgProgress(p => { if (p >= 100) { clearInterval(msgProgRef.current); return 100; } return p + 1; });
    }, 80);
  };

  const handleMsgRecord = () => {
    if (msgRecording) { clearInterval(msgRecRef.current); setMsgRecording(false); }
    else {
      setMsgRecordSecs(0); setMsgRecording(true);
      msgRecRef.current = setInterval(() => {
        setMsgRecordSecs(s => {
          if (s >= 10) { clearInterval(msgRecRef.current); setMsgRecording(false); return 10; }
          return s + 1;
        });
      }, 1000);
    }
  };

  const addMessage = () => {
    if (!newFrom.trim() || !newMsg.trim()) return;
    setMessages(m => [{ from:newFrom, emoji:"💛", text:newMsg }, ...m]);
    setNewFrom(""); setNewMsg(""); setShowAddMsg(false);
  };

  useEffect(() => () => {
    clearInterval(recRef.current); clearInterval(msgProgRef.current); clearInterval(msgRecRef.current);
  }, []);

  return (
    <div>
      <div style={{ fontFamily:"Georgia, serif", fontSize:26, fontWeight:700,
        color:G.text, marginBottom:4 }}>💛 My Life</div>
      <div style={{ fontSize:17, color:G.textSoft, marginBottom:20 }}>
        Your photos, your memories, your story.
      </div>

      {/* Tab strip */}
      <div style={{ display:"flex", background:G.bg, borderRadius:16, padding:3,
        marginBottom:22, border:`2px solid ${G.border}`, gap:2 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex:1, border:"none", borderRadius:12, padding:"12px 4px", fontSize:13,
            fontWeight:700, cursor:"pointer",
            background: tab===t.id ? G.primary : "transparent",
            color: tab===t.id ? "#fff" : G.textSoft, lineHeight:1.2,
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── MY PHOTOS ── */}
      {tab === "photos" && (
        <div>
          {photos.length === 0 ? (
            <div style={{ background:G.card, borderRadius:24, padding:"40px 24px",
              textAlign:"center", border:`2px dashed ${G.border}` }}>
              <div style={{ fontSize:56, marginBottom:12 }}>📷</div>
              <div style={{ fontFamily:"Georgia, serif", fontSize:20, fontWeight:700,
                color:G.text, marginBottom:6 }}>Add your favourite photos</div>
              <div style={{ fontSize:15, color:G.textSoft, lineHeight:1.6, marginBottom:22 }}>
                Photos slide gently during music playback — turning a song into a memory.
              </div>
              <button onClick={() => fileRef.current?.click()} style={{
                background:G.primary, border:"none", borderRadius:16,
                padding:"16px 32px", fontSize:17, fontWeight:700,
                color:"#fff", cursor:"pointer",
              }}>📷 Add Photos</button>
            </div>
          ) : (
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16 }}>
                {photos.map((p, i) => (
                  <div key={i} onClick={() => setViewing(i)} style={{
                    aspectRatio:"1", borderRadius:14, overflow:"hidden", cursor:"pointer",
                    border:`2px solid ${G.border}`,
                  }}>
                    <img src={p} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  </div>
                ))}
                <div onClick={() => fileRef.current?.click()} style={{
                  aspectRatio:"1", borderRadius:14, background:G.bg,
                  border:`2px dashed ${G.border}`, display:"flex",
                  flexDirection:"column", alignItems:"center", justifyContent:"center",
                  cursor:"pointer", gap:6,
                }}>
                  <div style={{ fontSize:28 }}>＋</div>
                  <div style={{ fontSize:11, fontWeight:700, color:G.textSoft }}>Add</div>
                </div>
              </div>
              <button onClick={onPlayWithPhotos} style={{
                width:"100%", background:G.primary, border:"none", borderRadius:18,
                padding:"18px", fontSize:18, fontWeight:700, color:"#fff",
                cursor:"pointer", fontFamily:"Georgia, serif",
                boxShadow:`0 4px 20px rgba(61,107,53,0.3)`, marginBottom:12,
              }}>▶  Play Music with My Photos</button>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" multiple
            onChange={handleUpload} style={{ display:"none" }}/>
        </div>
      )}

      {/* ── MY STORY ── */}
      {tab === "story" && (
        <div>
          {/* Sub-tab strip */}
          <div style={{ display:"flex", gap:8, marginBottom:20 }}>
            {[{id:"questions",label:"❓ Life Questions"},{id:"selfvoice",label:"🎙 My Voice"}].map(st => (
              <button key={st.id} onClick={() => setStoryTab(st.id)} style={{
                flex:1, border:"none", borderRadius:14, padding:"12px 8px", fontSize:14,
                fontWeight:700, cursor:"pointer",
                background: storyTab===st.id ? G.primary : G.card,
                color: storyTab===st.id ? "#fff" : G.textSoft,
                border: storyTab===st.id ? "none" : `2px solid ${G.border}`,
              }}>{st.label}</button>
            ))}
          </div>

          {storyTab === "questions" && (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {LIFE_PROMPTS.map((p, i) => (
                <div key={i} style={{ background:G.card, borderRadius:18,
                  border:`2px solid ${expanded===i ? G.primary : G.border}`,
                  overflow:"hidden", transition:"border-color 0.2s" }}>
                  <button onClick={() => setExpanded(expanded===i ? null : i)} style={{
                    width:"100%", background:"transparent", border:"none",
                    padding:"16px 18px", cursor:"pointer", display:"flex",
                    alignItems:"center", gap:12, textAlign:"left",
                  }}>
                    <span style={{ fontSize:24, flexShrink:0 }}>{p.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:"Georgia, serif", fontSize:16, fontWeight:700,
                        color:G.text }}>{p.q}</div>
                      <div style={{ fontSize:12, color:G.textSoft, marginTop:2 }}>{p.cat}</div>
                    </div>
                    <span style={{ fontSize:18, color:G.textSoft }}>{expanded===i ? "▲" : "▼"}</span>
                  </button>
                  {expanded === i && (
                    <div style={{ padding:"0 18px 18px",
                      borderTop:`1px solid ${G.border}` }}>
                      <div style={{ paddingTop:14, fontFamily:"Georgia, serif", fontSize:17,
                        color:G.text, lineHeight:1.7, fontStyle:"italic" }}>
                        "{p.a}"
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {storyTab === "selfvoice" && (
            <div>
              <div style={{ background:"#f5f0ff", border:"2px solid #d8ccf0",
                borderRadius:20, padding:"18px", marginBottom:20 }}>
                <div style={{ fontFamily:"Georgia, serif", fontSize:17, fontWeight:700,
                  color:"#4a2a7a", marginBottom:6 }}>🎙 Self-Reassurance Recorder</div>
                <div style={{ fontSize:14, color:"#5a3a8a", lineHeight:1.6 }}>
                  Record a calming phrase in your own voice. Your own voice can reach you when others cannot.
                </div>
              </div>
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:14, color:G.textSoft, marginBottom:10, fontWeight:600 }}>
                  Choose a phrase:
                </div>
                {SELF_REASSURANCE_PROMPTS.map((phrase, i) => (
                  <button key={i} onClick={() => setChosenPhrase(phrase)} style={{
                    width:"100%", background: chosenPhrase===phrase ? "#f5f0ff" : G.bg,
                    border:`2px solid ${chosenPhrase===phrase ? "#8a6abd" : G.border}`,
                    borderRadius:14, padding:"12px 16px", cursor:"pointer", textAlign:"left",
                    fontSize:15, color: chosenPhrase===phrase ? "#4a2a7a" : G.textSoft,
                    marginBottom:8, fontFamily:"Georgia, serif", fontStyle:"italic", lineHeight:1.5,
                  }}>"{phrase}"</button>
                ))}
              </div>

              <div style={{ background:"#4a2a7a", borderRadius:20, padding:"24px 20px",
                marginBottom:20, textAlign:"center" }}>
                <div style={{ fontSize:18, color:"rgba(255,255,255,0.7)", marginBottom:10 }}>
                  {recording ? "Say this clearly and warmly:" : "Selected phrase:"}
                </div>
                <div style={{ fontFamily:"Georgia, serif", fontSize:22, fontWeight:700,
                  color:"#fff", fontStyle:"italic", lineHeight:1.5 }}>
                  "{chosenPhrase}"
                </div>
                {recording && (
                  <div style={{ marginTop:14, display:"flex", alignItems:"center",
                    justifyContent:"center", gap:10 }}>
                    <div style={{ width:12, height:12, borderRadius:"50%",
                      background:"#f05a5a", animation:"blink 1s infinite" }}/>
                    <span style={{ color:"rgba(255,255,255,0.8)", fontSize:15 }}>
                      Recording… {recordSecs}s / 15s
                    </span>
                  </div>
                )}
              </div>

              <button onClick={handleSelfRecord} style={{
                width:"100%", background: recording ? "#c0453a" : "#8a6abd",
                border:"none", borderRadius:18, padding:"22px",
                fontSize:20, fontWeight:700, color:"#fff", cursor:"pointer", marginBottom:14,
                display:"flex", alignItems:"center", justifyContent:"center", gap:12,
              }}>
                {recording
                  ? <><div style={{ width:16,height:16,borderRadius:"50%",background:"#fff",animation:"blink 1s infinite"}}/>  Stop Recording</>
                  : "🎙️  Record My Voice"}
              </button>

              {savedPhrase && (
                <div style={{ background:"#1a5a2a18", border:"2px solid #1a5a2a44",
                  borderRadius:16, padding:"16px 18px", marginBottom:16 }}>
                  <div style={{ fontSize:15, fontWeight:700, color:"#1a5a2a", marginBottom:4 }}>
                    ✅ Saved! Your voice message is ready.
                  </div>
                  <div style={{ fontFamily:"Georgia, serif", fontSize:16,
                    color:G.textSoft, fontStyle:"italic" }}>
                    "{savedPhrase.text}"
                  </div>
                </div>
              )}
              <div style={{ background:G.accentLight, borderRadius:16, padding:"12px 16px",
                fontSize:14, color:"#5a5a3a", lineHeight:1.6 }}>
                💡 <strong>For carers:</strong> Self-reassurance in one's own voice is a recognised technique for managing anxiety in dementia care. Your own familiar voice can cut through confusion when no other voice can.
              </div>
              <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
            </div>
          )}
        </div>
      )}

      {/* ── MESSAGES ── */}
      {tab === "messages" && (
        <div>
          <div style={{ background:"#b05a1a18", border:"2px solid #b05a1a33",
            borderRadius:18, padding:"16px 18px", marginBottom:20 }}>
            <div style={{ fontSize:32, marginBottom:6 }}>💌</div>
            <div style={{ fontFamily:"Georgia, serif", fontSize:20, fontWeight:700,
              color:"#6a2a00", marginBottom:4 }}>Messages from People Who Love You</div>
            <div style={{ fontSize:15, color:"#8a4a20", lineHeight:1.6 }}>
              Your family have left you messages. Tap one to hear it — your favourite song will play afterwards.
            </div>
          </div>

          {playingMsg && (
            <div style={{ background:G.primaryDark, borderRadius:24, padding:"28px 20px",
              marginBottom:20, textAlign:"center" }}>
              <div style={{ fontSize:14, color:"#a8c8a4", letterSpacing:1, marginBottom:14 }}>
                MESSAGE FROM {playingMsg.from.toUpperCase()}
              </div>
              <div style={{ fontSize:52, marginBottom:14 }}>{playingMsg.emoji}</div>
              <div style={{ fontFamily:"Georgia, serif", fontSize:20, color:"#fff",
                lineHeight:1.7, marginBottom:18, fontStyle:"italic" }}>
                "{playingMsg.text}"
              </div>
              <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:8, height:8, marginBottom:8 }}>
                <div style={{ width:`${msgProgress}%`, height:"100%", background:G.accent,
                  borderRadius:8, transition:"width 0.08s linear" }}/>
              </div>
              <div style={{ color:"rgba(255,255,255,0.5)", fontSize:14, marginBottom:16 }}>
                {msgProgress < 100 ? "Playing message…" : "✅ Message played"}
              </div>
              <button onClick={() => setPlayingMsg(null)} style={{
                background:"rgba(255,255,255,0.12)", border:"none", borderRadius:14,
                padding:"12px 28px", fontSize:15, fontWeight:700, color:"#fff", cursor:"pointer",
              }}>← Back to messages</button>
            </div>
          )}

          {!playingMsg && (
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ background:G.card, border:`2px solid ${G.border}`,
                  borderRadius:20, padding:"18px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
                    <span style={{ fontSize:36 }}>{msg.emoji}</span>
                    <div>
                      <div style={{ fontFamily:"Georgia, serif", fontSize:18, fontWeight:700, color:G.text }}>
                        {msg.from}
                      </div>
                      <div style={{ fontSize:13, color:G.textSoft }}>Tap to hear their message</div>
                    </div>
                  </div>
                  <div style={{ fontSize:15, color:G.textSoft, fontStyle:"italic", lineHeight:1.5,
                    marginBottom:14, borderLeft:`3px solid ${G.border}`, paddingLeft:12 }}>
                    "{msg.text.slice(0,70)}{msg.text.length>70?"…":""}"
                  </div>
                  <button onClick={() => playMessage(msg)} style={{
                    width:"100%", background:"#b05a1a", border:"none", borderRadius:14,
                    padding:"14px", fontSize:17, fontWeight:700, color:"#fff", cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:10,
                  }}><span>▶</span> Play message + favourite song</button>
                </div>
              ))}
            </div>
          )}

          {!playingMsg && (
            <>
              <button onClick={() => setShowAddMsg(s => !s)} style={{
                width:"100%", background:G.bg, border:`2px dashed ${G.border}`,
                borderRadius:18, padding:"16px", fontSize:16, cursor:"pointer",
                color:G.textSoft, fontWeight:600, marginBottom: showAddMsg ? 12 : 0,
              }}>+ Add a new message from family</button>

              {showAddMsg && (
                <div style={{ background:G.card, border:`2px solid ${G.border}`,
                  borderRadius:20, padding:"18px", marginBottom:16 }}>
                  <div style={{ fontSize:15, fontWeight:700, color:G.text, marginBottom:12 }}>
                    Record or type a message
                  </div>
                  <input value={newFrom} onChange={e => setNewFrom(e.target.value)}
                    placeholder="Your name (e.g. Sarah, daughter)"
                    style={{ width:"100%", border:`2px solid ${G.border}`, borderRadius:12,
                      padding:"12px 14px", fontSize:15, marginBottom:10,
                      boxSizing:"border-box", outline:"none" }}/>
                  <textarea value={newMsg} onChange={e => setNewMsg(e.target.value)}
                    placeholder="Write your message here…" rows={3}
                    style={{ width:"100%", border:`2px solid ${G.border}`, borderRadius:12,
                      padding:"12px 14px", fontSize:15, marginBottom:12,
                      boxSizing:"border-box", fontFamily:"inherit", resize:"none", outline:"none" }}/>
                  <div style={{ display:"flex", gap:10 }}>
                    <button onClick={handleMsgRecord} style={{
                      flex:1, background: msgRecording ? "#c0453a" : G.bg,
                      border:`2px solid ${msgRecording ? "#c0453a" : G.border}`,
                      borderRadius:12, padding:"12px", fontSize:15, cursor:"pointer",
                      color: msgRecording ? "#fff" : G.textSoft, fontWeight:600,
                    }}>{msgRecording ? `⏹ Stop (${msgRecordSecs}s)` : "🎙 Record voice"}</button>
                    <button onClick={addMessage} style={{
                      flex:2, background: (newFrom&&newMsg) ? G.primary : G.border,
                      border:"none", borderRadius:12, padding:"12px",
                      fontSize:15, fontWeight:700, cursor:"pointer", color:"#fff",
                    }}>Save message 💛</button>
                  </div>
                </div>
              )}
            </>
          )}

          <div style={{ marginTop:14, background:G.accentLight, borderRadius:16, padding:"12px 16px",
            fontSize:14, color:"#5a5a3a", lineHeight:1.6 }}>
            💡 A familiar voice followed immediately by a favourite song creates the most powerful wellbeing moment the app can deliver. Family members can add messages from anywhere.
          </div>
        </div>
      )}

      {/* Full-screen photo viewer */}
      {viewing !== null && (
        <div onClick={() => setViewing(null)} style={{ position:"fixed", inset:0,
          background:"rgba(0,0,0,0.92)", display:"flex", alignItems:"center",
          justifyContent:"center", zIndex:200 }}>
          <img src={photos[viewing]} alt="" style={{ maxWidth:"92vw", maxHeight:"82vh",
            borderRadius:16, objectFit:"contain" }}/>
          <div style={{ position:"absolute", bottom:32, left:"50%",
            transform:"translateX(-50%)", display:"flex", gap:12 }}>
            {viewing > 0 && (
              <button onClick={e => { e.stopPropagation(); setViewing(v => v-1); }}
                style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:12,
                  padding:"10px 22px", color:"#fff", fontSize:20, cursor:"pointer" }}>‹</button>
            )}
            <button onClick={e => { e.stopPropagation(); setViewing(null); }}
              style={{ background:"rgba(255,255,255,0.15)", border:"2px solid rgba(255,255,255,0.3)",
                borderRadius:12, padding:"10px 22px", color:"#fff", fontSize:15, cursor:"pointer" }}>Close</button>
            {viewing < photos.length - 1 && (
              <button onClick={e => { e.stopPropagation(); setViewing(v => v+1); }}
                style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:12,
                  padding:"10px 22px", color:"#fff", fontSize:20, cursor:"pointer" }}>›</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
