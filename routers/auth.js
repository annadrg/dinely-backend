const bcrypt = require("bcrypt");
const { Router } = require("express");
const { toJWT } = require("../auth/jwt");
const User = require("../models").user;

const router = new Router();

// Log in existing user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Please provide both email and password" });
    }

    // Find user
    const user = await User.findOne({ where: { email } });

    // Check if user exists and if password is correct
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).send({
        message: "User with that email not found or password incorrect",
      });
    }

    // Don't send back the password hash
    delete user.dataValues["password"];

    // Create token and send back with user info
    const token = toJWT({ userId: user.id });
    return res.status(200).send({ token, ...user.dataValues });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

// Sign up new user
router.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  // Check is email, password and first and last name are provided
  if (!email || !password || !firstName || !lastName) {
    return res
      .status(400)
      .send("Please provide an email, password and a first and last name");
  }

  try {
    // Create new user
    const newUser = await User.create({
      email,
      password: bcrypt.hashSync(password, 10),
      firstName,
      lastName,
    });

    // Don't send back the password hash
    delete newUser.dataValues["password"];

    // Create token and send back with user info
    const token = toJWT({ userId: newUser.id });
    res.status(201).json({ token, ...newUser.dataValues });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .send({ message: "There is an existing account with this email" });
    }

    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

module.exports = router;
