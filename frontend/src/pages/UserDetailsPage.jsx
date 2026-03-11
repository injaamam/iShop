import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import {
  ClipboardList,
  Heart,
  MapPin,
  Lock,
  UserPen,
  ShoppingCart,
} from "lucide-react";

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

  const linkClass =
    "flex flex-col items-center gap-2 py-6 border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition-all";
  const iconWrapClass =
    "w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center";
  const labelClass = "text-xs font-semibold text-[#081621]";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header with user info */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-500">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-xs text-gray-400">Hello,</p>
          <h1 className="text-lg font-semibold text-[#081621]">{user.name}</h1>
          <p className="text-xs text-gray-400">{user.email}</p>
          <p className="text-xs text-gray-400">{user.phone}</p>
        </div>
      </div>

      {/* Menu grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        <Link to="/feature-unavailable" className={linkClass}>
          <div className={iconWrapClass}>
            <ClipboardList size={20} className="text-[#3749bb]" />
          </div>
          <span className={labelClass}>Orders</span>
        </Link>

        <Link to="/cart" className={linkClass}>
          <div className={iconWrapClass}>
            <ShoppingCart size={20} className="text-[#3749bb]" />
          </div>
          <span className={labelClass}>Cart</span>
        </Link>

        <Link to="/wishlist" className={linkClass}>
          <div className={iconWrapClass}>
            <Heart size={20} className="text-[#3749bb]" />
          </div>
          <span className={labelClass}>Wish List</span>
        </Link>

        <Link to="/feature-unavailable" className={linkClass}>
          <div className={iconWrapClass}>
            <UserPen size={20} className="text-[#3749bb]" />
          </div>
          <span className={labelClass}>Edit Profile</span>
        </Link>

        <Link to="/feature-unavailable" className={linkClass}>
          <div className={iconWrapClass}>
            <Lock size={20} className="text-[#3749bb]" />
          </div>
          <span className={labelClass}>Change Password</span>
        </Link>

        <Link to="/feature-unavailable" className={linkClass}>
          <div className={iconWrapClass}>
            <MapPin size={20} className="text-[#3749bb]" />
          </div>
          <span className={labelClass}>Addresses</span>
        </Link>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full max-w-xs mx-auto block py-2 text-sm bg-[#EF4A23] text-white font-semibold rounded hover:bg-[#d63e1a] transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
