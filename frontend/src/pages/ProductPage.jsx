import { useParams, Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import ProductFilter from "../components/productFilter";
import Pagination from "../components/Pagination";
import { getCategories } from "../constant/getCategories.js";
import { setFilters } from "../features/filterSlice.js";
import ProductList from "../components/ProductList.jsx";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const PER_PAGE = 20;

export default function ProductPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const filterOpen = useSelector((state) => state.hamburger.filterOpen);
  const filters = useSelector((state) => state.filter.filters);
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(() => {
    const p = Number(searchParams.get("page"));
    return Number.isInteger(p) && p > 0 ? p : 1;
  });
  const [totalProducts, setTotalProducts] = useState(0);
  const totalPages = Math.max(1, Math.ceil(totalProducts / PER_PAGE));

  // On mount / category change: load filters from URL into Redux
  useEffect(() => {
    const urlFilters = {};
    for (const [key, value] of searchParams.entries()) {
      if (key !== "page") urlFilters[key] = value.split(",");
    }
    dispatch(setFilters(urlFilters));
  }, [category]);

  // let getProducts = `${BACKEND_URL}/category/${category}?page=${page}&filters={"OS":["FreeDOS"],"Brand":["Acer"]}`;
  const getProducts = `${BACKEND_URL}/category/${category}?page=${page}&filters=${JSON.stringify(
    filters,
  )}`;

  // Load categories once
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setError("Failed to load categories"));
  }, []);

  // Fetch products only if category is valid
  useEffect(() => {
    if (!categories.length) return; // Wait for categories to load
    if (!categories.includes(category)) {
      setError("Category not found");
      setProducts([]);
      return;
    }
    setError(""); // Clear previous errors
    axios
      .get(`${getProducts}`)
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setProducts(data);
          setError("");
        } else {
          setError(data.message || "No products found");
          setProducts([]);
        }
      })
      .catch(() => setError("Failed to fetch products"));
  }, [category, categories, page, filters]);

  // Fetch total product count for pagination
  useEffect(() => {
    if (!categories.length || !categories.includes(category)) return;
    axios
      .get(
        `${BACKEND_URL}/category/${category}/count?filters=${JSON.stringify(filters)}`,
      )
      .then((res) => setTotalProducts(res.data.total || 0))
      .catch(() => setTotalProducts(0));
  }, [category, categories, filters]);

  //filter open close
  useEffect(() => {
    if (filterOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Clean up on unmount
    return () => document.body.classList.remove("overflow-hidden");
  }, [filterOpen]);

  //set page from url
  useEffect(() => {
    const pageParam = searchParams.get("page");
    const parsed = Number(pageParam);
    const safePage = Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
    setPage(safePage);
  }, [searchParams]);

  // Sync page + filters to URL
  useEffect(() => {
    const params = { page: String(page) };
    for (const [key, values] of Object.entries(filters)) {
      if (values.length > 0) params[key] = values.join(",");
    }
    setSearchParams(params, { replace: true });
  }, [page, filters]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  // Fetch brands for current category in the upper section of the page
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    setBrands([]);
    axios
      .get(`${BACKEND_URL}/category/${category}/filter/Brand`)
      .then((res) => {
        if (Array.isArray(res.data)) setBrands(res.data);
      })
      .catch(() => setBrands([]));
  }, [category]);

  const handleBrandClick = (brand) => {
    const currentBrands = filters.Brand || [];
    const isSelected = currentBrands.includes(brand);
    const newBrands = isSelected
      ? currentBrands.filter((b) => b !== brand)
      : [...currentBrands, brand];
    dispatch(setFilters({ ...filters, Brand: newBrands }));
  };

  return (
    <div className="mx-5 md:mx-8 lg:mx-15 2xl:mx-30 3xl:mx-40 pt-3 mb-10 overflow-hidden grid grid-cols-1 gap-4 items-center">
      {/* breadcrumb section */}
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
        <span className="capitalize text-gray-700 font-medium">
          {category.replace(/-/g, " ")}
        </span>
      </div>

      {/* head section */}
      <div className="mb-1 md:mb-2">
        <h1 className="text-xl md:font-medium capitalize mb-1 md:mb-2 text-[#3749bb]">
          {category.replace(/-/g, " ")} Price in Bangladesh
        </h1>
        <p className="text-gray-700 leading-relaxed text-sm md:text-base">
          Buy latest original{" "}
          <span className="capitalize font-semibold">
            {category.replace(/-/g, " ")}
          </span>{" "}
          from StarTech. We offer authentic products with competitive prices and
          excellent customer service. Browse our extensive collection to find
          the best deals on high-quality {category.replace(/-/g, " ")} from
          trusted brands. Shop now and enjoy fast delivery, warranty support,
          and customer satisfaction guaranteed!
        </p>
      </div>

      {/* brand quick filter section */}
      {brands.length > 0 && (
        <div className="flex flex-wrap gap-1 md:gap-1">
          {brands.map((brand) => {
            const isActive = (filters.Brand || []).includes(brand);
            return (
              <button
                key={brand}
                onClick={() => handleBrandClick(brand)}
                className={`px-2.5 py-1 rounded-full border text-xs md:text-sm font-medium transition-colors cursor-pointer
                  ${
                    isActive
                      ? "bg-[#3749bb] text-white border-[#3749bb]"
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#3749bb] hover:text-[#3749bb]"
                  }`}
              >
                {brand}
              </button>
            );
          })}
        </div>
      )}

      {/*category title section */}
      <div className="flex items-center gap-3 w-full px-5 py-3 bg-white shadow-sm rounded-md border-l-4 border-[#3749bb]">
        <h1 className="text-lg font-semibold text-gray-800 capitalize">
          {category.replace(/-/g, " ")}
        </h1>
        {products.length > 0 && (
          <span className="text-sm text-gray-500 ml-auto">
            Showing {products.length} products
          </span>
        )}
      </div>

      {/* product filter and product list section */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-4 relative">
        {/* product filter section */}
        <ProductFilter
          className={`
            ${filterOpen ? "block" : "hidden"}
            fixed top-18 left-0 bottom-0 w-80 lg:block lg:static lg:right-auto lg:min-w-[220px] lg:max-w-[280px] lg:w-[260px] shadow-lg bg-white p-4 lg:rounded-lg z-10 overflow-y-auto lg:sticky lg:top-4
          `}
          category={category}
        />
        {error && (
          <div className="flex justify-center pt-5 text-xl font-bold w-full min-h-[65vh]">
            {error}
          </div>
        )}
        {!error && !products.length && (
          <div className="flex justify-center items-center h-64 w-full min-h-[65vh]">
            <div className="loading loading-spinner loading-lg" />
          </div>
        )}

        {/* product list section */}
        {!error && products.length > 0 && <ProductList products={products} />}
      </div>

      {/* pagination section */}
      {!error && products.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
