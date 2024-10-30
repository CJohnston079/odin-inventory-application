const express = require("express");
const router = express.Router();
const controller = require("../controllers/indexController");

router.get("/", controller.getIndex);
router.get("/get-item-counts", controller.getItemCounts);

module.exports = router;
