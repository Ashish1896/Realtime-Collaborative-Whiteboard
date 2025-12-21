import { Server } from "socket.io";

let io;

export function GET() {
  if (!io) {
    io = new Server(3001, {
      cors: {
        origin: "*",
      }
    });

    io.on("connection", socket => {
      console.log("User connected:", socket.id);

      // Handle username registration
      socket.on("set-username", (username) => {
        socket.data.username = username;
        console.log(`User ${socket.id} identified as: ${username}`);
        
        // Notify others about the new participant
        socket.broadcast.emit("user-joined", { 
          id: socket.id, 
          username: username 
        });
      });

      // Handle drawing events with identity metadata
      socket.on("draw", (data) => {
        socket.broadcast.emit("draw", { 
          ...data, 
          username: socket.data.username || 'Guest' 
        });
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        io.emit("user-left", socket.id);
      });
    });
    
    console.log("Socket.io server initialized on port 3001");
  }

  return new Response("Socket server is active", { 
    status: 200,
    headers: { 'Content-Type': 'text/plain' }
  });
}
