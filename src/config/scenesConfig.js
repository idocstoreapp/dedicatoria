/**
 * ============================================================
 *  SCENES CONFIG — Define escenas reutilizables
 * ============================================================
 *
 * Cada escena tiene:
 *   id         → Identificador único (debe coincidir con timeline)
 *   label      → Nombre legible
 *   component  → Nombre del componente de escena a renderizar
 *   colors     → Paleta de colores de la escena
 *   particles  → Configuración de partículas flotantes
 */

export const scenes = {
  "starfield": {
    id: "starfield",
    label: "Campo de Estrellas",
    background: "radial-gradient(ellipse at bottom, #0d1b2a 0%, #000000 100%)",
    overlay: "rgba(0, 0, 0, 0.3)",
    particles: {
      enabled: true,
      count: 80,
      type: "star",       // "star" | "heart" | "circle" | "sparkle"
      colors: ["#ffffff", "#ffffcc", "#aaddff"],
      speed: 0.3,
      size: { min: 1, max: 3 },
    },
    glow: {
      color: "#4488ff",
      intensity: "medium",
    },
  },

  "hearts-background": {
    id: "hearts-background",
    label: "Lluvia de Corazones",
    background: "linear-gradient(135deg, #1a0010 0%, #3d0025 50%, #1a0010 100%)",
    overlay: "rgba(0, 0, 0, 0.25)",
    particles: {
      enabled: true,
      count: 30,
      type: "heart",
      colors: ["#e1ffcdff", "#01dc72ff", "#1b6b33ff", "#ffaadd"],
      speed: 0.8,
      size: { min: 12, max: 28 },
    },
    glow: {
      color: "#ff4488",
      intensity: "high",
    },
  },

  "neon-rain": {
    id: "neon-rain",
    label: "Lluvia Neón",
    background: "linear-gradient(180deg, #000510 0%, #001020 100%)",
    overlay: "rgba(0, 0, 0, 0.4)",
    particles: {
      enabled: true,
      count: 50,
      type: "line",       // Líneas verticales estilo matrix
      colors: ["#00ffcc", "#00ddff", "#8800ff", "#ff00cc"],
      speed: 2.5,
      size: { min: 2, max: 4 },
    },
    glow: {
      color: "#00ffcc",
      intensity: "high",
    },
  },

  "minimal-blur": {
    id: "minimal-blur",
    label: "Minimalista",
    background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
    overlay: "rgba(0, 0, 0, 0.5)",
    particles: {
      enabled: false,
      count: 0,
    },
    glow: {
      color: "#ffffff",
      intensity: "low",
    },
  },
};
