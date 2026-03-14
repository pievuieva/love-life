// ── Life Story & Mood Data ───────────────────────────────────────────────────

export const LIFE_PROMPTS = [
  { icon:"👤", q:"What name do you like to be called?",             a:"Margaret",                                           cat:"About Me" },
  { icon:"🏠", q:"Where did you grow up?",                           a:"A small house in Devon. We had a big garden.",       cat:"Growing Up" },
  { icon:"👨‍👩‍👧", q:"Tell me about your family.",                      a:"I have two children — Robert and Sarah.",           cat:"My Family" },
  { icon:"🏫", q:"What do you remember about school?",               a:"I loved English lessons. My teacher was Miss Hart.", cat:"Growing Up" },
  { icon:"💕", q:"Tell me about someone special.",                    a:"My husband John. We met at a dance in 1965.",       cat:"My Family" },
  { icon:"💍", q:"Do you remember your wedding day?",                a:"It was June 1967. I wore my mother's veil.",         cat:"My Family" },
  { icon:"🎵", q:"What is your favourite song?",                      a:"Moon River. We danced to it at our wedding.",       cat:"Music" },
  { icon:"🎶", q:"What music reminds you of being young?",            a:"The Beatles — She Loves You. I was 18.",            cat:"Music" },
  { icon:"🌳", q:"Where did you feel most at home?",                  a:"In the garden, especially in summer.",              cat:"Places" },
  { icon:"✈️", q:"Have you been somewhere that meant a lot to you?",  a:"We honeymooned in Cornwall. Beautiful cliffs.",     cat:"Places" },
  { icon:"👩‍🍳", q:"Did you have a favourite meal to make?",            a:"A proper Sunday roast with all the trimmings.",     cat:"Daily Life" },
  { icon:"🎨", q:"What did you love doing in your free time?",        a:"Gardening and listening to the radio.",             cat:"Daily Life" },
  { icon:"😂", q:"What makes you laugh?",                             a:"Monty Python — always silly.",                      cat:"Joy" },
  { icon:"🌟", q:"What are you most proud of?",                       a:"Raising my children. They are wonderful.",          cat:"Joy" },
  { icon:"😊", q:"I am happiest when...",                             a:"In the garden, listening to the birds.",            cat:"Joy" },
  { icon:"💛", q:"What would you want people to know about you?",     a:"That I always tried my best.",                      cat:"About Me" },
];

export const SELF_REASSURANCE_PROMPTS = [
  "I am safe and I am loved.",
  "I have lived a wonderful life.",
  "My family are always with me in my heart.",
  "I am still me. Music helps me remember who I am.",
  "I have got through hard days before. I can do it again.",
  "I am Margaret, and I matter.",
];

// Mood tags used in TagFeedbackModal and CarerInsights
export const MOOD_TAGS = [
  { id:"calming",    emoji:"😌", label:"Calming",        color:"#3a7dc0" },
  { id:"uplifting",  emoji:"😄", label:"Uplifting",      color:"#c8880a" },
  { id:"comforting", emoji:"🤗", label:"Comforting",     color:"#6a9464" },
  { id:"energising", emoji:"⚡", label:"Energising",     color:"#c0453a" },
  { id:"me",         emoji:"🌟", label:"Feeling myself", color:"#8a6abd" },
  { id:"avoid",      emoji:"🚫", label:"Avoid next time",color:"#999" },
];

// Simplified mood choices used in MoodPainterGame (4 large options)
export const MOOD_CHOICES = [
  { emoji:"😌", label:"Calm",     color:"#3a7dc0" },
  { emoji:"😄", label:"Happy",    color:"#c8880a" },
  { emoji:"🥲", label:"Emotional",color:"#8a6abd" },
  { emoji:"💃", label:"Energetic",color:"#c0453a" },
];

// Demo voice messages (used in MyLifeScreen and MessageFromHomeGame)
export const DEMO_MESSAGES = [
  { from:"Sarah (daughter)", emoji:"👩", text:"Hi Mum, it's Sarah. We're all thinking of you today and sending you so much love. We'll see you on Sunday! 💛" },
  { from:"James (grandson)", emoji:"👦", text:"Hi Grandma! It's James. I hope you're having a lovely day. I miss your hugs! Love you lots." },
  { from:"Robert (son)",     emoji:"👨", text:"Hello Mum, it's Robert. Just wanted you to know how much we love you. Your favourite song is coming up next!" },
];
