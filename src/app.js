require("dotenv").config(); // Load environment variables from .env file
const { PORT } = process.env;
const port = PORT || 5000;
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookiesParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");

const app = express();
const cors = require("cors");
const dbConnect = require("./config/dbConnect");

const rootRouter = require("./routes/root");
const authRouter = require("./routes/authRoutes");
const usersRouter = require("./routes/usersRoutes");

app.use(express.json());

app.use(bodyParser.json()); //application/json data

app.use(cookiesParser()); // Parse cookies from the request

app.use(cors(corsOptions));

app.use("/", rootRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);

// Database Connection
dbConnect();

// Wait for the connection to be established
mongoose.connection.once("open", () => {
  app.listen(port, () => {
    console.log("Server is running on port " + "http://localhost:" + port);
  });
});
// Handle connection errors
mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});
