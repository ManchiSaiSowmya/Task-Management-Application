const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// TEST ROUTE (important for debugging)
app.get("/test", (req, res) => {
  res.json({ message: "API is working fine 🚀" });
});

// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Task Manager API is running 🚀");
});

// ROUTES
const taskRoutes = require("./routes/tasks");
const authRoutes = require("./routes/auth");

// Mount routes
app.use("/tasks", taskRoutes);
app.use("/auth", authRoutes);

// HANDLE INVALID ROUTES (prevents HTML errors)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});


// DB + SERVER START
mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => {
    console.log("DB Connection Error:", err);
  });
  