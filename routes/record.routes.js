const router = require("express").Router();
const Record = require("../models/Record");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// Create (Admin)
router.post("/", auth, role("admin"), async (req, res) => {
  try {
    const { amount, type } = req.body;

    if (!amount || !type) {
      return res.status(400).json({ msg: "Amount & type required" });
    }

    const record = await Record.create(req.body);
    res.json(record);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get (All roles)
router.get("/", auth, role("viewer", "analyst", "admin"), async (req, res) => {
  try {
    const { type, category, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;

    const records = await Record.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Update
router.put("/:id", auth, role("admin"), async (req, res) => {
  const record = await Record.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(record);
});

// Delete
router.delete("/:id", auth, role("admin"), async (req, res) => {
  await Record.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
});

module.exports = router;