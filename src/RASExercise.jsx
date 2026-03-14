import { useState, useEffect, useRef, useCallback } from "react";
import { G } from "./design.js";
import { MY_SONGS } from "./songs.js";
import { BackBtn } from "./WaveAnim.jsx";

const RAS_COLOR = "#b05a1a";

// ── RASExercise ───────────────────────────────────────────────────────────────
// Rhythm Walk (RAS) — tap calibration → 20-min metronome session.
// Clinical protocol: set music 10% faster than natural gait to build motor circuits.
export default function RASExercise({ onBack }) {
  const [safetyAck, setSafetyAck]   = useState(false);
  const [phase, setPhase]           = useState("calibrate");
  const [bpm, setBpm]               = useState(72);
  const [metronomeOn, setMetronomeOn] = useState(true);
  const [sessionActive, setSessionActive] = useState(false);

  // Gait calibration
  const [taps, setTaps]             = useState([]);
  const [calibratedBpm, setCalibratedBpm] = useState(null);

  // Visual pulse
  const [pulseScale, setPulseScale] = useState(1);
  const [ringScale, setRingScale]   = useState(1);

  // Audio context
  const audioCtxRef = useRef(null);
  const metroRef    = useRef(null);

  const triggerPulse = useCallback(() => {
    setPulseScale(1.18); setRingScale(1.22);
    setTimeout(() => { setPulseScale(1); setRingScale(1); }, 180);
  }, []);

  const startMetronome = useCallback((activeBpm) => {
    if (!audioCtxRef.current)
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();
    const interval = 60 / activeBpm;
    let nextBeat = ctx.currentTime + 0.05;

    const schedule = () => {
      while (nextBeat < ctx.currentTime + 0.15) {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(80, nextBeat);
        osc.frequency.exponentialRampToValueAtTime(40, nextBeat + 0.08);
        gain.gain.setValueAtTime(0.9, nextBeat);
        gain.gain.exponentialRampToValueAtTime(0.001, nextBeat + 0.12);
        osc.start(nextBeat); osc.stop(nextBeat + 0.13);
        const delay = Math.max(0, (nextBeat - ctx.currentTime) * 1000);
        setTimeout(triggerPulse, delay);
        nextBeat += interval;
      }
      metroRef.current = setTimeout(schedule, 40);
    };
    schedule();
  }, [triggerPulse]);

  const stopMetronome = useCallback(() => {
    clearTimeout(metroRef.current);
    if (audioCtxRef.current) audioCtxRef.current.suspend();
  }, []);

  useEffect(() => {
    if (sessionActive && metronomeOn) startMetronome(bpm);
    else stopMetronome();
    return stopMetronome;
  }, [sessionActive, metronomeOn, bpm, startMetronome, stopMetronome]);

  useEffect(() => () => stopMetronome(), [stopMetronome]);

  const handleCalibrationTap = () => {
    const now = Date.now();
    setTaps(prev => {
      const next = [...prev, now].slice(-8);
      if (next.length >= 3) {
        const gaps = next.slice(1).map((t, i) => t - next[i]);
        const avgGap = gaps.reduce((a,b) => a+b, 0) / gaps.length;
        setCalibratedBpm(Math.min(120, Math.max(40, Math.round(60000 / avgGap))));
      }
      return next;
    });
  };

  const confirmCalibration = () => {
    setBpm(Math.min(120, Math.round(calibratedBpm * 1.1)));
    setPhase("session");
  };

  const targetSong = MY_SONGS[0];

  // Safety screen
  if (!safetyAck) return (
    <div>
      <BackBtn onBack={onBack}/>
      <div style={{ background:"#fff4e0", border:"3px solid #e07a10",
        borderRadius:22, padding:"24px 20px", marginBottom:20 }}>
        <div style={{ fontSize:40, marginBottom:10, textAlign:"center" }}>⚠️</div>
        <div style={{ fontFamily:"Georgia, serif", fontSize:22, fontWeight:700,
          color:"#7a3a00", marginBottom:12, textAlign:"center" }}>Safety Notice for Carers</div>
        <div style={{ fontSize:16, color:"#5a3000", lineHeight:1.7 }}>
          <strong>This exercise involves movement.</strong> Please ensure:
        </div>
        <div style={{ fontSize:15, color:"#5a3000", lineHeight:1.9, marginTop:10 }}>
          ✅ &nbsp;The person is in a safe, clear space before walking<br/>
          ✅ &nbsp;A carer or family member is present at all times<br/>
          ✅ &nbsp;Any walking aids (frame, stick) are ready to hand<br/>
          ✅ &nbsp;Stop immediately if the person feels dizzy or unsteady<br/>
          ✅ &nbsp;Consult a physiotherapist before starting if there is a history of falls
        </div>
      </div>
      <button onClick={() => setSafetyAck(true)} style={{
        width:"100%", background:RAS_COLOR, border:"none", borderRadius:18,
        padding:"20px", fontSize:20, fontWeight:700, color:"#fff",
        cursor:"pointer", fontFamily:"Georgia, serif",
      }}>I understand — continue</button>
    </div>
  );

  // Calibration screen
  if (phase === "calibrate") return (
    <div>
      <BackBtn onBack={() => setSafetyAck(false)}/>
      <div style={{ background:RAS_COLOR+"18", border:`2px solid ${RAS_COLOR}44`,
        borderRadius:22, padding:"20px", marginBottom:22 }}>
        <div style={{ fontSize:36, marginBottom:8 }}>🚶</div>
        <div style={{ fontFamily:"Georgia, serif", fontSize:24, fontWeight:700,
          color:"#6a2a00", marginBottom:6 }}>Rhythm Walk (RAS)</div>
        <div style={{ fontSize:15, color:"#7a4a20", lineHeight:1.6 }}>
          RAS uses a steady beat to help the brain coordinate walking. First, let's measure the natural walking pace so we can set the right tempo.
        </div>
      </div>

      <div style={{ background:G.card, borderRadius:20, padding:"22px",
        border:`2px solid ${G.border}`, marginBottom:20 }}>
        <div style={{ fontFamily:"Georgia, serif", fontSize:19, fontWeight:700,
          color:G.text, marginBottom:4 }}>Step 1: Measure walking pace</div>
        <div style={{ fontSize:15, color:G.textSoft, marginBottom:18, lineHeight:1.5 }}>
          Watch the person walk naturally. Tap the button below once for each step they take (at least 6 taps).
        </div>
        <button onClick={handleCalibrationTap} style={{
          width:"100%", background: calibratedBpm ? G.primary : RAS_COLOR,
          border:"none", borderRadius:20, padding:"28px",
          fontSize:22, fontWeight:700, color:"#fff", cursor:"pointer",
          transform: taps.length%2===1 ? "scale(0.97)" : "scale(1)",
          transition:"transform 0.05s",
        }}>👣 &nbsp;TAP each step</button>

        {calibratedBpm && (
          <div style={{ marginTop:18, textAlign:"center" }}>
            <div style={{ fontSize:15, color:G.textSoft, marginBottom:4 }}>Natural walking pace:</div>
            <div style={{ fontFamily:"Georgia, serif", fontSize:40, fontWeight:700, color:RAS_COLOR }}>
              {calibratedBpm} <span style={{ fontSize:18, color:G.textSoft }}>steps/min</span>
            </div>
            <div style={{ fontSize:14, color:G.textSoft, marginTop:4 }}>
              RAS target: <strong>{Math.min(120, Math.round(calibratedBpm * 1.1))} BPM</strong> (10% faster — the clinical protocol)
            </div>
          </div>
        )}
        <div style={{ display:"flex", gap:10, marginTop:16 }}>
          <button onClick={() => { setTaps([]); setCalibratedBpm(null); }} style={{
            flex:1, background:G.bg, border:`2px solid ${G.border}`, borderRadius:14,
            padding:"12px", fontSize:15, cursor:"pointer", color:G.textSoft,
          }}>Reset</button>
          {calibratedBpm && (
            <button onClick={confirmCalibration} style={{
              flex:2, background:RAS_COLOR, border:"none", borderRadius:14,
              padding:"12px", fontSize:16, fontWeight:700, cursor:"pointer", color:"#fff",
            }}>Set pace & start →</button>
          )}
        </div>
      </div>

      <button onClick={() => { setBpm(72); setPhase("session"); }} style={{
        width:"100%", background:G.bg, border:`2px solid ${G.border}`,
        borderRadius:16, padding:"14px", fontSize:15, cursor:"pointer", color:G.textSoft,
      }}>Skip calibration — use default (72 BPM)</button>
    </div>
  );

  // Session screen
  return (
    <div>
      <BackBtn onBack={() => { stopMetronome(); setSessionActive(false); setPhase("calibrate"); }}/>
      <div style={{ textAlign:"center", marginBottom:20 }}>
        <div style={{ fontFamily:"Georgia, serif", fontSize:22, fontWeight:700,
          color:G.text, marginBottom:2 }}>Rhythm Walk Session</div>
        <div style={{ fontSize:15, color:G.textSoft }}>
          {targetSong.emoji} {targetSong.title} · {bpm} BPM
        </div>
      </div>

      {/* Visual pulse */}
      <div style={{ display:"flex", justifyContent:"center", alignItems:"center",
        marginBottom:24, position:"relative", height:240 }}>
        <div style={{ position:"absolute", width:200, height:200, borderRadius:"50%",
          border:`4px solid ${RAS_COLOR}`, opacity:sessionActive?0.35:0.1,
          transform:`scale(${sessionActive?ringScale:1})`,
          transition:"transform 0.18s ease-out, opacity 0.3s" }}/>
        <div style={{ position:"absolute", width:170, height:170, borderRadius:"50%",
          border:`3px solid ${RAS_COLOR}`, opacity:sessionActive?0.25:0.08,
          transform:`scale(${sessionActive?ringScale*0.92:1})`,
          transition:"transform 0.18s ease-out" }}/>
        <div onClick={() => setSessionActive(a => !a)} style={{
          width:150, height:150, borderRadius:"50%",
          background:sessionActive
            ?`radial-gradient(circle at 40% 35%, ${RAS_COLOR}dd, #6a2a00)`
            :`radial-gradient(circle at 40% 35%, #c8a080, #8a6a50)`,
          border:`5px solid ${sessionActive?G.accent:G.border}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          flexDirection:"column", gap:6,
          transform:`scale(${pulseScale})`,
          transition:"transform 0.18s ease-out, background 0.3s",
          boxShadow:sessionActive?`0 0 40px ${RAS_COLOR}55`:"none",
          cursor:"pointer", userSelect:"none",
        }}>
          <span style={{ fontSize:48 }}>🚶</span>
          <span style={{ color:"#fff", fontSize:13, fontWeight:700, opacity:0.9 }}>
            {sessionActive ? `${bpm} BPM` : "Tap to start"}
          </span>
        </div>
      </div>

      {/* BPM adjuster */}
      <div style={{ background:G.card, borderRadius:20, padding:"18px",
        border:`2px solid ${G.border}`, marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
          <div style={{ fontFamily:"Georgia, serif", fontSize:17, fontWeight:700, color:G.text }}>Tempo</div>
          <div style={{ fontFamily:"Georgia, serif", fontSize:28, fontWeight:700, color:RAS_COLOR }}>
            {bpm} <span style={{ fontSize:14, color:G.textSoft, fontWeight:400 }}>BPM</span>
          </div>
        </div>
        <input type="range" min={50} max={120} value={bpm}
          onChange={e => { const v=Number(e.target.value); setBpm(v);
            if(sessionActive){stopMetronome();setTimeout(()=>startMetronome(v),50);} }}
          style={{ width:"100%", accentColor:RAS_COLOR, height:8 }}/>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:12,
          color:G.textSoft, marginTop:4 }}>
          <span>Slow (50)</span><span>Moderate (85)</span><span>Brisk (120)</span>
        </div>
        {/* Metronome toggle */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
          marginTop:14, paddingTop:14, borderTop:`1px solid ${G.border}` }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:G.text }}>🔊 Beat sound</div>
            <div style={{ fontSize:13, color:G.textSoft }}>Deep bass pulse on each beat</div>
          </div>
          <button onClick={() => setMetronomeOn(m => !m)} style={{
            width:56, height:30, borderRadius:15,
            background:metronomeOn?RAS_COLOR:G.border,
            border:"none", cursor:"pointer", position:"relative", transition:"background 0.2s",
          }}>
            <div style={{ width:24, height:24, borderRadius:"50%", background:"#fff",
              position:"absolute", top:3, left:metronomeOn?29:3,
              transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }}/>
          </button>
        </div>
      </div>

      <button onClick={() => setSessionActive(a => !a)} style={{
        width:"100%", background:sessionActive?"#e4f0e0":RAS_COLOR,
        border:"none", borderRadius:18, padding:"20px", fontSize:22, fontWeight:700,
        color:sessionActive?G.primaryDark:"#fff", cursor:"pointer",
        fontFamily:"Georgia, serif", marginBottom:14,
      }}>{sessionActive ? "⏹ Stop Session" : "▶ Start Rhythm Walk"}</button>

      {sessionActive && (
        <div style={{ background:"#fff4e0", border:`2px solid ${RAS_COLOR}44`,
          borderRadius:16, padding:"12px 16px", fontSize:14,
          color:"#5a3000", lineHeight:1.6, textAlign:"center" }}>
          🚶 Walk in time with the pulses · Stay close · Stop if you feel unsteady
        </div>
      )}
      <div style={{ marginTop:14, background:G.accentLight, borderRadius:16,
        padding:"12px 16px", fontSize:14, color:"#5a5a3a", lineHeight:1.6 }}>
        💡 <strong>For carers:</strong> 20 minutes daily builds supplementary neural circuits.
        Benefits continue even after the music stops — the brain retains the rhythm pattern.
      </div>
    </div>
  );
}
