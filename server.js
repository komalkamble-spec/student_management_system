// const app = require("./app");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const express = require("express");
const app = express();
const studentRoutes = require("./routes/studentsRoutes");
const authRoute = require("./routes/authRoute");

app.use(express.json());
app.use("/api",studentRoutes);
app.use("/api",authRoute)
const db = require("./config/db/db");
const PORT = process.env.PORT || 5001;


app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ success: false, message: err.message });
});
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

module.exports = {
  app,
};

