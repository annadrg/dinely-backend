const bcrypt = require("bcrypt");
const { Router } = require("express");
const authMiddleware = require("../auth/middleware");
const User = require("../models/").user;

const router = new Router();

// Get logged in user profile
router.get("/profile", authMiddleware, async (req, res) => {
  // Don't send back the password hash
  delete req.user.dataValues["password"];
  res.status(200).send({ ...req.user.dataValues });
});

// Update user
router.patch("/:userId", authMiddleware, async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const userById = await User.findByPk(userId);

    // Check if user exists and update info
    if (!userById) {
      res.status(404).send({ message: "User not found" });
    } else {
      // Check if password is updated and then hash pashword
      const updatedUser = req.body.password
        ? await userById.update({
            ...req.body,
            password: bcrypt.hashSync(req.body.password, 10),
          })
        : await userById.update(req.body);

      // Don't send back the password hash
      delete updatedUser.dataValues["password"];
      res.status(200).send({ ...updatedUser.dataValues });
    }
  } catch (error) {
    next(error.message);
  }
});

module.exports = router;
