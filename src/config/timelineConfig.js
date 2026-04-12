/**
 * ============================================================
 *  TIMELINE CONFIG — Dedicatoria Audiovisual
 *  Dany Ocean Casaparlante Session
 * ============================================================
 *
 * CANCIONES:
 *   0:00  → Babylon Girl  (Dany Ocean)  — canta ~1:00
 *   2:58  → Vitamina      (Dany Ocean)  — canta 2:58
 *   4:34  → Volaré        (Dany Ocean)  — canta 4:50 · título 4:45
 *   6:43  → Crayola       (Dany Ocean)  — canta 6:55 · MINIJUEGO 6:57-10:00
 *  10:10  → Corazón       (Dany Ocean)  — canta 10:30
 *
 * TIPOS DE EVENTO:
 *   "lyric"             → texto sincronizado con el video
 *   "song-notification" → toast de "reproduciendo ahora"
 *   "chat"              → mensaje de J. en el chat
 *   "minigame"          → minijuego de elige 3 de 6 en el chat
 *   "blackout"          → fondo negro total
 *   "scene"             → fondo de partículas
 *   "beat"              → glow exterior del player al BPM
 *   "tour"              → anillo pulsante sobre elemento UI
 *   "effect"            → flash | shake
 *   "superlike"         → botón ❤️ en modo arcoíris
 *
 * POSICIONES (`position`):
 *   "center" | "top" | "bottom" | "top-bar" | "bottom-bar"
 *
 * ANIMACIONES (`animation`):
 *   "fade" | "zoom" | "slide" | "bounce"
 *   "theater" | "snake-loop" | "rainbow" | "glow" | "aura" | "arc"
 *
 * LYRIC DESTACADA:
 *   feature: true  → arcos decorativos + glow alrededor del texto
 */

// Helper: convierte "m:ss" → segundos
const t = (timestamp) => {
  const [m, s] = timestamp.split(':').map(Number);
  return m * 60 + (s || 0);
};

export const timeline = [

  // ══════════════════════════════════════════════════════════
  //  TOUR DE BIENVENIDA  (0 – 15.5s)
  //  Negro total. El video ya está buffereando en fondo.
  // ══════════════════════════════════════════════════════════
  { id: "tour-blackout", start: 0, end: 15.5, type: "blackout" },
  {
    id: "beat-tour", start: 0, end: 157.5, type: "beat",
    color: "#2aff7cff", colorB: "#8b26e4ff", bpm: 25, intensity: 0.8
  },

  // Título de la sesión
  {
    id: "tour-sesion", start: 0.5, end: 3.5, type: "lyric",
    content: "Dany Ocean · Casaparlante", style: "minimal",
    animation: "fade", position: "center",
  },

  // Enfoca botón ❤️
  {
    id: "lyric-tour-like", start: 3.5, end: 7, type: "lyric",
    content: "te dejé un ❤️\npara cuando te esté gustando",
    style: "minimal", animation: "fade", position: "center",
  },
  {
    id: "tour-like", start: 3.5, end: 7, type: "tour",
    target: "like-btn", tip: "dale ❤️ cuando quieras", tipPosition: "left",
  },

  // Enfoca botón play
  {
    id: "lyric-tour-play", start: 7.5, end: 11, type: "lyric",
    content: "un boton de play/pausa para... bueno ya sabes para que sirve jjj",
    style: "minimal", animation: "fade", position: "center",
  },
  {
    id: "tour-play", start: 7.5, end: 11, type: "tour",
    target: "mini-pause-btn", tip: "pausa cuando quieras", tipPosition: "right",
  },

  // Gancho final del tour
  {
    id: "tour-robar", start: 11.5, end: 15.5, type: "lyric",
    content: "espero hacerte compañia estos 20 minutos\nque te voy a robar...",
    style: "minimal", animation: "fade", position: "center",
  },

  // ══════════════════════════════════════════════════════════
  //  VIDEO APARECE (15.5+)
  // ══════════════════════════════════════════════════════════

  // Escenas de fondo
  { id: "scene-babylon", start: 15.5, end: t("2:58"), type: "scene", scene: "starfield" },
  { id: "scene-vitamina", start: t("2:58"), end: t("4:34"), type: "scene", scene: "hearts-background" },
  { id: "scene-volare", start: t("4:34"), end: t("6:43"), type: "scene", scene: "neon-rain" },
  { id: "scene-crayola", start: t("6:43"), end: t("10:10"), type: "scene", scene: "starfield" },
  { id: "scene-corazon", start: t("10:10"), end: 999, type: "scene", scene: "minimal-blur" },

  // Beat glow exterior continuo
  {
    id: "beat-main", start: 15.5, end: 999, type: "beat",
    color: "#ff4488", colorB: "#8800ff", bpm: 85, intensity: 0.4,
  },

  // Spotlight en el chat al inicio
  {
    id: "tour-chat-focus", start: 16, end: 20, type: "tour",
    target: "chat-panel", tip: "también hay un chat para ti 💬", tipPosition: "top",
  },

  // ══════════════════════════════════════════════════════════
  //  ♪ BABYLON GIRL  —  inicio 0:00, canta ~1:00
  // ══════════════════════════════════════════════════════════

  // Notificación de canción
  {
    id: "song-babylon", start: 11.5, end: 15, type: "song-notification",
    title: "Imaginate", artist: "Dany Ocean",
  },

  // Primer mensaje del chat (alerta especial 2s antes = seg 26)
  {
    id: "chat-hola", start: 28, type: "chat", from: "j",
    text: "Holass :v estare por aqui viendo el video jjj..."
  },
  {
    id: "chat-like-tip", start: 36, type: "chat", from: "j",
    text: "dale muchos likes si te gusta mucho :3"
  },

  // Lyrics de Babylon Girl (aproximadas, ajusta con debugMode: true)
  //   Nota: los tiempos están en segundos desde el inicio del video.
  //   La canción empieza a sonar en el segundo 0 del video.
  //   Babylon Girl empieza a cantar aproximadamente en el minuto 1:00.
  {
    id: "bg-1", start: 15, end: 17, type: "lyric",
    content: "imaginate en la playa los dos",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "bg-2", start: 17.2, end: 19.8, type: "lyric",
    content: "Con ninguna tendras que competir",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "bg-3", start: 20, end: 21.9, type: "lyric",
    content: "repetia toa' tus notas de voz",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "bg-4", start: 22, end: 25, type: "lyric",
    content: "Pero ahora mira te tengo aqui",
    style: "urban", animation: "glow", position: "center-bar", feature: true,
  },
  {
    id: "bg-5", start: 25.2, end: 29, type: "lyric",
    content: "cuando te vuelva a ver, quiero que nos parchemos en el Altoque",
    style: "urban", animation: "glow", position: "center- bar", feature: true,
  },
  {
    id: "bg-6", start: 28.6, end: 33, type: "lyric",
    content: "Que estemos tú y yo, que andemo' en otra y que nada importe",
    style: "urban", animation: "glow", position: "center-bar", feature: true,
  },

  {
    id: "bg-7", start: 33.5, end: 38, type: "lyric",
    content: "Y sabes que eres mía la vida es fresca como tú escote",
    style: "urban", animation: "fade", position: "center  -bar",
  },
  {
    id: "bg-8", start: 38.3, end: 41.8, type: "lyric",
    content: "Nos vamos pa cali, bailamos salsa toda la noche",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "bg-9", start: 43, end: 44, type: "lyric",
    content: "Hay una playa solo falta tu y yo",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "bg-10", start: 44.9, end: 47.6, type: "lyric",
    content: "yo soy tu visa por si quieres venir",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "bg-11", start: 48.6, end: 50, type: "lyric",
    content: "tu eres una mezcla de arena con sol",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "bg-12", start: 49.8, end: 51.8, type: "lyric",
    content: "La mas linda que he visto así por ahí",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "bg-12", start: 52, end: 57.6, type: "lyric",
    content: "tu eres una mezcla de arena con sol, arena con sol y BRISA",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "bg-13", start: 57.7, end: 59.8, type: "lyric",
    content: "Tu eres lo que hace falta",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "bg-14", start: 60, end: 61.8, type: "lyric",
    content: "Pa una vida feliz",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "bg-marquee-1", start: 62, end: 66.5, type: "lyric",
    content: "CUANDO PUEDA VOLVER QUISIERA LLEVARTE A LOS ROQUES",
    style: "urban", animation: "dedication", position: "center", feature: true,
  },
  {
    id: "bg-15", start: 67, end: 70.8, type: "lyric",
    content: "Mami yo tengo un pana que nos va a cuadrar el bote",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "bg-16", start: 71, end: 75, type: "lyric",
    content: "Que conozcas mis mares su cielo y todos sus colores",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "bg-17", start: 75.5, end: 80, type: "lyric",
    content: "Quiero caerte a besos besos y bailar toda la noche",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "bg-18", start: 81, end: 85.3, type: "lyric",
    content: "Ay, como un demente, con mi mente la haré",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "bg-19", start: 86, end: 89, type: "lyric",
    content: "Tú, mi Babylon girl, tu sonrisa angelical, eso fue que me tragué",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "bg-20", start: 90, end: 93.8, type: "lyric",
    content: "Y como un demente, con mi mente te manifesté",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "bg-21", start: 94, end: 98.8, type: "lyric",
    content: "Una Cali baby girl, casi caribeña girl, doradita es su piel",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "bg-22", start: 99.1, end: 104.8, type: "lyric",
    content: "Ay, me tiene aniquilado, desde lejos se le veVara más, como dirá, par de besos me trae",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "bg-23", start: 105, end: 109.6, type: "lyric",
    content: "No es normal lo que me transmite Verle a los ojos hace que levite",
    style: "urban", animation: "fade", position: "center-bar",
  },

  //
  //Tu energía, mami, la tienes transparente
  //Y yo, se siente, babe, se siente
  //Yo te llevo cuando cambien el presidente
  {
    id: "bg-24", start: 110, end: 113.5, type: "lyric",
    content: "Y yeah, y se siente, ma, se siente",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "bg-25", start: 114, end: 115, type: "lyric",
    content: "Tu energía, mami, la tienes transparente",
    style: "urban", animation: "fade", position: "center-bar",
  },

  ,
  {
    id: "bg-26", start: 115.4, end: 118, type: "lyric",
    content: "Y yo, se siente, babe, se siente",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "bg-marquee-2", start: 118.5, end: 119.5, type: "lyric",
    content: "Yo te llevo cuando cambien el presidente",
    style: "urban", animation: "snake-loop", position: "center",
  },
  {
    id: "bg-27", start: 120.2, end: 126, type: "lyric",
    content: "cuando te vuelva a ver, quiero que nos parchemos en el Altoque",
    style: "urban", animation: "glow", position: "center-bar", feature: true,
  },
  {
    id: "bg-28", start: 126.1, end: 130, type: "lyric",
    content: "Que estemos tú y yo, que andemo' en otra y que nada importe",
    style: "urban", animation: "glow", position: "center-bar", feature: true,
  },

  {
    id: "bg-2 9", start: 130.3, end: 135, type: "lyric",
    content: "Y sabes que eres mía la vida es fresca como tú escote",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "bg-30", start: 135.3, end: 139.8, type: "lyric",
    content: "Nos vamos pa cali, bailamos salsa toda la noche",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "chat-temazo", start: 139.5, type: "chat", from: "j",
    text: "TEMAZOOOOOOO"
  },
  {
    id: "bg-marquee-3", start: 140, end: 144, type: "lyric",
    content: "CUANDO PUEDA VOLVER QUISIERA LLEVARTE A LOS ROQUES",
    style: "urban", animation: "snake-loop", position: "top-bar",
  },
  {
    id: "bg-31", start: 144.7, end: 148.8, type: "lyric",
    content: "Mami yo tengo un pana que nos va a cuadrar el bote",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "bg-32", start: 149, end: 153, type: "lyric",
    content: "Que conozcas mis mares su cielo y todos sus colores",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "bg-33", start: 153.5, end: 157.5, type: "lyric",
    content: "Quiero caerte a besos besos y bailar toda la noche",
    style: "urban", animation: "fade", position: "center-bar",
  },



  {
    id: "bg-superlike", start: 150, end: 165, type: "lyric",
    content: "Quiero caerte a besos, besos\ny bailar toda la noche",
    style: "urban", animation: "aura", position: "center", feature: true,
  },
  { id: "superlike-bg", start: 150, end: 165, type: "superlike" },
  { id: "effect-bg-1", start: 150, type: "effect", effect: "flash" },

  // ══════════════════════════════════════════════════════════
  //  ♪ VITAMINA  —  2:58  (178s)
  // ══════════════════════════════════════════════════════════
  {
    id: "beat-vitamina", start: 157.6, end: 178, type: "beat",
    color: "#2aff7cff", colorB: "#8b26e4ff", bpm: 85, intensity: 0.5
  },
  {
    id: "song-vitamina", start: t("2:58"), end: t("3:08"), type: "song-notification",
    title: "Vitamina", artist: "Dany Ocean",
  },

  // Lyrics de Vitamina (canta desde 2:58)
  {
    id: "vit-1", start: t("2:58"), end: t("3:04"), type: "lyric",
    content: "¿Qué hubiera pasado",
    style: "romantic", animation: "fade", position: "bottom-bar",
  },
  {
    id: "vit-2", start: t("3:04"), end: t("3:12"), type: "lyric",
    content: "si tú y yo hubiésemos seguido esos besos",
    style: "romantic", animation: "fade", position: "bottom-bar",
  },
  {
    id: "vit-3", start: t("3:12"), end: t("3:22"), type: "lyric",
    content: "Tú y yo\nacostados en la playa viendo caer el sol",
    style: "romantic", animation: "zoom", position: "center", feature: true,
  },
  {
    id: "vit-4", start: t("3:22"), end: t("3:30"), type: "lyric",
    content: "Aunque nunca te lo dije,\nyo soy tuyo, mi amor",
    style: "romantic", animation: "glow", position: "center", feature: true,
  },
  {
    id: "vit-5", start: t("3:30"), end: t("3:40"), type: "lyric",
    content: "Tú y yo, ¿te imaginas?\nun amor que no se termina",
    style: "romantic", animation: "arc", position: "center",
  },
  {
    id: "vit-6", start: t("3:40"), end: t("3:50"), type: "lyric",
    content: "es como vitamina, tú y yo ❤️",
    style: "romantic", animation: "aura", position: "center", feature: true,
  },
  { id: "superlike-vit", start: t("3:22"), end: t("3:50"), type: "superlike" },
  { id: "effect-vit-1", start: t("3:22"), type: "effect", effect: "flash" },

  // Interacción antes de Volaré (4:34–4:47)
  {
    id: "chat-vitamina-end", start: t("4:00"), type: "chat", from: "j",
    text: "¿conocías Vitamina? 🎵",
    quickReplies: ["Sí, la conozco 🎶", "¡Ahora sí! 😍", "No la conocía"],
    conditionalReplies: [
      { match: ["sí", "si", "conozco", "conocía"], response: "sabía que sí 😏" },
      { match: ["ahora", "ahora sí", "😍"], response: "genial que te haya gustado 🌹" },
      { match: ["no", "conocía"], response: "bueno, ya la conoces 😌 te la regalo" },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  ♪ VOLARÉ  —  4:34  (274s) · canta 4:50 (290s) · título 4:45 (285s)
  // ══════════════════════════════════════════════════════════

  // Notificación (4:45 = 285s)
  {
    id: "song-volare", start: 285, end: 295, type: "song-notification",
    title: "Volaré", artist: "Dany Ocean",
  },

  // Lyrics de Volaré (canta desde 4:50 = 290s)
  {
    id: "vol-1", start: 290, end: 296, type: "lyric",
    content: "Volaré contigo",
    style: "urban", animation: "theater", position: "center", feature: true,
  },
  {
    id: "vol-2", start: 296, end: 302, type: "lyric",
    content: "Danzaré contigo",
    style: "urban", animation: "theater", position: "center",
  },
  {
    id: "vol-3", start: 302, end: 308, type: "lyric",
    content: "Me besaré contigo",
    style: "urban", animation: "theater", position: "center",
  },
  {
    id: "vol-4", start: 308, end: 316, type: "lyric",
    content: "Siendo novios o amigos",
    style: "urban", animation: "fade", position: "bottom-bar",
  },
  {
    id: "vol-5", start: 316, end: 324, type: "lyric",
    content: "Te amaré por siempre\naunque no estés aquí conmigo",
    style: "romantic", animation: "glow", position: "center", feature: true,
  },
  { id: "superlike-vol", start: 316, end: 328, type: "superlike" },
  { id: "effect-vol-1", start: 316, type: "effect", effect: "flash" },

  {
    id: "vol-6", start: 328, end: 336, type: "lyric",
    content: "Me pones romántico ❤️\ny eso que estás del otro lado del Atlántico",
    style: "romantic", animation: "fade", position: "bottom-bar",
  },
  {
    id: "vol-marquee-1", start: 336, end: 348, type: "lyric",
    content: "Bambina, se siente fantástico  •  Te mando un beso elástico",
    style: "minimal", animation: "snake-loop", position: "top-bar",
  },
  {
    id: "vol-7", start: 348, end: 356, type: "lyric",
    content: "Yo voy, tú ven, tú ven, yo voy",
    style: "urban", animation: "slide", position: "bottom-bar",
  },
  {
    id: "vol-8", start: 356, end: 365, type: "lyric",
    content: "Hey, quiero ser tu babylon boy 🌊",
    style: "urban", animation: "rainbow", position: "center", feature: true,
  },
  {
    id: "vol-9", start: 370, end: 378, type: "lyric",
    content: "Buongiorno, principessa\namore mio 💋",
    style: "romantic", animation: "arc", position: "center",
  },
  {
    id: "vol-10", start: 395, end: 403, type: "lyric",
    content: "Volaré contigo, mami\nBailaré contigo",
    style: "urban", animation: "theater", position: "center", feature: true,
  },
  { id: "effect-vol-2", start: 395, type: "effect", effect: "shake" },

  // ══════════════════════════════════════════════════════════
  //  ♪ CRAYOLA  —  6:43 (403s) · canta 6:55.5 (415.5s)
  //  MINIJUEGO: 6:57 (417s) – 10:00 (600s)
  // ══════════════════════════════════════════════════════════

  {
    id: "song-crayola", start: t("6:43"), end: t("6:53"), type: "song-notification",
    title: "Crayola", artist: "Dany Ocean",
  },

  // Lyrics Crayola (canta desde 6:55.5 = 415.5s)
  {
    id: "cr-1", start: 415.5, end: 421, type: "lyric",
    content: "Qué loco que me pongo todo loco\ncada vez que te veo",
    style: "urban", animation: "fade", position: "bottom-bar",
  },
  {
    id: "cr-2", start: 421, end: 427, type: "lyric",
    content: "Cada vez que me escribes,\nja, me enamoro feo",
    style: "urban", animation: "slide", position: "bottom-bar",
  },
  {
    id: "cr-3", start: 427, end: 434, type: "lyric",
    content: "Oh, se me mueve el piso\ncuando pisas la casa",
    style: "romantic", animation: "zoom", position: "bottom-bar",
  },
  {
    id: "cr-4", start: 434, end: 442, type: "lyric",
    content: "Yo te extraño tanto por dentro\ny ya no es un secreto",
    style: "romantic", animation: "glow", position: "center", feature: true,
  },
  { id: "superlike-cr-1", start: 434, end: 445, type: "superlike" },
  { id: "effect-cr-1", start: 434, type: "effect", effect: "flash" },

  {
    id: "cr-5", start: 445, end: 453, type: "lyric",
    content: "Tú me tienes viendo colores 🌈",
    style: "urban", animation: "rainbow", position: "center", feature: true,
  },
  {
    id: "cr-6", start: 453, end: 460, type: "lyric",
    content: "Amarillo sol, ojos de girasoles",
    style: "urban", animation: "theater", position: "bottom-bar",
  },
  {
    id: "cr-7", start: 460, end: 467, type: "lyric",
    content: "Azul playita y caracoles",
    style: "urban", animation: "theater", position: "bottom-bar",
  },
  {
    id: "cr-8", start: 467, end: 475, type: "lyric",
    content: "Estrellita, ¿dónde estás?\nOjalá no seas fugaz",
    style: "romantic", animation: "arc", position: "center",
  },
  {
    id: "cr-9", start: 475, end: 484, type: "lyric",
    content: "Voy a darte amor\ny hacerte la paz",
    style: "romantic", animation: "glow", position: "center", feature: true,
  },
  {
    id: "cr-10", start: 484, end: 492, type: "lyric",
    content: "Tú me pintas la vida,\npareces Crayola 🎨",
    style: "urban", animation: "rainbow", position: "center", feature: true,
  },
  { id: "effect-cr-2", start: 484, type: "effect", effect: "flash" },
  {
    id: "cr-marquee-1", start: 492, end: 504, type: "lyric",
    content: "¿Alguien como tú por qué está bailando sola?  •  Te escribo poemas, te canto la zona",
    style: "minimal", animation: "snake-loop", position: "top-bar",
  },
  {
    id: "cr-11", start: 504, end: 513, type: "lyric",
    content: "Tú eres la única que me conoces\nte conozco de memoria",
    style: "romantic", animation: "aura", position: "center", feature: true,
  },
  { id: "superlike-cr-2", start: 504, end: 518, type: "superlike" },

  // Estribillo final Crayola
  {
    id: "cr-12", start: 530, end: 540, type: "lyric",
    content: "Tú me tienes viendo colores\namarillo sol, ojos de girasoles 🌻",
    style: "urban", animation: "aura", position: "center", feature: true,
  },
  {
    id: "cr-13", start: 551, end: 558, type: "lyric",
    content: "Babylon Girl 🌊",
    style: "urban", animation: "theater", position: "center", feature: true,
  },
  { id: "effect-cr-3", start: 551, type: "effect", effect: "flash" },

  // ══════════════════════════════════════════════════════════
  //  MINIJUEGO  —  6:57 (417s) – 10:00 (600s)
  //  Se activa en el chat. Ella elige 3 cosas de 6 opciones.
  //  Configura las respuestas en el campo `options → answer`.
  // ══════════════════════════════════════════════════════════
  {
    id: "minigame-1",
    start: t("6:57"),
    end: t("10:00"),
    type: "minigame",
    intro: "hey... aprovecho que Crayola es lentita 😌\nhay algo que quiero que sepas.\nelige 3 cosas 🌹",
    maxChoices: 3,
    options: [
      {
        id: "mg-a",
        label: "¿Por qué yo?",
        answer: "Porque cuando entras a un lugar, el aire cambia. No sé explicarlo, pero lo siento.",
      },
      {
        id: "mg-b",
        label: "¿Qué sientes por mí?",
        answer: "Algo que no sé muy bien cómo llamar. Pero que no quiero que se vaya.",
      },
      {
        id: "mg-c",
        label: "¿Me extrañas?",
        answer: "Más de lo que crees. Más de lo que yo mismo esperaba. Sí.",
      },
      {
        id: "mg-d",
        label: "¿Qué esperas de esto?",
        answer: "Nada y todo. Que existas en mi vida de alguna forma, come lo quieras llamar.",
      },
      {
        id: "mg-e",
        label: "¿Volverías a elegirme?",
        answer: "Mil veces. Sin dudarlo. En cualquier universo paralelo.",
      },
      {
        id: "mg-f",
        label: "¿Por qué esta experiencia?",
        answer: "Porque a veces las palabras me quedan cortas, y la música dice lo que yo no puedo.",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  //  ♪ CORAZÓN  —  10:10 (610s) · canta 10:30 (630s)
  // ══════════════════════════════════════════════════════════

  {
    id: "song-corazon", start: t("10:10"), end: t("10:20"), type: "song-notification",
    title: "Corazón", artist: "Dany Ocean",
  },

  // Lyrics de Corazón (canta desde 10:30 = 630s)
  {
    id: "co-1", start: 630, end: 636, type: "lyric",
    content: "No había ninguna intención",
    style: "romantic", animation: "fade", position: "bottom-bar",
  },
  {
    id: "co-2", start: 636, end: 643, type: "lyric",
    content: "Solo una tensión\nentre nosotros",
    style: "romantic", animation: "fade", position: "bottom-bar",
  },
  {
    id: "co-3", start: 643, end: 651, type: "lyric",
    content: "Era tanta la magia, baby\nque se veía hasta en las fotos",
    style: "romantic", animation: "glow", position: "center",
  },
  {
    id: "co-4", start: 651, end: 659, type: "lyric",
    content: "Hubo un fallo en la dirección\nera tu cama, no tu corazón",
    style: "urban", animation: "theater", position: "bottom-bar",
  },
  {
    id: "co-5", start: 659, end: 669, type: "lyric",
    content: "Hicimos el amor una y otra vez\nno sé cómo explicarlo, baby",
    style: "romantic", animation: "fade", position: "bottom-bar",
  },
  {
    id: "co-6", start: 669, end: 679, type: "lyric",
    content: "¿Y ahora cómo te digo\nque me enamoré?",
    style: "romantic", animation: "arc", position: "center", feature: true,
  },
  { id: "superlike-co-1", start: 669, end: 682, type: "superlike" },
  { id: "effect-co-1", start: 669, type: "effect", effect: "flash" },

  {
    id: "co-7", start: 695, end: 705, type: "lyric",
    content: "Ya no quiero manejar\nsi no vas a estar tú de copiloto",
    style: "romantic", animation: "fade", position: "bottom-bar",
  },
  {
    id: "co-8", start: 705, end: 714, type: "lyric",
    content: "La culpa es de tu cara\nque la veo y me vuelvo loco",
    style: "romantic", animation: "glow", position: "center", feature: true,
  },
  {
    id: "co-9", start: 730, end: 741, type: "lyric",
    content: "¿Y ahora cómo te digo\nque me enamoré?",
    style: "romantic", animation: "aura", position: "center", feature: true,
  },
  { id: "superlike-co-2", start: 730, end: 745, type: "superlike" },
  { id: "effect-co-2", start: 730, type: "effect", effect: "flash" },

  {
    id: "co-10", start: 755, end: 764, type: "lyric",
    content: "De tu piel, de tu boca\nde cómo hablas de tus cosas",
    style: "romantic", animation: "fade", position: "bottom-bar",
  },
  {
    id: "co-11", start: 764, end: 773, type: "lyric",
    content: "De cómo esquivas los «te quiero»\ntú me encanta' porque estás loca",
    style: "romantic", animation: "slide", position: "bottom-bar",
  },
  {
    id: "co-12", start: 773, end: 784, type: "lyric",
    content: "Fue tan fácil para ti enamorarme\ncon tu corazón 💖",
    style: "romantic", animation: "arc", position: "center", feature: true,
  },
  { id: "superlike-co-3", start: 773, end: 790, type: "superlike" },
  { id: "effect-co-3", start: 773, type: "effect", effect: "flash" },

  // Marquee final Corazón
  {
    id: "co-marquee-final", start: 790, end: 810, type: "lyric",
    content: "Fue tan fácil para ti enamorarme  •  con tu corazón",
    style: "urban", animation: "snake-loop", position: "top-bar",
  },

  // ══════════════════════════════════════════════════════════
  //  CRÉDITOS + ÚLTIMO TRAMO
  //  13:13 (793s) → 15:12 (912s)
  //  Negro total mientras corren los créditos.
  //  La canción "Sin Mirar Atrás" / "Me Rehúso" corre de fondo.
  // ══════════════════════════════════════════════════════════

  { id: "credits-blackout", start: 793, end: 912, type: "blackout" },

  // Texto de créditos (letras sobre el negro)
  {
    id: "credits-1", start: 795, end: 838, type: "lyric",
    content: "este video dura 16 minutos\nsu edición tardó ~50 horas",
    style: "minimal", animation: "fade", position: "center",
  },
  {
    id: "credits-2", start: 843, end: 888, type: "lyric",
    content: "durante todo ese tiempo\nllegué a una conclusión...",
    style: "romantic", animation: "fade", position: "center",
  },
  {
    id: "credits-3", start: 893, end: 908, type: "lyric",
    content: "de todas las canciones,\nla que más me gusta eres tú. 🌹",
    style: "romantic", animation: "arc", position: "center", feature: true,
  },

  // ── J. cantando en mayúsculas ─────────────────────────────
  // 14:13 = 853s — versión gritada de la mejor parte
  {
    id: "chat-canta-1",
    start: 853, type: "chat", from: "j",
    text: "SIN MIRAR ATRÁS, SIN BUSCAR A NADIE MÁS 🎤\nSOLO QUIERO ESTAR CONTIGO, WOH",
  },

  // Superlike + flash durante la parte cantada
  { id: "superlike-credits", start: 853, end: 890, type: "superlike" },
  { id: "effect-credits-1", start: 853, type: "effect", effect: "flash" },

  // 14:31–14:41 = 871–881s — tres mensajes gritados
  {
    id: "chat-canta-2",
    start: 871, type: "chat", from: "j",
    text: "Y DALE TIEMPOOOOOO 🎶\nMAMI, AL TIEMPOOO",
  },
  {
    id: "chat-canta-3",
    start: 876, type: "chat", from: "j",
    text: "QUE TTUUUUU QUE YOOOO",
  },
  {
    id: "chat-canta-4",
    start: 881, type: "chat", from: "j",
    text: "ESTAMOS HECHOS PARA ESTAR LOS DOS ❤️❤️❤️",
  },
  { id: "effect-credits-2", start: 871, type: "effect", effect: "shake" },
  { id: "effect-credits-3", start: 881, type: "effect", effect: "flash" },

  // ── Minijuego: canción favorita (895s = ~14:55) ──────────
  {
    id: "minigame-fav",
    start: 895,
    end: 912,
    type: "minigame",
    intro: "espero que te haya gustado ❤️\n¿cuál fue tu canción favorita?",
    maxChoices: 1,
    endMessage: "me alegra saberlo 🌹",
    options: [
      {
        id: "f1", label: "Babylon Girl 🌊",
        answer: "esa fue la primera que pensé cuando empecé a hacer esto 🌊",
      },
      {
        id: "f2", label: "Vitamina 💊",
        answer: "Vitamina... sí, creo que describes bien lo que me haces 😊",
      },
      {
        id: "f3", label: "Volaré ✈️",
        answer: "Volaré contigo, mami — eso sigue siendo el plan ✈️",
      },
      {
        id: "f4", label: "Crayola 🎨",
        answer: "tú me pintas la vida, pareces Crayola 🎨 — justo así",
      },
      {
        id: "f5", label: "Corazón 💖",
        answer: "¿Y ahora cómo te digo que me enamoré? — esa la elegí llorando 💫",
      },
      {
        id: "f6", label: "Me Rehúso 🎵",
        answer: "me rehúso a darte un último beso... así que guárdalo 💋",
      },
    ],
  },

  // ── "¿La cantamos una vez más?" ── 15:08–15:12 (908–912s) ─
  {
    id: "lyric-last-cta", start: 908, end: 912, type: "lyric",
    content: "¿la cantamos una vez más? 🎵",
    style: "romantic", animation: "zoom", position: "center",
  },

  // ══════════════════════════════════════════════════════════
  //  ♪ ME REHÚSO  —  15:12 (912s) · canta 15:12.5 (912.5s)
  // ══════════════════════════════════════════════════════════
  {
    id: "song-merehuso", start: 912, end: 922, type: "song-notification",
    title: "Me Rehúso", artist: "Dany Ocean",
  },

  {
    id: "mr-1", start: 912.5, end: 919, type: "lyric",
    content: "Y baby, no (baby, no)",
    style: "romantic", animation: "fade", position: "bottom-bar",
  },
  {
    id: "mr-2", start: 919, end: 928, type: "lyric",
    content: "Me rehúso a darte un último beso\nasí que guárdalo",
    style: "romantic", animation: "glow", position: "center", feature: true,
  },
  { id: "superlike-mr-1", start: 919, end: 932, type: "superlike" },
  { id: "effect-mr-1", start: 919, type: "effect", effect: "flash" },

  {
    id: "mr-3", start: 928, end: 936, type: "lyric",
    content: "para que la próxima vez\nte lo dé haciéndolo",
    style: "romantic", animation: "slide", position: "bottom-bar",
  },
  {
    id: "mr-4", start: 936, end: 948, type: "lyric",
    content: "haciéndotelo así, así\nasí como te gusta, baby 💋",
    style: "romantic", animation: "arc", position: "center", feature: true,
  },
  { id: "superlike-mr-2", start: 936, end: 952, type: "superlike" },
  { id: "effect-mr-2", start: 940, type: "effect", effect: "shake" },

  // Marquee final de cierre
  {
    id: "mr-marquee-final", start: 950, end: 975, type: "lyric",
    content: "Me rehúso  •  Me rehúso  •  Me rehúso  •  baby, no",
    style: "urban", animation: "snake-loop", position: "top-bar",
  },

];


// ═══════════════════════════════════════════════════════════
//  CHAT CONFIG
// ═══════════════════════════════════════════════════════════
export const chatConfig = {
  sender: {
    name: "J.",
    photo: "/perfil1.jpg",
    initial: "J",
  },
  recipient: {
    name: "chica linda",
    photo: null,
    initial: "♡",
  },
};

// ═══════════════════════════════════════════════════════════
//  VIDEO CONFIG
// ═══════════════════════════════════════════════════════════
export const videoConfig = {
  src: "https://pub-89bdd442dec64f17a50199b18b596e11.r2.dev/video.mp4?v=2",

};

// ═══════════════════════════════════════════════════════════
//  BONUS CONFIG
// ═══════════════════════════════════════════════════════════
export const bonusConfig = {
  enabled: true,
  teaser: {
    line1: "No me quería quedar con las ganas de decírtelo...",
    line2: "Solo Bad Bunny puede decirlo 🐰",
    ctaText: "Escuchar la dedicatoria final →",
    delayBeforeCTA: 4000,
  },
  video: {
    src: "/bonus-video.mp4",
    title: "DTMF",
    artist: "Bad Bunny",
    coverColor: "#1a0033",
  },
  redirectToLibrary: true,
};

// ═══════════════════════════════════════════════════════════
//  INTERACTION CONFIG
// ═══════════════════════════════════════════════════════════
export const interactionConfig = {
  showMessageFormOnEnd: true,
  messageFormEndpoint: 'https://formspree.io/f/TU_ENDPOINT_AQUI',
};

// ═══════════════════════════════════════════════════════════
//  PROJECT CONFIG
// ═══════════════════════════════════════════════════════════
export const projectConfig = {
  title: "Mi Dedicatoria",
  recipientName: "chica linda",
  debugMode: false,   // ← pon true para ver el panel de segundos
};
