import React from "react";
import { motion } from "framer-motion";

function TaskItem({ task, onToggle, onDelete, onEdit }) {
  return (
    <motion.div
      className="task-item"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span
        className={task.completed ? "completed" : ""}
        onClick={() => onToggle(task)}
      >
        {task.title}
      </span>

      <div>
        <button onClick={() => onEdit(task)}>Edit</button>
        <button onClick={() => onDelete(task._id)}>Delete</button>
      </div>
    </motion.div>
  );
}

export default TaskItem;