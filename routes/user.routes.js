const router = require("express").Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// Get all users
router.get("/", auth, role("admin"), async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// Update role or status
router.put("/:id", auth, role("admin"), async (req, res) => {
  const { role: newRole, isActive } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: newRole, isActive },
    { new: true }
  );

  res.json(user);
});

module.exports = router;