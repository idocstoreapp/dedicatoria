import React from 'react';

/**
 * BeatZones — Glow exterior del player (afuera del rectángulo)
 *
 * En lugar de tiras dentro del video, aplica un box-shadow
 * al contenedor del player que pulsa al ritmo del BPM.
 * Esto se ve en las barras negras alrededor del video en móvil.
 *
 * Props:
 *   beatEvent → { color, colorB, bpm, intensity } | null
 */
export default function BeatZones({ beatEvent }) {
  React.useEffect(() => {
    if (!beatEvent) {
      document.documentElement.style.removeProperty('--beat-color');
      document.documentElement.style.removeProperty('--beat-color-b');
      document.documentElement.style.removeProperty('--beat-pulse-dur');
      document.documentElement.style.removeProperty('--beat-intensity');
      document.documentElement.classList.remove('beat-active');
      return;
    }

    const bpm      = beatEvent.bpm       || 90;
    const pulseDur = `${(60 / bpm).toFixed(2)}s`;

    document.documentElement.style.setProperty('--beat-color',     beatEvent.color  || '#ff4488');
    document.documentElement.style.setProperty('--beat-color-b',   beatEvent.colorB || beatEvent.color || '#8800ff');
    document.documentElement.style.setProperty('--beat-pulse-dur', pulseDur);
    document.documentElement.style.setProperty('--beat-intensity', beatEvent.intensity || 0.5);
    document.documentElement.classList.add('beat-active');
  }, [beatEvent]);

  return null; // El efecto lo hace el CSS en .player-container.beat-active
}
