/**
 * ViewportManager - Handles Canvas zooming and panning transformations
 * Manages Canvas 2D transform matrix for viewport control
 */

class ViewportManager {
  /**
   * Initialize ViewportManager
   * @param {HTMLCanvasElement} canvas - Canvas element
   * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
   */
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    
    // Viewport state
    this.offsetX = 0;
    this.offsetY = 0;
    this.scale = 1;
    this.minScale = 0.1;  // Min zoom 10%
    this.maxScale = 5;    // Max zoom 500%
    this.zoomStep = 0.1;  // Zoom increment
    
    // Pan state
    this.isPanning = false;
    this.panStartX = 0;
    this.panStartY = 0;
    this.panStartOffsetX = 0;
    this.panStartOffsetY = 0;
  }

  /**
   * Apply viewport transform to canvas context
   */
  applyTransform() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.translate(this.offsetX, this.offsetY);
    this.ctx.scale(this.scale, this.scale);
  }

  /**
   * Reset viewport to default (1:1, no pan)
   */
  reset() {
    this.offsetX = 0;
    this.offsetY = 0;
    this.scale = 1;
    this.applyTransform();
  }

  /**
   * Zoom in/out to specific level
   * @param {number} newScale - Target zoom scale
   * @param {number} centerX - Center X for zoom (canvas coords)
   * @param {number} centerY - Center Y for zoom (canvas coords)
   */
  zoomTo(newScale, centerX = null, centerY = null) {
    // Clamp scale to min/max
    const clampedScale = Math.max(this.minScale, Math.min(this.maxScale, newScale));
    
    if (clampedScale === this.scale) return;

    // If no center provided, zoom to canvas center
    if (centerX === null) centerX = this.canvas.width / 2;
    if (centerY === null) centerY = this.canvas.height / 2;

    // Calculate zoom factor
    const zoomFactor = clampedScale / this.scale;

    // Adjust pan to keep zoom center point fixed
    this.offsetX = centerX - (centerX - this.offsetX) * zoomFactor;
    this.offsetY = centerY - (centerY - this.offsetY) * zoomFactor;
    this.scale = clampedScale;
    
    this.applyTransform();
  }

  /**
   * Zoom in by one step
   * @param {number} x - Mouse X (canvas coords)
   * @param {number} y - Mouse Y (canvas coords)
   */
  zoomIn(x, y) {
    this.zoomTo(this.scale + this.zoomStep, x, y);
  }

  /**
   * Zoom out by one step
   * @param {number} x - Mouse X (canvas coords)
   * @param {number} y - Mouse Y (canvas coords)
   */
  zoomOut(x, y) {
    this.zoomTo(this.scale - this.zoomStep, x, y);
  }

  /**
   * Zoom with mouse wheel
   * @param {WheelEvent} event - Wheel event
   * @returns {boolean} - Whether zoom was applied
   */
  handleMouseWheel(event) {
    event.preventDefault();
    
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Negative deltaY = scroll up = zoom in
    if (event.deltaY < 0) {
      this.zoomIn(x, y);
    } else {
      this.zoomOut(x, y);
    }
    
    return true;
  }

  /**
   * Start panning
   * @param {number} x - Mouse X
   * @param {number} y - Mouse Y
   */
  startPan(x, y) {
    this.isPanning = true;
    this.panStartX = x;
    this.panStartY = y;
    this.panStartOffsetX = this.offsetX;
    this.panStartOffsetY = this.offsetY;
  }

  /**
   * Update pan during drag
   * @param {number} x - Current mouse X
   * @param {number} y - Current mouse Y
   */
  updatePan(x, y) {
    if (!this.isPanning) return;
    
    const deltaX = x - this.panStartX;
    const deltaY = y - this.panStartY;
    
    this.offsetX = this.panStartOffsetX + deltaX;
    this.offsetY = this.panStartOffsetY + deltaY;
    
    this.applyTransform();
  }

  /**
   * End panning
   */
  endPan() {
    this.isPanning = false;
  }

  /**
   * Convert screen coordinates to world coordinates
   * @param {number} screenX - Screen X
   * @param {number} screenY - Screen Y
   * @returns {Object} - {x, y} world coordinates
   */
  screenToWorld(screenX, screenY) {
    return {
      x: (screenX - this.offsetX) / this.scale,
      y: (screenY - this.offsetY) / this.scale
    };
  }

  /**
   * Convert world coordinates to screen coordinates
   * @param {number} worldX - World X
   * @param {number} worldY - World Y
   * @returns {Object} - {x, y} screen coordinates
   */
  worldToScreen(worldX, worldY) {
    return {
      x: worldX * this.scale + this.offsetX,
      y: worldY * this.scale + this.offsetY
    };
  }

  /**
   * Get current viewport state
   * @returns {Object} - Viewport info
   */
  getState() {
    return {
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      scale: this.scale,
      isPanning: this.isPanning
    };
  }

  /**
   * Set viewport state
   * @param {Object} state - State object
   */
  setState(state) {
    if (state.offsetX !== undefined) this.offsetX = state.offsetX;
    if (state.offsetY !== undefined) this.offsetY = state.offsetY;
    if (state.scale !== undefined) this.scale = Math.max(this.minScale, Math.min(this.maxScale, state.scale));
    this.applyTransform();
  }

  /**
   * Fit canvas to viewport
   * @param {number} contentWidth - Content width
   * @param {number} contentHeight - Content height
   * @param {number} padding - Padding around content (default: 20)
   */
  fitToView(contentWidth, contentHeight, padding = 20) {
    const availWidth = this.canvas.width - (padding * 2);
    const availHeight = this.canvas.height - (padding * 2);
    
    const scaleX = availWidth / contentWidth;
    const scaleY = availHeight / contentHeight;
    const newScale = Math.min(scaleX, scaleY, this.maxScale);
    
    this.offsetX = (this.canvas.width - contentWidth * newScale) / 2;
    this.offsetY = (this.canvas.height - contentHeight * newScale) / 2;
    this.scale = newScale;
    
    this.applyTransform();
  }
}

export default ViewportManager;
