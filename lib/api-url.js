const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

export function getApiBaseUrl(fallbackUrl = "http://localhost:5000") {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL || fallbackUrl;

  if (typeof window === "undefined") return configuredUrl.replace(/\/+$/, "");

  try {
    const apiUrl = new URL(configuredUrl, window.location.origin);
    const browserHost = window.location.hostname;

    if (
      process.env.NODE_ENV === "development" &&
      LOOPBACK_HOSTS.has(apiUrl.hostname) &&
      !LOOPBACK_HOSTS.has(browserHost)
    ) {
      apiUrl.hostname = browserHost;
    }

    return apiUrl.origin;
  } catch {
    return configuredUrl.replace(/\/+$/, "");
  }
}
