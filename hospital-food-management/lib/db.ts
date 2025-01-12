import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "hospital_food_management",
  password: process.env.DB_PASSWORD || "yourpassword",
  port: Number(process.env.DB_PORT) || 5432,
});

// Create a named export for the query function to avoid the anonymous export warning
export const dbQuery = (text: string, params?: unknown[]) => pool.query(text, params);

export default pool; // Export the pool for other usage if needed