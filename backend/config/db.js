//For Neon DB
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
export const sql = neon(
  `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
);

//For Local DB
// import pg from "pg";
// import dotenv from "dotenv";

// dotenv.config();

// const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT } = process.env;

// export const sql = new pg.Pool({
//   user: PGUSER,
//   host: PGHOST,
//   database: PGDATABASE,
//   password: PGPASSWORD,
//   port: PGPORT || 5432,
// });
