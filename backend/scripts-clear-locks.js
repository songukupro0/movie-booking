const mongoose = require('mongoose');
const Showtime = require('./models/showtime.model');

mongoose.connect('mongodb://localhost:27017/movie-booking')
  .then(async () => {
    await Showtime.updateMany({}, { $set: { lockedSeats: [] } });
    console.log('cleared_locked_seats');
    await mongoose.disconnect();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
