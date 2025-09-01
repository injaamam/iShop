import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFilters } from "../features/filterSlice.js"; //This  is from redux

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProductFilter = ({ className, category }) => {
  const [error, setError] = useState("");
  const [keys, setKeys] = useState();
  const [values, setValues] = useState();
  const [expandedKeys, setExpandedKeys] = useState({});
  const [filter, setFilter] = useState({}); //This is from local state
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/category/${category}/filter`)
      .then((res) => {
        const keys = res.data;
        setKeys(keys);
      })
      .catch(() => setError("Failed to fetch product specification key!"));
  }, [category]);

  useEffect(() => {
    if (!keys) return;

    let keyValue = {};
    let completedRequests = 0;

    keys.map((key) => {
      axios
        .get(
          `${BACKEND_URL}/category/${category}/filter/${encodeURIComponent(
            key
          )}`
        )
        .then((value) => {
          // const pushKeyValue = { [key]: value.data };
          // keyValue = { ...keyValue, ...pushKeyValue };
          keyValue[key] = value.data;
          completedRequests++;

          if (completedRequests === keys.length) {
            // console.log(keyValue);
            setValues(keyValue);
          }
        })
        .catch(() =>
          setError(`Failed to fetch product specification value of key ${key}!`)
        );
    });
  }, [keys, category]);

  const toggleKey = (key) => {
    setExpandedKeys((prev) => ({
      ...prev,
      [key]: !prev[key], // false -> true, true -> false
    }));
  };

  const handleFilter = (key, value) => {
    setFilter((prev) => {
      const currentValues = prev[key] || [];
      const isSelected = currentValues.includes(value);

      if (isSelected) {
        // Remove value if already selected
        const newValues = currentValues.filter((v) => v !== value);
        return { ...prev, [key]: newValues };
      } else {
        // Add value if not selected
        return { ...prev, [key]: [...currentValues, value] };
      }
    });
  };

  useEffect(() => {
    dispatch(setFilters(filter));
  }, [filter, dispatch]);

  // Reset local state when category changes (app works fine without this)
  useEffect(() => {
    setFilter({});
  }, [category]);

  useEffect(() => {
    console.log(JSON.stringify(filter));
  }, [filter]);

  return (
    <div className={`${className} space-y-2`}>
      {keys ? (
        keys.map((key) => (
          <div key={key}>
            <div className="break-words" onClick={() => toggleKey(key)}>
              {key}
            </div>
            {expandedKeys[key] &&
              values &&
              values[key] &&
              values[key].map((value, index) => {
                const isSelected = filter[key] && filter[key].includes(value);
                return (
                  <div
                    key={index}
                    className={`cursor-pointer p-2 rounded ${
                      isSelected
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    onClick={() => handleFilter(key, value)}
                  >
                    {value}
                  </div>
                );
              })}
          </div>
        ))
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ProductFilter;

{
  /* {values && (
        <div>
          <h2 className="text-2xl font-bold">X</h2>
          <ul>
            {Object.entries(values).map(([key, value]) => (
              <li key={key} className="text-lg text-gray-900">
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      )} */
}
