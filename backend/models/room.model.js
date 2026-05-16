const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  code: { type: String, required: true }, // e.g., 'A1'
  type: { type: String, enum: ['standard', 'vip', 'sweetbox'], default: 'standard' },
  status: { type: String, enum: ['available', 'maintenance'], default: 'available' },
});

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cinemaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cinema', required: true },
  capacity: { type: Number, required: true },
  seatLayout: [seatSchema] // Array of specific seats to support detailed matrices
});

module.exports = mongoose.model('Room', roomSchema);
