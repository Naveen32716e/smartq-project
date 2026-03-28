const Queue = require("../models/Queue");
const Provider = require("../models/Provider");

// JOIN
exports.joinQueue = async (req, res) => {
  const { providerId, customerName, mobile } = req.body;

  const entry = await Queue.create({
    providerId,
    customerName,
    mobile,
  });

  const io = req.app.get("io");
  if (io) io.emit("queueUpdated");

  res.json(entry);
};

// GET
exports.getQueue = async (req, res) => {
  const { providerId } = req.params;

  const queue = await Queue.find({ providerId }).sort({ joinedAt: 1 });

  res.json(queue);
};

// UPDATE
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  await Queue.findByIdAndUpdate(id, { status });

  const io = req.app.get("io");
  if (io) io.emit("queueUpdated");

  res.json({ message: "updated" });
};

// CLEAR
exports.clearQueue = async (req, res) => {
  const { providerId } = req.params;

  await Queue.deleteMany({ providerId });

  const io = req.app.get("io");
  if (io) io.emit("queueUpdated");

  res.json({ message: "cleared" });
};
// 🔥 NEW API: CUSTOMER STATUS
exports.getCustomerStatus = async (req, res) => {
  try {
    const { providerId, mobile } = req.params;

    const queue = await Queue.find({
      providerId,
      status: "waiting",
    }).sort({ joinedAt: 1 });

    const index = queue.findIndex((q) => q.mobile === mobile);

    if (index === -1) {
      return res.json({ message: "Not in queue" });
    }

    const provider = await Provider.findById(providerId);

    const position = index + 1;
    const ahead = index;
    const waitTime = ahead * (provider?.avgServiceTime || 10);

    res.json({
      position,
      ahead,
      waitTime,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};