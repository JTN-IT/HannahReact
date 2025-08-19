import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const BLOCK_TYPES = [
  { value: "text", label: "Text" },
  { value: "image", label: "Image" },
  { value: "link", label: "Link" },
];

export default function AdminPage() {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading, getAccessTokenSilently } = useAuth0();

  const [title, setTitle] = useState("");
  const [contentBlocks, setContentBlocks] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // Add new block
  const addBlock = () => {
    setContentBlocks([
      ...contentBlocks,
      { type: "text", value: "" }
    ]);
  };

  // Remove a block
  const removeBlock = (idx) => {
    setContentBlocks(contentBlocks.filter((_, i) => i !== idx));
  };

  // Change block type
  const changeBlockType = (idx, type) => {
    setContentBlocks(contentBlocks.map((block, i) =>
      i === idx
        ? { ...block, type, value: (type === "image" ? null : ""), file: undefined }
        : block
    ));
  };

  // Change block value (for text/link)
  const changeBlockValue = (idx, value) => {
    setContentBlocks(contentBlocks.map((block, i) =>
      i === idx ? { ...block, value } : block
    ));
  };

  // Change block file (for image)
  const changeBlockFile = (idx, file) => {
    setContentBlocks(contentBlocks.map((block, i) =>
      i === idx ? { ...block, file, value: file ? file.name : "" } : block
    ));
  };

  // Example submit handler (you can adapt for your API)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      // Prepare data (if sending files, use FormData)
      const formData = new FormData();
      formData.append("title", title);
      
      
      formData.append("blocks", JSON.stringify(contentBlocks));
      // And if you want to send images, you can keep appending files separately:
      contentBlocks.forEach((block, idx) => {
        if (block.type === "image" && block.file) {
          formData.append(`files[${idx}]`, block.file);
        }
      });

      // Get the Auth0 access token for the API
      const token = await getAccessTokenSilently();

      // Send to the Netlify function, with Authorization header
      const response = await fetch("/.netlify/functions/content-upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          // Note: Do NOT set Content-Type when sending FormData, browser will set it with boundary.
        },
        body: formData,
      });


      if (response.ok) setStatus("Submitted successfully!");
      else setStatus("Submission failed.");
    } catch (err) {
      setStatus("Error: " + err.message);
    } finally {
      setLoading(false);
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
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <h2>Welcome, {user && user.name}!</h2>
      <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
        Log Out
      </button>
      <form onSubmit={handleSubmit} style={{ marginTop: 32 }}>
        <div>
          <label>
            Title/Heading:
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{ marginLeft: 8, width: "70%" }}
              required
            />
          </label>
        </div>

        <h3 style={{ marginTop: 24 }}>Content Blocks</h3>
        {contentBlocks.map((block, idx) => (
          <div key={idx} style={{ border: "1px solid #ccc", padding: 16, marginBottom: 12 }}>
            <label>
              Block type:&nbsp;
              <select
                value={block.type}
                onChange={e => changeBlockType(idx, e.target.value)}
              >
                {BLOCK_TYPES.map(opt =>
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                )}
              </select>
            </label>
            <br />
            {block.type === "text" && (
              <textarea
                value={block.value}
                onChange={e => changeBlockValue(idx, e.target.value)}
                placeholder="Enter text..."
                style={{ width: "100%", marginTop: 8 }}
                rows={4}
              />
            )}
            {block.type === "image" && (
              <input
                type="file"
                accept="image/*"
                onChange={e => changeBlockFile(idx, e.target.files[0])}
                style={{ marginTop: 8 }}
              />
            )}
            {block.type === "link" && (
              <input
                type="url"
                value={block.value}
                onChange={e => changeBlockValue(idx, e.target.value)}
                placeholder="Enter link URL..."
                style={{ width: "100%", marginTop: 8 }}
              />
            )}
            <button type="button" onClick={() => removeBlock(idx)} style={{ marginTop: 8, color: "red" }}>
              Remove Block
            </button>
          </div>
        ))}
        <button type="button" onClick={addBlock} style={{ marginBottom: 16 }}>
          Add Content Block
        </button>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Page"}
          </button>
        </div>
        {status && <div style={{ marginTop: 16 }}>{status}</div>}
      </form>
    </div>
  );
}