import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function UserDetailsPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded shadow-sm px-7 py-6">
        <h1 className="text-xl font-semibold text-[#081621] mb-5">
          My Account
        </h1>

        <div className="space-y-4">
          <div>
            <label className="font-semibold text-xs text-[#081621]">Name</label>
            <p className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50 text-gray-700">
              {user.name}
            </p>
          </div>

          <div>
            <label className="font-semibold text-xs text-[#081621]">
              E-Mail
            </label>
            <p className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50 text-gray-700">
              {user.email}
            </p>
          </div>

          <div>
            <label className="font-semibold text-xs text-[#081621]">
              Address
            </label>
            <p className="mt-1 px-3 py-2 text-sm border border-gray-300 rounded bg-gray-50 text-gray-700">
              {user.address || "Not provided"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-5 py-2 text-sm bg-[#EF4A23] text-white font-semibold rounded hover:bg-[#d63e1a] transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
