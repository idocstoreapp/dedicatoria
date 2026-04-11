import React, { useState, useEffect, useRef } from 'react';
import { bonusConfig } from '../config/timelineConfig.js';

/**
 * BonusTrack — Experiencia especial al terminar el video principal
 *
 * Flujo:
 * 1. Fade in pantalla negra con texto tipo máquina de escribir
 * 2. Aparece "Solo Bad Bunny puede decirlo 🐰"
 * 3. Botón CTA para iniciar el bonus video
 * 4. Al terminar el bonus → callback onFinished()
 *
 * Props:
 *   onFinished → callback cuando termina el bonus (va a la biblioteca)
 */
export default function BonusTrack({ onFinished }) {
  const [phase, setPhase] = useState('typewrite'); // typewrite | cta | video | done
  const [typedText, setTypedText] = useState('');
  const [showLine2, setShowLine2] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const bonusVideoRef = useRef(null);
  const containerRef = useRef(null);

  const { teaser, video } = bonusConfig;
  const fullText = teaser.line1;

  // ─── EFECTO MÁQUINA DE ESCRIBIR ───────────────────────────
  useEffect(() => {
    if (phase !== 'typewrite') return;

    // Fade in del contenedor
    if (containerRef.current && window.gsap) {
      window.gsap.fromTo(containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power2.out' }
      );
    }

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedText(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(interval);
        // Mostrar línea 2 después de una pausa
        setTimeout(() => setShowLine2(true), 800);
        // Mostrar CTA después de delay configurado
        setTimeout(() => setShowCTA(true), teaser.delayBeforeCTA);
      }
    }, 55); // velocidad de la máquina de escribir (ms por caracter)

    return () => clearInterval(interval);
  }, [phase]);

  // ─── INICIAR BONUS VIDEO ──────────────────────────────────
  const handleStartBonus = () => {
    // Fade out del teaser, luego cambiar fase
    if (containerRef.current && window.gsap) {
      window.gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => setPhase('video'),
      });
    } else {
      setPhase('video');
    }
  };

  // Reproducir video cuando la fase cambia a 'video' (ref ya montada)
  useEffect(() => {
    if (phase !== 'video') return;
    const video = bonusVideoRef.current;
    if (!video) return;
    // Pequeño delay para asegurar que el DOM esté listo
    const timeout = setTimeout(() => {
      video.play().catch(() => {
        // Si falla (ej: no hay archivo), ir a la biblioteca
        handleBonusEnded();
      });
    }, 100);
    return () => clearTimeout(timeout);
  }, [phase]);

  // ─── TERMINAR BONUS VIDEO ─────────────────────────────────
  const handleBonusEnded = () => {
    setPhase('done');
    onFinished?.();
  };

  return (
    <div className="bonus-track-root">

      {/* ── PANTALLA TEASER ────────────────────────────────── */}
      {(phase === 'typewrite' || phase === 'cta') && (
        <div ref={containerRef} className="bonus-teaser">

          {/* Fondo con neblina morada */}
          <div className="bonus-bg" aria-hidden="true" />

          {/* Conejo / logo Bad Bunny */}
          <div className="bonus-rabbit">
            <span role="img" aria-label="Bad Bunny">🐰</span>
          </div>

          {/* Texto máquina de escribir */}
          <p className="bonus-line1">
            {typedText}
            <span className="typewriter-cursor">|</span>
          </p>

          {/* Línea 2 */}
          {showLine2 && (
            <p className="bonus-line2">
              {teaser.line2}
            </p>
          )}

          {/* CTA botón */}
          {showCTA && (
            <button
              className="bonus-cta-btn"
              onClick={handleStartBonus}
              id="bonus-cta-btn"
            >
              {teaser.ctaText}
            </button>
          )}
        </div>
      )}

      {/* ── BONUS VIDEO ────────────────────────────────────── */}
      {phase === 'video' && (
        <div className="bonus-video-wrapper">
          {/* Info del track encima del video */}
          <div className="bonus-track-info">
            <span className="bonus-track-emoji">🐰</span>
            <div>
              <p className="bonus-track-title">{video.title}</p>
              <p className="bonus-track-artist">{video.artist}</p>
            </div>
          </div>

          <video
            ref={bonusVideoRef}
            className="bonus-video"
            src={video.src}
            playsInline
            onEnded={handleBonusEnded}
            onError={handleBonusEnded} // Si no hay video, pasa igual
            style={{ background: video.coverColor }}
          />

          {/* Mini botón skip */}
          <button
            className="bonus-skip-btn"
            onClick={handleBonusEnded}
            id="bonus-skip-btn"
          >
            Ir a la biblioteca →
          </button>
        </div>
      )}
    </div>
  );
}
