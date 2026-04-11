import React, { useState } from 'react';
import { timeline } from '../config/timelineConfig.js';

/**
 * DebugPanel — Panel de debug del timeline (solo si debugMode: true)
 *
 * Props:
 *   currentTime  → número
 *   activeScene  → string
 *   activeLyric  → objeto o null
 *   overlays     → array
 */
export default function DebugPanel({ currentTime, activeScene, activeLyric, overlays }) {
  const [collapsed, setCollapsed] = useState(false);

  const upcoming = timeline
    .filter(e => e.start > currentTime && e.start < currentTime + 10)
    .slice(0, 3);

  return (
    <div className="debug-panel">
      <h4>
        🎬 DEBUG TIMELINE
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ float: 'right', background: 'none', border: 'none', color: '#00ffcc', cursor: 'pointer', fontSize: '10px' }}
        >
          {collapsed ? '▼' : '▲'}
        </button>
      </h4>

      {!collapsed && (
        <>
          <div className="debug-time">⏱ {currentTime.toFixed(2)}s</div>
          <div className="debug-scene">🎨 Escena: {activeScene || '—'}</div>
          <div className="debug-lyric">💬 Lyric: {activeLyric?.content?.slice(0, 20) || '—'}</div>
          <div className="debug-active">📌 Overlays: {overlays.length}</div>
          {upcoming.length > 0 && (
            <div style={{ marginTop: '6px', borderTop: '1px solid rgba(0,255,204,0.15)', paddingTop: '6px' }}>
              <div style={{ color: '#888', fontSize: '9px', marginBottom: '4px' }}>PRÓXIMOS (10s):</div>
              {upcoming.map(e => (
                <div key={e.id} style={{ color: '#aaa', fontSize: '10px' }}>
                  {e.start.toFixed(0)}s → [{e.type}] {e.scene || e.content?.slice(0, 12) || e.effect || e.src}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
