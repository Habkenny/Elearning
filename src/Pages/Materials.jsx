import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Materials.css";

const API = "http://localhost:5000/api/materials";

function Materials() {
  const [materials, setMaterials] = useState([]);
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
      .then((data) => setMaterials(data.materials || []))
      .catch((err) => setError(err.message || "Could not load materials."));
  }, []);

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
    <div className="materials-page">
      <header className="materials-header">
        <Link to="/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>

        <p className="materials-label">LEARNING MATERIALS</p>

        <h1>Course Materials</h1>

        <p>
          Access lecture notes, learning resources and other materials for your
          Computer Science courses.
        </p>
      </header>

      <main className="materials-content">
        <div className="materials-toolbar">
          <div>
            <h2>All Materials</h2>
            <p>{materials.length} learning resources available</p>
          </div>
        </div>

        {error && <p className="form-message error-message">{error}</p>}

        <div className="materials-list">
          {materials.map((material) => (
            <div className="material-card" key={material._id}>
              <div className="material-type">
                {(material.originalName || "").split(".").pop().toUpperCase()}
              </div>

              <div className="material-details">
                <h3>
                  <Link to={`/material/${material._id}`}>
                    {material.title}
                  </Link>
                </h3>
                <p>
                  {material.course} • {material.code}
                </p>
                <small>{formatSize(material.fileSize)}</small>
              </div>

              <button
                className="view-material-btn"
                onClick={() => handleDownload(material)}
              >
                Download
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Materials;