const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  cinemaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cinema', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  
  basePrice: { type: Number, required: true },
  vipPriceMultiplier: { type: Number, default: 1.2 },
  sweetboxPriceMultiplier: { type: Number, default: 2.0 },
  
  bookedSeats: [{ type: String }],  
  
  lockedSeats: [{
    seatCode: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lockedUntil: { type: Date, required: true }  
  }],

  format: { type: String, enum: ['2D', '3D', 'IMAX', '4DX'], default: '2D' },
  language: { type: String, enum: ['Lồng tiếng', 'Phụ đề', 'Gốc'], default: 'Phụ đề' },
  status: { type: String, enum: ['scheduled', 'ongoing', 'finished', 'cancelled'], default: 'scheduled' },
});

module.exports = mongoose.model('Showtime', showtimeSchema);
