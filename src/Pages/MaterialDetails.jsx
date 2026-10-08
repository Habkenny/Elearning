import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/MaterialDetails.css";

const API = "http://localhost:5000/api/materials";

function MaterialDetails() {
  const { materialId } = useParams();

  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API}/${materialId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 404) throw new Error("Material not found");
        return res.json();
      })
      .then((data) => {
        setMaterial(data.material);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Could not load material.");
        setLoading(false);
      });
  }, [materialId]);

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/${materialId}/download`, {
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

  if (loading) {
    return (
      <div className="material-details-page">
        <p>Loading material...</p>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="material-details-page">
        <h1>Material Not Found</h1>
        <p>{error || "The material you are looking for does not exist."}</p>

        <Link to="/materials" className="back-material-btn">
          Back to Materials
        </Link>
      </div>
    );
  }

  return (
    <div className="material-details-page">
      {/* Header */}
      <div className="material-details-header">
        <Link to="/materials" className="back-link">
          ← Back to Materials
        </Link>

        <p className="material-label">LEARNING MATERIAL</p>

        <h1>{material.title}</h1>

        <p className="material-course">
          {material.course} • {material.code}
        </p>
      </div>

      {/* Material Card */}
      <section className="material-details-card">
        <div className="material-preview">
          <div className="material-file-icon">
            {(material.originalName || "").split(".").pop().toUpperCase()}
          </div>

          <div>
            <h2>{material.title}</h2>
            <p>{material.description || "No description provided."}</p>
          </div>
        </div>

        {/* Material Information */}
        <div className="material-info">
          <div>
            <span>Course</span>
            <strong>{material.course || "—"}</strong>
          </div>

          <div>
            <span>Topic</span>
            <strong>{material.topic || "—"}</strong>
          </div>

          <div>
            <span>File Type</span>
            <strong>{material.category || "—"}</strong>
          </div>

          <div>
            <span>File Size</span>
            <strong>{formatSize(material.fileSize)}</strong>
          </div>

          <div>
            <span>Uploaded</span>
            <strong>{new Date(material.createdAt).toLocaleDateString()}</strong>
          </div>
        </div>

        {/* Actions */}
        <div className="material-actions">
          <Link
            to={`/material/${materialId}/view`}
            className="view-material-btn"
          >
            View Material
          </Link>

          <button className="download-material-btn" onClick={handleDownload}>
            Download
          </button>
        </div>
      </section>
    </div>
  );
}

export default MaterialDetails;