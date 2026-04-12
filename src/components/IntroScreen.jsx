import React, { useState, useEffect, useRef } from 'react';

/**
 * IntroScreen — Pantalla de inicio estilo créditos de película
 *
 * Secuencia:
 *  1. "Hola chica linda..." → máquina de escribir → se quita
 *  2. "Esto es una experiencia interactiva" → aparece → se quita
 *  3. "hecha con mucho amor ❤️"            → aparece → se quita
 *  4. "Espero que te guste la música del Caribe." + "— J." (con delay entre sí)
 *     → ambos se quitan juntos
 *  5. Todo queda vacío un momento → aparece botón INICIAR
 */

// Duración que cada mensaje permanece visible antes de salir (ms)
const HOLD = 1800;
const FADE = 600;   // duración CSS de la animación de fade

export default function IntroScreen({ onStart }) {
  // Cada fase es un estado del "carrusel de mensajes"
  // 'typewrite' | 'msg2' | 'msg3' | 'msg4' | 'button'
  const [phase, setPhase] = useState('typewrite');
  const [typed, setTyped] = useState('');
  const [msgVisible, setMsgVisible] = useState(false);   // controla fade in/out
  const [line2Vis, setLine2Vis] = useState(false);   // "— J." entra un poco después
  const [showBtn, setShowBtn] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const rootRef = useRef(null);



  // ── Secuencia de fases ─────────────────────────────────
  useEffect(() => {
    // ── FASE 1: Máquina de escribir "Hola chica linda..." ─
    if (phase === 'typewrite') {
      const text = 'Hola chica linda...';
      let i = 0;
      setTyped('');

      const interval = setInterval(() => {
        i++;
        setTyped(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          // Esperar un poco → luego fade out → siguiente
          setTimeout(() => {
            setMsgVisible(false);          // dispara clase fade-out
            setTimeout(() => setPhase('msg2'), FADE);
          }, HOLD);
        }
      }, 55);

      // El mensaje aparece visible desde el primer caracter
      setMsgVisible(true);
      return () => clearInterval(interval);
    }

    // ── FASE 2: "Esto es una experiencia interactiva" ─────
    if (phase === 'msg2') {
      setMsgVisible(true);
      setTimeout(() => {
        setMsgVisible(false);
        setTimeout(() => setPhase('msg3'), FADE);
      }, HOLD);
    }

    // ── FASE 3: "hecha con mucho amor ❤️" ─────────────────
    if (phase === 'msg3') {
      setMsgVisible(true);
      setTimeout(() => {
        setMsgVisible(false);
        setTimeout(() => setPhase('msg4'), FADE);
      }, HOLD);
    }

    // ── FASE 4: "Espero que…" + "— J." juntos ────────────
    if (phase === 'msg4') {
      setMsgVisible(true);
      // "— J." aparece 900ms después
      setTimeout(() => setLine2Vis(true), 900);
      // Ambos se van juntos
      setTimeout(() => {
        setMsgVisible(false);
        setLine2Vis(false);
        setTimeout(() => setPhase('button'), FADE + 200);
      }, HOLD + 1200);
    }

    // ── FASE 5: Botón INICIAR ─────────────────────────────
    if (phase === 'button') {
      setTimeout(() => setShowBtn(true), 300);
    }
  }, [phase]);

  // ── Click en INICIAR ──────────────────────────────────
  const handleStart = () => {
    onStart?.();
  };

  // ── Clases de visibilidad ─────────────────────────────
  const vis = msgVisible ? 'intro-msg--in' : 'intro-msg--out';
  const vis2 = line2Vis ? 'intro-msg--in' : 'intro-msg--out';

  return (
    <div ref={rootRef} className="intro-root">



      {/* Capas decorativas */}
      <div className="intro-veil" aria-hidden="true" />
      <div className="intro-vignette" aria-hidden="true" />

      {/* ── CONTENIDO CENTRAL ───────────────────────────── */}
      <div className="intro-content" aria-live="polite">

        {/* Badge superior sutil */}
        <p className="intro-badge">✦ 20 MINUTOS PARA HACERTE COMPAÑIA</p>

        {/* ── Mensajes del carrusel ───────────────────── */}
        <div className="intro-stage">

          {/* FASE 1 — Typewriter */}
          {phase === 'typewrite' && (
            <p className={`intro-msg intro-msg--lg ${vis}`}>
              {typed}
              <span className="intro-cursor" aria-hidden="true">|</span>
            </p>
          )}

          {/* FASE 2 */}
          {phase === 'msg2' && (
            <p className={`intro-msg ${vis}`}>
              Esto es una experiencia interactiva
            </p>
          )}

          {/* FASE 3 */}
          {phase === 'msg3' && (
            <p className={`intro-msg ${vis}`}>
              hecha para ti con mucho cariño
            </p>
          )}

          {/* FASE 4 — Dos líneas */}
          {phase === 'msg4' && (
            <div className="intro-duo">
              <p className={`intro-msg ${vis}`}>
                Espero que te guste la música del Caribe.
              </p>
              <p className={`intro-msg intro-msg--signature ${vis2}`}>
                — J.
              </p>
            </div>
          )}

          {/* FASE 5 — Botón */}
          {phase === 'button' && showBtn && (
            <button
              className={`intro-start-btn ${btnHovered ? 'hovered' : ''}`}
              onClick={handleStart}
              onMouseEnter={() => setBtnHovered(true)}
              onMouseLeave={() => setBtnHovered(false)}
              id="intro-start-btn"
            >
              <span className="btn-ring btn-ring--1" aria-hidden="true" />
              <span className="btn-ring btn-ring--2" aria-hidden="true" />
              <span className="btn-play-icon" aria-hidden="true">▶</span>
              <span className="btn-label">INICIAR</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
