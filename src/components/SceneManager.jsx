import React, { useEffect, useRef, useMemo } from 'react';
import { scenes as scenesConfig } from '../config/scenesConfig.js';

/**
 * SceneManager — Gestiona y renderiza escenas visuales
 *
 * Props:
 *   activeScene → string, id de la escena activa
 *   hasVideo    → boolean, si hay video real (omite el fondo sólido para no tapar el video)
 */
export default function SceneManager({ activeScene, hasVideo = false }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);
  const currentSceneRef = useRef(null);

  const sceneData = useMemo(() => {
    return activeScene ? (scenesConfig[activeScene] || null) : null;
  }, [activeScene]);

  // Inicializar / cambiar escena
  useEffect(() => {
    if (!sceneData) return;
    if (currentSceneRef.current === activeScene) return;
    currentSceneRef.current = activeScene;

    // Cancelar animación previa
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { particles } = sceneData;

    // Crear partículas
    particlesRef.current = [];
    if (particles?.enabled) {
      for (let i = 0; i < particles.count; i++) {
        particlesRef.current.push(createParticle(particles, canvas.width, canvas.height, i));
      }
    }

    // Iniciar loop de animación
    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.map(p =>
        updateAndDrawParticle(ctx, p, particles, canvas.width, canvas.height, activeScene)
      );

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [activeScene, sceneData]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    if (canvas.parentElement) observer.observe(canvas.parentElement);
    return () => observer.disconnect();
  }, []);

  if (!sceneData) return null;

  // Cuando hay video: fondo transparente, solo partículas
  // Cuando no hay video (demo): fondo sólido de la escena
  const bgStyle = hasVideo
    ? { background: sceneData.overlay || 'rgba(0,0,0,0.15)' }  // oscurecer levemente el video
    : { background: sceneData.background };                      // fondo sólido (modo demo)

  return (
    <div className="scene-wrapper" style={bgStyle}>
      <canvas
        ref={canvasRef}
        className="particles-canvas"
        aria-hidden="true"
      />
    </div>
  );
}

// ─── HELPERS DE PARTÍCULAS ────────────────────────────────────

function createParticle(config, w, h, index) {
  const color = config.colors[index % config.colors.length];
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    size: config.size.min + Math.random() * (config.size.max - config.size.min),
    color,
    speed: config.speed * (0.5 + Math.random()),
    opacity: 0.3 + Math.random() * 0.7,
    angle: Math.random() * Math.PI * 2,
    drift: (Math.random() - 0.5) * 0.5,
    twinkleSpeed: 0.01 + Math.random() * 0.03,
    twinklePhase: Math.random() * Math.PI * 2,
    // Para líneas neon
    length: 15 + Math.random() * 40,
  };
}

function updateAndDrawParticle(ctx, p, config, w, h, sceneId) {
  p = { ...p };
  p.twinklePhase += p.twinkleSpeed;
  const twinkle = Math.sin(p.twinklePhase) * 0.5 + 0.5;

  ctx.save();
  ctx.globalAlpha = p.opacity * twinkle;

  switch (config.type) {
    case 'star': {
      // Estrellas parpadeantes
      p.y -= p.speed * 0.2;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      // Reset si sale
      if (p.y < -10) {
        p.y = h + 10;
        p.x = Math.random() * w;
      }
      break;
    }

    case 'heart': {
      // Corazones flotando hacia arriba
      p.y -= p.speed;
      p.x += Math.sin(p.angle) * p.drift;
      p.angle += 0.02;

      ctx.fillStyle = p.color;
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('♥', p.x, p.y);

      if (p.y < -p.size) {
        p.y = h + p.size;
        p.x = Math.random() * w;
        p.opacity = 0.3 + Math.random() * 0.7;
      }
      break;
    }

    case 'line': {
      // Gotas de neón cayendo
      p.y += p.speed;
      const gradient = ctx.createLinearGradient(p.x, p.y - p.length, p.x, p.y);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(1, p.color);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = p.size * 0.5;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.length);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();

      if (p.y > h + p.length) {
        p.y = -p.length;
        p.x = Math.random() * w;
      }
      break;
    }

    case 'circle': {
      p.y -= p.speed * 0.4;
      p.x += Math.sin(p.angle) * 0.5;
      p.angle += 0.02;

      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();

      if (p.y < -p.size) {
        p.y = h + p.size;
        p.x = Math.random() * w;
      }
      break;
    }
  }

  ctx.restore();
  return p;
}
