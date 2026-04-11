# 🎬 Guía de uso — Dedicatoria Audiovisual

---

## ⚙️ El archivo central de control

```
src/config/timelineConfig.js
```

Todo se controla desde aquí. Cada elemento tiene `start` y `end` **en segundos**.

```js
{
  id: "mi-elemento",  // identificador único (nunca repetir)
  start: 30,          // aparece en el segundo 30
  end: 38,            // desaparece en el segundo 38
  type: "lyric",      // tipo de elemento
  // ...campos específicos del tipo
}
```

---

## 📌 1. Texto fijado varios segundos ("sticky")

```js
{
  id: "lyric-fijado",
  start: 10, end: 15,
  type: "lyric",
  content: "Para siempre",
  style: "romantic",
  animation: "fade",
  position: "center",
  sticky: true,        // NO desaparece al llegar al end
  stickDuration: 6,    // se queda 6 segundos EXTRA
}
// Visible: seg 10 → 21 (15 + 6)
```

**Estilos de texto:**
| `style` | Aspecto |
|---|---|
| `"romantic"` | Serif dorado con glow — ideal sobre negro |
| `"urban"` | Bold blanco con sombra fuerte |
| `"glitch"` | Neón con efecto glitch digital |
| `"minimal"` | Pequeño, sutil, fade simple |

**Animaciones de entrada:** `"fade"` · `"zoom"` · `"slide"` · `"bounce"`

---

## ⬛ 2. Fondo negro (video sigue corriendo debajo)

```js
// Negro de fondo
{ id: "negro-1", start: 60, end: 70, type: "blackout" },

// Texto encima del negro (mismo rango de tiempo)
{ id: "lyric-negro", start: 62, end: 68, type: "lyric",
  content: "Solo nosotros",
  style: "romantic", animation: "fade", position: "center",
  sticky: true, stickDuration: 3 },
```

> **Regla:** `blackout` y `lyric` son siempre **dos objetos separados**. Uno tapa el video, el otro pone el texto encima.

---

## 🎞️ 3. GIF o imagen encima del video

```js
{ id: "gif-1", start: 45, end: 60, type: "overlay",
  src: "/assets/heart.gif",
  position: "top-right",
  size: "medium" },
```

**Posiciones:** `"center"` · `"top-right"` · `"top-left"` · `"bottom-right"` · `"bottom-left"`
**Tamaños:** `"small"` (~60px) · `"medium"` (~100px) · `"large"` (~160px)

Coloca tus GIFs e imágenes en la carpeta `public/assets/`.

---

## 🕐 4. Controlar tiempos exactos

Tabla rápida de conversión:

```
1:00 min  = 60s     5:00 min  = 300s
1:30 min  = 90s     10:00 min = 600s
2:00 min  = 120s    15:00 min = 900s
2:30 min  = 150s    15:54 min = 954s
```

Activa `debugMode: true` en `timelineConfig.js` para ver el segundo exacto en pantalla mientras corre el video. Apágalo cuando termines.

---

## 🎯 5. Interacciones — Los 2 tipos incluidos

### Tipo A: Pregunta Sí/No (o custom)

Aparece como card centrada abajo. El usuario elige una opción y ve la respuesta.

```js
{
  id: "q-sabes-la-cancion",
  start: 30,
  end: 38,
  type: "interaction",
  kind: "question",
  text: "¿Te la sabes?",
  options: ["Sí 🎵", "No todavía"],    // máx 3 opciones
  replyYes: "¡Sabría que sí! 😊",      // respuesta si elige la opción 0
  replyNo: "Ahora la aprendes 🎹",     // respuesta si elige otra opción
},
```

### Tipo B: Toast / Notificación flotante

Aparece en la esquina superior derecha, como notificación de Instagram.

```js
{
  id: "toast-temazo",
  start: 60,
  end: 68,
  type: "interaction",
  kind: "toast",
  emoji: "🔥",
  text: "¿Es un temazo o no es un temazo?",
  subtext: "Dale si estás de acuerdo",
  options: ["🔥 Es un temazo", "🤷 Puede ser"],
},
```

---

## 🛠️ 6. Cómo crear una interacción NUEVA (tipo personalizado)

> Si quieres algo que no es ni pregunta ni toast (por ejemplo: un mini juego, un contador, una animación especial), sigue estos 3 pasos.

### Paso 1 — Agregar el tipo al timeline

En `timelineConfig.js`, agrega tu evento con un `kind` nuevo:

```js
{
  id: "mi-interaccion-custom",
  start: 45,
  end: 55,
  type: "interaction",
  kind: "mi-tipo",         // ← nombre que tú inventas
  // ...los campos que necesites
  miDato: "hola",
  miNumero: 42,
},
```

### Paso 2 — Agregar el render en `InteractionOverlay.jsx`

Abre `src/components/InteractionOverlay.jsx` y agrega un `if` al final:

```jsx
// Agrega ANTES del último `return null`:

if (interaction.kind === 'mi-tipo') {
  return (
    <div className="interaction-wrapper">
      {/*
        Aquí pones el JSX de tu interacción.
        Puedes usar los mismos estilos o crear nuevas clases CSS.
        Tienes disponible:
          interaction.miDato
          interaction.miNumero
          answered  → null si no respondió aún
          handleAnswer(respuesta)  → llama esto al responder
      */}
      <div className="interaction-card--question">
        <p>Mi interacción custom: {interaction.miDato}</p>
        <button onClick={() => handleAnswer('ok')}>OK</button>
      </div>
    </div>
  );
}
```

### Paso 3 — Agregar estilos CSS (opcional)

En `src/styles/global.css`, busca la sección `INTERACTION OVERLAY` y agrega tus estilos:

```css
/* Mi tipo custom */
.mi-interaccion-custom { ... }
```

### Ejemplo completo: Contador de "¿cuántas veces dijeron tu nombre?"

```js
// En timelineConfig.js:
{ id: "contador-nombre", start: 120, end: 180,
  type: "interaction", kind: "counter",
  text: "¿Cuántas veces dijeron tu nombre?",
  emoji: "👂" },
```

```jsx
// En InteractionOverlay.jsx:
if (interaction.kind === 'counter') {
  const [clicks, setClicks] = React.useState(0);
  return (
    <div className="interaction-wrapper">
      <div className="interaction-card--question">
        <p>{interaction.emoji} {interaction.text}</p>
        <button onClick={() => setClicks(c => c + 1)}>
          +1 vez ({clicks})
        </button>
        {clicks > 0 && (
          <p>¡Escuché {clicks} {clicks === 1 ? 'vez' : 'veces'}! 🎶</p>
        )}
      </div>
    </div>
  );
}
```

---

## ❤️ 7. El botón de likes (❤️)

Aparece automáticamente cuando el video está reproduciéndose.

- **Click** → lanza corazones flotantes
- Acumula el conteo durante la canción
- Al pausar muestra: "Le diste 5 likes a esta canción ❤️"

No necesitas configurar nada — funciona solo.

Si quieres **activar/desactivar** el like en ciertos tracks, edita `App.jsx`:
```jsx
{isPlaying && likeEnabled && <LikeButton onLike={handleLike} />}
```

---

## 🎵 8. Agregar tracks a la biblioteca

### Paso 1 — Coloca el video
```
public/videos/nombre-del-track.mp4
```

### Paso 2 — Agrega en `src/config/libraryConfig.js`

```js
{
  id: "track-unico",
  title: "El título visible",
  subtitle: "Frase corta",
  category: "feelings",
  emoji: "💜",
  color: "#8800ff",
  gradient: "linear-gradient(135deg, #1a0033 0%, #2d0060 100%)",
  src: "/videos/nombre-del-track.mp4",
  thumbnail: "/thumbs/nombre.jpg",    // opcional
  timeline: [],                       // letras sincronizadas (opcional)
},
```

**Categorías:**
| ID | Etiqueta |
|---|---|
| `"thoughts"` | Pensando en ti |
| `"feelings"` | Lo que siento |
| `"missing"` | Te extraño |
| `"time"` | El tiempo que es |
| `"love"` | Con amor |
| `"badbunny"` | Bad Bunny |

---

## 🐰 9. Bonus Track (Bad Bunny DTMF)

Se activa automáticamente al terminar el video principal.

**Archivos necesarios:**
- `public/bonus-video.mp4` ← tu canción DTMF de Bad Bunny

**Personalización** en `timelineConfig.js → bonusConfig`:
```js
export const bonusConfig = {
  enabled: true,
  teaser: {
    line1: "No me quería quedar con las ganas de decírtelo...",
    line2: "Solo Bad Bunny puede decirlo 🐰",
    ctaText: "Escuchar la dedicatoria final →",
    delayBeforeCTA: 4000,
  },
  video: { src: "/bonus-video.mp4", title: "DTMF", artist: "Bad Bunny" },
  redirectToLibrary: true,
};
```

---

## 💌 10. Formulario de mensaje (al final)

La chica puede dejarte un mensaje al terminar el video.

**Activar en `interactionConfig`:**
```js
export const interactionConfig = {
  showMessageFormOnEnd: true,
  messageFormEndpoint: 'https://formspree.io/f/TU_ENDPOINT',
};
```

**Cómo conseguir el endpoint (5 min):**
1. Crea cuenta gratuita en **[formspree.io](https://formspree.io)**
2. Crea un nuevo formulario → copia la URL que te dan
3. Pégala en `messageFormEndpoint`
4. Los mensajes llegan a tu email automáticamente

---

## 📁 Estructura de archivos de assets

```
public/
├── video.mp4              ← VIDEO PRINCIPAL (15:54)
├── bonus-video.mp4        ← DTMF de Bad Bunny
│
├── assets/
│   ├── heart.gif
│   └── (tus gifs e imágenes)
│
└── videos/
    ├── pensar-en-ti.mp4
    ├── triste.mp4
    ├── extrano.mp4
    └── (tracks de la biblioteca)
```

---

## 🗺️ Flujo completo de la app

```
Carga → [Intro cinematográfica + video borroso de fondo]
           ↓ INICIAR
       [Video principal 15:54]
           ↓ al terminar
       [Bonus Track — Bad Bunny DTMF]
           ↓ al terminar
       [Biblioteca "Pensando en ti"]
           ↓ selecciona track
       [Video del track seleccionado]
```
