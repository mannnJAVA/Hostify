// client/src/context/AuthContext.jsx
// ...existing imports
import api from "../api/axios";

export function AuthProvider({ children }) {
  // ...state
  const register = async (name, email, password) => {
    try {
      const res = await api.post("/auth/register", { name, email, password });
      setUser(res.data.user);
      return { ok: true };
    } catch (err) {
      const message = err.response?.data?.message || "Signup failed";
      return { ok: false, message };
    }
  };

  // ...login, logout, provider
}
