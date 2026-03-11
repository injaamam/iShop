import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Heart, ShoppingCart, CheckCircle2, ArrowRight } from "lucide-react";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL;

export default function ProductList({ products, showCategory = false }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [cartIds, setCartIds] = useState(new Set());
  const [wishlistIds, setWishlistIds] = useState(new Set());

  useEffect(() => {
    if (!user) return;
    axios.get(`${API}/user-status/${user.id}`).then((res) => {
      setCartIds(new Set(res.data.cartIds));
      setWishlistIds(new Set(res.data.wishlistIds));
    });
  }, []);

  const handleAddToCart = async (productId) => {
    if (!user) return navigate("/login");
    await axios.post(`${API}/cart`, { userId: user.id, productId });
    setCartIds((prev) => new Set(prev).add(productId));
  };

  const handleToggleWishlist = async (productId) => {
    if (!user) return navigate("/login");
    const { data } = await axios.post(`${API}/wishlist`, {
      userId: user.id,
      productId,
    });
    setWishlistIds((prev) => {
      const next = new Set(prev);
      data.added ? next.add(productId) : next.delete(productId);
      return next;
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
      {products.map((prod) => {
        const inCart = cartIds.has(prod.id);
        const inWishlist = wishlistIds.has(prod.id);

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

            {/* price, add to cart and wishlist */}
            <div className="mt-auto border-t border-gray-400/50 pt-3">
              {/* price */}
              <p className="text-xl text-[#d51e0b] text-center font-bold mb-2">
                {Number(prod.price).toLocaleString()}&#2547;
              </p>

              {/* add to cart / go to cart */}
              {inCart ? (
                <Link
                  to="/cart"
                  className="flex items-center justify-center gap-2 w-full py-2 bg-[#2c3a9e] hover:bg-[#243288] text-white text-sm font-bold rounded transition-all duration-300"
                >
                  <CheckCircle2 size={15} />
                  Go to Cart <ArrowRight size={14} />
                </Link>
              ) : (
                <button
                  onClick={() => handleAddToCart(prod.id)}
                  className="flex items-center justify-center gap-2 w-full py-2 bg-[#f5f6fd] text-[#3749bb] text-sm font-bold rounded hover:bg-[#e3e4f8] transition-all duration-300 cursor-pointer"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
              )}

              {/* wishlist toggle */}
              <button
                onClick={() => handleToggleWishlist(prod.id)}
                className={`flex items-center justify-center gap-2 w-full py-2 text-sm font-bold rounded mt-1 transition-all duration-300 cursor-pointer ${
                  inWishlist
                    ? "bg-red-50 text-red-500"
                    : "text-[#221717] hover:bg-[#e7e7e7]"
                }`}
              >
                <Heart
                  size={16}
                  className={`transition-all duration-300 ${inWishlist ? "fill-red-500 text-red-500 scale-110" : ""}`}
                />
                {inWishlist ? "Added to Wishlist" : "Add to Wishlist"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
