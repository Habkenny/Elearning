import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/CourseDetails.css";

const API = "http://localhost:5000/api/materials";

function CourseDetails() {
  const { courseId } = useParams();

  // The URL param is "Course Name|Course Code" (sent by Courses.jsx / Home.jsx)
  const [courseName, courseCode] = decodeURIComponent(courseId).split("|");

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
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
      .then((data) => {
        // Keep only the materials for THIS course
        const courseMaterials = (data.materials || []).filter(
          (m) =>
            (m.course || "General") === courseName &&
            (m.code || "") === courseCode,
        );
        setMaterials(courseMaterials);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Could not load course.");
        setLoading(false);
      });
  }, [courseId]);

  const handleDownload = async (material) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/${material._id}/download`, {
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
      a.download = material.originalName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setError("Download failed.");
    }
  };

  function formatSize(bytes) {
    if (!bytes) return "";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  return (
    <div className="course-details-page">
      <header className="course-details-header">
        <Link to="/courses" className="back-link">
          ← Back to Courses
        </Link>

        <div className="course-details-label">COURSE DETAILS</div>

        <h1>{courseName}</h1>
        <p className="course-category">{courseCode}</p>
        <p>Lecture notes, documents and learning resources for this course.</p>
      </header>

      <main className="course-details-content">
        {error && <p className="form-message error-message">{error}</p>}
        {loading && <p>Loading course...</p>}

        {!loading && !error && (
          <>
            <section className="course-info-grid">
              <div className="course-info-card">
                <span>Materials</span>
                <strong>{materials.length} Resources</strong>
              </div>

              <div className="course-info-card">
                <span>Course Code</span>
                <strong>{courseCode || "—"}</strong>
              </div>
            </section>

            <section className="course-topics">
              <h2>Course Materials</h2>

              {materials.length === 0 ? (
                <p>No materials uploaded for this course yet.</p>
              ) : (
                <div className="topic-list">
                  {materials.map((material, index) => (
                    <div
                      key={material._id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <span>
                        {String(index + 1).padStart(2, "0")} — {material.title}
                        <small style={{ marginLeft: "0.5rem", opacity: 0.7 }}>
                          {material.category} • {formatSize(material.fileSize)}
                        </small>
                      </span>

                      <button
                        onClick={() => handleDownload(material)}
                        style={{
                          padding: "0.4rem 0.9rem",
                          cursor: "pointer",
                        }}
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default CourseDetails;