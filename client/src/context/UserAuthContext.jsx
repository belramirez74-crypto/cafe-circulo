import { createContext, useState, useEffect, useContext } from 'react';
import { verifyUserToken } from '../lib/api';

const UserAuthContext = createContext(null);

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    if (token) {
      verifyUserToken()
        .then((res) => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('user_token');
          localStorage.removeItem('app_user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('app_user');
    setUser(null);
  };

  return (
    <UserAuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export const useUserAuth = () => useContext(UserAuthContext);
