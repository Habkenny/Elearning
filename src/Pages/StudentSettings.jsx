import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/StudentSettings.css";

function StudentSettings() {
  const [student] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });

  return (
    <div className="student-settings-page">
      {/* Header */}
      <header className="student-settings-header">
        <div>
          <p className="student-settings-label">STUDENT SETTINGS</p>

          <h1>Settings</h1>

          <p>Manage your student account.</p>
        </div>

        <div className="student-settings-avatar">
          {(student.name || "S").charAt(0).toUpperCase()}
        </div>
      </header>

      {/* Settings Content */}
      <section className="student-settings-section">
        {/* Student Profile Summary */}
        <div className="student-settings-card">
          <div className="student-settings-card-header">
            <div>
              <h2>Student Profile</h2>

              <p>Your account information.</p>
            </div>

            <Link to="/profile">
              <button className="student-edit-profile-btn">
                Edit Profile
              </button>
            </Link>
          </div>

          <div className="student-profile-details">
            <div className="student-profile-avatar">
              {(student.name || "S").charAt(0).toUpperCase()}
            </div>

            <div className="student-profile-info">
              <div className="student-profile-item">
                <span>Full Name</span>
                <strong>{student.name || "—"}</strong>
              </div>

              <div className="student-profile-item">
                <span>Email Address</span>
                <strong>{student.email || "—"}</strong>
              </div>

              <div className="student-profile-item">
                <span>Account Type</span>
                <strong>Student</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="student-settings-card">
          <div className="student-settings-card-header">
            <div>
              <h2>Account</h2>

              <p>Your standing on the platform.</p>
            </div>
          </div>

          <div className="student-preferences-list">
            <div className="student-preference-item">
              <div className="student-preference-info">
                <h3>Status</h3>
                <p>{student.status || "Active"}</p>
              </div>
            </div>

            <div className="student-preference-item">
              <div className="student-preference-info">
                <h3>Course</h3>
                <p>{student.course || "Not assigned"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default StudentSettings;