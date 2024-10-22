const express = require("express");
const router = express.Router();
const controller = require("../controllers/booksController");

router.get("/check-title", controller.checkBookTitle);
router.get("/new", controller.getNewBookForm);
router.get("/:book/:slug", controller.getBook);
router.get("/", controller.getAllBooks);
router.post("/", controller.postNewBook);
router.put("/:book/:slug", controller.updateBook);
router.delete("/:book/:slug", controller.deleteBook);

module.exports = router;
