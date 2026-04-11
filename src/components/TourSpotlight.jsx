import React, { useState, useEffect, useRef } from 'react';

/**
 * TourSpotlight — Enfoca elementos de la UI durante el tour
 *
 * Usa getBoundingClientRect para calcular la posición del elemento
 * y dibuja un anillo pulsante alrededor de él.
 *
 * Evento de timeline:
 *   { id, start, end, type:"tour", target:"id-del-elemento",
 *     tip: "texto de ayuda", tipPosition: "left"|"right"|"bottom"|"top" }
 */
export default function TourSpotlight({ tourEvent, containerRef }) {
  const [pos, setPos] = useState(null);

  useEffect(() => {
    if (!tourEvent?.target) { setPos(null); return; }

    const calculate = () => {
      const el        = document.getElementById(tourEvent.target);
      const container = containerRef?.current;
      if (!el || !container) return;

      const r  = el.getBoundingClientRect();
      const cr = container.getBoundingClientRect();

      setPos({
        cx: r.left - cr.left + r.width  / 2,
        cy: r.top  - cr.top  + r.height / 2,
        w:  r.width  + 28,
        h:  r.height + 28,
        tip:         tourEvent.tip,
        tipPosition: tourEvent.tipPosition || 'bottom',
      });
    };

    // Esperar al siguiente frame para que el elemento esté en el DOM
    requestAnimationFrame(calculate);
  }, [tourEvent?.id, tourEvent?.target]);

  if (!tourEvent || !pos) return null;

  const tipStyle = {
    left  : pos.tipPosition === 'left'  ? 'auto' : pos.tipPosition === 'right' ? '110%' : '50%',
    right : pos.tipPosition === 'left'  ? '110%' : 'auto',
    top   : pos.tipPosition === 'top'   ? 'auto' : pos.tipPosition === 'bottom' ? '110%' : '50%',
    bottom: pos.tipPosition === 'top'   ? '110%' : 'auto',
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
      }}
      aria-hidden="true"
    >
      {/* Anillos pulsantes */}
      <div className="tour-ring tour-ring--1" />
      <div className="tour-ring tour-ring--2" />
      <div className="tour-ring tour-ring--3" />

      {/* Tooltip */}
      {pos.tip && (
        <div className="tour-tip" style={tipStyle}>
          {pos.tip}
        </div>
      )}
    </div>
  );
}
