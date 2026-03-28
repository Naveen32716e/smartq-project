const Queue = require("../models/Queue");

exports.getStats = async (req, res) => {
  const waiting = await Queue.countDocuments({ status: "waiting" });
  const serving = await Queue.countDocuments({ status: "serving" });
  const done = await Queue.countDocuments({ status: "done" });

  res.json({ waiting, serving, done });
};