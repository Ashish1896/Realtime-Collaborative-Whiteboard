'use client';

import React, { useRef, useState, useEffect } from 'react';

const ImageLayer = ({ image, onUpdate, onRemove, canvasSize }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const containerRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });
  const startState = useRef({});

  if (!image || !image.src) return null;

  // Calculate bounding box for dragging and resizing
  const bounds = {
    left: image.x || 50,
    top: image.y || 50,
    width: (image.width || 200) * (image.scale || 1),
    height: (image.height || 200) * (image.scale || 1),
  };

  const handleResizeStart = (e, handle) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeHandle(handle);
    startPos.current = { x: e.clientX, y: e.clientY };
    startState.current = { ...bounds };
  };

  const handleDragStart = (e) => {
    if (isResizing) return;
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    startState.current = { x: bounds.left, y: bounds.top };
  };

  const handleMouseMove = (e) => {
    if (!isDragging && !isResizing) return;

    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;

    if (isDragging) {
      onUpdate({
        x: startState.current.x + deltaX,
        y: startState.current.y + deltaY,
      });
    } else if (isResizing) {
      let newWidth = startState.current.width;
      let newHeight = startState.current.height;
      let newX = startState.current.left;
      let newY = startState.current.top;

      switch (resizeHandle) {
        case 'se': // South-East
          newWidth = Math.max(50, startState.current.width + deltaX);
          newHeight = Math.max(50, startState.current.height + deltaY);
          break;
        case 'sw': // South-West
          newWidth = Math.max(50, startState.current.width - deltaX);
          newHeight = Math.max(50, startState.current.height + deltaY);
          newX = startState.current.left + deltaX;
          break;
        case 'ne': // North-East
          newWidth = Math.max(50, startState.current.width + deltaX);
          newHeight = Math.max(50, startState.current.height - deltaY);
          newY = startState.current.top + deltaY;
          break;
        case 'nw': // North-West
          newWidth = Math.max(50, startState.current.width - deltaX);
          newHeight = Math.max(50, startState.current.height - deltaY);
          newX = startState.current.left + deltaX;
          newY = startState.current.top + deltaY;
          break;
      }

      const scale = newWidth / (image.width || 200);
      onUpdate({
        x: newX,
        y: newY,
        scale: Math.max(0.1, scale),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, resizeHandle]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleDragStart}
      style={{
        position: 'absolute',
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
        cursor: isDragging ? 'grabbing' : 'grab',
        border: '2px solid #4a90e2',
        borderRadius: '4px',
        overflow: 'hidden',
        zIndex: 10,
      }}
    >
      <img
        src={image.src}
        alt="Imported"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />
      {/* Resize handles */}
      {['nw', 'ne', 'sw', 'se'].map((handle) => (
        <div
          key={handle}
          onMouseDown={(e) => handleResizeStart(e, handle)}
          style={{
            position: 'absolute',
            width: '10px',
            height: '10px',
            backgroundColor: '#4a90e2',
            cursor: handle === 'nw' || handle === 'se' ? 'nwse-resize' : 'nesw-resize',
            ...(handle === 'nw' && { top: '-5px', left: '-5px' }),
            ...(handle === 'ne' && { top: '-5px', right: '-5px' }),
            ...(handle === 'sw' && { bottom: '-5px', left: '-5px' }),
            ...(handle === 'se' && { bottom: '-5px', right: '-5px' }),
          }}
        />
      ))}
      {/* Remove button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          backgroundColor: '#e74c3c',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '4px 8px',
          fontSize: '12px',
          cursor: 'pointer',
          zIndex: 11,
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default ImageLayer;
