const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

// GET /api/categories
router.get('/', categoryController.getCategories);

// GET /api/categories/:id
router.get('/:id', categoryController.getCategoryById);


module.exports = router;
