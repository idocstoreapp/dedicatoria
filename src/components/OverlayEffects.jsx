import React, { useEffect, useRef } from 'react';

/**
 * OverlayEffects — Muestra GIFs e imágenes superpuestos
 *
 * Props:
 *   overlays → array de eventos de overlay activos
 *     [{ id, src, position, size }]
 *   activeEffect → string del efecto puntual ('flash', 'shake', null)
 *   onEffectDone → callback cuando el efecto termina
 *   containerRef → ref del contenedor principal para shake
 */
const OverlayEffects = ({ overlays = [], activeEffect, onEffectDone, containerRef }) => {
  const flashRef = useRef(null);

  // Efecto FLASH
  useEffect(() => {
    if (activeEffect === 'flash' && flashRef.current && window.gsap) {
      window.gsap.timeline({ onComplete: () => onEffectDone?.() })
        .to(flashRef.current, { opacity: 0.85, duration: 0.08, ease: 'power2.in' })
        .to(flashRef.current, { opacity: 0, duration: 0.4, ease: 'power2.out' });
    }
  }, [activeEffect]);

  // Efecto SHAKE
  useEffect(() => {
    if (activeEffect === 'shake' && containerRef?.current && window.gsap) {
      window.gsap.timeline({ onComplete: () => onEffectDone?.() })
        .to(containerRef.current, { x: -8, duration: 0.06, ease: 'power2.inOut' })
        .to(containerRef.current, { x: 8, duration: 0.06, ease: 'power2.inOut' })
        .to(containerRef.current, { x: -6, duration: 0.06, ease: 'power2.inOut' })
        .to(containerRef.current, { x: 6, duration: 0.06, ease: 'power2.inOut' })
        .to(containerRef.current, { x: 0, duration: 0.08, ease: 'power2.out' });
    }
  }, [activeEffect, containerRef]);

  return (
    <>
      {/* Flash overlay */}
      <div
        ref={flashRef}
        className="flash-overlay"
        aria-hidden="true"
      />

      {/* Overlays activos (GIFs, imágenes) */}
      {overlays.map(({ id, src, position, size }) => (
        <OverlayItem
          key={id}
          src={src}
          position={position}
          size={size}
        />
      ))}
    </>
  );
};

export default React.memo(OverlayEffects);
// ─── ITEM INDIVIDUAL ─────────────────────────────────────────

function OverlayItem({ src, position, size }) {
  const itemRef = useRef(null);

  // Animar entrada con GSAP
  useEffect(() => {
    if (!itemRef.current || !window.gsap) return;

    // Posición especial para center
    const isCenter = position === 'center';

    window.gsap.fromTo(itemRef.current,
      {
        scale: 0,
        opacity: 0,
        rotation: -15,
        ...(isCenter ? { xPercent: -50, yPercent: -50 } : {}),
      },
      {
        scale: 1,
        opacity: 1,
        rotation: 0,
        duration: 0.5,
        ease: 'back.out(1.7)',
        ...(isCenter ? { xPercent: -50, yPercent: -50 } : {}),
      }
    );

    return () => {
      if (window.gsap && itemRef.current) {
        window.gsap.to(itemRef.current, { scale: 0, opacity: 0, duration: 0.3 });
      }
    };
  }, []);

  const posClass = `overlay-${position}`;
  const sizeClass = `overlay-${size}`;

  return (
    <div
      ref={itemRef}
      className={`overlay-item ${posClass} ${sizeClass}`}
      aria-hidden="true"
    >
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
