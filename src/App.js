import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "./store/authReducer"; // Action to set the token in Redux
import "./index.css";

// Import Pages
import Home from "./pages/home";
import Login from "./pages/login";
import StudentDashboard from "./pages/studentDashboard";
import AdminDashboard from "./pages/adminDashboard";
import NotFound from "./pages/notfound";
import Register from "./pages/register";
import LecturerDashboard from "./pages/lecturerDashboard";
import Dashboard from "./pages/dashboard";

// Import toast and ToastContainer from react-toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Retrieve the token from localStorage and set it in Redux
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setToken(token));
    }
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/lecturer" element={<LecturerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
