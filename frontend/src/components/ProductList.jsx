import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cartSlice.js";
import { addToWishlist } from "../features/wishlistSlice.js";

export default function ProductList({ products, showCategory = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const handleAddToCart = (productId) => {
    if (!user) return navigate("/login");
    dispatch(addToCart({ productId }));
  };

  const handleAddToWishlist = (productId) => {
    if (!user) return navigate("/login");
    dispatch(addToWishlist(productId));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
      {products.map((prod) => {
        const inWishlist = wishlistItems.some((w) => w.product_id === prod.id);
        return (
          <div
            className="p-4 bg-white shadow-md rounded-md flex flex-col justify-between border border-gray-100 hover:shadow-lg transition-shadow"
            key={prod.id}
          >
            {/* product image */}
            <div className="flex justify-center items-center p-2 mb-3">
              <img
                src={prod.main_image}
                alt={prod.name}
                className="max-h-48 object-contain"
              />
            </div>

            {/* product name */}
            <Link to={`/product/${prod.id}`}>
              <h2 className="text-sm font-semibold text-black/90 mb-3 hover:text-[#3749bb] hover:underline line-clamp-2">
                {prod.name}
              </h2>
            </Link>

            {/* category badge (for search results) */}
            {showCategory && prod.category && (
              <Link
                to={`/category/${prod.category}`}
                className="text-xs text-[#3749bb] bg-[#f5f6fd] px-2 py-0.5 rounded-full w-fit mb-3 capitalize hover:underline"
              >
                {prod.category.replace(/-/g, " ")}
              </Link>
            )}

            {/* specs as bullet points */}
            <ul className="text-xs text-gray-600 space-y-1 mb-4 list-disc list-inside flex-grow">
              {prod.description
                ?.split("\r")
                .filter((line) => line.trim())
                .map((line, i) => (
                  <li key={i}>{line.trim()}</li>
                ))}
            </ul>

            {/* price, buy now and add to favourite */}
            <div className="mt-auto border-t border-gray-400/50 pt-3">
              {/* price */}
              <p className="text-xl text-[#d51e0b] text-center font-bold mb-2">
                {Number(prod.price).toLocaleString()}&#2547;
              </p>

              {/* buy now */}
              <button
                onClick={() => handleAddToCart(prod.id)}
                className="flex items-center justify-center gap-2 w-full py-2 bg-[#f5f6fd] text-[#3749bb] text-sm font-bold rounded hover:bg-[#e3e4f8] transition-colors cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                  />
                </svg>
                Buy Now
              </button>

              {/* add to favourite */}
              <button
                onClick={() => handleAddToWishlist(prod.id)}
                className={`flex items-center justify-center gap-2 w-full py-2 text-sm font-bold rounded transition-colors cursor-pointer ${
                  inWishlist
                    ? "text-red-500 hover:bg-red-50"
                    : "text-[#221717] hover:bg-[#e7e7e7]"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill={inWishlist ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318 1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {inWishlist ? "In Wishlist" : "Add to favourite"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
