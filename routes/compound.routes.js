const express = require("express");
const router = express.Router();
const controller = require("../controllers/compound.controller.js");

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.put("/:id", controller.update);
router.post('/upload',controller.upload);

module.exports = router;
