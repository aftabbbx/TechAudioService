const express = require("express");
const router = express.Router();
const https = require("https");
const http = require("http");

/**
 * GET /api/download?url=<encoded_url>&filename=<name>
 *
 * Server-side proxy that fetches the PDF from any URL (Cloudinary, local, etc.)
 * and streams it to the browser as a forced download.
 * This bypasses all CORS restrictions and Cloudinary's free-plan delivery blocks.
 */
router.get("/", (req, res) => {
  const { url, filename = "datasheet.pdf" } = req.query;

  if (!url) {
    return res.status(400).json({ success: false, message: "No URL provided." });
  }

  let decodedUrl;
  try {
    decodedUrl = decodeURIComponent(url);
  } catch {
    return res.status(400).json({ success: false, message: "Invalid URL." });
  }

  // Only allow Cloudinary and our own render domain (security)
  const allowedHosts = ["res.cloudinary.com", "onrender.com", "localhost"];
  let parsedUrl;
  try {
    parsedUrl = new URL(decodedUrl);
  } catch {
    return res.status(400).json({ success: false, message: "Malformed URL." });
  }

  const isAllowed = allowedHosts.some((host) => parsedUrl.hostname.includes(host));
  if (!isAllowed) {
    return res.status(403).json({ success: false, message: "URL not allowed." });
  }

  // Set headers to force download
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Cache-Control", "no-cache");

  const protocol = parsedUrl.protocol === "https:" ? https : http;

  const request = protocol.get(decodedUrl, (fileRes) => {
    if (fileRes.statusCode !== 200) {
      return res.status(502).json({
        success: false,
        message: `Failed to fetch file. Status: ${fileRes.statusCode}`,
      });
    }
    // Pipe the PDF directly from Cloudinary/Render → browser
    fileRes.pipe(res);
  });

  request.on("error", (err) => {
    console.error("Download proxy error:", err.message);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Failed to fetch the file." });
    }
  });
});

module.exports = router;
