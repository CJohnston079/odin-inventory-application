const express = require("express");
const router = express.Router();
const controller = require("../controllers/authorsController");

router.get("/author-names", controller.getAuthorNames);
router.get("/new", controller.getNewAuthorForm);
router.get("/:author", controller.getBooksByAuthor);
router.get("/", controller.getAllAuthors);
router.post("/", controller.postNewAuthor);

module.exports = router;