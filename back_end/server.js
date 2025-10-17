import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import itemsRoutes from "./src/routes/items.js"; // create this soon

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/items", itemsRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});
app.get("/items", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM items");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
