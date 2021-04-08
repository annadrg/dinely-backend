require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 4000;

const userRouter = require("./routers/users");
const restaurantRouter = require("./routers/restaurants");
const tagRouter = require("./routers/tags");
const authRouter = require("./routers/auth");

// Use middleware
app.use(cors());
app.use(express.json());

// Use routers
app.use("/users", userRouter);
app.use("/restaurants", restaurantRouter);
app.use("/tags", tagRouter);
app.use("/", authRouter);

// Start server on specified port
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
