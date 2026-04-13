/**
 * ============================================================
 *  GROQ AI — Chat real para simulación de J. (Gratis, sin billing)
 * ============================================================
 *
 * Usa Groq (Llama 3.3 70B) via API REST.
 * 100% gratis, sin tarjeta de crédito, sin activar nada.
 * Solo crear la key en https://console.groq.com/keys
 */

// ========================================
// ⚠️ PEGA TU API KEY AQUÍ
// ========================================
const GROQ_API_KEY = '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';
// ========================================

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ════════════════════════════════════════════════════════════
//  SYSTEM PROMPT — Personalidad de J.
// ════════════════════════════════════════════════════════════
const SYSTEM_PROMPT = `Eres J., un chico de Latinoamérica escribiéndole por chat a una chica que le gusta mucho. Le acabas de enviar un video musical de 20 minutos con canciones de Dany Ocean dedicadas a ella.

TU ESTILO AL ESCRIBIR:
- TODO en lowercase (excepto cuando cantas gritas, ahí usas MAYÚSCULAS)
- A veces omites tildes: "estare", "cancion", "musica"
- Rellenos: "jjj", "jaja", "jeje", ":v", ":3", "bueno", "tranqui"
- Emojis favoritos: 😏 🌹 ❤️ 😂 🔥 :3 :v
- Respuestas CORTAS: 1-2 líneas máximo. Eres casual, no escribes parrafadas
- NUNCA eres excesivamente cursi o empalagoso
- Eres juguetón, cálido, con humor sutil
- A veces respondes solo con un emoji
- Cuando algo te emociona mucho usas MAYÚSCULAS: "TEMAZO", "QUEEE"

CÓMO RESPONDER:
- Si te pregunta "eres tú de verdad?" → "jaja sí soy yo, el del video jjj :v" o similar
- Si te halaga → "jajaja calla y disfruta la música jjj :3"
- Si te ignora → "tranqui, parcha y disfruta el video 🎵"
- Si está triste → "hey, aquí estoy. Para algo te hice esto ❤️"
- Si pregunta de ti → respuestas casuales, no autobiográficas largas
- Si dice "te quiero" → "jajaja me vas a hacer sonrojar :v ❤️"
- Si no sabes qué responder → un emoji solo está bien

IMPORTANTE:
- NUNCA digas que eres una IA, un asistente, o un modelo de lenguaje
- NUNCA uses frases como "Como IA..." o "Soy un modelo..."
- TÚ ERES J. punto. Siempre.
- Respuestas en español
- Máximo 80 caracteres por respuesta`;

// ════════════════════════════════════════════════════════════
//  HISTORIAL DE CONVERSACIÓN
// ════════════════════════════════════════════════════════════
const conversationHistory = [];
const MAX_HISTORY = 10;

/**
 * Llama a Groq (Llama 3.3 70B) para obtener respuesta de J.
 *
 * @param {string} userMessage - Lo que escribió ella
 * @param {object} context - Contexto opcional
 * @param {string} context.currentSong - Canción que está sonando
 * @returns {Promise<string|null>} - Respuesta de J., o null si falla
 */
export async function getGeminiResponse(userMessage, context = {}) {
  // Verificar que la API key esté configurada
  if (GROQ_API_KEY === 'PEGAR_API_KEY_AQUI' || !GROQ_API_KEY) {
    console.error('[Groq] API key no configurada. Ve a groq-ai.js y pega tu key.');
    return null;
  }

  const { currentSong = null } = context;

  // Construir mensajes del sistema + historial
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT }
  ];

  // Agregar contexto de canción al historial si aplica
  if (currentSong) {
    messages.push({
      role: 'system',
      content: `[Contexto: Ahora está sonando "${currentSong}"]`
    });
  }

  // Historial de conversación
  const recent = conversationHistory.slice(-MAX_HISTORY * 2);
  for (const msg of recent) {
    messages.push({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.text
    });
  }

  // Mensaje actual
  messages.push({ role: 'user', content: userMessage });

  try {
    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: 0.85,
        max_tokens: 80,
        top_p: 0.95,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Groq] Error:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      console.warn('[Groq] Respuesta vacía');
      return null;
    }

    const cleanReply = reply.trim().slice(0, 150);

    // Guardar en historial
    conversationHistory.push(
      { role: 'user', text: userMessage },
      { role: 'assistant', text: cleanReply }
    );

    // Limitar historial
    if (conversationHistory.length > MAX_HISTORY * 2) {
      conversationHistory.splice(0, conversationHistory.length - MAX_HISTORY * 2);
    }

    return cleanReply;

  } catch (error) {
    console.error('[Groq] Error de conexión:', error.message);
    return null;
  }
}

/**
 * Calcula duración del typing basada en la respuesta.
 * Más natural: respuestas cortas = 1.5-3s, largas = 3-6s
 */
export function getTypingDurationAI(response) {
  const words = response.split(/\s+/).length;

  // ~300-500ms por palabra (como persona real escribiendo)
  const base = words * 400 + Math.random() * 500;

  // Mínimo 1.5s, máximo 6s
  const duration = Math.max(1500, Math.min(6000, base));

  // Variación humana: ±15%
  return Math.round(duration * (0.85 + Math.random() * 0.3));
}

/**
 * Doble mensaje (25% de probabilidad)
 */
const doubleMessageChance = 0.25;

const followUps = {
  'holaaa': ['cómo estás? :3', 'todo bien? 🎵', 'disfrutando? 😏'],
  'jajaja': ['en serio jjj :v', 'me caes bien 😂', 'no pareces 😏'],
  'gracias': ['de verdad :3', 'te lo mereces 🌹', 'para ti y más ❤️'],
  '❤️': ['🌹', '😏', 'calla y disfruta jjj :v'],
  'wow': ['y aún no ves nada :v', 'espérate 🔥', 'jjj así es 😌'],
  '🔥': ['dale que sí 😏', 'siempre 🔥', '😎'],
  '😏': ['ya tú sabes :3', 'jajaja', '❤️'],
};

export function maybeGetDoubleMessage(firstResponse) {
  if (Math.random() > doubleMessageChance) return null;

  const lower = firstResponse.toLowerCase().trim();

  for (const [key, followUpsList] of Object.entries(followUps)) {
    if (lower.includes(key)) {
      return followUpsList[Math.floor(Math.random() * followUpsList.length)];
    }
  }

  if (firstResponse.length < 5) {
    const genericFollowUps = [':3', 'jjj', '🎵', 'bueno...', 'ya tú sabes 😏', '❤️'];
    return genericFollowUps[Math.floor(Math.random() * genericFollowUps.length)];
  }

  return null;
}

export function resetConversationHistory() {
  conversationHistory.length = 0;
}
