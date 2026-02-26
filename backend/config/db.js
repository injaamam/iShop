import pg from "pg";
import dotenv from "dotenv";

// dotenv.config() reads .env file and loads its variables into process.env.
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT } = process.env;

export const sql = new pg.Pool({
  user: PGUSER,
  host: PGHOST,
  database: PGDATABASE,
  password: PGPASSWORD,
  port: PGPORT || 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});
