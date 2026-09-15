const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection 
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tasks")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Schema
const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    status: { type: String, default: "Todo" },
    priority: { type: String, default: "Medium" },
    assignedTo: { type: String, default: "" },
    dueDate: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);

// Routes

// CREATE
app.post("/tasks", async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PORT (IMPORTANT for deploy)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});