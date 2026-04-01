import React, { createContext, useContext, useState, useEffect } from 'react';
const Ctx = createContext(null);
export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = localStorage.getItem('tf_token');
    const u = localStorage.getItem('tf_username');
    const i = localStorage.getItem('tf_user_id');
    if (t) setUser({ token:t, username:u, user_id:i });
    setLoading(false);
  }, []);
  const login = (token, username, user_id) => {
    localStorage.setItem('tf_token',    token);
    localStorage.setItem('tf_username', username);
    localStorage.setItem('tf_user_id',  user_id);
    setUser({ token, username, user_id });
  };
  const logout = () => { localStorage.clear(); setUser(null); };
  return <Ctx.Provider value={{ user, login, logout, loading }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
