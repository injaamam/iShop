import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
} from "../features/cartSlice.js";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";

export default function CartPage() {
  const { user } = useSelector((state) => state.auth);
  const { items, loading } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    dispatch(fetchCart());
  }, [user, dispatch, navigate]);

  if (!user) return null;

  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );

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
        <span className="text-gray-700 font-medium">Cart</span>
      </div>

      <h1 className="text-xl font-bold text-[#081621] mb-4 flex items-center gap-2">
        <ShoppingCart size={22} /> My Cart
      </h1>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg" />
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
          <ShoppingCart size={48} className="mb-4 text-gray-300" />
          <p className="text-xl font-semibold">Your cart is empty</p>
          <Link
            to="/"
            className="mt-3 text-[#3749bb] hover:underline font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart items */}
          <div className="flex-1 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border"
              >
                <img
                  src={item.main_image}
                  alt={item.name}
                  className="w-20 h-20 object-contain"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.product_id}`}
                    className="text-sm font-semibold hover:text-[#3749bb] hover:underline line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <p className="text-[#d51e0b] font-bold mt-1">
                    {Number(item.price).toLocaleString()}&#2547;
                  </p>
                </div>
                {/* Quantity controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      item.quantity > 1
                        ? dispatch(
                            updateCartItem({
                              id: item.id,
                              quantity: item.quantity - 1,
                            }),
                          )
                        : dispatch(removeFromCart(item.id))
                    }
                    className="p-1 border rounded hover:bg-gray-100 cursor-pointer"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      dispatch(
                        updateCartItem({
                          id: item.id,
                          quantity: item.quantity + 1,
                        }),
                      )
                    }
                    className="p-1 border rounded hover:bg-gray-100 cursor-pointer"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:w-80">
            <div className="bg-white p-5 rounded-lg shadow-sm border sticky top-20">
              <h2 className="font-bold text-lg mb-4">Order Summary</h2>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-600">
                  Items ({items.reduce((s, i) => s + i.quantity, 0)})
                </span>
                <span>{total.toLocaleString()}&#2547;</span>
              </div>
              <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-[#d51e0b]">
                  {total.toLocaleString()}&#2547;
                </span>
              </div>
              <button
                onClick={() => navigate("/feature-unavailable")}
                className="w-full mt-4 py-2.5 bg-[#3749bb] text-white rounded-md font-semibold hover:bg-[#2d3a99] transition-colors cursor-pointer"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
