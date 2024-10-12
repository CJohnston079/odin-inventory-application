const express = require("express");
const router = express.Router();
const controller = require("../controllers/countriesController");

router.get("/nationality-names", controller.getNationalityNames);
router.get("/check-nationality", controller.checkNationality);
router.get("/:country", controller.getBooksByCountry);
router.get("/", controller.getAllCountries);

module.exports = router;
