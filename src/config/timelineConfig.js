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
    id: "vit-1", start: 177.3, end: 183, type: "lyric",
    content: "¿Qué hubiera pasado si tú y yo hubiésemos seguido esos besos?",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "vit-2", start: 185, end: 188.8, type: "lyric",
    content: "¿Si ese día, de haber hecho el amor, hubiese estado confeso?",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "vit-3", start: 189, end: 191, type: "lyric",
    content: "¿Serían diferente' los hechos?",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "vit-4", start: 192, end: 194.5, type: "lyric",
    content: "Me imagino yo acosta'o en tu pecho",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "vit-5", start: 195, end: 197, type: "lyric",
    content: "Después de haber tocado el techo, bebé",
    style: "romantic", animation: "glow", position: "center-bar", feature: true,
  },

  // HOOK
  {
    id: "vit-6", start: 197.8, end: 198.7, type: "lyric",
    content: "Tú y yo",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vit-7", start: 199.5, end: 201.8, type: "lyric",
    content: "Acostado' en la playa viendo caer el Sol",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vit-8", start: 30.2, end: 33, type: "lyric",
    content: "Tú y yo",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vit-9", start: 33.2, end: 38, type: "lyric",
    content: "Aunque nunca te lo dije, yo soy tuyo, mi amor",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vit-10", start: 38.2, end: 42, type: "lyric",
    content: "Tú y yo, ¿te imaginas?",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vit-11", start: 42.2, end: 46, type: "lyric",
    content: "Un amor que no se termina",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vit-12", start: 46.2, end: 50, type: "lyric",
    content: "Es como vitamina, tú y yo",
    style: "urban", animation: "glow", position: "center-bar", feature: true,
  },
  {
    id: "vit-13", start: 50.2, end: 53, type: "lyric",
    content: "Cuando hacemos el amor",
    style: "romantic", animation: "fade", position: "center-bar",
  },

  // VERSE 2
  {
    id: "vit-14", start: 54, end: 57, type: "lyric",
    content: "Tú y yo (yeah)",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vit-15", start: 57.2, end: 63, type: "lyric",
    content: "Ya tenemo' vario' año' dando vuelta en esta situación",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vit-16", start: 63.2, end: 65.5, type: "lyric",
    content: "My love",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "vit-17", start: 65.7, end: 70.5, type: "lyric",
    content: "Yo estaba enamora'o cuando te quité el pantalón",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vit-18", start: 71, end: 74.5, type: "lyric",
    content: "Quiero repetirte los besos",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "vit-19", start: 74.7, end: 78, type: "lyric",
    content: "Hasta conocerte los huesos",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "vit-20", start: 78.2, end: 82, type: "lyric",
    content: "Dime si estás puesta pa' eso",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vit-21", start: 82.2, end: 86, type: "lyric",
    content: "O si me muero solo, mi amor",
    style: "romantic", animation: "fade", position: "center-bar",
  },

  // BRIDGE (dinámico)
  {
    id: "vit-22", start: 87, end: 92, type: "lyric",
    content: "Ey, dale, mi reina, no te me demores",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vit-23", start: 92.2, end: 97, type: "lyric",
    content: "En el mundo, hay muchos sabore'",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vit-24", start: 97.2, end: 101, type: "lyric",
    content: "Aunque andemos con otros amores",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vit-25", start: 101.2, end: 106, type: "lyric",
    content: "Siempre seguiré mandándote unas flore'",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vit-26", start: 106.2, end: 110, type: "lyric",
    content: "Escribirte todas mis cancione'",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vit-27", start: 110.2, end: 114, type: "lyric",
    content: "Pa' que de mí te enamores",
    style: "urban", animation: "glow", position: "center-bar", feature: true,
  },

  // HOOK REPITE

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

  // HOOK INICIAL
  {
    id: "vol-1", start: 0, end: 3, type: "lyric",
    content: "Volaré contigo",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-2", start: 3.1, end: 6, type: "lyric",
    content: "Danzaré contigo",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-3", start: 6.1, end: 9, type: "lyric",
    content: "Me besaré contigo",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-4", start: 9.1, end: 13, type: "lyric",
    content: "Siendo novios o amigos",
    style: "romantic", animation: "glow", position: "center-bar", feature: true,
  },

  {
    id: "vol-5", start: 13.2, end: 16, type: "lyric",
    content: "Volaré contigo, mami",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-6", start: 16.1, end: 19, type: "lyric",
    content: "Bailaré contigo",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-7", start: 19.1, end: 23, type: "lyric",
    content: "Te amaré por siempre",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-8", start: 23.1, end: 27, type: "lyric",
    content: "Aunque no estés aquí conmigo",
    style: "romantic", animation: "glow", position: "center-bar", feature: true,
  },

  // VERSE 1
  {
    id: "vol-9", start: 28, end: 31, type: "lyric",
    content: "Me pones romántico",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-10", start: 31.2, end: 36, type: "lyric",
    content: "Y eso que estás del otro lado del Atlántico",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-11", start: 36.2, end: 39, type: "lyric",
    content: "Bambina, se siente fantástico",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-12", start: 39.2, end: 42, type: "lyric",
    content: "Te mando un beso elástico",
    style: "urban", animation: "glow", position: "center-bar",
  },

  {
    id: "vol-13", start: 43, end: 46, type: "lyric",
    content: "Yo voy, tú ven, tú ven, yo voy",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-14", start: 46.2, end: 50, type: "lyric",
    content: "Tú me traes Nutella, yo te enseño Savoy",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-15", start: 50.2, end: 54, type: "lyric",
    content: "Tú tan playa Positano, yo tranquilo Morrocoy",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-16", start: 54.2, end: 57, type: "lyric",
    content: "Ey, quiero ser tu Babylon boy",
    style: "urban", animation: "glow", position: "center-bar", feature: true,
  },

  // HOOK REPITE
  {
    id: "vol-17", start: 58, end: 61, type: "lyric",
    content: "Volaré contigo",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-18", start: 61.1, end: 64, type: "lyric",
    content: "Danzaré contigo",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-19", start: 64.1, end: 67, type: "lyric",
    content: "Me besaré contigo",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-20", start: 67.1, end: 71, type: "lyric",
    content: "Siendo novios o amigos",
    style: "romantic", animation: "glow", position: "center-bar", feature: true,
  },

  {
    id: "vol-21", start: 71.2, end: 74, type: "lyric",
    content: "Volaré contigo, mami",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-22", start: 74.1, end: 77, type: "lyric",
    content: "Bailaré contigo",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-23", start: 77.1, end: 81, type: "lyric",
    content: "Te amaré por siempre",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-24", start: 81.1, end: 85, type: "lyric",
    content: "Aunque no estés aquí conmigo",
    style: "romantic", animation: "glow", position: "center-bar", feature: true,
  },

  // VERSE 2
  {
    id: "vol-25", start: 86, end: 89, type: "lyric",
    content: "Buongiorno, principessa",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-26", start: 89.2, end: 94, type: "lyric",
    content: "Amore mío, no te saco de la cabeza, estoy a mil",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-27", start: 94.2, end: 96, type: "lyric",
    content: "Ey, porfa, manda PIN",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-28", start: 96.2, end: 98.5, type: "lyric",
    content: "O acércate un chin",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-29", start: 98.7, end: 101, type: "lyric",
    content: "Que te hago un ling-ling",
    style: "urban", animation: "glow", position: "center-bar",
  },

  {
    id: "vol-30", start: 102, end: 105, type: "lyric",
    content: "Yo voy, tú ven, tú ven, yo voy",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-31", start: 105.2, end: 108, type: "lyric",
    content: "Tú Nutella y yo Savoy",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-32", start: 108.2, end: 112, type: "lyric",
    content: "Yo me lanzo Positano, si tu Morrocoy",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-33", start: 112.2, end: 115, type: "lyric",
    content: "Voy a ser tu Babylon boy",
    style: "urban", animation: "glow", position: "center-bar", feature: true,
  },

  // FINAL HOOK
  {
    id: "vol-34", start: 116, end: 119, type: "lyric",
    content: "Volaré contigo",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-35", start: 119.1, end: 122, type: "lyric",
    content: "Danzaré contigo",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-36", start: 122.1, end: 125, type: "lyric",
    content: "Me besaré contigo",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-37", start: 125.1, end: 129, type: "lyric",
    content: "Siendo novios o amigos",
    style: "romantic", animation: "glow", position: "center-bar", feature: true,
  },

  {
    id: "vol-38", start: 129.2, end: 132, type: "lyric",
    content: "Volaré contigo, mami",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-39", start: 132.1, end: 135, type: "lyric",
    content: "Bailaré contigo",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-40", start: 135.1, end: 139, type: "lyric",
    content: "Te amaré por siempre",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "vol-41", start: 139.1, end: 144, type: "lyric",
    content: "Aunque no estés aquí conmigo",
    style: "romantic", animation: "glow", position: "center-bar", feature: true,
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

  // INTRO / VERSE
  {
    id: "col-1", start: 0, end: 4.5, type: "lyric",
    content: "Qué loco que me pongo todo loco cada vez que te veo",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "col-2", start: 4.7, end: 9, type: "lyric",
    content: "Cada vez que me escribes, me enamoro feo",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "col-3", start: 9.2, end: 13, type: "lyric",
    content: "Ando todo mariquito, no sé qué coño es lo que me pasa",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "col-4", start: 13.2, end: 17.5, type: "lyric",
    content: "Se me mueve el piso cuando pisas la casa",
    style: "urban", animation: "fade", position: "center-bar",
  },

  {
    id: "col-5", start: 18, end: 22, type: "lyric",
    content: "Voy a agarrar tu nombre entero y convertirlo en todos mis versos",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "col-6", start: 22.2, end: 26, type: "lyric",
    content: "Voy a apretarte los cachetes e ir de una a zamparte esos besos",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "col-7", start: 26.2, end: 30.5, type: "lyric",
    content: "Yo aún no entiendo cómo de lejos tú me causas ese mismo efecto",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "col-8", start: 30.7, end: 34.5, type: "lyric",
    content: "Yo te extraño tanto por dentro y ya no es un secreto que",
    style: "urban", animation: "fade", position: "center-bar",
  },

  // PRE-HOOK
  {
    id: "col-9", start: 35, end: 38, type: "lyric",
    content: "Es que, mami tú",
    style: "romantic", animation: "fade", position: "center-bar",
  },

  // HOOK VISUAL (CLAVE)
  {
    id: "col-10", start: 38.2, end: 42, type: "lyric",
    content: "Tú me tienes viendo colores",
    style: "romantic", animation: "glow", position: "center-bar", feature: true,
  },
  {
    id: "col-11", start: 42.2, end: 46, type: "lyric",
    content: "Amarillo sol, ojos de girasoles",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "col-12", start: 46.2, end: 49.5, type: "lyric",
    content: "Azul playita y caracoles",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "col-13", start: 49.7, end: 53.5, type: "lyric",
    content: "Te queda lindo el rojo, mientras no me traiciones",
    style: "romantic", animation: "fade", position: "center-bar",
  },

  {
    id: "col-14", start: 54, end: 57, type: "lyric",
    content: "Estrellita, ¿dónde estás?",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "col-15", start: 57.2, end: 60.5, type: "lyric",
    content: "Ojalá no seas fugaz",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "col-16", start: 60.7, end: 64, type: "lyric",
    content: "Cuando yo te vuelva a ver",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "col-17", start: 64.2, end: 68, type: "lyric",
    content: "Voy a darte amor y hacerte la paz",
    style: "romantic", animation: "glow", position: "center-bar", feature: true,
  },

  // VERSE 2
  {
    id: "col-18", start: 69, end: 73, type: "lyric",
    content: "To el mundo te quiere, to el mundo te adora",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "col-19", start: 73.2, end: 77, type: "lyric",
    content: "¿Alguien como tú por qué está bailando sola?",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "col-20", start: 77.2, end: 81, type: "lyric",
    content: "Tú me pintas la vida, pareces Crayola",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "col-21", start: 81.2, end: 85, type: "lyric",
    content: "Te escribo poemas, te canto la zona",
    style: "urban", animation: "fade", position: "center-bar",
  },

  {
    id: "col-22", start: 85.5, end: 89, type: "lyric",
    content: "Tú siempre fuiste mi 0212",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "col-23", start: 89.2, end: 93, type: "lyric",
    content: "Tú eres la única que me conoces",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "col-24", start: 93.2, end: 97.5, type: "lyric",
    content: "Te conozco de memoria",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "col-25", start: 97.7, end: 102, type: "lyric",
    content: "Te recorro to el cuerpo y tus caminos toa' las noches",
    style: "urban", animation: "fade", position: "center-bar",
  },

  {
    id: "col-26", start: 102.2, end: 105, type: "lyric",
    content: "No sé por qué",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "col-27", start: 105.2, end: 109, type: "lyric",
    content: "Recorro tus caminos y tu cuerpo",
    style: "romantic", animation: "fade", position: "center-bar",
  },

  // HOOK REPITE
  {
    id: "col-28", start: 110, end: 114, type: "lyric",
    content: "Tú me tienes viendo colores",
    style: "romantic", animation: "glow", position: "center-bar", feature: true,
  },
  {
    id: "col-29", start: 114.2, end: 118, type: "lyric",
    content: "Amarillo sol, ojos de girasoles",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "col-30", start: 118.2, end: 121.5, type: "lyric",
    content: "Azul playita y caracoles",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "col-31", start: 121.7, end: 125.5, type: "lyric",
    content: "Te queda lindo el rojo, mientras no me traiciones",
    style: "romantic", animation: "fade", position: "center-bar",
  },

  // OUTRO / EMOCIONAL
  {
    id: "col-32", start: 126, end: 129, type: "lyric",
    content: "Estrellita, ¿dónde estás?",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "col-33", start: 129.2, end: 132.5, type: "lyric",
    content: "Ojalá no seas fugaz",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "col-34", start: 132.7, end: 136, type: "lyric",
    content: "Voy a darte amor y hacerte la paz",
    style: "romantic", animation: "glow", position: "center-bar", feature: true,
  },

  {
    id: "col-35", start: 136.2, end: 140, type: "lyric",
    content: "Después de tanto tiempo, tú me tienes viendo colores",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "col-36", start: 140.2, end: 144, type: "lyric",
    content: "Amarillo sol, ojos de girasoles",
    style: "romantic", animation: "fade", position: "center-bar",
  },

  {
    id: "col-37", start: 144.2, end: 147, type: "lyric",
    content: "Amarillo, azul y rojo, baby",
    style: "romantic", animation: "glow", position: "center-bar",
  },

  {
    id: "col-38", start: 147.2, end: 150, type: "lyric",
    content: "Babylon Girl",
    style: "urban", animation: "fade", position: "center-bar",
  },

  {
    id: "col-39", start: 150.2, end: 155, type: "lyric",
    content: "Qué arrechera amarte tanto y qué ladilla no poder vernos",
    style: "emotional", animation: "fade", position: "center-bar",
  },
  {
    id: "col-40", start: 155.2, end: 160, type: "lyric",
    content: "Por culpa de otro que se robó lo nuestro",
    style: "emotional", animation: "glow", position: "center-bar", feature: true,
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

  // INTRO / VERSE 1
  {
    id: "aos-1", start: 0, end: 5, type: "lyric",
    content: "No había ninguna intención, solo una tensión entre nosotros",
    style: "emotional", animation: "fade", position: "center-bar",
  },
  {
    id: "aos-2", start: 5.2, end: 9.5, type: "lyric",
    content: "Era tanta la magia, baby, que se veía hasta en las fotos",
    style: "emotional", animation: "fade", position: "center-bar",
  },
  {
    id: "aos-3", start: 9.7, end: 13.5, type: "lyric",
    content: "La idea era arreglarnos, no terminar más rotos",
    style: "emotional", animation: "fade", position: "center-bar",
  },
  {
    id: "aos-4", start: 13.7, end: 17.5, type: "lyric",
    content: "Hubo un fallo en la dirección, era tu cama",
    style: "emotional", animation: "fade", position: "center-bar",
  },

  // DROP EMOCIONAL
  {
    id: "aos-5", start: 18, end: 21, type: "lyric",
    content: "No tu corazón, bebé",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "aos-6", start: 21.2, end: 25, type: "lyric",
    content: "Hicimos el amor una y otra vez",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "aos-7", start: 25.2, end: 30, type: "lyric",
    content: "No sé ni cómo explicarlo, baby, ya no sé si fuimos agua o sed",
    style: "romantic", animation: "glow", position: "center-bar", feature: true,
  },
  {
    id: "aos-8", start: 30.2, end: 34.5, type: "lyric",
    content: "¿Y ahora cómo te digo que me enamoré?",
    style: "emotional", animation: "glow", position: "center-bar", feature: true,
  },

  // MINI BREAK
  {
    id: "aos-9", start: 35, end: 38, type: "lyric",
    content: "No sé ni cómo explicarlo",
    style: "emotional", animation: "fade", position: "center-bar",
  },
  {
    id: "aos-10", start: 38.2, end: 42, type: "lyric",
    content: "Baby, ya no sé si fuimos agua o sed",
    style: "romantic", animation: "glow", position: "center-bar",
  },
  {
    id: "aos-11", start: 42.2, end: 44, type: "lyric",
    content: "Oh, oh",
    style: "ambient", animation: "fade", position: "center",
  },

  // VERSE 2
  {
    id: "aos-12", start: 45, end: 50, type: "lyric",
    content: "Si nunca había una intención, ¿por qué tanto enredo entre nosotros?",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "aos-13", start: 50.2, end: 54.5, type: "lyric",
    content: "Ya no quiero manejar si no vas a estar tú de copiloto",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "aos-14", start: 54.7, end: 58.5, type: "lyric",
    content: "La culpa es de tu cara, que la veo y me vuelvo loco",
    style: "urban", animation: "fade", position: "center-bar",
  },
  {
    id: "aos-15", start: 58.7, end: 62.5, type: "lyric",
    content: "Hubo un fallo en la dirección, era tu cama",
    style: "urban", animation: "fade", position: "center-bar",
  },

  // HOOK REPITE
  {
    id: "aos-16", start: 63, end: 66, type: "lyric",
    content: "No tu corazón, bebé",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "aos-17", start: 66.2, end: 70, type: "lyric",
    content: "Hicimos el amor una y otra vez",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "aos-18", start: 70.2, end: 75, type: "lyric",
    content: "No sé ni cómo explicarlo, baby, ya no sé si fuimos agua o sed",
    style: "romantic", animation: "glow", position: "center-bar", feature: true,
  },
  {
    id: "aos-19", start: 75.2, end: 79, type: "lyric",
    content: "¿Y ahora cómo te digo que me enamoré?",
    style: "emotional", animation: "glow", position: "center-bar", feature: true,
  },

  // BRIDGE MUSICAL
  {
    id: "aos-20", start: 80, end: 84, type: "lyric",
    content: "La-la-la-la, la-la-la-la",
    style: "ambient", animation: "fade", position: "center",
  },
  {
    id: "aos-21", start: 84.2, end: 87, type: "lyric",
    content: "Uh-uh-uh-uh",
    style: "ambient", animation: "fade", position: "center",
  },
  {
    id: "aos-22", start: 87.2, end: 91, type: "lyric",
    content: "Baby, ya no sé si fuimos agua o sed",
    style: "romantic", animation: "glow", position: "center-bar",
  },
  {
    id: "aos-23", start: 91.2, end: 95, type: "lyric",
    content: "¿Y ahora cómo te digo que me enamoré?",
    style: "emotional", animation: "glow", position: "center-bar", feature: true,
  },

  // OUTRO FINAL
  {
    id: "aos-24", start: 96, end: 100, type: "lyric",
    content: "De tu piel, de tu boca, de cómo hablas, de tus cosas",
    style: "emotional", animation: "fade", position: "center-bar",
  },
  {
    id: "aos-25", start: 100.2, end: 105, type: "lyric",
    content: "De cómo esquivas los te quiero, tú me encantas porque estás loca",
    style: "emotional", animation: "fade", position: "center-bar",
  },
  {
    id: "aos-26", start: 105.2, end: 110, type: "lyric",
    content: "De tu voz, de tus miedos, de tus victorias y tus derrotas",
    style: "emotional", animation: "fade", position: "center-bar",
  },
  {
    id: "aos-27", start: 110.2, end: 115, type: "lyric",
    content: "Fue tan fácil para ti enamorarme con tu corazón",
    style: "emotional", animation: "glow", position: "center-bar", feature: true,
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
  src: "https://pub-89bdd442dec64f17a50199b18b596e11.r2.dev/Video.mp4",
  introPreviewStart: 0, // mantener en 0 para priorizar arranque inmediato al pulsar Iniciar
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
