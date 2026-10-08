import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/AdminDashboard.css";

const API = "http://localhost:5000/api";

function AdminDashboard() {
  const [courseCount, setCourseCount] = useState(0);
  const [materialCount, setMaterialCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [activeStudentCount, setActiveStudentCount] = useState(0);
  const [recentStudents, setRecentStudents] = useState([]);
  const [adminName] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.name || "Admin";
    } catch {
      return "Admin";
    }
  });

  useEffect(() => {

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    // Fetch all three lists and count them
    Promise.all([
      fetch(`${API}/courses`, { headers }).then((r) => r.json()),
      fetch(`${API}/materials`, { headers }).then((r) => r.json()),
      fetch(`${API}/students`, { headers }).then((r) => r.json()),
    ])
      .then(([coursesData, materialsData, studentsData]) => {
        const courses = coursesData.courses || [];
        const materials = materialsData.materials || [];
        const students = studentsData.students || [];

        setCourseCount(courses.length);
        setMaterialCount(materials.length);
        setStudentCount(students.length);
        setActiveStudentCount(
          students.filter((s) => (s.status || "Active") === "Active").length,
        );
        setRecentStudents(students.slice(0, 5)); // 5 most recent registrations
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <div className="admin-dashboard-page">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-logo">
          E-Learn
        </Link>

        <p className="admin-role">ADMIN PANEL</p>

        <nav className="admin-nav">
          <Link to="/admin-dashboard" className="active">
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
          <Link to="/admin-settings">
            <span>⚙</span>
            Settings
          </Link>

          <Link to="/admin-login" onClick={handleLogout}>
            <span>↪</span>
            Logout
          </Link>
        </div>
      </aside>

      <main className="admin-dashboard-main">
        <header className="admin-dashboard-header">
          <div>
            <p className="admin-label">ADMIN DASHBOARD</p>
            <h1>Welcome back, {adminName}!</h1>
            <p>
              Manage your courses, learning materials and students from here.
            </p>
          </div>

          <div className="admin-avatar">
            {adminName.charAt(0).toUpperCase()}
          </div>
        </header>

        <section className="admin-stats">
          <div className="admin-stat-card">
            <div className="admin-stat-icon">📚</div>
            <div>
              <span>Total Courses</span>
              <strong>{courseCount}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">📄</div>
            <div>
              <span>Learning Materials</span>
              <strong>{materialCount}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">👥</div>
            <div>
              <span>Registered Students</span>
              <strong>{studentCount}</strong>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-icon">✓</div>
            <div>
              <span>Active Students</span>
              <strong>{activeStudentCount}</strong>
            </div>
          </div>
        </section>

        <section className="admin-overview">
          <div className="admin-section-header">
            <div>
              <h2>System Management</h2>
              <p>Manage the main areas of the E-Learn system.</p>
            </div>
          </div>

          <div className="admin-management-grid">
            <div className="admin-management-card">
              <div className="management-icon">📚</div>
              <h3>Course Management</h3>
              <p>Add, edit, view and remove courses available to students.</p>
              <Link to="/admin-courses" className="management-btn">
                Manage Courses
              </Link>
            </div>

            <div className="admin-management-card">
              <div className="management-icon">📄</div>
              <h3>Material Management</h3>
              <p>Upload and manage learning materials for different courses.</p>
              <Link to="/admin-materials" className="management-btn">
                Manage Materials
              </Link>
            </div>

            <div className="admin-management-card">
              <div className="management-icon">👥</div>
              <h3>Student Management</h3>
              <p>View registered students and manage student accounts.</p>
              <Link to="/admin-students" className="management-btn">
                Manage Students
              </Link>
            </div>
          </div>
        </section>

        <section className="admin-recent">
          <div className="admin-section-header">
            <div>
              <h2>Recent Registrations</h2>
              <p>The latest students to join the platform.</p>
            </div>
          </div>

          <div className="activity-list">
            {recentStudents.length > 0 ? (
              recentStudents.map((student) => (
                <div className="activity-item" key={student._id}>
                  <div className="activity-dot"></div>

                  <div>
                    <strong>{student.name}</strong>
                    <p>{student.email}</p>
                  </div>

                  <span>
                    {new Date(student.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="activity-item">
                <div className="activity-dot"></div>

                <div>
                  <strong>No students yet</strong>
                  <p>Students will appear here when they register.</p>
                </div>

                <span>—</span>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;