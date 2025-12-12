// api/auth.js

const API_BASE = "https://drive-app-2-r58o.onrender.com"; // your live backend URL

export async function loginUser(payload) {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Login failed");
  }

  return res.json();
}

export async function registerUser(payload) {
  try {
    const res = await fetch(`${API_BASE}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    return {
      success: res.ok,       // true if 200/201
      status: res.status,    // return actual status code
      ...data                // include backend fields
    };

  } catch (error) {
    return {
      success: false,
      message: error.message || "Network error"
    };
  }
}
