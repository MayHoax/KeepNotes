export default async function checkToken(options = {}) {
  const { signal } = options;

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  if (!token) {
    return { valid: false, reason: "no-token" };
  }

  try {
    const base = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/check-token`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      signal,
    });

    if (res.status === 200) {
      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      return { valid: true, userId: data?.userId };
    }

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      return { valid: false, reason: "unauthorized" };
    }

    return { valid: false, reason: `http-${res.status}` };
  } catch (err) {
    if (err.name === "AbortError") {
      return { valid: false, reason: "aborted" };
    }
    console.error("Token check error", err);
    return { valid: false, reason: "network" };
  }
}
