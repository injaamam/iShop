import { useParams, Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import ProductFilter from "../components/productFilter";
import { getCategories } from "../constant/getCategories.js";
import { setFilters } from "../features/filterSlice.js";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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
    const pageParam = searchParams.get("page"); // e.g., "2"
    const parsed = Number(pageParam);
    const safePage = Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
    setPage(safePage);
  }, [category, searchParams]);

  //set page to url
  useEffect(() => {
    const current = searchParams.get("page") || "1";
    const next = String(page);
    if (current !== next) {
      setSearchParams({ page: next });
    }
  }, [page, searchParams]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  // Reset filters when category changes
  useEffect(() => {
    dispatch(setFilters({}));
    console.log("Filters reset to:", {});
  }, [category, dispatch]);

  //reset page to 1 when category changes
  // useEffect(() => {
  //   setPage(1);
  // }, [category]);

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

  const start = Math.max(1, page - 2);
  const pages = [start, start + 1, start + 2, start + 3, start + 4];

  return (
    <div className="px-5 py-3 overflow-hidden md:px-8 lg:px-10 grid grid-cols-1 gap-4 items-center bg-gray-100">
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
      <div className="flex justify-between items-center w-full p-5 bg-white shadow-md rounded-md">
        <h1 className="text-xl font-semibold text-center h-5 flex items-center justify-between lg:justify-center w-full capitalize">
          {category.replace(/-/g, " ")}
        </h1>
      </div>

      {/* product filter and product list section */}
      <div className="flex flex-col lg:flex-row gap-4 relative">
        {/* product filter section */}
        <ProductFilter
          className={`
            ${filterOpen ? "block" : "hidden"}
            fixed top-18 left-0 bottom-0 w-80 lg:block lg:static lg:right-auto lg:w-250 shadow-lg bg-white p-4 lg:rounded-lg z-10 overflow-y-auto
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
        {!error && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[65vh]">
            {products.map((prod) => (
              <div
                className="p-5 relative bg-white shadow-md rounded-md h-[650px]"
                key={prod.id}
              >
                <img src={prod.main_image} alt={prod.name} />
                <Link to={`/product/${prod.id}`}>
                  <h2 className="text-base font-semibold text-black/90 mb-5 hover:text-blue-900 hover:underline">
                    {prod.name}
                  </h2>
                </Link>
                <p className="text-sm text-black/80 ">{prod.description}</p>
                <p className="text-xl text-red-500 font-bold pt-5 absolute bottom-5">
                  {prod.price}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* pagination section */}
      <div className="flex justify-center items-center gap-1 ">
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          PREV
        </button>

        {pages.map((n) => (
          <button
            key={n}
            className={`btn btn-sm ${
              n === page ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setPage(n)}
            disabled={products.length < 20 && n > page}
          >
            {n}
          </button>
        ))}

        <button
          className="btn btn-outline btn-sm"
          onClick={() => setPage(page + 1)}
          disabled={products.length < 20}
        >
          NEXT
        </button>
      </div>
    </div>
  );
}
