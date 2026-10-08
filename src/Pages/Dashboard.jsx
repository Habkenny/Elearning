import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user] = useState(() => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      return savedUser.name ? savedUser : { name: "Student" };
    } catch {
      return { name: "Student" };
    }
  });
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    // Real counts and lists
    Promise.all([
      fetch("http://localhost:5000/api/courses", { headers }).then((r) => r.json()),
      fetch("http://localhost:5000/api/materials", { headers }).then((r) => r.json()),
    ])
      .then(([coursesData, materialsData]) => {
        setCourses(coursesData.courses || []);
        setMaterials(materialsData.materials || []);
      })
      .catch(() => {});
  }, []);

  function formatSize(bytes) {
    if (!bytes) return "";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  return (
    <>
      {/* Top bar */}
      <header className="dashboard-header">
        <div>
          <p className="dashboard-label">STUDENT DASHBOARD</p>

          <h1>
            Welcome back, <span>{user.name}!</span>
          </h1>

          <p className="dashboard-subtitle">
            Keep learning and stay on track with your courses.
          </p>
        </div>

        <div className="student-profile">
          <div className="student-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div className="stu">
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </div>
        </div>
      </header>

      {/* Statistics */}
      <section className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div>
            <p>Available Courses</p>
            <h2>{courses.length}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div>
            <p>Learning Materials</p>
            <h2>{materials.length}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">◷</div>
          <div>
            <p>Registered</p>
            <h2>
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "—"}
            </h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✓</div>
          <div>
            <p>Account Status</p>
            <h2>Active</h2>
          </div>
        </div>
      </section>

      {/* Dashboard content */}
      <section className="dashboard-content">
        {/* Available Courses */}
        <div className="dashboard-section">
          <div className="section-heading">
            <div>
              <h2>Available Courses</h2>
              <p>Courses you can access right now.</p>
            </div>

            <Link to="/courses">View all</Link>
          </div>

          <div className="course-list">
            {courses.length === 0 && <p>No courses available yet.</p>}

            {courses.slice(0, 3).map((course) => (
              <div className="dashboard-course" key={course._id}>
                <div className="course-icon">
                  {course.code
                    .split(" ")
                    .map((w) => w.charAt(0))
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p>{course.category || "Course"}</p>

                  <div className="progress-container">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: "100%" }}></div>
                    </div>
                    <span>{course.code}</span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate(
                      `/course-details/${encodeURIComponent(
                        `${course.title}|${course.code}`,
                      )}`,
                    )
                  }
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Materials */}
        <div className="dashboard-section materials-section">
          <div className="section-heading">
            <div>
              <h2>Recent Materials</h2>
              <p>Recently added learning resources.</p>
            </div>

            <Link to="/materials">View all</Link>
          </div>

          <div className="material-list">
            {materials.length === 0 && <p>No materials uploaded yet.</p>}

            {materials.slice(0, 3).map((material) => (
              <div className="material-item" key={material._id}>
                <div className="material-icon">
                  {(material.originalName || "").split(".").pop().toUpperCase()}
                </div>

                <div>
                  <h3>{material.title}</h3>
                  <p>{material.course || "General"}</p>
                </div>

                <span>{formatSize(material.fileSize)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Dashboard;