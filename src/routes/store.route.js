const controller = require("../controllers/store.controller");
const express = require("express");
const router = express.Router();

router.get("/getAll", controller.getAllStores);
router.post("/create", controller.createStore);
router.get("/:id", controller.getStoreById);
router.put("/", controller.updateStore);
router.delete("/:id", controller.deleteStore);

module.exports = router;
