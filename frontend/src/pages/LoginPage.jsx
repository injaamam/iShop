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
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded shadow-sm px-7 py-6">
        <h1 className="text-xl font-semibold text-[#081621] mb-5">Login</h1>

        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-semibold text-xs text-[#081621]">
              E-Mail <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded outline-none focus:border-[#081621] transition-colors"
            />
          </div>

          <div>
            <label className="font-semibold text-xs text-[#081621]">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded outline-none focus:border-[#081621] transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 text-sm bg-[#081621] text-white font-semibold rounded hover:bg-[#0f2535] transition-colors"
          >
            Login
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-xs text-gray-400">New here?</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <p className="text-xs text-gray-500 text-center">
          If you don't have an account, please{" "}
          <Link
            to="/register"
            className="text-[#EF4A23] font-medium hover:underline"
          >
            register here
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
