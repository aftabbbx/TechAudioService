/**
 * forceDownload — routes ALL PDF downloads through our own backend proxy.
 *
 * Why proxy? Cloudinary free plans BLOCK direct PDF delivery (returns HTML error page).
 * Blob fetch from browser also fails due to CORS.
 *
 * Solution: Backend fetches the file server-side (no CORS) and streams it
 * to the browser as a proper attachment download.
 */
export const forceDownload = (url, filename = "datasheet.pdf") => {
  if (!url) return;

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL || "https://techaudioservice.onrender.com";

  const proxyUrl = `${apiBase}/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;

  // Open the proxy URL — browser will get Content-Disposition: attachment
  // so it downloads instantly without opening a new visible tab
  const link = document.createElement("a");
  link.href = proxyUrl;
  link.download = filename;
  link.target = "_self"; // same tab, no popup
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
