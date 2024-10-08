const express = require("express");
const router = express.Router();
const controller = require("../controllers/countriesController");

router.get("/nationality-names", controller.getNationalityNames);
router.get("/", controller.getAllCountries);

module.exports = router;
