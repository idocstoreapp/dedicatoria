import React, { useState, useRef } from 'react';

/**
 * MessageForm — Formulario de mensaje al final de la experiencia
 *
 * Envía a Formspree (o Google Sheets vía Apps Script).
 * El endpoint se configura en timelineConfig.js → interactionConfig.messageFormEndpoint
 *
 * Props:
 *   onClose     () → cerrar el formulario
 *   onSent      () → mensaje enviado correctamente
 *   endpoint    string → URL de Formspree o Google Apps Script
 *   senderName  string → nombre de quien ve la experiencia (para personalizar)
 */
export default function MessageForm({ onClose, onSent, endpoint, senderName = 'tú' }) {
  const [message, setMessage] = useState('');
  const [emoji, setEmoji] = useState('❤️');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const textRef = useRef(null);

  const emojis = ['❤️', '🥹', '😍', '🌊', '🌙', '💜', '🐰', '✨'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus('sending');

    try {
      if (!endpoint || endpoint.includes('TU_ENDPOINT')) {
        // Modo demo: simular envío
        await new Promise(r => setTimeout(r, 1200));
        setStatus('sent');
        setTimeout(() => onSent?.(), 2000);
        return;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          message,
          emoji,
          from: senderName,
          timestamp: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setStatus('sent');
        setTimeout(() => onSent?.(), 2500);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="msgform-overlay" role="dialog" aria-modal="true" aria-label="Dejar un mensaje">

      {/* Backdrop */}
      <div className="msgform-backdrop" onClick={onClose} aria-hidden="true" />

      <div className="msgform-card">
        <button className="msgform-close" onClick={onClose} aria-label="Cerrar">×</button>

        {status === 'sent' ? (
          /* ── Estado: enviado ─────────────────────────── */
          <div className="msgform-success">
            <div className="msgform-success-icon">💌</div>
            <h3 className="msgform-success-title">¡Mensaje enviado!</h3>
            <p className="msgform-success-text">
              Lo voy a leer con mucha atención ❤️
            </p>
          </div>

        ) : (
          /* ── Formulario ──────────────────────────────── */
          <>
            <div className="msgform-header">
              <span className="msgform-icon">💌</span>
              <h3 className="msgform-title">¿Quieres dejarme un mensaje?</h3>
              <p className="msgform-subtitle">Lo leo yo solito, prometo</p>
            </div>

            <form onSubmit={handleSubmit} className="msgform-form">
              {/* Selector de emoji */}
              <div className="msgform-emojis" role="group" aria-label="Selecciona un emoji">
                {emojis.map(e => (
                  <button
                    key={e}
                    type="button"
                    className={`msgform-emoji-btn ${emoji === e ? 'active' : ''}`}
                    onClick={() => setEmoji(e)}
                    aria-pressed={emoji === e}
                  >
                    {e}
                  </button>
                ))}
              </div>

              {/* Textarea */}
              <textarea
                ref={textRef}
                className="msgform-textarea"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Escribe lo que quieras... lo que sientas, lo que pienses..."
                maxLength={500}
                rows={5}
                required
                disabled={status === 'sending'}
              />
              <p className="msgform-char-count">{message.length}/500</p>

              {/* Botón enviar */}
              <button
                type="submit"
                className="msgform-submit"
                disabled={!message.trim() || status === 'sending'}
                id="msgform-submit-btn"
              >
                {status === 'sending' ? (
                  <span>Enviando...</span>
                ) : status === 'error' ? (
                  <span>Error — ¿intentamos de nuevo?</span>
                ) : (
                  <span>{emoji} Enviar mensaje</span>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
