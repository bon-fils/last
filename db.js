const sqlite3 = require('sqlite3').verbose(); // <-- ADD THIS
const db = new sqlite3.Database('./ecommerce', (err) => {
  if (err) {
    return console.error('Error opening database:', err.message);
  }
  console.log('Connected to SQLite database');

  // your create table logic...
});

module.exports = db;


  // Create productz table if not exists
  const createProductzTable = `
    CREATE TABLE IF NOT EXISTS productz (
      productid INTEGER PRIMARY KEY AUTOINCREMENT,
      productname TEXT NOT NULL,
      description TEXT,
      quantity INTEGER,
      price REAL,
      createdat TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create userz table if not exists
  const createUserzTable = `
    CREATE TABLE IF NOT EXISTS userz (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `;

  db.run(createProductzTable, (err) => {
    if (err) return console.error('❌ Error creating productz table:', err.message);
    console.log('✅ Productz table ready');
  });

  db.run(createUserzTable, (err) => {
    if (err) return console.error('❌ Error creating userz table:', err.message);
    console.log('✅ Userz table ready');
  });
});

module.exports = db;
