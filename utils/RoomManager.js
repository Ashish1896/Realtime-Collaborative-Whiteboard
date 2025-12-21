/**
 * RoomManager - Handles multiple room/whiteboard management
 * Supports creating, joining, and managing separate drawing spaces
 */

class RoomManager {
  /**
   * Initialize RoomManager
   * @param {string} baseUrl - Base server URL (e.g., http://localhost:3001)
   */
  constructor(baseUrl = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
    this.rooms = new Map(); // Cache of room data
    this.currentRoomId = null;
    this.socket = null;
  }

  /**
   * Create a new room
   * @param {string} roomName - Name of the room
   * @returns {Promise<Object>} - Created room data
   */
  async createRoom(roomName) {
    try {
      const response = await fetch(`${this.baseUrl}/api/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: roomName })
      });
      const data = await response.json();
      if (data.room) {
        this.rooms.set(data.room.id, data.room);
        return data.room;
      }
      throw new Error('Failed to create room');
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  /**
   * Join an existing room
   * @param {string} roomId - Room ID to join
   * @returns {Promise<Object>} - Room data
   */
  async joinRoom(roomId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/rooms/${roomId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.room) {
        this.rooms.set(roomId, data.room);
        this.currentRoomId = roomId;
        return data.room;
      }
      throw new Error('Room not found');
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  }

  /**
   * Get all available rooms
   * @returns {Promise<Array>} - List of all rooms
   */
  async getAllRooms() {
    try {
      const response = await fetch(`${this.baseUrl}/api/rooms`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.rooms) {
        data.rooms.forEach(room => this.rooms.set(room.id, room));
        return data.rooms;
      }
      return [];
    } catch (error) {
      console.error('Error fetching rooms:', error);
      return [];
    }
  }

  /**
   * Get current room data
   * @returns {Object} - Current room or null
   */
  getCurrentRoom() {
    if (!this.currentRoomId) return null;
    return this.rooms.get(this.currentRoomId);
  }

  /**
   * Join socket.io room namespace
   * @param {Object} socket - Socket.io instance
   * @param {string} roomId - Room ID to join
   */
  connectToRoom(socket, roomId) {
    this.socket = socket;
    this.currentRoomId = roomId;
    // Join room-specific namespace
    if (socket.disconnect) socket.disconnect();
    this.socket = new (require('socket.io-client'))(
      `${this.baseUrl}/rooms/${roomId}`
    );
    return this.socket;
  }

  /**
   * Leave current room
   */
  leaveRoom() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.currentRoomId = null;
  }

  /**
   * Get room statistics
   * @returns {Object} - Room stats (users, drawing count, etc)
   */
  getRoomStats() {
    const room = this.getCurrentRoom();
    if (!room) return null;
    return {
      id: room.id,
      name: room.name,
      createdAt: room.createdAt,
      activeUsers: room.activeUsers || 0,
      drawingCount: room.drawings ? room.drawings.length : 0
    };
  }

  /**
   * Validate room ID format
   * @param {string} roomId - Room ID to validate
   * @returns {boolean} - True if valid
   */
  isValidRoomId(roomId) {
    // Room ID should be alphanumeric and 3-50 chars
    return /^[a-zA-Z0-9-_]{3,50}$/.test(roomId);
  }

  /**
   * Generate random room ID
   * @returns {string} - Generated room ID
   */
  generateRoomId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Save room drawing history
   * @param {string} roomId - Room ID
   * @param {Array} drawings - Drawing data
   * @returns {Promise<boolean>} - Success status
   */
  async saveDrawings(roomId, drawings) {
    try {
      const response = await fetch(`${this.baseUrl}/api/rooms/${roomId}/drawings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drawings })
      });
      return response.ok;
    } catch (error) {
      console.error('Error saving drawings:', error);
      return false;
    }
  }

  /**
   * Load room drawing history
   * @param {string} roomId - Room ID
   * @returns {Promise<Array>} - Drawing data
   */
  async loadDrawings(roomId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/rooms/${roomId}/drawings`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      return data.drawings || [];
    } catch (error) {
      console.error('Error loading drawings:', error);
      return [];
    }
  }
}

export default RoomManager;
