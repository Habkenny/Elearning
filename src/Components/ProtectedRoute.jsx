import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ requireAdmin = false }) {
  const token = localStorage.getItem("token");

  // Not logged in at all → go to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Admin-only route but user is a student → go to their dashboard
  if (requireAdmin) {
    let user = {};
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        user = JSON.parse(storedUser);
      } catch {
        return <Navigate to="/login" replace />;
      }
    }

    if (!user.isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Authorized → show the page (Outlet = "render whatever child route matched")
  return <Outlet />;
}

export default ProtectedRoute;