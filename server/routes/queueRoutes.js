const express = require("express");
const router = express.Router();
const { getCustomerStatus } = require("../controllers/queueController");
const {
  joinQueue,
  getQueue,
  updateStatus,
  clearQueue,
} = require("../controllers/queueController");

router.post("/", joinQueue);
router.get("/:providerId", getQueue);
router.put("/:id", updateStatus);
router.delete("/:providerId", clearQueue);
router.get("/status/:providerId/:mobile", getCustomerStatus);
module.exports = router;