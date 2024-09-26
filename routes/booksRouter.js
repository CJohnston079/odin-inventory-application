const express = require("express");
const router = express.Router();
const controller = require("../controllers/booksController");

router.post("/", controller.postNewBook);
router.get("/", controller.getAllBooks);
router.get("/new", controller.getNewBookForm);
router.get("/:book", controller.getBook);

module.exports = router;
