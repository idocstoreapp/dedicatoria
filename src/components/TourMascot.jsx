import React, { useState, useEffect, useRef } from 'react';

/**
 * TourMascot — Un compañero adorable que guía el tour
 * 
 * Muestra un personaje animado (corazoncito con carita) que:
 * - Se mueve al elemento destacado
 * - Muestra burbujas de diálogo con emojis y animaciones
 * - Reacciona con expresiones diferentes
 * - Tiene partículas flotantes de colores
 */
export default function TourMascot({ tourEvent, containerRef, progress }) {
  const [pos, setPos] = useState(null);
  const [expression, setExpression] = useState('happy');
  const [bubbleText, setBubbleText] = useState('');
  const mascotRef = useRef(null);

  // Expresiones según el tour event
  const expressions = {
    'tour-welcome': 'wave',
    'tour-sesion': 'love',
    'tour-like': 'heart-eyes',
    'tour-play': 'wink',
    'tour-chat': 'excited',
    'tour-video-reveal': 'party',
    'tour-chat-focus': 'happy',
    'default': 'happy'
  };

  const messages = {
    'tour-welcome': '¡Hola de nuevo! ✨',
    'tour-sesion': 'Dany Ocean · Casaparlante 🎵',
    'tour-like': '¡Dale ❤️ cuando te guste!',
    'tour-play': 'Pausa cuando quieras ⏸️',
    'tour-chat': '¡Aquí te hablo yo! 💬',
    'tour-video-reveal': '¡Listo! Empieza la música 🎶',
    'tour-chat-focus': '¡Explora el chat! 💬',
  };

  useEffect(() => {
    if (!tourEvent?.target) {
      setPos(null);
      setBubbleText('');
      return;
    }

    const calculate = () => {
      const el = document.getElementById(tourEvent.target);
      const container = containerRef?.current;
      if (!el || !container) return;

      const r = el.getBoundingClientRect();
      const cr = container.getBoundingClientRect();

      setPos({
        x: r.left - cr.left + r.width / 2,
        y: r.top - cr.top - 60, // Encima del elemento
      });

      setExpression(expressions[tourEvent.id] || expressions.default);
      setBubbleText(messages[tourEvent.id] || '');
    };

    requestAnimationFrame(calculate);
  }, [tourEvent?.id, tourEvent?.target]);

  if (!tourEvent || !pos) return null;

  return (
    <div
      className="tour-mascot-container"
      style={{ left: pos.x, top: pos.y }}
      ref={mascotRef}
    >
      {/* Partículas flotantes */}
      <div className="tour-particles">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="tour-particle" style={{ '--delay': `${i * 0.3}s` }} />
        ))}
      </div>

      {/* Burbuja de diálogo */}
      {bubbleText && (
        <div className="tour-mascot-bubble">
          <span className="tour-mascot-text">{bubbleText}</span>
          <div className="tour-mascot-bubble-tail" />
        </div>
      )}

      {/* Mascota - Corazoncito con carita */}
      <div className={`tour-mascot tour-mascot-${expression}`}>
        <div className="tour-mascot-body">
          {/* Corazón base */}
          <div className="tour-mascot-heart">
            <span className="tour-mascot-heart-left" />
            <span className="tour-mascot-heart-right" />
          </div>
          
          {/* Carita */}
          <div className="tour-mascot-face">
            {/* Ojos */}
            <div className="tour-mascot-eyes">
              <div className={`tour-mascot-eye ${expression === 'wink' ? 'winking' : ''}`} />
              <div className={`tour-mascot-eye ${expression === 'heart-eyes' ? 'hearts' : ''}`} />
            </div>
            
            {/* Boca */}
            <div className={`tour-mascot-mouth mouth-${expression}`} />
            
            {/* Mejillas */}
            <div className="tour-mascot-cheeks">
              <div className="tour-mascot-cheek" />
              <div className="tour-mascot-cheek" />
            </div>
          </div>
        </div>
        
        {/* Patitas */}
        <div className="tour-mascot-paws">
          <div className="tour-mascot-paw tour-mascot-paw-left" />
          <div className="tour-mascot-paw tour-mascot-paw-right" />
        </div>
      </div>
    </div>
  );
}
