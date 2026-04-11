import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * ChatMiniGame — Minijuego "elige N de M" en el chat
 *
 * En timelineConfig:
 * {
 *   id: "minigame-1",
 *   start: 417,
 *   end: 600,
 *   type: "minigame",
 *   intro: "texto de introducción de J.",
 *   maxChoices: 3,   // cuántas puede elegir (1 = solo 1 favorita)
 *   options: [
 *     { id: "a", label: "¿Por qué yo?", answer: "Respuesta de J." },
 *     ...
 *   ],
 * }
 */
export default function ChatMiniGame({ game, onMessage }) {
  const [chosen,    setChosen]    = useState([]);
  const [done,      setDone]      = useState(false);
  const [introSent, setIntroSent] = useState(false);
  const prevGameId  = useRef(null);

  // Reset al cambiar de juego
  useEffect(() => {
    if (!game) return;
    if (game.id === prevGameId.current) return;
    prevGameId.current = game.id;
    setChosen([]);
    setDone(false);
    setIntroSent(false);
  }, [game?.id]);

  // Enviar intro de J. al activarse el minijuego
  useEffect(() => {
    if (!game || introSent) return;
    const delay = setTimeout(() => {
      setIntroSent(true);
      onMessage?.({
        id: `mg-intro-${game.id}`,
        from: 'j',
        text: game.intro || 'elige una opción 🌹',
      });
    }, 700);
    return () => clearTimeout(delay);
  }, [game?.id, introSent]);

  const handleChoose = useCallback((option) => {
    if (done) return;
    const newChosen = [...chosen, option.id];
    setChosen(newChosen);

    // Burbuja de ella eligiendo
    onMessage?.({ id: `mg-pick-${game.id}-${option.id}`, from: 'user', text: option.label });

    // J. responde en 1.5s
    setTimeout(() => {
      onMessage?.({ id: `mg-ans-${game.id}-${option.id}`, from: 'j', text: option.answer });

      const left = game.maxChoices - newChosen.length;
      if (left > 0) {
        setTimeout(() => {
          let leftMsg;
          if (left === 1) {
            leftMsg = game.maxChoices === 1
              ? '¿cuál fue tu favorita? 🎵'
              : '...te queda 1 sola — piénsala bien 💭';
          } else {
            leftMsg = `te quedan ${left} opciones 😌`;
          }
          onMessage?.({ id: `mg-left-${game.id}-${option.id}`, from: 'j', text: leftMsg });
        }, 1200);
      } else {
        // Fin
        setTimeout(() => {
          const endMsg = game.endMessage || 'eso era todo lo que quería que supieras 🌹';
          onMessage?.({ id: `mg-end-${game.id}`, from: 'j', text: endMsg });
          setDone(true);
        }, 1400);
      }
    }, 1500);
  }, [chosen, done, game, onMessage]);

  if (!game || done) return null;
  if (!introSent) return null; // Esperar a que llegue el intro

  const maxChoices = game.maxChoices || 3;
  const remaining  = maxChoices - chosen.length;
  const available  = (game.options || []).filter(o => !chosen.includes(o.id));

  return (
    <div className="minigame-panel">
      <div className="minigame-options">
        {available.map(opt => (
          <button key={opt.id} className="minigame-option" onClick={() => handleChoose(opt)}>
            {opt.label}
          </button>
        ))}
      </div>

      {remaining > 0 && (
        <div className="minigame-remaining">
          {remaining === maxChoices && maxChoices === 1
            ? 'elige tu favorita 🎵'
            : remaining === maxChoices
              ? `elige ${maxChoices} — solo puedes saber ${maxChoices}`
              : remaining === 1
                ? '1 opción restante — piénsala bien 💭'
                : `${remaining} opciones restantes`
          }
        </div>
      )}
    </div>
  );
}
