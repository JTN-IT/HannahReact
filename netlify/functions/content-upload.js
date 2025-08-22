const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

// These should be set in Netlify's environment variables
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO  = process.env.GITHUB_REPO;
const GITHUB_OWNER = process.env.GITHUB_OWNER;

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function(err, key) {
    if (err) {
      callback(err);
    } else {
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    }
  });
}

exports.handler = async (event) => {

    console.log("Handler start");

    // Log headers for debugging
    console.log("Headers:", event.headers);
    
    const authHeader = event.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "");
    console.log("Token:", token);

    const { IncomingForm } = require("formidable");
    const { Buffer } = require("buffer");
    const { PassThrough } = require("stream");

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Step 1: Verify Auth0 JWT
    let decoded;
    try {
        decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, getKey, {
            audience: process.env.AUTH0_AUDIENCE,
            issuer: `https://${process.env.AUTH0_DOMAIN}/`,
            algorithms: ["RS256"],
        }, (err, decodedToken) => {
            if (err) reject(err);
            else resolve(decodedToken);
        });
        });
        // Optional: Check for admin role here
    } catch (err) {
        return { statusCode: 401, body: "Invalid token: " + err.message };
    }
    console.log("Decoded JWT:", decoded);

    


    
    // Netlify sends multipart bodies as base64-encoded strings
    const isBase64 = event.isBase64Encoded;
    const bodyBuffer = Buffer.from(event.body, isBase64 ? "base64" : "utf8");

    // Formidable requires a Node.js IncomingMessage stream,
    // so we fake one using a PassThrough stream:
    const stream = new PassThrough();
    stream.end(bodyBuffer);

    // Defensive: Lowercase all headers and provide fallback for missing
    const lowercasedHeaders = {};
    for (const k in event.headers) {
      lowercasedHeaders[k.toLowerCase()] = event.headers[k];
    }
    // Fallbacks for formidable: always provide content-type and content-length, even if empty
    lowercasedHeaders["content-type"] = lowercasedHeaders["content-type"] || "";
    lowercasedHeaders["content-length"] = lowercasedHeaders["content-length"] || "0";

    // Attach headers to the stream (formidable v3+ looks for headers property)
    stream.headers = lowercasedHeaders;

    // Wrap formidable in a Promise for async/await
    const form = new IncomingForm();
    let fields, files;
    try {
      ({ fields, files } = await new Promise((resolve, reject) => {
        form.parse(stream, (err, flds, fls) => {
            if (err) reject(err);
            else resolve({ fields: flds, files: fls });
        });
      }));
    } catch (err) {
      console.error("Formidable error:", err);
      return { statusCode: 400, body: "Error parsing form-data: " + err.message };
    }

    if (!fields.title || !fields.blocks) {
    return { statusCode: 400, body: "Invalid payload" };
    }


    // If blocks is sent as JSON in a text field, parse it:
    let blocks;
    try {
    blocks = JSON.parse(fields.blocks);
    if (!Array.isArray(blocks)) throw new Error();
    } catch {
        return { statusCode: 400, body: "Invalid blocks array" };
    }


    // Step 4: Build file content (store fields, parsed blocks, file metadata)
    const fileContent = JSON.stringify({
        ...fields,
        blocks, // Parsed above
        files // Will contain file metadata and paths
        }, null, 2);
    
    // Sanitize filename
    const safeTitle = String(fields.title).replace(/[^\w]+/g, "-");
    const filename = `content/projects/${Date.now()}-${safeTitle}.json`;


    // GitHub API
    const githubApiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filename}`;
    const message = `Admin content upload: ${fields.title}`;
    

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






