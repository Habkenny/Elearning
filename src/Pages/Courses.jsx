import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Courses.css";

const API = "http://localhost:5000/api/courses";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(API, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          throw new Error("Please log in first");
        }
        return res.json();
      })
      .then((data) => setCourses(data.courses || []))
      .catch((err) => setError(err.message || "Could not load courses."));
  }, []);

  const handleDownload = async (course) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/${course._id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setError("Download failed.");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = course.originalName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setError("Download failed.");
    }
  };

  return (
    <div className="courses-page">
      <header className="courses-header">
        <Link to="/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>

        <p className="courses-label">MY COURSES</p>

        <h1>Computer Science Courses</h1>

        <p className="explore">
          Explore your courses and download course materials.
        </p>
      </header>

      <main className="courses-content">
        {error && <p className="form-message error-message">{error}</p>}

        {courses.length === 0 && !error && (
          <p>No courses available yet.</p>
        )}

        <div className="courses-grid">
          {courses.map((course) => (
            <div className="course-card" key={course._id}>
              <div className="course-card-top">
                <span className="course-code">{course.code}</span>
                <span className="course-category">
                  {course.category || "Course"}
                </span>
              </div>

              <h2>{course.title}</h2>

              <p className="course-description">
                Instructor: {course.instructor || "—"} • Duration:{" "}
                {course.duration || "—"}
              </p>

              {course.fileSize > 0 ? (
                <button
                  className="course-button"
                  style={{
                    display: "inline-block",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => handleDownload(course)}
                >
                  Download Course File
                </button>
              ) : (
                <p>
                  <small>No file uploaded for this course yet.</small>
                </p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Courses;