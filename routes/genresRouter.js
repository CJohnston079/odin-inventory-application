const express = require("express");
const router = express.Router();
const controller = require("../controllers/genresController");

router.get("/genre-names", controller.getGenreNames);
router.get("/new", controller.getNewGenreForm);
router.get("/:genre", controller.getBooksByGenre);
router.get("/", controller.getAllGenres);
router.post("/", controller.postNewGenre);

module.exports = router;