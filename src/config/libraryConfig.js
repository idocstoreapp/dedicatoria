/**
 * ============================================================
 *  LIBRARY CONFIG — Biblioteca de tracks "pensando en ti"
 * ============================================================
 *
 * Para agregar un nuevo track:
 * 1. Coloca el video en public/videos/nombre-del-track.mp4
 * 2. Coloca la miniatura en public/thumbs/nombre-del-track.jpg (opcional)
 * 3. Agrega el objeto aquí en el array `library`
 * 4. Define su propio `timeline` de letras (puede ser array vacío [])
 */

export const library = [
  {
    id: "track-pensar-en-ti",
    title: "Cuánto pienso en ti",
    subtitle: "Todo el tiempo. En serio.",
    category: "thoughts",
    emoji: "💭",
    color: "#8800ff",           // Color del glow y acento
    gradient: "linear-gradient(135deg, #1a0033 0%, #2d0060 100%)",
    src: "/videos/pensar-en-ti.mp4",
    thumbnail: "/thumbs/pensar-en-ti.jpg",
    timeline: [],               // ← Agrega el timeline de letras aquí
  },
  {
    id: "track-triste",
    title: "Cuando estoy triste",
    subtitle: "Pensando en ti igual.",
    category: "feelings",
    emoji: "🌧️",
    color: "#4488ff",
    gradient: "linear-gradient(135deg, #001030 0%, #002060 100%)",
    src: "/videos/triste.mp4",
    thumbnail: "/thumbs/triste.jpg",
    timeline: [],
  },
  {
    id: "track-extrano",
    title: "Cuando te extraño más",
    subtitle: "Más de lo que crees normal.",
    category: "missing",
    emoji: "🌙",
    color: "#ff4488",
    gradient: "linear-gradient(135deg, #200010 0%, #400020 100%)",
    src: "/videos/extrano.mp4",
    thumbnail: "/thumbs/extrano.jpg",
    timeline: [],
  },
  {
    id: "track-8-meses",
    title: "8 meses sin verte",
    subtitle: "Pero aquí sigo.",
    category: "time",
    emoji: "⏳",
    color: "#ffcc00",
    gradient: "linear-gradient(135deg, #1a1400 0%, #332800 100%)",
    src: "/videos/8-meses.mp4",
    thumbnail: "/thumbs/8-meses.jpg",
    timeline: [],
  },
  {
    id: "track-sonrisa",
    title: "Tu sonrisa me mata",
    subtitle: "No puedo evitarlo.",
    category: "love",
    emoji: "😍",
    color: "#ff6644",
    gradient: "linear-gradient(135deg, #2a0800 0%, #501500 100%)",
    src: "/videos/sonrisa.mp4",
    thumbnail: "/thumbs/sonrisa.jpg",
    timeline: [],
  },
  {
    id: "track-dtmf",
    title: "DTMF",
    subtitle: "Bad Bunny lo dice mejor.",
    category: "badbunny",
    emoji: "🐰",
    color: "#00ffcc",
    gradient: "linear-gradient(135deg, #001a14 0%, #003328 100%)",
    src: "/bonus-video.mp4",    // ← mismo que el bonus track
    thumbnail: "/thumbs/dtmf.jpg",
    timeline: [],
    isBonusTrack: true,         // Marcado especial
  },
];

/**
 * Categorías con etiquetas para el filtro
 */
export const categories = [
  { id: "all",      label: "Todos",              emoji: "🎵" },
  { id: "thoughts", label: "Pensando en ti",     emoji: "💭" },
  { id: "feelings", label: "Lo que siento",      emoji: "🌊" },
  { id: "missing",  label: "Te extraño",         emoji: "🌙" },
  { id: "time",     label: "El tiempo que es",   emoji: "⏳" },
  { id: "love",     label: "Con amor",           emoji: "❤️" },
  { id: "badbunny", label: "Bad Bunny",          emoji: "🐰" },
];
