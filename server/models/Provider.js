const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
  name: String,
  category: String,
  phone: String,
  address: String,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  // 🔥 NEW FIELD
  avgServiceTime: {
    type: Number,
    default: 10, // minutes
  },
});

module.exports = mongoose.model("Provider", providerSchema);