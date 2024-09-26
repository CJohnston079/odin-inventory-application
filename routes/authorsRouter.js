const express = require("express");
const router = express.Router();
const controller = require("../controllers/authorsController");

router.post("/", controller.postNewAuthor);
router.get("/", controller.getAllAuthors);
router.get("/new", controller.getNewAuthorForm);
router.get("/:author", controller.getBooksByAuthor);

module.exports = router;
