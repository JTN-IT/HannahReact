import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function AdminPage() {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();

  const [type, setType] = useState("project");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus("Please select a file to upload.");
      return;
    }
    setLoading(true);
    setStatus("");

    const formData = new FormData();
    formData.append("type", type);
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        headers: {
          // Auth header if needed, or Auth0 token
          // Example: Authorization: `Bearer ${your_token}`
        },
      });

      if (response.ok) {
        setStatus("Upload successful!");
      } else {
        const errorText = await response.text();
        setStatus(`Upload failed: ${errorText}`);
      }
    } catch (error) {
      setStatus(`Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return (
      <div>
        <h2>Admin Login</h2>
        <button onClick={() => loginWithRedirect()}>Log In</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Welcome, {user && user.name}!</h2>
      <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
        Log Out
      </button>
      <form onSubmit={handleUpload} style={{ marginTop: 32 }}>
        <label>
          Type:
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="project">Project (.json)</option>
            <option value="blog">Blog Post (.md)</option>
          </select>
        </label>
        <br />
        <input
          type="file"
          accept={type === "project" ? ".json" : ".md"}
          onChange={e => setFile(e.target.files[0])}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {status && <div style={{ marginTop: 16 }}>{status}</div>}
    </div>
  );
}