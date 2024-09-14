const express = require("express");
const router = express.Router();
const controller = require("../controllers/indexController");

router.get("/", controller.getAllBooks);
router.get("/authors", controller.getAllAuthors);
router.get("/authors/:author", controller.getBooksByAuthor);
router.get("/genres", controller.getAllGenres);
router.get("/genres/:genre", controller.getBooksByGenre);
router.get("/:book", controller.getBook);

module.exports = router;
