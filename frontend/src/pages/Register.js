import React, { useState } from "react";
import { registerUser } from "../api";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    mobile: "",
    dob: "",
    gender: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await registerUser(form);

      console.log(res.data);

      // alert("Registration successful 🚀");

      navigate("/login");
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
        err.response?.data ||
        "Registration failed"
      );
    }
  };

  return (
    <div style={styles.container}>

  <div className="animated-bg">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
<div className="mesh-bg"></div>
<div className="glow-layer"></div>
  <div style={styles.box}>
   
        <h2>Register</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>

        <p>
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "Arial",
  background: "#0a0f1c",
  position: "relative",
  overflow: "hidden",
},

  box: {
    width: "380px",
    padding: "35px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    color: "#fff",
    zIndex: 10,
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "12px",
    marginTop: "12px",
    border: "none",
    borderRadius: "10px",
    background: "#22c55e",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
export default Register;