const { Server } = require("socket.io");
const { resetGame, getAllPlayers } = require("../db/players.db");

let io;

const initSocketInstance = (httpServer) => {
  io = new Server(httpServer, {
    path: "/real-time",
    cors: {
      origin: "*",
    },
  });

  // Manejar conexiones de clientes
  io.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

    const newPlayer = { id: socket.id, nickname: `Jugador ${socket.id}`, score: 0, role: "polo" };
    io.emit("user-connected", newPlayer);

    // Evento: actualización de puntajes
    socket.on("updateScores", (data) => {
      console.log("Evento recibido: updateScores", data);
      if (Array.isArray(data)) {
        io.emit("updateScores", data);
      } else {
        console.error("Datos inválidos recibidos en updateScores:", data);
      }
    });

    // Evento: reiniciar el juego
    socket.on("reset-game", () => {
      console.log("Evento recibido: reset-game");
      resetGame(); // <-- Limpia los jugadores del servidor
      io.emit("updateScores", getAllPlayers()); // <-- Envia lista vacía a todos
    });

    // Evento: desconexión
    socket.on("disconnect", () => {
      console.log(`Cliente desconectado: ${socket.id}`);
      io.emit("user-disconnected", socket.id);
    });
  });
};

// Registrar eventos específicos para results-screen
const registerResultsScreenEvents = (socket) => {
  socket.on("updateScores", (data) => {
    console.log("Evento recibido: updateScores", data);

    if (Array.isArray(data)) {
      io.emit("updateScores", data);
    } else {
      console.error("Datos inválidos recibidos en updateScores:", data);
    }
  });

  socket.on("next-screen", (data) => {
    console.log("Evento recibido: next-screen", data);
    emitEvent("next-screen", data);
  });
};

const emitToSpecificClient = (socketId, eventName, data) => {
  if (!io) {
    throw new Error("Socket.io instance is not initialized");
  }
  io.to(socketId).emit(eventName, data);
};

const emitEvent = (eventName, data) => {
  if (!io) {
    throw new Error("Socket.io instance is not initialized");
  }
  io.emit(eventName, data);
};

module.exports = {
  emitEvent,
  initSocketInstance,
  emitToSpecificClient,
};
