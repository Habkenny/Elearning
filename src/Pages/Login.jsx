import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // This is what lets us redirect to another page after logging in
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
        setSuccess("");
        return;
      }

      // Save the "session" in the browser so we stay logged in
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.student));

      // Admin goes to admin dashboard, regular user to their dashboard
      if (data.student.isAdmin) {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
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
          <p>WELCOME BACK</p>

          <h1>
            Continue your
            <span> learning journey.</span>
          </h1>

          <p className="auth-description">
            Sign in to access your courses, lecture materials and personalized
            learning dashboard.
          </p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-heading">
            <h2>Welcome back</h2>
            <p>Sign in to your E-Learn account</p>
          </div>

          {error && <p className="form-message error-message">{error}</p>}

          {success && <p className="form-message success-message">{success}</p>}

          <form onSubmit={handleSubmit}>
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
              <div className="password-label">
                <label>Password</label>

                <a href="#">Forgot password?</a>
              </div>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="auth-button">
              Sign In
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <p className="auth-switch">
            Don't have an account?
            <Link to="/register">Create account</Link>
          </p>

          <Link to="/" className="back-home">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;