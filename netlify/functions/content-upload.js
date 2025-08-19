const fetch = require("node-fetch");
const jwt = require("jsonwebtoken"); // or use @auth0/jwt-decode for Auth0 tokens

// These should be set in Netlify's environment variables
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = "JTN-IT/HannahReact";
const GITHUB_OWNER = "JTN-IT";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Step 1: Verify Auth0 JWT
  const authHeader = event.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");
  try {
    // Replace with your Auth0 domain and audience
    const decoded = jwt.verify(token, process.env.AUTH0_PUBLIC_KEY, {
      audience: process.env.AUTH0_AUDIENCE,
      issuer: `https://${process.env.AUTH0_DOMAIN}/`,
      algorithms: ["RS256"],
    });
    // Optional: Check for admin role here
  } catch (err) {
    return { statusCode: 401, body: "Invalid token" };
  }

  // Step 2: Parse and validate the incoming content
  const formData = JSON.parse(event.body); // You may need to parse multipart if you support file uploads

  // Example: require at least a title and blocks
  if (!formData.title || !Array.isArray(formData.blocks)) {
    return { statusCode: 400, body: "Invalid payload" };
  }

  // Step 3: Build file content (e.g. Markdown, JSON)
  // This is up to your content model!
  const fileContent = JSON.stringify(formData, null, 2);
  const filename = `content/${Date.now()}-${formData.title.replace(/[^\w]+/g, "-")}.json`;

  // Step 4: Write to GitHub (create or update file)
  const githubApiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filename}`;
  const message = `Admin content upload: ${formData.title}`;

  // Get latest SHA if file exists (for update)
  let sha;
  try {
    const res = await fetch(githubApiUrl, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    if (res.status === 200) {
      const data = await res.json();
      sha = data.sha;
    }
  } catch (e) { /* Ignore not found */ }

  const res = await fetch(githubApiUrl, {
    method: "PUT",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      content: Buffer.from(fileContent).toString("base64"),
      sha,
    }),
  });

  if (res.ok) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Content uploaded to GitHub", path: filename }),
    };
  } else {
    const errorText = await res.text();  // <-- Capture GitHub error
    return { statusCode: 500, body: `GitHub upload failed: ${errorText}` };
  }
};