import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useAuthStore from "../store/authStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/login", { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      toast.success("Login successful");
      navigate("/trips");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 shadow-lg p-8 rounded-lg bg-white">
      <h2 className="text-2xl mb-4 font-bold text-center text-teal-700">
        Login
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          placeholder="Password"
        />
        <button
          type="submit"
          className="bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
