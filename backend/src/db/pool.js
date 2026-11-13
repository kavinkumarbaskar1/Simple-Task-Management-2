const { Pool } = require("pg");

const databaseUrl = process.env.DATABASE_URL;

const poolConfig = databaseUrl
  ? {
      connectionString: databaseUrl
    }
  : {
      host: process.env.PGHOST,
      port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD
    };

const pool = new Pool(poolConfig);

const query = (text, params) => pool.query(text, params);

module.exports = {
  pool,
  query
};
