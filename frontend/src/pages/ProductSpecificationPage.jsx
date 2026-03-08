import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { PackageIcon, Minus, Plus } from "lucide-react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ProductSpecificationPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const specRef = useRef(null);

  useEffect(() => {
    setError("");
    setProduct(null);
    axios
      .get(`${BACKEND_URL}/product/${id}`)
      .then((res) => setProduct(res.data[0]))
      .catch(() => setError("Failed to fetch product specification."));
  }, [id]);

  if (error)
    return (
      <div>
        <div className="flex justify-center items-center h-22 mt-10">
          <PackageIcon className="size-16" />
        </div>
        <div className="text-center text-2xl font-bold">{error}</div>
      </div>
    );

  if (product === null)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );

  if (!product)
    return (
      <div>
        <div className="flex justify-center items-center h-22 mt-10">
          <PackageIcon className="size-16" />
        </div>
        <div className="text-center text-2xl font-bold">No product found.</div>
      </div>
    );

  const keyFeatures =
    product.description
      ?.split("\r")
      .filter((line) => line.trim())
      .map((line) => line.trim()) || [];

  const specEntries = product.specifications
    ? Object.entries(product.specifications).filter(
        ([, v]) => v !== undefined && v !== null && v !== "",
      )
    : [];
  const categoryLabel = product.category?.replace(/-/g, " ") || "";

  return (
    <div className="mx-5 md:mx-8 lg:mx-15 2xl:mx-30 3xl:mx-40 pt-3 mb-10">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 flex items-center gap-2 mb-4 flex-wrap">
        <Link to="/" className="hover:text-[#3749bb]">
          <svg
            className="w-4 h-4 inline"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </Link>
        <span className="text-gray-400">/</span>
        <Link
          to={`/category/${product.category}`}
          className="capitalize hover:text-[#3749bb]"
        >
          {categoryLabel}
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-700 font-medium line-clamp-1">
          {product.name}
        </span>
      </div>

      {/* Product main section */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 lg:p-8 mb-6">
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          {/* Product image */}
          <div className="flex justify-center items-start md:w-2/5 lg:w-[38%]">
            <img
              src={product.main_image}
              alt={product.name}
              className="max-h-[400px] object-contain"
            />
          </div>

          {/* Product info */}
          <div className="md:w-3/5 lg:w-[62%]">
            {/* Title */}
            <h1 className="text-xl md:text-2xl font-semibold text-[#3749bb] mb-4">
              {product.name}
            </h1>

            {/* Info badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-700">
                Price:{" "}
                <strong>{Number(product.price).toLocaleString()}&#2547;</strong>
              </span>
              <span className="border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-700">
                Status: <strong>In Stock</strong>
              </span>
              <span className="border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-700">
                Product Code: <strong>{product.id}</strong>
              </span>
            </div>

            {/* Brand badge */}
            {product.filter?.Brand && (
              <div className="mb-5">
                <span className="border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-700">
                  Brand: <strong>{product.filter.Brand}</strong>
                </span>
              </div>
            )}

            {/* Key Features */}
            <div className="mb-5">
              <h3 className="text-base font-bold text-gray-900 mb-3">
                Key Features
              </h3>
              <div className="space-y-1.5 text-sm text-gray-700">
                {keyFeatures.map((feature, i) => (
                  <p key={i}>{feature}</p>
                ))}
              </div>
              <button
                className="text-[#ef4a23] text-sm font-medium mt-3 inline-block hover:underline cursor-pointer"
                onClick={() => {
                  specRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                View More Info
              </button>
            </div>

            {/* Payment Options */}
            <div className="mb-5">
              <h3 className="text-base font-bold text-gray-900 mb-3">
                Payment Options
              </h3>
              <div className="border-2 border-[#3749bb] rounded-md p-4 max-w-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-4 border-[#3749bb] shrink-0" />
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {Number(product.price).toLocaleString()}&#2547;
                    </p>
                    <p className="text-xs font-semibold text-gray-700">
                      Cash Discount Price
                    </p>
                    <p className="text-xs text-gray-400">
                      Online / Cash Payment
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity + Buy Now */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <button
                  className="px-3 py-2 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm font-medium border-x border-gray-300 min-w-[40px] text-center">
                  {qty}
                </span>
                <button
                  className="px-3 py-2 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => setQty((q) => q + 1)}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button className="bg-[#3749bb] hover:bg-[#2c3a9e] text-white font-semibold py-2.5 px-10 rounded-md transition-colors text-sm cursor-pointer">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Specification section */}
      <div
        ref={specRef}
        className="bg-white rounded-lg shadow-sm p-5 md:p-8 mb-6"
      >
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-5">
          Specification
        </h2>
        {specEntries.length > 0 ? (
          <div className="overflow-hidden">
            {specEntries.map(([key, value], i) => (
              <div
                key={key}
                className={`flex border-b border-gray-100 ${
                  i % 2 === 0 ? "bg-white" : "bg-[#f5f6ff]"
                }`}
              >
                <div className="w-[35%] md:w-[25%] px-5 py-3.5 text-sm text-gray-500 shrink-0">
                  {key}
                </div>
                <div className="w-[65%] md:w-[75%] px-5 py-3.5 text-sm font-medium text-gray-900 whitespace-pre-line">
                  {value}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No specifications available for this product.
          </p>
        )}
      </div>

      {/* Description section */}
      <div className="bg-white rounded-lg shadow-sm p-5 md:p-8 mb-6">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-5">
          Description
        </h2>
        <div className="text-gray-700 leading-relaxed">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
            {product.name}
          </h3>
          <p className="whitespace-pre-line text-gray-600 text-sm md:text-base">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}
