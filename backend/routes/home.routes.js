const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home.controller');

// ── Quick Booking cascade routes ──────────────────────────────────
router.get('/quick/movies', homeController.getQuickMovies);
router.get('/quick/cinemas/:movieId', homeController.getQuickCinemas);
router.get('/quick/dates/:movieId/:cinemaId', homeController.getQuickDates);
router.get('/quick/showtimes/:movieId/:cinemaId/:date', homeController.getQuickShowtimes);

router.get('/', homeController.getHome);

// GET /api/home/banner (phim nổi bật cho slider trang chủ)
router.get('/banner', homeController.getBannerMovies);

// GET /api/home/now-showing
router.get('/now-showing', homeController.getNowShowing);

// GET /api/home/coming-soon
router.get('/coming-soon', homeController.getComingSoon);

// GET /api/home/top-trending
router.get('/top-trending', homeController.getTopTrending);

// GET /api/home/categories
router.get('/categories', homeController.getCategories);

// GET /api/home/posts (alias cho Góc Điện Ảnh)
router.get('/posts', homeController.getReviews);

// GET /api/home/promotions
router.get('/promotions', homeController.getPromotions);

module.exports = router;
