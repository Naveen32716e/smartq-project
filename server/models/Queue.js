const mongoose = require("mongoose");

const queueSchema = new mongoose.Schema({
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider",
  },
  customerName: String,
  mobile: String,
  status: {
    type: String,
    default: "waiting",
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Queue", queueSchema);