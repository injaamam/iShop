import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductFilter from "../components/productFilter";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ProductPage() {
  const { category } = useParams(); // Get category from URL
  const [products, setProducts] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/${category}`).then((res) => {
      setProducts(res.data);
      console.log(res.data);
    });
  }, [category]);

  return (
    <div className="px-5 md:px-8 lg:px-10 grid grid-cols-1 gap-4 items-center bg-gray-100">
      <div className="flex justify-between items-center w-full p-5 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold text-center h-5 flex items-center justify-between lg:justify-center w-full">
          {category}
        </h1>
        <button
          className="lg:hidden text-2xl"
          onClick={() => setFilterOpen((open) => !open)}
        >
          ☰
        </button>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <ProductFilter
          className={`
            ${filterOpen ? "block" : "hidden"}
            lg:block absolute right-0 lg:static lg:right-auto w-[550px] bg-white shadow-md rounded-md text-center
          `}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((prod) => (
            <div
              className="p-5 relative bg-white shadow-md rounded-md h-[650px]"
              key={prod.id}
            >
              <img src={prod.main_image} alt={prod.name} />
              <h2 className="text-base font-semibold text-black/90 mb-5">
                {prod.name}
              </h2>
              <p className="text-sm text-black/80 ">{prod.description}</p>
              <p className="text-xl text-red-500 font-bold pt-5 absolute bottom-5">
                {prod.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
