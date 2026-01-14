import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import io from 'socket.io-client';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  
  // Configure Axios global defaults
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = 'https://gig-flow-jade.vercel.app/';

  useEffect(() => {
    if (user) {
      const socketInstance = io('https://gig-flow-jade.vercel.app/');
      
      socketInstance.emit('setup', user);
      
      socketInstance.on('connected', () => {
        console.log('Socket Connected');
      });

      socketInstance.on('notification', (data) => {
        console.log('Notification received:', data);
        toast.success(data.message, {
          duration: 5000,
          position: 'top-center',
          style: {
             background: '#333',
             color: '#fff',
             border: '1px solid #9333ea'
          }
        });
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [user]);

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post('/auth/register', { name, email, password });
      setUser(data);
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/auth/login', { email, password });
      setUser(data);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
      setUser(null);
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      toast.success('Logged out');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, socket }}>
      {children}
    </AuthContext.Provider>
  );
};
