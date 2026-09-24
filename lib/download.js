export const forceDownload = (url, filename = "datasheet.pdf") => {
  if (!url) return;
  
  // If it's a Cloudinary URL, inject fl_attachment to force download from server side
  if (url.includes("cloudinary.com")) {
    let modifiedUrl = url;
    if (url.includes("/upload/")) {
      modifiedUrl = url.replace("/upload/", "/upload/fl_attachment/");
    }
    
    // Create an invisible anchor to trigger download
    const link = document.createElement("a");
    link.href = modifiedUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // If not Cloudinary (e.g. local backend), try to fetch it as blob to force download
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch(() => {
      // Fallback if fetch fails (CORS etc)
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
};
