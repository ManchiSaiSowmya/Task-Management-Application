import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://task-manager-api-np4w.onrender.com";

const Dashboard = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  // GET USER FROM LOCAL STORAGE
  const user = JSON.parse(localStorage.getItem("user"));

  console.log("USER FROM STORAGE:", user);

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      if (!user?._id && !user?.id) {
        console.error("Invalid user:", user);
        return;
      }

      setLoading(true);

      const userId = user._id || user.id;

      const res = await fetch(
        `${API_URL}/tasks?userId=${userId}`
      );

      const data = await res.json();

      console.log("FETCH TASKS RESPONSE:", data);

      const normalized = Array.isArray(data)
        ? data
        : data.tasks || [];

      const sortedTasks = normalized.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );

      setTasks(sortedTasks);
    } catch (err) {
      console.log("FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  // CHECK LOGIN + LOAD TASKS
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchTasks();
  }, [user, navigate]);

  // CREATE TASK
  const handleCreateTask = async () => {
    if (!taskTitle.trim()) return;

    try {
      const userId = user?._id || user?.id;

      if (!userId) {
        alert("User ID missing");
        return;
      }

      const payload = {
        title: taskTitle,
        userId,
      };

      console.log("CREATE PAYLOAD:", payload);

      const res = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      console.log("CREATE RESPONSE:", data);

      if (!res.ok) {
        alert(data.message || "Task creation failed");
        return;
      }

      const newTask = data.task || data;

      setTasks((prev) => [newTask, ...prev]);

      setTaskTitle("");
    } catch (err) {
      console.log("CREATE ERROR:", err);
    }
  };

  // DELETE TASK
  const handleDeleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
      });

      setTasks((prev) =>
        prev.filter((task) => task._id !== id)
      );
    } catch (err) {
      console.log("DELETE ERROR:", err);
    }
  };

  // TOGGLE COMPLETE
  const handleCompleteTask = async (id) => {
    try {
      const res = await fetch(
        `${API_URL}/tasks/${id}`,
        {
          method: "PATCH",
        }
      );

      const data = await res.json();

      const updatedTask = data.task || data;

      setTasks((prev) =>
        prev.map((task) =>
          task._id === id
            ? {
                ...task,
                completed: updatedTask.completed,
              }
            : task
        )
      );
    } catch (err) {
      console.log("COMPLETE ERROR:", err);
    }
  };

  // EDIT TASK
  const handleEditTask = async (id) => {
    if (!taskTitle.trim()) return;

    try {
      const res = await fetch(
        `${API_URL}/tasks/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            title: taskTitle,
          }),
        }
      );

      const data = await res.json();

      const updatedTask = data.task || data;

      setTasks((prev) =>
        prev.map((task) =>
          task._id === id
            ? updatedTask
            : task
        )
      );

      setEditingId(null);
      setTaskTitle("");
    } catch (err) {
      console.log("EDIT ERROR:", err);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // FILTER TASKS
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed")
      return task.completed === true;

    if (filter === "ongoing")
      return task.completed === false;

    return true;
  });

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <div style={styles.navbar}>
        <div style={styles.logo}>
          TASK MANAGER
        </div>

        <div style={styles.navLinks}>
          {["all", "ongoing", "completed"].map(
            (type) => (
              <button
                key={type}
                onClick={() =>
                  setFilter(type)
                }
                style={{
                  ...styles.navBtn,
                  background:
                    filter === type
                      ? "#6366f1"
                      : "#374151",
                }}
              >
                {type === "all"
                  ? "Home"
                  : type === "ongoing"
                  ? "Ongoing"
                  : "Completed"}
              </button>
            )
          )}
        </div>
      </div>

      {/* MAIN */}
      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <h1>
            Welcome,{" "}
            {user?.username || "User"} 👋
          </h1>

          <p>
            Email:{" "}
            {user?.email || "No email"}
          </p>
        </div>

        {/* INPUT */}
        <div style={styles.inputBox}>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) =>
              setTaskTitle(e.target.value)
            }
            placeholder="Write your task..."
            style={styles.input}
          />

          {editingId ? (
            <button
              onClick={() =>
                handleEditTask(editingId)
              }
              style={styles.updateBtn}
            >
              Update
            </button>
          ) : (
            <button
              onClick={handleCreateTask}
              style={styles.createBtn}
            >
              Add Task
            </button>
          )}
        </div>

        <h2 style={{ color: "#fff" }}>
          Task List
        </h2>

        {/* TASKS */}
        <div style={styles.grid}>
          {loading ? (
            <p style={{ color: "#fff" }}>
              Loading...
            </p>
          ) : filteredTasks.length === 0 ? (
            <p style={{ color: "#aaa" }}>
              No tasks found
            </p>
          ) : (
            filteredTasks.map((task, index) => (
              <div
                key={task._id || index}
                style={styles.card}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      textDecoration:
                        task.completed
                          ? "line-through"
                          : "none",
                    }}
                  >
                    {task.title}
                  </h3>

                  <small
                    style={{
                      color: "#666",
                    }}
                  >
                    {task.completed
                      ? "Completed"
                      : "Pending"}
                  </small>
                </div>

                <div style={styles.actions}>
                  <button
                    onClick={() =>
                      handleCompleteTask(
                        task._id
                      )
                    }
                    style={styles.green}
                  >
                    ✓
                  </button>

                  <button
                    onClick={() => {
                      setEditingId(
                        task._id
                      );

                      setTaskTitle(
                        task.title
                      );
                    }}
                    style={styles.blue}
                  >
                    ✎
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteTask(
                        task._id
                      )
                    }
                    style={styles.red}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          style={styles.logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
const styles = {
  page: {
    fontFamily: "Arial",
    background: "#0b0f19",
    minHeight: "100vh",
  },

  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "65px",
    background: "#111827",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 25px",
    color: "#fff",
    zIndex: 1000,
  },

  logo: {
    fontWeight: "bold",
    letterSpacing: "2px",
  },

  navLinks: {
    display: "flex",
    gap: "10px",
  },

  navBtn: {
    padding: "8px 14px",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    cursor: "pointer",
  },

  container: {
    paddingTop: "90px",
    width: "90%",
    maxWidth: "800px",
    margin: "auto",
  },

  header: {
    color: "#fff",
    marginBottom: "20px",
  },

  inputBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
  },

  createBtn: {
    background: "#22c55e",
    color: "#fff",
    border: "none",
    padding: "12px 16px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  updateBtn: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "12px 16px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gap: "12px",
  },

  card: {
    background: "#fff",
    padding: "15px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  actions: {
    display: "flex",
    gap: "6px",
  },

  green: {
    background: "#22c55e",
    border: "none",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  blue: {
    background: "#3b82f6",
    border: "none",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  red: {
    background: "#ef4444",
    border: "none",
    color: "#fff",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  logout: {
    marginTop: "20px",
    width: "100%",
    padding: "12px",
    background: "#6b46c1",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
};

export default Dashboard;