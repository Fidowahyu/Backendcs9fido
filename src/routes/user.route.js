const controller = require("../controllers/user.controller");
const express = require("express");
const router = express.Router();

router.post("/register", controller.userRegister);
router.post("/login", controller.userLogin);
router.get("/:email", controller.getUserByEmail);
router.put("/", controller.updateUser);
router.delete("/:id", controller.deleteUser);
router.post("/topUp", controller.userTopUp);

module.exports = router;
