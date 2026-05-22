import React, { useState } from "react";
import { loginUser } from "../api";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(form);

      console.log("LOGIN SUCCESS:", res.data);

      // Save token
      localStorage.setItem(
        "token",
        res.data.token
      );

      // Save user
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      // Redirect to dashboard
      navigate("/dashboard");

    } catch (err) {
      console.log("LOGIN ERROR:", err.response);

      alert(
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Login failed"
      );
    }
  };

  return (
    <div style={styles.page}>

      {/* animated background layer */}
      <div style={styles.bg}></div>

      {/* floating shapes */}
      <div style={styles.circle1}></div>
      <div style={styles.circle2}></div>
      <div style={styles.circle3}></div>

      {/* login box */}
      <div style={styles.box}>
        <h1 style={styles.title}>Task Management</h1>
        <h2 style={styles.subtitle}>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        <p style={styles.linkText}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};
  const styles = {
    page: {
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      overflow: "hidden",
      background: "#0a0a0a",
    },

    bg: {
      position: "absolute",
      width: "200%",
      height: "200%",
      background:
        "linear-gradient(45deg, #ff0080, #7928ca, #00c6ff, #38ef7d)",
      animation: "moveBg 8s linear infinite",
      opacity: 0.25,
    },

    box: {
      position: "relative",
      zIndex: 10,
      width: "360px",
      padding: "35px",
      background: "#111827",
      borderRadius: "16px",
      boxShadow: "0 0 25px rgba(255,255,255,0.1)",
      border: "1px solid rgba(255,255,255,0.1)",
      textAlign: "center",
    },

    title: {
      color: "#00c6ff",
      marginBottom: "5px",
      letterSpacing: "1px",
    },

    subtitle: {
      color: "#fff",
      marginBottom: "20px",
    },

    input: {
      width: "100%",
      padding: "12px",
      margin: "10px 0",
      borderRadius: "8px",
      border: "none",
      outline: "none",
      background: "#1f2937",
      color: "#fff",
      borderLeft: "4px solid #00c6ff",
    },

    button: {
      width: "100%",
      padding: "12px",
      marginTop: "10px",
      border: "none",
      borderRadius: "8px",
      background: "linear-gradient(90deg, #ff0080, #7928ca)",
      color: "#fff",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "0.3s",
    },

    linkText: {
      marginTop: "15px",
      color: "#ccc",
    },

    // floating shapes
    circle1: {
      position: "absolute",
      width: "200px",
      height: "200px",
      background: "#ff0080",
      borderRadius: "50%",
      top: "10%",
      left: "10%",
      filter: "blur(60px)",
      animation: "float 6s ease-in-out infinite",
    },

    circle2: {
      position: "absolute",
      width: "250px",
      height: "250px",
      background: "#00c6ff",
      borderRadius: "50%",
      bottom: "10%",
      right: "15%",
      filter: "blur(70px)",
      animation: "float 8s ease-in-out infinite",
    },

    circle3: {
      position: "absolute",
      width: "180px",
      height: "180px",
      background: "#38ef7d",
      borderRadius: "50%",
      top: "50%",
      left: "50%",
      filter: "blur(80px)",
      animation: "float 10s ease-in-out infinite",
    },
  };

  export default Login;