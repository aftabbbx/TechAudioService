export const adminFetch = async (url, options = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  
  return fetch(url, {
    ...options,
    credentials: "include", // Keep cookies enabled just in case it works
    headers,
  });
};
