const express = require("express");
const router = express.Router();
const https = require("https");
const http = require("http");

/**
 * GET /api/download?url=<encoded_url>&filename=<name>
 *
 * Server-side proxy: fetches the PDF server-to-server (no CORS, no browser block)
 * and streams it to the client as a forced download.
 *
 * FIX: Headers are set ONLY after confirming the upstream responds with 200.
 * Previously headers were sent before the upstream response, causing ERR_INVALID_RESPONSE.
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

  // Security: only proxy Cloudinary and our own Render URLs
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

  const protocol = parsedUrl.protocol === "https:" ? https : http;

  const request = protocol.get(decodedUrl, (fileRes) => {
    // ── ONLY set download headers AFTER confirming upstream returns 200 ──
    if (fileRes.statusCode !== 200) {
      if (!res.headersSent) {
        res.status(502).json({
          success: false,
          message: `Upstream returned status ${fileRes.statusCode}. The PDF may be blocked by Cloudinary's free plan. Please enable PDF delivery in Cloudinary Settings > Security.`,
        });
      }
      fileRes.resume(); // discard upstream body
      return;
    }

    // All good — set headers and pipe the PDF straight to the browser
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Cache-Control", "no-cache");
    // Pass through content-length if available (helps browser show progress)
    if (fileRes.headers["content-length"]) {
      res.setHeader("Content-Length", fileRes.headers["content-length"]);
    }

    fileRes.pipe(res);

    fileRes.on("error", (err) => {
      console.error("Stream error:", err.message);
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: "Stream error." });
      }
    });
  });

  request.on("error", (err) => {
    console.error("Download proxy error:", err.message);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Failed to fetch the file." });
    }
  });

  request.setTimeout(15000, () => {
    request.destroy();
    if (!res.headersSent) {
      res.status(504).json({ success: false, message: "Request timed out." });
    }
  });
});

module.exports = router;
