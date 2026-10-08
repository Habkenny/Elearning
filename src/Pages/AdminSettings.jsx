import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/AdminSettings.css";

function AdminSettings() {
  const navigate = useNavigate();

  const [admin] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
    name: admin.name || "",
    email: admin.email || "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin-login");
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/students/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Save failed.");
        return;
      }

      const updated = { ...admin, ...data.student };
      localStorage.setItem("user", JSON.stringify(updated));
      setIsEditingProfile(false);
      setSuccess("Profile saved successfully!");
    } catch {
      setError("Unable to connect to the server.");
    }
  };

  const displayName = admin.name || "Administrator";

  return (
    <div className="admin-settings-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <Link to="/" className="admin-logo">
          E-Learn
        </Link>

        <p className="admin-role">ADMIN PANEL</p>

        <nav className="admin-nav">
          <Link to="/admin-dashboard">
            <span>⌂</span>
            Dashboard
          </Link>

          <Link to="/admin-courses">
            <span>📚</span>
            Courses
          </Link>

          <Link to="/admin-materials">
            <span>📄</span>
            Materials
          </Link>

          <Link to="/admin-students">
            <span>👥</span>
            Students
          </Link>
        </nav>

        <div className="admin-sidebar-bottom">
          <Link to="/admin-settings" className="active">
            <span>⚙</span>
            Settings
          </Link>

          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: 0,
              font: "inherit",
            }}
          >
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-settings-main">
        <header className="admin-settings-header">
          <div>
            <p className="admin-label">ADMIN SETTINGS</p>
            <h1>Settings</h1>
            <p>Manage your administrator account.</p>
          </div>

          <div className="admin-avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>
        </header>

        {error && <p className="form-message error-message">{error}</p>}
        {success && <p className="form-message success-message">{success}</p>}

        {/* Settings Content */}
        <section className="settings-section">
          <div className="settings-card">
            <div className="settings-card-header">
              <div>
                <h2>Administrator Profile</h2>
                <p>Your administrator account information.</p>
              </div>

              {!isEditingProfile && (
                <button
                  className="edit-profile-btn"
                  onClick={() => {
                    setFormData({
                      name: admin.name || "",
                      email: admin.email || "",
                    });
                    setIsEditingProfile(true);
                  }}
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="profile-details">
              <div className="profile-avatar">
                {displayName.charAt(0).toUpperCase()}
              </div>

              <div className="profile-info">
                <div className="profile-item">
                  <span>Full Name</span>

                  {isEditingProfile ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  ) : (
                    <strong>{displayName}</strong>
                  )}
                </div>

                <div className="profile-item">
                  <span>Email Address</span>

                  {isEditingProfile ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  ) : (
                    <strong>{admin.email || "—"}</strong>
                  )}
                </div>

                <div className="profile-item">
                  <span>Role</span>
                  <strong>System Administrator</strong>
                </div>
              </div>
            </div>

            {isEditingProfile && (
              <div className="profile-actions">
                <button className="save-profile-btn" onClick={handleSave}>
                  Save Changes
                </button>

                <button
                  className="cancel-profile-btn"
                  onClick={() => setIsEditingProfile(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="settings-card">
            <div className="settings-card-header">
              <div>
                <h2>System</h2>
                <p>E-Learn platform information.</p>
              </div>
            </div>

            <div className="preferences-list">
              <div className="preference-item">
                <div className="preference-info">
                  <h3>Platform</h3>
                  <p>E-Learn v1.0</p>
                </div>
              </div>

              <div className="preference-item">
                <div className="preference-info">
                  <h3>Storage</h3>
                  <p>MongoDB Atlas (cloud database)</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminSettings;