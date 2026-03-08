import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../components/Pagination";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const PER_PAGE = 20;

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(() => {
    const p = Number(searchParams.get("page"));
    return Number.isInteger(p) && p > 0 ? p : 1;
  });
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  // Reset page when query changes
  useEffect(() => {
    setPage(1);
  }, [query]);

  // Sync page from URL
  useEffect(() => {
    const pageParam = Number(searchParams.get("page"));
    const safePage =
      Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
    setPage(safePage);
  }, [searchParams]);

  // Update URL when page changes
  useEffect(() => {
    const currentPage = searchParams.get("page") || "1";
    if (currentPage !== String(page) && query) {
      setSearchParams({ q: query, page: String(page) });
    }
  }, [page]);

  // Fetch search results
  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    setError("");
    axios
      .get(`${BACKEND_URL}/search`, {
        params: { q: query, page },
      })
      .then((res) => {
        setProducts(res.data.products || []);
        setTotal(res.data.total || 0);
      })
      .catch(() => setError("Failed to fetch search results"))
      .finally(() => setLoading(false));
  }, [query, page]);

  return (
    <div className="mx-5 md:mx-8 lg:mx-15 2xl:mx-30 3xl:mx-40 pt-3 mb-10 grid grid-cols-1 gap-4 items-center">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 flex items-center gap-2">
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
        <span className="text-gray-700 font-medium">Search</span>
      </div>

      {/* Search heading */}
      <div className="flex items-center gap-3 w-full px-5 py-3 bg-white shadow-sm rounded-md border-l-4 border-[#3749bb]">
        <h1 className="text-lg font-semibold text-gray-800">
          Search results for &quot;{query}&quot;
        </h1>
        {total > 0 && (
          <span className="text-sm text-gray-500 ml-auto">
            {total} product{total !== 1 ? "s" : ""} found
          </span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-64 w-full min-h-[65vh]">
          <div className="loading loading-spinner loading-lg" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex justify-center pt-5 text-xl font-bold w-full min-h-[65vh]">
          {error}
        </div>
      )}

      {/* No results */}
      {!loading && !error && products.length === 0 && query && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
          <svg
            className="w-16 h-16 mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="text-xl font-semibold">No products found</p>
          <p className="text-sm mt-1">Try searching with different keywords</p>
        </div>
      )}

      {/* Results grid */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {products.map((prod) => (
            <div
              className="p-4 bg-white shadow-md rounded-md flex flex-col justify-between border border-gray-100 hover:shadow-lg transition-shadow"
              key={prod.id}
            >
              {/* Product image */}
              <div className="flex justify-center items-center p-2 mb-3">
                <img
                  src={prod.main_image}
                  alt={prod.name}
                  className="max-h-48 object-contain"
                />
              </div>

              {/* Product name */}
              <Link to={`/product/${prod.id}`}>
                <h2 className="text-sm font-semibold text-black/90 mb-1 hover:text-[#3749bb] hover:underline line-clamp-2">
                  {prod.name}
                </h2>
              </Link>

              {/* Category badge */}
              <Link
                to={`/category/${prod.category}`}
                className="text-xs text-[#3749bb] bg-[#f5f6fd] px-2 py-0.5 rounded-full w-fit mb-3 capitalize hover:underline"
              >
                {prod.category.replace(/-/g, " ")}
              </Link>

              {/* Specs as bullet points */}
              <ul className="text-xs text-gray-600 space-y-1 mb-4 list-disc list-inside flex-grow">
                {prod.description
                  ?.split("\r")
                  .filter((line) => line.trim())
                  .map((line, i) => (
                    <li key={i}>{line.trim()}</li>
                  ))}
              </ul>

              {/* Price & buy now */}
              <div className="mt-auto border-t border-gray-400/50 pt-3">
                <p className="text-xl text-[#d51e0b] text-center font-bold mb-2">
                  {Number(prod.price).toLocaleString()}&#2547;
                </p>
                <Link
                  to={`/product/${prod.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2 bg-[#f5f6fd] text-[#3749bb] text-sm font-bold rounded hover:bg-[#e3e4f8] transition-colors"
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
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && products.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
