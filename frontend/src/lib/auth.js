const USER_KEY = "farmlink_user";
const TOKEN_KEY = "farmlink_token";

export function saveUser(user) {
  try { localStorage.setItem(USER_KEY, JSON.stringify(user)); } catch {}
}

export function saveAuth(user, token) {
  saveUser(user);
  try { localStorage.setItem(TOKEN_KEY, token || ""); } catch {}
}

export function getUser() {
  try { 
    const raw = localStorage.getItem(USER_KEY); 
    return raw ? JSON.parse(raw) : null; 
  } catch { 
    return null; 
  }
}

export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY) || ""; } catch { return ""; }
}

export function isLoggedIn() { 
  return !!getUser(); 
}

/**
 * Déconnexion améliorée : supprime user et token,
 * puis déclenche un événement "auth:changed" pour prévenir Navbar
 */
export function logout() {
  try { 
    localStorage.removeItem(USER_KEY); 
    localStorage.removeItem(TOKEN_KEY); 
    window.dispatchEvent(new Event("auth:changed"));  // 👈 très important
  } catch {}
}

export function authHeader() {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}
