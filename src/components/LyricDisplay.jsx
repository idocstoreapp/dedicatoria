import React, { useEffect, useRef, useState } from 'react';

/**
 * LyricDisplay
 *
 * Posiciones:
 *   center | top | bottom | top-bar | bottom-bar
 *
 * Animaciones:
 *   fade | zoom | slide | bounce | theater
 *   snake-loop | rainbow | glow | aura | arc
 */
export default function LyricDisplay({ lyric }) {
  const [displayed, setDisplayed] = useState(null);
  const [phase,     setPhase]     = useState('idle');
  const textRef        = useRef(null);
  const exitTimerRef   = useRef(null);
  const stickyTimerRef = useRef(null);

  useEffect(() => {
    if (exitTimerRef.current)   clearTimeout(exitTimerRef.current);
    if (stickyTimerRef.current) clearTimeout(stickyTimerRef.current);

    if (lyric) {
      setDisplayed(lyric);
      setPhase('enter');
      exitTimerRef.current = setTimeout(() => setPhase('show'), 600);
    } else if (displayed) {
      const isSticky = displayed.sticky === true;
      const stickMs  = (displayed.stickDuration || 3) * 1000;
      if (isSticky) {
        setPhase('sticky');
        stickyTimerRef.current = setTimeout(() => {
          setPhase('exit');
          exitTimerRef.current = setTimeout(() => { setDisplayed(null); setPhase('idle'); }, 500);
        }, stickMs);
      } else {
        setPhase('exit');
        exitTimerRef.current = setTimeout(() => { setDisplayed(null); setPhase('idle'); }, 500);
      }
    }
    return () => {
      if (exitTimerRef.current)   clearTimeout(exitTimerRef.current);
      if (stickyTimerRef.current) clearTimeout(stickyTimerRef.current);
    };
  }, [lyric?.id]);

  if (!displayed) return null;

  const {
    content,
    style     = 'romantic',
    animation = 'fade',
    position  = 'center',
    feature   = false,
  } = displayed;

  const posClass     = `pos-${position}`;
  const styleClass   = `lyric-${style}`;
  const featureClass = feature ? 'lyric-wrapper--feature' : '';

  let animClass = '';
  if (phase === 'enter') animClass = `anim-${animation}-enter`;
  else if (phase === 'exit') animClass = `anim-${animation}-exit`;

  const stickyStyle = phase === 'sticky'
    ? { filter: 'drop-shadow(0 0 12px currentColor)' }
    : {};

  // ── Animación ARC → renderizado SVG ──────────────────────
  if (animation === 'arc') {
    return (
      <div className={`lyric-wrapper ${posClass} ${featureClass} lyric-wrapper--arc`}>
        <svg
          className={`lyric-arc-svg ${animClass}`}
          viewBox="0 0 400 160"
          xmlns="http://www.w3.org/2000/svg"
          aria-label={content}
        >
          <defs>
            <path id="arc-path-up"   d="M 20,130 A 180,180 0 0,1 380,130" />
          </defs>
          <text className={`lyric-arc-text lyric-${style}`}>
            <textPath href="#arc-path-up" startOffset="50%" textAnchor="middle">
              {content}
            </textPath>
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className={`lyric-wrapper ${posClass} ${featureClass}`}>
      <p
        ref={textRef}
        className={`lyric-text ${styleClass} ${animClass}`}
        data-text={content}
        style={stickyStyle}
        aria-live="polite"
        aria-atomic="true"
      >
        {content}
      </p>
    </div>
  );
}
