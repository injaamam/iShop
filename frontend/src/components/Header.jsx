import { Search, ShoppingCart, UserRound } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { toggleHamburger } from "../features/hamburgerSlice.js";
let totalItems = 0;

export default function Header() {
  const [click, setClick] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isCategoryPage = location.pathname.includes("/category/");
  const searchRef = useRef(null);
  const toggleBtnRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setClick(false);
    }
  };

  // Close search box when clicking outside on mobile
  useEffect(() => {
    if (!click) return;
    const handleClickOutside = (e) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(e.target)
      ) {
        setClick(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [click]);

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
      <button
        ref={toggleBtnRef}
        className="md:hidden active:scale-90 transition-transform p-2 rounded-full hover:bg-white/10"
        onClick={() => setClick((open) => !open)}
      >
        <Search stroke="white" />
      </button>
      <div
        ref={searchRef}
        className={`absolute top-14 left-0 right-0 px-3 py-2 bg-[#081621] shadow-lg transition-all duration-200 ease-out ${
          click
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        } md:static md:block md:p-0 md:bg-transparent md:shadow-none md:opacity-100 md:translate-y-0 md:pointer-events-auto w-full md:w-60 lg:w-110`}
      >
        <form
          onSubmit={handleSearch}
          className="flex items-center border md:rounded-md bg-white w-full rounded-md"
        >
          <div className="flex justify-between items-center w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1 w-full md:w-50 lg:w-100 h-10 md:h-9 rounded-l-md outline-none"
            />
            <button
              type="submit"
              className="px-4 h-10 md:h-9 flex items-center justify-center hover:bg-gray-100 transition-colors rounded-r-md"
            >
              <Search size={18} />
            </button>
          </div>
        </form>
      </div>
      <div className="flex gap-1 scale-140 md:scale-110">
        <UserRound fill="#EF4A23" />
        <h1 className="text-white font-semibold hidden md:inline">Account</h1>
      </div>
      <div className="fixed right-8 bottom-5 bg-[#081621] h-10 w-10 flex justify-center items-center border rounded scale-125 z-50">
        <ShoppingCart stroke="white" />
        <span className="absolute -top-4 -right-3 bg-[#EF4A23] text-white text-sm rounded-full px-1.5 py-0.5">
          {totalItems}
        </span>
      </div>
    </div>
  );
}
