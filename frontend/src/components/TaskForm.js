import React, { useEffect, useState } from "react";

function TaskForm({ onSave, editingTask }) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (editingTask) setTitle(editingTask.title);
  }, [editingTask]);

  const submit = () => {
    if (!title.trim()) return;
    onSave(title);
    setTitle("");
  };

  return (
    <div className="task-form">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task..."
      />
      <button onClick={submit}>
        {editingTask ? "Update" : "Add"}
      </button>
    </div>
  );
}

export default TaskForm;