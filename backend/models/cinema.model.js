const mongoose = require('mongoose');

const cinemaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  image: { type: String },
  hotline: { type: String },
  coordinates: {
    lat: Number,
    lng: Number
  },
  amenities: [String],   // ['3D', 'IMAX', 'Dolby', 'Parking']
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Cinema', cinemaSchema);
