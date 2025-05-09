import renderScreen1 from "./screens/screen1.js";
import renderScreen2 from "./screens/screen2.js";

const socket = io("/", { path: "/real-time" });

function clearScripts() {
  const app = document.getElementById("app");
  app.innerHTML = ""; 
}

let route = { path: "/", data: {} };

async function renderRoute(currentRoute) {
  clearScripts();

  switch (currentRoute?.path) {
    case "/":
      renderScreen1(currentRoute?.data);
      break;

    case "/screen1":
      renderScreen1(currentRoute?.data);
      break;

    case "/screen2":
      const initialData = currentRoute?.data?.players || []; // Extrae el array de jugadores
      renderScreen2(initialData); // Pasa el array directamente
      break;

    default:
      show404();
  }
}

function navigateTo(path, data = {}) {
  route = { path, data };
  renderRoute(route);
}

function show404() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <h1>404 - Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <button id="go-home">Go to Home</button>
  `;
  const goHomeButton = document.getElementById("go-home");
  goHomeButton.addEventListener("click", () => navigateTo("/"));
}

renderRoute(route);

export { navigateTo, socket };
