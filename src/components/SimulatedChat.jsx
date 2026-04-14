import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ChatMiniGame from './ChatMiniGame.jsx';
import { getGeminiResponse, getTypingDurationAI, maybeGetDoubleMessage } from '../utils/groq-ai.js';
import { getAIResponse as getOfflineResponse } from '../utils/chat-ai-response.js';

const TYPING_LEAD    = 2;     // fallback: si no usamos AI, 2s antes del mensaje del timeline
const MAX_VISIBLE    = 4;
const LONG_PRESS_MS  = 520;

const REACTION_OPTIONS = ['❤️', '😂', '😮', '😢', '🔥', '👏', '🫶', '💯'];

const EMOJI_LIST = [
  '❤️','🧡','💛','💙','💜','🖤','🤍','💕',
  '😊','🥰','😍','😂','😭','🥺','😏','😘',
  '🔥','💯','✨','🎵','🌹','💐','🌊','🫶',
  '👏','🙌','💪','🤝','🎶','❤️‍🔥','💖','🙈',
];

const STICKER_LIST = [
  '/assets/heart.gif',
  '/assets/rose.png',
  '/assets/star.svg'
];

export default function SimulatedChat({
  chatEvents = [], currentTime, senderConfig, visible = false, activeMiniGame, onMinigameMessage, currentSong = null, onNewMessage
}) {
  const [messages,        setMessages]        = useState([]);
  const [userReplies,     setUserReplies]     = useState({});
  const [msgReactions,    setMsgReactions]    = useState({});   // id → emoji (ella reacciona)
  const [jReactions,      setJReactions]      = useState({});   // id → emoji (J. reacciona)
  const [msgReadReceipts, setMsgReadReceipts] = useState({});   // id → true (J. ya leyó el mensaje)
  const [activePrompt,    setActivePrompt]    = useState(null);
  const [inputValue,      setInputValue]      = useState('');
  const [showEmojiPanel,  setShowEmojiPanel]  = useState(false);
  const [showStickerPanel,setShowStickerPanel]= useState(false);
  const [reactionTarget,  setReactionTarget]  = useState(null); // msgId
  const [typingState,     setTypingState]     = useState('none'); // 'none'|'first-alert'|'typing'
  const [miniGameTyping,  setMiniGameTyping]  = useState(false);
  const [showReactionTip, setShowReactionTip] = useState(false);
  const [geminiFailed,    setGeminiFailed]    = useState(false);  // fallback activado si Gemini cae

  // Refs para evitar closures stale en handleAIResponse
  const geminiFailedRef = useRef(geminiFailed);
  const currentSongRef  = useRef(currentSong);
  const messagesRef     = useRef(messages);

  useEffect(() => { geminiFailedRef.current = geminiFailed; }, [geminiFailed]);
  useEffect(() => { currentSongRef.current  = currentSong; }, [currentSong]);
  useEffect(() => { messagesRef.current     = messages; }, [messages]);

  // Callback directo para inyectar mensajes del minijuego sin filtro de tiempo
  const addDirectMessage = useCallback((msg) => {
    setMessages(prev => {
      if (prev.some(m => m.id === msg.id)) return prev; // dedup
      return [...prev, { ...msg, type: 'chat' }];
    });
  }, []);

  const addedRef         = useRef(new Set());
  const bottomRef        = useRef(null);
  const pressTimerRef    = useRef(null);
  const blockDocClick    = useRef(false);      // bloquea el click del doc tras long-press
  const inputRef         = useRef(null);
  const reactionTipShown = useRef(false);

  const firstEvent = useMemo(() =>
    chatEvents.length ? [...chatEvents].sort((a, b) => a.start - b.start)[0] : null,
  [chatEvents]);

  // ── Procesar timeline ─────────────────────────────────────
  useEffect(() => {
    const t = currentTime;
    const due = chatEvents.filter(ev =>
      ev.type === 'chat' && t >= ev.start && !addedRef.current.has(ev.id)
    );
    if (due.length > 0) {
      due.forEach(ev => addedRef.current.add(ev.id));
      setMessages(prev => [...prev, ...due]);
      setTypingState('none');
      const last = due[due.length - 1];
      if (last.quickReplies?.length && !userReplies[last.id]) setActivePrompt(last);
    }

    const upcoming = chatEvents.find(ev =>
      ev.type === 'chat' &&
      t >= ev.start - TYPING_LEAD && t < ev.start &&
      !addedRef.current.has(ev.id)
    );
    if (upcoming) {
      setTypingState(upcoming.id === firstEvent?.id ? 'first-alert' : 'typing');
    } else if (due.length === 0) {
      setTypingState('none');
    }
  }, [currentTime, chatEvents, firstEvent]);

  // Tip de reacción al llegar el primer mensaje de J.
  useEffect(() => {
    const firstFromJ = messages.find(m => m.from === 'j');
    if (firstFromJ && !reactionTipShown.current) {
      reactionTipShown.current = true;
      setTimeout(() => {
        setShowReactionTip(true);
        setTimeout(() => setShowReactionTip(false), 5500);
      }, 1800);
    }
  }, [messages]);

  // Notificar al padre cuando llega un mensaje nuevo de J.
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.from === 'j' && onNewMessage) {
      onNewMessage(lastMsg);
    }
  }, [messages.length, onNewMessage]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typingState]);

  // Cerrar paneles con click fuera — pero no justo después de un long-press
  useEffect(() => {
    const close = () => {
      if (blockDocClick.current) { blockDocClick.current = false; return; }
      setShowEmojiPanel(false);
      setShowStickerPanel(false);
      setReactionTarget(null);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  // ── Enviar mensaje (Gemini AI + fallback offline) ─────────
  const submitMessage = useCallback((text, isSticker = false, src = null) => {
    if (!isSticker && !text?.trim()) return;
    const clean = isSticker ? '' : text.trim();
    setInputValue('');
    setShowEmojiPanel(false);
    setShowStickerPanel(false);

    // Marcar mensajes anteriores como "leídos"
    setMsgReadReceipts(prev => {
      const updated = { ...prev };
      messages.forEach(m => { if (m.from === 'user') updated[m.id] = true; });
      return updated;
    });

    const freeId = `free-${Date.now()}`;
    const newMsg = isSticker
      ? { id: freeId, from: 'user', type: 'sticker', src }
      : { id: freeId, from: 'user', text: clean };
    setMessages(prev => [...prev, newMsg]);

    // ── Para prompts del timeline, usar conditionalReplies primero ──
    if (activePrompt && !userReplies[activePrompt.id] && !isSticker) {
      const eventId  = activePrompt.id;
      const replyId  = `${eventId}-reply`;
      setUserReplies(prev => ({ ...prev, [eventId]: clean }));
      setActivePrompt(null);
      setMessages(prev => [...prev, { id: replyId, from: 'user', text: clean }]);

      const lower = clean.toLowerCase();
      const event = chatEvents.find(e => e.id === eventId);
      let jReply  = null;
      if (event?.conditionalReplies) {
        for (const r of event.conditionalReplies) {
          if (r.match.some(kw => lower.includes(kw.toLowerCase()))) { jReply = r.response; break; }
        }
      }
      if (jReply) {
        setTimeout(() => {
          setMessages(prev => [...prev, { id: `${replyId}-j`, from: 'j', text: jReply }]);
          setMsgReadReceipts(prev => ({ ...prev, [replyId]: true }));
        }, 1800 + Math.random() * 1200);
        return;
      }
    }

    // ── Delegar a la función async ──
    handleAIResponse(clean, freeId, isSticker);
  }, [activePrompt, userReplies, chatEvents, currentSong, geminiFailed]);

  // Función async separada (fuera de useCallback para evitar problemas)
  const handleAIResponse = async (clean, freeId, isSticker) => {
    let aiResponse = null;

    // ── Paso 1: Delay "leyendo el mensaje" ──
    const readDelay = 800 + Math.random() * 1200;
    await new Promise(r => setTimeout(r, readDelay));

    // ── Paso 2: Empezar a "escribir" mientras la IA genera ──
    setTypingState('typing');

    // ── Paso 3: Generar respuesta ──
    if (isSticker) {
      aiResponse = ['❤️', 'qué lindo sticker :3', '🥰 me encanta'][Math.floor(Math.random() * 3)];
    } else if (!geminiFailedRef.current) {
      console.log('[Chat] Llamando a Groq para:', clean);
      try {
        aiResponse = await getGeminiResponse(clean, { currentSong: currentSongRef.current });
        console.log('[Chat] Groq respondió:', aiResponse);
        if (!aiResponse) throw new Error('Respuesta vacía');
      } catch (err) {
        console.warn('[Chat] Groq falló, usando fallback offline:', err.message);
        setGeminiFailed(true);
        aiResponse = getOfflineResponse(clean, { currentSong: currentSongRef.current, messageCount: messagesRef.current.length });
        console.log('[Chat] Fallback offline:', aiResponse);
      }
    } else {
      console.log('[Chat] Modo offline, usando patrones locales');
      aiResponse = getOfflineResponse(clean, { currentSong: currentSongRef.current, messageCount: messagesRef.current.length });
    }

    if (aiResponse) {
      // ── Paso 4: Typing natural (mínimo 1.5s, máximo 5s) ──
      const typingTime = getTypingDurationAI(aiResponse);

      await new Promise(r => setTimeout(r, typingTime));

      setTypingState('none');
      setMessages(prev => [...prev, { id: `${freeId}-j`, from: 'j', text: aiResponse }]);
      setMsgReadReceipts(prev => ({ ...prev, [freeId]: true }));

      // ── Paso 5: Doble mensaje (25% de probabilidad) ──
      const doubleMsg = maybeGetDoubleMessage(aiResponse);
      if (doubleMsg) {
        const doubleDelay = 600 + Math.random() * 800;
        await new Promise(r => setTimeout(r, doubleDelay));

        setTypingState('typing');
        const doubleTyping = getTypingDurationAI(doubleMsg);
        await new Promise(r => setTimeout(r, doubleTyping));

        setTypingState('none');
        setMessages(prev => [...prev, { id: `${freeId}-j2`, from: 'j', text: doubleMsg }]);
      }
    } else {
      // Sin respuesta → quitar typing
      setTypingState('none');
    }
  };

  // ── Long-press corregido ──────────────────────────────────
  const handlePressStart = (msgId) => {
    clearTimeout(pressTimerRef.current);
    pressTimerRef.current = setTimeout(() => {
      blockDocClick.current = true;   // ← bloquea el doc-click que viene del mouseup
      setReactionTarget(msgId);
      setShowEmojiPanel(false);
    }, LONG_PRESS_MS);
  };
  const handlePressEnd = () => clearTimeout(pressTimerRef.current);

  const handleReact = (msgId, emoji, e) => {
    e?.stopPropagation();
    setMsgReactions(prev => ({ ...prev, [msgId]: prev[msgId] === emoji ? null : emoji }));
    setReactionTarget(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitMessage(inputValue); }
  };

  const suggestions = (activePrompt?.quickReplies || []).filter(s =>
    !inputValue || s.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Chat visible si: la experiencia empezó (prop) O hay mensajes O hay typing
  const chatActive = visible || messages.length > 0 || typingState !== 'none';
  if (!chatActive) return null;

  const total = messages.length;

  return (
    <div className="chat-panel" id="chat-panel" onClick={e => e.stopPropagation()}>

      {/* Tip de reacción */}
      {showReactionTip && (
        <div className="chat-reaction-tip">
          💫 mantén presionado un mensaje para reaccionar
        </div>
      )}

      {useMemo(() => (
        <div className="chat-messages">
        {messages.map((msg, idx) => {
          const age      = total - idx - 1;
          const fadeClass =
            age >= MAX_VISIBLE     ? 'chat-bubble--hidden' :
            age === MAX_VISIBLE-1  ? 'chat-bubble--faded'  : '';
          const isJ          = msg.from === 'j';
          const myReaction   = msgReactions[msg.id];
          const jsReaction   = jReactions[msg.id];
          const isReacting   = reactionTarget === msg.id;

          return (
            <div key={msg.id} className={`chat-bubble-row ${msg.from === 'user' ? 'chat-bubble-row--right' : ''}`}>

              {/* Reaction picker — stopPropagation aquí protege del doc-click */}
              {isReacting && (
                <div
                  className={`chat-reaction-picker ${msg.from === 'user' ? 'chat-reaction-picker--right' : ''}`}
                  onClick={e => e.stopPropagation()}
                >
                  {REACTION_OPTIONS.map(em => (
                    <button
                      key={em}
                      className={`chat-react-option ${myReaction === em ? 'active' : ''}`}
                      onClick={e => handleReact(msg.id, em, e)}
                    >{em}</button>
                  ))}
                </div>
              )}

              {/* Burbuja */}
              <div
                className={`chat-bubble ${isJ ? 'chat-bubble--j' : 'chat-bubble--user'} ${fadeClass}`}
                onMouseDown={() => handlePressStart(msg.id)}
                onMouseUp={handlePressEnd}
                onTouchStart={() => handlePressStart(msg.id)}
                onTouchEnd={handlePressEnd}
                onContextMenu={e => { e.preventDefault(); handlePressStart(msg.id); }}
              >
                {isJ && (
                  <div className="chat-avatar-wrap">
                    {senderConfig?.photo
                      ? <img src={senderConfig.photo} className="chat-avatar" alt="" />
                      : <div className="chat-avatar chat-avatar--placeholder">{senderConfig?.initial || 'J'}</div>
                    }
                  </div>
                )}
                <div className="chat-content">
                  {isJ && <span className="chat-name">{senderConfig?.name || 'J.'}</span>}
                  {msg.type === 'sticker' ? (
                    <img src={msg.src} alt="sticker" className="chat-sticker-img" />
                  ) : (
                    <p className="chat-text">{msg.text}</p>
                  )}
                  {myReaction && <span className="chat-reaction chat-reaction--hers">{myReaction}</span>}
                  {jsReaction && <span className="chat-reaction chat-reaction--j">{jsReaction}</span>}
                  {/* Read receipts para mensajes del usuario */}
                  {!isJ && msgReadReceipts[msg.id] && (
                    <span className="chat-read-receipt">✓✓</span>
                  )}
                  {!isJ && !msgReadReceipts[msg.id] && (
                    <span className="chat-read-receipt chat-read-receipt--sent">✓</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Alerta primer mensaje */}
        {typingState === 'first-alert' && (
          <div className="chat-first-alert">
            <div className="chat-first-alert-dot" />
            <span>alguien está enviando un mensaje...</span>
          </div>
        )}

        {/* Typing normal */}
        {(typingState === 'typing' || miniGameTyping) && (
          <div className="chat-bubble-row">
            <div className="chat-bubble chat-bubble--j">
              <div className="chat-avatar-wrap">
                {senderConfig?.photo
                  ? <img src={senderConfig.photo} className="chat-avatar" alt="" />
                  : <div className="chat-avatar chat-avatar--placeholder">{senderConfig?.initial || 'J'}</div>
                }
              </div>
              <div className="chat-content">
                <div className="chat-typing-dots"><span /><span /><span /></div>
              </div>
            </div>
          </div>
        )}

        {/* ── MINIJUEGO INYECTADO AQUÍ ── */}
        <ChatMiniGame
          game={activeMiniGame}
          onMessage={addDirectMessage}
          onTyping={setMiniGameTyping}
        />

        <div ref={bottomRef} />
      </div>
      ), [messages, msgReactions, jReactions, msgReadReceipts, reactionTarget, typingState, miniGameTyping, activeMiniGame, senderConfig])}

      {/* ── INPUT ─── SIEMPRE VISIBLE ────────────────────── */}
      {useMemo(() => (
      <div className="chat-input-area" onClick={e => e.stopPropagation()}>

        {/* Chips de sugerencia del prompt activo */}
        {suggestions.length > 0 && (
          <div className="chat-suggestions">
            {suggestions.map(s => (
              <button key={s} className="chat-suggestion" onClick={() => submitMessage(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="chat-input-row">
          {/* Botón emoji */}
          <div className="chat-emoji-wrap" style={{ position: 'relative' }}>
            <button
              className="chat-emoji-btn"
              aria-label="Emojis"
              onClick={e => { 
                e.stopPropagation(); 
                setShowEmojiPanel(p => !p); 
                setShowStickerPanel(false);
              }}
            >😊</button>

            {showEmojiPanel && (
              <div className="chat-emoji-panel" onClick={e => e.stopPropagation()}>
                {EMOJI_LIST.map(em => (
                  <button
                    key={em}
                    className="chat-emoji-item"
                    onClick={e => {
                      e.stopPropagation();
                      if (activePrompt && !userReplies[activePrompt.id]) {
                        submitMessage(em);
                      } else {
                        setInputValue(prev => prev + em);
                        inputRef.current?.focus();
                        setShowEmojiPanel(false);
                      }
                    }}
                  >{em}</button>
                ))}
              </div>
            )}
          </div>

          {/* Botón stickers */}
          <div className="chat-emoji-wrap" style={{ position: 'relative' }}>
            <button
              className="chat-emoji-btn"
              aria-label="Stickers"
              onClick={e => { 
                e.stopPropagation(); 
                setShowStickerPanel(p => !p); 
                setShowEmojiPanel(false);
              }}
            >🖼️</button>

            {showStickerPanel && (
              <div className="chat-sticker-panel" onClick={e => e.stopPropagation()}>
                {STICKER_LIST.map(st => (
                  <button
                    key={st}
                    className="chat-sticker-item"
                    onClick={e => {
                      e.stopPropagation();
                      submitMessage(null, true, st);
                    }}
                  >
                    <img src={st} alt="sticker" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            placeholder="escribe algo..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={100}
          />

          <button
            className="chat-send-btn"
            onClick={() => submitMessage(inputValue)}
            disabled={!inputValue.trim()}
            aria-label="Enviar"
          >➤</button>
        </div>
      </div>
      ), [suggestions, inputValue, showEmojiPanel, showStickerPanel, activePrompt, userReplies])}
    </div>
  );
}
