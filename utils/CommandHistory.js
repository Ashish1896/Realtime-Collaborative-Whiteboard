/**
 * CommandHistory - Manages Undo/Redo functionality with stack-based command pattern
 * Designed for collaborative whiteboard drawing application
 */

class Command {
  /**
   * Base Command class that all drawing commands extend
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Object} data - Command data (drawing point or action)
   */
  constructor(ctx, data) {
    this.ctx = ctx;
    this.data = data;
  }

  execute() {
    throw new Error('execute() must be implemented in subclass');
  }

  undo() {
    throw new Error('undo() must be implemented in subclass');
  }
}

class DrawCommand extends Command {
  /**
   * Represents a single draw action (stroke segment)
   */
  constructor(ctx, data, canvas) {
    super(ctx, data);
    this.canvas = canvas;
    this.previousImageData = null;
  }

  execute() {
    // Save canvas state before drawing
    this.previousImageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    // Draw the command
    if (this.data.type === 'start') {
      this.ctx.beginPath();
      this.ctx.moveTo(this.data.x, this.data.y);
    } else if (this.data.type === 'move') {
      this.ctx.lineTo(this.data.x, this.data.y);
      this.ctx.stroke();
    }
  }

  undo() {
    // Restore previous canvas state
    if (this.previousImageData) {
      this.ctx.putImageData(this.previousImageData, 0, 0);
    }
  }
}

class ClearCommand extends Command {
  /**
   * Represents clearing the entire canvas
   */
  constructor(ctx, canvas) {
    super(ctx, null);
    this.canvas = canvas;
    this.previousImageData = null;
  }

  execute() {
    // Save canvas state before clearing
    this.previousImageData = this.ctx.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  undo() {
    // Restore canvas to state before clear
    if (this.previousImageData) {
      this.ctx.putImageData(this.previousImageData, 0, 0);
    }
  }
}

class CommandHistory {
  /**
   * Main CommandHistory class that manages undo/redo stacks
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {HTMLCanvasElement} canvas - Canvas element
   * @param {number} maxHistorySize - Maximum commands to keep (default: 50)
   */
  constructor(ctx, canvas, maxHistorySize = 50) {
    this.ctx = ctx;
    this.canvas = canvas;
    this.maxHistorySize = maxHistorySize;
    this.undoStack = [];
    this.redoStack = [];
    this.isExecuting = false;
  }

  /**
   * Execute a command and add to undo stack
   * @param {Command} command - Command to execute
   */
  execute(command) {
    if (this.isExecuting) return; // Prevent recursive calls

    this.isExecuting = true;
    
    // Execute the command
    command.execute();
    
    // Add to undo stack
    this.undoStack.push(command);
    
    // Clear redo stack (new action breaks redo chain)
    this.redoStack = [];
    
    // Maintain max history size
    if (this.undoStack.length > this.maxHistorySize) {
      this.undoStack.shift();
    }
    
    this.isExecuting = false;
  }

  /**
   * Record a draw action
   * @param {Object} drawData - Draw data with x, y, type, timestamp
   */
  recordDraw(drawData) {
    const command = new DrawCommand(this.ctx, drawData, this.canvas);
    this.execute(command);
  }

  /**
   * Record a clear action
   */
  recordClear() {
    const command = new ClearCommand(this.ctx, this.canvas);
    this.execute(command);
  }

  /**
   * Undo the last command
   * @returns {boolean} - True if undo was successful
   */
  undo() {
    if (this.undoStack.length === 0) {
      console.warn('Nothing to undo');
      return false;
    }

    this.isExecuting = true;
    
    const command = this.undoStack.pop();
    command.undo();
    this.redoStack.push(command);
    
    this.isExecuting = false;
    return true;
  }

  /**
   * Redo the last undone command
   * @returns {boolean} - True if redo was successful
   */
  redo() {
    if (this.redoStack.length === 0) {
      console.warn('Nothing to redo');
      return false;
    }

    this.isExecuting = true;
    
    const command = this.redoStack.pop();
    command.execute();
    this.undoStack.push(command);
    
    this.isExecuting = false;
    return true;
  }

  /**
   * Check if undo is available
   */
  canUndo() {
    return this.undoStack.length > 0;
  }

  /**
   * Check if redo is available
   */
  canRedo() {
    return this.redoStack.length > 0;
  }

  /**
   * Get current history size
   */
  getHistorySize() {
    return {
      undo: this.undoStack.length,
      redo: this.redoStack.length,
      total: this.undoStack.length + this.redoStack.length
    };
  }

  /**
   * Clear entire history
   */
  clearHistory() {
    this.undoStack = [];
    this.redoStack = [];
  }

  /**
   * Serialize history for localStorage persistence
   */
  getSerializedHistory() {
    return JSON.stringify({
      undoStack: this.undoStack.map(cmd => cmd.data),
      redoStack: this.redoStack.map(cmd => cmd.data),
      timestamp: Date.now()
    });
  }

  /**
   * Restore history from serialized data
   */
  restoreFromSerialized(serializedData) {
    try {
      const data = JSON.parse(serializedData);
      // Note: Full restoration would require replaying drawing commands
      // For now, clear and indicate need to reload
      this.clearHistory();
      return true;
    } catch (error) {
      console.error('Failed to restore history:', error);
      return false;
    }
  }
}

export { CommandHistory, Command, DrawCommand, ClearCommand };
