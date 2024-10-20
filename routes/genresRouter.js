const express = require("express");
const router = express.Router();
const controller = require("../controllers/genresController");

router.get("/genre-names", controller.getGenreNames);
router.get("/check-genre", controller.checkGenre);
router.get("/new", controller.getNewGenreForm);
router.get("/:genre/:slug", controller.getBooksByGenre);
router.get("/", controller.getAllGenres);
router.post("/", controller.postNewGenre);
router.delete("/:genre/:slug", controller.deleteGenre);

module.exports = router;
