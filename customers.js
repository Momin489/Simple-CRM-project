const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const { ensureAuth } = require('../middleware/authMiddleware');

// Dashboard route (protected)
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
    res.send('Error loading dashboard');
  }
});

// Get all customers
router.get('/', ensureAuth, async (req, res) => {
  try {
    const customers = await Customer.find();
    res.render('customers', { title: 'Customers', customers });
  } catch (err) {
    res.send('Error loading customers');
  }
});

// Show form to add new customer
router.get('/add', ensureAuth, (req, res) => {
  res.render('addCustomer', { title: 'Add Customer' });
});

// Handle new customer form submission
router.post('/', ensureAuth, async (req, res) => {
  try {
    const { name, email, phone, address, city, zipcode, status } = req.body;
    const newCustomer = new Customer({ name, email, phone, address, city, zipcode, status });
    await newCustomer.save();
    res.redirect('/customers');
  } catch (err) {
    res.send('Error adding customer');
  }
});

// Show edit form
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.redirect('/customers');
    res.render('editCustomer', { title: 'Edit Customer', customer });
  } catch (err) {
    res.send('Error loading edit form');
  }
});

// Handle edit form submission
router.post('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const { name, email, phone, address, city, zipcode, status } = req.body;
    await Customer.findByIdAndUpdate(req.params.id, { name, email, phone, address, city, zipcode, status });
    res.redirect('/customers');
  } catch (err) {
    res.send('Error updating customer');
  }
});

// Delete customer
router.post('/delete/:id', ensureAuth, async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.redirect('/customers');
  } catch (err) {
    res.send('Error deleting customer');
  }
});

module.exports = router;
