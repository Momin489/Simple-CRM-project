const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const { ensureAuth } = require('../middleware/authMiddleware');

// Dashboard route (optional - if needed here)
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const customers = await Customer.find();
    const products = await Product.find();
    res.render('dashboard', {
      title: 'Dashboard',
      user: req.session.user,
      customers,
      products
    });
  } catch (err) {
    console.error('Dashboard Load Error:', err);
    res.status(500).send('Server error loading dashboard');
  }
});

// ✅ Show all products
router.get('/', ensureAuth, async (req, res) => {
  try {
    const products = await Product.find();
    res.render('products', { title: 'Products', products });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Error loading products');
  }
});

// ✅ Show add product form
router.get('/add', ensureAuth, (req, res) => {
  res.render('addProduct', { title: 'Add Product' });
});

// ✅ Handle product creation
router.post('/add', ensureAuth, async (req, res) => {
  try {
    const { name, price, description, stock } = req.body;
    await Product.create({ name, price, description, stock });
    res.redirect('/products');
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).send('Error adding product');
  }
});

// ✅ Show edit product form
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('editProduct', { title: 'Edit Product', product });
  } catch (err) {
    console.error('Error loading edit form:', err);
    res.status(500).send('Error loading edit form');
  }
});

// ✅ Handle product update
router.post('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const { name, price, description, stock } = req.body;
    await Product.findByIdAndUpdate(req.params.id, { name, price, description, stock });
    res.redirect('/products');
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).send('Error updating product');
  }
});

// ✅ Handle product delete
router.get('/delete/:id', ensureAuth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/products');
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).send('Error deleting product');
  }
});

module.exports = router;
