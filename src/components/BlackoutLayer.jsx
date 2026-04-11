import React from 'react';

/**
 * BlackoutLayer — Capa de oscurecimiento total
 * Usa CSS transition (NO GSAP) para máxima fiabilidad.
 *
 * Z-index 35:
 *   vid (10) < scene (20) < overlay (30) < BLACKOUT (35) < lyrics (40) < UI (50)
 *   → El negro cubre video, escenas y overlays
 *   → El texto (lyrics) y los controles se ven encima del negro ✓
 */
export default function BlackoutLayer({ isActive }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        background: '#000000',
        opacity: isActive ? 1 : 0,           // React controla esto directamente
        zIndex: 35,                          // Entre overlays(30) y lyrics(40)
        pointerEvents: 'none',
        transition: 'opacity 0.5s ease',    // CSS maneja la animación
        willChange: 'opacity',
      }}
    />
  );
}
