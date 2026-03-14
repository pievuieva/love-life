# Love Life 🍋

A music-based wellbeing app for people living with dementia and their carers. Built around the clinical insight that musical memory — stored in the basal ganglia, cerebellum, and amygdala — is far more resilient to Alzheimer's than episodic memory. A person who cannot recall breakfast may still sing word-perfectly to a song from their youth.

> *"Turning lemons into lemonade"* — transforming one of the hardest human experiences into moments of connection, recognition, calm, and joy.

---

## Status

**Reference project.** This is an earlier version of the dementia care app concept. It is kept live for comparison and to preserve ideas that may be brought forward. Active development has moved to [dementia-care](https://github.com/pievuieva/dementia-care).

---

## What It Does

Five-tab mobile-first app:

| Tab | Purpose |
|-----|---------|
| 🏠 Home | Calm Down / Wake Up session launcher (Iso-Principle) |
| 🎵 Music | Memory Lane (personal 16-song library), Era Radio, Nature sounds + Sleep Timer |
| 🧩 Games | 11 music therapy activities (RAS, Sing Along, Famous Faces, etc.) |
| 💛 My Life | Photos, life story prompts, voice messages from family |
| 👨‍👩‍👧 Carers | Daily Guide, Ritual Playlists, SOS button, 5-Min Reset |

### Clinical foundations built in
- **Reminiscence Bump** — targets music from ages 15–25 (deepest encoded memories)
- **Iso-Principle** — music matches current mood, then gradually shifts toward desired state
- **RAS (Rhythmic Auditory Stimulation)** — beat entrainment for gait improvement
- **16-Song Core** — evidence minimum for effective personalised music therapy

---

## Who It's For

The **carer** is the primary operator (family member, paid carer, care home staff). The person with dementia is the beneficiary. All design decisions flow from this — the app must work for someone who has one free hand and two minutes.

Demo persona throughout the prototype: Margaret, born 1945.

---

## Tech Stack

- React 18
- Vite
- Pure inline styles (no CSS framework)
- Web Audio API (used for RAS metronome)
- No backend — all state is in-memory

---

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Project Files & Memory

Full context, decisions, and session history live in the shared project folder:

```
/Dementia-App-Files/Memory/
  GROUND-TRUTH.md              ← Start here. Full project context.
  GROUND-TRUTH-dementia-care.md
  progress-log.md              ← Running log of all sessions and decisions
```

**For new Claude sessions:** Read `GROUND-TRUTH.md` before touching any code.

---

## What's Not Built Yet

- Real audio playback (currently simulated)
- Backend / persistence (everything resets on refresh)
- User onboarding / profile setup
- Dynamic name substitution ("Margaret" is hardcoded in places)
- Music licensing solution

---

## Related Project

**[dementia-care](https://github.com/pievuieva/dementia-care)** — the current active direction. A carer operations dashboard built from a different strategic angle: logistics, planning, and emotional support rather than music therapy.
