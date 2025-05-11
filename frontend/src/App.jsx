import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Trips from "./pages/Trips";
import Navbar from "./components/Navbar";
import useAuthStore from "./store/authStore";

axios.defaults.baseURL = "http://localhost:3000/api";
axios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function App() {
  const { token, user, setUser, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) return setLoading(false);
      try {
        const res = await axios.get("/check-auth");
        if (res.data.message === "Token is valid") {
          setUser({ email: "Authenticated" });
        }
      } catch (err) {
        logout();
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <Router>
      <Toaster />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/trips" />}
        />
        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/trips" />}
        />
        <Route
          path="/trips"
          element={token ? <Trips /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}
