import { useEffect, useRef, useState, useCallback } from 'react';
import RoomManager from '../utils/RoomManager';

/**
 * Custom React Hook for room management
 * Handles room creation, joining, and drawing persistence
 * 
 * @param {string} baseUrl - API base URL
 * @returns {Object} - Room management interface
 */
const useRoom = (baseUrl = 'http://localhost:3001') => {
  const roomManagerRef = useRef(null);
  const [roomId, setRoomId] = useState(null);
  const [room, setRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [drawings, setDrawings] = useState([]);

  // Initialize RoomManager on mount
  useEffect(() => {
    if (!roomManagerRef.current) {
      roomManagerRef.current = new RoomManager(baseUrl);
    }
  }, [baseUrl]);

  // Create a new room
  const createRoom = useCallback(async (roomName) => {
    setLoading(true);
    setError(null);
    try {
      const newRoom = await roomManagerRef.current.createRoom(roomName);
      setRoom(newRoom);
      setRoomId(newRoom.id);
      return newRoom;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Join an existing room
  const joinRoom = useCallback(async (newRoomId) => {
    setLoading(true);
    setError(null);
    try {
      const joinedRoom = await roomManagerRef.current.joinRoom(newRoomId);
      setRoom(joinedRoom);
      setRoomId(newRoomId);
      
      // Load existing drawings for the room
      const roomDrawings = await roomManagerRef.current.loadDrawings(newRoomId);
      setDrawings(roomDrawings);
      
      return joinedRoom;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all available rooms
  const fetchAllRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allRooms = await roomManagerRef.current.getAllRooms();
      setRooms(allRooms);
      return allRooms;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Save drawing to room
  const saveDrawing = useCallback(async (drawingData) => {
    if (!roomId) {
      setError('No room selected');
      return false;
    }
    try {
      const success = await roomManagerRef.current.saveDrawings(roomId, [
        ...drawings,
        drawingData
      ]);
      if (success) {
        setDrawings(prev => [...prev, drawingData]);
      }
      return success;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [roomId, drawings]);

  // Get current room stats
  const getRoomStats = useCallback(() => {
    return roomManagerRef.current?.getRoomStats();
  }, []);

  // Generate random room ID
  const generateRoomId = useCallback(() => {
    return roomManagerRef.current?.generateRoomId();
  }, []);

  // Leave current room
  const leaveRoom = useCallback(() => {
    roomManagerRef.current?.leaveRoom();
    setRoomId(null);
    setRoom(null);
    setDrawings([]);
  }, []);

  // Validate room ID
  const isValidRoomId = useCallback((id) => {
    return roomManagerRef.current?.isValidRoomId(id);
  }, []);

  return {
    // State
    roomId,
    room,
    rooms,
    drawings,
    loading,
    error,

    // Methods
    createRoom,
    joinRoom,
    leaveRoom,
    fetchAllRooms,
    saveDrawing,
    getRoomStats,
    generateRoomId,
    isValidRoomId,

    // Direct access for advanced usage
    manager: roomManagerRef.current
  };
};

export default useRoom;
