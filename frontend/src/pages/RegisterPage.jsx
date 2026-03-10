import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL;

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API}/auth/register`, {
        name,
        email,
        phone,
        password,
        address,
      });
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
      console.log(data.user);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded shadow-sm px-7 py-6">
        <h1 className="text-xl font-semibold text-[#081621] mb-5">
          Register Account
        </h1>

        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-semibold text-xs text-[#081621]">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded outline-none focus:border-[#081621] transition-colors"
            />
          </div>

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
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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

          <div>
            <label className="font-semibold text-xs text-[#081621]">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Your Detailed Current Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded outline-none focus:border-[#081621] transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 text-sm bg-[#081621] text-white font-semibold rounded hover:bg-[#0f2535] transition-colors"
          >
            Continue
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-xs text-gray-400">
            Already have an account?
          </span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <p className="text-xs text-gray-500">
          If you already have an account with us, please login at the{" "}
          <Link
            to="/login"
            className="text-[#EF4A23] font-medium hover:underline"
          >
            login page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
