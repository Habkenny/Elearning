import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function StudentLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <Link to="/" className="dashboard-logo">
          E-Learn
        </Link>

        <nav className="dashboard-nav">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>⌂</span>
            Dashboard
          </NavLink>

          <NavLink
            to="/courses"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>📚</span>
            My Courses
          </NavLink>

          <NavLink
            to="/materials"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>📄</span>
            Materials
          </NavLink>

          <NavLink
            to="/profile"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>👤</span>
            Profile
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <NavLink
            to="/settings"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span>⚙</span>
            Settings
          </NavLink>

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

      {/* Page content */}
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}

export default StudentLayout;