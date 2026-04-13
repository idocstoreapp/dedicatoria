import React, { useEffect, useRef } from 'react';

/**
 * TourBackground — Fondo animado con gradientes y partículas durante el tour
 *
 * Muestra:
 * - Gradientes vibrantes que cambian suavemente
 * - Estrellas/brillos flotantes
 * - Arcoíris sutiles
 */
export default function TourBackground({ isActive, progress }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let frame = 0;
    let running = true;

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Crear partículas (reducidas para mejor rendimiento)
    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      size: Math.random() * 3 + 1.5,
      speedY: -(Math.random() * 1.5 + 0.8),
      speedX: (Math.random() - 0.5) * 0.6,
      color: `hsl(${Math.random() * 360}, 70%, 70%)`,
      opacity: 1,
      life: 0,
      maxLife: Math.random() * 80 + 80,
    });

    const animate = () => {
      if (!running || !ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Gradiente de fondo animado (opacidad muy baja para no tapar el video)
      const gradient = ctx.createLinearGradient(
        0, 0,
        canvas.width, canvas.height
      );
      const hue1 = (frame * 0.3) % 360;
      const hue2 = (hue1 + 120) % 360;
      const hue3 = (hue1 + 240) % 360;

      gradient.addColorStop(0, `hsla(${hue1}, 70%, 50%, 0.02)`);
      gradient.addColorStop(0.5, `hsla(${hue2}, 70%, 50%, 0.02)`);
      gradient.addColorStop(1, `hsla(${hue3}, 70%, 50%, 0.02)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Agregar nuevas partículas (máximo 30 para rendimiento)
      if (frame % 4 === 0 && particles.length < 30) {
        particles.push(createParticle());
      }

      // Actualizar y dibujar partículas
      particles = particles.filter(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.life++;
        p.opacity = 1 - (p.life / p.maxLife);

        if (p.opacity <= 0 || p.y < -10) return false;

        // Dibujar partícula (brillo simple)
        ctx.save();
        ctx.globalAlpha = p.opacity * 0.7;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return true;
      });

      frame++;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      running = false;
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      // Limpiar canvas
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="tour-background-canvas"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    />
  );
}
