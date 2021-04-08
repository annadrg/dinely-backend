const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

// Create JWT token
function toJWT(data) {
  return jwt.sign(data, secret, { expiresIn: "2h" });
}

// Verify JWT token
function toData(token) {
  return jwt.verify(token, secret);
}

module.exports = { toJWT, toData };
