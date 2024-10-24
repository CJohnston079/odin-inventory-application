const express = require("express");
const router = express.Router();
const controller = require("../controllers/authorsController");

router.get("/author-names", controller.getAuthorNames);
router.get("/check-author", controller.checkAuthor);
router.get("/new", controller.getNewAuthorForm);
router.get("/:author/:slug", controller.getBooksByAuthor);
router.get("/", controller.getAllAuthors);
router.post("/", controller.postNewAuthor);
router.put("/:author/:slug", controller.updateAuthor);
router.delete("/:author/:slug", controller.deleteAuthor);

module.exports = router;
