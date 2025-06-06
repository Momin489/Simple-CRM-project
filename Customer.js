const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  zipcode: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Inactive'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
