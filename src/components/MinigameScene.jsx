import React, { useEffect, useRef } from 'react';

/**
 * MinigameScene — Transición de ambiente para el minijuego del chat
 * 
 * Cuando empieza el minijuego:
 * - Oscurece el fondo con un overlay con gradiente
 * - Partículas especiales (estrellas doradas) caen desde arriba
 * - El chat brilla con un efecto sutil
 * - Texto de "🎮 Minijuego" aparece con animación
 */
const MinigameScene = ({ isActive }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let running = true;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    // Crear partículas doradas
    particlesRef.current = Array.from({ length: 30 }, (_, i) => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight - canvas.offsetHeight,
      size: 2 + Math.random() * 4,
      speedY: 0.5 + Math.random() * 1.5,
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: 0.3 + Math.random() * 0.7,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.05,
      delay: Math.random() * 2,
    }));

    const drawStar = (ctx, cx, cy, size, rotation) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const x = Math.cos(angle) * size;
        const y = Math.sin(angle) * size;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const animate = (time) => {
      if (!running) return;
      
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      ctx.clearRect(0, 0, w, h);

      // Dibujar partículas doradas
      const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.6);
      gradient.addColorStop(0, 'rgba(255, 200, 50, 0.05)');
      gradient.addColorStop(1, 'rgba(255, 68, 136, 0.03)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      particlesRef.current.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        if (p.y > h + 20) {
          p.y = -20;
          p.x = Math.random() * w;
        }

        ctx.save();
        ctx.globalAlpha = p.opacity * 0.8;
        ctx.fillStyle = '#ffd700';
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 8;
        drawStar(ctx, p.x, p.y, p.size, p.rotation);
        ctx.restore();
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      running = false;
      window.removeEventListener('resize', resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="minigame-scene-canvas"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 25,
        }}
      />
      <div className="minigame-scene-overlay">
        <div className="minigame-badge">
          <span className="minigame-badge-text">💬 Elige 3 preguntas</span>
        </div>
      </div>
    </>
  );
}

export default React.memo(MinigameScene);
