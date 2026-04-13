import React, { useState, useEffect, useRef } from 'react';

/**
 * ChatNotification — Toast de "nuevo mensaje de J."
 * 
 * Aparece cuando J. envía un mensaje en el chat.
 * Se desliza desde arriba con animación suave.
 */
export default function ChatNotification({ message }) {
  const [current, setCurrent] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const timerRef = useRef(null);
  const prevMsgRef = useRef(null);

  useEffect(() => {
    if (!message || message.id === prevMsgRef.current) return;
    
    // Solo mostrar mensajes de J., no del usuario
    if (message.from !== 'j') return;
    
    prevMsgRef.current = message.id;
    clearTimeout(timerRef.current);
    setLeaving(false);
    setCurrent(message);

    // Duración: 3.5 segundos
    timerRef.current = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => { 
        setCurrent(null); 
        setLeaving(false); 
      }, 500);
    }, 3500);

    return () => clearTimeout(timerRef.current);
  }, [message]);

  if (!current) return null;

  // Extraer texto preview (máx 50 chars)
  const previewText = current.text || '';
  const shortText = previewText.length > 50 
    ? previewText.substring(0, 50) + '...' 
    : previewText;

  return (
    <div className={`chat-notif ${leaving ? 'chat-notif--leaving' : 'chat-notif--entering'}`}>
      <div className="chat-notif-avatar">
        <div className="chat-notif-avatar-letter">J</div>
      </div>

      <div className="chat-notif-content">
        <span className="chat-notif-label">💬 J. te escribió</span>
        <span className="chat-notif-text">{shortText}</span>
      </div>

      {/* Indicador de punto brillante */}
      <div className="chat-notif-dot" />
    </div>
  );
}
