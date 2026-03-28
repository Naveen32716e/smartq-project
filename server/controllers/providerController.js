const Provider = require("../models/Provider");

// 🔥 ADD PROVIDER (WITH CATEGORY-BASED TIME)
exports.addProvider = async (req, res) => {
  try {
    let { name, category, phone, address } = req.body;

    // 🔥 normalize category (VERY IMPORTANT)
    category = category.trim().toLowerCase();

    let avgTime = 10;

    if (category === "salon") avgTime = 15;
    else if (category === "clinic") avgTime = 20;
    else if (category === "restaurant") avgTime = 10;

    const provider = await Provider.create({
      name,
      category, // stored lowercase
      phone,
      address,
      status: "pending",
      avgServiceTime: avgTime,
    });

    res.json(provider);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔥 GET APPROVED (FOR CUSTOMER)
exports.getApprovedProviders = async (req, res) => {
  const providers = await Provider.find({ status: "approved" });
  res.json(providers);
};

// 🔥 GET ALL (FOR ADMIN + PROVIDER)
exports.getAllProviders = async (req, res) => {
  const providers = await Provider.find();
  res.json(providers);
};

// 🔥 APPROVE / REJECT
exports.updateProviderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const updated = await Provider.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  res.json(updated);
};