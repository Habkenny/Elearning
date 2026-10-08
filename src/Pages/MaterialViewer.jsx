import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/MaterialViewer.css";

const API = "http://localhost:5000/api/materials";

function MaterialViewer() {
  const { materialId } = useParams();

  const [material, setMaterial] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 1. Get the material's details
    fetch(`${API}/${materialId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Material not found");
        return res.json();
      })
      .then(async (data) => {
        setMaterial(data.material);

        // 2. Get the actual file as a blob for previewing
        const fileRes = await fetch(`${API}/${materialId}/download`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!fileRes.ok) throw new Error("Could not load the file");

        const blob = await fileRes.blob();
        const url = window.URL.createObjectURL(blob);
        setFileUrl(url);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Could not load material.");
        setLoading(false);
      });

    // Cleanup: release the blob URL when leaving the page
    return () => {
      if (fileUrl) window.URL.revokeObjectURL(fileUrl);
    };
  }, [materialId]);

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/${materialId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

  if (loading) {
    return (
      <div className="material-viewer-page">
        <p>Loading material...</p>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="material-viewer-page">
        <h1>Material Not Found</h1>
        <p>{error || "The learning material you are looking for does not exist."}</p>

        <Link to="/materials" className="back-viewer-btn">
          Back to Materials
        </Link>
      </div>
    );
  }

  const isPdf = material.fileType === "application/pdf";
  const isImage = material.fileType && material.fileType.startsWith("image/");

  return (
    <div className="material-viewer-page">
      {/* Header */}
      <header className="viewer-header">
        <Link to={`/material/${materialId}`} className="viewer-back-link">
          ← Back to Material Details
        </Link>

        <p className="viewer-label">LEARNING MATERIAL</p>

        <h1>{material.title}</h1>

        <p className="viewer-course">
          {material.course} • {material.code}
        </p>

        <button
          className="complete-material-btn"
          style={{ marginTop: "0.5rem" }}
          onClick={handleDownload}
        >
          Download File
        </button>
      </header>

      {/* File Preview */}
      <main className="viewer-content">
        <div className="viewer-card">
          {isPdf && fileUrl && (
            <iframe
              src={fileUrl}
              title={material.title}
              width="100%"
              height="700px"
              style={{ border: "none", borderRadius: "8px" }}
            ></iframe>
          )}

          {isImage && fileUrl && (
            <img
              src={fileUrl}
              alt={material.title}
              style={{ maxWidth: "100%", borderRadius: "8px" }}
            />
          )}

          {!isPdf && !isImage && (
            <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
              <h2>Preview not available for this file type</h2>
              <p>
                This file ({material.originalName}) can't be displayed in the
                browser. Download it to view.
              </p>

              <button
                className="complete-material-btn"
                onClick={handleDownload}
              >
                Download {material.originalName}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MaterialViewer;