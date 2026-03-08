import { Search, ShoppingCart, UserRound } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleHamburger } from "../features/hamburgerSlice.js";
import { fetchCart } from "../features/cartSlice.js";
import { fetchWishlist } from "../features/wishlistSlice.js";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isCategoryPage = useLocation().pathname.includes("/category/");
  const searchRef = useRef(null);
  const toggleRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Fetch cart and wishlist when user logs in
  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [user, dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
  };

  // Close search on outside click (mobile)
  useEffect(() => {
    if (!searchOpen) return;
    const close = (e) => {
      if (
        !searchRef.current?.contains(e.target) &&
        !toggleRef.current?.contains(e.target)
      )
        setSearchOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, [searchOpen]);

  return (
    <div className="fixed md:relative w-full flex justify-around md:justify-center items-center gap-5 bg-[#081621] z-100 h-14 md:h-18 top-0">
      {isCategoryPage && (
        <button
          className="lg:hidden text-2xl text-white"
          onClick={() => dispatch(toggleHamburger())}
        >
          ☰
        </button>
      )}

      <Link to="/">
        <img src="/startech.png" className="h-8 md:h-12" />
      </Link>

      {/* Mobile search toggle */}
      <button
        ref={toggleRef}
        className="md:hidden active:scale-90 transition-transform p-2 rounded-full hover:bg-white/10"
        onClick={() => setSearchOpen((o) => !o)}
      >
        <Search stroke="white" />
      </button>

      {/* Search bar */}
      <form
        ref={searchRef}
        onSubmit={handleSearch}
        className={`absolute top-14 left-0 right-0 px-3 py-2 bg-[#081621] shadow-lg transition-all duration-200 ease-out
          ${searchOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}
          md:static md:p-0 md:bg-transparent md:shadow-none md:opacity-100 md:translate-y-0 md:pointer-events-auto
          w-full md:w-60 lg:w-110`}
      >
        <div className="flex items-center bg-white rounded-md border w-full">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1 w-full md:w-50 lg:w-100 h-10 md:h-9 rounded-l-md outline-none"
          />
          <button
            type="submit"
            className="px-4 h-10 md:h-9 flex items-center hover:bg-gray-100 transition-colors rounded-r-md"
          >
            <Search size={18} />
          </button>
        </div>
      </form>

      {/* Account */}
      <Link
        to={user ? "/account" : "/login"}
        className="flex gap-1 scale-140 md:scale-110"
      >
        <UserRound
          fill={user ? "#EF4A23" : "none"}
          stroke={user ? "#EF4A23" : "white"}
        />
        <h1 className="text-white font-semibold hidden md:inline">
          {user ? user.name.split(" ")[0] : "Account"}
        </h1>
      </Link>

      {/* Cart */}
      <Link
        to={user ? "/cart" : "/login"}
        className="fixed right-8 bottom-5 bg-[#081621] h-10 w-10 flex justify-center items-center border rounded scale-125 z-50"
      >
        <ShoppingCart stroke="white" />
        <span className="absolute -top-4 -right-3 bg-[#EF4A23] text-white text-sm rounded-full px-1.5 py-0.5">
          {totalItems}
        </span>
      </Link>
    </div>
  );
}
