import axios from "axios";
import { useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProductFilter = ({ className, category }) => {
  const [error, setError] = useState("");
  const [keys, setKeys] = useState();
  const [values, setValues] = useState();

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

    const keyValue = [];
    keys.map((key) => {
      axios
        .get(`${BACKEND_URL}/category/${category}/specifications/${key}`)
        .then((value) => {
          const pushKeyValue = { [key]: value };
          keyValue.push(pushKeyValue);
        })
        .catch(() =>
          setError(`Failed to fetch product specification value of key ${key}!`)
        );
    });
    setValues(keyValue);
  }, [keys, category]);

  console.log(values);

  return (
    <div className={`${className} space-y-2`}>
      {keys ? (
        keys.map((key) => (
          <div key={key}>
            <div className="break-words">{key}</div>
            {/* <div>{`${values}.${key}`}</div> */}
          </div>
        ))
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default ProductFilter;
