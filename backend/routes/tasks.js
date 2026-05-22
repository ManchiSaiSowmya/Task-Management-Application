const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Task = require("../models/Task");


// GET TASKS
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: "userId required",
      });
    }

    const tasks = await Task.find({ userId });

    res.json(tasks);
  } catch (error) {
    console.log("GET TASKS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});


// CREATE TASK
router.post("/", async (req, res) => {
  try {
    const { title, userId } = req.body;

    if (!title || !userId) {
      return res.status(400).json({
        message: "title and userId are required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        message: "Invalid userId format",
      });
    }

    const task = new Task({
      title,
      userId,
      completed: false,
    });

    await task.save();

    res.json(task);
  } catch (error) {
    console.log("CREATE TASK ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});


// UPDATE TASK
router.put("/:id", async (req, res) => {
  try {
    const updatedTask =
      await Task.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
        },
        { new: true }
      );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// TOGGLE COMPLETE
router.patch("/:id", async (req, res) => {
  try {
    const task = await Task.findById(
      req.params.id
    );

    task.completed = !task.completed;

    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// DELETE TASK
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;