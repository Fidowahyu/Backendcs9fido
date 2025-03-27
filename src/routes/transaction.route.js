const controller = require("../controllers/transaction.controller");
const express = require("express");
const router = express.Router();

router.get("/", controller.getAllTransactions);
router.post("/create", controller.createTransaction);
router.post("/pay/:id", controller.payTransaction);
router.delete("/:id", controller.deleteTransaction);

module.exports = router;
