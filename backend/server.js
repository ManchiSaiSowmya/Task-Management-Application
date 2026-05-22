const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* =========================
   ALLOWED ORIGINS
========================= */
const allowedOrigins = [
  "https://task-management-application-eta-black.vercel.app",
  "https://task-management-application-k9yn0lgme.vercel.app",
  "https://task-management-application-tlqkdhd59.vercel.app",
  "https://task-management-application-ten-flax.vercel.app",
  "http://localhost:3000"
];

/* =========================
   CORS CONFIG
========================= */
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      return callback(null, false); // do NOT crash server
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

/* =========================
   HANDLE PREFLIGHT REQUESTS
========================= */
app.options("*", cors());

/* =========================
   BODY PARSER
========================= */
app.use(express.json());

/* =========================
   LOG REQUESTS (DEBUG)
========================= */
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} | Origin: ${req.headers.origin}`);
  next();
});

/* =========================
   TEST ROUTE
========================= */
app.get("/test", (req, res) => {
  res.json({ message: "API is working fine 🚀" });
});

/* =========================
   HOME ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("Task Manager API is running 🚀");
});

/* =========================
   ROUTES
========================= */
const taskRoutes = require("./routes/tasks");
const authRoutes = require("./routes/auth");

app.use("/tasks", taskRoutes);
app.use("/auth", authRoutes);

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* =========================
   DATABASE + SERVER START
========================= */
mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("DB Connection Error:", err);
  });