export async function loginUser(payload) {
  const res = await fetch("http://your-backend/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  return res.json();
}

export async function registerUser(payload) {
  const res = await fetch("http://your-backend/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json();
}
