import { useParams, Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ProductFilter from "../components/productFilter";
import { getCategories } from "../constant/getCategories.js";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ProductPage() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const filterOpen = useSelector((state) => state.hamburger.filterOpen);
  const filters = useSelector((state) => state.filter.filters);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(() => {
    const p = Number(searchParams.get("page"));
    return Number.isInteger(p) && p > 0 ? p : 1;
  });

  // let getProducts = `${BACKEND_URL}/category/${category}?page=${page}&filters={"OS":["FreeDOS"],"Brand":["Acer"]}`;
  const getProducts = `${BACKEND_URL}/category/${category}?page=${page}&filters=${JSON.stringify(
    filters
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

  //reset page to 1 when category changes
  // useEffect(() => {
  //   setPage(1);
  // }, [category]);

  if (error)
    return (
      <div className="flex justify-center pt-5 text-xl font-bold">{error}</div>
    );
  if (!products.length)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );

  const start = Math.max(1, page - 2);
  const pages = [start, start + 1, start + 2, start + 3, start + 4];

  return (
    <div className="px-5 py-20 md:py-4 overflow-hidden md:px-8 lg:px-10 grid grid-cols-1 gap-4 items-center bg-gray-100">
      <div className="flex justify-between items-center w-full p-5 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold text-center h-5 flex items-center justify-between lg:justify-center w-full">
          {category}
        </h1>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 relative">
        <ProductFilter
          className={`
            ${filterOpen ? "block" : "hidden"}
            fixed top-18 left-0 bottom-0 w-80 lg:block lg:static lg:right-auto lg:w-250 shadow-lg bg-white p-4 lg:rounded-lg z-10 overflow-y-auto
          `}
          category={category}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div>

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
