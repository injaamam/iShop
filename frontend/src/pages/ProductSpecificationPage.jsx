import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PackageIcon } from "lucide-react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ProductSpecificationPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    setProduct(null); // Reset product when id changes
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

  return (
    <div className="p-5 md:p-8 lg:p-10 pt-21 md:pt-3">
      <div className="flex items-center justify-center">
        <img src={product.main_image} alt={product.name} />
        <div className="border-2 p-4 w-full min-h-70">
          <h1 className="text-2xl font-bold pb-4">{product.name}</h1>
          <p className="text-md text-gray-900 pb-4">{product.description}</p>
          <p className="text-3xl font-bold text-gray-900 border-2 border-blue-700 w-40 py-4 text-center">
            {product.price}
          </p>
          <button className="bg-blue-700 text-white p-2 rounded-md w-1/2 mt-4">
            Buy Now
          </button>
        </div>
      </div>
      {product.specifications && (
        <div>
          <h2 className="text-2xl font-bold">Specifications:</h2>
          <ul>
            {Object.entries(product.specifications).map(([key, value]) => (
              <li key={key} className="text-lg text-gray-900">
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
