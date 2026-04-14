import React, { useState, useEffect, useRef } from 'react';

/**
 * TourSpotlight — Enfoca elementos de la UI durante el tour
 * 
 * Versión mejorada con:
 * - Anillos con gradientes vibrantes y animaciones suaves
 * - Efecto de aura luminosa alrededor del elemento
 * - Tooltip con diseño de burbuja colorida
 * - Partículas orbitando alrededor del spotlight
 *
 * Evento de timeline:
 *   { id, start, end, type:"tour", target:"id-del-elemento",
 *     tip: "texto de ayuda", tipPosition: "left"|"right"|"bottom"|"top" }
 */
const TourSpotlight = ({ tourEvent, containerRef }) => {
  const [pos, setPos] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!tourEvent?.target) { 
      setPos(null); 
      setIsVisible(false);
      return; 
    }

    const calculate = () => {
      const el        = document.getElementById(tourEvent.target);
      const container = containerRef?.current;
      if (!el || !container) return;

      const r  = el.getBoundingClientRect();
      const cr = container.getBoundingClientRect();

      setPos({
        cx: r.left - cr.left + r.width  / 2,
        cy: r.top  - cr.top  + r.height / 2,
        w:  r.width  + 12,
        h:  r.height + 12,
        tip:         tourEvent.tip,
        tipPosition: tourEvent.tipPosition || 'bottom',
      });

      // Animación de entrada
      requestAnimationFrame(() => setIsVisible(true));
    };

    requestAnimationFrame(calculate);
  }, [tourEvent?.id, tourEvent?.target]);

  if (!tourEvent || !pos) return null;

  const tipStyle = {
    left  : pos.tipPosition === 'left'  ? 'auto' : pos.tipPosition === 'right' ? '115%' : '50%',
    right : pos.tipPosition === 'left'  ? '115%' : 'auto',
    top   : pos.tipPosition === 'top'   ? 'auto' : pos.tipPosition === 'bottom' ? '115%' : '50%',
    bottom: pos.tipPosition === 'top'   ? '115%' : 'auto',
    transform: (pos.tipPosition === 'left' || pos.tipPosition === 'right')
      ? 'translateY(-50%)'
      : 'translateX(-50%)',
  };

  return (
    <div
      className="tour-spotlight"
      style={{
        left:   pos.cx,
        top:    pos.cy,
        width:  pos.w,
        height: pos.h,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
      aria-hidden="true"
    >
      {/* Aura luminosa */}
      <div className="tour-aura" />

      {/* Anillos con gradientes */}
      <div className="tour-ring tour-ring--gradient tour-ring--1" />
      <div className="tour-ring tour-ring--gradient tour-ring--2" />
      <div className="tour-ring tour-ring--gradient tour-ring--3" />

      {/* Partículas orbitando */}
      <div className="tour-orbitals">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="tour-orbital" style={{ '--delay': `${i * 0.5}s` }} />
        ))}
      </div>

      {/* Tooltip con burbuja colorida */}
      {pos.tip && (
        <div className="tour-tip tour-tip--enhanced" style={tipStyle}>
          <div className="tour-tip-content">
            <span className="tour-tip-text">{pos.tip}</span>
          </div>
          <div className="tour-tip-arrow" />
        </div>
      )}
    </div>
  );
}

export default React.memo(TourSpotlight);
