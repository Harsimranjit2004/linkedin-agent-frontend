const BASE = "https://linkedin-agent-1-bifu.onrender.com"

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  if (res.status === 204) return null;
  return res.json();
}

export const auth = {
  getMe:    () => request("/auth/me"),
  logout:   () => request("/auth/logout"),
  loginUrl: `${BASE}/auth/linkedin`,
};

export const content = {
  generate:   (body)         => request("/content/generate",          { method: "POST", body: JSON.stringify(body) }),
  regenerate: (id, body)     => request(`/content/regenerate/${id}`,  { method: "POST", body: JSON.stringify(body) }),
  preview:    (id)           => request(`/content/preview/${id}`),
  edit:       (id, body)     => request(`/content/edit/${id}`,        { method: "PUT",  body: JSON.stringify(body) }),
};

export const posts = {
  list:    (status) => request(`/posts${status ? `?status=${status}` : ""}`),
  get:     (id)     => request(`/posts/${id}`),
  publish: (id)     => request(`/posts/${id}/publish`, { method: "POST" }),
  delete:  (id)     => request(`/posts/${id}`,         { method: "DELETE" }),
};