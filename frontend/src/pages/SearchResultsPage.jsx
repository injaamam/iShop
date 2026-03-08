import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../components/Pagination";
import ProductList from "../components/ProductList.jsx";

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
        <ProductList products={products} showCategory />
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
