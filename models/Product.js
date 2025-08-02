const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    // ✅ removed: unique: true
  },
  image: String,
  title: String,
  description: String,
  price: String,
  quantity: Number,
  category: {
    type: String,
    enum: [
      'Fashion',
      'Home & Living',
      'Sports',
      'Books',
      'Beauty',
      'Toys',
      'Clothing',
      'Mobile Accessories',
      'Electronics',
      'Groceries',
    ],
  },
});

module.exports = mongoose.model('Product', productSchema);
