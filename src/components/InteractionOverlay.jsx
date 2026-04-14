import React, { useState, useEffect, useRef } from 'react';

/**
 * InteractionOverlay — Sistema de interacciones en tiempo real
 *
 * Tipos de interacción (definidos en timeline):
 *   "question"   → Pregunta con opciones (Sí/No o custom)
 *   "toast"      → Mensaje flotante tipo notificación ("¿Es un temazo?")
 *   "reaction"   → Reacción rápida con emoji
 *
 * Props:
 *   interaction → objeto del evento activo (o null)
 *   onAnswer    (answer, interaction) → callback al responder
 */
const InteractionOverlay = ({ interaction, onAnswer }) => {
  const [answered, setAnswered] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const prevIdRef = useRef(null);

  // Reset al cambiar de interacción
  useEffect(() => {
    if (interaction?.id !== prevIdRef.current) {
      prevIdRef.current = interaction?.id;
      setAnswered(null);
      setDismissed(false);
    }
  }, [interaction?.id]);

  if (!interaction || dismissed) return null;

  const handleAnswer = (answer) => {
    setAnswered(answer);
    onAnswer?.(answer, interaction);
    // Dismiss después de 2 segundos
    setTimeout(() => setDismissed(true), 2000);
  };

  const handleDismiss = () => setDismissed(true);

  // ── PREGUNTA (con opciones) ──────────────────────────────
  if (interaction.kind === 'question') {
    const options = interaction.options || ['Sí ✓', 'No ✗'];
    return (
      <div className="interaction-wrapper">
        <div className="interaction-card interaction-card--question">
          <p className="interaction-text">{interaction.text}</p>
          {!answered ? (
            <div className="interaction-options">
              {options.map((opt, i) => (
                <button
                  key={i}
                  className={`interaction-btn interaction-btn--${i === 0 ? 'yes' : 'no'}`}
                  onClick={() => handleAnswer(opt)}
                  id={`interaction-opt-${i}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <div className="interaction-answered">
              <span className="interaction-emoji">
                {answered === options[0] ? '🎉' : '😌'}
              </span>
              <p className="interaction-reply">
                {interaction.replyYes && answered === options[0]
                  ? interaction.replyYes
                  : interaction.replyNo || '¡Gracias por responder!'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── TOAST / NOTIFICACIÓN ─────────────────────────────────
  if (interaction.kind === 'toast') {
    return (
      <div className="interaction-wrapper interaction-wrapper--toast">
        <div className="interaction-toast">
          {interaction.emoji && (
            <span className="toast-emoji">{interaction.emoji}</span>
          )}
          <div className="toast-content">
            <p className="toast-text">{interaction.text}</p>
            {interaction.subtext && (
              <p className="toast-subtext">{interaction.subtext}</p>
            )}
          </div>
          {interaction.options && !answered && (
            <div className="toast-actions">
              {interaction.options.map((opt, i) => (
                <button
                  key={i}
                  className="toast-btn"
                  onClick={() => handleAnswer(opt)}
                  id={`toast-opt-${i}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
          <button
            className="toast-close"
            onClick={handleDismiss}
            aria-label="Cerrar"
          >×</button>
        </div>
      </div>
    );
  }

  return null;
}

export default React.memo(InteractionOverlay);
