import { useEffect, useRef, useState, useCallback } from 'react';
import { CommandHistory } from '../utils/CommandHistory';

/**
 * Custom React Hook for Undo/Redo functionality
 * Integrates CommandHistory with canvas drawing
 * 
 * @param {HTMLCanvasElement} canvasRef - Reference to canvas element
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {number} maxHistorySize - Maximum commands to store (default: 50)
 * @returns {Object} - Returns object with undo/redo methods and states
 */
const useUndoRedo = (canvasRef, ctx, maxHistorySize = 50) => {
  const historyRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [historySize, setHistorySize] = useState({ undo: 0, redo: 0, total: 0 });

  // Initialize CommandHistory on mount
  useEffect(() => {
    if (canvasRef?.current && ctx) {
      historyRef.current = new CommandHistory(ctx, canvasRef.current, maxHistorySize);
    }

    return () => {
      if (historyRef.current) {
        historyRef.current.clearHistory();
      }
    };
  }, [canvasRef, ctx, maxHistorySize]);

  // Update undo/redo states
  const updateStates = useCallback(() => {
    if (!historyRef.current) return;

    setCanUndo(historyRef.current.canUndo());
    setCanRedo(historyRef.current.canRedo());
    setHistorySize(historyRef.current.getHistorySize());
  }, []);

  // Record a draw action
  const recordDraw = useCallback((drawData) => {
    if (!historyRef.current) return;
    
    historyRef.current.recordDraw(drawData);
    updateStates();
  }, [updateStates]);

  // Record a clear action
  const recordClear = useCallback(() => {
    if (!historyRef.current) return;
    
    historyRef.current.recordClear();
    updateStates();
  }, [updateStates]);

  // Execute undo
  const undo = useCallback(() => {
    if (!historyRef.current) return;
    
    const success = historyRef.current.undo();
    updateStates();
    return success;
  }, [updateStates]);

  // Execute redo
  const redo = useCallback(() => {
    if (!historyRef.current) return;
    
    const success = historyRef.current.redo();
    updateStates();
    return success;
  }, [updateStates]);

  // Clear all history
  const clearHistory = useCallback(() => {
    if (!historyRef.current) return;
    
    historyRef.current.clearHistory();
    updateStates();
  }, [updateStates]);

  // Keyboard shortcuts (Ctrl+Z for undo, Ctrl+Y for redo)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return {
    // State
    canUndo,
    canRedo,
    historySize,

    // Methods
    recordDraw,
    recordClear,
    undo,
    redo,
    clearHistory,
    
    // Direct access to history for advanced usage
    history: historyRef.current
  };
};

export default useUndoRedo;
