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
    // setFilter((prev) => ({ ...prev, [key]: [value] }));
    setFilter((prev) => ({ ...prev, [key]: [...(prev[key] || []), value] }));
  };

  useEffect(() => {
    dispatch(setFilters(filter));
  }, [filter, dispatch]);

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
              values[key].map((value, index) => (
                <div
                  key={index}
                  className="bg-gray-300"
                  onClick={() => handleFilter(key, value)}
                >
                  {value}
                </div>
              ))}
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
