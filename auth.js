const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Customer = require('../models/Customer'); // ✅ Import Customer model
const bcrypt = require('bcrypt');

// Redirect root to login
router.get('/', (req, res) => {
  res.redirect('/login');
});

// GET Register page
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

// POST Register form with password hashing and DB storage
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return res.send('Password should be at least 8 characters long and include uppercase, lowercase, number, and special character.');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send('User already exists, please login.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    
    // Auto-login after registration
    req.session.user = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };

    res.redirect('/dashboard');  // Redirect to dashboard after auto-login

  } catch (error) {
    console.error(error);
    res.send('Error registering user');
  }
});
    

// GET Login page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// POST Login form with bcrypt compare
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.send('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send('Invalid credentials');
    }

    req.session.user = { name: user.name, email: user.email };
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.send('Error logging in');
  }
});

// ✅ GET Dashboard (with customers list)
router.get('/dashboard', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  try {
    const customers = await Customer.find();
    res.render('dashboard', { title: 'Dashboard', user: req.session.user, customers });
  } catch (err) {
    console.error(err);
    res.send('Error loading dashboard');
  }
});

// GET Logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send('Error logging out');
    }
    res.redirect('/login');
  });
});

module.exports = router;
