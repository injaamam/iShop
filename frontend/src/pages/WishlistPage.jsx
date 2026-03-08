import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  fetchWishlist,
  removeFromWishlist,
} from "../features/wishlistSlice.js";
import { addToCart } from "../features/cartSlice.js";
import { Heart, Trash2, ShoppingCart } from "lucide-react";

export default function WishlistPage() {
  const { user } = useSelector((state) => state.auth);
  const { items, loading } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    dispatch(fetchWishlist());
  }, [user, dispatch, navigate]);

  if (!user) return null;

  const handleMoveToCart = (item) => {
    dispatch(addToCart({ productId: item.product_id }));
    dispatch(removeFromWishlist(item.id));
  };

  return (
    <div className="mx-5 md:mx-8 lg:mx-15 2xl:mx-30 pt-3 mb-10 min-h-[70vh]">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 flex items-center gap-2 mb-4">
        <Link to="/" className="hover:text-blue-600">
          <svg
            className="w-4 h-4 inline"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-700 font-medium">Wishlist</span>
      </div>

      <h1 className="text-xl font-bold text-[#081621] mb-4 flex items-center gap-2">
        <Heart size={22} /> My Wishlist
      </h1>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg" />
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
          <Heart size={48} className="mb-4 text-gray-300" />
          <p className="text-xl font-semibold">Your wishlist is empty</p>
          <Link
            to="/"
            className="mt-3 text-[#3749bb] hover:underline font-medium"
          >
            Browse Products
          </Link>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white shadow-md rounded-md flex flex-col border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-center items-center p-2 mb-3">
                <img
                  src={item.main_image}
                  alt={item.name}
                  className="max-h-48 object-contain"
                />
              </div>
              <Link to={`/product/${item.product_id}`}>
                <h2 className="text-sm font-semibold text-black/90 mb-1 hover:text-[#3749bb] hover:underline line-clamp-2">
                  {item.name}
                </h2>
              </Link>
              {item.category && (
                <Link
                  to={`/category/${item.category}`}
                  className="text-xs text-[#3749bb] bg-[#f5f6fd] px-2 py-0.5 rounded-full w-fit mb-3 capitalize hover:underline"
                >
                  {item.category.replace(/-/g, " ")}
                </Link>
              )}
              <p className="text-xl text-[#d51e0b] font-bold mb-3 mt-auto">
                {Number(item.price).toLocaleString()}&#2547;
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-[#f5f6fd] text-[#3749bb] text-sm font-bold rounded hover:bg-[#e3e4f8] transition-colors cursor-pointer"
                >
                  <ShoppingCart size={16} /> Add to Cart
                </button>
                <button
                  onClick={() => dispatch(removeFromWishlist(item.id))}
                  className="px-3 py-2 border border-red-300 text-red-400 rounded hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
