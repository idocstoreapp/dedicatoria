import { useEffect, useRef } from 'react';
import { timeline } from '../config/timelineConfig.js';

/**
 * TimelineEngine — Motor central de sincronización
 *
 * Tipos de evento soportados:
 *   "scene"       → escena de partículas
 *   "lyric"       → texto sincronizado
 *   "overlay"     → GIF/imagen superpuesta
 *   "effect"      → flash, shake
 *   "blackout"    → fondo negro total
 *   "interaction" → pregunta, toast
 *   "beat"        → franjas de color que pulsan al BPM
 *   "superlike"   → modo arcoíris del botón de ❤️
 *   "chat"        → manejado directamente por SimulatedChat
 */
export default function TimelineEngine({
  currentTime,
  onSceneChange,
  onLyricChange,
  onOverlay,
  onEffect,
  onBlackout,
  onInteraction,
  onBeat,
  onSuperlike,
  onTour,
  onSongNotification,
  onMinigame,
}) {
  const activeSceneRef       = useRef(null);
  const activeLyricRef       = useRef(null);
  const activeOverlaysRef    = useRef(new Set());
  const firedEffectsRef      = useRef(new Set());
  const blackoutActiveRef    = useRef(false);
  const activeInteractionRef = useRef(null);
  const activeBeatRef        = useRef(null);
  const superlikeActiveRef   = useRef(false);
  const activeTourRef        = useRef(null);
  const activeSongNotifRef   = useRef(null);
  const activeMinigameRef    = useRef(null);
  const prevTimeRef          = useRef(-1);


  useEffect(() => {
    const t = currentTime;
    if (Math.abs(t - prevTimeRef.current) < 0.016) return;
    prevTimeRef.current = t;

    // ─── ESCENAS ─────────────────────────────────────────
    const sceneEvents = timeline.filter(e => e.type === 'scene');
    let currentScene = null;
    for (const ev of sceneEvents) {
      const end = ev.end ?? Infinity;
      if (t >= ev.start && t < end) { currentScene = ev.scene; break; }
    }
    if (currentScene !== activeSceneRef.current) {
      activeSceneRef.current = currentScene;
      onSceneChange?.(currentScene);
    }

    // ─── LYRICS ──────────────────────────────────────────
    const lyricEvents = timeline.filter(e => e.type === 'lyric');
    let currentLyric = null;
    for (const ev of lyricEvents) {
      const end = ev.end ?? (ev.start + 5);
      const effectiveEnd = ev.sticky ? end + (ev.stickDuration || 3) : end;
      if (t >= ev.start && t < effectiveEnd) { currentLyric = ev; break; }
    }
    if (currentLyric?.id !== activeLyricRef.current?.id) {
      activeLyricRef.current = currentLyric;
      onLyricChange?.(currentLyric);
    }

    // ─── OVERLAYS ─────────────────────────────────────────
    const overlayEvents = timeline.filter(e => e.type === 'overlay');
    const newActive = new Set();
    for (const ev of overlayEvents) {
      const end = ev.end ?? (ev.start + 5);
      if (t >= ev.start && t < end) newActive.add(ev.id);
    }
    const prev = activeOverlaysRef.current;
    const changed = newActive.size !== prev.size || [...newActive].some(id => !prev.has(id));
    if (changed) {
      activeOverlaysRef.current = newActive;
      onOverlay?.(overlayEvents.filter(ev => newActive.has(ev.id)));
    }

    // ─── BLACKOUT ─────────────────────────────────────────
    const blackoutEvents = timeline.filter(e => e.type === 'blackout');
    let isBlackout = false;
    for (const ev of blackoutEvents) {
      const end = ev.end ?? (ev.start + 3);
      if (t >= ev.start && t < end) { isBlackout = true; break; }
    }
    if (isBlackout !== blackoutActiveRef.current) {
      blackoutActiveRef.current = isBlackout;
      onBlackout?.(isBlackout);
    }

    // ─── INTERACTIONS ─────────────────────────────────────
    const interactionEvents = timeline.filter(e => e.type === 'interaction');
    let currentInteraction = null;
    for (const ev of interactionEvents) {
      const end = ev.end ?? (ev.start + (ev.duration || 8));
      if (t >= ev.start && t < end) { currentInteraction = ev; break; }
    }
    if (currentInteraction?.id !== activeInteractionRef.current?.id) {
      activeInteractionRef.current = currentInteraction;
      onInteraction?.(currentInteraction);
    }

    // ─── BEAT ZONES ───────────────────────────────────────
    const beatEvents = timeline.filter(e => e.type === 'beat');
    let currentBeat = null;
    for (const ev of beatEvents) {
      const end = ev.end ?? Infinity;
      if (t >= ev.start && t < end) { currentBeat = ev; break; }
    }
    if (currentBeat?.id !== activeBeatRef.current?.id) {
      activeBeatRef.current = currentBeat;
      onBeat?.(currentBeat);
    }

    // ─── SUPERLIKE ────────────────────────────────────────
    const superlikeEvents = timeline.filter(e => e.type === 'superlike');
    let isSuperlike = false;
    for (const ev of superlikeEvents) {
      const end = ev.end ?? (ev.start + 10);
      if (t >= ev.start && t < end) { isSuperlike = true; break; }
    }
    if (isSuperlike !== superlikeActiveRef.current) {
      superlikeActiveRef.current = isSuperlike;
      onSuperlike?.(isSuperlike);
    }

    // ─── TOUR SPOTLIGHT ───────────────────────────────────
    const tourEvents = timeline.filter(e => e.type === 'tour');
    let currentTour = null;
    for (const ev of tourEvents) {
      const end = ev.end ?? (ev.start + 4);
      if (t >= ev.start && t < end) { currentTour = ev; break; }
    }
    if (currentTour?.id !== activeTourRef.current?.id) {
      activeTourRef.current = currentTour;
      onTour?.(currentTour);
    }

    // ─── SONG NOTIFICATION ────────────────────────────────
    const songEvents = timeline.filter(e => e.type === 'song-notification');
    let currentSong = null;
    for (const ev of songEvents) {
      const end = ev.end ?? (ev.start + 5);
      if (t >= ev.start && t < end) { currentSong = ev; break; }
    }
    if (currentSong?.id !== activeSongNotifRef.current?.id) {
      activeSongNotifRef.current = currentSong;
      onSongNotification?.(currentSong);
    }

    // ─── MINIGAME ─────────────────────────────────────────
    const mgEvents = timeline.filter(e => e.type === 'minigame');
    let currentMg = null;
    for (const ev of mgEvents) {
      const end = ev.end ?? (ev.start + 200);
      if (t >= ev.start && t < end) { currentMg = ev; break; }
    }
    if (currentMg?.id !== activeMinigameRef.current?.id) {
      activeMinigameRef.current = currentMg;
      onMinigame?.(currentMg);
    }

    // ─── EFECTOS PUNTUALES ────────────────────────────────
    const effectEvents = timeline.filter(e => e.type === 'effect');
    for (const ev of effectEvents) {
      if (t >= ev.start - 0.3 && t <= ev.start + 0.3) {
        if (!firedEffectsRef.current.has(ev.id)) {
          firedEffectsRef.current.add(ev.id);
          onEffect?.(ev.effect);
          setTimeout(() => firedEffectsRef.current.delete(ev.id), 1500);
        }
      }
    }
  }, [currentTime, onSceneChange, onLyricChange, onOverlay, onEffect, onBlackout, onInteraction, onBeat, onSuperlike, onTour, onSongNotification, onMinigame]);

  return null;
}
