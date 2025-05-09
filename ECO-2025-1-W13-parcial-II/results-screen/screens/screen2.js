import { navigateTo, socket } from "../app.js";

export default function renderScreen2(initialData = []) {
  if (!Array.isArray(initialData)) {
    console.error("initialData no es un array válido:", initialData);
    initialData = []; // Inicializar como un array vacío
  }

  const app = document.getElementById("app");

  // Establece el contenido HTML
  app.innerHTML = `
    <h1>Pantalla de Ganador</h1>
    <h2 id="winner-message"></h2>
    <ul id="final-score-list"></ul>
    <button id="sort-alphabetically">Ordenar Alfabéticamente</button>
    <button id="reset-game">Reiniciar Juego</button>
    <button id="go-to-main-menu">Ir al Menú Principal</button>
  `;

  // Selecciona los elementos del DOM después de que se haya actualizado el HTML
  const finalScoreList = document.getElementById("final-score-list");
  const winnerMessage = document.getElementById("winner-message");
  const sortButton = document.getElementById("sort-alphabetically");
  const resetButton = document.getElementById("reset-game");
  const mainMenuButton = document.getElementById("go-to-main-menu");

  // Declara `players` como una variable local
  let players = [...initialData];

  // Actualiza la UI con la lista de jugadores ordenada por puntaje
  function updatePlayerListByScore(playersData) {
    players = [...playersData];
    players.sort((a, b) => b.score - a.score);
    renderPlayerList(players);
  }

  // Renderiza la lista de jugadores
  function renderPlayerList(playerList) {
    finalScoreList.innerHTML = "";
    playerList.forEach((player, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${player.nickname} (${player.score} pts)`;
      finalScoreList.appendChild(li);
    });

    const winner = playerList.find((p) => p.score >= 100);
    winnerMessage.textContent = winner
      ? `¡Ganador: ${winner.nickname} con ${winner.score} puntos! 🎉`
      : "Aún no hay un ganador.";
  }

  // Render inicial si ya hay datos
  if (initialData.length > 0) {
    updatePlayerListByScore(initialData);
  }

  // Agrega funcionalidad al botón de ordenar alfabéticamente
  if (sortButton) {
    sortButton.addEventListener("click", () => {
      players.sort((a, b) => a.nickname.localeCompare(b.nickname));
      renderPlayerList(players);
    });
  }

  // Agrega funcionalidad al botón de reiniciar juego
  if (resetButton) {
    resetButton.addEventListener("click", async () => {
      const result = await makeRequest("/api/game/reset", "POST");
      if (result.success) {
        players = [];
        renderPlayerList(players);
        winnerMessage.textContent = "El juego ha sido reiniciado.";
      } else {
        alert("Error al reiniciar el juego: " + result.error);
      }
    });
  }

  // Agrega funcionalidad al botón de ir al menú principal
  if (mainMenuButton) {
    mainMenuButton.addEventListener("click", () => {
      navigateTo("/screen1");
    });
  }

  // Escucha el evento "updateScores" del socket
  socket.on("updateScores", (players) => {
    console.log("Evento recibido: updateScores", players);

    if (!Array.isArray(players)) {
      console.error("Los datos recibidos no son un array:", players);
      return;
    }

    // Actualizar la lista de jugadores con las puntuaciones actualizadas
    updatePlayerListByScore(players);
  });

  // Escucha el evento "user-connected" del socket
  socket.on("user-connected", (newPlayer) => {
    console.log("Nuevo usuario conectado:", newPlayer);

    if (!Array.isArray(players)) {
      players = [];
    }

    // Agregar el nuevo jugador a la lista y actualizar la pantalla
    players.push(newPlayer);
    updatePlayerListByScore(players);
  });
}
