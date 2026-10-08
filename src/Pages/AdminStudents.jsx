import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/AdminStudents.css";

const STUDENTS_API = "http://localhost:5000/api/students";
const COURSES_API = "http://localhost:5000/api/courses";

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [courseOptions, setCourseOptions] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    status: "Active",
  });

  useEffect(() => {
    loadStudents();
    loadCourseOptions();
  }, []);

  function getHeaders() {
    return { Authorization: `Bearer ${localStorage.getItem("token")}` };
  }

  function loadStudents() {
    fetch(STUDENTS_API, { headers: getHeaders() })
      .then((res) => res.json())
      .then((data) => setStudents(data.students || []))
      .catch(() => setError("Could not load students."));
  }

  function loadCourseOptions() {
    fetch(COURSES_API, { headers: getHeaders() })
      .then((res) => res.json())
      .then((data) => setCourseOptions(data.courses || []))
      .catch(() => {});
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${STUDENTS_API}/${editingStudent._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getHeaders(),
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Update failed.");
        return;
      }

      setSuccess("Student updated successfully!");
      resetForm();
      loadStudents();
    } catch {
      setError("Unable to connect to the server.");
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone || "",
      course: student.course || "",
      status: student.status || "Active",
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student account?")) {
      return;
    }

    try {
      const response = await fetch(`${STUDENTS_API}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Delete failed.");
        return;
      }

      setSuccess("Student deleted.");
      loadStudents();
    } catch {
      setError("Delete failed.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      course: "",
      status: "Active",
    });
    setEditingStudent(null);
    setIsFormOpen(false);
  };

  const filteredStudents = students.filter((student) => {
    const search = searchTerm.toLowerCase();
    return (
      (student.name || "").toLowerCase().includes(search) ||
      (student.email || "").toLowerCase().includes(search) ||
      (student.course || "").toLowerCase().includes(search)
    );
  });

  return (
    <div className="admin-students-page">
      <header className="admin-students-header">
        <div>
          <Link to="/admin-dashboard" className="admin-students-back">
            ← Back to Dashboard
          </Link>

          <p className="admin-students-label">STUDENT MANAGEMENT</p>

          <h1>Students</h1>

          <p>View and manage registered students on the E-Learn platform.</p>
        </div>
      </header>

      {error && <p className="form-message error-message">{error}</p>}
      {success && <p className="form-message success-message">{success}</p>}

      {isFormOpen && (
        <section className="student-form-card">
          <div className="student-form-header">
            <div>
              <h2>Edit Student</h2>
              <p>Update the student information below.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="student-form">
            <div className="student-form-grid">
              <div className="student-form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="student-form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="student-form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="e.g. 08012345678"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="student-form-group">
                <label>Course</label>
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
              </div>

              <div className="student-form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="student-form-actions">
              <button
                type="button"
                className="cancel-student-btn"
                onClick={resetForm}
              >
                Cancel
              </button>

              <button type="submit" className="save-student-btn">
                Save Changes
              </button>
            </div>
          </form>
        </section>
      )}

      {selectedStudent && (
        <section className="student-details-card">
          <div className="student-details-header">
            <div>
              <p className="student-details-label">STUDENT DETAILS</p>
              <h2>{selectedStudent.name}</h2>
              <p>Full information about this student.</p>
            </div>

            <button
              className="close-details-btn"
              onClick={() => setSelectedStudent(null)}
            >
              Close
            </button>
          </div>

          <div className="student-details-grid">
            <div className="student-detail-item">
              <span>Full Name</span>
              <strong>{selectedStudent.name}</strong>
            </div>

            <div className="student-detail-item">
              <span>Email Address</span>
              <strong>{selectedStudent.email}</strong>
            </div>

            <div className="student-detail-item">
              <span>Phone Number</span>
              <strong>{selectedStudent.phone || "—"}</strong>
            </div>

            <div className="student-detail-item">
              <span>Course</span>
              <strong>{selectedStudent.course || "—"}</strong>
            </div>

            <div className="student-detail-item">
              <span>Status</span>
              <strong>{selectedStudent.status || "Active"}</strong>
            </div>

            <div className="student-detail-item">
              <span>Registered</span>
              <strong>
                {new Date(selectedStudent.createdAt).toLocaleDateString()}
              </strong>
            </div>
          </div>
        </section>
      )}

      <section className="admin-students-section">
        <div className="students-list-header">
          <div>
            <h2>All Students</h2>
            <p>{students.length} registered students</p>
          </div>

          <input
            type="text"
            className="student-search"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="admin-students-list">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div className="admin-student-card" key={student._id}>
                <div className="student-avatar">
                  {student.name.charAt(0).toUpperCase()}
                </div>

                <div className="admin-student-info">
                  <h3>{student.name}</h3>
                  <p>{student.email}</p>
                  <span>
                    {student.course || "No course assigned"}
                    {student.phone && ` • ${student.phone}`}
                  </span>
                </div>

                <div className="student-status">
                  <span
                    className={
                      student.status === "Active"
                        ? "status-active"
                        : "status-inactive"
                    }
                  >
                    {student.status || "Active"}
                  </span>
                </div>

                <div className="student-actions">
                  <button
                    className="view-student-btn"
                    onClick={() => setSelectedStudent(student)}
                  >
                    View
                  </button>

                  <button
                    className="edit-student-btn"
                    onClick={() => handleEdit(student)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-student-btn"
                    onClick={() => handleDelete(student._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-students">
              <h3>No students found</h3>
              <p>
                {searchTerm
                  ? "Try searching with a different name, email or course."
                  : "No students have registered yet."}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminStudents;