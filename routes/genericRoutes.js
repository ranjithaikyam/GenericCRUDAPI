const express = require("express");
const router = express.Router();

const genericController = require("../controllers/genericController");

console.log("Controller:", genericController);

// Insert API
router.post("/insert", genericController.insertData);
router.post("/select", genericController.selectData);
router.put("/update", genericController.updateData);
router.delete("/delete", genericController.deleteData);

module.exports = router;

