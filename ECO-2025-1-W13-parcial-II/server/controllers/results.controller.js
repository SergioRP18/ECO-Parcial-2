// Controlador para manejar la lógica de las rutas de results-screen
const getResultsScreen1 = (req, res) => {
  res.send("Renderizando la pantalla de resultados en tiempo real (Screen 1)");
};

const getResultsScreen2 = (req, res) => {
  res.json({
    message: "Renderizando la pantalla del ganador (Screen 2)",
    players: [], // Devuelve una lista vacía o datos iniciales
  });
};

const handle404 = (req, res) => {
  res.status(404).send("404 - Página no encontrada");
};

module.exports = {
  getResultsScreen1,
  getResultsScreen2,
  handle404,
};