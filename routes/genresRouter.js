const express = require("express");
const router = express.Router();
const controller = require("../controllers/genresController");

router.post("/", controller.postNewGenre);
router.get("/", controller.getAllGenres);
router.get("/new", controller.getNewGenreForm);
router.get("/:genre", controller.getBooksByGenre);

module.exports = router;
