import { useEffect, useState } from "react";
import "../styles/Profile.css";

const COURSES_API = "http://localhost:5000/api/courses";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [courseOptions, setCourseOptions] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [student, setStudent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });

  const [formData, setFormData] = useState({
    name: student.name || "",
    email: student.email || "",
    phone: student.phone || "",
    course: student.course || "",
    matricNumber: student.matricNumber || "",
    programme: student.programme || "",
    level: student.level || "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(COURSES_API, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCourseOptions(data.courses || []))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

      // Update the copy in localStorage so the whole app sees new data
      const updated = { ...student, ...data.student };
      localStorage.setItem("user", JSON.stringify(updated));
      setStudent(updated);
      setIsEditing(false);
      setSuccess("Profile saved successfully!");
    } catch {
      setError("Unable to connect to the server.");
    }
  };

  const displayName = student.name || "Student";

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div>
          <p className="profile-label">STUDENT PROFILE</p>
          <h1>My Profile</h1>
          <p>Manage your personal information and student account details.</p>
        </div>
      </div>

      {error && <p className="form-message error-message">{error}</p>}
      {success && <p className="form-message success-message">{success}</p>}

      {/* Profile Card */}
      <section className="profile-card">
        <div className="profile-card-header">
          <div className="large-avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2>{displayName}</h2>
            <p>{student.email || "No email"}</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="profile-section">
          <h3>Personal Information</h3>

          <div className="profile-grid">
            {/* Full Name */}
            <div className="profile-field">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              ) : (
                <div>{student.name || "—"}</div>
              )}
            </div>

            {/* Email */}
            <div className="profile-field">
              <label>Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              ) : (
                <div>{student.email || "—"}</div>
              )}
            </div>

            {/* Phone */}
            <div className="profile-field">
              <label>Phone Number</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  placeholder="e.g. 08012345678"
                  value={formData.phone}
                  onChange={handleChange}
                />
              ) : (
                <div>{student.phone || "—"}</div>
              )}
            </div>

            {/* Matric Number */}
            <div className="profile-field">
              <label>Matric Number</label>
              {isEditing ? (
                <input
                  type="text"
                  name="matricNumber"
                  placeholder="e.g. EL-2026-001"
                  value={formData.matricNumber}
                  onChange={handleChange}
                />
              ) : (
                <div>{student.matricNumber || "—"}</div>
              )}
            </div>

            {/* Programme */}
            <div className="profile-field">
              <label>Programme</label>
              {isEditing ? (
                <select
                  name="programme"
                  value={formData.programme}
                  onChange={handleChange}
                >
                  <option value="">Select programme</option>
                  <option value="Software and Web Development">
                    Software and Web Development
                  </option>
                  <option value="Networking and Cloud Computing">
                    Networking and Cloud Computing
                  </option>
                </select>
              ) : (
                <div>{student.programme || "—"}</div>
              )}
            </div>

            {/* Level */}
            <div className="profile-field">
              <label>Level</label>
              {isEditing ? (
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                >
                  <option value="">Select level</option>
                  <option value="ND 1">ND 1</option>
                  <option value="ND 2">ND 2</option>
                  <option value="HND 1">HND 1</option>
                  <option value="HND 2">HND 2</option>
                </select>
              ) : (
                <div>{student.level || "—"}</div>
              )}
            </div>

            {/* Course */}
            <div className="profile-field">
              <label>Course</label>
              {isEditing ? (
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                >
                  <option value="">Not assigned</option>
                  {courseOptions.map((course) => (
                    <option key={course._id} value={course.title}>
                      {course.title}
                    </option>
                  ))}
                </select>
              ) : (
                <div>{student.course || "—"}</div>
              )}
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="profile-section">
          <h3>Account Information</h3>

          <div className="profile-grid">
            <div className="profile-field">
              <label>Account Type</label>
              <div>Student</div>
            </div>

            <div className="profile-field">
              <label>Learning Status</label>
              <div className="profile-status">{student.status || "Active"}</div>
            </div>
          </div>
        </div>

        {isEditing ? (
          <button className="edit-profile-btn" onClick={handleSave}>
            Save Changes
          </button>
        ) : (
          <button
            className="edit-profile-btn"
            onClick={() => {
              setFormData({
                name: student.name || "",
                email: student.email || "",
                phone: student.phone || "",
                course: student.course || "",
                matricNumber: student.matricNumber || "",
                programme: student.programme || "",
                level: student.level || "",
              });
              setIsEditing(true);
            }}
          >
            Edit Profile
          </button>
        )}
      </section>
    </div>
  );
}

export default Profile;