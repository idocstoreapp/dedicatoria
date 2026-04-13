import React, { useState, useCallback } from 'react';

/**
 * LikeButton — Botón de corazón estilo Instagram Live
 *
 * Props:
 *   onLike(count)  → callback con total acumulado
 *   isSuperlike    → boolean — modo arcoíris premium ✨
 */

// Paleta normal: rosado-blanco suave
const NORMAL_COLORS   = ['#ffe8ef', '#ffd0de', '#fff0f4', '#ffc8d8', '#ffe4ec'];
// Paleta superlike: arcoíris vibrante
const RAINBOW_COLORS  = ['#ff4488', '#ff8800', '#ffdd00', '#44ff88', '#00aaff', '#8800ff', '#ff44cc'];

export default function LikeButton({ onLike, isSuperlike = false }) {
  const [count,  setCount]  = useState(0);
  const [hearts, setHearts] = useState([]);

  const handleClick = useCallback(() => {
    const newCount = count + 1;
    setCount(newCount);
    onLike?.(newCount);

    const palette  = isSuperlike ? RAINBOW_COLORS : NORMAL_COLORS;
    const quantity = isSuperlike ? 10 : 5;

    const newHearts = Array.from({ length: quantity }, (_, i) => ({
      id: Date.now() + i,
      x: 20 + Math.random() * 60 - 30,
      size: isSuperlike ? (18 + Math.random() * 16) : (12 + Math.random() * 14),
      duration: (isSuperlike ? 2.2 : 1.6) + Math.random() * 1.2,
      delay: i * (isSuperlike ? 0.05 : 0.08),
      color: palette[i % palette.length],
      rainbow: isSuperlike,
    }));

    setHearts(prev => [...prev, ...newHearts]);

    setTimeout(() => {
      setHearts(prev => prev.filter(h => !newHearts.find(n => n.id === h.id)));
    }, 3500);
  }, [count, onLike, isSuperlike]);

  return (
    <div className={`like-btn-wrapper ${isSuperlike ? 'like-btn-wrapper--super' : ''}`}>

      {/* Corazones flotantes */}
      {hearts.map(h => <FloatingHeart key={h.id} heart={h} />)}

      {/* Botón principal */}
      <button
        className={`like-btn ${isSuperlike ? 'like-btn--super' : ''}`}
        onClick={handleClick}
        id="like-btn"
        aria-label={`Me gusta (${count})`}
        title={count > 0 ? `${count} likes ❤️` : 'Dale like'}
      >
        <span className="like-heart" aria-hidden="true">
          {isSuperlike ? '💖' : '❤️'}
        </span>
        {count > 0 && (
          <span className="like-count">{count}</span>
        )}
      </button>

      {/* ── SPOTLIGHT ARTIFICIAL ── */}
      {isSuperlike && (
        <div className="superlike-spotlight">
          <div className="superlike-circle" />
          <div className="superlike-circle superlike-circle--2" />
          <div className="superlike-circle superlike-circle--3" />
        </div>
      )}

      {/* ── ALERTA GLOBAL EPIC MOMENT ── */}
      {isSuperlike && (
        <div className="superlike-epic-alert">
          <div className="superlike-epic-text">MOMENTO EPICO<br/>SUPERLIKEEE</div>
        </div>
      )}
    </div>
  );
}

// ── Corazón flotante individual ──────────────────────────────
function FloatingHeart({ heart }) {
  return (
    <div
      className={`floating-heart ${heart.rainbow ? 'floating-heart--rainbow' : ''}`}
      aria-hidden="true"
      style={{
        fontSize       : `${heart.size}px`,
        left           : `${heart.x}%`,
        animationDuration : `${heart.duration}s`,
        animationDelay    : `${heart.delay}s`,
        color             : heart.color,
      }}
    >
      {heart.rainbow ? '💖' : '❤️'}
    </div>
  );
}
