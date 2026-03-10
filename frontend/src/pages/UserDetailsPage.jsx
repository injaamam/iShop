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
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-4 text-center">
        <h1 className="text-2xl font-bold">My Account</h1>
        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-semibold">Name:</span> {user.name}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">Address:</span> {user.address}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
