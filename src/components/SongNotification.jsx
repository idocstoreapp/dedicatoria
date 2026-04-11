import React, { useState, useEffect, useRef } from 'react';

/**
 * SongNotification — Toast de "reproduciendo ahora" estilo Spotify/Apple Music
 *
 * Se activa con type: "song-notification" en el timeline:
 * {
 *   id: "song-babylon",
 *   start: 15.5,
 *   type: "song-notification",
 *   title: "Babylon Girl",
 *   artist: "Dany Ocean",
 *   cover: "/covers/babylon.jpg",  // opcional
 * }
 * La notificación aparece 4 segundos y desaparece sola.
 */
export default function SongNotification({ notification }) {
  const [current, setCurrent] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!notification) return;
    // Limpiar timeout previo
    clearTimeout(timerRef.current);
    setLeaving(false);
    setCurrent(notification);

    timerRef.current = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => { setCurrent(null); setLeaving(false); }, 450);
    }, 3000);

    return () => clearTimeout(timerRef.current);
  }, [notification?.id]);

  if (!current) return null;

  return (
    <div className={`song-notif ${leaving ? 'song-notif--leaving' : 'song-notif--entering'}`}>
      <div className="song-notif-cover">
        {current.cover
          ? <img src={current.cover} alt="" />
          : <div className="song-notif-cover-placeholder">🎵</div>
        }
        <div className="song-notif-cover-pulse" />
      </div>

      <div className="song-notif-info">
        <span className="song-notif-label">▶ reproduciendo ahora</span>
        <span className="song-notif-title">{current.title}</span>
        <span className="song-notif-artist">{current.artist}</span>
      </div>

      {/* Barras de equalizer animadas */}
      <div className="song-notif-eq" aria-hidden="true">
        <div className="song-notif-eq-bar" style={{ '--delay': '0s' }} />
        <div className="song-notif-eq-bar" style={{ '--delay': '0.2s' }} />
        <div className="song-notif-eq-bar" style={{ '--delay': '0.1s' }} />
        <div className="song-notif-eq-bar" style={{ '--delay': '0.35s' }} />
      </div>
    </div>
  );
}
