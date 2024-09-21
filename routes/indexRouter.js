const express = require("express");
const router = express.Router();
const controller = require("../controllers/indexController");

router.get("/", controller.getIndex);
router.get("/books", controller.getAllBooks);
router.get("/books/new", controller.getNewBookForm);
router.get("/books/:book", controller.getBook);
router.get("/authors", controller.getAllAuthors);
router.get("/authors/new", controller.getNewAuthorForm);
router.get("/authors/:author", controller.getBooksByAuthor);
router.get("/genres", controller.getAllGenres);
router.get("/genres/:genre", controller.getBooksByGenre);

module.exports = router;
