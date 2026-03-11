import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Heart } from "lucide-react";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL;

export default function WishlistPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return navigate("/login");
    axios
      .get(`${API}/wishlist/${user.id}`)
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  }, []);

  const removeItem = async (productId) => {
    await axios.delete(`${API}/wishlist/${user.id}/${productId}`);
    setItems((prev) => prev.filter((i) => i.product_id !== productId));
  };

  const addToCart = async (productId) => {
    await axios.post(`${API}/cart`, { userId: user.id, productId });
    alert("Added to cart!");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-[#081621] mb-6">
        Wish List ({items.length})
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-sm text-gray-400 mb-4">Your wishlist is empty</p>
          <Link
            to="/"
            className="px-5 py-2 text-sm font-semibold text-white bg-[#081621] rounded hover:bg-[#0f2a3d] transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.product_id}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
            >
              <Link to={`/product/${item.product_id}`}>
                <img
                  src={item.main_image}
                  alt={item.name}
                  className="w-20 h-20 object-contain"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item.product_id}`}
                  className="text-sm font-semibold text-[#081621] hover:text-[#3749bb] hover:underline line-clamp-2"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-[#d51e0b] font-bold mt-1">
                  {Number(item.price).toLocaleString()}&#2547;
                </p>
              </div>
              <button
                onClick={() => addToCart(item.product_id)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#081621] rounded hover:bg-[#0f2a3d] transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={() => removeItem(item.product_id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
