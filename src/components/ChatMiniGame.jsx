import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * ChatMiniGame — Minijuego "elige N de M" en el chat
 *
 * Flujo por selección:
 *  1. Usuario elige → opciones DESAPARECEN (estado "respondiendo")
 *  2. J. responde (1.5s delay)
 *  3. Si quedan opciones → J. dice cuántas quedan → opciones VUELVEN A APARECER
 *  4. Si no quedan → mensaje de cierre + done
 */
export default function ChatMiniGame({ game, onMessage }) {
  const [chosen,       setChosen]       = useState([]);
  const [done,         setDone]         = useState(false);
  const [introSent,    setIntroSent]    = useState(false);
  const [showButtons,  setShowButtons]  = useState(false); // controla cuándo aparecen los botones
  const [responding,   setResponding]   = useState(false); // oculta panel mientras J. habla
  const prevGameId = useRef(null);

  // Reset al cambiar de juego
  useEffect(() => {
    if (!game) return;
    if (game.id === prevGameId.current) return;
    prevGameId.current = game.id;
    setChosen([]);
    setDone(false);
    setIntroSent(false);
    setResponding(false);
    setShowButtons(false);
  }, [game?.id]);

  // Enviar intro de J. al activarse el minijuego
  useEffect(() => {
    if (!game || introSent) return;
    console.log('[MiniGame] Sending intro for game:', game.id);
    const delay = setTimeout(() => {
      setIntroSent(true);
      onMessage?.({
        id: `mg-intro-${game.id}`,
        from: 'j',
        text: game.intro || 'elige una opción 🌹',
      });
      // Dar tiempo para leer el mensaje antes de mostrar los botones
      setTimeout(() => {
        console.log('[MiniGame] showButtons → true for game:', game.id);
        setShowButtons(true);
      }, 2500);
    }, 700);
    return () => clearTimeout(delay);
  }, [game?.id, introSent]);

  const handleChoose = useCallback((option) => {
    if (done || responding) return;

    const newChosen = [...chosen, option.id];
    setChosen(newChosen);
    setResponding(true); // ocultar opciones inmediatamente

    // Burbuja de ella eligiendo
    onMessage?.({ id: `mg-pick-${game.id}-${option.id}`, from: 'user', text: option.label });

    // J. responde en 1.5s
    setTimeout(() => {
      onMessage?.({ id: `mg-ans-${game.id}-${option.id}`, from: 'j', text: option.answer });

      const left = game.maxChoices - newChosen.length;
      if (left > 0) {
        // Quedan opciones → decirle cuántas y volver a mostrar los botones
        setTimeout(() => {
          let leftMsg;
          if (left === 1) {
            leftMsg = '...te queda 1 sola — piénsala bien 💭';
          } else {
            leftMsg = `te quedan ${left} — elige otra 😌`;
          }
          onMessage?.({ id: `mg-left-${game.id}-${option.id}`, from: 'j', text: leftMsg });
          // Dar tiempo suficiente para leer el mensaje antes de re-mostrar botones
          setTimeout(() => setResponding(false), 2500);
        }, 1200);
      } else {
        // Sin opciones → mensaje final + cerrar
        setTimeout(() => {
          const endMsg = game.endMessage || 'eso era todo lo que quería que supieras 🌹';
          onMessage?.({ id: `mg-end-${game.id}`, from: 'j', text: endMsg });
          setDone(true);
          setResponding(false);
        }, 1400);
      }
    }, 1500);
  }, [chosen, done, responding, game, onMessage]);

  // No renderizar nada si: no hay juego, terminó, no envió intro todavía, o los botones aún no deben verse
  if (!game || done || !introSent || !showButtons) return null;

  // Mientras J. responde, ocultar todo el panel
  if (responding) return null;

  const maxChoices = game.maxChoices || 3;
  const remaining  = maxChoices - chosen.length;
  const available  = (game.options || []).filter(o => !chosen.includes(o.id));

  if (available.length === 0) return null;

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
