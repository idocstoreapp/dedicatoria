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
  //  TOUR DE BIENVENIDA INTERACTIVO  (0 – 14.5s)
  //  Negro total al inicio, aparece el video progresivamente.
  //  Tour divertido y visual con mascota animada.
  // ══════════════════════════════════════════════════════════

  // Negro total al inicio (se va aclarando progresivamente)
  { id: "tour-blackout", start: 0, end: 12.5, type: "blackout" },

  // Beat glow sutil durante el tour
  {
    id: "beat-tour", start: 0, end: 157.5, type: "beat",
    color: "#2aff7cff", colorB: "#8b26e4ff", bpm: 25, intensity: 0.6
  },

  // 1️⃣ Bienvenida con efecto (0.5 – 2.5s)
  {
    id: "tour-welcome", start: 0.5, end: 2.5, type: "lyric",
    content: "hola de nuevo ✨",
    style: "minimal", animation: "zoom", position: "center",
  },

  // Flash de transición
  { id: "effect-tour-1", start: 2.5, type: "effect", effect: "flash" },

  // 2️⃣ Título con estilo (2.5 – 4.5s)
  {
    id: "tour-sesion", start: 2.5, end: 4.5, type: "lyric",
    content: "Dany Ocean · Casaparlante\nuna dedicatoria para ti 🌹",
    style: "minimal", animation: "fade", position: "center",
  },

  // Flash de transición
  { id: "effect-tour-2", start: 4.5, type: "effect", effect: "flash" },

  // 3️⃣ Tour ❤️ Like Button (4.5 – 7.5s)
  {
    id: "tour-like-intro", start: 4.5, end: 6.5, type: "lyric",
    content: "te dejé un corazoncito escondido",
    style: "minimal", animation: "bounce", position: "center",
  },
  {
    id: "tour-like", start: 5.5, end: 8, type: "tour",
    target: "like-btn", tip: "dale ❤️ cuando te guste algo", tipPosition: "left",
  },
  // Arcoíris sutil en el botón
  { id: "superlike-tour", start: 5.5, end: 8, type: "superlike" },

  // Transición
  { id: "effect-tour-3", start: 8, type: "effect", effect: "flash" },

  // 4️⃣ Tour Play/Pause (8 – 11s)
  {
    id: "tour-play-intro", start: 8, end: 10, type: "lyric",
    content: "un botón de play/pausa para... bueno, ya sabes jjj",
    style: "minimal", animation: "slide", position: "center",
  },
  {
    id: "tour-play", start: 9, end: 11.5, type: "tour",
    target: "mini-pause-btn", tip: "pausa cuando quieras :3", tipPosition: "right",
  },

  // Transición
  { id: "effect-tour-4", start: 11.5, type: "effect", effect: "flash" },

  // 5️⃣ Tour Chat (11.5 – 14s)
  {
    id: "tour-chat-intro", start: 11.5, end: 13, type: "lyric",
    content: "ah, y hay un chat también\n(porque me da pena si te aburres :v)",
    style: "minimal", animation: "fade", position: "center",
  },
  {
    id: "tour-chat", start: 12, end: 14.5, type: "tour",
    target: "chat-panel", tip: "aquí te hablo mientras disfrutas 💬", tipPosition: "top",
  },

  // El video aparece progresivamente (13s+)
  {
    id: "tour-video-reveal", start: 13, end: 15.5, type: "lyric",
    content: "listo? empieza la música 🎵",
    style: "minimal", animation: "glow", position: "center",
  },

  // Flash final cuando el video aparece
  { id: "effect-tour-final", start: 14.5, type: "effect", effect: "flash" },
  { id: "effect-tour-shake", start: 14.5, type: "effect", effect: "shake" },

  // ══════════════════════════════════════════════════════════
  //  VIDEO APARECE (14.5s+)
  // ══════════════════════════════════════════════════════════

  // Escenas de fondo
  { id: "scene-babylon", start: 14.5, end: t("2:58"), type: "scene", scene: "starfield" },
  { id: "scene-vitamina", start: t("2:58"), end: t("4:34"), type: "scene", scene: "hearts-background" },
  { id: "scene-volare", start: t("4:34"), end: t("6:43"), type: "scene", scene: "neon-rain" },
  { id: "scene-crayola", start: t("6:43"), end: t("10:10"), type: "scene", scene: "starfield" },
  { id: "scene-corazon", start: t("10:10"), end: 999, type: "scene", scene: "minimal-blur" },

  // Beat glow exterior continuo
  {
    id: "beat-main", start: 14.5, end: 999, type: "beat",
    color: "#ff4488", colorB: "#8800ff", bpm: 85, intensity: 0.4,
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
    style: "urban", animation: "glow", position: "center-bar", feature: true,
  },
  {
    id: "bg-6", start: 28.6, end: 33, type: "lyric",
    content: "Que estemos tú y yo, que andemo' en otra y que nada importe",
    style: "urban", animation: "glow", position: "center-bar", feature: true,
  },

  {
    id: "bg-7", start: 33.5, end: 38, type: "lyric",
    content: "Y sabes que eres mía la vida es fresca como tú escote",
    style: "urban", animation: "fade", position: "center-bar",
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

  {
    id: "bg-26", start: 115.4, end: 118, type: "lyric",
    content: "Y yo, se siente, babe, se siente",
    style: "romantic", animation: "fade", position: "center-bar",
  },
  {
    id: "bg-marquee-2", start: 118.5, end: 119.5, type: "lyric",
    content: "Yo te llevo cuando cambien el presidente",
    style: "urban", animation: "glow", position: "center",
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
    id: "bg-29", start: 130.3, end: 135, type: "lyric",
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
    style: "urban", animation: "aura", position: "top", feature: true,
  },
  { id: "superlike-bg", start: 140, end: 155, type: "superlike" },
  { id: "effect-bg-1", start: 140, type: "effect", effect: "flash" },

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

  // Lyrics de Vitamina — tiempos exactos de la canción

  // VERSE 1
  { id: "vit-1",  start: 178.3, end: 179.5, type: "lyric", content: "¿Qué hubiera pasado",              style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vit-2",  start: 180.5, end: 184.7, type: "lyric", content: "Si tú y yo hubiésemos seguido esos besos", style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vit-3",  start: 185.8, end: 189.7, type: "lyric", content: "Si ese día de haber hecho el amor hubiese estado confeso?", style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vit-4",  start: 190,   end: 192,   type: "lyric", content: "Serían diferente' los hechos",     style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vit-5",  start: 193,   end: 194.7, type: "lyric", content: "Me imagino yo acostado en tus pechos", style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vit-6",  start: 195.8, end: 198.6, type: "lyric", content: "Después de haber tocado el techo, bebé", style: "romantic", animation: "glow", position: "center-bar", feature: true },

  // HOOK
  { id: "vit-7",  start: 199,   end: 199.8, type: "lyric", content: "Tú y yo",                          style: "urban", animation: "zoom", position: "center-bar" },
  { id: "vit-8",  start: 200,   end: 202,   type: "lyric", content: "Acostados en la playa viendo caer el sol", style: "urban", animation: "fade", position: "center-bar" },
  { id: "vit-9",  start: 202.5, end: 203,   type: "lyric", content: "Tú y yo",                          style: "urban", animation: "zoom", position: "center-bar" },
  { id: "vit-10", start: 204,   end: 206.7, type: "lyric", content: "Aunque nunca te lo dije, yo soy tuyo, mi amor", style: "urban", animation: "fade", position: "center-bar" },
  { id: "vit-11", start: 207,   end: 209.8, type: "lyric", content: "Tú y yo, ¿te imaginas?",           style: "urban", animation: "fade", position: "center-bar" },
  { id: "vit-12", start: 210,   end: 211.5, type: "lyric", content: "Un amor que no se termina",        style: "urban", animation: "fade", position: "center-bar" },
  { id: "vit-13", start: 212,   end: 213.9, type: "lyric", content: "Es como vitamina, tú y yo",        style: "urban", animation: "glow", position: "center-bar", feature: true },
  { id: "vit-14", start: 214.1, end: 216,   type: "lyric", content: "Cuando hacemos el amor",           style: "romantic", animation: "fade", position: "center-bar" },

  // VERSE 2
  { id: "vit-15", start: 217,   end: 217.76,type: "lyric", content: "Tú y yo",                          style: "urban", animation: "zoom", position: "center-bar" },
  { id: "vit-16", start: 218,   end: 221,   type: "lyric", content: "Ya tenemo vario' años dando vuelta' en esta situación", style: "urban", animation: "fade", position: "center-bar" },
  { id: "vit-17", start: 221.3, end: 222,   type: "lyric", content: "My love",                          style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vit-18", start: 222.6, end: 226,   type: "lyric", content: "Ya estaba enamorado cuando te quité el pantalón", style: "urban", animation: "fade", position: "center-bar" },
  { id: "vit-19", start: 226.8, end: 228.2, type: "lyric", content: "Quiero repetirte lo' besos",       style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vit-20", start: 228.8, end: 230.4, type: "lyric", content: "Hasta conocerte lo' huesos",       style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vit-21", start: 230.9, end: 233,   type: "lyric", content: "Dime si estás puesta pa eso",      style: "urban", animation: "fade", position: "center-bar" },
  { id: "vit-22", start: 233.5, end: 234.5, type: "lyric", content: "O si me muero solo, mi amor (ey)", style: "romantic", animation: "fade", position: "center-bar" },

  // BRIDGE
  { id: "vit-23", start: 235,   end: 237.3, type: "lyric", content: "Dale, mi reina, no te me demores", style: "urban", animation: "fade", position: "center-bar" },
  { id: "vit-24", start: 237.7, end: 239.5, type: "lyric", content: "En el mundo hay mucho' sabores",   style: "urban", animation: "fade", position: "center-bar" },
  { id: "vit-25", start: 240.2, end: 241.5, type: "lyric", content: "Aunque andemo con otros amores",   style: "urban", animation: "fade", position: "center-bar" },
  { id: "vit-26", start: 242,   end: 244.6, type: "lyric", content: "Siempre seguiré mandándote una' flores", style: "urban", animation: "fade", position: "center-bar" },
  { id: "vit-27", start: 245,   end: 247,   type: "lyric", content: "Escribirte toda' mis canciones",   style: "urban", animation: "fade", position: "center-bar" },
  { id: "vit-28", start: 247.9, end: 249.3, type: "lyric", content: "Pa que de mí te enamores",         style: "urban", animation: "glow", position: "center-bar", feature: true },
  { id: "vit-29", start: 249.7, end: 252,   type: "lyric", content: "siempre darte la' razones",        style: "urban", animation: "fade", position: "center-bar" },
  { id: "vit-30", start: 252.8, end: 253.7, type: "lyric", content: "Y me digas que sí",                style: "romantic", animation: "fade", position: "center-bar" },

  // HOOK REPITE
  { id: "vit-31", start: 254,   end: 255,   type: "lyric", content: "Tú y yo",                          style: "urban", animation: "zoom", position: "center-bar" },
  { id: "vit-32", start: 255.8, end: 259,   type: "lyric", content: "Acostados en la playa viendo caer el sol", style: "urban", animation: "fade", position: "center-bar" },
  { id: "vit-33", start: 259.4, end: 260.3, type: "lyric", content: "Tú y yo",                          style: "urban", animation: "zoom", position: "center-bar" },
  { id: "vit-34", start: 260.6, end: 264.3, type: "lyric", content: "Aunque nunca te lo dije, yo soy tuyo, mi amor", style: "urban", animation: "fade", position: "center-bar" },
  { id: "vit-35", start: 265,   end: 266,   type: "lyric", content: "Tú y yo, ¿te imaginas?",           style: "urban", animation: "fade", position: "center-bar" },
  { id: "vit-36", start: 266.8, end: 268.3, type: "lyric", content: "Un amor que no se termina",        style: "urban", animation: "fade", position: "center-bar" },
  { id: "vit-37", start: 268.7, end: 271,   type: "lyric", content: "Es como vitamina, tú y yo",        style: "urban", animation: "glow", position: "center-bar", feature: true },
  { id: "vit-38", start: 271.4, end: 273.8, type: "lyric", content: "Cuando hacemos el amor",           style: "romantic", animation: "fade", position: "center-bar" },


  { id: "superlike-vit", start: t("3:22"), end: t("3:50"), type: "superlike" },
  { id: "effect-vit-1", start: t("3:22"), type: "effect", effect: "flash" },

  // Interacción antes de Volaré (4:34–4:47)
  {
    id: "chat-vitamina-end", start: t("4:00"), type: "chat", from: "j",
    text: "¿conocías Vitamina? 🎵",
    quickReplies: ["Sí, la conozco 🎶", "¡Ahora sí! 😍", "No la conocía"],
    // La IA (Groq) responde naturalmente según lo que ella conteste
  },

  // ══════════════════════════════════════════════════════════
  //  ♪ VOLARÉ  —  4:34  (274s) · canta 4:50 (290s) · título 4:45 (285s)
  // ══════════════════════════════════════════════════════════

  // Notificación (4:45 = 285s)
  {
    id: "song-volare", start: 285, end: 295, type: "song-notification",
    title: "Volaré", artist: "Dany Ocean",
  },

  // Lyrics de Volaré — tiempos exactos

  // HOOK 1
  { id: "vol-1",  start: 291.7, end: 294,   type: "lyric", content: "Volaré contigo",               style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vol-2",  start: 294.6, end: 296,   type: "lyric", content: "Danzaré contigo",              style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vol-3",  start: 296.7, end: 298.8, type: "lyric", content: "Me besaré contigo",            style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vol-4",  start: 299,   end: 300.9, type: "lyric", content: "Siendo novios o amigos",       style: "romantic", animation: "glow", position: "center-bar", feature: true },
  { id: "vol-5",  start: 301.2, end: 304,   type: "lyric", content: "Volaré contigo, mami",         style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vol-6",  start: 304.7, end: 306,   type: "lyric", content: "Bailaré contigo",              style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vol-7",  start: 306.7, end: 307.8, type: "lyric", content: "Te amaré por siempre",         style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vol-8",  start: 308,   end: 311,   type: "lyric", content: "Aunque no estés aquí conmigo, oh-oh", style: "romantic", animation: "glow", position: "center-bar", feature: true },

  // VERSE 1
  { id: "vol-9",  start: 311.3, end: 313,   type: "lyric", content: "Me pones romántico",           style: "urban", animation: "fade", position: "center-bar" },
  { id: "vol-10", start: 313.6, end: 316,   type: "lyric", content: "Y eso que estás del otro lado del Atlántico", style: "urban", animation: "fade", position: "center-bar" },
  { id: "vol-11", start: 316.5, end: 318.5, type: "lyric", content: "Bambina, se siente fantástico", style: "urban", animation: "fade", position: "center-bar" },
  { id: "vol-12", start: 319,   end: 320,   type: "lyric", content: "Te mando un beso elástico",    style: "urban", animation: "glow", position: "center-bar" },
  { id: "vol-13", start: 320.3, end: 322.8, type: "lyric", content: "Yo voy, tú ven, tú ven, yo voy", style: "urban", animation: "fade", position: "center-bar" },
  { id: "vol-14", start: 323,   end: 325,   type: "lyric", content: "Tú me traes Nutella, yo te enseño Savoy", style: "urban", animation: "fade", position: "center-bar" },
  { id: "vol-15", start: 325.2, end: 328,   type: "lyric", content: "Tú tan playa Positano, yo tranquilo morrocoy", style: "urban", animation: "fade", position: "center-bar" },
  { id: "vol-16", start: 328.2, end: 329.8, type: "lyric", content: "Hey, quiero ser tu babylon boy", style: "urban", animation: "glow", position: "center-bar", feature: true },

  // HOOK 2
  { id: "vol-17", start: 330,   end: 332,   type: "lyric", content: "Volaré contigo",               style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vol-18", start: 332.4, end: 335,   type: "lyric", content: "Danzaré contigo",              style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vol-19", start: 335.4, end: 337,   type: "lyric", content: "Me besaré contigo",            style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vol-20", start: 337.3, end: 339,   type: "lyric", content: "Siendo novios o amigos",       style: "romantic", animation: "glow", position: "center-bar", feature: true },
  { id: "vol-21", start: 339.4, end: 342,   type: "lyric", content: "Volaré contigo, mami",         style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vol-22", start: 342.4, end: 344,   type: "lyric", content: "Bailaré contigo",              style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vol-23", start: 344.4, end: 346,   type: "lyric", content: "Te amaré por siempre",         style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vol-24", start: 346.4, end: 349.5, type: "lyric", content: "Aunque no estés aquí conmigo", style: "romantic", animation: "glow", position: "center-bar", feature: true },

  // VERSE 2
  { id: "vol-25", start: 349.9, end: 351.8, type: "lyric", content: "Buongiorno, principessa",      style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vol-26", start: 352,   end: 355,   type: "lyric", content: "Amore mio, no te saco e la cabeza, estoy a mil", style: "urban", animation: "fade", position: "center-bar" },
  { id: "vol-27", start: 355.3, end: 356.8, type: "lyric", content: "Hey, porfa manda ping",        style: "urban", animation: "fade", position: "center-bar" },
  { id: "vol-28", start: 357,   end: 357.8, type: "lyric", content: "O acércate un chin",           style: "urban", animation: "fade", position: "center-bar" },
  { id: "vol-29", start: 358,   end: 358.8, type: "lyric", content: "Que te hago un ling ling",     style: "urban", animation: "glow", position: "center-bar" },
  { id: "vol-30", start: 359,   end: 361,   type: "lyric", content: "Yo voy, tú ven, tú ven, yo voy", style: "urban", animation: "fade", position: "center-bar" },
  { id: "vol-31", start: 361.4, end: 364,   type: "lyric", content: "Tú Nutella y yo Savoy",        style: "urban", animation: "fade", position: "center-bar" },
  { id: "vol-32", start: 364.8, end: 367,   type: "lyric", content: "Yo me lanzo Positano si tú morrocoy", style: "urban", animation: "fade", position: "center-bar" },
  { id: "vol-33", start: 367.5, end: 368.8, type: "lyric", content: "quiero ser tu babylon boy",   style: "urban", animation: "glow", position: "center-bar", feature: true },

  // HOOK 3
  { id: "vol-34", start: 369,   end: 371,   type: "lyric", content: "Volaré contigo",               style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vol-35", start: 371.5, end: 373,   type: "lyric", content: "Danzaré contigo",              style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vol-36", start: 373.6, end: 374.8, type: "lyric", content: "Me besaré contigo",            style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vol-37", start: 375,   end: 378,   type: "lyric", content: "Siendo novios o amigos",       style: "romantic", animation: "glow", position: "center-bar", feature: true },
  { id: "vol-38", start: 378.4, end: 381.9, type: "lyric", content: "Volaré contigo, mami",         style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vol-39", start: 382.2, end: 383,   type: "lyric", content: "Bailaré contigo",              style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vol-40", start: 383.9, end: 384.8, type: "lyric", content: "Te amaré por siempre",         style: "romantic", animation: "fade", position: "center-bar" },
  { id: "vol-41", start: 385,   end: 392,   type: "lyric", content: "Aunque no estés aquí conmigo", style: "romantic", animation: "glow", position: "center-bar", feature: true },

  { id: "effect-vol-2", start: 330, type: "effect", effect: "shake" },

  // (old vol duplicates removed — exact timestamps above ↑)

  // ══════════════════════════════════════════════════════════
  //  ♪ CRAYOLA  —  6:43 (403s) · canta 6:55.6 (415.6s)
  //  MINIJUEGO: 6:57 (417s) – 10:00 (600s)
  // ══════════════════════════════════════════════════════════

  {
    id: "song-crayola", start: t("6:43"), end: t("6:53"), type: "song-notification",
    title: "Crayola", artist: "Dany Ocean",
  },

  // Lyrics Crayola — tiempos exactos

  // INTRO / VERSE 1
  { id: "col-1",  start: 415.6, end: 420,   type: "lyric", content: "Qué loco que me pongo todo loco cada vez que te veo", style: "urban", animation: "fade", position: "center-bar" },
  { id: "col-2",  start: 421,   end: 423,   type: "lyric", content: "Cada vez que me escribes,", style: "urban", animation: "fade", position: "center-bar" },
  { id: "col-3",  start: 423.3, end: 427,   type: "lyric", content: "me enamoro feo, yeah", style: "urban", animation: "fade", position: "center-bar" },
  { id: "col-4",  start: 427.4, end: 432,   type: "lyric", content: "Ando todo mariquito, no sé qué coño es lo que me pasa", style: "urban", animation: "fade", position: "center-bar" },
  { id: "col-5",  start: 432.3, end: 439.8, type: "lyric", content: "se me mueve el piso cuando pisas la casa, yeah", style: "urban", animation: "fade", position: "center-bar" },
  { id: "col-6",  start: 440,   end: 445,   type: "lyric", content: "Voy a agarrar tu nombre entero y convertirlo en todos mis versos", style: "urban", animation: "fade", position: "center-bar" },
  { id: "col-7",  start: 446,   end: 450,   type: "lyric", content: "Voy a apretarte los cachetes e ir de una a zamparte esos besos", style: "urban", animation: "fade", position: "center-bar" },
  { id: "col-8",  start: 452.8, end: 454.7, type: "lyric", content: "Y aunque lejos esté aún me acuerdo de ti", style: "urban", animation: "fade", position: "center-bar" },
  { id: "col-9",  start: 455,   end: 457.5, type: "lyric", content: "pero aún así te recuerdo tanto", style: "urban", animation: "fade", position: "center-bar" },
  { id: "col-10", start: 457.9, end: 460.4, type: "lyric", content: "es tan perfecto", style: "urban", animation: "fade", position: "center-bar" },
  { id: "col-11", start: 461.8, end: 464,   type: "lyric", content: "lo que siento por ti", style: "urban", animation: "fade", position: "center-bar" },

  // PRE-HOOK
  { id: "col-12", start: 464.4, end: 465.5, type: "lyric", content: "Y es que, mami tú", style: "romantic", animation: "fade", position: "center-bar" },

  // HOOK 1
  { id: "col-13", start: 466,   end: 468.8, type: "lyric", content: "Tú me tienes viendo colores", style: "romantic", animation: "glow", position: "center-bar", feature: true },
  { id: "col-14", start: 469,   end: 472,   type: "lyric", content: "Amarillo sol, ojos de girasoles", style: "romantic", animation: "fade", position: "center-bar" },
  { id: "col-15", start: 472.4, end: 475,   type: "lyric", content: "Azul playita y caracoles", style: "romantic", animation: "fade", position: "center-bar" },
  { id: "col-16", start: 475.7, end: 479,   type: "lyric", content: "Te queda lindo el rojo, mientras no me traiciones", style: "romantic", animation: "fade", position: "center-bar" },
  { id: "col-17", start: 479.5, end: 482,   type: "lyric", content: "Estrellita, ¿dónde estás?", style: "romantic", animation: "fade", position: "center-bar" },
  { id: "col-18", start: 483,   end: 485,   type: "lyric", content: "Ojalá no seas fugaz", style: "romantic", animation: "fade", position: "center-bar" },
  { id: "col-19", start: 485.5, end: 488.5, type: "lyric", content: "Cuando yo te vuelva a ver", style: "romantic", animation: "fade", position: "center-bar" },
  { id: "col-20", start: 488.9, end: 497.8, type: "lyric", content: "Voy a darte amor y hacerte la paz", style: "romantic", animation: "glow", position: "center-bar", feature: true },

  // VERSE 2
  { id: "col-21", start: 505.5, end: 509,   type: "lyric", content: "To el mundo te quiere, to el mundo te adora", style: "urban", animation: "fade", position: "center-bar" },
  { id: "col-22", start: 509.3, end: 512,   type: "lyric", content: "¿Alguien como tú por qué está bailando sola?", style: "urban", animation: "fade", position: "center-bar" },
  { id: "col-23", start: 512.3, end: 515,   type: "lyric", content: "Tú me pintas la vida, pareces Crayola", style: "urban", animation: "fade", position: "center-bar" },
  { id: "col-24", start: 515.3, end: 518.8, type: "lyric", content: "Te escribo poemas, te canto la zona", style: "urban", animation: "fade", position: "center-bar" },
  { id: "col-25", start: 519,   end: 523,   type: "lyric", content: "Y, ay, tú siempre fuiste mi 0212", style: "urban", animation: "fade", position: "center-bar" },
  { id: "col-26", start: 523.3, end: 526,   type: "lyric", content: "Tú eres la única que me conoces", style: "urban", animation: "fade", position: "center-bar" },
  { id: "col-27", start: 526.4, end: 527.8, type: "lyric", content: "Te conozco de memoria", style: "urban", animation: "fade", position: "center-bar" },
  { id: "col-28", start: 528,   end: 532.5, type: "lyric", content: "Te recorro to el cuerpo y tus caminos toa' las fucking noches", style: "urban", animation: "fade", position: "center-bar" },
  { id: "col-29", start: 533,   end: 536,   type: "lyric", content: "Toa' las fucking noches", style: "urban", animation: "fade", position: "center-bar" },
  { id: "col-30", start: 536.3, end: 538.6, type: "lyric", content: "Y No sé por qué", style: "romantic", animation: "fade", position: "center-bar" },
  { id: "col-31", start: 539,   end: 543.5, type: "lyric", content: "Oh, recorro tus caminos y tu cuerpo", style: "romantic", animation: "fade", position: "center-bar" },

  // PRE-HOOK 2
  { id: "col-32", start: 544,   end: 544.8, type: "lyric", content: "Es que, mami", style: "romantic", animation: "fade", position: "center-bar" },

  // HOOK 2
  { id: "col-33", start: 545,   end: 547,   type: "lyric", content: "Tú me tienes viendo colores", style: "romantic", animation: "glow", position: "center-bar", feature: true },
  { id: "col-34", start: 547.3, end: 550.8, type: "lyric", content: "Amarillo sol, ojos de girasoles", style: "romantic", animation: "fade", position: "center-bar" },
  { id: "col-35", start: 551,   end: 554,   type: "lyric", content: "Azul playita y caracoles", style: "romantic", animation: "fade", position: "center-bar" },
  { id: "col-36", start: 554.4, end: 556.8, type: "lyric", content: "Te queda lindo el rojo, mientras no me traiciones", style: "romantic", animation: "fade", position: "center-bar" },
  { id: "col-37", start: 557,   end: 560.3, type: "lyric", content: "Estrellita, ¿dónde estás?", style: "romantic", animation: "fade", position: "center-bar" },
  { id: "col-38", start: 561,   end: 563.4, type: "lyric", content: "Ojalá no seas fugaz", style: "romantic", animation: "fade", position: "center-bar" },
  { id: "col-39", start: 564.7, end: 566.8, type: "lyric", content: "Cuando yo te vuelva a ver", style: "romantic", animation: "fade", position: "center-bar" },
  { id: "col-40", start: 567,   end: 575,   type: "lyric", content: "Voy a darte amor y hacerte la paz", style: "romantic", animation: "glow", position: "center-bar", feature: true },
  { id: "col-41", start: 576.5, end: 583,   type: "lyric", content: "Voy a darte amor, voy hacerte la paz", style: "romantic", animation: "glow", position: "center-bar", feature: true },

  // OUTRO EMOCIONAL
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

  // Lyrics de Corazón — tiempos exactos

  // VERSE 1
  { id: "aos-1",  start: 630,   end: 632.8, type: "lyric", content: "No había ninguna intención", style: "emotional", animation: "fade", position: "center-bar" },
  { id: "aos-2",  start: 633,   end: 634.8, type: "lyric", content: "Solo una tensión entre nosotros", style: "emotional", animation: "fade", position: "center-bar" },
  { id: "aos-3",  start: 635,   end: 637,   type: "lyric", content: "Era tanta la magia, baby", style: "emotional", animation: "fade", position: "center-bar" },
  { id: "aos-4",  start: 638,   end: 640,   type: "lyric", content: "Que se veía hasta en las fotos", style: "emotional", animation: "fade", position: "center-bar" },
  { id: "aos-5",  start: 641,   end: 642,   type: "lyric", content: "La idea era arreglarnos", style: "emotional", animation: "fade", position: "center-bar" },
  { id: "aos-6",  start: 643.3, end: 645,   type: "lyric", content: "No terminar más rotos", style: "emotional", animation: "fade", position: "center-bar" },
  { id: "aos-7",  start: 645.2, end: 646,   type: "lyric", content: "Hubo un fallo en la dirección", style: "emotional", animation: "fade", position: "center-bar" },
  { id: "aos-8",  start: 646.5, end: 649,   type: "lyric", content: "Era tu cama", style: "romantic", animation: "fade", position: "center-bar" },
  { id: "aos-9",  start: 650,   end: 652,   type: "lyric", content: "No tu corazón, bebé", style: "romantic", animation: "fade", position: "center-bar" },
  { id: "aos-10", start: 652.7, end: 657,   type: "lyric", content: "Hicimos el amor una y otra vez", style: "romantic", animation: "fade", position: "center-bar" },
  { id: "aos-11", start: 657.8, end: 659,   type: "lyric", content: "No sé ni cómo explicarlo, baby", style: "romantic", animation: "fade", position: "center-bar" },
  { id: "aos-12", start: 660,   end: 664,   type: "lyric", content: "Ya no sé si fuimos agua o sed", style: "romantic", animation: "glow", position: "center-bar", feature: true },
  { id: "aos-13", start: 664.6, end: 668.8, type: "lyric", content: "¿Y ahora cómo te digo que me enamoré?", style: "emotional", animation: "glow", position: "center-bar", feature: true },

  // PUENTE
  { id: "aos-14", start: 674.7, end: 677.8, type: "lyric", content: "Ya no sé ni cómo explicarlo", style: "emotional", animation: "fade", position: "center-bar" },
  { id: "aos-15", start: 678,   end: 682.5, type: "lyric", content: "Baby, ya no sé si fuimos agua o sed", style: "romantic", animation: "glow", position: "center-bar" },

  // VERSE 2
  { id: "aos-16", start: 686.6, end: 689,   type: "lyric", content: "Si nunca había una intención", style: "urban", animation: "fade", position: "center-bar" },
  { id: "aos-17", start: 689.3, end: 692,   type: "lyric", content: "¿Por qué tanto enredo entre nosotros?", style: "urban", animation: "fade", position: "center-bar" },
  { id: "aos-18", start: 692.7, end: 694,   type: "lyric", content: "Ya no quiero manejar", style: "urban", animation: "fade", position: "center-bar" },
  { id: "aos-19", start: 694.3, end: 697,   type: "lyric", content: "Si no vas a estar tú de copiloto", style: "urban", animation: "fade", position: "center-bar" },
  { id: "aos-20", start: 697.5, end: 698.8, type: "lyric", content: "La culpa es de tu cara", style: "urban", animation: "fade", position: "center-bar" },
  { id: "aos-21", start: 699,   end: 701,   type: "lyric", content: "Que la veo y me vuelvo loco", style: "urban", animation: "fade", position: "center-bar" },
  { id: "aos-22", start: 702,   end: 704,   type: "lyric", content: "Hubo un fallo en la dirección", style: "urban", animation: "fade", position: "center-bar" },
  { id: "aos-23", start: 704.3, end: 706,   type: "lyric", content: "Era tu cama", style: "romantic", animation: "fade", position: "center-bar" },
  { id: "aos-24", start: 706.5, end: 709,   type: "lyric", content: "No tu corazón bebé", style: "romantic", animation: "fade", position: "center-bar" },
  { id: "aos-25", start: 709.5, end: 714,   type: "lyric", content: "Hicimos el amor una y otra vez", style: "romantic", animation: "fade", position: "center-bar" },
  { id: "aos-26", start: 714.5, end: 716,   type: "lyric", content: "No sé ni cómo explicarlo, baby", style: "romantic", animation: "fade", position: "center-bar" },
  { id: "aos-27", start: 716.2, end: 721,   type: "lyric", content: "Ya no sé, si fuimos agua o sed", style: "romantic", animation: "glow", position: "center-bar", feature: true },
  { id: "aos-28", start: 721.8, end: 726,   type: "lyric", content: "¿Y ahora cómo te digo que me enamoré?", style: "emotional", animation: "glow", position: "center-bar", feature: true },

  // OUTRO
  { id: "aos-29", start: 734.5, end: 740,   type: "lyric", content: "baby Ya no sé si fuimos agua o sed", style: "romantic", animation: "glow", position: "center-bar" },
  { id: "aos-30", start: 740.5, end: 744,   type: "lyric", content: "¿Y ahora cómo te digo que me enamoré?", style: "emotional", animation: "glow", position: "center-bar", feature: true },
  { id: "aos-31", start: 744.5, end: 746.7, type: "lyric", content: "De tu piel, de tu boca", style: "emotional", animation: "fade", position: "center-bar" },
  { id: "aos-32", start: 747,   end: 749,   type: "lyric", content: "De cómo hablas de tus cosas", style: "emotional", animation: "fade", position: "center-bar" },
  { id: "aos-33", start: 749.2, end: 751,   type: "lyric", content: "De cómo esquivas los \"te quiero\"", style: "emotional", animation: "fade", position: "center-bar" },
  { id: "aos-34", start: 751.3, end: 754,   type: "lyric", content: "Tú me encanta' porque estás loca", style: "emotional", animation: "fade", position: "center-bar" },
  { id: "aos-35", start: 754.8, end: 756.8, type: "lyric", content: "De tu voz, de tus miedos", style: "emotional", animation: "fade", position: "center-bar" },
  { id: "aos-36", start: 757,   end: 759,   type: "lyric", content: "De tus victorias y tus derrotas", style: "emotional", animation: "fade", position: "center-bar" },
  { id: "aos-37", start: 760,   end: 765,   type: "lyric", content: "Fue tan fácil para ti enamorarme", style: "emotional", animation: "glow", position: "center-bar", feature: true },
  { id: "aos-38", start: 774,   end: 780,   type: "lyric", content: "Con tu corazón", style: "emotional", animation: "glow", position: "center-bar", feature: true },

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

  // Lyrics Me Rehúso — tiempos exactos (solo el final)
  { id: "mr-1", start: 913,   end: 915.5, type: "lyric", content: "Y baby, no (baby, no)", style: "romantic", animation: "fade", position: "bottom-bar" },
  { id: "mr-2", start: 916,   end: 920,   type: "lyric", content: "Me rehúso a darte un último beso así que guárdalo (guárdalo)", style: "romantic", animation: "glow", position: "center", feature: true },
  { id: "mr-3", start: 921,   end: 925.5, type: "lyric", content: "Para que la próxima vez te lo dé haciéndolo", style: "romantic", animation: "slide", position: "bottom-bar" },
  { id: "mr-4", start: 926,   end: 930,   type: "lyric", content: "Haciéndotelo así, así", style: "romantic", animation: "arc", position: "center", feature: true },
  { id: "mr-5", start: 931.3, end: 935,   type: "lyric", content: "Así como te gusta, baby 💋", style: "romantic", animation: "arc", position: "center", feature: true },
  { id: "superlike-mr-1", start: 916, end: 932, type: "superlike" },
  { id: "effect-mr-1", start: 916, type: "effect", effect: "flash" },
  { id: "superlike-mr-2", start: 931, end: 950, type: "superlike" },
  { id: "effect-mr-2", start: 935, type: "effect", effect: "shake" },

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
  subtitle: "Una experiencia audiovisual hecha para ti",
  recipientName: "chica linda",
  debugMode: false,   // ← pon true para ver el panel de segundos
};
