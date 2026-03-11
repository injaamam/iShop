import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingCart } from "lucide-react";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL;

export default function CartPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return navigate("/login");
    axios
      .get(`${API}/cart/${user.id}`)
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  }, []);

  const updateQty = async (productId, quantity) => {
    if (quantity < 1) return removeItem(productId);
    await axios.put(`${API}/cart`, {
      userId: user.id,
      productId,
      quantity,
    });
    setItems((prev) =>
      prev.map((i) => (i.product_id === productId ? { ...i, quantity } : i)),
    );
  };

  const removeItem = async (productId) => {
    await axios.delete(`${API}/cart/${user.id}/${productId}`);
    setItems((prev) => prev.filter((i) => i.product_id !== productId));
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-[#081621] mb-6">
        Shopping Cart ({items.length})
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-sm text-gray-400 mb-4">Your cart is empty</p>
          <Link
            to="/"
            className="px-5 py-2 text-sm font-semibold text-white bg-[#081621] rounded hover:bg-[#0f2a3d] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQty(item.product_id, item.quantity - 1)
                    }
                    className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:bg-gray-100"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-semibold w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQty(item.product_id, item.quantity + 1)
                    }
                    className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-500 hover:bg-gray-100"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.product_id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 border border-gray-200 rounded-lg flex items-center justify-between">
            <span className="text-sm font-semibold text-[#081621]">Total</span>
            <span className="text-xl font-bold text-[#d51e0b]">
              {total.toLocaleString()}&#2547;
            </span>
          </div>

          <button
            onClick={() => alert("Checkout coming soon!")}
            className="w-full mt-4 py-2.5 text-sm font-semibold text-white bg-[#081621] rounded hover:bg-[#0f2a3d] transition-colors"
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}
