const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');

// GET /api/movies
router.get('/', movieController.getMovieList);

// GET /api/movies/now-showing
router.get('/now-showing', movieController.getNowShowing);

// GET /api/movies/coming-soon
router.get('/coming-soon', movieController.getComingSoon);

// GET /api/movies/category/:slug
router.get('/category/:slug', movieController.getMoviesByCategorySlug);

// GET /api/movies/search/:keyword
router.get('/search/:keyword', movieController.searchMovies);

// GET /api/movies/:slug
router.get('/:slug', movieController.getMovieDetail);

module.exports = router;
