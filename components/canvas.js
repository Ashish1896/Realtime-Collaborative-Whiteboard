'use client';

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { io } from 'socket.io-client';

const Canvas = forwardRef(({ isPlaybackMode = false, playbackData = [], onRecordingUpdate }, ref) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [recordedHistory, setRecordedHistory] = useState([]);
  const socketRef = useRef(null);
  const startTimeRef = useRef(null);

  useImperativeHandle(ref, () => ({
    clear: () => {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setRecordedHistory([]);
      startTimeRef.current = Date.now();
    },
    getHistory: () => recordedHistory
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Responsive size
    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
      ctx.lineCap = 'round';
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#333';
    };
    
    window.addEventListener('resize', resize);
    resize();
    startTimeRef.current = Date.now();

    socketRef.current = io('http://localhost:3001');
    socketRef.current.on('draw', (data) => {
      if (!isPlaybackMode) drawFromData(data);
    });

    return () => {
      window.removeEventListener('resize', resize);
      socketRef.current.disconnect();
    };
  }, [isPlaybackMode]);

  const drawFromData = (data) => {
    const ctx = canvasRef.current.getContext('2d');
    if (data.type === 'start') {
      ctx.beginPath();
      ctx.moveTo(data.x, data.y);
    } else if (data.type === 'move') {
      ctx.lineTo(data.x, data.y);
      ctx.stroke();
    }
  };

  const startDrawing = (e) => {
    if (isPlaybackMode) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(true);
    const point = { x, y, type: 'start', timestamp: Date.now() - startTimeRef.current };
    
    setRecordedHistory(prev => {
      const newHistory = [...prev, point];
      if (onRecordingUpdate) onRecordingUpdate(newHistory);
      return newHistory;
    });
    
    drawFromData(point);
    socketRef.current.emit('draw', point);
  };

  const draw = (e) => {
    if (!isDrawing || isPlaybackMode) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const point = { x, y, type: 'move', timestamp: Date.now() - startTimeRef.current };
    
    setRecordedHistory(prev => {
      const newHistory = [...prev, point];
      if (onRecordingUpdate) onRecordingUpdate(newHistory);
      return newHistory;
    });
    
    drawFromData(point);
    socketRef.current.emit('draw', point);
  };

  const stopDrawing = () => setIsDrawing(false);

  // Replay logic
  useEffect(() => {
    if (isPlaybackMode && playbackData.length > 0) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      let i = 0;
      const startTime = Date.now();
      
      const animate = () => {
        if (!isPlaybackMode) return;
        const elapsed = Date.now() - startTime;
        
        while (i < playbackData.length && playbackData[i].timestamp <= elapsed) {
          drawFromData(playbackData[i]);
          i++;
        }
        
        if (i < playbackData.length) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isPlaybackMode, playbackData]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseOut={stopDrawing}
      style={{ display: 'block', width: '100%', height: '100%', background: '#fff', touchAction: 'none' }}
    />
  );
});

Canvas.displayName = 'Canvas';
export default Canvas;
