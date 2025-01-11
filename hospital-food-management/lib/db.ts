import {Pool}  from "pg";

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "hospital_food_management",
  password: process.env.DB_PASSWORD || "yourpassword",
  port: Number(process.env.DB_PORT) || 5432,
});

export default {
  query: (text: string, params?: any[]) => pool.query(text, params),
};

// psql -h localhost -p 5432 -U postgres -d hospital_food_management
