const User = require("../models").user;
const { toData } = require("./jwt");

async function auth(req, res, next) {
  // Split authorization header
  const auth =
    req.headers.authorization && req.headers.authorization.split(" ");

  // Check authorization header
  if (auth && auth[0] === "Bearer" && auth[1]) {
    try {
      const data = toData(auth[1]);
      const user = await User.findByPk(data.userId, {
        attributes: { exclude: ["password"] },
      });

      // Check if user exists and then add user to request
      if (!user) {
        res.status(404).send({ message: "User does not exist" });
      } else {
        req.user = user;
        next();
      }
    } catch (e) {
      res.status(400).send({ message: "Invalid JWT token" });
    }
  } else {
    res.status(401).send({
      message: "Please supply an Authorization header with a valid token",
    });
  }
}

module.exports = auth;
