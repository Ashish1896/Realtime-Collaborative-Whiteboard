'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import Toolbar from "../../components/toolbar";

export default function Board() {
  const [userName, setUserName] = useState('');
  const [socket, setSocket] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedName = localStorage.getItem('guestName');
    if (!storedName) {
      router.push('/');
      return;
    }
    setUserName(storedName);

    // Initialize socket connection
    const s = io('http://localhost:3001');
    setSocket(s);

    s.on('connect', () => {
      console.log('Connected to socket server');
      s.emit('set-username', storedName);
    });

    return () => {
      s.disconnect();
    };
  }, [router]);

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
          <button 
            onClick={handleLogout}
            style={{ padding: '6px 12px', fontSize: '0.85rem', cursor: 'pointer', borderRadius: '6px', border: '1px solid #ddd', background: '#fff' }}
          >
            Logout
          </button>
        </div>
      </header>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <main style={{ flex: 1 }}>
          <Toolbar />
          <div style={{ 
            marginTop: '20px', 
            border: '2px solid #eee', 
            borderRadius: '12px',
            height: '600px', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            background: '#fafafa',
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)'
          }}>
            <p style={{ color: '#999', fontSize: '1.1rem' }}>Canvas ready for drawing.</p>
            <p style={{ fontSize: '0.85rem', color: '#bbb', marginTop: '10px' }}>Your strokes will be synced in real-time as {userName}.</p>
          </div>
        </main>
        
        <aside style={{ width: '260px', border: '1px solid #f0f0f0', borderRadius: '12px', padding: '20px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '1rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' }}>Presence List</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.95rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28a745', boxShadow: '0 0 5px rgba(40,167,69,0.5)' }}></span>
              <strong>{userName}</strong> <span style={{ color: '#999', fontSize: '0.8rem' }}>(You)</span>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
