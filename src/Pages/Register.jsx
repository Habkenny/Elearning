import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // This is what lets us redirect to another page after registering
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/students/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      setSuccess("Account created successfully! Redirecting to login...");
      setError("");

      // Wait 1.5 seconds so the user sees the message, then go to login
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch {
      setError("Unable to connect to the server.");
      setSuccess("");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <Link to="/">
          <div className="auth-brand">E-Learn</div>
        </Link>

        <div className="auth-intro">
          <p>START LEARNING</p>

          <h1>
            Build your
            <span> learning future.</span>
          </h1>

          <p className="auth-description">
            Create an account and gain easy access to your courses, lecture
            materials and learning resources.
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-heading">
            <h2>Create account</h2>
            <p>Join E-Learn and start learning today</p>
          </div>

          {error && <p className="form-message error-message">{error}</p>}

          {success && <p className="form-message success-message">{success}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
            </div>

            <button type="submit" className="auth-button">
              Create Account
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?
            <Link to="/login">Sign in</Link>
          </p>

          <Link to="/" className="back-home">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;