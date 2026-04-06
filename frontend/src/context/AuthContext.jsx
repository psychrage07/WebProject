import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const parsedUser = JSON.parse(userInfo);
        try {
          // Verify token if needed, or just set user
          const config = { headers: { Authorization: `Bearer ${parsedUser.token}` } };
          const { data } = await axios.get('http://localhost:5000/api/auth/me', config);
          setUser({ ...data, token: parsedUser.token });
        } catch (error) {
          console.error('Invalid token', error);
          localStorage.removeItem('userInfo');
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
  };

  const register = async (name, email, password, role) => {
    const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
