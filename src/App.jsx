import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import CourseDetails from "./Pages/CourseDetails";
import Courses from "./Pages/Courses";
import Materials from "./Pages/Materials";
import StudentLayout from "./Pages/StudentLayout";
import Profile from "./Pages/Profile";
import MaterialDetails from "./Pages/MaterialDetails";
import MaterialViewer from "./Pages/MaterialViewer";
import AdminLogin from "./Pages/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminCourses from "./Pages/AdminCourses";
import AdminMaterials from "./Pages/AdminMaterials";
import AdminStudents from "./Pages/AdminStudents";
import AdminSettings from "./Pages/AdminSettings";
import StudentSettings from "./Pages/StudentSettings";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/register" element={<Register />} />

      {/* Admin pages — must be logged in AND isAdmin */}
      <Route element={<ProtectedRoute requireAdmin />}>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-courses" element={<AdminCourses />} />
        <Route path="/admin-materials" element={<AdminMaterials />} />
        <Route path="/admin-students" element={<AdminStudents />} />
        <Route path="/admin-settings" element={<AdminSettings />} />
      </Route>

      {/* Student pages — must be logged in */}
      <Route element={<ProtectedRoute />}>
        <Route element={<StudentLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<StudentSettings />} />
        </Route>

        <Route path="/course-details/:courseId" element={<CourseDetails />} />
        <Route path="/material/:materialId" element={<MaterialDetails />} />
        <Route path="/material/:materialId/view" element={<MaterialViewer />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;