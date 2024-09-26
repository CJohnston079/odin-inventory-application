const express = require("express");
const router = express.Router();
const controller = require("../controllers/decadesController");

router.get("/", controller.getAllDecades);
// router.get("/:decade", controller.getBooksByDecade);

module.exports = router;
