import React, { useRef, useState, useCallback, useEffect } from 'react';
import VideoPlayer from './VideoPlayer.jsx';
import PlayButton from './PlayButton.jsx';
import TimelineEngine from './TimelineEngine.jsx';
import SceneManager from './SceneManager.jsx';
import LyricDisplay from './LyricDisplay.jsx';
import OverlayEffects from './OverlayEffects.jsx';
import ProgressBar from './ProgressBar.jsx';
import DebugPanel from './DebugPanel.jsx';
import BlackoutLayer from './BlackoutLayer.jsx';
import BonusTrack from './BonusTrack.jsx';
import Library from './Library.jsx';
import IntroScreen from './IntroScreen.jsx';
import LikeButton from './LikeButton.jsx';
import InteractionOverlay from './InteractionOverlay.jsx';
import MessageForm from './MessageForm.jsx';
import BeatZones from './BeatZones.jsx';
import SimulatedChat from './SimulatedChat.jsx';
import TourSpotlight from './TourSpotlight.jsx';
import SongNotification from './SongNotification.jsx';
import ChatMiniGame from './ChatMiniGame.jsx';
import {
  projectConfig,
  videoConfig,
  bonusConfig,
  interactionConfig,
  chatConfig,
  timeline,
} from '../config/timelineConfig.js';

export default function App() {
  // ─── NAVEGACIÓN ─────────────────────────────────────────
  const [view,          setView]          = useState('intro');
  const [selectedTrack, setSelectedTrack] = useState(null);

  // ─── REFS ────────────────────────────────────────────────
  const videoRef     = useRef(null);
  const containerRef = useRef(null);
  const introPreviewSeekedRef = useRef(false);

  // ─── ESTADO REPRODUCTOR ──────────────────────────────────
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration,    setDuration]    = useState(0);
  const [videoReady,  setVideoReady]  = useState(false);
  const [videoError,  setVideoError]  = useState(false);
  const [hasStarted,  setHasStarted]  = useState(false);

  // ─── VIDEO SRC ───────────────────────────────────────────
  const currentVideoSrc = view === 'track' && selectedTrack
    ? selectedTrack.src
    : videoConfig.src;

  // ─── ESTADO TIMELINE ─────────────────────────────────────
  const [activeScene,       setActiveScene]       = useState(null);
  const [activeLyric,       setActiveLyric]       = useState(null);
  const [activeOverlays,    setActiveOverlays]    = useState([]);
  const [activeEffect,      setActiveEffect]      = useState(null);
  const [isBlackout,        setIsBlackout]        = useState(false);
  const [activeInteraction, setActiveInteraction] = useState(null);
  const [activeBeat,        setActiveBeat]        = useState(null);
  const [isSuperlike,         setIsSuperlike]         = useState(false);
  const [activeTour,          setActiveTour]          = useState(null);
  const [activeSongNotif,     setActiveSongNotif]     = useState(null);
  const [activeMiniGame,      setActiveMiniGame]      = useState(null);

  // ─── LIKES ───────────────────────────────────────────────
  const [likeCount, setLikeCount] = useState(0);

  // ─── MESSAGE FORM ─────────────────────────────────────────
  const [showMessageForm, setShowMessageForm] = useState(false);

  // ─── Chat events + injected messages from minigame ───────
  const [injectedMessages, setInjectedMessages] = useState([]);
  const currentTimeRef = useRef(0);
  useEffect(() => { currentTimeRef.current = currentTime; }, [currentTime]);

  // Los mensajes inyectados del minijuego usan el currentTime real del video
  const chatEvents = [
    ...timeline.filter(e => e.type === 'chat'),
    ...injectedMessages,
  ];

  // ─── DETECTAR FIN DEL VIDEO ──────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleEnded = () => {
      setIsPlaying(false);
      if (bonusConfig.enabled && view === 'player') {
        setTimeout(() => setView('bonus'), 800);
      } else if (view === 'track' || view === 'player') {
        if (interactionConfig?.showMessageFormOnEnd) {
          setTimeout(() => setShowMessageForm(true), 1200);
        }
      }
    };
    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [view]);

  // ─── CALLBACKS VIDEO ─────────────────────────────────────
  const handleVideoReady = useCallback(() => {
    setVideoReady(true);
    if (videoRef.current) setDuration(videoRef.current.duration || 0);
  }, []);

  const handleTimeUpdate = useCallback((t) => setCurrentTime(t), []);

  const handlePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(console.error);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleSeek = useCallback((time) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    setCurrentTime(time);
  }, []);

  const handleSceneChange   = useCallback(s => setActiveScene(s), []);
  const handleLyricChange   = useCallback(l => setActiveLyric(l), []);
  const handleOverlay       = useCallback(o => setActiveOverlays(o), []);
  const handleBlackout      = useCallback(b => setIsBlackout(b), []);
  const handleInteraction   = useCallback(i => setActiveInteraction(i), []);
  const handleBeat          = useCallback(b => setActiveBeat(b), []);
  const handleSuperlike     = useCallback(s => setIsSuperlike(s), []);
  const handleTour          = useCallback(t => setActiveTour(t), []);
  const handleSongNotif     = useCallback(n => setActiveSongNotif(n), []);
  const handleMinigame      = useCallback(m => setActiveMiniGame(m), []);
  const handleEffect        = useCallback((effect) => {
    setActiveEffect(effect);
    setTimeout(() => setActiveEffect(null), 1000);
  }, []);

  // Minigame → inyecta mensajes en el chat usando el tiempo real del video
  const handleMinigameMessage = useCallback((msg) => {
    setInjectedMessages(prev => {
      const withTime = { ...msg, type: 'chat', start: currentTimeRef.current - 0.15, _injected: true };
      return [...prev, withTime];
    });
  }, []);

  // ─── LIKES ───────────────────────────────────────────────
  const handleLike = useCallback((count) => setLikeCount(count), []);


  // ─── INTRO → PLAYER ──────────────────────────────────────
  // El video ya fue precargado en el fondo durante la intro.
  // Solo debemos llamar play() — el video ya está en el DOM.
  const handleIntroStart = useCallback(() => {
    setHasStarted(true);
    setView('player');
  }, []);

  const handleInitialGesture = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // Al salir de la intro reiniciamos el video principal desde el segundo 0
    // y forzamos un intento robusto de reproducción para evitar bloqueos.
    video.currentTime = 0;

    const playWithFallback = async () => {
      try {
        video.muted = false;
        await video.play();
        setIsPlaying(true);
      } catch {
        try {
          video.muted = true;
          await video.play();
          video.muted = false;
          setIsPlaying(true);
        } catch (err) {
          console.error(err);
        }
      }
    };

    playWithFallback();
  }, []);

  // Durante la intro, usar el fondo desde el minuto 1 (si el video lo permite).
  useEffect(() => {
    if (view !== 'intro') {
      introPreviewSeekedRef.current = false;
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    const previewStart = Number(videoConfig.introPreviewStart ?? 0);
    if (!(previewStart > 0)) return;
    const seekIntroPreview = () => {
      if (introPreviewSeekedRef.current) return;
      if (!Number.isFinite(video.duration) || video.duration <= previewStart) return;
      try {
        video.currentTime = previewStart;
        introPreviewSeekedRef.current = true;
      } catch (err) {
        console.warn('No se pudo mover el preview de intro:', err);
      }
    };

    if (video.readyState >= 1) seekIntroPreview();
    video.addEventListener('loadedmetadata', seekIntroPreview);
    return () => video.removeEventListener('loadedmetadata', seekIntroPreview);
  }, [view, currentVideoSrc]);

  // ─── BONUS → BIBLIOTECA ──────────────────────────────────
  const handleBonusFinished = useCallback(() => setView('library'), []);

  // ─── TRACK DE BIBLIOTECA ─────────────────────────────────
  const handleSelectTrack = useCallback((track) => {
    setSelectedTrack(track);
    setView('track');
    setCurrentTime(0);
    setIsPlaying(false);
    setVideoReady(false);
    setActiveScene(null);
    setActiveLyric(null);
    setActiveOverlays([]);
    setLikeCount(0);
  }, []);

  const handleBackToLibrary = useCallback(() => {
    const video = videoRef.current;
    if (video) { video.pause(); video.currentTime = 0; }
    setView('library');
    setSelectedTrack(null);
    setShowMessageForm(false);
  }, []);

  // ─── LIBRARY VIEW ────────────────────────────────────────
  if (view === 'library') {
    return (
      <div className="app-root">
        <div ref={containerRef} className="player-container" style={{ overflowY: 'auto' }}>
          <Library onSelectTrack={handleSelectTrack} />
        </div>
      </div>
    );
  }

  // ─── BONUS VIEW ──────────────────────────────────────────
  if (view === 'bonus') {
    return (
      <div className="app-root">
        <div ref={containerRef} className="player-container">
          <BonusTrack onFinished={handleBonusFinished} />
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════
  //  APP VIEW ROUTING
  // ══════════════════════════════════════════════════════════
  return (
    <div className="app-root">
      <div ref={containerRef} className="player-container" id="player-container">

        {/* ── CAPA 0: BEAT ZONES (FUERA del video) ───── */}
        <BeatZones beatEvent={activeBeat} />

        {/* ── CAPA 1: VIDEO ────────────────────────────── */}
        <div className={`layer-video ${view === 'intro' && !hasStarted ? 'layer-video--preload' : ''}`}>
          <VideoPlayer
            ref={videoRef}
            src={currentVideoSrc}
            autoPlay={view === 'intro'}
            muted={view === 'intro' || videoConfig.muted}
            onTimeUpdate={handleTimeUpdate}
            onReady={handleVideoReady}
            onError={() => setVideoError(true)}
          />
        </div>

        {/* ── CAPA INTRO (SOBRE EL VIDEO DIRECTAMENTE) ───── */}
        {view === 'intro' && (
          <IntroScreen onStart={handleIntroStart} onInitialGesture={handleInitialGesture} />
        )}

        {/* ── CAPA 2: ESCENAS ──────────────────────────── */}
        <div className="layer-scene">
          <SceneManager
            activeScene={videoError ? (activeScene || 'starfield') : activeScene}
            hasVideo={!videoError}
          />
        </div>

        {/* ── CAPA 2b: BLACKOUT ────────────────────────── */}
        <BlackoutLayer isActive={isBlackout} />

        {/* ── CAPA 3: OVERLAYS ─────────────────────────── */}
        <div className="layer-overlay">
          <OverlayEffects
            overlays={activeOverlays}
            activeEffect={activeEffect}
            onEffectDone={() => setActiveEffect(null)}
            containerRef={containerRef}
          />
        </div>

        {/* ── CAPA 4: LETRAS ───────────────────────────── */}
        <div className="layer-lyrics">
          <LyricDisplay lyric={activeLyric} />
        </div>

        {/* ── CAPA 4b: INTERACCIONES ───────────────────── */}
        <div className="layer-interactions">
          <InteractionOverlay
            interaction={activeInteraction}
            onAnswer={(answer, interaction) => {
              console.log('Respuesta:', answer, interaction.id);
            }}
          />
        </div>

        {/* ── CAPA 5: CHAT SIMULADO ─────────────────────── */}
        <SimulatedChat
          chatEvents={chatEvents}
          currentTime={currentTime}
          senderConfig={chatConfig?.sender}
          recipientConfig={chatConfig?.recipient}
          visible={hasStarted}
          activeMiniGame={activeMiniGame}
          onMinigameMessage={handleMinigameMessage}
        />

        {/* ── CAPA 6: UI ───────────────────────────────── */}
        <div className="layer-ui">
          {!videoError && view !== 'intro' && (
            <PlayButton
              isPlaying={isPlaying}
              hasStarted={hasStarted}
              onClick={handlePlayPause}
            />
          )}

          {videoReady && !videoError && (
            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
            />
          )}

          {/* Like button */}
          {isPlaying && (
            <LikeButton
              onLike={handleLike}
              isSuperlike={isSuperlike}
            />
          )}

          {/* Botón volver a biblioteca */}
          {view === 'track' && (
            <button
              className="back-to-library-btn"
              onClick={handleBackToLibrary}
              id="back-lib-btn"
            >
              ← Biblioteca
            </button>
          )}

          {/* Resumen de likes al pausar */}
          {!isPlaying && likeCount > 0 && currentTime > 5 && (
            <div className="like-summary">
              ❤️ Le diste <strong>{likeCount}</strong> likes a esta canción. ¡A mí también me gusta!
            </div>
          )}
        </div>

        {/* ── NOTIFICACIÓN DE CANCIÓN ─────────────────────── */}
        <SongNotification notification={activeSongNotif} />

        {/* Sin video */}
        {videoError && (
          <div className="no-video-msg">
            <div style={{ fontSize: 48 }}>🎬</div>
            <p>Coloca tu video en <code>public/video.mp4</code></p>
          </div>
        )}

        {/* ── TOUR SPOTLIGHT ───────────────────────────── */}
        <TourSpotlight tourEvent={activeTour} containerRef={containerRef} />

        {/* ── MOTOR TIMELINE ───────────────────────────── */}
        <TimelineEngine
          currentTime={currentTime}
          onSceneChange={handleSceneChange}
          onLyricChange={handleLyricChange}
          onOverlay={handleOverlay}
          onEffect={handleEffect}
          onBlackout={handleBlackout}
          onInteraction={handleInteraction}
          onBeat={handleBeat}
          onSuperlike={handleSuperlike}
          onTour={handleTour}
          onSongNotification={handleSongNotif}
          onMinigame={handleMinigame}
        />

        {/* ── DEBUG ────────────────────────────────────── */}
        {projectConfig.debugMode && (
          <DebugPanel
            currentTime={currentTime}
            activeScene={activeScene}
            activeLyric={activeLyric}
            overlays={activeOverlays}
          />
        )}
      </div>

      {/* Formulario de mensaje (modal fuera del player) */}
      {showMessageForm && (
        <MessageForm
          endpoint={interactionConfig?.messageFormEndpoint}
          senderName={projectConfig?.recipientName || 'tú'}
          onClose={() => setShowMessageForm(false)}
          onSent={() => setShowMessageForm(false)}
        />
      )}
    </div>
  );
}
