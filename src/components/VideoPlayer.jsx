import React, { useRef, useEffect, forwardRef } from 'react';
import { videoConfig } from '../config/timelineConfig.js';

/**
 * VideoPlayer — Componente de video con HTML5 API
 *
 * Props:
 *   src          → string (opcional, sobreescribe videoConfig.src)
 *   onTimeUpdate (currentTime) → callback con tiempo actual
 *   onReady      ()            → video está listo para reproducir
 *   onError      ()            → video falló (archivo no encontrado)
 */
const VideoPlayer = forwardRef(function VideoPlayer(
  { src, onTimeUpdate, onReady, onError, autoPlay, muted },
  videoRef
) {
  const rafRef = useRef(null);
  const resolvedSrc = src || videoConfig.src;

  useEffect(() => {
    const video = videoRef?.current;
    if (!video) return;

    // Forzar inicio de descarga tan pronto como se monte el elemento.
    // Especialmente útil en Safari/iOS donde preload puede ser más conservador.
    video.load();

    let lastTick = 0;
    const tick = (timestamp) => {
      // Throttle a ~20 FPS (50ms) para evitar matar el render tree de React 
      // en pantallas móviles de 60Hz o 120Hz.
      if (!lastTick || timestamp - lastTick >= 50) {
        if (video && !video.paused && !video.ended) {
          onTimeUpdate?.(video.currentTime);
        }
        lastTick = timestamp;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const handleCanPlay = () => {
      onReady?.();
      rafRef.current = requestAnimationFrame(tick);
    };

    const handlePlay = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    };

    const handlePause = () => onTimeUpdate?.(video.currentTime);

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('seeked', handlePause);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('seeked', handlePause);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onTimeUpdate, onReady]);

  return (
    <video
      ref={videoRef}
      src={resolvedSrc}
      className="bg-video"
      playsInline
      preload="auto"
      autoPlay={autoPlay}
      poster={videoConfig.poster || undefined}
      loop={videoConfig.loop}
      muted={muted ?? videoConfig.muted}
      aria-label="Video de fondo"
      onError={onError}
    />
  );
});

export default React.memo(VideoPlayer);
