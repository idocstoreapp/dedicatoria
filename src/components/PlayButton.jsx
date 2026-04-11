import React, { useRef, useEffect } from 'react';

/**
 * PlayButton
 *
 * hasStarted=false → Overlay "Toca para comenzar" (sin intro)
 * hasStarted=true  → Solo mini botón flotante, siempre visible
 */
export default function PlayButton({ isPlaying, hasStarted = false, onClick }) {
  const overlayRef = useRef(null);
  const miniBtnRef = useRef(null);

  // Fade in del overlay (solo si no pasó por la intro)
  useEffect(() => {
    if (hasStarted || !overlayRef.current || !window.gsap) return;
    window.gsap.fromTo(overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.2 }
    );
  }, [hasStarted]);

  const handleClick = (e) => {
    e.stopPropagation();
    onClick?.();
  };

  return (
    <>
      {/* Overlay "toca para comenzar" — solo si NO vino de la intro */}
      {!hasStarted && (
        <div
          ref={overlayRef}
          className="play-initial-overlay"
          style={{ display: isPlaying ? 'none' : 'flex', opacity: 0 }}
          onClick={handleClick}
          role="button"
          aria-label="Reproducir"
        >
          <div className="play-initial-inner">
            <div className="play-initial-btn" id="main-play-btn">
              <div className="play-icon" aria-hidden="true" />
            </div>
            <p className="play-initial-label">Toca para comenzar</p>
          </div>
        </div>
      )}

      {/* Mini botón flotante — izquierda inferior, siempre visible tras iniciar */}
      {hasStarted && (
        <button
          ref={miniBtnRef}
          className="mini-pause-btn"
          id="mini-pause-btn"
          onClick={handleClick}
          aria-label={isPlaying ? 'Pausar' : 'Reanudar'}
        >
          {isPlaying ? (
            <div className="mini-pause-icon" aria-hidden="true">
              <span /><span />
            </div>
          ) : (
            <div className="mini-play-icon" aria-hidden="true" />
          )}
        </button>
      )}
    </>
  );
}
