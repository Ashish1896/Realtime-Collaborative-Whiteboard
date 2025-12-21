'use client';

import { useEffect, useState } from 'react';

export default function Toolbar({ onClear, onReplay, onAutosave, isPlayback, hasHistory, canvasRef }) {
  const [shortcutHelp, setShortcutHelp] = useState(false);
  const [brushMode, setBrushMode] = useState(true);

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if playing back
      if (isPlayback) return;

      const key = e.key.toLowerCase();

      // B - Brush
      if (key === 'b') {
        e.preventDefault();
        setBrushMode(true);
      }
      // E - Eraser
      else if (key === 'e') {
        e.preventDefault();
        setBrushMode(false);
      }
      // C - Clear
      else if (key === 'c') {
        e.preventDefault();
        handleClear();
      }
      // Z - Undo
      else if (key === 'z' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        // Undo functionality would be implemented here
      }
      // Y - Redo
      else if (key === 'y' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        // Redo functionality would be implemented here
      }
      // ? - Show help
      else if (key === '?') {
        e.preventDefault();
        setShortcutHelp(!shortcutHelp);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlayback, shortcutHelp]);

  const handleClearAutosave = () => {
    onClear();
  };

  const handleManualSave = () => {
    if (canvasRef?.current?.saveToStorage) {
      canvasRef.current.saveToStorage();
    }
  };

  return (
    <>
      <div style={{ 
        padding: '10px 20px', 
        background: '#fff', 
        borderBottom: '1px solid #eee',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        borderRadius: '8px 8px 0 0',
        boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
        position: 'relative'
      }}>
        {/* Tool Buttons */}
        <div style={{ display: 'flex', gap: '8px', borderRight: '1px solid #eee', paddingRight: '15px' }}>
          <button 
            onClick={() => setBrushMode(true)}
            style={{ 
              padding: '6px 12px', 
              borderRadius: '4px', 
              border: brushMode ? '2px solid #007bff' : '1px solid #ddd', 
              background: brushMode ? '#e7f1ff' : '#f8f9fa', 
              cursor: 'pointer',
              fontWeight: brushMode ? 'bold' : 'normal'
            }}
            title="Brush (Press B)"
          >
            🖌️ Brush
          </button>
          <button 
            onClick={() => setBrushMode(false)}
            style={{ 
              padding: '6px 12px', 
              borderRadius: '4px', 
              border: !brushMode ? '2px solid #007bff' : '1px solid #ddd', 
              background: !brushMode ? '#e7f1ff' : '#fff', 
              cursor: 'pointer',
              fontWeight: !brushMode ? 'bold' : 'normal'
            }}
            title="Eraser (Press E)"
          >
            🧹 Eraser
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            onClick={handleClearAutosave}
            disabled={isPlayback}
            style={{ 
              padding: '6px 12px', 
              borderRadius: '4px', 
              border: '1px solid #ffccd5', 
              background: '#fff0f3', 
              color: '#c9184a',
              cursor: isPlayback ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem'
            }}
            title="Clear Board (Press C)"
          >
            🗑️ Clear
          </button>

          <button 
            onClick={onReplay}
            disabled={!hasHistory || isPlayback}
            style={{ 
              padding: '6px 16px', 
              borderRadius: '4px', 
              border: 'none', 
              background: isPlayback ? '#ddd' : '#4cc9f0', 
              color: '#fff',
              cursor: (!hasHistory || isPlayback) ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}
          >
            {isPlayback ? 'Playing...' : '▶ Playback'}
          </button>

          <button 
            onClick={handleManualSave}
            disabled={!hasHistory}
            style={{ 
              padding: '6px 12px', 
              borderRadius: '4px', 
              border: '1px solid #cfe3ff', 
              background: '#e7f1ff', 
              color: '#0c63e4',
              cursor: !hasHistory ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem'
            }}
            title="Save (Ctrl+S)"
          >
            💾 Save
          </button>

          <button
            onClick={() => setShortcutHelp(!shortcutHelp)}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: '1px solid #dee2e6',
              background: '#f8f9fa',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
            title="Keyboard Shortcuts (Press ?)"
          >
            ⌨️ Help
          </button>
        </div>

        {!hasHistory && !isPlayback && (
          <span style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic', marginLeft: 'auto' }}>
            Press ? for shortcuts
          </span>
        )}
      </div>

      {/* Keyboard Shortcuts Help Modal */}
      {shortcutHelp && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          zIndex: 1000,
          maxWidth: '400px',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: '0', fontSize: '1.2rem' }}>⌨️ Keyboard Shortcuts</h2>
            <button
              onClick={() => setShortcutHelp(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0',
                color: '#666'
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'grid', gap: '10px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <span><strong>B</strong></span>
              <span>Switch to Brush</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <span><strong>E</strong></span>
              <span>Switch to Eraser</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <span><strong>C</strong></span>
              <span>Clear Board</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <span><strong>Z</strong></span>
              <span>Undo (Coming Soon)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span><strong>Y</strong></span>
              <span>Redo (Coming Soon)</span>
            </div>
          </div>

          <button
            onClick={() => setShortcutHelp(false)}
            style={{
              marginTop: '16px',
              width: '100%',
              padding: '8px 12px',
              background: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Close
          </button>
        </div>
      )}

      {/* Overlay for modal */}
      {shortcutHelp && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 999
          }}
          onClick={() => setShortcutHelp(false)}
        />
      )}
    </>
  );
}
