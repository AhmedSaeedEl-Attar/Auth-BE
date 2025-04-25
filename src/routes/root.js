const express = require("express");
const router = express.Router();
const rootController = require("../controllers/root");

// GET /root
router.get("/", rootController.getRoot);

module.exports = router;
