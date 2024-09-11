const express = require("express");
const router = express.Router();
const controller = require("../controllers/indexController");

router.get("/", controller.getAllBooks);
router.get("/authors", controller.getAllAuthors);
// router.get("/genres", controller.getAllGenres);

module.exports = router;
