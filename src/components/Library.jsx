import React, { useState, useEffect, useRef } from 'react';
import { library, categories } from '../config/libraryConfig.js';

/**
 * Library — Biblioteca de tracks "pensando en ti"
 *
 * Props:
 *   onSelectTrack (track) → callback al seleccionar un track
 */
export default function Library({ onSelectTrack }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredTrack, setHoveredTrack] = useState(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  // Filtrar tracks por categoría
  const filteredTracks = activeCategory === 'all'
    ? library
    : library.filter(t => t.category === activeCategory);

  // Animación de entrada
  useEffect(() => {
    if (!window.gsap) return;
    if (headerRef.current) {
      window.gsap.fromTo(headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.library-card');
      window.gsap.fromTo(cards,
        { opacity: 0, y: 40, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.4)', stagger: 0.08, delay: 0.3 }
      );
    }
  }, []);

  // Re-animar al cambiar categoría
  useEffect(() => {
    if (!window.gsap || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.library-card');
    window.gsap.fromTo(cards,
      { opacity: 0, scale: 0.92 },
      { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out', stagger: 0.05 }
    );
  }, [activeCategory]);

  return (
    <div className="library-root">

      {/* ── HEADER ────────────────────────────────────────── */}
      <div ref={headerRef} className="library-header">
        <div className="library-header-icon">🎵</div>
        <h1 className="library-title">Pensando en ti</h1>
        <p className="library-subtitle">Una colección de todo lo que siento</p>
      </div>

      {/* ── FILTROS DE CATEGORÍA ──────────────────────────── */}
      <div className="library-categories">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`lib-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
            id={`cat-btn-${cat.id}`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* ── GRID DE TRACKS ───────────────────────────────── */}
      <div ref={gridRef} className="library-grid">
        {filteredTracks.map(track => (
          <TrackCard
            key={track.id}
            track={track}
            isHovered={hoveredTrack === track.id}
            onHover={setHoveredTrack}
            onSelect={onSelectTrack}
          />
        ))}
      </div>

      {/* Footer */}
      <p className="library-footer">
        ♥ Hecho con todo lo que tengo
      </p>
    </div>
  );
}

// ─── TRACK CARD ─────────────────────────────────────────────

function TrackCard({ track, isHovered, onHover, onSelect }) {
  const cardRef = useRef(null);

  const handleClick = () => {
    if (window.gsap && cardRef.current) {
      window.gsap.timeline({ onComplete: () => onSelect?.(track) })
        .to(cardRef.current, { scale: 0.95, duration: 0.1 })
        .to(cardRef.current, { scale: 1.05, opacity: 0, duration: 0.3, ease: 'power2.in' });
    } else {
      onSelect?.(track);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`library-card ${track.isBonusTrack ? 'library-card--bonus' : ''}`}
      style={{
        '--card-color': track.color,
        '--card-gradient': track.gradient,
        background: track.gradient,
      }}
      onClick={handleClick}
      onMouseEnter={() => onHover(track.id)}
      onMouseLeave={() => onHover(null)}
      role="button"
      aria-label={`Reproducir: ${track.title}`}
      id={`track-card-${track.id}`}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
    >
      {/* Emoji grande */}
      <div className="card-emoji">{track.emoji}</div>

      {/* Info */}
      <div className="card-info">
        <h3 className="card-title">{track.title}</h3>
        <p className="card-subtitle">{track.subtitle}</p>
      </div>

      {/* Badge especial para bonus */}
      {track.isBonusTrack && (
        <div className="card-bonus-badge">BONUS</div>
      )}

      {/* Flecha jugar */}
      <div className="card-play-arrow" aria-hidden="true">▶</div>

      {/* Glow de color en hover */}
      <div className="card-glow" aria-hidden="true" />
    </div>
  );
}
