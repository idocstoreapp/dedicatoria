/**
 * ============================================================
 *  CHAT AI RESPONSE — Respuestas inteligentes estilo J.
 * ============================================================
 *
 * Genera respuestas contextuales basadas en los patrones reales
 * de J. del timeline. No usa APIs externas — todo es local.
 *
 * Estrategia:
 *   1. Detectar intención del mensaje de la usuaria
 *   2. Buscar patrón de respuesta matching
 *   3. Rotar entre variantes para no repetir
 *   4. Añadir variación natural (typos, emojis random)
 */

import {
  responsePatterns,
  fallbackResponses,
  songContextResponses,
} from '../config/conversation-examples.js';

// ════════════════════════════════════════════════════════════
//  TRACKING: qué respuestas ya se usaron para no repetir
// ════════════════════════════════════════════════════════════
const usageHistory = {};  // patternKey → [responseIndex, ...]

function pickResponse(patternKey, responses) {
  if (!usageHistory[patternKey]) {
    usageHistory[patternKey] = [];
  }

  // Filtrar las que aún no se usaron
  const available = responses
    .map((text, idx) => ({ text, idx }))
    .filter(({ idx }) => !usageHistory[patternKey].includes(idx));

  // Si se acabieron las variantes, resetear el historial de este patrón
  if (available.length === 0) {
    usageHistory[patternKey] = [];
    const pick = Math.floor(Math.random() * responses.length);
    usageHistory[patternKey].push(pick);
    return responses[pick];
  }

  const pick = available[Math.floor(Math.random() * available.length)];
  usageHistory[patternKey].push(pick.idx);
  return pick.text;
}

// ════════════════════════════════════════════════════════════
//  SCORING: qué tan bien matchea un patrón con el mensaje
// ════════════════════════════════════════════════════════════
function scorePattern(message, triggers) {
  const msg = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  let bestScore = 0;

  for (const trigger of triggers) {
    const normalized = trigger.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Match exacto = 10 puntos
    if (msg === normalized) {
      bestScore = Math.max(bestScore, 10);
    }
    // Match como palabra completa = 5 puntos
    else if (new RegExp(`\\b${normalized}\\b`).test(msg)) {
      bestScore = Math.max(bestScore, 5);
    }
    // Match como substring = 2 puntos
    else if (msg.includes(normalized)) {
      bestScore = Math.max(bestScore, 2);
    }
  }

  return bestScore;
}

// ════════════════════════════════════════════════════════════
//  DETECTAR EMOCIÓN INTENSA
// ════════════════════════════════════════════════════════════
function isHighEnergy(message) {
  return (
    message === message.toUpperCase() && message.length > 3 ||  // MAYÚSCULAS
    (message.match(/!/g) || []).length >= 2 ||                   // muchos !!
    (message.match(/[?]/g) || []).length >= 2 ||                 // muchos ??
    (message.match(/[jJ]/g) || []).length >= 4 ||                // jajajaja
    message.includes('🔥') ||
    message.includes('💯') ||
    message.includes('TEMAS')
  );
}

// ════════════════════════════════════════════════════════════
//  RESPUESTA PRINCIPAL
// ════════════════════════════════════════════════════════════

/**
 * Genera una respuesta de J. basada en el mensaje de la usuaria.
 *
 * @param {string} userMessage - Lo que escribió ella
 * @param {object} context - Contexto opcional
 * @param {string} context.currentSong - Canción que está sonando
 * @param {number} context.messageCount - Cuántos mensajes lleva la conversación
 * @returns {string|null} - Respuesta de J., o null si no debe responder
 */
export function getAIResponse(userMessage, context = {}) {
  const { currentSong = null, messageCount = 0 } = context;
  const msg = userMessage.trim();

  if (!msg) return null;

  // ── Paso 1: Scoring de todos los patrones ──────────────
  const scores = [];

  for (const [patternKey, pattern] of Object.entries(responsePatterns)) {
    const score = scorePattern(msg, pattern.triggers);
    if (score > 0) {
      scores.push({ patternKey, score, pattern });
    }
  }

  // ── Paso 2: Boost por contexto de canción ──────────────
  if (currentSong && songContextResponses[currentSong]) {
    const songPattern = songContextResponses[currentSong];
    const songScore = scorePattern(msg, songPattern.triggers);
    if (songScore > 0) {
      // Bonus: los patrones de canción tienen prioridad
      scores.push({
        patternKey: `song-${currentSong}`,
        score: songScore + 3,  // +3 bonus
        pattern: songPattern,
      });
    }
  }

  // ── Paso 3: Elegir el mejor patrón ─────────────────────
  scores.sort((a, b) => b.score - a.score);

  if (scores.length > 0 && scores[0].score >= 2) {
    let response = pickResponse(scores[0].patternKey, scores[0].pattern.responses);

    // Si es high energy, a veces respondemos con más energía
    if (isHighEnergy(msg) && Math.random() > 0.5) {
      response = response.toUpperCase();
    }

    return response;
  }

  // ── Paso 4: Fallback si nada hizo match ────────────────
  const fallback = fallbackResponses[
    Math.floor(Math.random() * fallbackResponses.length)
  ];

  // A veces el fallback es solo un emoji
  if (Math.random() > 0.7) {
    const emojiOnly = ['❤️', '😏', '🌹', '😂', '🔥', ':3', '👀'][
      Math.floor(Math.random() * 7)
    ];
    return emojiOnly;
  }

  return fallback;
}

// ════════════════════════════════════════════════════════════
//  CALCULAR TIPO DURACIÓN basado en longitud del mensaje
// ════════════════════════════════════════════════════════════

/**
 * Calcula cuánto debe durar el "escribiendo..." según
 * la longitud de la respuesta y un factor de naturalidad.
 *
 * @param {string} response - La respuesta de J.
 * @returns {number} - Milisegundos de typing
 */
export function getTypingDuration(response) {
  const baseLength = response.length;

  // Base: 30ms por carácter (más realista que fijo)
  let duration = baseLength * 30;

  // Mínimo 800ms, máximo 4500ms
  duration = Math.max(800, Math.min(4500, duration));

  // Variación humana: ±20%
  duration *= 0.8 + Math.random() * 0.4;

  return Math.round(duration);
}

// ════════════════════════════════════════════════════════════
//  RESPUESTAS DOBLES (J. a veces manda 2 mensajes seguidos)
// ════════════════════════════════════════════════════════════

const doubleMessageChance = 0.25;  // 25% de probabilidad

const doubleMessageFollowUps = {
  'holaaa': ['cómo estás? :3', 'todo bien? 🎵', 'disfrutando? 😏'],
  'jajaja': ['en serio jjj :v', 'me caes bien 😂', 'no pareces 😏'],
  'gracias': ['de verdad :3', 'te lo mereces 🌹', 'para ti y más ❤️'],
  'amor': ['❤️', '🌹', 'bueno... 😏'],
  'wow': ['y aún no ves nada :v', 'espérate 🔥', 'jjj así es 😌'],
  'fuego': ['🔥🔥', 'dale que sí 😏', 'siempre 🔥'],
};

/**
 * Decide si J. debe mandar un segundo mensaje después del primero.
 *
 * @param {string} firstResponse - La primera respuesta de J.
 * @returns {string|null} - Segundo mensaje, o null
 */
export function maybeGetDoubleMessage(firstResponse) {
  if (Math.random() > doubleMessageChance) return null;

  const lower = firstResponse.toLowerCase();

  for (const [key, followUps] of Object.entries(doubleMessageFollowUps)) {
    if (lower.includes(key)) {
      return followUps[Math.floor(Math.random() * followUps.length)];
    }
  }

  // Follow-up genérico
  const genericFollowUps = [
    ':3',
    'jjj',
    '🎵',
    'bueno...',
    'ya tú sabes 😏',
    '❤️',
  ];

  return genericFollowUps[Math.floor(Math.random() * genericFollowUps.length)];
}
