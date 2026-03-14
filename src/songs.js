// ── Music Data ───────────────────────────────────────────────────────────────
// All song library, era station, lyric round, and instrument data.

export const MY_SONGS = [
  { id:1, title:"Moon River",                   artist:"Andy Williams",   year:1961, emoji:"🎷", note:"Danced to this at our wedding" },
  { id:2, title:"She Loves You",                artist:"The Beatles",     year:1963, emoji:"🎸", note:"Reminds me of being 16" },
  { id:3, title:"What a Wonderful World",       artist:"Louis Armstrong", year:1967, emoji:"🎺", note:"Mum used to hum this" },
  { id:4, title:"Always Look on the Bright Side",artist:"Monty Python",  year:1979, emoji:"🎭", note:"Makes me laugh every time" },
  { id:5, title:"Somewhere Over the Rainbow",   artist:"Judy Garland",   year:1939, emoji:"🌈", note:"My favourite film as a child" },
  { id:6, title:"My Way",                       artist:"Frank Sinatra",  year:1969, emoji:"🎤", note:"This is me" },
];

export const ERA_STATIONS = [
  { id:"40s", label:"1940s", emoji:"📻", desc:"Vera Lynn, Glenn Miller, Bing Crosby", color:"#5a3a1a", years:"1940–1949" },
  { id:"50s", label:"1950s", emoji:"🎷", desc:"Elvis, Buddy Holly, Doris Day",        color:"#1a3a6a", years:"1950–1959" },
  { id:"60s", label:"1960s", emoji:"🎸", desc:"The Beatles, Stones, Supremes",        color:"#1a5a2a", years:"1960–1969" },
  { id:"70s", label:"1970s", emoji:"🕺", desc:"Abba, Elton John, Bowie",             color:"#5a1a4a", years:"1970–1979" },
];

export const ERA_ICONS = [
  { name:"Frank Sinatra",   years:"1940s–60s", emoji:"🎤", color:"#1a3a6a",
    bg:"linear-gradient(135deg,#1a3a6a,#0a2040)",
    desc:"'Ol' Blue Eyes' — one of the greatest voices of the 20th century",
    songs:["My Way","Fly Me to the Moon","New York, New York"] },
  { name:"Judy Garland",    years:"1930s–60s", emoji:"🌈", color:"#6a1a5a",
    bg:"linear-gradient(135deg,#6a1a5a,#3a0a30)",
    desc:"Star of The Wizard of Oz and one of Hollywood's greatest performers",
    songs:["Somewhere Over the Rainbow","The Trolley Song","Have Yourself a Merry Little Christmas"] },
  { name:"Elvis Presley",   years:"1950s–70s", emoji:"🕺", color:"#1a5a2a",
    bg:"linear-gradient(135deg,#1a5a2a,#0a3015)",
    desc:"'The King of Rock and Roll' — changed music forever",
    songs:["Love Me Tender","Suspicious Minds","Always on My Mind"] },
  { name:"The Beatles",     years:"1960s",     emoji:"🎸", color:"#4a1a1a",
    bg:"linear-gradient(135deg,#4a1a1a,#200a0a)",
    desc:"John, Paul, George and Ringo — the most famous band in history",
    songs:["She Loves You","Hey Jude","Let It Be"] },
  { name:"Vera Lynn",       years:"1940s–50s", emoji:"💌", color:"#1a4a5a",
    bg:"linear-gradient(135deg,#1a4a5a,#0a2a35)",
    desc:"'The Forces' Sweetheart' — her voice brought comfort during the war",
    songs:["We'll Meet Again","The White Cliffs of Dover","Yours"] },
  { name:"Louis Armstrong", years:"1920s–60s", emoji:"🎺", color:"#5a3a1a",
    bg:"linear-gradient(135deg,#5a3a1a,#301808)",
    desc:"One of the most influential musicians who ever lived",
    songs:["What a Wonderful World","La Vie en Rose","Hello, Dolly!"] },
  { name:"Doris Day",       years:"1940s–60s", emoji:"🌸", color:"#5a1a3a",
    bg:"linear-gradient(135deg,#5a1a3a,#2a0818)",
    desc:"Hollywood star and beloved singer known for her warm, sunny voice",
    songs:["Que Sera, Sera","Secret Love","Whatever Will Be"] },
  { name:"Andy Williams",   years:"1950s–70s", emoji:"🎷", color:"#1a5a4a",
    bg:"linear-gradient(135deg,#1a5a4a,#0a3028)",
    desc:"His velvety voice made him one of the most popular singers of his era",
    songs:["Moon River","Can't Take My Eyes Off You","Music to Watch Girls By"] },
];

export const LYRIC_ROUNDS = [
  { line:"You are my sunshine, my only...",                                     answer:"SUNSHINE", song:"You Are My Sunshine",      artist:"Jimmie Davis",       emoji:"☀️" },
  { line:"When I find myself in times of trouble, Mother Mary comes to...",     answer:"ME",       song:"Let It Be",                 artist:"The Beatles",        emoji:"🕊️" },
  { line:"What a wonderful...",                                                  answer:"WORLD",    song:"What a Wonderful World",    artist:"Louis Armstrong",    emoji:"🌍" },
  { line:"Moon river, wider than a...",                                          answer:"MILE",     song:"Moon River",                artist:"Andy Williams",      emoji:"🎷" },
  { line:"You'll never walk...",                                                 answer:"ALONE",    song:"You'll Never Walk Alone",   artist:"Gerry & Pacemakers", emoji:"🤝" },
  { line:"Pack up your troubles in your old kit bag and smile, smile...",        answer:"SMILE",    song:"Pack Up Your Troubles",     artist:"Traditional",        emoji:"🎒" },
  { line:"We'll meet again, don't know where, don't know...",                    answer:"WHEN",     song:"We'll Meet Again",          artist:"Vera Lynn",          emoji:"💌" },
  { line:"Somewhere over the rainbow, way up...",                                answer:"HIGH",     song:"Somewhere Over the Rainbow",artist:"Judy Garland",       emoji:"🌈" },
];

export const LYRICS_LINES = [
  "Moon river, wider than a mile,",
  "I'm crossing you in style someday...",
  "Oh, dream maker, you heartbreaker,",
  "Wherever you're going, I'm going your way.",
];

export const INSTRUMENT_ROUNDS = [
  { name:"Piano",    emoji:"🎹", hint:"88 keys, black and white",    options:["Piano","Guitar","Trumpet"] },
  { name:"Violin",   emoji:"🎻", hint:"Four strings, played with a bow", options:["Violin","Flute","Drums"] },
  { name:"Trumpet",  emoji:"🎺", hint:"Bright brass sound",           options:["Trumpet","Saxophone","Piano"] },
  { name:"Guitar",   emoji:"🎸", hint:"Six strings, strummed or picked", options:["Guitar","Violin","Harp"] },
  { name:"Flute",    emoji:"🪈", hint:"Delicate, airy high notes",    options:["Flute","Trumpet","Cello"] },
  { name:"Drums",    emoji:"🥁", hint:"The heartbeat of the band",    options:["Drums","Piano","Flute"] },
];
