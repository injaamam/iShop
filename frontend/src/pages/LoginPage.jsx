import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API}/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
      console.log(data.user);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            // console.log(e.target.value);
          }}
          required
          className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#3749bb]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-[#3749bb]"
        />
        <button
          type="submit"
          className="w-full py-2 bg-[#EF4A23] text-white font-semibold rounded-md hover:bg-[#d63e1a] transition-colors"
        >
          Login
        </button>
        <p className="text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#3749bb] hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
