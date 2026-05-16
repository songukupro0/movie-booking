const Movie = require('../models/movie.model');
const Category = require('../models/category.model');
const Post = require('../models/post.model');
const Showtime = require('../models/showtime.model');
const Cinema = require('../models/cinema.model'); 
const Booking = require('../models/booking.model');

// ── Helper functions (dùng nội bộ, không export) ─────────────────────
async function _getBannerMovies() {
  return Movie.find({ status: 'now-showing', banner: { $exists: true, $ne: '' } })
              .sort({ vote: -1 })
              .limit(5)
              .select('title banner image genre description vote duration ageRating trailer');
}

async function _getNowShowing() {
  return Movie.find({ status: 'now-showing' }).limit(8);
}

async function _getComingSoon() {
  return Movie.find({ status: 'coming-soon' }).limit(8);
}

async function _getTopTrending() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const trendingData = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo },
        paymentStatus: 'success'
      }
    },
    {
      $group: {
        _id: "$movieId",
        ticketsSold: { $sum: { $size: { $ifNull: ["$seats", []] } } }
      }
    }
  ]);

  const nowShowingMovies = await Movie.find({ status: 'now-showing' });

  const ticketsMap = {};
  trendingData.forEach(item => {
    if (item._id) {
      ticketsMap[item._id.toString()] = item.ticketsSold;
    }
  });

  const moviesWithStats = nowShowingMovies.map(movie => ({
    ...movie.toObject(),
    ticketsSold: ticketsMap[movie._id.toString()] || 0
  }));

  moviesWithStats.sort((a, b) => {
    if (b.ticketsSold !== a.ticketsSold) return b.ticketsSold - a.ticketsSold;
    if (b.vote !== a.vote) return b.vote - a.vote;
    return b.voteCount - a.voteCount;
  });

  return moviesWithStats.slice(0, 5);
}

async function _getCategories() {
  return Category.find();
}

async function _getReviews() {
  return Post.find({ type: { $in: ['review', 'blog'] } })
             .sort({ createdAt: -1 })
             .limit(4);
}

async function _getPromotions() {
  return Post.find({ type: 'promotion' })
             .sort({ createdAt: -1 })
             .limit(4);
}

// ── GET /api/home — Trả về toàn bộ dữ liệu trang chủ trong 1 request ─
exports.getHome = async (req, res) => {
  try {
    const [
      banners,
      nowShowing,
      comingSoon,
      topTrending,
      categories,
      posts,
      promotions
    ] = await Promise.all([
      _getBannerMovies(),
      _getNowShowing(),
      _getComingSoon(),
      _getTopTrending(),
      _getCategories(),
      _getReviews(),
      _getPromotions()
    ]);

    return res.status(200).json({
      success: true,
      data: {
        banners,
        nowShowing,
        comingSoon,
        topTrending,
        categories,
        posts,
        promotions
      }
    });
  } catch (error) {
    console.error('getHome error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy dữ liệu trang chủ',
      error: error.message
    });
  }
};

// ── Quick Booking ──────────────────────────────────────────────────────

// 1. Lấy danh sách phim đang chiếu (cho dropdown Chọn Phim)
exports.getQuickMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ status: 'now-showing' })
                              .select('_id title image ageRating')
                              .sort({ title: 1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Lấy danh sách rạp đang chiếu bộ phim đã chọn
exports.getQuickCinemas = async (req, res) => {
  try {
    const { movieId } = req.params;
    const showtimes = await Showtime.find({ movieId })
                                    .distinct('cinemaId');
    const cinemas = await Cinema.find({ _id: { $in: showtimes } })
                                .select('_id name address city');
    res.json(cinemas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Lấy danh sách ngày chiếu (theo phim + rạp)
exports.getQuickDates = async (req, res) => {
  try {
    const { movieId, cinemaId } = req.params;
    const showtimes = await Showtime.find({ movieId, cinemaId })
                                    .select('startTime')
                                    .sort({ startTime: 1 });
    const datesSet = new Set(
      showtimes.map(s => new Date(s.startTime).toISOString().split('T')[0])
    );
    res.json([...datesSet]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. Lấy danh sách suất chiếu (theo phim + rạp + ngày)
exports.getQuickShowtimes = async (req, res) => {
  try {
    const { movieId, cinemaId, date } = req.params;
    const start = new Date(date);
    const end   = new Date(date);
    end.setDate(end.getDate() + 1);

    const showtimes = await Showtime.find({
      movieId, cinemaId,
      startTime: { $gte: start, $lt: end }
    }).select('_id startTime endTime basePrice').sort({ startTime: 1 });

    res.json(showtimes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Individual endpoints (giữ lại để backward compatibility) ──────────

// GET /api/home/banner
exports.getBannerMovies = async (req, res) => {
  try {
    res.json(await _getBannerMovies());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/home/now-showing
exports.getNowShowing = async (req, res) => {
  try {
    res.json(await _getNowShowing());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/home/coming-soon
exports.getComingSoon = async (req, res) => {
  try {
    res.json(await _getComingSoon());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/home/top-trending
exports.getTopTrending = async (req, res) => {
  try {
    res.json(await _getTopTrending());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/home/categories
exports.getCategories = async (req, res) => {
  try {
    res.json(await _getCategories());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/home/posts
exports.getReviews = async (req, res) => {
  try {
    res.json(await _getReviews());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/home/promotions
exports.getPromotions = async (req, res) => {
  try {
    res.json(await _getPromotions());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
