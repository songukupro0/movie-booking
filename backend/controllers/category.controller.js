const Category = require('../models/category.model');

// Lấy tất cả thể loại (có hỗ trợ tìm kiếm theo tên)
exports.getCategories = async (req, res) => {
  try {
    let query = Category.find();
    
    // Nếu có tham số name (ví dụ: ?name=Action)
    if (req.query.name) {
      // Tìm kiếm không phân biệt hoa thường chứa từ khóa
      query = query.find({ name: { $regex: req.query.name, $options: 'i' } });
    }

    const categories = await query;
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy một thể loại theo ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category == null) {
      return res.status(404).json({ message: 'Cannot find category' });
    }
    res.json(category);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};