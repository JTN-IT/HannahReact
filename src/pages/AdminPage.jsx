import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function AdminPage() {
  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0();

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
      <form onSubmit={handleUpload}>
        <label>
          Type:
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="project">Project (.json)</option>
            <option value="blog">Blog Post (.md)</option>
          </select>
        </label>
        <br />
        <input type="file" accept={type === 'project' ? '.json' : '.md'} onChange={e => setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
    </div> 
  );
}