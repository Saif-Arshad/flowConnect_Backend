const express = require("express");
const router = express.Router();
const { verifyUserToken } = require("../middlewares/jwt")
const { createUser, loginUser, getUsers, checkUserName, signAdminOut } = require("../controllers/user.controller");
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/checkname", checkUserName);
router.get("/all-users", verifyUserToken, getUsers)
router.post("/log-out", verifyUserToken, signAdminOut);

module.exports = router;

