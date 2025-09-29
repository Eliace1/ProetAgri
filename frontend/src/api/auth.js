import api from "./client";

export async function registerUser(payloadOrFormData, hasFiles = false) {
  const url = "/api/auth/register";
  if (hasFiles) {
    return api.post(url, payloadOrFormData).then((r) => r.data);
  }
  return api.post(url, payloadOrFormData, {
    headers: { "Content-Type": "application/json" },
  }).then((r) => r.data);
}

export async function loginUser(identifier, password) {
  const url = "/api/auth/login";
  return api.post(url, { identifier, password }).then((r) => r.data);
}
