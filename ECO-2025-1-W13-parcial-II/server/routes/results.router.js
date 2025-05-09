const express = require("express");
const router = express.Router();
const resultsController = require("../controllers/results.controller.js");

router.get("/screen1", resultsController.getResultsScreen1);
router.get("/screen2", resultsController.getResultsScreen2);

router.use((req, res) => {
  res.status(404).send("Not Found");
});

module.exports = router;