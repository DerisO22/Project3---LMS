const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

// Auth
app.post('/login', (req, res) => {
    console.log('🛠️ LOGIN ATTEMPT RECEIVED');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
  
    const { user, password } = req.body;
    if (user === 'ADMIN' && password === 'ADMIN') {
      console.log('✅ Login success');
      res.json({ success: true });
    } else {
      console.log('❌ Invalid credentials');
      res.status(401).json({ success: false });
    }
  });
  
  
  
  
// CRUD endpoints for Category
app.get('/categories', (req, res) => {
  db.all('SELECT * FROM Category', [], (err, rows) => res.json(rows));
});

app.post('/categories', (req, res) => {
  const { category_name } = req.body;
  db.run('INSERT INTO Category (category_name) VALUES (?)', [category_name], function(err) {
    res.json({ id: this.lastID });
  });
});

// Add update/delete if needed...

// Repeat for Product table...

// UPDATE Category
app.put('/categories/:id', (req, res) => {
    const { category_name } = req.body;
    db.run('UPDATE Category SET category_name = ? WHERE category_id = ?', 
      [category_name, req.params.id], 
      function(err) {
        if (err) return res.status(500).json(err);
        res.json({ updated: this.changes });
      }
    );
  });
  
  // DELETE Category
  app.delete('/categories/:id', (req, res) => {
    db.run('DELETE FROM Category WHERE category_id = ?', [req.params.id], function(err) {
      if (err) return res.status(500).json(err);
      res.json({ deleted: this.changes });
    });
  });
  
  // GET all Products
app.get('/products', (req, res) => {
    db.all('SELECT * FROM Product', [], (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    });
  });
  
  // ADD Product
  app.post('/products', (req, res) => {
    const { product_name, price, category_id } = req.body;
    db.run('INSERT INTO Product (product_name, price, category_id) VALUES (?, ?, ?)', 
      [product_name, price, category_id], 
      function(err) {
        if (err) return res.status(500).json(err);
        res.json({ id: this.lastID });
      }
    );
  });
  
  // UPDATE Product
  app.put('/products/:id', (req, res) => {
    const { product_name, price, category_id } = req.body;
    db.run('UPDATE Product SET product_name = ?, price = ?, category_id = ? WHERE product_id = ?', 
      [product_name, price, category_id, req.params.id], 
      function(err) {
        if (err) return res.status(500).json(err);
        res.json({ updated: this.changes });
      }
    );
  });
  
  // DELETE Product
  app.delete('/products/:id', (req, res) => {
    db.run('DELETE FROM Product WHERE product_id = ?', [req.params.id], function(err) {
      if (err) return res.status(500).json(err);
      res.json({ deleted: this.changes });
    });
  });
  

app.listen(5000, () => console.log('Backend running on port 5000'));
