import { navigateTo, socket } from "../app.js";

export default function renderScreen1() {
  const app = document.getElementById("app");

  // Renderizar el contenido de la pantalla
  app.innerHTML = `
      <div id="screen1">
        <h2>Pantalla 1</h2>
        <p>Bienvenido a la pantalla 1</p>
        <button id="go-to-screen2">Ir a Pantalla 2</button>
      </div>
  `;

  const goToScreen2Button = document.getElementById("go-to-screen2");

  // Navegar a screen2 al hacer clic en el botón
  if (goToScreen2Button) {
    goToScreen2Button.addEventListener("click", () => {
      navigateTo("/screen2", { players: [] }); // Asegúrate de enviar un array vacío si no hay datos
    });
  }

  // Escuchar el evento de socket para navegar a screen2
  socket.off("next-screen"); // Limpiar cualquier listener previo
  socket.on("next-screen", (data) => {
    console.log("Evento recibido: next-screen", data);
    if (!data || !data.players) {
      console.error("Datos insuficientes para navegar a la pantalla.");
      return;
    }
    navigateTo("/screen2", data);
  });
}
