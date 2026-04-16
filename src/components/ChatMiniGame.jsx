import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getGeminiResponse } from '../utils/groq-ai.js';

/**
 * ChatMiniGame — Minijuego "elige N de M" en el chat
 *
 * Flujo por selección:
 *  1. Usuario elige → opciones DESAPARECEN (estado "respondiendo")
 *  2. J. responde (1.5s delay)
 *  3. Si quedan opciones → J. dice cuántas quedan → opciones VUELVEN A APARECER
 *  4. Si no quedan → mensaje de cierre + done
 */
export default function ChatMiniGame({ game, onMessage, onTyping }) {
  const [chosen, setChosen] = useState([]);
  const [done, setDone] = useState(false);
  const [introSent, setIntroSent] = useState(false);
  const [showButtons, setShowButtons] = useState(false); // controla cuándo aparecen los botones
  const [responding, setResponding] = useState(false); // oculta panel mientras J. habla
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

  const panelRef = useRef(null);

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
  }, [game?.id, introSent, game?.intro, onMessage]);

  // Mostrar los botones después de que se envía la intro
  useEffect(() => {
    if (!game || !introSent || showButtons) return;

    const delay = setTimeout(() => {
      setShowButtons(true);
    }, 4500);

    return () => clearTimeout(delay);
  }, [game?.id, introSent, showButtons]);

  useEffect(() => {
    if (showButtons && !responding && panelRef.current) {
      setTimeout(() => {
        panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [showButtons, responding]);

  const handleChoose = useCallback(async (option) => {
    if (done || responding) return;

    const newChosen = [...chosen, option.id];
    setChosen(newChosen);
    setResponding(true); // ocultar opciones inmediatamente

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    // Burbuja de ella eligiendo
    onMessage?.({ id: `mg-pick-${game.id}-${option.id}`, from: 'user', text: option.label });

    await sleep(600);
    onTyping?.(true); // Iniciar indicador de "escribiendo..." de J

    // Preparar el prompt para la IA
    const prompt = `Eres J., una chica misteriosa y sutil que está viendo un video musical (Dany Ocean Casaparlante) en tiempo real con quien le envió esta dedicatoria. ÉL (o ELLA) acaba de apretar el botón preguntándote: "${option.label}". 
    Tú ibas a responder originalmente: "${option.answer}". 
    En base a eso, dame una respuesta muy similar de 1 sola frase corta, casual, romántica pero sutil y misteriosa, como en un chat de WhatsApp (usa todo en minúsculas, emojis sutiles, sé breve y directa).`;

    const start = Date.now();
    let finalAnswer = option.answer; // Fallback
    try {
      const res = await getGeminiResponse(prompt);
      if (res) finalAnswer = res;
    } catch (e) {
      console.warn("AI Falló, usando default", e);
    }

    // Forzar que escriba por al menos 3.5 segundos para conservar realismo
    const elapsed = Date.now() - start;
    if (elapsed < 3500) await sleep(3500 - elapsed);

    onTyping?.(false);
    onMessage?.({ id: `mg-ans-${game.id}-${option.id}`, from: 'j', text: finalAnswer });

    const left = game.maxChoices - newChosen.length;
    if (left > 0) {
      await sleep(1200);
      onTyping?.(true);
      await sleep(2000);
      onTyping?.(false);

      let leftMsg = left === 1
        ? '...te queda 1 sola — piénsala bien 💭'
        : `te quedan ${left} — elige otra 😌`;

      onMessage?.({ id: `mg-left-${game.id}-${option.id}`, from: 'j', text: leftMsg });

      await sleep(2500);
      setResponding(false); // volver a mostrar opciones
    } else {
      await sleep(1500);
      onTyping?.(true);
      await sleep(2500);
      onTyping?.(false);
      const endMsg = game.endMessage || 'eso era todo lo que quería que supieras 🌹';
      onMessage?.({ id: `mg-end-${game.id}`, from: 'j', text: endMsg });
      setDone(true);
      setResponding(false);
    }
  }, [chosen, done, responding, game, onMessage, onTyping]);

  // No renderizar nada si: no hay juego, terminó, no envió intro todavía, o los botones aún no deben verse
  if (!game || done || !introSent || !showButtons) return null;

  // Mientras J. responde, ocultar todo el panel
  if (responding) return null;

  const maxChoices = game.maxChoices || 3;
  const remaining = maxChoices - chosen.length;
  const available = (game.options || []).filter(o => !chosen.includes(o.id));

  if (available.length === 0) return null;

  return (
    <div className="minigame-panel" ref={panelRef}>
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
