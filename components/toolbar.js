'use client';

export default function Toolbar({ onClear, onReplay, isPlayback, hasHistory }) {
  return (
    <div style={{ 
      padding: '10px 20px', 
      background: '#fff', 
      borderBottom: '1px solid #eee',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      borderRadius: '8px 8px 0 0',
      boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
    }}>
      <div style={{ display: 'flex', gap: '8px', borderRight: '1px solid #eee', paddingRight: '15px' }}>
        <button style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ddd', background: '#f8f9fa', cursor: 'pointer' }}>Brush</button>
        <button style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>Eraser</button>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button 
          onClick={onClear}
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
        >
          Clear Board
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
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {isPlayback ? 'Playing...' : '▶ Playback History'}
        </button>
      </div>

      {!hasHistory && !isPlayback && (
        <span style={{ fontSize: '0.8rem', color: '#999', fontStyle: 'italic' }}>
          Draw something to enable playback
        </span>
      )}
    </div>
  );
}
