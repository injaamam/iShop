import { sql } from "../config/db.js";

// Get unique specification keys for a category
const getSpecificationKeys = async (req, res) => {
  const { category } = req.params;
  try {
    const result = await sql.query(
      `SELECT DISTINCT jsonb_object_keys(filter) as key_name 
       FROM products 
       WHERE category = $1 
       ORDER BY key_name`,
      [category]
    );

    const keys = result.rows.map((row) => row.key_name);
    res.json(keys);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch specification keys" });
  }
};

// Get unique values for a specific specification key in a category
const getSpecificationValues = async (req, res) => {
  const { category, key } = req.params;

  try {
    const result = await sql.query(
      `SELECT DISTINCT filter->>$1 as value 
       FROM products 
       WHERE category = $2 
       AND filter ? $1
       AND filter->>$1 IS NOT NULL
       AND filter->>$1 != ''
       ORDER BY filter->>$1`,
      [key, category]
    );

    const values = result.rows.map((row) => row.value);
    res.json(values);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch specification values" });
  }
};

// Get products with filtering
const getProducts = async (req, res) => {
  const { category } = req.params;
  const page = Number(req.query.page || 1);
  const offset = (page - 1) * 20;
  const filters = req.query.filters ? JSON.parse(req.query.filters) : {};

  try {
    let query =
      "SELECT id, name, price, main_image, description FROM products WHERE category = $1";
    let params = [category];
    let paramIndex = 2;

    // Add filter conditions
    if (Object.keys(filters).length > 0) {
      for (const [key, values] of Object.entries(filters)) {
        if (values && values.length > 0) {
          // Create placeholders for multiple values
          const placeholders = values.map(() => `$${paramIndex++}`).join(",");
          query += ` AND filter->>'${key}' IN (${placeholders})`;
          params.push(...values);
        }
      }
    }

    query += " ORDER BY id LIMIT 20 OFFSET $" + paramIndex;
    params.push(offset);

    const products = await sql.query(query, params);

    if (products.rows.length === 0) {
      return res.json({ message: "Products not available" });
    } else {
      return res.json(products.rows);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export { getProducts, getSpecificationKeys, getSpecificationValues };

// Get total count for pagination
// const getProductCount = async (req, res) => {
//   const { category } = req.params;
//   const filters = req.query.filters ? JSON.parse(req.query.filters) : {};

//   try {
//     let query = "SELECT COUNT(*) as total FROM products WHERE category = $1";
//     let params = [category];
//     let paramIndex = 2;

//     // Add filter conditions
//     if (Object.keys(filters).length > 0) {
//       for (const [key, values] of Object.entries(filters)) {
//         if (values && values.length > 0) {
//           const placeholders = values.map(() => `$${paramIndex++}`).join(",");
//           query += ` AND filter->>'${key}' IN (${placeholders})`;
//           params.push(...values);
//         }
//       }
//     }

//     const result = await sql.query(query, params);
//     res.json({ total: parseInt(result.rows[0].total) });
//   } catch (error) {
//     console.error("Error fetching product count:", error);
//     res.status(500).json({ error: "Failed to fetch product count" });
//   }
// };
