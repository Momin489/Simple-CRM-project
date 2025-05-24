const express = require('express');
const session = require('express-session');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/myapp')
  .then(() => console.log('✅ MongoDB connected locally'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
app.set('layout', 'layout');

// Body parser middleware
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
}));




// Routes
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);


const customerRoutes = require('./routes/customers');
app.use('/customers', customerRoutes);


const productRoutes = require('./routes/products');
app.use('/products', productRoutes);
app.listen(3000, () => console.log('Server started on port 3000'));
