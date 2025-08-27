import axios from "axios";
import { useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProductFilter = ({ className, category }) => {
  const [error, setError] = useState("");
  const [keys, setKeys] = useState();
  const [values, setValues] = useState();
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/category/${category}/specifications`)
      .then((res) => {
        const keys = res.data;
        setKeys(keys);
      })
      .catch(() => setError("Failed to fetch product specification key!"));
  }, [category]);

  useEffect(() => {
    if (!keys) return;

    const keyValue = {};
    let completedRequests = 0;

    keys.map((key) => {
      axios
        .get(
          `${BACKEND_URL}/category/${category}/specifications/${encodeURIComponent(
            key
          )}`
        )
        .then((value) => {
          // const pushKeyValue = { [key]: value.data };
          // keyValue = { ...keyValue, ...pushKeyValue };
          keyValue[key] = value.data;
          completedRequests++;
          // console.log(`Completed: ${completedRequests}/${keys.length}`);

          if (completedRequests === keys.length) {
            console.log(keyValue);
            setValues(keyValue);
          }
        })
        .catch(() =>
          setError(`Failed to fetch product specification value of key ${key}!`)
        );
    });
  }, [keys, category]);

  return (
    <div className={`${className} space-y-2`}>
      {keys ? (
        keys.map((key) => (
          <div key={key}>
            <div className="break-words" onClick={() => setExpand(!expand)}>
              {key}
            </div>
            {expand && (
              <div>
                {values &&
                  values[key] &&
                  values[key].map((item, index) => (
                    <div key={index} className="bg-gray-300">
                      {item}
                    </div>
                  ))}
              </div>
            )}
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
