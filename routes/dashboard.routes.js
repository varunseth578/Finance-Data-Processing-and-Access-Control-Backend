const router = require("express").Router();
const Record = require("../models/Record");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const income = await Record.aggregate([
      { $match: { type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const expense = await Record.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const categoryWise = await Record.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      }
    ]);

    const recent = await Record.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalIncome: income[0]?.total || 0,
      totalExpense: expense[0]?.total || 0,
      balance:
        (income[0]?.total || 0) - (expense[0]?.total || 0),
      categoryWise,
      recent
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;