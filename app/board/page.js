'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Toolbar from "../../components/toolbar";
import Canvas from "../../components/canvas";

export default function Board() {
  const [userName, setUserName] = useState('');
  const [isPlayback, setIsPlayback] = useState(false);
  const [recordedData, setRecordedData] = useState([]);
  const canvasRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const storedName = localStorage.getItem('guestName');
    if (!storedName) {
      router.push('/');
      return;
    }
    setUserName(storedName);
  }, [router]);

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
      setRecordedData([]);
    }
  };

  const handleReplay = () => {
    if (recordedData.length === 0) return;
    setIsPlayback(true);
    
    // Auto-exit playback after last point's timestamp + buffer
    const duration = recordedData[recordedData.length - 1].timestamp;
    setTimeout(() => {
      setIsPlayback(false);
    }, duration + 500);
  };

  const handleLogout = () => {
    localStorage.removeItem('guestName');
    router.push('/');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif', maxWidth: '1200px', margin: '0 auto', color: '#333' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Collaborative Whiteboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ background: '#e7f3ff', padding: '6px 12px', borderRadius: '20px', fontSize: '0.9rem' }}>
            Connected as: <strong style={{ color: '#007bff' }}>{userName}</strong>
          </div>
          <button onClick={handleLogout} style={{ padding: '6px 12px', fontSize: '0.85rem', cursor: 'pointer', borderRadius: '6px', border: '1px solid #ddd', background: '#fff' }}>Logout</button>
        </div>
      </header>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Toolbar 
            onClear={handleClear} 
            onReplay={handleReplay} 
            isPlayback={isPlayback} 
            hasHistory={recordedData.length > 0} 
          />
          <div style={{ 
            border: '2px solid #eee', 
            borderRadius: '0 0 12px 12px',
            height: '600px', 
            position: 'relative',
            overflow: 'hidden',
            background: '#fafafa',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <Canvas 
              ref={canvasRef}
              isPlaybackMode={isPlayback}
              playbackData={recordedData}
              onRecordingUpdate={setRecordedData}
            />
            
            {isPlayback && (
              <div style={{ 
                position: 'absolute', 
                top: '10px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                pointerEvents: 'none',
                zIndex: 10
              }}>
                Replaying History...
              </div>
            )}
          </div>
        </main>
        
        <aside style={{ width: '260px', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '20px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '1rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>Stats</h3>
          <div style={{ fontSize: '0.9rem', color: '#666' }}>
            <p>Strokes recorded: <strong>{recordedData.filter(p => p.type === 'start').length}</strong></p>
            <p>Total data points: <strong>{recordedData.length}</strong></p>
          </div>
          
          <h3 style={{ marginTop: '25px', marginBottom: '15px', fontSize: '1rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>Presence</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.95rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28a745' }}></span>
              <strong>{userName}</strong> <span style={{ color: '#999', fontSize: '0.8rem' }}>(You)</span>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
