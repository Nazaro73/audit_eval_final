import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || process.env.DATABASE_PORT || "5432"),
  database: process.env.DB_NAME || process.env.DATABASE_NAME || "taskwatch",
  user: process.env.DB_USER || process.env.DATABASE_USER || "postgres",
  password: process.env.DB_PASSWORD || process.env.DATABASE_PASSWORD || "postgres",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default pool;
