const express = require("express");
const router = express.Router();
const controller = require("../controllers/booksController");

router.get("/check-title", controller.checkBookTitle);
router.get("/new", controller.getNewBookForm);
router.get("/:book", controller.getBook);
router.get("/", controller.getAllBooks);
router.post("/", controller.postNewBook);

module.exports = router;
