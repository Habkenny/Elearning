import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/AdminMaterials.css";

const API = "http://localhost:5000/api/materials";

function AdminMaterials() {
  const [materials, setMaterials] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    course: "",
    code: "",
    topic: "",
    category: "PDF",
    description: "",
  });

  useEffect(() => {
    loadMaterials();
  }, []);

  function loadMaterials() {
    const token = localStorage.getItem("token");

    fetch(API, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.materials) {
          setMaterials(data.materials);
        }
      })
      .catch(() => setError("Could not load materials."));
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title || !formData.course || !formData.code || !file) {
      setError("Please fill in all fields and choose a file.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("course", formData.course);
    data.append("code", formData.code);
    data.append("topic", formData.topic);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Upload failed.");
        return;
      }

      setSuccess("Material uploaded successfully!");
      setFormData({
        title: "",
        course: "",
        code: "",
        topic: "",
        category: "PDF",
        description: "",
      });
      setFile(null);
      setIsFormOpen(false);
      loadMaterials();
    } catch {
      setError("Unable to connect to the server.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this material?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      loadMaterials();
    } catch {
      setError("Delete failed.");
    }
  };

  function formatSize(bytes) {
    if (!bytes) return "";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  return (
    <div className="admin-materials-page">
      <header className="admin-materials-header">
        <div>
          <Link to="/admin-dashboard" className="admin-materials-back">
            ← Back to Dashboard
          </Link>

          <p className="admin-materials-label">MATERIAL MANAGEMENT</p>
          <h1>Learning Materials</h1>
          <p>
            Manage lecture notes, documents and learning resources available to
            students.
          </p>
        </div>

        <button
          className="add-material-btn"
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          + Add Material
        </button>
      </header>

      {error && <p className="form-message error-message">{error}</p>}
      {success && <p className="form-message success-message">{success}</p>}

      {isFormOpen && (
        <section className="material-form-card">
          <div className="material-form-header">
            <div>
              <h2>Upload New Material</h2>
              <p>Choose a file and enter its details.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="material-form">
            <div className="material-form-grid">
              <div className="material-form-group">
                <label>Material Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. JavaScript Functions"
                />
              </div>

              <div className="material-form-group">
                <label>Course</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                >
                  <option value="">Select course</option>
                  <option value="JavaScript Programming">
                    JavaScript Programming
                  </option>
                  <option value="Database Design">Database Design</option>
                  <option value="Python Programming">
                    Python Programming
                  </option>
                  <option value="Front End Development">
                    Front End Development
                  </option>
                  <option value="Back End Development">
                    Back End Development
                  </option>
                  <option value="Human-Computer Interaction">
                    Human-Computer Interaction
                  </option>
                </select>
              </div>

              <div className="material-form-group">
                <label>Course Code</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="e.g. SWD 323"
                />
              </div>

              <div className="material-form-group">
                <label>Topic</label>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  placeholder="e.g. JavaScript Functions"
                />
              </div>

              <div className="material-form-group">
                <label>Material Type</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="PDF">PDF</option>
                  <option value="Image">Image</option>
                  <option value="Document">Document (DOC)</option>
                  <option value="Presentation">Presentation (PPT)</option>
                  <option value="Video">Video</option>
                </select>
              </div>

              <div className="material-form-group full-width">
                <label>File</label>
                <input
                  type="file"
                  accept=".pdf,image/*,.doc,.docx,.ppt,.pptx,.mp4"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                {file && <small>Selected: {file.name}</small>}
              </div>
            </div>

            <div className="material-form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Enter a short description of the material"
              ></textarea>
            </div>

            <div className="material-form-actions">
              <button
                type="button"
                className="cancel-material-btn"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="save-material-btn">
                Upload Material
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="admin-materials-section">
        <div className="materials-list-header">
          <div>
            <h2>All Materials</h2>
            <p>{materials.length} learning resources available</p>
          </div>
        </div>

        <div className="admin-materials-list">
          {materials.map((material) => (
            <div className="admin-material-card" key={material._id}>
              <div className="material-type-box">
                {material.category ||
                  (material.originalName || "").split(".").pop().toUpperCase()}
              </div>

              <div className="admin-material-info">
                <h3>{material.title}</h3>
                <p>
                  {material.course} • {material.code}
                </p>
                <span>{formatSize(material.fileSize)}</span>
              </div>

              <div className="material-actions">
                <button
                  className="delete-material-btn"
                  onClick={() => handleDelete(material._id)}
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
}

export default AdminMaterials;