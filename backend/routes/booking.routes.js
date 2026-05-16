const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/seed', bookingController.seedBookingData);
router.get('/showtimes/:showtimeId/seats', bookingController.getSeatMap);
router.post('/', verifyToken, bookingController.createBooking);
router.get('/:bookingId', verifyToken, bookingController.getBookingById);
router.post('/:bookingId/pay', verifyToken, bookingController.payBooking);

module.exports = router;
