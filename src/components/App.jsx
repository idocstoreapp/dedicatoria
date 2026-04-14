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
import TourMascot from './TourMascot.jsx';
import TourBackground from './TourBackground.jsx';
import SongNotification from './SongNotification.jsx';
import ChatMiniGame from './ChatMiniGame.jsx';
import ChatNotification from './ChatNotification.jsx';
import MinigameScene from './MinigameScene.jsx';
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
  const [lastChatFromJ,       setLastChatFromJ]       = useState(null);

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
  const handleChatMessage   = useCallback(msg => {
    if (msg.from === 'j') setLastChatFromJ(msg);
  }, []);
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

  // ─── EFFECTS / LIKES / INTERACTIONS ──────────────────────
  const handleEffectDone = useCallback(() => setActiveEffect(null), []);
  const handleVideoError = useCallback(() => setVideoError(true), []);
  const handleInteractionAnswer = useCallback((answer, interaction) => {
    console.log('Respuesta:', answer, interaction.id);
  }, []);

  const handleLike = useCallback((count) => setLikeCount(count), []);
  // ─── INTRO → PLAYER ──────────────────────────────────────
  // El video ya fue precargado en el fondo durante la intro.
  // Solo debemos llamar play() — el video ya está en el DOM.
  const handleIntroStart = useCallback(() => {
    const video = videoRef.current;

    setHasStarted(true);
    setView('player');

    // Usar el gesto real del botón INICIAR para garantizar play inmediato
    // y evitar que el navegador difiera la reproducción.
    requestAnimationFrame(() => {
      const video = videoRef.current;
      if (!video) return;
      // video.currentTime = 0; // Removido para evitar stall TCP de Cloudflare
      video.play().then(() => setIsPlaying(true)).catch(console.error);
    });
  }, []);



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
            autoPlay={false}
            muted={view === 'intro' || videoConfig.muted}
            onTimeUpdate={handleTimeUpdate}
            onReady={handleVideoReady}
            onError={handleVideoError}
          />
        </div>

        {/* ── CAPA INTRO (SOBRE EL VIDEO DIRECTAMENTE) ───── */}
        {view === 'intro' && (
          <IntroScreen onStart={handleIntroStart} />
        )}

        {/* ── CAPA 2: ESCENAS ──────────────────────────── */}
        <div className="layer-scene">
          <SceneManager
            activeScene={videoError ? (activeScene || 'starfield') : activeScene}
            hasVideo={!videoError}
          />
        </div>

        {/* ── CAPA 2b: BLACKOUT ──────────────── */}
        {hasStarted && <BlackoutLayer isActive={isBlackout} />}

        {/* ── CAPA 3: OVERLAYS ───────────────── */}
        {hasStarted && (
          <div className="layer-overlay">
            <OverlayEffects
              overlays={activeOverlays}
              activeEffect={activeEffect}
              onEffectDone={handleEffectDone}
              containerRef={containerRef}
            />
          </div>
        )}

        {/* ── ESCENA MINIJUEGO ───────────────── */}
        <MinigameScene isActive={!!activeMiniGame} />

        {/* ── CAPA 4: LETRAS — solo cuando empieza la experiencia ── */}
        {hasStarted && (
          <div className="layer-lyrics">
            <LyricDisplay lyric={activeLyric} />
          </div>
        )}

        {/* ── CAPA 4b: INTERACCIONES ─────────────── */}
        {hasStarted && (
          <div className="layer-interactions">
            <InteractionOverlay
              interaction={activeInteraction}
              onAnswer={handleInteractionAnswer}
            />
          </div>
        )}

        {/* ── CAPA 5: CHAT SIMULADO ─────────────────────── */}
        <SimulatedChat
          chatEvents={chatEvents}
          currentTime={currentTime}
          senderConfig={chatConfig?.sender}
          recipientConfig={chatConfig?.recipient}
          visible={hasStarted}
          activeMiniGame={activeMiniGame}
          onMinigameMessage={handleMinigameMessage}
          onNewMessage={handleChatMessage}
          currentSong={
            currentTime < 178 ? 'Imaginate' :
            currentTime < 274 ? 'Vitamina' :
            currentTime < 403 ? 'Volaré' :
            currentTime < 610 ? 'Crayola' :
            'Corazón'
          }
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
              isSuperlike={isSuperlike && !activeTour}
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

        {/* ── NOTIFICACIÓN DE CHAT (J. escribió) ─────────── */}
        <ChatNotification message={lastChatFromJ} />

        {/* Sin video */}
        {videoError && (
          <div className="no-video-msg">
            <div style={{ fontSize: 48 }}>🎬</div>
            <p>Coloca tu video en <code>public/video.mp4</code></p>
          </div>
        )}

        {/* ── TOUR SPOTLIGHT + MASCOT + BACKGROUND ──────── */}
        {activeTour && (
          <>
            <TourBackground 
              isActive={!!activeTour} 
              progress={currentTime / 14.5}
            />
            <TourSpotlight tourEvent={activeTour} containerRef={containerRef} />
            <TourMascot 
              tourEvent={activeTour} 
              containerRef={containerRef}
              progress={currentTime / 14.5}
            />
          </>
        )}

        {/* ── MOTOR TIMELINE — solo cuando la experiencia comenzó ── */}
        {hasStarted && (
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
        )}

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
