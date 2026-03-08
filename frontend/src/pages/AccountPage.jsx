import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { logout } from "../features/authSlice.js";
import { clearCart } from "../features/cartSlice.js";
import { clearWishlist } from "../features/wishlistSlice.js";
import { Heart, ShoppingCart, LogOut, User } from "lucide-react";

export default function AccountPage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    dispatch(clearWishlist());
    navigate("/");
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
        {/* User info */}
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-[#f5f6fd] rounded-full p-4">
            <User size={32} className="text-[#3749bb]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#081621]">{user.name}</h1>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <Link
            to="/cart"
            className="flex items-center gap-3 p-4 rounded-lg border hover:border-[#3749bb] hover:bg-[#f5f6fd] transition-colors"
          >
            <ShoppingCart className="text-[#3749bb]" size={20} />
            <span className="font-medium">My Cart</span>
          </Link>
          <Link
            to="/wishlist"
            className="flex items-center gap-3 p-4 rounded-lg border hover:border-[#3749bb] hover:bg-[#f5f6fd] transition-colors"
          >
            <Heart className="text-[#3749bb]" size={20} />
            <span className="font-medium">My Wishlist</span>
          </Link>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-2.5 border border-red-400 text-red-500 rounded-md font-semibold hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
