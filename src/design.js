// ── Design Tokens ────────────────────────────────────────────────────────────
// Single source of truth for all colours, typography, and spacing rules.
// Import G from this file wherever you need a colour token.

export const G = {
  primary:      "#3d6b35",  // Fern Green — nav bar, primary buttons, headers
  primaryDark:  "#2b4d25",  // Deep Forest — Now Playing bg, dark panels
  primaryLight: "#6a9464",  // Sage — secondary elements
  accent:       "#f0c93a",  // Buttercup Yellow — CTAs, play buttons, progress bars
  accentLight:  "#fdf3c0",  // Pale Butter — info panels, clinical tips
  bg:           "#f2f7f0",  // Soft Mint White — app background
  card:         "#ffffff",  // Song cards, panels
  border:       "#cce3c8",  // Light Sage — card borders, dividers
  text:         "#1a2e18",  // Dark Forest — primary body text
  textSoft:     "#5a7a56",  // Muted Sage — subtitles, labels
  calm:         "#3a7dc0",  // Steel Blue — Calm Down session
  calmLight:    "#e8f2fc",  // Sky Wash — Calm Down background
  wake:         "#d4820a",  // Amber — Wake Up session
  wakeLight:    "#fff0d8",  // Warm Cream — Wake Up background
};

// Ritual-specific colours (used inline in Daily Guide & Ritual Playlist Player)
export const RITUAL_COLORS = {
  bathing:    "#1a5a7a",  // Dark teal
  dressing:   "#8a5a00",  // Warm brown
  mealtime:   "#2a6a3a",  // Forest green
  sundowning: "#2a2a6a",  // Deep navy
};

// Global CSS keyframe animations — inject once at app root
export const GLOBAL_ANIMATIONS = `
  @keyframes wv1 { from { height: 5px } to { height: 24px } }
  @keyframes wv2 { from { height: 10px } to { height: 20px } }
  @keyframes wv3 { from { height: 5px } to { height: 28px } }
  @keyframes wv4 { from { height: 14px } to { height: 18px } }
  @keyframes wv5 { from { height: 7px } to { height: 22px } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: none } }
  @keyframes fpic   { from { opacity: 0 } to { opacity: 1 } }
  @keyframes popIn  { from { transform: scale(0.7); opacity: 0 } to { transform: scale(1); opacity: 1 } }
  @keyframes tuneBar { from { transform: scaleY(0.3) } to { transform: scaleY(1) } }
  @keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(20px) } to { opacity: 1; transform: translateX(-50%) translateY(0) } }
  @keyframes breathe { 0%, 100% { transform: scale(1) } 50% { transform: scale(1.15) } }
  @keyframes blink   { 0%, 100% { opacity: 1 } 50% { opacity: 0.3 } }
  @keyframes noteFloat { from { opacity: 1; transform: translateY(0) } to { opacity: 0; transform: translateY(-80px) } }
  @keyframes pulse   { from { opacity: 0.6 } to { opacity: 1 } }
`;

// Shared encouragement messages (used across games)
export const ENCOURAGEMENTS = [
  "Wonderful! 💛",
  "Beautiful! 🌟",
  "You're doing so well.",
  "What a lovely answer.",
  "Keep going — you're doing great.",
];
