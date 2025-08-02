const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');

// CREATE
exports.createProduct = async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    const newProduct = new Product({
      ...req.body,
      image: imagePath,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ALL
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = { ...req.body };

    // Don't allow `id` field to be updated (avoid duplicate key issue)
    if (updateData.id) {
      delete updateData.id;
    }

    // Handle image update (optional)
    if (req.file) {
      const imagePath = `/uploads/${req.file.filename}`;
      updateData.image = imagePath;

      // Delete old image file if exists
      const oldProduct = await Product.findById(productId);
      if (oldProduct && oldProduct.image) {
        const oldImagePath = path.join(__dirname, '..', oldProduct.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('❌ Update Error:', error);
    res.status(500).json({
      message: 'Failed to update product',
      error: error?.message || 'Unknown error',
    });
  }
};

// DELETE (with image file deletion)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // delete image from /uploads folder
    const imagePath = path.join(__dirname, '..', product.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
