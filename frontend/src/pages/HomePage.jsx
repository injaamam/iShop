import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../constant/getCategories.js";

function HomePage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then((data) => setCategories(data));
  }, []);

  return (
    <div className="mx-5 md:mx-8 lg:mx-10">
      <div className="flex flex-col gap-2 items-center mt-10">
        <h2 className="text-xl font-semibold">Featured Category</h2>
        <h3 className="text-md font-medium">
          Get Your Desired Product from Featured Category!
        </h3>
      </div>
      <div className="flex justify-center mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/${cat}`}
              className="flex items-center justify-center h-16 border rounded text-center"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
