const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./ecommerce', (err) => {
  if (err) {
    return console.error('Error opening database:', err.message);
  }
  console.log('Connected to SQLite database');

  // Create products table
  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
      pid INTEGER PRIMARY KEY AUTOINCREMENT,
      pname TEXT NOT NULL,
      description TEXT,
      quantity INTEGER,
      price REAL
    )
  `;

  // Create users table
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `;

  db.run(createProductsTable, (err) => {
    if (err) return console.error('Error creating products table:', err.message);
    console.log('Products table ready');
  });

  db.run(createUsersTable, (err) => {
    if (err) return console.error('Error creating users table:', err.message);
    console.log('Users table ready');
  });
}); // <- make sure this is only one closing brace for the Database callback

module.exports = db;
