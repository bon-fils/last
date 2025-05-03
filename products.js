const express = require('express');
const router = express.Router();
const db = require('./db');

// Get all products
router.get('/', (req, res) => {
  const query = 'SELECT * FROM productz';
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(rows);
  });
});

// Add new product
router.post('/', (req, res) => {
  const { productname, description, quantity, price } = req.body;
  const query = `
    INSERT INTO productz (productname, description, quantity, price)
    VALUES (?, ?, ?, ?)
  `;
  db.run(query, [productname, description, quantity, price], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Error inserting product' });
    }
    res.json({ message: 'Product added', productid: this.lastID });
  });
});

// Delete product by ID
router.delete('/:productid', (req, res) => {
  const productid = req.params.productid;
  const query = 'DELETE FROM productz WHERE productid = ?';
  db.run(query, [productid], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Error deleting product' });
    }
    res.json({ message: 'Product deleted' });
  });
});

// PUT: Update entire product
router.put('/:productid', (req, res) => {
  const productid = req.params.productid;
  const { productname, description, quantity, price } = req.body;
  const query = `
    UPDATE productz
    SET productname = ?, description = ?, quantity = ?, price = ?
    WHERE productid = ?
  `;
  db.run(query, [productname, description, quantity, price, productid], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Error updating product' });
    }
    res.json({ message: 'Product fully updated' });
  });
});

// PATCH: Partial update
router.patch('/:productid', (req, res) => {
  const productid = req.params.productid;
  const fields = req.body;

  if (!fields || Object.keys(fields).length === 0) {
    return res.status(400).json({ message: 'No fields provided for update' });
  }

  const updates = Object.keys(fields).map(key => `${key} = ?`).join(', ');
  const values = Object.values(fields);
  values.push(productid);

  const query = `UPDATE productz SET ${updates} WHERE productid = ?`;

  db.run(query, values, function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Error updating product' });
    }
    res.json({ message: 'Product partially updated' });
  });
});

module.exports = router;
