import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../features/filterSlice.js"; //This  is from redux

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProductFilter = ({ className, category }) => {
  const [error, setError] = useState("");
  const [keys, setKeys] = useState();
  const [values, setValues] = useState();
  const [expandedKeys, setExpandedKeys] = useState({});
  const filter = useSelector((state) => state.filter.filters); //Read from Redux directly
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/category/${category}/filter`)
      .then((res) => {
        const keys = res.data;
        setKeys(keys);
        // Expand all keys by default
        const expanded = {};
        keys.forEach((key) => (expanded[key] = true));
        setExpandedKeys(expanded);
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
            key,
          )}`,
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
          setError(
            `Failed to fetch product specification value of key ${key}!`,
          ),
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
    const currentValues = filter[key] || [];
    const isSelected = currentValues.includes(value);

    if (isSelected) {
      // Remove value if already selected
      const newValues = currentValues.filter((v) => v !== value);
      dispatch(setFilters({ ...filter, [key]: newValues }));
    } else {
      // Add value if not selected
      dispatch(setFilters({ ...filter, [key]: [...currentValues, value] }));
    }
  };

  return (
    <div className={`${className} divide-y divide-gray-200`}>
      {keys ? (
        keys.map((key) => (
          <div key={key} className="py-3">
            {/* filter section header */}
            <button
              className="flex items-center justify-between w-full text-left px-1 py-1 cursor-pointer group"
              onClick={() => toggleKey(key)}
            >
              <span className="text-base font-semibold text-gray-800 group-hover:text-[#3749bb] transition-colors">
                {key}
              </span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  expandedKeys[key] ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>

            {/* filter values as checkboxes */}
            {expandedKeys[key] && values && values[key] && (
              <div className="mt-2 space-y-1 max-h-60 overflow-y-auto pl-1">
                {values[key].map((value, index) => {
                  const isSelected = filter[key] && filter[key].includes(value);
                  return (
                    <label
                      key={index}
                      className="flex items-center gap-3 px-2 py-1.5 rounded cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleFilter(key, value)}
                    >
                      <span
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected
                            ? "bg-[#ef4a23] border-[#ef4a23]"
                            : "border-gray-400 bg-white"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </span>
                      <span className="text-sm text-gray-700">{value}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="flex justify-center py-8">
          <div className="loading loading-spinner loading-md" />
        </div>
      )}
    </div>
  );
};

export default ProductFilter;
