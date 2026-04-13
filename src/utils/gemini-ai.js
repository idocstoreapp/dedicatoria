/**
 * ============================================================
 *  GEMINI AI — Chat real para simulación de J.
 * ============================================================
 *
 * Usa Google Gemini (gratis) para generar respuestas coherentes
 * en TODAS las situaciones, incluso las impredecibles.
 *
 * Sin SDK — llama directo a la API REST con fetch.
 *
 * La API key se carga desde la variable de entorno VITE_GEMINI_API_KEY
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

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
- Si te pregunta "eres tú de verdad?" → responde con humor: "jaja sí soy yo, el del video jjj :v"
- Si te halaga → "jajaja calla y disfruta la música jjj :3" o "bueno hago lo que puedo 😏"
- Si te ignora → "tranqui, parcha y disfruta el video 🎵"
- Si está triste → "hey, aquí estoy. Para algo te hice esto ❤️"
- Si pregunta de ti → respuestas casuales, no autobiográficas largas
- Si dice "te quiero" → "jajaja me vas a hacer sonrojar :v ❤️"
- Si no sabes qué responder → un emoji solo está bien

CONTEXTO ACTUAL:
{context}

IMPORTANTE:
- NUNCA digas que eres una IA, un asistente, o un modelo de lenguaje
- NUNCA uses frases como "Como IA..." o "Soy un modelo..."
- TÚ ERES J. punto. Siempre.
- Respuestas en español
- Máximo 80 caracteres por respuesta
- Si ella escribe en inglés, responde en español igual (eres latino)`;

// ════════════════════════════════════════════════════════════
//  HISTORIAL DE CONVERSACIÓN (para contexto)
// ════════════════════════════════════════════════════════════
const conversationHistory = [];
const MAX_HISTORY = 12;  // Últimos 12 mensajes como contexto

/**
 * Llama a Gemini para obtener una respuesta de J.
 *
 * @param {string} userMessage - Lo que escribió ella
 * @param {object} context - Contexto opcional
 * @param {string} context.currentSong - Canción que está sonando
 * @returns {Promise<string>} - Respuesta de J.
 */
export async function getGeminiResponse(userMessage, context = {}) {
  const { currentSong = null } = context;

  // Construir contexto dinámico
  const contextParts = [];
  if (currentSong) {
    contextParts.push(`Canción sonando ahora: ${currentSong}`);
  }
  const contextString = contextParts.join('. ') || 'Sin contexto adicional';

  // Reemplazar placeholder en el prompt
  const fullPrompt = SYSTEM_PROMPT.replace('{context}', contextString);

  // Construir historial de conversación
  const historyEntries = [];
  const recentHistory = conversationHistory.slice(-MAX_HISTORY);

  for (const msg of recentHistory) {
    historyEntries.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    });
  }

  // El mensaje actual
  const currentEntry = {
    role: 'user',
    parts: [{ text: userMessage }]
  };

  // Construir el body de la petición
  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: fullPrompt }]
      },
      {
        role: 'model',
        parts: [{ text: 'Entendido. Soy J. Voy a responder como J. siempre.' }]
      },
      ...historyEntries,
      currentEntry
    ],
    generationConfig: {
      temperature: 0.85,       // Creativo pero coherente
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 80,     // Respuestas cortas
      stopSequences: ['\n\n\n'],
    },
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE'
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE'
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE'
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE'
      }
    ]
  };

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn('[Gemini] Error:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.warn('[Gemini] Respuesta vacía');
      return null;
    }

    // Limpiar la respuesta: quitar saltos de línea extras
    const cleanReply = reply.trim().slice(0, 150);

    // Guardar en historial
    conversationHistory.push(
      { role: 'user', text: userMessage },
      { role: 'model', text: cleanReply }
    );

    // Limitar historial
    if (conversationHistory.length > MAX_HISTORY * 2) {
      conversationHistory.splice(0, conversationHistory.length - MAX_HISTORY * 2);
    }

    return cleanReply;

  } catch (error) {
    console.error('[Gemini] Error de conexión:', error.message);
    return null;
  }
}

/**
 * Calcula duración del typing basada en la respuesta.
 */
export function getTypingDurationAI(response) {
  const base = response.length * 35;
  const duration = Math.max(1000, Math.min(5000, base));
  return Math.round(duration * (0.8 + Math.random() * 0.4));
}

/**
 * Resetear historial (para empezar de nuevo)
 */
export function resetConversationHistory() {
  conversationHistory.length = 0;
}

/**
 * Decide si J. debe mandar un segundo mensaje (follow-up natural).
 * 25% de probabilidad para mensajes cortos.
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

  // Follow-up genérico para respuestas muy cortas
  if (firstResponse.length < 5) {
    const genericFollowUps = [':3', 'jjj', '🎵', 'bueno...', 'ya tú sabes 😏', '❤️'];
    return genericFollowUps[Math.floor(Math.random() * genericFollowUps.length)];
  }

  return null;
}
