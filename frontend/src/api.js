import axios from "axios";

const API = "http://localhost:5000";

export const loginUser = (data) =>
  axios.post(`${API}/auth/login`, data);

export const registerUser = (data) =>
  axios.post(`${API}/auth/register`, data);

// TASK APIs
export const getTasks = (userId) =>
  axios.get(`${API}/tasks/user/${userId}`);

export const createTask = (data) =>
  axios.post(`${API}/tasks`, data);

export const updateTask = (id, data) =>
  axios.put(`${API}/tasks/${id}`, data);

export const deleteTask = (id) =>
  axios.delete(`${API}/tasks/${id}`);