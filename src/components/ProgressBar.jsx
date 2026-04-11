import React, { useEffect, useRef } from 'react';

/**
 * ProgressBar — Barra de progreso del video
 *
 * Props:
 *   currentTime → número (segundos)
 *   duration    → número (segundos totales)
 *   onSeek      (time) → callback al hacer clic para seek
 */
export default function ProgressBar({ currentTime, duration, onSeek }) {
  const trackRef = useRef(null);

  const percent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleClick = (e) => {
    if (!trackRef.current || !duration) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const time = ratio * duration;
    onSeek?.(Math.max(0, Math.min(duration, time)));
  };

  return (
    <div className="progress-bar-container">
      <div
        ref={trackRef}
        className="progress-track"
        onClick={handleClick}
        role="slider"
        aria-label="Progreso del video"
        aria-valuenow={Math.round(currentTime)}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration || 0)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (!duration) return;
          if (e.key === 'ArrowRight') onSeek?.(Math.min(duration, currentTime + 5));
          if (e.key === 'ArrowLeft') onSeek?.(Math.max(0, currentTime - 5));
        }}
      >
        <div
          className="progress-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="time-display">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
