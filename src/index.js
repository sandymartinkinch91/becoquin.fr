const express = require("express");
const cors = require("cors");
const config = require("./config");
const sequelize = require("./db");
const licensesRouter = require("./routes/licenses");

// Import model so Sequelize knows about it
require("./models/License");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Licensing API is running" });
});

app.use("/licenses", licensesRouter);

async function start() {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    // Create tables if they don't exist
    await sequelize.sync();
    console.log("Database synced");

    app.listen(config.port, () => {
      console.log(`Server running on port ${5432}`);
    });
  } catch (err) {
    console.error("Unable to start server:", err);
    process.exit(1);
  }
}

start();
