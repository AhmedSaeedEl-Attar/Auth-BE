const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");
const verifyJWT = require("../middlewares/verifyJWT");

router.use(verifyJWT);

router.route("/").get(usersController.getUsers);

module.exports = router;
