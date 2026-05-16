const Movie = require('../models/movie.model');
const Category = require('../models/category.model');
const mongoose = require('mongoose');

// Dành cho trang Movie List (Tất cả phim / lọc)
exports.getMovieList = async (req, res) => {
  try {
    const movies = await Movie.find().populate('genre');
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Dành cho trang Now Showing (có phân trang)
exports.getNowShowing = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 8);
    const skip  = (page - 1) * limit;

    const [movies, total] = await Promise.all([
      Movie.find({ status: 'now-showing' }).populate('genre').skip(skip).limit(limit),
      Movie.countDocuments({ status: 'now-showing' }),
    ]);

    res.json({ movies, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Dành cho trang Coming Soon (có phân trang)
exports.getComingSoon = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 8);
    const skip  = (page - 1) * limit;

    const [movies, total] = await Promise.all([
      Movie.find({ status: 'coming-soon' }).populate('genre').skip(skip).limit(limit),
      Movie.countDocuments({ status: 'coming-soon' }),
    ]);

    res.json({ movies, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Dành cho trang Movie List theo thể loại (Category Movie List)
exports.getMoviesByCategorySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy thể loại phim này' });
    }
    const movies = await Movie.find({ genre: category._id }).populate('genre');
    res.json({ category, movies });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchMovies = async (req, res) => {
  try {
    // Hỗ trợ cả path param (/search/:keyword) và query param (?q=keyword)
    const raw = (req.params.keyword ?? req.query.q ?? '').trim();

    if (!raw) {
      return res.json([]);
    }

    // Escape ký tự đặc biệt trong regex để tránh lỗi injection
    const escaped = raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const movies = await Movie.find({
      $or: [
        { title:    { $regex: escaped, $options: 'i' } },
        { director: { $regex: escaped, $options: 'i' } },
        { cast:     { $regex: escaped, $options: 'i' } },
      ],
    })
      .populate('genre')
      .limit(30); // Giới hạn kết quả trả về

    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Dành cho trang Chi tiết Phim (Movie Detail)
exports.getMovieDetail = async (req, res) => {
  try {
    const { slug } = req.params;
    let movie;
    
    // Nếu là ObjectId hợp lệ, thử tìm theo ID trước
    if (mongoose.Types.ObjectId.isValid(slug)) {
      movie = await Movie.findById(slug).populate('genre');
    }
    
    // Nếu chưa tìm thấy (hoặc không phải ID), tìm theo slug
    if (!movie) {
      movie = await Movie.findOne({ slug: slug }).populate('genre');
    }

    if (!movie) return res.status(404).json({ message: 'Không tìm thấy phim' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// home.controller.js (Tối ưu)
exports.getMovieShowtimesByDate = async (req, res) => {
  try {
    const { movieId, date } = req.query; // Ví dụ: ?movieId=...&date=2026-03-28
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    // Lấy tất cả suất chiếu của phim đó trong ngày, sau đó nhóm theo rạp
    const showtimes = await Showtime.find({
      movieId: movieId,
      startTime: { $gte: start, $lt: end }
    }).populate('cinemaId', 'name address');

    // Logic nhóm dữ liệu theo rạp ở backend để frontend chỉ cần hiển thị
    const result = showtimes.reduce((acc, st) => {
      const cinema = st.cinemaId;
      if (!acc[cinema._id]) {
        acc[cinema._id] = { name: cinema.name, address: cinema.address, times: [] };
      }
      acc[cinema._id].times.push({ id: st._id, time: st.startTime });
      return acc;
    }, {});

    res.json(Object.values(result));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

