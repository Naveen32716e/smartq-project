const express = require("express");
const router = express.Router();

const {
  addProvider,
  getApprovedProviders,
  getAllProviders,
  updateProviderStatus,
} = require("../controllers/providerController");

router.post("/", addProvider);
router.get("/approved", getApprovedProviders);
router.get("/all", getAllProviders);
router.put("/:id", updateProviderStatus);

module.exports = router;