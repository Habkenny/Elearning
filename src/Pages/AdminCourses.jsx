import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/AdminCourses.css";

const API = "http://localhost:5000/api/courses";

function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    title: "",
    category: "",
    instructor: "",
    duration: "",
  });

  useEffect(() => {
    loadCourses();
  }, []);

  function loadCourses() {
    const token = localStorage.getItem("token");

    fetch(API, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.courses) {
          setCourses(data.courses);
        }
      })
      .catch(() => setError("Could not load courses."));
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.code || !formData.title) {
      setError("Course code and title are required.");
      return;
    }

    if (!editingCourse && !file) {
      setError("Please choose a course file (PDF) to upload.");
      return;
    }

    // Multipart form: details + file together
    const data = new FormData();
    data.append("code", formData.code);
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("instructor", formData.instructor);
    data.append("duration", formData.duration);
    if (file) {
      data.append("file", file);
    }

    try {
      const token = localStorage.getItem("token");

      const url = editingCourse ? `${API}/${editingCourse._id}` : API;
      const method = editingCourse ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` }, // no Content-Type — FormData sets it
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Save failed.");
        return;
      }

      setSuccess(editingCourse ? "Course updated!" : "Course uploaded successfully!");
      resetForm();
      loadCourses();
    } catch {
      setError("Unable to connect to the server.");
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      code: course.code,
      title: course.title,
      category: course.category || "",
      instructor: course.instructor || "",
      duration: course.duration || "",
    });
    setFile(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      loadCourses();
    } catch {
      setError("Delete failed.");
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      title: "",
      category: "",
      instructor: "",
      duration: "",
    });
    setEditingCourse(null);
    setFile(null);
    setIsFormOpen(false);
  };

  function formatSize(bytes) {
    if (!bytes) return "";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  return (
    <div className="admin-courses-page">
      <header className="admin-courses-header">
        <div>
          <Link to="/admin-dashboard" className="admin-courses-back">
            ← Back to Dashboard
          </Link>

          <p className="admin-courses-label">COURSE MANAGEMENT</p>

          <h1>Courses</h1>

          <p>Upload and manage courses on the E-Learn platform.</p>
        </div>

        <button
          className="add-course-btn"
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
        >
          + Upload Course
        </button>
      </header>

      {error && <p className="form-message error-message">{error}</p>}
      {success && <p className="form-message success-message">{success}</p>}

      {isFormOpen && (
        <section className="course-form-card">
          <div className="course-form-header">
            <div>
              <h2>{editingCourse ? "Edit Course" : "Upload New Course"}</h2>
              <p>
                {editingCourse
                  ? "Update the details below. Choose a new file only if you want to replace the current one."
                  : "Enter the course details and choose its file (PDF)."}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="course-form">
            <div className="course-form-grid">
              <div className="course-form-group">
                <label>Course Code *</label>
                <input
                  type="text"
                  name="code"
                  placeholder="e.g. SWD 323"
                  value={formData.code}
                  onChange={handleChange}
                />
              </div>

              <div className="course-form-group">
                <label>Course Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. JavaScript Programming"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div className="course-form-group">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  placeholder="e.g. Web Development"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>

              <div className="course-form-group">
                <label>Instructor</label>
                <input
                  type="text"
                  name="instructor"
                  placeholder="Enter instructor name"
                  value={formData.instructor}
                  onChange={handleChange}
                />
              </div>

              <div className="course-form-group">
                <label>Duration</label>
                <input
                  type="text"
                  name="duration"
                  placeholder="e.g. 8 Weeks"
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>

              <div className="course-form-group full-width">
                <label>
                  Course File {!editingCourse && "*"}
                  {editingCourse && courseFileNote()}
                </label>
                <input
                  type="file"
                  accept=".pdf,image/*,.doc,.docx,.ppt,.pptx,.mp4"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                {file && <small>Selected: {file.name}</small>}
                {!file && editingCourse && (
                  <small>
                    Current file: {editingCourse.originalName || "none"} (
                    {formatSize(editingCourse.fileSize)})
                  </small>
                )}
              </div>
            </div>

            <div className="course-form-actions">
              <button
                type="button"
                className="cancel-course-btn"
                onClick={resetForm}
              >
                Cancel
              </button>

              <button type="submit" className="save-course-btn">
                {editingCourse ? "Save Changes" : "Upload Course"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="admin-courses-section">
        <div className="courses-list-header">
          <div>
            <h2>All Courses</h2>
            <p>{courses.length} courses available</p>
          </div>
        </div>

        <div className="admin-courses-list">
          {courses.map((course) => (
            <div className="admin-course-card" key={course._id}>
              <div className="course-code-box">{course.code}</div>

              <div className="admin-course-info">
                <h3>{course.title}</h3>

                <p>
                  {course.category} • {course.instructor}
                </p>

                <span>
                  {course.duration}
                  {course.fileSize > 0 &&
                    ` • ${course.originalName} (${formatSize(course.fileSize)})`}
                </span>
              </div>

              <div className="course-actions">
                <button
                  className="edit-course-btn"
                  onClick={() => handleEdit(course)}
                >
                  Edit
                </button>

                <button
                  className="delete-course-btn"
                  onClick={() => handleDelete(course._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  // Small helper for the label
  function courseFileNote() {
    return null;
  }
}

export default AdminCourses;