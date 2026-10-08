import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css";

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/students/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      // Only admins may enter through this door
      if (!data.student.isAdmin) {
        setError("This account does not have administrator access.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.student));

      navigate("/admin-dashboard");
    } catch {
      setError("Unable to connect to the server.");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <Link to="/" className="admin-login-logo">
            E-Learn
          </Link>

          <p className="admin-login-label">ADMINISTRATOR ACCESS</p>

          <h1>Admin Login</h1>

          <p>Sign in with your administrator account to manage the platform.</p>
        </div>

        {error && <p className="form-message error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter admin email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </div>

          <button type="submit" className="admin-login-btn">
            Sign In to Admin Panel
          </button>
        </form>

        <div className="admin-login-footer">
          <Link to="/login">← Student login</Link>
          <Link to="/">Back to home</Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;