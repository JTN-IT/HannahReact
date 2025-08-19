const jwt = require("jsonwebtoken"); // or use @auth0/jwt-decode for Auth0 tokens

// These should be set in Netlify's environment variables
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO  = process.env.GITHUB_REPO;
const GITHUB_OWNER = process.env.GITHUB_OWNER;

exports.handler = async (event) => {

    const { IncomingForm } = require("formidable");
    const { Buffer } = require("buffer");
    const { PassThrough } = require("stream");

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



    
    // Netlify sends multipart bodies as base64-encoded strings
    const isBase64 = event.isBase64Encoded;
    const bodyBuffer = Buffer.from(event.body, isBase64 ? "base64" : "utf8");

    // Formidable requires a Node.js IncomingMessage stream,
    // so we fake one using a PassThrough stream:
    const stream = new PassThrough();
    stream.end(bodyBuffer);

    // Create headers for formidable (content-type is required). 
    // Content-type added by browser, not FormData!
    const headers = {
        "content-type": event.headers["content-type"] || event.headers["Content-Type"]
    };

    // Wrap formidable in a Promise for async/await
    const form = new IncomingForm();

    const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(stream, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
        });
    });


    /* copilot got confused and wants to trash this, but I trust its focus before it went stupid again. Saving for reference:
    const { fields, files } = await new Promise((resolve, reject) => {
        form.parse({ headers, pipe: s => stream.pipe(s) }, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
        });
    });
    */

    // Now I have:
    // fields -> all regular fields (title, etc)
    // files  -> uploaded files


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






